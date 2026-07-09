/**
 * Run: npx tsx tests/scores/recommend_core.test.ts
 * The pure recommender adapters: map a real row (CityColumn / CityActivityRow) +
 * its city demand onto the composite, rank by it (nulls last), and budget-filter
 * (never excluding on an unknown cost, counting the honest omitted total).
 */
import {
  compositeForColumn,
  compositeForActivityRow,
  rankByComposite,
  filterByBudget,
} from "@/lib/scores/recommend_core";
import type { CityColumn } from "@/lib/markets/across_cities";
import type { CityActivityRow } from "@/lib/scores/city_board";

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error("  x " + msg);
    failures++;
  }
}

function mkColumn(p: Partial<CityColumn>): CityColumn {
  return {
    name: "London",
    country: "gb",
    href: "/gb/london/restaurants",
    revenue: 500_000,
    revP10: null,
    revP90: null,
    takeHome: 60_000,
    netMarginFraction: 0.12,
    densityPer10k: 8,
    startupCostUsd: 300_000,
    breakevenDaily: null,
    typicalDaily: null,
    survivalYr5: 55,
    breakInScore: 60,
    breakInBand: "manageable",
    ...p,
  } as CityColumn;
}

function mkRow(p: Partial<CityActivityRow>): CityActivityRow {
  return {
    name: "Dental practices",
    slug: "dental-practices",
    href: "/gb/london/dental-practices",
    breakInScore: 62,
    breakInBand: "manageable",
    takeHome: 90_000,
    netMarginPct: 20,
    startupCostUsd: 250_000,
    survivalYr5: 60,
    densityPer10k: 5,
    ...p,
  } as CityActivityRow;
}

// column mapping: netMarginFraction -> keepPct*100; null margin -> null composite.
{
  const withMargin = compositeForColumn(mkColumn({}), 60);
  assert(withMargin !== null, "a column with a margin scores");
  assert(withMargin !== null && withMargin.axes.keep === 48, "column keep maps netMarginFraction*100 (0.12 -> 12% -> 48), not the raw fraction");
  const noMargin = compositeForColumn(mkColumn({ netMarginFraction: null }), 60);
  assert(noMargin === null, "a column with no net margin -> null composite (keep anchor)");
}

// activity-row mapping uses netMarginPct + survivalYr5 directly.
{
  const r = compositeForActivityRow(mkRow({}), 55);
  assert(r !== null && r.axes.keep !== null, "an activity row with a margin scores");
  assert(r !== null && r.axes.keep === 74, "row keep uses netMarginPct as-is (20% -> 74), no extra *100");
  const noMargin = compositeForActivityRow(mkRow({ netMarginPct: null }), 55);
  assert(noMargin === null, "an activity row with no net margin -> null composite");
}

// ranking: descending by composite score, null composites sink to the end.
{
  type R = { id: string; composite: ReturnType<typeof compositeForColumn> };
  const rows: R[] = [
    { id: "lo", composite: compositeForColumn(mkColumn({ netMarginFraction: 0.05 }), 40) },
    { id: "hi", composite: compositeForColumn(mkColumn({ netMarginFraction: 0.28 }), 80) },
    { id: "none", composite: null },
  ];
  const ranked = rankByComposite(rows);
  assert(ranked[0].id === "hi", "highest composite ranks first");
  assert(ranked[ranked.length - 1].id === "none", "null composite sinks to last");
}

// budget filter: excludes over-budget known costs, KEEPS unknown costs, counts omitted.
{
  const rows = [
    { id: "cheap", startupCostUsd: 50_000 },
    { id: "dear", startupCostUsd: 500_000 },
    { id: "unknown", startupCostUsd: null },
  ];
  const { kept, omitted } = filterByBudget(rows, 100_000);
  assert(kept.map((r) => r.id).join(",") === "cheap,unknown", "keeps in-budget + unknown-cost rows");
  assert(omitted === 1, "counts the one over-budget row as omitted");
  const none = filterByBudget(rows, null);
  assert(none.kept.length === 3 && none.omitted === 0, "no budget -> keep all");
}

// a zero or negative budget keeps everything (the guard is !(budgetUsd > 0)).
{
  const rows = [{ id: "a", startupCostUsd: 50_000 }];
  assert(filterByBudget(rows, 0).kept.length === 1 && filterByBudget(rows, 0).omitted === 0, "budget 0 keeps all, omits none");
  assert(filterByBudget(rows, -5).kept.length === 1, "negative budget keeps all");
}

if (failures > 0) {
  console.error(`\nrecommend_core.test: FAIL (${failures} assertion(s))`);
  process.exit(1);
}
console.log("recommend_core.test: PASS. Row->composite mapping, null-anchored ranking, honest budget filter.");
