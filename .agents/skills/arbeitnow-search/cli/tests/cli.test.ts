/**
 * Smoke tests for the arbeitnow-search CLI.
 *
 * These hit the live arbeitnow API. If you want to run them offline, set
 * ARBEITNOW_OFFLINE=1 in the environment.
 */

import { describe, test, expect } from "bun:test";

const isOffline = !!process.env.ARBEITNOW_OFFLINE;

describe("arbeitnow-search CLI", () => {
  test("search returns JSON lines with the expected shape", async () => {
    if (isOffline) return;
    const proc = Bun.spawn(
      ["bun", "run", "src/cli.ts", "search", "--tag", "react", "--limit", "3"],
      { cwd: import.meta.dir + "/..", stdout: "pipe", stderr: "pipe" },
    );
    const out = await new Response(proc.stdout).text();
    const err = await new Response(proc.stderr).text();
    const code = await proc.exited;
    expect(code).toBe(0);
    if (out.trim()) {
      const lines = out.trim().split("\n");
      expect(lines.length).toBeGreaterThanOrEqual(1);
      const first = JSON.parse(lines[0]);
      expect(first).toHaveProperty("id");
      expect(first).toHaveProperty("title");
      expect(first).toHaveProperty("company");
      expect(first).toHaveProperty("url");
      expect(first.id).toMatch(/^arbeitnow:/);
    } else {
      // No React results at the moment — at least the API was reachable.
      expect(err).toMatch(/healthy|degraded/);
    }
  });

  test("health subcommand reports status on stderr", async () => {
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

  test("tags and locations produce tab-separated output", async () => {
    if (isOffline) return;
    for (const sub of ["tags", "locations"]) {
      const proc = Bun.spawn(
        ["bun", "run", "src/cli.ts", sub],
        { cwd: import.meta.dir + "/..", stdout: "pipe", stderr: "pipe" },
      );
      const out = await new Response(proc.stdout).text();
      const code = await proc.exited;
      expect(code).toBe(0);
      // Output is "N\tvalue" per line; tolerate empty
      for (const line of out.trim().split("\n").filter(Boolean)) {
        expect(line).toMatch(/^\d+\t.+$/);
      }
    }
  });
});
