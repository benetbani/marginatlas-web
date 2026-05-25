"use client";

/**
 * GhostBar — v34 Phase A primitive #5.
 *
 * Renders a single locked bar inside a distribution chart at the
 * correct x-position so the user sees the SHAPE of the
 * distribution but not the value. This is the Similarweb pattern
 * applied to a benchmark chart.
 *
 * v34 research-locked rules:
 *  - fill = rgba(0,0,0,0.06) — soft grey, not red, not striped
 *    in a way that screams "ALERT".
 *  - stroke-dasharray = "2 2" — dashed border signals
 *    "in-progress / locked" without aggression.
 *  - The axis labels (rendered by the parent chart) stay visible
 *    so the user can read p10/p50/p90 even when p25/p75 are
 *    ghosted. (Conclusion 1C.8.)
 *  - Click opens the paywall via the standard event.
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 2.5.
 */

import { openPaywall, PaywallEntryPoint, PaywallTier } from "./events";

export type GhostBarProps = {
  /** SVG x in user units. */
  x: number;
  /** SVG y in user units (top of the bar). */
  y: number;
  /** SVG width. */
  width: number;
  /** SVG height. */
  height: number;
  tier: PaywallTier;
  entry: PaywallEntryPoint;
  ariaLabel: string;
};

export function GhostBar({
  x,
  y,
  width,
  height,
  tier,
  entry,
  ariaLabel,
}: GhostBarProps) {
  return (
    <g
      data-v34-lock="ghost-bar"
      data-v34-tier={tier}
      onClick={() => openPaywall({ entry, tier })}
      style={{ cursor: "pointer" }}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="rgba(0,0,0,0.06)"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth={1}
        strokeDasharray="2 2"
        rx={2}
        ry={2}
      >
        <title>{ariaLabel}</title>
      </rect>
    </g>
  );
}
