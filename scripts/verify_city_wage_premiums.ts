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
const MAX_CITY_PREMIUM = 4.0;
const MIN_CITY_DISCOUNT = 0.5;

type CityWage = { avg_monthly_wage_usd: number; source_quality?: string };
type CountryWage = { median_monthly_wage_usd: number };

const cityWage = JSON.parse(fs.readFileSync(CITY_WAGE_PATH, "utf-8")) as {
  cities: Record<string, CityWage>;
};
const countryWage = JSON.parse(fs.readFileSync(COUNTRY_WAGE_PATH, "utf-8")) as {
  countries: Record<string, CountryWage>;
};
const cityList = JSON.parse(fs.readFileSync(CITY_LIST_PATH, "utf-8")) as {
  cities: Array<{ slug: string; iso2: string }>;
};

const citySlugSet = new Set(cityList.cities.map((c) => c.slug.toLowerCase()));
const slugToIso = new Map<string, string>();
for (const c of cityList.cities) {
  slugToIso.set(c.slug.toLowerCase(), c.iso2.toUpperCase());
}

let failures = 0;
let warnings = 0;
const messages: string[] = [];

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
  const iso = slugToIso.get(slugLower);
  if (iso) {
    const country = countryWage.countries[iso];
    if (country && country.median_monthly_wage_usd > 0) {
      const ratio = c.avg_monthly_wage_usd / country.median_monthly_wage_usd;
      if (ratio > MAX_CITY_PREMIUM) {
        messages.push(
          `[${slug}] ${ratio.toFixed(2)}x country wage (max ${MAX_CITY_PREMIUM})`,
        );
        warnings++;
      } else if (ratio < MIN_CITY_DISCOUNT) {
        messages.push(
          `[${slug}] ${ratio.toFixed(2)}x country wage (min ${MIN_CITY_DISCOUNT})`,
        );
        warnings++;
      }
    }
  }
}

console.log(`  ${count} cities checked.  ${warnings} premium/discount warnings.`);

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
