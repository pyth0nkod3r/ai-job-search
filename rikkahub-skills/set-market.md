---
name: job-search-set-market
description: >
  Switches the workspace's target job-search country/market: enables the right portal
  skills, updates profile locale and CV language, and installs market portals from their
  source forks (with review + approval). Triggers on: /set-market, change country, switch
  market, search jobs in <country>, target the <country> job market, which markets are
  available.
---
# Set Market — Country Switch (thin pointer)

Read and follow `/workspace/ai-job-search/.claude/commands/set-market.md` exactly, in
order. Market definitions live in `/workspace/ai-job-search/markets/<code>.md` (index:
`markets/README.md`). Repo root: `/workspace/ai-job-search`. Tool mapping per
`/workspace/ai-job-search/RIKKAHUB.md`.

Key mappings for this harness:
- Fetching a portal skill from a source fork = `web_fetch` the raw files, review them,
  then write them under `.agents/skills/` with `workspace_write_file`. Show the review
  summary and get explicit approval per portal before writing.
- Flag flips and profile edits = `workspace_edit_file`.
- Confirmations = `ask_user`.

`$ARGUMENTS` = the user's message (market code or name; empty = list markets).
