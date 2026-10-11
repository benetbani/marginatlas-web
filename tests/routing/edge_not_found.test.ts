/**
 * An address that names nothing answers 404 at the edge (masterplan step 01, 2026-10-05; QUEUE launch:retired-trades-live).
 * `/gb/london/<any word>` rendered a synthesized "Small business" page at 200, canonical to itself and indexable, and
 * `/industries/<word>` and `/cities/<word>` called notFound() inside a streamed page, so the 200 was on the wire first.
 * The edge now judges the shapes it can judge from small tables, each by the resolver its own route runs: the list is the header of
 * src/lib/routing/edge_not_found.ts, and P1-A (2026-10-09) added to the first four (a trade under a city, an activity, a city, a
 * hub) a trade page's place, the United States' words, the /opening and /buy-or-start pages and the /decide pairs.
 * And since 2026-10-06 a file: an address whose last part has a dot names a file, and answers 404 unless the site serves that
 * file (src/lib/routing/served_files.ts); a dot alone used to pass any address through, so `/data/uk/2026.10/nothing.csv` drew a
 * page at 200.
 * And since 2026-10-11 (the plan route-folder fall-through) an address under a route folder that fits none of the shapes the folder serves
 * (/pricing/xyz, /about/xyz, /blog/no-such-post): the shapes and the lists the dynamic leaves of four routes resolve are generated into
 * src/lib/routing/route_shapes.ts (scripts/gen_route_shapes.ts), held to a fresh generation here, and every real address is asked of the
 * edge and the middleware. Every pin answers with Next's static not-found page (/_not-found), the status pinned.
 *
 * Run: npx tsx tests/routing/edge_not_found.test.ts
 */
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { NextRequest } from "next/server";
import { edgeNotFound, legacyHoodTarget, GEO_STATIC_CHILDREN, TRADE_SUB_PAGES, US_STATES, NOT_FOUND_ROUTE, HUB_COUNTRIES } from "../../src/lib/routing/edge_not_found";
import { HOOD_DISTRICT_SLUGS, NEIGHBORHOOD_SLUGS } from "../../src/lib/routing/hood_slugs";
import { renderHoodSlugs, HOOD_SLUGS_FILE } from "../../scripts/gen_hood_slugs";
import { renderServedFiles, SERVED_FILES_FILE } from "../../scripts/gen_served_files";
import { renderRouteShapes, routeShapes, ROUTE_SHAPES_FILE } from "../../scripts/gen_route_shapes";
import { ROUTE_SHAPES, BLOG_SLUGS, LEARN_SLUGS, CITY_PAIRS, HOW_TO_COUNTRIES } from "../../src/lib/routing/route_shapes";
import { TOP_LEVEL_SEGMENTS } from "../../src/lib/routing/top_level_segments";
import { RETIRED, redirectFor } from "../../src/lib/taxonomy/retired";
import { TAXONOMY_REDIRECTS } from "../../src/lib/taxonomy/legacy_redirects";
import { COUNTRIES, INDUSTRY_SLUG_ALIASES, SLUG_TO_INDUSTRY, liveIndustryFor, resolveIndustryIdExact, slugToIndustry } from "../../src/lib/taxonomy";
import { CITY_SLUGS_BY_COUNTRY } from "../../src/lib/routing/city_paths_generated";
import { industryQueryCandidates, resolveDisplayIndustry } from "../../src/lib/cells/industry_resolution";
import { getRegionsForCountry } from "../../src/lib/regions/regions-by-country";
import { PACK_FILES, packHref } from "../../src/lib/data_pack";
import { getAllPosts } from "../../src/lib/blog";
import { LEARN_ARTICLES } from "../../src/lib/learn/articles";
import robots from "../../src/app/robots";
/* routeRequest, not middleware: since A7 (2026-10-06) `middleware` is async (the session refresh wraps the routing), and this
   test reads the routing decision itself, as tests/routing/metadata_routes.test.ts does. */
import { routeRequest as middleware, config } from "../../src/middleware";
/* Next's own matcher compiler, the one `next build` runs on config.matcher; exported at runtime, left out of Next's types. */
import * as nextStaticInfo from "next/dist/build/analysis/get-page-static-info";
/* Next's own name for the page it prerenders from src/app/not-found.tsx and serves for an address no route matches. */
import { UNDERSCORE_NOT_FOUND_ROUTE } from "next/dist/shared/lib/constants";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";
import cityListJson from "../../data/cities/city_list_v1.json";
import cityComparisonsJson from "../../data/cities/city_comparisons_v1.json";
import floorCensus from "../../data/seo/floor_census.json";
import { renderPlaceSlugs, readDbWords, staticPlaceWords, PLACE_SLUGS_FILE, PLACE_DB_FILE, PLACE_TABLE_BUDGET_BYTES } from "../../scripts/gen_place_slugs";
import { PLACE_SLUGS_BY_COUNTRY, US_DESCRIPTION_SLUGS } from "../../src/lib/routing/place_slugs_generated";
import { isHeldPlace, placeWordsFor, placeNotHeldIn, routeWord } from "../../src/lib/routing/place_words";
import { REGIONS_BY_COUNTRY_AUTO } from "../../src/lib/regions/regions_generated";
import { DEFAULT_REGION_BY_COUNTRY } from "../../src/lib/regions/default_region_by_country";
import { geoNameFromSlug, slugify, SLUG_TO_GEO_ID } from "../../src/lib/cells/geo";
import popularPlaceOverrides from "../../src/lib/geo/popular_place_overrides.json";
import { own } from "../../src/lib/own";
import { hasRegionalCoverage } from "../../src/lib/coverage/regional";
import { getAdmin1Regions } from "../../src/lib/coverage/admin1";
import { buildSetupRows } from "../../src/lib/spine/setup_rows";
import neighborhoodsJson from "../../data/cities/neighborhoods_v1.json";

const RULE = "edge-not-found";
const FILE = "src/lib/routing/edge_not_found.ts";
const REMEDY = "answer 404 at the edge only for an address its own route would render as nothing, by that route's own resolver";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE, remedy = REMEDY) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, detail: label, remedy });
};
const nf = (p: string) => edgeNotFound(p);

/* The step's cases. */
check("a word that names no trade, under London: /gb/london/zz-not-a-trade", nf("/gb/london/zz-not-a-trade") === true);
check("a live trade under London: /gb/london/restaurants", nf("/gb/london/restaurants") === false);
check("a retired trade: /gb/london/banking (its redirect owns it)", nf("/gb/london/banking") === false);
check("a renamed trade: /gb/london/crop-farming (its redirect owns it)", nf("/gb/london/crop-farming") === false);
check("an aliased word: /gb/london/hostel (the cell route resolves it to Hostels)", nf("/gb/london/hostel") === false);
check("a legacy data word: /gb/london/events-entertainment (the cell route's crosswalk names a live trade)", nf("/gb/london/events-entertainment") === false);
check("an activity that names nothing: /industries/zz", nf("/industries/zz") === true);
check("a live activity: /industries/restaurants", nf("/industries/restaurants") === false);
check("an activity that names nothing, across: /industries/zz/across", nf("/industries/zz/across") === true);
check("a live activity, across: /industries/restaurants/across", nf("/industries/restaurants/across") === false);
check("a retired activity: /industries/banking (its redirect owns it)", nf("/industries/banking") === false);
check("a renamed activity: /industries/crop-farming (its redirect owns it)", nf("/industries/crop-farming") === false);
check("a city the list does not hold: /cities/zz", nf("/cities/zz") === true);
check("a listed city: /cities/london", nf("/cities/london") === false);
check("a hub for a city the list does not hold: /cities/zz/neighborhoods", nf("/cities/zz/neighborhoods") === true);
check("London's hub: /cities/london/neighborhoods", nf("/cities/london/neighborhoods") === false);
check("a district London does not hold: /cities/london/neighborhoods/zz", nf("/cities/london/neighborhoods/zz") === true);
check("an admitted district: /cities/london/neighborhoods/west-end", nf("/cities/london/neighborhoods/west-end") === false);
check("a country's static child: /gb/how-to-open", nf("/gb/how-to-open") === false);
check("a nation's industries hub, a static child of a place its route draws: /gb/england/industries", nf("/gb/england/industries") === false);
check("a neighbourhood and trade, the shape published until 2026-08-08: /gb/london/west-end/restaurants (another route's)", nf("/gb/london/west-end/restaurants") === false);
check("a trade's opening page is left to its route: /gb/london/restaurants/opening", nf("/gb/london/restaurants/opening") === false);
check("a word under another country is judged the same: /de/berlin/zz-not-a-trade", nf("/de/berlin/zz-not-a-trade") === true);
check("a census description the database holds passes under a state: /us/mississippi/business-support-services", nf("/us/mississippi/business-support-services") === false);
check("an unknown United States word answers 404 (P1-A): /us/california/zz-not-a-trade", nf("/us/california/zz-not-a-trade") === true);
check("a file is not a place: /geo/countries-110m.json", nf("/geo/countries-110m.json") === false);
check("a word no post holds, under the blog's folder, answers 404 (the plan 2026-10-11; it was left to its route): /blog/zz-post", nf("/blog/zz-post") === true);
check("an unknown first segment with three parts is left alone: /zz/london/zz", nf("/zz/london/zz") === false);
check("the home page", nf("/") === false);

/* What the middleware's own place rule pins stays its own: one- and two-part paths are never judged here, but for a country's how-to page, a static child the place rule passes (the plan 2026-10-11, dynamic 404 remains). */
check("a country the site does not hold, /zz, is isPlaceWeDoNotHold's", nf("/zz") === false);
check("a region the country does not hold, /gb/atlantis, is isPlaceWeDoNotHold's", nf("/gb/atlantis") === false);

/* The three-part neighbourhood addresses live pages linked until 2026-08-16 (seven call sites, commit b1496df2): each carries
   what equity it earned to the page that now holds its district, in one hop. None was ever in a sitemap shard (read from
   `git log -p --follow src/app/sitemap.ts`: the only neighbourhood shard declared the four-part shape). */
check(`an admitted district's old address goes to its page: /gb/london/west-end to ${legacyHoodTarget("/gb/london/west-end")}`, legacyHoodTarget("/gb/london/west-end") === "/cities/london/neighborhoods/west-end");
check(`a scheme's district with no page goes to its hub: /us/los-angeles/westside to ${legacyHoodTarget("/us/los-angeles/westside")}`, legacyHoodTarget("/us/los-angeles/westside") === "/cities/los-angeles/neighborhoods");
check("the old address is the redirect's, never a 404: /gb/london/west-end", nf("/gb/london/west-end") === false);
check("a trade wins over a district of the same word: /gb/london/restaurants is no district", legacyHoodTarget("/gb/london/restaurants") === null);
check("another country's path reaches no district: /us/london/west-end", legacyHoodTarget("/us/london/west-end") === null);
check("a district word that names nothing anywhere: /gb/london/santa-monica answers 404", nf("/gb/london/santa-monica") === true && legacyHoodTarget("/gb/london/santa-monica") === null);

/* Every page the site holds answers as it did. */
const live = Object.keys(SLUG_TO_INDUSTRY as Record<string, unknown>).filter((s) => !(s in RETIRED));
const caughtTrades = live.filter((s) => nf(`/gb/london/${s}`) || nf(`/us/california/${s}`) || nf(`/industries/${s}`) || nf(`/industries/${s}/across`));
check(`every live trade, under a city, a state and the directory (${live.length}): none answers 404${caughtTrades.length ? `: ${caughtTrades.slice(0, 5).join(", ")}` : ""}`, caughtTrades.length === 0);
const retiredCaught = Object.keys(RETIRED).filter((s) => nf(`/gb/london/${s}`) || nf(`/industries/${s}`));
check(`every retired slug is its redirect's (${Object.keys(RETIRED).length})${retiredCaught.length ? `: ${retiredCaught.slice(0, 5).join(", ")}` : ""}`, retiredCaught.length === 0);
const renamedCaught = Object.keys(TAXONOMY_REDIRECTS).filter((s) => nf(`/gb/london/${s}`) || nf(`/industries/${s}`));
check(`every renamed slug is its redirect's (${Object.keys(TAXONOMY_REDIRECTS).length})${renamedCaught.length ? `: ${renamedCaught.join(", ")}` : ""}`, renamedCaught.length === 0);
const liveAliases = Object.entries(INDUSTRY_SLUG_ALIASES).filter(([, id]) => liveIndustryFor(id)).map(([w]) => w);
const aliasCaught = liveAliases.filter((w) => nf(`/gb/london/${w}`) || nf(`/industries/${w}`));
check(`every alias of a live trade renders as it did (${liveAliases.length})${aliasCaught.length ? `: ${aliasCaught.slice(0, 5).join(", ")}` : ""}`, aliasCaught.length === 0);
const cities = (cityListJson as { cities: Array<{ slug: string }> }).cities;
const cityCaught = cities.filter((c) => nf(`/cities/${c.slug}`)).map((c) => c.slug);
check(`every listed city's page (${cities.length})${cityCaught.length ? `: ${cityCaught.slice(0, 5).join(", ")}` : ""}`, cityCaught.length === 0);
const hubCaught = Object.keys(NEIGHBORHOOD_SLUGS).filter((s) => nf(`/cities/${s}/neighborhoods`));
check(`every hub (${Object.keys(NEIGHBORHOOD_SLUGS).length})${hubCaught.length ? `: ${hubCaught.slice(0, 5).join(", ")}` : ""}`, hubCaught.length === 0);
const districtCaught = Object.entries(HOOD_DISTRICT_SLUGS).flatMap(([c, ds]) => ds.map((d) => `/cities/${c}/neighborhoods/${d}`)).filter(nf);
check(`every district page${districtCaught.length ? `: ${districtCaught.join(", ")}` : ""}`, districtCaught.length === 0);
const census = Object.keys((floorCensus as { pages: Record<string, unknown> }).pages);
const censusCaught = census.filter(nf);
check(`every page the floor census holds (${census.length})${censusCaught.length ? `: ${censusCaught.slice(0, 5).join(", ")}` : ""}`, censusCaught.length === 0);

