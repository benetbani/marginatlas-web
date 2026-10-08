/**
 * EVERY UK CITY'S PAGE PRINTS A SOURCED FIGURE OR A MARKED ONE (masterplan step 03, 2026-10-05, for London; plan 2026-10-08,
 * uk:cities-sourced-or-marked, for the six others). The UK pages are the Pro pages (his ruling 27), so a figure on them is an
 * official one, says it is an estimate in its card's one line, or is withheld. London is held to a register region (Greater
 * London, his ruling of 2026-10-04): its shop rent is the valuation's, its pay tenths the survey's, its hand-anchored cost of
 * living and its engine district rents gone or marked. Manchester, Birmingham, Leeds, Glasgow, Edinburgh and Bristol are held to
 * no register region: they keep their shards' and the city list's figures, each card's one line saying they are estimates, and
 * their official figures (the survey's pay, the UK's tenths, the counted visitors, the UK's born-abroad share) keep their lines.
 * cityHeldToSources picks the lines; cityRegisterPlace picks which figures are read.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/uk_city_sources.test.ts
 */
import { buildCityHeroBoard } from "../../src/lib/spine/city_hero_board";
import { buildCityPeerTable } from "../../src/lib/spine/peer_rows";
import { buildPremisesBento } from "../../src/lib/spine/premises_bento_rows";
import { buildCityEarningsStrip } from "../../src/lib/spine/range_rows";
import { buildCityGates } from "../../src/lib/spine/city_gates_rows";
import { buildCityDemand, buildCityLiving, buildCityRunway, buildCitySeason } from "../../src/lib/spine/fact_rows";
import { buildCityCalendar } from "../../src/lib/spine/city_calendar_rows";
import { buildCityCrew } from "../../src/lib/spine/city_crew_rows";
import { buildCityTexture } from "../../src/lib/spine/city_texture_rows";
import { buildCityDistrictBars } from "../../src/lib/spine/district_rows";
import { convertToUsd } from "../../src/lib/finance/fx";
import { COPY } from "../../src/lib/spine/copy";
import { red, redSummary } from "../../scripts/lib/red";
import premisesJson from "../../data/uk/registers/premises.json";
import { readFileSync } from "node:fs";
import { buildCharacterTables, buildCityPeopleTable } from "../../src/lib/spine/character_rows";
import { UK_CITY_SLUGS } from "../../src/lib/uk/registers/register_city";
import { buildCityMarket } from "../../src/lib/spine/city_market_rows";
import { cityPeerListRow } from "../../src/lib/spine/city_peer_list";
import { getCityPeerSet } from "../../src/lib/cities/comparable_cities";
import { cityTypicalIncome } from "../../src/lib/spine/city_income";

const RULE = "uk-city-sources";
const FILE = "src/lib/spine";
const REMEDY = "on a UK city's page print an official figure, say in the card's one line that the figure is an estimate (cityHeldToSources picks the line), or withhold it";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

/* Item 22: the hero holds no cost of living; the permit row says what it is and wears the estimate mark. */
const hero = buildCityHeroBoard("london");
check("London's hero prints no cost of living (a hand anchor no source holds)", !!hero && !hero.rows.some((r) => r.key === "living"));
const permits = hero?.rows.find((r) => r.key === "permits");
check(`London's permit row says what it is: "${permits?.label}"`, permits?.label === "Longest permit wait" && permits?.confidence === "modeled");
check("the level line names no cost of living there", !!hero && !/cost of living/i.test(hero.levelBasis ?? ""));
/* Elsewhere the hero is unchanged. */
const paris = buildCityHeroBoard("paris");
check("Paris keeps its cost of living row (a page that says its figures are estimates)", !!paris && paris.rows.some((r) => r.key === "living"));

