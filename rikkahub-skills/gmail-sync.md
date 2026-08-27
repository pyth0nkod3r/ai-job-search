---
name: job-search-gmail-sync
description: >
  Syncs application status from Gmail (rejection/interview/offer emails) into the tracker.
  Requires IMAP access or forwarded emails. Triggers on: /gmail-sync, sync my email, check
  for rejection emails, application status from gmail.
---
# Gmail Sync — Application Status (thin pointer)

Read and follow `/workspace/ai-job-search/.claude/commands/gmail-sync.md`. Email access maps
to SSH/IMAP via workspace_shell or manual forwarding — no direct Gmail tool exists; ask the
user how their mail is reachable before assuming. Tool mapping per
`/workspace/ai-job-search/RIKKAHUB.md`. Repo root: `/workspace/ai-job-search`.
`$ARGUMENTS` = the user's message.
