# Market: Ireland (IE)

- **Languages:** English, Irish (Gaeilge) — Irish is required only for public-sector roles
- **Default CV language:** English
- **Portals:**
| Portal | Skill folder | Source | Notes |
|---|---|---|---|
| jobs.ie | .agents/skills/jobs-ie-search | this repo | WebSearch-driven CLI (Option A); jobs.ie has no public API, robots.txt is partial-allow |
| LinkedIn / freehire | built-in | this repo | country-agnostic; LinkedIn surfaces many Irish roles |

- **Out of scope (no portal CLI; WebSearch fallback only):**
  - **irishjobs.ie** — robots.txt is 403 at the edge (Akamai WAF). Effectively
    unscrapable. The community registry has no Irish fork; if you want this
    board, author a WebSearch-fallback skill the same way as jobs-ie-search.
  - **jobsireland.ie** — robots.txt wide open, but the site is a low-volume
    public-employment service (Intuition / Yaplex). Useful as a low-priority
    search target, not worth a dedicated skill.

- **CV conventions:** 2 pages, no photo typically; education before experience
  for early careers; cover letters expected at most Irish employers; notice
  period (1-3 months) is a standard screening field.

- **Notes:** Ireland uses the **Critical Skills Employment Permit** for roles
  on the Critical Skills Occupation List — useful when the candidate is
  non-EU/EEA and the role qualifies. EU/EEA citizens do not need a permit.
  Salary threshold (recent): €38,000+ for Critical Skills, €30,000+ for
  General Employment Permit (verify current thresholds at
  enterprise.gov.ie). The drafter's Sponsorship Gate can lean on this
  naturally when a posting is IE-based.
