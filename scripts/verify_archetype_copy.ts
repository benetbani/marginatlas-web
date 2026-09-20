/**
 * verify_archetype_copy , the browser-free half of the archetype harness, so it
 * can sit in the prebuild chain (no network, no secret, no browser).
 *
 * For EVERY country the taxonomy lists it builds the answer card's facts and
 * checks the copy and the promises:
 *  REGISTER: no banned corporate word in any label, note or subtitle (founder
 *    ruling 11 of 2026-09-04).
 *  LABELS: a label is four words or fewer; a note is one plain line under 48
 *    characters.
 *  PROMISE: the subtitle names registration only when the registration cost
 *    cell resolves; it names the answer only when the answer resolves.
 *  NO EMPTY SLOT: no cell carries an empty value.
 *  TAG: a modelled answer is marked modelled, so the card tags it.
 *  PAY: every country's pay pair is withheld exactly when the average is
 *    under 110 percent of the minimum, the words are the founder's, and no
 *    figure exceeds the world's highest.
 *  DOORS: every country's terminus holds at most three doors, one pill,
 *    distinct first words, no "with Pro", and every href resolves to a route
 *    in the app folder (route groups dropped, [params] matched).
 *  NOTES: every authored note list holds at most five notes, a label of at
 *    most seven words and a fact of at most 140 characters, no banned word.
 *  SEATS: every drawn blocked seat's copy (MODEL.md 8.2; plan step 31's
 *    seventh dispatch, 2026-09-18): one line in the site's idiom, under
 *    fifteen words, a foot naming a DATA-REQUIREMENTS item, no banned word,
 *    a kicker within four words that is the drawn card's own; and the four
 *    thin-country seats' conditions counted over the taxonomy from the
 *    builders the view reads, so the count a comment quotes is measured.
 *  CITY CARDS (QUEUE country:cities-covered-list, 2026-09-19): every
 *    country's cards are the covered list's rows largest first, eight at
 *    most, every href a slug the city route serves, every figure the list's
 *    own, every card promising customer pay with a photograph, the region
 *    sub-line the draft's where it holds one; counted over the taxonomy.
 * BLIND SPOT: it cannot see a wrap or a hole; the browser half does that.
 */
import { COUNTRIES } from "@/lib/taxonomy";
import { buildHeroFacts } from "@/lib/spine/hero_facts";
import { COPY } from "@/lib/spine/copy";
import { buildPeerTable, buildCityPeerTable } from "@/lib/spine/peer_rows";
import { marginCardFromSnapshot, snapshotCountries } from "@/lib/spine/margin_rows";
import { buildLocalsNotes, countriesWithNotes, NOTE_CAP, LABEL_WORDS_CAP, FACT_CHARS_CAP } from "@/lib/spine/locals_rows";
import { buildCloseDoors, buildCityCloseDoors, buildCompareDoor, buildTradeCloseDoors, buildIndustryCloseDoors, industryLeader } from "@/lib/spine/close_rows";
import { buildKnow, countKnow, failureRows, KNOW_FAILURE_MODES_CAP } from "@/lib/spine/know_rows";
import { getActivityCharacter } from "@/lib/content/activity_character";
import { getFailureModes } from "@/lib/qa/industry_failure_modes";
import { FIELD_CELLS, fieldCells, fieldWithheld } from "@/components/spine/industry/turn-three";
import { buildChecks, CHECKS_BANK, WAIT_DAYS_THRESHOLD } from "@/lib/spine/checks_rows";
import { getSmbRegime } from "@/lib/tax/smb_effective_rates";
import { getFormationRowByTier } from "@/lib/tax/country_rates";
import { buildPayBars, PAY_RATIO_FLOOR } from "@/lib/spine/pay_rows";
import { buildGlance } from "@/lib/spine/glance_rows";
import { buildWorldSeat } from "@/lib/spine/world_seat_rows";
import { buildCityGlance, CITY_GLANCE_CELLS, isVisitorsRead } from "@/lib/spine/city_glance_rows";
import { buildCitySeat } from "@/lib/spine/city_seat_rows";
import { buildCityLiving, buildCityRunway, buildCityDemand, buildCitySeason, CITY_LIVING_CELLS } from "@/lib/spine/fact_rows";
import { buildCityPeopleTable } from "@/lib/spine/character_rows";
import { buildCityNeighbourhoods, PLACEHOLDER_SCHEME } from "@/lib/spine/hood_rows";
import { districtPageTarget } from "@/lib/geo/page_targets";
import { spineHoodCities, spineHoodDistricts, HOOD_BENCHMARK_TRADE } from "@/lib/spine/hood_scheme";
import { buildHoodTake, againstCheapest, byRent } from "@/lib/spine/hood_take_rows";
import { buildHoodRank } from "@/lib/spine/hood_rank_rows";
import { buildHoodPremium, visitorsFmt } from "@/lib/spine/hood_premium_rows";
import { buildHoodCompare } from "@/lib/spine/hood_compare_rows";
import { buildHoodCharacter, openingLine, CHARACTER_FACT_CHARS_CAP } from "@/lib/spine/hood_character_rows";
import { buildHoodCloseDoors } from "@/lib/spine/close_rows";
import { buildCityEarningsStrip } from "@/lib/spine/range_rows";
import { cityTypicalIncome } from "@/lib/spine/city_income";
import { usd } from "@/components/spine/kit";
import { buildPremisesBento } from "@/lib/spine/premises_bento_rows";
import { buildEntryBill } from "@/lib/spine/entry_bill_rows";
import { buildRunningCosts } from "@/lib/spine/running_costs_rows";
import { buildHowTo } from "@/lib/spine/howto_rows";
import { buildCityDistrictBars, rentMult, countWord } from "@/lib/spine/district_rows";
import { DOOR_CAP } from "@/components/spine/archetypes/Terminus";
import { MARK_LIST_FLOOR } from "@/components/spine/archetypes/MarkList";
import { SEAT_LINE_WORDS_CAP } from "@/components/spine/archetypes/BlockedSeat";
import { buildCityCards, CITY_CARDS_CAP, CITY_CARD_LANDS, CITY_CARD_PLACEHOLDER_IMAGE } from "@/lib/spine/city_cards";
import { normalizePlaceName } from "@/lib/cities/city_pages";
import { buildCitiesSeat, cutCitiesSeatTables, sayNames, LIVE_CITIES_SEAT_TABLES, PROFILE_REGIONS, CITIES_SEAT_NAMES_CAP } from "@/lib/spine/country_cities_seat";
import { buildSetupRows } from "@/lib/spine/setup_rows";
import { buildMarkList, MARK_LIST_CAP } from "@/lib/spine/mark_list_rows";
import { resolveTradeNet, countTradeNets, netText } from "@/lib/spine/trade_net";
import { buildSuits } from "@/lib/spine/suits_rows";
import { buildTradeSpread } from "@/lib/spine/trade_spread_rows";
import { tradeHeroFacts } from "@/lib/spine/trade_hero_facts";
import { ALL_INDUSTRIES, INDUSTRIES, industryToSlug } from "@/lib/taxonomy";
import { buildPermits } from "@/lib/spine/permits_rows";
import { buildOpen, buildOpenFoot, countOpenStates } from "@/lib/spine/open_rows";
import { resolveSplit, countSplitStates, shardCostLines, driverLabel, LABEL_WORDS_CAP as SPLIT_LABEL_WORDS_CAP } from "@/lib/spine/split_rows";
import { buildTeam, countTeamRows, roleLines, TEAM_ROWS_CAP } from "@/lib/spine/team_rows";
import { buildTradePeers, TRADE_PEERS_CAP } from "@/lib/spine/trade_peer_rows";
import { buildClears } from "@/lib/spine/clears_rows";
import { buildLasts } from "@/lib/spine/lasts_rows";
import { buildMix, MIX_WHOLE, MIX_SUM_TOLERANCE } from "@/lib/spine/mix_rows";
import { buildRivals } from "@/lib/spine/rivals_rows";
import { buildWorth, countWorthBases } from "@/lib/spine/worth_rows";
import { startupCapitalArchetypeKeyed } from "@/lib/markets/startup_capital_archetypes";
import { buildMarket, densityText, MARKET_CELLS } from "@/lib/spine/market_rows";
import { industryHeroFacts, countIndustryHeroStates, INDUSTRY_HERO_CELLS, INDUSTRY_HERO_METRICS } from "@/lib/spine/industry_hero_facts";
import { buildBenchmark, countBenchmarkStates, BENCHMARK_FLOOR, BENCHMARK_ROWS_CAP } from "@/lib/spine/benchmark_rows";
import { buildIndustrySplit } from "@/lib/spine/split_rows";
import { buildIndustryOpen, countIndustryOpen, INDUSTRY_OPEN_CELLS } from "@/lib/spine/industry_open_rows";
import { buildPays, countPays, PAYS_CELLS } from "@/lib/spine/pays_rows";
import { buildIndustryPlaces, countIndustryPlaces, holdsBoth, withheldReason, PLACES_FLOOR } from "@/lib/spine/industry_places_rows";
import { buildFormats, countFormats, FORMATS_METRICS, FORMAT_NAME_FITS } from "@/lib/spine/formats_rows";
import { industryRows } from "@/lib/facts/industry_shard";
import { MAJOR_CITIES } from "@/lib/markets/major_cities";
import type { CityColumn } from "@/lib/markets/across_cities";
import { monthsFigure, yearsFigure } from "@/lib/spine/open_rows";
import { shareFigure } from "@/lib/spine/clears_rows";
import { shardRoles } from "@/lib/spine/team_rows";
import { daysFigure } from "@/lib/spine/entry_bill_rows";
import { industryFigure } from "@/lib/facts/industry_shard";
import { INDUSTRY_BY_ID } from "@/lib/taxonomy";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import cityListJson from "../data/cities/city_list_v1.json";
import top100Json from "../src/lib/cities/top100.json";

/** Every cost driver name a shard holds, whatever its tag, for the short-label census (plan step 33's third dispatch). */
function shardCostLineNames(id: string): string[] {
  const shard = JSON.parse(readFileSync(join("data/facts/industry", `${id}.json`), "utf8")) as { facts: Array<{ metric: string; value: unknown }> };
  return shard.facts.filter((f) => f.metric === "cost_structure.cost_drivers.*.name" && typeof f.value === "string").map((f) => f.value as string);
}

const reds: string[] = [];
/** The city's name as the list holds it, for the hood take's crumb check. */
const hoodCityName = (slug: string) => (cityListJson as { cities: Array<{ slug: string; name: string }> }).cities.find((c) => c.slug === slug)?.name ?? slug;
const codes = (COUNTRIES as any[]).map((c) => String(c.code ?? c.iso2 ?? "").toUpperCase()).filter((c) => c.length === 2);
let rendered = 0;
let noAnswer = 0;
for (const iso2 of codes) {
  const f = buildHeroFacts(iso2);
  if (!f.answer && f.cells.length === 0) continue;
  rendered++;
  if (!f.answer) noAnswer++;
  const texts = [f.subtitle ?? "", f.answer?.label ?? "", ...f.cells.flatMap((c) => [c.label, c.note ?? "", c.group ?? ""])];
  for (const t of texts) for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`${iso2}: banned word "${b}" in "${t}"`);
  for (const c of f.cells) {
    if (c.label.split(/\s+/).length > 4) reds.push(`${iso2}: label over four words: "${c.label}"`);
    if (c.note && c.note.length > 48) reds.push(`${iso2}: note over 48 characters: "${c.note}"`);
    if (c.value === "" || c.value == null) reds.push(`${iso2}: empty cell ${c.key}`);
  }
  const promisesRegister = /register/i.test(f.subtitle ?? "");
  if (promisesRegister !== f.cells.some((c) => c.key === "llc-cost")) reds.push(`${iso2}: the subtitle's promise does not match the cells ("${f.subtitle}")`);
  if (f.answer && f.answer.confidence === "measured") reds.push(`${iso2}: the effective rate is a modelled figure and is not marked so`);
}
/* THE COMPARISON TABLE: every country's rows build without a throw; the
   heads and the caveat carry no banned word; a table never has a single row. */
let peerTables = 0;
for (const iso2 of codes) {
  const t = buildPeerTable(iso2);
  if (!t) continue;
  peerTables++;
  if (t.rows.length < 2) reds.push(`${iso2}: a peer table with one row`);
  for (const txt of [t.caveat, ...t.columns.map((c) => c.head)]) for (const b of COPY.banned) if (txt.toLowerCase().includes(b)) reds.push(`${iso2}: banned word "${b}" in the peers table`);
}
/* THE RANKED BARS: from the snapshot, a card never carries a loss or a floor
   as a row, and the withheld line counts what it dropped. */
let barCards = 0;
for (const iso2 of snapshotCountries()) {
  const card = marginCardFromSnapshot(iso2);
  if (!card || card.rows.length < 2) continue;
  barCards++;
  for (const r of card.rows) if (!(r.margin > 0.03)) reds.push(`${iso2}: a floored or negative margin reached the card (${r.name})`);
  if (card.withheld > 0 && !card.withheldLine) reds.push(`${iso2}: rows withheld without a line`);
}
let noteLists = 0;
for (const iso2 of countriesWithNotes()) {
  const d = buildLocalsNotes(iso2);
  if (!d) continue;
  noteLists++;
  if (d.notes.length > NOTE_CAP) reds.push(`${iso2}: ${d.notes.length} notes, over ${NOTE_CAP}`);
  for (const n of d.notes) {
    if (n.label.split(/\s+/).length > LABEL_WORDS_CAP) reds.push(`${iso2}: a note label over ${LABEL_WORDS_CAP} words: "${n.label}"`);
    if (n.fact.length > FACT_CHARS_CAP) reds.push(`${iso2}: a note fact over ${FACT_CHARS_CAP} characters: "${n.fact.slice(0, 40)}"`);
    for (const b of COPY.banned) if (`${n.label} ${n.fact}`.toLowerCase().includes(b)) reds.push(`${iso2}: banned word "${b}" in a note`);
    if (/\u2014/.test(n.label + n.fact)) reds.push(`${iso2}: an em dash in a note`);
  }
}
/* THE ROUTES, read from the app folder: every page.tsx becomes a pattern with
   route groups "(site)" dropped and "[param]" as one path segment. */
function routePatterns(): RegExp[] {
  const out: RegExp[] = [];
  const walk = (dir: string, segs: string[]) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) { walk(full, name.startsWith("(") ? segs : [...segs, name]); continue; }
      if (name === "page.tsx") out.push(new RegExp("^/" + segs.map((sg) => (sg.startsWith("[") ? "[^/]+" : sg.replace(/[.*+?^${}()|\\]/g, "\\$&"))).join("/") + "/?$"));
    }
  };
  walk("src/app", []);
  return out;
}
const ROUTES = routePatterns();
const resolves = (href: string) => ROUTES.some((re) => re.test(href.split("?")[0].split("#")[0]));
function checkDoors(iso2: string, doors: ReturnType<typeof buildCloseDoors>, page: string) {
  if (doors.length > DOOR_CAP) reds.push(`${iso2} ${page}: ${doors.length} doors, over ${DOOR_CAP}`);
  if (doors.filter((d) => d.kind === "pill").length > 1) reds.push(`${iso2} ${page}: more than one pill door`);
  const firsts = doors.map((d) => d.label.split(/\s+/)[0].toLowerCase());
  if (new Set(firsts).size !== firsts.length) reds.push(`${iso2} ${page}: doors share a first word (${firsts.join(", ")})`);
  for (const d of doors) {
    if (!resolves(d.href)) reds.push(`${iso2} ${page}: door "${d.label}" points at ${d.href}, which is not a route`);
    if (/with pro/i.test(d.label)) reds.push(`${iso2} ${page}: a door promises "with Pro"`);
    for (const b of COPY.banned) if (d.label.toLowerCase().includes(b)) reds.push(`${iso2} ${page}: banned word "${b}" in a door`);
  }
}
let howtos = 0;
for (const iso2 of codes) {
  const h = buildHowTo(iso2);
  if (!h) continue;
  howtos++;
  checkDoors(iso2, h.doors, "how-to");
  for (const n of [...h.forms, ...h.dots]) for (const b of COPY.banned) if (`${n.label} ${n.fact}`.toLowerCase().includes(b)) reds.push(`${iso2} how-to: banned word "${b}" in a note`);
}
let termini = 0;
for (const iso2 of codes) {
  const doors = buildCloseDoors(iso2);
  if (doors.length === 0) continue;
  termini++;
  if (doors.length > DOOR_CAP) reds.push(`${iso2}: ${doors.length} doors, over ${DOOR_CAP}`);
  if (doors.filter((d) => d.kind === "pill").length > 1) reds.push(`${iso2}: more than one pill door`);
  const firsts = doors.map((d) => d.label.split(/\s+/)[0].toLowerCase());
  if (new Set(firsts).size !== firsts.length) reds.push(`${iso2}: doors share a first word (${firsts.join(", ")})`);
  for (const d of doors) {
    if (!resolves(d.href)) reds.push(`${iso2}: door "${d.label}" points at ${d.href}, which is not a route`);
    if (/with pro/i.test(d.label)) reds.push(`${iso2}: a door promises "with Pro"`);
    for (const b of COPY.banned) if (d.label.toLowerCase().includes(b)) reds.push(`${iso2}: banned word "${b}" in a door`);
  }
}
let payCards = 0, payWithheld = 0;
for (const iso2 of codes) {
  const d = buildPayBars(iso2);
  if (!d) continue;
  payCards++;
  const f = d.rows.find((r) => r.key === "minimum")?.value, a = d.rows.find((r) => r.key === "average")?.value;
  const shouldWithhold = f != null && a != null && a < f * PAY_RATIO_FLOOR;
  if (shouldWithhold !== !!d.withheld) reds.push(`${iso2}: withholding disagrees with the ratio (${f}, ${a})`);
  if (d.withheld) payWithheld++;
  for (const r of d.rows) { if (!/^(Minimum salary|Average salary)$/.test(r.label)) reds.push(`${iso2}: a pay label is not the founder's word ("${r.label}")`); if (d.worldMax && r.value > d.worldMax.value) reds.push(`${iso2}: ${r.label} ${r.value} exceeds the world's highest ${d.worldMax.value}`); }
}
/* THE CITY TERMINI (city:close, run 19): every city in the list gets its doors
   from its meta alone (no adapter, so no district is ranked here and the door
   reads "Every district of ..."; London's district form is on the harness
   sheet), and each door is held to the same rules as a country's. */
let cityTermini = 0;
for (const c of (cityListJson as { cities: Array<{ slug: string; name: string; iso2: string }> }).cities) {
  const country = (COUNTRIES as any[]).find((x) => String(x.code ?? x.iso2 ?? "").toUpperCase() === String(c.iso2).toUpperCase());
  const doors = buildCityCloseDoors({ meta: { slug: c.slug, city: c.name, iso2: c.iso2, country_name: country?.name } });
  if (doors.length === 0) { reds.push(`${c.slug}: a city with no door out`); continue; }
  cityTermini++;
  checkDoors(c.slug, doors, "city");
}
/* THE CITY VERDICT CARD'S TESTS LEFT WITH THE CARD (plan step 32, 2026-09-18):
   MODEL.md 8.3 dissolves the rent verdict into the masthead's answer, the
   builder city_verdict_facts.ts is deleted, and the district ranking below
   is the one card that prints the district rents. */
/* THE CITY'S PEERS TABLE AND THE TRADE ROWS (MODEL.md 8.3 `11 peers` and `09
   trades`; plan step 32's fifth dispatch, 2026-09-18). The peers table on a
   lettered fixture, the shape every listed city takes (the home row and three
   peers, counted 2026-09-18: 252 of 252 draw four rows and all three columns;
   the peer set is three roles by his 2026-06-08 rule, so "four peers" resolve
   on none): every cell an absolute in its column's unit, never a difference
   against the home row (PART 5); the three heads and the caveat carry no
   banned word; the heads are the corrected ones by name. The trade rows hold
   no builder of their own (the adapter maps the list to name, slug and href),
   so what is held here is the copy: the foot composed for every count the
   card can draw carries no placeholder and its two sentences, and the three
   kickers this dispatch corrected or built sit under PART 7's four words. */
{
  const seed = { meta: { iso2: "XX" }, peers: { list: [
    { name: "A", slug: "a", iso2: "XX", home: true, rent_index: 75, median_income_usd: 48756, visitors_m: 16 },
    { name: "B", slug: "b", iso2: "YY", home: false, rent_index: 75, median_income_usd: 41000, visitors_m: 7 },
    { name: "C", slug: "c", iso2: "ZZ", home: false, rent_index: 73, median_income_usd: 44000, visitors_m: 19 },
    { name: "D", slug: "d", iso2: "WW", home: false, rent_index: 89, median_income_usd: 52000, visitors_m: 5.5 },
  ] } };
  const t = buildCityPeerTable(seed);
  if (!t) reds.push("city peers: the home row and three peers draw nothing");
  else {
    if (t.rows.length !== 4) reds.push(`city peers: ${t.rows.length} rows from a home row and three peers`);
    if (t.columns.map((c) => c.head).join("|") !== [COPY.cityPeers.cols.living, COPY.cityPeers.cols.income, COPY.cityPeers.cols.visitors].join("|")) reds.push(`city peers: the heads are "${t.columns.map((c) => c.head).join("|")}"`);
    if (t.entityHead !== COPY.cityPeers.cols.city) reds.push(`city peers: the name head is "${t.entityHead}"`);
    /* EVERY CELL IS THE ROW'S OWN ABSOLUTE: the tied peer prints the index
       itself, the home row prints its own figures, no zero and no "same". */
    const b = t.rows.find((r) => r.key === "b")!, a = t.rows.find((r) => r.home)!;
    if (b.values.living !== 75 || a.values.living !== 75) reds.push(`city peers: a tied index prints ${b.values.living} beside the home row's ${a.values.living}`);
    if (a.values.income !== 48756 || a.values.visitors !== 16) reds.push("city peers: the home row does not print its own figures");
    for (const r of t.rows) for (const c of t.columns) { const v = r.values[c.key]; if (v != null && v <= 0) reds.push(`city peers: row "${r.name}" prints ${v} under "${c.head}", a zero or a difference where an absolute goes`); }
    for (const txt of [t.caveat, ...t.columns.map((c) => c.head), t.entityHead]) {
      for (const bw of COPY.banned) if (txt.toLowerCase().includes(bw)) reds.push(`city peers: banned word "${bw}" in "${txt}"`);
      if (/[{}]/.test(txt)) reds.push(`city peers: a placeholder was never filled ("${txt}")`);
    }
    for (const c of t.columns) if (c.head.trim().split(/\s+/).length > 3) reds.push(`city peers: the head "${c.head}" runs over three words`);
  }
  for (let n = 4; n <= 7; n++) {
    const foot = COPY.cityTrades.foot.replace("{n}", countWord(n));
    if (/[{}]/.test(foot) || /\d/.test(foot)) reds.push(`trade rows: the foot for ${n} trades carries a placeholder or a digit ("${foot}")`);
    if (!foot.startsWith("Local figures for ") || !foot.includes("not yet known")) reds.push(`trade rows: the foot is not the coverage form ("${foot}")`);
    for (const bw of COPY.banned) if (foot.toLowerCase().includes(bw)) reds.push(`trade rows: banned word "${bw}" in "${foot}"`);
  }
  for (const [where, kicker] of [["cityDistricts", COPY.cityDistricts.kicker], ["cityTrades", COPY.cityTrades.kicker], ["cityPeers", COPY.cityPeers.kicker]] as const) {
    if (kicker.trim().split(/\s+/).length > 4) reds.push(`${where}: the kicker "${kicker}" runs over PART 7's four words`);
  }
}
/* THE DISTRICT RANKING (city:districts, run 25): the builder's law on the same
   kind of synthetic fixture, lettered, never a place. */
{
  const fixture = { where_to_trade: { list: [{ name: "B", slug: "b", rent_mult: 1.2, character: "Q" }, { name: "A", slug: "a", rent_mult: 0.9, character: "R" }, { name: "C", slug: "c", rent_mult: 3, character: "S" }] } };
  const b = buildCityDistrictBars(fixture);
  if (!b) reds.push("districts: three ranked districts draw nothing");
  else {
    /* THE TOP OF THE SET IS REBASED TOO: 3 against a cheapest of 0.9 is 3.33,
       and a top rule still reading 3 would be measuring the card's ceiling on
       the basis the rows no longer use. */
    if (b.rows.length !== 3 || b.worldMax !== 3.33) reds.push(`districts: ${b.rows.length} rows, top rule ${b.worldMax}`);
    if (b.cheapest !== "A" || b.dearest.name !== "C" || b.middle?.name !== "B") reds.push(`districts: the ends and the middle are ${b.cheapest} / ${b.middle?.name} / ${b.dearest.name}`);
    /* THE REFERENCE IS SAID, NOT MARKED (task 14, 2026-09-10). `cheapestKey`
       is gone with the pill it fed, so what has to hold now is that the
       reference district is NAMED in both places a reader meets it , the
       basis line and the column head , and that it is the district the rows
       are actually rebased on. The old assertion proved a key pointed at a
       drawn row; this proves the words point at the right district, which is
       the only thing left carrying the reference. */
    if (!b.basis.includes("A")) reds.push(`districts: the basis line does not name the district every figure is measured against ("${b.basis}")`);
    if (!b.phoneHead.value.includes("A")) reds.push(`districts: the column head does not name the district the figures are against ("${b.phoneHead.value}")`);
    if (/[{}]/.test(b.basis + b.phoneHead.value + b.phoneHead.name)) reds.push(`districts: a placeholder was never filled ("${b.basis}" / "${b.phoneHead.value}")`);
    /* EVERY ROW CARRIES A FIGURE, THE REFERENCE'S INCLUDED, and the
       reference's is a multiple of itself: 1.00x, formatted like every other
       row rather than blanked or worded. His two rulings of 2026-09-10 in one
       assertion ("the label replaces the number, which is totally an idiotic
       thing out there"), on the shipped builder rather than on the card. */
    const refRow = b.rows.find((r) => r.key === "a");
    if (!refRow) reds.push("districts: the cheapest district draws no row of its own");
    else if (rentMult(refRow.value) !== "1.00x") reds.push(`districts: the reference row's figure is "${rentMult(refRow.value)}", not its own multiple of itself`);
    for (const r of b.rows) if (!/\d/.test(rentMult(r.value))) reds.push(`districts: row "${r.name}" prints no figure ("${rentMult(r.value)}")`);
    if (!b.tagged) reds.push("districts: the multiples are composed from tag constants and are not marked modelled");
    /* THE ASSERTION IS INVERTED, task 13 (2026-09-10). It used to demand that
       every row CARRY its character note; his ruling on this exact card
       ("you should never do it for city districts, to just summarize them in
       one or two words. It should never happen") makes a carried note the
       fault, so the fixture now feeds a `character` on all three rows and the
       gate proves the builder drops every one of them. Feeding the field and
       asserting it is dropped is the point: asserting on a fixture with no
       `character` would pass on a builder that still copies it. */
    if (b.rows.some((r) => r.note)) reds.push("districts: a row carries a one-word summary of a place");
    /* TWO DECIMALS ALWAYS, A TRAILING x, AND NEVER A WORD (task 13 fix wave,
       reversed notation task 14, 2026-09-10). The formatter formats and does
       nothing else: it used to answer 1 with the word "cheapest", which PART 5
       bans ("any bare word standing where a figure belongs"), and any sub-1
       multiple from any future caller got the same word by accident. The
       multiplier now TRAILS the number, the order the row is read out in.
       Three halves asserted: the notation, that 1 is a formatted figure and
       not a word or a blank, and that a sub-1 multiple is one too. */
    if (rentMult(2.5) !== "2.50x") reds.push(`districts: the multiple prints as ${rentMult(2.5)}`);
    if (rentMult(1) !== "1.00x") reds.push(`districts: the formatter answers 1 with "${rentMult(1)}", not a formatted multiple`);
    if (rentMult(0.5) !== "0.50x") reds.push(`districts: the formatter answers a sub-1 multiple with "${rentMult(0.5)}"`);
    for (const t of [COPY.cityDistricts.kicker, COPY.cityDistricts.basis, COPY.cityDistricts.dearest, COPY.cityDistricts.phoneHead.name, COPY.cityDistricts.phoneHead.value, b.basis, b.phoneHead.value]) for (const bw of COPY.banned) if (t.toLowerCase().includes(bw)) reds.push(`districts: banned word "${bw}" in "${t}"`);
  }
  /* TWO DISTRICTS, the case nothing renders today: the card still draws, both
     rows still carry a figure, and there is no middle to name. The
     three-district fixture above cannot prove any of that. */
  const b2 = buildCityDistrictBars({ where_to_trade: { list: [{ name: "B", slug: "b", rent_mult: 1.2, character: "Q" }, { name: "A", slug: "a", rent_mult: 0.9, character: "R" }] } });
  if (!b2) reds.push("districts: two ranked districts draw nothing");
  else {
    if (b2.rows.length !== 2 || b2.worldMax !== 1.33) reds.push(`districts: two districts, ${b2.rows.length} rows, top rule ${b2.worldMax}`);
    if (b2.middle !== null) reds.push(`districts: two districts, and a middle of "${b2.middle.name}", which is one of the two ends`);
    if (b2.cheapest !== "A" || !b2.rows.some((r) => r.key === "a")) reds.push(`districts: two districts, the reference is "${b2.cheapest}" and it draws no row`);
    if (b2.rows.some((r) => !/\d/.test(rentMult(r.value)))) reds.push("districts: two districts, and a row prints no figure");
    if (!b2.phoneHead.value.includes("A")) reds.push(`districts: two districts, the column head does not name the reference ("${b2.phoneHead.value}")`);
    if (b2.rows.some((r) => r.note)) reds.push("districts: two districts, and a row carries a one-word summary of a place");
  }
  if (buildCityDistrictBars({ where_to_trade: { list: [{ name: "A", rent_mult: 1 }] } })) reds.push("districts: one district draws a card");
  if (buildCityDistrictBars({})) reds.push("districts: no districts draw a card");
}
/* THE MARK LIST (B3, 2026-09-10): the builder's law on the REAL files, not on
   a fixture, because both of the files behind it are local and static
   (`data/cities/city_list_v1.json` and the margin snapshot), so nothing here
   needs a browser or the database. What is proved: every drawn row carries a
   figure that prints as a figure, the rows fall in order, the withheld count
   and the withheld line agree in both directions, the set adds up, no
   placeholder survives into a printed string, no head runs past three words,
   and the floor holds from the low side on a real country rather than only
   from the high side on a comfortable one. */
{
  const markListKeys = ["cities:pay", "cities:visitors", "trade:auto_repair_shops"];
  let markLists = 0;
  for (const key of markListKeys) {
    const d = buildMarkList(key);
    if (!d) { reds.push(`mark list ${key}: draws nothing, and this key is one the files hold`); continue; }
    markLists++;
    if (d.rows.length < MARK_LIST_FLOOR) reds.push(`mark list ${key}: ${d.rows.length} rows, under the floor of ${MARK_LIST_FLOOR}`);
    if (d.rows.length > MARK_LIST_CAP) reds.push(`mark list ${key}: ${d.rows.length} rows, over the cap of ${MARK_LIST_CAP}`);
    for (const r of d.rows) {
      if (!Number.isFinite(r.value)) reds.push(`mark list ${key}: row "${r.name}" carries no figure`);
      else if (!/\d/.test(d.fmt(r.value))) reds.push(`mark list ${key}: row "${r.name}" prints no figure ("${d.fmt(r.value)}")`);
    }
    for (let i = 1; i < d.rows.length; i++) {
      if (d.rows[i].value > d.rows[i - 1].value) reds.push(`mark list ${key}: "${d.rows[i].name}" ranks below "${d.rows[i - 1].name}" and holds the larger figure`);
    }
    /* BOTH DIRECTIONS: a withheld member with no line is a silent drop, and a
       line with nothing withheld is a card apologising for nothing. */
    if ((d.withheld > 0) !== (d.withheldLine != null)) reds.push(`mark list ${key}: ${d.withheld} withheld and the line is ${d.withheldLine ? "printed" : "absent"}`);
    if (d.withheldLine && !/\d/.test(d.withheldLine)) reds.push(`mark list ${key}: the withheld line counts nothing ("${d.withheldLine}")`);
    if (d.rows.length + d.withheld > d.universe) reds.push(`mark list ${key}: ${d.rows.length} rows and ${d.withheld} withheld out of a set of ${d.universe}`);
    /* THE HEADLINE IS THE SET'S MIDDLE, so it can never sit above the highest
       row the card draws; if it does, it is being measured over some other
       set than the one the rows come from. */
    if (d.middle > d.rows[0].value) reds.push(`mark list ${key}: the middle (${d.fmt(d.middle)}) stands above the highest row (${d.fmt(d.rows[0].value)})`);
    const texts = [d.kicker, d.basis, d.middleLabel, d.head.name, d.head.value, d.withheldLine ?? ""];
    if (texts.some((t) => /[{}]/.test(t))) reds.push(`mark list ${key}: a placeholder was never filled ("${texts.find((t) => /[{}]/.test(t))}")`);
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`mark list ${key}: banned word "${b}" in "${t}"`);
      if (/—/.test(t)) reds.push(`mark list ${key}: an em dash in "${t}"`);
    }
    /* THE HEADS ARE ROW GRAMMAR, three words (PART 5). THE HEADLINE LABEL IS
       ANSWER GRAMMAR, four, the cap the hero's own "Total effective tax
       burden" already sits at: it names the card's one figure, not a column. */
    for (const [where, t] of [["the name head", d.head.name], ["the value head", d.head.value]] as Array<[string, string]>) {
      if (t.trim().split(/\s+/).length > 3) reds.push(`mark list ${key}: ${where} is ${t.trim().split(/\s+/).length} words, over three ("${t}")`);
    }
    if (d.middleLabel.trim().split(/\s+/).length > 4) reds.push(`mark list ${key}: the headline label is ${d.middleLabel.trim().split(/\s+/).length} words, over four ("${d.middleLabel}")`);
  }
  /* THE FLOOR FROM THE LOW SIDE, on a real country: New Zealand holds three
     covered cities, one under the floor, so it must draw nothing. Proving the
     floor only on sets that clear it is proving nothing. */
  if (buildMarkList("cities:pay:NZ")) reds.push("mark list: a country with three covered cities draws a card, under the floor of four");
  if (buildMarkList("trade:unlisted_sector")) reds.push("mark list: a trade the taxonomy does not hold draws a card");
  if (buildMarkList("cities:pay:ZZ")) reds.push("mark list: a country with no covered city draws a card");
  console.log(`mark list: ${markLists} of ${markListKeys.length} subjects build; the floor holds from the low side`);
}

