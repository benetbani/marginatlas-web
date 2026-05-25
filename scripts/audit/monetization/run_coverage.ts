/**
 * run_coverage — orchestrator for the v34 monetization-coverage audit.
 *
 * Runs every page check in scripts/audit/monetization/page_checks.ts,
 * aggregates results into a CoverageReport, writes the HTML to
 * coverage/monetization-coverage.html, and exits 0 if no gate is RED.
 *
 * Used by:
 *   - the standalone CLI: `npx tsx scripts/audit/monetization/run_coverage.ts`
 *   - the prebuild gate: scripts/verify_monetization_coverage.ts
 *
 * Phase 0Q: every gate returns PENDING; exit is always 0.
 * Phase A onward: gates flip to GREEN / RED based on source-tree state.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ALL_CHECKS } from "./page_checks";
import { ALL_GATES, CoverageReport } from "./types";
import { renderHtml } from "./render_html";

export function buildReport(): CoverageReport {
  const pages = ALL_CHECKS.map((fn) => fn());
  let green = 0;
  let red = 0;
  let pending = 0;
  for (const p of pages) {
    for (const g of ALL_GATES) {
      const s = p.gates[g].status;
      if (s === "GREEN") green++;
      else if (s === "RED") red++;
      else pending++;
    }
  }
  return {
    generatedAt: new Date().toISOString(),
    planVersion: "v34",
    pages,
    totals: { green, red, pending },
  };
}

function main(): void {
  const report = buildReport();
  const outDir = resolve(process.cwd(), "coverage");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    resolve(outDir, "monetization-coverage.json"),
    JSON.stringify(report, null, 2),
  );
  writeFileSync(
    resolve(outDir, "monetization-coverage.html"),
    renderHtml(report),
  );

  const t = report.totals;
  console.log(
    `[monetization-coverage] plan ${report.planVersion}: ` +
      `${t.green} green, ${t.red} red, ${t.pending} pending`,
  );
  console.log(
    "[monetization-coverage] wrote coverage/monetization-coverage.html",
  );

  if (t.red > 0) {
    // List every RED gate for the prebuild log.
    for (const p of report.pages) {
      for (const g of ALL_GATES) {
        const r = p.gates[g];
        if (r.status === "RED") {
          console.error(
            `[monetization-coverage] RED: ${p.pagePattern} -> ${g}: ${r.message}`,
          );
        }
      }
    }
    process.exit(1);
  }
  process.exit(0);
}

// Only run when invoked directly, not when imported.
const argvOne = process.argv[1] ?? "";
if (argvOne.endsWith("run_coverage.ts") || argvOne.endsWith("run_coverage.js")) {
  main();
}
