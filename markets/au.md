# Market: Australia (AU)

- **Languages:** English
- **Default CV language:** English
- **Portals:**
| Portal | Skill folder | Source | Notes |
|---|---|---|---|
| Adzuna | .agents/skills/adzuna-search | frJEN/ai-job-search-au-starter | official API, free personal key via env vars |
| Seek / Indeed / Jora, LinkedIn | — | — | no CLI; ingest via read-only Gmail alert emails per the fork's docs |

- **CV conventions:** 2-3 pages acceptable; cover letters genuinely expected; no photo;
  right-to-work status stated plainly.
- **Notes:** the source fork's /platform-sync (browser automation on logged-in profiles)
  is browser automation upstream deliberately does not ship — do not port it; the
  /outlook-sync there relies on an unvetted third-party MCP server — skip.
