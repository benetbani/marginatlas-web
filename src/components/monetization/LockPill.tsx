"use client";

/**
 * LockPill — v34 Phase A primitive #1.
 *
 * Inline indicator that a value or row is gated behind a paid tier.
 * The pill IS the affordance: a link to the pricing page (masterplan step 13;
 * his ruling 22 of 2026-09-26: a locked section opens no pop-up).
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
 * Part 3.1: exactly the plan's name, "Pro" (one paid tier since masterplan step 12). Nothing else.
 */

import type { PaywallEntryPoint, PaywallTier } from "./events";
import { trackLockClick } from "./analytics";
import { PRICING_HREF, TIERS } from "./paywall_copy";

export type LockPillProps = {
  tier: PaywallTier;
  entry: PaywallEntryPoint;
  /** Accessible label for screen readers. Should describe the feature
   * being gated, e.g. "Lower-mid quartile, click to unlock with Basic". */
  ariaLabel: string;
};

export function LockPill({ tier, entry, ariaLabel }: LockPillProps) {
  /* One paid tier (masterplan step 12): the plan's own name, one colour. */
  const label = TIERS[tier].name;
  const classes = "bg-atlas-700/10 text-atlas-800 hover:bg-atlas-700/15";

  return (
    <a
      href={PRICING_HREF}
      onClick={() => trackLockClick(entry, tier)}
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
    </a>
  );
}
