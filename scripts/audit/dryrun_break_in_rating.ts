/**
 * THROWAWAY DRY-RUN — "break-in rating" calibration table.
 *
 * Founder-review tool. NOT wired into the app, NOT a production helper, NOT
 * surfaced on any page. Reads ONLY local lib constants + the city
 * cost-of-living list. NEVER touches the database.
 *
 * What it does
 * ------------
 * For ~18 representative business x place combos spanning the spectrum, computes
 * the single 0-100 break-in rating through the exact production module
 * (computeBreakInRating) and prints a fixed-width table sorted by score
 * descending, so a human can calibrate the FEEL: does the ordering make sense
 * (services and agencies high, hotels and restaurants low), and is the spread
 * wide rather than clustered near the middle.
 *
 * Inputs per combo, exactly as the live board would supply them:
 *   - Capital to start: place-adjusted modeled startup capital (no trusted real
 *     cost in a dry run, so always the modeled branch).
 *   - Permits: place-adjusted modeled regulatory cost.
 *   - Time to open: place-invariant modeled weeks.
 *   - Density: per-industry modeled archetype (firms per 10k residents).
 *   - Annual owner take-home: see the constant below. THESE ARE REPRESENTATIVE
 *     stand-ins, NOT the real per-cell take-home the live board computes. The
 *     real take-home is only reachable inside the page's fetch + finance
 *     pipeline (after-tax, margin-floored), which a standalone dry-run cannot
 *     replay cleanly. The goal here is a believable DISTRIBUTION to calibrate
 *     the curve against, not final per-cell precision, so a defensible typical
 *     annual take-home per trade is used and clearly labelled in the header.
 *
 * Each place's cost-of-living index is resolved by the SAME
 * getCityCostOfLivingIndex the cell page uses, keyed by the city's geo slug, so
 * the place adjustment matches the live board. The index used is printed so a
 * human can sanity-check it. Because all inputs are modeled here, restsOnModeled
 * is true for every row.
 *
 * Run: npx tsx scripts/audit/dryrun_break_in_rating.ts
 */
import { getCityCostOfLivingIndex } from "@/lib/cities/city_tier";
import { placeAdjustedStartupCapital } from "@/lib/markets/startup_capital_archetypes";
import {
  timeToOpenWeeks,
  placeAdjustedPermitsUsd,
} from "@/lib/markets/opening_archetypes";
import { densityArchetypePer10k } from "@/lib/markets/density_archetypes";
import { computeBreakInRating } from "@/lib/scores/break_in_rating";
import { fmtUSD, fmtWeeksToOpen } from "@/components/board/format";

type Combo = {
  label: string; // human label for the row ("business in place")
  industryId: string; // real taxonomy id (resolves via industryToSlug to a slug)
  geoSlug: string; // real city slug in data/cities/city_list_v1.json
  /**
   * REPRESENTATIVE typical annual owner take-home, USD, after tax. A defensible
   * stand-in per trade so the distribution is believable, NOT the live board's
   * real per-cell figure (see the file header). Tuned to general knowledge of
   * what each kind of owner clears in a year in a developed urban market.
   */
  takeHomeUsd: number;
  /** Optional hardcoded COL fallback if a slug ever stops resolving, with note. */
  colFallback?: number;
};

// The 18 representative combos. A deliberate mix of easy (light professional
// services and agencies) and hard (premises-heavy hospitality and lodging) so
// the spread is obvious. industryId values resolve to keyed archetypes except
// where noted; geoSlug values all carry a COL index (NYC = 100). The take-home
// figures are REPRESENTATIVE stand-ins (see the header banner printed below).
const COMBOS: Combo[] = [
  { label: "Management consulting in London", industryId: "management_consulting", geoSlug: "london", takeHomeUsd: 120_000 },
  { label: "Marketing agency in Berlin", industryId: "marketing_design", geoSlug: "berlin", takeHomeUsd: 85_000 },
  { label: "Accounting in Toronto", industryId: "accounting_tax", geoSlug: "toronto", takeHomeUsd: 95_000 },
  { label: "Software development in Tokyo", industryId: "software_development", geoSlug: "tokyo", takeHomeUsd: 110_000 },
  { label: "Law firm in Toronto", industryId: "legal_services", geoSlug: "toronto", takeHomeUsd: 140_000 },
  { label: "Cleaning services in Madrid", industryId: "cleaning_services", geoSlug: "madrid", takeHomeUsd: 45_000 },
  { label: "E-commerce in London", industryId: "ecommerce_mail_order", geoSlug: "london", takeHomeUsd: 60_000 },
  { label: "Salon in Paris", industryId: "hair_salons_full", geoSlug: "paris", takeHomeUsd: 40_000 },
  { label: "Gym in Sydney", industryId: "sports_fitness", geoSlug: "sydney", takeHomeUsd: 50_000 },
  { label: "Cafe in Paris", industryId: "cafes_coffee", geoSlug: "paris", takeHomeUsd: 40_000 },
  { label: "Retail shop in Mumbai", industryId: "clothing_stores", geoSlug: "mumbai", takeHomeUsd: 45_000 },
  { label: "Restaurant in London", industryId: "restaurants", geoSlug: "london", takeHomeUsd: 55_000 },
  { label: "Bakery in Madrid", industryId: "bakeries_retail", geoSlug: "madrid", takeHomeUsd: 42_000 },
  { label: "Childcare in Sydney", industryId: "childcare_social", geoSlug: "sydney", takeHomeUsd: 38_000 },
  { label: "Dental practice in Berlin", industryId: "dental_practices", geoSlug: "berlin", takeHomeUsd: 160_000 },
  { label: "Construction in Dubai", industryId: "residential_construction", geoSlug: "dubai", takeHomeUsd: 70_000 },
  // Manufacturing has no keyed archetype, so it resolves to the moderate
  // defaults (capital, permits, time, density). Munich is a sensible industrial
  // metro for the place.
  { label: "Manufacturing in Munich", industryId: "food_mfg", geoSlug: "munich", takeHomeUsd: 90_000 },
  { label: "Hotel in New York", industryId: "hotels_lodging", geoSlug: "new-york", takeHomeUsd: 120_000 },
];

