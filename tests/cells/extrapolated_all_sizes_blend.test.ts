/**
 * extrapolated_all_sizes_blend.test.ts
 *
 * Regression test for the non-deterministic "all sizes" revenue-per-firm.
 *
 * extrapolated_cells holds ONE row per size band for a (country, industry),
 * each with a very different predicted_rev_per_firm. For Kenyan restaurants the
 * 1-4 micro band is ~$10K while the 20-49 band is ~$500K. The old all-sizes read
 * picked a single band by whatever physical order PostgREST returned the tied
 * rows in, so the same cell flickered between ~$10K and a large-band value across
 * identical requests.
 *
 * The fix folds the bands into one value with a firm-share weight, in a fixed
 * band order. This test feeds the real KE restaurant bands to
 * blendBandsToAllSizesRevenue and asserts:
 *   - the blend lands in a sensible mid-range (above the bare 1-4 floor, far
 *     below the big-band values),
 *   - it is identical regardless of input row order (the core of the bug),
 *   - catastrophic per-band values are dropped by the ceiling,
 *   - the fallbacks (no weights / single band / empty) behave.
 *
 * Run: npx tsx tests/cells/extrapolated_all_sizes_blend.test.ts
 */

import {
  blendBandsToAllSizesRevenue,
  sizeBandRank,
  SIZE_BAND_ORDER,
  type ExtrapolatedBandRow,
} from "../../src/lib/cells/extrapolated_aggregation";

const errors: string[] = [];
function expect(cond: boolean, msg: string) {
  if (!cond) errors.push(msg);
}

// Real KE restaurant bands: revenue_per_firm_local (KES) x fx_to_usd 0.007722,
// exactly as the loader writes them into extrapolated_cells (USD).
const FX = 0.007722;
const KE_RESTAURANT_BANDS: ExtrapolatedBandRow[] = [
  { size_band: "1-4", predicted_rev_per_firm: 1_300_000 * FX }, //  $10,038.6
  { size_band: "5-9", predicted_rev_per_firm: 5_500_000 * FX }, //  $42,471.0
  { size_band: "10-19", predicted_rev_per_firm: 20_000_000 * FX }, // $154,440.0
  { size_band: "20-49", predicted_rev_per_firm: 65_000_000 * FX }, // $501,930.0
];
// share_of_firms from country_industry_economics.json KE:restaurants.
const KE_RESTAURANT_FIRM_DIST = { "1-4": 80, "5-9": 15, "10-19": 4, "20-49": 1 };

const MICRO_USD = 1_300_000 * FX; // 10,038.6 — the bare 1-4 floor
const BIG_USD = 65_000_000 * FX; // 501,930 — the largest band

// --- Test 1: firm-share-weighted blend lands in a sensible mid-range.
// 0.80*10,038.6 + 0.15*42,471 + 0.04*154,440 + 0.01*501,930 = 25,598.43
{
  const out = blendBandsToAllSizesRevenue(KE_RESTAURANT_BANDS, {
    firmDistribution: KE_RESTAURANT_FIRM_DIST,
  });
  expect(out != null, "Blend must return a value for KE restaurants");
  if (out != null) {
    expect(
      Math.abs(out - 25_598.43) < 1,
      `KE restaurants blend should be ~$25,598 (firm-share-weighted), got $${out?.toFixed(2)}`,
    );
    // Sits above the bare micro floor but is pulled well down from the big bands.
    expect(out > MICRO_USD, `Blend ($${out.toFixed(0)}) must exceed the bare 1-4 floor ($${MICRO_USD.toFixed(0)})`);
    expect(out < BIG_USD / 5, `Blend ($${out.toFixed(0)}) must sit far below the 20-49 band ($${BIG_USD.toFixed(0)})`);
    expect(out > 20_000 && out < 30_000, `Blend should read as a realistic mid-range ($20K-$30K), got $${out.toFixed(0)}`);
  }
}

// --- Test 2: DETERMINISM. Identical result regardless of DB row order.
// This is the actual bug: the only thing that changed between requests was the
// physical order of the tied rows. Folding must be order-independent.
{
  const orig = blendBandsToAllSizesRevenue(KE_RESTAURANT_BANDS, {
    firmDistribution: KE_RESTAURANT_FIRM_DIST,
  });
  const reversed = blendBandsToAllSizesRevenue(KE_RESTAURANT_BANDS.slice().reverse(), {
    firmDistribution: KE_RESTAURANT_FIRM_DIST,
  });
  // A scramble that puts the big band first (the worst-case flicker source).
  const scrambled = blendBandsToAllSizesRevenue(
    [KE_RESTAURANT_BANDS[3], KE_RESTAURANT_BANDS[1], KE_RESTAURANT_BANDS[0], KE_RESTAURANT_BANDS[2]],
    { firmDistribution: KE_RESTAURANT_FIRM_DIST },
  );
  expect(
    orig === reversed && orig === scrambled,
    `Blend must be identical across input orders. orig=${orig}, reversed=${reversed}, scrambled=${scrambled}`,
  );
}

// --- Test 3: catastrophic wrong-aggregation band is dropped by the ceiling.
// A bogus $300M "restaurant" band must not contaminate the weighted mean.
{
  const withGiant: ExtrapolatedBandRow[] = [
    ...KE_RESTAURANT_BANDS,
    { size_band: "50-99", predicted_rev_per_firm: 300_000_000 }, // wrong-aggregation
  ];
  const dist = { ...KE_RESTAURANT_FIRM_DIST, "50-99": 1 };
  const out = blendBandsToAllSizesRevenue(withGiant, {
    firmDistribution: dist,
    ceiling: 50_000_000, // restaurants hi ($5M) x 10
  });
  expect(out != null && out < 30_000, `Catastrophic band must be dropped; blend should stay ~$25K, got $${out?.toFixed(0)}`);
}

