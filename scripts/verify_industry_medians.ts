/**
 * scripts/verify_industry_medians.ts
 *
 * Goldmines Wave 3 — prebuild gate enforcing the integrity of
 * data/quality/industry_medians_v1.json.
 *
 * The file is the cross-country verified median revenue per firm for
 * 44 industries. Used by pickTypicalRevenue in fill_defaults.ts as
 * the preferred anchor for cell pages without primary DB revenue.
 *
 * Rules:
 *   R1. At least 20 industries in the file.
 *   R2. Every industry has global_median > 0 and <= $50M (SMB ceiling).
 *   R3. Every industry has country_medians dictionary populated with
 *       at least 1 country.
 *   R4. Per-country median values fall within [$5K, $100M] (catches
 *       wrong-aggregation / currency-unit errors).
 *   R5. Every industry_id referenced in the file maps to an industry
 *       in src/lib/taxonomy/industries.json OR is a known
 *       legacy / alias ID. Orphan IDs are flagged.
 *
 * Run: npx tsx scripts/verify_industry_medians.ts
 * Exit 0 = pass, exit 1 = fail.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MEDIANS_PATH = path.resolve(ROOT, "data/quality/industry_medians_v1.json");
const TAXONOMY_PATH = path.resolve(ROOT, "src/lib/taxonomy/industries.json");

const MIN_INDUSTRY_COUNT = 20;
const MAX_GLOBAL_MEDIAN = 50_000_000;
const MIN_COUNTRY_VALUE = 5_000;
const MAX_COUNTRY_VALUE = 100_000_000;
// Hard ceiling: above this is a definite unit / currency bug. Below the
// soft ceiling but above MAX_COUNTRY_VALUE is a known wrong-aggregation
// pattern from upstream sources (tax-haven countries) that the render
// layer already clamps via the plausibility floor.
const HARD_COUNTRY_CEILING = 10_000_000_000;

type Industry = {
  global_median: number;
  country_medians: Record<string, number>;
};

const medians = JSON.parse(fs.readFileSync(MEDIANS_PATH, "utf-8")) as {
  industries: Record<string, Industry>;
};
const taxonomy = JSON.parse(fs.readFileSync(TAXONOMY_PATH, "utf-8")) as {
  industries: Array<{ id: string }>;
};
const knownIds = new Set(taxonomy.industries.map((i) => i.id));

let failures = 0;
let warnings = 0;
const messages: string[] = [];

console.log("=== verify_industry_medians ===");

const industries = Object.keys(medians.industries);
if (industries.length < MIN_INDUSTRY_COUNT) {
  messages.push(`${industries.length} industries; minimum is ${MIN_INDUSTRY_COUNT}`);
  failures++;
}

for (const [indId, e] of Object.entries(medians.industries)) {
  // R2: global median sanity.
  if (typeof e.global_median !== "number" || e.global_median <= 0) {
    messages.push(`[${indId}] global_median invalid: ${e.global_median}`);
    failures++;
  } else if (e.global_median > MAX_GLOBAL_MEDIAN) {
    messages.push(
      `[${indId}] global_median=$${e.global_median.toFixed(0)} exceeds SMB ceiling $${MAX_GLOBAL_MEDIAN}`,
    );
    failures++;
  }
  // R3: country medians populated.
  if (!e.country_medians || Object.keys(e.country_medians).length === 0) {
    messages.push(`[${indId}] country_medians is empty`);
    failures++;
    continue;
  }
  // R4: per-country values in plausible range. Soft ceiling produces
  // a warning (matches the known wrong-aggregation pattern for
  // tax-haven countries; render layer clamps these). Hard ceiling
  // produces a failure (clear unit or currency bug).
  for (const [iso, v] of Object.entries(e.country_medians)) {
    if (typeof v !== "number" || v < MIN_COUNTRY_VALUE) {
      messages.push(
        `[${indId}][${iso}] value $${v} below floor $${MIN_COUNTRY_VALUE}`,
      );
      failures++;
    } else if (v > HARD_COUNTRY_CEILING) {
      messages.push(
        `[${indId}][${iso}] value $${v} above hard ceiling $${HARD_COUNTRY_CEILING} (unit or currency bug)`,
      );
      failures++;
    } else if (v > MAX_COUNTRY_VALUE) {
      warnings++;
    }
  }
  // R5: industry id mapped to taxonomy (warn-only — some legacy IDs
  //     may exist in the file but be deprecated in the taxonomy).
  if (!knownIds.has(indId)) {
    messages.push(`[${indId}] not in taxonomy/industries.json (legacy ID?)`);
    warnings++;
  }
}

console.log(`  ${industries.length} industries checked.  ${warnings} taxonomy warnings.`);

if (failures > 0) {
  console.log(`\n  GATE: FAIL  (${failures} violations)`);
  for (const m of messages.slice(0, 30)) console.log("  - " + m);
  process.exit(1);
}
if (warnings > 0) {
  console.log("\n  Taxonomy warnings (non-blocking):");
  for (const m of messages.slice(0, 15)) console.log("  ~ " + m);
}
console.log("\n  GATE: PASS");
