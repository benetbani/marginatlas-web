/**
 * Which pages a search engine may index: the index policy (U1 of the page architecture, 2026-10-09, his "Adopt the plan") with
 * Phase 1's rules (P1-B), and milestone 1's rule wherever Phase 1 changes nothing (his interview of 2026-09-26, answer 6: "UK pages
 * + every page at its floor; thin pages noindexed until they reach it").
 *
 * Refuses: a family, hub, region or /decide route whose robots is not indexFor's, or that asks robotsFor about another page; a
 * P1-B page indexable (an industries hub, a /decide pair, a UK trade page off London, a United States page named by a census
 * description, an /opening or /buy-or-start page whose trade page is noindex); an industry id spelled with underscores
 * indexable; London's trade pages, or any page Phase 1 leaves alone (every other page the census counted), losing milestone 1's
 * answer; an indexed page that loses the root layout's googlebot hints; an alias address (P1-C) whose canonical, or whose trade
 * page's breadcrumb, names itself and not the live slug's page; the census's floors unequal to the model laws'.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/seo/indexable.test.ts
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { classify, indexFor, isIndexable, isUkPage, floorStanding, robotsFor, type Family, type RobotsMeta } from "../../src/lib/seo/indexable";
import { canonicalPath } from "../../src/lib/seo/alias_canonical";
import { COUNTRIES, INDUSTRIES, SLUG_TO_INDUSTRY } from "../../src/lib/taxonomy";
import { RETIRED } from "../../src/lib/taxonomy/retired";
import { hasOwn } from "../../src/lib/own";
import { getRegionsForCountry } from "../../src/lib/regions/regions-by-country";
import { hasRegionalCoverage } from "../../src/lib/coverage/regional";
import { getAdmin1Regions } from "../../src/lib/coverage/admin1";
import { CITY_SLUGS_BY_COUNTRY } from "../../src/lib/routing/city_paths_generated";
import { NEIGHBORHOOD_SLUGS } from "../../src/lib/routing/hood_slugs";
import { floorsFromLaws } from "../../scripts/lib/block_count.mjs";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "indexable";
const FILE = "src/lib/seo/indexable.ts";
const SELF = "tests/seo/indexable.test.ts";
const REMEDY = "Set robots through indexFor (src/lib/seo/indexable.ts); a failing page loses its index status, never its address. Rerun the census, commit its file";
/* The remedies of the rows that guard one thing each: the red names the code to change. */
const R_MILESTONE1 = "Outside Phase 1's rules indexFor answers milestone 1's: a UK page indexes, any other counted page indexes when the census counted it at its type's floor (SPINE_UPPER, byCensus and the family branches in src/lib/seo/indexable.ts); change the branch that answers otherwise, never the census or this row";
const R_ID = "An industry page is /industries/ and any one word: SPINE_UPPER in src/lib/seo/indexable.ts must match industries/[^/]+, so an address the census holds no entry for (an id with underscores) falls to noindex and not to an upper-level default";
const R_ARG = "Pass robotsFor the route's own page, the address its row names, in the route's metadata: a route that asks about another page gives its robots tag that page's answer";
const R_DEF = "Build the route's canonical as its row names it: robotsFor(canonical) asks indexFor about that address, so a canonical that names another page gives the route that page's robots tag";
const R_HINTS = "robotsFor (src/lib/seo/indexable.ts) carries the root layout's googlebot hints (src/app/layout.tsx): a route's robots replaces the layout's wholesale, so change the two together";
const ALIAS_FILE = "src/lib/seo/alias_canonical.ts";
const R_ALIAS = "Name the live slug's page through src/lib/seo/alias_canonical.ts; each route builds its canonical through the helper";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE, remedy = REMEDY) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, detail: label, remedy });
};
const firstFew = (list: string[]) => (list.length ? `: ${list.slice(0, 5).join(", ")}` : "");

