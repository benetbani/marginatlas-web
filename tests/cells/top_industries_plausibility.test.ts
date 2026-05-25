/**
 * top_industries_plausibility.test.ts
 *
 * Regression test for the country-page top-industries aggregation.
 *
 * The non-US path in getTopIndustriesForCountry previously ordered by
 * revenue DESC and kept the MAX per industry, which surfaced the
 * wrong-aggregation tail (whole-sector revenue masquerading as per-firm)
 * and produced bugs like "software dev in Albania $43M per firm".
 *
 * The country-page rebuild (2026-05-25) replaced that with:
 *   1. Pre-filter rows above industry.hi * 3 (countryPagePlausibilityCeiling).
 *   2. Group by industry_id and take the MEDIAN of the survivors.
 *   3. Drop industries with fewer than 3 surviving rows.
 *   4. Order by a curated SMB-density rank.
 *
 * This test feeds synthetic rows to aggregateExtrapolatedByIndustry and
 * asserts the bug class cannot recur.
 *
 * Run: npx tsx tests/cells/top_industries_plausibility.test.ts
 */

import {
  aggregateExtrapolatedByIndustry,
  countryPagePlausibilityCeiling,
  type ExtrapolatedRow,
} from "../../src/lib/cells/top_industries_aggregation";

const errors: string[] = [];

function expect(cond: boolean, msg: string) {
  if (!cond) errors.push(msg);
}

// --- Test 1: the Albania $43M bug class is killed.
// Five plausible restaurant rows + one wrong-aggregation outlier.
// The pre-filter must drop the outlier, the median must be from the
// plausible cluster, not from the tail.
{
  const rows: ExtrapolatedRow[] = [
    { industry_id: "restaurants", predicted_rev_per_firm: 120_000, quality_score: 60 },
    { industry_id: "restaurants", predicted_rev_per_firm: 180_000, quality_score: 55 },
    { industry_id: "restaurants", predicted_rev_per_firm: 240_000, quality_score: 50 },
    { industry_id: "restaurants", predicted_rev_per_firm: 320_000, quality_score: 45 },
    { industry_id: "restaurants", predicted_rev_per_firm: 410_000, quality_score: 40 },
    // Wrong-aggregation outlier: $43M for restaurants in Albania.
    // Industry ceiling for restaurants is $5M, so this is > 3x.
    { industry_id: "restaurants", predicted_rev_per_firm: 43_000_000, quality_score: 20 },
  ];
  const out = aggregateExtrapolatedByIndustry(rows, "AL", 12);
  const r = out.find((x) => x.industry_id === "restaurants");
  expect(!!r, "Albania restaurants row must be present after aggregation");
  if (r && r.revenue_per_firm != null) {
    expect(
      r.revenue_per_firm < 1_000_000,
      `Restaurants median should be under $1M after outlier filtering, got $${r.revenue_per_firm}`,
    );
    // Median of [120K, 180K, 240K, 320K, 410K] is 240K
    expect(
      Math.abs(r.revenue_per_firm - 240_000) < 1,
      `Restaurants median should be exactly $240K (median of the 5 plausible rows), got $${r.revenue_per_firm}`,
    );
  }
}

// --- Test 2: software_development with a $43M outlier in Albania.
// The user's exact complaint. Software dev ceiling is $50M, so $43M is
// below the 3x ceiling (= $150M) and survives the pre-filter. We need
// the MEDIAN to still suppress it because the other rows are tiny.
{
  const rows: ExtrapolatedRow[] = [
    { industry_id: "software_development", predicted_rev_per_firm: 80_000, quality_score: 50 },
    { industry_id: "software_development", predicted_rev_per_firm: 120_000, quality_score: 50 },
    { industry_id: "software_development", predicted_rev_per_firm: 200_000, quality_score: 50 },
    { industry_id: "software_development", predicted_rev_per_firm: 350_000, quality_score: 50 },
    { industry_id: "software_development", predicted_rev_per_firm: 43_000_000, quality_score: 20 },
  ];
  const out = aggregateExtrapolatedByIndustry(rows, "AL", 12);
  const r = out.find((x) => x.industry_id === "software_development");
  expect(!!r, "Albania software_development row must be present");
  if (r && r.revenue_per_firm != null) {
    // Median of [80K, 120K, 200K, 350K, 43M] is 200K (middle index of sorted 5).
    expect(
      r.revenue_per_firm < 1_000_000,
      `Software dev median in Albania should be under $1M, got $${r.revenue_per_firm}`,
    );
  }
}

// --- Test 3: statistical-noise floor. An industry with only 2 rows
// must be dropped from the output.
{
  const rows: ExtrapolatedRow[] = [
    { industry_id: "florists", predicted_rev_per_firm: 80_000, quality_score: 50 },
    { industry_id: "florists", predicted_rev_per_firm: 120_000, quality_score: 50 },
  ];
  const out = aggregateExtrapolatedByIndustry(rows, "AL", 12);
  expect(
    !out.find((x) => x.industry_id === "florists"),
    "Industries with fewer than 3 rows must be dropped (statistical-noise floor)",
  );
}