/* Item 22: the peers' cost of living column leaves London's page. */
const peers = buildCityPeerTable({ meta: { iso2: "GB", slug: "london" }, peers: { list: [
  { name: "London", slug: "london", iso2: "GB", home: true, rent_index: 75, median_income_usd: 61572, visitors_m: 20.9 },
  { name: "Paris", slug: "paris", iso2: "FR", rent_index: 74, median_income_usd: 44000, visitors_m: 19 },
  { name: "Madrid", slug: "madrid", iso2: "ES", rent_index: 50, median_income_usd: 30000, visitors_m: 7.5 },
] } });
check(`London's peers print a dash for every city's cost of living, said once (${peers?.columns.map((c) => c.key).join(", ")})`, !!peers && peers.columns.some((c) => c.key === "living") && peers.rows.every((r) => r.values.living == null) && peers.caveat === COPY.cityPeers.caveatNoLiving);
const parisPeers = buildCityPeerTable({ meta: { iso2: "FR", slug: "paris" }, peers: { list: [
  { name: "Paris", slug: "paris", iso2: "FR", home: true, rent_index: 74, median_income_usd: 44000 },
  { name: "London", slug: "london", iso2: "GB", rent_index: 75, median_income_usd: 61572 },
] } });
check("Paris's peers keep the figures", !!parisPeers && parisPeers.rows.some((r) => typeof r.values.living === "number") && parisPeers.caveat === COPY.cityPeers.caveat);

/* Item 23: the tenths are the survey's, the country's (the card says so), at the site's one rate. */
const earnings = buildCityEarningsStrip("london");
const p10 = earnings?.figures.p10, p90 = earnings?.figures.p90;
const want10 = Math.round(convertToUsd("GBP", 23990) ?? 0), want90 = Math.round(convertToUsd("GBP", 76903) ?? 0);
check(`London's bottom tenth is the survey's 23,990 pounds at the site's rate (${p10} against ${want10})`, p10 != null && Math.abs(p10 - want10) <= 2);
check(`London's top tenth is the survey's 76,903 pounds at the site's rate (${p90} against ${want90})`, p90 != null && Math.abs(p90 - want90) <= 2);
const deciles = JSON.parse(readFileSync("data/economics/wage_deciles_v1.json", "utf8")).countries.GB;
check("the UK's decile record is held, from the survey", deciles?._meta?.confidence === "held" && /survey of hours and earnings/i.test(deciles?._meta?.source ?? ""));

/* Item 24: the premises. */
const prem = buildPremisesBento("london");
const shops = (premisesJson as any).rows.E12000007.categories.Shops.rv_per_m2 as number;
const rentWant = Math.round(convertToUsd("GBP", shops) ?? 0);
check(`London's rent cell is the valuation of Greater London's shops (${prem && "value" in prem.rent ? prem.rent.value : "withheld"} against ${rentWant})`, !!prem && "value" in prem.rent && prem.rent.value === rentWant && prem.rentKicker === "Shop rent");
check("the rent carries no details held with no source", !!prem && "figure" in prem.rent && !prem.rent.detail);
check("the deposit is withheld (the city's 6 months and the country's 3 disagree, neither sourced)", !!prem && "withheld" in prem.deposit);
check("the empty shops are withheld (no source)", !!prem && "withheld" in prem.empty);
check("the fit-out says it and its rent-free months are estimates", !!prem && "figure" in prem.fitOut && /estimate/i.test(prem.fitOut.basis) && !!prem.fitOut.second);
const engWant = Math.round(convertToUsd("GBP", (premisesJson as any).rows.E92000001.categories.Shops.rv_per_m2) ?? 0);
check(`the rent's second reading is England's shops on the same valuation (${prem && "figure" in prem.rent ? prem.rent.second?.figure : "none"})`, !!prem && "figure" in prem.rent && prem.rent.second?.figure === `$${engWant}` && prem.rent.second?.words === COPY.premisesBento.rentEngland);
const parisPrem = buildPremisesBento("paris");
check("Paris keeps its prime rent cell", !!parisPrem && !parisPrem.rentKicker && "figure" in parisPrem.rent);

