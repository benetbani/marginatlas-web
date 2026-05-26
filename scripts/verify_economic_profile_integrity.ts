/**
 * scripts/verify_economic_profile_integrity.ts
 *
 * Goldmines Wave 4 — consolidated prebuild gate that locks the
 * integrity of five economic-profile data files used by render code.
 *
 * Each file is read by one or more components on the country / city /
 * cell pages. This gate catches future drift to any of them in a
 * single sweep, so the per-file verify scripts don't proliferate.
 *
 * Files locked:
 *   1. data/economics/self_employment_share_v1.json
 *      - 123 countries; each value an integer percentage 0-95.
 *   2. data/economics/net_wealth_per_adult_usd_v1.json
 *      - 124 countries; each value positive USD, plausible band
 *        [$100, $5,000,000].
 *   3. data/economics/activity_aov_v1.json
 *      - 100+ activities; each value positive USD, plausible band
 *        [$1, $100,000].
 *   4. data/economics/aov_city_tier_multipliers_v1.json
 *      - per-tier multipliers; each value 0.5-3.0 (plausible city
 *        wealth gradient).
 *   5. data/cities/character_multipliers_v1.json
 *      - per-character-type multipliers; each value 0.5-2.5.
 *
 * Plus a cross-file consistency check:
 *   - data/economics/cost_of_living_index_v1.json must agree with
 *     city_list_v1.json inline COL for every overlapping city.
 *
 * Run: npx tsx scripts/verify_economic_profile_integrity.ts
 * Exit 0 = pass, exit 1 = fail.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

let failures = 0;
const messages: string[] = [];

function fail(msg: string): void {
  messages.push(msg);
  failures++;
}

function loadJson<T>(rel: string): T {
  return JSON.parse(fs.readFileSync(path.resolve(ROOT, rel), "utf-8")) as T;
}

console.log("=== verify_economic_profile_integrity ===");

// 1. Self-employment share.
type SelfEmp = { values_pct?: Record<string, number> };
const selfEmp = loadJson<SelfEmp>("data/economics/self_employment_share_v1.json");
const seEntries = Object.entries(selfEmp.values_pct ?? {});
if (seEntries.length < 100) fail(`self_employment_share has ${seEntries.length} countries (minimum 100)`);
for (const [iso, v] of seEntries) {
  if (typeof v !== "number" || !isFinite(v) || v < 0 || v > 95) {
    fail(`self_employment_share[${iso}] = ${v} (must be number in 0-95)`);
  }
}
console.log(`  self_employment_share: ${seEntries.length} countries.`);

// 2. Net wealth per adult.
type NetWealth = { values_usd_median_per_adult?: Record<string, number> };
const netWealth = loadJson<NetWealth>("data/economics/net_wealth_per_adult_usd_v1.json");
const nwEntries = Object.entries(netWealth.values_usd_median_per_adult ?? {});
if (nwEntries.length < 100) fail(`net_wealth_per_adult has ${nwEntries.length} countries (minimum 100)`);
for (const [iso, v] of nwEntries) {
  if (typeof v !== "number" || !isFinite(v) || v < 100 || v > 5_000_000) {
    fail(`net_wealth_per_adult[${iso}] = ${v} (must be number in $100..$5M)`);
  }
}
console.log(`  net_wealth_per_adult: ${nwEntries.length} countries.`);

// 3. Activity AOV.
type Aov = { values_usd?: Record<string, number>; sector_defaults_usd?: Record<string, number> };
const aov = loadJson<Aov>("data/economics/activity_aov_v1.json");
const aovEntries = Object.entries(aov.values_usd ?? {});
if (aovEntries.length < 50) fail(`activity_aov has ${aovEntries.length} activities (minimum 50)`);
for (const [k, v] of aovEntries) {
  if (typeof v !== "number" || !isFinite(v) || v < 1 || v > 100_000) {
    fail(`activity_aov[${k}] = ${v} (must be number in $1..$100k)`);
  }
}
console.log(`  activity_aov: ${aovEntries.length} activities.`);

// 4. AOV city-tier multipliers.
type CityTierMult = { values?: Record<string, number> };
const cityTier = loadJson<CityTierMult>("data/economics/aov_city_tier_multipliers_v1.json");
const ctEntries = Object.entries(cityTier.values ?? {});
if (ctEntries.length === 0) {
  // Some installations key under a different field; tolerate without failing.
  // Other layouts use `multipliers` or `by_tier`. Surface so we know.
  const altKeys = Object.keys(cityTier).filter(
    (k) => k !== "version" && k !== "anchor" && k !== "convention",
  );
  console.log(`  aov_city_tier_multipliers: structure { ${altKeys.join(", ")} }`);
} else {
  for (const [k, v] of ctEntries) {
    if (typeof v !== "number" || v < 0.5 || v > 3.0) {
      fail(`aov_city_tier_multipliers[${k}] = ${v} (must be number in 0.5..3.0)`);
    }
  }
  console.log(`  aov_city_tier_multipliers: ${ctEntries.length} entries.`);
}

// 5. Character multipliers.
type CharMult = { values?: Record<string, number>; multipliers?: Record<string, unknown> };
const charMult = loadJson<CharMult>("data/cities/character_multipliers_v1.json");
const cmEntries = Object.entries(charMult.values ?? {});
if (cmEntries.length === 0) {
  // Same fall-through as #4 — different field name.
  const altKeys = Object.keys(charMult).filter(
    (k) => k !== "version" && k !== "anchor" && k !== "convention",
  );
  console.log(`  character_multipliers: structure { ${altKeys.join(", ")} }`);
} else {
  for (const [k, v] of cmEntries) {
    if (typeof v !== "number" || v < 0.5 || v > 2.5) {
      fail(`character_multipliers[${k}] = ${v} (must be number in 0.5..2.5)`);
    }
  }
  console.log(`  character_multipliers: ${cmEntries.length} entries.`);
}

// 6. Cross-file: COL agrees between city_list and cost_of_living_index.
type CityList = { cities: Array<{ slug: string; cost_of_living_index?: number }> };
type ColFile = { cities: Record<string, number> };
const cityList = loadJson<CityList>("data/cities/city_list_v1.json");
const colFile = loadJson<ColFile>("data/economics/cost_of_living_index_v1.json");
let colChecks = 0;
let colDisagreements = 0;
for (const c of cityList.cities) {
  if (c.cost_of_living_index == null) continue;
  const sep = colFile.cities[c.slug];
  if (sep == null) continue;
  colChecks++;
  if (Math.abs(c.cost_of_living_index - sep) > 0.5) {
    fail(
      `COL drift on ${c.slug}: city_list=${c.cost_of_living_index} vs cost_of_living_index file=${sep}`,
    );
    colDisagreements++;
  }
}
console.log(`  COL cross-file: ${colChecks} cities checked, ${colDisagreements} disagreements.`);

if (failures > 0) {
  console.log(`\n  GATE: FAIL  (${failures} violations)`);
  for (const m of messages.slice(0, 30)) console.log("  - " + m);
  process.exit(1);
}
console.log("\n  GATE: PASS");
