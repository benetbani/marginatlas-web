/**
 * The trade page's head and share card (plan 06, task A4): a London trade prints the register's median yearly sales (rounded
 * once through its range, in dollars at the site's pound rate) with its count, a shared code its group's name; a filled
 * revenue (the constant 675,000 on 103 London trades) prints nothing; a row's own revenue off London prints as before.
 *
 * AND THE NAME OF ITS PLACE (truth-fixes, 2026-10-11; QUEUE uk:place-title-fallback). /gb/boston/restaurants was titled "How much do
 * restaurants earn in GB?": a place word the cell lookup holds no row for (the cityOfCountry guard of 80b8dad8 rightly stopped it
 * reading Boston, Massachusetts) is answered by its country's extrapolated row, and in 47 of 195 countries (the United Kingdom, Germany,
 * France, Italy, Japan and 42 more, read on 2026-10-11) that row carries the country's own code in its name column. placeNameOf
 * (src/lib/cells/place_name.ts) is the one name the head, the page's seed (so its crumbs) and the share card print: the cell's own name,
 * except where that name is the page country's own code, then the place word as the site's tables spell it, else the country's name.
 * Two parts. The function itself, over every place word of every held country. And the route's own readers, offline: generateMetadata
 * and buildSpineCellSeed with the database answered by a stub that holds the UK's row (no network and no secret, as the chain
 * requires; tests/routing/place_word_keys.test.ts does the same for the geo readers).
 * BLIND SPOT, stated: the stub's row is the UK's row as the database held it on 2026-10-11 (its name column "GB"), so this cannot tell
 * what the database holds today; it proves what the code does with such a row, and says nothing of a country whose row is named
 * properly (those keep their own name, which a case here holds).
 *
 * Run: npx tsx tests/spine/trade_head.test.ts
 */
import { readFileSync } from "node:fs";
import { tradeHeadFigure } from "../../src/lib/spine/trade_head";
import { COUNTRIES } from "../../src/lib/taxonomy";
import { PLACE_SLUGS_BY_COUNTRY } from "../../src/lib/routing/place_slugs_generated";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "trade-head";
const FILE = "src/lib/spine/trade_head.ts";
const NAME = "src/lib/cells/place_name.ts";
const PAGE = "src/app/[country]/[geo]/[industry]/page.tsx";
const SEED = "src/lib/spine/adapt_cell.ts";
const CARD = "src/app/og/cell/route.tsx";
const REMEDY = "keep the head on the register in London and on a read revenue elsewhere; a filled revenue never reaches a head; a place the lookup holds no row for is named as the site's tables spell it, never by its country's bare code (placeNameOf)";
const R_EXPORT = "export placeNameOf(country, geoSlug, geoName) from src/lib/cells/place_name.ts: the cell's own name, except where that name is the page country's own code, then the place word as the site's tables spell it, else the country's name";
const R_HEAD = "name the place in generateMetadata with placeNameOf(country, geo, cell.geo_name), so the title, the description and the share-card tags print it";
const R_SEED = "name the place in loadCellView with placeNameOf(country, geo, cell.geo_name), so the seed's city, and with it the crumbs and every card, print it";
const R_CARD = "name the place in the share card with placeNameOf(country, geo, cell.geo_name), as the page's head does";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY });
};

/* London restaurants: 281,941.82 pounds (280,659 to 283,227) x 1.3265 = 373,996 dollars (372,294 to 375,701); half-width 1,704,
   so the unit is 1,000 and the head prints 374,000. */
const rest = tradeHeadFigure({ isLondon: true, slug: "restaurants", revenuePerFirm: 433_000, revenueFilled: false });
check("London restaurants: the register's median, 374,000 dollars, never the row's 433,000", rest !== null && rest.kind === "register" && rest.usd === 374_000);
check("London restaurants: 7,865 registered businesses, an exact code", rest !== null && rest.kind === "register" && rest.enterprises === 7865 && rest.group === null);
/* Barbershops read the shared hair and beauty code: 78,625.81 pounds is 104,297 dollars. */
const barb = tradeHeadFigure({ isLondon: true, slug: "barbershops", revenuePerFirm: 148_000, revenueFilled: true });
check("London barbershops: the code's median, its group named", barb !== null && barb.kind === "register" && barb.group === "hair or beauty business" && barb.usd !== null && Math.abs(barb.usd - 104_000) <= 1_000);
check("London pizzerias (an approximate code): no figure, never the row's", tradeHeadFigure({ isLondon: true, slug: "pizzerias", revenuePerFirm: 675_000, revenueFilled: true }) === null);
check("a filled revenue off London: no figure", tradeHeadFigure({ isLondon: false, slug: "cafes-coffee-shops", revenuePerFirm: 675_000, revenueFilled: true }) === null);
const row = tradeHeadFigure({ isLondon: false, slug: "restaurants", revenuePerFirm: 512_000, revenueFilled: false });
check("a read revenue off London: the row's figure as before", row !== null && row.kind === "row" && row.usd === 512_000);
check("no revenue at all: no figure", tradeHeadFigure({ isLondon: false, slug: "restaurants", revenuePerFirm: null, revenueFilled: false }) === null);

