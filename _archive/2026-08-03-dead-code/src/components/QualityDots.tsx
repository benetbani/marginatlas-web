/**
 * QualityDots — 1-10 dot scale rendering of data quality.
 *
 * Replaces the 0-100 numeric score with a more legible 10-dot strip.
 * Color gradient: moss (high) → atlas (medium) → clay (low).
 *
 * Per founder direction 2026-05-18: cells below 4/10 get a warning chip.
 */

type Props = {
  score: number;        // 1-10
  /** Optional context for the tooltip, e.g. "Direct measurement". */
  detail?: string;
  size?: "sm" | "md";
};

const TIER_COLORS: Record<number, { fill: string; label: string }> = {
  10: { fill: "bg-moss-700", label: "Excellent: direct measurement" },
  9:  { fill: "bg-moss-700", label: "Excellent: direct measurement, minor gaps" },
  8:  { fill: "bg-moss-500", label: "Very High: secondary published source" },
  7:  { fill: "bg-atlas-500", label: "High: modeled from primary with strong fit" },
  6:  { fill: "bg-atlas-500", label: "Good: city overlay from country extrapolation" },
  5:  { fill: "bg-atlas-300", label: "Medium: proxy country with small scaling" },
  4:  { fill: "bg-clay-300", label: "Low: proxy country with moderate scaling" },
  3:  { fill: "bg-clay-500", label: "Very Low: proxy with heavy scaling; interpret carefully" },
  2:  { fill: "bg-clay-700", label: "Unreliable: distant proxy" },
  1:  { fill: "bg-clay-900", label: "Pure guess" },
};

/**
 * Compute a 1-10 quality from the legacy 0-100 score field, with floor 1
 * and ceiling 10.
 */
export function score100to10(score100: number | null | undefined): number {
  if (score100 == null || isNaN(score100)) return 5; // default mid
  return Math.max(1, Math.min(10, Math.round(score100 / 10)));
}

export function QualityDots({ score, detail, size = "md" }: Props) {
  const s = Math.max(1, Math.min(10, Math.round(score)));
  const tier = TIER_COLORS[s];
  const dotW = size === "sm" ? "w-1" : "w-1.5";
  const dotH = size === "sm" ? "h-2.5" : "h-3";
  const fontSize = size === "sm" ? "text-[10px]" : "text-xs";

  const titleText = `${tier.label}${detail ? ` · ${detail}` : ""}`;

  return (
    <div
      className="inline-flex items-center gap-0.5 cursor-help"
      aria-label={`Data quality ${s} of 10: ${tier.label}`}
      title={titleText}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={`${dotW} ${dotH} rounded-sm ${i < s ? tier.fill : "bg-cream-300"}`}
        />
      ))}
      <span className={`ml-1.5 ${fontSize} text-ink-800 tabular-nums font-medium`}>
        {s}/10
      </span>
    </div>
  );
}
