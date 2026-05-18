import { slugToIndustry, industryToSlug, SLUG_TO_INDUSTRY } from "../src/lib/taxonomy";

const cases: Array<[string, string]> = [
  ["metal-products-mfg", "metal_products_mfg"],
  ["metal-products-manufacturing", "metal_products_mfg"],
  ["cafes-coffee", "cafes_coffee"],
  ["cafe", "cafes_coffee"],
  ["caf-s-coffee-shops", "cafes_coffee"],
  ["restaurants", "restaurants"],
  ["restaurant", "restaurants"],
  ["mining-quarrying", "mining_quarrying"],
  ["mining", "mining_quarrying"],
  ["lawyer", "legal_services"],
  ["tax-accountant", "accounting_tax"],
  ["ECOMMERCE", "ecommerce_mail_order"],
  ["Sit-Down-Restaurants", "sit_down_restaurants"],
  ["plumber", "residential_construction"],
  ["dentist", "dental_practices"],
  ["vet", "veterinary_pet_care"],
  ["grocery", "grocery_stores"],
  ["gym", "sports_fitness"],
];

let pass = 0;
let fail = 0;
for (const [slug, expectedId] of cases) {
  const got = slugToIndustry(slug);
  const ok = got?.id === expectedId;
  if (ok) pass++;
  else fail++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${slug.padEnd(35)} -> ${got?.id ?? "null"}${
      ok ? "" : ` (expected ${expectedId})`
    }`
  );
}
console.log(`\n${pass} pass / ${fail} fail`);
console.log("cafes_coffee canonical slug =", industryToSlug("cafes_coffee"));
console.log("metal_products_mfg canonical slug =", industryToSlug("metal_products_mfg"));
console.log("SLUG_TO_INDUSTRY size =", Object.keys(SLUG_TO_INDUSTRY).length);
process.exit(fail > 0 ? 1 : 0);
