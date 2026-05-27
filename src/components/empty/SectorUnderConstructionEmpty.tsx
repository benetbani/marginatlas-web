/**
 * SectorUnderConstructionEmpty (legacy entry point)
 * =================================================
 *
 * Used on `/sectors/[sector]` when the sector's data quality flag is
 * "corp_only" (dominated by large corporates) or "mixed_caution" (long
 * tail mixed with a few industrial giants, so the median is misleading).
 *
 * Visually distinct from CellDataMissingEmpty: hatched cream-100
 * background so users learn this is a category-level decision, not a
 * measurement gap.
 *
 * Design system Phase 2 refactor, 2026-05-27. Public API unchanged.
 */

import Link from "next/link";
import { WarningCircle, CaretRight } from "@phosphor-icons/react/dist/ssr";

import { EmptyState } from "@/components/ui/empty-state";

export type SectorReason = "corp_only" | "mixed_caution";

export type SectorUnderConstructionEmptyProps = {
  sectorName: string;
  reason: SectorReason;
  /** Where the "Browse other sectors" link points. */
  sectorsHref?: string;
  headingLevel?: 2 | 3 | 4;
  className?: string;
};

function bodyText(sectorName: string, reason: SectorReason): string {
  if (reason === "corp_only") {
    return `${sectorName} is dominated by a handful of multinational corporates, which is not what Atlas measures. SMB numbers in this sector would mislead more than they would inform, so we leave them out by design.`;
  }
  return `${sectorName} mixes a long tail of very small operators with a few large industrial players, so the median revenue stops being useful. We flag this sector as caution-only until we can split it into cleaner sub-sectors.`;
}

export default function SectorUnderConstructionEmpty({
  sectorName,
  reason,
  sectorsHref = "/sectors",
  headingLevel = 2,
  className,
}: SectorUnderConstructionEmptyProps) {
  return (
    <EmptyState
      variant="hatched"
      icon={<WarningCircle size={24} weight="regular" />}
      title={`${sectorName} is too mixed for clean SMB numbers.`}
      body={
        <span className="font-display italic text-balance">
          {bodyText(sectorName, reason)}
        </span>
      }
      headingLevel={headingLevel}
      action={
        <Link
          href={sectorsHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-atlas-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 rounded"
        >
          Browse other sectors
          <CaretRight size={14} aria-hidden="true" />
        </Link>
      }
      className={className}
    />
  );
}
