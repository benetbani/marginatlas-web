/**
 * THE INDUSTRY PAGE, TARGET v6 (his "v6 is the approved industry target.", 2026-10-21, FOUNDER-VERDICTS "The industry page
 * (/industries/restaurants) v6 approved"): the builder. v6 is v4's page with a new chapter 02, "The ratios it runs on", the whole page
 * drawn in the kit's version 3 forms (KIT-VERSION 3). Every figure is read from data/sourced/ through the sourced-data loader and
 * nowhere else: no modelled shard, no hand-typed number.
 *
 * What v6 shares with v4 (the hero, the opening band, chapter 01, the country table, chapter 04) is read by the v4 builder
 * (src/lib/spine/industry_v4.ts, each figure's file named there) and re-cut here only where v6 cuts it differently: the table shows
 * seven countries and the United States on arrival (the kit's LONG LIST law), and the months name their busiest as the section's
 * focal part. What v6 adds, the seventeen official ratios, is worked out below, line for line as the target's own script does it
 * (sheets/industry/v6/src/server/ratio_table.py, which read data/sourced on branch industry-data) and in the order and with the names
 * of its result (v6/src/industry_v5_ratios.json): the two give the same values. The view (src/components/spine/industry/kit3-view.tsx)
 * arranges what this returns and computes nothing.
 *
 * WHICH TRADES: v6 draws wherever v4 draws (restaurants alone today, v4's header says why) and every ratio holds; elsewhere null, and
 * the trade keeps today's page.
 */
import { sourcedRows } from "@/lib/sourced/load";
import { convertFromUsd } from "@/lib/currency";
import { EU, F, buildIndustryV4, d1, moneyCents, srcOf, type IndustryV4, type Money, type V4Row } from "@/lib/spine/industry_v4";

/* ------------------------------------------------------------------ Python's own rounding, for ratio_table.py's round() */

/** Python's round(x, nd) and its "{:.{nd}f}": the exact binary value of x rounded half to even at nd decimals (CPython's correctly
 *  rounded dtoa), so a ratio worked out here equals the one ratio_table.py wrote, never one off on a binary tie. */
function pyRoundString(x: number, nd: number): string {
  if (!Number.isFinite(x)) return String(x);
  const neg = x < 0 || Object.is(x, -0);
  const dv = new DataView(new ArrayBuffer(8));
  dv.setFloat64(0, Math.abs(x));
  const hi = dv.getUint32(0), lo = dv.getUint32(4);
  const expBits = (hi >>> 20) & 0x7ff;
  let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo);
  let e: number;
  if (expBits === 0) e = -1074;
  else { mant |= 1n << 52n; e = expBits - 1075; }
  /* |x| = mant * 2^e = N / 10^k exactly */
  let N: bigint, k: number;
  if (e >= 0) { N = mant << BigInt(e); k = 0; }
  else { k = -e; N = mant * 5n ** BigInt(k); }
  let q: bigint;
  if (k <= nd) q = N * 10n ** BigInt(nd - k);
  else {
    const div = 10n ** BigInt(k - nd);
    q = N / div;
    const r = N % div, twice = 2n * r;
    if (twice > div || (twice === div && q % 2n === 1n)) q += 1n;
  }
  const digits = q.toString().padStart(nd + 1, "0");
  const body = nd ? `${digits.slice(0, -nd)}.${digits.slice(-nd)}` : digits;
  return (neg && q !== 0n ? "-" : "") + body;
}
const pyRound = (x: number, nd: number): number => Number(pyRoundString(x, nd));

/* ------------------------------------------------------------------ the ratios: ratio_table.py, line for line */

/** One ratio's unit as the target formats it: a share ("%", one decimal), euros a person in thousands ("eur"), euros and cents an
 *  hour ("eur2"), owners per 10 businesses ("x10", one decimal), a count of one decimal ("n1"). */
export type RatioUnit = "%" | "eur" | "eur2" | "x10" | "n1";
/** A printed ratio value: plain text, or a money pair (euros first, the switch puts dollars first). */
export type RatioValue = { text: string } | { money: Money } | null;
export type RatioEnd = { name: string; value: RatioValue; src: string };
export type Ratio = {
  key: string;
  name: string;
  formula: string;
  unit: RatioUnit;
  restaurants: RatioValue;
  all: RatioValue;
  lo: RatioEnd | null;
  hi: RatioEnd | null;
  /** Each printed figure's provenance (`data-src`, the fact-once gate's reading): the file, item, trade and place. */
  src: { restaurants: string; all: string | null };
  /** The unrounded values, for the sentences of "What they say" (which compares two of them). */
  raw: { restaurants: number | null; all: number | null };
};

