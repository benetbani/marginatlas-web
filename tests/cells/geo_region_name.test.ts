/**
 * Region-name resolution test (2026-06-02).
 *
 * geoNameFromSlug now resolves NUTS / province region codes via the generated
 * regions table, with a NUTS3 -> nearest-parent fallback. Before this, a code
 * like es511 (a NUTS3 not in the table) resolved to undefined and the cell
 * page fell back to the bare country code ("ES").
 */
import { geoNameFromSlug } from "../../src/lib/cells/geo";

const cases: Array<[string, string, string | undefined]> = [
  ["ES", "es43", "Extremadura"], //   exact nuts2
  ["ES", "es51", "Cataluña"], //      exact nuts2
  ["ES", "es511", "Cataluña"], //     nuts3 -> parent fallback (was undefined -> "ES")
  ["US", "california", "California"], // unchanged US path
];

let failed = 0;
for (const [country, slug, expected] of cases) {
  const got = geoNameFromSlug(country, slug);
  const ok = got === expected;
  if (!ok) failed++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  geoNameFromSlug(${country}, ${slug}) = ${JSON.stringify(got)} (expected ${JSON.stringify(expected)})`,
  );
}
if (failed > 0) {
  console.error(`geo_region_name: ${failed} failures`);
  process.exit(1);
}
console.log("geo_region_name: all pass");
