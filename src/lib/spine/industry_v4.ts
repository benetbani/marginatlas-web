/**
 * THE INDUSTRY PAGE, TARGET v4 (his "Go" of 2026-10-21, FOUNDER-VERDICTS "The industry page (/industries/restaurants) v4
 * approved"): the builder. Every figure the page prints is read here from data/sourced/ through the sourced-data loader
 * (src/lib/sourced/load.ts) and nowhere else: no modelled shard, no hand-typed number. Each figure names its file in a comment.
 * The view (src/components/spine/industry/sourced-view.tsx) arranges what this returns and computes nothing.
 *
 * The target is sheets/industry/v4 (src/build_industry_v4.py, its index.html and shots); this module is that builder's arithmetic
 * on the site's files, so the two print the same numbers: one decimal half up as the publishers round, thousands as "€381k",
 * millions as "€1.69m", each euro or pound figure with its dollars at the site's display rates (src/lib/currency.ts, EUR 0.868 and
 * GBP 0.7435 per dollar, the kit's own rates).
 *
 * WHICH TRADES. v4 draws only where every one of its sections fills from the files (the brief I1: "restaurants; cafes and barbershops
 * only where every section fills, else they keep the old page"). Two sections hold for restaurants alone today: the trades next door
 * (data/sourced/business/eurostat-sbs-section-i-2023.json holds section I's classes, the restaurants' neighbours, and nothing for
 * division 96) and the busy and quiet months (data/sourced/business/eu-season-estimate-2025.json holds the restaurants' estimate
 * only). So `buildIndustryV4` returns null for every slug but restaurants, and those trades keep today's page. The rule is the
 * builder's: a missing row anywhere returns null, never a part page.
 */
import { sourcedRows, yearOrder, type ResolvedRow } from "@/lib/sourced/load";
import { convertFromUsd } from "@/lib/currency";

/* ------------------------------------------------------------------ the numbers' own rounding */

/** Half up at `dp` decimals, as the publishers round (the target's Decimal ROUND_HALF_UP); the exponent form avoids 1.005's binary drift. */
export function roundHalfUp(x: number, dp = 0): number {
  const s = Math.sign(x) || 1;
  return s * Number(`${Math.round(Number(`${Math.abs(x)}e${dp}`))}e-${dp}`);
}
/** One decimal, half up: 11.67 -> "11.7". */
export const d1 = (x: number): string => roundHalfUp(x, 1).toFixed(1);
/** A whole number, half up, with thousands commas. */
export const r0 = (x: number): string => roundHalfUp(x, 0).toLocaleString("en-US");

/** A money figure as the page prints it: the local figure first, its dollars after (the switch reverses them). */
export type Money = { local: string; usd: string };
type Cur = "EUR" | "GBP";
const SYM: Record<Cur, string> = { EUR: "€", GBP: "£" };
/** Local currency per dollar, the site's display rates (the kit's: EUR 0.868, GBP 0.7435). */
const perUsd = (cur: Cur): number => convertFromUsd(1, cur);
/** Thousands as "381k", millions as "1.69m" (the target's eur_short). */
function short(x: number): string {
  if (x >= 1e6) return `${(x / 1e6).toFixed(2)}m`.replace(".00m", "m");
  return `${r0(x / 1000)}k`;
}
export function moneyShort(v: number, cur: Cur = "EUR"): Money {
  return { local: `${SYM[cur]}${short(v)}`, usd: `$${short(v / perUsd(cur))}` };
}
/** Two decimals, the hour's figures: "€16.01" ($18.44). */
export function moneyCents(v: number, cur: Cur = "EUR"): Money {
  return { local: `${SYM[cur]}${v.toFixed(2)}`, usd: `$${(v / perUsd(cur)).toFixed(2)}` };
}
/** Thousands for the table's sales column: "€459k" ($529k); a dollar figure stands alone. */
function tableSales(v: number, cur: Cur | "USD"): Money | { usdOnly: string } {
  if (cur === "USD") return { usdOnly: `$${r0(v / 1000)}k` };
  return { local: `${SYM[cur]}${r0(v / 1000)}k`, usd: `$${r0(v / perUsd(cur) / 1000)}k` };
}

