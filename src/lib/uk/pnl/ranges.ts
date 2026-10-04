/**
 * src/lib/uk/pnl/ranges.ts
 *
 * How far the headline figures move with the one assumption the register cannot settle: how businesses spread inside a
 * turnover band, which sets the anchor (the business in the average premises, model.ts). The figures are recomputed with
 * the anchor at each of the three band shapes (banded.ts BandShape); `mid` is the log-flat reading, the one every quantile
 * uses, and `lo` and `hi` the least and greatest of the three. A page prints `mid` rounded to its range
 * (present/precision.ts honestRound), so no figure claims more than the band shapes allow for the anchor.
 *
 * The range moves the anchor only: the register's quartiles and the share above break-even are read log-flat in every run,
 * so the range is conditional on the register's median. Reading them under each shape too widens it (the median
 * barbershop's take-home 23,743.01 to 26,986.22 instead of 24,951.65 to 25,830.38; restaurants 11,198.28 to 16,056.34 instead
 * of 11,533.69 to 15,558.30); which to print waits for the founder (decision 9 in the master plan).
 *
 * Measured on London, 2026-10-02: the anchor moves about 5% either way; the median business's take-home moves most where
 * its margin is thin (restaurants 11,534 to 15,558 around 13,756).
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
    const s = summarise({ ...inputs, anchorSales: { ...inputs.anchorSales, value: anchor } });
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
