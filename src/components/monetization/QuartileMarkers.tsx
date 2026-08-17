"use client";

/**
 * QuartileMarkers — v34 Phase C: per-cell-page mount of the lock
 * primitives on the highest-leverage surface (the distribution).
 *
 * Renders all five quartiles as a horizontal strip:
 *   p10 . p25 . p50 . p75 . p90
 *
 * p10, p50, p90 are visible to free users (the headline tier signal).
 * p25, p75 render as <RedactedNumber /> with the v34 redacted glyph
 * and the dotted-underline affordance. Clicking either opens the
 * paywall modal at the cell_distribution_p25_p75 entry point.
 *
 * Why a separate component vs editing DistributionVisual:
 *  - Keeps Phase C surgically additive. The existing chart stays
 *    untouched; if Phase C ships broken, the lock UI is the only
 *    thing affected.
 *  - Server-rendering the existing chart vs the client-only paywall
 *    primitives stays cleanly separated.
 *  - The free-user experience strictly improves: they see the SHAPE
 *    of the distribution with five marked positions even though two
 *    of them are locked.
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 2 (primitives) + Part 5.1 (per-page matrix, cell row) + Part
 * 6 Phase C.
 */

import { fmtMoney } from "@/lib/format/money";
import { RedactedNumber } from "./RedactedNumber";

type Props = {
  p10: number | null;
  p25: number | null; // not displayed; used for the lock affordance
  p50: number | null;
  p75: number | null; // not displayed; used for the lock affordance
  p90: number | null;
};

type Marker = {
  key: "p10" | "p25" | "p50" | "p75" | "p90";
  label: string;
  /** When the value is known + the marker is for a free-visible
   * percentile, render it. When the marker is for a Basic-gated
   * percentile, value is null here on purpose. */
  unlockedValue: number | null;
  /** True if this marker is gated for Free users (drives RedactedNumber). */
  gated: boolean;
};

export function QuartileMarkers({ p10, p25, p50, p75, p90 }: Props) {
  // If we don't have at least p10/p50/p90, hide the whole panel — there's
  // no useful distribution to anchor the lock primitives against.
  if (p10 == null || p50 == null || p90 == null) return null;

  const markers: Marker[] = [
    { key: "p10", label: "Bottom 10%", unlockedValue: p10, gated: false },
    {
      key: "p25",
      label: "Lower-mid",
      unlockedValue: null, // Basic-gated; render RedactedNumber
      gated: true,
    },
    { key: "p50", label: "Typical", unlockedValue: p50, gated: false },
    {
      key: "p75",
      label: "Upper-mid",
      unlockedValue: null, // Basic-gated; render RedactedNumber
      gated: true,
    },
    { key: "p90", label: "Top 10%", unlockedValue: p90, gated: false },
  ];

  // Suppress markers we have no data for at all (e.g. p25 missing from
  // the cell entirely — we still gate it, but the lock affordance is
  // useless if we don't even have it server-side). The v34 audit's
  // Gate D (no leaked values) is still satisfied either way.
  void p25;
  void p75;

  return (
    <section
      data-v34-section="quartile-markers"
      className="atlas-card mt-4 mb-10 p-4"
    >
      <div className="text-[10px] uppercase tracking-wider text-cocoa-700/60 font-semibold mb-3">
        Every quartile, at a glance
      </div>
      <div className="grid grid-cols-5 gap-2">
        {markers.map((m) => (
          <div
            key={m.key}
            className="text-center"
            data-v34-quartile={m.key}
          >
            <div className="text-[10px] uppercase tracking-wider text-cocoa-700/60 font-semibold">
              {m.label}
            </div>
            <div className="mt-1 font-display text-lg md:text-xl text-ink-900 tabular-nums leading-tight">
              {m.gated ? (
                <RedactedNumber
                  tier="basic"
                  entry="cell_distribution_p25_p75"
                  ariaLabel={`${m.label} revenue, click to unlock with Basic`}
                />
              ) : (
                fmtMoney(m.unlockedValue)
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