/* Item 24: the lines that say "estimate". */
check("the permits card says its fees are estimates but food registration", buildCityGates("london")?.basis === COPY.cityGates.basisSourcedOnly);
check("the living card says its prices are estimates", buildCityLiving("london")?.basis === COPY.cityLiving.basisSourcedOnly);
check("the runway says its rent is an estimate", buildCityRunway("london")?.basis === COPY.cityRunway.basisSourcedOnly);
check("the crew card says its pay is estimated", buildCityCrew("london")?.basis === COPY.cityCrew.basisSourcedOnly);
check("the texture card says its visit count is an estimate", buildCityTexture("london")?.basis === COPY.cityTexture.basisSourcedOnly);
check("Paris's lines are unchanged", buildCityGates("paris")?.basis === COPY.cityGates.basis && buildCityLiving("paris")?.basis === COPY.cityLiving.basis);

/* Item 19: the district rents are the engine's multipliers; London's card says they are estimates (MODEL's block floor keeps
   the card; the valuation holds rent by borough and only the City of London is a whole one). Paris has no districts card. */
const bars = buildCityDistrictBars({ meta: { iso2: "GB", slug: "london" }, where_to_trade: { list: [{ name: "South London", slug: "south-london", rent_mult: 1 }, { name: "West End", slug: "west-end", rent_mult: 2.5 }] } });
check(`London's district card says its rents are estimates ("${bars?.basis}")`, !!bars && bars.basis === COPY.cityDistricts.basisEstimate.replace("{district}", "South London"));
const hubBars = buildCityDistrictBars({ meta: { slug: "london" }, where_to_trade: { list: [{ name: "South London", slug: "south-london", rent_mult: 1 }, { name: "West End", slug: "west-end", rent_mult: 2.5 }] } });
check("the hub, over the same rows without a country, says the same", !!hubBars && hubBars.basis === bars?.basis);

/* THE SIX OTHER UK CITIES (plan 2026-10-08, uk:cities-sourced-or-marked): held to sources and to no register region, each keeps its
   shard's figures and says in each card's one line that they are estimates; nothing with an honest estimate line is withheld. */
const SIX = ["manchester", "birmingham", "leeds", "glasgow", "edinburgh", "bristol"] as const;
const PB = COPY.premisesBento.basis;
for (const slug of SIX) {
  const p = buildPremisesBento(slug);
  check(`${slug}'s premises keep all four cells (${p?.withheld} withheld)`, !!p && p.withheld === 0);
  check(`${slug}'s prime rent and its details say they are estimates ("${p && "figure" in p.rent ? p.rent.basis : "none"}")`, !!p && !p.rentKicker && "figure" in p.rent && p.rent.basis === `${PB.rentEstimate}.` && (p.rent.detail?.rows.length ?? 0) >= 2);
  check(`${slug}'s deposit and its lease say they are estimates`, !!p && "figure" in p.deposit && p.deposit.basis === `${PB.depositEstimate}.` && !!p.deposit.second);
  check(`${slug}'s empty shops say they are an estimate`, !!p && "part" in p.empty && p.empty.basis === `${PB.emptyEstimate}.`);
  check(`${slug}'s fit-out and its rent-free months say they are estimates (London's line)`, !!p && "figure" in p.fitOut && p.fitOut.basis === `${PB.fitOutEstimate}.` && !!p.fitOut.second);
}
check("Paris's premises lines are unchanged", !!parisPrem && "figure" in parisPrem.rent && parisPrem.rent.basis === `${PB.rent}.`);

/* LIVING AND THE RUNWAY (plan 2026-10-08): the shard's prices and one-bed rent, London's lines word for word. */
for (const slug of SIX) {
  check(`${slug}'s living card says its prices are estimates`, buildCityLiving(slug)?.basis === COPY.cityLiving.basisSourcedOnly);
  check(`${slug}'s runway says its rent is an estimate`, buildCityRunway(slug)?.basis === COPY.cityRunway.basisSourcedOnly);
}

/* THE CREW AND THE EARNINGS (plan 2026-10-08): the crew's pay and its usual week are the shard's, and the one line says both are
   estimates, on London too (its week printed unmarked until this plan). The earnings strip is official on all seven: the survey's
   tenths for the UK and its typical pay for the city; it keeps its line. */
