---
name: job-search-scrape
description: >
  Finds new job postings matching the candidate profile via installed portal-search CLIs in
  .agents/skills/ plus web search fallback. Deduplicates against seen jobs and the tracker.
  Triggers on: /scrape, job scrape, find jobs, search jobs, new jobs, job search, scrape jobs,
  find me a job, any new postings.
---
# Scrape — Job Scraper (thin pointer)

Read and follow `/workspace/ai-job-search/.claude/commands/scrape.md`; if absent, the workflow
spec lives in `/workspace/ai-job-search/.claude/skills/job-scraper/SKILL.md`. Tool mapping per
`/workspace/ai-job-search/RIKKAHUB.md`. Portal CLIs run with Bun via workspace_shell
(`bun run .agents/skills/<portal>/cli/src/cli.ts ...`); WebSearch fallback = DuckDuckGo HTML
fetch. Repo root: `/workspace/ai-job-search`. `$ARGUMENTS` = the user's message.
