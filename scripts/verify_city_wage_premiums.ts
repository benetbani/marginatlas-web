/**
 * scripts/verify_city_wage_premiums.ts
 *
 * Goldmines Wave 2 — prebuild gate enforcing the integrity of the
 * city wage source-of-truth (data/economics/city_wage_premium_v1.json)
 * and the consistency of city slugs against city_list_v1.json.
 *
 * Rules:
 *   R1. At least 100 cities in the source.
 *   R2. Every wage in plausible monthly USD band [$60, $20000].
 *       (Floor lower than country gate because some city slugs are
 *       informal-sector metros with lower documented wages.)
 *   R3. Every source_quality is in {A, B, C}.
 *   R4. Every city slug in the wage file resolves to a real city in
 *       city_list_v1.json (no orphan keys).
 *   R5. City wages don't exceed 4x the country average (sanity:
 *       even the most premium metros do not exceed 4x).
 *   R6. City wages don't fall below 0.5x the country average (sanity:
 *       a city wage materially below the national average is
 *       suspicious for a major metro).
 *
 * Run: npx tsx scripts/verify_city_wage_premiums.ts
 * Exit 0 = pass, exit 1 = fail.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CITY_WAGE_PATH = path.resolve(
  ROOT,
  "data/economics/city_wage_premium_v1.json",
);
const COUNTRY_WAGE_PATH = path.resolve(
  ROOT,
  "data/economics/median_monthly_wage_usd_v1.json",
);
const CITY_LIST_PATH = path.resolve(ROOT, "data/cities/city_list_v1.json");

const MIN_CITY_COUNT = 100;
const MIN_MONTHLY_USD = 60;
const MAX_MONTHLY_USD = 20000;
const VALID_QUALITIES = new Set(["A", "B", "C"]);

/* THE BOUNDS THE DATA DECLARES FOR ITSELF.
 *
 * city_wage_premium_v1.json carries a `quality_checks` block written by whoever
 * built the file. Until 2026-08-08 no gate in the chain read one: a grep for
 * `quality_checks` across scripts/ returned nothing across all 63 gates. The
 * file said a city may not exceed 2.5x its country wage; this gate said 4.0x;
 * both sat in the repo looking correct, and the looser number won because it
 * was the one that ran.
 *
 * INTERSECTION, NOT ADOPTION. A declared bound may only ever make this gate
 * STRICTER. If the gate simply took whatever the file declares, the file would
 * be certifying itself and the next person to widen a bound would silently
 * widen the gate with it. `Math.min` on the ceiling, `Math.max` on the floor.
 *
 * Measured before switching, so this tightening cannot break a green build:
 *   city/country ratio in [0.5, 2.5]      0 violations of 156, 0 unmappable
 *   intra-country spread <= 3x            0 violations
 * Note: `2026-08-08-data-we-hold-and-never-enforce.md`.
 */
type QualityChecks = {
  min_city_vs_country_ratio?: number;
  max_city_vs_country_ratio?: number;
  max_intra_country_spread?: number;
};

type CityWage = { avg_monthly_wage_usd: number; source_quality?: string };
type CountryWage = { median_monthly_wage_usd: number };

const cityWage = JSON.parse(fs.readFileSync(CITY_WAGE_PATH, "utf-8")) as {
  cities: Record<string, CityWage>;
  quality_checks?: QualityChecks;
};
const countryWage = JSON.parse(fs.readFileSync(COUNTRY_WAGE_PATH, "utf-8")) as {
  countries: Record<string, CountryWage>;
};
const cityList = JSON.parse(fs.readFileSync(CITY_LIST_PATH, "utf-8")) as {
  cities: Array<{ slug: string; iso2: string }>;
};

const QC: QualityChecks = cityWage.quality_checks ?? {};
const MAX_CITY_PREMIUM = Math.min(4.0, QC.max_city_vs_country_ratio ?? Infinity);
const MIN_CITY_DISCOUNT = Math.max(0.5, QC.min_city_vs_country_ratio ?? 0);
const MAX_INTRA_SPREAD = QC.max_intra_country_spread ?? Infinity;

const citySlugSet = new Set(cityList.cities.map((c) => c.slug.toLowerCase()));
const slugToIso = new Map<string, string>();
for (const c of cityList.cities) {
  slugToIso.set(c.slug.toLowerCase(), c.iso2.toUpperCase());
}

