/**
 * Plan v15 Block 8a — Pareto-tail extrapolation.
 *
 * Given the p50 (median) and p90 (top-decile) revenue anchors that ship
 * with every benchmark, fit a single-parameter power-law to the upper
 * tail and read off the top 1% (p99) and top 0.1% (p99.9) values.
 *
 * Model: the upper tail is assumed Pareto-distributed, i.e. for x ≥ p50,
 *   P(X > x) = (p50 / x)^α
 * Calibrate α from the observed p50 and p90:
 *   P(X > p50) = 0.5    →  c = log(0.5) + α·log(p50)
 *   P(X > p90) = 0.1    →  c = log(0.1) + α·log(p90)
 * Subtract  →  log(0.2) = α · log(p50/p90)
 *             α = log(5) / log(p90/p50)
 *
 * Read off p99 and p99.9:
 *   P(X > p_q) = 1 − q       →  p_q = p50 · (0.5 / (1 − q))^(1/α)
 *   p99   = p50 · (50)^(1/α)
 *   p99.9 = p50 · (500)^(1/α)
 *
 * Sanity guards:
 *  - α must be > 1 for a finite mean. Returns null otherwise (long-tail
 *    is too thick to extrapolate confidently from two anchors).
 *  - p90 must exceed p50 strictly. Equal or inverted anchors → null.
 *  - Both inputs must be positive.
 */

export type ParetoTail = {
  alpha: number;
  p99: number;
  p999: number;
};

export function paretoTail(
  p50: number | null | undefined,
  p90: number | null | undefined,
): ParetoTail | null {
  if (p50 == null || p90 == null) return null;
  if (!(p50 > 0) || !(p90 > 0)) return null;
  if (p90 <= p50) return null;

  const alpha = Math.log(5) / Math.log(p90 / p50);
  if (!Number.isFinite(alpha) || alpha <= 1) return null;

  const p99 = p50 * Math.pow(50, 1 / alpha);
  const p999 = p50 * Math.pow(500, 1 / alpha);

  if (!Number.isFinite(p99) || !Number.isFinite(p999)) return null;
  return { alpha, p99, p999 };
}
