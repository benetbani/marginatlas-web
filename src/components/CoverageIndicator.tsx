/**
 * Plan v27 Lane B / Sanity-§8 — universal coverage indicator.
 *
 * After §8 (the apologetic-disclaimer purge): this component no
 * longer renders pills that read "Estimated" or "Modeled". The
 * compact variant renders a single quiet "How we know this" link
 * using the v34 dotted-underline pattern. The expanded variant
 * was previously a banner with apologetic language ("treat as
 * orientation, not a precise reading"); it now renders nothing
 * by default, and callers should switch to inline HowWeKnowThis
 * links on individual stat blocks instead.
 *
 * The CoverageTier type and deriveCoverageTier() helper remain
 * unchanged so internal call sites still compile.
 *
 * Server component. Zero client cost.
 */
import { HowWeKnowThis } from "./HowWeKnowThis";

export type CoverageTier = "measured" | "regional" | "estimated" | "modeled";

type Props = {
  tier: CoverageTier;
  /** Pass 'compact' for a quiet inline link; 'expanded' renders
   *  nothing now (kept in the signature for backwards compatibility). */
  variant?: "compact" | "expanded";
  /** Retained for API back-compat; unused now. */
  industryName?: string | null;
  /** Retained for API back-compat; unused now. */
  geoName?: string | null;
};

const ANCHOR: Record<CoverageTier, string> = {
  measured: "measured",
  regional: "regional",
  estimated: "estimated",
  modeled: "modeled",
};

export function CoverageIndicator({ tier, variant = "compact" }: Props) {
  if (variant === "expanded") {
    // Apologetic banner intentionally removed in Sanity-§8.
    // Pages should use inline <HowWeKnowThis /> on stat blocks instead.
    return null;
  }
  return <HowWeKnowThis anchor={ANCHOR[tier]} />;
}

/**
 * Helper: derive the coverage tier from a cell-like object.
 * Centralizes the tier-derivation logic so every page agrees.
 * Kept for internal routing of the methodology anchor only;
 * the tier name is no longer surfaced as a user-visible label.
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
