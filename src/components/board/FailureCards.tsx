/**
 * src/components/board/FailureCards.tsx
 *
 * The blunt closing block of the board: the handful of things that actually
 * sink weak operators in this business. A SectionEyebrow plus a grid of
 * compact cards, each a short title and a plain-spoken line. No hedging, no
 * em-dashes, no fluff. This is the part a would-be operator should screenshot.
 *
 * Returns null when there are no cards (nothing useful to warn about beats an
 * empty heading). Server component. Tokens only, mobile-first.
 */
import * as React from "react";
import { AtlasSpot } from "@/components/brand/spots";

export interface FailureCardsProps {
  cards: { title: string; body: string }[];
}

export function FailureCards({ cards }: FailureCardsProps) {
  if (!cards || cards.length === 0) return null;

  return (
    // SaaS reformation 2026-06-12: seated card section; the warning cards
    // inside go white-on-card with the amber caution accent on the title.
    // Canonical surface: was "rounded-lg border border-parchment bg-cream-50".
    <section className="atlas-card mt-5 px-5 py-5 md:px-7 md:py-6">
      <div className="flex items-start justify-between gap-6">
        <h3 className="font-display text-lg font-semibold tracking-tight text-ink-900 md:text-xl">
          What kills weak operators
        </h3>
        {/* The reality-check spot: one brand illustration on this beat. */}
        <AtlasSpot
          id="reality-check"
          width={104}
          className="hidden shrink-0 text-ink-800 sm:block"
        />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cards.map((card, i) => (
          <article
            key={`${card.title}-${i}`}
            // Card inside a card, so the soft variant: the outer section is
            // already the surface carrying the photograph. Was "rounded-md
            // border border-parchment bg-white".
            className="atlas-card-soft p-4"
          >
            <h4 data-typography="custom" className="font-semibold text-ink-900">{card.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-cocoa-700">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
