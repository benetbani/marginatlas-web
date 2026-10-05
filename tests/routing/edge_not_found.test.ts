/**
 * An address that names nothing answers 404 at the edge (masterplan step 01, 2026-10-05; QUEUE launch:retired-trades-live).
 * `/gb/london/<any word>` rendered a synthesized "Small business" page at 200, canonical to itself and indexable, and
 * `/industries/<word>` and `/cities/<word>` called notFound() inside a streamed page, so the 200 was on the wire first.
 * The edge now judges the four shapes it can judge from small tables, each by the resolver its own route runs.
 *
 * Run: npx tsx tests/routing/edge_not_found.test.ts
 */
import { readdirSync, readFileSync } from "node:fs";
import { edgeNotFound, legacyHoodTarget, GEO_STATIC_CHILDREN } from "../../src/lib/routing/edge_not_found";
import { HOOD_DISTRICT_SLUGS, NEIGHBORHOOD_SLUGS } from "../../src/lib/routing/hood_slugs";
import { renderHoodSlugs, HOOD_SLUGS_FILE } from "../../scripts/gen_hood_slugs";
import { RETIRED } from "../../src/lib/taxonomy/retired";
import { TAXONOMY_REDIRECTS } from "../../src/lib/taxonomy/legacy_redirects";
import { INDUSTRY_SLUG_ALIASES, SLUG_TO_INDUSTRY, liveIndustryFor } from "../../src/lib/taxonomy";
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

/* The tables cannot drift. */
check(`${HOOD_SLUGS_FILE} equals a fresh generation (npx tsx scripts/gen_hood_slugs.ts)`, readFileSync(HOOD_SLUGS_FILE, "utf8") === renderHoodSlugs(), HOOD_SLUGS_FILE);
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

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("routing/edge_not_found: all pass");
