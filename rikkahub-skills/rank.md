---
name: job-search-rank
description: >
  Batch-scores scraped jobs against the fit framework into a ranked shortlist. Triage scores
  only — no company research. Triggers on: /rank, rank jobs, score jobs, rank the postings,
  shortlist jobs, which jobs are best.
---
# Rank — Triage Shortlist (thin pointer)

Read and follow `/workspace/ai-job-search/.claude/commands/rank.md` exactly. Parallel scoring
agents → subagent_dispatch (pass rubric + job list inline, ~5 jobs per agent, stagger to the
concurrency cap; use run_in_background + subagent_get for >2). Tool mapping per
`/workspace/ai-job-search/RIKKAHUB.md`. Repo root: `/workspace/ai-job-search`.
`$ARGUMENTS` = the user's message (focus area, --all, --top N).
