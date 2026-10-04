/**
 * src/lib/uk/pnl/ranges.ts
 *
 * How far the headline figures move with the one assumption the register cannot settle: how businesses spread inside a
 * turnover band. The shape sets the anchor (the business in the average premises, model.ts), the register's quartiles and
 * the share of businesses above break-even, so each run reads all of them under one of the three shapes (banded.ts
 * BandShape): the founder's decision 9 (2026-10-04), consistent ranges, so no figure claims more than the band shapes allow,
 * its own sales included. `mid` is the log-flat run, the figure the summary prints, and `lo` and `hi` the least and greatest
 * of the three. A page prints `mid` rounded to its range (present/precision.ts honestRound).
 *
 * Measured on London, 2026-10-04: the anchor moves 4.6% to 6.5% either way (hair and beauty 6.2% below, 6.5% above); the median barbershop's take-home 23,743.01 to
 * 26,986.22 around 25,407.33 (it prints 25,000), the restaurant's 11,198.28 to 16,056.34 around 13,756.27 (14,000). Break-even
 * rests on the anchor alone, so its range is the anchor's.
 */
import { bandMeanK, type BandShape } from "./banded";
import { pennies } from "../law/money";
import { summarise, type PnlInputs, type PnlSummary } from "./model";

export type Range = { lo: number; mid: number; hi: number };
export type PnlRanges = { anchorSales: Range; breakEven: Range; shareAbove: Range; keepsQ50: Range; marginAtMedian: Range };

const SHAPES: readonly BandShape[] = ["pareto", "log-flat", "flat"];

export function shapeRanges(inputs: PnlInputs): PnlRanges | null {
  const runs: { anchor: number; s: PnlSummary }[] = [];
  for (const shape of SHAPES) {
    const m = bandMeanK(inputs.revenueBandsK, 7, shape);
    if (!m) return null;
    const anchor = pennies(m.k * 1000);
    const s = summarise({ ...inputs, anchorSales: { ...inputs.anchorSales, value: anchor } }, shape);
    if (!s || !s.shareAbove) return null;
    runs.push({ anchor, s });
  }
  const range = (f: (r: { anchor: number; s: PnlSummary }) => number): Range => {
    const v = runs.map(f);
    return { lo: Math.min(...v), mid: v[1], hi: Math.max(...v) };
  };
  return {
    anchorSales: range((r) => r.anchor),
    breakEven: range((r) => r.s.breakEven.value),
    shareAbove: range((r) => r.s.shareAbove!.value),
    keepsQ50: range((r) => r.s.keeps.q50),
    marginAtMedian: range((r) => r.s.marginAtMedian),
  };
}