/* ------------------------------------------------------------------ reading the files */

/** The files this page reads, each by its id (data/sourced/<domain>/<id>.json). */
const F = {
  SBS: "eurostat-sbs-2023", // business/eurostat-sbs-2023.json: operating rate, shares, sales and persons a business, size shares
  SIZE: "eurostat-sbs-size", // business/eurostat-sbs-size.json: sales a business and share of sales by size (2024)
  DEMO: "eurostat-business-demography", // business/eurostat-business-demography.json: survival after 1, 2, 3 and 5 years
  SECTION_I: "eurostat-sbs-section-i-2023", // business/eurostat-sbs-section-i-2023.json: the trades next door
  ECON: "eurostat-sbs-economics-2023", // business/eurostat-sbs-economics-2023.json: the year, the hour, the people, the investment
  SEASON: "eu-season-estimate-2025", // business/eu-season-estimate-2025.json: the EU's months, an estimate
  STS: "eurostat-sts-turnover-month", // business/eurostat-sts-turnover-month.json: the members' own monthly indexes the estimate weights
  POP: "eurostat-population-2023", // countries/eurostat-population-2023.json: population on 1 January 2023
  UK_ABS: "ons-abs-2024", // business/ons-abs-2024.json: the United Kingdom's row, from its own survey
  UK_DEMO: "ons-business-demography-2024", // business/ons-business-demography-2024.json: the UK's five-year survival
  US_EC: "us-economic-census-2022-firms", // business/us-economic-census-2022-firms.json: the US row's sales and staff a company
  US_BED: "us-bls-bed", // business/us-bls-bed.json: the US row's five-year survival
} as const;

/** The EU-27 aggregate's code in every Eurostat file this page reads (EU28 rows are the closed series' older aggregate, never read). */
const EU = "EU27_2020";
/** The 27 member states, by the codes the Eurostat files use (Greece "GR"): who counts as the EU's own among a file's countries. */
const EU27 = new Set(["AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK"]);

/** The one row of an item for a trade at a place, from one file, the latest year (the loader's own rule), a published value only. */
function one(file: string, item: string, trade: string, geo: string, measure?: string): number | null {
  const rows = sourcedRows({ item, trade, geo, measure }).filter((r) => r.fileId === file && r.value !== null);
  if (!rows.length) return null;
  return rows.reduce((b, r) => (yearOrder(r.year, b.year) > 0 ? r : b)).value as number;
}
/** Every country row (level country) of an item for a trade in one file. */
const countries = (file: string, item: string, trade: string): ResolvedRow[] =>
  sourcedRows({ item, trade, level: "country" }).filter((r) => r.fileId === file && r.value !== null);

/** The size classes as the files' measures name them, smallest first. */
const SIZE_CLASSES = ["0 to 9 persons employed", "10 to 19 persons employed", "20 to 49 persons employed", "50 to 249 persons employed", "250 persons employed or more"] as const;
const sizeMeasure = (item: "sales_per_business_by_size" | "turnover_share_by_size", cls: string): string =>
  item === "sales_per_business_by_size" ? `mean net turnover per enterprise, enterprises with ${cls}` : `share of net turnover made by enterprises with ${cls}`;

/* ------------------------------------------------------------------ the page's blocks */

