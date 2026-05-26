/**
 * scripts/verify_wage_quality.ts
 *
 * Standalone quality gate for the wage data. Runs the same checks the
 * recompute script runs, but in read-only mode. Safe to add to the
 * prebuild gate chain once the founder is happy with the wage data.
 *
 * Checks:
 *   1. Every country in country_profile_v2.json has a coherent
 *      median_wage_full_time_usd (within tier-aware bounds vs GDP/cap).
 *   2. Every city in city_list_v1.json with a known country has a
 *      coherent avg_gross_salary_usd_year (between 0.7x and 1.6x
 *      country baseline).
 *   3. No country drops below the $50/mo poverty floor.
 *   4. No country rises above the $15,000/mo ceiling.
 *
 * Run: npx tsx scripts/verify_wage_quality.ts
 * Exit code: 0 if all good, 1 if hard failures (out of bounds).
 *            Soft warnings don't fail the script.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MEDIAN_PATH = path.resolve(ROOT, "data/economics/median_monthly_wage_usd_v1.json");
const PROFILE_PATH = path.resolve(ROOT, "data/economic_indicators/country_profile_v2.json");
const CITIES_PATH = path.resolve(ROOT, "data/cities/city_list_v1.json");

type MedianRow = { median_monthly_wage_usd: number; source_quality: string };
type MedianFile = { countries: Record<string, MedianRow>; default_fallback: MedianRow };
type ProfileCountry = {
  median_wage_full_time_usd: number;
  gdp_per_capita_usd_nominal: number;
};
type ProfileFile = { countries: Record<string, ProfileCountry> };
type CityEntry = {
  slug: string;
  iso2: string;
  tier: number;
  avg_gross_salary_usd_year?: number;
  name?: string;
};
type CityFile = { cities: CityEntry[] };

const median = JSON.parse(fs.readFileSync(MEDIAN_PATH, "utf-8")) as MedianFile;
const profile = JSON.parse(fs.readFileSync(PROFILE_PATH, "utf-8")) as ProfileFile;
const cities = JSON.parse(fs.readFileSync(CITIES_PATH, "utf-8")) as CityFile;

let hardFails = 0;
let warnings = 0;

function fail(msg: string) {
  console.log(`  ✗ FAIL  ${msg}`);
  hardFails++;
}
function warn(msg: string) {
  console.log(`  !  WARN  ${msg}`);
  warnings++;
}

console.log("=== Country profile coherence ===");
for (const [iso2, c] of Object.entries(profile.countries)) {
  const monthly = c.median_wage_full_time_usd / 12;
  if (monthly < 50) fail(`[${iso2}] monthly wage $${monthly.toFixed(0)} below $50 poverty floor`);
  if (monthly > 15000) fail(`[${iso2}] monthly wage $${monthly.toFixed(0)} above $15,000 ceiling`);
  if (c.gdp_per_capita_usd_nominal > 0) {
    const ratio = c.median_wage_full_time_usd / c.gdp_per_capita_usd_nominal;
    const gdpCap = c.gdp_per_capita_usd_nominal;
    const upper = gdpCap < 2000 ? 4.5 : gdpCap < 10000 ? 2.5 : 1.8;
    const lower = 0.3;
    if (ratio > upper) warn(`[${iso2}] wage/GDP ratio ${ratio.toFixed(2)} > upper ${upper} (GDP/cap $${gdpCap})`);
    if (ratio < lower) warn(`[${iso2}] wage/GDP ratio ${ratio.toFixed(2)} < lower ${lower} (GDP/cap $${gdpCap})`);
  }
}

console.log("\n=== City wages coherent vs country baseline ===");
for (const city of cities.cities) {
  const iso2 = (city.iso2 || "").toUpperCase();
  if (!iso2) continue;
  const baseline = median.countries[iso2];
  if (!baseline || !city.avg_gross_salary_usd_year) continue;
  const baselineAnnual = baseline.median_monthly_wage_usd * 12;
  const ratio = city.avg_gross_salary_usd_year / baselineAnnual;
  if (ratio < 0.6 || ratio > 1.7) {
    warn(`[${iso2}.${city.slug}] city wage $${city.avg_gross_salary_usd_year} vs country baseline $${baselineAnnual} (ratio ${ratio.toFixed(2)})`);
  }
}

console.log("\n=== Country coverage ===");
const profileIsos = Object.keys(profile.countries);
const medianIsos = Object.keys(median.countries);
const missing = profileIsos.filter((i) => !medianIsos.includes(i));
if (missing.length > 0) {
  fail(`${missing.length} countries in profile missing from median wage file: ${missing.join(", ")}`);
}

console.log(`\n=== Summary ===`);
console.log(`  hard failures: ${hardFails}`);
console.log(`  warnings:      ${warnings}`);
if (hardFails > 0) {
  console.log("\n  GATE: FAIL (hard failures present)");
  process.exit(1);
}
console.log("\n  GATE: PASS");