/* THE TWO COUNTRY SEATS KvGrid HOLDS (MODEL.md 8.2 `01 glance` and `02
   world-seat`; plan step 31's second dispatch, 2026-09-17), on every
   country: a label of four words or fewer (a fact cell's cap, PART 9 clause
   9), no banned word or placeholder in any string, no empty cell, and the
   withheld line agreeing with the cells BOTH WAYS (a missing cell with no
   line is a silent drop; a line with nothing missing apologises for nothing):
   the glance's count is five minus its cells, the seat's payroll sentence
   prints exactly when its payroll cell does not, and its lending sentence
   always, because the lending rate is withheld on every country (item 38).
   The 0.45 fingerprint on the minimum salary has its own gate,
   verify_min_wage_not_fill.ts, and is not repeated here. */
{
  let glances = 0;
  let seats = 0;
  for (const iso2 of codes) {
    const g = buildGlance(iso2);
    if (g) {
      glances++;
      const texts = [...g.cells.map((c) => c.label), g.basis ?? "", g.foot ?? "", g.withheld ?? ""];
      for (const t of texts) {
        for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`glance ${iso2}: banned word "${b}" in "${t}"`);
        if (/[{}]/.test(t)) reds.push(`glance ${iso2}: a placeholder was never filled ("${t}")`);
      }
      for (const c of g.cells) {
        if (c.label.split(/\s+/).length > 4) reds.push(`glance ${iso2}: label over four words: "${c.label}"`);
        if (c.value === "" || c.value == null) reds.push(`glance ${iso2}: empty cell ${c.key}`);
      }
      const missing = 5 - g.cells.length;
      if ((missing > 0) !== (g.withheld != null)) reds.push(`glance ${iso2}: ${missing} cell(s) missing and the withheld line is ${g.withheld ? "printed" : "absent"}`);
      if (g.withheld && !g.withheld.startsWith(`${missing} of 5`)) reds.push(`glance ${iso2}: ${missing} cell(s) missing but the line reads "${g.withheld}"`);
      if (g.gdpYear != null && !(g.foot ?? "").includes(String(g.gdpYear))) reds.push(`glance ${iso2}: the snapshot year ${g.gdpYear} is held and the foot does not say it`);
    }
    const s = buildWorldSeat(iso2);
    if (s) {
      seats++;
      const texts = [...s.cells.map((c) => c.label), s.basis, s.foot, s.withheld];
      for (const t of texts) {
        for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`world-seat ${iso2}: banned word "${b}" in "${t}"`);
        if (/[{}]/.test(t)) reds.push(`world-seat ${iso2}: a placeholder was never filled ("${t}")`);
      }
      for (const c of s.cells) {
        if (c.label.split(/\s+/).length > 4) reds.push(`world-seat ${iso2}: label over four words: "${c.label}"`);
        if (c.value === "" || c.value == null) reds.push(`world-seat ${iso2}: empty cell ${c.key}`);
      }
      const hasPayroll = s.cells.some((c) => c.key === "payroll");
      if (hasPayroll === s.withheld.includes(COPY.worldSeat.withheld.payroll)) reds.push(`world-seat ${iso2}: the payroll cell is ${hasPayroll ? "drawn" : "absent"} and its withheld sentence is ${hasPayroll ? "printed" : "missing"}`);
      if (!s.withheld.includes(COPY.worldSeat.withheld.lending)) reds.push(`world-seat ${iso2}: the lending rate is withheld on every country and the line does not say so`);
    }
  }
  console.log(`country seats: ${glances} glance cards and ${seats} world-seat cards build; labels, withheld lines and the year in the foot held`);
}

/* THE CITY'S TWO KvGrid SEATS (MODEL.md 8.3 `01 glance` and `02
   among-cities`; plan step 32's first dispatch, 2026-09-18), the country's
   rule one altitude down, on every covered city: a label of four words or
   fewer, no banned word or placeholder in any string, no empty cell, and the
   withheld line agreeing with the cells BOTH WAYS. The glance's count is
   four minus its cells, since the human development index is withheld on
   every city (no row is a reading of the city); the visitor cell prints
   exactly where the row's own source note says the city counted it, and
   never a figure the file derived from the country's arrivals (item 20),
   which is the fill R11 withholds. The seat prints its two cells on every
   city, its GDP always modelled (no row carries a source, item 31), and its
   foot always says the placement is not shown. Both builders read the city
   list and the city shard only, no browser, no database. */
{
  const cities = (cityListJson as { cities: Array<{ slug: string; tourist_arrivals_m?: number; sources?: Record<string, string> }> }).cities;
  let glances = 0;
  let seats = 0;
  let visitorsDrawn = 0;
  for (const c of cities) {
    const g = buildCityGlance(c.slug);
    if (!g) reds.push(`city glance ${c.slug}: builds nothing (the permit days and the business count are held for every city)`);
    else {
      glances++;
      const texts = [...g.cells.map((x) => x.label), g.basis ?? "", g.foot ?? "", g.withheld ?? ""];
      for (const t of texts) {
        for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`city glance ${c.slug}: banned word "${b}" in "${t}"`);
        if (/[{}]/.test(t)) reds.push(`city glance ${c.slug}: a placeholder was never filled ("${t}")`);
      }
      for (const x of g.cells) {
        if (x.label.split(/\s+/).length > 4) reds.push(`city glance ${c.slug}: label over four words: "${x.label}"`);
        if (x.value === "" || x.value == null) reds.push(`city glance ${c.slug}: empty cell ${x.key}`);
      }
      const missing = CITY_GLANCE_CELLS - g.cells.length;
      if ((missing > 0) !== (g.withheld != null)) reds.push(`city glance ${c.slug}: ${missing} cell(s) missing and the withheld line is ${g.withheld ? "printed" : "absent"}`);
      if (g.withheld && !g.withheld.startsWith(`${missing} of ${CITY_GLANCE_CELLS}`)) reds.push(`city glance ${c.slug}: ${missing} cell(s) missing but the line reads "${g.withheld}"`);
      if (g.cells.some((x) => x.key === "hdi") || !(g.withheld ?? "").includes(COPY.cityGlance.reasons.hdi)) reds.push(`city glance ${c.slug}: the human development index is withheld on every city and the line does not say so`);
      const visitorsOwn = typeof c.tourist_arrivals_m === "number" && c.tourist_arrivals_m > 0 && isVisitorsRead(c.sources?.tourist_arrivals_m);
      const drawn = g.cells.some((x) => x.key === "visitors");
      if (drawn !== visitorsOwn) reds.push(`city glance ${c.slug}: the visitor cell is ${drawn ? "drawn" : "absent"} and the row's count is ${visitorsOwn ? "the city's own" : "not the city's own"}`);
      if (drawn) visitorsDrawn++;
      const modelledCells = g.cells.filter((x) => x.confidence !== "measured").length;
      if ((modelledCells > 0) !== (g.foot != null)) reds.push(`city glance ${c.slug}: ${modelledCells} modelled cell(s) and the foot is ${g.foot ? "printed" : "absent"}`);
    }
    const s = buildCitySeat(c.slug);
    if (!s) reds.push(`city seat ${c.slug}: builds nothing (the metro GDP and the living index are held for every city)`);
    else {
      seats++;
      const texts = [...s.cells.map((x) => x.label), s.basis, s.foot];
      for (const t of texts) {
        for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`city seat ${c.slug}: banned word "${b}" in "${t}"`);
        if (/[{}]/.test(t)) reds.push(`city seat ${c.slug}: a placeholder was never filled ("${t}")`);
      }
      for (const x of s.cells) {
        if (x.label.split(/\s+/).length > 4) reds.push(`city seat ${c.slug}: label over four words: "${x.label}"`);
        if (x.value === "" || x.value == null) reds.push(`city seat ${c.slug}: empty cell ${x.key}`);
      }
      const gdpCell = s.cells.find((x) => x.key === "gdp");
      if (gdpCell && gdpCell.confidence === "measured") reds.push(`city seat ${c.slug}: the metro GDP carries no source on any row and is marked measured`);
      if (!s.foot.includes("not shown yet")) reds.push(`city seat ${c.slug}: the placement is not drawn and the foot does not say so ("${s.foot}")`);
      if (/in ten/.test(s.cells.map((x) => `${x.label} ${x.note ?? ""}`).join(" ") + s.basis + s.foot)) reds.push(`city seat ${c.slug}: a placement sentence is drawn before his click`);
    }
  }
  console.log(`city seats: ${glances} glance cards (the visitor cell drawn on ${visitorsDrawn}, the human development index withheld on all) and ${seats} placement seats build over ${cities.length} cities; labels, withheld lines and the foot held`);
}

/* THE CITY'S LIVING AND RUNWAY SEATS (MODEL.md 8.3 `05 living` and `06
   runway`; plan step 32's third dispatch, 2026-09-18), the same rule on every
   covered city: a label of four words or fewer, no banned word or unfilled
   placeholder in any string, no empty cell, and the withheld line agreeing
   with the cells BOTH WAYS. The living card's count is four minus its cells;
   a transit pass of zero prints the word and never $0 (the two fare-free
   cities); the foot prints exactly when a cell is not held. The runway card
   draws its share exactly when the ratio is at most 100 and its withheld line
   exactly when it is not (item 24's thirty), the income cell on every city
   (the builder holds no card without one), never "median" (item 24), never a
   placement sentence (no world track behind a personal ratio), and never
   "before tax" or "after tax" (the bank carries no marker; the basis cannot
   say). The counts by tag are printed so the numbers the builders' comments
   quote (247 held, 5 modelled; 222 drawn, 30 withheld) are measured here
   rather than remembered. */
{
  const cities = (cityListJson as { cities: Array<{ slug: string }> }).cities;
  let livingBuilt = 0, livingHeld = 0, livingModelled = 0, livingPlaceholder = 0, fareFree = 0;
  let runwayBuilt = 0, sharesDrawn = 0, sharesWithheld = 0, runwayModelled = 0;
  const ban = (where: string, texts: string[]) => {
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`${where}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`${where}: a placeholder was never filled ("${t}")`);
      if (/\bmedian\b/i.test(t)) reds.push(`${where}: "median" where "typical" is the word (item 24): "${t}"`);
      if (/\b(before|after) tax\b/i.test(t)) reds.push(`${where}: the basis claims a tax convention the bank does not carry: "${t}"`);
      if (/in ten\b/.test(t)) reds.push(`${where}: a placement sentence on a card with no world track: "${t}"`);
    }
  };
  for (const c of cities) {
    const l = buildCityLiving(c.slug);
    if (!l) reds.push(`city living ${c.slug}: builds nothing (every city holds the four living figures)`);
    else {
      livingBuilt++;
      if (l.confidence === "measured") livingHeld++; else if (l.confidence === "modeled") livingModelled++; else livingPlaceholder++;
      ban(`city living ${c.slug}`, [...l.cells.map((x) => x.label), ...l.cells.map((x) => x.note ?? ""), l.basis, l.foot ?? "", l.withheld ?? ""]);
      for (const x of l.cells) {
        if (x.label.split(/\s+/).length > 4) reds.push(`city living ${c.slug}: label over four words: "${x.label}"`);
        if (x.value === "" || x.value == null) reds.push(`city living ${c.slug}: empty cell ${x.key}`);
      }
      const missing = CITY_LIVING_CELLS - l.cells.length;
      if ((missing > 0) !== (l.withheld != null)) reds.push(`city living ${c.slug}: ${missing} cell(s) missing and the withheld line is ${l.withheld ? "printed" : "absent"}`);
      if (l.withheld && !l.withheld.startsWith(`${missing} of ${CITY_LIVING_CELLS}`)) reds.push(`city living ${c.slug}: ${missing} cell(s) missing but the line reads "${l.withheld}"`);
      const transit = l.cells.find((x) => x.key === "transit");
      if (transit && (l.figures.transit === 0) !== (transit.value === COPY.free)) reds.push(`city living ${c.slug}: a transit pass of ${l.figures.transit} prints "${String(transit.value)}"`);
      if (transit && transit.value === COPY.free) fareFree++;
      const weakCells = l.cells.filter((x) => x.confidence !== "measured").length;
      if ((weakCells > 0) !== (l.foot != null)) reds.push(`city living ${c.slug}: ${weakCells} cell(s) not held and the foot is ${l.foot ? "printed" : "absent"}`);
    }
    const r = buildCityRunway(c.slug);
    if (!r) reds.push(`city runway ${c.slug}: builds nothing (every city holds a typical income)`);
    else {
      runwayBuilt++;
      if (r.confidence !== "measured") runwayModelled++;
      ban(`city runway ${c.slug}`, [...r.cells.map((x) => x.label), ...r.cells.map((x) => x.note ?? ""), r.basis, r.foot ?? "", r.withheld ?? ""]);
      for (const x of r.cells) {
        if (x.label.split(/\s+/).length > 4) reds.push(`city runway ${c.slug}: label over four words: "${x.label}"`);
        if (x.value === "" || x.value == null) reds.push(`city runway ${c.slug}: empty cell ${x.key}`);
      }
      if (!r.cells.some((x) => x.key === "income")) reds.push(`city runway ${c.slug}: no income cell on a card that built`);
      const share = r.cells.find((x) => x.key === "share");
      if ((share != null) !== (r.figures.pct != null)) reds.push(`city runway ${c.slug}: the share cell is ${share ? "drawn" : "absent"} and the figure is ${r.figures.pct ?? "null"}`);
      if (r.figures.pct != null && r.figures.pct > 100) reds.push(`city runway ${c.slug}: a share of ${r.figures.pct} percent drawn; over 100 is withheld`);
      if ((share == null) !== (r.withheld != null)) reds.push(`city runway ${c.slug}: the share is ${share ? "drawn" : "withheld"} and the withheld line is ${r.withheld ? "printed" : "absent"}`);
      if ((r.figures.overPct != null) !== (r.withheld === COPY.cityRunway.withheld.over)) reds.push(`city runway ${c.slug}: the ratio ${r.figures.overPct ?? "is not over 100"} and the line reads "${r.withheld ?? ""}"`);
      if (share) sharesDrawn++; else sharesWithheld++;
      const weakCells = r.cells.filter((x) => x.confidence !== "measured").length;
      if ((weakCells > 0) !== (r.foot != null)) reds.push(`city runway ${c.slug}: ${weakCells} cell(s) not held and the foot is ${r.foot ? "printed" : "absent"}`);
    }
  }
  console.log(`city living and runway: ${livingBuilt} living cards build (${livingHeld} held, ${livingModelled} modelled, ${livingPlaceholder} placeholder; ${fareFree} fare-free) and ${runwayBuilt} runway cards (${sharesDrawn} shares drawn, ${sharesWithheld} withheld over 100; ${runwayModelled} modelled) over ${cities.length} cities; labels, withheld lines and the foot held`);
}

/* THE PREMISES BENTO (MODEL.md 8.3 `04 premises`; plan step 32's second
   dispatch, 2026-09-18), on every covered city: the cluster builds for every
   listed city (the shard's four `realestate.*` fields, 252 of 252); each of
   the four cells holds a figure OR a stated line and never neither (the
   builder's type makes both impossible; the count here is the withheld
   number agreeing with the cells both ways); the four openers are 8.3's own
   words, within PART 7's four; every basis within its fourteen words, saying
   "modelled" exactly when its figure's tag is not held (the sample mark is
   behind the switch, so the basis is the only line that can) and never on a
   held figure; the count cell's basis prints the shard's rate and says
   "rounded" exactly when the drawn part is not the rate; the count's part a
   whole number in 0 to 100; no banned word or unfilled placeholder in any
   string. The counts by tag are printed so the numbers 8.3 quotes (133 held,
   119 modelled) are measured here rather than remembered. */
{
  const cities = (cityListJson as { cities: Array<{ slug: string }> }).cities;
  let built = 0, held = 0, modelled = 0, withheldCells = 0, rounded = 0;
  const K = COPY.premisesBento.kickers;
  for (const k of Object.values(K)) if (k.split(/\s+/).length > 4) reds.push(`premises: the opener runs over four words: "${k}"`);
  for (const c of cities) {
    const d = buildPremisesBento(c.slug);
    if (!d) { reds.push(`premises ${c.slug}: builds nothing (every listed city holds a shard)`); continue; }
    built++;
    if (d.withheld === 0 && !d.sample) held++;
    if (d.sample) modelled++;
    const cells = [d.rent, d.fitOut, d.deposit, d.empty] as const;
    const lines: string[] = [];
    let withheld = 0;
    for (const cell of cells) {
      if ("withheld" in cell) { withheld++; lines.push(cell.withheld); continue; }
      lines.push(cell.basis);
      const figure = "figure" in cell ? cell.figure : `${cell.part} of ${cell.whole}`;
      if (!figure || figure === "undefined") reds.push(`premises ${c.slug}: an empty figure`);
      if (cell.basis.split(/\s+/).filter(Boolean).length > 14) reds.push(`premises ${c.slug}: a basis over fourteen words: "${cell.basis}"`);
      if ((cell.tag !== "held") !== /modelled/.test(cell.basis)) reds.push(`premises ${c.slug}: ${cell.tag !== "held" ? "a modelled figure and the basis does not say so" : "a held figure and the basis says modelled"}: "${cell.basis}"`);
      if ("part" in cell) {
        if (!Number.isInteger(cell.part) || cell.part < 0 || cell.part > 100) reds.push(`premises ${c.slug}: the count's part is ${cell.part}, not a whole number in 0 to 100`);
        const didRound = cell.part !== cell.rate;
        if (didRound) rounded++;
        if (didRound !== /rounded/.test(cell.basis)) reds.push(`premises ${c.slug}: the part ${cell.part} against the rate ${cell.rate} and the basis ${didRound ? "does not say rounded" : "says rounded"}: "${cell.basis}"`);
        if (!cell.basis.includes(String(cell.rate))) reds.push(`premises ${c.slug}: the basis does not print the rate ${cell.rate}: "${cell.basis}"`);
      }
    }
    withheldCells += withheld;
    if (withheld !== d.withheld) reds.push(`premises ${c.slug}: ${withheld} withheld cell(s) and the cluster counts ${d.withheld}`);
    for (const t of [...Object.values(K), ...lines]) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`premises ${c.slug}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`premises ${c.slug}: a placeholder was never filled ("${t}")`);
    }
  }
  console.log(`premises bento: ${built} clusters build over ${cities.length} cities, ${held} every figure held, ${modelled} modelled and saying so, ${withheldCells} withheld cell(s), ${rounded} counts rounded and saying so; openers and basis lines within their caps, no banned word`);
}

/* THE ONE INCOME BUILDER, THE SPEND CARD AND THE EARNINGS STRIP (MODEL.md 8.3
   `08 demand` and `07 earnings`, DATA-REQUIREMENTS item 24; plan step 32's
   fourth dispatch, 2026-09-18), on every listed city. THE IDENTITY: the
   typical income prints in four places (the masthead's answer through the
   adapter, the strip's middle mark, the runway's income cell, the peers'
   income column, the last two through the adapter as well) and all four
   read `cityTypicalIncome(slug)`; this gate proves the three it can reach
   without the database agree on the figure (the strip's typical mark, the
   runway's income cell, the builder), counts the branches (city or country)
   and the tags, and proves the shape of each card: the spend prints a figure
   OR a withheld line and never neither or both, says "modelled" in its foot
   exactly when its tag is not held, and never prints a placeholder; the
   strip draws three marks exactly when the country's deciles bracket the
   typical, one otherwise, with the note saying which of the two reasons
   (no deciles, or the typical outside them), the typical the lead mark on
   every strip, and never "median", "before tax" or "take-home" in any
   string, since the shard carries no marker. The counts by branch are
   printed so the numbers the builders' comments quote (252 city, 0 country;
   152 three-mark, 84 no deciles, 16 outside) are measured here rather than
   remembered. */
{
  const cities = (cityListJson as { cities: Array<{ slug: string }> }).cities;
  let cityBranch = 0, countryBranch = 0, modelledPay = 0, threeMarks = 0, noDeciles = 0, outside = 0, spendHeld = 0, spendModelled = 0, spendWithheld = 0;
  const ban = (where: string, texts: string[]) => {
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`${where}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`${where}: a placeholder was never filled ("${t}")`);
      if (/\bmedian\b/i.test(t)) reds.push(`${where}: "median" where "typical" is the word (item 24): "${t}"`);
      if (/\b(before|after) tax\b|take-home/i.test(t)) reds.push(`${where}: the basis claims a tax convention the bank does not carry: "${t}"`);
    }
  };
  for (const c of cities) {
    const income = cityTypicalIncome(c.slug);
    if (!income) { reds.push(`city income ${c.slug}: builds nothing (every listed city holds a salary or a country median)`); continue; }
    if (income.from === "city") cityBranch++; else countryBranch++;
    if (income.sample) modelledPay++;
    if (!(income.value > 0)) reds.push(`city income ${c.slug}: a figure of ${income.value}`);
    const runway = buildCityRunway(c.slug);
    const cell = runway?.cells.find((x) => x.key === "income");
    if (income.from === "city" && (!cell || cell.value !== usd(income.value))) reds.push(`city income ${c.slug}: the runway prints ${cell?.value ?? "nothing"} and the one builder says ${usd(income.value)}`);
    if (income.from === "country" && runway) reds.push(`city income ${c.slug}: the runway draws on the country's figure`);
    const strip = buildCityEarningsStrip(c.slug);
    if (!strip) { reds.push(`city earnings ${c.slug}: builds nothing`); continue; }
    const typical = strip.marks.find((m) => m.key === "typical");
    if (!typical || !typical.lead) reds.push(`city earnings ${c.slug}: no lead typical mark`);
    if (typical && typical.value !== income.value) reds.push(`city earnings ${c.slug}: the strip's typical ${typical.value} and the one builder's ${income.value} differ`);
    if (strip.from !== income.from) reds.push(`city earnings ${c.slug}: the strip is the ${strip.from}'s and the builder's figure the ${income.from}'s`);
    if (strip.marks.length === 3) {
      threeMarks++;
      const [a, b, d] = [...strip.marks].sort((x, y) => x.value - y.value);
      if (a.key !== "p10" || b.key !== "typical" || d.key !== "p90") reds.push(`city earnings ${c.slug}: the marks do not read bottom tenth, typical, top tenth in order (${strip.marks.map((m) => `${m.key} ${m.value}`).join(", ")})`);
      if (strip.basis !== COPY.cityCustomers.basis && strip.from === "city") reds.push(`city earnings ${c.slug}: three marks under the basis "${strip.basis}"`);
      if (strip.figures.outside) reds.push(`city earnings ${c.slug}: three marks drawn and the figures say the typical is outside the deciles`);
    } else if (strip.marks.length === 1) {
      if (strip.from === "city" && strip.basis !== COPY.cityCustomers.basisAlone) reds.push(`city earnings ${c.slug}: one mark under the basis "${strip.basis}"`);
      if (strip.figures.outside) outside++; else noDeciles++;
      const note = strip.note ?? "";
      if (strip.figures.outside !== note.includes(COPY.cityCustomers.outside)) reds.push(`city earnings ${c.slug}: the typical is ${strip.figures.outside ? "" : "not "}outside the deciles and the note ${note.includes(COPY.cityCustomers.outside) ? "says it is" : "does not say so"}`);
      if (!strip.figures.outside && strip.from === "city" && !note.includes(COPY.cityCustomers.noSpread)) reds.push(`city earnings ${c.slug}: one mark, no deciles, and the note does not say the tenths are not researched: "${note}"`);
    } else reds.push(`city earnings ${c.slug}: ${strip.marks.length} marks`);
    if (income.sample !== (strip.note ?? "").includes(COPY.cityCustomers.modelled)) reds.push(`city earnings ${c.slug}: the typical is ${income.sample ? "" : "not "}modelled and the note ${(strip.note ?? "").includes(COPY.cityCustomers.modelled) ? "says modelled" : "does not"}`);
    ban(`city earnings ${c.slug}`, [strip.basis, strip.note ?? "", ...strip.marks.map((m) => m.label)]);
    const spend = buildCityDemand(c.slug);
    if (!spend) { reds.push(`city demand ${c.slug}: builds nothing (every listed city holds a shard)`); continue; }
    if ((spend.figure == null) === (spend.withheld == null)) reds.push(`city demand ${c.slug}: ${spend.figure == null ? "neither a figure nor a withheld line" : "a figure and a withheld line together"}`);
    if (spend.tag === "placeholder" && spend.figure != null) reds.push(`city demand ${c.slug}: a placeholder printed as a figure`);
    if (spend.figure != null) {
      if (spend.tag === "held") spendHeld++; else spendModelled++;
      if ((spend.tag !== "held") !== (spend.foot != null)) reds.push(`city demand ${c.slug}: the tag is ${spend.tag} and the foot is ${spend.foot ? "printed" : "absent"}`);
      if (!spend.basis) reds.push(`city demand ${c.slug}: a figure with no basis`);
      if (spend.basis && spend.basis.split(/\s+/).filter(Boolean).length > 14) reds.push(`city demand ${c.slug}: a basis over fourteen words: "${spend.basis}"`);
    } else {
      spendWithheld++;
      if (spend.basis || spend.foot) reds.push(`city demand ${c.slug}: a basis or a foot under a withheld line`);
    }
    if (COPY.cityDemand.kicker.split(/\s+/).length > 4) reds.push(`city demand: the opener runs over four words: "${COPY.cityDemand.kicker}"`);
    ban(`city demand ${c.slug}`, [spend.basis ?? "", spend.foot ?? "", spend.withheld ?? ""]);
  }
  console.log(`city income, earnings and demand: ${cityBranch} cities read their own typical and ${countryBranch} the country's (${modelledPay} modelled); the strip draws three marks on ${threeMarks}, the typical alone on ${noDeciles} with no country deciles and on ${outside} whose typical sits outside them; the spend prints on ${spendHeld + spendModelled} (${spendHeld} held, ${spendModelled} modelled) and is withheld on ${spendWithheld}; the runway's income and the strip's typical agree with the one builder on every city`);
}

