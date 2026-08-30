/**
 * scripts/data/apply_wage_deciles.ts
 *
 * Pushes the researched decile dispersion in
 * data/economics/wage_deciles_v1.json into
 * data/economic_indicators/country_profile_v2.json as:
 *
 *   wage_p10_usd = round(median_wage_full_time_usd * d1_over_d5)
 *   wage_p90_usd = round(median_wage_full_time_usd * d9_over_d5)
 *
 * WHY THE MULTIPLICATION HAPPENS HERE AND NOWHERE ELSE. The founder's ruling
 * of 2026-08-30 (notation N9) is that a spread renders as the bottom ten
 * percent, the typical and the top ten percent. The ratios are measured; the
 * median is ours; the product is the only derived number in the chain, and it
 * exists in exactly one place so it can never drift between the page, the
 * dossier and the gate.
 *
 * WHAT THIS SCRIPT WILL NOT DO. It will not invent a decile for a country with
 * no entry in the source file, and it DELETES any decile fields on a country
 * whose entry has gone away, so withdrawing research withdraws the drawing.
 * It never reads wage_p25_usd or wage_p75_usd: that pair is a fixed multiple
 * of the median (recompute_wages_from_median.ts, x0.65 and x1.55), and
 * deriving a decile from it would be the fabrication N9 bans by name.
 *
 * Run:      npx tsx scripts/data/apply_wage_deciles.ts
 * Dry run:  npx tsx scripts/data/apply_wage_deciles.ts --dry-run
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DECILES_PATH = path.resolve(ROOT, "data/economics/wage_deciles_v1.json");
const PROFILE_PATH = path.resolve(ROOT, "data/economic_indicators/country_profile_v2.json");
const DRY_RUN = process.argv.includes("--dry-run");

type DecileRecord = {
  d1_over_d5: number;
  d9_over_d5: number;
  _meta?: { confidence?: string; source?: string; as_of?: string; method?: string };
};
type DecileFile = {
  quality_checks: {
    min_d1_over_d5: number;
    max_d1_over_d5: number;
    min_d9_over_d5: number;
    max_d9_over_d5: number;
  };
  countries: Record<string, DecileRecord>;
};
type Profile = {
  iso2: string;
  name?: string;
  median_wage_full_time_usd: number;
  wage_p10_usd?: number;
  wage_p90_usd?: number;
};
type ProfileFile = { countries: Record<string, Profile> };

const deciles = JSON.parse(fs.readFileSync(DECILES_PATH, "utf-8")) as DecileFile;
const profileFile = JSON.parse(fs.readFileSync(PROFILE_PATH, "utf-8")) as ProfileFile;
const QC = deciles.quality_checks;

const problems: string[] = [];
const rows: Array<[string, number, number, number, string]> = [];
let written = 0;
let cleared = 0;

for (const [iso, rec] of Object.entries(deciles.countries)) {
  const profile = profileFile.countries[iso];
  if (!profile) {
    problems.push(`[${iso}] has decile research but no country profile row`);
    continue;
  }
  const median = profile.median_wage_full_time_usd;
  if (typeof median !== "number" || !(median > 0)) {
    problems.push(`[${iso}] profile median_wage_full_time_usd is missing or not positive`);
    continue;
  }
  const { d1_over_d5: d1, d9_over_d5: d9 } = rec;
  if (typeof d1 !== "number" || typeof d9 !== "number") {
    problems.push(`[${iso}] ratios are not numbers`);
    continue;
  }
  if (d1 < QC.min_d1_over_d5 || d1 > QC.max_d1_over_d5) {
    problems.push(`[${iso}] d1_over_d5=${d1} outside [${QC.min_d1_over_d5}, ${QC.max_d1_over_d5}]`);
    continue;
  }
  if (d9 < QC.min_d9_over_d5 || d9 > QC.max_d9_over_d5) {
    problems.push(`[${iso}] d9_over_d5=${d9} outside [${QC.min_d9_over_d5}, ${QC.max_d9_over_d5}]`);
    continue;
  }
  const p10 = Math.round(median * d1);
  const p90 = Math.round(median * d9);
  if (!(p10 < median && median < p90)) {
    problems.push(`[${iso}] ordering fails: p10=${p10} median=${median} p90=${p90}`);
    continue;
  }
  rows.push([iso, p10, Math.round(median), p90, rec._meta?.as_of ?? "?"]);
  if (!DRY_RUN) {
    profile.wage_p10_usd = p10;
    profile.wage_p90_usd = p90;
  }
  written++;
}

/* Withdrawn research withdraws the drawing. */
for (const [iso, profile] of Object.entries(profileFile.countries)) {
  if (deciles.countries[iso]) continue;
  if (profile.wage_p10_usd === undefined && profile.wage_p90_usd === undefined) continue;
  cleared++;
  if (!DRY_RUN) {
    delete profile.wage_p10_usd;
    delete profile.wage_p90_usd;
  }
}

console.log("=== apply_wage_deciles" + (DRY_RUN ? " (DRY RUN)" : "") + " ===");
rows.sort((a, b) => a[0].localeCompare(b[0]));
for (const [iso, p10, med, p90, asOf] of rows) {
  console.log(
    `  ${iso}  bottom ten ${String(p10).padStart(7)}   typical ${String(med).padStart(7)}   top ten ${String(p90).padStart(7)}   (${asOf})`,
  );
}
console.log(`  ${written} countries filled, ${cleared} cleared.`);

if (problems.length) {
  console.log(`\n  REFUSED (${problems.length}), nothing written for these:`);
  for (const p of problems) console.log("  - " + p);
}

if (!DRY_RUN) {
  fs.writeFileSync(PROFILE_PATH, JSON.stringify(profileFile, null, 2) + "\n", "utf-8");
  console.log(`\n  Wrote ${path.relative(ROOT, PROFILE_PATH)}.`);
} else {
  console.log("\n  Dry run: no file written.");
}

if (problems.length) process.exit(1);
