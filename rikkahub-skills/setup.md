---
name: job-search-setup
description: >
  Profile onboarding for the AI Job Search workspace: collects the candidate's professional
  information and populates CLAUDE.md and .claude/skills/job-application-assistant/01-candidate-profile.md.
  Triggers on: /setup, job search setup, set up my profile, onboarding, build my candidate profile,
  update my profile section.
---
# Setup — Profile Onboarding (thin pointer)

Read and follow `/workspace/ai-job-search/.claude/commands/setup.md` exactly. Tool names map
per `/workspace/ai-job-search/RIKKAHUB.md` (Read→workspace_read_file, Glob→find via
workspace_shell, AskUserQuestion→ask_user). Repo root: `/workspace/ai-job-search`.
`$ARGUMENTS` = the user's message that triggered this skill.