/* TURN THREE OF THE CITY PAGE (MODEL.md 8.3 `12 character-people`, `13
   locals`, `14 neighbourhoods`, `15 season`; plan step 32's sixth dispatch,
   2026-09-18), on every listed city. THE PEOPLE TABLE: six rows on every
   city, the basis under fourteen words in one of its three shapes (all the
   city's own, mixed with the traits named, the country's throughout) and
   saying "modelled" in every shape, the count of own reads agreeing with
   the shape, the foot the city's own share or absent. THE SEASON PAIR: two
   cells summing to a hundred OR a withheld line and never neither or both,
   the foot saying "modelled" exactly when the confidence is not measured,
   the basis within fourteen words, and the feed counted (shard, slope,
   withheld) so the numbers the builder's comment quotes are measured. THE
   NEIGHBOURHOODS: a curated scheme yields cards (a name and a real href on
   each, no sub-line, the foot counting them as a word) and the placeholder
   scheme yields the seat's line, naming the city, under the seat's cap;
   never both. THE LOCALS SEAT is the country's three strings (M19), already
   held above. No banned word or unfilled placeholder in any of it. */
{
  const cities = (cityListJson as { cities: Array<{ slug: string }> }).cities;
  const ban = (where: string, texts: string[]) => {
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`${where}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`${where}: a placeholder was never filled ("${t}")`);
    }
  };
  const wordsOf = (t: string) => t.split(/\s+/).filter(Boolean).length;
  let ownAll = 0, mixed = 0, countryOnly = 0, feet = 0, nationalFeet = 0;
  let sHeld = 0, sModelled = 0, sShard = 0, sSlope = 0, sWithheld = 0;
  let curated = 0, seated = 0, cards = 0;
  for (const c of cities) {
    const p = buildCityPeopleTable(c.slug);
    if (!p) { reds.push(`city people ${c.slug}: builds nothing (every listed city's country holds the six reads)`); continue; }
    /* five traits since 2026-09-20 (his ruling of 2026-09-19; character_rows.ts PEOPLE_KEYS) */
    if (p.rows.length !== 5) reds.push(`city people ${c.slug}: ${p.rows.length} rows, not five`);
    if (p.own === 5) ownAll++; else if (p.own === 0) countryOnly++; else mixed++;
    if (!p.foot) reds.push(`city people ${c.slug}: no foot (every listed city's country holds the share born abroad, and a table with no foot has no lead)`);
    else if (p.foot.label === COPY.character.people.foot) feet++; else if (p.foot.label === COPY.character.people.footCountry) nationalFeet++; else reds.push(`city people ${c.slug}: a foot label off the copy table: "${p.foot.label}"`);
    if (wordsOf(p.basis) > 14) reds.push(`city people ${c.slug}: a basis over fourteen words: "${p.basis}"`);
    if (!/modelled/.test(p.basis)) reds.push(`city people ${c.slug}: the basis does not say modelled: "${p.basis}"`);
    if ((p.own === 0) !== p.basis.startsWith("The country's reads")) reds.push(`city people ${c.slug}: ${p.own} own read(s) under the basis "${p.basis}"`);
    if ((p.own === 5) !== p.basis.startsWith("All five reads")) reds.push(`city people ${c.slug}: ${p.own} own read(s) under the basis "${p.basis}"`);
    if (p.own > 0 && p.own < 5 && !/ own; the rest are the country's, modelled\.$/.test(p.basis)) reds.push(`city people ${c.slug}: a mixed table under the basis "${p.basis}"`);
    ban(`city people ${c.slug}`, [p.basis, ...p.rows.map((r) => r.name)]);

    const se = buildCitySeason(c.slug);
    if (!se) { reds.push(`city season ${c.slug}: builds nothing (every listed city holds a shard or a row in the list)`); continue; }
    const drawn = se.cells.length > 0;
    if (drawn === (se.withheld != null)) reds.push(`city season ${c.slug}: ${drawn ? "cells and a withheld line together" : "neither cells nor a withheld line"}`);
    if (drawn) {
      if (se.cells.length !== 2) reds.push(`city season ${c.slug}: ${se.cells.length} cells, not two`);
      if (se.figures.resident == null || se.figures.visitor == null || se.figures.resident + se.figures.visitor !== 100) reds.push(`city season ${c.slug}: the two shares do not sum to a hundred (${se.figures.resident}, ${se.figures.visitor})`);
      if (!se.basis) reds.push(`city season ${c.slug}: cells with no basis`);
      if (se.basis && wordsOf(se.basis) > 14) reds.push(`city season ${c.slug}: a basis over fourteen words: "${se.basis}"`);
      if ((se.confidence !== "measured") !== (se.foot != null)) reds.push(`city season ${c.slug}: the confidence is ${se.confidence} and the foot is ${se.foot ? "printed" : "absent"}`);
      if (se.from === "slope" && se.foot !== COPY.citySeason.footSlope) reds.push(`city season ${c.slug}: the slope's shares under the foot "${se.foot}"`);
      if (se.from === "shard" && se.foot != null && se.foot !== COPY.citySeason.footModelled) reds.push(`city season ${c.slug}: the shard's modelled shares under the foot "${se.foot}"`);
      if (se.confidence === "measured") sHeld++; else sModelled++;
      if (se.from === "shard") sShard++; else if (se.from === "slope") sSlope++; else reds.push(`city season ${c.slug}: cells drawn from no named feed`);
    } else {
      sWithheld++;
      if (se.basis || se.foot) reds.push(`city season ${c.slug}: a basis or a foot under a withheld line`);
    }
    ban(`city season ${c.slug}`, [se.basis ?? "", se.foot ?? "", se.withheld ?? "", ...se.cells.map((x) => x.label)]);

    const h = buildCityNeighbourhoods(c.slug);
    if (!h) { reds.push(`city neighbourhoods ${c.slug}: builds nothing (every listed city holds a scheme)`); continue; }
    if ((h.cards != null) === (h.seatLine != null)) reds.push(`city neighbourhoods ${c.slug}: ${h.cards ? "cards and a seat line together" : "neither cards nor a seat line"}`);
    if ((h.scheme === PLACEHOLDER_SCHEME) !== (h.cards == null)) reds.push(`city neighbourhoods ${c.slug}: the scheme is ${h.scheme} and the card ${h.cards ? "draws" : "is seated"}`);
    if (h.cards) {
      curated++; cards += h.cards.length;
      if (!h.foot) reds.push(`city neighbourhoods ${c.slug}: cards with no foot`);
      const word = countWord(h.cards.length);
      if (h.foot && !h.foot.startsWith(word.charAt(0).toUpperCase() + word.slice(1))) reds.push(`city neighbourhoods ${c.slug}: the foot does not open with the count as a word: "${h.foot}"`);
      for (const k of h.cards) {
        if (!k.name.trim()) reds.push(`city neighbourhoods ${c.slug}: a card with no name`);
        /* THE CARD LANDS ON THE DISTRICT'S OWN PAGE WHERE ONE EXISTS (plan step
           35, 2026-09-19, MODEL.md 8.8) through the one resolver, and on the
           hub's anchor otherwise; the foot's words follow the destination. */
        const page = districtPageTarget(c.slug, k.id);
        if (k.href !== (page ? page.href : `${h.allHref}#${k.id}`)) reds.push(`city neighbourhoods ${c.slug}: the card "${k.name}" points at ${k.href}, not ${page ? "the district's own page" : "the hub's anchor"}`);
        if (page && !resolves(page.href)) reds.push(`city neighbourhoods ${c.slug}: the district page ${page.href} is not a route`);
        if (k.sub) reds.push(`city neighbourhoods ${c.slug}: the card "${k.name}" carries a sub-line ("${k.sub}"), a one-word summary of a place`);
        if (k.image) reds.push(`city neighbourhoods ${c.slug}: the card "${k.name}" carries an image`);
      }
      if (!resolves(h.allHref)) reds.push(`city neighbourhoods ${c.slug}: the all link points at ${h.allHref}, which is not a route`);
      const onPages = h.cards.every((k) => districtPageTarget(c.slug, k.id) != null);
      if (h.onPages !== onPages) reds.push(`city neighbourhoods ${c.slug}: onPages says ${h.onPages} and the cards say ${onPages}`);
      if (h.foot && onPages !== h.foot.endsWith(COPY.cityNeighbourhoods.footPages.slice(COPY.cityNeighbourhoods.footPages.indexOf(" named")))) reds.push(`city neighbourhoods ${c.slug}: the foot's words do not follow where the cards land ("${h.foot}")`);
      ban(`city neighbourhoods ${c.slug}`, [h.foot ?? "", ...h.cards.map((k) => k.name)]);
    } else {
      seated++;
      if (wordsOf(h.seatLine!) > SEAT_LINE_WORDS_CAP) reds.push(`city neighbourhoods ${c.slug}: the seat's line runs ${wordsOf(h.seatLine!)} words, over ${SEAT_LINE_WORDS_CAP}: "${h.seatLine}"`);
      if (!h.seatLine!.startsWith("Not gathered yet:")) reds.push(`city neighbourhoods ${c.slug}: the seat's line is not in the site's idiom: "${h.seatLine}"`);
      ban(`city neighbourhoods ${c.slug}`, [h.seatLine!]);
    }
  }
  ban("city turn three COPY", [COPY.cityNeighbourhoods.kicker, COPY.cityNeighbourhoods.allLabel, COPY.cityNeighbourhoods.prev, COPY.cityNeighbourhoods.next, COPY.citySeason.kicker, COPY.citySeason.cells.residents, COPY.citySeason.cells.visitors, COPY.blocked.cityNeighbourhoods.foot, COPY.blocked.cityNeighbourhoods.kicker]);
  if (wordsOf(COPY.cityNeighbourhoods.kicker) > 4) reds.push(`city neighbourhoods: the opener runs over four words: "${COPY.cityNeighbourhoods.kicker}"`);
  if (wordsOf(COPY.citySeason.kicker) > 4) reds.push(`city season: the opener runs over four words: "${COPY.citySeason.kicker}"`);
  if (COPY.blocked.cityNeighbourhoods.kicker !== COPY.cityNeighbourhoods.kicker) reds.push("city neighbourhoods: the seat's kicker and the pager's differ");
  console.log(`city turn three: the people table draws six rows on ${ownAll + mixed + countryOnly} cities (${ownAll} all the city's own, ${mixed} mixed, ${countryOnly} the country's; ${feet} with the city's own foot, ${nationalFeet} with the country's, labelled); the season pair prints on ${sHeld + sModelled} (${sHeld} held, ${sModelled} modelled; ${sShard} off the shard, ${sSlope} off the slope) and is withheld on ${sWithheld}; the neighbourhoods pager draws on ${curated} cities (${cards} cards) and the seat on ${seated}`);
}

/* THE BILL TO REGISTER (MODEL.md 8.2 `04 entry-bill`; plan step 31's third
   dispatch, 2026-09-17), on every country: no banned word or unfilled
   placeholder in any string the card prints, the kicker within PART 7's four
   words, the composed basis within its fourteen (the both-figures line sits
   exactly at the cap), each slot holding a figure OR a stated line and never
   neither, and the foot saying "modelled" exactly when a printed figure's tag
   is not held (the sample mark is behind the switch, so the foot is the only
   line that can). The guard's arithmetic against the formation table has its
   own gate, entry-bill-guard, and is not repeated here. */
{
  let bills = 0;
  for (const iso2 of codes) {
    const d = buildEntryBill(iso2);
    if (!d) continue;
    bills++;
    const secondText = "figure" in d.second ? `${d.second.figure} ${d.second.words}` : d.second.withheld;
    const texts = [COPY.entryBill.kicker, d.figure ?? "", d.withheld ?? "", secondText, d.basis ?? "", d.foot ?? ""];
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`entry-bill ${iso2}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`entry-bill ${iso2}: a placeholder was never filled ("${t}")`);
    }
    if (COPY.entryBill.kicker.split(/\s+/).length > 4) reds.push(`entry-bill: the kicker runs over four words: "${COPY.entryBill.kicker}"`);
    if (d.basis && d.basis.split(/\s+/).filter(Boolean).length > 14) reds.push(`entry-bill ${iso2}: the basis runs over fourteen words: "${d.basis}"`);
    if ((d.figure == null) === (d.withheld == null)) reds.push(`entry-bill ${iso2}: the focal slot holds ${d.figure == null ? "neither a figure nor a line" : "a figure and a line"}`);
    if (!("figure" in d.second) && !("withheld" in d.second)) reds.push(`entry-bill ${iso2}: the second slot holds neither a figure nor a line`);
    if (d.sample !== /modelled/.test(d.foot ?? "")) reds.push(`entry-bill ${iso2}: ${d.sample ? "a printed figure is modelled and the foot does not say so" : "nothing printed is modelled and the foot says modelled"}`);
  }
  console.log(`entry bill: ${bills} cards build; no banned word, the kicker and basis within their caps, every slot a figure or a line, modelled said in the foot`);
}

/* POWER AND LIVING COSTS (MODEL.md 8.2 `06 running-costs`; plan step 31's
   fourth dispatch, 2026-09-18), on every country: no banned word or unfilled
   placeholder in any string the card prints, a label of four words or fewer
   (the fact cell's cap), the kicker within PART 7's four words, the composed
   basis within its fourteen (the both-cells line is thirteen), each of the two
   slots holding a cell OR a stated line and never neither (a missing cell
   with no line is a silent drop; a line beside a printed cell apologises for
   nothing), the foot saying "modelled" exactly when a printed cell is
   modelled (the sample mark is behind the switch, so the foot is the only
   line that can), and the cost of living always marked modelled when it
   prints. The fill on the electricity rate has its own gate,
   verify_electricity_not_fill.ts, and is not repeated here. */
{
  let cards = 0;
  for (const iso2 of codes) {
    const r = buildRunningCosts(iso2);
    if (!r) continue;
    cards++;
    const texts = [COPY.runningCosts.kicker, ...r.cells.map((c) => c.label), ...r.withheld, r.basis ?? "", r.foot ?? ""];
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`running-costs ${iso2}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`running-costs ${iso2}: a placeholder was never filled ("${t}")`);
    }
    for (const c of r.cells) {
      if (c.label.split(/\s+/).length > 4) reds.push(`running-costs ${iso2}: label over four words: "${c.label}"`);
      if (c.value === "" || c.value == null) reds.push(`running-costs ${iso2}: empty cell ${c.key}`);
    }
    if (COPY.runningCosts.kicker.split(/\s+/).length > 4) reds.push(`running-costs: the kicker runs over four words: "${COPY.runningCosts.kicker}"`);
    if (r.basis && r.basis.split(/\s+/).filter(Boolean).length > 14) reds.push(`running-costs ${iso2}: the basis runs over fourteen words: "${r.basis}"`);
    if (r.cells.length + r.withheld.length !== 2) reds.push(`running-costs ${iso2}: ${r.cells.length} cell(s) and ${r.withheld.length} withheld line(s); two slots, each a cell or a line`);
    const living = r.cells.find((c) => c.key === "living");
    if (living && living.confidence !== "modeled") reds.push(`running-costs ${iso2}: the cost of living is a weighting and is not marked modelled`);
    const modelled = r.cells.some((c) => c.confidence === "modeled");
    if (modelled !== /modelled/.test(r.foot ?? "")) reds.push(`running-costs ${iso2}: ${modelled ? "a printed cell is modelled and the foot does not say so" : "nothing printed is modelled and the foot says modelled"}`);
  }
  console.log(`running costs: ${cards} cards build; no banned word, the kicker and basis within their caps, two slots each a cell or a line, modelled said in the foot`);
}
/* BEFORE YOU COMMIT (MODEL.md 8.2 `18 checks`; plan step 31's fifth dispatch,
   2026-09-18), on every country: two or three rows and the basis that counts
   them; every row a bank row word for word (the bank is the composition's
   section 9, and a rewritten question is a different check on the trade page,
   M20); the second row on the hero's own regime lookup and the third present
   exactly when the formation file holds an LLC row with a filing time, on the
   over-21 side exactly when that time is over 21 (R10: the row self-omits
   where the page holds no registration time, never a verdict); no banned
   word, the kicker within four words, the basis within fourteen, a label of
   three words or fewer (PART 5); and the E1 arithmetic held in copy, the
   questions plus the basis under 220 characters, so the render gate has
   nothing to find. The compare door beside it (`19 compare`): one pill,
   the name through inSentence(), an href the app folder holds, no banned
   word, held to the same door law as every terminus. */
{
  let cards = 0, three = 0, two = 0, over = 0;
  const bankFacts = new Set(Object.values(CHECKS_BANK).flatMap((r) => Object.values(r).map((n) => n!.fact)));
  for (const iso2 of codes) {
    const c = buildChecks(iso2);
    cards++;
    if (c.rows.length === 3) three++; else if (c.rows.length === 2) two++; else reds.push(`checks ${iso2}: ${c.rows.length} rows; two or three`);
    if (c.basis !== (c.rows.length === 3 ? COPY.checks.basis.three : COPY.checks.basis.two)) reds.push(`checks ${iso2}: the basis "${c.basis}" does not count ${c.rows.length} rows`);
    const llc = getFormationRowByTier(iso2, "LLC");
    const days = llc && typeof llc.days === "number" && llc.days > 0 ? llc.days : null;
    const wait = c.rows.find((r) => r.key === "wait");
    if ((wait != null) !== (days != null)) reds.push(`checks ${iso2}: the wait row is ${wait ? "drawn" : "omitted"} and the LLC filing time is ${days == null ? "not on file" : String(days)}`);
    if (wait && days != null && (wait.branch === "over") !== (days > WAIT_DAYS_THRESHOLD)) reds.push(`checks ${iso2}: the wait row reads "${wait.fact}" against ${days} days`);
    if (wait?.branch === "over") over++;
    const margin = c.rows.find((r) => r.key === "margin");
    if (!margin || (margin.branch === "held") !== (getSmbRegime(iso2) != null)) reds.push(`checks ${iso2}: the margin row's branch disagrees with the regime lookup`);
    if (c.rows[0]?.key !== "price") reds.push(`checks ${iso2}: the first row is not the price`);
    for (const r of c.rows) {
      if (!bankFacts.has(r.fact)) reds.push(`checks ${iso2}: a question not in the bank: "${r.fact}"`);
      if (r.label.split(/\s+/).length > 3) reds.push(`checks ${iso2}: a label over three words: "${r.label}"`);
      if (!/\?$/.test(r.fact)) reds.push(`checks ${iso2}: a check that is not a question: "${r.fact}"`);
    }
    const texts = [COPY.checks.kicker, c.basis, ...c.rows.flatMap((r) => [r.label, r.fact])];
    for (const t of texts) for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`checks ${iso2}: banned word "${b}" in "${t}"`);
    const prose = c.rows.map((r) => r.fact).concat(c.basis).filter((t) => t.length >= 30 && /\s/.test(t)).reduce((n, t) => n + t.length, 0);
    if (prose > 220) reds.push(`checks ${iso2}: ${prose} characters of prose, over the 220 ceiling`);
    checkDoors(iso2, buildCompareDoor(String((COUNTRIES as any[]).find((x) => x.code === iso2)?.name ?? "")), "compare");
  }
  if (COPY.checks.kicker.split(/\s+/).length > 4) reds.push(`checks: the kicker runs over four words: "${COPY.checks.kicker}"`);
  if (COPY.compare.kicker.split(/\s+/).length > 4) reds.push(`compare: the kicker runs over four words: "${COPY.compare.kicker}"`);
  for (const b of [COPY.checks.basis.three, COPY.checks.basis.two]) if (b.split(/\s+/).filter(Boolean).length > 14) reds.push(`checks: the basis runs over fourteen words: "${b}"`);
  console.log(`checks: ${cards} cards build, ${three} with three rows and ${two} with two, ${over} on the over-21 wait; every row a bank row, the compare door on every country against the routes`);
}
/* THE TRADE PAGE'S OPENING (MODEL.md 8.6 `00 take`, `01 spread`, `02 suits`;
   plan step 33's first dispatch, 2026-09-18), on every one of the 243 trade
   ids the shards are filed under (ALL_INDUSTRIES; the 138 in scope are a
   subset), without the database. THE ONE NET BUILDER (R7, item 58): with the
   engine absent every trade resolves a net, on the shard's ladder or on the
   sector profile's residual and never on the 42 / 10 / 5 fill (the fill
   shards are the ones on the profile, and their count is printed so item 50's
   38 is measured here rather than remembered); the printed form is a whole
   percent on every branch; with the engine present and money shown the net
   is the engine's; no banned word or unfilled placeholder in a note. THE
   SUITS (M20, R9): every trade holds at most five rows, each a label within
   the locals cap and a non-empty fact; the two checks are the bank's own
   strings, the margin row steered by the country exactly as the country's
   card steers it; the not-gathered row stands where no character is held
   (counted; none today) and never beside a prose row; the facts over the
   locals notes' 140-character cap are COUNTED and printed, not redded, since
   they are authored prose the builder may not cut (suits_rows.ts); a banned
   word in a fact is a RED on the 138 trades in scope (the register rule is
   his, and the day this gate first read the prose it found three: "the
   whole solution", "well-utilized infrastructure", "retention against the
   same fixed floor", each reworded in the source file the same day) and a
   COUNTED queue line on a retired or merged id, which redirects and reaches
   no reader. THE
   MASTHEAD AND THE STRIP, over two fixture seeds (the district builder's
   idiom): with money shown the answer and the three companions print and the
   strip draws three marks with the typical as the lead; without it the
   answer is the state word, the net is the one companion, the foot carries
   the withheld line, and the strip holds the line and no basis. */
{
  const ban = (where: string, texts: string[]) => {
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`${where}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`${where}: a placeholder was never filled ("${t}")`);
    }
  };
  const counts = countTradeNets();
  if (counts.unresolved > 0) reds.push(`trade net: ${counts.unresolved} of ${counts.total} trades resolve no net (R7 allows no net-less mode)`);
  let fillPrinted = 0, notCharacter = 0, longFacts = 0, longestFact = 0, rowsMax = 0, retiredBanned = 0;
  const inScope = new Set(INDUSTRIES.map((i) => i.id));
  const retiredQueue: string[] = [];
  for (const ind of ALL_INDUSTRIES) {
    const n = resolveTradeNet(ind.id, { moneyShown: false, netMarginPct: null });
    if (n) {
      if (n.branch === "engine") reds.push(`trade net ${ind.id}: the engine's branch with money not shown`);
      if (n.branch === "shard" && n.fill) fillPrinted++;
      if (n.text !== netText(n.pct) || !/^-?\d+%$/.test(n.text)) reds.push(`trade net ${ind.id}: the printed form "${n.text}" is not a whole percent`);
      if (n.note.length > 48) reds.push(`trade net ${ind.id}: a note over 48 characters: "${n.note}"`);
      ban(`trade net ${ind.id}`, [n.note]);
    }
    const su = buildSuits(ind.id, "GB");
    if (su.rows.length > NOTE_CAP) reds.push(`trade suits ${ind.id}: ${su.rows.length} rows, over ${NOTE_CAP}`);
    rowsMax = Math.max(rowsMax, su.rows.length);
    if (!su.hasCharacter) notCharacter++;
    if (!su.hasCharacter && su.rows.some((r) => r.key === "suits" || r.key === "thinkTwice")) reds.push(`trade suits ${ind.id}: the not-gathered row beside a prose row`);
    if (su.hasCharacter && su.rows.some((r) => r.key === "notGathered")) reds.push(`trade suits ${ind.id}: a not-gathered row beside a character`);
    for (const r of su.rows) {
      if (r.label.split(/\s+/).filter(Boolean).length > LABEL_WORDS_CAP) reds.push(`trade suits ${ind.id}: label over ${LABEL_WORDS_CAP} words: "${r.label}"`);
      if (!r.fact || !r.fact.trim()) reds.push(`trade suits ${ind.id}: an empty fact under "${r.label}"`);
      if (r.fact.length > FACT_CHARS_CAP) { longFacts++; longestFact = Math.max(longestFact, r.fact.length); }
      ban(`trade suits ${ind.id}`, [r.label]);
      if (/[{}]/.test(r.fact)) reds.push(`trade suits ${ind.id}: a placeholder was never filled ("${r.fact}")`);
      for (const b of COPY.banned) if (r.fact.toLowerCase().includes(b)) { if (inScope.has(ind.id)) reds.push(`trade suits ${ind.id}: banned word "${b}" in "${r.fact}"`); else { retiredBanned++; retiredQueue.push(`${ind.id} ("${b}")`); } }
    }
    const price = su.rows.find((r) => r.key === "price"), margin = su.rows.find((r) => r.key === "margin");
    if (!price || price.fact !== CHECKS_BANK.price.always!.fact) reds.push(`trade suits ${ind.id}: the price check is not the bank's`);
    if (!margin || margin.fact !== CHECKS_BANK.margin.held!.fact) reds.push(`trade suits ${ind.id}: the margin check on a held regime is not the bank's held row`);
    if (su.rows.some((r) => (r.key as string) === "wait")) reds.push(`trade suits ${ind.id}: the wait row is carried (08 draws its figure)`);
    ban(`trade suits ${ind.id}`, [su.basis]);
  }
  if (fillPrinted) reds.push(`trade net: the 42 / 10 / 5 fill printed on ${fillPrinted} trade(s) (R11)`);
  const notHeld = buildSuits("restaurants", "AF").rows.find((r) => r.key === "margin");
  if (!notHeld || notHeld.fact !== CHECKS_BANK.margin.notHeld!.fact) reds.push(`trade suits: the margin check on a country with no regime is not the bank's not-held row`);
  const none = buildSuits("no_such_trade", "GB");
  if (none.hasCharacter || none.rows.length !== 3 || none.rows[0].key !== "notGathered" || !none.rows[0].fact.startsWith("Not gathered yet:")) reds.push(`trade suits: a trade with no character does not take the one not-gathered row over the two checks`);
  const engine = resolveTradeNet("restaurants", { moneyShown: true, netMarginPct: 5 });
  if (!engine || engine.branch !== "engine" || engine.text !== "5%") reds.push(`trade net: with money shown the engine's 5 does not print as 5% on the engine branch`);
  const shown = { meta: { trade: "Restaurants", city: "London", country_name: "United Kingdom", iso2: "GB", industry_id: "restaurants", money_shown: true, provenance_line: "National business statistics" }, owner: { take_home_usd: 36000 }, headline: { n_firms: 13000, rev_p10_usd: 360000, rev_p50_usd: 720000, rev_p90_usd: 1296000, rev_spread_basis: "modelled" }, net: engine };
  const hidden = { meta: { trade: "Caf\u00e9s & coffee shops", city: "Mumbai", country_name: "India", iso2: "IN", industry_id: "cafes_coffee", money_shown: false, provenance_line: "Modeled from national business statistics." }, headline: { n_firms: 100, rev_p50_usd: 5215000 }, net: resolveTradeNet("cafes_coffee", { moneyShown: false, netMarginPct: 11.3 }) };
  const fs = tradeHeroFacts(shown), fh = tradeHeroFacts(hidden);
  if (!fs || !fs.answer || fs.answer.value !== usd(36000) || fs.cells.length !== 3 || fs.withheld) reds.push(`trade take (money shown): the answer and three companions do not print as expected`);
  if (!fh || fh.answer || fh.cells.length !== 1 || fh.cells[0].key !== "net" || !fh.withheld || !fh.foot?.text.startsWith(COPY.tradeHero.withheld)) reds.push(`trade take (money not shown): the state word, the net alone and the withheld foot do not print as expected`);
  for (const f of [fs, fh]) if (f) { for (const c of f.cells) { if (c.label.split(/\s+/).length > 4) reds.push(`trade take: label over four words: "${c.label}"`); if (c.note && c.note.length > 48) reds.push(`trade take: note over 48 characters: "${c.note}"`); } if (f.crumb.length !== 2) reds.push(`trade take: the crumb holds ${f.crumb.length} segments, not the city and the country`); ban("trade take", [f.absent.label, f.absent.word, f.absent.note, f.answer?.label ?? "", f.answer?.basis ?? "", f.foot?.text ?? "", ...f.cells.flatMap((c) => [c.label, c.note ?? ""])]); }
  const ss = buildTradeSpread(shown), sh = buildTradeSpread(hidden);
  if (!ss || ss.marks.length !== 3 || !ss.marks.find((m) => m.key === "typical")?.lead || ss.basis !== COPY.tradeSpread.basisModelled || ss.withheld) reds.push(`trade spread (money shown, modelled): three marks with the typical as the lead under the modelled basis do not build`);
  if (!sh || sh.marks.length !== 0 || sh.basis || sh.withheld !== COPY.tradeSpread.withheld) reds.push(`trade spread (money not shown): the withheld line without a basis does not build`);
  const measured = buildTradeSpread({ ...shown, headline: { ...shown.headline, rev_spread_basis: "measured" } });
  if (!measured || measured.basis !== COPY.tradeSpread.basisMeasured || measured.sample) reds.push(`trade spread (measured): the measured basis does not build`);
  for (const d of [ss, sh, measured]) if (d) ban("trade spread", [d.basis ?? "", d.withheld ?? "", ...d.marks.map((m) => m.label)]);
  console.log(`trade opening: the one net builder with the engine absent lands ${counts.ladder} of ${counts.total} trades on the shard's ladder and ${counts.profile} on the sector profile (${counts.fill} of them past the 42 / 10 / 5 fill, withheld), 0 on the fill; the suits draw the two prose notes on ${counts.total - notCharacter} of ${counts.total} trades and the not-gathered row on ${notCharacter}, at most ${rowsMax} rows; ${longFacts} authored facts run over the locals notes' ${FACT_CHARS_CAP}-character cap (the longest ${longestFact}), a copy fault in the source file and not cut here; ${retiredBanned} banned word(s) on retired or merged ids that reach no reader${retiredBanned ? ` (${retiredQueue.join(", ")})` : ""}`);
}

