/**
 * WHERE A HOME SEARCH LANDS (milestone 3, masterplan step 33; his ruling 11 of 2026-09-26: a place-and-trade search, the UK
 * first). The destination answers only with pages that exist, read off the lists the routes and the sitemap read: the seven UK
 * cities against rule 32's six trades, anywhere in the UK, a city alone and the UK alone, never /gb/gb/...; elsewhere, today's
 * behaviour. The form opens on restaurants in London, offers the UK's seven cities and submits through the destination with no
 * alert; /search lists pages that exist, at most a screen of them; and no dialog search is left in the header. Since plan 2026-10-09
 * (home introduction): the picker's three examples are rule 32's trades, each a link to the London page that answers it; the h1 asks
 * the example's question first; the site's one definition is the structured data's. Since plan 2026-10-10 (home reform, Task 2): the
 * three are other trades than the case the form opens on, and the form paints them from the server's seed (src/lib/home/picker.ts).
 * Since plan 2026-10-13 (home, quiet editorial, Task 3): the examples left the picker, and every case of the h1 the picker follows
 * lands on a page the edge serves, the first the form's own seed.
 *
 * Run: npx tsx tests/home/destination.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { homeDestination, UK_CITIES } from "../../src/lib/home/destination";
import { homePickerSeed, countryOptions, cityOptions, businessOptions } from "../../src/lib/home/picker";
import { HERO_BUSINESSES, HERO_CITIES } from "../../src/lib/hero-words";
import { COPY } from "../../src/lib/spine/copy";
import { getCitiesForCountryCode, CASCADE_PREFILLS } from "../../src/lib/home/search_cascade";
import { searchSite, SEARCH_ROWS_MAX } from "../../src/lib/home/site_search";
import { countryPageTarget } from "../../src/lib/geo/page_targets";
import { homePickerCases, pickerCaseFor } from "../../src/lib/home/picker_cases";
import { edgeNotFound } from "../../src/lib/routing/edge_not_found";
import { SLUG_TO_INDUSTRY } from "../../src/lib/taxonomy";
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

/* THE H1'S CASES LAND (plan 2026-10-13 home-quiet-editorial, Task 3; Review Focus 2): the picker follows the h1's words through
   homePickerCases (src/lib/home/picker_cases.ts), one case a tick; every case it keeps is a search that lands on a page the edge serves
   (src/lib/routing/edge_not_found.ts), its labels the lists' own, and the first is the form's own seed; a case it cannot keep is null and
   named here. BLIND SPOT: edgeNotFound is the edge's answer, so it cannot tell a page that renders from a route that answers notFound()
   after the edge lets the address through; the production probe after a push is that instrument. */
const CASES = "src/lib/home/picker_cases.ts";
const cases = homePickerCases();
const named = cases.map((c, i) => `${HERO_BUSINESSES[i % HERO_BUSINESSES.length]} in ${HERO_CITIES[i % HERO_CITIES.length]}: ${c ? "followed" : "kept on screen"}`);
check(`one case a tick of the h1's lap (${cases.length}: ${named.join("; ")})`, cases.length === HERO_CITIES.length && cases[0] !== null, { file: CASES, remedy: "return one case a tick, HERO_TICKS of them, the first restaurants in London" });
check("the first case is the form's own seed, so the first paint and the h1 ask one question", JSON.stringify(cases[0]) === JSON.stringify(homePickerSeed()), { file: CASES });
const kept = cases.filter((c): c is NonNullable<typeof c> => c !== null);
const landings = kept.map((c) => homeDestination({ country: c.country.value, city: c.city.value, trade: c.business.value }));
const nowhere = landings.filter((p) => edgeNotFound(p));
check(`every case the picker follows lands on a page the edge serves (${landings.join(", ")})${nowhere.length ? `; nowhere: ${nowhere.join(", ")}` : ""}`, nowhere.length === 0, { file: CASES, remedy: "return null for a case whose search the edge answers with 404 (edgeNotFound)" });
const label = (list: Array<{ value: string; label: string }>, value: string) => list.find((o) => o.value === value)?.label;
check("every case the picker follows carries the lists' own labels", kept.every((c) => label(countryOptions(), c.country.value) === c.country.label && label(cityOptions(c.country.value), c.city.value) === c.city.label && label(businessOptions({ revealMixed: false, revealCorp: false }), c.business.value) === c.business.label), { file: CASES });
check("a word no activity answers, or a city no list holds, is no case (null), and London's restaurant is the seed", pickerCaseFor("zzzzqq", "London") === null && pickerCaseFor("restaurant", "Atlantis") === null && JSON.stringify(pickerCaseFor("restaurant", "London")) === JSON.stringify(homePickerSeed()), { file: CASES });
check(`the h1 asks the example's question first ("a ${HERO_BUSINESSES[0]}" in "${HERO_CITIES[0]}"), the words his, the order changed only`, HERO_BUSINESSES[0] === "restaurant" && HERO_CITIES[0] === "London" && [...HERO_BUSINESSES].sort().join() === "bakery,barber,boutique,butcher,gym,hotel,pharmacy,restaurant", { file: "src/lib/hero-words.ts", remedy: "keep \"restaurant\" first in HERO_BUSINESSES and \"London\" first in HERO_CITIES: the words are his, the order only is changed" });
check(`the site's definition is one sentence of twelve words at most ("${COPY.home.definition}")`, COPY.home.definition.split(/\s+/).length <= 12 && !COPY.home.definition.includes(";"), { file: "src/lib/spine/copy.ts", remedy: "COPY.home.definition: one sentence of twelve words at most, no semicolon" });
check("the structured data's Organization description is that definition", /export function Organization\(\)[\s\S]*?description: COPY\.home\.definition/.test(readFileSync("src/components/StructuredData.tsx", "utf8")), { file: "src/components/StructuredData.tsx", remedy: "set Organization()'s description to COPY.home.definition, the site's one definition" });

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("home/destination: all pass");
