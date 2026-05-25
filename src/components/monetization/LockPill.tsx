"use client";

/**
 * LockPill — v34 Phase A primitive #1.
 *
 * Inline indicator that a value or row is gated behind a paid tier.
 * The pill IS the affordance: clicking opens the paywall modal.
 *
 * v34 research-locked rules:
 *  - NO padlock icon. The word "Basic" or "Premium" is the signal.
 *    (Padlocks read as "not allowed" rather than "not yet paid".
 *    Teardown §D.)
 *  - Click only. No hover-to-trigger. Preserves mobile parity.
 *  - Geometry locked: 20px height, 8px horizontal padding,
 *    9999px radius, text-[11px] uppercase tracking-wide.
 *  - Colour locked: Basic = atlas-700/10 / atlas-800;
 *    Premium = ink-900/8 / ink-900.
 *
 * Microcopy: from docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 3.1: exactly "Basic" or "Premium". Nothing else.
 */

import { openPaywall, PaywallEntryPoint, PaywallTier } from "./events";

export type LockPillProps = {
  tier: PaywallTier;
  entry: PaywallEntryPoint;
  /** Accessible label for screen readers. Should describe the feature
   * being gated, e.g. "Lower-mid quartile, click to unlock with Basic". */
  ariaLabel: string;
};

export function LockPill({ tier, entry, ariaLabel }: LockPillProps) {
  const label = tier === "basic" ? "Basic" : "Premium";
  const classes =
    tier === "basic"
      ? "bg-atlas-700/10 text-atlas-800 hover:bg-atlas-700/15"
      : "bg-ink-900/8 text-ink-900 hover:bg-ink-900/12";

  return (
    <button
      type="button"
      onClick={() => openPaywall({ entry, tier })}
      aria-label={ariaLabel}
      className={[
        "inline-flex items-center h-5 px-2 rounded-full",
        "text-[11px] uppercase tracking-wide font-semibold",
        "transition-colors cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-atlas-500 focus:ring-offset-1",
        classes,
      ].join(" ")}
      data-v34-lock="pill"
      data-v34-tier={tier}
    >
      {label}
    </button>
  );
}
