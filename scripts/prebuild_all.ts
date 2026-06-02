/**
 * scripts/prebuild_all.ts
 *
 * Architecture-audit strategy E (2026-05-27).
 *
 * Parallel runner for the prebuild quality-gate chain. Replaces the
 * 25-script `&&`-chained `prebuild` script in package.json with a
 * single process that spawns the gates in parallel via Node's
 * `child_process.spawn`, then aggregates exit codes.
 *
 * Why: serial wall-clock was ~60s (sum of all gates). Each gate is
 * a self-contained subprocess reading its own files; nothing depends
 * on another gate's output. Parallel wall-clock approaches the MAX
 * gate time (typically the slowest 3-4 gates) instead of the SUM.
 * Expected drop: ~60s → ~15s for warm cache.
 *
 * Concurrency cap: `--concurrency=<n>` (default 6). Avoids spawning
 * 25 simultaneous tsx processes on a small developer machine.
 *
 * Honors --bail (default true): on first failure, kill the rest and
 * exit non-zero immediately so CI doesn't waste cycles. Pass
 * --no-bail to run all gates and aggregate the full failure list.
 *
 * Run: npx tsx scripts/prebuild_all.ts
 */
import { spawn } from "node:child_process";
import path from "node:path";

type Gate = {
  /** Display name (shown in the log). */
  name: string;
  /** tsx-runnable path (relative to repo root). */
  script: string;
  /** Optional CLI args appended after the script path. */
  args?: string[];
};

/**
 * The full gate chain. Order is informational only — gates run in
 * parallel. Keep this list in sync with package.json `prebuild`.
 */
const GATES: Gate[] = [
  { name: "taxonomy", script: "scripts/verify_taxonomy.ts" },
  { name: "no-em-dashes", script: "scripts/verify_no_em_dashes.ts" },
  { name: "no-source-agencies", script: "scripts/verify_no_source_agencies.ts" },
  { name: "no-hardcoded-hex", script: "scripts/verify_hardcoded_hex.ts" },
  { name: "dead-links", script: "scripts/audit/find_dead_links.ts", args: ["--strict"] },
  { name: "featured-tiles", script: "scripts/verify_featured_tiles.ts" },
  { name: "render-guards", script: "scripts/verify_render_guards.ts" },
  { name: "deepening", script: "scripts/verify_deepening.ts" },
  { name: "monetization-coverage", script: "scripts/verify_monetization_coverage.ts" },
  { name: "v34-research-rules", script: "scripts/verify_v34_research_rules.ts" },
  { name: "no-internal-notes", script: "scripts/verify_no_internal_notes.ts" },
  { name: "top-industries-plausibility", script: "tests/cells/top_industries_plausibility.test.ts" },
  { name: "geo-region-name", script: "tests/cells/geo_region_name.test.ts" },
  { name: "useless-tiles", script: "scripts/audit/find_useless_tiles.ts" },
  { name: "typography", script: "scripts/verify_typography_consistency.ts" },
  { name: "signature-quality", script: "scripts/verify_signature_quality.ts" },
  { name: "cost-share-invariant", script: "scripts/verify_cost_share_invariant.ts" },
  { name: "key-benchmark", script: "scripts/verify_key_benchmark_assignment.ts" },
  { name: "comparative-voice", script: "scripts/verify_comparative_voice.ts" },
  { name: "turnover-bands", script: "scripts/verify_turnover_bands.ts" },
  { name: "wage-source", script: "scripts/verify_wage_source_consistency.ts" },
  { name: "city-wages", script: "scripts/verify_city_wage_premiums.ts" },
  { name: "industry-medians", script: "scripts/verify_industry_medians.ts" },
  { name: "econ-profile-integrity", script: "scripts/verify_economic_profile_integrity.ts" },
  { name: "au-industry-map", script: "scripts/verify_au_industry_map.ts" },
  { name: "au-anchor-render", script: "scripts/verify_au_primary_anchor_render.ts" },
  { name: "layering", script: "scripts/verify_layering.ts" },
  { name: "section-order", script: "scripts/verify_section_order.ts" },
];

/** CLI arg parsing. */
const argv = process.argv.slice(2);
const concurrencyArg = argv.find((a) => a.startsWith("--concurrency="));
// Default concurrency 4 (was 6). 6 hit Windows resource limits with
// some gates intermittently segfaulting (exit 134 / Windows 0xC0000005)
// when the system was already loaded. 4 keeps wall-clock close to
// optimal (~30s for 25 gates) without that failure mode.
const CONCURRENCY = concurrencyArg ? Math.max(1, parseInt(concurrencyArg.split("=")[1], 10)) : 4;
const BAIL = !argv.includes("--no-bail");
const QUIET = argv.includes("--quiet");