/* THE FAMILIES (the spec's section 1) and the kinds of page that belong to none. */
const FAMILY_OF: Array<[string, Family]> = [
  ["/", "upper"], ["/pricing", "upper"], ["/fr", "upper"], ["/fr/how-to-open", "upper"], ["/industries", "upper"],
  ["/industries/restaurants", "upper"], ["/decide", "upper"], ["/compare", "upper"], ["/coverage", "upper"],
  ["/coverage/gb", "coverage"],
  ["/cities", "city"], ["/cities/london", "city"], ["/cities/london/neighborhoods", "city"], ["/cities/london/neighborhoods/west-end", "city"],
  ["/compare/cities/london-vs-new-york", "city"],
  ["/blog", "article"], ["/blog/median-vs-average", "article"], ["/learn", "article"],
  ["/gb/london/restaurants", "trade-in-place"], ["/gb/london/restaurants/opening", "trade-in-place"], ["/us/california/restaurants/buy-or-start", "trade-in-place"],
  ["/gb/industries/restaurants", "trade-country"],
  ["/industries/restaurants/across", "where-to-open"],
  ["/editions/uk-trade-failures-2026", "edition"],
  ["/us/california", "region"], ["/de/bavaria", "region"],
  ["/us/industries", "hub"], ["/us/california/industries", "hub"],
  ["/decide/restaurants/london", "decide"],
  ["/gb/london/west-end/restaurants", "district-trade"],
];
for (const [p, f] of FAMILY_OF) check(`classify(${p}) is ${f} (got ${classify(p)})`, classify(p) === f);

/* PHASE 1, P1-B: noindex, the address kept. */
const live = Object.keys(SLUG_TO_INDUSTRY as Record<string, unknown>).filter((s) => !hasOwn(RETIRED, s)).sort();
const countryHubs = COUNTRIES.map((c) => `/${c.code.toLowerCase()}/industries`);
const regionHubs = COUNTRIES.filter((c) => hasRegionalCoverage(c.code)).flatMap((c) => getAdmin1Regions(c.code).map((r) => `/${c.code.toLowerCase()}/${r.slug.toLowerCase()}/industries`));
const hubsIndexed = [...countryHubs, ...regionHubs].filter(isIndexable);
check(`no industries hub indexes (${countryHubs.length} country and ${regionHubs.length} region hubs)${firstFew(hubsIndexed)}`, countryHubs.length > 0 && regionHubs.length > 0 && hubsIndexed.length === 0);
const decidePairs = Object.keys(NEIGHBORHOOD_SLUGS).flatMap((city) => live.map((s) => `/decide/${s}/${city}`));
const decideIndexed = decidePairs.filter(isIndexable);
check(`no /decide pair indexes (${decidePairs.length})${firstFew(decideIndexed)}`, decidePairs.length > 0 && decideIndexed.length === 0);
check("the /decide tool page keeps its status", isIndexable("/decide"));
const ukPlaces = [...(CITY_SLUGS_BY_COUNTRY.gb ?? []).filter((s) => s !== "london"), ...getRegionsForCountry("GB", "United Kingdom").map((r) => r.value), "gb"];
const ukOff = ukPlaces.flatMap((p) => live.map((s) => `/gb/${p}/${s}`));
const ukOffIndexed = ukOff.filter(isIndexable);
check(`no UK trade page off London indexes (${ukPlaces.length} places: the six other cities, the four nations and /gb/gb; ${ukOff.length} pages)${firstFew(ukOffIndexed)}`, ukPlaces.length === 11 && ukOffIndexed.length === 0);
check("a UK trade page under any other place word is off London too: /gb/liverpool/restaurants, /gb/camden/restaurants", !isIndexable("/gb/liverpool/restaurants") && !isIndexable("/gb/camden/restaurants"));
const london = live.map((s) => `/gb/london/${s}`);
const londonOut = london.filter((p) => !isIndexable(p));
check(`London's ${london.length} trade pages still index${firstFew(londonOut)}`, london.length === live.length && londonOut.length === 0);
type Census = { floors: Record<string, number>; pages: Record<string, { surface: string; blocks: number }> };
const census = JSON.parse(readFileSync("data/seo/floor_census.json", "utf8")) as Census;
const entries = Object.entries(census.pages);
const usCensus = entries.filter(([p]) => p.startsWith("/us/") && p.split("/").filter(Boolean).length === 3);
const usAtFloor = usCensus.filter(([, e]) => e.blocks >= census.floors[e.surface]).length;
const usIndexed = usCensus.map(([p]) => p).filter(isIndexable);
check(`no United States page named by a census description indexes (${usCensus.length} in the census, ${usAtFloor} of them at their floor before Phase 1)${firstFew(usIndexed)}`, usCensus.length > 0 && usIndexed.length === 0);
check("an opening and a buy-or-start page take their trade page's status", isIndexable("/gb/london/restaurants/opening") && isIndexable("/gb/london/restaurants/buy-or-start") && !isIndexable("/gb/manchester/restaurants/opening") && !isIndexable("/us/california/restaurants/buy-or-start"));
check("a district's trade page stays out", !isIndexable("/gb/london/west-end/restaurants"));
check("the trade page per country waits for Phase 3", !isIndexable("/gb/industries/restaurants"));

