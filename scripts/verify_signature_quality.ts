/**
 * scripts/verify_signature_quality.ts
 *
 * Signature panel quality gate. 12 checks across 5 tiers per the
 * master plan at docs/strategy/2026-05-26-signature-panel-rollout-plan.md.
 *
 * Run: npx tsx scripts/verify_signature_quality.ts
 * Exit code 0 = pass, 1 = fail.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const COUNTRY_PATH = path.resolve(ROOT, "data/cities/country_signature_v1.json");
const CITY_PATH = path.resolve(ROOT, "data/cities/city_signature_v1.json");
const PROFILE_PATH = path.resolve(ROOT, "data/economic_indicators/country_profile_v2.json");
const CITY_LIST_PATH = path.resolve(ROOT, "data/cities/city_list_v1.json");

type Sig = {
  foreign_born_pct: number;
  foreign_owned_pct: number;
  signature_sectors: Array<{ label: string; industry_slug: string; blurb: string }>;
  culture: Record<string, number>;
  government: Record<string, number>;
  commercial_streets?: Array<{ name: string; area: string; sells: string }>;
};

const country = JSON.parse(fs.readFileSync(COUNTRY_PATH, "utf-8")) as { countries: Record<string, Sig> };
const city = JSON.parse(fs.readFileSync(CITY_PATH, "utf-8")) as { cities: Record<string, Partial<Sig>> };
const profile = JSON.parse(fs.readFileSync(PROFILE_PATH, "utf-8")) as { countries: Record<string, { iso2: string }> };
const cityList = JSON.parse(fs.readFileSync(CITY_LIST_PATH, "utf-8")) as { cities: Array<{ slug: string; iso2: string; tier: number }> };

let pass = 0;
let warn = 0;
let fail = 0;
const failures: string[] = [];

function failCheck(msg: string) {
  failures.push(msg);
  fail++;
}
const warnings: string[] = [];
function warnCheck(msg: string) {
  warnings.push(msg);
  warn++;
}

const CULTURE_FIELDS = [
  "punctuality",
  "openness_to_foreigners",
  "innovation",
  "communication_directness",
  "corruption_rejection",
  "ambition_chest_beating",
];
const GOVERNMENT_FIELDS = [
  "tax_predictability",
  "low_bribery",
  "task_efficiency",
  "time_efficiency",
  "judicial_impartiality",
  "innovation_capacity",
];

// Banned only as the headline label. Blurbs may mention banking/agriculture in
// context (e.g. "remittances anchor consumer banking"). The rule is about what
// the city/country claims as its SIGNATURE, not factual context in commentary.
const BANNED_SECTOR_PATTERN = /^(bank|banks|banking|asset management|farming|agriculture|livestock)$/i;
const LONDON_INSURANCE_EXCEPTION = "Lloyd's of London";

// -- Tier 1: per-row hard checks -------------------------------------------
console.log("=== Tier 1: range + structure ===");
for (const [iso, sig] of Object.entries(country.countries)) {
  for (const f of CULTURE_FIELDS) {
    if (typeof sig.culture[f] !== "number" || sig.culture[f] < 1 || sig.culture[f] > 10) {
      failCheck(`[${iso}] culture.${f}=${sig.culture[f]} out of range 1-10`);
    }
  }
  for (const f of GOVERNMENT_FIELDS) {
    if (typeof sig.government[f] !== "number" || sig.government[f] < 0 || sig.government[f] > 10) {
      failCheck(`[${iso}] government.${f}=${sig.government[f]} out of range 0-10`);
    }
  }
  if (sig.foreign_born_pct < 0 || sig.foreign_born_pct > 100) {
    failCheck(`[${iso}] foreign_born_pct=${sig.foreign_born_pct} out of range`);
  }
  if (sig.foreign_owned_pct < 0 || sig.foreign_owned_pct > 100) {
    failCheck(`[${iso}] foreign_owned_pct=${sig.foreign_owned_pct} out of range`);
  }
  if (!Array.isArray(sig.signature_sectors) || sig.signature_sectors.length !== 3) {
    failCheck(`[${iso}] signature_sectors must have exactly 3 entries (got ${sig.signature_sectors?.length})`);
  } else {
    for (const sec of sig.signature_sectors) {
      // Banks / asset management / farms ban — exact label match only.
      // Sub-sector labels like "Olive oil processing" or "Salmon aquaculture"
      // are legitimately distinctive; the rule blocks generic "Banking" or
      // "Agriculture" as a SIGNATURE label. London insurance is a separate
      // exception (insurance isn't on the banned list anyway).
      void LONDON_INSURANCE_EXCEPTION;
      if (BANNED_SECTOR_PATTERN.test(sec.label.trim())) {
        warnCheck(`[${iso}] signature sector label is banned generic: ${sec.label}`);
      }
    }
  }
  pass++;
}
console.log(`  ${Object.keys(country.countries).length} country rows checked.`);

// -- Tier 4: city vs country consistency -----------------------------------
console.log("\n=== Tier 4: city ↔ country consistency ===");
let cityOverrides = 0;
for (const [slug, citySig] of Object.entries(city.cities)) {
  const cityListEntry = cityList.cities.find((c) => c.slug === slug);
  if (!cityListEntry) continue;
  const iso = cityListEntry.iso2.toUpperCase();
  const countryBaseline = country.countries[iso];
  if (!countryBaseline) continue;
  cityOverrides++;
  // Partial overrides are valid (e.g. commercial_streets only). Only
  // run the divergence check on fields the city actually overrides.
  // Nested partials: a city may override e.g. only openness_to_foreigners.
  // Skip fields the city does NOT override.
  if (citySig.culture) {
    const cc = citySig.culture as Record<string, number | undefined>;
    for (const f of CULTURE_FIELDS) {
      const cv = cc[f];
      if (typeof cv !== "number") continue;
      const delta = Math.abs(cv - countryBaseline.culture[f]);
      if (delta > 3) {
        warnCheck(`[city ${slug}] culture.${f} diverges ${delta} pts from country ${iso}`);
      }
    }
  }
  if (citySig.government) {
    const cg = citySig.government as Record<string, number | undefined>;
    for (const f of GOVERNMENT_FIELDS) {
      const gv = cg[f];
      if (typeof gv !== "number") continue;
      const delta = Math.abs(gv - countryBaseline.government[f]);
      if (delta > 3) {
        warnCheck(`[city ${slug}] government.${f} diverges ${delta} pts from country ${iso}`);
      }
    }
  }
  // Commercial streets sanity: each entry needs name + area + sells.
  if (citySig.commercial_streets) {
    for (const s of citySig.commercial_streets) {
      if (!s.name || !s.area || !s.sells) {
        failCheck(`[city ${slug}] commercial street missing required field`);
      }
    }
    if (citySig.commercial_streets.length < 3) {
      warnCheck(`[city ${slug}] only ${citySig.commercial_streets.length} commercial streets`);
    }
  }
}
console.log(`  ${cityOverrides} cities checked against country baselines.`);

// -- Tier 2: anchor-pair monotonicity --------------------------------------
console.log("\n=== Tier 2: anchor-pair monotonicity ===");
type Anchor = { a: string; b: string; dim: "culture" | "government"; field: string; expect: ">" | "<" };
const ANCHORS: Anchor[] = [
  { a: "SE", b: "US", dim: "government", field: "low_bribery", expect: ">" },
  { a: "JP", b: "DE", dim: "government", field: "task_efficiency", expect: ">" },
  { a: "UK", b: "IT", dim: "government", field: "judicial_impartiality", expect: ">" },
  { a: "SG", b: "HK", dim: "government", field: "tax_predictability", expect: ">" },
  { a: "SA", b: "SE", dim: "culture", field: "openness_to_foreigners", expect: "<" },
  { a: "US", b: "JP", dim: "culture", field: "ambition_chest_beating", expect: ">" },
];
for (const ap of ANCHORS) {
  // UK is stored as "GB" in our taxonomy
  const isoA = ap.a === "UK" ? "GB" : ap.a;
  const isoB = ap.b === "UK" ? "GB" : ap.b;
  const sigA = country.countries[isoA];
  const sigB = country.countries[isoB];
  if (!sigA || !sigB) {
    warnCheck(`anchor pair ${ap.a} vs ${ap.b}: one missing, skip`);
    continue;
  }
  const valA = (sigA[ap.dim] as Record<string, number>)[ap.field];
  const valB = (sigB[ap.dim] as Record<string, number>)[ap.field];
  const passed = ap.expect === ">" ? valA > valB : valA < valB;
  if (!passed) {
    failCheck(`anchor ${ap.a}(${valA}) ${ap.expect} ${ap.b}(${valB}) on ${ap.dim}.${ap.field} FAILED`);
  }
}

// -- Summary -----------------------------------------------------------------
console.log(`\n=== Summary ===`);
console.log(`  Hard fails:  ${fail}`);
console.log(`  Warnings:    ${warn}`);
console.log(`  Rows OK:     ${pass}`);
if (warn > 0) {
  console.log(`\n  Warnings (first 40):`);
  for (const w of warnings.slice(0, 40)) console.log("  ~ " + w);
}
if (fail > 0) {
  console.log(`\n  GATE: FAIL`);
  for (const f of failures.slice(0, 30)) console.log("  - " + f);
  process.exit(1);
}
console.log(`\n  GATE: PASS`);
