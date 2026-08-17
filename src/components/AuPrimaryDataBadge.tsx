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

  /* THIS BADGE WAS GREEN, and it is the site's strongest confidence marker, so
     it is precisely the place a green convention feels most defensible and is
     still wrong. `emerald` is a STOCK Tailwind ramp: no token file on this site
     defines it, which is why verify_palette_membership could not see it until
     443a938e taught the gate the stock names.

     Terracotta is not a substitute chosen for lack of anything else. The
     canonical confidence scale already lives in design-tokens as `colors.tier`,
     and its most-measured step IS atlas-700; the classes below are the
     bordered-pill shape CityDistrictPicker and the band_tone CHIP ladder
     already use for a favourable reading. So this badge stops being the one
     surface with its own private colour for "trustworthy". */
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] uppercase tracking-wide font-semibold bg-atlas-50 text-atlas-700 border border-atlas-200"
      title={`Primary data: ATO Small Business Benchmarks, FY ${anchor.source_year}. Industry: ${anchor.ato_name}. Band: ${anchor.band_index === 0 ? "small" : anchor.band_index === 1 ? "medium" : "large"}.`}
    >
      <span aria-hidden>★</span>
      <span>Primary data</span>
      <span className="font-normal text-atlas-700/70 normal-case tracking-normal">
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
