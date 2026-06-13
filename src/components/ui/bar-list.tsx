/**
 * BarList — horizontal bar list for ranked metrics.
 *
 * Tremor-Raw-pattern primitive, atlas-skinned. Renders each data
 * point as a row with: name on the left, horizontal bar in the
 * middle (proportional to value vs max), value on the right.
 *
 * Use when a 2-column table would hide the gap between top and
 * bottom values. A pharmacy density of 3.5 vs a doctor density of
 * 0.48 (7x gap) is invisible in a table; obvious here.
 *
 * Visual upgrade §4 (2026-05-26).
 *
 * Atlas treatment:
 *   - Vermillion (atlas-700) bar fill over a warm parchment track
 *   - Tabular-nums values
 *   - Optional href makes each row clickable
 *   - No animation (server-rendered)
 *   - Variant: "compact" (sm) or "default" (md)
 *
 * No client JS.
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import { colors } from "@/lib/design-tokens";

// Rank ramp for the gradient mode: the leader takes the deepest vermillion,
// descending down the order. The shade ENCODES rank, so it stays honest, not
// decorative. Token steps only.
const RANK_RAMP = [
  colors.atlas[700],
  colors.atlas[600],
  colors.atlas[500],
  colors.atlas[400],
] as const;

function rampColor(idx: number, n: number): string {
  if (n <= 1) return RANK_RAMP[0];
  const t = idx / (n - 1);
  return RANK_RAMP[Math.min(RANK_RAMP.length - 1, Math.round(t * (RANK_RAMP.length - 1)))];
}

export type BarListItem = {
  name: string;
  value: number;
  href?: string;
  /** Optional caption shown next to the name. */
  caption?: string;
};

export interface BarListProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BarListItem[];
  /** How to format the numeric value. Default toFixed(2). */
  valueFormatter?: (n: number) => string;
  /** Bar color (any CSS color). Default vermillion atlas-700. */
  color?: string;
  /**
   * Rank-shaded gradient fill (2026-06-13): each bar is a left-to-right
   * vermillion sheen whose depth encodes rank, the leader deepest. Off by
   * default so existing single-color consumers are unchanged.
   */
  gradient?: boolean;
  /** Optional sort. Default: data order preserved. */
  sortOrder?: "asc" | "desc" | "none";
  /** "default" (24px bar) or "compact" (18px bar). */
  size?: "default" | "compact";
  /**
   * Width allocation. Default tries to balance name + bar + value.
   * Override when names are unusually long.
   */
  nameColWidth?: string;
  valueColWidth?: string;
}

const DEFAULT_FORMATTER = (n: number) => n.toFixed(2);

export function BarList({
  data,
  valueFormatter = DEFAULT_FORMATTER,
  color = colors.atlas[700],
  gradient = false,
  sortOrder = "none",
  size = "default",
  nameColWidth = "minmax(0, 1fr)",
  valueColWidth = "auto",
  className,
  ...rest
}: BarListProps) {
  if (!data || data.length === 0) return null;

  const sorted =
    sortOrder === "desc"
      ? [...data].sort((a, b) => b.value - a.value)
      : sortOrder === "asc"
        ? [...data].sort((a, b) => a.value - b.value)
        : data;

  const max = Math.max(...sorted.map((d) => d.value)) || 1;

  const barHeight = size === "compact" ? "h-[18px]" : "h-[22px]";
  const rowPadding = size === "compact" ? "py-1.5" : "py-2";

  return (
    <div className={cn("flex flex-col gap-1", className)} {...rest}>
      {sorted.map((item, idx) => {
        const pct = Math.max(2, (item.value / max) * 100);
        const rowClassName = cn(
          "grid gap-3 items-center transition-colors",
          item.href ? "hover:bg-cream-100/70 rounded-md -mx-2 px-2 cursor-pointer" : "",
          rowPadding,
        );
        const rowStyle = {
          gridTemplateColumns: `${nameColWidth} ${valueColWidth}`,
        };
        // Render as <a> when href present, <div> otherwise. Split branches
        // so TypeScript sees the correct element type for each.
        const rowKey = `${item.name}-${idx}`;
        const rowChildren = (
          <>
            {/* Name + bar stacked. Name on top, bar directly below. */}
            <div className="min-w-0">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span
                  className={cn(
                    "text-sm text-ink-900 font-medium truncate",
                    item.href ? "group-hover:text-atlas-700" : "",
                  )}
                >
                  {item.name}
                </span>
                {item.caption ? (
                  <span className="text-[11px] text-cocoa-700/55 shrink-0">
                    {item.caption}
                  </span>
                ) : null}
              </div>
              <div
                className={cn(
                  "w-full rounded-sm bg-cream-200 overflow-hidden",
                  barHeight,
                )}
                aria-hidden="true"
              >
                <div
                  className="h-full rounded-sm"
                  style={
                    gradient
                      ? {
                          width: `${pct}%`,
                          backgroundImage: `linear-gradient(90deg, ${colors.atlas[300]} 0%, ${rampColor(
                            idx,
                            sorted.length,
                          )} 100%)`,
                        }
                      : { width: `${pct}%`, backgroundColor: color }
                  }
                />
              </div>
            </div>
            <div className="text-right tabular-nums text-sm text-ink-900 font-semibold pl-2 whitespace-nowrap">
              {valueFormatter(item.value)}
            </div>
          </>
        );
        if (item.href) {
          return (
            <a
              key={rowKey}
              href={item.href}
              className={rowClassName}
              style={rowStyle}
            >
              {rowChildren}
            </a>
          );
        }
        return (
          <div key={rowKey} className={rowClassName} style={rowStyle}>
            {rowChildren}
          </div>
        );
      })}
    </div>
  );
}
