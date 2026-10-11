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
 * AND THE FIGURE'S OWN PLACE (truth-fixes round 3A, 2026-10-11; the review's I1, M2 and M5). A country's row carries the country's
 * figure and a synthetic cell carries no figure of any place, so the head and the share card name the place a figure belongs to,
 * never the place the address names. headPlaceOf (src/lib/cells/place_name.ts) answers three things: the place's label, how the title
 * spells it after "in" (the place with its country when the row is the country's, the country with its article when the place is
 * the country) and where the figure belongs (the country, the place itself, or nowhere). Three kinds of check below. The function
 * over hand-made cells. generateMetadata over a stub that holds two country rows (the United Kingdom, Germany), five real rows
 * that are the controls (London, Liverpool, Manchester, Boston in the United States, California) and one United Kingdom statistics
 * row that stands for a code the country list holds no name for. And the share card's own element tree, read through a stub of
 * next/og (ImageResponse keeps the element it is given, which is read for its title and its figure block).
 * BLIND SPOT, stated again for the rows: a stub row is a row as the lookup reads it, so this cannot tell which rows the database
 * holds; the controls are real rows here so that the rule is shown to leave them alone.
 *
 * AND A PLACE WORD NEVER PRINTS A CODE (truth-fixes round 3A; the review's M3, M7 and its note on /gb/england). The whole-country words
 * (the code and its zero-padded statistics entries) name the country in English, a label that holds the code as a word is no name,
 * a code the country list holds no name for leaves the cell's own name, and the popular-name table no longer names England London.
 * The every-word check below states its counts: the words named by a label of the tables, by the country, and those that print the code.
 *
 * AND AN INTERNAL WORD NEVER REACHES A READER (truth-fixes round 3B, 2026-10-11; the first review's "Seen in passing"). /gb/boston, /gb/gb,
 * /gb/england and /de/de restaurants printed "Estimates for a typical restaurant, from wave5_extrapolation.": the source line is authored in
 * the data (the extrapolated rows' coverage_source) and sanitiseProvenance (src/lib/spine/adapt_cell.ts) cut only a key:value token after a
 * pipe. A word holding an underscore, or two or more letters run into digits, is a pipeline's and no reader's: the line that holds one is
 * cut, and where nothing readable is left the sentence drops its "from" clause and names no source, never an invented one. Two kinds of
 * check below: the function over the real source strings, and the seed and the hero's foot over the stub that holds the rows as the
 * database held them.
 * BLIND SPOT, stated: the strings are those of the rows read on 2026-10-11, so a source this has not seen passes if it holds no such word.
 *
 * Run: npx tsx tests/spine/trade_head.test.ts
 */
import Module from "node:module";
import { tradeHeadFigure } from "../../src/lib/spine/trade_head";
import { inSentence } from "../../src/lib/spine/place_names";
import { COUNTRIES, slugToIndustry } from "../../src/lib/taxonomy";
import { PLACE_SLUGS_BY_COUNTRY } from "../../src/lib/routing/place_slugs_generated";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "trade-head";
const FILE = "src/lib/spine/trade_head.ts";
const NAME = "src/lib/cells/place_name.ts";
const PAGE = "src/app/[country]/[geo]/[industry]/page.tsx";
const SEED = "src/lib/spine/adapt_cell.ts";
const CARD = "src/app/og/cell/route.tsx";
const REMEDY = "keep the head on the register in London and on a read revenue elsewhere; a filled revenue never reaches a head; a place the lookup holds no row for is named as the site's tables spell it, never by its country's bare code (placeNameOf); a figure is printed beside the place it belongs to (headPlaceOf)";
const R_EXPORT = "export placeNameOf(country, geoSlug, geoName) from src/lib/cells/place_name.ts: the cell's own name, except where that name is the page country's own code, then the place word as the site's tables spell it, else the country's name";
const R_PLACE = "export headPlaceOf(country, geoSlug, cell) from src/lib/cells/place_name.ts: the place's label, how a title spells it after \"in\" (the place with its country when the row is the country's, the country with its article when the place is the country), and the place the figure belongs to (the country for a country's row, the place for its own row, null for a synthetic cell and for a code the country list holds no name for)";
const R_HEAD = "name the place in generateMetadata through headPlaceOf(country, geo, cell): its titleIn in the title, its figureIn beside the figure, and no figure when its figureIn is null";
const R_SEED = "name the place in loadCellView with placeNameOf(country, geo, cell.geo_name), so the seed's city, and with it the crumbs and every card, print it";
const R_CARD = "name the place in the share card through headPlaceOf(country, geo, cell), as the page's head does: its label in the title, its figureIn beside the figure, and no figure when its figureIn is null";
const R_ARTICLE = "drop Czech from the start-of-name rule in src/lib/spine/place_names.ts: Czechia takes no article, and the Czech Republic still takes it from Republic";
const R_ENGLAND = "name England England in src/lib/geo/popular_place_overrides.json (gb/england), the table geoNameFromSlug and getCellBySlug answer first: a nation is never named by its capital, so a page's label is the place the word names, then the place table is generated again (scripts/gen_place_slugs.ts) and holds no word fewer";
const R_SOURCE = "cut a pipeline's word (one holding an underscore, or two or more letters run into digits) from the source line where the data enters the seed, sanitiseProvenance in src/lib/spine/adapt_cell.ts; where nothing readable is left the sentence drops its \"from\" clause (\"Estimates for a typical restaurant.\"), never an invented source and never an agency";
const CRUMBS = "src/lib/spine/crumb_rows.ts";
const R_CRUMB = "drop a place crumb whose label equals the country crumb's label in src/lib/spine/crumb_rows.ts (placeCrumb takes the country crumb, for the trade page and the district pages alike), so a trail never says one place twice";
const sameLabel = (a: string, b: string): boolean => a.trim().toLowerCase() === b.trim().toLowerCase();
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
type HeadPlace = { label: string; titleIn: string; figureIn: string | null };
type HeadPlaceOf = (country: string, geoSlug: string, cell: { geo_name?: string | null; geo_level?: string | null; is_synthetic?: boolean | null }) => HeadPlace;
/** A module, or null when it does not exist or throws on load (the file this fix creates is absent before it). */
const tryImport = async <T,>(load: () => Promise<unknown>): Promise<T | null> => { try { return (await load()) as T; } catch { return null; } };

async function main(): Promise<void> {
  const mod = await tryImport<{ placeNameOf?: PlaceNameOf; headPlaceOf?: HeadPlaceOf }>(() => import("../../src/lib/cells/place_name"));
  check("src/lib/cells/place_name.ts exports placeNameOf", typeof mod?.placeNameOf === "function", { file: NAME, remedy: R_EXPORT });
  check("src/lib/cells/place_name.ts exports headPlaceOf", typeof mod?.headPlaceOf === "function", { file: NAME, remedy: R_PLACE });
  const P: PlaceNameOf = mod?.placeNameOf ?? (() => null);
  const MISSING = "(headPlaceOf is not exported)";
  const H: HeadPlaceOf = mod?.headPlaceOf ?? (() => ({ label: MISSING, titleIn: MISSING, figureIn: MISSING }));

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
    /* THE WHOLE-COUNTRY WORDS (truth-fixes round 3A, the review's M3): the code and its zero-padded statistics entries are the country, and
       name it in English whatever label a table gives them, so the slug of such a label spells nothing either. */
    ["a whole-country statistics word names the country in English, never its own-language label: /dk/dk0", "DK", "dk0", "DK", "Denmark"],
    ["its zero-padded forms too: /cy/cy00", "CY", "cy00", "CY", "Cyprus"],
    ["the slug of such a label is no spelling: /dk/danmark", "DK", "danmark", "DK", "Denmark"],
    ["and /cy/k-pros", "CY", "k-pros", "CY", "Cyprus"],
    ["a label built from the code is no name: /af/all-of-af", "AF", "all-of-af", "AF", "Afghanistan"],
    ["and /gr/all-of-gr", "GR", "all-of-gr", "GR", "Greece"],
    ["a label that holds the code as a word of its own is refused, whatever table it comes from: /be/prov-limburg-be", "BE", "prov-limburg-be", "BE", "Belgium"],
    ["and /it/centro-it", "IT", "centro-it", "IT", "Italy"],
    /* A CODE THE COUNTRY LIST HOLDS NO NAME FOR (the review's M7): the cell's own name stands, as the module's header says. */
    ["the UK's statistics code: the cell's own name stands, whatever word the page is", "UK", "london-nuts-2021", "UK", "UK"],
    ["and for the code's own regions", "UK", "uki", "UK", "UK"],
    ["Greece's statistics code, likewise", "EL", "el3", "EL", "EL"],
    ["a label the lookup stamped on such a row is the cell's own name and stays", "UK", "uki", "London (NUTS 2021)", "London (NUTS 2021)"],
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
  /* Every place word of every held country, each read as the extrapolated row reads it (the country's own code for a name). A printed name
     is no name when it is the code or holds the code as a word of its own ("All of AF", "Centro (IT)"): the code in capitals, since a
     code is printed so and "it" or "me" inside a name is a word. The counts are stated: words named by a label of the tables, by the
     country's own name, and those that print the code. */
  let words = 0, byLabel = 0, byCountry = 0;
  const bare: string[] = [];
  const holdsCode: string[] = [];
  for (const c of COUNTRIES) for (const w of PLACE_SLUGS_BY_COUNTRY[c.code.toLowerCase()] ?? []) {
    words++;
    const n = P(c.code, w, c.code);
    if (!n || n.trim().toUpperCase() === c.code.toUpperCase()) { bare.push(`/${c.code.toLowerCase()}/${w}`); continue; }
    if (n.split(/[^A-Za-z0-9]+/).includes(c.code.toUpperCase())) holdsCode.push(`/${c.code.toLowerCase()}/${w} ${JSON.stringify(n)}`);
    if (n === c.name) byCountry++; else byLabel++;
  }
  check(`${words} place words of ${COUNTRIES.length} held countries, each given its country's code for a name: ${words - bare.length} are named (${byLabel} by a label of the site's tables, ${byCountry} by their country's name), ${holdsCode.length} print the country's code as a word${holdsCode.length ? ` (${holdsCode.slice(0, 4).join(", ")})` : ""} and ${bare.length} print the bare code${bare.length ? ` (${bare.slice(0, 6).join(" ")})` : ""}`, words > 0 && bare.length === 0 && holdsCode.length === 0, { file: NAME, remedy: R_EXPORT });
  /* /gb/england: the popular-name table named a nation by its capital, and geoNameFromSlug answers that table first for every page. */
  const { geoNameFromSlug } = await import("../../src/lib/cells/geo");
  const england = geoNameFromSlug("GB", "england");
  check(`/gb/england is not named London: the lookup's label for the word is ${JSON.stringify(england)} and the page prints ${JSON.stringify(P("GB", "england", england))}`, england !== "London" && england === "England" && P("GB", "england", england) === "England", { file: "src/lib/geo/popular_place_overrides.json", remedy: R_ENGLAND });

  /* (1b) THE FIGURE'S OWN PLACE, over hand-made cells. Each row: what the case is, the page's country, its place word, the cell as the
     lookup reads it (its name, its level, whether it was synthesised) and what the head and the card print. A country's row carries the
     country's figure, a synthetic cell carries none, and any other row carries the figure of the place it is. */
  type CellFacts = { geo_name?: string | null; geo_level?: string | null; is_synthetic?: boolean | null };
  const hp: Array<[string, string, string, CellFacts, HeadPlace]> = [
    ["a country's row under the held label Boston: the title names the place with its country, the figure is the country's", "GB", "boston", { geo_name: "Boston", geo_level: "country" }, { label: "Boston", titleIn: "Boston, United Kingdom", figureIn: "the United Kingdom" }],
    ["the same row named by its country's bare code, as the extrapolated row reads", "GB", "boston", { geo_name: "GB", geo_level: "country" }, { label: "Boston", titleIn: "Boston, United Kingdom", figureIn: "the United Kingdom" }],
    ["a country's row for the country's own word: the title takes the article", "GB", "gb", { geo_name: "United Kingdom", geo_level: "country" }, { label: "United Kingdom", titleIn: "the United Kingdom", figureIn: "the United Kingdom" }],
    ["an id no table labels reads the country's row as the country", "GB", "gb-e06000004", { geo_name: "GB", geo_level: "country" }, { label: "United Kingdom", titleIn: "the United Kingdom", figureIn: "the United Kingdom" }],
    ["Germany's row for its own word takes no article", "DE", "de", { geo_name: "Germany", geo_level: "country" }, { label: "Germany", titleIn: "Germany", figureIn: "Germany" }],
    ["a held label address that reads Germany's row: the place with its country, the figure Germany's", "DE", "frankfurt-am-main", { geo_name: "Frankfurt am Main", geo_level: "country" }, { label: "Frankfurt am Main", titleIn: "Frankfurt am Main, Germany", figureIn: "Germany" }],
    ["a country that takes the article, by its own word", "NL", "nl", { geo_name: "Netherlands", geo_level: "country" }, { label: "Netherlands", titleIn: "the Netherlands", figureIn: "the Netherlands" }],
    ["Czechia takes no article", "CZ", "cz", { geo_name: "Czechia", geo_level: "country" }, { label: "Czechia", titleIn: "Czechia", figureIn: "Czechia" }],
    ["a row that spells its country otherwise: the country list's name after the article, the row's name kept as the label", "BS", "bs", { geo_name: "Bahamas, The", geo_level: "country" }, { label: "Bahamas, The", titleIn: "the Bahamas", figureIn: "the Bahamas" }],
    ["a named-row country's own page: Jamaica", "JM", "jm", { geo_name: "Jamaica", geo_level: "country" }, { label: "Jamaica", titleIn: "Jamaica", figureIn: "Jamaica" }],
    ["a synthetic cell carries no figure of any place", "GB", "liverpool", { geo_name: "Liverpool", geo_level: "region", is_synthetic: true }, { label: "Liverpool", titleIn: "Liverpool", figureIn: null }],
    ["a synthetic cell for the country itself: the article, no figure", "US", "us", { geo_name: "United States", geo_level: "region", is_synthetic: true }, { label: "United States", titleIn: "the United States", figureIn: null }],
    ["a code the country list holds no name for, on a country's row: no figure under it", "UK", "uki", { geo_name: "London (NUTS 2021)", geo_level: "country" }, { label: "London (NUTS 2021)", titleIn: "London (NUTS 2021)", figureIn: null }],
    ["a row of that code at its own level keeps its own figure", "UK", "uki", { geo_name: "London (NUTS 2021)", geo_level: "nuts1" }, { label: "London (NUTS 2021)", titleIn: "London (NUTS 2021)", figureIn: "London (NUTS 2021)" }],
    ["control, a real row: London is its own", "GB", "london", { geo_name: "London", geo_level: "district" }, { label: "London", titleIn: "London", figureIn: "London" }],
    ["control, a real row: Liverpool is its own", "GB", "liverpool", { geo_name: "Liverpool", geo_level: "district" }, { label: "Liverpool", titleIn: "Liverpool", figureIn: "Liverpool" }],
    ["control, a real row: Manchester is its own", "GB", "manchester", { geo_name: "Manchester", geo_level: "district" }, { label: "Manchester", titleIn: "Manchester", figureIn: "Manchester" }],
    ["control, a real row: a United States state is its own", "US", "california", { geo_name: "California", geo_level: "state" }, { label: "California", titleIn: "California", figureIn: "California" }],
    ["control, a real row: the United States' Boston is its own", "US", "boston", { geo_name: "Boston", geo_level: "county" }, { label: "Boston", titleIn: "Boston", figureIn: "Boston" }],
  ];
  for (const [label, country, word, cell, want] of hp) {
    const got = H(country, word, cell);
    check(`${label}: headPlaceOf(${country}, ${word}, ${JSON.stringify(cell)}) is ${JSON.stringify(want)} (got ${JSON.stringify(got)})`, got.label === want.label && got.titleIn === want.titleIn && got.figureIn === want.figureIn, { file: NAME, remedy: R_PLACE });
  }
  check(`the article rule reads a name's shape: Czechia takes none and the Czech Republic takes it (got ${JSON.stringify(inSentence("Czechia"))} and ${JSON.stringify(inSentence("Czech Republic"))})`, inSentence("Czechia") === "Czechia" && inSentence("Czech Republic") === "the Czech Republic", { file: "src/lib/spine/place_names.ts", remedy: R_ARTICLE });

  /* (2) THE ROUTE'S OWN READERS, OFFLINE. src/lib/supabase.ts builds its client when first imported and needs a URL, so the environment
     is set and fetch replaced BEFORE the imports below. The stub answers for the restaurants slug only:
       - extrapolated_cells for the United Kingdom's and Germany's three-letter codes: the rows the database held on 2026-10-11 (their name
         column the country's own code, GB and DE), three size bands each, so a place word no regional row holds reaches the country's row
         as /gb/boston does on the live site;
       - regional_cells for four real places and one statistics row: London, Liverpool and Manchester under their own ids and Boston in
         Massachusetts under its county's (the controls), and a row of the code UK at the level "country" (a country's row of a code the
         country list holds no name for);
       - cells_master for California, the United States control.
     Every other query answers no rows, so a place with none is synthesised, as the lookup does when it finds nothing. The controls'
     rows are dated at the roll-forward's target year, so no figure of theirs moves with the inflation table. */
  process.env.NEXT_PUBLIC_SUPABASE_URL = "http://offline.invalid";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "offline";
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const { INFLATION_TARGET_YEAR: YEAR } = await import("../../src/lib/stats/inflation");
  const bandRow = (iso3: string, name: string, size: string, usd: number) => ({ country_iso3: iso3, country_name: name, year: 2024, industry_id: "restaurants", size_band: size, predicted_rev_per_firm: usd, coverage_tier: "X", coverage_source: "wave5_extrapolation", quality_score: 30, sub_industry_id: null, sub_industry_source_kind: null, cost_stack: null, setup_costs: null });
  const UK_ROWS = [bandRow("GBR", "GB", "TOTAL", 153362.61), bandRow("GBR", "GB", "0-9", 67565.84), bandRow("GBR", "GB", "20-49", 1080132.61)];
  const DE_ROWS = [bandRow("DEU", "DE", "TOTAL", 241000), bandRow("DEU", "DE", "0-9", 118000), bandRow("DEU", "DE", "20-49", 1450000)];
  const regionalRow = (country: string, geoId: string, level: string, name: string, usd: number) => ({ country, geo_id: geoId, geo_level: level, geo_name: name, industry_id: "restaurants", size_band: null, year: YEAR, n_enterprises: 5000, n_employees: 40000, revenue_per_firm: usd, rev_p10: usd * 0.4, rev_p25: usd * 0.65, rev_p50: usd, rev_p75: usd * 1.45, rev_p90: usd * 2.1, payroll_per_employee: 30000, quality_score: 80, coverage_tier: "S", coverage_source: "National business statistics", currency: "USD", sub_industry_id: null, sub_industry_source_kind: null, cost_stack: null, setup_costs: null });
  const REGIONAL = [
    regionalRow("GB", "GB-E09000001", "district", "London", 433_000),
    regionalRow("GB", "GB-E08000012", "district", "Liverpool", 250_000),
    regionalRow("GB", "GB-E08000003", "district", "Manchester", 260_000),
    regionalRow("US", "US-25-025", "county", "Suffolk County", 550_000),
    regionalRow("UK", "UKI", "country", "UK", 300_000),
  ];
  const CALIFORNIA = { country: "US", geo_id: "US-06", geo_level: "state", naics_6: "722511", naics_4: "7225", industry_description: "Full-Service Restaurants", size_band: null, year: YEAR, n: 9000, total_employment: 270_000, rev_p10: 240_000, rev_p25: 390_000, rev_p50: 600_000, rev_p75: 870_000, rev_p90: 1_260_000, mean_wage_per_employee_usd: 30_000, quality_score: 85, coverage_tier: "A", coverage_source: "Census", currency: "USD" };
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = decodeURIComponent(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    const table = /\/rest\/v1\/([a-z_]+)/.exec(url)?.[1] ?? "";
    const has = (part: string) => url.includes(part);
    const restaurants = /industry_id=in\.\([^)]*restaurants/.test(url);
    let rows: unknown[] = [];
    if (table === "extrapolated_cells" && restaurants) rows = has("country_iso3=eq.GBR") ? UK_ROWS : has("country_iso3=eq.DEU") ? DE_ROWS : [];
    else if (table === "regional_cells" && restaurants) rows = REGIONAL.filter((r) => has(`country=eq.${r.country}&`) && has(`geo_id=eq.${r.geo_id}&`));
    else if (table === "cells_master" && has("country=eq.US") && has("geo_id=eq.US-06") && has("naics_6.like.722")) rows = [CALIFORNIA];
    return new Response(JSON.stringify(rows), { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  await import("../../scripts/spikes/stub_next_font.cjs");
  /* next/og draws an image from the element it is given; the stub keeps that element so the card's title and figure block can be read. */
  const seen: { tree: unknown } = { tree: null };
  const nodeModule = Module as unknown as { _load: (this: unknown, request: string, ...rest: unknown[]) => unknown };
  const loadWas = nodeModule._load;
  nodeModule._load = function (this: unknown, request: string, ...rest: unknown[]) {
    if (request === "next/og") return { ImageResponse: class { constructor(tree: unknown) { seen.tree = tree; } } };
    return loadWas.call(this, request, ...rest);
  };
  /* The card route's JSX has no React import (Next compiles it with the automatic runtime), and tsx's classic transform needs React in scope. */
  const reactNs = (await import("react")) as { default?: unknown };
  (globalThis as { React?: unknown }).React = reactNs.default ?? reactNs;
  type Meta ={ title: string; description: string; openGraph?: { title?: string; description?: string }; twitter?: { title?: string; description?: string } };
  const { generateMetadata } = (await import("../../src/app/[country]/[geo]/[industry]/page")) as { generateMetadata: (a: { params: Promise<{ country: string; geo: string; industry: string }> }) => Promise<Meta> };
  const adaptCell = (await import("../../src/lib/spine/adapt_cell")) as { buildSpineCellSeed: (c: string, g: string, i: string) => Promise<any>; sanitiseProvenance?: (line: string | null | undefined) => string | null };
  const { buildSpineCellSeed } = adaptCell;
  const { tradeHeroFacts } = await import("../../src/lib/spine/trade_hero_facts");
  const { buildCellCrumbs, buildHoodCrumbs } = await import("../../src/lib/spine/crumb_rows");
  const { COPY } = await import("../../src/lib/spine/copy");
  const cardMod = await tryImport<{ GET?: (r: Request) => Promise<unknown> }>(() => import("../../src/app/og/cell/route"));
  check("the share card's route loads with next/og stubbed", typeof cardMod?.GET === "function", { file: CARD, remedy: R_CARD });

  const tradeName = (slug: string): string => slugToIndustry(slug)?.name ?? slug;
  const AMT = String.raw`\$\d+(?:\.\d+)?[KMB]`;
  const THE_UK = "the United Kingdom";
  /* Each address: the title's place after "in", the description (exact, or its shape), a word the description must not hold (the place
     the address names, when the figure is the country's), and the seed's city where the seed is read too. */
  type Route = { country: string; geo: string; industry: string; titleIn: string; desc: RegExp | string; never?: string; seedCity?: string };
  const routes: Route[] = [
    { country: "gb", geo: "boston", industry: "restaurants", titleIn: "Boston, United Kingdom", desc: new RegExp(`^~${AMT} typical revenue for restaurants in ${THE_UK}\\.$`), never: "Boston", seedCity: "Boston" },
    { country: "gb", geo: "gb", industry: "restaurants", titleIn: THE_UK, desc: new RegExp(`^~${AMT} typical revenue for restaurants in ${THE_UK}\\.$`), seedCity: "United Kingdom" },
    { country: "de", geo: "de", industry: "restaurants", titleIn: "Germany", desc: new RegExp(`^~${AMT} typical revenue for restaurants in Germany\\.$`), seedCity: "Germany" },
    { country: "de", geo: "frankfurt-am-main", industry: "restaurants", titleIn: "Frankfurt am Main, Germany", desc: new RegExp(`^~${AMT} typical revenue for restaurants in Germany\\.$`), never: "Frankfurt", seedCity: "Frankfurt am Main" },
    { country: "gb", geo: "king-s-lynn-and-west-norfolk", industry: "restaurants", titleIn: "King's Lynn and West Norfolk, United Kingdom", desc: new RegExp(`^~${AMT} typical revenue for restaurants in ${THE_UK}\\.$`), never: "Lynn", seedCity: "King's Lynn and West Norfolk" },
    { country: "gb", geo: "gb-e06000004", industry: "restaurants", titleIn: THE_UK, desc: new RegExp(`^~${AMT} typical revenue for restaurants in ${THE_UK}\\.$`), seedCity: "United Kingdom" },
    { country: "gb", geo: "england", industry: "restaurants", titleIn: "England, United Kingdom", desc: new RegExp(`^~${AMT} typical revenue for restaurants in ${THE_UK}\\.$`), never: "England", seedCity: "England" },
    /* A synthetic cell: no row held legal services, so the lookup drew one from country and trade averages. It names the label its
       tables give the word (Liverpool) or else the country, and the head says it holds no figure. */
    { country: "gb", geo: "liverpool", industry: "legal-services", titleIn: "Liverpool", desc: new RegExp(`^Revenue and employment numbers for ${tradeName("legal-services").toLowerCase()} in Liverpool\\.$`) },
    { country: "gb", geo: "boston", industry: "legal-services", titleIn: THE_UK, desc: new RegExp(`^Revenue and employment numbers for ${tradeName("legal-services").toLowerCase()} in ${THE_UK}\\.$`) },
    { country: "uk", geo: "uki", industry: "restaurants", titleIn: "London (NUTS 2021)", desc: /^Revenue and employment numbers for restaurants in London \(NUTS 2021\)\.$/ },
    /* The controls, real rows: byte-identical to what the head printed before. */
    { country: "gb", geo: "london", industry: "restaurants", titleIn: "London", desc: "$374K typical yearly sales for restaurants in London, from 7,865 registered businesses.", seedCity: "London" },
    { country: "gb", geo: "liverpool", industry: "restaurants", titleIn: "Liverpool", desc: "~$250K typical revenue for restaurants in Liverpool.", seedCity: "Liverpool" },
    { country: "gb", geo: "manchester", industry: "restaurants", titleIn: "Manchester", desc: "~$260K typical revenue for restaurants in Manchester.", seedCity: "Manchester" },
    { country: "us", geo: "california", industry: "restaurants", titleIn: "California", desc: "~$600K typical revenue for restaurants in California.", seedCity: "California" },
    { country: "us", geo: "boston", industry: "restaurants", titleIn: "Boston", desc: "~$550K typical revenue for restaurants in Boston.", seedCity: "Boston" },
  ];
  for (const r of routes) {
    const addr = `/${r.country}/${r.geo}/${r.industry}`;
    const m = await generateMetadata({ params: Promise.resolve({ country: r.country, geo: r.geo, industry: r.industry }) });
    const title = `How much do ${tradeName(r.industry).toLowerCase()} earn in ${r.titleIn}? | Margin Atlas`;
    check(`${addr}: the title is "${title}" (got "${m.title}")`, m.title === title, { file: PAGE, remedy: R_HEAD });
    const shaped = typeof r.desc === "string" ? m.description === r.desc : r.desc.test(m.description);
    const named = !r.never || !m.description.includes(r.never);
    check(`${addr}: the description puts the figure against the place it belongs to${r.never ? `, never ${r.never}` : ""}, as ${typeof r.desc === "string" ? `"${r.desc}"` : String(r.desc)} (got "${m.description}")`, shaped && named, { file: PAGE, remedy: R_HEAD });
    check(`${addr}: the share-card and twitter tags carry the same title and description`, m.openGraph?.title === m.title && m.openGraph?.description === m.description && m.twitter?.title === m.title && m.twitter?.description === m.description, { file: PAGE, remedy: R_HEAD });
    if (r.seedCity === undefined) continue;
    const seed = await buildSpineCellSeed(r.country, r.geo, r.industry);
    check(`${addr}: the seed's city is ${r.seedCity} (got ${JSON.stringify(seed?.meta?.city)})`, seed?.meta?.city === r.seedCity, { file: SEED, remedy: R_SEED });
    const crumbs = seed ? buildCellCrumbs(seed.meta) : [];
    check(`${addr}: no crumb is the bare code (${crumbs.map((c) => c.label).join(" / ")})`, crumbs.length > 0 && crumbs.every((c) => c.label.trim().toUpperCase() !== r.country.toUpperCase()), { file: SEED, remedy: R_SEED });
    check(`${addr}: no two neighbouring crumbs share a label (${crumbs.map((c) => c.label).join(" / ")})`, crumbs.length > 0 && crumbs.every((c, i) => i === 0 || !sameLabel(c.label, crumbs[i - 1].label)), { file: CRUMBS, remedy: R_CRUMB });
  }

  /* (2b) THE TRAIL'S BUILDERS ON THEIR OWN (src/lib/spine/crumb_rows.ts): a place that says the country's own name is the country said
     twice, so its crumb is dropped, by the trade page's builder and the district pages' alike. The place may carry a link of its own
     (the page of the city Singapore, whose name is its country's): the country's crumb is the one that stays. */
  const trail = (cs: Array<{ label: string }>) => cs.map((c) => c.label).join(" / ");
  const builders: Array<[string, string, string]> = [
    ["the trade page of a country itself, /gb/gb", trail(buildCellCrumbs({ iso2: "GB", geo: "gb", trade: "Restaurants", city: "United Kingdom" })), "United Kingdom / Restaurants"],
    ["the same for Germany, /de/de", trail(buildCellCrumbs({ iso2: "DE", geo: "de", trade: "Restaurants", city: "Germany" })), "Germany / Restaurants"],
    ["an id no table labels, read as the country, /gb/gb-e06000004", trail(buildCellCrumbs({ iso2: "GB", geo: "gb-e06000004", trade: "Restaurants", city: "United Kingdom" })), "United Kingdom / Restaurants"],
    ["a city whose name is its country's, /sg/singapore", trail(buildCellCrumbs({ iso2: "SG", geo: "singapore", trade: "Restaurants", city: "Singapore" })), "Singapore / Restaurants"],
    ["the district pages of that city", trail(buildHoodCrumbs("singapore", null)), `Singapore / ${COPY.crumbs.districts}`],
    ["control, a place that is not its country: /gb/london keeps its crumb", trail(buildCellCrumbs({ iso2: "GB", geo: "london", trade: "Restaurants", city: "London" })), "United Kingdom / London / Restaurants"],
    ["control, the district pages of London keep the city", trail(buildHoodCrumbs("london", null)), `United Kingdom / London / ${COPY.crumbs.districts}`],
  ];
  for (const [label, got, want] of builders) check(`${label}: the trail reads "${want}" (got "${got}")`, got === want, { file: CRUMBS, remedy: R_CRUMB });

  /* (2c) AN INTERNAL WORD NEVER REACHES A READER. The function first, over the strings the rows hold (the first five are what live pages printed on
     2026-10-11, the sixth is the lookup's own default for a row with none, the rest are shapes the function must keep or cut), then the seed's
     source line and the hero's foot at the addresses that printed it. */
  type Sanitise = (line: string | null | undefined) => string | null;
  check("src/lib/spine/adapt_cell.ts exports sanitiseProvenance", typeof adaptCell.sanitiseProvenance === "function", { file: SEED, remedy: R_SOURCE });
  const S: Sanitise = adaptCell.sanitiseProvenance ?? (() => "(sanitiseProvenance is not exported)");
  const internalIn = (text: string): string[] => (text.match(/[A-Za-z0-9_]+/g) ?? []).filter((w) => w.includes("_") || /[A-Za-z]{2,}\d/.test(w));
  const sources: Array<[string, string | null | undefined, string | null]> = [
    ["the extrapolated rows' real source (the United Kingdom's and Germany's, 2026-10-11): a pipeline's name, nothing readable is left", "wave5_extrapolation", null],
    ["the regional rows' real source stays", "National business statistics", "National business statistics"],
    ["the statistics rows' real source stays", "european business statistics", "european business statistics"],
    ["the census rows' real source stays: SUSB 2021 is a reader's words", "Census SUSB 2021", "Census SUSB 2021"],
    ["a synthetic cell's own words stay", "Estimated from country and industry averages", "Estimated from country and industry averages"],
    ["the default of an extrapolated row with no source stays", "Estimated from regional patterns", "Estimated from regional patterns"],
    ["letters run into digits are a pipeline's: wave5 alone", "wave5", null],
    ["a word holding an underscore is a pipeline's: cafes_coffee", "cafes_coffee", null],
    ["a pipeline's word after a pipe is cut, the prose before it stays", "Estimated from regional patterns | wave5_extrapolation", "Estimated from regional patterns"],
    ["a key:value marker after a pipe is cut as before", "Estimated from regional patterns | scrub:revenue-cap-2026-05-31", "Estimated from regional patterns"],
    ["a prose part after a pipe stays as before", "Estimated from regional patterns | see note", "Estimated from regional patterns | see note"],
    ["a licence's version is a reader's word: v3.0", "Open Government Licence v3.0", "Open Government Licence v3.0"],
    ["no source stays no source", null, null],
    ["an empty source stays no source", "", null],
  ];
  for (const [label, line, want] of sources) {
    const got = S(line);
    check(`${label}: sanitiseProvenance(${JSON.stringify(line)}) is ${JSON.stringify(want)} (got ${JSON.stringify(got)})`, got === want, { file: SEED, remedy: R_SOURCE });
  }
  /* The seed and the hero's foot, as the page prints them. The four internal-source addresses drop the clause; the controls keep their words exactly. */
  type FootCase = { country: string; geo: string; industry: string; foot: string };
  const feet: FootCase[] = [
    { country: "gb", geo: "boston", industry: "restaurants", foot: "Estimates for a typical restaurant." },
    { country: "gb", geo: "gb", industry: "restaurants", foot: "Estimates for a typical restaurant." },
    { country: "gb", geo: "england", industry: "restaurants", foot: "Estimates for a typical restaurant." },
    { country: "de", geo: "de", industry: "restaurants", foot: "Estimates for a typical restaurant." },
    { country: "gb", geo: "liverpool", industry: "restaurants", foot: "Estimates for a typical restaurant, from national business statistics." },
    { country: "us", geo: "california", industry: "restaurants", foot: "Estimates for a typical restaurant, from census." },
  ];
  for (const f of feet) {
    const addr = `/${f.country}/${f.geo}/${f.industry}`;
    const seed = await buildSpineCellSeed(f.country, f.geo, f.industry);
    const footText: string | null = seed ? tradeHeroFacts(seed)?.foot?.text ?? null : null;
    const line = String(seed?.meta?.provenance_line ?? "");
    check(`${addr}: the seed's source line holds no internal word (${JSON.stringify(line)}) and the hero's foot reads "${f.foot}" (got ${JSON.stringify(footText)})`, internalIn(line).length === 0 && footText === f.foot, { file: SEED, remedy: R_SOURCE });
  }

  /* (3) THE SHARE CARD, read from the element tree the route hands to ImageResponse (stubbed above): the title block and the figure block. */
  type Props = Record<string, unknown>;
  type Node = { type?: unknown; props?: Props };
  const walk = (node: unknown, out: Node[] = []): Node[] => {
    if (Array.isArray(node)) { for (const n of node) walk(n, out); return out; }
    if (node && typeof node === "object" && (node as Node).props) { out.push(node as Node); walk((node as Node).props?.children, out); }
    return out;
  };
  const propsOf = (nodes: Node[], component: string): Props | null => nodes.find((n) => typeof n.type === "function" && (n.type as { name?: string }).name === component)?.props ?? null;
  const cardOf = async (country: string, geo: string, industry: string) => {
    seen.tree = null;
    await cardMod?.GET?.(new Request(`http://offline.invalid/og/cell?country=${country}&geo=${geo}&industry=${industry}`));
    const nodes = walk(seen.tree);
    const t = propsOf(nodes, "OgTitle");
    const f = propsOf(nodes, "OgFigure");
    return { title: String(t?.title ?? ""), subtitle: String(t?.subtitle ?? ""), figure: f ? { label: String(f.label ?? ""), value: String(f.value ?? ""), detail: String(f.detail ?? "") } : null };
  };
  const RANGE = new RegExp(`^Range ${AMT} \\u2013 ${AMT}$`);
  type CardCase = { country: string; geo: string; industry: string; title: string; label?: string; value?: string; detail?: RegExp | string; never?: string; none?: boolean };
  const cards: CardCase[] = [
    { country: "gb", geo: "boston", industry: "restaurants", title: "Restaurants: Boston", label: `Typical revenue in ${THE_UK}`, detail: RANGE, never: "Boston" },
    { country: "gb", geo: "gb", industry: "restaurants", title: "Restaurants: United Kingdom", label: "Typical revenue", detail: RANGE },
    { country: "de", geo: "de", industry: "restaurants", title: "Restaurants: Germany", label: "Typical revenue", detail: RANGE },
    { country: "de", geo: "frankfurt-am-main", industry: "restaurants", title: "Restaurants: Frankfurt am Main", label: "Typical revenue in Germany", detail: RANGE, never: "Frankfurt" },
    { country: "gb", geo: "england", industry: "restaurants", title: "Restaurants: England", label: `Typical revenue in ${THE_UK}`, detail: RANGE, never: "England" },
    { country: "gb", geo: "liverpool", industry: "legal-services", title: `${tradeName("legal-services")}: Liverpool`, none: true },
    { country: "gb", geo: "boston", industry: "legal-services", title: `${tradeName("legal-services")}: United Kingdom`, none: true },
    { country: "uk", geo: "uki", industry: "restaurants", title: "Restaurants: London (NUTS 2021)", none: true },
    { country: "gb", geo: "london", industry: "restaurants", title: "Restaurants: London", label: "Typical revenue", value: "$374K", detail: "7,865 registered businesses in London" },
    { country: "gb", geo: "liverpool", industry: "restaurants", title: "Restaurants: Liverpool", label: "Typical revenue", value: "$250K", detail: RANGE },
    { country: "gb", geo: "manchester", industry: "restaurants", title: "Restaurants: Manchester", label: "Typical revenue", value: "$260K", detail: RANGE },
    { country: "us", geo: "california", industry: "restaurants", title: "Restaurants: California", label: "Typical revenue", value: "$600K", detail: RANGE },
    { country: "us", geo: "boston", industry: "restaurants", title: "Restaurants: Boston", label: "Typical revenue", value: "$550K", detail: RANGE },
  ];
  for (const c of cards) {
    const addr = `/og/cell?country=${c.country}&geo=${c.geo}&industry=${c.industry}`;
    const k = await cardOf(c.country, c.geo, c.industry);
    check(`${addr}: the card's title is "${c.title}" (got "${k.title}")`, k.title === c.title, { file: CARD, remedy: R_CARD });
    if (c.none) {
      check(`${addr}: the card prints no figure and says so (got ${JSON.stringify(k.figure)}, subtitle "${k.subtitle}")`, k.figure === null && k.subtitle === "Revenue not published for this cell", { file: CARD, remedy: R_CARD });
      continue;
    }
    const f = k.figure;
    const detailOk = f !== null && (typeof c.detail === "string" ? f.detail === c.detail : c.detail ? c.detail.test(f.detail) : true) && (!c.never || !f.detail.includes(c.never));
    check(`${addr}: the figure block names the place the figure belongs to: label "${c.label}"${c.value ? `, value ${c.value}` : ""}, detail ${typeof c.detail === "string" ? `"${c.detail}"` : String(c.detail)} (got ${JSON.stringify(f)})`, f !== null && f.label === c.label && (!c.value || f.value === c.value) && detailOk, { file: CARD, remedy: R_CARD });
  }

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("spine/trade_head: all pass");
  process.exit(0);
}
void main();
