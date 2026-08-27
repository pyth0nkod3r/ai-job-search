# RIKKAHUB.md — OpenAI-Endpoint Agent Port

This workspace is adapted to run under an **OpenAI-endpoint agent harness** (function-calling
loop, e.g. RikkaHub Agent on Android) instead of Claude Code. The canonical workflow
specifications in `.claude/commands/` and `.claude/skills/` remain the **single source of
truth** for *what* each workflow does — this file defines *how an OpenAI-style agent*
executes them. Do not duplicate workflow logic here.

**Repository root:** `/workspace/ai-job-search` — resolve every relative path in the
canonical specs against this directory. Run all shell commands with this as the working
directory.

---

## Tool Glossary (OpenAI function-calling equivalents)

The canonical specs name Claude Code tools. Substitute as follows:

| Claude Code name | OpenAI-agent equivalent | Notes |
|---|---|---|
| `Read` | `workspace_read_file` | Paths under the repo root. 1 MB cap per read. |
| `Write` / `Edit` | `workspace_write_file` / `workspace_edit_file` | `edit` does exact old→new replacement; safer than rewriting whole files. |
| `Glob` | `workspace_shell` → `find`/`ls` | e.g. `find documents -type f \| wc -l` |
| `Grep` | `workspace_shell` → `grep -rn` | Use `-l` for file lists. |
| `Bash` | `workspace_shell` | All shell work happens here. Timeout up to 600 s. |
| `Bash` (long-running) | `workspace_run_background` + `workspace_background_status` | Dev servers, big TeX compiles, batch scrapes. Returns a task id. |
| `WebFetch` | `web_fetch` (raw) / `web_extract` (article mode) | 30 s cap, private IPs refused. Pagination via `next_start_index`. |
| `WebFetch` (403 / JS wall) | browser tools: `browser_open` → `browser_get_text` | Real browser clicks through cookie banners; use before declaring a posting dead. |
| `WebSearch` | `web_fetch` on a search endpoint, or browser DuckDuckGo | No API key needed. See "Web research" below. |
| `Agent` (subagent dispatch) | `subagent_dispatch` | Used by `/rank` (batch scoring) and `/apply` (reviewer). See below. |
| `AskUserQuestion` | `ask_user` | Supports single/multi choice or free text. |
| `TodoWrite` | none | Track steps in conversation; do not fabricate a todo tool. |

Skills live in the app's skill registry and are loaded with `use_skill`. Trigger phrases
in each skill's frontmatter `description` are what routes a plain-language request to it.

---

## Operating posture: default autonomy

This workspace runs in **default-autonomy mode** — the agent does the whole pipeline
end-to-end without asking at each step. Human touchpoints are limited to the boundaries
where mistakes are costly, irreversible, or visible to third parties:

| Step | Who does it | Why |
|---|---|---|
| Choose market, set up profile, run first scrape, set schedule | Human (one-time) | High-stakes irreversible choices (locale, identity, public forks) |
| Daily scrape, rank, shortlist | Agent | Reading public data, dedup against history |
| Apply: evaluate fit, draft CV, write cover letter, review, compile PDF, archive posting | Agent | Drafts the agent knows are recoverable until you ship them |
| **Apply: actually submit / send** | **Human** | The one truly irreversible touch — submits to a third party, can't unsend an email |
| Update profile with confirmed facts ("I shipped X at Y", "I have a certification in Z") | Human, then agent writes it back | The Standing Rule in `apply.md` is non-negotiable: facts must reach the profile files, not just live in chat |
| Outcome records, interview prep, dashboard generation | Agent | Refers only to the tracker and your docs |

The agent still pauses and asks `ask_user` for the **first** call in each irreversible
category above (submit, profile writes) so the standing rule is visible. After that,
matching patterns run without re-asking.

