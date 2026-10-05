"use client";

/**
 * RedactedNumber — v34 Phase A primitive #4.
 *
 * Inline replacement for a single locked numeric value. Renders
 * a money-shaped placeholder ("$••,•••") in the same tabular-nums
 * style as a real number so the surrounding layout does not
 * shift when the user unlocks.
 *
 * v34 research-locked rules:
 *  - Visual cue is a dotted underline (atlas-300), NOT a padlock.
 *  - The element IS the affordance: a link to the pricing page (masterplan
 *    step 13; his ruling 22 of 2026-09-26: a locked section opens no pop-up).
 *    Inside another link (a ranking row) it is text, since a link inside a
 *    link is not valid HTML; the row's own link leads on.
 *  - Title attribute provides the gentle hint; aria-label gives
 *    the screen reader the same intent.
 *  - The TRUE value MUST NOT be embedded in any data attribute
 *    or aria field — that would be a leak gate (Part 5.2 #3).
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 2.4.
 */

import type { PaywallEntryPoint, PaywallTier } from "./events";
import { trackLockClick } from "./analytics";
import { PRICING_HREF } from "./paywall_copy";

export type RedactedNumberProps = {
  tier: PaywallTier;
  entry: PaywallEntryPoint;
  /** Glyph string for the redacted display. Defaults to a money-shaped
   * placeholder. Width should match the unlocked value's width within
   * a few px to avoid layout shift. */
  glyph?: string;
  /** Accessible label describing what is hidden, e.g.
   * "Lower-mid quartile revenue, click to unlock with Basic". */
  ariaLabel: string;
  /** True when the number sits inside another link: it renders as text. */
  inLink?: boolean;
};

export function RedactedNumber({
  tier,
  entry,
  glyph = "$••,•••",
  ariaLabel,
  inLink = false,
}: RedactedNumberProps) {
  const look = [
    "inline-flex items-baseline tabular-nums",
    "font-medium text-ink-700",
    "border-b border-dotted border-atlas-300",
  ];
  if (inLink) {
    return (
      <span data-v34-lock="redacted" data-v34-tier={tier} title={ariaLabel} className={look.join(" ")}>
        <span aria-hidden="true">{glyph}</span>
        <span className="sr-only">{ariaLabel}</span>
      </span>
    );
  }
  return (
    <a
      href={PRICING_HREF}
      onClick={() => trackLockClick(entry, tier)}
      data-v34-lock="redacted"
      data-v34-tier={tier}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={[
        ...look,
        "hover:text-atlas-700 hover:border-atlas-500",
        "transition-colors cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-atlas-500 focus:ring-offset-1",
      ].join(" ")}
    >
      {glyph}
    </a>
  );
}
