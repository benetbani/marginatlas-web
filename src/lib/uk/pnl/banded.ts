/**
 * src/lib/uk/pnl/banded.ts
 *
 * The register's turnover bands, read as a distribution: the same estimator as registers/uk/estimators/banded.py, ported
 * so a page can ask "what share of these businesses take more than X?" for any X a reader sets with a lever. The two
 * implementations are held equal by tests/uk/pnl/banded.test.ts, whose expected values were produced by the Python one.
 *
 * Inside a band [L, U) businesses are spread evenly on a log scale; the first band is floored at 5k and the open top band
 * capped at 100,000k (amounts in thousands of pounds). A quantile below 50k or above 50,000k rests on the floor or the
 * cap, so it prints only in words ("under 50k", "over 50m": inOpenBand); one exactly on either edge rests on neither and
 * prints as a figure. A quantile on a band's edge is the edge itself, exactly (L (U / L)^frac, as the Python computes it).
 *
 * The quantile and the CDF read the log-flat shape by default, as the Python does; either can be read under the flat or the
 * Pareto shape too (BandShape below), so a figure's range can move every reading of the bands together (ranges.ts; the
 * founder's decision 9, 2026-10-04). Those two shapes are this port's own: the Python prints only the log-flat reading.
 *
 * The counts are the register's ten, numbers, finite and not negative, with a finite total; a sales figure or a q that is
 * not a number, and a shape that is not one of the three, are refused. Anything else would read as an empty area or as
 * nobody below the figure.
 */
export const BANDS_K: ReadonlyArray<readonly [number, number]> = [
  [0, 50], [50, 100], [100, 250], [250, 500], [500, 1000], [1000, 2000], [2000, 5000], [5000, 10000], [10000, 50000], [50000, Infinity],
];
const FLOOR_K = 5;
const TOP_CAP_K = 100_000;

function checkCounts(counts: readonly number[], fn: string): void {
  if (counts.length !== BANDS_K.length) throw new Error(`${fn}: ten band counts expected`);
  if (!counts.every((c) => typeof c === "number" && Number.isFinite(c) && c >= 0) || !Number.isFinite(counts.reduce((a, b) => a + b, 0))) {
    throw new Error(`${fn}: band counts must be finite numbers, not negative, with a finite total`);
  }
}

const SHAPES: readonly string[] = ["flat", "log-flat", "pareto"];

function checkShape(shape: string, fn: string): void {
  if (!SHAPES.includes(shape)) throw new Error(`${fn}: the band shape must be flat, log-flat or pareto (${shape})`);
}

/** The point a fraction f of the way through a band's businesses under each shape: log-flat L (U / L)^f (the Python's
 *  formula), flat L + f (U - L), Pareto (density ~ 1/x^2) 1 / (1/L - f (1/L - 1/U)); the band's edge itself at f = 0 or 1. */
function inBand(low: number, high: number, f: number, shape: BandShape): number {
  if (f === 0) return low;
  if (f === 1) return high;
  if (shape === "flat") return low + f * (high - low);
  if (shape === "pareto") return 1 / (1 / low - f * (1 / low - 1 / high));
  return low * (high / low) ** f;
}

/** How many of a band's c businesses sit below x (low < x < high) under each shape, the inverse of inBand. The log-flat
 *  reading multiplies before it divides, in the Python's order; the two can still part in the last bit where the platforms'
 *  logarithms do (at most 3.2e-15 of the share on 24,000 register cases, 2026-10-04), far below any printed digit. */
function countBelow(c: number, low: number, high: number, x: number, shape: BandShape): number {
  if (shape === "flat") return (c * (x - low)) / (high - low);
  if (shape === "pareto") return (c * (1 / low - 1 / x)) / (1 / low - 1 / high);
  return (c * (Math.log(x) - Math.log(low))) / (Math.log(high) - Math.log(low));
}

function edges(k: number): [number, number] {
  const [lo, hi] = BANDS_K[k];
  return [Math.max(lo, FLOOR_K), Math.min(hi, TOP_CAP_K)];
}

/** Whether a quantile rests on the 5k floor (below 50k) or the 100,000k cap (above 50,000k), so it prints only in words. */
export function inOpenBand(xK: number): boolean {
  return xK < BANDS_K[0][1] || xK > BANDS_K[BANDS_K.length - 1][0];
}