export type HeroCell = { key: "high" | "low" | "all" | "next"; value: string; country?: string };
export type V4Hero = { answer: string; cells: HeroCell[] };
export type V4Lasts = { five: string; years: Array<{ key: string; trade: string; all: string | null }> };
export type V4NextDoor = { rankWord: string; items: Array<{ key: string; value: number; text: string; me: boolean }>; all: { value: number; text: string }; scaleTop: number };
export type V4Split = { trade: { purchases: number; staff: number; left: number }; all: { purchases: number; staff: number; left: number } };
export type V4Year = { left: Money; sales: Money; bought: Money; staff: Money; leftRow: Money; allLeft: Money };
export type V4Hour = { costs: number; adds: number; leaves: Money; costsMoney: Money; addsMoney: Money; allLeaves: Money; scaleTop: number };
export type V4People = { persons: string; allPersons: string; wage: string; owners: string; jobs: string };
export type V4PutsBack = { share: string; put: Money; left: Money; allShare: string };
export type V4SmallBig = { lead: Money; smallShare: string; rows: Array<{ key: string; money: Money }>; times: string };
export type V4Row = { code: string; name: string; gor: number | null; sales: Money | { usdOnly: string } | null; salesUsd: number | null; people: string | null; open5: number | null; ownSurvey: "EU" | "GB" | "US" };
export type V4Table = { count: number; first: V4Row[]; rest: V4Row[]; best: { gor: number; salesUsd: number; open5: number } };
export type V4Months = { shape: number[]; swing: string; busiest: number; quietest: number; members: number };
export type V4Density = { eu: string; level: "Low" | "Middle" | "High"; count: number; rows: Array<{ name: string; value: string; end: "low" | "high" | null }> };
export type V4Donut = { parts: Array<{ key: "small" | "medium" | "large" | "corporate"; value: number }>; small: string };

export type IndustryV4 = {
  trade: "restaurants";
  hero: V4Hero;
  lasts: V4Lasts;
  nextDoor: V4NextDoor;
  split: V4Split;
  year: V4Year;
  hour: V4Hour;
  people: V4People;
  putsBack: V4PutsBack;
  smallBig: V4SmallBig;
  table: V4Table;
  months: V4Months;
  density: V4Density;
  donut: V4Donut;
};

/** The slugs v4 draws, and the trade each reads in the files. Only restaurants fills every section (the header says why). */
const V4_TRADES: Record<string, "restaurants"> = { restaurants: "restaurants" };

/** True when the slug draws v4: the route and the harness ask this one question, so they make the same choice. */
export function drawsIndustryV4(slug: string): boolean {
  return buildIndustryV4(slug) !== null;
}

const cache = new Map<string, IndustryV4 | null>();

/** The whole page's figures for a slug, or null where any section's row is missing (the trade keeps today's page). */
export function buildIndustryV4(slug: string): IndustryV4 | null {
  const key = slug.toLowerCase();
  if (cache.has(key)) return cache.get(key) ?? null;
  const trade = V4_TRADES[key];
  const built = trade ? build(trade) : null;
  cache.set(key, built);
  return built;
}