/* THE TRADE PAGE'S FIRST BAND OF TURN ONE (MODEL.md 8.6 `03 permits | 04
   open`; plan step 33's second dispatch, 2026-09-18), on every one of the 243
   shard ids, without the database. THE PERMITS: every shard builds a card;
   every cell prints a figure in the days form ("30 days", "1 day"), never a
   word, never "0 days" (a zero-day licence is withheld and counted); the
   withheld line agrees with the zero-day rows BOTH WAYS (a zero with no line
   is a silent drop, a line with no zero is a card apologising for nothing);
   the longest wait is the first cell; no banned word or unfilled placeholder
   in a label, the basis, the foot or the line; the count of cells per shard is
   printed (2 / 46 / 146 / 49, counted here rather than remembered). THE COST
   TO OPEN: the archetype's key measured over the 243 ids (153 keyed, 90 on
   the default: item 48's own numbers, held as a ratchet in the direction the
   data track moves them), the foot's two companions resolving on every shard
   id in the months and years forms, and the three states off fixture seeds:
   held (lines -> ranked rows, the total the sum of the lines, the biggest
   line the leader, accent on), baseline (no lines, a keyed trade -> the
   table's figure, accent on, one basis naming all three figures), withheld
   (no lines, a default trade -> the stated line in the site's idiom, no
   figure, accent off). Every string through the register ban. */
{
  const ban = (where: string, texts: string[]) => {
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`${where}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`${where}: a placeholder was never filled ("${t}")`);
    }
  };
  const ids = readdirSync("data/facts/industry").filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort();
  const perShard: Record<number, number> = {};
  let withheldCards = 0, cellsTotal = 0, footFull = 0;
  const DAYS = /^(1 day|\d+ days)$/;
  for (const id of ids) {
    const p = buildPermits(id);
    if (!p) { reds.push(`permits ${id}: no card off a shard that holds licences`); continue; }
    perShard[p.cells.length] = (perShard[p.cells.length] ?? 0) + 1;
    cellsTotal += p.cells.length;
    const zero = p.count - p.cells.length;
    if (zero > 0 && !p.withheld) reds.push(`permits ${id}: ${zero} zero-day licence(s) and no withheld line (a silent drop)`);
    if (zero === 0 && p.withheld) reds.push(`permits ${id}: a withheld line with nothing withheld`);
    if (p.withheld) withheldCards++;
    for (const c of p.cells) {
      if (typeof c.value !== "string" || !DAYS.test(c.value) || c.value === "0 days") reds.push(`permits ${id}: the cell ${c.key} prints "${String(c.value)}", not the days form`);
      if (!c.label.trim()) reds.push(`permits ${id}: an empty label on ${c.key}`);
      if (c.confidence !== "modeled") reds.push(`permits ${id}: a cell not marked modelled (R12)`);
    }
    if (p.longest && p.cells[0]?.key !== p.longest.key) reds.push(`permits ${id}: the longest wait is not the first cell`);
    if (p.cells.length > 1 && p.longest) { const days = Math.max(...p.cells.map((c) => parseInt(String(c.value), 10))); if (days !== p.longest.days) reds.push(`permits ${id}: the longest wait named (${p.longest.days}) is not the longest printed (${days})`); }
    ban(`permits ${id}`, [...p.cells.map((c) => c.label), p.basis, p.foot, p.withheld ?? ""]);
    if (buildOpenFoot(id).length === 2) footFull++;
  }
  const states = countOpenStates(ids, industryToSlug);
  if (states.keyed !== 153 || states.default !== 90) reds.push(`open: the archetype keys ${states.keyed} of ${states.total} shard ids and leaves ${states.default} on the default; item 48 counts 153 and 90 (a change here is the data track's to record)`);
  if (footFull !== ids.length) reds.push(`open: the foot's two companions resolve on ${footFull} of ${ids.length} shard ids, not all`);
  const lines = { items: [{ name: "Fit-out", usd: 250000 }, { name: "Equipment", usd: 100000 }, { name: "Lease deposit", usd: 40000 }, { name: "Business registration", usd: 20 }] };
  const held = buildOpen({ meta: { industry: "restaurants", industry_id: "restaurants" }, setup: lines });
  if (!held || held.state !== "held" || held.rows.length !== 4 || held.tail !== null || held.tailLine !== null || held.value !== 390020 || held.figure !== usd(390020) || !held.accent || held.sample || held.basis !== COPY.tradeOpen.basisHeld || held.foot.length !== 2 || held.footLine !== null) reds.push("open (held): four lines do not build the total, the accent, the one basis and the foot as expected");
  if (held && held.rows.find((r) => r.key === held.biggestKey)?.name !== "Fit-out") reds.push("open (held): the biggest line is not the leader");
  /* THE CAP (open_rows.ts DRAWN_LINES_CAP): the exemplar's nine lines draw as the
     five biggest with the four smallest stated, count and sum, in the capped
     basis; the total is still every line's sum; a five-line bill draws all five
     and no tail line; a six-line bill states its one smallest line singular. */
  const nine = { items: [{ name: "Fit-out", usd: 250000 }, { name: "Equipment", usd: 100000 }, { name: "Initial inventory", usd: 20000 }, { name: "Lease deposit", usd: 40000 }, { name: "Pre-opening marketing", usd: 12000 }, { name: "Business registration", usd: 20 }, { name: "Industry licences", usd: 1500 }, { name: "Insurance and bonds", usd: 2000 }, { name: "Certifications", usd: 500 }] };
  const capped = buildOpen({ meta: { industry: "restaurants", industry_id: "restaurants" }, setup: nine });
  if (!capped || capped.rows.length !== 5 || capped.lines.length !== 9 || capped.value !== 426020 || !capped.tail || capped.tail.count !== 4 || capped.tail.sum !== 4020 || capped.tailLine !== "The four smallest lines, $4,020 together, are in the total." || capped.basis !== COPY.tradeOpen.basisHeldCapped) reds.push(`open (held, nine lines): the five biggest do not draw with the four smallest stated ("${capped?.tailLine}")`);
  if (capped && capped.rows.some((r) => r.value < 12000)) reds.push("open (held, nine lines): a line under the fifth biggest is drawn");
  const five = buildOpen({ meta: { industry: "restaurants", industry_id: "restaurants" }, setup: { items: nine.items.slice(0, 5) } });
  if (!five || five.rows.length !== 5 || five.tail !== null || five.basis !== COPY.tradeOpen.basisHeld) reds.push("open (held, five lines): five lines draw with a tail or the capped basis");
  const six = buildOpen({ meta: { industry: "restaurants", industry_id: "restaurants" }, setup: { items: nine.items.slice(0, 6) } });
  if (!six || six.rows.length !== 5 || six.tail?.count !== 1 || six.tailLine !== "The smallest line, $20, is in the total.") reds.push(`open (held, six lines): the one smallest line is not stated singular ("${six?.tailLine}")`);
  const base = buildOpen({ meta: { industry: "restaurants", industry_id: "restaurants" } });
  if (!base || base.state !== "baseline" || base.value !== 300000 || !base.accent || !base.sample || base.basis !== COPY.tradeOpen.basisBaseline || base.footLine !== null || base.foot.length !== 2) reds.push("open (baseline): a keyed trade with no lines does not build the table's figure, the accent, the one basis and the foot as expected");
  const withheld = buildOpen({ meta: { industry: "shoe-repair", industry_id: "shoe_repair" } });
  if (!withheld || withheld.state !== "withheld" || withheld.figure !== null || withheld.accent || withheld.withheld !== COPY.tradeOpen.withheld || !withheld.withheld.startsWith("Not gathered yet:") || withheld.basis !== null || withheld.foot.length !== 2) reds.push("open (withheld): a default trade with no lines does not build the stated line, no figure and the foot as expected");
  const noShard = buildOpen({ meta: { industry: "restaurants", industry_id: "no_such_trade" } });
  if (!noShard || noShard.foot.length !== 0 || noShard.footLine !== COPY.tradeOpen.footWithheld || noShard.basis !== COPY.tradeOpen.basisBaselineAlone) reds.push("open (no shard): the withheld foot line and the total's own basis do not build");
  const heldNoShard = buildOpen({ meta: { industry: "restaurants", industry_id: "no_such_trade" }, setup: nine });
  if (!heldNoShard || heldNoShard.basis !== COPY.tradeOpen.basisHeldCappedAlone || heldNoShard.footLine !== COPY.tradeOpen.footWithheld) reds.push("open (held, no shard): the total's own capped basis and the withheld foot do not build");
  for (const [name, o] of [["held", held], ["held, nine lines", capped], ["held, six lines", six], ["held, no shard", heldNoShard], ["baseline", base], ["withheld", withheld], ["no shard", noShard]] as const) if (o) ban(`open (${name})`, [o.basis ?? "", o.withheld ?? "", o.footLine ?? "", o.tailLine ?? "", ...o.foot.flatMap((c) => [c.figure, c.words]), ...o.rows.map((r) => r.name)]);
  for (const o of [held, base, withheld]) if (o) for (const c of o.foot) if (!/^(1 month|\d+ months)$/.test(c.figure) && !/^(1 year|\d+(\.\d)? years)$/.test(c.figure)) reds.push(`open: a companion off the months or years form: "${c.figure}"`);
  console.log(`trade turn one: the permits build on ${ids.length} shards, ${cellsTotal} cells (${Object.entries(perShard).sort().map(([k, v]) => `${v} with ${k}`).join(", ")}), ${withheldCards} with a zero-day licence withheld; the cost to open is keyed on ${states.keyed} of ${states.total} shard ids and on the default for ${states.default} (item 48), the foot's two companions on ${footFull}; the three states build off fixtures`);
}

/* THE TRADE PAGE'S SECOND BAND OF TURN ONE (MODEL.md 8.6 `05 split | 06
   team`; plan step 33's third dispatch, 2026-09-18), on every one of the 243
   shard ids with the engine absent, without the database. THE SPLIT: the one
   net builder's figure is the split's net on every trade (R7: `netPct` and
   `netText` are the builder's own, so `00`'s companion and `05`'s focal are
   one figure; the city's income gate is the precedent), the feed is the
   shard's drivers only where they are tagged held (79) and the sector profile
   otherwise (164), a drawn card's segments plus its net come to a hundred
   within the residual law's tolerance with the residual named as its own
   segment when it is, a withheld card draws no segment and carries the
   stated line, no segment is negative, every legend label is within PART 5's
   three words (the copy table's short form on the 79 held shards, held both
   ways: a name over three words with no entry is a red, an entry naming no
   shard line is a dead row), the plus holds its two rows on every shard, and
   the counts (drawn, withheld and which, residual, exact) are printed rather
   than remembered. THE TEAM: two to seven rows on every shard under one of
   the three key spellings, the count column a count and the pay column the
   index times the country's median (a whole dollar, the kit's one grammar),
   dashes with the line said once where the country holds no credible median
   (the pay builder's own withholding, Cuba and Egypt), no dash and no line
   where it does, the rows dearest first, the name block's two lines the
   shard's words whole (the split at " or " and at a parenthetical reassembles
   to the name), and the counts per shard printed. Every string through the
   register ban. */
{
  const ban = (where: string, texts: string[]) => {
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`${where}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`${where}: a placeholder was never filled ("${t}")`);
    }
  };
  const ids = readdirSync("data/facts/industry").filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort();
  const netOf = (id: string) => resolveTradeNet(id, { moneyShown: false, netMarginPct: null });
  const used = new Set<string>();
  let detailFull = 0, labelsShortened = 0;
  for (const id of ids) {
    const net = netOf(id);
    if (!net) { reds.push(`split ${id}: no net off the one builder (R7 allows no net-less mode)`); continue; }
    const sp = resolveSplit(id, net);
    if (!sp) { reds.push(`split ${id}: builds nothing off a shard that holds a cost stack`); continue; }
    if (sp.netPct !== net.pct || sp.netText !== net.text) reds.push(`split ${id}: the split's net (${sp.netText}) is not the one builder's (${net.text})`);
    if (sp.netLabel !== COPY.tradeHero.cells.net) reds.push(`split ${id}: the focal's label is not the opening card's companion label`);
    const shard = shardCostLines(id);
    if ((sp.feed === "shard") !== (shard.held && shard.lines.length > 0)) reds.push(`split ${id}: fed by the ${sp.feed} while the shard's drivers are ${shard.held ? "held" : "not held"}`);
    if (sp.state === "drawn") {
      if (sp.withheld) reds.push(`split ${id}: a drawn card with a withheld line`);
      const sum = sp.segments.reduce((a, g) => a + g.share, 0) + sp.netPct;
      if (Math.abs(sum - 100) > 0.5) reds.push(`split ${id}: the segments and the net come to ${sum.toFixed(2)}, not a hundred`);
      if (sp.segments.some((g) => !(g.share > 0))) reds.push(`split ${id}: a segment at or under zero is drawn`);
      if (sp.segments.length < 2) reds.push(`split ${id}: ${sp.segments.length} segment(s), under the breakdown's two`);
      const res = sp.segments.find((g) => g.key === "unallocated");
      if ((res != null) !== (sp.residual != null)) reds.push(`split ${id}: the residual is ${sp.residual == null ? "not " : ""}counted while the segment is ${res ? "" : "not "}drawn`);
      for (const g of sp.segments) {
        if (g.label.split(/\s+/).filter(Boolean).length > SPLIT_LABEL_WORDS_CAP) reds.push(`split ${id}: a legend label over ${SPLIT_LABEL_WORDS_CAP} words: "${g.label}"`);
        if (!g.label.trim()) reds.push(`split ${id}: an empty legend label on ${g.key}`);
      }
      ban(`split ${id}`, sp.segments.map((g) => g.label));
    } else {
      if (sp.segments.length) reds.push(`split ${id}: a withheld card with segments`);
      if (sp.withheld !== COPY.tradeSplit.withheld) reds.push(`split ${id}: a withheld card without the stated line`);
      if (sp.linesPct + sp.netPct <= 100.5) reds.push(`split ${id}: withheld at ${(sp.linesPct + sp.netPct).toFixed(1)}, not over a hundred`);
    }
    if (sp.state === "drawn" && sp.basis !== (sp.feed === "shard" ? COPY.tradeSplit.basisShard : COPY.tradeSplit.basisProfile)) reds.push(`split ${id}: the basis does not name the feed`);
    if (sp.state === "withheld" && (sp.basis !== COPY.tradeSplit.basisWithheld || sp.foot)) reds.push(`split ${id}: a withheld card's basis or foot speaks of shares it does not draw`);
    if (sp.state === "drawn" && sp.foot !== COPY.tradeSplit.foot) reds.push(`split ${id}: a drawn card without the modelled foot`);
    if (sp.detail) { detailFull++; if (sp.detail.rows.length !== 2 || sp.detail.rows.some((r) => !/^\d+%$/.test(r.value))) reds.push(`split ${id}: the plus does not hold its two shares as whole percents`); }
    ban(`split ${id}`, [sp.basis, sp.foot, sp.withheld ?? "", ...(sp.detail ? [sp.detail.summary, ...sp.detail.rows.flatMap((r) => [r.label, r.note ?? ""])] : [])]);
    /* THE SHORT LABELS, BOTH WAYS, on every shard's drivers whatever the feed:
       a name over three words must have an entry, and every entry must name a
       line some shard holds. */
    const names = shardCostLineNames(id);
    for (const n of names) {
      const short = COPY.tradeSplit.lineLabels[n];
      if (short) { used.add(n); labelsShortened++; }
      if (shard.held && driverLabel(n).split(/\s+/).filter(Boolean).length > SPLIT_LABEL_WORDS_CAP) reds.push(`split ${id}: the held driver "${n}" has no short label within ${SPLIT_LABEL_WORDS_CAP} words`);
      if (short && short.split(/\s+/).filter(Boolean).length > SPLIT_LABEL_WORDS_CAP) reds.push(`split labels: the short form "${short}" runs over ${SPLIT_LABEL_WORDS_CAP} words`);
    }
  }
  for (const n of Object.keys(COPY.tradeSplit.lineLabels)) if (!used.has(n)) reds.push(`split labels: a dead row, no shard names a driver "${n}"`);
  const counts = countSplitStates(ids, netOf);
  if (counts.noNet) reds.push(`split: ${counts.noNet} shard id(s) build no split`);
  if (detailFull !== ids.length) reds.push(`split: the plus holds two rows on ${detailFull} of ${ids.length} shards, not all`);
  /* THE TEAM over the 243 in the exemplar's country, then the two countries the pay builder withholds and one the profile does not hold. */
  const rows = countTeamRows(ids);
  if (rows.none) reds.push(`team: ${rows.none} shard id(s) hold no roles`);
  let dashCards = 0;
  for (const id of ids) {
    const t = buildTeam(id, "GB");
    if (!t) { reds.push(`team ${id}: builds nothing in the exemplar's country`); continue; }
    if (t.rows.length < 2 || t.rows.length > TEAM_ROWS_CAP) reds.push(`team ${id}: ${t.rows.length} rows, outside two to ${TEAM_ROWS_CAP}`);
    if (t.median == null || t.noMedian) reds.push(`team ${id}: no median in the exemplar's country`);
    const oneDecimal = t.roles.some((r) => !Number.isInteger(r.headcount));
    for (const r of t.rows) {
      if (r.a == null || !(oneDecimal ? /^\d+\.\d$/ : /^\d+$/).test(r.a)) reds.push(`team ${id}: the count "${r.a}" is not one decimal count with its column`);
      if (r.b == null || !/^\$[\d,]+(K|M)?$/.test(r.b)) reds.push(`team ${id}: the pay "${r.b}" is not a dollar figure`);
      if (!r.name.trim()) reds.push(`team ${id}: an empty role name`);
    }
    for (const role of t.roles) {
      const back = role.sub ? (role.sub.startsWith("or ") ? `${role.name} ${role.sub}` : `${role.name} (${role.sub})`) : role.name;
      if (back !== role.role.trim()) reds.push(`team ${id}: the name block "${role.name}" / "${role.sub}" does not reassemble to the shard's "${role.role}"`);
      if (role.pay == null || role.pay !== Math.round(role.wageIndex * t.median!)) reds.push(`team ${id}: the pay is not the index times the median`);
    }
    for (let i = 1; i < t.roles.length; i++) if (t.roles[i].wageIndex > t.roles[i - 1].wageIndex) reds.push(`team ${id}: the rows are not dearest first`);
    ban(`team ${id}`, [...t.rows.flatMap((r) => [r.name, r.sub ?? ""]), t.basis, t.foot, t.heads.name, t.heads.a, t.heads.b]);
  }
  /* ZZ, not XX: the profile's default fallback carries "XX" as its own code, so XX matches it and reads its fill median; a code the file cannot echo is the unknown-country case. */
  for (const iso2 of ["CU", "EG", "ZZ"]) {
    const t = buildTeam("restaurants", iso2);
    if (!t) { reds.push(`team restaurants ${iso2}: builds nothing`); continue; }
    if (t.median != null || t.noMedian !== COPY.tradeTeam.noMedian || t.rows.some((r) => r.b != null)) reds.push(`team restaurants ${iso2}: a country with no credible median does not print dashes with the line said once`);
    if (t.rows.some((r) => r.a == null)) reds.push(`team restaurants ${iso2}: the count column went blank with the pay`);
    dashCards++;
    ban(`team restaurants ${iso2}`, [t.noMedian ?? ""]);
  }
  const split1 = roleLines("Owner or general manager"), split2 = roleLines("Owner-operator (working, sales and estimating)"), whole = roleLines("Line and prep cook");
  if (split1.name !== "Owner" || split1.sub !== "or general manager" || split2.name !== "Owner-operator" || split2.sub !== "working, sales and estimating" || whole.name !== "Line and prep cook" || whole.sub !== null) reds.push("team: the name block's two lines do not split at the or and the parenthetical as stated");
  console.log(`trade turn one, band two: the split draws on ${counts.drawn} of ${counts.total} shard ids with the engine absent (${counts.shardFed} off the shard's held drivers, ${counts.profileFed} off the sector profile; ${counts.residual} name a residual, ${counts.exact} balance) and is withheld on ${counts.withheld} (${counts.withheldIds.join(", ")}); ${labelsShortened} driver names take the copy table's short form, ${Object.keys(COPY.tradeSplit.lineLabels).length} entries all live; the plus holds its two rows on ${detailFull}; the team draws ${Object.entries(rows.perCount).sort().map(([k, v]) => `${v} with ${k}`).join(", ")} rows, ${rows.split} name blocks split at an or or a parenthetical, ${rows.over} labels still over three words (the shards' own compounds, item 54), dashes with the line on ${dashCards} no-median countries`);
}

/* THE TRADE PAGE'S PEERS, ITS SHARE OF A DAY AND ITS SURVIVAL (MODEL.md 8.6
   `07 peers`, `08 clears`, `09 lasts`; plan step 33's fourth dispatch,
   2026-09-18), without the database. THE PEERS off three fixture seeds: a
   United States cell with a slate of seven (five printed, the cap, the home
   row first and tinted, every figure an absolute, no line); London with no
   slate (the home row alone printing its own figure under the not-gathered
   line, the seated table); a cell off `moneyShown` (the home row's takings
   null, the dash line said once; with no slate, both lines). Never an
   invented peer: a row without a name is dropped, a home-named row is not
   printed twice, a figure that is not a number is a dash and never a word.
   THE SHARE on every one of the 243 shard ids with money not shown (the
   shard branch, a whole percent above zero, the stated basis and foot) and
   on the engine branch off a seed carrying the engine's ratio (money shown,
   75 for restaurants: the trade's fixed-cost share over its gross margin)
   and off the bundled dev seed's shape (two rounded counts, 36 of 45 -> 80);
   a seed with money shown and no engine share falls to the shard. THE
   SURVIVAL on every shard id: three cells, year five first, every figure in
   the percent form, the triple falling from year one to year five, every
   cell modelled (R12). Every string through the register ban. */
{
  const ban = (where: string, texts: string[]) => {
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`${where}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`${where}: a placeholder was never filled ("${t}")`);
    }
  };
  const ids = readdirSync("data/facts/industry").filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort();
  const slateRows = [{ name: "Texas", home: false, rev_p50_usd: 900000 }, { name: "Florida", home: false, rev_p50_usd: 850000 }, { name: "New York", home: false, rev_p50_usd: 1200000 }, { name: "Illinois", home: false, rev_p50_usd: 780000 }, { name: "Pennsylvania", home: false, rev_p50_usd: 700000 }, { name: "Ohio", home: false, rev_p50_usd: 650000 }, { name: "Georgia", home: false }, { name: "", home: false, rev_p50_usd: 1 }, { name: "California", home: false, rev_p50_usd: 5 }];
  const slate = buildTradePeers({ meta: { city: "California", iso2: "US", industry_id: "restaurants", money_shown: true }, headline: { rev_p50_usd: 1100000 }, nearby: { places: slateRows } });
  if (!slate || slate.peers !== TRADE_PEERS_CAP || slate.rows.length !== TRADE_PEERS_CAP + 1 || !slate.rows[0].home || slate.rows[0].name !== "California" || slate.rows[0].values.takings !== 1100000 || slate.notGathered || slate.homeWithheld || slate.columns.length !== 1 || slate.columns[0].unit !== "usd") reds.push("trade peers (slate): the home row first with its figure, five peers of seven and no stated line do not build as expected");
  if (slate && (slate.rows.slice(1).some((r) => r.home || !r.name || r.name === "California") || slate.rows.slice(1).map((r) => r.name).join("|") !== "Texas|Florida|New York|Illinois|Pennsylvania")) reds.push(`trade peers (slate): the peers are not the slate's first five named rows in the slate's order (${slate.rows.slice(1).map((r) => r.name).join(", ")})`);
  const dashPeer = buildTradePeers({ meta: { city: "California", iso2: "US", industry_id: "restaurants", money_shown: true }, headline: { rev_p50_usd: 1100000 }, nearby: { places: [{ name: "Georgia", home: false }, { name: "Nevada", home: false, rev_p50_usd: "n/a" }] } });
  if (!dashPeer || dashPeer.peers !== 2 || dashPeer.rows.slice(1).some((r) => r.values.takings !== null)) reds.push("trade peers (a peer without a figure): the row does not print a dash for its takings");
  const seated = buildTradePeers({ meta: { city: "London", iso2: "GB", industry_id: "restaurants", money_shown: true }, headline: { rev_p50_usd: 620000 } });
  if (!seated || seated.peers !== 0 || seated.rows.length !== 1 || !seated.rows[0].home || seated.rows[0].values.takings !== 620000 || seated.notGathered !== COPY.tradePeers.notGathered || !seated.notGathered.startsWith("Not gathered yet:") || seated.homeWithheld) reds.push("trade peers (seated): the home row alone with its figure under the not-gathered line does not build");
  const dashed = buildTradePeers({ meta: { city: "Mumbai", iso2: "IN", industry_id: "cafes_coffee", money_shown: false }, headline: { rev_p50_usd: 5215000 } });
  if (!dashed || dashed.rows.length !== 1 || dashed.rows[0].values.takings !== null || dashed.homeWithheld !== COPY.tradePeers.homeWithheld || dashed.notGathered !== COPY.tradePeers.notGathered) reds.push("trade peers (off moneyShown, no slate): the home row's dash with both lines does not build");
  const dashedSlate = buildTradePeers({ meta: { city: "Nevada", iso2: "US", industry_id: "restaurants", money_shown: false }, headline: { rev_p50_usd: 900000 }, nearby: { places: slateRows.slice(0, 3) } });
  if (!dashedSlate || dashedSlate.peers !== 3 || dashedSlate.rows[0].values.takings !== null || dashedSlate.notGathered || dashedSlate.homeWithheld !== COPY.tradePeers.homeWithheld) reds.push("trade peers (off moneyShown, a slate): the peers print, the home row's dash with its one line");
  if (buildTradePeers({ meta: { iso2: "GB" } }) !== null) reds.push("trade peers: a seed naming no place builds a table");
  for (const p of [slate, seated, dashed, dashedSlate]) if (p) ban("trade peers", [p.caveat, p.entityHead, p.notGathered ?? "", p.homeWithheld ?? "", ...p.columns.map((c) => c.head), ...p.rows.map((r) => r.name)]);
  const engineClears = buildClears({ meta: { industry_id: "restaurants", money_shown: true }, break_even: { share_pct: 75 } });
  if (!engineClears || engineClears.branch !== "engine" || engineClears.value !== 75 || engineClears.figure !== "75%" || !engineClears.accent || !engineClears.sample || engineClears.basis !== COPY.tradeClears.basis || engineClears.foot !== COPY.tradeClears.foot) reds.push("clears (engine): the engine's 75 does not print as 75% on the engine branch with the accent, the basis and the foot");
  const devClears = buildClears({ meta: { industry_id: "restaurants", money_shown: true }, break_even: { covers_per_day: 36, typical_covers_per_day: 45 } });
  if (!devClears || devClears.branch !== "engine" || devClears.value !== 80) reds.push("clears (the dev seed's two counts): 36 of 45 does not print as 80% on the engine branch");
  const noEngine = buildClears({ meta: { industry_id: "restaurants", money_shown: true } });
  if (!noEngine || noEngine.branch !== "shard" || noEngine.value !== 70) reds.push("clears (money shown, no engine share): the card does not fall to the shard's 70");
  if (buildClears({ meta: { industry_id: "no_such_trade", money_shown: false } }) !== null) reds.push("clears: a trade with no shard and no engine share builds a card");
  let shardClears = 0, lastsCards = 0; const clearsRange = { min: Infinity, max: -Infinity };
  for (const id of ids) {
    const cl = buildClears({ meta: { industry_id: id, money_shown: false } });
    if (!cl) { reds.push(`clears ${id}: no card off a shard that holds the share`); continue; }
    if (cl.branch !== "shard" || !Number.isInteger(cl.value) || cl.value < 1 || cl.figure !== `${cl.value}%`) reds.push(`clears ${id}: the shard branch prints "${cl.figure}", not a whole percent above zero`);
    clearsRange.min = Math.min(clearsRange.min, cl.value); clearsRange.max = Math.max(clearsRange.max, cl.value);
    shardClears++;
    ban(`clears ${id}`, [cl.basis, cl.foot]);
    const l = buildLasts(id);
    if (!l) { reds.push(`lasts ${id}: no card off a shard that holds the triple`); continue; }
    lastsCards++;
    if (l.cells.length !== 3 || l.cells[0].key !== "yr5" || l.cells[1].key !== "yr1" || l.cells[2].key !== "yr3") reds.push(`lasts ${id}: the cells are not year five, one, three in that order`);
    for (const c of l.cells) { if (typeof c.value !== "string" || !/^\d{1,3}%$/.test(c.value)) reds.push(`lasts ${id}: the cell ${c.key} prints "${String(c.value)}", not the percent form`); if (c.confidence !== "modeled") reds.push(`lasts ${id}: a cell not marked modelled (R12)`); }
    if (!(l.values.yr1 >= l.values.yr3 && l.values.yr3 >= l.values.yr5)) reds.push(`lasts ${id}: the triple does not fall from year one to year five (${l.values.yr1} / ${l.values.yr3} / ${l.values.yr5})`);
    if (l.focal.key !== "yr5" || l.focal.value !== l.values.yr5) reds.push(`lasts ${id}: the focal named is not year five`);
    ban(`lasts ${id}`, [...l.cells.map((c) => c.label), l.basis, l.foot]);
  }
  if (buildLasts("no_such_trade") !== null || buildLasts(undefined) !== null) reds.push("lasts: a trade with no shard builds a card");
  console.log(`trade turn one's close and turn two's first band: the peers build the home row and ${slate?.peers ?? 0} of ${slateRows.filter((r) => r.name && r.name !== "California").length} named peers off a slate, the seated table off none, the dash off moneyShown; the share draws off the shard on ${shardClears} of ${ids.length} shard ids (${clearsRange.min} to ${clearsRange.max}) and off the engine where money is shown (restaurants 75); the survival grid draws on ${lastsCards} of ${ids.length}, every triple falling`);
}

/* THE TRADE PAGE'S SECOND BAND OF TURN TWO AND ITS BENTO (MODEL.md 8.6 `10
   watch`, `11 mix`, `12 market`; plan step 33's fifth dispatch, 2026-09-18),
   without the database. THE SEAT is held below with the country's and the
   city's (COPY.blocked.watch: one line under fifteen words, a foot naming
   item 53, the kicker within four words). THE MIX on every one of the 243
   shard ids: two to five named parts, each label the shard's own name and
   each share a whole percent, the leader first and the rest falling, the
   parts summing to the whole within the tolerance (counted: every file
   sums to 100 exactly), the leader named, no withheld line; the withheld
   shape is the builder's own arithmetic on the tolerance, checked at the
   whole's edges, because no shard takes it. THE MARKET on every shard id:
   four cells in declared order, the density printed as the file holds it
   (whole where whole, else at most three decimals, never "0" for a
   fraction), the two counts whole parts in 0 to 100, the swing a whole
   percent, every basis within fourteen words, the four openers within
   PART 7's four words. Every string through the register ban. */
{
  const ban = (where: string, texts: string[]) => {
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`${where}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`${where}: a placeholder was never filled ("${t}")`);
    }
  };
  const wordsOf = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
  const ids = readdirSync("data/facts/industry").filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort();
  const partCounts: Record<number, number> = {};
  let mixCards = 0, mixSum100 = 0;
  /* A SHARD'S OWN NAME PAST THE REGISTER BAN, BY EXACT STRING. "Contact
     lenses and solutions" (eyewear_optical and optometry, both live) carries
     "solution", which the ban lists for the corporate word; here it is the
     lens-care fluid a shop sells, a product a reader knows, and the name is
     the shard's own, never shortened on the card. The ban is a substring
     floor that cannot tell a product from a buzzword, so the exemption is
     the exact label and nothing wider, and it reds the day it matches no
     shard, the way a withheld line with nothing withheld reds. The data
     track may still rename it (a queue row in the dispatch's report). */
  const MIX_LABELS_PAST_THE_REGISTER = new Set(["Contact lenses and solutions"]);
  const seenPastBan = new Set<string>();
  for (const id of ids) {
    const m = buildMix(id);
    if (!m) { reds.push(`mix ${id}: no card off a shard that holds channels`); continue; }
    mixCards++;
    partCounts[m.parts.length] = (partCounts[m.parts.length] ?? 0) + 1;
    if (m.parts.length < 2 || m.parts.length > 5) reds.push(`mix ${id}: ${m.parts.length} parts; the composition holds two to five`);
    if (Math.abs(m.sum - MIX_WHOLE) > MIX_SUM_TOLERANCE) reds.push(`mix ${id}: the parts sum to ${m.sum}, outside the tolerance, and the card should withhold`);
    if (m.sum === MIX_WHOLE) mixSum100++;
    if (m.withheld || !m.leader || m.cells.length !== m.parts.length) reds.push(`mix ${id}: a whole that withholds or names no leader`);
    for (let i = 1; i < m.parts.length; i++) if (m.parts[i].share > m.parts[i - 1].share) reds.push(`mix ${id}: the parts do not fall from the leader (${m.parts.map((p) => p.share).join(" / ")})`);
    if (m.leader && m.cells[0]?.key !== m.leader.key) reds.push(`mix ${id}: the leader is not the first cell`);
    for (const c of m.cells) {
      if (typeof c.value !== "string" || !/^\d{1,3}%$/.test(c.value)) reds.push(`mix ${id}: the cell ${c.key} prints "${String(c.value)}", not the percent form`);
      if (c.confidence !== "modeled") reds.push(`mix ${id}: a cell not marked modelled (R12)`);
      if (!c.label.trim()) reds.push(`mix ${id}: a part with no name`);
    }
    for (const c of m.cells) { if (MIX_LABELS_PAST_THE_REGISTER.has(c.label)) seenPastBan.add(c.label); else ban(`mix ${id}`, [c.label]); }
    ban(`mix ${id}`, [m.basis, m.foot]);
  }
  for (const label of MIX_LABELS_PAST_THE_REGISTER) if (!seenPastBan.has(label)) reds.push(`mix: the register exemption for "${label}" matches no shard's channel name any more; delete it`);
  if (buildMix("no_such_trade") !== null || buildMix(undefined) !== null) reds.push("mix: a trade with no shard builds a card");
  if (wordsOf(COPY.tradeMix.withheld) > 14) reds.push(`mix: the withheld line runs ${wordsOf(COPY.tradeMix.withheld)} words, over fourteen`);
  ban("mix", [COPY.tradeMix.withheld, COPY.tradeMix.basis, COPY.tradeMix.foot]);
  if (wordsOf(COPY.tradeMix.kicker) > 4) reds.push(`mix: the kicker runs over four words: "${COPY.tradeMix.kicker}"`);
  /* The withheld shape, off the builder's own arithmetic: a sum at the tolerance's edge prints, one past it withholds. */
  const edge = MIX_WHOLE - MIX_SUM_TOLERANCE;
  if (!(Math.abs(edge - MIX_WHOLE) <= MIX_SUM_TOLERANCE) || Math.abs(edge - 1 - MIX_WHOLE) <= MIX_SUM_TOLERANCE) reds.push("mix: the tolerance does not close at the whole's edges as the builder states");

  const K = COPY.tradeMarket.kickers;
  for (const [key, k] of Object.entries(K)) if (wordsOf(k) > 4) reds.push(`market ${key}: the opener runs over four words: "${k}"`);
  for (const [key, b] of Object.entries(COPY.tradeMarket.basis)) if (wordsOf(b) > 14) reds.push(`market ${key}: a basis over fourteen words: "${b}"`);
  for (const [key, w] of Object.entries(COPY.tradeMarket.withheld)) if (wordsOf(w) > 14) reds.push(`market ${key}: a withheld line over fourteen words: "${w}"`);
  ban("market", [...Object.values(COPY.tradeMarket.basis), ...Object.values(COPY.tradeMarket.withheld)]);
  if (densityText(16) !== "16" || densityText(4.5) !== "4.5" || densityText(0.003) !== "0.003" || densityText(1.7) !== "1.7" || densityText(0.1) !== "0.1") reds.push("market: the density does not print as the file holds it");
  let marketCards = 0, fractions = 0;
  const held: Record<(typeof MARKET_CELLS)[number], number> = { firms: 0, chains: 0, close: 0, swing: 0 };
  const range: Record<(typeof MARKET_CELLS)[number], [number, number]> = { firms: [Infinity, -Infinity], chains: [Infinity, -Infinity], close: [Infinity, -Infinity], swing: [Infinity, -Infinity] };
  for (const id of ids) {
    const m = buildMarket(id);
    if (!m) { reds.push(`market ${id}: no cluster off a shard that holds the four fields`); continue; }
    marketCards++;
    if (m.withheld !== 0) reds.push(`market ${id}: ${m.withheld} cell(s) withheld on a shard counted as holding all four`);
    if (m.confidence !== "modeled") reds.push(`market ${id}: the cluster not marked modelled (R12)`);
    for (const key of MARKET_CELLS) {
      const cell = m[key];
      if ("withheld" in cell) continue;
      if (cell.tag === "held") held[key]++;
      range[key][0] = Math.min(range[key][0], cell.value); range[key][1] = Math.max(range[key][1], cell.value);
      if (wordsOf(cell.basis) > 14) reds.push(`market ${id}: the ${key} basis runs over fourteen words`);
      if ("figure" in cell) {
        if (key === "firms") { if (cell.figure === "0" || !/^\d+(\.\d{1,3})?$/.test(cell.figure)) reds.push(`market ${id}: the density prints "${cell.figure}"`); if (!Number.isInteger(cell.value)) fractions++; }
        if (key === "swing" && !/^\d{1,3}%$/.test(cell.figure)) reds.push(`market ${id}: the swing prints "${cell.figure}", not a whole percent`);
      } else if (!Number.isInteger(cell.part) || cell.part < 0 || cell.part > 100 || cell.whole !== 100) reds.push(`market ${id}: the ${key} count is ${cell.part} of ${cell.whole}, not a whole part in 100`);
    }
  }
  if (buildMarket("no_such_trade") !== null || buildMarket(undefined) !== null) reds.push("market: a trade with no shard builds a cluster");
  console.log(`trade turn two's second band and turn three: the mix draws on ${mixCards} of ${ids.length} shard ids (parts ${Object.entries(partCounts).map(([n, c]) => `${n}: ${c}`).join(", ")}; ${mixSum100} sum to 100 exactly); the market on ${marketCards} of ${ids.length} (firms ${range.firms.join(" to ")}, ${fractions} with a fraction, ${held.firms} held; chains ${range.chains.join(" to ")}, ${held.chains} held; close ${range.close.join(" to ")}, ${held.close} held; swing ${range.swing.join(" to ")}, ${held.swing} held)`);
}

