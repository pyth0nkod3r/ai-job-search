# Markets — Country/Region Registry

One file per target market. `/set-market <code>` (canonical spec:
`.claude/commands/set-market.md`) reads the market file and reconfigures the workspace:
portal `enabled:` flags, profile locale, CV language, and — with your approval — installs
portal skills from their source forks after a code review.

**Format of a market file** (`<code>.md`):

- **Identity block**: country, languages, default CV language
- **Portal skills table**: portal → skill folder → source fork → notes (ToS/robots, key
  requirements). Skill folders follow the portal-skill contract; `/scrape` auto-discovers
  them and honors each `enabled:` toggle.
- **CV conventions**: what drafting (`/apply`) should follow in this market.
- **Notes**: anything market-specific (sponsorship registers, screening questions,
  salary data conventions).

**Adding a market**: copy this format, research the boards (portal-skill index in
[upstream discussion #78](https://github.com/MadsLorentzen/ai-job-search/discussions/78)),
or generate a new portal CLI with `/add-portal`. Third-party portal code is always
reviewed before installation.

**Global add-ons** (usable in any market, installed via the same approval flow):
`linkedin-search` and `freehire-search` (shipped, country-agnostic), `company-pages-search`
(kblackma fork; ATS-direct employer watchlist), `flowxtra-search` (9mtm; multi-country ATS
platform), `firecrawl-search` (rakshith48; metered hosted API, user key, ships disabled).

Active market is recorded in `CURRENT.json`.
