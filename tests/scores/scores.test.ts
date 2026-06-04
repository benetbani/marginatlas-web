/**
 * tests/scores/scores.test.ts
 *
 * Plain assertion test for the proprietary score engine (bible Sections 10,
 * 21). Verifies banding, graceful omission (hide-weakness), value bounds,
 * and determinism. Run: npx tsx tests/scores/scores.test.ts
 */
import { computeScores, bandOf } from "@/lib/scores";
import type { Cell } from "@/lib/cells";

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error("  x " + msg);
    failures++;
  }
}

function mkCell(partial: Partial<Cell>): Cell {
  return {
    country: "PT",
    geo_id: "lisbon",
    geo_level: "city",
    geo_name: "Lisbon",
    size_band: null,
    year: 2024,
    ...partial,
  } as unknown as Cell;
}

// 1. Strong cell: all core scores present, opportunity solid, values in bounds.
{
  const cell = mkCell({
    revenue_per_firm: 300000,
    rev_p50: 300000,
    rev_p10: 90000,
    rev_p90: 800000,
    net_margin: 0.2,
    net_profit: 90000,
    payroll_per_employee: 28000,
    cost_structure: { cogs: 30, labor: 30, rent: 6, other: 34 },
  });
  const r = computeScores(cell, { cityTier: 2 });
  assert(r.scores.length >= 3, "strong cell yields 3+ component scores");
  assert(r.opportunity != null, "strong cell has an opportunity score");
  assert((r.opportunity?.value ?? 0) >= 60, "strong cell opportunity is at least workable");
  for (const s of r.scores) {
    assert(
      Number.isInteger(s.value) && s.value >= 1 && s.value <= 99,
      `score ${s.id} is an integer within 1..99`,
    );
    assert(!s.blurb.includes("—"), `score ${s.id} blurb has no em-dash`);
  }
}

// 2. Weak cell: thin margin + heavy rent push the relevant scores low.
{
  const cell = mkCell({
    revenue_per_firm: 80000,
    rev_p50: 80000,
    net_margin: 0.03,
    net_profit: 5000,
    payroll_per_employee: 26000,
    cost_structure: { cogs: 40, labor: 35, rent: 20, other: 5 },
  });
  const r = computeScores(cell, { cityTier: 1 });
  const rent = r.scores.find((s) => s.id === "rent");
  assert(rent != null && rent.value <= 40, "heavy rent yields low rent headroom");
  const prof = r.scores.find((s) => s.id === "profitability");
  assert(prof != null && prof.value <= 40, "thin margin yields low profitability");
}

// 3. Missing cost_structure: rent omitted, profitability still computes.
{
  const cell = mkCell({
    revenue_per_firm: 120000,
    net_margin: 0.1,
    net_profit: 18000,
    payroll_per_employee: 25000,
  });
  const r = computeScores(cell, {});
  assert(!r.scores.some((s) => s.id === "rent"), "no cost_structure omits the rent score");
  assert(r.scores.some((s) => s.id === "profitability"), "profitability survives missing cost_structure");
}

// 4. Empty cell: nothing computable, nothing shown.
{
  const r = computeScores(mkCell({}), {});
  assert(r.scores.length === 0, "empty cell yields no scores");
  assert(r.opportunity === null, "empty cell yields a null opportunity");
}

// 5. Determinism: identical input gives identical output.
{
  const cell = mkCell({
    revenue_per_firm: 200000,
    net_margin: 0.12,
    net_profit: 24000,
    payroll_per_employee: 27000,
    cost_structure: { cogs: 35, labor: 28, rent: 10, other: 27 },
  });
  const a = JSON.stringify(computeScores(cell, { cityTier: 2 }));
  const b = JSON.stringify(computeScores(cell, { cityTier: 2 }));
  assert(a === b, "computeScores is deterministic");
}

// 6. Band boundaries match the bible's cutoffs.
assert(
  bandOf(80) === "strong" &&
    bandOf(79) === "workable" &&
    bandOf(60) === "workable" &&
    bandOf(59) === "mixed" &&
    bandOf(40) === "mixed" &&
    bandOf(39) === "weak" &&
    bandOf(20) === "weak" &&
    bandOf(19) === "avoid",
  "band boundaries are 80/60/40/20",
);

if (failures > 0) {
  console.error(`\nscores.test: FAIL (${failures} assertion(s))`);
  process.exit(1);
}
console.log("scores.test: PASS. Score engine banded, omitting, and deterministic.");