/* THE DRAWN BLOCKED SEATS (MODEL.md 8.2, `07 workforce`, `11 easiest` and the
   four of "THE THIN COUNTRY, SEATED"; plan step 31's seventh dispatch,
   2026-09-18). The seat's law is BlockedSeat.tsx's: one stated line in the
   idiom "Not gathered yet: ...", under fifteen words (the cap is the
   component's own constant, fourteen), no figure (a digit in the line would
   be one), a foot naming the requirement by its DATA-REQUIREMENTS item, no
   banned word and no em dash in either, the kicker within PART 7's four
   words. A seat that stands for a drawn card opens under that card's own
   kicker, referenced in copy.ts and never retyped, so the four are held to
   the literal their drawn card prints. Then the four seating conditions,
   counted over the taxonomy from the same builders the view and the stories
   read (no legal form, no peer table, under two credible margins in the
   snapshot, no authored notes), printed so the counts the comments quote are
   measured rather than remembered; each must seat at least one country, or
   the seat has no thin country to stand on and the story would draw nothing.
   The kicker is not held to COPY.banned: "Against the peers" is the table's
   own praised kicker and carries the banned substring by design (the list
   is applied to caveats, heads, notes and doors, never to a kicker). */
{
  const seats = Object.entries(COPY.blocked) as Array<[string, { kicker: string; line: string; foot: string }]>;
  for (const [key, seat] of seats) {
    const words = seat.line.trim().split(/\s+/).filter(Boolean).length;
    if (!seat.line.startsWith("Not gathered yet: ")) reds.push(`seat ${key}: the line is not in the idiom "Not gathered yet: ...": "${seat.line}"`);
    if (words > SEAT_LINE_WORDS_CAP) reds.push(`seat ${key}: the line runs ${words} words, over the cap of ${SEAT_LINE_WORDS_CAP}: "${seat.line}"`);
    if (/\d/.test(seat.line)) reds.push(`seat ${key}: a digit in a line whose law is no figure: "${seat.line}"`);
    if (!/^Waits on DATA-REQUIREMENTS items? \d+/.test(seat.foot)) reds.push(`seat ${key}: the foot does not name a DATA-REQUIREMENTS item: "${seat.foot}"`);
    if (seat.kicker.split(/\s+/).length > 4) reds.push(`seat ${key}: the kicker runs over four words: "${seat.kicker}"`);
    for (const t of [seat.line, seat.foot]) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`seat ${key}: banned word "${b}" in "${t}"`);
      if (/\u2014/.test(t)) reds.push(`seat ${key}: an em dash in "${t}"`);
    }
  }
  const drawnKicker: Record<string, string> = { setup: COPY.tiers.kicker, peers: COPY.peers.kicker, money: COPY.margin.kicker, locals: COPY.locals.kicker, cities: COPY.cities.kicker };
  for (const [block, kicker] of Object.entries(drawnKicker)) {
    if ((COPY.blocked as Record<string, { kicker: string }>)[block]?.kicker !== kicker) reds.push(`seat ${block}: its kicker is not the drawn card's own ("${kicker}")`);
  }
  const seated: Record<string, number> = { setup: 0, peers: 0, money: 0, locals: 0 };
  for (const iso2 of codes) {
    if (buildSetupRows(iso2).length === 0) seated.setup++;
    if (!buildPeerTable(iso2)) seated.peers++;
    const m = marginCardFromSnapshot(iso2);
    if (!m || m.rows.length < 2) seated.money++;
    if (!buildLocalsNotes(iso2)) seated.locals++;
  }
  for (const [block, n] of Object.entries(seated)) if (n === 0) reds.push(`seat ${block}: no country in the taxonomy takes this seat, so its story has nothing to draw`);
  console.log(`seats: ${seats.length} drawn blocked seats' copy held (one line each under ${SEAT_LINE_WORDS_CAP + 1} words, a foot naming its item); of ${codes.length} countries the thin seats stand on ${seated.setup} (setup), ${seated.peers} (peers), ${seated.money} (money) and ${seated.locals} (locals)`);
}
/* THE CITIES SEAT (MODEL.md 8.2's FLOOR bracket, plan step 49, decided
   2026-09-19: option A, the 90 countries with no covered city ship with `10
   cities` drawn as the blocked seat, its one line naming the three largest
   covered cities of the country's own region). The builder's law, held over
   every country in the taxonomy from the two files it reads:
    SEATED EXACTLY WHERE THE LIST HOLDS NO CITY, both ways: a country the city
      list holds a row for builds no seat (its line would be false: Bangladesh
      holds Dhaka's page and the close door goes there, whatever the cards
      draw), and a country it holds none for builds one.
    THE LINE: the idiom ("Not gathered yet: "), under fifteen words (the cap
      is the component's), no digit, no placeholder left, no banned word, no
      em dash, and NO DOOR: no path, no markup, no "See", no arrow; a seat
      carries none (PART 7).
    THE REGION: the profile's own `world_bank_region` for that country, one of
      the seven plain names, NEVER A CODE: the profile's `continent` ("SA",
      "MENA", "EU", "NA") is a code, and no code token stands in the line.
    THE NAMES: this gate's own reading of the two files (the region's rows by
      `pop_m`, largest first, ties by name), so the builder's pick is checked
      against an independent sort, never against itself; three where the
      region holds three, the form word agreeing.
    THE CUTS the sheet draws (two names, one, none) compose under the same
      law, and the none line is COPY's own.
   Counted over the taxonomy: how many draw cards, how many the seat, how many
   hold a covered city and draw no card (52 the day the seat landed, the card
   builder's draft-list intersection; 0 since the builder walks the covered
   list, QUEUE country:cities-covered-list, and a red from then on), and the
   forms. Planted twice on
   2026-09-19 and watched red before it was trusted: a door let into the line
   (a path after the names) and the continent code carried as the region. */
{
  const wordsOf = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
  const profiles = LIVE_CITIES_SEAT_TABLES.profiles;
  const cityRows = LIVE_CITIES_SEAT_TABLES.cities;
  const CODES = new Set(["NA", "SA", "EU", "MENA"]);
  const door = (t: string) => /\/|<|>|https?:|\bSee\b|→|href/i.test(t);
  const lineLaw = (where: string, line: string) => {
    const words = wordsOf(line);
    if (!line.startsWith("Not gathered yet: ")) reds.push(`${where}: the line is not in the idiom "Not gathered yet: ...": "${line}"`);
    if (words > SEAT_LINE_WORDS_CAP) reds.push(`${where}: the line runs ${words} words, over the cap of ${SEAT_LINE_WORDS_CAP}: "${line}"`);
    if (/\d/.test(line)) reds.push(`${where}: a digit in a line whose law is no figure: "${line}"`);
    if (/[{}]/.test(line)) reds.push(`${where}: a placeholder was never filled: "${line}"`);
    if (door(line)) reds.push(`${where}: a door let into the seat: "${line}"`);
    if (line.split(/\s+/).some((w) => CODES.has(w.replace(/[^A-Za-z]/g, "")))) reds.push(`${where}: a code printed as a region: "${line}"`);
    for (const b of COPY.banned) if (line.toLowerCase().includes(b)) reds.push(`${where}: banned word "${b}" in "${line}"`);
    if (/—/.test(line)) reds.push(`${where}: an em dash in "${line}"`);
  };
  const largestOf = (region: string, n: number) => cityRows
    .filter((c) => profiles[String(c.iso2).toUpperCase()]?.world_bank_region === region)
    .slice()
    .sort((a, b) => (typeof b.pop_m === "number" ? b.pop_m : -1) - (typeof a.pop_m === "number" ? a.pop_m : -1) || a.name.localeCompare(b.name))
    .slice(0, n)
    .map((c) => c.name.replace(/\s*\([^)]*\)\s*$/, "").trim());
  let cards = 0, seatedCities = 0, coveredNoCard = 0;
  const forms: Record<string, number> = { three: 0, fewer: 0, none: 0 };
  const perRegion: Record<string, number> = {};
  for (const iso2 of codes) {
    const covered = cityRows.some((c) => String(c.iso2).toUpperCase() === iso2);
    const drawn = buildCityCards(iso2) != null;
    const seat = buildCitiesSeat(iso2);
    if (drawn) cards++;
    if (covered && !drawn) coveredNoCard++;
    if (covered && seat) reds.push(`cities seat ${iso2}: the list holds a covered city here and the seat still stands (its line would be false)`);
    if (!covered && !seat) reds.push(`cities seat ${iso2}: no covered city and no seat, so the page falls to 20 blocks`);
    /* Since the builder walks the covered list (QUEUE country:cities-covered-list, 2026-09-19) a covered city with no card is the third state the page can fall to, 20 blocks and no seat; it was 52 countries the day the seat landed. */
    if (covered && !drawn) reds.push(`cities ${iso2}: the list holds a covered city here and the card builder draws nothing, so the page falls to 20 blocks with no seat`);
    if (!seat) continue;
    seatedCities++;
    forms[seat.form] = (forms[seat.form] ?? 0) + 1;
    perRegion[seat.region] = (perRegion[seat.region] ?? 0) + 1;
    const where = `cities seat ${iso2}`;
    lineLaw(where, seat.line);
    const profileRegion = profiles[iso2]?.world_bank_region;
    if (seat.region !== profileRegion) reds.push(`${where}: the region "${seat.region}" is not the profile's ("${profileRegion}")`);
    if (!PROFILE_REGIONS.includes(seat.region)) reds.push(`${where}: the region "${seat.region}" is not one of the profile's seven plain names`);
    if (CODES.has(seat.region)) reds.push(`${where}: a code carried as the region: "${seat.region}"`);
    const expect = largestOf(seat.region, CITIES_SEAT_NAMES_CAP);
    if (JSON.stringify(seat.names) !== JSON.stringify(expect)) reds.push(`${where}: the names ${JSON.stringify(seat.names)} are not the region's largest ${JSON.stringify(expect)}`);
    const expectForm = expect.length === 0 ? "none" : expect.length < CITIES_SEAT_NAMES_CAP ? "fewer" : "three";
    if (seat.form !== expectForm) reds.push(`${where}: the form "${seat.form}" against ${expect.length} name(s)`);
    if (seat.names.some((n) => n.includes(","))) reds.push(`${where}: a name carrying a comma would break the reading: ${JSON.stringify(seat.names)}`);
    if (seat.form === "none" && seat.line !== COPY.blocked.cities.lineNone) reds.push(`${where}: the none form is not COPY's none line`);
    if (seat.form !== "none" && !seat.line.endsWith(`${sayNames(seat.names)}.`)) reds.push(`${where}: the line does not end on the names as a person says them: "${seat.line}"`);
  }
  if (seatedCities === 0) reds.push("cities seat: no country in the taxonomy takes this seat, so its story has nothing to draw");
  /* The cuts: real rows, fewer of them; the same law on each. */
  const live = buildCitiesSeat("AF");
  if (!live) reds.push("cities seat: Afghanistan, the thin-country exemplar, builds no seat");
  else {
    for (const [n, want] of [[2, "fewer"], [1, "fewer"], [0, "none"]] as Array<[number, string]>) {
      const cut = buildCitiesSeat("AF", cutCitiesSeatTables(live.region, n));
      if (!cut) { reds.push(`cities seat cut ${n}: builds nothing`); continue; }
      lineLaw(`cities seat cut ${n}`, cut.line);
      if (cut.form !== want || cut.names.length !== n) reds.push(`cities seat cut ${n}: form "${cut.form}" with ${cut.names.length} name(s)`);
    }
    if (buildCitiesSeat("BD") != null) reds.push("cities seat: Bangladesh holds Dhaka and builds a seat");
    if (buildCitiesSeat("GB") != null) reds.push("cities seat: the United Kingdom builds a seat");
  }
  lineLaw("COPY.blocked.cities.lineNone", COPY.blocked.cities.lineNone);
  console.log(`cities seat: of ${codes.length} countries ${cards} draw cards, ${seatedCities} the seat (${forms.three} naming three, ${forms.fewer} fewer, ${forms.none} the none line; by region ${Object.entries(perRegion).map(([r, n]) => `${r} ${n}`).join(", ")}) and ${coveredNoCard} hold a covered city and draw no card; every line in the idiom under ${SEAT_LINE_WORDS_CAP + 1} words, no figure, no door, no code`);
}
/* THE CITY CARDS (MODEL.md 8.2 row `10 cities`; QUEUE
   country:cities-covered-list, ruled 2026-09-19: the builder walks the
   covered list, largest first, eight at most, the pager paging). The
   builder's law, held over every country in the taxonomy from this gate's
   OWN reading of the two files (data/cities/city_list_v1.json, the page
   index; src/lib/cities/top100.json, the draft, for the region sub-line
   alone), never from the builder's helpers:
    DRAWN EXACTLY WHERE THE LIST HOLDS A CITY, both ways (the seat block
      above reds the other two states).
    THE ROWS: the list's rows for the country, largest metro first by
      `pop_m` (ties by name), cut to the cap; the count is the smaller of the
      cap and the rows held; the order is checked against an independent sort.
    THE PAGE: every card's href is `/cities/<slug>` for a slug the route
      serves, which is exactly a slug the list holds (the route's own
      `notFound()` rule, mirrored in city_pages.ts and again here from the
      JSON); the doors gate walks the same hrefs off the render.
    THE FIGURE: the list's own `avg_gross_salary_usd_year` for the slug, the
      city page's opening answer, or withheld where the list holds no positive
      figure; never another number.
    THE PROMISE: `lands` is CITY_CARD_LANDS on every card.
    THE PHOTOGRAPH: every card carries one (the placeholder or its own); the
      harness measures the drawn page, this holds the set.
    THE NAME: the list's, a trailing parenthetical dropped, no digit, no em
      dash, no banned word.
    THE REGION SUB-LINE: the draft's `region_name` where the draft holds a
      row for the city (by country and normalised name) and it does not repeat
      the city's name; absent otherwise; both counts printed.
    THE SHARES: `payShare` and `payOfTop` set exactly when two or more cards
      hold distinct positive figures, in [0, 1], the top at 1.
   PLANTED ONCE, 2026-09-19, and watched red: a city without a page let into
   the cards (a row with slug "nowhere" pushed on the United Kingdom; red
   "points at /cities/nowhere, which the city route does not serve"),
   unplanted before the commit. */
{
  type Row = { slug: string; name: string; iso2: string; pop_m?: number; avg_gross_salary_usd_year?: number };
  const listRows = (cityListJson as { cities: Row[] }).cities;
  const served = new Set(listRows.map((r) => String(r.slug).toLowerCase()));
  const draft = (top100Json as { cities: Array<{ name: string; country: string; region_name?: string }> }).cities;
  const bare = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
  const cleanName = (s: string) => String(s).replace(/\s*\([^)]*\)\s*$/, "");
  let drawnCountries = 0, cardsAll = 0, withRegion = 0, withoutRegion = 0, withheldFigure = 0, paged = 0, atCap = 0;
  const byCount: Record<number, number> = {};
  for (const iso2 of codes) {
    const rows = listRows.filter((r) => String(r.iso2).toUpperCase() === iso2);
    const c = buildCityCards(iso2);
    if (rows.length === 0) { if (c) reds.push(`city cards ${iso2}: cards drawn for a country the list holds no city for`); continue; }
    if (!c) continue; // the seat block above reds this state
    drawnCountries++;
    const expect = rows
      .slice()
      .sort((a, b) => (typeof b.pop_m === "number" ? b.pop_m : -1) - (typeof a.pop_m === "number" ? a.pop_m : -1) || a.name.localeCompare(b.name))
      .slice(0, CITY_CARDS_CAP);
    const where = `city cards ${iso2}`;
    byCount[c.cards.length] = (byCount[c.cards.length] ?? 0) + 1;
    cardsAll += c.cards.length;
    if (c.cards.length > 4) paged++;
    if (rows.length > CITY_CARDS_CAP) atCap++;
    if (c.cards.length !== Math.min(CITY_CARDS_CAP, rows.length)) reds.push(`${where}: ${c.cards.length} cards against ${rows.length} covered cities and a cap of ${CITY_CARDS_CAP}`);
    if (c.cards.length > CITY_CARDS_CAP) reds.push(`${where}: over the cap of ${CITY_CARDS_CAP}`);
    if (JSON.stringify(c.cards.map((k) => k.id)) !== JSON.stringify(expect.map((r) => r.slug))) reds.push(`${where}: the cards ${JSON.stringify(c.cards.map((k) => k.id))} are not the list's largest first ${JSON.stringify(expect.map((r) => r.slug))}`);
    if (c.allHref !== `/cities#c-${iso2.toLowerCase()}`) reds.push(`${where}: the all link points at ${c.allHref}`);
    const pays = c.cards.map((k) => k.payUsd).filter((v): v is number => typeof v === "number" && v > 0);
    const scaled = pays.length >= 2 && Math.max(...pays) > Math.min(...pays);
    for (const k of c.cards) {
      const row = listRows.find((r) => r.slug === k.id);
      const slugOfHref = k.href.startsWith("/cities/") ? k.href.slice("/cities/".length).toLowerCase() : "";
      if (!slugOfHref || !served.has(slugOfHref)) reds.push(`${where}: the card "${k.name}" points at ${k.href}, which the city route does not serve (no such slug in data/cities/city_list_v1.json)`);
      if (!row) { reds.push(`${where}: the card "${k.name}" (id ${k.id}) is no row of the list`); continue; }
      if (k.href !== `/cities/${row.slug}`) reds.push(`${where}: the card "${k.name}" points at ${k.href}, not the list's /cities/${row.slug}`);
      if (k.name !== cleanName(row.name)) reds.push(`${where}: the card's name "${k.name}" is not the list's "${row.name}"`);
      if (/\d/.test(k.name)) reds.push(`${where}: a digit in the name "${k.name}"`);
      if (/—/.test(`${k.name} ${k.region ?? ""}`)) reds.push(`${where}: an em dash on the card "${k.name}"`);
      for (const b of COPY.banned) if (`${k.name} ${k.region ?? ""}`.toLowerCase().includes(b)) reds.push(`${where}: banned word "${b}" on the card "${k.name}"`);
      if (k.lands !== CITY_CARD_LANDS) reds.push(`${where}: the card "${k.name}" promises ${k.lands}, not ${CITY_CARD_LANDS}`);
      if (!k.photo || !k.photo.src) reds.push(`${where}: the card "${k.name}" carries no photograph (the field look needs one on every card)`);
      else if (k.photo.placeholder && k.photo.src !== CITY_CARD_PLACEHOLDER_IMAGE) reds.push(`${where}: the card "${k.name}" marks a placeholder that is not the one placeholder (${k.photo.src})`);
      const held = typeof row.avg_gross_salary_usd_year === "number" && Number.isFinite(row.avg_gross_salary_usd_year) && row.avg_gross_salary_usd_year > 0;
      if (held && k.payUsd !== row.avg_gross_salary_usd_year) reds.push(`${where}: the card "${k.name}" prints ${k.payUsd}, not the list's avg_gross_salary_usd_year ${row.avg_gross_salary_usd_year}`);
      if (!held) { withheldFigure++; if (k.payUsd != null) reds.push(`${where}: the card "${k.name}" prints ${k.payUsd} where the list holds no figure`); }
      /* the region sub-line, from the gate's own join of the draft */
      const d = draft.find((x) => x.country.toUpperCase() === iso2 && normalizePlaceName(x.name) === normalizePlaceName(row.name));
      const dr = d?.region_name?.trim();
      const keep = dr && !(bare(k.name).includes(bare(dr)) || bare(dr).includes(bare(k.name))) ? dr : undefined;
      if ((k.region ?? undefined) !== keep) reds.push(`${where}: the card "${k.name}" carries the region ${JSON.stringify(k.region)} against the draft's ${JSON.stringify(keep)}`);
      if (k.region) withRegion++; else withoutRegion++;
      /* the shares */
      const hasShare = typeof k.payShare === "number" || typeof k.payOfTop === "number";
      if (hasShare && !scaled) reds.push(`${where}: the card "${k.name}" carries a share with no set to scale within`);
      if (scaled && typeof k.payUsd === "number" && k.payUsd > 0 && !hasShare) reds.push(`${where}: the card "${k.name}" carries no share where the set scales`);
      if (typeof k.payShare === "number" && (k.payShare < 0 || k.payShare > 1)) reds.push(`${where}: payShare ${k.payShare} off [0, 1] on "${k.name}"`);
      if (typeof k.payOfTop === "number" && (k.payOfTop <= 0 || k.payOfTop > 1)) reds.push(`${where}: payOfTop ${k.payOfTop} off (0, 1] on "${k.name}"`);
    }
    if (scaled && !c.cards.some((k) => k.payOfTop === 1)) reds.push(`${where}: no card sits at the top of its own set`);
  }
  const gb = buildCityCards("GB");
  if (!gb || gb.cards.length !== Math.min(CITY_CARDS_CAP, listRows.filter((r) => r.iso2 === "GB").length)) reds.push(`city cards: the United Kingdom draws ${gb?.cards.length ?? 0} cards against its ${listRows.filter((r) => r.iso2 === "GB").length} covered cities`);
  if (drawnCountries === 0) reds.push("city cards: no country draws cards");
  console.log(`city cards: ${drawnCountries} of ${codes.length} countries draw cards (${Object.entries(byCount).map(([n, k]) => `${k} with ${n}`).join(", ")}; ${paged} on the pager's second page, ${atCap} cut at the cap of ${CITY_CARDS_CAP}), ${cardsAll} cards in all, ${withRegion} with a region sub-line off the draft and ${withoutRegion} without, ${withheldFigure} with the figure withheld; every href a slug the city route serves, every figure the list's own, every card promising ${CITY_CARD_LANDS} with a photograph; the United Kingdom ${gb?.cards.map((k) => k.name).join(", ")}`);
}
/* THE TRADE'S EXIT (MODEL.md 8.6 `13 rivals`, `14 worth`, `15 close`; plan
   step 33's sixth dispatch, 2026-09-18). THE RIVALS on fixture seeds in the
   shapes the data takes (the sibling resolver needs the database, so the
   shapes are typed from the 2026-09-18 probe: six siblings with four keyed
   on London and California, six all keyed on Berlin, none on Mumbai cafes
   and Cairo): every drawn row holds a figure that prints as one, the rows
   fall in order, the headline is the LOWER MEDIAN of the drawn rows (never
   above the highest), the withheld count and its line agree both ways and
   the line carries a digit, the label says which few the middle is the
   middle of, every row is a door to a path under the place, no sibling on
   the archetype's default is drawn (read by key, item 48's note: a keyed
   trade authored at 80,000 still prints), and the floor holds from the low
   side: three keyed of six, two siblings and no sibling all take the
   withheld state with a line and NO rows, never a short list. The heads at
   three words, the headline's label at four. THE WORTH on every shard id:
   the strip with two marks where money is shown and the sale figures rest
   on owner earnings, each mark the shard's figure times the take-home to
   the dollar, the low under the high, the labels under three words; the
   operating-earnings line on exactly the shards whose basis word is not
   SDE (38, item 52) and NEVER a mark there whatever the money gate; the
   withheld line off `moneyShown` on the rest; never a bare multiple in any
   string (clause 15). THE DOORS on three fixture seeds through the
   country's own `checkDoors` (the cap, one pill, distinct first words,
   every href a route in the app folder, no "with Pro", no banned word):
   London (three doors, the city page), California (three, the state page),
   and a place with no page of its own (two doors, the industry page and
   the pill; a door to a page that does not exist is never drawn); the pill
   last on every one; no pricing door and no sibling door on any. */
{
  const ban = (where: string, texts: string[]) => {
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`${where}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`${where}: a placeholder was never filled ("${t}")`);
      if (/\u2014/.test(t)) reds.push(`${where}: an em dash in "${t}"`);
    }
  };
  const siblings = (slugs: string[]) => ({ list: slugs.map((slug) => ({ name: slug.replace(/-/g, " "), slug, href: `/gb/london/${slug}` })) });
  const fourOfSix = buildRivals({ meta: { trade: "Restaurants" }, rivals: siblings(["legal-services", "software-development", "office-business-support", "real-estate-agencies", "employment-services", "grocery-stores"]) });
  if (!fourOfSix || fourOfSix.state !== "list" || fourOfSix.rows.length !== 4 || fourOfSix.withheld !== 2 || !fourOfSix.withheldLine || fourOfSix.siblings !== 6 || fourOfSix.keyed !== 4) reds.push("rivals (four keyed of six): four rows, two withheld with a line, six siblings do not build as expected");
  const sixKeyed = buildRivals({ meta: { trade: "Restaurants" }, rivals: siblings(["marketing-design-agencies", "real-estate-agencies", "specialty-trades-mixed", "engineering-architecture", "software-development", "legal-services"]) });
  if (!sixKeyed || sixKeyed.state !== "list" || sixKeyed.rows.length !== 6 || sixKeyed.withheld !== 0 || sixKeyed.withheldLine != null) reds.push("rivals (six keyed): six rows and no withheld line do not build as expected");
  for (const [name, r] of [["four keyed of six", fourOfSix], ["six keyed", sixKeyed]] as const) {
    if (!r || r.state !== "list") continue;
    for (const row of r.rows) {
      if (!Number.isFinite(row.value) || !/\d/.test(r.fmt(row.value))) reds.push(`rivals (${name}): row "${row.name}" prints no figure`);
      if (startupCapitalArchetypeKeyed(row.key) == null) reds.push(`rivals (${name}): row "${row.name}" is on the archetype's default and is drawn`);
      if (!row.href.startsWith("/gb/london/")) reds.push(`rivals (${name}): row "${row.name}" is not a door under the place (${row.href})`);
    }
    for (let i = 1; i < r.rows.length; i++) if (r.rows[i].value > r.rows[i - 1].value) reds.push(`rivals (${name}): "${r.rows[i].name}" ranks below "${r.rows[i - 1].name}" and holds the larger figure`);
    const sorted = r.rows.map((x) => x.value).sort((a, b) => a - b);
    if (r.middle !== sorted[Math.floor((sorted.length - 1) / 2)]) reds.push(`rivals (${name}): the middle (${r.middle}) is not the lower median of the drawn rows`);
    if (r.middle != null && r.middle > r.rows[0].value) reds.push(`rivals (${name}): the middle stands above the highest row`);
    if ((r.withheld > 0) !== (r.withheldLine != null)) reds.push(`rivals (${name}): ${r.withheld} withheld and the line is ${r.withheldLine ? "printed" : "absent"}`);
    if (r.withheldLine && !/\d/.test(r.withheldLine)) reds.push(`rivals (${name}): the withheld line counts nothing ("${r.withheldLine}")`);
    if (r.middleLabel !== COPY.markList.middleOfDrawn.replace("{n}", countWord(r.rows.length))) reds.push(`rivals (${name}): the headline's label does not say which few it is the middle of ("${r.middleLabel}")`);
    if (r.middleLabel.trim().split(/\s+/).length > 4) reds.push(`rivals (${name}): the headline label runs over four words ("${r.middleLabel}")`);
    for (const [where, t] of [["the name head", r.head.name], ["the value head", r.head.value]] as Array<[string, string]>) if (t.trim().split(/\s+/).length > 3) reds.push(`rivals (${name}): ${where} runs over three words ("${t}")`);
    ban(`rivals (${name})`, [r.kicker, r.basis, r.middleLabel, r.head.name, r.head.value, r.withheldLine ?? ""]);
  }
  const under: Array<[string, any, number, number]> = [
    ["three keyed of six", siblings(["legal-services", "software-development", "real-estate-agencies", "office-business-support", "employment-services", "vocational-other-training"]), 6, 3],
    ["two siblings", siblings(["legal-services", "software-development"]), 2, 2],
    ["no sibling", { list: [] }, 0, 0],
  ];
  for (const [name, rivals, siblingsN, keyedN] of under) {
    const r = buildRivals({ meta: { trade: "Restaurants" }, rivals });
    if (!r || r.state !== "withheld" || r.rows.length !== 0 || !r.stateLine || r.withheldLine != null || r.siblings !== siblingsN || r.keyed !== keyedN) { reds.push(`rivals (${name}): the withheld state with its line and no rows does not build (under the floor of ${MARK_LIST_FLOOR})`); continue; }
    if (!r.stateLine.startsWith("Not gathered yet:")) reds.push(`rivals (${name}): the state line is not in the site's idiom ("${r.stateLine}")`);
    if (siblingsN > 0 && !r.stateLine.includes(countWord(keyedN))) reds.push(`rivals (${name}): the state line does not count the siblings with a figure in words ("${r.stateLine}")`);
    ban(`rivals (${name})`, [r.stateLine, r.basis]);
  }
  if (buildRivals({ meta: {} })) reds.push("rivals: a seed with no trade draws a card");
  const ids = readdirSync("data/facts/industry").filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).sort();
  const bases = countWorthBases(ids);
  let strips = 0, otherLines = 0, withheldLines = 0;
  for (const id of ids) {
    const shown = buildWorth({ meta: { industry_id: id, money_shown: true }, owner: { take_home_usd: 36000 } });
    const hidden = buildWorth({ meta: { industry_id: id, money_shown: false }, owner: { take_home_usd: 36000 } });
    if (!shown || !hidden) { reds.push(`worth (${id}): the builder returned nothing for a shard that holds both sale figures`); continue; }
    const other = shown.figures.basisWord.toUpperCase() !== "SDE";
    if (other) {
      otherLines++;
      if (shown.state !== "otherBasis" || hidden.state !== "otherBasis" || shown.marks.length || hidden.marks.length || !shown.withheld) reds.push(`worth (${id}): a shard whose sale figures rest on ${shown.figures.basisWord} draws a mark, or no line, in one of its states`);
    } else {
      if (shown.state !== "strip" || shown.marks.length !== 2) reds.push(`worth (${id}): money shown and owner earnings do not draw the two-mark strip`);
      else {
        strips++;
        const [lo, hi] = shown.marks;
        if (lo.value !== Math.round(shown.figures.multipleLow * 36000) || hi.value !== Math.round(shown.figures.multipleHigh * 36000)) reds.push(`worth (${id}): a mark is not the shard's figure times the take-home to the dollar`);
        if (!(lo.value < hi.value)) reds.push(`worth (${id}): the low end is not under the high end`);
        for (const m of shown.marks) { if (m.label.trim().split(/\s+/).length > 3) reds.push(`worth (${id}): a mark label over three words ("${m.label}")`); if (m.lead || m.accent) reds.push(`worth (${id}): a mark carries a lead or an accent; a low and a high are siblings`); }
        if (!shown.basis || !shown.note) reds.push(`worth (${id}): the strip stands without its basis or its note`);
      }
      if (hidden.state !== "withheld" || hidden.marks.length || !hidden.withheld) reds.push(`worth (${id}): off moneyShown the card does not stand withheld with its line`);
      else withheldLines++;
    }
    for (const w of [shown, hidden]) ban(`worth (${id})`, [w.basis ?? "", w.note ?? "", w.withheld ?? "", ...w.marks.map((m) => m.label)]);
    for (const t of [shown.basis, shown.note, shown.withheld, hidden.withheld]) if (t && /\bmultiple/i.test(t)) reds.push(`worth (${id}): a string says "multiple" (clause 15): "${t}"`);
  }
  if (bases.other !== otherLines) reds.push(`worth: ${otherLines} shards took the operating-earnings line against ${bases.other} whose basis word is not SDE`);
  if (buildWorth({ meta: { industry_id: "no_such_trade", money_shown: true }, owner: { take_home_usd: 36000 } })) reds.push("worth: a trade with no shard draws a card");
  const tradeCloseSeeds: Array<[string, any, number, string]> = [
    ["London", { meta: { trade: "Restaurants", iso2: "GB", geo: "london", industry: "restaurants", industry_id: "restaurants", city: "London" } }, 3, "/cities/london"],
    ["California", { meta: { trade: "Restaurants", iso2: "US", geo: "california", industry: "restaurants", industry_id: "restaurants", city: "California" } }, 3, "/us/california"],
    ["a place with no page", { meta: { trade: "Cafés & coffee shops", iso2: "GB", geo: "gb-e06000043", industry: "cafes-coffee-shops", industry_id: "cafes_coffee", city: "Portsmouth" } }, 2, ""],
  ];
  let tradeTermini = 0;
  for (const [name, seed, expected, placeHref] of tradeCloseSeeds) {
    const doors = buildTradeCloseDoors(seed);
    if (doors.length !== expected) { reds.push(`trade close (${name}): ${doors.length} doors, expected ${expected}`); continue; }
    tradeTermini++;
    checkDoors(name, doors, "trade close");
    if (doors[doors.length - 1].kind !== "pill" || doors[doors.length - 1].href !== "/compare") reds.push(`trade close (${name}): the compare pill is not last, or does not go to /compare`);
    if (doors[0].key !== "industry" || !doors[0].href.startsWith("/industries/")) reds.push(`trade close (${name}): the first door is not the industry page's`);
    if (placeHref && doors[1].href !== placeHref) reds.push(`trade close (${name}): the place door goes to ${doors[1].href}, not ${placeHref}`);
    if (doors.some((d) => d.href === "/pricing" || /instead$/.test(d.label))) reds.push(`trade close (${name}): a pricing door or a sibling door is drawn`);
  }
  if (buildTradeCloseDoors({ meta: {} }).length) reds.push("trade close: a seed with no trade draws a door");
  console.log(`exit (13, 14, 15): the rivals' laws held on five fixture shapes (two lists, three withheld); the worth on ${ids.length} shards, ${strips} strips with money shown, ${otherLines} operating-earnings lines (${bases.other} by basis word, ${bases.held} pairs held), ${withheldLines} withheld off moneyShown; ${tradeTermini} trade termini against the routes`);
}
/* THE INDUSTRY PAGE'S OPENING (MODEL.md 8.7 `00 take`, `01 lasts`, `02
   benchmark`; plan step 34's first dispatch, 2026-09-18), on every one of the
   243 ids the shards are filed under, without the database: every industry
   builder is pure over the taxonomy, the shard and the archetype table. THE
   TAKE: the answer is the one net builder's figure (R7) in its one printed
   form, the basis names the branch that printed it (the trade's own on the
   ladder, the sector's typical on the profile), the state word stands only
   where neither holds a figure (none today, counted); at most three
   companions in 8.7's order, a label of four words or fewer and a note under
   48 characters, the cost drawn only for a KEYED trade (never the table's
   80,000 default, clause 46), spend and visits never zero; the foot carries
   the not-gathered idiom (M19) for exactly the companions withheld and the
   coverage sentence for the ones printed; the crumb is the sector, once;
   the tile resolves. THE SURVIVAL at the world altitude: the same cells,
   order, foot and figures the trade page's builder prints (one builder),
   under the basis with no city clause. THE BENCHMARK: every row's figure a
   member's own ladder net through the one builder, never a profile member's
   (a sector's residual on several rows ranks nothing), at most five rows
   (the trade and the highest four; benchmark_rows.ts says why not ten)
   highest first, the trade's own row present exactly when it holds a
   figure, the members holding a figure plus the withheld count summing to
   the sector, the state by the four-member floor on the members HOLDING a
   figure, the line by the state and within fourteen words, the basis within
   fourteen words naming the sector's count; the four sectors 8.7 names under
   four members are under the floor here too. Every string through the
   register ban and the placeholder check. Planted and watched go red
   2026-09-18: a profile member let into the rows (the ROW NET check), a
   cost drawn on a default trade (the COST KEYED check). */
{
  const ban = (where: string, texts: string[]) => {
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`${where}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`${where}: a placeholder was never filled ("${t}")`);
    }
  };
  const wordsOf = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
  const ids = ALL_INDUSTRIES.map((i) => i.id);
  const hero = countIndustryHeroStates(ids);
  if (hero.absent > 0) reds.push(`industry take: ${hero.absent} of ${hero.total} trades show the state word (the one net builder resolves every trade today)`);
  let takes = 0, costDrawn = 0, notGathered = 0;
  for (const id of ids) {
    const f = industryHeroFacts(id);
    if (!f) { reds.push(`industry take ${id}: no facts for a taxonomy id`); continue; }
    takes++;
    const n = resolveTradeNet(id, { moneyShown: false, netMarginPct: null });
    if (!n) { reds.push(`industry take ${id}: the one net builder resolves nothing`); continue; }
    if (!f.answer || f.answer.value !== n.text || f.answer.value !== netText(n.pct) || f.answer.confidence !== "modeled") reds.push(`industry take ${id}: the answer is not the one builder's figure in its printed form (${f.answer?.value ?? "absent"} against ${n.text})`);
    if (f.answer && f.answer.basis !== (n.branch === "profile" ? COPY.industryHero.answerBasisProfile : COPY.industryHero.answerBasisShard)) reds.push(`industry take ${id}: the basis does not name the branch that printed the net (${n.branch})`);
    if (f.crumb.length !== 1 || !f.crumb[0]) reds.push(`industry take ${id}: the crumb is not the sector alone (${f.crumb.join(" / ")})`);
    if (!f.tile) reds.push(`industry take ${id}: no tile`);
    if (f.cells.length > 3) reds.push(`industry take ${id}: ${f.cells.length} companions, over three`);
    const order = f.cells.map((c) => c.key).join(",");
    if (order !== INDUSTRY_HERO_CELLS.filter((k) => !f.withheld.includes(k)).join(",")) reds.push(`industry take ${id}: the companions are not in 8.7's order (${order})`);
    for (const c of f.cells) {
      if (c.label.split(/\s+/).length > 4) reds.push(`industry take ${id}: label over four words: "${c.label}"`);
      if (c.note && c.note.length > 48) reds.push(`industry take ${id}: note over 48 characters: "${c.note}"`);
      if (c.value == null || c.value === "") reds.push(`industry take ${id}: an empty cell ${c.key}`);
      if (c.confidence !== "modeled") reds.push(`industry take ${id}: the cell ${c.key} is not marked modelled (R12)`);
    }
    const keyed = startupCapitalArchetypeKeyed(industryToSlug(id));
    const costCell = f.cells.find((c) => c.key === "cost");
    if (keyed == null && costCell) reds.push(`industry take ${id}: COST KEYED: the cost cell draws on a trade the archetype table does not key (the 80,000 default, clause 46)`);
    if (keyed != null && (!costCell || costCell.value !== usd(keyed))) reds.push(`industry take ${id}: COST KEYED: the cost cell does not print the keyed figure`);
    if (costCell) costDrawn++;
    for (const key of ["spend", "visits"] as const) {
      const fig = industryFigure(id, INDUSTRY_HERO_METRICS[key]);
      const cell = f.cells.find((c) => c.key === key);
      if (fig && fig.value > 0 && !cell) reds.push(`industry take ${id}: the ${key} cell is withheld though the shard holds ${fig.value}`);
      if ((!fig || fig.value <= 0) && cell) reds.push(`industry take ${id}: the ${key} cell prints off a zero or missing figure`);
    }
    const foot = f.foot?.text ?? "";
    if (f.withheld.length > 0) {
      notGathered++;
      if (!foot.startsWith("Not gathered yet: ")) reds.push(`industry take ${id}: ${f.withheld.length} companion(s) withheld and the foot does not open "Not gathered yet:" ("${foot}")`);
      for (const k of f.withheld) if (!foot.includes(COPY.industryHero.parts[k])) reds.push(`industry take ${id}: the foot does not name the withheld ${k}`);
    } else if (foot.startsWith("Not gathered yet")) reds.push(`industry take ${id}: nothing withheld and the foot apologises`);
    if (f.cells.length > 0 && !/typical for the trade anywhere, modelled\.$/.test(foot)) reds.push(`industry take ${id}: the foot does not end on the coverage sentence ("${foot}")`);
    if (f.foot && !f.foot.modeled) reds.push(`industry take ${id}: the foot is not marked modelled`);
    ban(`industry take ${id}`, [f.absent.label, f.absent.word, f.absent.note, f.answer?.label ?? "", f.answer?.basis ?? "", foot, ...f.cells.flatMap((c) => [c.label, c.note ?? ""])]);
  }
  if (hero.costWithheld !== ids.length - costDrawn) reds.push(`industry take: the cost is withheld on ${hero.costWithheld} by the count and drawn on ${costDrawn} of ${ids.length}`);
  if (industryHeroFacts("no_such_trade") !== null || industryHeroFacts(undefined) !== null) reds.push("industry take: a trade not in the taxonomy builds a card");

  let worldLasts = 0;
  for (const id of ids) {
    const w = buildLasts(id, "world"), p = buildLasts(id);
    if (!w || !p) { reds.push(`industry lasts ${id}: no card off a shard that holds the triple`); continue; }
    worldLasts++;
    if (w.basis !== COPY.industryLasts.basis || /city/i.test(w.basis)) reds.push(`industry lasts ${id}: the world basis names a city or is not the copy table's ("${w.basis}")`);
    if (w.foot !== p.foot || JSON.stringify(w.cells) !== JSON.stringify(p.cells) || JSON.stringify(w.values) !== JSON.stringify(p.values)) reds.push(`industry lasts ${id}: the world card and the trade card disagree off one builder`);
    if (w.altitude !== "world" || p.altitude !== "place") reds.push(`industry lasts ${id}: the altitude is not carried`);
    ban(`industry lasts ${id}`, [w.basis, w.foot, ...w.cells.map((c) => c.label)]);
  }

  const bench = countBenchmarkStates(ids);
  let benchCards = 0, tenRows = 0;
  const sectors = new Map<string, number>();
  for (const i of ALL_INDUSTRIES) sectors.set(i.sector_id, (sectors.get(i.sector_id) ?? 0) + 1);
  for (const id of ids) {
    const b = buildBenchmark(id);
    if (!b) { reds.push(`industry benchmark ${id}: no card for a taxonomy id`); continue; }
    benchCards++;
    const ind = INDUSTRY_BY_ID[id];
    if (b.members !== sectors.get(ind.sector_id)) reds.push(`industry benchmark ${id}: ${b.members} members against the taxonomy's ${sectors.get(ind.sector_id)} in ${ind.sector_id}`);
    if (b.holding + b.withheldCount !== b.members) reds.push(`industry benchmark ${id}: ${b.holding} holding and ${b.withheldCount} withheld do not sum to ${b.members}`);
    const expected = b.holding >= BENCHMARK_FLOOR ? "ranked" : b.holding >= 2 ? "short" : "withheld";
    if (b.state !== expected) reds.push(`industry benchmark ${id}: the state is ${b.state} with ${b.holding} holding a figure; expected ${expected}`);
    if (b.rows.length > BENCHMARK_ROWS_CAP) reds.push(`industry benchmark ${id}: ${b.rows.length} rows, over ${BENCHMARK_ROWS_CAP}`);
    if (b.state === "withheld" && b.rows.length) reds.push(`industry benchmark ${id}: rows drawn in the withheld state`);
    if (b.state !== "withheld" && b.rows.length !== Math.min(BENCHMARK_ROWS_CAP, b.holding)) reds.push(`industry benchmark ${id}: ${b.rows.length} rows where ${Math.min(BENCHMARK_ROWS_CAP, b.holding)} hold a figure`);
    if (b.rows.length === BENCHMARK_ROWS_CAP) tenRows++;
    for (let r = 1; r < b.rows.length; r++) if (b.rows[r].value > b.rows[r - 1].value) reds.push(`industry benchmark ${id}: the rows are not highest first (${b.rows[r - 1].name} before ${b.rows[r].name})`);
    for (const row of b.rows) {
      const n = resolveTradeNet(row.key, { moneyShown: false, netMarginPct: null });
      if (!n || n.branch !== "shard" || n.pct !== row.value) reds.push(`industry benchmark ${id}: ROW NET: the row ${row.key} is not that member's own ladder net through the one builder (${n?.branch ?? "none"})`);
      if (INDUSTRY_BY_ID[row.key]?.sector_id !== ind.sector_id) reds.push(`industry benchmark ${id}: the row ${row.key} is not in the sector`);
      if (row.name.split(/\s+/).length > 4) { /* the taxonomy's own name, judged by ROW SENTENCE in the model-laws gate, never shortened here */ }
    }
    const own = resolveTradeNet(id, { moneyShown: false, netMarginPct: null });
    const ownRanked = b.rows.some((r) => r.key === id);
    if (own?.branch === "shard" && b.state !== "withheld" && !ownRanked) reds.push(`industry benchmark ${id}: the trade holds a figure and is not among the rows`);
    if (own?.branch !== "shard" && ownRanked) reds.push(`industry benchmark ${id}: the trade's own row is drawn on a profile figure`);
    if ((b.selfKey === id) !== (own?.branch === "shard" && b.state !== "withheld")) reds.push(`industry benchmark ${id}: selfKey does not match the trade's branch and the state`);
    if (b.rows.length && b.top !== Math.max(...b.rows.map((r) => r.value))) reds.push(`industry benchmark ${id}: the ceiling is not the set's highest row`);
    if (wordsOf(b.basis) > 14) reds.push(`industry benchmark ${id}: the basis runs ${wordsOf(b.basis)} words, over fourteen: "${b.basis}"`);
    if (!b.basis.includes(String(b.members))) reds.push(`industry benchmark ${id}: the basis does not name the sector's count ${b.members}`);
    if (b.line && wordsOf(b.line) > 14) reds.push(`industry benchmark ${id}: the line runs ${wordsOf(b.line)} words, over fourteen: "${b.line}"`);
    if (b.state === "withheld" && (!b.line || (b.holding === 0 && !b.line.startsWith("Not gathered yet: ")))) reds.push(`industry benchmark ${id}: the withheld state has no line, or no not-gathered line with nothing held`);
    if (b.state === "short" && (!b.line || !/a ranking needs four\.$/.test(b.line))) reds.push(`industry benchmark ${id}: the short state's line does not name the floor ("${b.line}")`);
    if (b.state === "ranked" && (b.withheldCount > 0) !== !!b.line) reds.push(`industry benchmark ${id}: ${b.withheldCount} withheld and ${b.line ? "a" : "no"} line`);
    if (b.state === "ranked" && b.line && own?.branch !== "shard" && !/this (trade|one)/i.test(b.line)) reds.push(`industry benchmark ${id}: the trade itself is withheld and the line does not say so ("${b.line}")`);
    ban(`industry benchmark ${id}`, [b.basis, b.line ?? "", ...b.rows.map((r) => r.name)]);
  }
  for (const [sector, n] of sectors) if (n < BENCHMARK_FLOOR) { for (const i of ALL_INDUSTRIES.filter((x) => x.sector_id === sector)) { const b = buildBenchmark(i.id); if (b && b.state === "ranked") reds.push(`industry benchmark ${i.id}: ranked in a sector of ${n}, under the floor`); } }
  if (buildBenchmark("no_such_trade") !== null || buildBenchmark(undefined) !== null) reds.push("industry benchmark: a trade not in the taxonomy builds a card");
  ban("industry copy", [COPY.industryBenchmark.kicker, COPY.industryBenchmark.topLabel, COPY.industryHero.answerLabel, ...Object.values(COPY.industryChapters)]);
  if (wordsOf(COPY.industryBenchmark.kicker) > 4 || wordsOf(COPY.industryHero.answerLabel) > 4) reds.push("industry copy: a kicker or the answer label runs over four words");
  console.log(`industry opening: the take draws on ${takes} of ${ids.length} trades (${hero.ladder} on the ladder, ${hero.profile} on the sector profile, ${hero.absent} with the state word), the cost keyed on ${costDrawn} and withheld on ${hero.costWithheld}, spend withheld on ${hero.spendWithheld} and visits on ${hero.visitsWithheld}, the not-gathered foot on ${notGathered}; the survival grid at the world altitude on ${worldLasts}; the benchmark on ${benchCards}: ${bench.ranked} ranked (${tenRows} at the cap of ${BENCHMARK_ROWS_CAP} rows), ${bench.short} short, ${bench.withheld} withheld, the trade itself on the profile on ${bench.selfWithheld}, a member withheld on ${bench.anyWithheld}`);
}
/* THE INDUSTRY PAGE'S TURN ONE (MODEL.md 8.7 `03 split`, `04 open`, `05
   pays`; plan step 34's second dispatch, 2026-09-18), on every one of the 243
   ids, without the database. THE SPLIT: ONE NET (R7): the split's net is the
   one net builder's figure with the engine absent, in its one printed form,
   and it is the string the hero prints at 40 on the same page; and the CARD'S
   arithmetic is pinned to it (IncomeBreakdown prints `Math.round(netPct)`,
   the builder's own rounding, and reconciles the cost shares to the rest),
   so the digits a reader meets on `00` and `03` are one figure; the states
   counted (230 drawn, 13 withheld with the line, the trade page's own count
   off `moneyShown`); the basis names the trade or the sector and never a
   city. THE OPEN CARD: three cells in 8.7's order on every shard that holds
   them, the licence count the permits builder's own count (the zero-day
   licence counted, its wait withheld), the slowest wait the permits' longest
   in the permits' unit, the months open_rows.ts's own formatter; every cell
   a figure with a digit and NEVER A WORD (the cost band, clause 46's cousin,
   PART 5); labels of four words or fewer; the plus holding every printed
   licence by name with its days (two to five rows, the permits' own) and its
   withheld line exactly when a licence has no wait; the basis and the foot
   within fourteen words. THE BENTO: four cells in declared order (the
   payback, the crew, the fixed part of the costs, the share; four and not
   8.7's three, pays_rows.ts says why), the crew the sum of the shard's role
   headcounts rounded to whole people (the part the whole, `rounded` exactly
   when the sum is a fraction), the fixed part the shard's share of 100, the
   payback and the share through the trade page's formatters (one formatter
   per field, `yearsFigure`, `shareFigure`), every basis within fourteen
   words and ending on the word modelled. Every string through the register ban
   and the placeholder check. Planted and watched go red 2026-09-18: a cell
   value replaced by the cost band word (the NO WORD check), the split's net
   fed from the margins file's clamp instead of the one builder (the ONE NET
   check). */
{
  const ban = (where: string, texts: string[]) => {
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`${where}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`${where}: a placeholder was never filled ("${t}")`);
    }
  };
  const wordsOf = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
  const ids = ALL_INDUSTRIES.map((i) => i.id);
  let splits = 0, splitWithheld = 0, splitDrawn = 0;
  for (const id of ids) {
    const sp = buildIndustrySplit(id);
    const f = industryHeroFacts(id);
    const n = resolveTradeNet(id, { moneyShown: false, netMarginPct: null });
    if (!sp || !f || !n) { reds.push(`industry split ${id}: no card, no hero or no net for a taxonomy id`); continue; }
    splits++;
    if (sp.state === "withheld") splitWithheld++; else splitDrawn++;
    /* ONE NET, three ways: the builder's figure, its printed form, and the card's own rounding of it. */
    if (sp.netPct !== n.pct || sp.netText !== n.text) reds.push(`industry split ${id}: ONE NET: the split's net (${sp.netText}) is not the one builder's (${n.text})`);
    if (!f.answer || f.answer.value !== sp.netText) reds.push(`industry split ${id}: ONE NET: the split's net (${sp.netText}) is not the hero's (${f.answer?.value ?? "absent"})`);
    if (`${Math.round(sp.netPct)}%` !== sp.netText) reds.push(`industry split ${id}: ONE NET: the card's rounding (${Math.round(sp.netPct)}) is not the printed form (${sp.netText})`);
    if (/city|London/i.test(sp.basis)) reds.push(`industry split ${id}: the basis names a city ("${sp.basis}")`);
    if (sp.state === "withheld" && (sp.segments.length || !sp.withheld)) reds.push(`industry split ${id}: withheld with segments or without its line`);
    if (sp.state === "drawn" && (sp.segments.length < 2 || sp.withheld)) reds.push(`industry split ${id}: drawn with under two segments or with a withheld line`);
    ban(`industry split ${id}`, [sp.basis, sp.withheld ?? "", sp.foot, ...sp.segments.map((x) => x.label)]);
  }

  const openCount = countIndustryOpen(ids);
  let opens = 0, plusRows = 0;
  for (const id of ids) {
    const o = buildIndustryOpen(id);
    const p = buildPermits(id);
    if (!o) { reds.push(`industry open ${id}: no card for a shard`); continue; }
    opens++;
    const order = o.cells.map((c) => c.key).join(",");
    if (order !== INDUSTRY_OPEN_CELLS.filter((k) => !o.withheld.includes(k)).join(",")) reds.push(`industry open ${id}: the cells are not in 8.7's order (${order})`);
    if (o.cells.length + o.withheld.length !== 3 || o.withheld.length !== o.withheldLines.length) reds.push(`industry open ${id}: ${o.cells.length} cells and ${o.withheld.length} withheld do not make three, or the lines do not match`);
    for (const c of o.cells) {
      if (wordsOf(c.label) > 4) reds.push(`industry open ${id}: label over four words: "${c.label}"`);
      const v = typeof c.value === "string" ? c.value : "";
      if (!/\d/.test(v)) reds.push(`industry open ${id}: NO WORD: the cell ${c.key} prints "${v}" where a figure goes (the cost band word is never printed)`);
      if (/\b(low|medium|high)\b/i.test(v)) reds.push(`industry open ${id}: NO WORD: the cost band word in the cell ${c.key} ("${v}")`);
      if (c.confidence !== "modeled") reds.push(`industry open ${id}: the cell ${c.key} is not marked modelled (R12)`);
    }
    const lic = o.cells.find((c) => c.key === "licences"), slow = o.cells.find((c) => c.key === "slowest"), ramp = o.cells.find((c) => c.key === "breakEven");
    if (p && lic && lic.value !== String(p.count)) reds.push(`industry open ${id}: the licence count (${lic.value}) is not the permits builder's (${p.count})`);
    if (p?.longest && slow && slow.value !== daysFigure(p.longest.days)) reds.push(`industry open ${id}: the slowest wait (${slow.value}) is not the permits' longest (${p.longest.days})`);
    const rampFig = industryFigure(id, "first_year.ramp_to_breakeven_months");
    if (rampFig && rampFig.value > 0 && (!ramp || ramp.value !== monthsFigure(rampFig.value))) reds.push(`industry open ${id}: the months cell is not the shard's ramp through open_rows' formatter`);
    if (!rampFig && ramp) reds.push(`industry open ${id}: a months cell with no ramp on file`);
    if (p && p.cells.length >= 2) {
      if (!o.detail) reds.push(`industry open ${id}: no plus over ${p.cells.length} licences`);
      else {
        plusRows += o.detail.rows.length;
        if (o.detail.rows.length !== p.cells.length) reds.push(`industry open ${id}: the plus holds ${o.detail.rows.length} rows against ${p.cells.length} licences`);
        for (const r of o.detail.rows) if (!/\d/.test(r.value) || !r.label) reds.push(`industry open ${id}: a plus row without a figure or a name ("${r.label}" ${r.value})`);
        if ((p.withheld != null) !== (o.detail.withheldLine != null)) reds.push(`industry open ${id}: the plus's withheld line (${o.detail.withheldLine ? "present" : "absent"}) disagrees with the permits' (${p.withheld ? "present" : "absent"})`);
        if (wordsOf(o.detail.summary) > 6) reds.push(`industry open ${id}: the plus's summary runs ${wordsOf(o.detail.summary)} words`);
      }
    }
    if (wordsOf(o.basis) > 14 || wordsOf(o.foot) > 14) reds.push(`industry open ${id}: the basis or the foot runs over fourteen words`);
    if (!/modelled/.test(o.foot)) reds.push(`industry open ${id}: the foot does not say modelled (R12)`);
    ban(`industry open ${id}`, [o.basis, o.foot, ...o.withheldLines, ...o.cells.map((c) => c.label), ...(o.detail ? [o.detail.summary, o.detail.withheldLine ?? ""] : [])]);
  }
  if (openCount.cards !== opens) reds.push(`industry open: the count (${openCount.cards}) and the sweep (${opens}) disagree`);
  if (buildIndustryOpen("no_such_trade") !== null || buildIndustryOpen(undefined) !== null) reds.push("industry open: a trade with no shard builds a card");

  const paysCount = countPays(ids);
  let clusters = 0, rounded = 0;
  for (const id of ids) {
    const p = buildPays(id);
    if (!p) { reds.push(`industry pays ${id}: no cluster for a shard`); continue; }
    clusters++;
    const roles = shardRoles(id);
    const sum = roles.reduce((a, r) => a + r.headcount, 0);
    if (roles.length > 0 && sum > 0) {
      if (!("part" in p.crew)) reds.push(`industry pays ${id}: the crew is withheld though the shard holds ${roles.length} roles`);
      else {
        if (p.crew.part !== p.crew.whole || p.crew.whole !== Math.round(sum) || p.crew.sum !== sum) reds.push(`industry pays ${id}: the crew (${p.crew.part} of ${p.crew.whole}, sum ${p.crew.sum}) is not the roles' sum (${sum}) rounded with the part the whole`);
        if (p.crew.rounded !== !Number.isInteger(sum)) reds.push(`industry pays ${id}: rounded (${p.crew.rounded}) disagrees with the sum (${sum})`);
        if (p.crew.rounded) rounded++;
        if (p.crew.rounded !== /rounded/.test(p.crew.basis)) reds.push(`industry pays ${id}: the basis says ${/rounded/.test(p.crew.basis) ? "rounded" : "nothing"} of a sum of ${sum}`);
      }
    } else if ("part" in p.crew) reds.push(`industry pays ${id}: a crew drawn off no roles`);
    const pb = industryFigure(id, "first_year.payback_years");
    if (pb && pb.value > 0 && (!("figure" in p.payback) || p.payback.figure !== yearsFigure(pb.value))) reds.push(`industry pays ${id}: the payback is not the shard's through open_rows' formatter`);
    if ((!pb || pb.value <= 0) && "figure" in p.payback) reds.push(`industry pays ${id}: a payback drawn off no figure`);
    const sh = industryFigure(id, "cost_structure.breakeven_utilization_pct");
    if (sh && sh.value > 0 && (!("figure" in p.share) || p.share.figure !== shareFigure(sh.value))) reds.push(`industry pays ${id}: the share is not the shard's through clears_rows' formatter`);
    if ((!sh || sh.value <= 0) && "figure" in p.share) reds.push(`industry pays ${id}: a share drawn off no figure`);
    const fx = industryFigure(id, "cost_structure.fixed_pct");
    if (fx && fx.value > 0 && fx.value <= 100 && (!("part" in p.fixed) || p.fixed.part !== Math.round(fx.value) || p.fixed.whole !== 100)) reds.push(`industry pays ${id}: the fixed part is not the shard's share of 100`);
    if ((!fx || fx.value <= 0 || fx.value > 100) && "part" in p.fixed) reds.push(`industry pays ${id}: a fixed part drawn off no share`);
    const withheld = [p.payback, p.crew, p.fixed, p.share].filter((c) => "withheld" in c).length;
    if (withheld !== p.withheld) reds.push(`industry pays ${id}: ${withheld} cells withheld against a count of ${p.withheld}`);
    for (const key of PAYS_CELLS) {
      const cell = p[key];
      const line = "withheld" in cell ? cell.withheld : cell.basis;
      if (wordsOf(line) > 14) reds.push(`industry pays ${id}: the ${key} line runs ${wordsOf(line)} words: "${line}"`);
      if (!("withheld" in cell) && !/modelled\.$/.test(cell.basis)) reds.push(`industry pays ${id}: the ${key} basis does not end on modelled ("${cell.basis}")`);
      if ("withheld" in cell && !cell.withheld.startsWith("Not gathered yet: ")) reds.push(`industry pays ${id}: the ${key} withheld line is not in the idiom ("${cell.withheld}")`);
      ban(`industry pays ${id} ${key}`, [line]);
    }
  }
  if (paysCount.clusters !== clusters || paysCount.rounded.length !== rounded) reds.push(`industry pays: the count (${paysCount.clusters}, ${paysCount.rounded.length} rounded) and the sweep (${clusters}, ${rounded}) disagree`);
  if (buildPays("no_such_trade") !== null || buildPays(undefined) !== null) reds.push("industry pays: a trade with no shard builds a cluster");
  ban("industry copy", [COPY.industryOpen.kicker, ...Object.values(COPY.industryPays.kickers), ...Object.values(COPY.industryOpen.cells)]);
  for (const k of [COPY.industryOpen.kicker, ...Object.values(COPY.industryPays.kickers)]) if (wordsOf(k) > 4) reds.push(`industry copy: a kicker runs over four words: "${k}"`);
  console.log(`industry turn one: the split on ${splits} of ${ids.length} trades (${splitDrawn} drawn, ${splitWithheld} withheld, every net the hero's); the open card on ${opens} (${openCount.threeCells} with three cells, ${openCount.withheldCells} cells withheld, the plus rows ${JSON.stringify(openCount.plusRows)}, ${plusRows} licences by name, ${openCount.zeroDay} with a licence's wait withheld); the bento on ${clusters} (${paysCount.withheldCells} cells withheld, ${rounded} crews rounded from a fraction: ${paysCount.rounded.join(", ")}; crews ${paysCount.crewMin} to ${paysCount.crewMax}, ${paysCount.over8} over eight, ${paysCount.under4} under four; the fixed part ${paysCount.fixedMin} to ${paysCount.fixedMax} of 100)`);
}
/* THE INDUSTRY PAGE'S TURN TWO (MODEL.md 8.7 `06 places`, `07 formats`, `08
   channels`; plan step 34's third dispatch, 2026-09-19). THE PLACES TABLE is
   pure over the slate's resolved columns and the slate is the database, so
   its law is held on FIXTURES shaped as the resolver's columns (eight cities
   of their own; cities short of a figure; a filled headline, a revenue
   shared to the cent, a floored margin; the curated London entry; the seat
   at three, two, one, none): A ROW IS THE CITY'S OWN (a city holding no
   take-home or no margin, a headline revenue supplied from an anchor
   (`revenueFilled`), a revenue shared to the cent with another city of the
   slate, or a margin the clamp's floor (`netMarginFloored`) is never let
   into the rows, is counted by reason, and the card says so once; the
   curated London entry, whose figures rest on no revenue, is its own), the
   rows the take-home highest first in the table's two units with the
   country's flag code upper-cased and NO HOME ROW, the two heads and the
   basis within their caps, the seat under four own cities with its line in
   the idiom (opening "Not gathered yet:", naming the count of own figures
   and the floor of four, fourteen words at most, the slate's size composed
   in) and its foot naming item 69, and the floor the mark list's own
   number. THE FORMATS over every one of the 243 ids, without the database:
   ONE NET (R7), each row's figure the one net builder's figure with the
   engine absent plus that format's own delta off the shard, the trade's net
   the hero's to the digit, a format at a delta of zero printing the hero's
   own figure, never a second net; every shard's formats drawn (four or
   five, none under the floor today), highest first, the middle a figure
   some row holds with its label counting the rows, the basis naming the
   branch that printed the net and ending on modelled, the one printed form
   the builder's whole percent. THE MIX at the world altitude: the same
   cells, parts, leader and foot as the trade's card off one builder, only
   the basis changed, naming no city. Every string through the register ban
   and the placeholder check; the format names counted over three words and
   over the row's width, never redded (the shard's own, the data track's).
   Planted and watched go red 2026-09-19: a city without a margin let into
   the rows, then a filled headline let in (the OWN ROW check), a format
   ranked on the net plus one (the ONE NET check). */
{
  const ban = (where: string, texts: string[]) => {
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`${where}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`${where}: a placeholder was never filled ("${t}")`);
    }
  };
  const wordsOf = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
  const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
  const ids = ALL_INDUSTRIES.map((i) => i.id);
  const slate = MAJOR_CITIES.length;
  /* A column as the resolver shapes it: the fields the builder reads filled, the rest null; a distinct revenue per city unless one is given. */
  type Opt = { revenue?: number; filled?: boolean; floored?: boolean; economics?: "curated" | "estimator" | null };
  let rev = 400000;
  const col = (slug: string, country: string, takeHome: number | null, net: number | null, o: Opt = {}): CityColumn => ({ name: slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" "), slug, country, href: `/${country}/${slug}/restaurants`, revenue: o.revenue ?? (rev += 12345.67), revP10: null, revP90: null, takeHome, netMarginFraction: net, densityPer10k: null, startupCostUsd: null, breakevenDaily: null, typicalDaily: null, survivalYr5: null, breakInScore: null, breakInBand: null, revenueFilled: o.filled ?? false, economics: o.economics === undefined ? "estimator" : o.economics, netMarginFloored: o.floored ?? false });
  const eight = [col("new-york", "us", 25263, 0.0549), col("london", "gb", 36000, 0.05, { economics: "curated", filled: true }), col("paris", "fr", 12995, 0.031), col("madrid", "es", 12800, 0.032), col("barcelona", "es", 12700, 0.033), col("berlin", "de", 16477, 0.038), col("amsterdam", "nl", 18482, 0.0427), col("tokyo", "jp", 13077, 0.0302)];
  const table = buildIndustryPlaces("restaurants", eight);
  if (!table || table.state !== "table") reds.push("industry places: eight cities of their own do not draw the table");
  else {
    if (table.rows.length !== 8 || table.holding !== 8 || table.resolved !== 8 || table.withheld !== 0 || table.note !== null || table.line !== null || table.foot !== null) reds.push(`industry places: the eight-city table's counts are off (${table.rows.length} rows, ${table.holding} holding, ${table.withheld} withheld, note ${table.note ? "present" : "absent"})`);
    if (table.rows.some((r) => r.home)) reds.push("industry places: a home row on a page with no home");
    if (table.rows[0]?.key !== "london" || table.rows[1]?.key !== "new-york") reds.push(`industry places: the rows are not take-home highest first (${table.rows.map((r) => r.key).join(", ")})`);
    for (let r = 1; r < table.rows.length; r++) if ((table.rows[r].values.takeHome ?? 0) > (table.rows[r - 1].values.takeHome ?? 0)) reds.push(`industry places: the rows are not take-home highest first at ${table.rows[r].key}`);
    const ny = table.rows.find((r) => r.key === "new-york");
    if (!ny || ny.values.takeHome !== 25263 || ny.values.netMargin !== 5 || ny.iso2 !== "US" || ny.name !== "New York") reds.push(`industry places: New York's row is not the column's figures in the table's units (${JSON.stringify(ny)})`);
    if (table.columns.map((c) => `${c.key}:${c.unit}:${c.best}`).join(",") !== "takeHome:usd:max,netMargin:pct:max") reds.push(`industry places: the columns are not take-home in currency and net margin in percent, both best at max (${table.columns.map((c) => c.key).join(", ")})`);
    for (const c of table.columns) if (wordsOf(c.head) > 4) reds.push(`industry places: the head "${c.head}" runs over four words`);
    if (table.entityHead !== COPY.industryPlaces.cols.city) reds.push("industry places: the entity head is not the copy table's");
    if (wordsOf(table.caveat) > 14 || !/modelled\.$/.test(table.caveat)) reds.push(`industry places: the basis runs ${wordsOf(table.caveat)} words or does not end on modelled ("${table.caveat}")`);
    if (table.confidence !== "modeled") reds.push("industry places: the table is not marked modelled (the estimator's model over the cell's revenue)");
    ban("industry places", [table.caveat, table.entityHead, ...table.columns.map((c) => c.head), ...table.rows.map((r) => r.name)]);
  }
  /* A ROW IS THE CITY'S OWN: a city short of a figure, on a filled headline, on a shared revenue or on the floor is counted by reason and said once, never drawn. */
  const notOwn = [
    col("miami", "us", 30000, null),
    col("chicago", "us", null, 0.04),
    col("toronto", "ca", 0, 0.04),
    col("los-angeles", "us", 40000, 0.05, { filled: true }),
    col("sydney", "au", 41000, 0.05, { revenue: 777777.77 }),
    col("dubai", "ae", 42000, 0.05, { revenue: 777777.77 }),
    col("singapore", "sg", 15000, 0.03, { floored: true }),
  ];
  const mixed = buildIndustryPlaces("restaurants", [...eight, ...notOwn]);
  if (!mixed || mixed.state !== "table") reds.push("industry places: the eight-city table with seven cities not their own does not draw");
  else {
    for (const c of notOwn) if (mixed.rows.some((r) => r.key === c.slug)) reds.push(`industry places: OWN ROW: ${c.slug} is let into the rows (${withheldReason(c, [...eight, ...notOwn]) ?? "its own?"})`);
    if (mixed.rows.some((r) => !isNum(r.values.takeHome) || !isNum(r.values.netMargin))) reds.push("industry places: OWN ROW: a row prints a dash where the builder should have let the city out");
    if (mixed.resolved !== 15 || mixed.holding !== 8 || mixed.withheld !== 7) reds.push(`industry places: the cities not their own are not counted (${mixed.resolved} resolved, ${mixed.holding} holding, ${mixed.withheld} withheld)`);
    if (mixed.reasons.missing !== 3 || mixed.reasons.filled !== 1 || mixed.reasons.shared !== 2 || mixed.reasons.floored !== 1) reds.push(`industry places: the reasons are miscounted (${JSON.stringify(mixed.reasons)})`);
    if (mixed.note !== COPY.industryPlaces.withheldMany.replace("{n}", "7")) reds.push(`industry places: the note does not count the seven cities withheld ("${mixed.note}")`);
    if (mixed.note && wordsOf(mixed.note) > 14) reds.push(`industry places: the note runs ${wordsOf(mixed.note)} words ("${mixed.note}")`);
    ban("industry places", [mixed.note ?? ""]);
  }
  if (withheldReason(col("x", "gb", 36000, 0.05, { economics: "curated", filled: true }), []) !== null) reds.push("industry places: the curated London entry is not its own");
  if (withheldReason(col("x", "us", 100, 0.05, { filled: true }), []) !== "filled") reds.push("industry places: a filled headline is not withheld as filled");
  if (withheldReason(col("x", "us", 100, 0.05, { floored: true }), []) !== "floored") reds.push("industry places: a floored margin is not withheld as floored");
  const one = buildIndustryPlaces("restaurants", [...eight, col("miami", "us", 30000, null)]);
  if (!one || one.note !== COPY.industryPlaces.withheldOne) reds.push(`industry places: one city withheld does not take the one-city note ("${one?.note}")`);
  /* THE SEAT under four own cities, and its line at each count; a filled slate seats the block whatever it resolves. */
  const seatLine = (n: number) => (n === 0 ? COPY.industryPlaces.blocked.none.replace("{slate}", String(slate)) : n === 1 ? COPY.industryPlaces.blocked.one.replace("{slate}", String(slate)) : COPY.industryPlaces.blocked.some.replace("{n}", String(n)).replace("{slate}", String(slate)));
  for (const n of [0, 1, 2, 3]) {
    const p = buildIndustryPlaces("restaurants", [...eight.slice(0, n), ...notOwn.slice(3)]);
    if (!p || p.state !== "blocked") { reds.push(`industry places: ${n} own cities do not seat the block`); continue; }
    if (p.rows.length !== 0 || p.holding !== n || p.withheld !== 4) reds.push(`industry places: the seat at ${n} draws rows or miscounts (${p.rows.length} rows, ${p.holding} holding, ${p.withheld} withheld)`);
    if (p.line !== seatLine(n)) reds.push(`industry places: the seat's line at ${n} is not the copy table's composed ("${p.line}")`);
    if (!p.line || !p.line.startsWith("Not gathered yet: ")) reds.push(`industry places: the seat's line at ${n} is not in the idiom ("${p.line}")`);
    if (p.line && wordsOf(p.line) > 14) reds.push(`industry places: the seat's line at ${n} runs ${wordsOf(p.line)} words, over fourteen ("${p.line}")`);
    if (p.line && !p.line.includes(String(slate))) reds.push(`industry places: the seat's line at ${n} does not name the slate's size ${slate}`);
    if (n > 0 && p.line && !p.line.includes(n === 1 ? "one of" : `${n} of`)) reds.push(`industry places: the seat's line at ${n} does not name the count it holds ("${p.line}")`);
    if (p.line && !/a table needs four\.$/.test(p.line)) reds.push(`industry places: the seat's line at ${n} does not say a table needs four ("${p.line}")`);
    if (p.foot !== COPY.industryPlaces.blocked.foot || !/item 69\.$/.test(p.foot ?? "")) reds.push(`industry places: the seat's foot does not name item 69 ("${p.foot}")`);
    ban(`industry places seat ${n}`, [p.line ?? "", p.foot ?? ""]);
  }
  const four = buildIndustryPlaces("restaurants", eight.slice(0, 4));
  if (!four || four.state !== "table" || four.rows.length !== 4) reds.push("industry places: four own cities do not draw the table (the floor is four)");
  if (PLACES_FLOOR !== MARK_LIST_FLOOR || PLACES_FLOOR !== 4) reds.push(`industry places: the floor is ${PLACES_FLOOR}, not the mark list's four`);
  if (buildIndustryPlaces("restaurants", undefined) !== null) reds.push("industry places: no lookup (undefined) builds a card");
  if (buildIndustryPlaces("restaurants", null) !== null) reds.push("industry places: a trade the taxonomy does not hold (null) builds a card");
  if (buildIndustryPlaces(undefined, eight) !== null) reds.push("industry places: no id builds a card");
  if (!holdsBoth(eight[0]) || holdsBoth(col("x", "us", null, 0.1)) || holdsBoth(col("x", "us", 100, null)) || holdsBoth(col("x", "us", 0, 0.1))) reds.push("industry places: holdsBoth does not hold both");
  const counted = countIndustryPlaces([{ id: "restaurants", across: eight }, { id: "cafes_coffee", across: eight.slice(0, 3) }, { id: "bakeries", across: [] }, { id: "no_such_trade", across: null }, { id: "bars_nightclubs", across: notOwn }]);
  if (counted.total !== 4 || counted.table !== 1 || counted.blocked !== 3 || counted.none !== 1 || counted.withheld !== 7 || counted.reasons.shared !== 2) reds.push(`industry places: the counter is off (${JSON.stringify(counted)})`);
  ban("industry copy", [COPY.industryPlaces.kicker, COPY.industryFormats.kicker, ...Object.values(COPY.industryPlaces.cols), ...Object.values(COPY.industryFormats.head), COPY.industryMix.basis]);
  if (wordsOf(COPY.industryPlaces.kicker) > 4 || wordsOf(COPY.industryFormats.kicker) > 4) reds.push("industry copy: a kicker runs over four words");

  /* THE FORMATS over 243 ids. */
  const formatsCount = countFormats(ids);
  let formatsCards = 0, zeroDelta = 0, profileBasis = 0;
  for (const id of ids) {
    const f = buildFormats(id);
    const n = resolveTradeNet(id, { moneyShown: false, netMarginPct: null });
    const hero = industryHeroFacts(id);
    if (!f || !n || !hero) { reds.push(`industry formats ${id}: no card, no net or no hero for a taxonomy id`); continue; }
    formatsCards++;
    const names = industryRows(id, FORMATS_METRICS.name);
    const deltas = new Map(industryRows(id, FORMATS_METRICS.delta).map((d) => [d.rowKey, d.value] as const));
    if (f.net.pct !== n.pct || f.net.text !== n.text || f.net.branch !== n.branch) reds.push(`industry formats ${id}: ONE NET: the card's net (${f.net.text}, ${f.net.branch}) is not the one builder's (${n.text}, ${n.branch})`);
    if (!hero.answer || hero.answer.value !== f.net.text) reds.push(`industry formats ${id}: ONE NET: the card's net (${f.net.text}) is not the hero's (${hero.answer?.value ?? "absent"})`);
    if (f.state !== "list" || f.rows.length !== names.length || f.formats !== names.length) reds.push(`industry formats ${id}: ${f.rows.length} rows drawn of ${names.length} formats on file (state ${f.state})`);
    if (f.rows.length < MARK_LIST_FLOOR) reds.push(`industry formats ${id}: ${f.rows.length} rows, under the floor of four`);
    for (const r of f.rows) {
      const delta = deltas.get(r.key);
      if (!isNum(delta) || r.delta !== delta || r.value !== n.pct + delta) reds.push(`industry formats ${id}: ONE NET: the row ${r.key} (${r.value}) is not the one net (${n.pct}) plus the shard's delta (${delta})`);
      if (delta === 0) { zeroDelta++; if (f.fmt(r.value) !== hero.answer?.value) reds.push(`industry formats ${id}: a format at a delta of zero prints ${f.fmt(r.value)}, not the hero's ${hero.answer?.value}`); }
      if (!r.name) reds.push(`industry formats ${id}: a row with no name`);
      if (/^[-+]/.test(f.fmt(r.value))) reds.push(`industry formats ${id}: a signed figure in a row ("${f.fmt(r.value)}")`);
    }
    for (let r = 1; r < f.rows.length; r++) if (f.rows[r].value > f.rows[r - 1].value) reds.push(`industry formats ${id}: the rows are not highest first (${f.rows[r - 1].name} before ${f.rows[r].name})`);
    if (f.middle == null || !f.rows.some((r) => r.value === f.middle)) reds.push(`industry formats ${id}: the middle (${f.middle}) is not a figure some row holds`);
    const sorted = [...f.rows.map((r) => r.value)].sort((a, b) => a - b);
    if (f.middle !== sorted[Math.floor((sorted.length - 1) / 2)]) reds.push(`industry formats ${id}: the middle (${f.middle}) is not the lower median`);
    if (f.middleLabel !== COPY.markList.middleOfDrawn.replace("{n}", f.rows.length === 4 ? "four" : "five")) reds.push(`industry formats ${id}: the middle's label does not count the rows ("${f.middleLabel}")`);
    if (f.fmt(n.pct) !== n.text) reds.push(`industry formats ${id}: the formatter is not the one builder's printed form (${f.fmt(n.pct)} against ${n.text})`);
    const expectedBasis = n.branch === "profile" ? COPY.industryFormats.basisProfile : COPY.industryFormats.basisShard;
    if (f.basis !== expectedBasis) reds.push(`industry formats ${id}: the basis does not name the branch that printed the net (${n.branch})`);
    if (n.branch === "profile") profileBasis++;
    if (wordsOf(f.basis) > 14 || !/modelled\.$/.test(f.basis)) reds.push(`industry formats ${id}: the basis runs ${wordsOf(f.basis)} words or does not end on modelled ("${f.basis}")`);
    if (/city|London/i.test(f.basis)) reds.push(`industry formats ${id}: the basis names a city ("${f.basis}")`);
    if (f.head.name !== COPY.industryFormats.head.name || f.head.value !== COPY.industryFormats.head.value) reds.push(`industry formats ${id}: the heads are not the copy table's`);
    if (f.sample !== true || f.confidence !== "modeled") reds.push(`industry formats ${id}: the card is not marked modelled (R12)`);
    if (f.stateLine != null) reds.push(`industry formats ${id}: a state line in the list state`);
    ban(`industry formats ${id}`, [f.basis, f.kicker, f.head.name, f.head.value, f.middleLabel, ...f.rows.map((r) => r.name)]);
  }
  if (formatsCount.cards !== formatsCards || formatsCount.profile !== profileBasis) reds.push(`industry formats: the count (${formatsCount.cards} cards, ${formatsCount.profile} on the profile) and the sweep (${formatsCards}, ${profileBasis}) disagree`);
  if (buildFormats("no_such_trade") !== null || buildFormats(undefined) !== null) reds.push("industry formats: a trade with no shard builds a card");
  /* The withheld state, on a fixture no shard reaches: the copy table's line with the count in words, opening the idiom. */
  const stateOne = COPY.industryFormats.state.replace("{k}", "one");
  if (!stateOne.startsWith("Not gathered yet: ") || wordsOf(stateOne) > 14) reds.push(`industry formats: the state line is not in the idiom or runs over fourteen words ("${stateOne}")`);
  ban("industry formats state", [stateOne, COPY.industryFormats.basisShard, COPY.industryFormats.basisProfile]);

  /* THE MIX at the world altitude, over 243 ids: one builder, one card, only the basis changed. */
  let worldMix = 0;
  for (const id of ids) {
    const w = buildMix(id, "world");
    const p = buildMix(id);
    if (!w || !p) { reds.push(`industry channels ${id}: no card off a shard that holds channels`); continue; }
    worldMix++;
    if (w.basis !== COPY.industryMix.basis || /city/i.test(w.basis)) reds.push(`industry channels ${id}: the world basis names a city or is not the copy table's ("${w.basis}")`);
    if (w.foot !== p.foot || w.withheld !== p.withheld || JSON.stringify(w.cells) !== JSON.stringify(p.cells) || JSON.stringify(w.parts) !== JSON.stringify(p.parts) || JSON.stringify(w.leader) !== JSON.stringify(p.leader)) reds.push(`industry channels ${id}: the world card and the trade card disagree off one builder`);
    if (w.altitude !== "world" || p.altitude !== "place") reds.push(`industry channels ${id}: the altitude is not carried`);
    if (wordsOf(w.basis) > 14) reds.push(`industry channels ${id}: the basis runs ${wordsOf(w.basis)} words`);
    ban(`industry channels ${id}`, [w.basis, w.foot]);
  }
  console.log(`industry turn two: the places table's laws held on fixtures (eight cities of their own, seven not their own by four reasons, the seat at 0, 1, 2 and 3 own cities, the floor at four, the slate ${slate}); the formats on ${formatsCards} of ${ids.length} trades (${JSON.stringify(formatsCount.byCount)} by format count, ${formatsCount.rows} rows, ${formatsCount.ladder} on the ladder and ${formatsCount.profile} on the sector profile's residual, ${zeroDelta} rows at a delta of zero printing the hero's figure; ${formatsCount.longNames} names over three words and ${formatsCount.wideNames} over ${FORMAT_NAME_FITS} characters on ${formatsCount.wideShards} shards, the shard's own names, counted and not redded); the mix at the world altitude on ${worldMix}`);

  /* THE INDUSTRY PAGE'S TURN THREE AND ITS EXIT (MODEL.md 8.7 `09 know`, `10
     field`, `11 close`; plan step 34's fourth and last dispatch, 2026-09-19),
     over every one of the 243 ids, without the database. THE NOTES: EVERY
     FACT IS AUTHORED TEXT (the character's edge or watch-out through the
     merged lookup, or one of the trade's first two failure modes' explanations,
     or the one not-gathered line where nothing is authored) and nothing
     composed: a computed sentence let into the rows reds here (planted and
     watched 2026-09-19: the old adapter's "A high gross margin is misleading
     ..." pushed into buildKnow's rows); the two character rows under the trade
     page's own labels, the failure rows under their file's, in that order, at
     most five, at most two failure modes; the not-gathered row exactly when
     nothing is authored, never beside a note; a label within the note cap's
     seven words, no empty fact, no placeholder ({}) and no letter standing
     where a figure goes ("$X", the failure-modes file's own fault before this
     dispatch), no em dash, the register ban on every label and every fact
     (in scope redded, a retired id counted, the suits gate's rule); the basis
     within fourteen words; the facts over the locals notes' 140 characters
     counted, not cut. THE FIELD: one builder at two altitudes, the world
     cluster's figures, tags and withheld count the trade cluster's to the
     digit, only the three bases with a city clause swapped for the copy
     table's world lines (none naming a city), the swing's one literal; the
     card's cells exactly FIELD_CELLS in order, NEVER THE CHURN CELL (planted
     and watched 2026-09-19: the close cell pushed into fieldCells), each
     value the builder's own printed figure (the density as the file holds
     it, the chain share as a whole percent, the swing as printed), each
     label the trade market's own opener, each note under 48 characters,
     every cell modelled; the kicker within four words, the basis and the
     foot within fourteen, the foot saying modelled. THE CLOSE on every id
     with no slate resolved (the live page's state today: `06` seated, no
     city door): the trade next door exactly when `02` holds another member
     whose page exists, its href that member's own `/industries/<slug>` and
     never a retired or merged id's, the pill last to /compare, the country's
     own checkDoors (the cap, one pill, distinct first words, every href a
     route, no "with Pro", no banned word), the counts printed; then the
     three-door branch on the table's own fixture (eight cities of their own:
     the city door first, its href the top row's own link, a route), the seat
     fixture (three own cities: no city door) and a withheld `02` (the pill
     alone); no sector door on any. */
  {
    const ban = (where: string, texts: string[]) => {
      for (const t of texts) {
        for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`${where}: banned word "${b}" in "${t}"`);
        if (/[{}]/.test(t)) reds.push(`${where}: a placeholder was never filled ("${t}")`);
        if (/—/.test(t)) reds.push(`${where}: an em dash in "${t}"`);
      }
    };
    const wordsOf = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
    const ids = ALL_INDUSTRIES.map((i) => i.id);
    const inScope = new Set(INDUSTRIES.map((i) => i.id));
    const knowCount = countKnow(ids);
    let knowCards = 0, retiredBanned = 0;
    const retiredQueue: string[] = [];
    for (const id of ids) {
      const k = buildKnow(id);
      if (!k) { reds.push(`industry know ${id}: no card for a taxonomy id`); continue; }
      knowCards++;
      const c = getActivityCharacter(id);
      const authored = new Set<string>([c?.edge?.trim() ?? "", c?.watchOut?.trim() ?? "", ...(getFailureModes(id) ?? []).slice(0, KNOW_FAILURE_MODES_CAP).map((m) => m.explanation.trim())].filter(Boolean));
      if (k.rows.length > NOTE_CAP) reds.push(`industry know ${id}: ${k.rows.length} rows, over ${NOTE_CAP}`);
      if (k.rows.filter((r) => r.key === "failure").length > KNOW_FAILURE_MODES_CAP) reds.push(`industry know ${id}: more than ${KNOW_FAILURE_MODES_CAP} failure modes drawn`);
      const order = k.rows.map((r) => r.key).join(",");
      const expected = k.notGathered ? "notGathered" : [...(k.hasCharacter ? ["suits", "thinkTwice"] : []), ...failureRows(id).map(() => "failure")].join(",");
      if (order !== expected) reds.push(`industry know ${id}: the rows are not in the card's order (${order})`);
      if (k.notGathered !== (authored.size === 0)) reds.push(`industry know ${id}: the not-gathered state (${k.notGathered}) disagrees with what is authored (${authored.size} facts)`);
      for (const r of k.rows) {
        if (r.key === "notGathered") {
          if (r.fact !== COPY.industryKnow.notGathered || !r.fact.startsWith("Not gathered yet: ")) reds.push(`industry know ${id}: the not-gathered row is not the copy table's line in the idiom ("${r.fact}")`);
          if (k.rows.length !== 1) reds.push(`industry know ${id}: the not-gathered row beside another row`);
          continue;
        }
        if (!authored.has(r.fact)) reds.push(`industry know ${id}: AUTHORED ONLY: the fact under "${r.label}" is not the character's edge, its watch-out or a failure mode's explanation ("${r.fact.slice(0, 60)}")`);
        if (r.key === "suits" && (r.label !== COPY.tradeSuits.labels.suits || r.fact !== c?.edge?.trim())) reds.push(`industry know ${id}: the suits row is not the edge under the trade page's label`);
        if (r.key === "thinkTwice" && (r.label !== COPY.tradeSuits.labels.thinkTwice || r.fact !== c?.watchOut?.trim())) reds.push(`industry know ${id}: the think-twice row is not the watch-out under the trade page's label`);
        if (r.key === "failure" && !(getFailureModes(id) ?? []).slice(0, KNOW_FAILURE_MODES_CAP).some((m) => m.label.trim() === r.label && m.explanation.trim() === r.fact)) reds.push(`industry know ${id}: a failure row is not one of the file's first two under its own label ("${r.label}")`);
        if (wordsOf(r.label) > LABEL_WORDS_CAP) reds.push(`industry know ${id}: label over ${LABEL_WORDS_CAP} words: "${r.label}"`);
        if (!r.fact.trim()) reds.push(`industry know ${id}: an empty fact under "${r.label}"`);
        if (/\$[A-Z]\b/.test(r.fact) || /\$[A-Z]\b/.test(r.label)) reds.push(`industry know ${id}: NO WORD: a letter stands where a figure goes ("${r.fact.slice(0, 60)}")`);
        for (const t of [r.label, r.fact]) {
          if (/[{}]/.test(t)) reds.push(`industry know ${id}: a placeholder was never filled ("${t}")`);
          if (/—/.test(t)) reds.push(`industry know ${id}: an em dash in "${t}"`);
          for (const b of COPY.banned) if (t.toLowerCase().includes(b)) { if (inScope.has(id)) reds.push(`industry know ${id}: banned word "${b}" in "${t}"`); else { retiredBanned++; retiredQueue.push(`${id} ("${b}")`); } }
        }
      }
      if (wordsOf(k.basis) > 14 || k.basis !== COPY.industryKnow.basis) reds.push(`industry know ${id}: the basis is not the copy table's within fourteen words ("${k.basis}")`);
      if (k.sample !== true) reds.push(`industry know ${id}: the notes are authored and the opener's mark is off`);
    }
    if (knowCount.total !== knowCards || knowCount.notes + knowCount.oneRow !== knowCards) reds.push(`industry know: the count (${knowCount.total}: ${knowCount.notes} with notes, ${knowCount.oneRow} one-row) and the sweep (${knowCards}) disagree`);
    const planted = buildKnow("no_such_trade"); // allow-industry-ref: the planted id no file holds, the not-gathered story's whole point
    if (!planted || !planted.notGathered || planted.rows.length !== 1 || planted.rows[0].key !== "notGathered" || planted.rows[0].label !== COPY.industryKnow.notGatheredLabel) reds.push("industry know: an id no file holds does not take the one not-gathered row under its own label");
    if (buildKnow(undefined) !== null) reds.push("industry know: no id builds a card");
    ban("industry know copy", [COPY.industryKnow.kicker, COPY.industryKnow.notGatheredLabel, COPY.industryKnow.notGathered, COPY.industryKnow.basis]);
    if (wordsOf(COPY.industryKnow.kicker) > 4) reds.push(`industry know: the kicker runs over four words: "${COPY.industryKnow.kicker}"`);
    if (wordsOf(COPY.industryKnow.notGathered) > 14 || wordsOf(COPY.industryKnow.notGatheredLabel) > LABEL_WORDS_CAP) reds.push("industry know: the not-gathered row runs over its caps");

    /* THE FIELD over 243 ids. */
    let fieldCards = 0, swingHeld = 0;
    for (const id of ids) {
      const w = buildMarket(id, "world");
      const p = buildMarket(id);
      if (!w || !p) { reds.push(`industry field ${id}: no cluster off a shard that holds the four fields`); continue; }
      fieldCards++;
      if (w.altitude !== "world" || p.altitude !== "place") reds.push(`industry field ${id}: the altitude is not carried`);
      if (w.withheld !== p.withheld || w.tag !== p.tag) reds.push(`industry field ${id}: the world cluster and the trade cluster disagree off one builder (withheld ${w.withheld}/${p.withheld}, tag ${w.tag}/${p.tag})`);
      for (const key of MARKET_CELLS) {
        const a = w[key], b = p[key];
        const strip = (c: typeof a) => ("withheld" in c ? { withheld: c.withheld } : { ...c, basis: undefined });
        if (JSON.stringify(strip(a)) !== JSON.stringify(strip(b))) reds.push(`industry field ${id}: the ${key} cell differs between altitudes`);
        if ("withheld" in a) continue;
        const expectedBasis = key === "swing" ? COPY.tradeMarket.basis.swing : COPY.industryField.cellBasis[key];
        if (a.basis !== expectedBasis) reds.push(`industry field ${id}: the ${key} world basis is not the copy table's ("${a.basis}")`);
        if (/city|London/i.test(a.basis)) reds.push(`industry field ${id}: the ${key} world basis names a city ("${a.basis}")`);
        if (!/modelled/.test(a.basis)) reds.push(`industry field ${id}: the ${key} world basis does not say modelled (R12)`);
      }
      const cells = fieldCells(w);
      const keys = cells.map((c) => c.key);
      if (keys.some((k) => k === "close")) reds.push(`industry field ${id}: NO CHURN: the churn cell is drawn on the industry card (8.7: beside 01 lasts it is a second view of one reading)`);
      const drawnExpected = FIELD_CELLS.filter((k) => !("withheld" in w[k]));
      if (keys.join(",") !== drawnExpected.join(",")) reds.push(`industry field ${id}: the cells are not FIELD_CELLS in order (${keys.join(",")})`);
      if (fieldWithheld(w).length !== FIELD_CELLS.length - drawnExpected.length) reds.push(`industry field ${id}: the withheld lines do not match the cells not drawn`);
      for (const c of cells) {
        const cell = w[c.key as (typeof FIELD_CELLS)[number]];
        const value = typeof c.value === "string" ? c.value : "";
        if (c.key === "firms" && "figure" in cell && value !== cell.figure) reds.push(`industry field ${id}: the density prints "${value}", not the builder's ${cell.figure}`);
        if (c.key === "chains" && "part" in cell && value !== `${cell.part}%`) reds.push(`industry field ${id}: the chain share prints "${value}", not ${cell.part}%`);
        if (c.key === "swing" && "figure" in cell && value !== cell.figure) reds.push(`industry field ${id}: the swing prints "${value}", not the builder's ${cell.figure}`);
        if (!/\d/.test(value)) reds.push(`industry field ${id}: NO WORD: the cell ${c.key} prints "${value}" where a figure goes`);
        if (c.label !== COPY.tradeMarket.kickers[c.key as keyof typeof COPY.tradeMarket.kickers]) reds.push(`industry field ${id}: the ${c.key} label is not the trade market's opener ("${c.label}")`);
        if (wordsOf(c.label) > 4) reds.push(`industry field ${id}: label over four words: "${c.label}"`);
        if (c.note && c.note.length > 48) reds.push(`industry field ${id}: note over 48 characters: "${c.note}"`);
        if (c.confidence !== "modeled") reds.push(`industry field ${id}: the cell ${c.key} is not marked modelled (R12)`);
        ban(`industry field ${id}`, [c.label, c.note ?? ""]);
      }
      if ("figure" in w.swing && w.swing.tag === "held") swingHeld++;
    }
    if (buildMarket("no_such_trade", "world") !== null) reds.push("industry field: a trade with no shard builds a cluster at the world altitude");
    ban("industry field copy", [COPY.industryField.kicker, COPY.industryField.basis, COPY.industryField.foot, ...Object.values(COPY.industryField.notes), ...Object.values(COPY.industryField.cellBasis)]);
    if (wordsOf(COPY.industryField.kicker) > 4) reds.push(`industry field: the kicker runs over four words: "${COPY.industryField.kicker}"`);
    if (wordsOf(COPY.industryField.basis) > 14 || wordsOf(COPY.industryField.foot) > 14 || !/modelled/.test(COPY.industryField.foot)) reds.push("industry field: the basis or the foot runs over fourteen words, or the foot does not say modelled");
    for (const [key, b] of Object.entries(COPY.industryField.cellBasis)) if (wordsOf(b) > 14) reds.push(`industry field ${key}: a world basis over fourteen words: "${b}"`);

    /* THE CLOSE over 243 ids with no slate resolved, then the fixtures. */
    let closes = 0, leaderDoors = 0, leaderTop = 0, leaderNext = 0, pillAlone = 0, pillAloneInScope = 0;
    for (const id of ids) {
      const b = buildBenchmark(id);
      const doors = buildIndustryCloseDoors(id, null, b);
      if (doors.length === 0) { reds.push(`industry close ${id}: no door for a taxonomy id`); continue; }
      closes++;
      checkDoors(id, doors, "industry close");
      if (doors[doors.length - 1].kind !== "pill" || doors[doors.length - 1].href !== "/compare" || doors[doors.length - 1].label !== COPY.tradeClose.compareDoor.replace("{trade}", INDUSTRY_BY_ID[id].name.toLowerCase())) reds.push(`industry close ${id}: the compare pill is not last, not the trade page's literal, or does not go to /compare`);
      if (doors.some((d) => d.key === "city")) reds.push(`industry close ${id}: a city door with no slate resolved`);
      if (doors.some((d) => d.href === "/pricing" || d.key === "sector")) reds.push(`industry close ${id}: a pricing or sector door is drawn`);
      const leader = industryLeader(id, b);
      const leaderDoor = doors.find((d) => d.key === "leader");
      const others = b && b.state !== "withheld" ? b.rows.filter((r) => r.key !== id) : [];
      const expectedLeader = others.find((r) => inScope.has(r.key)) ?? null;
      if ((leader?.id ?? null) !== (expectedLeader?.key ?? null)) reds.push(`industry close ${id}: the trade next door (${leader?.id ?? "none"}) is not the highest other row of 02 in scope (${expectedLeader?.key ?? "none"})`);
      if (!!leaderDoor !== !!leader) reds.push(`industry close ${id}: the leader door (${leaderDoor ? "drawn" : "absent"}) disagrees with the leader (${leader ? leader.id : "none"})`);
      if (leader && leaderDoor) {
        leaderDoors++;
        if (!inScope.has(leader.id)) reds.push(`industry close ${id}: PROMISE: the trade next door is a retired or merged id (${leader.id}), a page that redirects`);
        if (leaderDoor.href !== `/industries/${industryToSlug(leader.id)}`) reds.push(`industry close ${id}: the leader door goes to ${leaderDoor.href}, not the leader's own page`);
        if (!leaderDoor.label.startsWith(INDUSTRY_BY_ID[leader.id].name)) reds.push(`industry close ${id}: the leader door does not open on the leader's name ("${leaderDoor.label}")`);
        if (/highest|most|best/i.test(leaderDoor.label)) reds.push(`industry close ${id}: the leader door claims a superlative ("${leaderDoor.label}")`);
        if (others[0] && others[0].key === leader.id) leaderTop++; else leaderNext++;
      } else { pillAlone++; if (inScope.has(id)) pillAloneInScope++; }
      if (doors.length !== (leader ? 2 : 1)) reds.push(`industry close ${id}: ${doors.length} doors with no slate, expected ${leader ? 2 : 1}`);
    }
    /* The three-door branch on the table's fixture, the seat, a withheld 02. */
    const rev0 = 400000; let revN = rev0;
    const colx = (slug: string, country: string, takeHome: number, net: number): CityColumn => ({ name: slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" "), slug, country, href: `/${country}/${slug}/restaurants`, revenue: (revN += 12345.67), revP10: null, revP90: null, takeHome, netMarginFraction: net, densityPer10k: null, startupCostUsd: null, breakevenDaily: null, typicalDaily: null, survivalYr5: null, breakInScore: null, breakInBand: null, revenueFilled: false, economics: "estimator", netMarginFloored: false });
    const eightOwn = [colx("new-york", "us", 25263, 0.0549), colx("london", "gb", 36000, 0.05), colx("paris", "fr", 12995, 0.031), colx("madrid", "es", 12800, 0.032), colx("barcelona", "es", 12700, 0.033), colx("berlin", "de", 16477, 0.038), colx("amsterdam", "nl", 18482, 0.0427), colx("tokyo", "jp", 13077, 0.0302)];
    const tabled = buildIndustryPlaces("restaurants", eightOwn);
    const three = buildIndustryCloseDoors("restaurants", tabled, buildBenchmark("restaurants"));
    if (!tabled || tabled.state !== "table" || !tabled.top || tabled.top.slug !== "london") reds.push(`industry close (fixture): the eight-city table does not name London as its top row (${tabled?.top?.slug ?? "none"})`);
    if (three.length !== 3 || three[0].key !== "city" || three[1].key !== "leader" || three[2].kind !== "pill") reds.push(`industry close (fixture): the table does not draw three doors, city first, the pill last (${three.map((d) => d.key).join(", ")})`);
    else {
      checkDoors("restaurants", three, "industry close (table)");
      if (three[0].href !== eightOwn[1].href || three[0].href !== "/gb/london/restaurants") reds.push(`industry close (fixture): the city door goes to ${three[0].href}, not the top row's own link`);
      if (three[0].label !== COPY.industryClose.cityDoor.replace("{trade}", "restaurants").replace("{city}", "London")) reds.push(`industry close (fixture): the city door's label is not the copy table's composed ("${three[0].label}")`);
      if (!resolves(three[0].href)) reds.push(`industry close (fixture): the city door's link is not a route (${three[0].href})`);
    }
    const seated = buildIndustryPlaces("restaurants", eightOwn.slice(0, 3));
    const two = buildIndustryCloseDoors("restaurants", seated, buildBenchmark("restaurants"));
    if (!seated || seated.state !== "blocked" || seated.top !== null || two.length !== 2 || two.some((d) => d.key === "city")) reds.push(`industry close (fixture): the seat at three own cities draws a city door or the wrong count (${two.map((d) => d.key).join(", ")})`);
    const withheldBench = buildBenchmark("telecom");
    const one = buildIndustryCloseDoors("telecom", null, withheldBench);
    if (!withheldBench || withheldBench.state !== "withheld" || one.length !== 1 || one[0].kind !== "pill") reds.push(`industry close (fixture): a withheld 02 does not leave the pill alone (${one.map((d) => d.key).join(", ")})`);
    if (buildIndustryCloseDoors("no_such_trade", null, null).length || buildIndustryCloseDoors(undefined, null, null).length) reds.push("industry close: a trade not in the taxonomy draws a door");
    ban("industry close copy", [COPY.industryClose.cityDoor.replace("{trade}", "restaurants").replace("{city}", "London"), COPY.industryClose.leaderDoor.replace("{leader}", "Food trucks")]);
    console.log(`industry turn three and the exit: the notes on ${knowCards} of ${ids.length} trades (${knowCount.notes} draw notes, ${knowCount.oneRow} the one row, ${knowCount.withFailures} with failure modes, ${JSON.stringify(knowCount.byRows)} by row count; ${knowCount.longFacts} authored facts over the locals notes' ${FACT_CHARS_CAP}-character cap, the longest ${knowCount.longestFact}, a copy fault in the source files and not cut here; ${retiredBanned} banned word(s) on retired or merged ids that reach no reader${retiredBanned ? ` (${retiredQueue.join(", ")})` : ""}); the field at the world altitude on ${fieldCards} (three cells of four, the churn never drawn; the swing held on ${swingHeld}); the close on ${closes} with no slate (${leaderDoors} draw the trade next door, ${leaderTop} on the highest other row of 02 and ${leaderNext} on the next in scope past a retired leader; ${pillAlone} the pill alone, ${pillAloneInScope} of them in scope), the three-door branch proven on the table's fixture`);
  }
}
/* THE NEIGHBOURHOOD PAGES (MODEL.md 8.8; plan step 35, 2026-09-19): the hub
   and every district page of every admitted city, built by the slug off the
   files through the six hood builders, no seed and no database, every string
   a reader meets read here. THE LAWS, each the builder's own:
    TAKE: the 40 is the spread (the dearest against the cheapest) on the hub
      and on the cheapest district's own page, and the district's own rent
      against the cheapest elsewhere, in rentMult's notation and never
      "1.00x"; the companions are the cheapest's own figure, the dearest's and
      the count less whichever the 40 prints, never a duplicate; a cell label
      within four words of its own past the district's name; the crumb names
      the city once on a district page and nothing on the hub; the foot names
      the year where held; modelled, always.
    RANK: the figures are the city district builder's own over the same rows
      (one builder, one figure); the clip line names exactly the districts on
      the engine's rent bound.
    PREMIUM: highest first, four or more, every row a figure, the headline the
      lower median, the withheld count and its line agreeing both ways, the
      head within three words, every row's href the district page's.
    COMPARE: exactly two columns, rent (mult, min) and visitors (per, max),
      the rent head naming the cheapest; NEVER a column keyed character,
      walkability or price_tier (PART 9 clause 19, item 66; the fault was
      planted, a "character" column let in, and watched go red); rows carry
      no href (M23); the home row is the focused district and only it; the
      caveat within fourteen words.
    WORKS: the seat's three strings, the line under fifteen words in the
      site's idiom, the foot naming item 70, the kicker within four words.
    CHARACTER: at most four rows; the first row's fact a verbatim prefix of
      the paragraph within the four-line cap, ending at a sentence end or a
      colon, never mid-sentence; the description row only where no paragraph
      is held; never "foot traffic", never the walkability word; the kicker
      names the district on the hub and not on its page; the foot counts the
      other districts as a word.
    CLOSE: the country's own checkDoors (the cap, one pill, distinct first
      words, every href a route); the hub's doors the city page, the benchmark
      trade's page here and the pill; a district's the hub, the city page and
      the pill; a fourth door planted (a second trade door) and watched red.
   No banned word and no unfilled placeholder in any of it. */
{
  const wordsOf = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
  const ban = (where: string, texts: string[]) => {
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`${where}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`${where}: a placeholder was never filled ("${t}")`);
      if (/foot traffic|walkab/i.test(t)) reds.push(`${where}: a phrase the spine bars ("${t}")`);
    }
  };
  const cities = spineHoodCities();
  if (cities.length === 0) reds.push("hood: no city is admitted (London holds seven curated districts with centroids)");
  let pages = 0, takes = 0, spreads = 0, owns = 0;
  for (const city of cities) {
    const districts = spineHoodDistricts(city)!;
    const ranked = byRent(districts);
    const cheapest = ranked[0], dearest = ranked[ranked.length - 1];
    /* THE RANK, once per city. */
    const rank = buildHoodRank(city);
    const cityBars = buildCityDistrictBars({ where_to_trade: { list: districts.map((d) => ({ name: d.name, slug: d.slug, rent_mult: d.rent_mult })) } });
    if (!rank || !cityBars) reds.push(`hood rank ${city}: builds nothing`);
    else {
      if (JSON.stringify(rank.rows) !== JSON.stringify(cityBars.rows) || rank.basis !== cityBars.basis || rank.phoneHead.value !== cityBars.phoneHead.value) reds.push(`hood rank ${city}: the rows or the words differ from the city district builder's over the same rows`);
      const clipped = districts.filter((d) => d.rent_clipped).map((d) => d.name);
      if (JSON.stringify(rank.clipped) !== JSON.stringify(clipped)) reds.push(`hood rank ${city}: the clipped list is ${rank.clipped.join(", ")}, the rows say ${clipped.join(", ")}`);
      if ((clipped.length > 0) !== (rank.clipLine != null)) reds.push(`hood rank ${city}: a clip line ${rank.clipLine ? "with nothing clipped" : "missing with a district on the bound"}`);
      for (const n of clipped) if (!rank.clipLine!.includes(n)) reds.push(`hood rank ${city}: the clip line does not name ${n}`);
      if (rank.clipLine && wordsOf(rank.clipLine) > 14) reds.push(`hood rank ${city}: the clip line runs ${wordsOf(rank.clipLine)} words`);
      ban(`hood rank ${city}`, [rank.basis, rank.phoneHead.name, rank.phoneHead.value, ...(rank.clipLine ? [rank.clipLine] : [])]);
    }
    /* THE PREMIUM, once per city. */
    const premium = buildHoodPremium(city);
    const held = districts.filter((d) => d.tourism != null);
    if (!premium) { if (held.length >= MARK_LIST_FLOOR) reds.push(`hood premium ${city}: builds nothing with ${held.length} districts holding a figure`); }
    else {
      if (premium.rows.length !== held.length || premium.rows.length < MARK_LIST_FLOOR) reds.push(`hood premium ${city}: ${premium.rows.length} rows against ${held.length} districts holding a figure`);
      for (let i = 1; i < premium.rows.length; i++) if (premium.rows[i].value > premium.rows[i - 1].value) reds.push(`hood premium ${city}: the rows are not highest first at ${premium.rows[i].name}`);
      const sorted = held.map((d) => d.tourism!.value).sort((a, b) => a - b);
      if (premium.headline.value !== sorted[Math.floor((sorted.length - 1) / 2)]) reds.push(`hood premium ${city}: the headline ${premium.headline.value} is not the lower median`);
      if (premium.withheld !== districts.length - held.length) reds.push(`hood premium ${city}: withheld ${premium.withheld} against ${districts.length - held.length} rows without a figure`);
      if ((premium.withheld > 0) !== (premium.withheldLine != null)) reds.push(`hood premium ${city}: the withheld count and its line disagree`);
      if (wordsOf(premium.head.value) > 3 || wordsOf(premium.head.name) > 3) reds.push(`hood premium ${city}: a head over three words ("${premium.head.name}", "${premium.head.value}")`);
      if (wordsOf(premium.kicker) > 4) reds.push(`hood premium ${city}: the kicker runs over four words ("${premium.kicker}")`);
      if (wordsOf(premium.basis) > 14) reds.push(`hood premium ${city}: the basis runs ${wordsOf(premium.basis)} words`);
      if (premium.year != null && !premium.basis.includes(String(premium.year))) reds.push(`hood premium ${city}: the basis does not say the year ${premium.year}`);
      for (const r of premium.rows) {
        const page = districtPageTarget(city, r.key);
        if (!page || r.href !== page.href) reds.push(`hood premium ${city}: the row ${r.name} points at ${r.href ?? "nothing"}, not the district page`);
        if (r.href && !resolves(r.href)) reds.push(`hood premium ${city}: the row ${r.name}'s link is not a route (${r.href})`);
        if (typeof premium.fmt(r.value) !== "string" || !/^\d+(\.\d)?$/.test(premium.fmt(r.value))) reds.push(`hood premium ${city}: the figure prints as "${premium.fmt(r.value)}"`);
      }
      const decimals = new Set(premium.rows.map((r) => (premium.fmt(r.value).split(".")[1] ?? "").length));
      if (decimals.size > 1) reds.push(`hood premium ${city}: the column mixes decimal counts`);
      ban(`hood premium ${city}`, [premium.kicker, premium.basis, premium.head.name, premium.head.value, premium.headline.label, ...(premium.withheldLine ? [premium.withheldLine] : [])]);
    }
    /* THE HUB AND EVERY DISTRICT PAGE: the take, the table, the notes, the doors. */
    for (const focus of [null, ...districts.map((d) => d.slug)]) {
      pages++;
      const where = `hood ${city}${focus ? `:${focus}` : ""}`;
      const take = buildHoodTake(city, focus);
      if (!take) { reds.push(`${where}: the take builds nothing`); continue; }
      takes++;
      const own = focus && focus !== cheapest.slug ? districts.find((d) => d.slug === focus)! : null;
      const expect = own ? againstCheapest(own, cheapest) : againstCheapest(dearest, cheapest);
      if (take.answer.value !== rentMult(expect)) reds.push(`${where}: the 40 prints ${take.answer.value}, expected ${rentMult(expect)}`);
      if (take.answer.value === rentMult(1)) reds.push(`${where}: the 40 is one times itself`);
      if ((take.figure === "spread") !== !own) reds.push(`${where}: the figure is ${take.figure} where ${own ? "own" : "spread"} was expected`);
      if (take.figure === "spread") spreads++; else owns++;
      if (take.answer.confidence !== "modeled") reds.push(`${where}: the answer is not marked modelled`);
      if (wordsOf(take.answer.basis) > 14) reds.push(`${where}: the answer's basis runs ${wordsOf(take.answer.basis)} words`);
      const cellValues = take.cells.map((c) => String(c.value));
      if (cellValues.includes(take.answer.value)) reds.push(`${where}: a companion repeats the 40 (${take.answer.value})`);
      if (new Set(cellValues).size !== cellValues.length) reds.push(`${where}: two companions print one figure`);
      if (take.cells.length < 1 || take.cells.length > 3) reds.push(`${where}: ${take.cells.length} companions`);
      if (!take.cells.some((c) => c.key === "count" && c.value === String(districts.length))) reds.push(`${where}: the count cell does not print ${districts.length}`);
      for (const c of take.cells) {
        const own = c.label.replace(cheapest.name, "").replace(dearest.name, "");
        if (wordsOf(own) > 4) reds.push(`${where}: the cell label "${c.label}" runs over four words past the district's name`);
      }
      if (focus ? take.crumb.length !== 2 || take.crumb[0] !== hoodCityName(city) : take.crumb.length !== 0) reds.push(`${where}: the crumb is [${take.crumb.join(", ")}]`);
      if (focus && take.name === hoodCityName(city)) reds.push(`${where}: a district page's h1 is the city`);
      const year = districts.map((d) => d.tourism?.year).find((y) => y != null);
      if (year != null && !take.foot.text.includes(String(year))) reds.push(`${where}: the foot does not say the year ${year}`);
      ban(where, [take.subtitle, take.answer.label, take.answer.basis, take.foot.text, ...take.cells.map((c) => c.label)]);
      /* THE TABLE. */
      const compare = buildHoodCompare(city, focus);
      if (!compare) { reds.push(`${where}: the table builds nothing`); continue; }
      const keys = compare.columns.map((c) => c.key);
      if (keys.length !== 2 || keys[0] !== "rent" || keys[1] !== "visitors") reds.push(`${where}: the table's columns are ${keys.join(", ")}, not rent and visitors`);
      for (const k of keys) if (/character|walk|price|tier/i.test(k)) reds.push(`${where}: a column keyed "${k}", a word where a figure goes (clause 19, item 66)`);
      for (const c of compare.columns) if (/character|walk|price|tier/i.test(c.head)) reds.push(`${where}: a column head "${c.head}", a word where a figure goes`);
      if (compare.columns[0]?.unit !== "mult" || compare.columns[0]?.best !== "min" || compare.columns[1]?.unit !== "per" || compare.columns[1]?.best !== "max") reds.push(`${where}: the columns' units or directions are off`);
      if (!compare.columns[0]?.head.includes(cheapest.name)) reds.push(`${where}: the rent head does not name ${cheapest.name}`);
      if (compare.rows.length !== districts.length) reds.push(`${where}: ${compare.rows.length} rows against ${districts.length} districts`);
      for (const r of compare.rows) {
        if ((r as { href?: string }).href) reds.push(`${where}: the row ${r.name} carries a door (M23)`);
        for (const c of compare.columns) { const v = r.values[c.key]; if (v != null && typeof v !== "number") reds.push(`${where}: the cell ${r.name}/${c.key} holds a ${typeof v}`); }
        if (r.values.rent == null) reds.push(`${where}: the row ${r.name} holds no rent figure`);
      }
      const homes = compare.rows.filter((r) => r.home).map((r) => r.key);
      if (JSON.stringify(homes) !== JSON.stringify(focus ? [focus] : [])) reds.push(`${where}: the home rows are [${homes.join(", ")}]`);
      if (wordsOf(compare.caveat) > 14) reds.push(`${where}: the caveat runs ${wordsOf(compare.caveat)} words`);
      if ((compare.rows.some((r) => r.values.visitors == null)) !== (compare.note != null)) reds.push(`${where}: the dash note and the dashed cells disagree`);
      ban(where, [compare.entityHead, compare.caveat, ...compare.columns.map((c) => c.head), ...(compare.note ? [compare.note] : [])]);
      /* THE NOTES. */
      const character = buildHoodCharacter(city, focus);
      const drawn = focus ? districts.find((d) => d.slug === focus)! : cheapest;
      if (!character) { if (drawn.paragraph || drawn.skew || drawn.priceTier) reds.push(`${where}: the notes build nothing on a district holding authored rows`); }
      else {
        if (character.district.slug !== drawn.slug) reds.push(`${where}: the notes draw ${character.district.slug}, not ${drawn.slug}`);
        if (character.rows.length < 1 || character.rows.length > 4) reds.push(`${where}: ${character.rows.length} notes`);
        const first = character.rows.find((r) => r.key === "sentence");
        if (drawn.paragraph && !first) reds.push(`${where}: no sentence row on a district holding a paragraph`);
        if (first && drawn.paragraph) {
          const line = openingLine(drawn.paragraph);
          if (line && first.fact !== line.text) reds.push(`${where}: the sentence row prints "${first.fact}", not the note's opening`);
          if (line && first.fact.length > CHARACTER_FACT_CHARS_CAP) reds.push(`${where}: the sentence row runs ${first.fact.length} characters, over the four-line cap`);
          if (line && !(drawn.paragraph.startsWith(first.fact) || drawn.paragraph.startsWith(first.fact.slice(0, -1)))) reds.push(`${where}: the sentence row is not a verbatim prefix of the paragraph`);
          if (line && !/[.!?]$/.test(first.fact)) reds.push(`${where}: the sentence row does not close on a full stop`);
          if (!line && first.fact !== COPY.hoodCharacter.sentenceWithheld) reds.push(`${where}: the sentence row is neither the opening nor the stated line`);
        }
        if (character.rows.some((r) => r.key === "description") && drawn.paragraph) reds.push(`${where}: the description row draws beside a paragraph (a second telling)`);
        for (const r of character.rows) if (wordsOf(r.label) > LABEL_WORDS_CAP) reds.push(`${where}: the note label "${r.label}" runs over ${LABEL_WORDS_CAP} words`);
        if (focus ? character.kicker.includes(drawn.name) : !character.kicker.includes(drawn.name)) reds.push(`${where}: the kicker ${focus ? "names the district under its own h1" : "does not name the district"} ("${character.kicker}")`);
        if (wordsOf(character.kicker.replace(drawn.name, "")) > 4) reds.push(`${where}: the kicker runs over four words past the name ("${character.kicker}")`);
        if (!character.foot.includes(countWord(districts.length - 1))) reds.push(`${where}: the foot does not count the other districts ("${character.foot}")`);
        ban(where, [character.kicker, character.foot, ...character.rows.flatMap((r) => [r.label, r.fact])]);
      }
      /* THE DOORS. */
      const doors = buildHoodCloseDoors(city, focus);
      checkDoors(where, doors, "hood close");
      const expectKeys = focus ? ["districts", "city", "compare"] : ["city", "trade", "compare"];
      if (JSON.stringify(doors.map((d) => d.key)) !== JSON.stringify(expectKeys)) reds.push(`${where}: the doors are ${doors.map((d) => d.key).join(", ")}, expected ${expectKeys.join(", ")}`);
      const trade = doors.find((d) => d.key === "trade");
      if (trade && trade.href !== `/gb/${city}/${HOOD_BENCHMARK_TRADE.slug}` && !trade.href.endsWith(`/${city}/${HOOD_BENCHMARK_TRADE.slug}`)) reds.push(`${where}: the trade door goes to ${trade.href}`);
      if (doors[doors.length - 1]?.kind !== "pill") reds.push(`${where}: the pill is not last`);
    }
  }
  /* THE SEAT'S STRINGS, once. */
  const seat = COPY.blocked.hoodWorks;
  if (wordsOf(seat.line) > SEAT_LINE_WORDS_CAP) reds.push(`hood works: the seat's line runs ${wordsOf(seat.line)} words, over ${SEAT_LINE_WORDS_CAP}`);
  if (!seat.line.startsWith("Not gathered yet:")) reds.push(`hood works: the seat's line is not in the site's idiom`);
  if (!/DATA-REQUIREMENTS item \d+/.test(seat.foot)) reds.push(`hood works: the seat's foot names no requirement`);
  if (wordsOf(seat.kicker) > 4) reds.push(`hood works: the kicker runs over four words`);
  ban("hood works", [seat.kicker, seat.line, seat.foot]);
  /* A DISTRICT THE SCHEME DOES NOT HOLD builds nothing anywhere. */
  if (buildHoodTake("london", "mayfair") || buildHoodCompare("london", "mayfair") || buildHoodCharacter("london", "mayfair") || buildHoodCloseDoors("london", "mayfair").length) reds.push("hood: a district the scheme does not hold builds a card");
  if (buildHoodTake("paris") || buildHoodRank("paris") || buildHoodPremium("paris") || buildHoodCompare("paris") || buildHoodCloseDoors("paris").length) reds.push("hood: a city the gate does not admit builds a card");
  ban("hood chapters", [COPY.hoodChapters.rent, COPY.hoodChapters.works]);
  console.log(`hood: ${cities.length} admitted city(ies), ${pages} pages (${takes} takes: ${spreads} the spread, ${owns} a district's own rent), the rank, the visitor list, the table, the notes and the doors held on every one`);
}

console.log(`archetype copy: the district ranking's laws held on its fixture; ${cityTermini} city termini; ${rendered} countries render the answer card, ${noAnswer} of them with no regime row (the state word); ${peerTables} peer tables; ${barCards} margin cards with two or more credible rows; ${noteLists} note lists; ${termini} termini against ${ROUTES.length} routes; ${payCards} pay cards, ${payWithheld} withheld; ${howtos} how-to pages; ${reds.length} red(s)`);
for (const r of reds.slice(0, 40)) console.log("  " + r);
if (reds.length) process.exit(1);
