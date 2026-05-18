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

// Snapshot rates: 1 USD = X target. Updated periodically.
// As of 2026-05-18; refresh quarterly or on >5% drift.
const USD_TO: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 151,
  CAD: 1.36,
  AUD: 1.51,
};

export function convertFromUsd(amountUsd: number, target: CurrencyCode): number {
  return amountUsd * (USD_TO[target] || 1);
}

export function formatMoney(amountUsd: number | null | undefined, target: CurrencyCode = "USD"): string {
  if (amountUsd == null || !isFinite(amountUsd)) return "—";
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
