/**
 * verify_city_path_redirect: `/<country>/<city>` sends a reader to the city's
 * page (QUEUE launch:gb-london-404; the goal's D4, 2026-09-24).
 *
 * `/gb/london` answered "Not found" on production while `/cities/london`
 * served, so a reader trimming `/gb/london/barbershops` met a 404. The first
 * fix put the redirect in the region route and production still answered 404:
 * the edge middleware's not-held rewrite pinned the status before the route
 * ran (fetched after the deploy of 73435e28). So the middleware now asks
 * src/lib/cities/city_path.ts first, and the route keeps its own ask as the
 * fallback. This gate holds five things:
 *
 *   1. every listed city resolves to its own page under its own country, and
 *      to nothing under another country (so `/us/london` stays a 404);
 *   2. the generated slug table the helper reads
 *      (src/lib/routing/city_paths_generated.ts) holds exactly the list's
 *      cities under their countries, no more and no fewer;
 *   3. the middleware asks the helper BEFORE its not-held rewrite, and only
 *      after the region check (a region of the same name must win);
 *   4. the region route asks the helper inside the branch where its region
 *      lookup failed, before that branch's `notFound()`;
 *   5. the count of city slugs a region value of the same country shadows is
 *      printed, not redded: there the region page serves.
 *
 * BLIND SPOT: it reads source, not a running server; a config rewrite added
 * elsewhere could still intercept the path first. The live proof is a fetch
 * of `/gb/london` answering 308 to `/cities/london`.
 */
import { readFileSync } from "node:fs";
import { red } from "./lib/red";
import { cityPathFor } from "../src/lib/cities/city_path";
import { CITY_SLUGS_BY_COUNTRY } from "../src/lib/routing/city_paths_generated";
import { COUNTRIES } from "../src/lib/taxonomy";
import { getRegionsForCountry } from "../src/lib/regions/regions-by-country";

const RULE = "city-path-redirect";
const LIST = "data/cities/city_list_v1.json";
const HELPER = "src/lib/cities/city_path.ts";
const TABLE = "src/lib/routing/city_paths_generated.ts";
const MIDDLEWARE = "src/middleware.ts";
const PAGE = "src/app/[country]/[geo]/page.tsx";
const reds: string[] = [];
/* Every red through the one formatter (scripts/lib/red): the rule, the file, what was found, what to do. */
const fail = (file: string, detail: string, remedy: string, line?: number) => reds.push(red({ rule: RULE, file, line, detail, remedy }));

type ListedCity = { slug: string; iso2: string };
const cities = (JSON.parse(readFileSync(LIST, "utf8")) as { cities: ListedCity[] }).cities;

// 1. Every listed city to its own page, under its own country only.
for (const c of cities) {
  const want = `/cities/${c.slug}`;
  if (cityPathFor(c.iso2, c.slug) !== want) fail(TABLE, `${c.iso2}/${c.slug} resolves to ${cityPathFor(c.iso2, c.slug)}, not ${want}`, "run `npx tsx scripts/gen_city_paths.ts` and commit the table");
  if (cityPathFor(c.iso2.toLowerCase(), c.slug.toUpperCase()) !== want) fail(HELPER, `${c.iso2}/${c.slug}: the lookup is case-sensitive`, "lower-case the country and the slug before the lookup");
  const other = c.iso2.toUpperCase() === "US" ? "GB" : "US";
  if (cityPathFor(other, c.slug) !== null && !cities.some((d) => d.slug === c.slug && d.iso2.toUpperCase() === other)) fail(HELPER, `${other}/${c.slug}: another country's path reaches the city ${c.slug}`, "look the slug up under the path's own country only");
}
if (cityPathFor("GB", "london") !== "/cities/london") fail(HELPER, "GB/london does not resolve to /cities/london, the case the queue row names", "restore London's entry or the lookup");
if (cityPathFor("US", "london") !== null) fail(HELPER, "US/london resolves under a country that does not hold it", "look the slug up under the path's own country only");

