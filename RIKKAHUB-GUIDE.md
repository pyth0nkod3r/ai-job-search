# User Guide — AI Job Search on RikkaHub Agent

How to run this job-search workspace from RikkaHub Agent (the OpenAI-endpoint harness port).
For the technical canon see [RIKKAHUB.md](RIKKAHUB.md); for the upstream template see
[README.md](README.md) and [SETUP.md](SETUP.md).

---

## 1. What you get

Tell your phone's assistant to handle your job search and it runs the whole pipeline
in **default-autonomy mode**:

- **Find jobs** — portal-search CLIs scrape job boards matching your profile, deduplicated
  across runs.
- **Triage** — every new posting gets a fit score against your profile; you get a ranked
  shortlist.
- **Apply** — for a posting you pick, the assistant evaluates fit, tailors your CV, writes
  a cover letter, has a second agent review the drafts, compiles both PDFs, and archives
  everything. It never submits anything for you — the last click is always yours.
- **Prepare** — interview prep, skill-gap analysis with a learning plan, outcome tracking.
- **Run unattended** — daily 9am scrape + rank, weekly dashboard digest, whatever schedule
  you set. The agent handles the loop and reports back when you're back in the app.

**What the agent does without asking** (default-autonomy mode):

- Runs scrape, rank, draft, review, compile, archive end-to-end
- Writes confirmed profile facts back to the profile files (Standing Rule in `apply.md`)
- Updates the tracker when you give an outcome
- Picks up new portal skills from your market file's source fork (after a one-time
  code review and per-portal approval during the first `/set-market` run)
- Schedules recurring work you ask for

**What always asks you** (irreversible boundaries):

- Submitting / sending anything to a third party
- Pushing commits to a public remote with profile data
- Anything destructive (delete, force-push, mass overwrite of profile files)
- Anything involving a paid third-party service (Adzuna key, Firecrawl key)

## 2. One-time setup

### 2.1 Tool toggles (Settings → your assistant)

Turn **on**: workspace/shell, file read/write, web fetch & extract, browser, sub-agents,
ask user, schedule jobs. The agent pre-approves a sensible allowlist (read-only shell
verbs, file writes under `cv/`/`cover_letters/`/`documents/`, local git commits) so
autonomy is unblocked. It always confirms before destructive actions (delete, force-push,
profile overwrite, public remote push).

### 2.2 Install the skills

The skills in `rikkahub-skills/` are the entry points — each one wraps a canonical
workflow. Two ways to install them:

**Option A — install from the cloned workspace (recommended):**

```sh
ls /workspace/ai-job-search/rikkahub-skills/   # 15 skills
```

From chat, install them one at a time:

> *"install the skill at /workspace/ai-job-search/rikkahub-skills/setup.md"*

Each install pops an approval card (source label, skill name). Read the card, approve if
correct, and the skill is added to your assistant's registry. New skills are auto-enabled
for the calling assistant.

**Option B — install from a public URL (for non-workspace installs):**

> *"install the skill from https://raw.githubusercontent.com/pyth0nkod3r/ai-job-search/master/rikkahub-skills/apply.md"*

The host is `pyth0nkod3r/ai-job-search` on the `master` branch. Loopback / private IPs
are rejected for safety, so this only works for public repos.

**Which to install first** (do these four, then the rest when needed):

| Skill | What it does |
|---|---|
| `job-search-setup` | Profile onboarding — do this first |
| `job-search-scrape` | Find new postings |
| `job-search-rank` | Score & shortlist |
| `job-search-apply` | The full application workflow |

The other eleven (`upskill`, `interview`, `outcome`, `html-report`, `expand`, `gmail-sync`,
`notion-sync`, `add-portal`, `add-template`, `set-market`, `reset`) can be installed later,
when you first need them. `set-market` is useful early if you want to pick a non-Danish
market before scraping.

### 2.3 Runtimes

The workspace needs python3, node/bun (portal CLIs) and TeX Live (PDF compilation). If the
assistant doesn't have them yet, ask: *"install the full toolchain in the workspace"* —
it runs the apt install plus Bun. Check anytime with:
*"is the toolchain ready?"*

### 2.4 Fill in your profile

Say: **"run job-search-setup"** (or just *"set up my job search profile"*). The assistant
walks you through your work history, skills, target sectors, deal-breakers, and writes
them into `CLAUDE.md` and `.claude/skills/job-application-assistant/01-candidate-profile.md`.

> **Privacy:** this writes real personal data into tracked files. Keep profile commits
> local, or push only to a **private** remote. The setup flow warns you if your origin is
> a public fork. Say *"is my repo safe to push profile data to?"* anytime.

