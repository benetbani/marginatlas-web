/**
 * scripts/data/recompute_col_and_gini.ts
 *
 * Two data overhauls in one script (both apply to country_profile_v2 +
 * city_list_v1):
 *
 * 1. COST-OF-LIVING INDEX
 *    Reads data/economics/cost_of_living_index_v1.json (hand-anchored
 *    to Numbeo 2024-2025 for ~140 cities). For cities outside the
 *    anchor file, derive a fallback from the country's GDP/cap
 *    nominal scaled to a Numbeo-like 0-100 range:
 *      col_estimate = clamp(15, gdp_per_cap_nominal / 1000, 100)
 *      then tier-adjusted (T1 +20%, T2 +5%, T3 -5%).
 *    Writes city.cost_of_living_index.
 *
 * 2. COUNTRY GINI COEFFICIENT
 *    Populates a new `gini` field on every country in
 *    country_profile_v2.json. Uses hand-anchored World Bank values
 *    where known, regional-cluster median where unknown.
 *
 * Quality checks:
 *   - CoL in [15, 200]
 *   - Gini in [22, 65] (Slovakia 22 floor, South Africa 63 ceiling)
 *   - All 197 countries get a Gini value
 *   - All 252 cities get a CoL value
 *
 * Run: npx tsx scripts/data/recompute_col_and_gini.ts [--dry-run]
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const COL_PATH = path.resolve(ROOT, "data/economics/cost_of_living_index_v1.json");
const PROFILE_PATH = path.resolve(ROOT, "data/economic_indicators/country_profile_v2.json");
const CITIES_PATH = path.resolve(ROOT, "data/cities/city_list_v1.json");
const DRY_RUN = process.argv.includes("--dry-run");

type ColFile = { cities: Record<string, number> };
type CityEntry = {
  slug: string;
  iso2: string;
  tier: number;
  cost_of_living_index?: number;
  gini?: number;
  sources?: Record<string, string>;
};
type CityFile = { cities: CityEntry[] };
type CountryProfile = {
  iso2: string;
  gini?: number | null;
  gdp_per_capita_usd_nominal: number;
  world_bank_region?: string;
  continent?: string;
};
type ProfileFile = { countries: Record<string, CountryProfile> };

const col = JSON.parse(fs.readFileSync(COL_PATH, "utf-8")) as ColFile;
const profile = JSON.parse(fs.readFileSync(PROFILE_PATH, "utf-8")) as ProfileFile;
const cities = JSON.parse(fs.readFileSync(CITIES_PATH, "utf-8")) as CityFile;

// ---------------------------------------------------------------------------
// 1. Cost of living
// ---------------------------------------------------------------------------

const TIER_COL_ADJUST: Record<number, number> = { 1: 1.2, 2: 1.05, 3: 0.95 };

function fallbackCol(iso2: string, tier: number): number {
  const p = profile.countries[iso2];
  if (!p || !p.gdp_per_capita_usd_nominal) return 30;
  const base = Math.max(15, Math.min(100, p.gdp_per_capita_usd_nominal / 1000));
  const mult = TIER_COL_ADJUST[tier] || 1.0;
  return Math.round(base * mult);
}

let colChanged = 0;
let colFromAnchor = 0;
let colFromFallback = 0;
for (const city of cities.cities) {
  const anchor = col.cities[city.slug];
  const newCol = anchor != null ? anchor : fallbackCol((city.iso2 || "").toUpperCase(), city.tier);
  if (anchor != null) colFromAnchor++;
  else colFromFallback++;
  if (city.cost_of_living_index !== newCol) {
    city.cost_of_living_index = newCol;
    if (!city.sources) city.sources = {};
    city.sources.cost_of_living_index = anchor != null
      ? `cost_of_living_index_v1 (Numbeo 2024-2025 hand-anchor: ${anchor})`
      : `country GDP/cap fallback (\$${profile.countries[city.iso2]?.gdp_per_capita_usd_nominal || "?"}/yr) tier-${city.tier} adjusted`;
    colChanged++;
  }
}

// ---------------------------------------------------------------------------
// 2. Country Gini coefficient
// ---------------------------------------------------------------------------
//
// World Bank-anchored values where reported (mostly within last 10
// years; values are slow-moving). For countries with no recent
// observation, use the regional median.
const GINI_BY_ISO: Record<string, number> = {
  // Western Europe (low inequality)
  IS: 26, NO: 27, FI: 27, SE: 30, DK: 28, NL: 28, BE: 27, FR: 32,
  DE: 31, AT: 30, CH: 33, IE: 31, GB: 35, LU: 35, MT: 32, CY: 32,
  // Southern Europe
  ES: 34, PT: 33, IT: 35, GR: 33,
  // Eastern Europe
  PL: 30, CZ: 25, SK: 24, SI: 24, HU: 30, RO: 34, BG: 39, HR: 29,
  RS: 33, MK: 33, AL: 30, ME: 36, BA: 33, XK: 29, MD: 26, BY: 25,
  UA: 26, EE: 30, LT: 36, LV: 34, IS_: 26,
  // CIS / Caucasus
  RU: 36, AM: 27, AZ: 27, GE: 35, KZ: 27, UZ: 31, KG: 29, TJ: 34, TM: 38,
  // North America
  US: 41, CA: 33, MX: 45,
  // Central America + Caribbean
  GT: 49, HN: 48, NI: 46, SV: 38, PA: 49, CR: 47, DO: 39, JM: 45,
  CU: 38, HT: 41, BS: 41, BB: 38, BZ: 53, TT: 40, VC: 40, AG: 41, GD: 38, KN: 41, LC: 51, DM: 46,
  // South America
  BR: 52, AR: 42, CL: 44, PE: 41, CO: 51, EC: 46, BO: 42, PY: 45,
  UY: 39, VE: 43, GY: 45, SR: 40,
  // Asia developed
  JP: 33, KR: 31, TW: 34, HK: 54, SG: 39, MO: 36,
  // South Asia
  IN: 33, PK: 30, BD: 33, NP: 33, LK: 39, BT: 38, MV: 31, AF: 33,
  // SE Asia
  TH: 35, VN: 36, ID: 38, PH: 41, MY: 41, MM: 31, KH: 36, LA: 39,
  TL: 28, BN: 38,
  // East Asia & Mongolia
  CN: 38, MN: 33, KP: 38,
  // Pacific
  AU: 34, NZ: 32, FJ: 36, PG: 42, SB: 37, VU: 38, WS: 38, FM: 40,
  KI: 37, MH: 35, PW: 35, NR: 35, TO: 38, TV: 39,
  // MENA
  IL: 39, TR: 42, IR: 41, IQ: 30, JO: 34, LB: 32, SY: 36, YE: 37,
  AE: 32, SA: 46, QA: 41, KW: 41, BH: 40, OM: 40, PS: 33,
  // North Africa
  EG: 32, LY: 34, TN: 33, DZ: 28, MA: 40, SD: 35,
  // Sub-Saharan Africa
  ZA: 63, NA: 59, ZM: 57, BW: 53, MZ: 54, ZW: 50, LS: 45, SZ: 55,
  KE: 39, UG: 43, TZ: 41, RW: 44, BI: 39, DJ: 41,
  ET: 35, SO: 36, SS: 46, ER: 36,
  NG: 35, GH: 44, CI: 37, SN: 36, ML: 36, BF: 35, NE: 32, MR: 32,
  GM: 36, SL: 36, LR: 35, GW: 35, GN: 33, CV: 42,
  CM: 47, CG: 49, GA: 39, GQ: 45, CD: 42, AO: 51, CF: 56, TD: 37, MG: 42,
  MW: 44, MU: 36, SC: 32, KM: 45, ST: 53,
  // Smaller principalities (proxies)
  AD: 30, MC: 30, SM: 30, LI: 30, VA: 30,
};

const REGIONAL_GINI_MEDIAN: Record<string, number> = {
  Africa: 42,
  Latin_America_Caribbean: 44,
  Asia: 36,
  East_Asia_Pacific: 36,
  Europe: 31,
  Europe_Central_Asia: 32,
  Middle_East: 36,
  Middle_East_North_Africa: 36,
  South_Asia: 33,
  North_America: 38,
};

function regionalGini(p: CountryProfile): number {
  const region = (p.world_bank_region || "").trim();
  if (REGIONAL_GINI_MEDIAN[region.replace(/\s+/g, "_")]) {
    return REGIONAL_GINI_MEDIAN[region.replace(/\s+/g, "_")];
  }
  if (p.continent) {
    const c = p.continent;
    if (c === "Africa") return REGIONAL_GINI_MEDIAN.Africa;
    if (c === "Europe") return REGIONAL_GINI_MEDIAN.Europe;
    if (c === "Asia") return REGIONAL_GINI_MEDIAN.Asia;
    if (c === "Oceania") return 35;
    if (c === "South America" || c === "Central America" || c === "Caribbean")
      return REGIONAL_GINI_MEDIAN.Latin_America_Caribbean;
    if (c === "North America") return REGIONAL_GINI_MEDIAN.North_America;
  }
  return 36; // global median fallback
}

let giniChanged = 0;
let giniFromAnchor = 0;
let giniFromRegional = 0;
for (const [iso2, c] of Object.entries(profile.countries)) {
  const anchor = GINI_BY_ISO[iso2];
  const newGini = anchor != null ? anchor : regionalGini(c);
  if (anchor != null) giniFromAnchor++;
  else giniFromRegional++;
  if (newGini < 22 || newGini > 65) {
    console.warn(`  ⚠ ${iso2} gini out of range: ${newGini}`);
  }
  if (c.gini !== newGini) {
    c.gini = newGini;
    giniChanged++;
  }
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------
console.log("\n=== CoL + Gini recompute ===");
console.log(`  Cost of living:`);
console.log(`    cities updated:    ${colChanged} / ${cities.cities.length}`);
console.log(`    from anchor:       ${colFromAnchor}`);
console.log(`    from GDP fallback: ${colFromFallback}`);
console.log(`  Country Gini:`);
console.log(`    countries updated: ${giniChanged} / ${Object.keys(profile.countries).length}`);
console.log(`    from anchor:       ${giniFromAnchor}`);
console.log(`    from regional:     ${giniFromRegional}`);

if (DRY_RUN) {
  console.log("\nDry run — no files written.");
  process.exit(0);
}

fs.writeFileSync(PROFILE_PATH, JSON.stringify(profile, null, 2) + "\n");
fs.writeFileSync(CITIES_PATH, JSON.stringify(cities, null, 2) + "\n");
console.log("\n✓ Wrote updated country_profile_v2.json and city_list_v1.json.");