/* ---------------- THE NAME OF THE PLACE ---------------- */
type PlaceNameOf = (country: string, geoSlug: string, geoName: string | null | undefined) => string | null;
/** A module, or null when it does not exist or throws on load (the file this fix creates is absent before it). */
const tryImport = async <T,>(load: () => Promise<unknown>): Promise<T | null> => { try { return (await load()) as T; } catch { return null; } };
const countryName = (code: string): string => COUNTRIES.find((c) => c.code === code.toUpperCase())?.name ?? code;

async function main(): Promise<void> {
  const mod = await tryImport<{ placeNameOf?: PlaceNameOf }>(() => import("../../src/lib/cells/place_name"));
  check("src/lib/cells/place_name.ts exports placeNameOf", typeof mod?.placeNameOf === "function", { file: NAME, remedy: R_EXPORT });
  const P: PlaceNameOf = mod?.placeNameOf ?? (() => null);

  /* (1) THE FUNCTION. Each row: the page's country, its place word, the name the lookup stamped on the cell, and the name the page prints. */
  const cases: Array<[string, string, string, string | null | undefined, string | null]> = [
    ["/gb/boston, whose row says GB, is Boston", "GB", "boston", "GB", "Boston"],
    ["the code as three letters is no name either", "GB", "boston", "GBR", "Boston"],
    ["a name whose apostrophe the slug lost", "GB", "king-s-lynn-and-west-norfolk", "GB", "King's Lynn and West Norfolk"],
    ["a name whose comma the slug lost", "GB", "kingston-upon-hull-city-of", "GB", "Kingston upon Hull, City of"],
    ["a name of several words", "GB", "east-lindsey", "GB", "East Lindsey"],
    ["the country's own code names the country", "GB", "gb", "GB", "United Kingdom"],
    ["the country's own name, as a word, names the country", "GB", "united-kingdom", "GB", "United Kingdom"],
    ["an id the tables hold no label for names the country", "GB", "gb-e06000004", "GB", "United Kingdom"],
    ["a word no table holds names the country", "GB", "zzzz-not-a-place", "GB", "United Kingdom"],
    ["another country, the same rule: /de/de", "DE", "de", "DE", "Germany"],
    ["a name the lookup stamped is never replaced: London", "GB", "london", "London", "London"],
    ["a name the lookup stamped is never replaced: Liverpool", "GB", "liverpool", "Liverpool", "Liverpool"],
    ["a name the lookup stamped is never replaced: Manchester", "GB", "manchester", "Manchester", "Manchester"],
    ["a United States state is its own", "US", "california", "California", "California"],
    ["the United States' Boston is its own", "US", "boston", "Boston", "Boston"],
    ["a country's own name from its row is kept: /jm/manchester is Jamaica", "JM", "manchester", "Jamaica", "Jamaica"],
    ["no name stays no name, for the caller's own fallback", "GB", "boston", null, null],
    ["an empty name stays no name", "GB", "boston", "", null],
  ];
  for (const [label, country, word, stored, want] of cases) {
    const got = P(country, word, stored);
    check(`${label}: placeNameOf(${country}, ${word}, ${JSON.stringify(stored)}) is ${JSON.stringify(want)} (got ${JSON.stringify(got)})`, got === want, { file: NAME, remedy: R_EXPORT });
  }
  /* Every place word of every held country, each read as the extrapolated row reads it (the country's own code for a name). */
  let words = 0, byLabel = 0;
  const bare: string[] = [];
  for (const c of COUNTRIES) for (const w of PLACE_SLUGS_BY_COUNTRY[c.code.toLowerCase()] ?? []) {
    words++;
    const n = P(c.code, w, c.code);
    if (!n || n.trim().toUpperCase() === c.code.toUpperCase()) bare.push(`/${c.code.toLowerCase()}/${w}`);
    else if (n !== c.name) byLabel++;
  }
  check(`${words} place words of ${COUNTRIES.length} held countries, each given its country's code for a name: ${words - bare.length} are named (${byLabel} by a label of the site's tables, the rest by their country's name) and ${bare.length} are not${bare.length ? ` (${bare.slice(0, 6).join(" ")})` : ""}`, words > 0 && bare.length === 0, { file: NAME, remedy: R_EXPORT });

  /* (2) THE ROUTE'S OWN READERS, OFFLINE. src/lib/supabase.ts builds its client when first imported and needs a URL, so the environment
     is set and fetch replaced BEFORE the imports below. The one table that answers is extrapolated_cells for the UK's three-letter code and
     the restaurants slug: the rows the database held on 2026-10-11 (their name column "GB"), three of its size bands; every other query
     answers no rows, so a place word the tables have no row for reaches the country's row, as /gb/boston does on the live site. */
  process.env.NEXT_PUBLIC_SUPABASE_URL = "http://offline.invalid";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "offline";
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const ukRow = (size: string, usd: number) => ({ country_iso3: "GBR", country_name: "GB", year: 2024, industry_id: "restaurants", size_band: size, predicted_rev_per_firm: usd, coverage_tier: "X", coverage_source: "wave5_extrapolation", quality_score: 30, sub_industry_id: null, sub_industry_source_kind: null, cost_stack: null, setup_costs: null });
  const UK_ROWS = [ukRow("TOTAL", 153362.61), ukRow("0-9", 67565.84), ukRow("20-49", 1080132.61)];
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = decodeURIComponent(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    const rows = url.includes("/extrapolated_cells") && url.includes("country_iso3=eq.GBR") && /industry_id=in\.\([^)]*restaurants/.test(url) ? UK_ROWS : [];
    return new Response(JSON.stringify(rows), { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  await import("../../scripts/spikes/stub_next_font.cjs");
  const { generateMetadata } = (await import("../../src/app/[country]/[geo]/[industry]/page")) as { generateMetadata: (a: { params: Promise<{ country: string; geo: string; industry: string }> }) => Promise<{ title: string; description: string; openGraph?: { title?: string } }> };
  const { buildSpineCellSeed } = await import("../../src/lib/spine/adapt_cell");
  const { buildCellCrumbs } = await import("../../src/lib/spine/crumb_rows");

  const places: Array<[string, string, string]> = [
    ["gb", "boston", "Boston"],
    ["gb", "gb", "United Kingdom"],
    ["gb", "king-s-lynn-and-west-norfolk", "King's Lynn and West Norfolk"],
    ["gb", "gb-e06000004", "United Kingdom"],
    ["gb", "liverpool", "Liverpool"],
    ["gb", "manchester", "Manchester"],
    ["gb", "london", "London"],
    ["us", "california", "California"],
  ];
  for (const [country, geo, want] of places) {
    const addr = `/${country}/${geo}/restaurants`;
    const m = await generateMetadata({ params: Promise.resolve({ country, geo, industry: "restaurants" }) });
    check(`${addr}: the head titles it "How much do restaurants earn in ${want}?" (got "${m.title}")`, m.title === `How much do restaurants earn in ${want}? | Margin Atlas`, { file: PAGE, remedy: R_HEAD });
    check(`${addr}: the description and the share-card title say ${want}, never the code (got "${m.description}")`, m.description.includes(`in ${want}.`) && m.openGraph?.title === m.title, { file: PAGE, remedy: R_HEAD });
    const seed = await buildSpineCellSeed(country, geo, "restaurants");
    check(`${addr}: the seed's city is ${want} (got ${JSON.stringify(seed?.meta?.city)})`, seed?.meta?.city === want, { file: SEED, remedy: R_SEED });
    const crumbs = seed ? buildCellCrumbs(seed.meta) : [];
    check(`${addr}: no crumb is the bare code (${crumbs.map((c) => c.label).join(" / ")})`, crumbs.length > 0 && crumbs.every((c) => c.label.trim().toUpperCase() !== country.toUpperCase()), { file: SEED, remedy: R_SEED });
  }

  /* (3) THE SHARE CARD cannot be read as text once drawn (an image), so its source is read: the one place it names comes through placeNameOf. */
  const card = stripCommentLines(readFileSync(CARD, "utf8").split(/\r?\n/)).join("\n");
  check("the share card names its place through placeNameOf(country, geo, cell.geo_name), never cell.geo_name || geo", /placeNameOf\(\s*country\s*,\s*geo\s*,\s*cell\.geo_name\s*\)/.test(card) && !/cell\.geo_name\s*\|\|\s*geo\b/.test(card), { file: CARD, remedy: R_CARD });

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("spine/trade_head: all pass");
  process.exit(0);
}
void main();
