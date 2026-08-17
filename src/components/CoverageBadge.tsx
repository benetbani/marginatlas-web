/**
 * CoverageBadge — confidence worn openly (the Zillow trust move).
 *
 * Sub-project: "wear coverage as a trust feature, not an apology"
 * (2026-05-30). A compact, CONFIDENT badge that sits directly under the
 * hero on a cell page: a neutral 5-dot confidence meter plus a positive
 * coverage word for well-covered cells, and a quiet "How we know this"
 * methodology link.
 *
 * Founder direction (2026-05-30):
 *   - Confident framing, never apologetic. High-coverage cells show a
 *     positive word ("Measured" / "Regional"); LOW-coverage cells show
 *     NO word at all (just the neutral meter), so nothing reads as a
 *     disclaimer.
 *   - No sample size line.
 *   - No raw year (respects the standing "never show raw years to
 *     visitors" rule; can be added later if the founder reverses it).
 *
 * Why not reuse QualityDots: that component renders a numeric "N/10" and
 * carries alarming hover labels ("Pure guess", "Unreliable") for low
 * scores, which contradicts the confident, no-apology direction. This
 * badge derives its dots from quality_score directly and stays neutral.
 *
 * Server component. Zero client cost.
 */
import * as React from "react";
import { HowWeKnowThis } from "./HowWeKnowThis";
import { deriveCoverageTier, type CoverageTier } from "./CoverageIndicator";

type CoverageInput = {
  coverage_tier?: string | null;
  quality_score?: number | null;
  is_synthetic?: boolean | null;
  is_substituted?: boolean | null;
  /** Set by fillMissingFields when the headline revenue was supplied rather than
   *  read off the row. Declared here so a caller that builds a narrow object
   *  literal, rather than passing a whole Cell, cannot silently drop the one
   *  field that keeps a filled headline from wearing the "Measured" word. */
  _revenueFilled?: boolean | null;
};

export interface CoverageBadgeProps {
  cell: CoverageInput;
  /** Methodology anchor for the "How we know this" link. */
  anchor?: string;
  className?: string;
}

/** 0-100 quality score -> 1-5 confidence dots. */
function toFive(score100: number | null | undefined): number {
  if (score100 == null || Number.isNaN(score100)) return 3;
  return Math.max(1, Math.min(5, Math.round(score100 / 20)));
}

// Positive word for the confident tiers only. Low tiers map to null so the
// badge shows just the neutral meter (no disclaimer word).
const COVERAGE_WORD: Record<CoverageTier, string | null> = {
  measured: "Measured",
  regional: "Regional",
  estimated: null,
  modeled: null,
};

// Filled-dot color by tier band, a monotonic drain rather than two hues:
// confidence deepens into terracotta and low tiers stay a neutral cocoa, so
// nothing reads as a red flag. `measured` was moss-500 until 2026-08-17, which
// is banned; it is now the deep terracotta, one step above `regional` on the
// same ramp, which is exactly the relationship the two tiers have.
const DOT_FILL: Record<CoverageTier, string> = {
  measured: "bg-atlas-700",
  regional: "bg-atlas-500",
  estimated: "bg-cocoa-300",
  modeled: "bg-cocoa-300",
};

export function CoverageBadge({ cell, anchor, className }: CoverageBadgeProps) {
  const tier = deriveCoverageTier(cell);
  const dots = toFive(cell.quality_score);
  const word = COVERAGE_WORD[tier];
  const fill = DOT_FILL[tier];
  const resolvedAnchor = anchor ?? tier;

  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${className ?? ""}`}
    >
      <div
        className="inline-flex items-center gap-1"
        role="img"
        aria-label={`Data confidence: ${dots} of 5`}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`h-2 w-2 rounded-full ${i < dots ? fill : "bg-parchment"}`}
          />
        ))}
      </div>

      {word && (
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-cocoa-700">
          {word}
        </span>
      )}

      <HowWeKnowThis anchor={resolvedAnchor} />
    </div>
  );
}