function build(trade: "restaurants"): IndustryV4 | null {
  /* ---- 00 the hero: operating profit of every 100 of sales, the EU's, and four cells of one kind. All from
     business/eurostat-sbs-2023.json (gross_operating_rate), save the cells' "bars and cafes", the same file's cafes row. */
  const gor = one(F.SBS, "gross_operating_rate", trade, EU);
  const gorAll = one(F.SBS, "gross_operating_rate", "all", EU);
  const gorCafes = one(F.SBS, "gross_operating_rate", "cafes", EU);
  const byCountry = countries(F.SBS, "gross_operating_rate", trade);
  if (gor === null || gorAll === null || gorCafes === null || byCountry.length < 2) return null;
  const hi = byCountry.reduce((b, r) => ((r.value as number) > (b.value as number) ? r : b));
  const lo = byCountry.reduce((b, r) => ((r.value as number) < (b.value as number) ? r : b));
  const hero: V4Hero = {
    answer: d1(gor),
    cells: [
      { key: "high", value: d1(hi.value as number), country: hi.geo.name },
      { key: "low", value: d1(lo.value as number), country: lo.geo.name },
      { key: "all", value: d1(gorAll) },
      { key: "next", value: d1(gorCafes) },
    ],
  };

  /* ---- 01 how many last: business/eurostat-business-demography.json, the EU's survival after 1, 2 and 3 years (one reference year)
     and after 5 (the closed series' own year); no five-year rate is published for all businesses, so that cell prints a dash. */
  const surv = (n: number, t: string) => one(F.DEMO, `survival_${n}y`, t, EU);
  const y5 = surv(5, trade);
  const yrs = [1, 2, 3].map((n) => ({ n, t: surv(n, trade), a: surv(n, "all") }));
  if (y5 === null || yrs.some((y) => y.t === null || y.a === null)) return null;
  const lasts: V4Lasts = {
    five: d1(y5),
    years: [
      ...yrs.map((y) => ({ key: `y${y.n}`, trade: `${d1(y.t as number)}%`, all: `${d1(y.a as number)}%` })),
      { key: "y5", trade: `${d1(y5)}%`, all: surv(5, "all") === null ? null : `${d1(surv(5, "all") as number)}%` },
    ],
  };

  /* ---- 02 the trades next door: five classes of section I on one survey, 2023. Hotels, event catering and canteens from
     business/eurostat-sbs-section-i-2023.json; bars and cafes and the trade itself from business/eurostat-sbs-2023.json. */
  const nd: Array<{ key: string; v: number | null; me: boolean }> = [
    { key: "hotels", v: one(F.SECTION_I, "gross_operating_rate", "hotels", EU), me: false },
    { key: "eventCatering", v: one(F.SECTION_I, "gross_operating_rate", "event_catering", EU), me: false },
    { key: "barsCafes", v: gorCafes, me: false },
    { key: "restaurants", v: gor, me: true },
    { key: "canteens", v: one(F.SECTION_I, "gross_operating_rate", "contract_catering", EU), me: false },
  ];
  if (nd.some((x) => x.v === null)) return null;
  const ranked = nd.map((x) => ({ key: x.key, value: x.v as number, text: d1(x.v as number), me: x.me })).sort((a, b) => b.value - a.value);
  const rank = ranked.findIndex((x) => x.me) + 1;
  const nextDoor: V4NextDoor = {
    rankWord: ({ 1: "1st", 2: "2nd", 3: "3rd" } as Record<number, string>)[rank] ?? `${rank}th`,
    items: ranked,
    all: { value: gorAll, text: d1(gorAll) },
    /* The bars' scale, as the target draws it: 25 of every 100, above the largest of the five (21.1). */
    scaleTop: Math.max(25, Math.ceil(ranked[0].value / 5) * 5),
  };

  /* ---- 03 where each 100 goes: business/eurostat-sbs-2023.json, purchases, staff and operating profit of every 100 of sales,
     the trade's and all businesses', each as published. */
  const shares = (t: string) => ({ purchases: one(F.SBS, "purchases_share", t, EU), staff: one(F.SBS, "staff_cost_share", t, EU), left: one(F.SBS, "gross_operating_rate", t, EU) });
  const st = shares(trade), sa = shares("all");
  if ([st.purchases, st.staff, st.left, sa.purchases, sa.staff, sa.left].some((v) => v === null)) return null;
  const split = { trade: st, all: sa } as V4Split;

  /* ---- what a year leaves: sales a business from business/eurostat-sbs-2023.json (sales_per_business); bought in, staff and what is
     left a business from business/eurostat-sbs-economics-2023.json (purchases_, staff_cost_, surplus_per_business); rows rounded to
     thousands so the lines add up, as the target prints them. */
  const sales = one(F.SBS, "sales_per_business", trade, EU);
  const ec = (item: string, t: string = trade) => one(F.ECON, item, t, EU);
  const bought = ec("purchases_per_business"), staffCost = ec("staff_cost_per_business"), surplus = ec("surplus_per_business"), surplusAll = ec("surplus_per_business", "all");
  if ([sales, bought, staffCost, surplus, surplusAll].some((v) => v === null)) return null;
  const k = (v: number) => roundHalfUp(v / 1000) * 1000;
  const year: V4Year = {
    left: moneyShort(surplus as number),
    sales: moneyShort(k(sales as number)),
    bought: moneyShort(k(bought as number)),
    staff: moneyShort(k(staffCost as number)),
    leftRow: moneyShort(k(surplus as number)),
    allLeft: moneyShort(surplusAll as number),
  };

  /* ---- an hour of work: business/eurostat-sbs-economics-2023.json, what a staff hour costs (wage_cost_per_hour), what it adds
     (value_added_per_hour) and what it leaves (surplus_per_hour), the trade's and all businesses'. */
  const wc = ec("wage_cost_per_hour"), va = ec("value_added_per_hour"), sh = ec("surplus_per_hour"), shAll = ec("surplus_per_hour", "all");
  if ([wc, va, sh, shAll].some((v) => v === null)) return null;
  const hour: V4Hour = { costs: wc as number, adds: va as number, leaves: moneyCents(sh as number), costsMoney: moneyCents(wc as number), addsMoney: moneyCents(va as number), allLeaves: moneyCents(shAll as number), scaleTop: 25 };

  /* ---- who works in it: persons a business from business/eurostat-sbs-2023.json (persons_per_business, published whole);
     employees, owners and the full-time share from business/eurostat-sbs-economics-2023.json; full-time jobs = employees x share. */
  const persons = one(F.SBS, "persons_per_business", trade, EU), personsAll = one(F.SBS, "persons_per_business", "all", EU);
  const emp = ec("employees_per_business"), own = ec("owners_per_business"), fte = ec("fte_share");
  if ([persons, personsAll, emp, own, fte].some((v) => v === null)) return null;
  const people: V4People = { persons: r0(persons as number), allPersons: r0(personsAll as number), wage: d1(emp as number), owners: d1(own as number), jobs: d1(((emp as number) * (fte as number)) / 100) };

  /* ---- what it puts back: business/eurostat-sbs-economics-2023.json, investment a business and its share of what is left. */
  const inv = ec("investment_per_business"), invShare = ec("investment_share_of_surplus"), invShareAll = ec("investment_share_of_surplus", "all");
  if ([inv, invShare, invShareAll].some((v) => v === null)) return null;
  const putsBack: V4PutsBack = { share: r0(invShare as number), put: moneyShort(inv as number), left: moneyShort(surplus as number), allShare: r0(invShareAll as number) };

  /* ---- small and big: sales a business by size from business/eurostat-sbs-size.json (2024); how many are small, the two smallest
     classes' shares of businesses, from business/eurostat-sbs-2023.json (size_class_share, 2023). */
  const bySize = SIZE_CLASSES.map((c) => ({ key: c, v: one(F.SIZE, "sales_per_business_by_size", trade, EU, sizeMeasure("sales_per_business_by_size", c)) }));
  const s01 = one(F.SBS, "size_class_share", trade, EU, "share of enterprises with 0 to 1 person employed");
  const s29 = one(F.SBS, "size_class_share", trade, EU, "share of enterprises with 2 to 9 persons employed");
  if (bySize.some((x) => x.v === null) || s01 === null || s29 === null) return null;
  const smallBig: V4SmallBig = {
    lead: moneyShort(bySize[0].v as number),
    smallShare: r0(s01 + s29),
    rows: bySize.map((x) => ({ key: x.key, money: moneyShort(x.v as number) })),
    times: r0((bySize[2].v as number) / (bySize[0].v as number)),
  };

  /* ---- 06 country by country: every country of business/eurostat-sbs-2023.json for the trade (operating rate, sales a business,
     persons a business), five-year survival from business/eurostat-business-demography.json at the EU's own reference year (one
     closed series, one year: a country's later row from another series never mixes in); the United Kingdom from its own survey
     (business/ons-abs-2024.json, class 56.1, and business/ons-business-demography-2024.json); the United States from its own census
     (business/us-economic-census-2022-firms.json) and business/us-bls-bed.json, its operating profit unpublished and left blank
     (his answer of 2026-10-21). Each column's best is chosen among the European survey's countries only. */
  const eu5Year = sourcedRows({ item: "survival_5y", trade, geo: EU }).filter((r) => r.fileId === F.DEMO).reduce<ResolvedRow | null>((b, r) => (!b || yearOrder(r.year, b.year) > 0 ? r : b), null)?.year;
  if (!eu5Year) return null;
  const open5Of = (code: string): number | null => {
    const r = sourcedRows({ item: "survival_5y", trade, geo: code }).find((x) => x.fileId === F.DEMO && x.year === eu5Year && x.value !== null);
    return r ? (r.value as number) : null;
  };
  const salesOf = new Map(countries(F.SBS, "sales_per_business", trade).map((r) => [r.geo.code, r.value as number]));
  const personsOf = new Map(countries(F.SBS, "persons_per_business", trade).map((r) => [r.geo.code, r.value as number]));
  const rows: V4Row[] = byCountry.map((r) => {
    const s = salesOf.get(r.geo.code) ?? null;
    const p = personsOf.get(r.geo.code);
    return { code: r.geo.code, name: r.geo.name, gor: r.value as number, sales: s === null ? null : tableSales(s, "EUR"), salesUsd: s === null ? null : s / perUsd("EUR"), people: p === undefined ? null : r0(p), open5: open5Of(r.geo.code), ownSurvey: "EU" as const };
  });
  /* The UK: class 56.1's row (the file also holds division 56's, by officialClass). */
  const ukRow = (item: string) => sourcedRows({ item, trade, geo: "GB" }).filter((r) => r.fileId === F.UK_ABS && /56\.1\b/.test(r.officialClass ?? "") && r.value !== null)[0]?.value ?? null;
  const ukGor = ukRow("gross_operating_rate"), ukSales = ukRow("sales_per_business"), uk5 = one(F.UK_DEMO, "survival_5y", trade, "GB");
  const usSales = one(F.US_EC, "sales_per_business", trade, "US"), usEmp = one(F.US_EC, "employees_per_business", trade, "US"), us5 = one(F.US_BED, "survival_5y", trade, "US");
  if (ukGor === null || ukSales === null || usSales === null || usEmp === null) return null;
  rows.push({ code: "GB", name: "United Kingdom", gor: ukGor, sales: tableSales(ukSales, "GBP"), salesUsd: ukSales / perUsd("GBP"), people: null, open5: uk5, ownSurvey: "GB" });
  rows.sort((a, b) => (b.gor ?? -1) - (a.gor ?? -1));
  const eu = rows.filter((r) => r.ownSurvey === "EU");
  const best = {
    gor: Math.max(...eu.map((r) => r.gor as number)),
    salesUsd: Math.max(...eu.filter((r) => r.salesUsd !== null).map((r) => r.salesUsd as number)),
    open5: Math.max(...eu.filter((r) => r.open5 !== null).map((r) => r.open5 as number)),
  };
  const us: V4Row = { code: "US", name: "United States", gor: null, sales: tableSales(usSales, "USD"), salesUsd: usSales, people: r0(usEmp), open5: us5, ownSurvey: "US" };
  const table: V4Table = { count: rows.length + 1, first: [...rows.slice(0, 8), us], rest: rows.slice(8), best };

  /* ---- busy and quiet months: business/eu-season-estimate-2025.json, twelve months of 2025, an estimate (each row marked so);
     the members it weights, counted from business/eurostat-sts-turnover-month.json: the EU's members holding twelve months of 2025
     whose sales the survey publishes (business/eurostat-sbs-2023.json), the file's own rule. */
  const season = sourcedRows({ item: "season_index_month", trade, geo: EU }).filter((r) => r.fileId === F.SEASON && r.value !== null).sort((a, b) => yearOrder(a.year, b.year));
  if (season.length !== 12) return null;
  const shape = season.map((r) => r.value as number);
  const busiest = shape.indexOf(Math.max(...shape)), quietest = shape.indexOf(Math.min(...shape));
  const stsMonths = new Map<string, number>();
  for (const r of sourcedRows({ item: "turnover_index_month", trade, level: "country" })) {
    if (r.fileId === F.STS && r.year.startsWith(season[0].year.slice(0, 4)) && r.value !== null) stsMonths.set(r.geo.code, (stsMonths.get(r.geo.code) ?? 0) + 1);
  }
  const members = [...stsMonths].filter(([c, n]) => n === 12 && EU27.has(c) && salesOf.has(c)).length;
  const months: V4Months = { shape, swing: r0((shape[busiest] / shape[quietest] - 1) * 100), busiest, quietest, members };

  /* ---- how crowded it is: restaurants for every 10,000 people, business_count from business/eurostat-sbs-2023.json over
     population_1jan from countries/eurostat-population-2023.json; the EU's level by thirds of the countries' ranking; no count printed. */
  const countEu = one(F.SBS, "business_count", trade, EU), popEu = one(F.POP, "population_1jan", "all", EU);
  if (countEu === null || popEu === null) return null;
  const popOf = new Map(countries(F.POP, "population_1jan", "all").map((r) => [r.geo.code, r.value as number]));
  const dens = countries(F.SBS, "business_count", trade)
    .filter((r) => popOf.has(r.geo.code))
    .map((r) => ({ name: r.geo.name, v: roundHalfUp(((r.value as number) / (popOf.get(r.geo.code) as number)) * 10000, 1) }));
  if (dens.length < 3) return null;
  const euDens = roundHalfUp((countEu / popEu) * 10000, 1);
  const below = dens.filter((x) => x.v < euDens).length / dens.length;
  const level = below < 1 / 3 ? "Low" : below > 2 / 3 ? "High" : "Middle";
  const loD = dens.reduce((b, x) => (x.v < b.v ? x : b)), hiD = dens.reduce((b, x) => (x.v > b.v ? x : b));
  /* The five largest members' economies named between the two ends, as the target names them. */
  const named = ["Poland", "Spain", "Germany", "France", "Italy"].map((n) => dens.find((x) => x.name === n)).filter((x): x is { name: string; v: number } => !!x).sort((a, b) => a.v - b.v);
  const density: V4Density = {
    eu: d1(euDens),
    level,
    count: dens.length,
    rows: [
      { name: loD.name, value: d1(loD.v), end: "low" },
      ...named.map((x) => ({ name: x.name, value: d1(x.v), end: null })),
      { name: hiD.name, value: d1(hiD.v), end: "high" },
    ],
  };

  /* ---- who makes the sales: business/eurostat-sbs-size.json (turnover_share_by_size, 2024), small under 10, medium 10 to 49 (two
     published classes added), large 50 to 249, corporate 250 or more (his words of 2026-10-20 on the size names). */
  const ts = SIZE_CLASSES.map((c) => one(F.SIZE, "turnover_share_by_size", trade, EU, sizeMeasure("turnover_share_by_size", c)));
  if (ts.some((v) => v === null)) return null;
  const [t0, t1, t2, t3, t4] = ts as number[];
  const donut: V4Donut = {
    parts: [
      { key: "small", value: t0 },
      { key: "medium", value: roundHalfUp(t1 + t2, 1) },
      { key: "large", value: t3 },
      { key: "corporate", value: t4 },
    ],
    small: d1(t0),
  };

  return { trade, hero, lasts, nextDoor, split, year, hour, people, putsBack, smallBig, table, months, density, donut };
}

/** For the table's sales cell: a pair or a dollar figure alone. */
export const isUsdOnly = (m: V4Row["sales"]): m is { usdOnly: string } => !!m && "usdOnly" in m;
