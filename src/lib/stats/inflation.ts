/**
 * Plan v15 Block 8b — inflation roll-forward.
 *
 * Source benchmarks are typically tagged with the calendar year of the
 * underlying release (often 1-3 years stale from "right now"). To keep
 * the figures legible to a casual visitor in 2025, we roll the headline
 * percentiles forward using a country-specific cumulative CPI factor.
 *
 * Methodology:
 *  - Annual CPI YoY % from 2020 through 2025 by ISO-2 country code.
 *  - Numbers are mid-range working estimates compiled from public IMF
 *    / World Bank / national statistical-office releases — not a live
 *    feed. Refreshed quarterly in source control.
 *  - For countries not listed, falls back to a 3 % YoY default — broad
 *    enough for cross-country headline benchmarking without overstating
 *    any specific economy.
 *  - Inflation rates are applied multiplicatively year-on-year.
 *
 * This helper is intentionally narrow: it returns a multiplier, and a
 * convenience rollForward(value, fromYear, iso2). The data layer can
 * opt-in to apply the roll-forward inside cells.ts, or any component can
 * apply it for a single surface. Cell.year is not modified by the helper
 * — that's a caller decision.
 */

const TARGET_YEAR = 2025;
const DEFAULT_YOY_PCT = 3.0;

/**
 * Annual CPI YoY % by ISO-2. Top economies + a handful of high-inflation
 * cases that would otherwise read absurd if forced through the 3 %
 * default. Order: 2020, 2021, 2022, 2023, 2024, 2025 (provisional).
 */
const COUNTRY_CPI: Record<string, number[]> = {
  // year:           2020   2021   2022   2023   2024   2025
  US: [              1.2,   4.7,   8.0,   4.1,   2.9,   2.7],
  GB: [              0.9,   2.6,   9.1,   7.3,   2.5,   2.4],
  DE: [              0.5,   3.1,   6.9,   5.9,   2.3,   2.1],
  FR: [              0.5,   1.6,   5.2,   4.9,   2.1,   2.0],
  IT: [             -0.1,   1.9,   8.2,   5.9,   1.7,   1.9],
  ES: [             -0.3,   3.1,   8.4,   3.5,   2.8,   2.4],
  JP: [              0.0,  -0.2,   2.5,   3.3,   2.4,   2.0],
  CA: [              0.7,   3.4,   6.8,   3.9,   2.4,   2.2],
  AU: [              0.9,   2.9,   6.6,   5.6,   3.3,   2.8],
  CH: [             -0.7,   0.6,   2.8,   2.1,   1.1,   1.0],
  NL: [              1.3,   2.7,  10.0,   3.8,   3.2,   2.5],
  SE: [              0.5,   2.2,   8.4,   5.9,   2.0,   1.9],
  NO: [              1.3,   3.5,   5.8,   5.5,   3.2,   2.5],
  DK: [              0.3,   1.9,   7.7,   3.4,   1.7,   1.8],
  IE: [             -0.5,   2.4,   7.8,   6.3,   2.1,   2.0],
  PT: [             -0.1,   1.3,   7.8,   4.3,   2.4,   2.1],
  GR: [             -1.3,   1.2,   9.6,   4.2,   2.7,   2.1],
  PL: [              3.4,   5.1,  14.4,  11.4,   4.8,   3.6],
  CZ: [              3.2,   3.8,  15.1,  10.7,   2.5,   2.4],
  HU: [              3.3,   5.1,  14.5,  17.6,   3.7,   3.8],
  RO: [              2.6,   5.0,  13.8,  10.4,   5.5,   4.2],
  TR: [             12.3,  19.6,  72.3,  53.9,  58.5,  35.0],
  AR: [             42.0,  48.4,  72.4, 133.5, 211.4, 110.0],
  BR: [              3.2,   8.3,   9.3,   4.6,   4.4,   4.0],
  MX: [              3.4,   5.7,   7.9,   5.5,   4.7,   3.9],
  CL: [              3.0,   4.5,  11.6,   7.6,   3.9,   3.6],
  CO: [              2.5,   3.5,  10.2,  11.4,   6.6,   4.4],
  IN: [              6.6,   5.1,   6.7,   5.7,   4.9,   4.3],
  CN: [              2.5,   0.9,   2.0,   0.2,   0.3,   0.6],
  KR: [              0.5,   2.5,   5.1,   3.6,   2.3,   2.0],
  ID: [              2.0,   1.6,   4.2,   3.7,   2.6,   2.5],
  TH: [             -0.8,   1.2,   6.1,   1.2,   0.5,   1.4],
  MY: [             -1.1,   2.5,   3.4,   2.5,   1.9,   2.1],
  PH: [              2.4,   3.9,   5.8,   6.0,   3.2,   3.0],
  VN: [              3.2,   1.8,   3.2,   3.3,   3.6,   3.4],
  ZA: [              3.3,   4.6,   6.9,   5.9,   4.4,   4.1],
  EG: [              5.7,   5.2,  13.9,  33.9,  28.0,  18.0],
  NG: [             13.2,  17.0,  18.8,  24.7,  33.2,  20.0],
  KE: [              5.2,   6.1,   7.6,   7.7,   5.3,   4.8],
  IL: [             -0.6,   1.5,   4.4,   4.2,   3.1,   2.7],
  AE: [             -2.1,  -0.1,   4.8,   1.6,   2.2,   2.4],
  SA: [              3.4,   3.1,   2.5,   2.3,   1.7,   2.0],
  NZ: [              1.7,   3.9,   7.2,   5.7,   2.9,   2.4],
  SG: [             -0.2,   2.3,   6.1,   4.8,   2.4,   2.0],
};

const CPI_BASE_YEAR = 2020;

/**
 * Cumulative inflation factor between two calendar years for a country.
 * Returns 1 if fromYear >= toYear (no roll-forward needed or backwards).
 */
export function cumulativeFactor(
  fromYear: number,
  toYear: number = TARGET_YEAR,
  iso2: string | null | undefined,
): number {
  if (!Number.isFinite(fromYear) || !Number.isFinite(toYear)) return 1;
  if (fromYear >= toYear) return 1;

  const code = (iso2 || "").toUpperCase();
  const series = COUNTRY_CPI[code];

  let factor = 1;
  for (let y = fromYear + 1; y <= toYear; y++) {
    const idx = y - CPI_BASE_YEAR;
    const pct =
      series && idx >= 0 && idx < series.length ? series[idx] : DEFAULT_YOY_PCT;
    factor *= 1 + pct / 100;
  }
  return factor;
}

/**
 * Apply roll-forward to a single value. Returns the value untouched if
 * the input is null/undefined or the from-year is already at or beyond
 * the target year.
 */
export function rollForward(
  value: number | null | undefined,
  fromYear: number | null | undefined,
  iso2: string | null | undefined,
  toYear: number = TARGET_YEAR,
): number | null {
  if (value == null || !Number.isFinite(value)) return null;
  if (fromYear == null) return value;
  const f = cumulativeFactor(fromYear, toYear, iso2);
  return value * f;
}

export const INFLATION_TARGET_YEAR = TARGET_YEAR;
