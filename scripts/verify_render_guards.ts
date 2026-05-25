/**
 * Prebuild guard — assert the render-time data-quality fixes are wired.
 *
 * Plan v32 Phase 6. Two render-time fixes ship in src/lib/qa/:
 *   - currency_corrections.ts (Mexico FX divide-by-17.5 band-aid)
 *   - plausibility_suppression.ts (null out catastrophic-scale cells)
 *
 * Both must be imported and invoked in src/lib/cells.ts inside the
 * normalization functions, or the live site silently goes back to
 * showing "$1.8B average grocery store in Switzerland" and "$5M
 * average Mexican firm" (i.e., 17x too high).
 *
 * This script reads both qa/* files and src/lib/cells.ts as text and
 * verifies the wiring. It is intentionally crude — just substring
 * matches — so it catches the obvious regression of "someone deleted
 * the import" or "someone deleted a CURRENCY_FX_CORRECTIONS entry"
 * without spinning up the type system.
 *
 * Run: `npx tsx scripts/verify_render_guards.ts`
 * Exit 1 on any missing wiring.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const CELLS = resolve(ROOT, "src/lib/cells.ts");
const FX = resolve(ROOT, "src/lib/qa/currency_corrections.ts");
const SUP = resolve(ROOT, "src/lib/qa/plausibility_suppression.ts");
// Country-page rebuild (2026-05-25): the pure aggregation helper used by
// getTopIndustriesForCountry's non-US path was split into its own file so
// it could be unit-tested without booting Supabase. The render-guard now
// concatenates both files when checking the "at-a-glance row" wiring.
const TOP_IND_AGG = resolve(
  ROOT,
  "src/lib/cells/top_industries_aggregation.ts",
);

const errors: string[] = [];

function read(path: string): string {
  try {
    return readFileSync(path, "utf-8");
  } catch {
    errors.push(`missing file: ${path}`);
    return "";
  }
}

const cellsSrc = read(CELLS);
const fxSrc = read(FX);
const supSrc = read(SUP);

// 1. currency_corrections imports + wiring
if (!cellsSrc.includes("applyCurrencyCorrection")) {
  errors.push("src/lib/cells.ts: applyCurrencyCorrection is not imported or called");
}
const currencyCallsInNormalize = (cellsSrc.match(/applyCurrencyCorrection\(/g) || []).length;
if (currencyCallsInNormalize < 3) {
  errors.push(
    `src/lib/cells.ts: applyCurrencyCorrection called only ${currencyCallsInNormalize} times, expected >= 3 (normalizeRegionalRow, normalizeRow, getExtrapolatedCell)`,
  );
}

// 2. CURRENCY_FX_CORRECTIONS must have the Mexico entry. If Mexico's
// audit ever gets fixed and the entry can come out, update this guard
// too.
if (!fxSrc.includes("MX:") && !fxSrc.includes('"MX":')) {
  errors.push(
    "src/lib/qa/currency_corrections.ts: MX entry missing. Mexico cells regressed to 17x overstatement.",
  );
}

// 3. plausibility_suppression wiring
if (!cellsSrc.includes("applyPlausibilitySuppression")) {
  errors.push("src/lib/cells.ts: applyPlausibilitySuppression is not imported or called");
}
const suppressionCallsInNormalize = (cellsSrc.match(/applyPlausibilitySuppression\(/g) || []).length;
if (suppressionCallsInNormalize < 3) {
  errors.push(
    `src/lib/cells.ts: applyPlausibilitySuppression called only ${suppressionCallsInNormalize} times, expected >= 3 (normalizeRegionalRow, normalizeRow, getExtrapolatedCell)`,
  );
}

// 4. The suppression module must reference REVENUE_PER_FIRM_BOUNDS so
// the bounds table actually drives the ceiling. If someone replaces
// the import with a hardcoded constant the suppression loses
// per-industry granularity.
if (!supSrc.includes("REVENUE_PER_FIRM_BOUNDS")) {
  errors.push(
    "src/lib/qa/plausibility_suppression.ts: no longer imports REVENUE_PER_FIRM_BOUNDS; per-industry ceilings broken",
  );
}

// 5. getTopIndustriesForCountry (country-page at-a-glance) must apply
// both fixes at the row level since its rows skip normalize*. Country-
// page rebuild (2026-05-25) moved the pure aggregation into
// top_industries_aggregation.ts; scan that file too.
if (cellsSrc.includes("getTopIndustriesForCountry")) {
  const aggSrc = read(TOP_IND_AGG);
  const combined = cellsSrc + "\n" + aggSrc;
  if (!combined.includes("CURRENCY_FX_CORRECTIONS")) {
    errors.push(
      "src/lib/cells.ts + top_industries_aggregation.ts: CURRENCY_FX_CORRECTIONS not referenced; at-a-glance row FX correction regressed",
    );
  }
  // Country-page rebuild: the function now uses
  // countryPagePlausibilityCeiling (industry.hi * 3) which is tighter
  // than the site-wide getCatastropheCeiling (industry.hi * 10). Accept
  // either: the requirement is that SOME plausibility ceiling is applied
  // at the row level before aggregation.
  if (
    !combined.includes("countryPagePlausibilityCeiling") &&
    !combined.includes("getCatastropheCeiling")
  ) {
    errors.push(
      "src/lib/cells.ts + top_industries_aggregation.ts: no per-row plausibility ceiling applied; at-a-glance can leak wrong-aggregation values",
    );
  }
}

if (errors.length > 0) {
  console.error("\n✗ Render-guard verification failed:");
  for (const e of errors) console.error("  - " + e);
  console.error(
    "\n  These guards exist because the underlying data has known bugs",
  );
  console.error(
    "  (Mexican cells stored in MXN, Swiss/LI/MC small-state revenue",
  );
  console.error(
    "  inflation). The render layer corrects them. Restore the wiring",
  );
  console.error("  before shipping.\n");
  process.exit(1);
}

console.log("✓ Render-time data-quality guards wired correctly.");