type Cell = { v: number | null; name: string };
/** ratio_table.py `table(rows, item, trade, measure_has)`: every row of the item for the trade in one file, keyed by place, a later
 *  row of a place replacing an earlier one (a dict's own rule: the place keeps its first position). */
function table(file: string, item: string, trade: string, measureHas?: string): Map<string, Cell> {
  const out = new Map<string, Cell>();
  for (const r of sourcedRows({ item, trade }).filter((x) => x.fileId === file)) {
    if (measureHas === undefined || (r.measure ?? "").includes(measureHas)) out.set(r.geo.code, { v: r.value as number | null, name: r.geo.name });
  }
  return out;
}
/** ratio_table.py `agg`: the EU and euro-area aggregates are never a country. */
const agg = (g: string) => g.startsWith("EU") || g.startsWith("EA");
/** ratio_table.py `spread`: the lowest and highest country where a value is published (a zero is "not published"), the first of a tie. */
function spread(d: Map<string, Cell>): { lo: [string, string, number]; hi: [string, string, number]; n: number } | null {
  const c = [...d].filter(([g, x]) => !agg(g) && x.v !== null && x.v !== 0) as Array<[string, { v: number; name: string }]>;
  if (!c.length) return null;
  const lo = c.reduce((b, x) => (x[1].v < b[1].v ? x : b)), hi = c.reduce((b, x) => (x[1].v > b[1].v ? x : b));
  return { lo: [lo[0], lo[1].name, lo[1].v], hi: [hi[0], hi[1].name, hi[1].v], n: c.length };
}

/** Local currency per dollar, the site's display rates (the kit's: EUR 0.868). */
const EUR_PER_USD = convertFromUsd(1, "EUR");
/** The target's ratio_value: one decimal half up for a share or a count, thousands for euros a person, cents for an hour. */
function fmt(v: number | null, unit: RatioUnit): RatioValue {
  if (v === null) return null;
  if (unit === "%") return { text: `${d1(v)}%` };
  if (unit === "eur") return { money: { local: `€${pyRoundString(v / 1000, 1)}k`, usd: `$${pyRoundString(v / EUR_PER_USD / 1000, 1)}k` } };
  if (unit === "eur2") return { money: { local: `€${pyRoundString(v, 2)}`, usd: `$${pyRoundString(v / EUR_PER_USD, 2)}` } };
  if (unit === "x10") return { text: d1(v * 10) };
  return { text: d1(v) };
}

const R = "restaurants", A = "all";
const SRC_FILE = { SBS: F.SBS, ECON: F.ECON, DEMO: F.DEMO, SIZE: F.SIZE } as const;

function entry(
  key: string, name: string, formula: string, unit: RatioUnit,
  rest: Map<string, Cell>, allb: Map<string, Cell> | null,
  src: (trade: string, geo: string) => string,
): Ratio | null {
  const s = spread(rest);
  const rv = rest.get(EU)?.v ?? null, av = allb ? allb.get(EU)?.v ?? null : null;
  if (rv === null || !s) return null;
  return {
    key, name, formula, unit,
    restaurants: fmt(rv, unit), all: fmt(av, unit),
    lo: { name: s.lo[1], value: fmt(s.lo[2], unit), src: src(R, s.lo[0]) },
    hi: { name: s.hi[1], value: fmt(s.hi[2], unit), src: src(R, s.hi[0]) },
    src: { restaurants: src(R, EU), all: av === null ? null : src(A, EU) },
    raw: { restaurants: rv, all: av },
  };
}

/** The seventeen official ratios, in the order and with the names v6 prints (industry_v5_ratios.json), each value worked out as
 *  ratio_table.py works it out. Null when any is missing. */
