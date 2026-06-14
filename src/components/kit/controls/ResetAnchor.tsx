"use client";

/**
 * ResetAnchor - keeps the canonical Atlas figure visible beside an adjusted one,
 * with a quiet way back (interaction-control foundation, agency principle P3).
 *
 * P3 (always reversible, the canonical value shown beside any adjusted one):
 * when a reader bends a number with a control, they should never lose sight of
 * what the site actually says is typical. This shows the adjusted value as the
 * lead figure and the canonical Atlas figure as a faint ghost next to it, plus a
 * "Reset to typical" button that only appears once the value has been adjusted.
 *
 * When adjusted equals canonical it collapses to the single value: no ghost, no
 * reset, no noise (P5, disclosed not displayed). Presentational plus the one
 * reset button. Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export type ResetAnchorProps = {
  /** The canonical Atlas figure (what the site says is typical). */
  canonical: number;
  /** The reader's current adjusted figure. */
  adjusted: number;
  /** Formats both figures. */
  format: (n: number) => string;
  /** Called when the reader resets to canonical. */
  onReset: () => void;
  /** Optional caption under the value (e.g. "with your tip"). */
  label?: string;
  /** Reset button copy. Defaults to the house phrase. */
  resetLabel?: string;
  className?: string;
};

/** Equal within a hair, so float dust does not keep the ghost on screen. */
function near(a: number, b: number): boolean {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return a === b;
  const scale = Math.max(1, Math.abs(a), Math.abs(b));
  return Math.abs(a - b) <= scale * 1e-9;
}

export function ResetAnchor({
  canonical,
  adjusted,
  format,
  onReset,
  label,
  resetLabel = "Reset to typical",
  className,
}: ResetAnchorProps) {
  const isAdjusted = !near(canonical, adjusted);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-2xl font-semibold tabular-nums text-ink-900">
          {format(adjusted)}
        </span>

        {/* the canonical ghost, only when the reader has moved off it */}
        {isAdjusted ? (
          <span className="inline-flex items-baseline gap-1.5 text-sm tabular-nums text-cocoa-500">
            <span className="text-[11px] font-medium uppercase tracking-wide text-cocoa-500">
              Typical
            </span>
            <span className="line-through decoration-cream-400">
              {format(canonical)}
            </span>
          </span>
        ) : null}
      </div>

      {label ? (
        <span className="text-xs font-medium text-cocoa-700">{label}</span>
      ) : null}

      {/* the quiet way back, shown only when adjusted */}
      {isAdjusted ? (
        <button
          type="button"
          onClick={onReset}
          className={cn(
            "mt-1 inline-flex h-11 w-fit items-center gap-1.5 rounded-full px-3 text-sm font-medium text-cocoa-700 transition-colors hover:bg-cream-100 hover:text-ink-900",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2",
          )}
        >
          <svg
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 8a5 5 0 1 1 1.6 3.7" />
            <path d="M3 5v3h3" />
          </svg>
          {resetLabel}
        </button>
      ) : null}
    </div>
  );
}
