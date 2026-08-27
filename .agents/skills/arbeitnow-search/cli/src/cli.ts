#!/usr/bin/env bun
/**
 * arbeitnow-search CLI
 *
 * Tiny Bun/TypeScript client for the arbeitnow public job board API.
 * No scraping. Honest identifying User-Agent. Rate-limited to 1 req/sec.
 *
 * See ../../SKILL.md and ../../url-reference.md for the contract.
 */

const BASE = "https://www.arbeitnow.com/api/job-board-api";
const UA =
  "ai-job-search/arbeitnow (RikkaHub Agent; +https://github.com/pyth0nkod3r/ai-job-search)";

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;
const RATE_DELAY_MS = 1100; // > 1 sec between requests
const BACKOFF_429_MS = 60_000;

// --- types matching the arbeitnow API -----------------------------------------

type ArbeitnowJob = {
  slug: string;
  company_name: string;
  title: string;
  description: string; // HTML-escaped
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number; // unix seconds
};

type ApiResponse = { data: ArbeitnowJob[] };

// --- HTML / text utilities ----------------------------------------------------

/** HTML-unescape a JSON-escaped string then strip tags to readable text. */
function htmlToText(escapedHtml: string): string {
  // JSON already decodes &amp; &lt; etc. once; we still need to strip tags.
  return escapedHtml
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<li[^>]*>/gi, "  - ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function makeId(j: ArbeitnowJob): string {
  return `arbeitnow:${j.company_name}:${j.slug}`;
}

function shape(j: ArbeitnowJob) {
  return {
    id: makeId(j),
    title: j.title,
    company: j.company_name,
    location: j.location,
    remote: j.remote,
    url: j.url,
    tags: j.tags,
    job_types: j.job_types,
    description_html: j.description,
    description_text: htmlToText(j.description),
    posted_at_unix: j.created_at,
  };
}

// --- HTTP with rate limiting and 429 backoff ----------------------------------

let lastRequestAt = 0;

async function throttled(): Promise<void> {
  const now = Date.now();
  const wait = lastRequestAt + RATE_DELAY_MS - now;
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequestAt = Date.now();
}

async function getJson(path: string): Promise<ApiResponse> {
  let attempt = 0;
  while (true) {
    await throttled();
    let resp: Response;
    try {
      resp = await fetch(path, { headers: { "User-Agent": UA, Accept: "application/json" } });
    } catch (err) {
      // network error → not retryable inside the CLI; surface to caller
      throw new Error(`network error: ${(err as Error).message}`);
    }
    if (resp.status === 429) {
      if (attempt >= 1) throw new Error("rate-limited: 429 after one retry");
      console.error("arbeitnow: HTTP 429, backing off 60s…");
      await new Promise((r) => setTimeout(r, BACKOFF_429_MS));
      attempt++;
      continue;
    }
    if (!resp.ok) throw new Error(`http ${resp.status}: ${await resp.text()}`);
    return (await resp.json()) as ApiResponse;
  }
}

// --- subcommands --------------------------------------------------------------