export function buildRatios(): Ratio[] | null {
  /* business/eurostat-sbs-2023.json: operating, staff and purchases shares; the business count for the density */
  const sbs = (item: string, t: string) => table(F.SBS, item, t);
  /* business/eurostat-sbs-economics-2023.json: value added, wages, sales a person and an hour, the hour's cost and yield, owners,
     the full-time share, investment over the surplus */
  const eco = (item: string, t: string) => table(F.ECON, item, t);
  const at = (file: keyof typeof SRC_FILE, item: string, measure?: string) => (t: string, g: string) => srcOf(file, item, t, g, measure);

  /* the season swing: each member's own 2025 index (business/eurostat-sts-turnover-month.json), busiest month over quietest, less
     one; the EU's from the estimate (business/eu-season-estimate-2025.json, every row of it) */
  const swing = new Map<string, Cell>();
  const by = new Map<string, Map<string, Cell>>();
  for (const r of sourcedRows({ trade: R }).filter((x) => x.fileId === F.STS && x.year.startsWith("2025-"))) {
    if (!by.has(r.geo.code)) by.set(r.geo.code, new Map());
    (by.get(r.geo.code) as Map<string, Cell>).set(r.year, { v: r.value as number | null, name: r.geo.name });
  }
  for (const [g, months] of by) {
    if (months.size !== 12) continue;
    const v = [...months.values()].map((x) => x.v as number);
    swing.set(g, { v: pyRound((Math.max(...v) / Math.min(...v) - 1) * 100, 1), name: [...months.values()][0].name });
  }
  const sv = sourcedRows().filter((x) => x.fileId === F.SEASON).map((r) => r.value as number);
  if (sv.length !== 12) return null;
  swing.set(EU, { v: pyRound((Math.max(...sv) / Math.min(...sv) - 1) * 100, 1), name: "European Union" });

  /* density: businesses (business/eurostat-sbs-2023.json) over people living there (countries/eurostat-population-2023.json, every
     row of it, by place), times 10,000 */
  const pop = new Map<string, number | null>();
  for (const r of sourcedRows().filter((x) => x.fileId === F.POP)) pop.set(r.geo.code, r.value as number | null);
  const density = (t: string) => {
    const out = new Map<string, Cell>();
    for (const [g, c] of sbs("business_count", t)) {
      const p = pop.get(g);
      if (p && c.v !== null) out.set(g, { v: pyRound((c.v / p) * 10000, 1), name: c.name });
    }
    return out;
  };
  const derived = (what: string) => (t: string, g: string) => `derived:${what}:${t}:${g}`;

  const list: Array<Ratio | null> = [
    entry("operating-margin", "Operating margin", "operating surplus ÷ sales", "%", sbs("gross_operating_rate", R), sbs("gross_operating_rate", A), at("SBS", "gross_operating_rate")),
    entry("staff-cost-ratio", "Staff cost ratio", "staff cost ÷ sales", "%", sbs("staff_cost_share", R), sbs("staff_cost_share", A), at("SBS", "staff_cost_share")),
    entry("bought-in-ratio", "Bought-in ratio", "purchases ÷ sales", "%", sbs("purchases_share", R), sbs("purchases_share", A), at("SBS", "purchases_share")),
    entry("value-added-margin", "Value added margin", "value added ÷ sales", "%", eco("value_added_margin", R), eco("value_added_margin", A), at("ECON", "value_added_margin")),
    entry("wage-share", "Wage share", "staff cost ÷ value added", "%", eco("wage_share", R), eco("wage_share", A), at("ECON", "wage_share")),
    entry("reinvestment-ratio", "Reinvestment ratio", "investment ÷ operating surplus", "%", eco("investment_share_of_surplus", R), eco("investment_share_of_surplus", A), at("ECON", "investment_share_of_surplus")),
    entry("full-time-share", "Full-time share", "full-time equivalents ÷ employees", "%", eco("fte_share", R), eco("fte_share", A), at("ECON", "fte_share")),
    /* five-year survival: business/eurostat-business-demography.json; the EU publishes no five-year rate for all businesses */
    entry("five-year-survival", "Five-year survival", "still open after 5 years ÷ opened", "%", table(F.DEMO, "survival_5y", R), null, at("DEMO", "survival_5y")),
    entry("sales-per-person", "Sales per person", "sales ÷ people working", "eur", eco("sales_per_person", R), eco("sales_per_person", A), at("ECON", "sales_per_person")),
    entry("sales-per-staff-hour", "Sales per staff hour", "sales ÷ hours staff work", "eur2", eco("sales_per_hour", R), eco("sales_per_hour", A), at("ECON", "sales_per_hour")),
    entry("wage-cost-an-hour", "Wage cost an hour", "staff cost ÷ hours staff work", "eur2", eco("wage_cost_per_hour", R), eco("wage_cost_per_hour", A), at("ECON", "wage_cost_per_hour")),
    entry("value-added-an-hour", "Value added an hour", "value added ÷ hours staff work", "eur2", eco("value_added_per_hour", R), eco("value_added_per_hour", A), at("ECON", "value_added_per_hour")),
    entry("what-an-hour-leaves", "What an hour leaves", "value added an hour − wage cost an hour", "eur2", eco("surplus_per_hour", R), eco("surplus_per_hour", A), at("ECON", "surplus_per_hour")),
    /* the owners counted per 10 businesses (v6: one count of decimals a column), the target's own re-cut of owners a business */
    entry("owners-a-business", "Owners per 10 businesses", "(people working − employees) ÷ businesses × 10", "x10", eco("owners_per_business", R), eco("owners_per_business", A), at("ECON", "owners_per_business")),
    entry("season-swing", "Season swing", "busiest month ÷ quietest month − 1", "%", swing, null, derived("season_swing")),
    entry("density", "Density", "businesses ÷ people living there × 10,000", "n1", density(R), density(A), derived("business_count/population_1jan")),
    /* the small firms' share: business/eurostat-sbs-size.json, the share of sales made by businesses under 10 people */
    entry("small-firms-share", "Small firms' share", "sales of businesses under 10 people ÷ all sales", "%", table(F.SIZE, "turnover_share_by_size", R, "0 to 9"), table(F.SIZE, "turnover_share_by_size", A, "0 to 9"), at("SIZE", "turnover_share_by_size", "0 to 9 persons employed")),
  ];
  if (list.some((x) => x === null)) return null;
  return list as Ratio[];
}