// --- Test 4: no firm distribution -> equal-weight mean across present bands.
// mean(10,038.6, 42,471, 154,440, 501,930) = 177,219.9
{
  const out = blendBandsToAllSizesRevenue(KE_RESTAURANT_BANDS, {});
  const mean = KE_RESTAURANT_BANDS.reduce((s, b) => s + (b.predicted_rev_per_firm ?? 0), 0) / 4;
  expect(out != null && Math.abs(out - mean) < 1, `No-distribution fallback should be the equal-weight mean ($${mean.toFixed(0)}), got $${out?.toFixed(0)}`);
}

// --- Test 5: single band returns that band's value untouched.
{
  const out = blendBandsToAllSizesRevenue([{ size_band: "1-4", predicted_rev_per_firm: 12_345 }], {
    firmDistribution: { "1-4": 90 },
  });
  expect(out === 12_345, `Single band must return its own value, got $${out}`);
}

// --- Test 6: empty / all-invalid input returns null (caller falls back).
{
  expect(blendBandsToAllSizesRevenue([], {}) === null, "Empty input must return null");
  const allBad: ExtrapolatedBandRow[] = [
    { size_band: "1-4", predicted_rev_per_firm: 0 },
    { size_band: "5-9", predicted_rev_per_firm: null },
    { size_band: "10-19", predicted_rev_per_firm: -5 },
  ];
  expect(blendBandsToAllSizesRevenue(allBad, {}) === null, "All-invalid input must return null");
}

// --- Test 7: bands present in rows but missing from the distribution still
// contribute nothing erroneously; weighting uses only the shares we have.
// Here only 1-4 has a share, so the result collapses to the 1-4 value.
{
  const out = blendBandsToAllSizesRevenue(KE_RESTAURANT_BANDS, {
    firmDistribution: { "1-4": 80 },
  });
  expect(
    out != null && Math.abs(out - MICRO_USD) < 1,
    `When only 1-4 has a share, the weighted mean should equal the 1-4 value ($${MICRO_USD.toFixed(0)}), got $${out?.toFixed(0)}`,
  );
}

// --- Test 8: canonical band order helpers are sane and deterministic.
{
  expect(sizeBandRank("1-4") < sizeBandRank("20-49"), "1-4 must rank before 20-49");
  expect(sizeBandRank("100+") === SIZE_BAND_ORDER.length - 1, "100+ must be the last canonical band");
  expect(sizeBandRank("nonsense") >= SIZE_BAND_ORDER.length, "Unknown bands sort last");
}

// --- Test 9: legacy / junk bands are excluded from the fold.
// extrapolated_cells layers older ingestions on top of the research drop, so a
// real (KE, restaurants) read carries pseudo-bands like "TOTAL", turnover
// classes ("small"/"large"), and alternate employee bandings ("0-9", "GE250").
// These must NOT contaminate the all-sizes typical.
{
  const withJunk: ExtrapolatedBandRow[] = [
    ...KE_RESTAURANT_BANDS,
    { size_band: "TOTAL", predicted_rev_per_firm: 23_000 },
    { size_band: "small", predicted_rev_per_firm: 31_000 },
    { size_band: "0-9", predicted_rev_per_firm: 12_000 },
    { size_band: "GE250", predicted_rev_per_firm: 5_000_000 },
  ];
  // Weighted path: junk bands have no share, but explicitly confirm the result
  // is unchanged from the clean-bands blend.
  const weighted = blendBandsToAllSizesRevenue(withJunk, { firmDistribution: KE_RESTAURANT_FIRM_DIST });
  expect(weighted != null && Math.abs(weighted - 25_598.43) < 1, `Junk bands must not change the weighted blend, got $${weighted?.toFixed(0)}`);

  // Equal-weight fallback (no distribution): must average ONLY the canonical
  // bands, not the junk. Mean of the 4 canonical bands = $177,220.
  const canonicalMean = KE_RESTAURANT_BANDS.reduce((s, b) => s + (b.predicted_rev_per_firm ?? 0), 0) / 4;
  const fallback = blendBandsToAllSizesRevenue(withJunk, {});
  expect(
    fallback != null && Math.abs(fallback - canonicalMean) < 1,
    `Equal-weight fallback must average only canonical bands ($${canonicalMean.toFixed(0)}), got $${fallback?.toFixed(0)}`,
  );

  // Only-junk input (no canonical band at all): fall back to those bands rather
  // than returning null, still deterministically.
  const onlyJunk: ExtrapolatedBandRow[] = [
    { size_band: "small", predicted_rev_per_firm: 40_000 },
    { size_band: "large", predicted_rev_per_firm: 160_000 },
  ];
  const j = blendBandsToAllSizesRevenue(onlyJunk, {});
  expect(j != null && Math.abs(j - 100_000) < 1, `Only-junk input should fall back to their mean ($100K), got $${j?.toFixed(0)}`);
}

if (errors.length > 0) {
  console.error(`extrapolated_all_sizes_blend: FAIL with ${errors.length} issue(s):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

console.log("extrapolated_all_sizes_blend: PASS. 9 test groups, blend is deterministic and sensible.");
