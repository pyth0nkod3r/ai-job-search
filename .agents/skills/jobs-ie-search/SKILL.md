---
name: jobs-ie-search
version: 1.0.0
description: >
  Make sure to use this skill whenever the user wants to search for jobs in Ireland, find
  Irish job listings, look up a specific job posting on jobs.ie, or asks anything about
  the Irish job market — even if they don't mention jobs.ie explicitly. Invoke this skill
  for questions about open positions, job vacancies, hiring in Ireland, Dublin tech jobs,
  or work in Cork / Galway / Limerick. Trigger phrases include: jobs.ie, irish jobs, jobs
  in ireland, dublin jobs, cork jobs, galway jobs, limerick jobs, ireland tech jobs,
  ireland software jobs, european tech jobs, eu job market, english speaking jobs
  ireland, eu work permit ireland, critical skills permit ireland.
allowed-tools: WebFetch, WebSearch
framework_version: 1.0.0
enabled: true
---

# jobs.ie Search Skill

Search jobs on [jobs.ie](https://www.jobs.ie) — Ireland's largest generalist job
board, owned by JobsIreland / StepStone Group. jobs.ie is **technically scrapable
within a narrow set of allowed URLs** (per their robots.txt), but a portal CLI
that hits the live site is brittle and slow. This skill uses **WebSearch** as its
primary discovery mechanism and falls back to direct fetch only when a single
job-URL is provided.

## Data source

| Source | Role | Notes |
|---|---|---|
| WebSearch (DuckDuckGo HTML) | **Primary.** Used for `search` and `tags`/`locations` commands. No scraper, no robots drama, no rate-limit worry. |
| WebFetch (direct) | Used only by `detail` when the user supplies a specific jobs.ie URL. The page must be in jobs.ie's allow-list (see `url-reference.md`). |
| Public RSS / job feeds | jobs.ie has a `JobSearch/RSS.aspx` endpoint. The robots.txt **disallows** it for general crawlers, but the endpoint exists. The CLI does not hit it by default; if the user wants RSS, ask first. |

This is **Option A** of the Ireland support plan: a portal skill exists, but it
is honest about using WebSearch as the primary source. The CLI shape is still
discoverable by `/scrape`, so the pipeline is uniform across markets.

## How It Works

The CLI in `.agents/skills/jobs-ie-search/cli/` is intentionally small — it
shells out to the workspace's WebSearch tool rather than implementing its own
HTTP layer. This keeps the skill honest about what it can do.

Subcommands:

- `search` — issue a WebSearch query against `site:jobs.ie` with the user's
  keywords, parse the result links, return them as jobs
- `detail --url U` — fetch a single jobs.ie page (must be in their allow-list) and
  extract title, company, location, posted date, and the description
- `tags` — list common tag / category slugs observed in the last `search` call
- `health` — verify the search path works (a one-shot search round-trip)

## Invocation

The user triggers this skill by saying things like:

- "Find me a React job in Dublin"
- "Any jobs.ie postings for senior Python engineers in Cork?"
- "Search jobs.ie for visa-sponsored roles"
- "What jobs are on jobs.ie this week?"
- "/scrape jobs.ie"
- "Show me detail on this jobs.ie posting: <url>"

## Command Reference

### `search`

```sh
bun run .agents/skills/jobs-ie-search/cli/src/cli.ts search \
  --query "react" \
  --location "Dublin" \
  --limit 25
```

Flags:

- `--query <text>` — free-text query. The CLI runs
  `site:jobs.ie <text>` against DuckDuckGo and returns the top N links.
- `--location <city>` — adds `"<city>"` to the query. Common: `Dublin`, `Cork`,
  `Galway`, `Limerick`, `Waterford`, `Belfast` (note: Belfast jobs surface
  through jobs.ie too).
- `--limit <N>` — cap on results (default 25, max 50).
- `--remote` — adds `"remote"` to the query. jobs.ie does not have a dedicated
  remote filter; this is a query-string hint.

Output: one JSON line per result, shape:

```json
{
  "id": "jobsie:<slug-from-url>",
  "title": "<title text>",
  "company": "<company name>",
  "location": "<city>",
  "url": "<jobs.ie URL>",
  "snippet": "<DuckDuckGo snippet>",
  "source": "jobsie-search",
  "via": "websearch"
}
```

The `via: "websearch"` field is critical — it tells the drafter the listing was
discovered, not pulled from jobs.ie's own structured feed. The drafter should
not assert "as listed on jobs.ie" in a cover letter without re-fetching the
detail page.

### `detail`

```sh
bun run .agents/skills/jobs-ie-search/cli/src/cli.ts detail \
  --url "https://www.jobs.ie/job/<slug>"
```

Fetches a single jobs.ie page (must be in their allow-list — see
`url-reference.md`). Extracts:

- Title (`<title>` or `<h1>`)
- Company name (parsed from the page metadata)
- Location (parsed from the page metadata)
- Posted date
- Description (the body, stripped to plain text)
- The full canonical URL

Output: same shape as a single `search` result, but with `via: "direct-fetch"`
and a `description_text` field.

The detail fetch will fail with `disallowed` if the URL pattern is not in
jobs.ie's robots.txt allow-list. The CLI does not retry; the user is told
explicitly which URL patterns are allowed and which are not.

### `tags` and `health`

`tags` returns the category slugs observed in recent searches (Dublin,
Cork, Galway, Limerick, Belfast, etc.). `health` runs a one-shot
search round-trip and reports success or failure.

## CLI Behavior Notes

- **WebSearch-driven, not scraping.** The CLI shells out to a DuckDuckGo HTML
  fetch (`https://html.duckduckgo.com/html/?q=site%3Ajobs.ie+<query>`) rather
  than scraping jobs.ie directly. This keeps the skill inside jobs.ie's
  spirit-of-the-rules even where the literal robots.txt would allow scraping
  of some pages. If jobs.ie ever blocks DuckDuckGo from indexing their pages,
  this skill returns 0 results and the user is told to try the WebSearch
  fallback in `/scrape`.
- **Honest identifier.** The User-Agent set on the direct-fetch path (detail
  command) is `ai-job-search/jobs-ie (RikkaHub Agent; +https://github.com/pyth0nkod3r/ai-job-search)`. Same shape as the arbeitnow skill.
- **No login wall probing.** jobs.ie is a fully public site. If a future page
  returns 403 or a login challenge, the CLI surfaces that as `login-wall` and
  stops — never bypasses.

## Sample Searches

```sh
# All recent jobs in Dublin for React
bun run .agents/skills/jobs-ie-search/cli/src/cli.ts search \
  --query "react" --location "Dublin"

# Senior roles in Cork with remote hint
bun run .agents/skills/jobs-ie-search/cli/src/cli.ts search \
  --query "senior" --location "Cork" --remote

# Detail on a single posting
bun run .agents/skills/jobs-ie-search/cli/src/cli.ts detail \
  --url "https://www.jobs.ie/job/some-slug"
```

## Output

The CLI prints one JSON object per line on stdout. Errors go to stderr with a
non-zero exit code. `/scrape` reads the stdout, dedupes by `id`, and merges
into `job_scraper/seen_jobs.json`.

## Caveats

- **Search results are discovery, not listings.** jobs.ie does not expose a
  public API; the search command returns DuckDuckGo's top hits for
  `site:jobs.ie <query>`. The drafter should re-fetch each URL via `detail`
  before quoting a posting in a cover letter.
- **No pagination, no filtering by salary, no filtering by date posted.**
  DuckDuckGo's free HTML endpoint does not give the CLI a structured way to
  filter. For a deeper search, the user is directed to jobs.ie directly.
- **irishjobs.ie and jobsireland.ie are NOT covered by this skill.** The
  upstream discussion #78 lists no Irish market, and irishjobs.ie's robots.txt
  is bot-blocked (403 from edge, Akamai WAF). jobsireland.ie's robots.txt is
  open but the site is a low-volume public-employment service. The
  `markets/ie.md` file lists these explicitly so the drafter knows what is
  and is not in scope.

## See Also

- `url-reference.md` — the jobs.ie robots.txt allow-list, and the in-scope
  vs out-of-scope site boundaries
- `cli/README.md` — CLI-specific notes
