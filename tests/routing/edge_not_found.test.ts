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
import { RETIRED } from "../../src/lib/taxonomy/retired";
import { TAXONOMY_REDIRECTS } from "../../src/lib/taxonomy/legacy_redirects";
import { COUNTRIES, INDUSTRY_SLUG_ALIASES, SLUG_TO_INDUSTRY, liveIndustryFor } from "../../src/lib/taxonomy";
import { getRegionsForCountry } from "../../src/lib/regions/regions-by-country";
import { PACK_FILES, packHref } from "../../src/lib/data_pack";
import { getAllPosts } from "../../src/lib/blog";
import { LEARN_ARTICLES } from "../../src/lib/learn/articles";
import robots from "../../src/app/robots";
import { middleware } from "../../src/middleware";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";
import cityListJson from "../../data/cities/city_list_v1.json";
import floorCensus from "../../data/seo/floor_census.json";

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

/* The middleware asks both, after every redirect it owns, and pins the 404 in the same block as the place rule. */
const MW = "src/middleware.ts";
const mw = stripCommentLines(readFileSync(MW, "utf8").split("\n")).join("\n");
const at = (s: string) => mw.indexOf(s);
const retiredAt = at("retiredPlaceTarget(path)");
const renameAt = at("TAXONOMY_REDIRECTS[last]");
const hoodAt = at("legacyHoodTarget(path)");
const placeAt = at("isPlaceWeDoNotHold(path)");
const edgeAt = at("edgeNotFound(path)");
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

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("routing/edge_not_found: all pass");
