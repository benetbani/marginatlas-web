"use client";

/**
 * TruncatedTease — v34 Phase A primitive #3.
 *
 * Used at the end of a list where the visible rows have been
 * rendered with real data and the remainder is gated. Renders
 * a single calm row that says "N more X — Basic unlocks the
 * full list" and opens the paywall on click.
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 2.3.
 */

import { openPaywall, PaywallEntryPoint, PaywallTier } from "./events";

export type TruncatedTeaseProps = {
  count: number;
  /** Plural noun for what is hidden, e.g. "cities", "industries". */
  unit: string;
  tier: PaywallTier;
  entry: PaywallEntryPoint;
  /** Optional CTA verb override; defaults to "unlocks the full list". */
  ctaSuffix?: string;
};

export function TruncatedTease({
  count,
  unit,
  tier,
  entry,
  ctaSuffix = "unlocks the full list",
}: TruncatedTeaseProps) {
  if (count <= 0) return null;
  const tierLabel = tier === "basic" ? "Basic" : "Premium";

  return (
    <button
      type="button"
      onClick={() => openPaywall({ entry, tier })}
      data-v34-lock="tease"
      data-v34-tier={tier}
      className={[
        "w-full text-left",
        "flex items-center justify-between gap-3",
        "px-4 py-3 rounded-lg",
        "bg-atlas-50 hover:bg-atlas-100 transition-colors",
        "border border-atlas-200",
        "text-sm text-ink-800",
        "focus:outline-none focus:ring-2 focus:ring-atlas-500 focus:ring-offset-1",
      ].join(" ")}
      aria-label={`${count} more ${unit}, click to unlock with ${tierLabel}`}
    >
      <span>
        <span className="tabular-nums font-semibold text-ink-900">
          {count.toLocaleString("en-US")}
        </span>{" "}
        more {unit}
      </span>
      <span className="text-atlas-700 font-semibold whitespace-nowrap">
        {tierLabel} {ctaSuffix} &rarr;
      </span>
    </button>
  );
}
