/**
 * Smoke tests for the jobs-ie-search CLI.
 *
 * These hit the live DuckDuckGo HTML endpoint (and jobs.ie for detail). Set
 * JOBSIE_OFFLINE=1 to skip the network calls.
 */

import { describe, test, expect } from "bun:test";

const isOffline = !!process.env.JOBSIE_OFFLINE;

describe("jobs-ie-search CLI", () => {
  test("search returns JSON lines with the expected shape", async () => {
    if (isOffline) return;
    const proc = Bun.spawn(
      ["bun", "run", "src/cli.ts", "search", "--query", "react", "--location", "Dublin", "--limit", "3"],
      { cwd: import.meta.dir + "/..", stdout: "pipe", stderr: "pipe" },
    );
    const out = await new Response(proc.stdout).text();
    const err = await new Response(proc.stderr).text();
    const code = await proc.exited;
    // We don't assert on the number of results — DDG can return 0 if it hasn't
    // indexed the page or rate-limits. The shape is what matters when results
    // exist.
    expect([0, 1]).toContain(code);
    for (const line of out.trim().split("\n").filter(Boolean)) {
      const o = JSON.parse(line);
      expect(o).toHaveProperty("id");
      expect(o.id).toMatch(/^jobsie:/);
      expect(o).toHaveProperty("url");
      expect(o.url).toContain("jobs.ie");
      expect(o.via).toBe("websearch");
    }
    if (code === 1) {
      // Acceptable: the search may return 0 results if DDG hasn't indexed.
      expect(err).toBeTruthy();
    }
  });

  test("health subcommand reports a status", async () => {
    if (isOffline) return;
    const proc = Bun.spawn(
      ["bun", "run", "src/cli.ts", "health"],
      { cwd: import.meta.dir + "/..", stdout: "pipe", stderr: "pipe" },
    );
    const err = await new Response(proc.stderr).text();
    const code = await proc.exited;
    expect([0, 1]).toContain(code);
    expect(err).toMatch(/healthy|degraded|unreachable/);
  });

  test("detail refuses URLs not in the allow-list", async () => {
    const proc = Bun.spawn(
      ["bun", "run", "src/cli.ts", "detail", "--url", "https://www.jobs.ie/account/signin"],
      { cwd: import.meta.dir + "/..", stdout: "pipe", stderr: "pipe" },
    );
    const err = await new Response(proc.stderr).text();
    const code = await proc.exited;
    expect(code).toBe(1);
    expect(err).toMatch(/allow-list/);
  });
});
