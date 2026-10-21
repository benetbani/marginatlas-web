/**
 * THE CITY PAGE, TARGET v9 (his "v9 looks right. Record it as the approved London target", 2026-10-21, FOUNDER-VERDICTS "London
 * (/cities/london) v9 approved"): the builder. Every figure the page prints is read here from data/sourced/ through the sourced-data
 * loader (src/lib/sourced/load.ts) and nowhere else: no modelled shard, no hand-typed number. Each figure names its file in a comment.
 * The view (src/components/spine/city/sourced-view.tsx) arranges what this returns and computes nothing.
 *
 * The target is sheets/city/v9 (src/build_london_v9.py, its index.html and shots); this module is that builder's arithmetic on the
 * site's files, so the two print the same numbers: whole pounds, or pence where the target prints them, each pound figure with its
 * dollars at the site's display rate (src/lib/currency.ts, GBP 0.7435 per dollar, the kit's own), the prime rent's euros at the same
 * table's rates; half up as the publishers round.
 *
 * WHICH CITIES. v9 draws London alone: its sections read London's borough rents, its age groups and its months, which the files hold
 * for London and no other city. So `buildCityV9` returns null for every slug but london, and those cities keep today's page. The rule
 * is the builder's: a missing row anywhere returns null, never a part page.
 */
import { SOURCED, sourcedRows, yearOrder, type ResolvedRow } from "@/lib/sourced/load";
import { convertFromUsd } from "@/lib/currency";
import { roundHalfUp, type Money } from "@/lib/spine/industry_v4";

/* ------------------------------------------------------------------ the numbers' own rounding */

/** Pounds per dollar and euros per dollar, the site's display rates (the kit's: GBP 0.7435, EUR 0.868). */
const GBP = convertFromUsd(1, "GBP");
const EUR = convertFromUsd(1, "EUR");
const comma = (x: number, dp = 0): string => x.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
/** A pound figure and its dollars, as the target's m(): whole by default, `dp` decimals (the dollars of the pence printed, as the
 *  target's worked month reads them: £2,203.07 is $2,963.11), or three significant figures (a large sum). */
export function gbp(v: number, opt: { dp?: number; sig3?: boolean } = {}): Money {
  const u = v / GBP;
  if (opt.sig3) return { local: `£${comma(Number(v.toPrecision(3)))}`, usd: `$${comma(Number(u.toPrecision(3)))}` };
  if (opt.dp) {
    const p = roundHalfUp(v, opt.dp);
    return { local: `£${comma(p, opt.dp)}`, usd: `$${comma(roundHalfUp(p / GBP, opt.dp), opt.dp)}` };
  }
  return { local: `£${comma(roundHalfUp(v))}`, usd: `$${comma(roundHalfUp(u))}` };
}
/** Pence with their dollars, as the target's pence(): "38.2p" ($0.51). */
const pence = (p: number): Money => ({ local: `${p}p`, usd: `$${(p / 100 / GBP).toFixed(2)}` });
/** Millions to one decimal: "19.3 million". */
export const mill = (n: number): string => `${(n / 1e6).toFixed(1)} million`;
/** A count as the peers table prints it: millions from a million, else the nearest thousand. */
const visitsText = (n: number): string => (n >= 1e6 ? mill(n) : comma(roundHalfUp(n / 1000) * 1000));
const median = (xs: number[]): number => {
  const s = [...xs].sort((a, b) => a - b);
  const h = Math.floor(s.length / 2);
  return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
};

/* ------------------------------------------------------------------ reading the files */

