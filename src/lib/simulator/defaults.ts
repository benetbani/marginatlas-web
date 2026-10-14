/**
 * src/lib/simulator/defaults.ts , EVERY DEFAULT WITH ITS STAMP, ITS LEVEL AND ITS LINE (plan 2026-10-13 cost-simulator, Task 2; spec sections 2 and
 * 3; R7 table 4.1 row for row, its fallbacks city, then country, then none, said in the row).
 *
 * TWO PATHS. "uk-model": the place is in England (London its own rows, any other English city and "anywhere in" the UK England's) and the trade
 * passes model.ts's own conditions there with a recipe that carries its utilities (london_trade_hero.ts's rule, made geographic). Its engine
 * inputs are model.ts's business (uk_model.ts), so the break-even at these defaults is model.ts's to the penny, and the trade's roles stand at
 * nought heads as hires on top. "world": every other place and trade, R7 4.1's rows as the files hold them, in pounds for a UK place (the
 * site's parse-time pound rate, fx.ts) and dollars elsewhere. A UK place on the world path keeps the valuation's premises and the register's
 * sales where England holds them.
 *
 * NEVER A FILL (spec section 3): a row the place lacks falls back a level and says so, or stands empty with its line. The files' own fallbacks
 * are never read: the tax table's and the two profiles' default_fallback, the 42/10/5 ladder (trade_net.ts LADDER_FILL), the 80,000 archetype
 * default (startupCapitalArchetypeKeyed answers null on it). tests/simulator/defaults.test.ts holds each.
 *
 * ITS BLIND SPOT, stated: it reads what the files hold and cannot tell a city's rent from a guess filed under the city; every shard figure is an
 * estimate and is stamped so. Server only: it reads the fact shards from disk. It never imports src/lib/cells.ts: the cell comes as an argument.
 */
import icpJson from "../../../data/finance/industry_cost_profile_v1.json";
import { cityFigure } from "@/lib/facts/city_shard";
import { countryFigure } from "@/lib/facts/country_shard";
import { industryFigure } from "@/lib/facts/industry_shard";
import { countryMedianPay, shardRoles } from "@/lib/spine/team_rows";
import { shardLadderNet } from "@/lib/spine/trade_net";
import { placeCostFactor } from "@/lib/spine/open_rows";
import { inSentence } from "@/lib/spine/place_names";
import { registerSrc } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";
import { getCityAnnualWageUsd } from "@/lib/economic_profile/city_wages";
import { getCountryProfile, listCountryProfiles } from "@/lib/economic_profile";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { getAovCityTierMultiplier } from "@/lib/economics/breakeven";
import { getCityTier } from "@/lib/cities/city_tier";
import { getCountryTaxRates, hasCountrySpecificRates } from "@/lib/tax";
import { startupCapitalArchetypeKeyed } from "@/lib/markets/startup_capital_archetypes";
import { honestRound } from "@/lib/uk/present/precision";
import { convertUsdTo } from "@/lib/finance/fx";
import { INDUSTRY_BY_ID } from "@/lib/taxonomy";
import { own } from "@/lib/own";
import { RECIPES } from "@/lib/uk/pnl/recipes";
import { anchorSalesFromBands } from "@/lib/uk/pnl/inputs";
import { ENGLAND, LONDON, geographyBands, geographyPremises, geographyTradeInputs } from "@/lib/uk/pnl/london";
import { pennies } from "@/lib/uk/law/money";
import { STAFF_DRIVER, ukModelInputs } from "./uk_model";
import type { ProvenanceKind } from "@/lib/spine/provenance";
import type { Share, Spread, Stamp } from "./engine";
import type { Place } from "./place";
import type { CellFacts } from "./cell_facts";
import type { Level, LeverKey, OpeningLine, OpeningRule, SimBundle, SimInput, SimRole } from "./bundle";

const W = COPY.calculator;
const ICP = (icpJson as unknown as { sectors: Record<string, Record<string, number>> }).sectors;
const RUNNING_KEYS = ["energy_share", "marketing_share", "software_share", "insurance_share", "motor_vehicle_share", "other_overhead_share"] as const;
/** A producer paid a share of what they take (recipes.ts P1's commission): off the UK model the team pays producers, so it is no cost of goods. */
const COMMISSION = /commission/i;