let failures = 0;
let warnings = 0;
const messages: string[] = [];
/** City wages grouped by country, for the intra-country spread rule (R7). */
const byCountry = new Map<string, Array<{ slug: string; wage: number }>>();

console.log("=== verify_city_wage_premiums ===");

// R1: coverage.
const count = Object.keys(cityWage.cities).length;
if (count < MIN_CITY_COUNT) {
  messages.push(
    `${count} cities in wage file; minimum is ${MIN_CITY_COUNT}`,
  );
  failures++;
}

// R2 + R3 + R4 + R5 + R6: per-city.
for (const [slug, c] of Object.entries(cityWage.cities)) {
  const slugLower = slug.toLowerCase();
  // R4: slug in city_list.
  if (!citySlugSet.has(slugLower)) {
    messages.push(`[${slug}] not in city_list_v1.json`);
    failures++;
    continue;
  }
  // R2: wage in plausible band.
  if (typeof c.avg_monthly_wage_usd !== "number") {
    messages.push(`[${slug}] avg_monthly_wage_usd is not a number`);
    failures++;
    continue;
  }
  if (
    c.avg_monthly_wage_usd < MIN_MONTHLY_USD ||
    c.avg_monthly_wage_usd > MAX_MONTHLY_USD
  ) {
    messages.push(
      `[${slug}] avg_monthly_wage_usd=${c.avg_monthly_wage_usd} outside [$${MIN_MONTHLY_USD}, $${MAX_MONTHLY_USD}]/mo`,
    );
    failures++;
  }
  // R3: quality grade.
  if (c.source_quality && !VALID_QUALITIES.has(c.source_quality)) {
    messages.push(
      `[${slug}] source_quality="${c.source_quality}" not in {A,B,C}`,
    );
    failures++;
  }
  // R5 + R6: city vs country premium/discount.
  /* These were warnings while the ceiling was this gate's own 4.0x, a number
     nobody had sanctioned. At the file's declared 2.5x they FAIL: the bound now
     comes from the data author rather than from the gate author, and the data
     was measured clean against it before the switch. */
  const iso = slugToIso.get(slugLower);
  if (iso) {
    const country = countryWage.countries[iso];
    if (country && country.median_monthly_wage_usd > 0) {
      const ratio = c.avg_monthly_wage_usd / country.median_monthly_wage_usd;
      if (!byCountry.has(iso)) byCountry.set(iso, []);
      byCountry.get(iso)!.push({ slug, wage: c.avg_monthly_wage_usd });
      if (ratio > MAX_CITY_PREMIUM) {
        messages.push(
          `[${slug}] ${ratio.toFixed(2)}x country wage (max ${MAX_CITY_PREMIUM})`,
        );
        failures++;
      } else if (ratio < MIN_CITY_DISCOUNT) {
        messages.push(
          `[${slug}] ${ratio.toFixed(2)}x country wage (min ${MIN_CITY_DISCOUNT})`,
        );
        failures++;
      }
    }
  }
}

/* R7: intra-country spread. Declared as `max_intra_country_spread` and checked
   by nothing until now. Catches the case every per-city bound misses: a set of
   cities each individually plausible against the country, but implying a
   national wage geography no country has. */
for (const [iso, rows] of byCountry) {
  if (rows.length < 2) continue;
  const lo = Math.min(...rows.map((r) => r.wage));
  const hi = Math.max(...rows.map((r) => r.wage));
  if (lo > 0 && hi / lo > MAX_INTRA_SPREAD) {
    messages.push(
      `[${iso}] intra-country wage spread ${(hi / lo).toFixed(2)}x ` +
        `($${lo} to $${hi} across ${rows.length} cities), max ${MAX_INTRA_SPREAD}`,
    );
    failures++;
  }
}

console.log(
  `  ${count} cities checked against bounds declared in the data file: ` +
    `premium <= ${MAX_CITY_PREMIUM}x, discount >= ${MIN_CITY_DISCOUNT}x, ` +
    `intra-country spread <= ${MAX_INTRA_SPREAD}x.`,
);
console.log(`  ${byCountry.size} countries checked for spread.  ${warnings} warnings.`);

if (failures > 0) {
  console.log(`\n  GATE: FAIL  (${failures} violations)`);
  for (const m of messages.slice(0, 30)) console.log("  - " + m);
  process.exit(1);
}

if (warnings > 0) {
  console.log(`\n  Sanity warnings (non-blocking):`);
  for (const m of messages.slice(0, 12)) console.log("  ~ " + m);
}

console.log("\n  GATE: PASS");