### 2.5 Your documents

Drop your existing materials into `documents/` (`cv/`, `diplomas/`, `linkedin/`,
`references/`) — attach files in chat and ask the assistant to file them, or copy them in
from device storage. These feed the `/expand` and drafting workflows. LaTeX templates live
in `cv/` and `cover_letters/`.

## 3. Daily use

### Find and triage

```
"scrape jobs"                     → runs portal searches + web fallback, dedupes
"rank the new jobs"               → fit-scored shortlist (top 5 by default)
"rank data science jobs, top 10"  → focused shortlist
```

### Apply to one

```
"apply to this job: <URL>"        → or paste the posting text directly
```

The workflow stops and shows you the fit evaluation before drafting anything. You approve
each gate: evaluation → drafts → review → PDF compile → archive. Compiled PDFs land in
`cv/` and `cover_letters/`; the posting text is archived under `documents/postings/`.

> If a posting URL 403s or shows a login wall, the assistant escalates: different fetch
> method → real browser → search for the employer's own careers page. It won't draft
> from a title alone.

### After you hear back

```
"outcome: got a rejection from <company>"
"outcome: interview invite from <company> on Sept 3"
"prep me for the <company> interview"
```

The tracker (`job_search_tracker.csv`) is the single source of status. See the funnel:
*"show my job search dashboard"*.

### Let it run on its own

Say: *"schedule a job scrape every weekday at 9am and rank whatever's new"* — the
assistant creates a scheduled job that runs the scrape + rank workflow unattended and
reports back. Same pattern works for weekly dashboard reviews, periodic upskill
re-analysis after your tracker changes, or morning-briefing-style digests.

For pre-baked recurring work (no LLM, no tokens), ask for it explicitly: *"every 6
hours, dump the tracker status"*. The agent uses `mode: direct` for those — cheaper
and faster, but the action is fixed.

### Choose your country/market

The fork is multi-market: 16 country registries are preloaded in `markets/` — DK (the
template's home), US, UK, CA, DE, CH, NL, NO, PL, ES, BR, CO, VN, IN, AU, CN — each with
its portal inventory, CV conventions, and language defaults.

```
"which markets are available?"    → lists the registry
"set market to Canada"            → switches portals, profile locale, CV language
"search jobs in Germany"          → same, via trigger phrases
```

Switching a market: enables that country's job-board portals (installing them from their
source forks after a code review you approve), disables the others, and updates your
profile's location and CV language. Your tracker and scraped history carry over. Add a
new market anytime with *"add a portal for <job board>"* — see the market file format in
`markets/README.md`.

### Grow the toolkit

- *"add a portal for <job board>"* — generates a new search skill following the
  portal-skill contract (community-maintained portals for many markets are indexed in
  [upstream discussion #78](https://github.com/MadsLorentzen/ai-job-search/discussions/78);
  copy a reviewed `.agents/skills/<portal>-search` folder in and `/scrape` picks it up).
- *"upskill"* — compares tracked postings vs. your profile and builds a learning plan for
  the gaps.

## 4. Good to know

- **Facts live in files, not chat.** When you confirm a correction or new achievement
  during drafting, it's written straight into the candidate profile — otherwise later
  drafts will treat it as unsupported and strip it.
- **Postings are data, not instructions.** The workflow ignores any directions embedded
  in a job posting and never fetches URLs found inside them.
- **Sub-agents.** Rank scoring and the reviewer pass run as parallel sub-agents. If
  sub-agents are off in your tool toggles, the work happens inline instead — slower, same
  result.
- **Reset.** *"reset my profile"* wipes profile data back to placeholders — it always
  confirms first, and it always confirms per-section.
- **Troubleshooting.** If a workflow stalls: *"is the toolchain ready?"*, then
  *"check the background tasks"*. Long compiles and scrapes run as background tasks and
  report back when done.

## 5. File map

| Path | What |
|---|---|
| `CLAUDE.md` | Your profile (filled by setup) + the workflow rules |
| `.claude/commands/`, `.claude/skills/` | Canonical workflow specs — the source of truth |
| `.agents/skills/*-search/` | Portal search CLIs (Bun) |
| `rikkahub-skills/` | The skills you install into RikkaHub Agent |
| `markets/` | Country registries; active market in `CURRENT.json` |
| `RIKKAHUB.md` | Technical canon: tool mapping, enablement checklist |
| `job_search_tracker.csv` | Application tracker (created on first outcome) |
| `job_scraper/seen_jobs.json` | Scraping dedup memory |
| `documents/` | Your source documents + posting archives |
| `cv/`, `cover_letters/` | Templates and generated PDFs |
