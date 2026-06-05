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
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export interface FailureCardsProps {
  cards: { title: string; body: string }[];
}

export function FailureCards({ cards }: FailureCardsProps) {
  if (!cards || cards.length === 0) return null;

  return (
    <section className="mt-8">
      <SectionEyebrow>What kills weak operators</SectionEyebrow>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {cards.map((card, i) => (
          <article
            key={`${card.title}-${i}`}
            className="rounded-lg border border-parchment bg-cream-50 p-3"
          >
            <h3 data-typography="custom" className="font-semibold text-ink-900">{card.title}</h3>
            <p className="mt-1 text-sm text-cocoa-700">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
