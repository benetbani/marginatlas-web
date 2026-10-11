/**
 * The cost to open at the city's prices and no licence list in another country's terms on a UK page (plan 06, task A6).
 *
 * Run: npx tsx tests/spine/uk_open_permits.test.ts
 */
import { buildPermits } from "../../src/lib/spine/permits_rows";
import { buildOpen, placeCostFactor } from "../../src/lib/spine/open_rows";
import { buildRivals } from "../../src/lib/spine/rivals_rows";
import { startupCapitalArchetypeKeyed } from "../../src/lib/markets/startup_capital_archetypes";
import { red, redSummary } from "../../scripts/lib/red";
import { readdirSync, readFileSync } from "node:fs";
import { cityOfCountry, getCityIdentity } from "../../src/lib/cities/city_tier";
import { PLACE_SLUGS_BY_COUNTRY } from "../../src/lib/routing/place_slugs_generated";
import { stripCommentLines } from "../../scripts/lib/strip_comments";

const RULE = "uk-open-permits";
/* EVERY RED NAMES ITS OWN FILE AND ITS OWN REMEDY (the final review of 2026-10-11, A-M1): the file whose behaviour a check reads, and what to do in it. */
const PERMITS = "src/lib/spine/permits_rows.ts";
const OPEN = "src/lib/spine/open_rows.ts";
const RIVALS = "src/lib/spine/rivals_rows.ts";
const ARCHETYPES = "src/lib/markets/startup_capital_archetypes.ts";
const CITY_TIER = "src/lib/cities/city_tier.ts";
/* The whole rule as one sentence, for the summary line; each red above it carries its own remedy. */
const REMEDY = "keep the keyed figure at the place's factor with its estimate line, print no shard licence list on a GB page, print neither a keyed figure nor other trades on a UK page whose place holds no city index of its own country, and read the city list for a page's place only through cityOfCountry";
const R_NO_LIST = "return null from buildPermits for a GB page, in either case, so no shard licence list in another country's terms prints on a UK page";
const R_LIST_ELSEWHERE = "keep buildPermits answering its list for a country outside the UK";
const R_KEYED = "restore the barbershops row of STARTUP_CAPITAL_ARCHETYPE_USD to New York's 60,000, or move every figure of this test that is worked from it";
const R_FACTOR = "take the keyed figure at the place's factor in buildOpen, rounded once to three figures: London's 0.75 turns 60,000 into 45,000";
const R_BASIS = "give a figure taken at a place's prices the basis COPY.tradeOpen.basisPlace with the city's name: An estimate at London prices.";
const R_NO_CITY = "keep the keyed figure and its own basis in buildOpen where the page names no city";
const R_UNKEYED = "answer no baseline figure from buildOpen for a trade the archetype table does not key, never the 80,000 default";
const R_RIVALS_FACTOR = "take the place's factor in every other trade's keyed figure in buildRivals, as buildOpen does";
const R_RIVALS_BASIS = "say Estimates at the city's prices once in buildRivals: on the basis, or leading the withheld line when one stands";
const R_EXPORT = "export cityOfCountry(iso2, geoSlug) from src/lib/cities/city_tier.ts";
const R_GUARD = "read the city list in placeCostFactor through cityOfCountry, so a city of another country gives a page no factor";
const R_OWN_CITY = "make cityOfCountry answer a city's slug only where that city's row holds the page's country, and placeCostFactor read no index for any other place word";
const R_WRAP = "wrap the read: getCityTier(cityOfCountry(country, geo))";
const R_EARN = "return the earn-it-back state from buildOpen on a UK page whose place holds no city index of its own country: no keyed figure, no provenance, the foot's two figures";
const R_NO_RIVALS = "return null from buildRivals on a UK page whose place holds no city index of its own country, so the card and its free doors omit themselves";
const R_MANCHESTER = "keep Manchester's own factor in buildOpen: the keyed figure at its prices, $33K, with the basis An estimate at Manchester prices.";
const R_ELSEWHERE = "keep the keyed figure in buildOpen for a place outside the UK that holds no city index: only a UK page omits it";
let failed = 0;
const check = (label: string, ok: boolean, remedy: string, file: string, line?: number) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, line, detail: label, remedy });
};

check("a UK trade page prints no shard licence list", buildPermits("restaurants", "GB") === null && buildPermits("barbershops", "gb") === null, R_NO_LIST, PERMITS);
check("off the UK the list stands as before", buildPermits("restaurants", "DE") !== null, R_LIST_ELSEWHERE, PERMITS);

const ny = startupCapitalArchetypeKeyed("barbershops");
check("the barbershop's keyed figure is New York's 60,000", ny === 60_000, R_KEYED, ARCHETYPES);
const london = buildOpen({ meta: { iso2: "GB", industry: "barbershops", industry_id: "barbershops", geo: "london", city: "London" } });
check("London barbershops: 60,000 at London's factor of 0.75 is 45,000", london !== null && london.state === "baseline" && london.value === 45_000 && london.figure === "$45K", R_FACTOR, OPEN);
check("London barbershops: the basis calls it an estimate at London prices", london !== null && london.basis === "An estimate at London prices.", R_BASIS, OPEN);
const nowhere = buildOpen({ meta: { industry: "barbershops", industry_id: "barbershops" } });
check("no city: the keyed figure and its own basis, as before", nowhere !== null && nowhere.value === 60_000 && nowhere.basis !== "An estimate at London prices.", R_NO_CITY, OPEN);
const unkeyed = buildOpen({ meta: { iso2: "GB", industry: "shoe-repair", industry_id: "shoe_repair", geo: "london", city: "London" } });
check("an unkeyed trade never prints the 80,000 default", unkeyed === null || unkeyed.state !== "baseline", R_UNKEYED, OPEN);