async function cmdSearch(args: string[]): Promise<number> {
  const flags = parseFlags(args, {
    query: "",
    tag: "",
    location: [] as string[],
    remote: false,
    visa: false,
    limit: DEFAULT_LIMIT,
    page: 0,
  });
  const limit = clampInt(flags.limit, 1, MAX_LIMIT, DEFAULT_LIMIT);
  const locations = Array.isArray(flags.location)
    ? flags.location
    : flags.location
      ? [flags.location]
      : [];

  // Build a list of (page, query) pairs to walk. If --tag is set, the API filters
  // by it; if not, we walk pages unfiltered. If --query is set, the API does not
  // support it directly, so we post-filter.
  const out: ArbeitnowJob[] = [];
  let page = flags.page || 1;
  let warnedRemoteEmpty = false;
  while (out.length < limit) {
    const url = new URL(BASE);
    url.searchParams.set("page", String(page));
    if (flags.tag) url.searchParams.set("tags", flags.tag);
    if (flags.remote) url.searchParams.set("remote", "true");
    const resp = await getJson(url.toString());
    if (!resp.data || resp.data.length === 0) break;
    let pageJobs = resp.data;
    // Post-filter: arbeitnow's `tags` query param is a substring match on the
    // tags[] array, but a job whose tags contain the substring is returned
    // even if the substring only matches an unrelated tag. Tighten this
    // client-side so the caller gets a real tag match, not a near-match.
    if (flags.tag) {
      const want = flags.tag.toLowerCase();
      pageJobs = pageJobs.filter((j) =>
        (j.tags || []).some((t) => t.toLowerCase() === want),
      );
    }
    if (flags.query) {
      const q = flags.query.toLowerCase();
      pageJobs = pageJobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company_name.toLowerCase().includes(q) ||
          (j.tags || []).some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (locations.length > 0) {
      pageJobs = pageJobs.filter((j) => {
        const loc = (j.location || "").toLowerCase();
        return locations.some((l) => loc.includes(l.toLowerCase()));
      });
    }
    out.push(...pageJobs);
    if (resp.data.length < 10) break; // API returns ~10 per page; smaller = end
    page++;
  }
  let results = out.slice(0, limit);
  if (flags.remote && results.length === 0 && !warnedRemoteEmpty) {
    console.error(
      "arbeitnow: --remote filter returned 0 results; the API is known to under-report remote: true. Re-run without --remote to see near-remote roles.",
    );
    warnedRemoteEmpty = true;
  }
  if (flags.visa) {
    // Advisory: the API does not expose a visa field. The visa flag is logged
    // for the drafter's Sponsorship Gate, not used to filter results.
    console.error("arbeitnow: --visa is advisory; arbeitnow's visa filter is not in the API");
  }
  for (const j of results) {
    console.log(JSON.stringify(shape(j)));
  }
  return 0;
}

async function cmdDetail(args: string[]): Promise<number> {
  const flags = parseFlags(args, { slug: "" });
  if (!flags.slug) {
    console.error("detail: --slug is required");
    return 2;
  }
  // Detail isn't a dedicated endpoint in arbeitnow's API; search the first 5
  // pages for a slug match. (Cheap; small dataset.)
  for (let p = 1; p <= 5; p++) {
    const url = new URL(BASE);
    url.searchParams.set("page", String(p));
    const resp = await getJson(url.toString());
    const hit = (resp.data || []).find((j) => j.slug === flags.slug);
    if (hit) {
      console.log(JSON.stringify(shape(hit)));
      return 0;
    }
    if (!resp.data || resp.data.length === 0) break;
  }
  console.error(`detail: slug not found in the most recent listings: ${flags.slug}`);
  return 1;
}

async function cmdTagsOrLocations(args: string[], field: "tags" | "location"): Promise<number> {
  // Walk a few pages and aggregate the requested field.
  const counts = new Map<string, number>();
  for (let p = 1; p <= 3; p++) {
    const url = new URL(BASE);
    url.searchParams.set("page", String(p));
    const resp = await getJson(url.toString());
    for (const j of resp.data || []) {
      if (field === "tags") {
        for (const t of j.tags || []) counts.set(t, (counts.get(t) || 0) + 1);
      } else {
        const loc = (j.location || "").trim();
        if (loc) counts.set(loc, (counts.get(loc) || 0) + 1);
      }
    }
    if (!resp.data || resp.data.length < 10) break;
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  for (const [k, n] of sorted) {
    console.log(`${n}\t${k}`);
  }
  return 0;
}

async function cmdHealth(): Promise<number> {
  const t0 = Date.now();
  try {
    const url = new URL(BASE);
    url.searchParams.set("page", "1");
    const resp = await getJson(url.toString());
    const ms = Date.now() - t0;
    const n = (resp.data || []).length;
    if (n === 0) {
      console.error(`degraded: HTTP 200, empty data (${ms}ms)`);
      return 1;
    }
    console.error(`healthy: HTTP 200, ${n} jobs, ${ms}ms`);
    return 0;
  } catch (err) {
    console.error(`unreachable: ${(err as Error).message}`);
    return 1;
  }
}

// --- flag parsing -------------------------------------------------------------

type FlagSpec = Record<string, string | boolean | string[] | number>;

function parseFlags<T extends FlagSpec>(args: string[], defaults: T): { [K in keyof T]: T[K] | string[] | number } {
  const out: Record<string, unknown> = { ...defaults };
  // Multi-value support: --location X --location Y
  const multi: Record<string, string[]> = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--remote" || a === "--visa") {
      out[a.slice(2)] = true;
      continue;
    }
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const val = args[i + 1];
      // If the same flag appears again, push to multi
      if (key in multi) {
        multi[key].push(val);
        i++;
        continue;
      }
      // Heuristic: if the default is an array, treat as multi from the first
      if (Array.isArray(defaults[key as keyof T])) {
        multi[key] = [val];
        i++;
        continue;
      }
      out[key] = val;
      i++;
    }
  }
  for (const [k, v] of Object.entries(multi)) out[k] = v;
  return out as { [K in keyof T]: T[K] | string[] | number };
}

function clampInt(n: unknown, min: number, max: number, dflt: number): number {
  const v = typeof n === "number" ? n : parseInt(String(n), 10);
  if (!Number.isFinite(v)) return dflt;
  return Math.max(min, Math.min(max, v));
}

// --- entry point --------------------------------------------------------------

function usage(): void {
  console.error(`arbeitnow-search — arbeitnow.com public job board CLI

usage:
  search   [--query Q] [--tag T] [--location L] [--remote] [--visa] [--limit N]
  detail   --slug SLUG
  tags
  locations
  health

see SKILL.md for the full skill contract`);
}

async function main(): Promise<number> {
  const argv = process.argv.slice(2);
  const sub = argv[0];
  const rest = argv.slice(1);
  switch (sub) {
    case "search":
      return await cmdSearch(rest);
    case "detail":
      return await cmdDetail(rest);
    case "tags":
      return await cmdTagsOrLocations(rest, "tags");
    case "locations":
      return await cmdTagsOrLocations(rest, "location");
    case "health":
      return await cmdHealth();
    case "-h":
    case "--help":
    case undefined:
      usage();
      return 0;
    default:
      console.error(`unknown subcommand: ${sub}`);
      usage();
      return 2;
  }
}

await main();
