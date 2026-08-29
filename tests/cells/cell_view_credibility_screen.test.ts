/**
 * cell_view_credibility_screen.test.ts
 *
 * Regression test for the 2026-08-29 take-home defect at the trade-page layer.
 *
 * The engine (estimateNetProfit -> resolveOwnerTakeHome) converts whatever
 * revenue a cell carries into an owner take-home. When a country-aggregate
 * cell carries chain-scale revenue, that keep is visibly wrong: a UK gym
 * owner "keeping" $513K against a $38.4K median wage, a Chad gym owner
 * keeping $231K against $3K. The country page withholds such keeps behind
 * its credibility screen (founder-decided 2026-08-29: withhold any keep above
 * SIX TIMES the country's median full-time pay, and since the same day any
 * keep below a TWENTIETH of it). Both bounds live in
 * src/lib/finance/keep_credibility.ts. This test pins that formula at the cell_view
 * layer, so no trade-page surface (masthead stat, title, narrative,
 * owner-keeps section, and everything derived from them) can print a keep
 * the country page would refuse.
 *
 * The withheld keep self-omits: every consuming section already renders its
 * honest empty state (SectionEmpty / the revenue-only narrative) when the
 * take-home is null, which is the sanctioned fallback. No replacement figure
 * is ever synthesized.
 *
 * Run: npx tsx tests/cells/cell_view_credibility_screen.test.ts
 */

import { buildCellView, type CellViewInput } from "../../src/lib/cells/cell_view";
import type { Cell } from "../../src/lib/cells";

const errors: string[] = [];
function expect(cond: boolean, msg: string) {
  if (!cond) errors.push(msg);
}

/** A minimal trusted-looking cell; only the fields cell_view reads. */
const CELL = {
  country: "GB",
  geo_id: "GBR",
  geo_level: "region",
  geo_name: "United Kingdom",
  industry_id: "auto_repair_shops",
  industry_description: "Auto repair shops",
  size_band: null,
  year: 2024,
  rev_p10: null,
  rev_p25: null,
  rev_p50: null,
  rev_p75: null,
  rev_p90: null,
} as unknown as Cell;

function baseInput(overrides: Partial<CellViewInput>): CellViewInput {
  return {
    cell: CELL,
    londonEntry: null,
    placeName: "United Kingdom",
    tradeName: "Auto repair shops",
    tradeNoun: "auto repair shop",
    industrySlug: "auto-repair-shops",
    typicalRevenue: 1_656_417,
    netMarginPct: 18,
    ownerTakeHome: 292_977,
    firms: 30_000,
    breakInRating: 50,
    isTrustedLocal: true,
    costStructure: null,
    breakevenOrdersDaily: null,
    typicalOrdersDaily: null,
    employees: 4,
    wagePerEmployee: 46_000,
    peers: [],
    narrative: null,
    medianWageUsd: 38_400,
    ...overrides,
  };
}

// --- Test 1: a keep above 6x the median wage is WITHHELD everywhere the view
// carries it. $292,977 against a $38,400 median is 7.6x, the real UK
// auto-repair figure that failed the founder's smell test.
{
  const view = buildCellView(baseInput({}));
  expect(view.ownerKeeps === null, "ownerKeeps must be withheld at 7.6x the median wage");
  const stat = view.masthead.stats.find((s) => s.label === "Owner take-home");
  expect(stat != null && stat.value === null, "The masthead owner-take-home stat must dash");
  expect(
    !view.masthead.title.includes("clears about"),
    `The title must not lead with the withheld keep, got "${view.masthead.title}"`,
  );
  expect(
    view.narrative == null || !view.narrative.includes("keeps about"),
    "The narrative must not speak the withheld keep",
  );
  // The revenue surfaces are NOT this screen's business; they keep their own
  // gates (trust, plausibility suppression).
  expect(view.masthead.anchor != null, "The revenue anchor is not the keep screen's to withhold");
}

// --- Test 2: a believable keep passes untouched. $80K on a $38.4K median is
// 2.1x, inside the founder's generosity bound.
{
  const view = buildCellView(baseInput({ ownerTakeHome: 80_000 }));
  expect(
    view.ownerKeeps != null && view.ownerKeeps.takeHome === 80_000,
    "A 2.1x-median keep must pass the screen unchanged",
  );
}

// --- Test 3: exactly 6x the median passes; the screen is strictly above.
{
  const view = buildCellView(baseInput({ ownerTakeHome: 38_400 * 6 }));
  expect(
    view.ownerKeeps != null && view.ownerKeeps.takeHome === 38_400 * 6,
    "A keep at exactly 6x the median must pass (the screen is strictly above)",
  );
}

// --- Test 4: no median wage held, screen cannot run, the keep passes with its
// modeled tag (a screen with no yardstick withholding figures would be
// guesswork in the other direction, same ruling as the country page).
{
  const view = buildCellView(baseInput({ medianWageUsd: null }));
  expect(
    view.ownerKeeps != null && view.ownerKeeps.takeHome === 292_977,
    "With no median wage the screen must not run",
  );
}

// --- Test 5: THE LOW BOUND. A keep under a twentieth of the median wage is an
// artifact, not a thin margin, and is withheld the same way. $1,247 against a
// $42,000 median is the real San Marino auto-repair figure the all-sizes blend
// fix produced: before it that pair read too high and the high screen hid it,
// after it read too low and nothing looked. See keep_credibility.ts.
{
  const view = buildCellView(baseInput({ ownerTakeHome: 1_247, medianWageUsd: 42_000 }));
  expect(view.ownerKeeps === null, "A keep at 0.03x the median must be withheld");
  const stat = view.masthead.stats.find((s) => s.label === "Owner take-home");
  expect(stat != null && stat.value === null, "The masthead stat must dash on a too-low keep");
  expect(
    !view.masthead.title.includes("clears about"),
    `The title must not lead with a withheld low keep, got "${view.masthead.title}"`,
  );
}

// --- Test 6: exactly a twentieth passes; the low screen is strictly below.
{
  const view = buildCellView(baseInput({ ownerTakeHome: 38_400 / 20 }));
  expect(
    view.ownerKeeps != null && view.ownerKeeps.takeHome === 38_400 / 20,
    "A keep at exactly median/20 must pass (the screen is strictly below)",
  );
}

// --- Test 7: a thin but real keep is NOT withheld. The low bound is set to
// catch artifacts, not to punish a genuinely marginal business: median/8 is
// thin and stays.
{
  const view = buildCellView(baseInput({ ownerTakeHome: 38_400 / 8 }));
  expect(
    view.ownerKeeps != null,
    "A thin-but-real keep at median/8 must survive the screen",
  );
}

// --- Test 8: the low screen cannot run without a median either.
{
  const view = buildCellView(baseInput({ ownerTakeHome: 1_247, medianWageUsd: null }));
  expect(
    view.ownerKeeps != null && view.ownerKeeps.takeHome === 1_247,
    "With no median wage the low screen must not run",
  );
}

// --- Test 9: the trust gate is untouched. An untrusted cell shows no money
// regardless of what the screen would say.
{
  const view = buildCellView(baseInput({ ownerTakeHome: 80_000, isTrustedLocal: false }));
  expect(view.ownerKeeps === null, "An untrusted cell must still hide its money");
}

if (errors.length > 0) {
  console.error(`cell_view_credibility_screen: FAIL with ${errors.length} issue(s):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

console.log("cell_view_credibility_screen: PASS. The keep credibility band holds at the trade-page layer.");
