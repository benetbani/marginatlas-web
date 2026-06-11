/**
 * search_cascade.test.ts
 *
 * Validates the homepage three-field search cascade data:
 *   1. getCitiesForCountryCode returns a deduped, label-sorted, non-empty list
 *      for a country with curated cities (US), case-insensitively, and [] for
 *      an unknown country.
 *   2. Every CASCADE_PREFILLS entry is valid: country in COUNTRIES, business is
 *      a default-visible activity id that yields a slug, and a non-empty city is
 *      one of that country's curated cities. This is what stops a wrong id/slug
 *      from making the live homepage CTA pre-fill blank or 404.
 *
 * Run: npx tsx tests/home/search_cascade.test.ts
 */
import { getCitiesForCountryCode, CASCADE_PREFILLS } from "../../src/lib/home/search_cascade";
import { COUNTRIES, visibleIndustries, industryToSlug } from "../../src/lib/taxonomy";

const errors: string[] = [];
const check = (cond: boolean, msg: string) => {
  if (!cond) errors.push(msg);
};

// 1. US city list: non-trivial, deduped, all slug+label, sorted by label.
{
  const us = getCitiesForCountryCode("US");
  check(us.length >= 10, `US city list should be non-trivial, got ${us.length}`);
  const slugs = us.map((c) => c.slug);
  check(new Set(slugs).size === slugs.length, "US city list must be de-duplicated");
  check(us.every((c) => c.slug.length > 0 && c.label.length > 0), "US cities must all have slug + label");
  const labels = us.map((c) => c.label);
  const sorted = labels.slice().sort((a, b) => a.localeCompare(b));
  check(JSON.stringify(labels) === JSON.stringify(sorted), "US cities must be sorted by label");
  check(slugs.includes("los-angeles"), "US cities should include los-angeles");
  check(slugs.includes("new-york"), "US cities should include new-york");
}

// 2. Case-insensitive iso2.
{
  check(
    getCitiesForCountryCode("us").length === getCitiesForCountryCode("US").length,
    "iso2 must be case-insensitive",
  );
}

// 3. Unknown country returns an empty array (caller shows Anywhere only).
{
  const any = getCitiesForCountryCode("ZZ");
  check(Array.isArray(any) && any.length === 0, "unknown country returns empty array");
}

// 4. Every prefill is valid.
{
  const countryCodes = new Set(COUNTRIES.map((c) => c.code));
  const defaultGate = { revealMixed: false, revealCorp: false };
  const visibleIds = new Set(visibleIndustries(defaultGate).map((i) => i.id));
  for (const p of CASCADE_PREFILLS) {
    check(countryCodes.has(p.country), `prefill country '${p.country}' must be in COUNTRIES`);
    check(visibleIds.has(p.business), `prefill business '${p.business}' must be a default-visible activity id`);
    check(industryToSlug(p.business).length > 0, `prefill business '${p.business}' must yield a slug`);
    if (p.city) {
      const cities = new Set(getCitiesForCountryCode(p.country).map((c) => c.slug));
      check(cities.has(p.city), `prefill city '${p.city}' must be a curated city of '${p.country}'`);
    }
  }
  check(CASCADE_PREFILLS.length >= 5, "should have at least 5 rotating examples");
}

if (errors.length > 0) {
  console.error(`FAIL: ${errors.length} assertion(s)`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("PASS: search_cascade helper + prefills");