/* WHERE PHASE 1 CHANGES NOTHING */
for (const p of ["/gb", "/gb/how-to-open", "/gb/london/restaurants", "/cities/london", "/cities/manchester", "/cities/london/neighborhoods", "/cities/london/neighborhoods/west-end", "/GB/London/Restaurants/"]) {
  check(`a UK page indexes: ${p}`, isUkPage(p) && isIndexable(p));
}
check("a UK trade page off London is still a UK page, and no longer indexes: /gb/manchester/restaurants", isUkPage("/gb/manchester/restaurants") && !isIndexable("/gb/manchester/restaurants"));
for (const p of ["/fr", "/cities/paris", "/industries/restaurants", "/us/california/restaurants"]) check(`not a UK page: ${p}`, !isUkPage(p));
const at = entries.find(([p, e]) => e.blocks >= census.floors[e.surface] && !p.startsWith("/us/"));
const below = entries.find(([, e]) => e.blocks < census.floors[e.surface]);
check(`a page counted at its floor indexes${at ? ` (${at[0]}, ${at[1].blocks} of ${census.floors[at[1].surface]})` : ""}`, !!at && isIndexable(at[0]) && floorStanding(at[0])?.atFloor === true);
check(`a page counted under its floor does not${below ? ` (${below[0]}, ${below[1].blocks} of ${census.floors[below[1].surface]})` : ""}`, !below || (!isIndexable(below[0]) && floorStanding(below[0])?.atFloor === false));
/* The two samples above find one page each. This holds milestone 1's rule over the whole census: every counted page Phase 1 does not
   name keeps its answer, so a branch that lets a whole type of page through (the under-floor cities, the industry pages, the
   country and how-to pages) or keeps one out reds here. */
const leftAlone = entries.filter(([p]) => !(p.startsWith("/us/") && p.split("/").filter(Boolean).length === 3));
const drifted = leftAlone.filter(([p, e]) => isIndexable(p) !== (isUkPage(p) || e.blocks >= census.floors[e.surface]));
check(`every census page outside the United States descriptions keeps milestone 1's answer (${leftAlone.length})${firstFew(drifted.map(([p]) => p))}`, leftAlone.length > 0 && drifted.length === 0, FILE, R_MILESTONE1);
/* An industry id spelled with underscores is served by the industry route (the edge passes it, the route names its slug's page
   canonical) and the census holds no entry for it: it answers as any spine page the census does not hold, noindex. */
const idSpellings = (INDUSTRIES as Array<{ id: string }>).map((i) => `/industries/${i.id}`).filter((p) => p.includes("_"));
check(`an industry id spelled with underscores indexes nowhere (${idSpellings.length})${firstFew(idSpellings.filter(isIndexable))}`, idSpellings.length > 0 && idSpellings.every((p) => !isIndexable(p)), FILE, R_ID);
check("a spine page the census never counted does not index (noindex on the rest)", !isIndexable("/zz/nowhere/nothing") && floorStanding("/zz/nowhere/nothing") === null);
check("the robots value: indexed or not, links always followed, and an indexed page keeps the root layout's googlebot hints", JSON.stringify(robotsFor("/gb")) === '{"index":true,"follow":true,"googleBot":{"index":true,"follow":true,"max-image-preview":"large","max-snippet":-1}}' && JSON.stringify(robotsFor("/zz/nowhere/nothing")) === '{"index":false,"follow":true,"googleBot":{"index":false,"follow":true}}', FILE, R_HINTS);
check("indexFor answers a family and a reason with every verdict", ["/", "/gb/manchester/restaurants", "/us/industries"].every((p) => indexFor(p).reason.length > 0 && indexFor(p).follow === true && indexFor(p).family === classify(p)));
check("no UK page is in the census (they index by his rule, uncounted)", entries.every(([p]) => !isUkPage(p)));
for (const p of ["/us/california", "/de/bavaria", "/gb/england", "/industries/restaurants/across", "/coverage/gb", "/blog", "/learn", "/cities", "/compare/cities/london-vs-new-york", "/pricing", "/"]) {
  check(`keeps its route's default, index: ${p}`, isIndexable(p));
}

