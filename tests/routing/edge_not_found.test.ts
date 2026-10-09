/**
 * An address that names nothing answers 404 at the edge (masterplan step 01, 2026-10-05; QUEUE launch:retired-trades-live).
 * `/gb/london/<any word>` rendered a synthesized "Small business" page at 200, canonical to itself and indexable, and
 * `/industries/<word>` and `/cities/<word>` called notFound() inside a streamed page, so the 200 was on the wire first.
 * The edge now judges the four shapes it can judge from small tables, each by the resolver its own route runs.
 * And since 2026-10-06 a fifth: an address whose last part has a dot names a file, and answers 404 unless the site serves that
 * file (src/lib/routing/served_files.ts); a dot alone used to pass any address through, so `/data/uk/2026.10/nothing.csv` drew a
 * page at 200.
 *
 * Run: npx tsx tests/routing/edge_not_found.test.ts
 */
import { readdirSync, readFileSync } from "node:fs";
import { NextRequest } from "next/server";
import { edgeNotFound, legacyHoodTarget, GEO_STATIC_CHILDREN } from "../../src/lib/routing/edge_not_found";
import { HOOD_DISTRICT_SLUGS, NEIGHBORHOOD_SLUGS } from "../../src/lib/routing/hood_slugs";
import { renderHoodSlugs, HOOD_SLUGS_FILE } from "../../scripts/gen_hood_slugs";
import { renderServedFiles, SERVED_FILES_FILE } from "../../scripts/gen_served_files";
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
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";
import cityListJson from "../../data/cities/city_list_v1.json";
import floorCensus from "../../data/seo/floor_census.json";
import { renderPlaceSlugs, readDbWords, PLACE_SLUGS_FILE, PLACE_DB_FILE, PLACE_TABLE_BUDGET_BYTES } from "../../scripts/gen_place_slugs";
import { PLACE_SLUGS_BY_COUNTRY, US_DESCRIPTION_SLUGS } from "../../src/lib/routing/place_slugs_generated";
import { isHeldPlace } from "../../src/lib/routing/place_words";

const RULE = "edge-not-found";
const FILE = "src/lib/routing/edge_not_found.ts";
const REMEDY = "answer 404 at the edge only for an address its own route would render as nothing, by that route's own resolver";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, detail: label, remedy: REMEDY });
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
check("a place's static child: /gb/london/industries", nf("/gb/london/industries") === false);
check("a neighbourhood and trade, the shape published until 2026-08-08: /gb/london/west-end/restaurants (another route's)", nf("/gb/london/west-end/restaurants") === false);
check("a trade's opening page is left to its route: /gb/london/restaurants/opening", nf("/gb/london/restaurants/opening") === false);
check("a word under another country is judged the same: /de/berlin/zz-not-a-trade", nf("/de/berlin/zz-not-a-trade") === true);
check("a United States word is the database's: /us/mississippi/business-support-services (a census description the US shard declares)", nf("/us/mississippi/business-support-services") === false);
check("a United States word is never judged here: /us/california/zz-not-a-trade (the edge cannot see the database's words)", nf("/us/california/zz-not-a-trade") === false);
check("a file is not a place: /geo/countries-110m.json", nf("/geo/countries-110m.json") === false);
check("a static first segment is not a country: /blog/zz-post", nf("/blog/zz-post") === false);
check("an unknown first segment with three parts is left alone: /zz/london/zz", nf("/zz/london/zz") === false);
check("the home page", nf("/") === false);

