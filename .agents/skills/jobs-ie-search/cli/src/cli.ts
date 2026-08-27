#!/usr/bin/env bun
/**
 * jobs-ie-search CLI
 *
 * WebSearch-driven job search for jobs.ie. The CLI shells out to a DuckDuckGo
 * HTML fetch and parses the result links. It does NOT scrape jobs.ie directly.
 *
 * This is intentionally small — a portal skill that *exists* (so /scrape
 * auto-discovers it uniformly across markets) but is honest about its limits
 * (Option A in the Ireland support plan). For deeper search, the user is
 * directed to jobs.ie directly.
 */

const DDG = "https://html.duckduckgo.com/html/";
const UA =
  "ai-job-search/jobs-ie (RikkaHub Agent; +https://github.com/pyth0nkod3r/ai-job-search)";

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 50;

let lastRequestAt = 0;
async function throttled(): Promise<void> {
  const now = Date.now();
  const wait = lastRequestAt + 1100 - now;
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequestAt = Date.now();
}

async function fetchHtml(url: string): Promise<string> {
  await throttled();
  const resp = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" } });
  if (!resp.ok) throw new Error(`http ${resp.status}`);
  return await resp.text();
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function slugFromJobsIeUrl(href: string): string {
  try {
    const u = new URL(href, "https://www.jobs.ie");
    if (u.pathname.startsWith("/job/")) {
      return u.pathname.split("/").filter(Boolean).slice(0, 2).join("/");
    }
    if (u.pathname.startsWith("/jobs/")) {
      return u.pathname;
    }
    return u.pathname;
  } catch {
    return href;
  }
}

type SearchResult = {
  id: string;
  title: string;
  url: string;
  snippet: string;
  source: "jobsie-search";
  via: "websearch" | "direct-fetch";
};

// --- subcommands --------------------------------------------------------------

async function cmdSearch(args: string[]): Promise<number> {
  const flags = parseFlags(args, {
    query: "",
    location: "",
    remote: false,
    limit: DEFAULT_LIMIT,
  });
  const limit = clampInt(flags.limit, 1, MAX_LIMIT, DEFAULT_LIMIT);
  if (!flags.query && !flags.location) {
    console.error("search: --query or --location is required");
    return 2;
  }
  const parts: string[] = ["site:jobs.ie"];
  if (flags.query) parts.push(flags.query);
  if (flags.location) parts.push(`"${flags.location}"`);
  if (flags.remote) parts.push("remote");
  const q = parts.join("+");
  const url = `${DDG}?q=${encodeURIComponent(q)}`;
  let html: string;
  try {
    html = await fetchHtml(url);
  } catch (err) {
    console.error(`search: ${(err as Error).message}`);
    return 1;
  }
  const results = parseDdgResults(html, limit);
  if (results.length === 0) {
    console.error("search: 0 results — DuckDuckGo returned no jobs.ie hits for this query. Try a different query, or use WebSearch fallback from /scrape.");
    return 0; // not an error — the CLI worked, the upstream just had nothing
  }
  for (const r of results) console.log(JSON.stringify(r));
  return 0;
}

async function cmdDetail(args: string[]): Promise<number> {
  const flags = parseFlags(args, { url: "" });
  if (!flags.url) {
    console.error("detail: --url is required");
    return 2;
  }
  if (!isAllowedJobsIeUrl(flags.url)) {
    console.error(`detail: URL pattern is not in jobs.ie's allow-list: ${flags.url}`);
    return 1;
  }
  let html: string;
  try {
    html = await fetchHtml(flags.url);
  } catch (err) {
    console.error(`detail: ${(err as Error).message}`);
    return 1;
  }
  const out = parseJobsIeDetail(html, flags.url);
  console.log(JSON.stringify(out));
  return 0;
}

async function cmdTags(): Promise<number> {
  // Static list — Ireland's main job markets. The CLI does not maintain a
  // dynamic list because jobs.ie does not expose one.
  const tags = [
    "Dublin",
    "Cork",
    "Galway",
    "Limerick",
    "Waterford",
    "Belfast",
    "Hybrid",
    "Remote",
  ];
  for (const t of tags) console.log(`1\t${t}`);
  return 0;
}

async function cmdHealth(): Promise<number> {
  const url = `${DDG}?q=${encodeURIComponent("site:jobs.ie+Dublin")}`;
  try {
    const html = await fetchHtml(url);
    const n = (html.match(/class="result__a"/g) || []).length;
    if (n === 0) {
      console.error("degraded: search returned 0 results");
      return 1;
    }
    console.error(`healthy: search returned ${n} results`);
    return 0;
  } catch (err) {
    console.error(`unreachable: ${(err as Error).message}`);
    return 1;
  }
}

// --- parsing -----------------------------------------------------------------

function parseDdgResults(html: string, limit: number): SearchResult[] {
  const out: SearchResult[] = [];
  // DDG HTML result anchors look like:
  //   <a class="result__a" href="https://www.jobs.ie/job/some-slug">Title</a>
  //   <a class="result__snippet">snippet text...</a>
  const linkRe =
    /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
  const snipRe = /<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
  const links: { href: string; title: string }[] = [];
  for (const m of html.matchAll(linkRe)) {
    links.push({ href: m[1], title: decodeHtmlEntities(stripTags(m[2])) });
  }
  const snippets: string[] = [];
  for (const m of html.matchAll(snipRe)) {
    snippets.push(decodeHtmlEntities(stripTags(m[1])));
  }
  for (let i = 0; i < links.length && out.length < limit; i++) {
    const { href, title } = links[i];
    if (!href.includes("jobs.ie")) continue;
    out.push({
      id: `jobsie:${slugFromJobsIeUrl(href)}`,
      title,
      url: href,
      snippet: snippets[i] || "",
      source: "jobsie-search",
      via: "websearch",
    });
  }
  return out;
}

function parseJobsIeDetail(html: string, url: string): SearchResult & { description_text?: string } {
  const title = decodeHtmlEntities(stripTags(extract(html, /<title>([\s\S]*?)<\/title>/) || ""));
  const ogTitle = decodeHtmlEntities(stripTags(extract(html, /<meta\s+property="og:title"\s+content="([^"]+)"/) || ""));
  const ogDescription = decodeHtmlEntities(
    stripTags(extract(html, /<meta\s+property="og:description"\s+content="([^"]+)"/) || ""),
  );
  // Try to pull the main content area. jobs.ie's job pages have a `class="job-description"`
  // block; fall back to og:description if not present.
  const bodyMatch = html.match(/<div[^>]+class="job-description"[^>]*>([\s\S]*?)<\/div>/i);
  const description = bodyMatch
    ? stripTags(decodeHtmlEntities(bodyMatch[1])).slice(0, 8000)
    : ogDescription;
  return {
    id: `jobsie:${slugFromJobsIeUrl(url)}`,
    title: ogTitle || title || "Untitled",
    url,
    snippet: description.slice(0, 280),
    source: "jobsie-search",
    via: "direct-fetch",
    description_text: description,
  };
}

function extract(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[1] : null;
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function isAllowedJobsIeUrl(href: string): boolean {
  try {
    const u = new URL(href);
    if (u.hostname !== "www.jobs.ie" && u.hostname !== "jobs.ie") return false;
    const p = u.pathname;
    if (p.startsWith("/job/") && !u.search) return true; // detail pages with no query
    if (p === "/" || p === "") return true; // homepage
    if (p === "/JobSearch/" && !u.search) return true; // search results landing
    if (p.startsWith("/jobs/")) {
      // Disallowed for ?q=*& follow-ups, allowed for /jobs/*?q= (no &)
      if (u.search && /[&]/.test(u.search.slice(1))) return false;
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// --- flag parsing (small, only what we need) ---------------------------------

type FlagSpec = Record<string, string | boolean | number>;
function parseFlags<T extends FlagSpec>(args: string[], defaults: T): { [K in keyof T]: T[K] | string | number | boolean } {
  const out: Record<string, unknown> = { ...defaults };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--remote") { out["remote"] = true; continue; }
    if (a.startsWith("--")) {
      out[a.slice(2)] = args[i + 1];
      i++;
    }
  }
  return out as { [K in keyof T]: T[K] | string | number | boolean };
}

function clampInt(n: unknown, min: number, max: number, dflt: number): number {
  const v = typeof n === "number" ? n : parseInt(String(n), 10);
  if (!Number.isFinite(v)) return dflt;
  return Math.max(min, Math.min(max, v));
}

function usage(): void {
  console.error(`jobs-ie-search — WebSearch-driven CLI for jobs.ie (Ireland)

usage:
  search   --query Q [--location L] [--remote] [--limit N]
  detail   --url U
  tags
  health

Primary source: DuckDuckGo HTML search of site:jobs.ie. Detail: direct
fetch only for URLs in jobs.ie's robots.txt allow-list.`);
}

async function main(): Promise<number> {
  const argv = process.argv.slice(2);
  const sub = argv[0];
  const rest = argv.slice(1);
  switch (sub) {
    case "search": return await cmdSearch(rest);
    case "detail": return await cmdDetail(rest);
    case "tags": return await cmdTags();
    case "health": return await cmdHealth();
    case "-h":
    case "--help":
    case undefined:
      usage(); return 0;
    default:
      console.error(`unknown subcommand: ${sub}`);
      usage();
      return 2;
  }
}

await main();
