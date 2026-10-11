/**
 * WHERE A HOME SEARCH LANDS (milestone 3, masterplan step 33; his ruling 11 of 2026-09-26: a place-and-trade search, the UK
 * first). The destination answers only with pages that exist, read off the lists the routes and the sitemap read: the seven UK
 * cities against rule 32's six trades, anywhere in the UK, a city alone and the UK alone, never /gb/gb/...; elsewhere, today's
 * behaviour. The form opens on restaurants in London, offers the UK's seven cities and submits through the destination with no
 * alert; /search lists pages that exist, at most a screen of them; and no dialog search is left in the header. Since plan 2026-10-09
 * (home introduction): the picker's three examples are rule 32's trades, each a link to the London page that answers it; the h1 asks
 * the example's question first; the site's one definition is the structured data's. Since plan 2026-10-10 (home reform, Task 2): the
 * three are other trades than the case the form opens on, and the form paints them from the server's seed (src/lib/home/picker.ts).
 *
 * Run: npx tsx tests/home/destination.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { homeDestination, UK_CITIES, HOME_TRY, HOME_TRY_CITY, homeTryLinks, homeTryCityLabel } from "../../src/lib/home/destination";
import { homePickerSeed } from "../../src/lib/home/picker";
import { londonTradeHero } from "../../src/lib/spine/london_trade_hero";
import { HERO_BUSINESSES, HERO_CITIES } from "../../src/lib/hero-words";
import { COPY } from "../../src/lib/spine/copy";
import { getCitiesForCountryCode, CASCADE_PREFILLS } from "../../src/lib/home/search_cascade";
import { searchSite, SEARCH_ROWS_MAX } from "../../src/lib/home/site_search";
import { countryPageTarget } from "../../src/lib/geo/page_targets";
import { SLUG_TO_INDUSTRY, INDUSTRY_BY_ID } from "../../src/lib/taxonomy";
import { RETIRED } from "../../src/lib/taxonomy/retired";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-destination";
const FILE = "src/lib/home/destination.ts";
const REMEDY = "answer a home search only with a page that exists, read off the lists the routes and the sitemap read, the UK first";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

/* Rule 32's example trades, by their taxonomy ids: the six of v1 and, since v2 (2026-07-12), the cafe and the bar
   (scripts/verify_trade_set.ts ALLOWED_RAW holds the words). */
const RULE_32 = ["restaurants", "grocery_stores", "health_beauty_stores", "hairdressers_beauty", "sports_fitness", "auto_repair_shops", "cafes_coffee", "bars_nightclubs"];
type Entry = { slug: string; iso2: string };
const LIST = (JSON.parse(readFileSync("data/cities/city_list_v1.json", "utf8")) as { cities: Entry[] }).cities.filter((c) => c.iso2.toUpperCase() === "GB").map((c) => c.slug).sort();
check(`the generated UK cities are the city list's (${LIST.join(", ")})`, LIST.length === 7 && JSON.stringify(UK_CITIES.map((c) => c.slug).sort()) === JSON.stringify(LIST));

/** A page exists, by the lists the routes and the sitemap read. */
const exists = (p: string): boolean => {
  let m: RegExpExecArray | null;
  if (p === "/gb") return countryPageTarget("gb")?.href === "/gb";
  if ((m = /^\/gb\/london\/([a-z0-9-]+)$/.exec(p))) return m[1] in SLUG_TO_INDUSTRY && !(m[1] in RETIRED);
  if ((m = /^\/cities\/([a-z0-9-]+)$/.exec(p))) return LIST.includes(m[1]);
  if ((m = /^\/industries\/([a-z0-9-]+)$/.exec(p))) return m[1] in SLUG_TO_INDUSTRY && !(m[1] in RETIRED);
  return false;
};
const answers: string[] = [];
for (const city of [...LIST, ""]) for (const trade of [...RULE_32, ""]) answers.push(homeDestination({ country: "GB", city, trade }));
const missing = answers.filter((a) => !exists(a));
check(`every UK answer (the seven cities and anywhere, against rule 32's ${RULE_32.length} trades and none: ${answers.length}) is a page that exists${missing.length ? `: not ${missing.join(", ")}` : ""}`, missing.length === 0);
check("none is /gb/gb/...", answers.every((a) => !a.startsWith("/gb/gb/")));
check("London and a trade land on London's trade page", homeDestination({ country: "GB", city: "london", trade: "restaurants" }) === "/gb/london/restaurants");
check("another UK city and a trade land on the city's own page", homeDestination({ country: "GB", city: "leeds", trade: "restaurants" }) === "/cities/leeds");
check("anywhere in the UK and a trade land on the trade's own page", homeDestination({ country: "GB", city: "", trade: "restaurants" }) === "/industries/restaurants");
check("a UK city alone lands on its page, the UK alone on /gb", homeDestination({ country: "GB", city: "bristol" }) === "/cities/bristol" && homeDestination({ country: "GB" }) === "/gb");
check("a slug works as an id does (the no-script form sends slugs)", homeDestination({ country: "gb", city: "london", trade: "auto-repair-shops" }) === "/gb/london/auto-repair-shops");
check("elsewhere, today's behaviour: the city's cell path", homeDestination({ country: "US", city: "los-angeles", trade: "restaurants" }) === "/us/los-angeles/restaurants");
check("elsewhere with no trade, the country's page", homeDestination({ country: "FR" }) === "/fr");
check("an unknown country goes home", homeDestination({ country: "XX", trade: "restaurants" }) === "/");