const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
const est = (src: string): Stamp => ({ src, kind: "estimate" });
const pos = (x: number | null | undefined): number | null => (typeof x === "number" && Number.isFinite(x) && x > 0 ? x : null);
const input = (value: number | null, stamp: Stamp | null, level: Level, line: string): SimInput => (value === null || stamp === null ? { value: null, stamp: null, level: "none", line } : { value, stamp, level, line });

type Step = { level: Level; value: number | null; src: string; kind: ProvenanceKind; line: string };

/** The first level that holds the figure; past the first, a city's row says it holds none and whose figure stands ("Berlin holds none. This is Germany's."). */
function stepDown(place: Place, steps: Array<Step | null>, noneLine: string): SimInput {
  const live = steps.filter((s): s is Step => s !== null);
  for (let k = 0; k < live.length; k++) {
    const s = live[k];
    if (s.value === null) continue;
    const fellBack = k > 0 && live[0].level === "city" && place.cityName !== null;
    const whose = s.level === "nation" ? "England" : inSentence(place.countryName);
    return { value: s.value, stamp: { src: s.src, kind: s.kind }, level: s.level, line: fellBack ? fill(W.fallback, { city: place.cityName as string, country: whose }) : s.line };
  }
  return { value: null, stamp: null, level: "none", line: noneLine };
}

function notesOf(b: Omit<SimBundle, "notes">): Array<{ label: string; fact: string }> {
  const srcs = [
    ...Object.values(b.inputs).map((x) => x.stamp?.src ?? ""),
    ...b.lines.map((l) => l.stamp.src),
    ...b.opening.lines.map((l) => l.stamp.src),
    ...b.roles.flatMap((r) => [r.headsStamp.src, r.pay.stamp?.src ?? ""]),
    ...(b.variable ?? []).map((s) => s.stamp.src),
    b.spread?.stamp.src ?? "",
  ];
  const holds = (re: RegExp) => srcs.some((s) => re.test(s));
  const S = W.sources;
  const out = ([
    holds(/turnover\.json/) ? S.register : null,
    holds(/premises\.json/) ? S.valuation : null,
    b.ukLaw || b.rates || b.tax.law === "uk" ? S.law : null,
    holds(/^cells:|setup_costs:/) ? S.cell : null,
    holds(/recipes\.ts|facts\/industry\/|industry_cost_profile/) ? S.trade : null,
    holds(/facts\/city\/|facts\/country\/|city_wage_premium|economic_profile|country_metrics|country_rates|startup_capital_archetypes/) ? S.place : null,
  ] as Array<{ label: string; fact: string } | null>).filter((n): n is { label: string; fact: string } => n !== null);
  return out.slice(0, 5).map((n) => ({ label: n.label, fact: n.fact }));
}

