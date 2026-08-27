---
name: job-search-outcome
description: >
  Records the result of an application (rejection, interview invite, offer, withdrawal) in
  job_search_tracker.csv and updates downstream stats. Triggers on: /outcome, I got rejected,
  I got an interview, I got an offer, record outcome, application result.
---
# Outcome — Record Application Result (thin pointer)

Read and follow `/workspace/ai-job-search/.claude/commands/outcome.md`. Tool mapping per
`/workspace/ai-job-search/RIKKAHUB.md`. Repo root: `/workspace/ai-job-search`.
`$ARGUMENTS` = the user's message.