/* P1-A (the page architecture, 2026-10-09): the place of a trade page and its sub-pages is judged against the place table, a United
   States word against the census descriptions the database holds, and a /decide pair by its route's own resolvers. */
const FIVE = ["gb", "us", "de", "fr", "tr"];
const placeMissed = FIVE.filter((cc) => !nf(`/${cc}/atlantis/restaurants`));
check(`a made-up place under a live trade answers 404 in five countries${placeMissed.length ? `: not under ${placeMissed.join(", ")}` : ""}`, placeMissed.length === 0);
check("a made-up place under an opening page, a buy-or-start page and a district's trade page answers 404", nf("/gb/atlantis/restaurants/opening") && nf("/gb/atlantis/restaurants/buy-or-start") && nf("/gb/atlantis/west-end/restaurants"));
check("a static child of the country is no place: /gb/industries/restaurants, /gb/how-to-open/restaurants", nf("/gb/industries/restaurants") && nf("/gb/how-to-open/restaurants"));
/* THE REVIEW OF 2026-10-09: the exemption of a place's static child (`/gb/england/industries`, a page of its own) was also given to
   the trade's sub-pages, where it holds no trade: /gb/england/industries/opening and /buy-or-start passed, and their route cannot draw
   them. The exemption is the trade page's own, in the three-part return. */
const STATIC_CHILD_REMEDY = "Exempt a static child of the place (GEO_STATIC_CHILDREN) from the verdict for its own three-part address only, in edgeNotFound's three-part return, never in tradeWordNamesNothing: the /opening and /buy-or-start routes draw a trade, and a static child is none";
check("a static child of a place is a page of its own, and no trade for the trade's sub-pages: /gb/england/industries passes, /gb/england/industries/opening and /gb/england/industries/buy-or-start answer 404", !nf("/gb/england/industries") && nf("/gb/england/industries/opening") && nf("/gb/england/industries/buy-or-start"), FILE, STATIC_CHILD_REMEDY);
const HELD_PLACES: Array<[string, string]> = [
  ["/gb/gb/restaurants", "the country's own code"],
  ["/gb/england/restaurants", "a nation, a region of the UK"],
  ["/gb/birmingham-uk/restaurants", "a friendly city alias (city_aliases_generated.ts)"],
  ["/gb/liverpool/restaurants", "a manual city alias the rivals list links (manual_city_aliases.ts)"],
  ["/gb/camden/restaurants", "a district alias the cell route reads (NEIGHBORHOOD_ALIASES)"],
  ["/de/frankfurt-am-main/restaurants", "the label address the across-cities columns link (cellUrl)"],
  ["/us/us-06-037/restaurants", "a county the database holds"],
  ["/us/california/restaurants", "a state"],
];
for (const [p, what] of HELD_PLACES) check(`${what} passes: ${p}`, !nf(p));
check("an opening page follows its trade page: /gb/london/restaurants/opening and /buy-or-start pass, /gb/london/zz-not-a-trade/opening answers 404", !nf("/gb/london/restaurants/opening") && !nf("/gb/london/restaurants/buy-or-start") && nf("/gb/london/zz-not-a-trade/opening"));
check("a district's trade page is judged by its route's resolvers: /gb/london/west-end/zz answers 404 (it went on to its route, which answered 200 with the skeleton; the plan 2026-10-11)", nf("/gb/london/west-end/zz"));
check("a census description under a county answers 404, only a state's lookup reads one: /us/us-06-037/offices-of-lawyers", nf("/us/us-06-037/offices-of-lawyers"));
check("a census description under a state passes: /us/mississippi/offices-of-lawyers", !nf("/us/mississippi/offices-of-lawyers"));
check("a /decide pair its route draws passes: /decide/restaurants/london", !nf("/decide/restaurants/london"));
check("a /decide pair whose activity names nothing answers 404: /decide/zz-not-a-trade/london", nf("/decide/zz-not-a-trade/london"));
check("a /decide pair whose city holds no neighbourhood scheme answers 404: /decide/restaurants/atlantis", nf("/decide/restaurants/atlantis"));
const hubCityList = Object.keys(NEIGHBORHOOD_SLUGS);
const decideCaught = hubCityList.flatMap((city) => live.map((s) => `/decide/${s}/${city}`)).filter(nf);
check(`every /decide pair of a hub city and a live trade passes (${hubCityList.length * live.length})${decideCaught.length ? `: ${decideCaught.slice(0, 5).join(", ")}` : ""}`, hubCityList.length > 0 && decideCaught.length === 0);
/* THE ADDRESSES THAT STILL DREW A SKELETON AT 200 (the plan 2026-10-11, dynamic 404 remains; QUEUE site:dynamic-404-skeleton). Each ran its
   route's notFound() inside a loading boundary, so production answered 200 with the skeleton and drew the 404 in the browser (probed
   2026-10-11): a district's trade page for a district or a trade its route cannot draw, a place's industries hub where the place is no region
   the hub draws, a how-to page for a country with no legal forms. The edge judges each by its route's own resolver, and every page of each
   kind the route draws still passes. */
