/**
 * Currency conversion helpers.
 *
 * Rates are hand-curated snapshots — refreshed periodically. Atlas data
 * is stored in USD, so we only need USD→X conversion.
 */

export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD";

export const CURRENCIES: Array<{ code: CurrencyCode; symbol: string; label: string }> = [
  { code: "USD", symbol: "$", label: "US dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British pound" },
  { code: "JPY", symbol: "¥", label: "Japanese yen" },
  { code: "CAD", symbol: "C$", label: "Canadian dollar" },
  { code: "AUD", symbol: "A$", label: "Australian dollar" },
];

/* Snapshot rates: 1 USD = X target.
 *
 * THESE ARE DISPLAY RATES AND THEY ARE NOT THE SAME THING AS src/lib/finance/fx.ts.
 * That module pins AUD at the rate the Australian source data was PARSED at, on
 * purpose, so a published benchmark keeps the value it had when it was read. This
 * module converts a stored USD figure into whatever currency the reader picked,
 * right now, so here "current" is the only correct rate. Numbeo splits the same
 * two jobs the same way: it stores each input at the rate on the day of input and
 * displays at a near-hourly current rate.
 *
 * Refreshed 2026-08-08, mid-market, against early-August references:
 *   EUR  ECB daily reference 2026-08-04, EUR 1 = USD 1.1515, inverted
 *   GBP  2026-08-04      JPY  2026-08-07      CAD, AUD  2026-08-01
 *
 * The previous snapshot was 2026-05-18 and the file's own rule is "refresh
 * quarterly or on >5% drift". THREE of the five had broken that rule:
 *   EUR 0.92 against 0.868   +6.1%
 *   AUD 1.51 against 1.430   +5.6%
 *   GBP 0.78 against 0.7435  +4.9%, at the line
 *   JPY 151 against 157.65   -4.2%
 *   CAD 1.36 against 1.402   -3.0%
 * A reader switching to EUR on a live cell page was reading figures 6% high.
 * Note: `2026-08-08-multi-currency.md`.
 */
const USD_TO: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.868,
  GBP: 0.7435,
  JPY: 157.65,
  CAD: 1.402,
  AUD: 1.43,
};

export function convertFromUsd(amountUsd: number, target: CurrencyCode): number {
  return amountUsd * (USD_TO[target] || 1);
}

export function formatMoney(amountUsd: number | null | undefined, target: CurrencyCode = "USD"): string {
  if (amountUsd == null || !isFinite(amountUsd)) return "-";
  const converted = convertFromUsd(amountUsd, target);
  const sym = CURRENCIES.find((c) => c.code === target)?.symbol || "$";
  if (target === "JPY") {
    // JPY doesn't use decimals; show whole numbers
    if (converted >= 1e9) return `${sym}${(converted / 1e9).toFixed(1)}B`;
    if (converted >= 1e6) return `${sym}${(converted / 1e6).toFixed(0)}M`;
    if (converted >= 1e3) return `${sym}${(converted / 1e3).toFixed(0)}K`;
    return `${sym}${Math.round(converted)}`;
  }
  if (converted >= 1e9) return `${sym}${(converted / 1e9).toFixed(2)}B`;
  if (converted >= 1e6) return `${sym}${(converted / 1e6).toFixed(2)}M`;
  if (converted >= 1e3) return `${sym}${(converted / 1e3).toFixed(0)}K`;
  return `${sym}${converted.toFixed(0)}`;
}
