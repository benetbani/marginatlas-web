/**
 * Compact money formatters.
 *
 * `FormatMoney` is the bare number formatter; callers
 * prepend their own currency symbol.
 *
 * `FmtMoney` is the canonical with-currency version,
 * replacing 17+ duplicated local `fmtMoney` definitions across the app.
 * Before this consolidation, billions used .toFixed(1) in most files but
 * .toFixed(2) in CalculatorForm; some impls didn't handle NaN; some
 * didn't accept a currency-symbol parameter. The numbers drifted.
 *
 * Single source of truth for all user-visible money strings:
 *   - null / undefined / NaN / Infinity → "-"
 *   - ≥ 1e9 → "${sym}{value/1e9 to 1 decimal}B"
 *   - ≥ 1e6 → "${sym}{value/1e6 to 1 decimal}M"
 *   - ≥ 1e3 → "${sym}{value/1e3 rounded}K"
 *   - else  → "${sym}{value rounded}"
 *
 * Currency symbol defaults to "$". Pass an explicit symbol for non-USD.
 */

export function formatMoney(v: number | null | undefined): string {
  if (v == null || !isFinite(v)) return "-";
  const abs = Math.abs(v);
  if (abs >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
  return `${Math.round(v)}`;
}

export function fmtMoney(
  v: number | null | undefined,
  sym = "$",
): string {
  if (v == null || !isFinite(v) || isNaN(v)) return "-";
  // Render negatives as "-$X" not "$-X" (waterfall rows pass negatives
  // to render subtract semantics; the leading minus reads better).
  const sign = v < 0 ? "-" : "";
  const abs = Math.abs(v);
  if (abs >= 1e9) return `${sign}${sym}${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}${sym}${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}${sym}${(abs / 1e3).toFixed(0)}K`;
  return `${sign}${sym}${abs.toFixed(0)}`;
}

/**
 * Integer counts (firms, employees) — no currency symbol, comma
 * separators, "-" on null.
 */
export function fmtCount(v: number | null | undefined): string {
  if (v == null || !isFinite(v) || isNaN(v)) return "-";
  return Math.round(v).toLocaleString("en-US");
}

/**
 * Percentage with one decimal. Pass 0.247 → "24.7%". Pass 0 → "0.0%".
 */
export function fmtPct(v: number | null | undefined): string {
  if (v == null || !isFinite(v) || isNaN(v)) return "-";
  return `${(v * 100).toFixed(1)}%`;
}
