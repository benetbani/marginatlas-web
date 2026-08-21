/**
 * tests/taxonomy/scope_rules.test.ts
 *
 * Gate for the scope rules , the single answer to "does this business belong on
 * this site" (src/lib/taxonomy/scope_rules.ts).
 *
 * WHY THIS IS GATED. Founder ruling, 2026-08-21: "we hunt for businesses that
 * can be seen on the street, and you slap grain farming, all farming is not
 * allowed, banking, financial trading, factories, etc. If a business needs 30m
 * to open, we don't put it on our site." Plus management consulting ("we do not
 * calculate Deloitte and McKinsey revenue here"), and hospitals and schools
 * ("nobody thinks of opening a school randomly").
 *
 * Without a gate, an activity retired today comes back the next time the
 * taxonomy is touched, and four founder rulings have already returned a second
 * time in this project for exactly that reason.
 *
 * THE SECOND HALF OF THIS FILE MATTERS MORE THAN THE FIRST. Checking that
 * `isInScope` agrees with a handful of hand-picked examples proves very little:
 * the examples were chosen by the person who wrote the rules. The bulk checks at
 * the bottom run the rules against the REAL taxonomy and assert on the shape of
 * the outcome, which is the part that catches a rule written too broadly.
 */
import { isInScope, rejectedNames, rejectedSectors } from "../../src/lib/taxonomy/scope_rules";
import industriesJson from "../../src/lib/taxonomy/industries.json";

interface Industry {
  id: string;
  name: string;
  sector_id: string;
}
/* The file is an OBJECT with metadata plus an `industries` array, not a bare
   array. Worth naming: the first draft of this test assumed an array, and the
   failure it produced ("find is not a function") reads like a broken import
   rather than a wrong shape. */
const INDUSTRIES = (industriesJson as unknown as { industries: Industry[] }).industries;

let failed = 0;

function check(name: string, ok: boolean, detail?: string) {
  if (ok) {
    console.log(`  ok    ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}`);
    if (detail) console.log(`        ${detail}`);
  }
}

function inScope(name: string): boolean {
  const row = INDUSTRIES.find((i) => i.name === name);
  if (!row) {
    failed++;
    console.log(`  FAIL  fixture: no activity named ${JSON.stringify(name)} in the taxonomy`);
    return false;
  }
  return isInScope(row).inScope;
}

console.log("\n  -- what must STAY --");

check("a restaurant stays", inScope("Restaurants"));
check("a cafe stays", inScope("Cafés & coffee shops"));
check("a barbershop stays", inScope("Barbershops"));
check("a dental practice stays", inScope("Dental practices"));
check("a plumber stays", inScope("Plumbers"));
check("a clothes shop stays", inScope("Clothing & shoe stores"));
check("a daycare stays", inScope("Daycare & preschool"));

/* The line inside manufacturing is the one most likely to be drawn wrongly, in
   both directions. A cabinet maker has a workshop a passer-by walks into and one
   owner; a primary metal plant has neither. Both live in the same sector, so a
   sector-level rule cannot separate them and a per-activity rule must. */
check("a cabinet maker stays, it is a workshop not a factory", inScope("Cabinet making"));
check("a sole-practitioner accountant stays", inScope("Sole-practitioner accountants"));

console.log("\n  -- what must GO --");

check("grain farming goes", !inScope("Grain farming"));
check("livestock farming goes", !inScope("Livestock farming"));
check("banking goes", !inScope("Banking"));
check("securities and brokerage goes", !inScope("Securities & brokerage"));
check("aerospace manufacturing goes", !inScope("Aerospace & other transport mfg"));
check("primary metal manufacturing goes", !inScope("Primary metal manufacturing"));
check("food manufacturing goes, the retail bakery is a different activity", !inScope("Food manufacturing"));
check("hospitals go", !inScope("Hospitals"));
check("higher education goes", !inScope("Higher education"));
check("primary and secondary schools go", !inScope("Primary & secondary schools"));
check("private K-12 goes", !inScope("Private K-12 schools (small)"));
check("management consulting goes", !inScope("Management consulting"));
check("residential construction goes, the trades under it stay", !inScope("Residential construction"));
check("general wholesale goes", !inScope("General wholesale"));
check("trucking and freight goes", !inScope("Trucking & freight"));
check("e-commerce goes, nobody walks past it", !inScope("E-commerce & mail-order"));
check("municipal water and waste goes", !inScope("Water & waste management"));

console.log("\n  -- the verdict must be auditable --");

const hospitals = INDUSTRIES.find((i) => i.name === "Hospitals")!;
const hv = isInScope(hospitals);
check("a rejection names which tests it failed", hv.failed.length > 0, JSON.stringify(hv));
check("an acceptance names no failed tests", isInScope(INDUSTRIES.find((i) => i.name === "Restaurants")!).failed.length === 0);

console.log("\n  -- against the REAL taxonomy, not hand-picked examples --");

const verdicts = INDUSTRIES.map((i) => ({ i, v: isInScope(i) }));
const kept = verdicts.filter((x) => x.v.inScope);
const gone = verdicts.filter((x) => !x.v.inScope);

console.log(`        ${INDUSTRIES.length} activities -> keeping ${kept.length}, retiring ${gone.length}`);

/* A RULE WRITTEN TOO BROADLY IS THE REAL RISK HERE, and it fails silently: the
   founder asked for a shorter list, so a list that came back far too short would
   look like success. These two bounds are what make that visible. They are
   deliberately loose, because their job is to catch a catastrophe, not to pin a
   number that legitimate edits will move. */
check(
  "retires more than 40 activities, so the rules actually do something",
  gone.length > 40,
  `retired ${gone.length}`,
);
check(
  "retires fewer than 90 activities, so no rule is catastrophically broad",
  gone.length < 90,
  `retired ${gone.length}`,
);

/* Every sector the founder named must be emptied completely. Checking the
   sector rule fired is not the same as checking no member survived it. */
for (const sector of ["finance_corp", "heavy_industry", "higher_ed_hospitals", "mining_energy", "telecom_broadcasting"]) {
  const survivors = kept.filter((x) => x.i.sector_id === sector);
  check(
    `no survivor in ${sector}`,
    survivors.length === 0,
    survivors.map((s) => s.i.name).join(", "),
  );
}

/* Food and drink is the founder's own flagship sector and the one the exemplar
   page lives in. If a rule ever empties it, something is badly wrong. */
const foodKept = kept.filter((x) => x.i.sector_id === "food_drink").length;
check("food and drink keeps most of its members", foodKept >= 15, `kept ${foodKept}`);

/* DEAD RULES ARE WORSE THAN NO RULES: an entry naming an activity that does not
   exist reads as coverage and provides none, and it is how a list and the file
   it describes drift apart without anyone noticing. */
const allNames = new Set(INDUSTRIES.map((i) => i.name));
const orphanNames = rejectedNames().filter((n) => !allNames.has(n));
check(
  "every named rejection matches a real activity",
  orphanNames.length === 0,
  orphanNames.join(", "),
);

const allSectors = new Set(INDUSTRIES.map((i) => i.sector_id));
const orphanSectors = rejectedSectors().filter((s) => !allSectors.has(s));
check(
  "every rejected sector is a real sector",
  orphanSectors.length === 0,
  orphanSectors.join(", "),
);

console.log(failed === 0 ? "\n  all pass" : `\n  ${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
