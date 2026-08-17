/**
 * ProgressBar — atlas-skinned Tremor-Raw-pattern progress primitive.
 *
 * One bar (track + fill), with optional label/value rendered above. Used
 * for ratios that benefit from a visual "% of total" cue: confidence-tier
 * distribution, breakeven margin of safety, coverage progress.
 *
 * Why a primitive: we had 4 hand-rolled bar patterns scattered across
 * coverage, decide, and city pages with subtly different tracks and
 * radii. This consolidates them and gives every bar the same atlas
 * treatment (one neutral track, vermillion fill, 6px height by default,
 * tabular-nums numbers).
 *
 * Atlas treatment:
 *   - Track: the 200 step of the surface ramp, a true neutral
 *   - Fill: atlas-700 vermillion by default
 *   - tone="success" -> deep green for "exceeded target" semantics
 *   - tone="warning" -> amber for "approaching limit"
 *   - tone="danger"  -> red for "below threshold"
 *   - No animation (server-rendered)
 *
 * No client JS.
 *
 * Visual upgrade §4 round 2 (2026-05-26).
 */

import * as React from "react";

import { cn } from "@/lib/utils";

type Tone = "default" | "success" | "warning" | "danger" | "muted";

/* THREE OF THESE FIVE WERE OFF-PALETTE, and two of them were not even Atlas
   tokens: `emerald` and `red` are stock Tailwind ramps, so no token file on
   this site defines them and the palette gate, which knows the banned NAMES
   moss / amber / orange, could not see either. Fixed 2026-08-17 with the rest
   of the good-versus-bad sweep: terracotta for the favourable readings,
   deepening cocoa for caution, and the site's own maroon for danger. */
const TONE_FILL: Record<Tone, string> = {
  default: "bg-atlas-700",
  success: "bg-atlas-500",
  warning: "bg-cocoa-500",
  danger: "bg-clay-700",
  muted: "bg-cocoa-700/40",
};

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current value (any unit; the ratio against max is what's rendered). */
  value: number;
  /** Max value. Defaults to 100 (treat value as a percent). */
  max?: number;
  /** Optional label rendered above the bar on the left. */
  label?: React.ReactNode;
  /** Optional value text rendered above the bar on the right. */
  valueLabel?: React.ReactNode;
  /** Bar height. Default "md" (8px). "sm" = 6px, "lg" = 12px. */
  size?: "sm" | "md" | "lg";
  /** Tone driving the fill color. */
  tone?: Tone;
  /** Cap the visible fill at 100% even when value > max (default true). */
  clamp?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  valueLabel,
  size = "md",
  tone = "default",
  clamp = true,
  className,
  ...rest
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1;
  const raw = (value / safeMax) * 100;
  const pct = clamp ? Math.max(0, Math.min(100, raw)) : Math.max(0, raw);

  const trackHeight =
    size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";

  const fillColor = TONE_FILL[tone];

  return (
    <div className={cn("w-full", className)} {...rest}>
      {(label || valueLabel) && (
        <div className="flex items-baseline justify-between gap-2 mb-1">
          {label ? (
            <span className="text-xs text-cocoa-700/80 font-medium">
              {label}
            </span>
          ) : <span />}
          {valueLabel ? (
            <span className="text-xs text-ink-900 tabular-nums font-semibold">
              {valueLabel}
            </span>
          ) : null}
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-paper-200 overflow-hidden",
          trackHeight,
        )}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn("h-full rounded-full transition-[width]", fillColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
