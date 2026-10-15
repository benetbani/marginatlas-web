/**
 * No licence list in another country's terms on a UK page, every page's place read through cityOfCountry, and no typed cost to open
 * on any page. Plan 06 task A6, plan 2026-10-11, and release 2 job A (2026-10-15): the open card earns it back on every trade with its
 * two shard figures stamped, and the other trades' card prints each trade's years to pay back off its own shard, the same everywhere. Until that day this test held the typed capital at the city's cost-of-living factor (London's 0.75
 * turning 60,000 into 45,000); that figure left the pages.
 *
 * Run: npx tsx tests/spine/uk_open_permits.test.ts
 */
import { buildPermits } from "../../src/lib/spine/permits_rows";
import { buildOpen } from "../../src/lib/spine/open_rows";
import { buildRivals } from "../../src/lib/spine/rivals_rows";
import { red, redSummary } from "../../scripts/lib/red";
import { readdirSync, readFileSync } from "node:fs";
import { cityOfCountry, getCityIdentity, getCityCostOfLivingIndex } from "../../src/lib/cities/city_tier";
import { PLACE_SLUGS_BY_COUNTRY } from "../../src/lib/routing/place_slugs_generated";
import cityListJson from "../../data/cities/city_list_v1.json";
import { stripCommentLines } from "../../scripts/lib/strip_comments";

const RULE = "uk-open-permits";
/* EVERY RED NAMES ITS OWN FILE AND ITS OWN REMEDY (the final review of 2026-10-11, A-M1): the file whose behaviour a check reads, and what to do in it. */
const PERMITS = "src/lib/spine/permits_rows.ts";
const OPEN = "src/lib/spine/open_rows.ts";
const RIVALS = "src/lib/spine/rivals_rows.ts";
const CITY_TIER = "src/lib/cities/city_tier.ts";
const CITY_LIST = "data/cities/city_list_v1.json";
/* The whole rule as one sentence, for the summary line; each red above it carries its own remedy. */
const REMEDY = "print no typed cost to open (the open card earns it back, the other trades print their years to pay back off their shards, stamped), print no shard licence list on a GB page, and read the city list for a page's place only through cityOfCountry";
const R_NO_LIST = "return null from buildPermits for a GB page, in either case, so no shard licence list in another country's terms prints on a UK page";
const R_LIST_ELSEWHERE = "keep buildPermits answering its list for a country outside the UK";
const R_EARN = "return the earn-it-back state from buildOpen where no bill is held, on every page: no total, no provenance on a total, the foot's two figures stamped with the shard's keys";
const R_RIVALS = "print each other trade's first_year.payback_years off its own shard in buildRivals, stamped data/facts/industry/<id>.json:first_year.payback_years, the same on every page, with no line about a city's prices";
const R_EXPORT = "export cityOfCountry(iso2, geoSlug) from src/lib/cities/city_tier.ts";
const R_OWN_CITY = "make cityOfCountry answer a city's slug only where that city's row holds the page's country, so no page reads another country's index for its place word";
const R_LIST_ROWS = "give each row of data/cities/city_list_v1.json a name and an iso2 beside its slug, so IDENTITY_BY_SLUG in src/lib/cities/city_tier.ts indexes it and cityOfCountry finds it on its own country's page";
const R_WRAP = "wrap the read: getCityTier(cityOfCountry(country, geo))";
let failed = 0;
const check = (label: string, ok: boolean, remedy: string, file: string, line?: number) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, line, detail: label, remedy });
};

check("a UK trade page prints no shard licence list", buildPermits("restaurants", "GB") === null && buildPermits("barbershops", "gb") === null, R_NO_LIST, PERMITS);
check("off the UK the list stands as before", buildPermits("restaurants", "DE") !== null, R_LIST_ELSEWHERE, PERMITS);

/* NO TYPED COST TO OPEN, ON ANY PAGE (2026-10-15): London, a UK place with no city index, Manchester, a US state and no place at all all earn it back. */
const stamped = (o: ReturnType<typeof buildOpen>) => !!o && o.foot.length === 2 && o.foot.every((c) => /^data\/facts\/industry\/barbershops\.json:first_year\.(ramp_to_breakeven_months|payback_years)$/.test(c.prov?.src ?? "") && c.prov?.kind === "estimate");
for (const [iso2, geo, city] of [["GB", "london", "London"], ["GB", "liverpool", "Liverpool"], ["GB", "manchester", "Manchester"], ["US", "california", "California"], [undefined, undefined, undefined]] as const) {
  const o = buildOpen({ meta: { iso2, geo, city, industry: "barbershops", industry_id: "barbershops" } });
  check(`barbershops ${geo ?? "with no place"}: no total, the card earns it back, both figures stamped`, !!o && o.recover && o.figure === null && o.value === null && o.prov === undefined && o.foot.map((c) => c.figure).join(", ") === "8 months, 2.8 years" && stamped(o), R_EARN, OPEN);
}
const sibs = (cc: string, geo: string) => ({ list: ["restaurants", "legal-services", "real-estate-agencies", "software-development", "no-such-trade"].map((slug) => ({ name: slug, slug, href: `/${cc}/${geo}/${slug}` })) });
for (const [iso2, geo, city] of [["GB", "london", "London"], ["GB", "liverpool", "Liverpool"], ["US", "california", "California"]] as const) {
  const r = buildRivals({ meta: { trade: "Barbershops", iso2, geo, city }, rivals: sibs(iso2.toLowerCase(), geo) });
  const rest = r?.rows.find((x) => x.key === "restaurants");
  check(`${geo}: the other trades print their years to pay back off their own shards, stamped, one trade with no shard counted`, !!r && r.state === "list" && r.rows.length === 4 && r.withheld === 1 && rest?.value === 2.5 && rest.prov?.src === "data/facts/industry/restaurants.json:first_year.payback_years" && rest.prov.kind === "estimate" && r.fmt(2.5) === "2.5 years" && !/prices/.test(`${r.basis} ${r.withheldLine ?? ""}`), R_RIVALS, RIVALS);
}

