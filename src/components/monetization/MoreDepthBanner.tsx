"use client";

/**
 * MoreDepthBanner — v34 Phase C compact mount for pages where a
 * full visible-lock primitive (GhostBar, blurred overlay) would be
 * out of place. Renders a calm one-line strip with a LockPill that
 * opens the paywall modal at the page-appropriate entry point.
 *
 * Used on /compare, /industries/{industry}, /cities/{city},
 * /sectors/{sector}, /calculator. Each page passes its own entry
 * point + headline.
 *
 * v34 rules:
 *  - No padlock icon.
 *  - One CTA only. (Choice overload literature: simpler wins.)
 *  - Calm visual register: atlas-50 background, no urgency cues.
 *  - Headline names the JOB, not the tier (Part 3.3 echo).
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 2 (primitives) + Part 5.1 (per-page matrix).
 */

import { LockPill } from "./LockPill";
import type { PaywallEntryPoint, PaywallTier } from "./events";

export type MoreDepthBannerProps = {
  headline: string;
  tier?: PaywallTier;
  entry: PaywallEntryPoint;
};

export function MoreDepthBanner({
  headline,
  tier = "basic",
  entry,
}: MoreDepthBannerProps) {
  return (
    <div
      data-v34-section="more-depth-banner"
      className="my-8 rounded-xl border border-atlas-200 bg-atlas-50 px-4 py-3 flex items-center justify-between gap-3 text-sm text-ink-800"
    >
      <span>{headline}</span>
      <LockPill
        tier={tier}
        entry={entry}
        ariaLabel={`${headline}. Click to learn what ${tier === "basic" ? "Basic" : "Premium"} unlocks.`}
      />
    </div>
  );
}
