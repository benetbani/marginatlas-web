/**
 * src/lib/uk/law/money.ts
 *
 * Rounding, the one way the vertical rounds money.
 *
 * WHY AN EPSILON. 0.03 x 18,544.50 (the pension minimum on a living-wage year) is 556.335 exactly in decimal, but in
 * binary floating point it is 556.33499999999992269..., and times 100 it stays below the half, so Math.round(x * 100) / 100
 * gives 556.33 where every payroll and every gov.uk worked example prints 556.34. (0.15 x 19,784.50 = 2,967.675 happens to
 * survive: its product times 100 lands exactly on the half. Luck is not a rule.) Adding 1e-7 of a penny before rounding
 * moves a value that is a half-penny in decimal onto the right side and moves nothing else: no amount the vertical computes
 * has a genuine fraction of a penny closer than 1e-7 to a half.
 *
 * WHY PARTS FIRST. A bill printed as lines must add up to its printed total, so every itemised total is the sum of its
 * rounded lines (sumPennies), never the rounding of the raw sum. On a living-wage hire the two differ by a penny
 * (28,308.52 against 28,308.51), and the reader can add the lines.
 */
export function pennies(x: number): number {
  if (!Number.isFinite(x)) throw new Error(`pennies: not a finite amount (${x})`);
  const sign = x < 0 ? -1 : 1;
  return (sign * Math.round(Math.abs(x) * 100 + 1e-7)) / 100;
}

/** The sum of already-rounded lines, itself exact to the penny (integer arithmetic on pence). */
export function sumPennies(lines: readonly number[]): number {
  let pence = 0;
  for (const l of lines) pence += Math.round(pennies(l) * 100);
  return pence / 100;
}

/** Tax over a list of bands [{upTo, rate}], each band's tax rounded to the penny, summed as pence. */
export function bandedTax(amount: number, bands: readonly { upTo: number; rate: number }[]): number {
  let lower = 0;
  const lines: number[] = [];
  for (const b of bands) {
    if (amount <= lower) break;
    const slice = Math.min(amount, b.upTo) - lower;
    lines.push(slice * b.rate);
    lower = b.upTo;
  }
  return sumPennies(lines);
}