/* What the middleware's own place rule pins stays its own: one- and two-part paths are never judged here. */
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
const geoChildren = readdirSync("src/app/[country]/[geo]", { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith("[")).map((d) => d.name).sort();
check(`GEO_STATIC_CHILDREN is the static folders of src/app/[country]/[geo] (${geoChildren.join(", ")})`, JSON.stringify([...GEO_STATIC_CHILDREN].sort()) === JSON.stringify(geoChildren));

/* THE PLACE TABLE (P1-A of the page architecture, 2026-10-09). Every place word a table of the site holds, and the ids and the
   United States' census descriptions the database holds, generated by hand (scripts/gen_place_slugs.ts --database writes the scan
   to data/seo/place_db_words.json; the table is written again from it offline). Held here to a fresh generation, to the edge's
   budget, and to the places and words the census's pages name. */
const TABLE_REMEDY = "Rerun scripts/gen_place_slugs.ts with the database; never edit the table";
const tableCheck = (label: string, ok: boolean, file = PLACE_SLUGS_FILE) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, detail: label, remedy: TABLE_REMEDY });
};
let placesFresh: string | null = null;
try { placesFresh = renderPlaceSlugs(); } catch (e) { tableCheck(`the table can be written from ${PLACE_DB_FILE}: ${(e as Error).message}`, false, PLACE_DB_FILE); }
if (placesFresh !== null) {
  tableCheck(`${PLACE_SLUGS_FILE} equals a fresh generation from ${PLACE_DB_FILE} (node node_modules/tsx/dist/cli.mjs scripts/gen_place_slugs.ts)`, readFileSync(PLACE_SLUGS_FILE, "utf8").replace(/\r\n/g, "\n") === placesFresh);
}
const tableBytes = readFileSync(PLACE_SLUGS_FILE, "utf8").length;
tableCheck(`the table fits the edge's budget, which the middleware carries on every request (${tableBytes} of ${PLACE_TABLE_BUDGET_BYTES} bytes)`, tableBytes <= PLACE_TABLE_BUDGET_BYTES);
const scan = readDbWords();
tableCheck(`the database's scan is in it (${scan.regional_rows} regional rows and ${scan.us_rows} United States rows, scanned ${scan.scanned_at})`, scan.regional_rows > 0 && scan.us_rows > 0 && Object.keys(scan.places).length > 0 && scan.us_descriptions.length > 0, PLACE_DB_FILE);
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
check("the 404 for an address for nothing is pinned by a rewrite onto itself", /isPlaceWeDoNotHold\(path\)\s*\|\|\s*edgeNotFound\(path\)\)\s*\{\s*return NextResponse\.rewrite\(req\.nextUrl, \{\s*status: 404/.test(mw), MW);

/* And the middleware itself, driven with requests: a pinned address comes back 404 with a rewrite onto itself (on Vercel the
   site's not-found page, as /zz and /gb/atlantis answer); a passed one comes back as next(). Each request from an address of
   its own, so the rate limit never trips here. */
const SITE = "https://www.marginatlas.com";
const BROWSER = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
let client = 0;
const send = (path: string, ua = BROWSER) =>
  middleware(new NextRequest(`${SITE}${path}`, { headers: { "user-agent": ua, "accept-language": "en-GB", "x-real-ip": `10.0.${client >> 8}.${client++ & 255}` } }));
const pinned = (path: string) => { const r = send(path); return r.status === 404 && r.headers.get("x-middleware-rewrite") === `${SITE}${path}`; };
const passed = (path: string) => { const r = send(path); return r.status === 200 && r.headers.get("x-middleware-next") === "1" && !r.headers.get("x-middleware-rewrite"); };
for (const p of ["/gb/london/restaurants/x.y", "/data/uk/2026.10/nothing.csv", "/zz/x.txt", "/gb/london/x.y", "/x.y", "/sitemap/99.xml"]) {
  check(`the middleware answers 404 for a made-up file: ${p}`, pinned(p), MW);
}
for (const p of ["/data/uk/2026.10/ledger.json", "/data/uk/2026.10/readme.md", "/geo/countries-110m.json", "/sitemap/0.xml", "/_vercel/speed-insights/script.js"]) {
  check(`the middleware passes a file the site serves: ${p}`, passed(p), MW);
}
check("a training crawler is still refused a file of the data pack, as before (451)", send("/data/uk/2026.10/ledger.json", "GPTBot/1.1").status === 451, MW);
check("a place the site does not hold still answers 404: /gb/atlantis", pinned("/gb/atlantis"), MW);

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
const onceSkipped = [...onDisk.filter((p) => /\.(?:png|jpg|jpeg|svg|webp|gif|ico|woff2|woff)$/.test(p)), "/robots.txt"];
const touched = onceSkipped.filter((p) => !(reaches(p) && untouched(p)));
check(`every real image and robots.txt reaches the middleware and passes untouched (${onceSkipped.length})${touched.length ? `: ${touched.slice(0, 5).join(", ")}` : ""}`, onceSkipped.length > 1 && touched.length === 0, MW);
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
console.log("routing/edge_not_found: all pass");