/** The files this page reads, each by its id (data/sourced/<domain>/<file>.json). */
export const F = {
  PAY: "place-uk3-ashe-pay-month-2025", // place/uk3-pay-median-month-2025.json: median full-time pay a month, by place of residence
  TENTHS: "place-uk5-ashe-residence-deciles-2025", // place/ons-ashe-residence-deciles-2025.json: the nine tenths of full-time pay
  SHOP: "place-uk3-voa-shop-rent-month-2026", // place/uk3-shop-rent-month-2026.json: shop rent a m² a month, the cities
  BOROUGHS: "place-uk5-voa-borough-rents-2026", // place/uk5-voa-borough-rents-2026.json: the 33 boroughs, Inner and Outer London
  PRIME: "place-prime-street-rents-2025", // place/prime-street-rents-2025.json: the dearest street of 90 cities, EUR a m² a year
  AGES: "place-uk5-population-age-bands-2025", // place/uk5-population-age-bands-2025.json: five age groups, London and the UK
  MONTHS: "place-uk5-london-visits-month-worked", // place/uk5-london-visits-month-worked.json: London's visits each month, worked out
  VISITORS: "place-visitors", // place/visitors.json: London's visits and nights by overseas residents
  IPS: "place-uk-visitors-ips-2025", // place/uk-visitors-ips-2025.json: the six cities' visits and nights, the same survey
  PULL: "place-uk3-visitor-pull-index-2025", // place/uk3-visitor-pull-index-2025.json: the visitor pull index and its level
  CONNECT: "place-uk3-connectivity-index-2025", // place/uk3-connectivity-index-2025.json: the connectivity index and its level
  UNEMP: "place-uk3-unemployment-2026", // place/uk3-unemployment-2026.json: unemployment, April 2025 to March 2026
  FLAT: "place-uk-flat-rents-pipr-2026", // place/uk-flat-rents-pipr-2026.json: a one-bed flat a month
  PASS: "place-transport-passes", // place/transport-passes.json: London's monthly Travelcard, zones 1 and 2
  AIR: "place-uk3-caa-airports-2025", // place/uk3-caa-airports-2025.json: passengers at the airports serving each city
  RATES: "local-business-taxes", // rules/local-business-taxes.json: England's business rates, pence for each pound of rental value
  EMPLOYER: "employer-charges", // rules/employer-charges.json: the minimum wage, the employer's National Insurance
  TAX: "rules-uk3-tax-rates-2026-27", // rules/uk3-tax-rates-2026-27.json: income tax, the allowance, the employee's National Insurance
} as const;

/** A figure's provenance stamp as the page prints it (`data-src`, the fact-once gate's reading of one fact): the file, the item, the
 *  place and, where the file splits an item, what picks the row. A figure worked out of several rows says so ("derived"). */
export function srcOf(file: keyof typeof F, item: string, geo: string, pick?: string): string {
  return `sourced/${F[file]}:${item}:${geo}${pick ? `:${pick}` : ""}`;
}

/** London in the ONS files (the region's code, E12000007); the United Kingdom in the deciles' and pay files and in the age file. */
export const LON = "E12000007";
const UK = "GB";
const UK_AGES = "K02000001";

/** The latest published row of an item at a place, from one file, that `pick` accepts (the loader's own latest-year rule). */
function row(file: keyof typeof F, item: string, geo: string, pick: (r: ResolvedRow) => boolean = () => true): ResolvedRow | null {
  const rows = sourcedRows({ item, geo }).filter((r) => r.fileId === F[file] && r.value !== null && pick(r));
  if (!rows.length) return null;
  return rows.reduce((b, r) => (yearOrder(r.year, b.year) > 0 ? r : b));
}
const val = (file: keyof typeof F, item: string, geo: string, pick?: (r: ResolvedRow) => boolean): number | null =>
  (row(file, item, geo, pick)?.value as number | undefined) ?? null;