const DYN = "answer 404 at the edge for a district trade page, an industries hub or a how-to page its route would draw as nothing, by that route's own resolver (the plan 2026-10-11, dynamic 404 remains)";
check("a district London's scheme does not name, under a live trade: /gb/london/not-a-district/restaurants", nf("/gb/london/not-a-district/restaurants") === true, FILE, DYN);
check("a word no trade answers to, under a district London's scheme names: /gb/london/west-end/zz-not-a-trade", nf("/gb/london/west-end/zz-not-a-trade") === true, FILE, DYN);
const schemes = (neighborhoodsJson as { cities: Record<string, { neighborhoods?: Array<{ slug?: string }> }> }).cities;
const schemeDrift = Object.keys(schemes).filter((c) => JSON.stringify((schemes[c].neighborhoods ?? []).map((n) => String(n.slug ?? "").toLowerCase()).filter(Boolean)) !== JSON.stringify(own(NEIGHBORHOOD_SLUGS, c) ?? null));
check(`the districts the edge reads are the ones the district trade route resolves: every city of data/cities/neighborhoods_v1.json, with its districts, in NEIGHBORHOOD_SLUGS (${schemeDrift.slice(0, 5).join(", ") || "all"})`, schemeDrift.length === 0 && Object.keys(NEIGHBORHOOD_SLUGS).length === Object.keys(schemes).length, FILE, "the district trade route reads getNeighborhood over every city of data/cities/neighborhoods_v1.json (src/lib/cities/neighborhoods.ts); where NEIGHBORHOOD_SLUGS, the hub's admitted cities, holds fewer, generate an unfiltered table in scripts/gen_hood_slugs.ts and read that in edgeNotFound");
const districtTrades = Object.entries(CITY_SLUGS_BY_COUNTRY).flatMap(([cc, cities]) => cities.filter((c) => own(NEIGHBORHOOD_SLUGS, c) && isHeldPlace(cc, c)).flatMap((c) => (own(NEIGHBORHOOD_SLUGS, c) ?? []).map((dist) => `/${cc}/${c}/${dist}/restaurants`)));
const districtTradesCaught = districtTrades.filter(nf);
check(`every district trade page its route draws passes (${districtTrades.length})${districtTradesCaught.length ? `: ${districtTradesCaught.slice(0, 5).join(", ")}` : ""}`, districtTrades.length > 0 && districtTradesCaught.length === 0, FILE, DYN);
check("a city is no region the industries hub draws: /gb/london/industries", nf("/gb/london/industries") === true, FILE, DYN);
const afRegion = getAdmin1Regions("AF").map((r) => r.slug.toLowerCase()).find((s) => isHeldPlace("af", s));
check(`a region of a country the hubs do not cover, a place the site holds: /af/${afRegion}/industries`, !!afRegion && !hasRegionalCoverage("AF") && nf(`/af/${afRegion}/industries`) === true, FILE, DYN);
check("a state's hub passes: /us/california/industries", nf("/us/california/industries") === false, FILE, DYN);
const hubs = COUNTRIES.map((c) => c.code.toLowerCase()).filter((cc) => hasRegionalCoverage(cc)).flatMap((cc) => getAdmin1Regions(cc.toUpperCase()).filter((r) => isHeldPlace(cc, r.slug)).map((r) => `/${cc}/${r.slug.toLowerCase()}/industries`));
const hubsCaught = hubs.filter(nf);
check(`every region hub its route draws passes (${hubs.length})${hubsCaught.length ? `: ${hubsCaught.slice(0, 5).join(", ")}` : ""}`, hubs.length > 0 && hubsCaught.length === 0, FILE, DYN);
check("a country with no legal forms has no how-to page: /af/how-to-open", nf("/af/how-to-open") === true, FILE, DYN);
const howTo = (COUNTRIES as Array<{ code: string }>).filter((c) => buildSetupRows(c.code).length > 0).map((c) => c.code.toLowerCase()).sort();
const howToCaught = howTo.filter((cc) => nf(`/${cc}/how-to-open`));
check(`every how-to page its route draws passes (${howTo.length})${howToCaught.length ? `: ${howToCaught.join(", ")}` : ""}`, howTo.length > 0 && howToCaught.length === 0, FILE, DYN);
const coverageDrift = COUNTRIES.filter((c) => HUB_COUNTRIES.has(c.code.toLowerCase()) !== hasRegionalCoverage(c.code)).map((c) => c.code);
check(`the hub countries the edge reads are hasRegionalCoverage's, for every country the site holds (${coverageDrift.join(", ") || "all agree"})`, coverageDrift.length === 0, FILE, DYN);
check(`the how-to countries the edge reads are the route's (${howTo.length})`, JSON.stringify([...HOW_TO_COUNTRIES].sort()) === JSON.stringify(howTo), ROUTE_SHAPES_FILE, "run node node_modules/tsx/dist/cli.mjs scripts/gen_route_shapes.ts");
const howToBody = /export function buildHowTo\([^)]*\)[^{]*\{([\s\S]*?)\n  return \{/.exec(readFileSync("src/lib/spine/howto_rows.ts", "utf8"))?.[1] ?? "";
check("buildHowTo answers null only for a country the site does not hold or one whose legal forms draw no row, the rule HOW_TO_COUNTRIES is generated by", (howToBody.match(/return null/g) ?? []).length === 2 && /if \(!name\) return null;/.test(howToBody) && /const tiers = buildSetupRows\(code\);/.test(howToBody) && /if \(tiers\.length === 0\) return null;/.test(howToBody), "scripts/gen_route_shapes.ts", "teach howToCountries in scripts/gen_route_shapes.ts any new null exit of buildHowTo (src/lib/spine/howto_rows.ts), then regenerate");
const PRERENDER_ROUTES: Array<[string, string]> = [
  ["src/app/[country]/[geo]/[industry]/page.tsx", ""],
  ["src/app/[country]/[geo]/[industry]/opening/page.tsx", "/opening"],
  ["src/app/[country]/[geo]/[industry]/buy-or-start/page.tsx", "/buy-or-start"],
];
const prerendered = PRERENDER_ROUTES.flatMap(([file, sub]) =>
  [...readFileSync(file, "utf8").matchAll(/\{\s*country:\s*"([a-z]{2})",\s*geo:\s*"([a-z0-9-]+)",\s*industry:\s*"([a-z0-9-]+)"\s*\}/g)].map((m) => `/${m[1]}/${m[2]}/${m[3]}${sub}`),
);
const prerenderCaught = prerendered.filter(nf);
check(`every address the trade, opening and buy-or-start routes prerender passes (${prerendered.length})${prerenderCaught.length ? `: ${prerenderCaught.join(", ")}` : ""}`, prerendered.length >= 30 && prerenderCaught.length === 0);

/* A FILE ONLY IF IT IS ONE (2026-10-06). A dot in the last part used to pass an address through untouched, to spare the files
   under public/, so a made-up file reached a page route and answered 200 (production, 2026-10-06): "Page not found" at
   /gb/london/restaurants/x.y and /data/uk/2026.10/nothing.csv, a region page titled "x.txt" at /zz/x.txt, and a whole synthesized
   London page, indexable, at /gb/london/x.y. Now a dotted address passes only when the site serves that file. */
check("a made-up file under a trade: /gb/london/restaurants/x.y", nf("/gb/london/restaurants/x.y") === true);
check("a made-up file beside the data pack: /data/uk/2026.10/nothing.csv", nf("/data/uk/2026.10/nothing.csv") === true);
check("a made-up file under a place the site does not hold: /zz/x.txt", nf("/zz/x.txt") === true);
check("a made-up file under a city, which drew a synthesized London page: /gb/london/x.y", nf("/gb/london/x.y") === true);
check("a made-up file under a United States state is judged too: /us/california/x.y", nf("/us/california/x.y") === true);
check("a made-up file at the root: /x.y", nf("/x.y") === true);
check("a scanner's guess: /wp-login.php", nf("/wp-login.php") === true);
check("the data pack's folder is no page: /data/uk/2026.10", nf("/data/uk/2026.10") === true);
check("a shard the sitemap does not make: /sitemap/99.xml", nf("/sitemap/99.xml") === true);
check("a made-up file with a photograph's ending: /zz/x.png", nf("/zz/x.png") === true);
check("a real file of the data pack: /data/uk/2026.10/ledger.json", nf("/data/uk/2026.10/ledger.json") === false);
check("the data pack's read-me: /data/uk/2026.10/readme.md", nf("/data/uk/2026.10/readme.md") === false);
check("a real photograph: /spine/_skyline.jpeg", nf("/spine/_skyline.jpeg") === false);
check("robots.txt, which src/app/robots.ts writes", nf("/robots.txt") === false);
check("a shard the sitemap makes: /sitemap/0.xml", nf("/sitemap/0.xml") === false);
check("the platform's own address is Vercel's: /_vercel/speed-insights/script.js (served while Speed Insights is on)", nf("/_vercel/speed-insights/script.js") === false);
check("the analytics script is Vercel's once his switch is on: /_vercel/insights/script.js", nf("/_vercel/insights/script.js") === false);

/* Every file the site serves answers as it did: each file under public/ by a walk of this test's own, not the table's; every file
   the data pack lists, at the address /data links; every sitemap robots.txt declares. */
const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${dir}${e.name}/`) : [`${dir}${e.name}`]));
const onDisk = walk("public/").map((f) => f.slice("public".length));
const filesCaught = onDisk.filter(nf);
check(`every file under public/ (${onDisk.length})${filesCaught.length ? `: ${filesCaught.slice(0, 5).join(", ")}` : ""}`, onDisk.length > 0 && filesCaught.length === 0);
const packCaught = PACK_FILES.map((f) => packHref(f.file)).filter(nf);
check(`every file of the data pack, at its link on /data (${PACK_FILES.length})${packCaught.length ? `: ${packCaught.join(", ")}` : ""}`, packCaught.length === 0);
const shards = [robots().sitemap ?? []].flat().map((u) => new URL(String(u)).pathname);
const shardsCaught = shards.filter(nf);
check(`every sitemap robots.txt declares (${shards.length})${shardsCaught.length ? `: ${shardsCaught.join(", ")}` : ""}`, shards.length > 0 && shardsCaught.length === 0);

/* The rule's premise: no page takes a dotted last part, so a dotted address that is no file names nothing. Every slug a page
   route resolves, read from that route's own source (2026-10-06: none of 2,056 declared addresses holds a dot). */
const slugSources: Array<[string, string[]]> = [
  ["country", COUNTRIES.map((c) => c.code.toLowerCase())],
  ["region of a held country", COUNTRIES.flatMap((c) => getRegionsForCountry(c.code, c.name).map((r) => r.value))],
  ["listed city", cities.map((c) => c.slug)],
  ["trade or alias", [...Object.keys(SLUG_TO_INDUSTRY as Record<string, unknown>), ...Object.keys(INDUSTRY_SLUG_ALIASES)]],
  ["neighbourhood or district", [...Object.values(NEIGHBORHOOD_SLUGS).flat(), ...Object.values(HOOD_DISTRICT_SLUGS).flat()]],
  ["blog post", getAllPosts().map((p) => p.slug)],
  ["learn article", LEARN_ARTICLES.map((a) => a.slug)],
];
for (const [label, slugs] of slugSources) {
  const dotted = slugs.filter((s) => s.includes("."));
  check(`no ${label} slug holds a dot (${slugs.length})${dotted.length ? `: ${dotted.slice(0, 5).join(", ")}` : ""}`, slugs.length > 0 && dotted.length === 0);
}

/* The tables cannot drift. */
/* Line endings aside: git on Windows may check the file out with CRLF. */
check(`${HOOD_SLUGS_FILE} equals a fresh generation (npx tsx scripts/gen_hood_slugs.ts)`, readFileSync(HOOD_SLUGS_FILE, "utf8").replace(/\r\n/g, "\n") === renderHoodSlugs(), HOOD_SLUGS_FILE);
/* A route the generator cannot place throws there, naming the file; caught here so it reads as a red, not a stack. */
let servedFresh: string | null = null;
try { servedFresh = renderServedFiles(); } catch (e) { check(`the generator places every dotted route of src/app: ${(e as Error).message}`, false, SERVED_FILES_FILE); }
if (servedFresh !== null) {
  check(`${SERVED_FILES_FILE} equals a fresh generation (npx tsx scripts/gen_served_files.ts)`, readFileSync(SERVED_FILES_FILE, "utf8").replace(/\r\n/g, "\n") === servedFresh, SERVED_FILES_FILE);
}

/* THE ROUTE TABLE (the plan 2026-10-11, route-folder fall-through, Task 2). The shapes each route folder of src/app serves, and the three
   closed lists its dynamic leaves resolve (the posts of content/blog, the articles, the city pairs), generated by scripts/gen_route_shapes.ts
   and held to a fresh generation here as the served files and the hood slugs are. The generator throws, naming the folder, on a folder kind
   it cannot place (a slot, an intercepting route, a catch-all, a second dynamic folder at the root); caught here so it reads as a red. */
const SHAPES_REMEDY = "Run npx tsx scripts/gen_route_shapes.ts in the same commit as the post, article, pair or route folder that changed it; never edit the table";
let shapesFresh: string | null = null;
try { shapesFresh = renderRouteShapes(); } catch (e) { check(`the generator places every route of src/app: ${(e as Error).message}`, false, ROUTE_SHAPES_FILE, SHAPES_REMEDY); }
if (shapesFresh !== null) {
  check(`${ROUTE_SHAPES_FILE} equals a fresh generation (npx tsx scripts/gen_route_shapes.ts)`, readFileSync(ROUTE_SHAPES_FILE, "utf8").replace(/\r\n/g, "\n") === shapesFresh, ROUTE_SHAPES_FILE, SHAPES_REMEDY);
}
/* Two walkers of src/app, one for the folders and files that hold a first part (verify_top_level_segments) and one for the routes
   (the generator): they agree, or one of them reads a folder the other does not. */
const shapeFirsts = new Set(ROUTE_SHAPES.map((s) => s[0]));
const noShapeUnder = [...TOP_LEVEL_SEGMENTS].filter((s) => !shapeFirsts.has(s)).sort();
const noSegmentFor = [...shapeFirsts].filter((s) => !TOP_LEVEL_SEGMENTS.has(s)).sort();
check(
  `the first parts of ROUTE_SHAPES are TOP_LEVEL_SEGMENTS, so the two walkers of src/app agree (${shapeFirsts.size} and ${TOP_LEVEL_SEGMENTS.size})${noShapeUnder.length ? `; no shape under: ${noShapeUnder.join(", ")}` : ""}${noSegmentFor.length ? `; no segment for: ${noSegmentFor.join(", ")}` : ""}`,
  shapeFirsts.size > 0 && noShapeUnder.length === 0 && noSegmentFor.length === 0,
  ROUTE_SHAPES_FILE,
  "Run the generator (npx tsx scripts/gen_route_shapes.ts) and the top-level-segments gate (node scripts/verify_top_level_segments.mjs): a route folder holds a first part for both, and a folder with no page or route file in it holds a name for the second and no shape for the first, so give it its page or take its name out of src/lib/routing/top_level_segments.ts",
);
const blogFiles = readdirSync("content/blog").filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -".md".length)).sort();
const blogListed = getAllPosts().map((p) => p.slug).sort();
check(
  `BLOG_SLUGS is the posts getAllPosts() lists and the .md files of content/blog (${BLOG_SLUGS.size} of ${blogFiles.length} files)`,
  blogFiles.length > 0 && JSON.stringify([...BLOG_SLUGS].sort()) === JSON.stringify(blogFiles) && JSON.stringify(blogListed) === JSON.stringify(blogFiles),
  ROUTE_SHAPES_FILE,
  SHAPES_REMEDY,
);
const learnListed = LEARN_ARTICLES.map((a) => a.slug).sort();
check(`LEARN_SLUGS is the articles of the knowledge base (${LEARN_SLUGS.size} of ${learnListed.length})`, learnListed.length > 0 && JSON.stringify([...LEARN_SLUGS].sort()) === JSON.stringify(learnListed), ROUTE_SHAPES_FILE, SHAPES_REMEDY);
/* The pair route resolves a pair of the comparisons file, and notFound()s when either of its two cities is not in the city list. */
const pairRows = (cityComparisonsJson as { pairs: Array<{ left: string; right: string }> }).pairs;
const listedCitySlugs = new Set(cities.map((c) => c.slug));
const pairsNamingNoCity = pairRows.filter((p) => !listedCitySlugs.has(p.left) || !listedCitySlugs.has(p.right)).map((p) => `${p.left}-vs-${p.right}`);
const pairsHeld = pairRows.map((p) => `${p.left}-vs-${p.right}`).filter((s) => !pairsNamingNoCity.includes(s)).sort();
check(`CITY_PAIRS is the pairs of data/cities/city_comparisons_v1.json whose two cities the city list holds, as the pair route reads them (${CITY_PAIRS.size} of ${pairRows.length})`, pairRows.length > 0 && JSON.stringify([...CITY_PAIRS].sort()) === JSON.stringify(pairsHeld), ROUTE_SHAPES_FILE, SHAPES_REMEDY);
check(`every pair the comparisons file holds names two listed cities, so none the sitemap declares is answered 404 at the edge${pairsNamingNoCity.length ? `: ${pairsNamingNoCity.join(", ")}` : ""}`, pairsNamingNoCity.length === 0, "data/cities/city_comparisons_v1.json", "Name only cities of data/cities/city_list_v1.json in a pair: the pair route calls notFound() for a pair whose city the list does not hold, and src/app/sitemap.ts declares every pair of the file");
/* The edge compares a part as written, lowercased, and a path carries a letter with an accent, a space or a capital percent-encoded or
   in another case, a dot as a file's ending and a slash as another part: a slug of any of those is a real address the table could not
   match, answered 404 for a page that exists. */
const SLUG_LISTS: Array<[string, ReadonlySet<string>]> = [["BLOG_SLUGS", BLOG_SLUGS], ["LEARN_SLUGS", LEARN_SLUGS], ["CITY_PAIRS", CITY_PAIRS]];
const oddListed = SLUG_LISTS.flatMap(([name, set]) => [...set].filter((s) => !/^[a-z0-9_-]+$/.test(s)).map((s) => `${name} ${JSON.stringify(s)}`));
check(
  `no slug of the three lists is empty or holds a dot, a slash, a capital or any character a path does not carry as written (${SLUG_LISTS.map(([name, set]) => `${name} ${set.size}`).join(", ")})${oddListed.length ? `: ${oddListed.slice(0, 5).join(", ")}` : ""}`,
  SLUG_LISTS.every(([, set]) => set.size > 0) && oddListed.length === 0,
  ROUTE_SHAPES_FILE,
  "Name the post file, the article's slug and the cities of a pair with lowercase letters, digits, hyphens and underscores only: the edge compares each part of an address as written, so a slug of anything else (a dot, a slash, a capital, a space, an accent) names a page the table cannot match",
);
/* THE GENERATOR'S WALK, on trees of its own. The real src/app holds none of the folder kinds the generator refuses, so without these rows
   the refusals are code no run reaches. A tree is the list of files under a temporary root, removed after. */
const SHAPES_WALK_REMEDY = "Read a folder kind in routeShapes (scripts/gen_route_shapes.ts) as the router does, or refuse it by throwing with the folder's name: left out, a real address is answered 404 at the edge";
const withTree = <T>(files: string[], then: (root: string) => T, texts: Record<string, string> = {}): T => {
  const root = mkdtempSync(join(tmpdir(), "route-shapes-"));
  try {
    for (const rel of files) {
      mkdirSync(dirname(join(root, rel)), { recursive: true });
      writeFileSync(join(root, rel), texts[rel] ?? "export default function Page() { return null; }\n");
    }
    return then(root);
  } finally {
    try { rmSync(root, { recursive: true, force: true }); } catch { /* a temporary folder left behind is the system's to clear */ }
  }
};
const shapesOf = (files: string[], texts?: Record<string, string>): string => {
  try { return withTree(files, (root) => routeShapes(root).map((s) => s.join("/")).join(" "), texts); } catch (e) { return `throws: ${(e as Error).message}`; }
};
const WALKED = shapesOf(["page.tsx", "(site)/about/page.tsx", "(site)/blog/page.tsx", "(site)/blog/[slug]/page.tsx", "[country]/page.tsx", "[country]/[geo]/page.tsx", "_private/page.tsx", "api/x/route.ts", "feed.xml/route.ts", "embed/[country]/[geo]/page.tsx", "pro/[country]/page.tsx", "icon.tsx"]);
check(`the generator reads a tree as the router does: groups dropped, a dynamic folder written *, and the home page, the country tree, a private folder and a dotted route left out (${WALKED})`, WALKED === "about api/x blog blog/* embed/*/* icon pro/*", ROUTE_SHAPES_FILE, SHAPES_WALK_REMEDY);
/* A METADATA ROUTE THAT SERVES ONE ADDRESS PER ID (the final review of 2026-10-11, N1). An icon or an image file that exports generateImageMetadata is
   served at /icon/<id> for each id it lists, so its shape ends in "*" as a dynamic folder's does. The walk wrote the 0 that requestedAddress fills a
   request's id with, the shape held /icon/0 alone, and the edge would have answered 404 for every other id. No image file of src/app exports
   generateImageMetadata today, so only this tree reaches the path. A sitemap's shard (/sitemap/<id>.xml, src/app/sitemap.ts exports
   generateSitemaps) is dotted, the file rule's, and is no shape. */
const WALKED_PER_ID = shapesOf(["icon.tsx", "sitemap.ts"], {
  "icon.tsx": "export async function generateImageMetadata() { return [{ id: 'small' }, { id: 'large' }]; }\nexport default function Icon() { return null; }\n",
  "sitemap.ts": "export async function generateSitemaps() { return [{ id: 0 }, { id: 1 }]; }\nexport default function sitemap() { return []; }\n",
});
check(`the generator writes the id of a metadata route that serves one address per id as *, never as the 0 a request fills it with, and leaves a sitemap's dotted shard to the file rule (${WALKED_PER_ID})`, WALKED_PER_ID === "icon/*", ROUTE_SHAPES_FILE, "Write the part `[__metadata_id__]` of a metadata route's own address as * in routeShapes (scripts/gen_route_shapes.ts), and use requestedAddress for the dot test alone: written as the 0 a request fills in, every other id of the route is answered 404 at the edge");
const REFUSED: Array<[string, string, string]> = [
  ["a parallel route's slot", "@modal/page.tsx", "@modal"],
  ["an intercepting route", "blog/(.)photo/page.tsx", "(.)photo"],
  ["a catch-all", "guide/[...rest]/page.tsx", "[...rest]"],
  ["an optional catch-all", "guide/[[...rest]]/page.tsx", "[[...rest]]"],
  ["a second dynamic folder at the root", "[other]/page.tsx", "[other]"],
  ["a second dynamic folder at the root, inside a route group", "(site)/[other]/page.tsx", "[other]"],
];
const notRefused = REFUSED.filter(([, file, folder]) => { const got = shapesOf([file]); return !(got.startsWith("throws: ") && got.includes(folder)); }).map(([what]) => what);
check(`the generator refuses, naming the folder, what it cannot place (${REFUSED.length} kinds)${notRefused.length ? `: not refused: ${notRefused.join(", ")}` : ""}`, notRefused.length === 0, ROUTE_SHAPES_FILE, SHAPES_WALK_REMEDY);
const geoChildren = readdirSync("src/app/[country]/[geo]", { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith("[")).map((d) => d.name).sort();
check(`GEO_STATIC_CHILDREN is the static folders of src/app/[country]/[geo] (${geoChildren.join(", ")})`, JSON.stringify([...GEO_STATIC_CHILDREN].sort()) === JSON.stringify(geoChildren));
const tradeChildren = readdirSync("src/app/[country]/[geo]/[industry]", { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith("[")).map((d) => d.name).sort();
check(`TRADE_SUB_PAGES is the static folders of src/app/[country]/[geo]/[industry] (${tradeChildren.join(", ")})`, JSON.stringify([...TRADE_SUB_PAGES].sort()) === JSON.stringify(tradeChildren));
/* THE STATES A CENSUS DESCRIPTION IS READ UNDER (the review of 2026-10-09). The edge lets a description through only under a state of the
   United States, and the cell lookup reads one only for a place SLUG_TO_GEO_ID names (getCellBySlugRaw, src/lib/cells.ts). The edge cannot
   import that table (src/lib/cells/geo.ts pulls the city alias tables into the middleware), so it keeps its own list, from the regions
   table the middleware already bundles, and this holds the two equal: a state on one list only answers 404 for a description the page
   draws, or passes an address the page cannot. */
const cellStates = Object.keys(SLUG_TO_GEO_ID).sort();
const edgeStates = [...US_STATES].sort();
const onlyEdge = edgeStates.filter((s) => !cellStates.includes(s));
const onlyCell = cellStates.filter((s) => !edgeStates.includes(s));
check(
  `US_STATES is the keys of the cell lookup's SLUG_TO_GEO_ID (${edgeStates.length} of ${cellStates.length})${onlyEdge.length ? `; only the edge's: ${onlyEdge.join(", ")}` : ""}${onlyCell.length ? `; only the cell lookup's: ${onlyCell.join(", ")}` : ""}`,
  cellStates.length > 0 && onlyEdge.length === 0 && onlyCell.length === 0,
  FILE,
  "Make US_STATES in src/lib/routing/edge_not_found.ts the places getCellBySlugRaw reads a census description under, the keys of SLUG_TO_GEO_ID in src/lib/cells/geo.ts; never import that table into the edge",
);

/* THE PLACE TABLE (P1-A of the page architecture, 2026-10-09). Every place word a table of the site holds, and the ids and the
   United States' census descriptions the database holds, generated by hand (scripts/gen_place_slugs.ts --database writes the scan
   to data/seo/place_db_words.json; the table is written again from it offline). Held here to a fresh generation, to the edge's
   budget, and to the places and words the census's pages name. */
const TABLE_REMEDY = "Rerun scripts/gen_place_slugs.ts with the database; never edit the table";
/* A word the site's own links spell and the table lacks is a source the generator does not read, and a rerun cannot add it. */
const LINKED_REMEDY = "Add the table that spells this word to staticPlaceWords() in scripts/gen_place_slugs.ts, then run it again offline (node node_modules/tsx/dist/cli.mjs scripts/gen_place_slugs.ts); never edit the table";
const SCAN_REMEDY = "Run scripts/gen_place_slugs.ts --database again, by hand; a scan under its floor left real addresses out, and a floor is lowered only when the database itself holds fewer rows, by the owner's word";
const tableCheck = (label: string, ok: boolean, file = PLACE_SLUGS_FILE, remedy = TABLE_REMEDY) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, detail: label, remedy });
};
let placesFresh: string | null = null;
try { placesFresh = renderPlaceSlugs(); } catch (e) { tableCheck(`the table can be written from ${PLACE_DB_FILE}: ${(e as Error).message}`, false, PLACE_DB_FILE); }
if (placesFresh !== null) {
  tableCheck(`${PLACE_SLUGS_FILE} equals a fresh generation from ${PLACE_DB_FILE} (node node_modules/tsx/dist/cli.mjs scripts/gen_place_slugs.ts)`, readFileSync(PLACE_SLUGS_FILE, "utf8").replace(/\r\n/g, "\n") === placesFresh);
}
const tableBytes = readFileSync(PLACE_SLUGS_FILE, "utf8").length;
tableCheck(`the table fits the edge's budget, which the middleware carries on every request (${tableBytes} of ${PLACE_TABLE_BUDGET_BYTES} bytes)`, tableBytes <= PLACE_TABLE_BUDGET_BYTES);
const scan = readDbWords();
/* THE SCAN'S FLOOR (the review of 2026-10-09). A scan that stopped short leaves real addresses out of the table, and the edge answers
   404 for them; the generator throws on an error, not on a short answer, and "not empty" would pass a scan of one country. Each
   floor is about 95% of what the scan of 2026-10-09 read (376,033 regional rows, 691,551 United States rows, 9,365 ids in 127
   countries, 1,348 descriptions), so a rescan may differ a little and a half-read one reds. Raise them when a scan grows. */
const SCAN_FLOOR = { regional_rows: 350_000, us_rows: 650_000, place_ids: 8_800, countries: 120, descriptions: 1_280 };
const scanIds = Object.values(scan.places).reduce((n, list) => n + list.length, 0);
const scanShort = [
  scan.regional_rows < SCAN_FLOOR.regional_rows && `regional rows ${scan.regional_rows} under ${SCAN_FLOOR.regional_rows}`,
  scan.us_rows < SCAN_FLOOR.us_rows && `United States rows ${scan.us_rows} under ${SCAN_FLOOR.us_rows}`,
  scanIds < SCAN_FLOOR.place_ids && `place ids ${scanIds} under ${SCAN_FLOOR.place_ids}`,
  Object.keys(scan.places).length < SCAN_FLOOR.countries && `countries ${Object.keys(scan.places).length} under ${SCAN_FLOOR.countries}`,
  scan.us_descriptions.length < SCAN_FLOOR.descriptions && `descriptions ${scan.us_descriptions.length} under ${SCAN_FLOOR.descriptions}`,
].filter((s): s is string => typeof s === "string");
tableCheck(`the database's scan is whole (${scan.regional_rows} regional rows, ${scan.us_rows} United States rows, ${scanIds} place ids in ${Object.keys(scan.places).length} countries, ${scan.us_descriptions.length} descriptions, scanned ${scan.scanned_at})${scanShort.length ? `: ${scanShort.join("; ")}` : ""}`, scanShort.length === 0, PLACE_DB_FILE, SCAN_REMEDY);
const placeWords = Object.values(PLACE_SLUGS_BY_COUNTRY).flat();
const oddWords = placeWords.filter((w) => w === "" || w.includes(".") || w.includes("/") || w !== w.toLowerCase() || w.trim() !== w);
tableCheck(`no place word is empty or holds a dot, a slash, a capital or a space (${placeWords.length})${oddWords.length ? `: ${oddWords.slice(0, 5).join(", ")}` : ""}`, placeWords.length > 0 && oddWords.length === 0);
const noOwnCode = COUNTRIES.map((c) => c.code.toLowerCase()).filter((cc) => !isHeldPlace(cc, cc));
tableCheck(`every country the site holds has its own code, as /gb/gb (${COUNTRIES.length})${noOwnCode.length ? `: missing ${noOwnCode.join(", ")}` : ""}`, noOwnCode.length === 0);
const censusTrades = Object.keys((floorCensus as { pages: Record<string, unknown> }).pages).map((p) => p.split("/").filter(Boolean)).filter((s) => s.length === 3);
const censusPlaceMissing = censusTrades.filter(([cc, place]) => !isHeldPlace(cc, place)).map((s) => `/${s.join("/")}`);
tableCheck(`every place the census's trade pages name is held (${censusTrades.length})${censusPlaceMissing.length ? `: ${censusPlaceMissing.slice(0, 5).join(", ")}` : ""}`, censusTrades.length > 0 && censusPlaceMissing.length === 0);
const censusWordMissing = censusTrades.filter(([cc, , w]) => cc === "us" && !US_DESCRIPTION_SLUGS.has(w) && resolveDisplayIndustry(w) === null).map((s) => `/${s.join("/")}`);
tableCheck(`every United States word the census holds is a description the scan found, or a trade${censusWordMissing.length ? `: ${censusWordMissing.slice(0, 5).join(", ")}` : ""}`, censusWordMissing.length === 0, PLACE_DB_FILE);
const HELD_SAMPLES: Array<[string, string, string]> = [
  ["gb", "birmingham-uk", "a friendly city alias (city_aliases_generated.ts)"],
  ["gb", "liverpool", "a manual city alias the rivals list links (manual_city_aliases.ts)"],
  ["gb", "camden", "a district alias the cell route reads (NEIGHBORHOOD_ALIASES)"],
  ["gb", "england", "a nation"],
  ["us", "california", "a state"],
  ["us", "us-06-037", "a county the database holds"],
  ["de", "frankfurt-am-main", "the label address the across-cities columns link (cellUrl)"],
  ["es", "es511", "a place the trade route prerenders (generateStaticParams)"],
  ["at", "at1", "a region id the regional tables hold"],
];
for (const [cc, place, what] of HELD_SAMPLES) tableCheck(`${what} is held: /${cc}/${place}`, isHeldPlace(cc, place));
tableCheck("a made-up place is not: /gb/atlantis", !isHeldPlace("gb", "atlantis"));
/* THE READER'S CACHE IS AS SMALL AS THE TABLE (the review of 2026-10-09). placeWordsFor is asked with the country part of a request,
   so a word nobody holds must not get a cache entry of its own: two such words get the one shared empty set, and a code the table
   holds gets one cached set whatever its case. The statistics codes the table keeps still have their words. */
const WORDS_FILE = "src/lib/routing/place_words.ts";
const WORDS_REMEDY = "Cache in placeWordsFor only a code the table holds (own(PLACE_SLUGS_BY_COUNTRY, code)); answer any other word with the shared empty set";
tableCheck("a word the table does not hold gets the one shared empty set, never a cache entry of its own", placeWordsFor("zz-a-request-word").size === 0 && placeWordsFor("zz-a-request-word") === placeWordsFor("zz-another-request-word"), WORDS_FILE, WORDS_REMEDY);
tableCheck("a code the table holds gets one cached set, whatever its case: GB and gb", placeWordsFor("GB") === placeWordsFor("gb") && placeWordsFor("gb").size > 0, WORDS_FILE, WORDS_REMEDY);
tableCheck("a statistics code the table keeps has its words: /el/el3", isHeldPlace("el", "el3") && !isHeldPlace("el", "atlantis"), WORDS_FILE, WORDS_REMEDY);

/* THE WORDS THE SITE'S OWN LINKS SPELL (the review of 2026-10-09). The first table held what the site's tables list and missed
   three groups that code turns into an address: a country's name (the six trade doors of its page, adapt_country.ts, and its
   down-link, app/[country]/page.tsx: /jp/japan/restaurants), the curated default region of the home form and /api/go
   (destination.ts: /es/es300/restaurants), and a region's label (cellUrl spells slugify(geo_name) and getCellBySlug stamps the
   label on the cell of /de/de21: /de/oberbayern/restaurants). That table lacked 185 country names, 17 default regions and 1,920
   label slugs, so the edge answered 404 for addresses the site links. A sample of each, then a loop over all of each, read from the
   tables the code reads. */
const LINKED_SAMPLES: Array<[string, string, string]> = [
  ["jp", "japan", "a country's name, the door of its trade rows (adapt_country.ts placeGeo)"],
  ["de", "germany", "a country's name, the down-link of its page (app/[country]/page.tsx placeGeo)"],
  ["es", "es300", "the home form's default region for Spain (default_region_by_country.ts)"],
  ["de", "oberbayern", "a region's label, the address cellUrl spells for /de/de21"],
];
for (const [cc, place, what] of LINKED_SAMPLES) tableCheck(`${what} is held: /${cc}/${place}`, isHeldPlace(cc, place), PLACE_SLUGS_FILE, LINKED_REMEDY);
tableCheck("the premise of the label sample: the page of /de/de21 stamps the label Oberbayern, which slugifies to oberbayern", slugify(geoNameFromSlug("DE", "de21")) === "oberbayern", PLACE_SLUGS_FILE, "Pick another region whose label differs from its id, so the sample stands for a label address");
const nameNotHeld = COUNTRIES.map((c) => [c.code.toLowerCase(), slugify(c.name)] as const).filter(([cc, w]) => !isHeldPlace(cc, w)).map(([cc, w]) => `/${cc}/${w}`);
tableCheck(`every country's name is a held place under its code (${COUNTRIES.length})${nameNotHeld.length ? `: ${nameNotHeld.length} are not, as ${nameNotHeld.slice(0, 5).join(", ")}` : ""}`, nameNotHeld.length === 0, PLACE_SLUGS_FILE, LINKED_REMEDY);
const defaultRegions = Object.entries(DEFAULT_REGION_BY_COUNTRY).map(([iso, w]) => [iso.toLowerCase(), w] as const);
const defaultNotHeld = defaultRegions.filter(([cc, w]) => !isHeldPlace(cc, w)).map(([cc, w]) => `/${cc}/${w}`);
tableCheck(`every curated default region of the home form is a held place (${defaultRegions.length})${defaultNotHeld.length ? `: ${defaultNotHeld.length} are not, as ${defaultNotHeld.slice(0, 5).join(", ")}` : ""}`, defaultRegions.length > 0 && defaultNotHeld.length === 0, PLACE_SLUGS_FILE, LINKED_REMEDY);
let labelCount = 0;
const labelNotHeld: string[] = [];
for (const c of COUNTRIES) {
  const cc = c.code.toLowerCase();
  const CC = c.code.toUpperCase();
  const labels = new Set<string>();
  for (const r of [...getRegionsForCountry(CC, c.name), ...(own(REGIONS_BY_COUNTRY_AUTO, CC) ?? [])]) labels.add(slugify(r.label));
  for (const w of placeWordsFor(cc)) labels.add(slugify(geoNameFromSlug(CC, w)));
  labels.delete("");
  for (const s of labels) {
    labelCount++;
    if (!isHeldPlace(cc, s)) labelNotHeld.push(`/${cc}/${s}`);
  }
}
tableCheck(`every label a page can stamp is a held place: the label of every region table's row and of every word the table holds (${labelCount})${labelNotHeld.length ? `: ${labelNotHeld.length} are not, as ${labelNotHeld.slice(0, 5).join(", ")}` : ""}`, labelCount > 0 && labelNotHeld.length === 0, PLACE_SLUGS_FILE, LINKED_REMEDY);

/* THE SAMPLES ONLY THE SCAN HOLDS (the review of 2026-10-09). Every sample above is also in a table of the site, so none of them
   would red if the database's ids fell out of the table. Each of these is in the scan and in no table of the site. */
const staticWords = staticPlaceWords();
const DB_ONLY_SAMPLES: Array<[string, string, string]> = [
  ["us", "us-01-009", "a United States county id"],
  ["gb", "gb-e06000004", "a UK local authority id"],
  ["au", "au-101021007", "an Australian area id"],
  ["mx", "mx-01-003", "a Mexican municipality id"],
  ["nl", "nl-gm0037", "a Dutch municipality id"],
];
const notDbOnly = DB_ONLY_SAMPLES.filter(([cc, place]) => !scan.places[cc]?.includes(place) || staticWords.get(cc)?.has(place)).map(([cc, place]) => `/${cc}/${place}`);
tableCheck(`the premise of the database samples: each is in the scan and in no table of the site (${DB_ONLY_SAMPLES.length})${notDbOnly.length ? `: not so for ${notDbOnly.join(", ")}; pick another id the scan holds and no table does` : ""}`, notDbOnly.length === 0, PLACE_DB_FILE, SCAN_REMEDY);
for (const [cc, place, what] of DB_ONLY_SAMPLES) tableCheck(`${what}, which only the scan holds, is held: /${cc}/${place}`, isHeldPlace(cc, place), PLACE_DB_FILE, SCAN_REMEDY);

/* The middleware asks both, after every redirect it owns, and pins the 404 in the same block as the place rule. */
const MW = "src/middleware.ts";
const mw = stripCommentLines(readFileSync(MW, "utf8").split("\n")).join("\n");
const at = (s: string) => mw.indexOf(s);
/* EVERY ANCHOR MUST BE FOUND (2026-10-08). An anchor that matches nothing reads -1, and each ordering check below asks whether
   a position comes after it, which -1 satisfies for any real position: the rename step's anchor read `TAXONOMY_REDIRECTS[last]`
   until 7395d11d made the step `own(TAXONOMY_REDIRECTS, last)`, so the check on the renamed redirects could not fail. A stale
   anchor is now a red of its own, naming the text. */
const ANCHORS = {
  retired: "retiredPlaceTarget(path)",
  rename: "own(TAXONOMY_REDIRECTS, last)",
  hood: "legacyHoodTarget(path)",
  place: "isPlaceWeDoNotHold(path)",
  edge: "edgeNotFound(path)",
} as const;
const anchorAt = Object.fromEntries(Object.entries(ANCHORS).map(([name, text]) => [name, at(text)])) as Record<keyof typeof ANCHORS, number>;
const lostAnchors = Object.entries(ANCHORS).filter(([name]) => !(anchorAt[name as keyof typeof ANCHORS] > 0)).map(([, text]) => text);
check(`the middleware holds the text its order checks anchor on (${Object.keys(ANCHORS).length} anchors)${lostAnchors.length ? `: not found: ${lostAnchors.join(", ")}` : ""}`, lostAnchors.length === 0, MW);
const { retired: retiredAt, rename: renameAt, hood: hoodAt, place: placeAt, edge: edgeAt } = anchorAt;
check("the middleware asks legacyHoodTarget after the retired and renamed redirects", hoodAt > 0 && hoodAt > retiredAt && hoodAt > renameAt, MW);
check("the middleware asks edgeNotFound beside isPlaceWeDoNotHold, after every redirect", edgeAt > 0 && placeAt > 0 && edgeAt > hoodAt && Math.abs(edgeAt - placeAt) < 200, MW);
/* THE 404 IS THE SITE'S STATIC NOT-FOUND PAGE (the plan 2026-10-11, route-folder fall-through, Task 1). Every pin used to rewrite the request
   onto its own address with the status pinned, so the matched route rendered its loading skeleton and drew its 404 in the browser, under
   the head of the route (an indexable one for an address a route folder does not hold: /pricing/xyz). It now rewrites onto /_not-found,
   Next's prerendered page for an address no route matches, built from src/app/not-found.tsx: the page in server HTML, its own title,
   noindex. BLIND SPOT: this reads the middleware's source and its answer to a request, so it cannot tell what Next or the platform then
   serves for the rewrite: the status and the body on the wire are the build's (curl on a built page) and then production's. */
const NOT_FOUND_REMEDY = "Pin the 404 for an address for nothing with notFoundAtEdge (src/middleware.ts), which rewrites onto NOT_FOUND_ROUTE (src/lib/routing/edge_not_found.ts, Next's /_not-found, the page it prerenders from src/app/not-found.tsx) with the status 404: a rewrite onto the address itself renders the matched route's loading skeleton and draws the 404 in the browser, under that route's own head";
check(`NOT_FOUND_ROUTE is Next's own address for its prerendered not-found page (${String(NOT_FOUND_ROUTE)} against ${UNDERSCORE_NOT_FOUND_ROUTE})`, NOT_FOUND_ROUTE === UNDERSCORE_NOT_FOUND_ROUTE && NOT_FOUND_ROUTE === "/_not-found", FILE, "export const NOT_FOUND_ROUTE = \"/_not-found\" from src/lib/routing/edge_not_found.ts, the address next/dist/shared/lib/constants calls UNDERSCORE_NOT_FOUND_ROUTE");
check("the page it serves is built from src/app/not-found.tsx, and no src/app/global-not-found.tsx replaces it", existsSync("src/app/not-found.tsx") && !existsSync("src/app/global-not-found.tsx"), "src/app/not-found.tsx", "keep the site's not-found page at src/app/not-found.tsx and add no src/app/global-not-found.tsx: /_not-found is built from the first, and the second would change what every pinned address answers");
check("the 404 for an address for nothing rewrites to Next's static not-found page: the pin asks isPlaceWeDoNotHold and edgeNotFound, and notFoundAtEdge rewrites onto NOT_FOUND_ROUTE with the status 404", /isPlaceWeDoNotHold\(path\)\s*\|\|\s*edgeNotFound\(path\)\)\s*return notFoundAtEdge\(req, path\)/.test(mw) && /NextResponse\.rewrite\(new URL\(NOT_FOUND_ROUTE, req\.url\), \{\s*status: 404/.test(mw), MW, NOT_FOUND_REMEDY);
check("no pin rewrites an address onto itself any more: every 404 goes through notFoundAtEdge", !/NextResponse\.rewrite\(req\.nextUrl, \{\s*status: 404/.test(mw), MW, NOT_FOUND_REMEDY);

/* And the middleware itself, driven with requests: a pinned address comes back 404 with a rewrite onto Next's static not-found page
   (/_not-found, with the status pinned; /zz and /gb/atlantis answer the same); a passed one comes back as next(). Each request from an
   address of its own, so the rate limit never trips here. */
const SITE = "https://www.marginatlas.com";
const BROWSER = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
let client = 0;
const send = (path: string, ua = BROWSER) =>
  middleware(new NextRequest(`${SITE}${path}`, { headers: { "user-agent": ua, "accept-language": "en-GB", "x-real-ip": `10.0.${client >> 8}.${client++ & 255}` } }));
const pinned = (path: string) => { const r = send(path); return r.status === 404 && r.headers.get("x-middleware-rewrite") === `${SITE}${NOT_FOUND_ROUTE}`; };
const passed = (path: string) => { const r = send(path); return r.status === 200 && r.headers.get("x-middleware-next") === "1" && !r.headers.get("x-middleware-rewrite"); };
for (const p of ["/gb/london/restaurants/x.y", "/data/uk/2026.10/nothing.csv", "/zz/x.txt", "/gb/london/x.y", "/x.y", "/sitemap/99.xml"]) {
  check(`the middleware answers 404 for a made-up file: ${p}`, pinned(p), MW);
}
for (const p of ["/data/uk/2026.10/ledger.json", "/data/uk/2026.10/readme.md", "/geo/countries-110m.json", "/sitemap/0.xml", "/_vercel/speed-insights/script.js"]) {
  check(`the middleware passes a file the site serves: ${p}`, passed(p), MW);
}
check("a training crawler is still refused a file of the data pack, as before (451)", send("/data/uk/2026.10/ledger.json", "GPTBot/1.1").status === 451, MW);
check("a place the site does not hold still answers 404: /gb/atlantis", pinned("/gb/atlantis"), MW);
check("a static child of a place has no sub-pages: the middleware pins /gb/england/industries/opening and /gb/england/industries/buy-or-start to 404 and passes /gb/england/industries", pinned("/gb/england/industries/opening") && pinned("/gb/england/industries/buy-or-start") && passed("/gb/england/industries"), MW, STATIC_CHILD_REMEDY);
for (const p of ["/gb/london/not-a-district/restaurants", "/gb/london/west-end/zz-not-a-trade", "/gb/london/industries", "/af/how-to-open", "/admin/anomalies", "/admin/data-quality", "/admin/review"]) {
  check(`the middleware answers 404 with the static not-found page: ${p} (the plan 2026-10-11, dynamic 404 remains)`, pinned(p), MW, NOT_FOUND_REMEDY);
}
for (const p of ["/gb/london/west-end/restaurants", "/gb/england/industries", "/us/california/industries", "/gb/how-to-open", "/admin/anomalies?key=x"]) {
  check(`the middleware passes to its route: ${p}`, passed(p), MW);
}
/* The words the site's own links spell reach their routes (the review of 2026-10-09): the middleware, asked as above, passes each
   address the first table made it answer 404 for, and the ids only the scan holds. */
for (const [cc, place, what] of LINKED_SAMPLES) tableCheck(`${what} passes the middleware to its route: /${cc}/${place}/restaurants`, passed(`/${cc}/${place}/restaurants`), PLACE_SLUGS_FILE, LINKED_REMEDY);
for (const [cc, place, what] of DB_ONLY_SAMPLES) tableCheck(`${what} passes the middleware to its route: /${cc}/${place}/restaurants`, passed(`/${cc}/${place}/restaurants`), PLACE_DB_FILE, SCAN_REMEDY);

/* A PERCENT-ENCODED PLACE WORD (the review of 2026-10-09). Six places the table holds are spelled with an accent (the accented keys of
   src/lib/geo/popular_place_overrides.json: br/s%c3%a3o-paulo is one, de/baden-w%c3%bcrttemberg another). A reader's browser may send
   the address in three spellings (decoded, upper-case hex, lower-case hex), the middleware hops the first two to the lower-case hex
   one, and the pathname it judges there is still encoded (`/br/s%c3%a3o-paulo/restaurants`), while Next's route matcher hands the
   page the decoded word. The edge compared the word as written, so all six answered 404 where the route draws a page. The accented
   words are written with their escapes below, so this file stays ASCII and a composed letter cannot turn into a letter and an accent. */
const SAO_PAULO = "s\u00e3o-paulo";
const SAO_ATLANTIS = "s\u00e3o-atlantis";
const ENCODED_REMEDY = "Read the country and the place of an address (its first two parts, under a country the site holds) as their route reads them, percent-decoded and lowercased (routeWord in src/lib/routing/place_words.ts), in both splitters: parts() in src/lib/routing/edge_not_found.ts and placeNotHeldIn in src/lib/routing/place_words.ts; decode no other part, and a malformed escape stays as written";
const nonAscii = (s: string) => /[^\x00-\x7f]/.test(s);
const accentedWords = Object.entries(PLACE_SLUGS_BY_COUNTRY).flatMap(([cc, words]) => words.filter(nonAscii).map((w) => [cc, w] as const));
const accentedSource = Object.keys(popularPlaceOverrides.overrides).filter(nonAscii);
const accentedLost = accentedSource.filter((k) => !accentedWords.some(([cc, w]) => `${cc}/${w}` === k));
tableCheck(`the premise of the accent rows: the table holds every accented key of popular_place_overrides.json (${accentedSource.length}: ${accentedSource.join(", ")}), br/${SAO_PAULO} among them${accentedLost.length ? `; not in the table: ${accentedLost.join(", ")}` : ""}`, accentedSource.includes(`br/${SAO_PAULO}`) && accentedLost.length === 0, PLACE_SLUGS_FILE, LINKED_REMEDY);
/* The form the middleware judges after its canonical hop, and the form the route receives. */
const hexForm = (cc: string, w: string) => `/${cc}/${encodeURIComponent(w).toLowerCase()}/restaurants`;
const accentedRejected = accentedWords
  .filter(([cc, w]) => nf(hexForm(cc, w)) || placeNotHeldIn(hexForm(cc, w)) || nf(`/${cc}/${w}/restaurants`) || placeNotHeldIn(`/${cc}/${w}/restaurants`))
  .map(([cc, w]) => `${cc}/${w}`);
check(`the edge holds every accented place the table holds, written decoded or as the middleware sees it (${accentedWords.length})${accentedRejected.length ? `: ${accentedRejected.join(", ")}` : ""}`, accentedWords.length > 0 && accentedRejected.length === 0, FILE, ENCODED_REMEDY);
/* A request that makes the middleware throw is a red of its own, not a stack that hides the rows after it. */
const quiet = (f: () => boolean) => { try { return f(); } catch { return false; } };
const accentedNotPassed = accentedWords.filter(([cc, w]) => !quiet(() => passed(hexForm(cc, w)))).map(([cc, w]) => `${cc}/${w}`);
check(`the middleware passes the trade page of every accented place the table holds to its route, in the form its canonical hop writes (${accentedWords.length})${accentedNotPassed.length ? `: ${accentedNotPassed.join(", ")}` : ""}`, accentedWords.length > 0 && accentedNotPassed.length === 0, MW, ENCODED_REMEDY);
/* The reader itself, case by case: [as written, as its route reads it, why]. */
const WORD_CASES: Array<[string, string, string]> = [
  ["s%c3%a3o-paulo", SAO_PAULO, "an escape decodes"],
  ["S%C3%83O-PAULO", SAO_PAULO, "decoded first, then lowercased, so a decoded capital is lowercased too"],
  ["Restaurants", "restaurants", "a plain word is lowercased"],
  ["%e0%a4%a", "%e0%a4%a", "a malformed escape stays as written"],
  ["%E0%A4%A", "%e0%a4%a", "a malformed escape stays as written, lowercased"],
  ["x%2ey", "x.y", "an encoded dot decodes to a dot, which is why the dot test reads the last part as written"],
];
const wordOf = (s: string): string => { try { return routeWord(s); } catch (e) { return `throws ${(e as Error).message}`; } };
const wordWrong = WORD_CASES.filter(([from, want]) => wordOf(from) !== want).map(([from, want, why]) => `${from} (${why}): wanted ${JSON.stringify(want)}, got ${JSON.stringify(wordOf(from))}`);
check(`routeWord reads a part as its route does: an escape decodes, a decoded capital is lowercased, a malformed escape stays as written (${WORD_CASES.length} cases)${wordWrong.length ? `: ${wordWrong.join("; ")}` : ""}`, wordWrong.length === 0, WORDS_FILE, ENCODED_REMEDY);
/* The three spellings of one address, each followed through the one canonical hop to where a reader ends. */
const SPELLINGS: Array<[string, (w: string) => string]> = [
  ["decoded", (w) => w],
  ["upper-case hex", (w) => encodeURIComponent(w)],
  ["lower-case hex", (w) => encodeURIComponent(w).toLowerCase()],
];
const landing = (path: string): { hops: number; at: string } => {
  try {
    const r = send(path);
    const to = r.status === 308 ? r.headers.get("location") : null;
    return to ? { hops: 1, at: new URL(to).pathname } : { hops: 0, at: path };
  } catch {
    return { hops: -1, at: path };
  }
};
for (const [what, spell] of SPELLINGS) {
  for (const tail of ["/restaurants", "/restaurants/opening"]) {
    const asked = `/br/${spell(SAO_PAULO)}${tail}`;
    const l = landing(asked);
    check(`a held accented place, written ${what}, reaches its route after at most the one canonical hop: ${asked} (${l.hops} hop, on ${l.at})`, l.hops >= 0 && l.hops <= 1 && quiet(() => passed(l.at)), MW, ENCODED_REMEDY);
  }
  const invented = `/br/${spell(SAO_ATLANTIS)}/restaurants`;
  const end = landing(invented);
  check(`an accented place no table holds still answers 404 after the hop, written ${what}: ${invented} (${end.hops} hop, on ${end.at})`, end.hops >= 0 && end.hops <= 1 && quiet(() => pinned(end.at)), MW, ENCODED_REMEDY);
}
/* All six accented places, in all three spellings (the re-review of 2026-10-09, which narrowed the decode to the place): each ends on its
   route after at most the one canonical hop, so no spelling of a held place is lost when the other parts stay as written. */
const spellingLost: string[] = [];
for (const [cc, w] of accentedWords) {
  for (const [what, spell] of SPELLINGS) {
    const l = landing(`/${cc}/${spell(w)}/restaurants`);
    if (!(l.hops >= 0 && l.hops <= 1 && quiet(() => passed(l.at)))) spellingLost.push(`${cc}/${w} written ${what}`);
  }
}
check(`every accented place the table holds reaches its trade page after at most the one canonical hop, written decoded, in upper-case hex and in lower-case hex (${accentedWords.length} places, ${accentedWords.length * SPELLINGS.length} spellings)${spellingLost.length ? `: ${spellingLost.join(", ")}` : ""}`, accentedWords.length > 0 && spellingLost.length === 0, MW, ENCODED_REMEDY);
/* The decode's two edges. A malformed escape (`%e0%a4%a`, a cut-off byte sequence) throws in decodeURIComponent, so the part is kept as
   written: no table holds it, it names nothing, and the middleware answers 404 instead of throwing. An encoded dot is no file's
   ending: the dot test reads the last part as written, so `x%2ey` is a word that names nothing, never a file the edge waves through. */
for (const p of ["/gb/london/%e0%a4%a", "/gb/%e0%a4%a/restaurants", "/gb/london/x%2ey", "/gb/london/res%2ftaurants"]) {
  check(`an encoded or malformed part names nothing and answers 404, never a throw: ${p}`, quiet(() => pinned(p)), MW, ENCODED_REMEDY);
}

/* EVERY OTHER PART IS AS WRITTEN (the re-review of 2026-10-09). The decode reaches the place above and the country below, and no other
   part. The retired-activity redirect, the retired-trade hop (retiredPlaceTarget) and the rename hop read their segment as written,
   so a word they own, spelled with an escape, is a word they do not move. When parts() decoded every part, `/gb/london/b%61nking`
   read as the retired `banking`, a word a redirect owns: the edge passed it, no redirect moved it, and the route drew a default page
   at 200 (each of these answered 404 before that decode). Written with an escape, a trade, an activity or a city names nothing: the
   edge says so, and the middleware as a whole pins the 404 onto the address asked. One row for each shape that reads a word: a trade
   under a place (retired, renamed and live; three and four parts), an activity and its across page, a city and its hub, a /decide
   pair. The three-part rows outside a country (across, hub, /decide) are the ones that hold the decode to the first two parts of a
   held country's address. */
const ESCAPED_REMEDY = "Decode the country and the place of an address alone in parts() of src/lib/routing/edge_not_found.ts and compare every other part as written, lowercased: the retired-activity, retired-trade and rename redirects read their segment as written, so a word they own spelled with an escape (b%61nking, crop%2dfarming, media%2dpublishing) names nothing and answers 404, as do res%74aurants and lond%6fn";
const ESCAPED: Array<[string, string]> = [
  ["/gb/london/b%61nking", "a retired trade under a UK city"],
  ["/gb/london/crop%2dfarming", "a legacy slug the retired table owns too, under a UK city"],
  ["/gb/london/media%2dpublishing", "a renamed trade under a UK city"],
  ["/us/california/b%61nking", "a retired trade under a state"],
  ["/gb/london/res%74aurants", "a live trade under a UK city"],
  ["/gb/london/res%74aurants/opening", "a live trade's opening page"],
  ["/industries/b%61nking", "a retired activity"],
  ["/industries/b%61nking/across", "a retired activity, across"],
  ["/cities/lond%6fn", "a listed city"],
  ["/cities/lond%6fn/neighborhoods", "a listed city's hub"],
  ["/decide/res%74aurants/london", "a /decide pair's activity"],
];
for (const [p, what] of ESCAPED) {
  check(`${what}, spelled with an escape, names nothing and answers 404 at the edge and through the middleware: ${p}`, quiet(() => nf(p) && pinned(p)), FILE, ESCAPED_REMEDY);
}

/* AN ESCAPE-SPELLED COUNTRY IS THE ROUTE'S COUNTRY (the re-review of 2026-10-09, concern 1). The decode above reaches the place, and the
   country stayed as written: `/g%62/atlantis/restaurants` read as no country the site holds, was left alone, and the route, which is
   handed `gb`, drew an invented place at 200 (it answered 404 while every part was decoded). The country of a three- or four-part
   address is decoded too, where it decodes to one the site holds, so an invented place under it is as invented as under `gb`, and a
   held place goes on to its route as under `gb`. A word the redirects own, itself spelled with an escape, still names nothing. */
const COUNTRY_REMEDY = "Decode the country of a three- or four-part address too in parts() of src/lib/routing/edge_not_found.ts, where it decodes to a country the site holds (routeWord in src/lib/routing/place_words.ts): the route is handed /g%62/atlantis/restaurants as /gb/atlantis/restaurants, so an invented place under it answers 404 and a held place goes on to its route; decode no other part than the country and the place";
const ESCAPED_COUNTRY: Array<[string, boolean, string]> = [
  ["/g%62/atlantis/restaurants", true, "an invented place under a trade"],
  ["/g%62/atlantis/restaurants/opening", true, "an invented place under a trade's opening page"],
  ["/g%62/atlantis/restaurants/buy-or-start", true, "an invented place under a trade's buy-or-start page"],
  ["/g%62/atlantis/west-end/restaurants", true, "an invented place under a district's trade page"],
  ["/g%62/london/b%61nking", true, "a retired trade spelled with an escape"],
  ["/g%62/london/restaurants", false, "a held place under a trade"],
  ["/g%62/london/restaurants/opening", false, "a held place under a trade's opening page"],
];
for (const [p, answers404, what] of ESCAPED_COUNTRY) {
  check(`${what}, under an escape-spelled country, ${answers404 ? "answers 404 at the edge and through the middleware" : "goes on to its route, as under the unescaped country"}: ${p}`, quiet(() => nf(p) === answers404 && (answers404 ? pinned(p) : passed(p))), FILE, COUNTRY_REMEDY);
}
/* The same decode reaches the old district address (legacyHoodTarget reads the address through parts()): under an escape-spelled
   country it takes the one hop it takes under the country. */
check("an old district address under an escape-spelled country takes the hop it takes under the country: /g%62/london/west-end goes where /gb/london/west-end goes", quiet(() => legacyHoodTarget("/g%62/london/west-end") !== null && legacyHoodTarget("/g%62/london/west-end") === legacyHoodTarget("/gb/london/west-end")), FILE, COUNTRY_REMEDY);

/* THE MATCHER (2026-10-06). It skipped every address ending like an image, an icon or a font, and favicon.ico, robots.txt and
   sitemap.xml by name, so a made-up one never reached the rule above: /favicon.ico, /apple-touch-icon.png and /zz/x.png drew the
   country route's soft 404 and /gb/london/x.png a synthesized London page, indexable, all at 200 (production, 2026-10-06).
   Compiled here by Next's own compiler, so "reaches the middleware" is what the build decides. */
const { getMiddlewareMatchers } = nextStaticInfo as unknown as {
  getMiddlewareMatchers: (matcher: unknown, nextConfig: object) => Array<{ regexp: string }>;
};
const matchers = getMiddlewareMatchers(config.matcher, {});
const reaches = (path: string) => matchers.some((m) => new RegExp(m.regexp).test(path));
for (const p of ["/zz/x.png", "/gb/london/x.png", "/favicon.ico", "/apple-touch-icon.png", "/sitemap.xml", "/robots.txt/x", "/zz/x.woff2"]) {
  check(`a made-up file the matcher used to skip reaches the middleware and answers 404: ${p}`, reaches(p) && pinned(p), MW);
}
/* A real file the matcher used to skip passes untouched, first, as when the middleware never ran on it: no redirect, no count
   against the rate limit, no request headers, no refusal to a crawler. */
const untouched = (path: string, ua = BROWSER, host = "www.marginatlas.com") => {
  const r = middleware(new NextRequest(`https://${host}${path}`, { headers: { "user-agent": ua, host } }));
  return r.status === 200 && r.headers.get("x-middleware-next") === "1" && !r.headers.get("x-middleware-override-headers") && !r.headers.get("x-ratelimit-limit");
};
const onceSkipped = [...onDisk.filter((p) => /\.(?:png|jpg|jpeg|svg|webp|gif|ico|woff2|woff)$/.test(p)), "/robots.txt", "/manifest.webmanifest"];
const touched = onceSkipped.filter((p) => !(reaches(p) && untouched(p)));
check(`every real image, robots.txt and the manifest reaches the middleware and passes untouched (${onceSkipped.length})${touched.length ? `: ${touched.slice(0, 5).join(", ")}` : ""}`, onceSkipped.length > 2 && touched.length === 0, MW, "pass a real file untouched, first (ONCE_SKIPPED and SERVED_FILES in src/middleware.ts): no redirect, no count against the rate limit, no refusal to a crawler; the manifest is skipped by name, like robots.txt");
check("a training crawler still reads robots.txt, which was never refused it", untouched("/robots.txt", "GPTBot/1.1"), MW);
check("a training crawler still fetches a photograph, as before", untouched("/spine/_skyline.jpeg", "GPTBot/1.1"), MW);
check("a photograph on the bare domain is served there, not redirected, as before", untouched("/spine/_skyline.jpeg", BROWSER, "marginatlas.com"), MW);
check("Next's own files never reach the middleware: /_next/static, /_next/image", !reaches("/_next/static/chunks/main.js") && !reaches("/_next/image"), MW);
check("a page still reaches it: /gb/london", reaches("/gb/london"), MW);

/* THE PREFIXES THE RATE LIMIT SKIPS (2026-10-06). Its block holds every 404 below it, so its skip of /api/, /_next and /static
   skipped those too: /api/x.y, /api/x.php, /_next/x.y and /static/x.y fell to the country route and drew its soft 404 at 200
   on production. A file the site does not serve answers 404 there too; an API route answers as it did. */
for (const p of ["/api/x.y", "/api/x.php", "/_next/x.y", "/static/x.y"]) {
  check(`a made-up file under a prefix the rate limit skips answers 404: ${p}`, pinned(p), MW);
}
for (const p of ["/api/cell-lookup", "/api/export-csv", "/api/stripe/webhook"]) {
  check(`an API route passes as it did: ${p}`, passed(p), MW);
}
/* The premise there: no API route takes a dotted part, every one a static folder with no dot in its name. */
const apiFolders = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).flatMap((e) => [`${dir}/${e.name}`, ...apiFolders(`${dir}/${e.name}`)]);
const apiDotted = apiFolders("src/app/api").filter((d) => /\[|\./.test(d.slice("src/app/api".length)));
check(`every API route is a static folder with no dot in its name${apiDotted.length ? `: ${apiDotted.join(", ")}` : ""}`, apiDotted.length === 0, MW);

/* THE ROUTE FOLDERS (the plan 2026-10-11, route-folder fall-through, Task 3). A first part some route folder holds, with an address that fits
   none of the shapes the folder serves, is an address no route holds, and Next sends it to the country tree's wildcard ([country]/[geo]),
   which answered 200 with an indexable head, the loading skeleton and a 404 drawn in the browser: /pricing/xyz, /about/xyz, /new-businesses/x
   and /blog/no-such-post, probed on production on 2026-10-11, and the same under every route folder. The edge judges such an address by the
   shapes each folder serves and by the closed lists four leaves resolve (src/lib/routing/route_shapes.ts, generated), and pins the answer
   through the middleware like every other address for nothing. Every real address is asked below, through the edge and through the
   middleware: each post, article and pair, each country's scorecard, each shape of the table with its dynamic parts filled with a value the
   site holds (HELD_FILL), each API route. BLIND SPOT: these ask the table's own shapes and lists, so an address a route serves that neither
   the generator's walk of src/app nor a list can see would pass here and answer 404 at the edge. The walk reads every page and route file and
   every metadata route, and tests/seo/sitemap_families.test.ts asks every address the sitemap declares. */
const FOLDER_REMEDY = "Judge an address of a route folder by the shapes the folder serves and the lists its leaves resolve (ROUTE_SHAPES, BLOG_SLUGS, LEARN_SLUGS and CITY_PAIRS in src/lib/routing/route_shapes.ts, read by edgeNotFound in src/lib/routing/edge_not_found.ts), and pin the answer through the middleware (notFoundAtEdge): an address no route holds falls to the country tree's wildcard, which answers 200 with an indexable head";
const FOLDER_PASS_REMEDY = "Let a real address of a route folder through: run npx tsx scripts/gen_route_shapes.ts in the same commit as the route, post, article or pair, and never edit the table; an address the table misses is a page answered 404 at the edge";
let folderAsked = 0;
const FOLDER_MISSES: ReadonlyArray<readonly [string, string]> = [
  ["/pricing/xyz", "a folder that holds a page and no child"],
  ["/about/xyz", "a folder that holds a page and no child"],
  ["/new-businesses/x", "a folder that holds a page and no child"],
  ["/blog/no-such-post", "a post no file of content/blog holds"],
  ["/blog/median-vs-average/x", "a child of a post, which has none"],
  ["/learn/no-such-article", "an article the knowledge base does not hold"],
  ["/coverage/zz", "a scorecard for a country the site does not hold"],
  ["/compare/cities", "no page holds the bare folder, only the pairs under it"],
  ["/compare/cities/x-vs-y", "a pair the comparisons file does not hold"],
  ["/decide/x", "no page at /decide/<activity>, only the pairs and the guide's own address"],
  ["/industries/restaurants/x", "a live trade's folder holds its across page only"],
  ["/cities/london/x", "a listed city's folder holds its neighbourhoods only"],
  ["/og/x", "an image route no folder holds"],
  ["/icon/x", "a metadata route holds its own address only"],
  ["/admin", "a folder with children and no page of its own"],
  ["/embed", "a folder with one three-part page and none of its own"],
  ["/api", "a folder of handlers, none at its bare address"],
  ["/blog/constructor", "a built-in's name is no post"],
  ["/learn/__proto__", "a built-in's name is no article"],
  ["/coverage/constructor", "a built-in's name is no country"],
  ["/compare/cities/constructor", "a built-in's name is no pair"],
];
for (const [p, why] of FOLDER_MISSES) check(`${why}: ${p} answers 404 at the edge and through the middleware`, quiet(() => nf(p) === true && pinned(p)), FILE, FOLDER_REMEDY);
/* The prefixes the rate limit skips ask the place rule and the edge rule too, in a block of their own at the end of the middleware: /api/ and
   /static. /_next keeps the file rule alone: the dev server's own address (/_next/webpack-hmr) has no dot. /statistics only LOOKS like
   /static (its prefix is "statis") and meets the ordinary rules; it is asked here as the control that the prefix test is not too wide. */
const PREFIX_MISSES: ReadonlyArray<readonly [string, string]> = [
  ["/api/nope", "an API address no handler holds, under a prefix the rate limit skips"],
  ["/api/stripe/nope", "an address under an API folder that holds no such handler"],
  ["/static", "a first part no folder holds, under a prefix the rate limit skips"],
  ["/static/x", "an address under that first part"],
  ["/statistics", "a first part that only looks like a skipped prefix, met by the ordinary rules"],
];
for (const [p, why] of PREFIX_MISSES) check(`${why}: ${p} answers 404 through the middleware`, quiet(() => pinned(p)), MW, FOLDER_REMEDY);

/* Every real address of the route folders passes, asked of the edge and of the middleware. */
const folderPasses = (label: string, addresses: string[], remedy = FOLDER_PASS_REMEDY) => {
  /* The edge is asked the pathname alone, as the middleware reads it (req.nextUrl.pathname); the middleware is asked the whole address. */
  const missed = addresses.filter((a) => !quiet(() => !nf(a.split("?")[0]) && passed(a)));
  folderAsked += addresses.length;
  check(`every ${label} passes the edge and the middleware (${addresses.length})${missed.length ? `: ${missed.slice(0, 5).join(", ")}` : ""}`, addresses.length > 0 && missed.length === 0, FILE, remedy);
};
folderPasses("post of content/blog", [...BLOG_SLUGS].map((s) => `/blog/${s}`));
folderPasses("article of the knowledge base", [...LEARN_SLUGS].map((s) => `/learn/${s}`));
folderPasses("city pair the comparisons file holds", [...CITY_PAIRS].map((s) => `/compare/cities/${s}`));
folderPasses("country the site holds, as its scorecard", COUNTRIES.map((c) => `/coverage/${c.code.toLowerCase()}`));
/* THE TABLE'S OWN SHAPES, each asked as a real address: a dynamic part filled with a value the site holds, keyed by the shape; a shape with no
   value here reds, so a route folder added tomorrow is asked before it ships (as tests/routing/metadata_routes.test.ts asks each metadata route). */
const HELD_FILL: Readonly<Record<string, readonly string[]>> = {
  "blog/*": [[...BLOG_SLUGS][0]],
  "learn/*": [[...LEARN_SLUGS][0]],
  "coverage/*": ["gb"],
  "compare/cities/*": [[...CITY_PAIRS][0]],
  "decide/*/*": ["restaurants", "london"],
  "industries/*": ["restaurants"],
  "industries/*/across": ["restaurants"],
  "cities/*": ["london"],
  "cities/*/neighborhoods": ["london"],
  "cities/*/neighborhoods/*": ["london", "west-end"],
  "embed/*/*/*": ["gb", "london", "restaurants"],
  "pro/*": ["gb"],
  "pro/cities/*": ["london"],
  "pro/*/*/*": ["gb", "london", "restaurants"],
};
/** A shape's address with each "*" filled, the `miss`th one (from 0) with a word nobody holds instead; null when HELD_FILL has no value for it. */
const fillShape = (shape: readonly string[], miss = -1): string | null => {
  const stars = shape.filter((p) => p === "*").length;
  const values = stars === 0 ? [] : own(HELD_FILL, shape.join("/")) ?? [];
  if (values.length !== stars) return null;
  const parts: string[] = [];
  let star = 0;
  for (const p of shape) {
    if (p !== "*") { parts.push(p); continue; }
    parts.push(star === miss ? "zz-not-a-word" : values[star]);
    star++;
  }
  return `/${parts.join("/")}`;
};
const unfilled = ROUTE_SHAPES.filter((s) => fillShape(s) === null).map((s) => s.join("/"));
check(`every shape of ROUTE_SHAPES has a held value to be asked with${unfilled.length ? `: none for ${unfilled.join(", ")}` : ""}`, unfilled.length === 0, FILE, "add a value the site holds for that shape to HELD_FILL in tests/routing/edge_not_found.test.ts, keyed by the shape, one value for each of its dynamic parts, so a new route is asked as a real address");
/* AN ADMIN PAGE'S REAL ADDRESS CARRIES ITS KEY (the plan 2026-10-11, dynamic 404 remains): the middleware pins /admin/<page> asked without `?key=`
   to 404 (src/middleware.ts, 3b''), so the walk asks each admin shape with one, as its reader does; the page itself still checks the key. */
const withItsKey = (a: string): string => (a.startsWith("/admin/") ? `${a}?key=x` : a);
folderPasses("shape of ROUTE_SHAPES, its dynamic parts filled with a value the site holds and an admin page asked with its key", ROUTE_SHAPES.map((s) => fillShape(s)).filter((a): a is string => a !== null).map(withItsKey));
/* A DYNAMIC SHAPE IS JUDGED AT THE EDGE, PART BY PART, OR NAMED OPEN. The four open ones are routes that are not indexed whatever they draw
   (noindex and nofollow in their own metadata) and that 404 by their own resolvers, so their misses are no index hazard and the edge leaves
   them to the route. The check reads each page for both claims; a dynamic shape that is neither judged nor open reds. */
const ROUTE_OPEN: Readonly<Record<string, string>> = {
  "embed/*/*/*": "src/app/embed/[country]/[geo]/[industry]/page.tsx",
  "pro/*": "src/app/pro/[country]/page.tsx",
  "pro/cities/*": "src/app/pro/cities/[slug]/page.tsx",
  "pro/*/*/*": "src/app/pro/[country]/[geo]/[industry]/page.tsx",
};
const dynamicShapes = ROUTE_SHAPES.filter((s) => s.includes("*"));
const unjudged: string[] = [];
for (const s of dynamicShapes) {
  if (own(ROUTE_OPEN, s.join("/")) !== undefined) continue;
  for (let star = 0; star < s.filter((p) => p === "*").length; star++) {
    const asked = fillShape(s, star);
    if (asked === null || !quiet(() => nf(asked))) unjudged.push(`${s.join("/")} at its dynamic part ${star + 1}`);
  }
}
const OPEN_REMEDY = "Judge the shape's dynamic part in edgeNotFound (src/lib/routing/edge_not_found.ts) by the resolver its route runs, or, for a route that is noindex and nofollow in its own metadata and 404s by its own resolver, name it in ROUTE_OPEN in tests/routing/edge_not_found.test.ts with its page";
check(`every dynamic shape of ROUTE_SHAPES is judged at the edge, part by part, or named open (${dynamicShapes.length} shapes, ${Object.keys(ROUTE_OPEN).length} open)${unjudged.length ? `: not judged: ${unjudged.join(", ")}` : ""}`, dynamicShapes.length > 0 && unjudged.length === 0, FILE, OPEN_REMEDY);
const openStale = Object.keys(ROUTE_OPEN).filter((k) => !dynamicShapes.some((s) => s.join("/") === k));
const codeOf = (f: string) => stripCommentLines(readFileSync(f, "utf8").split("\n")).join("\n");
const openNotSealed = Object.entries(ROUTE_OPEN).filter(([, file]) => { const src = codeOf(file); return !/robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/.test(src) || !/\bnotFound\(\)/.test(src); }).map(([k]) => k);
check(`the open shapes are dynamic shapes the table holds, and each page says noindex and nofollow and calls notFound() itself${openStale.length ? `; not in the table: ${openStale.join(", ")}` : ""}${openNotSealed.length ? `; not noindex, nofollow and self-404ing: ${openNotSealed.join(", ")}` : ""}`, openStale.length === 0 && openNotSealed.length === 0, FILE, OPEN_REMEDY);
/* The platform's own addresses and the dev server's are no route folder's: the file rule exempts /_vercel/ and the prefix block never asks
   /_next, and neither first part is a route folder (TOP_LEVEL_SEGMENTS). */
folderPasses(
  "address of the platform or the dev server (/_next/webpack-hmr, /_vercel/insights/view, /_vercel/speed-insights/vitals)",
  ["/_next/webpack-hmr", "/_vercel/insights/view", "/_vercel/speed-insights/vitals"],
  "leave an address the platform or the dev server owns untouched: the file rule exempts /_vercel/, the middleware asks /_next the file rule alone, and the route-folder rule judges only a first part a route folder holds (TOP_LEVEL_SEGMENTS)",
);

/* A WORD THAT NAMES A BUILT-IN NAMES NOTHING (2026-10-06): every lookup the edge asks reads a plain object, which answers
   "constructor" with the Object function and "__proto__" with Object.prototype unless it is asked for its own entries
   (src/lib/own.ts). Every Object.prototype member, as written and lowercased (the canonical form a request reaches). Five edge
   shapes are asked with them below: a three-part address under a city, an activity, a hub, a district, and the old district
   address (in the district slot of every city that holds districts, and in the city slot). */
const PROTO_KEYS = [...new Set(Object.getOwnPropertyNames(Object.prototype).flatMap((k) => [k, k.toLowerCase()]))];
const quietly = <T>(f: () => T): T | "throws" => { try { return f(); } catch { return "throws"; } };
const protoWrong = (f: (k: string) => unknown, want: unknown) =>
  PROTO_KEYS.filter((k) => quietly(() => f(k)) !== want).map((k) => `${k} (${String(quietly(() => f(k))).slice(0, 40)})`);
const PROTO_REMEDY = "read a table keyed by a word from the address with own() (src/lib/own.ts), never table[word]";
const protoCheck = (label: string, wrong: string[], file: string) => {
  if (wrong.length === 0) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, detail: `${label}: ${wrong.slice(0, 6).join(", ")}`, remedy: PROTO_REMEDY });
};
protoCheck(`slugToIndustry names no trade for any of ${PROTO_KEYS.length} Object.prototype names`, protoWrong(slugToIndustry, null), "src/lib/taxonomy.ts");
protoCheck("resolveIndustryIdExact names no id for any Object.prototype name", protoWrong(resolveIndustryIdExact, null), "src/lib/taxonomy.ts");
protoCheck("resolveDisplayIndustry names no trade for any Object.prototype name", protoWrong(resolveDisplayIndustry, null), "src/lib/cells/industry_resolution.ts");
protoCheck("industryQueryCandidates queries nothing for any Object.prototype name", protoWrong((k) => industryQueryCandidates(k).length, 0), "src/lib/cells/industry_resolution.ts");
protoCheck("redirectFor redirects no Object.prototype name", protoWrong(redirectFor, null), "src/lib/taxonomy/retired.ts");
protoCheck("a three-part London address for an Object.prototype name is the edge's 404", protoWrong((k) => nf(`/gb/london/${k.toLowerCase()}`), true), FILE);
protoCheck("a three-part address with an Object.prototype name as its place is the edge's 404 (P1-A)", protoWrong((k) => nf(`/gb/${k.toLowerCase()}/restaurants`), true), FILE);
protoCheck("an activity address for an Object.prototype name is the edge's 404", protoWrong((k) => nf(`/industries/${k.toLowerCase()}`), true), FILE);
protoCheck("a hub address for an Object.prototype name is the edge's 404", protoWrong((k) => nf(`/cities/${k.toLowerCase()}/neighborhoods`), true), FILE);
protoCheck("a district address under an Object.prototype name is the edge's 404", protoWrong((k) => nf(`/cities/${k.toLowerCase()}/neighborhoods/central`), true), FILE);
/* THE OLD DISTRICT ADDRESS, with the built-in name where the tables are read (2026-10-08). `/gb/{k}/central` puts it in the CITY
   slot, and there cityPathFor (a Set of the listed cities) answers first, so the district tables are never read with it: it
   passed on the code from before own() as it does now. The shape that reaches `own(NEIGHBORHOOD_SLUGS, city)` and the
   `.includes(word)` on its list is a REAL city that holds districts with the name in the DISTRICT slot. It answers nothing,
   where a lookup written `word in list` or `list[word]` would send the reader to the city's hub (`"constructor" in []` is true).
   Both stay: the second proves a built-in name is no listed city; no request reaches `own(NEIGHBORHOOD_SLUGS, city)` with one,
   so that read is defence in depth, held by the text gate (tests/trust/own_lookups.test.ts). */
const hubCities = Object.entries(CITY_SLUGS_BY_COUNTRY).flatMap(([cc, slugs]) => slugs.filter((s) => Object.hasOwn(NEIGHBORHOOD_SLUGS, s)).map((s) => [cc, s] as const));
check(`the hub cities the check below walks are found (${hubCities.length})`, hubCities.length >= 2 && hubCities.some(([cc, s]) => cc === "gb" && s === "london"));
protoCheck(
  `no built-in name is an old district address in the district slot of any of ${hubCities.length} cities that hold districts`,
  hubCities.flatMap(([cc, city]) => protoWrong((k) => legacyHoodTarget(`/${cc}/${city}/${k.toLowerCase()}`), null).map((w) => `${cc}/${city}/${w}`)),
  FILE,
);
protoCheck("no old district address is a built-in name in the city slot (cityPathFor answers first: no listed city is named so)", protoWrong((k) => legacyHoodTarget(`/gb/${k.toLowerCase()}/central`), null), FILE);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log(`routing/edge_not_found: all pass (${folderAsked} real addresses of the route folders asked of the edge and the middleware)`);