check(`London's crew line names the week too ("${buildCityCrew("london")?.basis}")`, /pay and hours/.test(buildCityCrew("london")?.basis ?? ""));
for (const slug of SIX) {
  const crew = buildCityCrew(slug);
  check(`${slug}'s crew says its pay and its week are estimates`, !!crew && crew.basis === COPY.cityCrew.basisSourcedOnly && !!crew.week);
  const strip = buildCityEarningsStrip(slug);
  check(`${slug}'s tenths are the survey's, the UK's (${strip?.figures.p10}, ${strip?.figures.p90})`, strip?.figures.p10 === p10 && strip?.figures.p90 === p90 && strip?.basis === COPY.cityCustomers.basis);
  check(`${slug}'s typical pay is the one builder's, the survey's for the city`, strip?.figures.typical === cityTypicalIncome(slug)?.value);
}
check("Paris's crew line is unchanged", buildCityCrew("paris")?.basis === COPY.cityCrew.basis);

/* THE PERMITS (plan 2026-10-08): London's line word for word; every UK city's food registration is the one free gate it names. */
for (const slug of SIX) {
  const g = buildCityGates(slug);
  check(`${slug}'s permits say their fees are estimates but food registration`, g?.basis === COPY.cityGates.basisSourcedOnly);
  check(`${slug}'s food registration is a required gate at no fee, as the line says`, !!g && g.gates.some((x) => /food/i.test(x.name) && x.required && x.cost === 0));
}

/* THE BOARD (plan 2026-10-08): the six keep their four rows, each an estimate, the column's line saying so first; the answer is the
   earnings survey's typical pay for the city (by residence, April 2025, research note 2026-09-25 row 19) at the site's one rate,
   and keeps its line. London's permit wait, the one estimate on its board, is said in its line: the board draws no tag. */
const SURVEY_GBP: Record<(typeof SIX)[number], number> = { manchester: 36278, birmingham: 35989, leeds: 36716, glasgow: 38125, edinburgh: 43169, bristol: 39509 };
for (const slug of SIX) {
  const b = buildCityHeroBoard(slug);
  const keys = (b?.rows ?? []).map((r) => r.key).join(",");
  check(`${slug}'s board keeps its four rows (${keys})`, keys === "permits,density,gdp,living");
  check(`${slug}'s rows are each an estimate`, !!b && b.rows.every((r) => r.confidence === "modeled"));
  check(`${slug}'s permit row says what it is ("${b?.rows.find((r) => r.key === "permits")?.label}")`, b?.rows.find((r) => r.key === "permits")?.label === COPY.cityHeroBoard.rows.permitsLongest);
  check(`${slug}'s column says its figures are estimates ("${b?.levelBasis}")`, b?.levelBasis === COPY.cityHeroBoard.levelBasisEstimates);
  const want = Math.round(convertToUsd("GBP", SURVEY_GBP[slug]) ?? 0);
  const typical = cityTypicalIncome(slug)?.value ?? 0;
  check(`${slug}'s answer is the survey's pay, ${SURVEY_GBP[slug]} pounds at the site's rate (${typical} against ${want})`, Math.abs(typical - want) <= 12 && b?.answerBasis === COPY.cityHero.answerBasis);
}
check(`London's line says its permit wait is an estimate ("${hero?.levelBasis}")`, hero?.levelBasis === COPY.cityHeroBoard.levelBasisNoLiving && /permit wait is an estimate/i.test(hero?.levelBasis ?? ""));
check("Paris's board is unchanged", paris?.levelBasis === COPY.cityHeroBoard.levelBasis && paris?.rows.find((r) => r.key === "permits")?.label === COPY.cityHeroBoard.rows.permits);

/* THE TEXTURE (plan 2026-10-08): the count of official visits is the shard's; London's line word for word. */
for (const slug of SIX) check(`${slug}'s texture card says its visit count is an estimate`, buildCityTexture(slug)?.basis === COPY.cityTexture.basisSourcedOnly);
check("Paris's texture line is unchanged", buildCityTexture("paris")?.basis === COPY.cityTexture.basis);