/** The four ratios of an hour of staff time, the first group behind the fold (euros and cents: one count of decimals a column). */
export const HOUR_RATIOS = ["sales-per-staff-hour", "wage-cost-an-hour", "value-added-an-hour", "what-an-hour-leaves"] as const;

/* ------------------------------------------------------------------ the page */

export type V6Table = { count: number; first: V4Row[]; rest: V4Row[]; best: IndustryV4["table"]["best"] };
export type V6Months = IndustryV4["months"] & { /** month indexes by sales, busiest first: [0] the focal, [1] and [2] in ink */ order: number[] };
export type V6Ratios = {
  /** the eight shares on arrival */
  first: Ratio[];
  /** behind the fold: an hour of staff time, then the business and the trade */
  hour: Ratio[];
  trade: Ratio[];
  /** "What they say": the staff hour's sales against the average business's, under a third or about a third */
  hourThird: "under" | "about";
  byKey: Record<string, Ratio>;
};
export type IndustryV6 = Omit<IndustryV4, "table" | "months"> & { table: V6Table; months: V6Months; ratios: V6Ratios };

/** The slugs v6 draws: wherever v4 draws and every ratio holds. The route and the harness ask this one question. */
export function drawsIndustryV6(slug: string): boolean {
  return buildIndustryV6(slug) !== null;
}

const cache = new Map<string, IndustryV6 | null>();

export function buildIndustryV6(slug: string): IndustryV6 | null {
  const key = slug.toLowerCase();
  if (cache.has(key)) return cache.get(key) ?? null;
  const built = build(key);
  cache.set(key, built);
  return built;
}

function build(slug: string): IndustryV6 | null {
  const v4 = buildIndustryV4(slug);
  if (!v4 || v4.trade !== R) return null;
  const all = buildRatios();
  if (!all) return null;

  /* the country table, v6's cut (the target's `rs[:7] + [us]`, `rs[7:]`): v4's rows are already ranked by operating profit with the
     United States last of its first part */
  const ranked = [...v4.table.first.filter((r) => r.ownSurvey !== "US"), ...v4.table.rest];
  const us = v4.table.first.find((r) => r.ownSurvey === "US");
  if (!us) return null;
  const table: V6Table = { count: v4.table.count, first: [...ranked.slice(0, 7), us], rest: ranked.slice(7), best: v4.table.best };

  /* the months: busiest first; the busiest the section's focal part, the next two in ink (the target's `order`) */
  const order = v4.months.shape.map((_, i) => i).sort((a, b) => v4.months.shape[b] - v4.months.shape[a] || a - b);
  const months: V6Months = { ...v4.months, order };

  const byKey = Object.fromEntries(all.map((r) => [r.key, r]));
  const h = byKey["sales-per-staff-hour"].raw;
  const ratios: V6Ratios = {
    first: all.slice(0, 8),
    hour: all.slice(8).filter((r) => (HOUR_RATIOS as readonly string[]).includes(r.key)),
    trade: all.slice(8).filter((r) => !(HOUR_RATIOS as readonly string[]).includes(r.key)),
    hourThird: (h.restaurants as number) / (h.all as number) < 1 / 3 ? "under" : "about",
    byKey,
  };
  return { ...v4, table, months, ratios };
}

export { EU, d1, moneyCents, srcOf };
export type { Money };
