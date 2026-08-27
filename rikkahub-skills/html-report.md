---
name: job-search-html-report
description: >
  Generates an HTML dashboard of the application tracker (statuses, funnel, activity) and
  opens it for the user. Triggers on: /html-report, application dashboard, tracker report,
  show my job search stats, how is my job search going.
---
# HTML Report — Tracker Dashboard (thin pointer)

Read and follow `/workspace/ai-job-search/.claude/commands/html-report.md`. Generate the HTML
into the repo, then surface it to the user (serve via workspace_run_background
`python3 -m http.server` or open_file). Tool mapping per
`/workspace/ai-job-search/RIKKAHUB.md`. Repo root: `/workspace/ai-job-search`.
`$ARGUMENTS` = the user's message.