/* THE PEERS (plan 2026-10-08): the six keep every figure, the cost of living included, and the caveat says once which are
   estimates: the cost of living on every row and the pay of the cities abroad. A UK row's pay is the survey's (the answer's own),
   the visitors counted. The rows are built as the city adapter builds them: city_peer_list.ts over the pure peer set (the
   adapter itself opens a database client a chain test cannot). */
const peerSeedOf = (slug: string) => {
  const home = cityPeerListRow(slug, true);
  const rest = getCityPeerSet(slug, 6).slice(0, 6).map((p) => { const r = cityPeerListRow(p.slug, false, p.name); return r ? { ...r, iso2: p.iso2 } : null; }).filter((r) => r !== null);
  return { meta: { iso2: "GB", slug }, peers: { list: [home, ...rest] } };
};
for (const slug of SIX) {
  const t = buildCityPeerTable(peerSeedOf(slug));
  const visitors = !!t && t.columns.some((c) => c.key === "visitors");
  check(`${slug}'s peers keep every city's cost of living (${t?.rows.map((r) => r.values.living).join(", ")})`, !!t && t.rows.every((r) => typeof r.values.living === "number") && t.columns[0]?.key === "living");
  check(`${slug}'s peers say which figures are estimates ("${t?.caveat}")`, !!t && t.caveat === (visitors ? COPY.cityPeers.caveatEstimates : COPY.cityPeers.caveatEstimatesNoVisitors));
  check(`${slug}'s UK rows print the survey's pay, the answer's own`, !!t && t.rows.filter((r) => r.iso2 === "GB").every((r) => r.values.income === cityTypicalIncome(r.key ?? "")?.value));
}

/* WHO IS ALREADY TRADING (plan 2026-10-08): the shard's densities, count and plus, the one line saying they are estimates; the line
   is the builder's in both forms, and the card prints it as handed. */
