/**
 * industry_resolution.test.ts
 *
 * Regression test for the industry reachability fix (data activation,
 * 2026-05-29). Asserts the candidate resolver:
 *   1. returns the EXACT taxonomy id first for the in-taxonomy collapse
 *      class (the bug was collapsing to the measured parent before query),
 *   2. includes the legacy DB id for the crosswalk class so legacy-tagged
 *      rows are reachable from the taxonomy slug,
 *   3. resolves a legacy slug directly to its DB id,
 *   4. produces de-duplicated, non-empty candidate lists.
 *
 * Run: npx tsx tests/cells/industry_resolution.test.ts
 */
import {
  industryQueryCandidates,
  resolveDisplayIndustry,
  LEGACY_DB_TO_TAXONOMY,
} from "../../src/lib/cells/industry_resolution";
import { industryToSlug } from "../../src/lib/taxonomy";

const errors: string[] = [];
const check = (cond: boolean, msg: string) => {
  if (!cond) errors.push(msg);
};

// 1. In-taxonomy collapse class: exact id must come FIRST.
//    doctors_clinics is valid + present in the DB but used to collapse to
//    veterinary_pet_care before the query.
{
  const cands = industryQueryCandidates("doctors-clinics");
  check(
    cands[0] === "doctors_clinics",
    `doctors-clinics: expected exact 'doctors_clinics' first, got [${cands.join(", ")}]`,
  );
  check(
    cands.includes("veterinary_pet_care"),
    `doctors-clinics: parent 'veterinary_pet_care' should remain as a fallback, got [${cands.join(", ")}]`,
  );
  check(
    cands.indexOf("doctors_clinics") < cands.indexOf("veterinary_pet_care"),
    `doctors-clinics: exact id must rank before parent, got [${cands.join(", ")}]`,
  );
}

// 2. Crosswalk class via the TAXONOMY slug: visiting the taxonomy slug for
//    fabricated_metal_mfg must also query the legacy id metal_products_mfg.
{
  const slug = industryToSlug("fabricated_metal_mfg"); // "fabricated-metal-manufacturing"
  const cands = industryQueryCandidates(slug);
  check(
    cands.includes("fabricated_metal_mfg"),
    `${slug}: should include exact 'fabricated_metal_mfg', got [${cands.join(", ")}]`,
  );
  check(
    cands.includes("metal_products_mfg"),
    `${slug}: should include legacy 'metal_products_mfg' via reverse crosswalk, got [${cands.join(", ")}]`,
  );
}

// 3. Crosswalk class via the LEGACY slug: "metal-products-mfg" must resolve
//    directly to the legacy DB id first, then its taxonomy equivalent.
{
  const cands = industryQueryCandidates("metal-products-mfg");
  check(
    cands[0] === "metal_products_mfg",
    `metal-products-mfg: expected legacy 'metal_products_mfg' first, got [${cands.join(", ")}]`,
  );
  check(
    cands.includes("fabricated_metal_mfg"),
    `metal-products-mfg: should include taxonomy 'fabricated_metal_mfg', got [${cands.join(", ")}]`,
  );
}

// 4. Every legacy crosswalk entry round-trips: its slug yields its DB id
//    first, and its taxonomy target is reachable for display.
for (const [legacyId, taxId] of Object.entries(LEGACY_DB_TO_TAXONOMY)) {
  const slug = legacyId.replace(/_/g, "-");
  const cands = industryQueryCandidates(slug);
  check(
    cands[0] === legacyId,
    `legacy '${legacyId}': slug '${slug}' should yield '${legacyId}' first, got [${cands.join(", ")}]`,
  );
  check(
    cands.includes(taxId),
    `legacy '${legacyId}': should include taxonomy target '${taxId}', got [${cands.join(", ")}]`,
  );
  const disp = resolveDisplayIndustry(slug);
  check(
    disp?.id === taxId,
    `legacy '${legacyId}': display industry should be '${taxId}', got '${disp?.id ?? "null"}'`,
  );
}

// 5. De-dup + non-empty for a common case.
{
  const cands = industryQueryCandidates("restaurants");
  check(cands.length > 0, "restaurants: candidates must be non-empty");
  check(
    new Set(cands).size === cands.length,
    `restaurants: candidates must be de-duplicated, got [${cands.join(", ")}]`,
  );
  check(
    cands[0] === "restaurants",
    `restaurants: a measured id should resolve to itself first, got [${cands.join(", ")}]`,
  );
}

if (errors.length > 0) {
  console.error(`FAIL: ${errors.length} assertion(s)`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("PASS: industry_resolution candidate resolver");
