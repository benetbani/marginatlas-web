/**
 * LONDON'S CITY PAGE PRINTS A SOURCED FIGURE OR A MARKED ONE (masterplan step 03, 2026-10-05; the labels audit of 2026-10-02,
 * items 19, 22, 23 and 24). London is held to a register region (Greater London, his ruling of 2026-10-04), so its page is a UK
 * page Pro will sell: the engine's district multipliers, the hand-anchored cost of living, the transported pay tenths and the
 * premises figures held with no source either leave, take an official figure, or say they are estimates.
 *
 * Run: npx tsx tests/spine/london_city_sources.test.ts
 */
import { buildCityHeroBoard } from "../../src/lib/spine/city_hero_board";
import { buildCityPeerTable } from "../../src/lib/spine/peer_rows";
import { buildPremisesBento } from "../../src/lib/spine/premises_bento_rows";
import { buildCityEarningsStrip } from "../../src/lib/spine/range_rows";
import { buildCityGates } from "../../src/lib/spine/city_gates_rows";
import { buildCityLiving, buildCityRunway } from "../../src/lib/spine/fact_rows";
import { buildCityCrew } from "../../src/lib/spine/city_crew_rows";
import { buildCityTexture } from "../../src/lib/spine/city_texture_rows";
import { buildCityDistrictBars } from "../../src/lib/spine/district_rows";
import { convertToUsd } from "../../src/lib/finance/fx";
import { COPY } from "../../src/lib/spine/copy";
import { red, redSummary } from "../../scripts/lib/red";
import premisesJson from "../../data/uk/registers/premises.json";
import { readFileSync } from "node:fs";
import { buildCityMarket } from "../../src/lib/spine/city_market_rows";
import { cityPeerListRow } from "../../src/lib/spine/city_peer_list";
import { getCityPeerSet } from "../../src/lib/cities/comparable_cities";
import { cityTypicalIncome } from "../../src/lib/spine/city_income";

const RULE = "london-city-sources";
const FILE = "src/lib/spine";
const REMEDY = "on a page held to a register region print an official figure, say the figure is an estimate, or withhold it";
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

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/london_city_sources: all pass");