for (const slug of SIX) {
  const m = buildCityMarket(slug);
  check(`${slug}'s market keeps the shard's densities, its count and its plus`, m?.form === "density" && !!m.focal && !!m.detail);
  check(`${slug}'s market says its figures are estimates ("${m?.basis}")`, m?.basis === COPY.cityMarket.basisWithFocalEstimate);
}
const parisMarket = buildCityMarket("paris");
check(`Paris's market line is unchanged ("${parisMarket?.basis}")`, parisMarket?.basis === (parisMarket?.focal ? COPY.cityMarket.basisWithFocal : COPY.cityMarket.basis));
check("London's market keeps the register's line", buildCityMarket("london")?.basis === COPY.cityMarket.register.basis.replace("{city}", "London"));
const openingSrc = readFileSync("src/components/spine/city/opening.tsx", "utf8");
check("the market card prints the line its builder hands it", !/basisWithFocal/.test(openingSrc) && /basis=\{`\$\{market\.basis\}/.test(openingSrc));

/* WHAT RESIDENTS SPEND, WHO THE FOOTFALL IS, WHEN THE CITY SPENDS (plan 2026-10-08): the shard's modelled figures, each card's one
   line saying it is an estimate. London draws none of the three (its spend and calendar are placeholders, its split unheld). */
for (const slug of SIX) {
  const d = buildCityDemand(slug);
  check(`${slug}'s spend says it is an estimate ("${d?.basis}")`, !!d?.figure && d.basis === COPY.cityDemand.basisEstimate);
  const s = buildCitySeason(slug);
  check(`${slug}'s split says it is an estimate ("${s?.foot}")`, (s?.cells.length ?? 0) === 2 && s?.foot === COPY.citySeason.footEstimate);
  const k = buildCityCalendar(slug);
  check(`${slug}'s calendar says it is an estimate ("${k?.basis}")`, !!k && k.basis === COPY.cityCalendar.basisEstimate);
}
check("Paris's three lines are unchanged", buildCityDemand("paris")?.basis === COPY.cityDemand.basis && buildCitySeason("paris")?.foot === null && buildCityCalendar("paris")?.basis === COPY.cityCalendar.basis);
check("London draws none of the three", buildCityDemand("london")?.figure === null && (buildCitySeason("london")?.cells.length ?? 0) === 0 && buildCityCalendar("london") === null);

/* THE DISTRICT RENTS (plan 2026-10-08): the engine's multipliers on any UK city say they are estimates; a lettered fixture, since no
   other UK city draws the card today. A city outside the UK keeps its line. */
const ukBars = buildCityDistrictBars({ meta: { iso2: "GB", slug: "manchester" }, where_to_trade: { list: [{ name: "B", slug: "b", rent_mult: 1.8 }, { name: "A", slug: "a", rent_mult: 1 }] } });
check(`a UK city's district card says its rents are estimates ("${ukBars?.basis}")`, ukBars?.basis === COPY.cityDistricts.basisEstimate.replace("{district}", "A"));
const deBars = buildCityDistrictBars({ meta: { iso2: "DE", slug: "berlin" }, where_to_trade: { list: [{ name: "B", slug: "b", rent_mult: 1.8 }, { name: "A", slug: "a", rent_mult: 1 }] } });
check("a city outside the UK keeps its line", !!deBars && !/estimate/i.test(deBars.basis));

/* EVERY CARD'S ONE LINE ON THE SIX, IN ONE LIST (the audit of plan 2026-10-08): a card printing the shard's or the city list's
   figures says "estimate" in its line; the cards whose figures are official (the answer and the earnings strip, the survey's pay;
   the people table's born-abroad share, the UK page's own) keep theirs. A card added to the city page joins one of the two. */
check(`the gate holds every UK city with a page (${UK_CITY_SLUGS.join(", ")})`, [...SIX, "london"].sort().join(",") === UK_CITY_SLUGS.join(","));
for (const slug of SIX) {
  const board = buildCityHeroBoard(slug);
  const cells = buildPremisesBento(slug);
  const marked: Array<[string, string | null | undefined]> = [
    ["the board's column", board?.levelBasis],
    ["the prime rent", cells && "figure" in cells.rent ? cells.rent.basis : null],
    ["the deposit", cells && "figure" in cells.deposit ? cells.deposit.basis : null],
    ["the empty shops", cells && "part" in cells.empty ? cells.empty.basis : null],
    ["the fit-out", cells && "figure" in cells.fitOut ? cells.fitOut.basis : null],
    ["the permits", buildCityGates(slug)?.basis],
    ["who is trading", buildCityMarket(slug)?.basis],
    ["living", buildCityLiving(slug)?.basis],
    ["the runway", buildCityRunway(slug)?.basis],
    ["the spend", buildCityDemand(slug)?.basis],
    ["the split", buildCitySeason(slug)?.foot],
    ["the crew", buildCityCrew(slug)?.basis],
    ["the texture", buildCityTexture(slug)?.basis],
    ["the calendar", buildCityCalendar(slug)?.basis],
    ["the peers", buildCityPeerTable(peerSeedOf(slug))?.caveat],
  ];
  for (const [card, line] of marked) check(`${slug}: ${card} says its figures are estimates ("${line ?? "no line"}")`, typeof line === "string" && /\bestimate/i.test(line));
  check(`${slug}: the answer is official and keeps its line`, board?.answerBasis === COPY.cityHero.answerBasis);
  check(`${slug}: the earnings strip is official and keeps its line`, buildCityEarningsStrip(slug)?.basis === COPY.cityCustomers.basis);
  const bornAbroad = buildCityPeopleTable(slug)?.foot?.value;
  check(`${slug}: the born-abroad share is the UK page's own (${bornAbroad})`, !!bornAbroad && bornAbroad === buildCharacterTables("GB").people?.foot?.value);
}
/* The views print the lines the builders hand them (a builder's line a view ignores is a line no reader meets). */
const cityViewSrc = readFileSync("src/components/spine/city/city-view.tsx", "utf8");
check("the split card prints its foot", /\{season\.foot \? <p/.test(cityViewSrc));
check("the spend card prints its basis", /basis=\{demand\.basis \?\? undefined\}/.test(cityViewSrc));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/uk_city_sources: all pass");
