/**
 * TierBar - a tiny inline bar showing where one value sits in its range
 * (design-system 10.1, charts family).
 *
 * The smallest member of the chart family: a single value's position inside a
 * low-to-high band, drawn as a slim track with a fill from the floor up to the
 * value. It is the visual whisper that rides beside a number in a dense surface,
 * so a reader feels "near the bottom" / "about typical" / "near the top" at a
 * glance without reading the band ends. A city's salary inside its low-to-high
 * pay band, a country's coverage depth, a trade's margin against the field: any
 * lone figure that is really a position on a scale.
 *
 * Color jobs (the fixed law): the fill is quiet cocoa by default because a
 * position is not inherently good or bad; `tone` tints it only when the number
 * carries meaning (good = moss, caution = amber). The atlas/vermillion accent is
 * deliberately NOT spent here, so a dense tile of these bars never lights up with
 * many false subjects; the one vermillion moment is reserved for the headline
 * figure the tile is about, not its whisper. Meaning never rides on color alone:
 * the fill width itself carries the position, and the optional label / value /
 * tier word say it in words too.
 *
 * Contract (design-system 10.2): nullable in, silence out. Returns null when the
 * value is absent or not finite, or when the band is degenerate (max <= min), so
 * a tile never shows a misleading or empty bar; the caller simply renders the
 * number alone. Tokens only, no raw color; no legend; server-renderable (no
 * client JS); motion-reduce safe (it has no motion of its own). An aria-label
 * summarizes the position so the bar is not meaning-by-color.
 *
 * This is DATA: an opaque fill on a quiet track, no gridline, high contrast.
 * Compact and default sizes; both stay legible in a phone column.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { TierDot, type Tier } from "@/components/ui/tier-dot";
import { isNum, hasText, clamp01 } from "./helpers";

export type TierBarTone = "neutral" | "good" | "caution";

export type TierBarProps = {
  /** The value to place in the band. Null / non-finite renders nothing. */
  value: number | null;
  /** Band floor. @default 0 */
  min?: number;
  /** Band ceiling. Required for a credible bar; max <= min renders nothing. */
  max?: number;
  /**
   * What the position means. A position is neutral by default (quiet cocoa); use
   * `good` (moss) or `caution` (amber) only when the number carries a judgement.
   * @default "neutral"
   */
  tone?: TierBarTone;
  /** Optional confidence tier shown as a small quiet dot after the bar. */
  tier?: Tier | null;
  /** Optional small label, shown above the track (cocoa, quiet). */
  label?: string | null;
  /** Formatter for the value shown at the end of the track (e.g. fmtUsdCompact). */
  format?: (n: number) => string;
  /** Accessible label override; a sensible one is generated otherwise. */
  ariaLabel?: string;
  className?: string;
};

// Fill color per tone. Quiet cocoa for a plain position; moss for a kept /
// positive reading; amber for caution. The vermillion accent is intentionally
// absent so a grid of these never crowds the one subject per view.
const FILL_TONE: Record<TierBarTone, string> = {
  neutral: "bg-cocoa-300",
  good: "bg-moss-500",
  caution: "bg-amber-600",
};

// The value figure takes a hair of the tone so a meaningful reading is legible
// without a legend; neutral stays plain ink.
const FIG_TONE: Record<TierBarTone, string> = {
  neutral: "text-ink-900",
  good: "text-moss-700",
  caution: "text-amber-700",
};

/** Plain words for where the fill lands, so the aria-label is not bare numbers. */
function positionWord(pct: number): string {
  if (pct <= 0.2) return "near the bottom of";
  if (pct >= 0.8) return "near the top of";
  if (pct >= 0.4 && pct <= 0.6) return "about midway in";
  return "within";
}

export function TierBar({
  value,
  min = 0,
  max,
  tone = "neutral",
  tier,
  label,
  format,
  ariaLabel,
  className,
}: TierBarProps) {
  // Nullable in, silence out: the value must be real and the band must have a
  // real, positive span. A caller renders the number alone when this is null.
  if (!isNum(value) || !isNum(max) || !isNum(min) || max <= min) return null;

  const pct = clamp01((value - min) / (max - min));
  const fill = FILL_TONE[tone];
  const figColor = FIG_TONE[tone];

  const hasValueLabel = typeof format === "function";
  const valueText = hasValueLabel ? format(value) : null;

  const ariaText: string =
    ariaLabel ??
    [
      hasText(label) ? `${label}: ` : "",
      valueText ?? format?.(value) ?? `${value}`,
      `, ${positionWord(pct)} the range`,
      format ? ` from ${format(min)} to ${format(max)}` : "",
      ".",
    ].join("");

  return (
    <div
      className={["w-full", className].filter(Boolean).join(" ")}
      role="img"
      aria-label={ariaText}
    >
      {hasText(label) ? (
        <div className="mb-1 text-[11px] font-medium text-cocoa-500">{label}</div>
      ) : null}

      <div className="flex items-center gap-2">
        {/* the track: a quiet hairline-bordered band, opaque fill to the value,
            no gridline. Slim enough to ride inside a directory tile. */}
        <span
          className="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full border border-parchment bg-cream-200"
          aria-hidden="true"
        >
          <span
            className={["absolute inset-y-0 left-0 rounded-full", fill].join(" ")}
            // A whisker of width even at the floor so a real-but-low value still
            // reads as present, not empty.
            style={{ width: `${Math.max(3, pct * 100)}%` }}
          />
        </span>

        {valueText ? (
          <span
            className={[
              "shrink-0 font-display text-[12px] font-medium leading-none tabular-nums",
              figColor,
            ].join(" ")}
            aria-hidden="true"
          >
            {valueText}
          </span>
        ) : null}

        {tier ? (
          <span className="shrink-0" aria-hidden="true">
            <TierDot tier={tier} size="sm" />
          </span>
        ) : null}
      </div>
    </div>
  );
}
