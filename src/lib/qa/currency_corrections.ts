/**
 * Currency corrections — render-time fix for cells stored in local
 * currency but historically displayed with a USD ($) prefix.
 *
 * Background: data/quality/currency_sanity_v1.json (May 18, 2026) flagged
 * 2,298 cells where the stored revenue value is approximately FX_RATE
 * times the peer median, AND dividing by FX_RATE puts the value back
 * inside the peer band. Pattern says: the underlying source delivered
 * local-currency values; the ingestion pipeline did not convert; the
 * render layer hardcodes "$" everywhere. Net effect: a Mexican firm
 * reporting MX$5M annual revenue surfaced as "$5M USD" on the live
 * site — a 17x overstatement.
 *
 * This file is the render-time mitigation. It does NOT fix the
 * underlying data. The proper fix is to re-ingest with USD
 * normalization at the source. Until then, every cell that flows
 * through normalizeRegionalRow / normalizeExtrapolatedRow gets a
 * correction-pass that scales all currency-denominated fields by
 * 1 / FX_RATE for countries on the list.
 *
 * Conservative scope: only countries with clear systemic flag counts
 * (Mexico, 2079 cells) get the correction. The smaller flag counts
 * (Australia 49, Canada 48, Israel 45, Qatar 43, NZ 19, HK 14, SA 1)
 * are likely individual outliers and false positives from the
 * statistical heuristic, not systemic-pipeline bugs. They are NOT
 * corrected here pending re-audit.
 */

import type { Cell } from "@/lib/cells";

/**
 * Country ISO2 → FX rate (units of local currency per 1 USD) used to
 * divide stored values back into USD.
 *
 * Empty for most countries (no correction needed). Populated only
 * for countries with confirmed systemic local-currency-as-USD bugs.
 */
export const CURRENCY_FX_CORRECTIONS: Record<string, number> = {
  // Mexico: 2,079 cells flagged with FX 17.5 MXN/USD (May 2026 audit).
  // Sample: textile_apparel_mfg in MX-AGU stored 39,995,658 = ~MX$40M
  // which is ~$2.29M USD after dividing by 17.5. Without correction
  // the page rendered "$40M" — 17x too high.
  MX: 17.5,
};

/**
 * Apply currency correction in place. Scales every revenue-, payroll-,
 * and total-revenue field by 1 / FX_RATE when the cell's country is
 * on the correction list. Returns the cell unchanged when the country
 * is not on the list, which is the common case.
 *
 * Idempotent in the sense that re-running on a corrected cell would
 * over-correct: callers must not invoke this twice. Designed to be
 * called exactly once inside normalizeRegionalRow / normalizeExtrapolatedRow.
 */
export function applyCurrencyCorrection(cell: Cell): Cell {
  const fx = CURRENCY_FX_CORRECTIONS[cell.country];
  if (!fx || fx <= 0) return cell;

  const scale = 1 / fx;
  const scaleNullable = (v: number | null | undefined): number | null => {
    if (v == null || !isFinite(v)) return v ?? null;
    return v * scale;
  };

  return {
    ...cell,
    revenue_per_firm: scaleNullable(cell.revenue_per_firm),
    total_revenue: scaleNullable(cell.total_revenue),
    total_revenue_usd: scaleNullable(cell.total_revenue_usd),
    rev_p10: scaleNullable(cell.rev_p10),
    rev_p25: scaleNullable(cell.rev_p25),
    rev_p50: scaleNullable(cell.rev_p50),
    rev_p75: scaleNullable(cell.rev_p75),
    rev_p90: scaleNullable(cell.rev_p90),
    payroll_per_employee: scaleNullable(cell.payroll_per_employee),
    gross_profit: scaleNullable(cell.gross_profit),
    operating_profit: scaleNullable(cell.operating_profit),
    net_profit: scaleNullable(cell.net_profit),
    // Tag the cell so downstream debug tooling can see this happened.
    currency: "USD",
  };
}

/**
 * For the audit scripts: list every country currently receiving a
 * correction, with the rate applied.
 */
export function listCorrectedCountries(): Array<{ iso2: string; fxRate: number }> {
  return Object.entries(CURRENCY_FX_CORRECTIONS).map(([iso2, fxRate]) => ({
    iso2,
    fxRate,
  }));
}
