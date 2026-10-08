/**
 * London is Greater London on the city page (plan 06, task B3; his ruling of 2026-10-04: London is Greater London, E12000007,
 * on every page). The page printed four figures of other places or of no place:
 *  - "Visitors 16.0M" off the city list, where the repo's sourced count is 20.9M overnight visits in 2024 (people.json);
 *  - "Per 10,000 residents 371": 531,000 modelled firms over the 14.3M metro, a metro that is not Greater London;
 *  - "Metro GDP $1T": the same metro, approximate on every row;
 *  - residents and visitors 84 and 16: a slope over the metro's residents (no sourced split exists);
 * and "Who is already trading" drew six trades' modelled densities over a modelled total of 531,000 with modelled openings and
 * closures under the plus, where the register counts Greater London's businesses by code.
 *
 * Run: npx tsx tests/spine/london_city.test.ts
 */
import { buildCityHeroBoard } from "../../src/lib/spine/city_hero_board";
import { buildCityMarket } from "../../src/lib/spine/city_market_rows";
import { buildCitySeason } from "../../src/lib/spine/fact_rows";
import { cityPeerListRow } from "../../src/lib/spine/city_peer_list";
import { buildCityPeerTable } from "../../src/lib/spine/peer_rows";
import { cityVisitorsM } from "../../src/lib/spine/city_glance_rows";
import { cityHeldToSources, cityRegisterPlace, UK_CITY_SLUGS } from "../../src/lib/uk/registers/register_city";
import { londonTradeRegister } from "../../src/lib/uk/registers/london_trade";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "london-city";
const FILE = "src/lib/spine/city_hero_board.ts";
const REMEDY = "London's city page prints Greater London's own figures: the sourced visits, the register's counts, and no metro row";
/* The two predicates live in register_city.ts, so a red on one of them points there and not at the London hero. */
const PREDICATE_FILE = "src/lib/uk/registers/register_city.ts";
const PREDICATE_REMEDY = "every UK city with a page is held to sources in cityHeldToSources, only London in cityRegisterPlace; a new UK city needs both decided";
/* The case checks are about how a caller's spelling is read, not about which cities are held: a red on one of them says what the two
   predicates do with case. */
const CASE_REMEDY = "cityHeldToSources lowercases the slug and cityRegisterPlace does not: pass the canonical lowercase slug; cityHeldToSources also reads the country's code in either case and looks the slug up in a Set, so a built-in word names no city";
let failed = 0;
let firstRemedy = REMEDY;
const check = (label: string, ok: boolean, file = FILE, remedy = REMEDY) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  if (failed === 0) firstRemedy = remedy;
  failed++;
  red({ rule: RULE, file, detail: label, remedy });
};

