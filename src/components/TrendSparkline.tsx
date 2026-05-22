/**
 * Reformation idea #3 — tiny inline SVG sparkline + direction word.
 *
 * Shows 5-year revenue trajectory at a glance. Synthesized via
 * trend_synthesizer.ts (real time-series data is missing from the
 * DB per audit). Direction word ("rising" / "steady" / "softening")
 * sits next to the line.
 *
 * Renders nothing if no industryId. Server component, pure SVG.
 */
import {
  synthesizeTrendMultipliers,
  trendDirection,
} from "@/lib/cells/trend_synthesizer";

type Props = {
  industryId?: string | null;
  /** Width in px. Default 120. */
  width?: number;
  /** Height in px. Default 32. */
  height?: number;
};

export function TrendSparkline({ industryId, width = 120, height = 32 }: Props) {
  if (!industryId) return null;
  const points = synthesizeTrendMultipliers(industryId);
  const dir = trendDirection(industryId);

  // Map to SVG coords. Y inverted (higher value = top).
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const padX = 2;
  const padY = 2;
  const w = width - 2 * padX;
  const h = height - 2 * padY;
  const path = points
    .map((p, i) => {
      const x = padX + (i / (points.length - 1)) * w;
      const y = padY + h - ((p - min) / range) * h;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  const stroke =
    dir.label === "rising"
      ? "#15803d" // moss-700 (Atlas green)
      : dir.label === "softening"
        ? "#c2410c" // clay-700
        : "#78716c"; // cocoa-500

  const last = points[points.length - 1];
  const lastX = padX + w;
  const lastY = padY + h - ((last - min) / range) * h;

  const directionLabel = `${dir.label} (${(dir.cagr * 100).toFixed(1)}% CAGR estimated)`;

  return (
    <span
      className="inline-flex items-center gap-2 text-xs text-cocoa-700/70"
      aria-label={directionLabel}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-hidden="true"
      >
        <path
          d={path}
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={lastX} cy={lastY} r="2" fill={stroke} />
      </svg>
      <span className="font-medium uppercase tracking-wide text-[10px]">
        {dir.label}
      </span>
    </span>
  );
}