/* The form. */
check("the form opens on restaurants in London", CASCADE_PREFILLS[0].country === "GB" && CASCADE_PREFILLS[0].city === "london" && CASCADE_PREFILLS[0].business === "restaurants");
check("the form offers the UK's seven cities", JSON.stringify(getCitiesForCountryCode("GB").map((c) => c.slug).sort()) === JSON.stringify(LIST));
const form = readFileSync("src/components/NavigatorForm.tsx", "utf8");
check("the form submits through the destination and opens no alert", /homeDestination\(/.test(form) && !/\balert\(/.test(form));
const go = readFileSync("src/app/api/go/route.ts", "utf8");
check("the no-script route answers through the same destination", /homeDestination\(/.test(go));

/* The search page. */
const london = searchSite("london");
check(`a search for London lists the city first, at most ${SEARCH_ROWS_MAX} rows`, london.uk[0]?.href === "/cities/london" && london.uk.length + london.world.length <= SEARCH_ROWS_MAX);
const rows = [...searchSite("rest").uk, ...searchSite("leeds").uk, ...searchSite("uk").uk];
check(`every UK row the search lists is a page that exists (${rows.length} read)`, rows.length > 0 && rows.every((r) => exists(r.href)));
check("a query under two letters lists nothing", searchSite("l").uk.length + searchSite("l").world.length === 0);

/* No dialog search left. */
check("the header's search is a link to /search, and the dialog is gone", /href="\/search"/.test(readFileSync("src/components/HeaderSearch.tsx", "utf8")) && !existsSync("src/components/GlobalSearch.tsx"));

/* THE PICKER'S EXAMPLES AND THE HERO (plan 2026-10-09, home introduction, Task 9; the home's spec, sections 3 and 5; plan 2026-10-10,
   home reform, Task 2: three other trades than the case, the critique's P1.14). */
const tries = homeTryLinks();
check(`the picker's three examples are rule 32's trades, none of them the case the form opens on (${HOME_TRY.map((t) => t.trade).join(", ")})`, HOME_TRY.length === 3 && HOME_TRY.every((t) => RULE_32.includes(t.trade) && t.trade !== CASCADE_PREFILLS[0].business), { remedy: "set HOME_TRY to three of rule 32's trades other than CASCADE_PREFILLS[0].business, each a London page that prints the register's figures" });
check(`each lands on its London trade page, a page that exists (${tries.map((t) => t.href).join(", ")})`, tries.length === 3 && tries.every((t) => /^\/gb\/london\/[a-z0-9-]+$/.test(t.href) && exists(t.href)));
check("each London page prints the register's figures", tries.every((t) => londonTradeHero(t.href.split("/").pop() as string) !== null));
check(`the examples' city is the form's own (${homeTryCityLabel()})`, homeTryCityLabel() === "London" && HOME_TRY_CITY === CASCADE_PREFILLS[0].city);
check("the form prints the examples as links, the seed's from the server (homeTryLinks through homePickerSeed), and names no city page's trade", JSON.stringify(homePickerSeed().tries) === JSON.stringify(tries) && /seed\?\.tries/.test(form) && /<a href=\{t\.href\}/.test(form) && !/salons in Manchester|gyms in Leeds/.test(form), { file: "src/components/NavigatorForm.tsx", remedy: "print the picker's examples as the links the seed carries (homePickerSeed, src/lib/home/picker.ts, gives homeTryLinks()), and name no city page's trade in the line" });
/* Each example's word is the trade's own: a link reads as the page it opens ({trade: grocery_stores, word: gyms} would not). The trade's
   name, one of its examples, or an example's last word, the noun it names ("cafés" of "neighborhood cafés"). */
const unnamed = HOME_TRY.filter((t) => { const industry = INDUSTRY_BY_ID[t.trade]; const examples = industry?.examples ?? []; return !industry || ![industry.name, ...examples, ...examples.map((e) => e.split(/\s+/).pop() ?? "")].some((s) => s.toLowerCase() === t.word.toLowerCase()); }).map((t) => `${t.word} (${t.trade})`);
check(`each example's word is its trade's name, one of its examples or an example's noun in the taxonomy (${HOME_TRY.map((t) => `${t.word} in ${t.trade}`).join(", ")})${unnamed.length ? `; not so: ${unnamed.join(", ")}` : ""}`, unnamed.length === 0, { remedy: "set each HOME_TRY word to the name, one of the examples, or an example's last word of its taxonomy trade (src/lib/taxonomy/industries.json), so a link reads as the page it opens" });
check(`the h1 asks the example's question first ("a ${HERO_BUSINESSES[0]}" in "${HERO_CITIES[0]}"), the words his, the order changed only`, HERO_BUSINESSES[0] === "restaurant" && HERO_CITIES[0] === "London" && [...HERO_BUSINESSES].sort().join() === "bakery,barber,boutique,butcher,gym,hotel,pharmacy,restaurant", { file: "src/lib/hero-words.ts", remedy: "keep \"restaurant\" first in HERO_BUSINESSES and \"London\" first in HERO_CITIES: the words are his, the order only is changed" });
check(`the site's definition is one sentence of twelve words at most ("${COPY.home.definition}")`, COPY.home.definition.split(/\s+/).length <= 12 && !COPY.home.definition.includes(";"), { file: "src/lib/spine/copy.ts", remedy: "COPY.home.definition: one sentence of twelve words at most, no semicolon" });
check("the structured data's Organization description is that definition", /export function Organization\(\)[\s\S]*?description: COPY\.home\.definition/.test(readFileSync("src/components/StructuredData.tsx", "utf8")), { file: "src/components/StructuredData.tsx", remedy: "set Organization()'s description to COPY.home.definition, the site's one definition" });

/* THE REGISTRY NAMES WHAT THE TRADE-SET GATE READS (fix round F1, group G6; the final review's M7, hi-minors 31). scripts/gates.json is generated from the
   path literals in each gate's script, and verify_trade_set.ts kept a documentation constant naming src/components/NavigatorForm.tsx (the launcher it has
   exempted since rule 32 v2) long after its Part 3 began to read HOME_TRY from this module, so anything that maps a changed file to its gates missed the
   one gate that holds the picker's examples to rule 32. BLIND SPOT: the registry is read as written (counts-fresh holds it equal to what the scripts say);
   a read the gate makes through an import with no path literal is seen only because the script names the file once. */
const tradeSet = (JSON.parse(readFileSync("scripts/gates.json", "utf8")) as { gates: Array<{ name: string; reads?: string[] }> }).gates.find((g) => g.name === "trade-set");
check(`the registry lists ${FILE}, which the trade-set gate reads for HOME_TRY, among its reads, and not the launcher it exempts (${(tradeSet?.reads ?? []).join(", ") || "no reads"})`, !!tradeSet && (tradeSet.reads ?? []).includes(FILE) && !(tradeSet.reads ?? []).includes("src/components/NavigatorForm.tsx"), { file: "scripts/verify_trade_set.ts", remedy: "name src/lib/home/destination.ts as a path literal in scripts/verify_trade_set.ts (HOME_TRY_FILE, used in its failure heading), drop the NAVIGATOR_FORM documentation constant, then run node node_modules/tsx/dist/cli.mjs scripts/counts.ts --write" });

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("home/destination: all pass");
