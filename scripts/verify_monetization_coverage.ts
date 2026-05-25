/**
 * verify_monetization_coverage — prebuild gate for v34 Phase 0Q.
 *
 * Runs the monetization-coverage orchestrator. Fails the build if
 * any gate is RED. PENDING gates are allowed (Phase 0Q is shipping
 * stubs that flip to GREEN/RED as Phases A-E land).
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 7.1.
 */

import { buildReport } from "./audit/monetization/run_coverage";

const report = buildReport();
const { green, red, pending } = report.totals;

console.log(
  `[verify_monetization_coverage] ${green} green, ${red} red, ${pending} pending`,
);

if (red > 0) {
  console.error(
    `[verify_monetization_coverage] FAIL: ${red} RED gate(s) detected. ` +
      `Open coverage/monetization-coverage.html for the per-page matrix.`,
  );
  process.exit(1);
}

process.exit(0);