type GateResult = {
  name: string;
  exitCode: number;
  durationMs: number;
  stdoutTail: string;
  stderrTail: string;
};

function runGate(gate: Gate): Promise<GateResult> {
  return new Promise((resolve) => {
    const started = Date.now();
    const args = ["tsx", gate.script, ...(gate.args ?? [])];
    // shell: true is required on Windows to spawn `npx` (which
    // resolves to `npx.cmd`); Node 22+ refuses to spawn .cmd files
    // directly with EINVAL. The DEP0190 deprecation warning this
    // triggers is acceptable here because every arg is a hardcoded
    // literal from the GATES array — no caller-controlled input.
    const child = spawn("npx", args, {
      shell: process.platform === "win32",
      env: process.env,
    });
    const stdoutBuf: string[] = [];
    const stderrBuf: string[] = [];
    child.stdout.on("data", (b: Buffer) => stdoutBuf.push(b.toString()));
    child.stderr.on("data", (b: Buffer) => stderrBuf.push(b.toString()));
    child.on("close", (code) => {
      resolve({
        name: gate.name,
        exitCode: code ?? 1,
        durationMs: Date.now() - started,
        stdoutTail: stdoutBuf.join("").split("\n").slice(-20).join("\n"),
        stderrTail: stderrBuf.join("").split("\n").slice(-20).join("\n"),
      });
    });
    child.on("error", (err) => {
      resolve({
        name: gate.name,
        exitCode: 1,
        durationMs: Date.now() - started,
        stdoutTail: "",
        stderrTail: `spawn error: ${err.message}`,
      });
    });
  });
}

/** Worker-pool runner: caps concurrency, optionally bails on failure. */
async function runAll(gates: Gate[]): Promise<GateResult[]> {
  const results: GateResult[] = [];
  let nextIdx = 0;
  let bailed = false;
  const inFlight = new Set<Promise<void>>();
  const workers: Promise<void>[] = [];

  function maybeStart(): Promise<void> | null {
    if (bailed) return null;
    if (nextIdx >= gates.length) return null;
    const gate = gates[nextIdx++];
    const p = runGate(gate).then((r) => {
      results.push(r);
      if (!QUIET) {
        const sym = r.exitCode === 0 ? "✓" : "✗";
        const secs = (r.durationMs / 1000).toFixed(1);
        console.log(`  ${sym} ${gate.name.padEnd(28)} ${secs}s`);
      }
      if (r.exitCode !== 0 && BAIL) bailed = true;
    });
    inFlight.add(p);
    p.finally(() => inFlight.delete(p));
    return p;
  }

  // Prime the pool.
  for (let i = 0; i < CONCURRENCY; i++) {
    const p = maybeStart();
    if (p) workers.push(p);
  }
  // Keep replenishing until done.
  while (inFlight.size > 0) {
    await Promise.race(inFlight);
    const p = maybeStart();
    if (p) workers.push(p);
  }
  return results;
}

async function main() {
  const started = Date.now();
  console.log(`=== prebuild_all  (${GATES.length} gates, concurrency=${CONCURRENCY}) ===`);
  console.log("");
  const results = await runAll(GATES);
  const wall = ((Date.now() - started) / 1000).toFixed(1);
  const fails = results.filter((r) => r.exitCode !== 0);
  console.log("");
  console.log(`=== Summary ===`);
  console.log(`  Ran: ${results.length} / ${GATES.length} gates`);
  console.log(`  Wall-clock: ${wall}s`);
  console.log(`  Passed: ${results.length - fails.length}`);
  console.log(`  Failed: ${fails.length}`);

  if (fails.length > 0) {
    console.log("");
    console.log("=== Failures ===");
    for (const f of fails) {
      console.log(`\n--- ${f.name} (exit ${f.exitCode}) ---`);
      if (f.stdoutTail.trim()) console.log(f.stdoutTail);
      if (f.stderrTail.trim()) console.log(f.stderrTail);
    }
    process.exit(1);
  }
  console.log("\n  GATE: PASS");
}

void path; // reserved for future absolute-path resolution if needed
main().catch((err) => {
  console.error("prebuild_all crashed:", err);
  process.exit(1);
});
