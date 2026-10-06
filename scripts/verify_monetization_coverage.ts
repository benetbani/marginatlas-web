/**
 * verify_monetization_coverage , prebuild gate for v34 Phase 0Q.
 *
 * Runs the monetization-coverage orchestrator. Fails the build if
 * any gate is RED, and since 2026-10-06 if any is PENDING: Phase 0Q
 * shipped stubs that would flip as Phases A-E landed, and ten of them
 * never flipped and passed for months (a page read at a path it had
 * left, a retired route, and v34's Phase C, which the route-decided
 * lock of milestone 2 replaced). Every check has a rule now, so a
 * pending one is a check that stopped seeing its page.
 *
 * THE RED (2026-09-17, plan-2026-09-17/02-ERRORS.md step 16): one canonical
 * line per RED page gate, naming the page's source file (the check reads it,
 * so the result carries it), the coverage gate and its message, and the
 * remedy; then a count line. Before this the gate printed only the count and
 * pointed at an HTML report nobody opens from a build log.
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 7.1.
 */

import { buildReport } from "./audit/monetization/run_coverage";
import { ALL_GATES } from "./audit/monetization/types";
import { red as redLine, redSummary } from "./lib/red";

const RULE = "monetization-coverage";

const report = buildReport();
const { green, red, pending } = report.totals;

console.log(
  `[verify_monetization_coverage] ${green} green, ${red} red, ${pending} pending`,
);

if (red > 0 || pending > 0) {
  for (const p of report.pages) {
    for (const g of ALL_GATES) {
      const r = p.gates[g];
      if (r.status === "GREEN") continue;
      redLine({
        rule: RULE,
        file: p.sourceFile ?? "scripts/audit/monetization/page_checks.ts",
        detail: `${p.pagePattern} fails coverage gate ${g}: ${r.message}${r.evidence ? ` (${r.evidence})` : ""}`,
        remedy: `satisfy gate ${g} on that page, per docs/strategy/2026-05-25-monetization-mega-plan-v34.md Part 7.1; the per-page matrix is coverage/monetization-coverage.html`,
      });
    }
  }
  redSummary(RULE, red + pending, "satisfy each page gate named above (a pending gate is a check that stopped seeing its page)", `${green} green, ${red} red, ${pending} pending`);
  process.exit(1);
}

process.exit(0);