type Row = {
  label: string;
  col: number | null;
  colNote: string;
  capital: number;
  permits: number;
  takeHome: number;
  weeks: number;
  density: number;
  paybackYears: number;
  score: number;
  band: string;
};

const rows: Row[] = [];
let nullCount = 0;
let badCount = 0;

for (const c of COMBOS) {
  const resolved = getCityCostOfLivingIndex(c.geoSlug);
  const col = resolved ?? c.colFallback ?? null;
  const colNote = resolved == null && c.colFallback != null ? "*" : "";

  const capital = placeAdjustedStartupCapital({
    industryId: c.industryId,
    costOfLivingIndex: col,
    avgYearlySalary: null,
  });
  const permits = placeAdjustedPermitsUsd({
    industryId: c.industryId,
    costOfLivingIndex: col,
    avgYearlySalary: null,
  });
  const weeks = timeToOpenWeeks(c.industryId);
  const density = densityArchetypePer10k(c.industryId);

  const rating = computeBreakInRating({
    startupCapitalUsd: capital,
    permitsUsd: permits,
    annualOwnerTakeHomeUsd: c.takeHomeUsd,
    timeToOpenWeeks: weeks,
    densityPer10k: density,
    restsOnModeled: true, // every input here is modeled
  });

  if (rating == null) {
    nullCount++;
    console.log(`NULL rating for: ${c.label} (unexpected in this dry run)`);
    continue;
  }

  // Leak checks: score must be a 0..100 integer, payback a finite number.
  if (
    !Number.isInteger(rating.score) ||
    rating.score < 0 ||
    rating.score > 100 ||
    !Number.isFinite(rating.paybackYears)
  ) {
    badCount++;
  }

  rows.push({
    label: c.label,
    col,
    colNote,
    capital,
    permits,
    takeHome: c.takeHomeUsd,
    weeks,
    density,
    paybackYears: rating.paybackYears,
    score: rating.score,
    band: rating.band,
  });
}

// Sort by SCORE descending so the spread is obvious top to bottom.
rows.sort((a, b) => b.score - a.score);

function pad(s: string, n: number): string {
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}
function padL(s: string, n: number): string {
  return s.length >= n ? s : " ".repeat(n - s.length) + s;
}

const COLS = {
  combo: 32,
  capital: 9,
  permits: 8,
  take: 10,
  time: 11,
  density: 12,
  payback: 8,
  score: 6,
  band: 11,
};

const header =
  pad("Business x place", COLS.combo) +
  "  " + padL("Capital", COLS.capital) +
  "  " + padL("Permits", COLS.permits) +
  "  " + padL("Take-home", COLS.take) +
  "  " + padL("Time", COLS.time) +
  "  " + padL("Density/10k", COLS.density) +
  "  " + padL("Payback", COLS.payback) +
  "  " + padL("SCORE", COLS.score) +
  "  " + pad("Band", COLS.band);

console.log("");
console.log("BREAK-IN RATING — calibration dry-run (single 0-100 score, higher = easier to break in)");
console.log("Take-home figures are REPRESENTATIVE per-trade stand-ins, NOT live per-cell take-home.");
console.log("All inputs modeled (place-adjusted capital + permits, modeled time + density). restsOnModeled = true for every row.");
console.log("=".repeat(header.length));
console.log(header);
console.log("-".repeat(header.length));

for (const r of rows) {
  console.log(
    pad(r.label, COLS.combo) +
      "  " + padL(fmtUSD(r.capital), COLS.capital) +
      "  " + padL(fmtUSD(r.permits), COLS.permits) +
      "  " + padL(fmtUSD(r.takeHome), COLS.take) +
      "  " + padL(fmtWeeksToOpen(r.weeks), COLS.time) +
      "  " + padL(`${r.density.toLocaleString("en-US")}${r.colNote}`, COLS.density) +
      "  " + padL(`${r.paybackYears.toFixed(1)}y`, COLS.payback) +
      "  " + padL(String(r.score), COLS.score) +
      "  " + pad(r.band, COLS.band),
  );
}

console.log("-".repeat(header.length));

// Spread + integrity summary so the calibration read is one glance.
const scores = rows.map((r) => r.score);
const min = Math.min(...scores);
const max = Math.max(...scores);
const mean = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
const bandCounts = rows.reduce<Record<string, number>>((m, r) => {
  m[r.band] = (m[r.band] ?? 0) + 1;
  return m;
}, {});

console.log(
  `Rows: ${rows.length}  |  Score range: ${min}..${max} (spread ${max - min})  |  Mean: ${mean}`,
);
console.log(
  `Bands: ` +
    ["forgiving", "manageable", "demanding", "brutal"]
      .map((b) => `${b} ${bandCounts[b] ?? 0}`)
      .join("  |  "),
);
console.log(
  nullCount === 0 && badCount === 0
    ? "Integrity: no null leaks, all scores are 0..100 integers, no NaN payback."
    : `WARNING: ${nullCount} null rating(s), ${badCount} out-of-range/NaN value(s).`,
);
console.log("(* = COL hardcoded fallback used; none expected today)");
console.log("");
