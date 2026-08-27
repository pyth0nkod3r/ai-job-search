---
framework_version: 1.0.0
---

# Agent Guidelines: AI Job Search

This workspace is structured to manage job search activities, scraper tools, CVs, cover letters, and interview preparation.

## Thin-Pointer Design (Single Source of Truth)

To prevent duplication and configuration drift across different AI agent frameworks (Claude Code, Google Antigravity, Codex, Cursor, Gemini CLI, etc.), this workspace uses a unified thin-pointer design. All agent runtimes should load the canonical specifications and candidate profiles from the files and directories below:

1. **Personal Candidate Profile:**
   - The candidate profile, contact details, education, and target preferences are defined in [CLAUDE.md](CLAUDE.md) and the individual profile methodology files under [.claude/skills/job-application-assistant/](.claude/skills/job-application-assistant/) (specifically `01-*.md` etc.).
2. **Canonical Workflow Specifications:**
   - The step-by-step instructions and triggers for tasks (setup, scrape, rank, apply, upskill, interview) are defined in the [.claude/](.claude/) directory (specifically under `.claude/skills/` and `.claude/commands/`).
   - Do not duplicate these rules or specifications. Treat `.claude/` files as the single source of truth.
3. **Portal Search Skills:**
   - Job-portal search CLIs live under [.agents/skills/](.agents/skills/) in the portable Agent Skills format (with a `SKILL.md` per portal). Codex and Antigravity discover these automatically; the `/scrape` workflow in [.claude/skills/job-scraper/](.claude/skills/job-scraper/) orchestrates them.
4. **OpenAI-Endpoint Agent Port (RikkaHub Agent):**
   - [RIKKAHUB.md](RIKKAHUB.md) is the environment canon for OpenAI-style function-calling agent harnesses: the tool-name glossary, sub-agent mapping, web-research escalation, Bun/LaTeX runtime notes, and scheduling guidance.
   - [rikkahub-skills/](rikkahub-skills/) contains one thin-pointer skill per command (setup, scrape, rank, apply, upskill, interview, outcome, html-report, expand, gmail-sync, notion-sync, add-portal, add-template, set-market, reset). Each is installed into the agent's skill registry and points back at the canonical `.claude/commands/` spec — no workflow logic is duplicated.
   - [RIKKAHUB-GUIDE.md](RIKKAHUB-GUIDE.md) is the end-user guide for running the workspace from RikkaHub Agent (setup, daily flow, scheduling, privacy).
5. **Market Layer (multi-country targeting):**
   - [markets/](markets/) holds one registry file per target market (`<code>.md`) distilled from the community regional forks: portal inventory with source forks, CV conventions, locale defaults. The active market is recorded in `markets/CURRENT.json`.
   - [`/set-market`](.claude/commands/set-market.md) switches the active market: flips portal `enabled:` flags, updates profile locale/CV language, and installs missing portal skills from their source forks (code review + explicit user approval per portal). Core `.claude/` workflow specs are never edited — the layer rides entirely on the `enabled:` toggle that `/scrape` already honors.
