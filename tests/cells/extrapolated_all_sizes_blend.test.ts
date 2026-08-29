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

// --- Test 4: no firm distribution -> DEFAULT micro-dominant weights, never an
// equal-weight mean. The old fallback averaged a micro shop and a 20-49-staff
// operation as equals, which is how a country with no research-drop economics
// printed a chain's revenue as "typical" (the 2026-08-29 take-home defect: a
// UK gym at $2.5M, an owner keeping $513K against a $38K median wage). Every
// national business registry is micro-dominated, so when no per-pair
// distribution exists the blend now weights with the documented default
// (70/15/8/4/2/1), landing near the modal micro firm:
// (70*10,038.6 + 15*42,471 + 8*154,440 + 4*501,930) / 97 = 47,247.49
{
  const out = blendBandsToAllSizesRevenue(KE_RESTAURANT_BANDS, {});
  expect(
    out != null && Math.abs(out - 47_247.49) < 1,
    `No-distribution fallback should use the default micro-dominant weights ($47,247), got $${out?.toFixed(0)}`,
  );
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

  // No-distribution fallback with a TOTAL row present: the TOTAL band IS the
  // direct all-sizes estimate the loader wrote, so it beats any synthetic
  // weighting and is returned as-is. (With a per-pair distribution, the
  // researched weighted blend above still wins; TOTAL is the second rung.)
  const fallback = blendBandsToAllSizesRevenue(withJunk, {});
  expect(
    fallback != null && Math.abs(fallback - 23_000) < 1,
    `With no distribution, an explicit TOTAL row must be returned directly ($23,000), got $${fallback?.toFixed(0)}`,
  );

  // Only turnover classes (no employee band, no TOTAL): weighted small-dominant
  // (80/15/5), never an equal mean; the modal firm in every economy is small.
  // (80*40,000 + 5*160,000) / 85 = 47,058.82
  const onlyJunk: ExtrapolatedBandRow[] = [
    { size_band: "small", predicted_rev_per_firm: 40_000 },
    { size_band: "large", predicted_rev_per_firm: 160_000 },
  ];
  const j = blendBandsToAllSizesRevenue(onlyJunk, {});
  expect(
    j != null && Math.abs(j - 47_058.82) < 1,
    `Turnover-class-only input should blend small-dominant ($47,059), got $${j?.toFixed(0)}`,
  );
}

// --- Test 10: THE 2026-08-29 DEFECT, pinned with the real GB sports_fitness
// rows. This (country, industry) pair has no canonical band, no TOTAL row and
// no research-drop distribution, so the old code fell to an equal-weight mean
// across every label present, junk included:
// mean(416K, 1.11M, 5.08M, 8M, 360K, 600K, 1.68M) = $2,465,390, which the
// engine converted into a $513K owner take-home, 13.4x the UK median wage.
// The fix maps the alternate employee bands onto the canonical axis ("2-9"
// covers 1-4 + 5-9, "10-49" covers 10-19 + 20-49, "50-249" covers 50-99 +
// 100+, "250+" covers nothing a single shop lives in) and weights with the
// default micro-dominant shares:
// (85*416,338 + 12*1,113,359 + 3*5,084,154) / 100 = 640,015.0
{
  const GB_SPORTS_BANDS: ExtrapolatedBandRow[] = [
    { size_band: "2-9", predicted_rev_per_firm: 416_338 },
    { size_band: "10-49", predicted_rev_per_firm: 1_113_359 },
    { size_band: "50-249", predicted_rev_per_firm: 5_084_154 },
    { size_band: "250+", predicted_rev_per_firm: 8_000_000 },
    { size_band: "small", predicted_rev_per_firm: 360_529 },
    { size_band: "medium", predicted_rev_per_firm: 600_881 },
    { size_band: "large", predicted_rev_per_firm: 1_682_467 },
  ];
  const out = blendBandsToAllSizesRevenue(GB_SPORTS_BANDS, { ceiling: 24_000_000 });
  expect(
    out != null && Math.abs(out - 640_015) < 1,
    `GB sports_fitness must blend micro-dominant ($640,015), got $${out?.toFixed(0)}`,
  );
  expect(out != null && out < 1_000_000, `GB sports_fitness blend must stay far below the old chain-scale $2.47M, got $${out?.toFixed(0)}`);
}

// --- Test 11: a TOTAL row wins over the default-weighted blend (the real TD /
// AL sports_fitness rows). TOTAL is the loader's own direct all-sizes
// per-firm estimate; when the pair holds one and no researched distribution,
// synthesizing weights around it would be a worse figure wearing more math.
{
  const TD_SPORTS_BANDS: ExtrapolatedBandRow[] = [
    { size_band: "10-49", predicted_rev_per_firm: 113_377 },
    { size_band: "total", predicted_rev_per_firm: 49_438 },
    { size_band: "2-9", predicted_rev_per_firm: 42_397 },
    { size_band: "50-249", predicted_rev_per_firm: 517_735 },
    { size_band: "small", predicted_rev_per_firm: 14_305 },
    { size_band: "medium", predicted_rev_per_firm: 23_841 },
    { size_band: "large", predicted_rev_per_firm: 66_755 },
    { size_band: "250+", predicted_rev_per_firm: 8_000_000 },
  ];
  const out = blendBandsToAllSizesRevenue(TD_SPORTS_BANDS, { ceiling: 24_000_000 });
  expect(out === 49_438, `An explicit total row must be returned directly ($49,438), got $${out}`);
}

// --- Test 12: layered duplicate bands never count the same firms twice, and
// the 250+ class never receives weight.
{
  // "1-4" and "0-9" both present: the exact canonical band claims its own
  // share (80) and the wider alias receives only the share the exact band did
  // not claim (5-9's 15): (80*10,000 + 15*99,999) / 95 = 24,210.37
  const layered: ExtrapolatedBandRow[] = [
    { size_band: "1-4", predicted_rev_per_firm: 10_000 },
    { size_band: "0-9", predicted_rev_per_firm: 99_999 },
  ];
  const out = blendBandsToAllSizesRevenue(layered, {
    firmDistribution: { "1-4": 80, "5-9": 15 },
  });
  expect(
    out != null && Math.abs(out - 24_210.37) < 1,
    `A duplicate wider band must only claim unowned shares ($24,210), got $${out?.toFixed(2)}`,
  );

  // A GE250 band alongside one micro band: the corporate band gets zero weight,
  // so the blend IS the micro value.
  const withCorporate: ExtrapolatedBandRow[] = [
    { size_band: "2-9", predicted_rev_per_firm: 50_000 },
    { size_band: "GE250", predicted_rev_per_firm: 8_000_000 },
  ];
  const micro = blendBandsToAllSizesRevenue(withCorporate, {});
  expect(micro === 50_000, `The 250+ class must never receive weight; expected $50,000, got $${micro}`);
}

if (errors.length > 0) {
  console.error(`extrapolated_all_sizes_blend: FAIL with ${errors.length} issue(s):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}

console.log("extrapolated_all_sizes_blend: PASS. 12 test groups, blend is deterministic and sensible.");
