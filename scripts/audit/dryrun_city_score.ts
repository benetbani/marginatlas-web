/**
 * THROWAWAY DRY-RUN: "city score" calibration table.
 *
 * Founder-review tool. NOT wired into the app, NOT a production helper, NOT
 * surfaced on any page. Reads ONLY the local city record + the country
 * economics snapshot accessor + local lib constants. NEVER touches the database.
 *
 * What it does
 * ------------
 * For ~12 representative cities spanning the spectrum, computes the single
 * 0-100 city attractiveness score through the EXACT production path the page
 * uses (buildCityScore over the same board input shape), and prints a
 * fixed-width table sorted by score descending, so a human can calibrate the
 * FEEL: is the ordering intuitive (big rich low-rent-relative cities high,
 * thin or expensive ones lower), is the spread wide rather than clustered, are
 * there NaN or out-of-range leaks, and do cities with no demand data come back
 * null (no wrong number).
 *
 * Inputs per city, exactly as the live page supplies them:
 *   - The city record fields (population, gross salary, cost-of-living index,
 *     visitor arrivals) read straight from data/cities/city_list_v1.json.
 *   - The country economics snapshot (self-employment share, monthly salary)
 *     via getCountryEconomicsSnapshot, the same accessor the page calls.
 *   - The London representative survival curve, where one exists, flows through
 *     buildCityScore exactly as it does on the page.
 *
 * Because the informality proxy and the cost-of-living index are modeled,
 * restsOnModeled is true for every real city, exactly as on the page.
 *
 * Run: npx tsx scripts/audit/dryrun_city_score.ts
 */
import cityListJson from "../../data/cities/city_list_v1.json";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { buildCityScore } from "@/lib/scores/city_board";

type CityRecord = {
  slug: string;
  name: string;
  iso2: string;
  pop_m?: number;
  avg_gross_salary_usd_year?: number;
  cost_of_living_index?: number;
  tourist_arrivals_m?: number;
};

const CITIES = (cityListJson as { cities: CityRecord[] }).cities;
const BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

// The ~12 review cities: a deliberate mix of deep rich metros, big low-income
// metros, and small expensive ones so the spread and the ordering are obvious.
const SLUGS = [
  "london",
  "new-york",
  "paris",
  "tokyo",
  "madrid",
  "berlin",
  "sydney",
  "toronto",
  "dubai",
  "mumbai",
  "sao-paulo",
  "singapore",
];

type Row = {
  name: string;
  popM: number | null;
  income: number | null;
  col: number | null;
  tourism: number | null;
  selfEmp: number | null;
  demand: number | null;
  room: number | null;
  rent: number | null;
  survival: number | null;
  score: number | null;
  band: string;
};

const rows: Row[] = [];
let nullCount = 0;
let badCount = 0;

for (const slug of SLUGS) {
  const city = BY_SLUG.get(slug);
  if (!city) {
    console.log(`MISSING city record for slug: ${slug}`);
    continue;
  }

  const econSnap = getCountryEconomicsSnapshot(city.iso2);
  const boardInput = {
    city: {
      slug: city.slug,
      popM: city.pop_m ?? null,
      avgGrossSalaryUsdYear: city.avg_gross_salary_usd_year ?? null,
      costOfLivingIndex: city.cost_of_living_index ?? null,
      touristArrivalsM: city.tourist_arrivals_m ?? null,
    },
    econ: {
      selfEmploymentPct: econSnap.selfEmploymentPct,
      avgMonthlySalary: econSnap.avgMonthlySalary,
    },
  };

  // The income proxy actually fed to the score (city salary, else annualised
  // country monthly salary), for the table's "income" column.
  const incomeProxy =
    boardInput.city.avgGrossSalaryUsdYear ??
    (econSnap.avgMonthlySalary != null ? econSnap.avgMonthlySalary * 12 : null);

  const result = buildCityScore(boardInput);

  if (result == null) {
    nullCount++;
    rows.push({
      name: city.name,
      popM: boardInput.city.popM,
      income: incomeProxy,
      col: boardInput.city.costOfLivingIndex,
      tourism: boardInput.city.touristArrivalsM,
      selfEmp: econSnap.selfEmploymentPct,
      demand: null,
      room: null,
      rent: null,
      survival: null,
      score: null,
      band: "null",
    });
    continue;
  }

  // Leak checks: score must be a 0..100 integer; every component a 0..100
  // integer (no NaN, nothing out of range).
  const comps = [
    result.score,
    result.components.demand,
    result.components.room,
    result.components.rent,
    result.components.survival,
  ];
  if (
    comps.some(
      (v) => !Number.isInteger(v) || v < 0 || v > 100 || !Number.isFinite(v),
    )
  ) {
    badCount++;
  }

  rows.push({
    name: city.name,
    popM: boardInput.city.popM,
    income: incomeProxy,
    col: boardInput.city.costOfLivingIndex,
    tourism: boardInput.city.touristArrivalsM,
    selfEmp: econSnap.selfEmploymentPct,
    demand: result.components.demand,
    room: result.components.room,
    rent: result.components.rent,
    survival: result.components.survival,
    score: result.score,
    band: result.band,
  });
}

