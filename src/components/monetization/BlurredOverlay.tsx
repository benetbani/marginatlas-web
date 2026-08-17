"use client";

/**
 * BlurredOverlay — v34 Phase A primitive #2.
 *
 * Wraps a block of locked content. Renders the children underneath
 * (so screen readers and search crawlers see the structure) and
 * floats a centered CTA card on top.
 *
 * v34 research-locked rules:
 *  - blur radius = 6px exactly. NOT 12+. The disfluency literature
 *    shows perceptually harsh blur produces null/inconsistent
 *    results. (Psych conclusion #3: structural concealment,
 *    not perceptual torment.)
 *  - background overlay = white at 40% — preserves underlying SHAPE,
 *    removes legibility.
 *  - Centered CTA card max 320px width, single paragraph + one
 *    button.
 *  - The locked children get aria-hidden="true" on their value
 *    spans (caller must apply via the gated-region rendering).
 *
 * Microcopy: caller passes the CTA label directly. Standard
 * options live in Part 3.2 of the plan.
 */

import { ReactNode } from "react";
import { openPaywall, PaywallEntryPoint, PaywallTier } from "./events";

export type BlurredOverlayProps = {
  tier: PaywallTier;
  entry: PaywallEntryPoint;
  /** The CTA button label. Must come from Part 3.2 microcopy lexicon. */
  cta: string;
  /** Optional one-line headline above the CTA. */
  headline?: string;
  children: ReactNode;
};

export function BlurredOverlay({
  tier,
  entry,
  cta,
  headline,
  children,
}: BlurredOverlayProps) {
  const tierLabel = tier === "basic" ? "Basic" : "Premium";
  const buttonClasses =
    tier === "basic"
      ? "bg-atlas-700 text-white hover:bg-atlas-800"
      : "bg-ink-900 text-white hover:bg-ink-800";

  return (
    <div className="relative" data-v34-lock="overlay" data-v34-tier={tier}>
      {/* The gated content stays in the DOM for crawlers + a11y,
          but is visually muted and pointer-events-disabled. */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none"
        style={{
          filter: "blur(6px)",
          // Keep proportions so the layout doesn't shift when the
          // overlay disappears post-unlock.
          opacity: 0.55,
        }}
      >
        {children}
      </div>
      {/* Calm overlay on top — a white wash, not a heavy scrim. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-white/40"
      />
      {/* CTA card — single paragraph + one button. */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="max-w-[320px] w-full bg-white border border-paper-350 rounded-xl shadow-sm p-4 text-center">
          {headline ? (
            <div className="text-sm font-semibold text-ink-900 mb-2">
              {headline}
            </div>
          ) : null}
          <button
            type="button"
            onClick={() => openPaywall({ entry, tier })}
            className={[
              "inline-flex w-full justify-center items-center",
              "px-4 py-2 rounded-full text-sm font-semibold",
              "transition-colors",
              buttonClasses,
            ].join(" ")}
            aria-label={`${cta} (opens ${tierLabel} paywall)`}
          >
            {cta}
          </button>
        </div>
      </div>
    </div>
  );
}
