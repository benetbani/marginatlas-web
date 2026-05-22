/**
 * Plan v27 Lane B — universal coverage indicator.
 *
 * Single component, single vocabulary. Replaces the old
 * EstimatedBadge + CellFallbackBanner pair across every page that
 * displays a number. Four tiers, each with a stable color, wording,
 * and explanation. Tier mapping:
 *
 *   Measured   green   coverage_tier='P' AND quality_score >= 80
 *   Regional   blue    coverage_tier='G' OR substitution from parent geo
 *   Estimated  amber   coverage_tier='X' AND quality_score >= 30
 *   Modeled    gray    synthesizeCell() output OR no DB row
 *
 * Compact variant (single chip) on cell pages; expanded card on
 * hub pages. Both link to /methodology#<tier-anchor>.
 *
 * Server component. Zero client cost.
 */
import Link from "next/link";

export type CoverageTier = "measured" | "regional" | "estimated" | "modeled";

type Props = {
  tier: CoverageTier;
  /** Pass 'compact' for inline chip; 'expanded' for full card. */
  variant?: "compact" | "expanded";
  /** Optional context — what industry, what geo — for the expanded variant. */
  industryName?: string | null;
  geoName?: string | null;
};

const TIER_META: Record<
  CoverageTier,
  {
    label: string;
    color: string; // tailwind classes for chip
    expandedColor: string; // tailwind classes for expanded card
    short: string;
    long: string;
    anchor: string;
  }
> = {
  measured: {
    label: "Measured",
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    expandedColor: "bg-emerald-50 border-l-emerald-500",
    short: "Measured from primary data.",
    long: "These figures come from direct measurement of the firms in this geography and industry.",
    anchor: "measured",
  },
  regional: {
    label: "Regional",
    color: "bg-sky-50 text-sky-800 border-sky-200",
    expandedColor: "bg-sky-50 border-l-sky-500",
    short: "Regional benchmark applied to this geography.",
    long: "Direct measurements at this specific level aren't available; the numbers below come from a broader regional or national benchmark.",
    anchor: "regional",
  },
  estimated: {
    label: "Estimated",
    color: "bg-amber-50 text-amber-900 border-amber-200",
    expandedColor: "bg-amber-50 border-l-amber-500",
    short: "Estimated from country and industry averages.",
    long: "We don't have a direct reading for this cell. The numbers below are estimated from country-level economic indicators and global industry averages.",
    anchor: "estimated",
  },
  modeled: {
    label: "Modeled",
    color: "bg-stone-50 text-stone-700 border-stone-200",
    expandedColor: "bg-stone-50 border-l-stone-500",
    short: "Modeled from global SMB averages.",
    long: "This cell has no underlying observation. The numbers are produced by a transparent model that combines global industry averages with country-level scaling factors.",
    anchor: "modeled",
  },
};

export function CoverageIndicator({
  tier,
  variant = "compact",
  industryName,
  geoName,
}: Props) {
  const meta = TIER_META[tier];

  if (variant === "compact") {
    return (
      <Link
        href={`/methodology#${meta.anchor}`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wide ${meta.color} hover:opacity-80 transition-opacity`}
        title={meta.short}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${tier === "measured" ? "bg-emerald-500" : tier === "regional" ? "bg-sky-500" : tier === "estimated" ? "bg-amber-500" : "bg-stone-400"}`} />
        {meta.label}
      </Link>
    );
  }

  // Expanded card
  const ind = industryName?.toLowerCase() || "this industry";
  const where = geoName || "this geography";
  return (
    <section className={`border-l-4 py-5 md:py-6 px-5 rounded-r-lg ${meta.expandedColor}`}>
      <div className="flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-[0.14em] text-ink-900 mb-2">
        <span className={`w-2 h-2 rounded-full ${tier === "measured" ? "bg-emerald-500" : tier === "regional" ? "bg-sky-500" : tier === "estimated" ? "bg-amber-500" : "bg-stone-400"}`} />
        {meta.label}
      </div>
      <p className="text-base md:text-lg text-ink-900 max-w-3xl leading-relaxed">
        {meta.long}
        {tier !== "measured" && (
          <>
            {" "}For{" "}
            <strong className="font-semibold">{ind}</strong> in{" "}
            <strong className="font-semibold">{where}</strong>, treat the
            figures as orientation, not a precise reading.
          </>
        )}{" "}
        <Link
          href={`/methodology#${meta.anchor}`}
          className="text-atlas-700 hover:text-atlas-900 font-medium underline decoration-atlas-300 hover:decoration-atlas-700 underline-offset-2"
        >
          How this works
        </Link>
        .
      </p>
    </section>
  );
}

/**
 * Helper: derive the coverage tier from a cell-like object.
 * Centralizes the tier-derivation logic so every page agrees.
 */
export function deriveCoverageTier(cell: {
  coverage_tier?: string | null;
  quality_score?: number | null;
  is_synthetic?: boolean | null;
  is_substituted?: boolean | null;
}): CoverageTier {
  if (cell.is_synthetic) return "modeled";
  if (cell.is_substituted) return "regional";
  const ct = (cell.coverage_tier || "").toUpperCase();
  const q = cell.quality_score ?? 0;
  if (ct === "P" && q >= 80) return "measured";
  if (ct === "G") return "regional";
  if (ct === "X" && q >= 30) return "estimated";
  if (q >= 75) return "measured";
  if (q >= 50) return "regional";
  if (q >= 25) return "estimated";
  return "modeled";
}
