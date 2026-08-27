# arbeitnow-search CLI

Bun/TypeScript client for the arbeitnow public job board API.

## Install

```sh
cd .agents/skills/arbeitnow-search/cli
bun install
```

## Run

```sh
# From anywhere in the repo root
bun run .agents/skills/arbeitnow-search/cli/src/cli.ts search --tag react --location Berlin
```

Or `cd` into the cli directory and use `bun run .`:

```sh
cd .agents/skills/arbeitnow-search/cli
bun run . search --tag react
```

## Subcommands

| Subcommand | Purpose |
|---|---|
| `search` | Query the API by keyword, tag, location, and remote flag |
| `detail --slug X` | Fetch a single job by its arbeitnow URL slug |
| `tags` | List tags observed in the most recent listings |
| `locations` | List locations observed in the most recent listings |
| `health` | Probe the API and report reachability + a sample result |

## Output

One JSON object per line on stdout. Errors go to stderr with a non-zero exit code.

`/scrape` reads the stdout, dedupes by `id`, and merges into `job_scraper/seen_jobs.json`.

## Tests

```sh
bun test tests/
```

Tests use the live API. To run them offline, set `ARBEITNOW_OFFLINE=1`.
