/**
 * src/lib/uk/present/precision.ts
 *
 * How many digits a figure may print, decided by what the figure knows, never by taste.
 *
 * HONEST UNIT, the measurement convention: a figure with an uncertainty range [lo, hi] (rounding in the register, an
 * interval, the spread of a model's assumptions) prints at the place of the leading digit of its half-width
 * h = (hi - lo) / 2, so u = 10^floor(log10 h): the uncertainty is good to one digit, and the figure is printed to that
 * digit's place, no finer. The printed figure is then within the range widened by half a unit. And never more than three
 * significant figures, whatever the range: "281,900" claims a precision a reader cannot use; "282,000" does not.
 *   London restaurants' median 281.9k, range 280.3k to 283.5k (h = 1.6k): u = 1,000, prints 282,000.
 *   Camden's hair and beauty median 76.4k, range 73.9k to 81.1k (h = 3.6k): u = 1,000, prints 76,000.
 *   A London restaurant at the median keeps 13,756, 11,534 to 15,558 across the band shapes (h = 2,012): prints 14,000.
 *   A living-wage hire, exact law, no range: three significant figures, 28,300.
 * A half-width that is a power of ten in decimal can land a hair below it in floating point (3,234.14 - 1,234.14 is
 * 1,999.9999999999998), so the comparison allows a relative 1e-9. A range must hold its figure between two finite ends:
 * one end, an end that is not a finite number (an infinite one would widen the unit forever) or a figure outside its
 * range is refused, never printed as if exact.
 *
 * ROUNDING is half away from zero, as pennies rounds, so a loss rounds as the same profit does (-4,500 to the 1,000 is
 * -5,000, not -4,000), and a figure that rounds to nothing is 0, never -0 (which a formatter prints as "-0").
 *
 * ONE COLUMN, ONE DECIMAL COUNT (MODEL PART 5): a column prints every value with the decimals its most precise member
 * needs, up to a cap, so 26 and 28.9 print as 26.0 and 28.9. A value has k decimals when 10^k times it is a whole number
 * to within floating-point noise, which grows with the number: 1e-13 of it, at least 1e-9 (100 x 299,264.78 is
 * 29,926,478.000000004).
 *
 * SHARES THAT ADD UP: largest remainder. Floor every share, then hand the missing units to the largest remainders (ties to
 * the earlier row), so a split of 100 prints as integers that sum to 100. Remainders are compared on a grid of 1e-9, so
 * two that are equal in decimal tie even when floating point leaves them a few ulps apart (4, 1, 1 of 100: each has two
 * thirds over, and the first two rows get the units).
 */
export function honestUnit(value: number, lo?: number, hi?: number, maxSigFigs = 3): number {
  if (!Number.isFinite(value)) throw new RangeError(`honestUnit: not a finite figure (${value})`);
  const ranged = lo !== undefined || hi !== undefined;
  const l = lo ?? Number.NaN, h = hi ?? Number.NaN;
  if (ranged && !(Number.isFinite(l) && Number.isFinite(h) && l <= value && value <= h)) throw new RangeError(`honestUnit: a range needs two finite ends around its figure (${lo} to ${hi}, figure ${value})`);
  if (!Number.isInteger(maxSigFigs) || maxSigFigs < 1) throw new RangeError(`honestUnit: not a count of significant figures (${maxSigFigs})`);
  const half = ranged ? (h - l) / 2 : 0;
  let u = 1;
  while (u * 10 <= half * (1 + 1e-9)) u *= 10;
  const magnitude = Math.abs(value) > 0 ? Math.floor(Math.log10(Math.abs(value))) : 0;
  const sigUnit = Math.pow(10, Math.max(0, magnitude - maxSigFigs + 1));
  return Math.max(u, sigUnit);
}

export function roundToUnit(value: number, unit: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(unit) || unit <= 0) throw new RangeError(`roundToUnit: not a figure and a unit (${value}, ${unit})`);
  const q = Math.round(Math.abs(value) / unit) * unit;
  return q === 0 ? 0 : Math.sign(value) * q;
}

export function honestRound(value: number, lo?: number, hi?: number): number {
  return roundToUnit(value, honestUnit(value, lo, hi));
}

export function decimalsForColumn(values: readonly number[], cap = 1): number {
  if (!Number.isInteger(cap) || cap < 0) throw new RangeError(`decimalsForColumn: not a cap (${cap})`);
  let d = 0;
  for (const v of values) {
    if (!Number.isFinite(v)) throw new RangeError(`decimalsForColumn: not a finite figure (${v})`);
    for (let k = 0; k <= cap; k++) {
      const x = v * Math.pow(10, k);
      if (Math.abs(x - Math.round(x)) <= Math.max(1e-9, Math.abs(x) * 1e-13)) {
        d = Math.max(d, k);
        break;
      }
      if (k === cap) d = cap;
    }
  }
  return d;
}

export function largestRemainder(shares: readonly number[], total = 100): number[] {
  if (!Number.isInteger(total) || total < 0) throw new RangeError(`largestRemainder: not a whole total (${total})`);
  for (let i = 0; i < shares.length; i++) {
    const s = shares[i];
    if (!Number.isFinite(s) || s < 0) throw new RangeError(`largestRemainder: share ${i + 1} is not a share (${s})`);
  }
  const sum = shares.reduce((a, b) => a + b, 0);
  if (sum <= 0) return shares.map(() => 0);
  const exact = shares.map((s) => (s / sum) * total);
  const floors = exact.map(Math.floor);
  let missing = total - floors.reduce((a, b) => a + b, 0);
  const order = exact.map((e, i) => ({ i, r: Math.round((e - Math.floor(e)) * 1e9) })).sort((a, b) => b.r - a.r || a.i - b.i);
  for (const { i } of order) {
    if (missing <= 0) break;
    floors[i] += 1;
    missing -= 1;
  }
  return floors;
}
