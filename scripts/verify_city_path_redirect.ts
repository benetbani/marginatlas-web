/**
 * verify_city_path_redirect: `/<country>/<city>` sends a reader to the city's
 * page (QUEUE launch:gb-london-404; the goal's D4, 2026-09-24).
 *
 * `/gb/london` answered "Not found" on production while `/cities/london`
 * served, so a reader trimming `/gb/london/barbershops` met a 404. The region
 * route now asks src/lib/cities/city_path.ts after its own lookup fails and
 * redirects permanently to `/cities/<slug>`. This gate holds three things:
 *
 *   1. every listed city resolves to its own page under its own country, and
 *      to nothing under another country (so `/us/london` stays a 404);
 *   2. the region route asks the helper and redirects inside the branch where
 *      its region lookup failed, BEFORE that branch's `notFound()`, and never
 *      ahead of the region lookup (a region of the same name must win);
 *   3. the count of city slugs that a region value of the same country
 *      shadows is printed, not redded: there the region page serves, which is
 *      the add-never-rename rule working.
 *
 * BLIND SPOT: it reads the route's source, not a running server; it cannot
 * see a middleware or a config rewrite that intercepts the path first.
 */
import { readFileSync } from "node:fs";
import { red } from "./lib/red";
import { cityPathFor, listedCities } from "../src/lib/cities/city_path";
import { COUNTRIES } from "../src/lib/taxonomy";
import { getRegionsForCountry } from "../src/lib/regions/regions-by-country";

const RULE = "city-path-redirect";
const LIST = "data/cities/city_list_v1.json";
const HELPER = "src/lib/cities/city_path.ts";
const reds: string[] = [];
/* Every red through the one formatter (scripts/lib/red): the rule, the file, what was found, what to do. */
const fail = (file: string, detail: string, remedy: string, line?: number) => reds.push(red({ rule: RULE, file, line, detail, remedy }));
const cities = listedCities();
for (const c of cities) {
  const want = `/cities/${c.slug}`;
  if (cityPathFor(c.iso2, c.slug) !== want) fail(LIST, `${c.iso2}/${c.slug} resolves to ${cityPathFor(c.iso2, c.slug)}, not ${want}`, `make ${HELPER} map the listed slug to its own page`);
  if (cityPathFor(c.iso2.toLowerCase(), c.slug.toUpperCase()) !== want) fail(HELPER, `${c.iso2}/${c.slug}: the lookup is case-sensitive`, "lower-case the slug and upper-case the country before the lookup");
  const other = c.iso2.toUpperCase() === "US" ? "GB" : "US";
  if (cityPathFor(other, c.slug) !== null) fail(HELPER, `${other}/${c.slug}: another country's path reaches the city ${c.slug}`, "compare the listed city's country with the path's before returning a page");
}
if (cityPathFor("GB", "london") !== "/cities/london") fail(HELPER, "GB/london does not resolve to /cities/london, the case the queue row names", "restore London's entry or the lookup");
if (cityPathFor("US", "london") !== null) fail(HELPER, "US/london resolves under a country that does not hold it", "compare the countries before returning a page");

const PAGE = "src/app/[country]/[geo]/page.tsx";
const src = readFileSync(PAGE, "utf8");
const lookup = src.indexOf("const regionEntry = ");
const branch = src.indexOf("if (!regionEntry) {", lookup);
const ask = src.indexOf("cityPathFor(", branch);
const redirect = src.indexOf("permanentRedirect(", branch);
const nf = src.indexOf("notFound();", branch);
if (lookup < 0 || branch < 0) fail(PAGE, "the region lookup and its not-found branch are not where this gate reads them", "keep `const regionEntry = ` and `if (!regionEntry) {` in the route, or teach this gate the new shape");
else if (ask < 0 || redirect < 0 || nf < 0 || !(ask < redirect && redirect < nf)) fail(PAGE, "the not-found branch does not ask cityPathFor and redirect before notFound()", "ask cityPathFor, then permanentRedirect, then notFound, inside `if (!regionEntry) {`");
if (src.indexOf("cityPathFor(") < lookup) fail(PAGE, "cityPathFor is asked before the region lookup, so a city could shadow a region", "ask it only inside the branch where the region lookup failed");

let shadowed = 0;
for (const country of COUNTRIES) {
  const values = new Set(getRegionsForCountry(country.code, country.name).map((r) => r.value));
  for (const c of cities) if (c.iso2.toUpperCase() === country.code && values.has(c.slug)) shadowed++;
}

if (reds.length) {
  console.error(`verify_city_path_redirect: ${reds.length} red(s) above`);
  process.exit(1);
}
console.log(`verify_city_path_redirect: ${cities.length} listed cities each reach /cities/<slug> under their own country and no other; the region route asks after its own lookup and redirects before notFound(); ${shadowed} city slug(s) share a region value in their country, where the region page serves.`);