/** Every published row of an item in one file. */
const all = (file: keyof typeof F, item: string): ResolvedRow[] => sourcedRows({ item }).filter((r) => r.fileId === F[file] && r.value !== null);
const byMeasure = (re: RegExp) => (r: ResolvedRow) => re.test(r.measure ?? "");
/** The level an index's file names in its measure ("visitor pull index (Medium: High from 67, ...)"): the file's own word. */
const levelOf = (r: ResolvedRow | null): "High" | "Medium" | "Low" | null => (r?.measure?.match(/\((High|Medium|Low):/)?.[1] as "High" | "Medium" | "Low" | undefined) ?? null;
/** A number the publisher writes in a measure ("rateable value below GBP 51,000"). */
const num = (s: string | undefined, re: RegExp, k = 1): number | null => {
  const m = s?.match(re);
  return m ? Number(m[k].replace(/,/g, "")) : null;
};

/* ------------------------------------------------------------------ the page's blocks */

export type IndexCell = { score: number; level: "High" | "Medium" | "Low" };
export type V9Hero = {
  pay: Money;
  cells: { wage: Money; shop: Money; tax: Money; employer: number; visits: string; pull: IndexCell; connect: IndexCell; unemp: number };
};
export type V9Prime = { month: Money; mid: Money; hundred: Money; midHundred: Money; count: number };
export type V9Band = { key: string; lo: number | null; hi: number | null; label: string; usd: string; shop: string; other: string; lit: boolean };
export type V9Tax = { rate: string; under: Money; bands: V9Band[]; example: { value: Money; pays: Money } };
export type V9Borough = { name: string; value: number; money: Money; width: number; code: string };
export type V9Group = { key: "inner" | "outer"; code: string; value: Money; count: number; shown: V9Borough[]; rest: V9Borough[] };
export type V9Districts = { lo: { name: string; money: Money }; hi: { name: string; money: Money }; groups: V9Group[]; avg: Money; avgAt: number; total: number };
export type V9Living = { flat: Money; pass: Money; gross: Money; tax: Money; ni: Money; after: Money; short: Money; wage: Money };
export type V9Share = { key: string; flat: Money | null; pay: Money; share: number | null };
export type V9RentPay = { london: V9Share & { share: number }; others: V9Share[]; missing: V9Share[]; dash: number; circ: number; radius: number };
export type V9Strip = { tenths: number[]; money: Money[]; pos: number[] };
export type V9Earn = { london: V9Strip; uk: V9Strip };
export type V9Ages = { groups: Array<{ label: string; london: number; uk: number }>; focal: number };
export type V9Months = { values: number[]; text: string[]; busiest: number; quietest: number };
export type V9Stays = { nights: string; nightsMillion: string; rows: Array<{ key: string; value: string; me: boolean }> };
export type V9Peer = { key: string; me: boolean; pay: number; unemp: number; air: number; shop: number | null; visits: number };
export type V9Peers = { rows: V9Peer[]; best: { pay: number; unemp: number; air: number; shop: number; visits: number } };

export type CityV9 = {
  slug: "london";
  hero: V9Hero;
  prime: V9Prime;
  tax: V9Tax;
  districts: V9Districts;
  living: V9Living;
  rentPay: V9RentPay;
  earn: V9Earn;
  ages: V9Ages;
  months: V9Months;
  stays: V9Stays;
  peers: V9Peers;
  /** The newest retrieval date among the files the page reads (ISO), for the exit's "Checked" line. */
  checked: string;
};

/** The six cities v9 sets beside London, each by the code each file keys it under. Glasgow's flat is Greater Glasgow's market area
 *  (the rents file's only Glasgow row, as v9 printed it); Edinburgh's has none (v9's dash), and neither Scottish city has a shop rent. */
const PEER_CODES: Record<string, { city: string; flat: string | null }> = {
  london: { city: LON, flat: LON },
  birmingham: { city: "E08000025", flat: "E08000025" },
  leeds: { city: "E08000035", flat: "E08000035" },
  glasgow: { city: "S12000049", flat: "S33000009" },
  manchester: { city: "E08000003", flat: "E08000003" },
  edinburgh: { city: "S12000036", flat: null },
  bristol: { city: "E06000023", flat: "E06000023" },
};
export const PEER_KEYS = Object.keys(PEER_CODES);

/** Full-time hours, the worked month's own assumption (40 hours a week for 52 weeks, over 12 months), stated in the card's note. */
export const WEEK_HOURS = 40;
/** The worked example's café: a rental value the target sets to show the band at work (its own words say "A café with ..."). */
export const EXAMPLE_VALUE = 30000;
/** Outer London's rows before the click, set so the cluster's two columns end level at 1280 (v9, measured). */
export const OUTER_SHOWN = 6;
/** Inner London's rows a phone shows before "See all 33 boroughs" (v9). */
export const PHONE_SHOWN = 5;

/** True when the slug draws v9: the route and the harness ask this one question, so they make the same choice. */
export function drawsCityV9(slug: string): boolean {
  return buildCityV9(slug) !== null;
}

const cache = new Map<string, CityV9 | null>();

/** The whole page's figures for a slug, or null where any section's row is missing (the city keeps today's page). */
export function buildCityV9(slug: string): CityV9 | null {
  const key = slug.toLowerCase();
  if (cache.has(key)) return cache.get(key) ?? null;
  const built = key === "london" ? build() : null;
  cache.set(key, built);
  return built;
}

function build(): CityV9 | null {
  /* ---- 00 the hero: median full-time pay a month (uk3-pay-median-month-2025) and eight cells: the minimum wage and the employer's
     National Insurance (employer-charges), the shop rent (uk3-shop-rent-month-2026), England's rate for a shop valued under the top
     band's floor (local-business-taxes), visits from abroad (visitors.json), the visitor pull and connectivity indices with the level
     each file names, unemployment (uk3-unemployment-2026). */
  const pay = val("PAY", "pay_median_month", LON);
  const wage = val("EMPLOYER", "wage_floor", UK);
  const shop = val("SHOP", "shop_rent_m2_month", LON);
  const rates = all("RATES", "local_tax_rate").filter((r) => r.geo.code === "GB-ENG");
  const retailLow = rates.find(byMeasure(/retail.*below GBP/));
  const employer = val("EMPLOYER", "employer_charge_rate", UK, byMeasure(/Class 1 National Insurance/));
  const visits = val("VISITORS", "visitors", LON, (r) => r.unit === "visits");
  const nights = val("VISITORS", "visitors", LON, (r) => r.unit === "nights");
  const pullRow = row("PULL", "visitor_pull_index", LON);
  const connRow = row("CONNECT", "connectivity_index", LON);
  const unemp = val("UNEMP", "unemployment_rate", LON);
  const pullLevel = levelOf(pullRow), connLevel = levelOf(connRow);
  if (pay === null || wage === null || shop === null || !retailLow || employer === null || visits === null || nights === null || !pullRow || !connRow || !pullLevel || !connLevel || unemp === null) return null;
  const hero: V9Hero = {
    pay: gbp(pay),
    cells: {
      wage: gbp(wage, { dp: 2 }),
      shop: gbp(shop, { dp: 2 }),
      tax: pence(retailLow.value as number),
      employer,
      visits: mill(visits),
      pull: { score: pullRow.value as number, level: pullLevel },
      connect: { score: connRow.value as number, level: connLevel },
      unemp,
    },
  };

  /* ---- 01 prime shop rent: prime-street-rents-2025, London's street (New Bond Street) first of the file's cities, its euros a m² a
     year over 12 at the display rates; the middle of the cities' rows its benchmark; 100 m² of each, a month, to three figures. */
  const primeRows = all("PRIME", "prime_rent_m2_year");
  const london = primeRows.find((r) => r.geo.code === "london");
  if (!london || primeRows.length < 3) return null;
  const top = Math.max(...primeRows.map((r) => r.value as number));
  /* v9's words call London's street the dearest: true only while it is the file's top row. */
  if ((london.value as number) !== top) return null;
  const eurToGbp = GBP / EUR;
  const primeMonth = ((london.value as number) / 12) * eurToGbp;
  const midMonth = (median(primeRows.map((r) => r.value as number)) / 12) * eurToGbp;
  const prime: V9Prime = { month: gbp(primeMonth), mid: gbp(midMonth), hundred: gbp(primeMonth * 100, { sig3: true }), midHundred: gbp(midMonth * 100, { sig3: true }), count: primeRows.length };

  /* ---- 01 property tax: local-business-taxes, England 2026-27, each band's rate for shops and for other businesses, the band edges as
     the file's measures write them; no rates at or below the small business relief's threshold. */
  const otherLow = rates.find(byMeasure(/other businesses, rateable value below GBP/));
  const retailMid = rates.find(byMeasure(/retail.*GBP [\d,]+ to [\d,]+/));
  const otherMid = rates.find(byMeasure(/other businesses, GBP [\d,]+ to [\d,]+/));
  const topBand = rates.find(byMeasure(/GBP [\d,]+ or more/));
  const relief = val("RATES", "local_tax_relief_threshold", "GB-ENG");
  const lowTop = num(retailLow.measure, /below GBP ([\d,]+)/);
  const midTo = num(retailMid?.measure, /GBP [\d,]+ to ([\d,]+)/);
  const topFrom = num(topBand?.measure, /GBP ([\d,]+) or more/);
  if (!otherLow || !retailMid || !otherMid || !topBand || relief === null || lowTop === null || midTo === null || topFrom === null) return null;
  const usdOf = (x: number) => `$${comma(roundHalfUp(x / GBP))}`;
  const band = (key: string, lo: number | null, hi: number | null, s: number, o: number): V9Band => ({
    key, lo, hi,
    label: lo === null ? `£${comma(hi as number)} or less` : hi === null ? `£${comma(lo)} or more` : `£${comma(lo)} to £${comma(hi)}`,
    usd: lo === null ? `up to ${usdOf(hi as number)}` : hi === null ? `${usdOf(lo)} or more` : `${usdOf(lo)} to ${usdOf(hi)}`,
    shop: `${s}p`, other: `${o}p`, lit: s === retailLow.value,
  });
  const exampleRate = retailLow.value as number;
  const tax: V9Tax = {
    rate: `${exampleRate}p`,
    under: gbp(lowTop),
    bands: [
      band("relief", null, relief, 0, 0),
      band("low", relief + 1, lowTop - 1, exampleRate, otherLow.value as number),
      band("mid", lowTop, midTo, retailMid.value as number, otherMid.value as number),
      band("top", topFrom, null, topBand.value as number, topBand.value as number),
    ],
    example: { value: gbp(EXAMPLE_VALUE), pays: gbp((EXAMPLE_VALUE * exampleRate) / 100) },
  };

  /* ---- 01 rent by district: uk5-voa-borough-rents-2026, retail rateable value a m² a year over 12 for each of the 33 boroughs, the
     publisher's two groups (Inner and Outer London) each with its own figure; dearest first in each group; bars from zero on one
     scale, the even number above the dearest borough; London's own figure (uk3-shop-rent-month-2026, the hero's) the mark. */
  const boroughRows = all("BOROUGHS", "shop_rent_m2_month").filter((r) => r.geo.level === "county");
  const groupOf = (r: ResolvedRow) => (r.geo as { group?: string }).group;
  const groupCode = { inner: "E13000001", outer: "E13000002" } as const;
  if (boroughRows.length !== 33 || boroughRows.some((r) => groupOf(r) !== "inner" && groupOf(r) !== "outer")) return null;
  const scaleTop = Math.ceil(Math.max(...boroughRows.map((r) => r.value as number)) / 2) * 2;
  const borough = (r: ResolvedRow): V9Borough => ({ name: r.geo.name, value: r.value as number, money: gbp(r.value as number, { dp: 2 }), width: ((r.value as number) / scaleTop) * 100, code: r.geo.code });
  const groups: V9Group[] = [];
  for (const g of ["inner", "outer"] as const) {
    const gv = val("BOROUGHS", "shop_rent_m2_month", groupCode[g]);
    if (gv === null) return null;
    const bs = boroughRows.filter((r) => groupOf(r) === g).map(borough).sort((a, b) => b.value - a.value);
    const [shown, rest] = g === "inner" ? [bs, []] : [bs.slice(0, OUTER_SHOWN), bs.slice(OUTER_SHOWN)];
    groups.push({ key: g, code: groupCode[g], value: gbp(gv, { dp: 2 }), count: bs.length, shown, rest });
  }
  const lo = boroughRows.reduce((b, r) => ((r.value as number) < (b.value as number) ? r : b));
  const hi = boroughRows.reduce((b, r) => ((r.value as number) > (b.value as number) ? r : b));
  const districts: V9Districts = {
    lo: { name: lo.geo.name, money: gbp(lo.value as number, { dp: 2 }) },
    hi: { name: hi.geo.name, money: gbp(hi.value as number, { dp: 2 }) },
    groups,
    avg: gbp(shop, { dp: 2 }),
    avgAt: (shop / scaleTop) * 100,
    total: boroughRows.length,
  };

  /* ---- 02 what living here costs: a one-bed flat (uk-flat-rents-pipr-2026) and the zones 1 and 2 Travelcard (transport-passes.json,
     the row its note names "Zones 1-2"), against the minimum wage's full-time month (employer-charges' wage floor, 40 hours for 52
     weeks over 12) after income tax at the basic rate above the Personal Allowance and the employee's National Insurance above its
     Primary threshold (uk3-tax-rates-2026-27). */
  const flat = val("FLAT", "flat_rent_month", LON);
  const pass = val("PASS", "transport_pass_month", LON, (r) => /Zones 1-2\b/.test(r.note ?? ""));
  const allowance = val("TAX", "income_tax_allowance", "GB-EWN");
  const basic = val("TAX", "income_tax_rate", "GB-EWN", byMeasure(/^Basic rate/));
  const niRate = val("TAX", "employee_ni_rate", UK);
  const niFrom = val("TAX", "employee_ni_threshold", UK);
  if (flat === null || pass === null || allowance === null || basic === null || niRate === null || niFrom === null) return null;
  const gross = (wage * WEEK_HOURS * 52) / 12;
  const incomeTax = (Math.max(0, gross * 12 - allowance) * (basic / 100)) / 12;
  const ni = (Math.max(0, gross * 12 - niFrom) * (niRate / 100)) / 12;
  const after = gross - incomeTax - ni;
  const living: V9Living = {
    flat: gbp(flat), pass: gbp(pass, { dp: 2 }), gross: gbp(gross, { dp: 2 }), tax: gbp(incomeTax, { dp: 2 }), ni: gbp(ni, { dp: 2 }),
    after: gbp(after, { dp: 2 }), short: gbp(flat + pass - after, { dp: 2 }), wage: gbp(wage, { dp: 2 }),
  };

  /* ---- 02 rent against pay: each city's one-bed flat (uk-flat-rents-pipr-2026) over its median full-time month
     (uk3-pay-median-month-2025); London first, the others by share, a city with no flat published last. */
  const shares: V9Share[] = [];
  for (const k of PEER_KEYS) {
    const c = PEER_CODES[k];
    const p = val("PAY", "pay_median_month", c.city);
    if (p === null) return null;
    const f = c.flat ? val("FLAT", "flat_rent_month", c.flat) : null;
    if (c.flat && f === null) return null;
    shares.push({ key: k, flat: f === null ? null : gbp(f), pay: gbp(p), share: f === null ? null : (f / p) * 100 });
  }
  const [lonShare, ...rest] = shares;
  const radius = 62, circ = 2 * Math.PI * radius;
  const rentPay: V9RentPay = {
    london: lonShare as V9Share & { share: number },
    others: rest.filter((s) => s.share !== null).sort((a, b) => (b.share as number) - (a.share as number)),
    missing: rest.filter((s) => s.share === null),
    dash: ((lonShare.share as number) / 100) * circ, circ, radius,
  };

  /* ---- 03 what people earn: ons-ashe-residence-deciles-2025, full-time pay a month (value_month) at the 10th to the 90th percentile,
     London and the United Kingdom; on one scale from the 500 below the lowest to the 1,000 above the highest. */
  const tenths = (geo: string): number[] | null => {
    const rs = all("TENTHS", "pay_tenth").filter((r) => r.geo.code === geo) as Array<ResolvedRow & { percentile?: number; value_month?: number }>;
    if (rs.length !== 9 || rs.some((r) => typeof r.value_month !== "number" || typeof r.percentile !== "number")) return null;
    return rs.sort((a, b) => (a.percentile as number) - (b.percentile as number)).map((r) => r.value_month as number);
  };
  const lt = tenths(LON), ut = tenths(UK);
  if (!lt || !ut) return null;
  const sLo = Math.floor(Math.min(...lt, ...ut) / 500) * 500, sHi = Math.ceil(Math.max(...lt, ...ut) / 1000) * 1000;
  const strip = (v: number[]): V9Strip => ({ tenths: v, money: v.map((x) => gbp(x)), pos: v.map((x) => ((x - sLo) / (sHi - sLo)) * 100) });
  const earn: V9Earn = { london: strip(lt), uk: strip(ut) };

  /* ---- 03 people by age: uk5-population-age-bands-2025, five groups, London and the United Kingdom, mid-2025; the group where London
     stands furthest from the country is the card's figure. */
  const ageRows = (geo: string) => all("AGES", "age_group_share").filter((r) => r.geo.code === geo);
  const la = ageRows(LON), ua = ageRows(UK_AGES);
  const label = (r: ResolvedRow) => r.measure?.match(/aged (.+)$/)?.[1] ?? null;
  if (la.length !== 5 || ua.length !== 5) return null;
  const groupsAge = la.map((r) => ({ label: label(r), london: r.value as number, uk: (ua.find((u) => label(u) === label(r))?.value as number | undefined) ?? null }));
  if (groupsAge.some((g) => g.label === null || g.uk === null)) return null;
  const ages: V9Ages = { groups: groupsAge as V9Ages["groups"], focal: 0 };
  ages.focal = ages.groups.reduce((b, g, i, a) => (Math.abs(g.london - g.uk) > Math.abs(a[b].london - a[b].uk) ? i : b), 0);

  /* ---- 04 when visitors come: uk5-london-visits-month-worked, London's twelve months of 2025 worked out from its quarters by the UK's
     monthly pattern (each row says so; the card's tag reads "Estimate"). */
  const monthRows = all("MONTHS", "visits_month_worked").filter((r) => r.geo.code === LON).sort((a, b) => yearOrder(a.year, b.year));
  if (monthRows.length !== 12) return null;
  const mv = monthRows.map((r) => r.value as number);
  const months: V9Months = { values: mv, text: mv.map(mill), busiest: mv.indexOf(Math.max(...mv)), quietest: mv.indexOf(Math.min(...mv)) };

  /* ---- 04 how long visitors stay: nights over visits by overseas residents, London from visitors.json and the six from
     uk-visitors-ips-2025, the same survey and year. */
  const stayRows: Array<{ key: string; s: number }> = [{ key: "london", s: nights / visits }];
  for (const k of PEER_KEYS.slice(1)) {
    const c = PEER_CODES[k].city;
    const v = val("IPS", "visitors", c, (r) => r.unit === "visits"), n = val("IPS", "visitors", c, (r) => r.unit === "nights");
    if (v === null || n === null) return null;
    stayRows.push({ key: k, s: n / v });
  }
  const stays: V9Stays = {
    nights: (nights / visits).toFixed(1),
    nightsMillion: comma(roundHalfUp(nights / 1e6)),
    rows: stayRows.sort((a, b) => b.s - a.s).map((r) => ({ key: r.key, value: r.s.toFixed(1), me: r.key === "london" })),
  };

  /* ---- 05 against other UK cities: pay (uk3-pay-median-month-2025), unemployment (uk3-unemployment-2026), air passengers at the
     airports serving each (uk3-caa-airports-2025), shop rent (uk3-shop-rent-month-2026, none for the Scottish cities) and visits from
     abroad (visitors.json, uk-visitors-ips-2025); each column's best among the cities that publish it. */
  const peerRows: V9Peer[] = [];
  for (const k of PEER_KEYS) {
    const c = PEER_CODES[k].city;
    const p = val("PAY", "pay_median_month", c), u = val("UNEMP", "unemployment_rate", c), a = val("AIR", "connectivity_air_passengers", c);
    const v = k === "london" ? visits : val("IPS", "visitors", c, (r) => r.unit === "visits");
    if (p === null || u === null || a === null || v === null) return null;
    peerRows.push({ key: k, me: k === "london", pay: p, unemp: u, air: a, shop: val("SHOP", "shop_rent_m2_month", c), visits: v });
  }
  const shopVals = peerRows.map((r) => r.shop).filter((x): x is number => x !== null);
  const peers: V9Peers = {
    rows: peerRows,
    best: { pay: Math.max(...peerRows.map((r) => r.pay)), unemp: Math.min(...peerRows.map((r) => r.unemp)), air: Math.max(...peerRows.map((r) => r.air)), shop: Math.min(...shopVals), visits: Math.max(...peerRows.map((r) => r.visits)) },
  };

  /* ---- the exit's "Checked" date: the newest `retrieved` among the files above (each file's own field). */
  const ids = new Set<string>(Object.values(F));
  const checked = SOURCED.filter((f) => ids.has(f.id)).map((f) => f.retrieved).sort().pop();
  if (!checked) return null;

  return { slug: "london", hero, prime, tax, districts, living, rentPay, earn, ages, months, stays, peers, checked };
}

/** The peers table's figures as printed (the view draws, this formats): pay whole pounds, unemployment a percent, air passengers and
 *  visits in millions or thousands, shop rent in pence. */
export const peerText = {
  pay: (v: number) => gbp(v),
  unemp: (v: number) => `${v.toFixed(1)}%`,
  air: (v: number) => mill(v),
  shop: (v: number) => gbp(v, { dp: 2 }),
  visits: visitsText,
};