// Sort by SCORE descending (nulls sink to the bottom) so the spread is obvious.
rows.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));

function pad(s: string, n: number): string {
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}
function padL(s: string, n: number): string {
  return s.length >= n ? s : " ".repeat(n - s.length) + s;
}
function num(v: number | null): string {
  return v == null ? "-" : String(v);
}
function money(v: number | null): string {
  return v == null ? "-" : `$${Math.round(v / 1000)}K`;
}

const COLS = {
  city: 12,
  pop: 7,
  income: 8,
  col: 5,
  tour: 6,
  self: 6,
  demand: 7,
  room: 6,
  rent: 6,
  surv: 6,
  score: 6,
  band: 11,
};

const header =
  pad("City", COLS.city) +
  "  " + padL("Pop(M)", COLS.pop) +
  "  " + padL("Income", COLS.income) +
  "  " + padL("COL", COLS.col) +
  "  " + padL("Tour", COLS.tour) +
  "  " + padL("Self%", COLS.self) +
  "  " + padL("Demand", COLS.demand) +
  "  " + padL("Room", COLS.room) +
  "  " + padL("Rent", COLS.rent) +
  "  " + padL("Surv", COLS.surv) +
  "  " + padL("SCORE", COLS.score) +
  "  " + pad("Band", COLS.band);

console.log("");
console.log(
  "CITY SCORE: calibration dry-run (single 0-100 score, higher = a better city to open a small business in)",
);
console.log(
  "Components each 0-100: Demand (pop+income+footfall, 52%), Room (informality inverted, 20%), Rent (cost of living inverted, 18%), Survival baseline (10%). Raw blend then contrast-stretched onto the published headline.",
);
console.log(
  "All real cities rest on modeled inputs (informality proxy + cost-of-living index). restsOnModeled = true for every scored row.",
);
console.log("=".repeat(header.length));
console.log(header);
console.log("-".repeat(header.length));

for (const r of rows) {
  console.log(
    pad(r.name, COLS.city) +
      "  " + padL(num(r.popM), COLS.pop) +
      "  " + padL(money(r.income), COLS.income) +
      "  " + padL(num(r.col), COLS.col) +
      "  " + padL(num(r.tourism), COLS.tour) +
      "  " + padL(r.selfEmp == null ? "-" : String(Math.round(r.selfEmp)), COLS.self) +
      "  " + padL(num(r.demand), COLS.demand) +
      "  " + padL(num(r.room), COLS.room) +
      "  " + padL(num(r.rent), COLS.rent) +
      "  " + padL(num(r.survival), COLS.surv) +
      "  " + padL(num(r.score), COLS.score) +
      "  " + pad(r.band, COLS.band),
  );
}

console.log("-".repeat(header.length));

// Spread + integrity summary so the calibration read is one glance.
const scored = rows.filter((r) => r.score != null).map((r) => r.score as number);
const min = scored.length ? Math.min(...scored) : 0;
const max = scored.length ? Math.max(...scored) : 0;
const mean = scored.length
  ? Math.round(scored.reduce((s, v) => s + v, 0) / scored.length)
  : 0;
const bandCounts = rows.reduce<Record<string, number>>((m, r) => {
  m[r.band] = (m[r.band] ?? 0) + 1;
  return m;
}, {});

console.log(
  `Rows: ${rows.length}  |  Scored: ${scored.length}  |  Null: ${nullCount}  |  Score range: ${min}..${max} (spread ${max - min})  |  Mean: ${mean}`,
);
console.log(
  `Bands: ` +
    ["forgiving", "manageable", "demanding", "brutal", "null"]
      .map((b) => `${b} ${bandCounts[b] ?? 0}`)
      .join("  |  "),
);
console.log(
  badCount === 0
    ? "Integrity: all scores and components are 0..100 integers, no NaN."
    : `WARNING: ${badCount} row(s) with out-of-range/NaN value(s).`,
);
console.log("");
