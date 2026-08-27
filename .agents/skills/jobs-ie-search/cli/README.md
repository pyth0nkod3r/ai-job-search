# jobs-ie-search CLI

WebSearch-driven CLI for jobs.ie (Ireland). Honest about its limits: the CLI does
not scrape jobs.ie directly. It shells out to a DuckDuckGo HTML search and parses
the result links. Detail fetches a single jobs.ie URL when the URL is in the
robots.txt allow-list.

## Install

```sh
cd .agents/skills/jobs-ie-search/cli
bun install
```

## Run

```sh
# From anywhere in the repo root
bun run .agents/skills/jobs-ie-search/cli/src/cli.ts search --query "react" --location "Dublin"
```

Or `cd` into the cli directory and use `bun run .`:

```sh
cd .agents/skills/jobs-ie-search/cli
bun run . search --query "react" --location "Dublin"
```

## Subcommands

| Subcommand | Purpose |
|---|---|
| `search` | Run `site:jobs.ie <query>` against DuckDuckGo HTML, return top N hits |
| `detail --url U` | Fetch a single jobs.ie page (only when URL is in robots.txt allow-list) |
| `tags` | Print the common Ireland locations (Dublin, Cork, Galway, Limerick, Waterford, Belfast) |
| `health` | Probe the WebSearch path and report success |

## Output

One JSON object per line on stdout. Each result has `via: "websearch"` (search
hits) or `via: "direct-fetch"` (detail). Errors go to stderr with a non-zero
exit code.

`/scrape` reads the stdout, dedupes by `id`, and merges into
`job_scraper/seen_jobs.json`.

## Tests

```sh
bun test tests/
```

Tests hit the live WebSearch path. Set `JOBSIE_OFFLINE=1` to skip them.