async function main() {
  check("London is held to Greater London, E12000007", cityRegisterPlace("GB", "london")?.geography === "E12000007");
  check("Manchester is not held to a register region", cityRegisterPlace("GB", "manchester") === null);

  /* THE TWO PREDICATES (plan 2026-10-08, uk:cities-sourced-or-marked). cityRegisterPlace says which figures a page reads (London
     alone: Greater London's registers); cityHeldToSources says whether its lines say which figures are estimates (every UK city
     with a page, as countryHeldToRegisters holds the country's page). */
  check(`the UK's cities with a page are the seven (${UK_CITY_SLUGS.join(", ")})`, UK_CITY_SLUGS.join(",") === "birmingham,bristol,edinburgh,glasgow,leeds,london,manchester", PREDICATE_FILE, PREDICATE_REMEDY);
  for (const slug of UK_CITY_SLUGS) check(`${slug}'s page is held to sources`, cityHeldToSources("GB", slug), PREDICATE_FILE, PREDICATE_REMEDY);
  check("the country's code is read in either case", cityHeldToSources("gb", "manchester"), PREDICATE_FILE, CASE_REMEDY);
  check("only London is held to a register region", UK_CITY_SLUGS.filter((s) => cityRegisterPlace("GB", s) !== null).join(",") === "london", PREDICATE_FILE, PREDICATE_REMEDY);
  check("a city outside the UK is not held to sources (Paris)", !cityHeldToSources("FR", "paris"), PREDICATE_FILE, PREDICATE_REMEDY);
  check("a UK city's slug under another country's code is not (Manchester as US)", !cityHeldToSources("US", "manchester"), PREDICATE_FILE, PREDICATE_REMEDY);
  check("a UK address that is no city page is not (the UK aggregate, a London district)", !cityHeldToSources("GB", "gb") && !cityHeldToSources("GB", "west-end"), PREDICATE_FILE, PREDICATE_REMEDY);
  check("a word that names a built-in names no city", !cityHeldToSources("GB", "constructor") && !cityHeldToSources("GB", "__proto__"), PREDICATE_FILE, CASE_REMEDY);
  check("no slug, no city; no country, no city", !cityHeldToSources("GB", "") && !cityHeldToSources("GB", null) && !cityHeldToSources(null, "london"), PREDICATE_FILE, PREDICATE_REMEDY);
  /* The two predicates differ on a slug in capitals: cityHeldToSources lowercases it, cityRegisterPlace does not, so a caller passes
     the canonical lowercase slug to both (the cell view lowercases the place slug once). Only the first is pinned: that London in
     capitals is no register region is an incidental flaw, not a contract. */
  check("cityHeldToSources reads a slug in capitals (Manchester): callers pass the canonical slug", cityHeldToSources("GB", "Manchester"), PREDICATE_FILE, CASE_REMEDY);

  /* THE HERO */
  const hero = buildCityHeroBoard("london");
  const row = (key: string) => hero?.rows.find((r) => r.key === key);
  check("London's visitors are the sourced 20.9M (2024), not the list's 16.0M", row("visitors")?.value === "20.9M");
  check("London's visitors carry a level among the cities", !!row("visitors")?.level);
  check("London's hero has no density over the metro's residents", row("density") === undefined);
  check("London's hero has no metro GDP", row("gdp") === undefined);
  /* The cost of living left London's hero in masterplan step 03 (2026-10-05, the labels audit's items 22 and 24): a hand-anchored
     index no source holds, which a city held to a register region does not print (tests/spine/uk_city_sources.test.ts). */
  check("London keeps its city permits row and prints no hand-anchored cost of living", !!row("permits") && row("living") === undefined);
  const man = buildCityHeroBoard("manchester");
  check("Manchester keeps its density and GDP rows (not held to a region)", !!man?.rows.find((r) => r.key === "density") && !!man?.rows.find((r) => r.key === "gdp"));
  check("Manchester's visitors are a divisor of the country's, not a row", !man?.rows.find((r) => r.key === "visitors"));

  /* ONE VISITOR FIGURE PER CITY */
  check("the visitor resolver: London 20.9, read from the people file", cityVisitorsM({ slug: "london", iso2: "GB", tourist_arrivals_m: 16, sources: { tourist_arrivals_m: "UNWTO / national tourism authority" } }) === 20.9);
  check("the visitor resolver: a divisor of the country's arrivals is no figure", cityVisitorsM({ slug: "munich", iso2: "DE", tourist_arrivals_m: 7, sources: { tourist_arrivals_m: "Extrapolated from country arrivals / tier-2 divisor (3/5/8)" } }) === null);

  /* THE PEERS: the rows the city adapter builds for London's table (adapt_city.ts reads city_peer_list.ts; the adapter itself opens a
     database client a chain test cannot), drawn by the table's own builder. */
  const seed = { meta: { iso2: "GB" }, peers: { list: [cityPeerListRow("london", true), cityPeerListRow("paris", false), cityPeerListRow("munich", false), cityPeerListRow("osaka", false)] } };
  const table = buildCityPeerTable(seed);
  const home = table?.rows.find((r) => r.home);
  check("the peers table's London row prints the hero's 20.9M", home?.values.visitors === 20.9);
  const munich = table?.rows.find((r) => r.key === "munich");
  const osaka = table?.rows.find((r) => r.key === "osaka");
  check("a peer whose visitors are a divisor of its country's prints a dash (Munich)", munich !== undefined && munich.values.visitors === null);
  check("a peer whose visitors are a divisor of its country's prints a dash (Osaka)", osaka !== undefined && osaka.values.visitors === null);
  check("a peer whose visitors a tourism body counted keeps its count (Paris, 19.0M)", table?.rows.find((r) => r.key === "paris")?.values.visitors === 19);

  /* THE SEASON */
  const season = buildCitySeason("london");
  check("London's residents and visitors split draws nothing (no sourced split exists)", season !== null && season.cells.length === 0 && season.figures.resident === null);
  const manSeason = buildCitySeason("manchester");
  check("a city with its own footfall row still draws its split (Manchester)", manSeason !== null && manSeason.cells.length === 2);

  /* WHO IS ALREADY TRADING */
  const market = buildCityMarket("london");
  check("London's market card is the register's", market?.form === "register");
  check("the focal is the register's own total for the trades drawn, never the modelled 531,000", market?.focal?.figure === (market?.rows ?? []).reduce((n, r) => n + r.value, 0).toLocaleString("en-US") && market?.focal?.tag === "held");
  check("no plus of modelled openings and closures", market?.detail === null);
  check("nothing on the card is modelled", market?.sample === false);
  const counts = new Map((market?.rows ?? []).map((r) => [r.key, r.value]));
  const reg = (slug: string) => londonTradeRegister(slug)?.enterprises;
  check(`restaurants: the register's ${reg("restaurants")} London businesses`, counts.get("restaurants") === reg("restaurants") && reg("restaurants") === 7865);
  check(`hair and beauty: every 96020 business, ${reg("hairdressers-beauty")}`, counts.get("hairdressers-beauty") === reg("hairdressers-beauty") && reg("hairdressers-beauty") === 9695);
  check("each shared code is named as its group, never as one trade", market?.rows.find((r) => r.key === "cafes-coffee-shops")?.name === "Cafés, unlicensed restaurants");
  check("every row's name is three words at the most (the model laws' ROW SENTENCE)", (market?.rows ?? []).every((r) => r.name.split(/\s+/).length <= 3));
  check("six trades, one row a code", market?.rows.length === 6 && new Set(market.rows.map((r) => r.value)).size === 6);
  check("the largest first", (market?.rows ?? []).every((r, i, a) => i === 0 || a[i - 1].value >= r.value));
  check("the basis says whose counts they are", market?.basis === "Registered businesses in these trades, London, March 2026.");
  const manMarket = buildCityMarket("manchester");
  check("Manchester keeps its densities (not held to a region)", manMarket !== null && manMarket.form === "density");

  if (failed > 0) { redSummary(RULE, failed, firstRemedy, "checks failed"); process.exit(1); }
  console.log("spine/london_city: all pass");
}

main().catch((e) => { console.error(e); process.exit(1); });