/* THE ROUTES: every page under the families' folders sets robots through robotsFor, asked about the page's own address (`arg`, the
   text between the brackets; where `arg` is the route's `canonical`, `def` is how the route builds it, left out where the alias
   canonicals below pin that), or sets none where indexFor admits every address it serves (the root layout's default, which also
   carries the googlebot snippet directives), or sets a literal noindex where indexFor refuses them. */
type Mode = "robotsFor" | "default" | "noindex";
const ROUTES: Array<{ file: string; family: Family; mode: Mode; samples: string[]; arg?: string; def?: string }> = [
  { file: "src/app/[country]/page.tsx", family: "upper", mode: "robotsFor", samples: ["/fr", "/gb"], arg: "canonical", def: "`/${country.toLowerCase()}`" },
  { file: "src/app/[country]/how-to-open/page.tsx", family: "upper", mode: "robotsFor", samples: ["/fr/how-to-open"], arg: "`/${country.toLowerCase()}/how-to-open`" },
  { file: "src/app/[country]/industries/page.tsx", family: "hub", mode: "robotsFor", samples: ["/us/industries"], arg: "`/${country.toLowerCase()}/industries`" },
  { file: "src/app/[country]/[geo]/page.tsx", family: "region", mode: "default", samples: ["/us/california", "/de/bavaria", "/gb/england"] },
  { file: "src/app/[country]/[geo]/industries/page.tsx", family: "hub", mode: "robotsFor", samples: ["/us/california/industries"], arg: "`/${country.toLowerCase()}/${geo.toLowerCase()}/industries`" },
  { file: "src/app/[country]/[geo]/[industry]/page.tsx", family: "trade-in-place", mode: "robotsFor", samples: ["/gb/london/restaurants"], arg: "canonical" },
  { file: "src/app/[country]/[geo]/[industry]/opening/page.tsx", family: "trade-in-place", mode: "robotsFor", samples: ["/gb/london/restaurants/opening"], arg: "canonical" },
  { file: "src/app/[country]/[geo]/[industry]/buy-or-start/page.tsx", family: "trade-in-place", mode: "robotsFor", samples: ["/gb/london/restaurants/buy-or-start"], arg: "canonical" },
  { file: "src/app/[country]/[geo]/[industry]/[sub]/page.tsx", family: "district-trade", mode: "noindex", samples: ["/gb/london/west-end/restaurants"] },
  { file: "src/app/(site)/cities/page.tsx", family: "city", mode: "default", samples: ["/cities"] },
  { file: "src/app/(site)/cities/[slug]/page.tsx", family: "city", mode: "robotsFor", samples: ["/cities/london"], arg: "canonical", def: "`/cities/${city.slug}`" },
  { file: "src/app/(site)/cities/[slug]/neighborhoods/page.tsx", family: "city", mode: "robotsFor", samples: ["/cities/london/neighborhoods"], arg: "`/cities/${city.slug}/neighborhoods`" },
  { file: "src/app/(site)/cities/[slug]/neighborhoods/[district]/page.tsx", family: "city", mode: "robotsFor", samples: ["/cities/london/neighborhoods/west-end"], arg: "districtPageHref(city.slug, row.slug)" },
  { file: "src/app/(site)/compare/page.tsx", family: "upper", mode: "default", samples: ["/compare"] },
  { file: "src/app/(site)/compare/cities/[pair]/page.tsx", family: "city", mode: "default", samples: ["/compare/cities/london-vs-new-york"] },
  { file: "src/app/(site)/coverage/page.tsx", family: "upper", mode: "default", samples: ["/coverage"] },
  { file: "src/app/(site)/coverage/[iso2]/page.tsx", family: "coverage", mode: "default", samples: ["/coverage/gb"] },
  { file: "src/app/(site)/decide/page.tsx", family: "upper", mode: "default", samples: ["/decide"] },
  { file: "src/app/(site)/decide/[activity]/[city]/page.tsx", family: "decide", mode: "robotsFor", samples: ["/decide/restaurants/london"], arg: "canonical", def: "`/decide/${activity.toLowerCase()}/${cityRow.slug}`" },
  { file: "src/app/(site)/industries/[industry]/page.tsx", family: "upper", mode: "robotsFor", samples: ["/industries/restaurants"], arg: "canonical" },
  { file: "src/app/(site)/industries/[industry]/across/page.tsx", family: "where-to-open", mode: "default", samples: ["/industries/restaurants/across"] },
  { file: "src/app/industries/page.tsx", family: "upper", mode: "default", samples: ["/industries"] },
];
const routeCode = (f: string) => stripCommentLines(readFileSync(f, "utf8").split("\n")).join("\n");
for (const r of ROUTES) {
  const code = routeCode(r.file);
  check(`${r.file} serves ${r.family} pages (${r.samples.join(", ")})`, r.samples.every((p) => classify(p) === r.family), r.file);
  if (r.mode === "robotsFor") {
    const asked = !!r.arg && code.includes(`robots: robotsFor(${r.arg})`);
    check(`${r.file} sets robots through robotsFor(${r.arg})${asked ? "" : `; it asks robotsFor(${/robots:\s*robotsFor\((.*)\),?\s*$/m.exec(code)?.[1] ?? "nothing"})`}`, asked, r.file, R_ARG);
    if (r.def) check(`${r.file} builds its canonical as ${r.def}`, code.includes(`const canonical = ${r.def};`), r.file, R_DEF);
  }
  if (r.mode === "default") check(`${r.file} sets no robots, and indexFor admits what it serves (${r.samples.join(", ")})`, !/\brobots\s*:/.test(code) && r.samples.every(isIndexable), r.file);
  if (r.mode === "noindex") check(`${r.file} sets noindex, and indexFor refuses what it serves`, /robots:\s*\{\s*index:\s*false/.test(code) && r.samples.every((p) => !isIndexable(p)), r.file);
}
/* The root layout's hints: a route that sets robots replaces the layout's wholesale (Next never merges the key), so robotsFor
   carries the layout's googlebot hints itself, and the two stay equal. */
const layoutHints = /robots:\s*\{[^}]*googleBot:\s*\{([^}]*)\}/.exec(routeCode("src/app/layout.tsx"))?.[1] ?? "";
const layoutImage = /"max-image-preview":\s*"([^"]*)"/.exec(layoutHints)?.[1];
const layoutSnippet = /"max-snippet":\s*(-?\d+)/.exec(layoutHints)?.[1];
const carried: Partial<RobotsMeta["googleBot"]> = robotsFor("/gb").googleBot ?? {};
check(`robotsFor's googlebot hints are the root layout's (robotsFor: max-image-preview ${carried["max-image-preview"]}, max-snippet ${carried["max-snippet"]}; layout: max-image-preview ${layoutImage}, max-snippet ${layoutSnippet})`, layoutImage !== undefined && layoutImage === carried["max-image-preview"] && layoutSnippet !== undefined && layoutSnippet === String(carried["max-snippet"]), "src/app/layout.tsx", R_HINTS);
const FOLDERS = ["src/app/[country]", "src/app/(site)/cities", "src/app/(site)/industries", "src/app/(site)/decide", "src/app/(site)/compare", "src/app/(site)/coverage", "src/app/industries"];
const walkPages = (dir: string): string[] =>
  readdirSync(dir).flatMap((n) => {
    const p = `${dir}/${n}`;
    return statSync(p).isDirectory() ? walkPages(p) : n === "page.tsx" ? [p] : [];
  });