function worldBundle(place: Place, cell: CellFacts | null): SimBundle {
  const uk = place.iso2 === "GB";
  const currency: "GBP" | "USD" = uk ? "GBP" : "USD";
  const money = (usd: number | null): number | null => (usd === null ? null : currency === "USD" ? usd : convertUsdTo("GBP", usd));
  const geography = uk && place.nation === "england" ? (place.city === "london" ? LONDON : ENGLAND) : null;
  const ownRows = geography === LONDON || place.cityName === null;
  const geoLevel: Level = geography === LONDON ? "city" : "nation";
  const said = (line: string) => (ownRows ? line : fill(W.fallback, { city: place.cityName as string, country: "England" }));
  const cityId = place.city ? `${place.iso2}-${place.city}` : null;
  const city = (metric: string) => (place.city ? pos(cityFigure(place.iso2, place.city, metric)?.value) : null);
  const country = (metric: string) => pos(countryFigure(place.iso2, metric)?.value);
  const csrc = (metric: string) => `facts/city/${cityId}.json:${metric}`;
  const ksrc = (metric: string) => `facts/country/${place.iso2}.json:${metric}`;
  const sectorId = INDUSTRY_BY_ID[place.industryId]?.sector_id ?? null;
  const sector = sectorId ? own(ICP, sectorId) ?? null : null;
  const recipe = own(RECIPES, place.trade) ?? null;
  const premises = geography ? geographyPremises(place.trade, geography) : null;
  const premisesStamp = (): Stamp => ({ src: `uk/registers/premises.json:${place.trade}:${geography}`, kind: "worked out" });

  /* THE TEAM: the shard's roles at their typical counts, the owner's seat at nought (the owner's pay row stands for it); else the sector's small
     firm as one role; pay is the role's index times the city's wage, else the country's median. */
  const shard = shardRoles(place.industryId);
  const cityWage = place.city ? pos(getCityAnnualWageUsd(place.city)) : null;
  const median = pos(countryMedianPay(place.iso2));
  const payOf = (index: number): SimInput =>
    stepDown(place, [
      place.city ? { level: "city", value: cityWage === null ? null : money(pennies(cityWage * index)), src: `economics/city_wage_premium_v1.json:${place.city} x ${index}`, kind: "estimate", line: fill(W.lines.pay.city, { index, city: place.cityName ?? "" }) } : null,
      { level: "country", value: median === null ? null : money(pennies(median * index)), src: `economic_profile:${place.iso2}.median_wage_full_time_usd x ${index}`, kind: "estimate", line: fill(W.lines.pay.country, { index }) },
    ], W.lines.pay.none);
  const key = (k: string) => k.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  const small = sector ? pos(sector.typical_employees_small) : null;
  const roles: SimRole[] = shard.length > 0
    ? shard.map((r) => { const owner = /^owner\b/i.test(r.role); return { key: key(r.key), name: r.name, sub: r.sub, heads: owner ? 0 : r.headcount, headsStamp: est(`facts/industry/${place.industryId}.json:roles.${r.key}.headcount_typical`), pay: payOf(r.wageIndex), owner }; })
    : small !== null ? [{ key: "staff", name: W.bill.team, sub: null, heads: small, headsStamp: est(`finance/industry_cost_profile_v1.json:${sectorId}.typical_employees_small`), pay: payOf(1), owner: false }] : [];
  const heads = shard.length > 0 ? shard.reduce((a, r) => a + r.headcount, 0) : small ?? 0;

  const sqm = sector ? pos(sector.sqm_per_fte) : null;
  const area = premises ? input(premises.areaM2, premisesStamp(), geoLevel, said(W.lines.area.valuation))
    : sqm !== null && heads > 0 ? input(pennies(sqm * heads), est(`finance/industry_cost_profile_v1.json:${sectorId}.sqm_per_fte x ${heads}`), "sector", fill(W.lines.area.perWorker, { m2: sqm }))
    : input(null, null, "none", W.lines.area.none);
  const rent = premises ? input(premises.rentPerM2, premisesStamp(), geoLevel, said(W.lines.rent.valuation))
    : stepDown(place, [
      place.city ? { level: "city", value: money(city("realestate.rent_secondary_usd_sqm_yr")), src: csrc("realestate.rent_secondary_usd_sqm_yr"), kind: "estimate", line: fill(W.lines.rent.city, { city: place.cityName ?? "" }) } : null,
      { level: "country", value: money(country("costs.commercial_rent_usd_sqm_yr")), src: ksrc("costs.commercial_rent_usd_sqm_yr"), kind: "estimate", line: W.lines.rent.country },
    ], W.lines.rent.none);
  // Q1 (plan 2026-10-13 cost-simulator), answer A: a rent that is the valuation's carries no service charge. Answer B takes the city's here too.
  const service = premises ? input(null, null, "none", W.lines.service.valuation)
    : stepDown(place, [place.city ? { level: "city", value: money(city("realestate.service_charge_usd_sqm_yr")), src: csrc("realestate.service_charge_usd_sqm_yr"), kind: "estimate", line: fill(W.lines.service.city, { city: place.cityName ?? "" }) } : null], W.lines.service.none);
  const oncost: SimInput = uk ? { value: null, stamp: null, level: "law", line: W.lines.team.ukLaw }
    : hasCountrySpecificRates(place.iso2) ? input(getCountryTaxRates(place.iso2).employer_social, est(`tax/country_rates_2024.json:${place.iso2}.employer_social`), "country", fill(W.lines.oncost.country, { country: inSentence(place.countryName) }))
    : input(null, null, "none", W.lines.oncost.none);

  /* EACH SALE: the recipe's goods (no commission), else what the gross margin leaves (never the 42/10/5 ladder), else the sector's share; the
     running costs as a share of sales, the recipe's lines that pay no staff, else the sector's six running shares. */
  const recipeGoods = recipe ? recipe.variable.filter((s) => !COMMISSION.test(s.driver) && !COMMISSION.test(s.key)) : [];
  const ladder = shardLadderNet(place.industryId);
  const gross = ladder && !ladder.fill ? industryFigure(place.industryId, "margin_ladder.gross_margin_pct")?.value ?? null : null;
  const from: "recipe" | "margin" | "sector" | null = recipeGoods.length > 0 ? "recipe" : gross !== null && gross >= 0 && gross <= 100 ? "margin" : sector && pos(sector.cogs_share) !== null ? "sector" : null;
  const variable: Share[] | null = from === "recipe" ? recipeGoods.map((s) => ({ key: s.key, share: s.shareOfSales, stamp: est(`uk/pnl/recipes.ts:${place.trade}:${s.key}`) }))
    : from === "margin" ? [{ key: "goods", share: 1 - (gross as number) / 100, stamp: est(`facts/industry/${place.industryId}.json:margin_ladder.gross_margin_pct`) }]
    : from === "sector" && sector ? [{ key: "goods", share: sector.cogs_share, stamp: est(`finance/industry_cost_profile_v1.json:${sectorId}.cogs_share`) }]
    : null;
  const goodsLine = from === "recipe" ? W.lines.goods.recipe : from === "margin" ? W.lines.goods.margin : from === "sector" ? W.lines.goods.sector : W.lines.goods.none;
  const goods = variable ? input(variable.reduce((a, s) => a + s.share, 0), variable.length === 1 ? variable[0].stamp : est(`uk/pnl/recipes.ts:${place.trade}:${variable.map((s) => s.key).join("+")}`), from === "sector" ? "sector" : "trade", goodsLine) : input(null, null, "none", goodsLine);
  const recipeRun = recipe ? recipe.sized.filter((s) => !STAFF_DRIVER.test(s.driver)) : [];
  const sectorRun = sector ? RUNNING_KEYS.reduce((a, k) => a + (pos(sector[k]) ?? 0), 0) : 0;
  const runShare = recipeRun.length > 0 ? input(recipeRun.reduce((a, s) => a + s.shareOfSales, 0), est(`uk/pnl/recipes.ts:${place.trade}:${recipeRun.map((s) => s.key).join("+")}`), "trade", W.lines.running.recipe)
    : sectorRun > 0 ? input(sectorRun, est(`finance/industry_cost_profile_v1.json:${sectorId}:${RUNNING_KEYS.join("+")}`), "sector", W.lines.running.sector)
    : input(null, null, "none", W.lines.running.none);

  /* SALES AND THE FIRMS: England's register where it holds the trade, else a trusted cell. */
  const bands = geography ? geographyBands(place.trade, geography) : null;
  const anchor = bands ? anchorSalesFromBands(bands.bands) : null;
  // Q1 (plan 2026-10-13 cost-simulator), answer A: the register's mean under 5m, model.ts's anchor. Answer B takes bandQuantile(bands, 0.5) here.
  const sales = anchor !== null ? input(anchor, { src: registerSrc("turnover.json", place.trade, geography as string), kind: "worked out" }, geoLevel, said(W.lines.sales.register))
    : cell?.typical ? input(money(cell.typical), est(`${cell.src}:rev_p50`), "city", W.lines.sales.cell)
    : input(null, null, "none", W.lines.sales.none);
  const tenths = cell?.tenths && cell.firms ? cell.tenths : null;
  const spread: Spread | null = bands ? { kind: "bands", revenueBandsK: bands.bands, stamp: { src: registerSrc("turnover.json", place.trade, geography as string), kind: "counted" } }
    : tenths && cell?.firms ? { kind: "tenths", p10: money(tenths.p10) as number, p25: money(tenths.p25) as number, p50: money(tenths.p50) as number, p75: money(tenths.p75) as number, p90: money(tenths.p90) as number, firms: cell.firms, stamp: est(`${cell.src}:rev_p10+rev_p90`) }
    : null;
  const sph = pos(industryFigure(place.industryId, "demand.spend_per_head_usd")?.value);
  const mult = getAovCityTierMultiplier(place.industryId, place.city ? getCityTier(place.city) : null);
  const ticket = sph !== null ? input(money(sph * mult), est(`facts/industry/${place.industryId}.json:demand.spend_per_head_usd${mult !== 1 ? ` x ${mult}` : ""}`), "trade", mult !== 1 ? W.lines.ticket.tier : W.lines.ticket.trade) : input(null, null, "none", W.lines.ticket.none);

  /* YOU AND THE LOAN. */
  const ownerMonth = city("owner_col.median_salary_usd_mo");
  const avg = pos(getCountryEconomicsSnapshot(place.iso2).avgMonthlySalary);
  const owner = stepDown(place, [
    place.city ? { level: "city", value: ownerMonth === null ? null : money(ownerMonth * 12), src: `${csrc("owner_col.median_salary_usd_mo")} x 12`, kind: "estimate", line: fill(W.lines.owner.city, { city: place.cityName ?? "" }) } : null,
    { level: "country", value: avg === null ? null : money(avg * 12), src: `economics/country_metrics:${place.iso2}.avgMonthlySalary x 12`, kind: "estimate", line: W.lines.owner.country },
  ], W.lines.owner.none);
  const taxed = uk && place.nation !== "scotland";
  const ukRate = uk ? pos(countryFigure("GB", "financing.startup_loan_rate_pct")?.value) : null;
  const lend = !uk && listCountryProfiles().some((p) => p.iso2 === place.iso2) ? pos(getCountryProfile(place.iso2).bank_lending_rate_pct) : null;
  const loanRate = ukRate !== null ? input(ukRate, { src: "facts/country/GB.json:financing.startup_loan_rate_pct", kind: "looked up" }, "country", W.lines.loan.uk)
    : lend !== null ? input(lend, est(`economic_profile:${place.iso2}.bank_lending_rate_pct`), "country", fill(W.lines.loan.country, { country: inSentence(place.countryName) }))
    : input(null, null, "none", W.lines.loan.noRate);

  /* THE MONEY TO OPEN IT: the cell's held bill, else fit-out for this floor space, the deposit and registration, else the trade's archetype at
     the city's prices (never on a UK page without its own city index, as the trade page holds it), else none. */
  let opening: OpeningRule;
  const fit = city("realestate.fit_out_cost_usd_sqm");
  if (cell?.setup) {
    const scope = cell.setup.scope;
    opening = { kind: "held", lines: cell.setup.items.map((it, k) => ({ key: `held-${k}`, name: it.name, amount: pennies(money(it.usd) as number), stamp: est(`setup_costs:${place.industryId}:${scope}`) })), line: fill(W.lines.opening.held, { country: scope === place.iso2 ? inSentence(place.countryName) : scope }) };
  } else if (fit !== null && area.value !== null) {
    const lines: OpeningLine[] = [{ key: "fit-out", name: W.lines.openingItems.fitOut, amount: pennies((money(fit) as number) * area.value), stamp: est(`${csrc("realestate.fit_out_cost_usd_sqm")} x area`) }];
    const months = city("realestate.deposit_months");
    if (months !== null && rent.value !== null) lines.push({ key: "deposit", name: W.lines.openingItems.deposit, amount: pennies(((area.value * rent.value) / 12) * months), stamp: est(`${csrc("realestate.deposit_months")} x rent`) });
    const reg = country("costs.license_setup_usd");
    if (reg !== null) lines.push({ key: "registration", name: W.lines.openingItems.registration, amount: pennies(money(reg) as number), stamp: est(ksrc("costs.license_setup_usd")) });
    opening = { kind: "built", lines, line: W.lines.opening.built };
  } else {
    const factor = place.city ? placeCostFactor({ iso2: place.iso2, geo: place.city }) : null;
    const keyed = factor === null && uk ? null : startupCapitalArchetypeKeyed(place.trade);
    opening = keyed !== null
      ? { kind: "archetype", lines: [{ key: "archetype", name: W.opening.total, amount: pennies(money(factor !== null ? honestRound(keyed * factor) : keyed) as number), stamp: est(`markets/startup_capital_archetypes:${place.trade}${factor !== null ? `:${place.city}` : ""}`) }], line: factor !== null && place.cityName ? fill(W.lines.opening.archetype, { city: place.cityName }) : W.lines.opening.archetypeBare }
      : { kind: "none", lines: [], line: W.lines.opening.none };
  }
  const openTotal = opening.lines.reduce((a, l) => a + l.amount, 0);
  const openingInput = opening.lines.length > 0 ? input(pennies(openTotal), opening.lines.length === 1 ? opening.lines[0].stamp : { src: opening.lines.map((l) => l.stamp.src).join(" + "), kind: "estimate" }, opening.kind === "archetype" ? "trade" : "city", opening.line) : input(null, null, "none", opening.line);

  const inputs: Record<LeverKey, SimInput> = {
    area, rent, service, oncost, sales, ticket, goods, runShare, owner,
    target: { value: null, stamp: null, level: "none", line: taxed ? W.lines.target.uk : W.lines.target.world },
    loanAmount: { value: null, stamp: null, level: "none", line: W.lines.loan.amount },
    loanRate,
    loanYears: { value: null, stamp: null, level: "none", line: W.lines.loan.years },
    opening: openingInput,
  };
  const partial: Omit<SimBundle, "notes"> = {
    path: "world", currency, inputs, roles,
    teamLine: shard.length > 0 ? W.lines.team.roles : roles.length > 0 ? W.lines.team.sector : W.lines.team.none,
    ukLaw: uk ? { allowance: true } : null,
    lines: [],
    variable,
    rates: geography ? { law: "england", retailHospitalityLeisure: recipe?.retailHospitalityLeisure ?? false } : null,
    ratesLine: geography ? (recipe ? W.bill.ratesNote : W.bill.ratesStandard) : null,
    tax: taxed ? { law: "uk", form: "sole trader" } : { law: "none" },
    spread, opening,
  };
  return { ...partial, notes: notesOf(partial) };
}