/* NO PAGE READS A CITY OF ANOTHER COUNTRY (plan 2026-10-11): each place word reads its own country's row or none, and every read in src/ of the list for a page's place passes cityOfCountry. */
check("city_tier.ts exports cityOfCountry", typeof cityOfCountry === "function", R_EXPORT, CITY_TIER);
check("/gb/boston reads no Massachusetts prices, /us/boston keeps Boston's 94", getCityCostOfLivingIndex(cityOfCountry("GB", "boston")) === null && getCityCostOfLivingIndex(cityOfCountry("US", "boston")) === 94, R_OWN_CITY, CITY_TIER);
const foreign: string[] = []; let words = 0, wrong = 0;
for (const [cc, list] of Object.entries(PLACE_SLUGS_BY_COUNTRY)) for (const w of list) {
  words++; const id = getCityIdentity(w), mine = id && id.iso2.toUpperCase() === cc.toUpperCase() ? w.toLowerCase() : null;
  if (id && !mine) foreign.push(`/${cc}/${w}`); if (cityOfCountry(cc, w) !== mine || (!mine && getCityCostOfLivingIndex(cityOfCountry(cc.toUpperCase(), w)) !== null)) wrong++;
}
check(`${words} place words read their own country's city or none (${foreign.length} name another's: ${foreign.join(" ")})`, wrong === 0, R_OWN_CITY, CITY_TIER);
/* THE GUARD'S TABLE IS HELD TO THE LIST, NOT TO ITSELF (the final review of 2026-10-11, A-M3): cityOfCountry reads IDENTITY_BY_SLUG, which keeps a row of
   the city list only when it carries both a name and an iso2, and the loop above takes each word's own country from that same map. A row that lost its
   name would lose its factor and tier on its own country's page, and the loop would still pass. So each row of the list itself: does the guard answer its slug for its country? */
const listed = (cityListJson as { cities: Array<{ slug: string; iso2?: string }> }).cities;
const lost = listed.filter((c) => cityOfCountry(c.iso2, c.slug) !== c.slug.toLowerCase()).map((c) => `${c.iso2 ?? "?"}/${c.slug}`);
check(`${listed.length - lost.length} of ${listed.length} rows of the city list resolve their own city through cityOfCountry${lost.length ? ` (not: ${lost.join(" ")})` : ""}`, listed.length > 0 && lost.length === 0, R_LIST_ROWS, CITY_LIST);
const NOT_A_PAGE_PLACE: Record<string, string> = { "src/lib/cities/city_tier.ts": "the accessors", "src/lib/markets/across_cities.ts": "the curated major cities", "src/lib/spine/adapt_country.ts": "the country's own name", "src/lib/home/beats.ts": "three curated cities" };
const READ = /\b(?:getCityTier|getCityCostOfLivingIndex|getCityPopulation|getCityAveragePayUsd)\(\s*([^)]{0,48})/g;
const walk = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${d}/${e.name}`) : /\.tsx?$/.test(e.name) ? [`${d}/${e.name}`] : []));
const bare = walk("src").filter((f) => !(f in NOT_A_PAGE_PLACE)).flatMap((f) => stripCommentLines(readFileSync(f, "utf8").split(/\r?\n/)).flatMap((l, i) => [...l.matchAll(READ)].filter((m) => !/^(cityOfCountry\(|["'`])/.test(m[1])).map(() => ({ file: f, line: i + 1 }))));
/* The red names the first read that skips the guard, at its own file and line; the label lists every one. */
check(`every read of the city list for a page's place passes cityOfCountry (${bare.length} do not: ${bare.map((b) => `${b.file}:${b.line}`).join(" ")}; not a page's place: ${Object.entries(NOT_A_PAGE_PLACE).map(([f, why]) => `${f}, ${why}`).join("; ")})`, bare.length === 0, R_WRAP, bare[0]?.file ?? "src", bare[0]?.line);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/uk_open_permits: all pass");
