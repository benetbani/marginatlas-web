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
 * AND THE STATISTICS CODE READS AS THE SITE'S, AT THE SEED'S DOOR (truth-fixes round 3B, 2026-10-11; round 1's item 3, uk:statistics-code-uk-pages). UK for the
 * United Kingdom and EL for Greece are the statistics' own spellings of countries the site holds as GB and GR, and /uk/uki/restaurants printed the world's survival,
 * pay dashes, a United States licence list and a New York cost table because four tests that ask "is this Great Britain" and every lookup keyed by the country read
 * the seed's meta.iso2, which was "UK". One function (siteCountryCode, src/lib/countries.ts) answers the site's code, the table the coverage report held moved
 * there so no second one exists, the seed's meta.iso2 takes it once where adapt_cell.ts sets it, and placeNameOf reads it for the country's name and its bare-code
 * test, so "UK" is a bare code of the United Kingdom. THE ADDRESS DOES NOT MOVE: the seed carries the code the route received (meta.address_iso2), which the report
 * foot's path reads, and the route, the canonical, the robots tag, the place words and the paywall read the route's own code and never the seed's.
 * BLIND SPOT, stated: the stub holds the UK's and Greece's rows in the shapes the database held on 2026-10-11 (levels nuts1 and nuts2), plus one invented row of the
 * code UK at the level "country"; this cannot tell which rows the database holds today.
 *
 * AND A NAME THE LOOKUP STAMPED (truth-fixes round 3A2, 2026-10-12; the review of round 3A, I1). cells.ts stamps geoNameFromSlug(country, word) on every cell whose
 * word a table labels, so the name placeNameOf is given is that label and never the bare code: the every-word check above gave every word its country's code, a
 * path the lookup takes for none of the 2,510 words a table labels. Fed as the lookup feeds it, 76 words printed their country's code and 83 whole-country words
 * printed a native name or a placeholder ("All of AF", "Danmark"). A whole-country word whose stamped name is the lookup's own label for it is the country, named in
 * English; a stamped label that ends in the page's own country code or in "(NUTS 2021)" prints without that tail ("Prov. Limburg (BE)" is "Prov. Limburg"), at
 * display only, never at the generator, whose addresses are the slugs of the labels. Two kinds of check below: the function over stamped names, and every place
 * word of every held country fed as the lookup feeds it.
 * BLIND SPOT, stated: the display rule reads a label's tail only, so a label that holds the code anywhere else still prints it. One does today, "RUP FR - Régions
 * Ultrapériphériques Françaises" (/fr/fry), and the every-word check names that word and no other: a new one reds it.
 *
 * AND NO REGION IS NAMED BY A PLACE OUTSIDE IT (truth-fixes round 3A2, 2026-10-12; the review's I2 and M2). The popular-name table (src/lib/geo/popular_place_overrides.json) is the
 * one geoNameFromSlug and every cell's name read first. It named England London (round 3A), Scotland, Wales and Northern Ireland by their capitals, and three regions by a city that
 * is not in them: Punjab by Chandigarh, Gyeonggi by Seoul, Selangor by Kuala Lumpur. So /gb/scotland was titled "Edinburgh, United Kingdom" over a trail that said Scotland, and
 * /kr/gyeonggi and /kr/seoul shared one headline against the table's own anchor (never two names for one place). All seven are named by their own English name now, in a table below
 * and in the route and card lists. The 110 other regions the table names by a city inside them are not touched: their premise (Plan v28 Lane C) is the owner's call.
 * BLIND SPOT, stated: this reads seven values of a table. It cannot tell, in the 110 left, a region named by a city from one named by itself, and it cannot tell whether a value
 * adds or drops an address: the place table is built from the values (scripts/gen_place_slugs.ts), and the edge-not-found gate holds the committed table to a fresh generation.
 *
 * AND A DROPPED CRUMB KEEPS ITS LINK (truth-fixes round 3A2, 2026-10-12; the review's M1). Round 3A dropped the place step whenever it said the country's own name, so on the eight
 * words whose city page or region page bears the country's name (Djibouti, Guatemala, Hong Kong, Luxembourg, Monaco, San Marino, Singapore, Taiwan) the step that went was the one
 * that linked the place's own page, and the Singapore, Hong Kong and Monaco district pages lost the link to their city page. Now the step that has a page of its own stays and the
 * country's step goes; where the place has no page the country's step stays, as before. The city page's own repeat ("Singapore / Singapore") is the stated exception and a row pins it.
 * Two kinds of check: the builders over the eight words, the districts and the controls, and every place word of every held country (no trail says a place twice, and a place with a
 * page of its own is linked from its trail).
 * BLIND SPOT, stated: this reads the links the resolvers answer (src/lib/geo/page_targets.ts), which come from the route rules and the lists the routes gate on, not from a fetch, so it
 * cannot tell whether a linked page renders.
 *
 * Run: npx tsx tests/spine/trade_head.test.ts
 */
import Module from "node:module";
import { readdirSync, readFileSync } from "node:fs";
import { tradeHeadFigure } from "../../src/lib/spine/trade_head";
import { inSentence } from "../../src/lib/spine/place_names";
import { COUNTRIES, slugToIndustry } from "../../src/lib/taxonomy";
import { PLACE_SLUGS_BY_COUNTRY } from "../../src/lib/routing/place_slugs_generated";
import { red, redSummary } from "../../scripts/lib/red";
import { stripCommentLines } from "../../scripts/lib/strip_comments";

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
const R_NAMED = "set the value of each of gb/england, gb/scotland, gb/wales, gb/northern-ireland, in/punjab, kr/gyeonggi and my/selangor in src/lib/geo/popular_place_overrides.json to the region's own English name (England, Scotland, Wales, Northern Ireland, Punjab, Gyeonggi, Selangor): that table is the one geoNameFromSlug and getCellBySlug answer first, and a region is never named by its capital or by a place outside it; then generate the place table again (scripts/gen_place_slugs.ts, renderPlaceSlugs) and keep every word it holds, since its addresses are built from these values";
const R_SOURCE = "cut a pipeline's word (one holding an underscore, or two or more letters run into digits) from the source line where the data enters the seed, sanitiseProvenance in src/lib/spine/adapt_cell.ts; where nothing readable is left the sentence drops its \"from\" clause (\"Estimates for a typical restaurant.\"), never an invented source and never an agency";
const R_STAT = "map a statistics code to the site's country code in one function, siteCountryCode in src/lib/countries.ts (UK to GB, EL to GR), read once where adapt_cell.ts sets the seed's meta.iso2 and by placeNameOf for the country's name and its bare-code test; the coverage report imports it and holds no table of its own; the address keeps the code the route received (meta.address_iso2, which the report foot's path reads)";
const R_STAMPED = "in placeNameOf (src/lib/cells/place_name.ts), a whole-country word whose stamped name is the lookup's own label for it (geoNameFromSlug: \"All of AF\", \"Danmark\") is the country, named in English, before the cell's own name is kept";
const R_TAIL = "print a label without a trailing \"(NUTS 2021)\" and without a trailing parenthetical that is the page's own country code, in placeNameOf only (the display: the generator's addresses are the slugs of the labels and must not move)";
const COUNTRIES_FILE = "src/lib/countries.ts";
const REPORT = "src/lib/coverage/report.ts";
const VIEW = "src/components/spine/cell/cell-view.tsx";
const CRUMBS = "src/lib/spine/crumb_rows.ts";
const R_CRUMB = "say a place once in src/lib/spine/crumb_rows.ts, for the trade page and the district pages alike (countryAndPlace): when the place's label equals the country's, keep the step that has a page of its own (the place's city page or region page, the nearer parent) and drop the country's step, else drop the place's step, so a trail never says one place twice and never loses the way to the place's own page; the city page's own trail is the one stated exception, since folding it leaves one step, which draws nothing";
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

  /* (0) THE ONE FUNCTION (truth-fixes round 3B): a statistics code reads as the site's country code, for the seed's door and for the country's name. */
  const countriesMod = await tryImport<{ siteCountryCode?: (code: string | null | undefined) => string }>(() => import("../../src/lib/countries"));
  check(`${COUNTRIES_FILE} exports siteCountryCode`, typeof countriesMod?.siteCountryCode === "function", { file: COUNTRIES_FILE, remedy: R_STAT });
  const C = countriesMod?.siteCountryCode ?? (() => "(siteCountryCode is not exported)");
  const codes: Array<[string, string | null | undefined, string]> = [
    ["the United Kingdom's statistics code reads GB", "UK", "GB"],
    ["in lower case, as a route holds it", "uk", "GB"],
    ["Greece's statistics code reads GR", "EL", "GR"],
    ["with the spaces an input can carry", " el ", "GR"],
    ["the site's own code for the country is itself", "GB", "GB"],
    ["Greece's own code is itself", "GR", "GR"],
    ["a code the site holds is itself, in capitals", "de", "DE"],
    ["the United States is itself", "US", "US"],
    ["a code no table knows is itself, never invented", "ZZ", "ZZ"],
    ["a word that is a key of every object is no alias", "constructor", "CONSTRUCTOR"],
    ["no code stays none", "", ""],
    ["a missing code stays none", null, ""],
  ];
  for (const [label, code, want] of codes) {
    const got = C(code);
    check(`${label}: siteCountryCode(${JSON.stringify(code)}) is ${JSON.stringify(want)} (got ${JSON.stringify(got)})`, got === want, { file: COUNTRIES_FILE, remedy: R_STAT });
  }
  /* ONE TABLE: the mapping is held in src/lib/countries.ts and in no other module of src, and the coverage report reads it from there. */
  const holders: string[] = [];
  const walkSrc = (dir: string): void => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = `${dir}/${e.name}`;
      if (e.isDirectory()) { walkSrc(p); continue; }
      if (!/\.(ts|tsx)$/.test(e.name)) continue;
      const text = readFileSync(p, "utf8");
      if (text.includes("UK") && /\bUK\b["']?\s*:\s*["']GB["']/.test(stripCommentLines(text.split(/\r?\n/)).join("\n"))) holders.push(p.replace(/\\/g, "/"));
    }
  };
  walkSrc("src");
  check(`the statistics codes' table is held once, in ${COUNTRIES_FILE} (held in: ${holders.join(", ") || "no module"})`, holders.length === 1 && holders[0] === COUNTRIES_FILE, { file: COUNTRIES_FILE, remedy: R_STAT });
  const reportCode = stripCommentLines(readFileSync(REPORT, "utf8").split(/\r?\n/)).join("\n");
  check(`${REPORT} reads siteCountryCode and holds no table of its own`, /\bsiteCountryCode\b/.test(reportCode) && !/\bALIASES\b/.test(reportCode), { file: REPORT, remedy: R_STAT });
  const { getCoverageFor } = await import("../../src/lib/coverage/report");
  check("the coverage report still folds the statistics codes into the site's countries: GB and GR hold their cells, UK and EL hold none of their own", getCoverageFor("GB") !== null && getCoverageFor("GR") !== null && getCoverageFor("UK") === null && getCoverageFor("EL") === null, { file: REPORT, remedy: R_STAT });

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
    /* THE STATISTICS CODES ARE THE SITE'S COUNTRIES (truth-fixes round 3B; round 1's item 3): UK is the United Kingdom's bare code and EL Greece's, so a cell named
       by one is named as a GB or GR cell is, by its place word's label else its country, and the country is named in English. The place words and the labels stay
       keyed by the code the address holds (the uk and el tables). */
    ["the UK's statistics code is a bare code of the United Kingdom: its own word names the country", "UK", "uk", "UK", "United Kingdom"],
    ["the page's country in lower case, as a route receives it", "uk", "uk", "UK", "United Kingdom"],
    ["a word no table labels names the country under that code", "UK", "zzzz-not-a-place", "UK", "United Kingdom"],
    ["Greece's statistics code, likewise: its own word", "EL", "el", "EL", "Greece"],
    ["and a region's id: Attiki", "EL", "el3", "EL", "Attiki"],
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
  /* A NAME THE LOOKUP STAMPED (truth-fixes round 3A2; the review of round 3A, I1). cells.ts stamps geoNameFromSlug(country, word) on every cell whose word a table
     labels, so the name placeNameOf is given is that label and not the bare code the rows above feed. A whole-country word whose stamped name is the lookup's own
     label for it is the country, in English. A name the lookup did not stamp is the row's own and stays. */
  const wholeCases: Array<[string, string, string, string, string]> = [
    ["a whole-country word stamped with its table's placeholder is the country: /af/af", "AF", "af", "All of AF", "Afghanistan"],
    ["and /sg/sg", "SG", "sg", "All of SG", "Singapore"],
    ["and /gr/gr, a country the place table holds under its own code", "GR", "gr", "All of GR", "Greece"],
    ["a native label is no English name: /dk/dk0", "DK", "dk0", "Danmark", "Denmark"],
    ["and its zero-padded forms: /cy/cy0", "CY", "cy0", "Kýpros", "Cyprus"],
    ["and /cy/cy00", "CY", "cy00", "Kýpros", "Cyprus"],
    ["and /cz/cz0", "CZ", "cz0", "Česko", "Czechia"],
    ["and /hr/hr0", "HR", "hr0", "Hrvatska", "Croatia"],
    ["a table label that is already the English name stays itself: /ie/ie0", "IE", "ie0", "Ireland", "Ireland"],
    ["a name the lookup did not stamp is the row's own and stays, whatever the word: /bs/bs", "BS", "bs", "Bahamas, The", "Bahamas, The"],
    ["a label on a word that is not the whole country is a place's and stays: /dk/dk01", "DK", "dk01", "Hovedstaden", "Hovedstaden"],
  ];
  for (const [label, country, word, stamped, want] of wholeCases) {
    const got = P(country, word, stamped);
    check(`${label}: placeNameOf(${country}, ${word}, ${JSON.stringify(stamped)}) is ${JSON.stringify(want)} (got ${JSON.stringify(got)})`, got === want, { file: NAME, remedy: R_STAMPED });
  }
  /* A label's tail that says the page's country again ("(BE)") or the classification's vintage ("(NUTS 2021)") is not printed, at display only. The first seven are
     the disambiguated labels the live path stamped on real regional rows; the control rows keep what the rule does not name. */
  const tailCases: Array<[string, string, string, string, string]> = [
    ["a trailing code of the page's own country is not printed: the Belgian province /be/be22", "BE", "be22", "Prov. Limburg (BE)", "Prov. Limburg"],
    ["and /be/be34", "BE", "be34", "Prov. Luxembourg (BE)", "Prov. Luxembourg"],
    ["and /it/iti", "IT", "iti", "Centro (IT)", "Centro"],
    ["and /es/es4", "ES", "es4", "Centro (ES)", "Centro"],
    ["and /nl/nl12", "NL", "nl12", "Friesland (NL)", "Friesland"],
    ["and /nl/nl42", "NL", "nl42", "Limburg (NL)", "Limburg"],
    ["the code and the vintage together: /pt/pt16", "PT", "pt16", "Centro (PT) (NUTS 2021)", "Centro"],
    ["the vintage alone: /nl/nl31", "NL", "nl31", "Utrecht (NUTS 2021)", "Utrecht"],
    ["the statistics code UK, the vintage alone: /uk/uki", "UK", "uki", "London (NUTS 2021)", "London"],
    ["and with the code before it: /uk/ukj", "UK", "ukj", "South East (UK) (NUTS 2021)", "South East"],
    ["and /uk/ukn", "UK", "ukn", "Northern Ireland (UK) (NUTS 2021)", "Northern Ireland"],
    ["a word a table labels reads the same through the bare code: the region's id", "UK", "uki", "UK", "London"],
    ["and the slug of that label", "UK", "london-nuts-2021", "UK", "London"],
    ["control, another country's code is not the page's own: Centro (IT) on a Portuguese page", "PT", "pt16", "Centro (IT)", "Centro (IT)"],
    ["control, a parenthetical that is no code stays", "GB", "kingston-upon-thames", "Kingston (Surrey)", "Kingston (Surrey)"],
    ["control, a label that is only the tag keeps itself", "NL", "nl31", "(NUTS 2021)", "(NUTS 2021)"],
    ["control, a code inside the name and not at its tail stays, the stated blind spot: /fr/fry", "FR", "fry", "RUP FR - Régions Ultrapériphériques Françaises", "RUP FR - Régions Ultrapériphériques Françaises"],
  ];
  for (const [label, country, word, stamped, want] of tailCases) {
    const got = P(country, word, stamped);
    check(`${label}: placeNameOf(${country}, ${word}, ${JSON.stringify(stamped)}) is ${JSON.stringify(want)} (got ${JSON.stringify(got)})`, got === want, { file: NAME, remedy: R_TAIL });
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
  /* THE FOUR NATIONS AND THREE REGIONS THE POPULAR-NAME TABLE NAMED BY A PLACE OUTSIDE THEM. The table answers first for every page (geoNameFromSlug, and cells.ts stamps
     its answer on the cell), and it named England London (round 3A), Scotland Edinburgh, Wales Cardiff, Northern Ireland Belfast, and three regions by a city that is not in
     them (round 3A2, the review's I2 and M2): Punjab by Chandigarh, a union territory, Gyeonggi by Seoul, which is no part of it, and Selangor by Kuala Lumpur, a federal
     territory. Each is now named by its own English name. The table's own anchor says never two names for one place, and /kr/seoul and /my/kuala-lumpur already name theirs. */
  const { geoNameFromSlug } = await import("../../src/lib/cells/geo");
  const regionNames: Array<[string, string, string, string]> = [
    ["GB", "england", "England", "London"],
    ["GB", "scotland", "Scotland", "Edinburgh"],
    ["GB", "wales", "Wales", "Cardiff"],
    ["GB", "northern-ireland", "Northern Ireland", "Belfast"],
    ["IN", "punjab", "Punjab", "Chandigarh"],
    ["KR", "gyeonggi", "Gyeonggi", "Seoul"],
    ["MY", "selangor", "Selangor", "Kuala Lumpur"],
  ];
  for (const [cc, word, name, was] of regionNames) {
    const label = geoNameFromSlug(cc, word);
    check(`/${cc.toLowerCase()}/${word} is named ${name} and never ${was}: the lookup's label for the word is ${JSON.stringify(label)} and the page prints ${JSON.stringify(P(cc, word, label))}`, label !== was && label === name && P(cc, word, label) === name, { file: "src/lib/geo/popular_place_overrides.json", remedy: R_NAMED });
  }

  /* THE SAME WORDS AS THE LIVE PATH READS THEM (truth-fixes round 3A2; the review of round 3A, I1). Each word is given what cells.ts stamps on its cell: the label a
     table holds for it (geoNameFromSlug) where there is one, else the row's own name, which is the country's code in 47 of 195 countries. The counts are stated: the
     words a table labels, the words named by a label and by the country, the whole-country words that do not print the country's English name, and the words that
     print the code. The words that still print it are held to the stated blind spot below, exactly: a new one reds, and so does one that stops printing it. */
  let liveWords = 0, labelled = 0, liveByLabel = 0, liveByCountry = 0, wholeWords = 0;
  const liveBare: string[] = [];
  const liveHoldsCode: string[] = [];
  const wholeNotCountry: string[] = [];
  for (const c of COUNTRIES) {
    const cc = c.code.toLowerCase();
    for (const w of PLACE_SLUGS_BY_COUNTRY[cc] ?? []) {
      liveWords++;
      const stamped = geoNameFromSlug(c.code, w) ?? c.code;
      if (stamped !== c.code) labelled++;
      const n = P(c.code, w, stamped);
      const addr = `/${cc}/${w}`;
      if (w.startsWith(cc) && /^0*$/.test(w.slice(cc.length))) { wholeWords++; if (n !== c.name) wholeNotCountry.push(`${addr} ${JSON.stringify(n)}`); }
      if (!n || n.trim().toUpperCase() === c.code.toUpperCase()) { liveBare.push(addr); continue; }
      if (n.split(/[^A-Za-z0-9]+/).includes(c.code.toUpperCase())) liveHoldsCode.push(`${addr} ${JSON.stringify(n)}`);
      if (n === c.name) liveByCountry++; else liveByLabel++;
    }
  }
  const STAMPED_BLIND = ['/fr/fry "RUP FR - Régions Ultrapériphériques Françaises"'];
  check(`${liveWords} place words of ${COUNTRIES.length} held countries, each given what the lookup stamps (${labelled} are labelled by a table): ${liveWords - liveBare.length} are named (${liveByLabel} by a label of the site's tables, ${liveByCountry} by their country's name) and ${liveBare.length} print the bare code${liveBare.length ? ` (${liveBare.slice(0, 6).join(" ")})` : ""}`, liveWords > 0 && liveBare.length === 0, { file: NAME, remedy: R_STAMPED });
  check(`${wholeNotCountry.length} of the ${wholeWords} whole-country words do not print their country's English name when the lookup stamps its own label on them${wholeNotCountry.length ? ` (${wholeNotCountry.slice(0, 4).join(", ")})` : ""}`, wholeWords > 0 && wholeNotCountry.length === 0, { file: NAME, remedy: R_STAMPED });
  check(`${liveHoldsCode.length} place words print their country's code as a word when the lookup stamps its label, against the ${STAMPED_BLIND.length} the display rule cannot see (${STAMPED_BLIND.join(", ")})${liveHoldsCode.length ? `; printing it: ${liveHoldsCode.slice(0, 4).join(", ")}` : ""}`, liveHoldsCode.length === STAMPED_BLIND.length && STAMPED_BLIND.every((x) => liveHoldsCode.includes(x)), { file: NAME, remedy: R_TAIL });

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
    ["the UK's statistics code on a country's row: the title names the place, without its vintage, with the United Kingdom, the figure is the country's", "UK", "uki", { geo_name: "London (NUTS 2021)", geo_level: "country" }, { label: "London", titleIn: "London, United Kingdom", figureIn: "the United Kingdom" }],
    ["the UK's own word under that code takes the article", "UK", "uk", { geo_name: "UK", geo_level: "country" }, { label: "United Kingdom", titleIn: "the United Kingdom", figureIn: "the United Kingdom" }],
    ["Greece's statistics code on a country's row", "EL", "el3", { geo_name: "Attiki", geo_level: "country" }, { label: "Attiki", titleIn: "Attiki, Greece", figureIn: "Greece" }],
    ["a row of that code at its own level keeps its own figure, and its name without the vintage", "UK", "uki", { geo_name: "London (NUTS 2021)", geo_level: "nuts1" }, { label: "London", titleIn: "London", figureIn: "London" }],
    /* THE NAME THE LOOKUP STAMPED (truth-fixes round 3A2, the review's I1): the label a table holds for the word reaches the head and the card as the cell's name. */
    ["a whole-country word stamped with its table's placeholder: the country, never \"All of AF\"", "AF", "af", { geo_name: "All of AF", geo_level: "country" }, { label: "Afghanistan", titleIn: "Afghanistan", figureIn: "Afghanistan" }],
    ["a whole-country word stamped with its own-language label: the title never reads \"Danmark, Denmark\"", "DK", "dk0", { geo_name: "Danmark", geo_level: "country" }, { label: "Denmark", titleIn: "Denmark", figureIn: "Denmark" }],
    ["a real regional row stamped with a label that ends in its own country's code: its name without the code, its own figure", "BE", "be22", { geo_name: "Prov. Limburg (BE)", geo_level: "nuts2" }, { label: "Prov. Limburg", titleIn: "Prov. Limburg", figureIn: "Prov. Limburg" }],
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
         as /gb/boston does on the live site; and, as round 3A2 reads whole-country words and the regions the popular-name table named by another
         place, for Afghanistan's, Denmark's, India's, South Korea's and Malaysia's;
       - regional_cells for four real places and one statistics row: London, Liverpool and Manchester under their own ids and Boston in
         Massachusetts under its county's (the controls), and a row of the code UK at the level "country" (a country's row of a code the
         country list holds no name for); and the Belgian province BE22, a real regional row whose label ends in its country's code;
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
  /* Afghanistan's and Denmark's country rows (round 3A2): the two whole-country words the review read, the first labelled "All of AF" by its region table, the second
     "Danmark". Their name column is the bare code, as the 47 countries' rows hold it. */
  const AF_ROWS = [bandRow("AFG", "AF", "TOTAL", 76000), bandRow("AFG", "AF", "0-9", 41000), bandRow("AFG", "AF", "20-49", 380000)];
  const DK_ROWS = [bandRow("DNK", "DK", "TOTAL", 330000), bandRow("DNK", "DK", "0-9", 150000), bandRow("DNK", "DK", "20-49", 2100000)];
  /* India's, South Korea's and Malaysia's country rows (round 3A2): the three regions the popular-name table named by a city that is not in them read their country's row. */
  const IN_ROWS = [bandRow("IND", "IN", "TOTAL", 22000), bandRow("IND", "IN", "0-9", 12000), bandRow("IND", "IN", "20-49", 190000)];
  const KR_ROWS = [bandRow("KOR", "KR", "TOTAL", 137000), bandRow("KOR", "KR", "0-9", 74000), bandRow("KOR", "KR", "20-49", 910000)];
  const MY_ROWS = [bandRow("MYS", "MY", "TOTAL", 218000), bandRow("MYS", "MY", "0-9", 99000), bandRow("MYS", "MY", "20-49", 1200000)];
  const EXTRAPOLATED: Record<string, unknown[]> = { GBR: UK_ROWS, DEU: DE_ROWS, AFG: AF_ROWS, DNK: DK_ROWS, IND: IN_ROWS, KOR: KR_ROWS, MYS: MY_ROWS };
  const regionalRow = (country: string, geoId: string, level: string, name: string, usd: number) => ({ country, geo_id: geoId, geo_level: level, geo_name: name, industry_id: "restaurants", size_band: null, year: YEAR, n_enterprises: 5000, n_employees: 40000, revenue_per_firm: usd, rev_p10: usd * 0.4, rev_p25: usd * 0.65, rev_p50: usd, rev_p75: usd * 1.45, rev_p90: usd * 2.1, payroll_per_employee: 30000, quality_score: 80, coverage_tier: "S", coverage_source: "National business statistics", currency: "USD", sub_industry_id: null, sub_industry_source_kind: null, cost_stack: null, setup_costs: null });
  const REGIONAL = [
    regionalRow("GB", "GB-E09000001", "district", "London", 433_000),
    regionalRow("GB", "GB-E08000012", "district", "Liverpool", 250_000),
    regionalRow("GB", "GB-E08000003", "district", "Manchester", 260_000),
    regionalRow("US", "US-25-025", "county", "Suffolk County", 550_000),
    regionalRow("UK", "UKI", "country", "UK", 300_000),
    regionalRow("UK", "UKJ", "nuts1", "South East (UK) (NUTS 2021)", 320_000),
    regionalRow("EL", "EL30", "nuts2", "Attiki", 270_000),
    regionalRow("BE", "BE22", "nuts2", "Prov. Limburg (BE)", 210_000),
  ];
  const CALIFORNIA = { country: "US", geo_id: "US-06", geo_level: "state", naics_6: "722511", naics_4: "7225", industry_description: "Full-Service Restaurants", size_band: null, year: YEAR, n: 9000, total_employment: 270_000, rev_p10: 240_000, rev_p25: 390_000, rev_p50: 600_000, rev_p75: 870_000, rev_p90: 1_260_000, mean_wage_per_employee_usd: 30_000, quality_score: 85, coverage_tier: "A", coverage_source: "Census", currency: "USD" };
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = decodeURIComponent(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    const table = /\/rest\/v1\/([a-z_]+)/.exec(url)?.[1] ?? "";
    const has = (part: string) => url.includes(part);
    const restaurants = /industry_id=in\.\([^)]*restaurants/.test(url);
    let rows: unknown[] = [];
    if (table === "extrapolated_cells" && restaurants) rows = Object.entries(EXTRAPOLATED).find(([iso3]) => has(`country_iso3=eq.${iso3}`))?.[1] ?? [];
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
  const { buildCellCrumbs, buildHoodCrumbs, buildCityCrumbs } = await import("../../src/lib/spine/crumb_rows");
  const { COPY } = await import("../../src/lib/spine/copy");
  const cardMod = await tryImport<{ GET?: (r: Request) => Promise<unknown> }>(() => import("../../src/app/og/cell/route"));
  check("the share card's route loads with next/og stubbed", typeof cardMod?.GET === "function", { file: CARD, remedy: R_CARD });

  const tradeName = (slug: string): string => slugToIndustry(slug)?.name ?? slug;
  const AMT = String.raw`\$\d+(?:\.\d+)?[KMB]`;
  const THE_UK = "the United Kingdom";
  /* Each address: the title's place after "in", the description (exact, or its shape), a word the description must not hold (the place
     the address names, when the figure is the country's), and the seed's city where the seed is read too. */
  type Route = { country: string; geo: string; industry: string; titleIn: string; desc: RegExp | string; never?: string; seedCity?: string; trail?: string };
  const routes: Route[] = [
    { country: "gb", geo: "boston", industry: "restaurants", titleIn: "Boston, United Kingdom", desc: new RegExp(`^~${AMT} typical revenue for restaurants in ${THE_UK}\\.$`), never: "Boston", seedCity: "Boston" },
    { country: "gb", geo: "gb", industry: "restaurants", titleIn: THE_UK, desc: new RegExp(`^~${AMT} typical revenue for restaurants in ${THE_UK}\\.$`), seedCity: "United Kingdom" },
    { country: "de", geo: "de", industry: "restaurants", titleIn: "Germany", desc: new RegExp(`^~${AMT} typical revenue for restaurants in Germany\\.$`), seedCity: "Germany" },
    { country: "de", geo: "frankfurt-am-main", industry: "restaurants", titleIn: "Frankfurt am Main, Germany", desc: new RegExp(`^~${AMT} typical revenue for restaurants in Germany\\.$`), never: "Frankfurt", seedCity: "Frankfurt am Main" },
    { country: "gb", geo: "king-s-lynn-and-west-norfolk", industry: "restaurants", titleIn: "King's Lynn and West Norfolk, United Kingdom", desc: new RegExp(`^~${AMT} typical revenue for restaurants in ${THE_UK}\\.$`), never: "Lynn", seedCity: "King's Lynn and West Norfolk" },
    { country: "gb", geo: "gb-e06000004", industry: "restaurants", titleIn: THE_UK, desc: new RegExp(`^~${AMT} typical revenue for restaurants in ${THE_UK}\\.$`), seedCity: "United Kingdom" },
    { country: "gb", geo: "england", industry: "restaurants", titleIn: "England, United Kingdom", desc: new RegExp(`^~${AMT} typical revenue for restaurants in ${THE_UK}\\.$`), never: "England", seedCity: "England" },
    /* The other three nations and three regions the popular-name table named by a place outside them (truth-fixes round 3A2, the review's I2 and M2): each is its own name,
       over its country's figure. Edinburgh, Cardiff, Belfast, Chandigarh, Seoul and Kuala Lumpur are cities the site draws on pages of their own. */
    { country: "gb", geo: "scotland", industry: "restaurants", titleIn: "Scotland, United Kingdom", desc: new RegExp(`^~${AMT} typical revenue for restaurants in ${THE_UK}\\.$`), never: "Scotland", seedCity: "Scotland" },
    { country: "gb", geo: "wales", industry: "restaurants", titleIn: "Wales, United Kingdom", desc: new RegExp(`^~${AMT} typical revenue for restaurants in ${THE_UK}\\.$`), never: "Wales", seedCity: "Wales" },
    { country: "gb", geo: "northern-ireland", industry: "restaurants", titleIn: "Northern Ireland, United Kingdom", desc: new RegExp(`^~${AMT} typical revenue for restaurants in ${THE_UK}\\.$`), never: "Northern Ireland", seedCity: "Northern Ireland" },
    { country: "in", geo: "punjab", industry: "restaurants", titleIn: "Punjab, India", desc: new RegExp(`^~${AMT} typical revenue for restaurants in India\\.$`), never: "Punjab", seedCity: "Punjab" },
    { country: "kr", geo: "gyeonggi", industry: "restaurants", titleIn: "Gyeonggi, South Korea", desc: new RegExp(`^~${AMT} typical revenue for restaurants in South Korea\\.$`), never: "Gyeonggi", seedCity: "Gyeonggi" },
    { country: "my", geo: "selangor", industry: "restaurants", titleIn: "Selangor, Malaysia", desc: new RegExp(`^~${AMT} typical revenue for restaurants in Malaysia\\.$`), never: "Selangor", seedCity: "Selangor" },
    /* A synthetic cell: no row held legal services, so the lookup drew one from country and trade averages. It names the label its
       tables give the word (Liverpool) or else the country, and the head says it holds no figure.
       THE BOSTON ROW IS STATED BEHAVIOUR, NOT A RULE (truth-fixes round 3A2, the review's M6). It pins what the lookup does for a synthetic cell today: no table labels the
       word, so the cell is named by its country, and a Boston address reads "the United Kingdom" here while its restaurants page, a country's row, reads "Boston, United
       Kingdom". That is the old naming of synthetic cells held in place by a check, not a decision that the place an address names may be left off its head. A better name
       for a synthetic cell would move this row and its card row below without breaking a rule. */
    { country: "gb", geo: "liverpool", industry: "legal-services", titleIn: "Liverpool", desc: new RegExp(`^Revenue and employment numbers for ${tradeName("legal-services").toLowerCase()} in Liverpool\\.$`) },
    { country: "gb", geo: "boston", industry: "legal-services", titleIn: THE_UK, desc: new RegExp(`^Revenue and employment numbers for ${tradeName("legal-services").toLowerCase()} in ${THE_UK}\\.$`) },
    /* THE STATISTICS CODES (truth-fixes round 3B): a row of the code UK or EL at the level "country" is the country's figure, so the title names the place with its
       country and the figure stands beside the country (UKI is stubbed as such a row); a row at its own level (UKJ, EL30) is a place's own, as London's is. */
    { country: "uk", geo: "uki", industry: "restaurants", titleIn: "London, United Kingdom", desc: new RegExp(`^~${AMT} typical revenue for restaurants in ${THE_UK}\\.$`), never: "London", seedCity: "London" },
    { country: "uk", geo: "ukj", industry: "restaurants", titleIn: "South East", desc: new RegExp(`^~${AMT} typical revenue for restaurants in South East\\.$`), seedCity: "South East" },
    { country: "el", geo: "el30", industry: "restaurants", titleIn: "Attiki", desc: new RegExp(`^~${AMT} typical revenue for restaurants in Attiki\\.$`), seedCity: "Attiki" },
    /* WHAT THE LOOKUP STAMPED (truth-fixes round 3A2, the review's I1): a whole-country word is its country in English whatever label its table holds ("All of AF",
       "Danmark"), and a real regional row whose label ends in its country's code prints without it ("Prov. Limburg (BE)"). */
    { country: "af", geo: "af", industry: "restaurants", titleIn: "Afghanistan", desc: new RegExp(`^~${AMT} typical revenue for restaurants in Afghanistan\\.$`), never: "All of", seedCity: "Afghanistan", trail: "Afghanistan / Restaurants" },
    { country: "dk", geo: "dk0", industry: "restaurants", titleIn: "Denmark", desc: new RegExp(`^~${AMT} typical revenue for restaurants in Denmark\\.$`), never: "Danmark", seedCity: "Denmark", trail: "Denmark / Restaurants" },
    { country: "be", geo: "be22", industry: "restaurants", titleIn: "Prov. Limburg", desc: new RegExp(`^~${AMT} typical revenue for restaurants in Prov\\. Limburg\\.$`), never: "(BE)", seedCity: "Prov. Limburg", trail: "Belgium / Prov. Limburg / Restaurants" },
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
    if (r.trail !== undefined) check(`${addr}: the trail reads "${r.trail}" (got "${crumbs.map((c) => c.label).join(" / ")}")`, crumbs.map((c) => c.label).join(" / ") === r.trail, { file: SEED, remedy: R_SEED });
  }

  /* (2b) THE TRAIL'S BUILDERS ON THEIR OWN (src/lib/spine/crumb_rows.ts): a place that says the country's own name is the country said
     twice, so one of the two steps is dropped, by the trade page's builder and the district pages' alike. WHICH ONE (truth-fixes round 3A2,
     the review's M1): where the place has a page of its own (the city page of Singapore, the region page of Luxembourg) its step stays, with
     its link, because it is the nearer parent and the country's step was the only other one, so the trade page and the district pages never
     lose the way to the place's own page. Where the place has none, the country's step stays, link and all. Each step is written
     "label <link>" so a lost link reads. */
  const steps = (cs: Array<{ label: string; href?: string }>) => cs.map((c) => (c.href ? `${c.label} <${c.href}>` : c.label)).join(" / ");
  const builders: Array<[string, string, string]> = [
    ["the trade page of a country itself, /gb/gb: no page for the place, the country's step stays with its link", steps(buildCellCrumbs({ iso2: "GB", geo: "gb", trade: "Restaurants", city: "United Kingdom" })), "United Kingdom </gb> / Restaurants"],
    ["the same for Germany, /de/de", steps(buildCellCrumbs({ iso2: "DE", geo: "de", trade: "Restaurants", city: "Germany" })), "Germany </de> / Restaurants"],
    ["an id no table labels, read as the country, /gb/gb-e06000004", steps(buildCellCrumbs({ iso2: "GB", geo: "gb-e06000004", trade: "Restaurants", city: "United Kingdom" })), "United Kingdom </gb> / Restaurants"],
    ["a city whose name is its country's, /sg/singapore: the city's step stays with the city page's link", steps(buildCellCrumbs({ iso2: "SG", geo: "singapore", trade: "Restaurants", city: "Singapore" })), "Singapore </cities/singapore> / Restaurants"],
    ["the district pages of that city keep the way to the city page", steps(buildHoodCrumbs("singapore", null)), `Singapore </cities/singapore> / ${COPY.crumbs.districts}`],
    ["and Hong Kong's", steps(buildHoodCrumbs("hong-kong", null)), `Hong Kong </cities/hong-kong> / ${COPY.crumbs.districts}`],
    ["and Monaco's", steps(buildHoodCrumbs("monaco", null)), `Monaco </cities/monaco> / ${COPY.crumbs.districts}`],
    ["control, a place that is not its country: /gb/london keeps both steps", steps(buildCellCrumbs({ iso2: "GB", geo: "london", trade: "Restaurants", city: "London" })), "United Kingdom </gb> / London </cities/london> / Restaurants"],
    ["control, the district pages of London keep both steps", steps(buildHoodCrumbs("london", null)), `United Kingdom </gb> / London </cities/london> / ${COPY.crumbs.districts}`],
    /* THE CITY PAGE IS THE STATED EXCEPTION. Its trail is the country's step and the page itself ("Singapore / Singapore"), the page being the last step and never a
       link: folding the repeat leaves one step, which Crumbs draws as nothing (src/components/spine/Crumbs.tsx, two steps at least), and takes from the page its only way
       back up to the country page. So the repeat stays, and this pins what it is: stated behaviour, not a rule the other builders follow. */
    ["the city page of a city named like its country keeps the repeat, the stated exception: /cities/singapore", steps(buildCityCrumbs("singapore")), "Singapore </sg> / Singapore"],
    ["and /cities/hong-kong", steps(buildCityCrumbs("hong-kong")), "Hong Kong </hk> / Hong Kong"],
    ["and /cities/monaco", steps(buildCityCrumbs("monaco")), "Monaco </mc> / Monaco"],
    ["control, a city that is not its country: /cities/london", steps(buildCityCrumbs("london")), "United Kingdom </gb> / London"],
  ];
  /* The eight place words whose city page or region page bears the country's name (round 3A's measure over the place table): each one's trade page links its own page. */
  const ownNamePlaces: Array<[string, string, string, string]> = [
    ["DJ", "djibouti", "Djibouti", "/dj/djibouti"],
    ["GT", "guatemala", "Guatemala", "/gt/guatemala"],
    ["HK", "hong-kong", "Hong Kong", "/cities/hong-kong"],
    ["LU", "luxembourg", "Luxembourg", "/lu/luxembourg"],
    ["MC", "monaco", "Monaco", "/cities/monaco"],
    ["SM", "san-marino", "San Marino", "/sm/san-marino"],
    ["SG", "singapore", "Singapore", "/cities/singapore"],
    ["TW", "taiwan", "Taiwan", "/tw/taiwan"],
  ];
  for (const [iso2, geo, name, href] of ownNamePlaces) builders.push([`the trade page of ${name}, whose place page bears the country's name, /${iso2.toLowerCase()}/${geo}: the way to that page stays`, steps(buildCellCrumbs({ iso2, geo, trade: "Restaurants", city: name })), `${name} <${href}> / Restaurants`]);
  for (const [label, got, want] of builders) check(`${label}: the trail reads "${want}" (got "${got}")`, got === want, { file: CRUMBS, remedy: R_CRUMB });
  /* Over every place word of every held country: a trade page's trail says no place twice, and a place that has a page of its own is linked from the trail, as its own step
     or as the step that replaced a repeat of the country's name. The name given is the one the bare-code row reads (placeNameOf), which only the words with no page use. */
  const { geoPageTarget } = await import("../../src/lib/geo/page_targets");
  let trailWords = 0, withPage = 0, bearsCountry = 0;
  const trailRepeats: string[] = [], trailLost: string[] = [];
  for (const c of COUNTRIES) {
    for (const w of PLACE_SLUGS_BY_COUNTRY[c.code.toLowerCase()] ?? []) {
      trailWords++;
      const cs = buildCellCrumbs({ iso2: c.code, geo: w, trade: "Restaurants", city: P(c.code, w, c.code) ?? c.name });
      if (cs.some((x, i) => i > 0 && sameLabel(x.label, cs[i - 1].label))) trailRepeats.push(`/${c.code.toLowerCase()}/${w} (${steps(cs)})`);
      const t = geoPageTarget(c.code, w);
      if (!t) continue;
      withPage++;
      if (sameLabel(t.name, c.name)) bearsCountry++;
      if (!cs.some((x) => x.href === t.href)) trailLost.push(`/${c.code.toLowerCase()}/${w} (${t.href}; the trail is ${steps(cs)})`);
    }
  }
  check(`${trailWords} place words of ${COUNTRIES.length} held countries: ${withPage} have a city page or a region page of their own, ${bearsCountry} of those bear their country's name, ${trailRepeats.length} trails say a place twice${trailRepeats.length ? ` (${trailRepeats.slice(0, 3).join(", ")})` : ""} and ${trailLost.length} lose the link to the place's own page${trailLost.length ? ` (${trailLost.slice(0, 3).join(", ")})` : ""}`, trailWords > 0 && withPage > 0 && trailRepeats.length === 0 && trailLost.length === 0, { file: CRUMBS, remedy: R_CRUMB });

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

  /* (2d) THE STATISTICS CODE AT THE SEED'S DOOR, AND THE ADDRESS THAT DOES NOT MOVE. The seed names the site's country (UK reads GB, EL reads GR) and carries the code the
     route received beside it (meta.address_iso2), which the report foot's path reads and nothing else does. The page is drawn from that seed, so the tests that ask "is this
     Great Britain" and every lookup keyed by the country read GB: the country crumb and the licence foot stand on the page, and the report link keeps the page's own address. */
  type Door = { country: string; geo: string; industry: string; iso2: string; name: string; address: string };
  const doors: Door[] = [
    { country: "uk", geo: "uki", industry: "restaurants", iso2: "GB", name: "United Kingdom", address: "UK" },
    { country: "uk", geo: "ukj", industry: "restaurants", iso2: "GB", name: "United Kingdom", address: "UK" },
    { country: "el", geo: "el30", industry: "restaurants", iso2: "GR", name: "Greece", address: "EL" },
    { country: "gb", geo: "boston", industry: "restaurants", iso2: "GB", name: "United Kingdom", address: "GB" },
    { country: "gb", geo: "liverpool", industry: "restaurants", iso2: "GB", name: "United Kingdom", address: "GB" },
    { country: "de", geo: "de", industry: "restaurants", iso2: "DE", name: "Germany", address: "DE" },
    { country: "us", geo: "california", industry: "restaurants", iso2: "US", name: "United States", address: "US" },
  ];
  for (const d of doors) {
    const seed = await buildSpineCellSeed(d.country, d.geo, d.industry);
    const m = seed?.meta;
    check(`/${d.country}/${d.geo}/${d.industry}: the seed's country is ${d.iso2} (${d.name}) and its address keeps ${d.address} (got iso2 ${JSON.stringify(m?.iso2)}, country_name ${JSON.stringify(m?.country_name)}, address_iso2 ${JSON.stringify(m?.address_iso2)})`, m?.iso2 === d.iso2 && m?.country_name === d.name && m?.address_iso2 === d.address, { file: SEED, remedy: R_STAT });
  }
  const { renderToStaticMarkup } = await import("react-dom/server");
  const viewMod = await tryImport<{ SpineCellBody?: (props: { data: unknown }) => unknown }>(() => import("../../src/components/spine/cell/cell-view"));
  check("the cell view loads, so a page can be drawn from a seed", typeof viewMod?.SpineCellBody === "function", { file: VIEW, remedy: R_STAT });
  const ReactApi = (reactNs.default ?? reactNs) as typeof import("react");
  const drawn = async (country: string, geo: string, industry: string): Promise<string> => {
    const seed = await buildSpineCellSeed(country, geo, industry);
    const Body = viewMod?.SpineCellBody;
    return seed && typeof Body === "function" ? renderToStaticMarkup(ReactApi.createElement(Body as never, { data: seed } as never)) : "";
  };
  const reportOf = (markup: string): string | null => /href="(\/corrections\/new\?page=[^"]*)"/.exec(markup)?.[1] ?? null;
  type Drawn = { country: string; geo: string; industry: string; report: string; licence: boolean; gbCrumb: boolean | null };
  const drawnCases: Drawn[] = [
    { country: "uk", geo: "uki", industry: "restaurants", report: "/corrections/new?page=%2Fuk%2Fuki%2Frestaurants", licence: true, gbCrumb: true },
    { country: "el", geo: "el30", industry: "restaurants", report: "/corrections/new?page=%2Fel%2Fel30%2Frestaurants", licence: false, gbCrumb: null },
    { country: "gb", geo: "boston", industry: "restaurants", report: "/corrections/new?page=%2Fgb%2Fboston%2Frestaurants", licence: true, gbCrumb: true },
    { country: "de", geo: "de", industry: "restaurants", report: "/corrections/new?page=%2Fde%2Fde%2Frestaurants", licence: false, gbCrumb: false },
  ];
  for (const c of drawnCases) {
    const markup = await drawn(c.country, c.geo, c.industry);
    const report = reportOf(markup);
    /* The licence foot is the paragraph that carries the attribute; the attribute name also stands in a class of the report line that sits under it. */
    const licence = /<p data-sources-foot[ =>]/.test(markup);
    const gbCrumb = markup.includes('href="/gb"');
    check(`/${c.country}/${c.geo}/${c.industry}: drawn from its seed, the report link names the page's own address (${report}), the United Kingdom's licence foot ${c.licence ? "stands" : "is absent"} (${licence})${c.gbCrumb === null ? "" : `, and the country crumb to /gb ${c.gbCrumb ? "stands" : "is absent"} (${gbCrumb})`}`, markup.length > 0 && report === c.report && licence === c.licence && (c.gbCrumb === null || gbCrumb === c.gbCrumb), { file: VIEW, remedy: R_STAT });
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
    { country: "gb", geo: "scotland", industry: "restaurants", title: "Restaurants: Scotland", label: `Typical revenue in ${THE_UK}`, detail: RANGE, never: "Scotland" },
    { country: "gb", geo: "wales", industry: "restaurants", title: "Restaurants: Wales", label: `Typical revenue in ${THE_UK}`, detail: RANGE, never: "Wales" },
    { country: "gb", geo: "northern-ireland", industry: "restaurants", title: "Restaurants: Northern Ireland", label: `Typical revenue in ${THE_UK}`, detail: RANGE, never: "Northern Ireland" },
    { country: "in", geo: "punjab", industry: "restaurants", title: "Restaurants: Punjab", label: "Typical revenue in India", detail: RANGE, never: "Punjab" },
    { country: "kr", geo: "gyeonggi", industry: "restaurants", title: "Restaurants: Gyeonggi", label: "Typical revenue in South Korea", detail: RANGE, never: "Gyeonggi" },
    { country: "my", geo: "selangor", industry: "restaurants", title: "Restaurants: Selangor", label: "Typical revenue in Malaysia", detail: RANGE, never: "Selangor" },
    { country: "gb", geo: "liverpool", industry: "legal-services", title: `${tradeName("legal-services")}: Liverpool`, none: true },
    /* Stated behaviour, not a rule: the synthetic Boston card, as the head's synthetic Boston row above (round 3A2, the review's M6). */
    { country: "gb", geo: "boston", industry: "legal-services", title: `${tradeName("legal-services")}: United Kingdom`, none: true },
    { country: "uk", geo: "uki", industry: "restaurants", title: "Restaurants: London", label: `Typical revenue in ${THE_UK}`, detail: RANGE, never: "London" },
    { country: "uk", geo: "ukj", industry: "restaurants", title: "Restaurants: South East", label: "Typical revenue", detail: RANGE },
    { country: "el", geo: "el30", industry: "restaurants", title: "Restaurants: Attiki", label: "Typical revenue", detail: RANGE },
    { country: "af", geo: "af", industry: "restaurants", title: "Restaurants: Afghanistan", label: "Typical revenue", detail: RANGE },
    { country: "dk", geo: "dk0", industry: "restaurants", title: "Restaurants: Denmark", label: "Typical revenue", detail: RANGE },
    { country: "be", geo: "be22", industry: "restaurants", title: "Restaurants: Prov. Limburg", label: "Typical revenue", detail: RANGE },
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
