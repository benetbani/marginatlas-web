/**
 * Plan v13 Wave 2 — compact money formatter.
 *
 * Turns 419794 into "419K", 1487293 into "1.5M", 4_200_000_000 into "4.2B".
 * Pure number string — callers prepend their own currency symbol. This keeps
 * the helper presentation-agnostic for the new tiles + distribution surfaces.
 */

export function formatMoney(v: number | null | undefined): string {
  if (v == null || !isFinite(v)) return "-";
  const abs = Math.abs(v);
  if (abs >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
  return `${Math.round(v)}`;
}
