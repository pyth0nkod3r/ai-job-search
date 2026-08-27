---
name: arbeitnow-search
version: 1.0.0
description: >
  Make sure to use this skill whenever the user wants to search for jobs in Germany, the UK,
  or remote roles across Europe, find German job listings, look up a specific job posting on
  arbeitnow.com, or asks anything about the German / EU job market — even if they don't
  mention arbeitnow.com explicitly. Invoke this skill for questions about open positions,
  job vacancies, hiring in Germany, English-speaking jobs in Berlin, jobs with visa
  sponsorship, or when the user wants to find work in Germany from abroad. Also trigger
  for "find me a job", "are there any jobs for X in Berlin", or "what jobs are available in
  Munich" when the context is Germany / EU. Trigger phrases include: arbeitnow, jobs in
  germany, berlin jobs, munich jobs, visa sponsorship jobs germany, english speaking jobs
  germany, eu remote jobs, jobs in europe, developer jobs berlin, engineer jobs munich,
  marketing jobs hamburg, jobs in stuttgart, jobs in dusseldorf, jobs in frankfurt, jobs
  in cologne, germany tech jobs, germany software jobs, germany engineering jobs, european
  tech jobs, visa sponsor germany.
allowed-tools: WebFetch, WebSearch
framework_version: 1.0.0
enabled: true
---

# arbeitnow Search Skill

