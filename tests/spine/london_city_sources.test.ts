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

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/london_city_sources: all pass");
