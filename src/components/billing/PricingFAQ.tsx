/**
 * PricingFAQ — client island for the /pricing accordion.
 *
 * v34-locked. No trial copy, no money-back, no educational-discount
 * promise (deferred per Part 4.5). One plan, Pro, since masterplan step 12.
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 3 (microcopy lexicon) + Part 4 (tier matrix) + Part 8
 * (anti-pattern register).
 */

"use client";

import { useState } from "react";
import { isPaywallOn } from "@/lib/feature_flags";
import { Plus } from "@phosphor-icons/react/dist/ssr";

/* ONE PLAN'S QUESTIONS (masterplan step 12; his rulings 14, 17, 20, 33, 34). The saved-cell caps and the June tiers went with
   Basic and Premium; the currency answer follows ruling 33 (dollars everywhere): Stripe charges dollars and a card in another
   currency is converted by the bank. The free answer follows the paywall's switch, so it says today what is true today. */
const ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "Can I cancel any time?",
    a: "Yes. Open your account and choose Manage or cancel. Pro stays open to the end of the period you paid for.",
  },
  {
    q: "What does Pro open?",
    a: "The second half of every chapter on the UK's pages, and four sections of its own.",
  },
  {
    q: "Why no free trial?", // allow-v34-trial
    a: isPaywallOn()
      ? "The first half of every UK chapter is free to read, so you can judge the work before you pay."
      : "Every benchmark is free to read today, so you can judge the work before Pro opens.",
  },
  {
    q: "Which currency do I pay in?",
    a: "Pro is priced and charged in US dollars. A card in another currency is converted by your bank.",
  },
  {
    q: "Where do the methodology answers live?",
    a: "Every figure is one of four kinds, set out with its sources on the About the figures page.",
  },
];

export default function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    // Section ground REMOVED. This painted an opaque full-width band over the
    // fixed page photograph for its whole height. Legibility is a property of
    // the card, not of the backdrop, so the band goes transparent and the FAQ
    // list below carries the surface.
    /* ONE LEFT EDGE, AND THE HEADING ON A CARD. Seen at 1440: this band was
       `mx-auto max-w-3xl px-6`, a second column cap and a second gutter inside
       the ones SiteChrome already gives the route. It put the heading at x=353
       while every other heading on /pricing starts at x=205, so the page had
       two left edges; and it pushed "Frequently asked, plainly answered." off
       the calm left of the photograph and onto the busiest part of it, sea
       glare and rooftops, with no ground under the type at all. Every other
       section heading on this page sits inside an atlas-card. This one now
       does too, at full width, which fixes the alignment, the legibility and
       the cohesion in the same move. */
    <section className="py-12 sm:py-16">
      <div className="atlas-card px-5 py-6 md:px-7 md:py-7">
        <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">
          Honest answers
        </p>
        <h2 className="font-display mt-3 text-2xl sm:text-3xl leading-[1.1] tracking-[-0.02em] font-semibold text-ink-900">
          Frequently asked, plainly answered.
        </h2>
        {/* The list is a nested surface inside the band card, matching the
            tier table two sections up. */}
        <ul className="atlas-card-soft mt-8">
          {ITEMS.map((it, i) => {
            const isOpen = open === i;
            return (
              <li key={it.q} className={i > 0 ? "border-t border-parchment" : ""}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left flex items-center justify-between gap-4 px-5 py-4"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base sm:text-lg font-semibold text-ink-900">
                    {it.q}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-atlas-700"
                    style={{
                      transform: isOpen ? "rotate(45deg)" : "rotate(0)",
                      transition: "transform 180ms ease",
                    }}
                  >
                    <Plus size={16} weight="regular" />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm sm:text-base text-cocoa-700 leading-relaxed">
                    {it.a}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
