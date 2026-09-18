/**
 * src/lib/spine/trade_spread_rows.ts
 *
 * A YEAR'S TAKINGS, the trade page's `01 spread` (MODEL.md 8.6; plan step
 * 33's first dispatch, 2026-09-18): the range strip, three marks, linear,
 * the bottom tenth, the typical and the top tenth of a year's turnover, the
 * typical the card's one 30 in ink (the site's strip law, M3; the city
 * strip's precedent, `lead`), the outer marks at 14, no accent (the
 * opening's accent is spent on `00`). Synchronous over the seed the adapter
 * builds, the way the masthead's facts are.
 *
 * THE FIGURES: `headline.rev_p10_usd / rev_p50_usd / rev_p90_usd`, the
 * adapter's rounding of `cellView.masthead.spread` (cell_view.ts). Two
 * shapes, and the basis says which:
 *  - ON LONDON the three are fixed multipliers of the typical (0.5, 1, 1.8;
 *    cell_view.ts marks the band `basis: "modelled"`), a modelled shape, and
 *    the basis is 8.6's own sentence. The view also holds a 0.72 and a 1.35
 *    (p25, p75); they are a modelled artefact, not the form, and the adapter
 *    never carries them, so nothing here drops them: they never arrive.
 *  - OFF LONDON, on a trusted local cell, the cell's own `rev_p10 .. rev_p90`
 *    (California restaurants 116K, 503K, 2.2M), measured, and the basis says
 *    whose figures they are.
 *  - OFF `moneyShown` the view holds no spread (an untrusted cell's revenue
 *    is suppressed), so the card ships PRESENT with its structure and the
 *    withheld line at the lead rung where the figure would stand (PART 5:
 *    withheld, never dropped; the running-costs card's idiom), no figure and
 *    no sample. 8.6's row says "labelled sample" for this state under rule
 *    18; with the sample mark hidden site-wide (MODEL.md, THE SAMPLE MARK IS
 *    BEHIND ONE SWITCH) a sample figure would print as a measurement (clause
 *    32), so the line stands instead, his 2026-09-08 answer on sparse
 *    sections, the same reading every drawn seat took. FOCAL will name the
 *    card until the data lands, which PART 4 says is the finding, not an
 *    exemption.
 */
import { COPY } from "@/lib/spine/copy";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export type TradeSpreadMark = { key: "p10" | "typical" | "p90"; label: string; value: number; lead?: boolean };

export type TradeSpreadData = {
  /** Three marks where the seed holds them, fewer where it holds fewer, none off `moneyShown`. */
  marks: TradeSpreadMark[];
  /** The basis under the strip, or null when the line stands instead. */
  basis: string | null;
  /** The line where the figure would stand, off `moneyShown`, or null. */
  withheld: string | null;
  /** True on London (the fixed multipliers); false on a measured cell; irrelevant when withheld. */
  modelled: boolean;
  /** The Rail's flag: modelled or withheld. */
  sample: boolean;
  /** The figures for the gates. */
  figures: { p10: number | null; p50: number | null; p90: number | null; moneyShown: boolean };
};

export function buildTradeSpread(seed: any): TradeSpreadData | null {
  const meta = seed?.meta;
  if (!meta || typeof meta.trade !== "string") return null;
  const moneyShown = meta.money_shown === true;
  const h = seed?.headline ?? {};
  const p10 = isNum(h.rev_p10_usd) && h.rev_p10_usd > 0 ? h.rev_p10_usd : null;
  const p50 = isNum(h.rev_p50_usd) && h.rev_p50_usd > 0 ? h.rev_p50_usd : null;
  const p90 = isNum(h.rev_p90_usd) && h.rev_p90_usd > 0 ? h.rev_p90_usd : null;
  const modelled = h.rev_spread_basis === "modelled";
  const figures = { p10, p50, p90, moneyShown };
  if (!moneyShown || (p10 == null && p50 == null && p90 == null)) {
    return { marks: [], basis: null, withheld: COPY.tradeSpread.withheld, modelled, sample: true, figures };
  }
  const marks: TradeSpreadMark[] = [];
  if (p10 != null) marks.push({ key: "p10", label: COPY.customers.marks.bottom, value: p10 });
  if (p50 != null) marks.push({ key: "typical", label: COPY.customers.marks.typical, value: p50, lead: true });
  if (p90 != null) marks.push({ key: "p90", label: COPY.customers.marks.top, value: p90 });
  return { marks, basis: modelled ? COPY.tradeSpread.basisModelled : COPY.tradeSpread.basisMeasured, withheld: null, modelled, sample: modelled, figures };
}
