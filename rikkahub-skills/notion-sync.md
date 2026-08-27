---
name: job-search-notion-sync
description: >
  Pushes ranked jobs and applications to a Notion database via the Notion API. Requires a
  Notion integration token. Triggers on: /notion-sync, sync to notion, push jobs to notion.
---
# Notion Sync (thin pointer)

Read and follow `/workspace/ai-job-search/.claude/commands/notion-sync.md`. API calls run via
workspace_shell curl with a user-supplied token from environment/config — never hardcode it.
Tool mapping per `/workspace/ai-job-search/RIKKAHUB.md`. Repo root: `/workspace/ai-job-search`.
`$ARGUMENTS` = the user's message.
