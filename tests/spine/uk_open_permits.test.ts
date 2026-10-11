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
import { readdirSync, readFileSync } from "node:fs"; import * as CITY from "../../src/lib/cities/city_tier"; import { PLACE_SLUGS_BY_COUNTRY } from "../../src/lib/routing/place_slugs_generated"; import { stripCommentLines } from "../../scripts/lib/strip_comments";

const RULE = "uk-open-permits";
const FILE = "src/lib/spine/open_rows.ts";
const REMEDY = "keep the keyed figure at the place's factor with its estimate line, and no shard licence list on a GB page, none on a UK page whose place holds no city index of its own country, and every page-place read of the city list through cityOfCountry";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

check("a UK trade page prints no shard licence list", buildPermits("restaurants", "GB") === null && buildPermits("barbershops", "gb") === null);
check("off the UK the list stands as before", buildPermits("restaurants", "DE") !== null);

const ny = startupCapitalArchetypeKeyed("barbershops");
check("the barbershop's keyed figure is New York's 60,000", ny === 60_000);
const london = buildOpen({ meta: { iso2: "GB", industry: "barbershops", industry_id: "barbershops", geo: "london", city: "London" } });
check("London barbershops: 60,000 at London's factor of 0.75 is 45,000", london !== null && london.state === "baseline" && london.value === 45_000 && london.figure === "$45K");
check("London barbershops: the basis calls it an estimate at London prices", london !== null && london.basis === "An estimate at London prices.");
const nowhere = buildOpen({ meta: { industry: "barbershops", industry_id: "barbershops" } });
check("no city: the keyed figure and its own basis, as before", nowhere !== null && nowhere.value === 60_000 && nowhere.basis !== "An estimate at London prices.");
const unkeyed = buildOpen({ meta: { iso2: "GB", industry: "shoe-repair", industry_id: "shoe_repair", geo: "london", city: "London" } });
check("an unkeyed trade never prints the 80,000 default", unkeyed === null || unkeyed.state !== "baseline");

const rivals = buildRivals({
  meta: { iso2: "GB", trade: "Barbershops", geo: "london", city: "London" },
  rivals: { list: ["restaurants", "cafes-coffee-shops", "nail-salons", "dry-cleaning-laundry", "bakeries-retail"].map((slug) => ({ name: slug, slug, href: `/gb/london/${slug}` })) },
});
const restRow = rivals?.rows.find((r) => r.key === "restaurants");
check("the other trades' figures take London's factor too", restRow !== undefined && restRow.value === Math.round(startupCapitalArchetypeKeyed("restaurants")! * 0.75));
check("the other trades say estimates at London prices once: on the basis, or leading the withheld count when one stands", rivals !== null && (rivals.withheldLine ? rivals.withheldLine.startsWith("Estimates at London prices.") && rivals.basis === "" : rivals.basis === "Estimates at London prices."));

/* NO PAGE READS A CITY OF ANOTHER COUNTRY (plan 2026-10-11): each place word reads its own country's row or none, and every read in src/ of the list for a page's place passes cityOfCountry. */
const cityOfCountry = (CITY as { cityOfCountry?: (iso2: string, slug: string) => string | null }).cityOfCountry;
check("city_tier.ts exports cityOfCountry", typeof cityOfCountry === "function");
check("/gb/boston reads no Massachusetts prices, /us/boston keeps Boston's 94", placeCostFactor({ iso2: "GB", geo: "boston" }) === null && placeCostFactor({ iso2: "US", geo: "boston" }) === 0.94);
const foreign: string[] = []; let words = 0, wrong = 0;
for (const [cc, list] of Object.entries(PLACE_SLUGS_BY_COUNTRY)) for (const w of list) {
  words++; const id = CITY.getCityIdentity(w), mine = id && id.iso2.toUpperCase() === cc.toUpperCase() ? w.toLowerCase() : null;
  if (id && !mine) foreign.push(`/${cc}/${w}`); if (cityOfCountry?.(cc, w) !== mine || (!mine && placeCostFactor({ iso2: cc.toUpperCase(), geo: w }) !== null)) wrong++;
}
check(`${words} place words read their own country's city or none (${foreign.length} name another's: ${foreign.join(" ")})`, wrong === 0);
const NOT_A_PAGE_PLACE: Record<string, string> = { "src/lib/cities/city_tier.ts": "the accessors", "src/lib/markets/across_cities.ts": "the curated major cities", "src/lib/spine/adapt_country.ts": "the country's own name", "src/lib/home/beats.ts": "three curated cities" };
const READ = /\b(?:getCityTier|getCityCostOfLivingIndex|getCityPopulation|getCityAveragePayUsd)\(\s*([^)]{0,48})/g;
const walk = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${d}/${e.name}`) : /\.tsx?$/.test(e.name) ? [`${d}/${e.name}`] : []));
const bare = walk("src").filter((f) => !(f in NOT_A_PAGE_PLACE)).flatMap((f) => stripCommentLines(readFileSync(f, "utf8").split(/\r?\n/)).flatMap((l, i) => [...l.matchAll(READ)].filter((m) => !/^(cityOfCountry\(|["'`])/.test(m[1])).map(() => `${f}:${i + 1}`)));
check(`every read of the city list for a page's place passes cityOfCountry (${bare.length} do not: ${bare.join(" ")}; not a page's place: ${Object.entries(NOT_A_PAGE_PLACE).map(([f, why]) => `${f}, ${why}`).join("; ")})`, bare.length === 0);

/* A UK PLACE WITH NO CITY INDEX OF ITS OWN COUNTRY PRINTS NO NEW YORK FIGURE (plan 2026-10-11): a keyed trade earns it back and the other trades omit themselves; Manchester and the world as before. */
const sibs = (geo: string) => ({ list: ["restaurants", "legal-services", "real-estate-agencies", "software-development"].map((slug) => ({ name: slug, slug, href: `/gb/${geo}/${slug}` })) });
for (const [geo, city] of [["liverpool", "Liverpool"], ["sheffield", "Sheffield"], ["birmingham-uk", "Birmingham"], ["gb", "United Kingdom"], ["boston", "Boston"]]) {
  const o = buildOpen({ meta: { iso2: "GB", geo, city, industry: "barbershops", industry_id: "barbershops" } });
  check(`/gb/${geo}/barbershops: no keyed figure, the card earns it back`, !!o && o.recover && o.figure === null && o.prov === undefined && o.foot.map((c) => c.figure).join(", ") === "8 months, 2.8 years");
  check(`/gb/${geo}/barbershops: no other trades card`, buildRivals({ meta: { trade: "Barbershops", iso2: "GB", geo, city }, rivals: sibs(geo) }) === null);
}
const mcr = buildOpen({ meta: { iso2: "GB", geo: "manchester", city: "Manchester", industry: "barbershops", industry_id: "barbershops" } }), cal = buildOpen({ meta: { iso2: "US", geo: "california", city: "California", industry: "barbershops", industry_id: "barbershops" } });
check("Manchester barbershops: $33K, an estimate at Manchester prices", mcr?.figure === "$33K" && mcr.basis === "An estimate at Manchester prices.");
check("outside the UK a place with no city index keeps the keyed figure", cal?.state === "baseline" && cal.value === 60_000);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/uk_open_permits: all pass");