const pages = FOLDERS.flatMap(walkPages);
const unlisted = pages.filter((p) => !ROUTES.some((r) => r.file === p));
check(`every page under the families' folders is in the route table (${pages.length})${unlisted.length ? `: add ${unlisted.join(", ")} with how it sets robots` : ""}`, pages.length === ROUTES.length && unlisted.length === 0, SELF);

/* THE ALIAS CANONICALS (P1-C of the page architecture, 2026-10-09; QUEUE seo:alias-canonical): an alias trade address names its
   live slug's page until its redirect ships with the inventory; a census description and every live slug name themselves. */
check(`/gb/london/plumber names /gb/london/plumbers (got ${canonicalPath("/gb/london/plumber")})`, canonicalPath("/gb/london/plumber") === "/gb/london/plumbers", ALIAS_FILE, R_ALIAS);
check(`/tr/istanbul/cafes-coffee names /tr/istanbul/cafes-coffee-shops (got ${canonicalPath("/tr/istanbul/cafes-coffee")})`, canonicalPath("/tr/istanbul/cafes-coffee") === "/tr/istanbul/cafes-coffee-shops", ALIAS_FILE, R_ALIAS);
check(`/industries/hostel names /industries/hostels (got ${canonicalPath("/industries/hostel")})`, canonicalPath("/industries/hostel") === "/industries/hostels", ALIAS_FILE, R_ALIAS);
check("an alias's opening page names the live slug's opening page", canonicalPath("/gb/london/plumber/opening") === "/gb/london/plumbers/opening", ALIAS_FILE, R_ALIAS);
check("a census description names itself: /us/mississippi/offices-of-lawyers", canonicalPath("/us/mississippi/offices-of-lawyers") === "/us/mississippi/offices-of-lawyers", ALIAS_FILE, R_ALIAS);
check("a hub names itself: /gb/london/industries", canonicalPath("/gb/london/industries") === "/gb/london/industries", ALIAS_FILE, R_ALIAS);
const selfNot = live.flatMap((s) => [`/gb/london/${s}`, `/industries/${s}`]).filter((p) => canonicalPath(p) !== p);
check(`every live slug names itself (${live.length * 2})${firstFew(selfNot)}`, selfNot.length === 0, ALIAS_FILE, R_ALIAS);
const CANONICAL_CALLS: Array<[string, string]> = [
  ["src/app/[country]/[geo]/[industry]/page.tsx", "tradeCanonicalPath(country, geo, industry)"],
  ["src/app/[country]/[geo]/[industry]/opening/page.tsx", 'tradeCanonicalPath(country, geo, industry, "opening")'],
  ["src/app/[country]/[geo]/[industry]/buy-or-start/page.tsx", 'tradeCanonicalPath(country, geo, industry, "buy-or-start")'],
  ["src/app/(site)/industries/[industry]/page.tsx", "industryCanonicalPath(industry)"],
];
for (const [file, call] of CANONICAL_CALLS) check(`${file} builds its canonical as ${call}`, routeCode(file).includes(`const canonical = ${call};`), file, R_ALIAS);
/* The trade page's structured data names the same page. An alias page (/gb/london/plumber) renders the plumbers' page, and a
   BreadcrumbList whose last step is the address as typed claims in the markup the address its canonical gives away. */
const CELL_SPINE = "src/app/[country]/[geo]/[industry]/cell_spine.tsx";
const CRUMB_END = "url: `${origin}${tradeCanonicalPath(country, geo, industry)}`";
const R_CRUMB = "Build the last step of the trade page's BreadcrumbList from tradeCanonicalPath(country, geo, industry) (src/lib/seo/alias_canonical.ts), never from the address as typed, so an alias page's structured data names the live slug's page";
check(`${CELL_SPINE} ends its breadcrumb on the live slug's page, as ${CRUMB_END}, so /gb/london/plumber's trail names ${canonicalPath("/gb/london/plumber")}`, routeCode(CELL_SPINE).includes(CRUMB_END), CELL_SPINE, R_CRUMB);

/* THE CENSUS'S FLOORS ARE THE MODEL LAWS' OWN: a floor moved since the census was written makes it stale. */
const laws = floorsFromLaws(readFileSync("scripts/harness/check_model_laws.mjs", "utf8")) as Record<string, number>;
check(`the census's floors are the model laws' (${JSON.stringify(census.floors)})`, JSON.stringify(census.floors) === JSON.stringify(laws));

function finish(): void {
  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("seo/indexable: all pass");
}

finish();
