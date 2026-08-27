# Market: Denmark (DK) — shipped default

- **Languages:** Danish, English (widely accepted)
- **Default CV language:** Danish for local employers; English accepted in international/IT
- **Portals:**
| Portal | Skill folder | Source | Notes |
|---|---|---|---|
| Jobindex | .agents/skills/jobindex-search | this repo | ships enabled:false; enable at activation |
| Jobnet | .agents/skills/jobnet-search | this repo | public state board; same toggle |
| Akademikernes Jobbank | .agents/skills/jobbank-search | this repo | same toggle |
| JobDanmark | .agents/skills/jobdanmark-search | this repo | same toggle |
| LinkedIn / freehire | built-in | this repo | country-agnostic |

- **CV conventions:** 1-2 pages, no photo, no age/marital status; modest tone in cover
  letters (Janteloven-flavoured understatement reads well); salary expectations sometimes
  requested — use salary_lookup.py baseline if configured.
- **Notes:** Danish demo boards are the template's reference implementation; all four ship
  `enabled: false` and /set-market flips them on.