export function buildBundle(place: Place, opts: { cell: CellFacts | null }): SimBundle {
  const world = worldBundle(place, opts.cell);
  const geography = place.iso2 === "GB" && place.nation === "england" ? (place.city === "london" ? LONDON : ENGLAND) : null;
  const recipe = own(RECIPES, place.trade);
  const model = geography && recipe?.utilitiesCarried === true ? geographyTradeInputs(place.trade, geography, geography === LONDON ? "London" : "England") : null;
  if (!model || !geography) return world;
  /* THE UK MODEL: model.ts's business; the world rows' place figures (premises, sales, the bands, the owner's pay, the loan, the opening) stand. */
  const e = ukModelInputs(model, { trade: place.trade, geography });
  const names: Record<string, string> = { crew: W.bill.crew, running: W.bill.running };
  const partial: Omit<SimBundle, "notes"> = {
    ...world,
    path: "uk-model",
    inputs: {
      ...world.inputs,
      goods: { ...world.inputs.goods, value: model.variable.reduce((a, s) => a + s.share, 0), stamp: est(`uk/pnl/recipes.ts:${place.trade}:${model.variable.map((s) => s.key).join("+")}`), level: "trade", line: W.lines.goods.recipe },
      runShare: { value: null, stamp: null, level: "none", line: "" },
    },
    roles: world.roles.map((r) => ({ ...r, heads: 0 })),
    ukLaw: { allowance: false },
    lines: e.lines.map((l) => ({ key: l.key, name: names[l.key] ?? l.key, amountYear: l.amountYear, stamp: l.stamp })),
    variable: (e.variable ?? []).map((s) => ({ ...s })),
    rates: e.rates,
    tax: e.tax,
    spread: e.spread,
  };
  return { ...partial, notes: notesOf(partial) };
}