// --- Test 4: pre-filter ceiling math. countryPagePlausibilityCeiling
// must equal industry.hi * 3 for known industries.
{
  // restaurants.hi = $5M => ceiling = $15M
  const c = countryPagePlausibilityCeiling("restaurants");
  expect(
    c === 15_000_000,
    `countryPagePlausibilityCeiling('restaurants') should be $15M, got $${c}`,
  );
}

// --- Test 5: ordering by SMB-density rank. Restaurants (rank 1) must
// appear before legal_services (rank 32) when both are present.
{
  const rows: ExtrapolatedRow[] = [
    { industry_id: "legal_services", predicted_rev_per_firm: 200_000, quality_score: 60 },
    { industry_id: "legal_services", predicted_rev_per_firm: 240_000, quality_score: 60 },
    { industry_id: "legal_services", predicted_rev_per_firm: 280_000, quality_score: 60 },
    { industry_id: "restaurants", predicted_rev_per_firm: 100_000, quality_score: 30 },
    { industry_id: "restaurants", predicted_rev_per_firm: 150_000, quality_score: 30 },
    { industry_id: "restaurants", predicted_rev_per_firm: 200_000, quality_score: 30 },
  ];
  const out = aggregateExtrapolatedByIndustry(rows, "AL", 12);
  const restIdx = out.findIndex((x) => x.industry_id === "restaurants");
  const legalIdx = out.findIndex((x) => x.industry_id === "legal_services");
  expect(
    restIdx >= 0 && legalIdx >= 0,
    "Both restaurants and legal_services should be present in output",
  );
  expect(
    restIdx < legalIdx,
    `Restaurants (density rank 1) must surface before legal_services (rank 32); got rest=${restIdx}, legal=${legalIdx}`,
  );
}

// --- Test 6: zero / negative revenue rows are dropped before median.
{
  const rows: ExtrapolatedRow[] = [
    { industry_id: "cafes_coffee", predicted_rev_per_firm: 0, quality_score: 60 },
    { industry_id: "cafes_coffee", predicted_rev_per_firm: null, quality_score: 60 },
    { industry_id: "cafes_coffee", predicted_rev_per_firm: -1000, quality_score: 60 },
    { industry_id: "cafes_coffee", predicted_rev_per_firm: 80_000, quality_score: 60 },
    { industry_id: "cafes_coffee", predicted_rev_per_firm: 120_000, quality_score: 60 },
    { industry_id: "cafes_coffee", predicted_rev_per_firm: 160_000, quality_score: 60 },
  ];
  const out = aggregateExtrapolatedByIndustry(rows, "AL", 12);
  const r = out.find((x) => x.industry_id === "cafes_coffee");
  expect(
    !!r,
    "Cafes should be present after dropping invalid rows (3 valid >= floor)",
  );
  if (r && r.revenue_per_firm != null) {
    expect(
      Math.abs(r.revenue_per_firm - 120_000) < 1,
      `Cafes median should be $120K (middle of [80K, 120K, 160K]), got $${r.revenue_per_firm}`,
    );
  }
}

// --- Test 7: limit parameter respected.
{
  const rows: ExtrapolatedRow[] = [];
  // Make 6 industries each with 3 rows
  const ids = [
    "restaurants",
    "cafes_coffee",
    "bars_nightclubs",
    "bakeries_retail",
    "hair_salons_full",
    "grocery_stores",
  ];
  for (const id of ids) {
    rows.push({ industry_id: id, predicted_rev_per_firm: 100_000, quality_score: 50 });
    rows.push({ industry_id: id, predicted_rev_per_firm: 150_000, quality_score: 50 });
    rows.push({ industry_id: id, predicted_rev_per_firm: 200_000, quality_score: 50 });
  }
  const out = aggregateExtrapolatedByIndustry(rows, "AL", 3);
  expect(
    out.length === 3,
    `Limit=3 should return 3 rows, got ${out.length}`,
  );
}

// --- Test 8: empty input returns empty output, no crash.
{
  const out = aggregateExtrapolatedByIndustry([], "AL", 12);
  expect(out.length === 0, "Empty input must return empty output");
}

// --- Test 9: deterministic ordering. Two industries with same rank
// (e.g. hair_salons_full and hairdressers_beauty are both rank 5) must
// always come back in the same order (alphabetical by name).
{
  const rows: ExtrapolatedRow[] = [];
  for (const id of ["hair_salons_full", "hairdressers_beauty"]) {
    rows.push({ industry_id: id, predicted_rev_per_firm: 100_000, quality_score: 50 });
    rows.push({ industry_id: id, predicted_rev_per_firm: 150_000, quality_score: 50 });
    rows.push({ industry_id: id, predicted_rev_per_firm: 200_000, quality_score: 50 });
  }
  const out1 = aggregateExtrapolatedByIndustry(rows, "AL", 12);
  const out2 = aggregateExtrapolatedByIndustry(rows.slice().reverse(), "AL", 12);
  expect(
    out1.map((r) => r.industry_id).join(",") ===
      out2.map((r) => r.industry_id).join(","),
    `Ordering must be deterministic regardless of input order. Got ${out1.map((r) => r.industry_id).join(",")} vs ${out2.map((r) => r.industry_id).join(",")}`,
  );
}

if (errors.length > 0) {
  console.error(
    `top_industries_plausibility: FAIL with ${errors.length} issue(s):`,
  );
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

console.log(
  `top_industries_plausibility: PASS. 9 test groups, all aggregation rules verified.`,
);
