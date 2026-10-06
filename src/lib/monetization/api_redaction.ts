/**
 * src/lib/monetization/api_redaction.ts
 *
 * WHAT A PUBLIC DATA RESPONSE LEAVES OUT WHILE THE PAYWALL IS ON (the checkup of 2026-10-06, finding 3). The UK pages lock each
 * chapter's later levels (src/lib/monetization/levels.ts; his rulings 18 and 27), and on a London trade page the level "split"
 * (src/components/spine/cell/cell-view.tsx: the cost split and the team) is one of them: the rent share, the payroll share and
 * the wage per employee. The compare grid's lookup (/api/cell-lookup) and the cell CSV (/api/export-csv) are public and
 * edge-cached, so they cannot ask who is reading: for a UK cell they leave those three out for everyone while the paywall is on,
 * and a Pro reader reads them on the page. What the pages give free stays: the sales range and the count (the answer), the
 * survival curve (chapter 02's first level), the market's figures.
 *
 * Only figures a locked level is known to draw are listed; a figure no page locks is never taken off the free data.
 */
export const PAYWALLED_API_FIELDS = ["rent_share_pct", "payroll_share_pct", "payroll_per_employee"] as const;

/** The row with the locked figures set to null, for a UK cell while the paywall is on; otherwise the row unchanged. */
export function redactForPaywall<T extends object>(row: T, a: { paywallOn: boolean; country: string | null | undefined }): T {
  if (!a.paywallOn || String(a.country ?? "").toUpperCase() !== "GB") return row;
  const out: Record<string, unknown> = { ...(row as Record<string, unknown>) };
  for (const f of PAYWALLED_API_FIELDS) if (f in out) out[f] = null;
  return out as T;
}
