/**
 * AuPrimaryDataBadge — Phase 1c.
 *
 * Shown on AU cell pages when the underlying ratios are sourced from
 * primary ATO Small Business Benchmarks data (not modelled).
 *
 * Compact pill with source-year and AU flag. Suppresses when the
 * feature flag is off or the cell doesn't have AU primary coverage.
 */

import * as React from "react";
import type { Cell } from "@/lib/cells";
import { getAuPrimaryAnchor, getAuSourceYear } from "@/lib/economic_profile/au_primary_loader";

type Props = {
  cell: Cell;
};

export function AuPrimaryDataBadge({ cell }: Props) {
  if (cell.country?.toUpperCase() !== "AU") return null;
  if (!cell.industry_id) return null;
  const revenue = cell.revenue_per_firm ?? cell.rev_p50;
  if (!revenue || revenue <= 0) return null;
  const anchor = getAuPrimaryAnchor(cell.industry_id, revenue);
  if (!anchor) return null;

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] uppercase tracking-wide font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
      title={`Primary data: ATO Small Business Benchmarks, FY ${anchor.source_year}. Industry: ${anchor.ato_name}. Band: ${anchor.band_index === 0 ? "small" : anchor.band_index === 1 ? "medium" : "large"}.`}
    >
      <span aria-hidden>★</span>
      <span>Primary data</span>
      <span className="font-normal text-emerald-800/70 normal-case tracking-normal">
        FY {anchor.source_year}, official benchmark
      </span>
    </div>
  );
}

/**
 * Hook-style helper for components that need to know whether AU
 * primary data is available without rendering the badge.
 */
export function useAuPrimaryAnchor(cell: Cell) {
  if (cell.country?.toUpperCase() !== "AU") return null;
  if (!cell.industry_id) return null;
  const revenue = cell.revenue_per_firm ?? cell.rev_p50;
  if (!revenue || revenue <= 0) return null;
  return getAuPrimaryAnchor(cell.industry_id, revenue);
}

void getAuSourceYear; // exported helper, used elsewhere
