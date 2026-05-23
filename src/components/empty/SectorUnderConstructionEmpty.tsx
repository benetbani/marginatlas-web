/**
 * SectorUnderConstructionEmpty
 * ============================
 *
 * Used on /sectors/[sector] when the sector's data quality flag is
 * "corp_only" (dominated by large corporates) or "mixed_caution" (long
 * tail mixed with a few industrial giants, so the median is misleading).
 *
 * Visually distinct from CellDataMissingEmpty: cream-100 with a faint
 * diagonal hatch so users learn that this is a category-level decision,
 * not a measurement gap.
 */

import Link from "next/link";
import { WarningCircle, CaretRight } from "@phosphor-icons/react/dist/ssr";

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
  const Heading = (`h${headingLevel}`) as "h2" | "h3" | "h4";

  // Inline hatch background — diagonal stripes of parchment over cream-100.
  const hatchedBg: React.CSSProperties = {
    backgroundColor: "#F8F2E4",
    backgroundImage:
      "repeating-linear-gradient(135deg, transparent 0px, transparent 14px, rgba(232, 221, 199, 0.5) 14px, rgba(232, 221, 199, 0.5) 15px)",
  };

  return (
    <div
      className={[
        "relative border border-parchment rounded-lg",
        "pl-8 pr-6 py-8 sm:pl-10 sm:pr-8 sm:py-10",
        "text-center mx-auto max-w-2xl",
        className ?? "",
      ].join(" ")}
      style={hatchedBg}
    >
      <span aria-hidden="true" className="absolute top-4 bottom-4 left-3 w-[2px] rounded-full bg-atlas-500/85" />

      <div className="flex justify-center text-atlas-700">
        <WarningCircle size={24} weight="regular" aria-hidden="true" />
      </div>

      <Heading className="font-display mt-3 text-2xl font-semibold tracking-tight text-ink-900 leading-[1.2]">
        {sectorName} is too mixed for clean SMB numbers.
      </Heading>

      <p className="font-display italic mt-2 text-base text-cocoa-700 text-balance leading-relaxed max-w-xl mx-auto">
        {bodyText(sectorName, reason)}
      </p>

      <div className="mt-5">
        <Link
          href={sectorsHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-atlas-700 underline-offset-4 hover:underline"
        >
          Browse other sectors
          <CaretRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
