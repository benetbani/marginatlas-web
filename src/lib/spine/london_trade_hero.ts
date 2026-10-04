/**
 * src/lib/spine/london_trade_hero.ts
 *
 * A London trade page's masthead and sales strip (plan 06, task A5; his rulings of 2026-10-04: Greater London; break-even
 * leads, with what the middle business keeps as a sole trader beside it and the company's figure under the plus).
 *
 * Until 2026-10-04 the 18 money pages printed one hand-typed model file (data/london/london_market_v1.json, "directional
 * ranges, not exact measurements"): a take-home, a margin "from this city's own figures", a firm count and sales tagged as
 * measured (sales above the register's median on 18 of 20 trades, up to 3.5 times), and a band of 0.5 and 1.8 times the
 * typical under "bottom tenth" and "top tenth". The other 120 printed "Not known yet". Now every London trade with a register
 * row leads with a figure, and every figure says what it is:
 *
 *  - THE THREE TRADES WHOSE MONEY PRINTS (the engine withholds nothing and the recipe carries utilities: restaurants, nail
 *    salons, sports and fitness; plan 06 rule (g)): break-even sales for an average London premises of the trade's kind, the
 *    share of registered businesses above it, and the middle business's keeps as a sole trader (an estimate: the engine's
 *    range covers the band shapes only), with the company's under the plus. Only the median's keeps print: the London rate
 *    supplement, which the engine does not read, reaches a restaurant's upper quartile.
 *  - EVERY OTHER LONDON TRADE WITH A REGISTER ROW: the register's typical (median) yearly sales, its count of enterprises and
 *    the share under 100,000 pounds, a shared code naming its group.
 *
 * Every money figure is converted at the site's pound rate and rounded once (honestRound on the dollars, mid and range
 * converted together). No source agency is named on the card (R-002 as ruled: the sources page names them).
 */
import premisesJson from "../../../data/uk/registers/premises.json";
import type { KvCell } from "@/components/spine/archetypes/KvGrid";
import type { DetailRow } from "@/components/spine/archetypes/DetailPanel";
import { londonTradeRegister, londonTradeSales, OPEN_ABOVE_GBP, OPEN_BELOW_GBP, type SalesQuantile } from "@/lib/uk/registers/london_trade";
import { londonTradeRanges, londonWithholding } from "@/lib/uk/pnl/london";
import { RECIPES } from "@/lib/uk/pnl/recipes";
import type { Range } from "@/lib/uk/pnl/ranges";
import { convertToUsd } from "@/lib/finance/fx";
import { honestRound } from "@/lib/uk/present/precision";
import { usd } from "@/lib/spine/money";
import { COPY } from "@/lib/spine/copy";

const PREMISES = premisesJson as unknown as { trade_category: Record<string, string> };

/** The valuation's kind of premises for the three money trades, as the noun a reader says. A kind without a noun prints no money. */
export const PREMISES_NOUN: Readonly<Record<string, string>> = {
  Restaurants: "restaurant",
  "Hairdressing/Beauty Salons": "salon",
  "Gymnasia/Fitness Suites": "gym",
};

export type LondonTradeHero = {
  kind: "breakEven" | "sales";
  answer: { label: string; value: string; basis: string; confidence: "measured" | "modeled" };
  cells: KvCell[];
  /** The company's keeps beside the sole trader's, under the plus, on a money trade. */
  detail: { summary: string; rows: DetailRow[] } | null;
  foot: string;
};

export type LondonStripMark = { key: "p10" | "typical" | "p90"; label: string; value: number; lead?: boolean };
export type LondonTradeStrip = { marks: LondonStripMark[]; basis: string };

const C = () => COPY.londonTrade;
const usdOf = (gbp: number): number => convertToUsd("GBP", gbp) ?? Number.NaN;
/** A range of pounds rounded once in dollars. */
const roundRange = (r: Range): number => honestRound(usdOf(r.mid), usdOf(r.lo), usdOf(r.hi));
const percentOf = (r: Range): number => honestRound(r.mid * 100, r.lo * 100, r.hi * 100);

/** Plan 06 rule (g): money prints only where the engine withholds nothing and the recipe carries utilities. */
export function londonMoneyPrints(slug: string): boolean {
  return londonWithholding(slug) === null && RECIPES[slug]?.utilitiesCarried === true;
}

function firmsCell(slug: string): KvCell | null {
  const reg = londonTradeRegister(slug);
  if (!reg) return null;
  return {
    key: "firms",
    label: C().cells.firms,
    value: reg.enterprises.toLocaleString("en-US"),
    ...(reg.group ? { note: C().cells.firmsGroup.replace("{group}", reg.group) } : {}),
    confidence: "measured",
  };
}