// 2. The generated table is the list, no more and no fewer.
const tableCount = Object.values(CITY_SLUGS_BY_COUNTRY).reduce((n, slugs) => n + slugs.length, 0);
if (tableCount !== cities.length) fail(TABLE, `the table holds ${tableCount} slugs and the list ${cities.length} cities`, "run `npx tsx scripts/gen_city_paths.ts` and commit the table");
for (const c of cities) if (!(CITY_SLUGS_BY_COUNTRY[c.iso2.toLowerCase()] ?? []).includes(c.slug.toLowerCase())) fail(TABLE, `${c.iso2}/${c.slug} is in the list and not in the table`, "run `npx tsx scripts/gen_city_paths.ts` and commit the table");

// 3. The middleware asks before its not-held rewrite, after its region check.
const mw = readFileSync(MIDDLEWARE, "utf8");
const fnAt = mw.indexOf("function cityPathUnderCountry(");
const regionCheck = mw.indexOf("regionSlugsFor(countrySlug, countryName).has(geoSlug)) return null;", fnAt);
const helperCall = mw.indexOf("return cityPathFor(countrySlug, geoSlug);", fnAt);
const askAt = mw.indexOf("const cityHref = cityPathUnderCountry(path);");
const rewriteAt = mw.indexOf("if (isPlaceWeDoNotHold(path)) {", askAt);
if (fnAt < 0 || regionCheck < 0 || helperCall < 0 || !(regionCheck < helperCall)) fail(MIDDLEWARE, "cityPathUnderCountry does not check the country's regions before asking the helper", "return null for a region of the country before calling cityPathFor");
if (askAt < 0 || rewriteAt < 0 || !(askAt < rewriteAt) || mw.indexOf("NextResponse.redirect(url, 308)", askAt) > rewriteAt || mw.indexOf("NextResponse.redirect(url, 308)", askAt) < 0) fail(MIDDLEWARE, "the city redirect does not stand before the not-held rewrite", "ask cityPathUnderCountry and redirect with 308 before `if (isPlaceWeDoNotHold(path))`");

// 4. The region route's own ask, the fallback, inside its not-found branch.
const src = readFileSync(PAGE, "utf8");
const lookup = src.indexOf("const regionEntry = ");
const branch = src.indexOf("if (!regionEntry) {", lookup);
const ask = src.indexOf("cityPathFor(", branch);
const redirect = src.indexOf("permanentRedirect(", branch);
const nf = src.indexOf("notFound();", branch);
if (lookup < 0 || branch < 0) fail(PAGE, "the region lookup and its not-found branch are not where this gate reads them", "keep `const regionEntry = ` and `if (!regionEntry) {` in the route, or teach this gate the new shape");
else if (ask < 0 || redirect < 0 || nf < 0 || !(ask < redirect && redirect < nf)) fail(PAGE, "the not-found branch does not ask cityPathFor and redirect before notFound()", "ask cityPathFor, then permanentRedirect, then notFound, inside `if (!regionEntry) {`");
if (src.indexOf("cityPathFor(") < lookup) fail(PAGE, "cityPathFor is asked before the region lookup, so a city could shadow a region", "ask it only inside the branch where the region lookup failed");

// 5. Shadowed slugs, printed.
let shadowed = 0;
for (const country of COUNTRIES) {
  const values = new Set(getRegionsForCountry(country.code, country.name).map((r) => r.value));
  for (const c of cities) if (c.iso2.toUpperCase() === country.code && values.has(c.slug)) shadowed++;
}

if (reds.length) {
  console.error(`verify_city_path_redirect: ${reds.length} red(s) above`);
  process.exit(1);
}
console.log(`verify_city_path_redirect: ${cities.length} listed cities each reach /cities/<slug> under their own country and no other; the generated table matches the list; the middleware redirects before its not-held rewrite and after its region check; the region route asks inside its not-found branch; ${shadowed} city slug(s) share a region value in their country, where the region page serves.`);
