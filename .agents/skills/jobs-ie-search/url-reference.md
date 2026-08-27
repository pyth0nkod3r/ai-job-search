# jobs.ie URL Reference

Endpoints and patterns the `jobs-ie-search` skill uses. The CLI is WebSearch-driven
and uses direct fetch only for `detail`.

## WebSearch (DuckDuckGo HTML) — primary

| URL pattern | Purpose |
|---|---|
| `https://html.duckduckgo.com/html/?q=site%3Ajobs.ie+<query>` | Search results for jobs.ie pages, paginated by DuckDuckGo |

CLI usage: build the URL with the user's `--query`, `--location`, and `--remote`
flags, then fetch the HTML, parse the result links (`<a class="result__a">`),
and return them.

## Direct fetch — only for `detail`

| URL pattern | robots.txt status | Used by CLI? |
|---|---|---|
| `https://www.jobs.ie/JobSearch/Results.aspx?...` | Allowed (see exact query-param allow rules below) | yes, but discouraged — use WebSearch instead |
| `https://www.jobs.ie/job/<slug>` | Not explicitly listed in the allow rules; the broad `Allow: /job/` pattern covers it. | yes, by `detail` |
| `https://www.jobs.ie/jobs/...` | Allowed for `/jobs/`, disallowed for `?q=*&` follow-up query params | yes, by `detail` |
| `https://www.jobs.ie/JobSearch/RSS.aspx` | **Disallowed** in robots.txt | **NO** — RSS is not in the public allow set, the CLI does not hit it |
| `https://www.jobs.ie/account/...` | Disallowed | NO |
| `https://www.jobs.ie/JobSearch/AdvancedJobSearch.aspx` | Disallowed | NO |
| `https://www.jobs.ie/savedjobs` | Disallowed | NO |
| `https://www.jobs.ie/JobSearch/.../api/` | Disallowed | NO — jobs.ie has internal API endpoints; the CLI does not hit them |

## Robots.txt (last checked 2026-08-27)

Selected allow rules from `https://www.jobs.ie/robots.txt`:

```
User-agent: *
Allow: /jobs/work-from-home
Allow: /jobs/temporary
Disallow: /jobs/permanent
Allow: /jobs/contract
Allow: /jobs/part-time
Allow: /JobSearch/
Allow: /job/
Allow: /jobs/
Allow: /jobs/*?q=
Disallow: /jobs/*?q=*&
Disallow: /jobs/*?
Disallow: /jobs-at/*?q=*&
Allow: /jobs-at/
Disallow: /job/*?Visitor-Source=
```

The CLI's `detail` command respects this allow-list. URLs that fall under
`Disallow:` are not fetched; the user is told to use the WebSearch fallback
instead.

## Sister sites / out of scope

- `https://www.irishjobs.ie` — robots.txt is 403 at the edge (Akamai WAF).
  Effectively unscrapable. Listed in `markets/ie.md` as out-of-scope; WebSearch
  fallback only.
- `https://jobsireland.ie` — robots.txt wide open, but the site is a low-volume
  public-employment service (Intuition / Yaplex). Listed as a low-priority
  search target; no portal skill.
- `https://www.linkedin.com` — covered by the global `linkedin-search` skill.
- `https://www.irishjobs.ie` / `https://www.jobsireland.ie` / LinkedIn Ireland
  searches are not duplicated here.

## Rate limits

Not documented. The CLI keeps request rate at ≤1 req/sec. The detail command
fetches at most one page per call.

## ToS / acceptable use

jobs.ie ToS is available at `https://www.jobs.ie/info/terms`. Reasonable use —
honest identifying User-Agent, no high-frequency scraping, no republication of
the full job dataset, no automated form submissions — is consistent with the
site's general posture. The CLI's WebSearch-driven primary path stays well
within the spirit of the rules.
