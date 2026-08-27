---
name: job-search-add-portal
description: >
  Generates a new portal-search skill (SKILL.md + Bun CLI) for a job board in the user's
  market, following the portal-skill contract so /scrape picks it up automatically.
  Triggers on: /add-portal, add a job board, add portal for <site>, new search skill.
---
# Add Portal — Portal Skill Generator (thin pointer)

Read and follow `/workspace/ai-job-search/.claude/commands/add-portal.md`. Generated CLIs are
Bun/TypeScript (install via curl -fsSL https://bun.sh/install | bash if missing). Honest
identifying User-Agent + robots.txt check required (tools/robots_check.py). Tool mapping per
`/workspace/ai-job-search/RIKKAHUB.md`. Repo root: `/workspace/ai-job-search`.
`$ARGUMENTS` = the user's message.
