/**
 * industry_resolution.test.ts
 *
 * Regression test for the industry reachability fix (data activation,
 * 2026-05-29). Asserts the candidate resolver:
 *   1. returns the EXACT taxonomy id first for the in-taxonomy collapse
 *      class (the bug was collapsing to the measured parent before query),
 *   2. includes the legacy DB id for the crosswalk class so legacy-tagged
 *      rows are reachable from the taxonomy slug,
 *   3. resolves a legacy slug directly to its DB id WHERE ITS TAXONOMY
 *      TARGET IS AN ACTIVITY THE ATLAS COVERS, and to no retired activity
 *      where it is not (the goal's A6, 2026-09-24),
 *   4. produces de-duplicated, non-empty candidate lists.
 *
 * Run: npx tsx tests/cells/industry_resolution.test.ts
 */
import {
  industryQueryCandidates,
  resolveDisplayIndustry,
  LEGACY_DB_TO_TAXONOMY,
} from "../../src/lib/cells/industry_resolution";
import { industryToSlug, liveIndustryFor, slugToIndustry } from "../../src/lib/taxonomy";

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
//    auto_dealers must also query the legacy id auto_dealers_gas.
//
//    REPOINTED 2026-08-21, from fabricated_metal_mfg. That was a fabricated
//    metal PLANT, retired by the scope rules, and a retired slug now resolves
//    to nothing on purpose (block 2b). Eleven of the fifteen legacy crosswalk
//    pairs point at a retired target after that change, so the subject here had
//    to be one of the four that survive, or this block would be asserting the
//    behaviour of a trade the atlas no longer publishes.
{
  const slug = industryToSlug("auto_dealers"); // "auto-dealers"
  const cands = industryQueryCandidates(slug);
  check(
    cands.includes("auto_dealers"),
    `${slug}: should include exact 'auto_dealers', got [${cands.join(", ")}]`,
  );
  check(
    cands.includes("auto_dealers_gas"),
    `${slug}: should include legacy 'auto_dealers_gas' via reverse crosswalk, got [${cands.join(", ")}]`,
  );
}

// 2b. A RETIRED ACTIVITY RESOLVES TO NOTHING, and must never fuzzy-match into a
//     different business.
//
//     This is the behaviour the 2026-08-21 scope retirement had to add, and the
//     reason is measured rather than theoretical: the moment 59 activities were
//     retired, `slugToIndustry` fell through to its fuzzy token matcher and
//     "management-consulting" returned SHORT-TERM RENTAL MANAGEMENT while
//     "residential-construction" returned RESIDENTIAL PAINTERS. Every page still
//     rendered. Eight references across seven files silently pointed at another
//     trade.
//
//     The URL is handled by a 308 in the middleware. The resolver's job is to
//     say honestly that we do not hold this, so callers self-omit.
{
  for (const retiredSlug of ["management-consulting", "residential-construction", "grain-farming", "banking"]) {
    check(
      slugToIndustry(retiredSlug) === null,
      `${retiredSlug}: a retired activity must resolve to null, got ${slugToIndustry(retiredSlug)?.id ?? "null"}`,
    );
  }
}

// 3. Crosswalk class via the LEGACY slug, REPOINTED 2026-09-24 (the goal's
//    A6) from "metal-products-mfg displays fabricated_metal_mfg". That target
//    is a fabricated metal PLANT the 2026-08-21 scope rules retired, and the
//    assertion kept production printing it: /gb/london/metal-products-mfg read
//    "How much do fabricated metal manufacturing earn in London?" when fetched.
//    The slug now names the live trade its alias points at, and its legacy row
//    is no longer queried first, because that row is the retired activity's.
{
  const cands = industryQueryCandidates("metal-products-mfg");
  check(
    cands[0] === "metal_fab_machine_shops",
    `metal-products-mfg: expected the live 'metal_fab_machine_shops' first, got [${cands.join(", ")}]`,
  );
  check(
    !cands.includes("metal_products_mfg"),
    `metal-products-mfg: the retired activity's legacy row 'metal_products_mfg' must not be queried, got [${cands.join(", ")}]`,
  );
  const disp = resolveDisplayIndustry("metal-products-mfg");
  check(
    disp?.id === "metal_fab_machine_shops",
    `metal-products-mfg: display industry should be the live 'metal_fab_machine_shops', got '${disp?.id ?? "null"}'`,
  );
}

// 4. Every legacy crosswalk entry, in two classes (the goal's A6, 2026-09-24;
//    the block's old form asserted all fifteen round-trips, eleven of them onto
//    an activity the 2026-08-21 ruling retired, which is the note on block 2
//    carried to its end):
//    - where the taxonomy target is an activity the atlas covers (four pairs),
//      the slug yields its DB id first, includes the target, and displays it;
//    - where it is retired (eleven), the slug neither queries the legacy row
//      nor displays the retired target: it resolves like any other word, to a
//      live trade or to nothing.
let livePairs = 0;
let retiredPairs = 0;
for (const [legacyId, taxId] of Object.entries(LEGACY_DB_TO_TAXONOMY)) {
  const slug = legacyId.replace(/_/g, "-");
  const cands = industryQueryCandidates(slug);
  const disp = resolveDisplayIndustry(slug);
  const live = liveIndustryFor(taxId);
  if (live) {
    livePairs++;
    check(
      cands[0] === legacyId,
      `legacy '${legacyId}': slug '${slug}' should yield '${legacyId}' first, got [${cands.join(", ")}]`,
    );
    check(
      cands.includes(live.id),
      `legacy '${legacyId}': should include taxonomy target '${live.id}', got [${cands.join(", ")}]`,
    );
    check(
      disp?.id === live.id,
      `legacy '${legacyId}': display industry should be '${live.id}', got '${disp?.id ?? "null"}'`,
    );
  } else {
    retiredPairs++;
    check(
      !cands.includes(legacyId),
      `legacy '${legacyId}': its target '${taxId}' is retired, so the legacy row must not be queried, got [${cands.join(", ")}]`,
    );
    check(
      disp === null || liveIndustryFor(disp.id)?.id === disp.id,
      `legacy '${legacyId}': display must be a live trade or nothing, got '${disp?.id ?? "null"}'`,
    );
    check(
      disp?.id !== taxId,
      `legacy '${legacyId}': display must never be the retired target '${taxId}'`,
    );
  }
}
check(livePairs === 4 && retiredPairs === 11, `the crosswalk's classes moved: ${livePairs} live and ${retiredPairs} retired pairs, 4 and 11 when this block was written; re-read the ruling before changing either number`);

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