Search jobs on [arbeitnow.com](https://www.arbeitnow.com) — a public job board focused
on Germany (Berlin, Munich, Stuttgart, Hamburg, Frankfurt, Cologne, Düsseldorf, and other
cities) plus English-speaking jobs and roles offering visa sponsorship. arbeitnow
launched a UK site at [arbeitnow.co.uk](https://www.arbeitnow.co.uk) in mid-2026; that
content may also surface through this skill.

## Data source

arbeitnow publishes a free, no-auth JSON API. **No scraping required** — every command in
this skill is a single HTTP call. Do not try to scrape the HTML site; use the API.

- **Base URL:** `https://www.arbeitnow.com/api/job-board-api`
- **Response shape:** `{ "data": [ Job, Job, ... ] }`. The CLI reads `data[]`, never the
  raw HTML.
- **Pagination:** the API is a single-page endpoint. Each call returns the most recent
  batch. The CLI walks page by page by adding `&page=N` until an empty `data[]` comes
  back. arbeitnow has not documented rate limits publicly — keep request rate well below
  1 req/sec and stop on HTTP 429 for 60 s before retrying.
- **Honest User-Agent:** every CLI request sets `User-Agent: ai-job-search/arbeitnow (RikkaHub Agent; +https://github.com/pyth0nkod3r/ai-job-search)`. Identifies the tool, the host
  harness, and points back to the source repo. Do not impersonate a browser.

## How It Works

This skill searches arbeitnow via the CLI in `.agents/skills/arbeitnow-search/cli/`
using queries from your profile. It deduplicates against previously seen jobs and the
application tracker.

The CLI supports five commands:

- `search` — query the API by keyword, tag, location, and remote flag
- `detail` — fetch a single job by its `slug` (the unique tail of the arbeitnow URL)
- `tags` — list common tags the API has seen (derived from a sample of recent jobs)
- `locations` — list common locations the API has seen
- `health` — probe the API and report reachability + tag/location extraction

## Invocation

The user triggers this skill by saying things like:

- "Find me a React job in Berlin"
- "Any arbeitnow postings for senior Python engineers?"
- "Search arbeitnow for visa-sponsored remote roles"
- "What's on arbeitnow this week?"
- "/scrape arbeitnow"
- "Show me detail on this arbeitnow posting: arbeitnow.com/jobs/companies/.../slug-12345"

Optional arguments:

- A focus area, e.g. "search arbeitnow for data science"
- A location, e.g. "Berlin", "Munich", "Remote", "Hamburg"
- A tag, e.g. "react", "python", "devops"
- "remote" to filter to remote-eligible roles
- A slug, e.g. "show me detail on arbeitnow slug `senior-product-designer-...-281658`"

## Command Reference

### `search`

```sh
bun run .agents/skills/arbeitnow-search/cli/src/cli.ts search \
  --query "react" \
  --tag "react" \
  --location "Berlin" \
  --remote \
  --limit 25
```

Flags:

- `--query <text>` — substring match against `title` and `company_name`. Omit for a
  broad recent sweep.
- `--tag <tag>` — filter by arbeitnow's `tags[]` field (case-insensitive). Common tags
  include `react`, `python`, `devops`, `kubernetes`, `typescript`, `golang`, `rust`,
  `machine-learning`, `data-engineering`, `frontend`, `backend`, `full-stack`, `mobile`,
  `android`, `ios`, `sre`, `security`. Pass `--tags` without a value to see what the
  CLI has observed in recent calls.
- `--location <city>` — substring match against the `location` field. Common values:
  `Berlin`, `Munich`, `Hamburg`, `Frankfurt`, `Stuttgart`, `Cologne`, `Düsseldorf`,
  `Remote`. Multiple locations: pass `--location` multiple times.
- `--remote` — boolean flag. Filters to roles where `remote === true`. **Heads-up:**
  the API is known to mark some remote-eligible roles with `remote: false`; treat this
  filter as a strong hint, not a hard exclusion. The CLI surfaces a warning when the
  response is empty after a `--remote` filter so the user can re-run without the flag.
- `--visa` — boolean flag (advisory; the API does not expose a visa field, but the
  arbeitnow site advertises a Visa Sponsorship filter. The CLI does not call a separate
  endpoint; the user-supplied `--visa` flag is logged for the drafter's downstream
  Sponsorship Gate and is not used to filter the API response).
- `--limit <N>` — cap on results to return (default 25, max 100). Pagination is
  handled internally; the CLI returns up to `--limit` newest jobs across as many pages
  as needed.
- `--page <N>` — explicit page number, for diagnostics. Off by default.

Output: one JSON line per job, shape:

```json
{
  "id": "arbeitnow:sumup:senior-product-designer-hardware-fixed-term-12-months-berlin-281658",
  "title": "Senior Product Designer- Hardware (fixed term 12 months)",
  "company": "sumup",
  "location": "Berlin",
  "remote": false,
  "url": "https://www.arbeitnow.com/jobs/companies/sumup/senior-product-designer-hardware-fixed-term-12-months-berlin-281658",
  "tags": ["Product Design", "Hardware", "UX"],
  "job_types": ["berufserfahren"],
  "description_html": "...",
  "description_text": "...",
  "posted_at_unix": 1787866235
}
```

`id` is namespaced with `arbeitnow:<company>:<slug>` so dedup across portals works
without collision. `description_text` is the HTML stripped to plain text, ready for
the drafter to read.

### `detail`

```sh
bun run .agents/skills/arbeitnow-search/cli/src/cli.ts detail \
  --slug "senior-product-designer-hardware-fixed-term-12-months-berlin-281658"
```

Fetches a single posting in full. The slug is the trailing path segment of an
arbeitnow job URL (e.g. `https://www.arbeitnow.com/jobs/companies/sumup/<slug>`).

Output: same shape as a single `search` result.

### `tags` and `locations`

```sh
bun run .agents/skills/arbeitnow-search/cli/src/cli.ts tags
bun run .agents/skills/arbeitnow-search/cli/src/cli.ts locations
```

Returns a sorted, deduplicated list of tags or locations observed in the most recent
`search` call (the CLI caches them in-memory during the run). Use these to discover
the right `--tag` / `--location` values for a targeted search.

### `health`

```sh
bun run .agents/skills/arbeitnow-search/cli/src/cli.ts health
```

Probes the API, reports HTTP status, response time, and a sample result. Returns one
of: `healthy` (HTTP 200 with at least 1 result), `degraded` (HTTP 200 but empty data,
or HTTP 5xx but retryable), `unreachable` (network error or non-retryable status).

## CLI Behavior Notes

- **Pagination**: the CLI walks `&page=1`, `&page=2`, ... until `data` is empty or
  `--limit` results are accumulated. **Stop on empty `data[]`**; do not chase
  `page=999` or treat empty as an error.
- **Rate limiting**: keep at most 1 request per second. After HTTP 429, the CLI
  backs off 60 s and retries once; a second 429 surfaces to the user as
  `rate-limited` rather than spinning.
- **No scraping fallback**: if the API is unreachable, the CLI does **not** fall back
  to scraping the HTML site. The user is told to retry later or rely on the
  WebSearch fallback in `/scrape`. This is by design — HTML scraping arbeitnow
  violates the spirit of the site even where the robots.txt would allow it.
- **Honest identifier**: the User-Agent string is set to
  `ai-job-search/arbeitnow (RikkaHub Agent; +https://github.com/pyth0nkod3r/ai-job-search)`.
  This identifies the tool, the host harness, and points back to the source repo. The
  CLI does not pretend to be a browser.

## Sample Searches

```sh
# All recent German tech jobs
bun run .agents/skills/arbeitnow-search/cli/src/cli.ts search

# Senior React roles in Berlin
bun run .agents/skills/arbeitnow-search/cli/src/cli.ts search \
  --query "senior" --tag "react" --location "Berlin"

# Remote-only Python roles (any German city or EU)
bun run .agents/skills/arbeitnow-search/cli/src/cli.ts search \
  --tag "python" --remote

# Visa-sponsorship filter (advisory; the API does not enforce this)
bun run .agents/skills/arbeitnow-search/cli/src/cli.ts search \
  --query "visa" --visa

# Detail on a single posting by slug
bun run .agents/skills/arbeitnow-search/cli/src/cli.ts detail \
  --slug "senior-product-designer-hardware-fixed-term-12-months-berlin-281658"
```

## Output

The CLI prints one JSON object per line on stdout. Errors go to stderr with a
non-zero exit code. `/scrape` reads the stdout, dedupes by `id`, and merges into
`job_scraper/seen_jobs.json`.

## See Also

- `url-reference.md` — the canonical arbeitnow API documentation we follow
- `cli/README.md` — CLI-specific notes, error handling, and Bun install instructions
- `cli/tests/` — test cases that exercise each command
