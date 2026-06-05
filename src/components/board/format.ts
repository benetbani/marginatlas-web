/**
 * src/components/board/format.ts
 *
 * The single formatting layer for the data board. Every board primitive
 * routes its numbers through these helpers so blanks, units, and grouping
 * read the same on every page. There is exactly one blank token (MISSING, a
 * plain hyphen) and it is never an em-dash, so the no-em-dash gate stays
 * green by construction.
 *
 * Rules shared by all helpers:
 *   - null, undefined, NaN, and Infinity all collapse to MISSING. A board
 *     cell is either a real figure or a dash, never a raw "NaN" or "0" stand
 *     in for absent data.
 *   - USD only. The board is a single-currency surface; callers normalise to
 *     USD upstream (see the cell pipeline) before formatting.
 *   - These are pure string builders. No React, no tokens, no side effects.
 */

/**
 * The one canonical blank value for the whole board. A plain ASCII hyphen,
 * never an em-dash or en-dash. Import this anywhere a value might be absent
 * so every blank cell matches exactly.
 */
export const MISSING = "-";

/** True only for a real, finite number we can format. */
function isReal(n: number | null | undefined): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

/**
 * USD money, compacted for scale. Millions and thousands collapse to "$1.2M"
 * / "$340K"; anything under a thousand groups with separators ("$12,000").
 * Negatives keep the sign ahead of the dollar mark ("-$1.2M").
 */
export function fmtUSD(n: number | null | undefined): string {
  if (!isReal(n)) return MISSING;
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) {
    return `${sign}$${trimDecimal(abs / 1_000_000)}M`;
  }
  if (abs >= 100_000) {
    // Hundreds of thousands compact to "K" ("$340K"); below 100k the exact
    // grouped figure reads better ("$12,000", not "$12K"), matching the board
    // examples. The 100k cutoff is where the rounded "K" stops losing useful
    // precision.
    return `${sign}$${trimDecimal(abs / 1_000)}K`;
  }
  return `${sign}$${Math.round(abs).toLocaleString("en-US")}`;
}

/**
 * Percent. Pass a whole-number percent by default ("42" renders "42%"); pass
 * `fromFraction` when the input is a 0..1 share ("0.42" renders "42%").
 * Rounds to a whole percent, which is the board's grain.
 */
export function fmtPct(
  x: number | null | undefined,
  opts?: { fromFraction?: boolean },
): string {
  if (!isReal(x)) return MISSING;
  const pct = opts?.fromFraction ? x * 100 : x;
  if (!Number.isFinite(pct)) return MISSING;
  return `${Math.round(pct)}%`;
}

/** Grouped integer ("1,234,567"), else MISSING. Rounds non-integers. */
export function fmtInt(n: number | null | undefined): string {
  if (!isReal(n)) return MISSING;
  return Math.round(n).toLocaleString("en-US");
}

/**
 * Grouped number that keeps up to one decimal place ("3,141.6"), else
 * MISSING. For counts that are not whole but should still group thousands.
 */
export function fmtNum(n: number | null | undefined): string {
  if (!isReal(n)) return MISSING;
  return n.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

/**
 * One decimal place, but drop a trailing ".0" so "1,200,000" reads "1.2"
 * while "2,000,000" reads "2" rather than "2.0". Shared by the compact
 * money branches above.
 */
function trimDecimal(n: number): string {
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r)
    ? r.toLocaleString("en-US")
    : r.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
}