export type Quantile = { k: number; band: number; openBelow: boolean; openAbove: boolean };

/** The q-quantile in thousands of pounds, with the band it fell in; null when there are no businesses. `shape` is how the
 *  businesses spread inside the band it falls in (log-flat, the register's reading, by default). */
export function bandQuantile(counts: readonly number[], q: number, shape: BandShape = "log-flat"): Quantile | null {
  if (typeof q !== "number" || !(q > 0 && q < 1)) throw new Error("bandQuantile: q must be a number strictly between 0 and 1");
  checkShape(shape, "bandQuantile");
  checkCounts(counts, "bandQuantile");
  const n = counts.reduce((a, b) => a + b, 0);
  if (n <= 0) return null;
  const target = q * n;
  let cum = 0;
  for (let k = 0; k < counts.length; k++) {
    const c = counts[k];
    if (c > 0 && cum + c >= target) {
      const [low, high] = edges(k);
      const x = inBand(low, high, (target - cum) / c, shape);
      return { k: x, band: k, openBelow: x < BANDS_K[0][1], openAbove: x > BANDS_K[BANDS_K.length - 1][0] };
    }
    cum += c;
  }
  return null;
}

/**
 * How businesses spread inside one band [L, U), for the mean: "log-flat" (evenly on a log scale, density ~ 1/x, the reading
 * every quantile here uses), "flat" (evenly on the pound, density ~ 1) and "pareto" (density ~ 1/x^2, the shape of a
 * right-skewed size distribution's upper tail). Their means: (U - L) / ln(U / L), (U + L) / 2, L U ln(U / L) / (U - L).
 * The three bracket the plausible shapes; the spread of a figure across them is its shape range (ranges.ts).
 */
export type BandShape = "flat" | "log-flat" | "pareto";

function shapeMean(low: number, high: number, shape: BandShape): number {
  checkShape(shape, "bandMeanK");
  if (shape === "flat") return (low + high) / 2;
  if (shape === "log-flat") return (high - low) / Math.log(high / low);
  return (low * high * Math.log(high / low)) / (high - low);
}

/**
 * The mean sales of the businesses in bands 1 to `uptoBand`, in thousands of pounds, each band at its shape's mean, the
 * first band from the 5k floor. The default stops below 5m: an enterprise above it is mostly a chain, whose turnover is
 * every site's, not one site's. `lo` and `hi` bound the mean whatever the shape inside each band (every business on its
 * band's lower or upper edge, the first band from 0). Null when the bands hold nobody.
 */
export function bandMeanK(counts: readonly number[], uptoBand = 7, shape: BandShape = "log-flat"): { k: number; lo: number; hi: number } | null {
  checkCounts(counts, "bandMeanK");
  if (!(Number.isInteger(uptoBand) && uptoBand >= 1 && uptoBand < BANDS_K.length)) throw new Error("bandMeanK: uptoBand must be 1 to 9 (the top band is open)");
  let n = 0, sum = 0, lo = 0, hi = 0;
  for (let k = 0; k < uptoBand; k++) {
    const [low, high] = BANDS_K[k];
    n += counts[k];
    sum += counts[k] * shapeMean(Math.max(low, FLOOR_K), high, shape);
    lo += counts[k] * low;
    hi += counts[k] * high;
  }
  return n > 0 ? { k: sum / n, lo: lo / n, hi: hi / n } : null;
}

/** The share of businesses with sales below xK (thousands of pounds), the businesses inside each band spread by `shape`. */
export function bandCdf(counts: readonly number[], xK: number, shape: BandShape = "log-flat"): number | null {
  if (typeof xK !== "number" || Number.isNaN(xK)) throw new Error("bandCdf: the sales figure is not a number");
  checkShape(shape, "bandCdf");
  checkCounts(counts, "bandCdf");
  const n = counts.reduce((a, b) => a + b, 0);
  if (n <= 0) return null;
  if (xK <= 0) return 0;
  const x = Math.max(xK, FLOOR_K);
  let below = 0;
  for (let k = 0; k < counts.length; k++) {
    const [low, high] = edges(k);
    if (x >= high) below += counts[k];
    else if (x > low) below += countBelow(counts[k], low, high, x, shape);
  }
  return Math.min(1, below / n);
}
