/**
 * PricingFAQ — client island for the /pricing accordion.
 *
 * v34-locked. No trial copy, no money-back, no Pro/Team names, no
 * educational-discount promise (deferred per Part 4.5).
 *
 * Reference: docs/strategy/2026-05-25-monetization-mega-plan-v34.md
 * Part 3 (microcopy lexicon) + Part 4 (tier matrix) + Part 8
 * (anti-pattern register).
 */

"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";

const ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "Can I cancel any time?",
    a: "Yes. Open your billing page and click Cancel. Your paid features stay active through the end of the current billing cycle. We never auto-renew you onto a longer plan.",
  },
  {
    q: "What happens to my saved cells if I downgrade or cancel?",
    a: "Saved cells stay attached to your account. If you cancel, you can still see the list, you just lose the ability to add new ones past the Free limit until you resubscribe.",
  },
  {
    q: "Why no free trial?",
    a: "Trials usually mean 'put your card in now and we will charge you in 14 days unless you remember to cancel'. We do not do that. Free is genuinely free, with the median, p10, and p90 visible on every cell. If that is enough, you never need to pay.",
  },
  {
    q: "What counts as a saved cell?",
    a: "Any (country, region, industry) page you star. The 25-cell Basic cap is generous on purpose; if you hit it, we hear about it. Premium is uncapped.",
  },
  {
    q: "Can I pay in EUR, GBP, or another currency?",
    a: "Yes. Atlas bills via Stripe in your local currency where Stripe supports it, at the prevailing wholesale rate, with no surcharge from us.",
  },
  {
    q: "Where do the methodology answers live?",
    a: "Every cell links to its sources, sample size, and coverage tier on the About-the-data page. The same page describes how we standardize across countries.",
  },
];

export default function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="bg-cream-50">
      <div className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">
          Honest answers
        </p>
        <h2 className="font-display mt-3 text-2xl sm:text-3xl leading-[1.1] tracking-[-0.02em] font-semibold text-ink-900">
          Frequently asked, plainly answered.
        </h2>
        <ul className="mt-8 rounded-lg bg-cream-50 border border-parchment">
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