For autonomy beyond a single turn (e.g. "scrape every weekday at 9am, rank what
arrives, archive what I ignore"), the agent uses `schedule_job` so the loop runs
unattended and reports back when the user is back in the app.

**What autonomy does NOT do:**

- It does not submit applications, send emails, or contact anyone on the user's behalf.
- It does not edit the candidate profile silently — confirmed facts are written back
  to disk by name (`CLAUDE.md`, `01-candidate-profile.md`), never to chat only.
- It does not push commits to a public remote with profile data. Privacy guardrails
  in `/setup` are still enforced.
- It does not pay for metered third-party services (Firecrawl, Adzuna) without an
  explicit user-supplied key in env.

---

## Tool enablement checklist

Before running any workflow, confirm these capabilities are on in the harness (RikkaHub
Agent: Settings → the assistant's tool menu). Any missing capability degrades gracefully —
say so, don't fake it:

- **Workspace / shell + file tools** — required by everything (`workspace_shell`,
  `workspace_read_file`, `workspace_write_file`, `workspace_edit_file`).
- **Web fetch & extract** (`web_fetch`, `web_extract`) — required by scrape/apply/upskill.
- **In-app browser** — needed only when a posting 403s or is JS-rendered.
- **Sub-agents** (`subagent_dispatch`) — required by `/rank` batch scoring and `/apply`'s
  reviewer pass. If disabled, fall back to doing those passes inline in the main context.
- **Schedule jobs** (`schedule_job`) — required for any autonomy beyond a single turn
  (recurring scrape, daily digest, etc.). Falls back to "run on demand" if disabled.
- **Ask user** (`ask_user`) — used at irreversible boundaries, not at every step.

Pre-approve read-only and recoverable shell verbs so autonomy is unblocked:
- read: `bun run`, `python3 salary_lookup.py`, `pdftotext`, `pdfinfo`, `pdflatex`,
  `lualatex`, `xelatex`, `git status`/`diff`/`log`, `bun install`, `find`, `grep`
- recoverable writes: `git add`/`commit` to a local branch, file writes under
  `cv/`, `cover_letters/`, `documents/`, `job_scraper/`, `job_search_tracker.csv`
- destructive (always confirm): `git push --force`, `rm -rf`, mass overwrite of
  profile files, anything that touches a public remote

## Sub-agents

`/rank` Step 2 and `/apply`'s reviewer step dispatch parallel agents. Map to
`subagent_dispatch`:

- Pass everything inline in the `task` (job list, rubric, draft text) — sub-agents cannot
  see this conversation, but they **can** read the repo via their own tools when needed.
- Cap ~5 jobs per agent for `/rank`; use `run_in_background: true` for >2 agents and poll
  with `subagent_get`.
- Concurrency cap is 3 by default — stagger dispatches rather than firing 6 at once.
- Reviewer/rank-scorer agents are critique-only: instruct them not to write files.

## Web research

Canonical escalation order (`09-web-research.md`) maps to:

1. `web_extract` (article mode) — cheapest, works for most postings.
2. `web_fetch` with browser-like headers (`User-Agent: Mozilla/5.0 ...`).
3. `browser_open` + `browser_get_text` — for 403s, cookie walls, JS-rendered ATS pages.
4. Web search for the employer's own careers page — fetch DuckDuckGo results via
   `web_fetch` (`https://html.duckduckgo.com/html/?q=<query>`) and read `result__a` links.
5. Only then conclude the posting is unavailable.

A 403 is **not** a dead end. Never draft from a title alone.

## Portal search CLIs (`.agents/skills/*-search`)

These are Bun/TypeScript CLIs. First-time setup:

```sh
cd /workspace/ai-job-search/.agents/skills/<portal>-search/cli && bun install
```

Run pattern (per each portal's SKILL.md): `bun run .agents/skills/<portal>/cli/src/cli.ts <subcommand>`.
If `bun` is missing, install with `curl -fsSL https://bun.sh/install | bash` then add
`~/.bun/bin` to PATH. `WebSearch` fallback inside `/scrape` maps to the DuckDuckGo fetch
pattern above.

## PDF compilation (`/apply` Step 5)

LaTeX toolchain (texlive + moderncv + lmodern) is installed in this workspace. The stock
template spec uses **`lualatex` for the CV** and **`xelatex` for the cover letter** — match
the compile command to the template (a custom template registered via `/add-template`
declares its own compile command; that overrides the stock default):

```sh
cd cv && lualatex -interaction=nonstopmode main_<company>_<role>.tex
cd cover_letters && xelatex -interaction=nonstopmode cover_<company>_<role>.tex
```

Then verify with `tools/verify_pdf.py` (uses pypdf, falls back to Poppler's `pdfinfo`/
`pdftoppm` for page images). Inspect page count and visual output before reporting done —
Step 5 is non-skippable.

## Scheduling & autonomy

The workspace runs in **default-autonomy mode** (see `RIKKAHUB.md`). The agent handles
the full pipeline: scrape, dedup, rank, draft, review, compile, archive. The only
human touchpoints are irreversible ones — submitting, profile writes the user hasn't
asked for, public pushes. Recurring work is handled by `schedule_job` so the loop runs
unattended and reports back when the user is back in the app.

For autonomy beyond a single turn (e.g. *"scrape every weekday at 9am, rank what
arrives, archive what I ignore"*), the agent creates a `schedule_job` whose prompt
loads the `scrape`/`rank` skills and runs the canonical workflows from
`/workspace/ai-job-search`. Reporting modes:

- `mode: llm` (default for reasoning) — the agent runs the workflow and summarizes
  the result. Token cost per fire.
- `mode: direct` (for fixed work) — pre-baked action sequence, no model. Use for
  "every 6 hours, dump the tracker status" or "every hour, run the health check".

Nothing is ever auto-submitted. The last touch (submitting an application, sending an
email) is always human.

## Privacy

`/setup` writes real personal data into tracked files (`CLAUDE.md`,
`01-candidate-profile.md`). Keep profile commits **local** or push only to a **private**
remote. Never push profile data to a public fork.
