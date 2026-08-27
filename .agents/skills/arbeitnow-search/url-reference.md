# arbeitnow URL Reference

Canonical endpoints used by the `arbeitnow-search` skill. The CLI uses these
exclusively. No HTML scraping.

## Job Board API (public, no auth)

| Endpoint | Method | Purpose |
|---|---|---|
| `https://www.arbeitnow.com/api/job-board-api` | GET | List most recent jobs (page 1) |
| `https://www.arbeitnow.com/api/job-board-api?page=N` | GET | List jobs, page N (zero-indexed in the URL? — observed: page 1 returns jobs, page 2 returns further, page 3 empty) |
| `https://www.arbeitnow.com/api/job-board-api?tags=react` | GET | Filter by tag (case-insensitive substring on `tags[]`) |
| `https://www.arbeitnow.com/api/job-board-api?remote=true` | GET | Filter to remote-eligible roles (note: API is known to under-report `remote: true`; treat as a hint) |

### Query parameters (observed)

| Param | Type | Effect |
|---|---|---|
| `page` | int | Page number (1-indexed). Empty `data[]` signals end of results. |
| `tags` | string | Single tag filter. Multi-tag is not documented; the CLI issues one query per tag. |
| `remote` | bool | Filter on `remote` field. |

Undocumented / observed-quirks:

- The API is not paginated beyond ~30 results per page; a `page=2` returns the next
  batch. The CLI walks pages until empty.
- The `tags` parameter is a substring match, not an exact-match. Filter to one tag at
  a time.
- The `remote` field is occasionally `false` for jobs that are in fact remote
  (described as such in the `description_html`). The CLI surfaces this to the drafter
  via a warning when the filter returns 0 results.

### Response shape

```json
{
  "data": [
    {
      "slug": "senior-product-designer-hardware-fixed-term-12-months-berlin-281658",
      "company_name": "sumup",
      "title": "Senior Product Designer- Hardware (fixed term 12 months)",
      "description": "<p>HTML escaped job description</p>",
      "remote": false,
      "url": "https://www.arbeitnow.com/jobs/companies/sumup/senior-product-designer-hardware-fixed-term-12-months-berlin-281658",
      "tags": ["Product Design", "Hardware", "UX"],
      "job_types": ["berufserfahren"],
      "location": "Berlin",
      "created_at": 1787866235
    }
  ]
}
```

`created_at` is a Unix timestamp. `description` is HTML-escaped; unescape and
strip tags for plain-text output. `slug` is unique within arbeitnow.

## Robots.txt

`https://www.arbeitnow.com/robots.txt` (last checked 2026-08-27):

```
User-agent: *
Disallow:
Disallow: /*?__hstc
Disallow: /jobs/companies/*/apply
```

The first `Disallow:` is empty (i.e. allow everything). Only a HubSpot tracking
param and the apply form are blocked. The API path is not blocked.

## Rate limits

Not documented. The CLI keeps request rate at ≤1 req/sec. After a 429, back off
60 s and retry once; a second 429 surfaces as `rate-limited` to the user.

## ToS / acceptable use

arbeitnow has not published a dedicated API ToS. Reasonable use — honest
identifying User-Agent, no high-frequency scraping, no redistribution of the full
job dataset — is consistent with how the site presents itself. The CLI does not
republish jobs to a third party.

## Sister sites

- `https://www.arbeitnow.co.uk` — UK launch (mid-2026). Same owner, same brand.
  The CLI does not currently target `.co.uk`; if the user wants UK-only jobs,
  switch the base URL to the UK site (the API shape is the same per the
  sister-site footer).