const rivals = buildRivals({
  meta: { iso2: "GB", trade: "Barbershops", geo: "london", city: "London" },
  rivals: { list: ["restaurants", "cafes-coffee-shops", "nail-salons", "dry-cleaning-laundry", "bakeries-retail"].map((slug) => ({ name: slug, slug, href: `/gb/london/${slug}` })) },
});
const restRow = rivals?.rows.find((r) => r.key === "restaurants");
check("the other trades' figures take London's factor too", restRow !== undefined && restRow.value === Math.round(startupCapitalArchetypeKeyed("restaurants")! * 0.75), R_RIVALS_FACTOR, RIVALS);
check("the other trades say estimates at London prices once: on the basis, or leading the withheld count when one stands", rivals !== null && (rivals.withheldLine ? rivals.withheldLine.startsWith("Estimates at London prices.") && rivals.basis === "" : rivals.basis === "Estimates at London prices."), R_RIVALS_BASIS, RIVALS);

/* NO PAGE READS A CITY OF ANOTHER COUNTRY (plan 2026-10-11): each place word reads its own country's row or none, and every read in src/ of the list for a page's place passes cityOfCountry. */
check("city_tier.ts exports cityOfCountry", typeof cityOfCountry === "function", R_EXPORT, CITY_TIER);
check("/gb/boston reads no Massachusetts prices, /us/boston keeps Boston's 94", placeCostFactor({ iso2: "GB", geo: "boston" }) === null && placeCostFactor({ iso2: "US", geo: "boston" }) === 0.94, R_GUARD, OPEN);
const foreign: string[] = []; let words = 0, wrong = 0;
for (const [cc, list] of Object.entries(PLACE_SLUGS_BY_COUNTRY)) for (const w of list) {
  words++; const id = getCityIdentity(w), mine = id && id.iso2.toUpperCase() === cc.toUpperCase() ? w.toLowerCase() : null;
  if (id && !mine) foreign.push(`/${cc}/${w}`); if (cityOfCountry(cc, w) !== mine || (!mine && placeCostFactor({ iso2: cc.toUpperCase(), geo: w }) !== null)) wrong++;
}
check(`${words} place words read their own country's city or none (${foreign.length} name another's: ${foreign.join(" ")})`, wrong === 0, R_OWN_CITY, CITY_TIER);
const NOT_A_PAGE_PLACE: Record<string, string> = { "src/lib/cities/city_tier.ts": "the accessors", "src/lib/markets/across_cities.ts": "the curated major cities", "src/lib/spine/adapt_country.ts": "the country's own name", "src/lib/home/beats.ts": "three curated cities" };
const READ = /\b(?:getCityTier|getCityCostOfLivingIndex|getCityPopulation|getCityAveragePayUsd)\(\s*([^)]{0,48})/g;
const walk = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${d}/${e.name}`) : /\.tsx?$/.test(e.name) ? [`${d}/${e.name}`] : []));
const bare = walk("src").filter((f) => !(f in NOT_A_PAGE_PLACE)).flatMap((f) => stripCommentLines(readFileSync(f, "utf8").split(/\r?\n/)).flatMap((l, i) => [...l.matchAll(READ)].filter((m) => !/^(cityOfCountry\(|["'`])/.test(m[1])).map(() => ({ file: f, line: i + 1 }))));
/* The red names the first read that skips the guard, at its own file and line; the label lists every one. */
check(`every read of the city list for a page's place passes cityOfCountry (${bare.length} do not: ${bare.map((b) => `${b.file}:${b.line}`).join(" ")}; not a page's place: ${Object.entries(NOT_A_PAGE_PLACE).map(([f, why]) => `${f}, ${why}`).join("; ")})`, bare.length === 0, R_WRAP, bare[0]?.file ?? "src", bare[0]?.line);

/* A UK PLACE WITH NO CITY INDEX OF ITS OWN COUNTRY PRINTS NO NEW YORK FIGURE (plan 2026-10-11): a keyed trade earns it back and the other trades omit themselves; Manchester and the world as before. */
const sibs = (geo: string) => ({ list: ["restaurants", "legal-services", "real-estate-agencies", "software-development"].map((slug) => ({ name: slug, slug, href: `/gb/${geo}/${slug}` })) });
for (const [geo, city] of [["liverpool", "Liverpool"], ["sheffield", "Sheffield"], ["birmingham-uk", "Birmingham"], ["gb", "United Kingdom"], ["boston", "Boston"]]) {
  const o = buildOpen({ meta: { iso2: "GB", geo, city, industry: "barbershops", industry_id: "barbershops" } });
  check(`/gb/${geo}/barbershops: no keyed figure, the card earns it back`, !!o && o.recover && o.figure === null && o.prov === undefined && o.foot.map((c) => c.figure).join(", ") === "8 months, 2.8 years", R_EARN, OPEN);
  check(`/gb/${geo}/barbershops: no other trades card`, buildRivals({ meta: { trade: "Barbershops", iso2: "GB", geo, city }, rivals: sibs(geo) }) === null, R_NO_RIVALS, RIVALS);
}
const mcr = buildOpen({ meta: { iso2: "GB", geo: "manchester", city: "Manchester", industry: "barbershops", industry_id: "barbershops" } }), cal = buildOpen({ meta: { iso2: "US", geo: "california", city: "California", industry: "barbershops", industry_id: "barbershops" } });
check("Manchester barbershops: $33K, an estimate at Manchester prices", mcr?.figure === "$33K" && mcr.basis === "An estimate at Manchester prices.", R_MANCHESTER, OPEN);
check("outside the UK a place with no city index keeps the keyed figure", cal?.state === "baseline" && cal.value === 60_000, R_ELSEWHERE, OPEN);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/uk_open_permits: all pass");