function breakEvenHero(slug: string): LondonTradeHero | null {
  if (!londonMoneyPrints(slug)) return null;
  const noun = PREMISES_NOUN[PREMISES.trade_category[slug] ?? ""];
  const st = londonTradeRanges(slug, "sole trader");
  const co = londonTradeRanges(slug, "company");
  const firms = firmsCell(slug);
  if (!noun || !st || !co || !st.shareAbove || !firms) return null;
  const keepsSt = usd(roundRange(st.keepsQ50));
  return {
    kind: "breakEven",
    answer: { label: C().breakEvenLabel, value: usd(roundRange(st.breakEven)), basis: C().breakEvenBasis.replace("{noun}", noun), confidence: "modeled" },
    cells: [
      { key: "above", label: C().cells.above, value: `${percentOf(st.shareAbove)} of 100`, confidence: "modeled" },
      { key: "keeps", label: C().cells.keeps, value: keepsSt, note: C().cells.keepsNote, confidence: "modeled" },
      firms,
    ],
    detail: {
      summary: C().companySummary,
      rows: [
        { label: C().companyRow, value: usd(roundRange(co.keepsQ50)) },
        { label: C().soleTraderRow, value: keepsSt },
      ],
    },
    foot: C().foot,
  };
}

const openWords = (q: Exclude<SalesQuantile, { open: false }>) =>
  `${q.open === "below" ? C().under : C().over} ${usd(honestRound(usdOf(q.open === "below" ? OPEN_BELOW_GBP : OPEN_ABOVE_GBP)))}`;

function salesHero(slug: string): LondonTradeHero | null {
  const reg = londonTradeRegister(slug);
  const sales = londonTradeSales(slug);
  const firms = firmsCell(slug);
  if (!reg || !sales || !firms) return null;
  const q50 = sales.q50;
  const value =
    q50.open !== false
      ? openWords(q50)
      : sales.medianRangeGbp
        ? usd(honestRound(usdOf(q50.gbp), usdOf(sales.medianRangeGbp[0]), usdOf(sales.medianRangeGbp[1])))
        : usd(honestRound(usdOf(q50.gbp)));
  return {
    kind: "sales",
    answer: {
      label: C().salesLabel,
      value,
      basis: reg.group ? C().salesBasisGroup.replace("{group}", reg.group) : C().salesBasis,
      confidence: "measured",
    },
    cells: [
      firms,
      { key: "under", label: C().cells.under.replace("{edge}", usd(honestRound(usdOf(100_000)))), value: `${Math.round(sales.shareUnder100k * 100)} of 100`, confidence: "measured" },
    ],
    detail: null,
    foot: C().foot,
  };
}

/** The masthead's facts for a London trade, or null when the register holds no row the page may print. */
export function londonTradeHero(slug: string): LondonTradeHero | null {
  if (!londonTradeRegister(slug) || !londonTradeSales(slug)) return null;
  return breakEvenHero(slug) ?? salesHero(slug);
}

/** The sales strip: the register's bottom tenth, median and top tenth (his N9 of 2026-08-30: "the average, the top ten percent
 *  and the bottom ten percent", never the quarters), each rounded once; a tenth in an open band draws no mark (the register
 *  cannot place it) and the basis says where it lies. */
export function londonTradeStrip(slug: string): LondonTradeStrip | null {
  const reg = londonTradeRegister(slug);
  const sales = londonTradeSales(slug);
  if (!reg || !sales) return null;
  const head = londonTradeHero(slug);
  const marks: LondonStripMark[] = [];
  const opens: string[] = [];
  const mark = (key: LondonStripMark["key"], q: SalesQuantile, label: string, lead = false) => {
    if (q.open !== false) { opens.push(`${label.toLowerCase()} ${openWords(q)}`); return; }
    /* The middle mark is the head's own figure (the same median rounded once through its range), so the strip and the
       answer are one number; the tenths hold no range in the file, so they round to three figures. */
    const value = key === "typical" && sales.medianRangeGbp
      ? honestRound(usdOf(q.gbp), usdOf(sales.medianRangeGbp[0]), usdOf(sales.medianRangeGbp[1]))
      : honestRound(usdOf(q.gbp));
    marks.push({ key, label, value, ...(lead ? { lead: true } : {}) });
  };
  mark("p10", sales.q10, COPY.customers.marks.bottom);
  mark("typical", sales.q50, COPY.customers.marks.typical, true);
  mark("p90", sales.q90, COPY.customers.marks.top);
  if (marks.length < 2 || !head) return null;
  const basis = reg.group ? C().stripBasisGroup.replace("{group}", reg.group) : C().stripBasis;
  /* A tenth in an open band is said in the one line, inside the copy gate's twelve words ("Every hair or beauty business in
     London, bottom tenth under $66K."; no semicolon, the copy gate's rule). */
  return { marks, basis: opens.length ? `${basis.replace(/\.$/, "")}, ${opens.join(", ")}.` : basis };
}
