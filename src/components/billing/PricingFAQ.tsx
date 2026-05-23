/**
 * PricingFAQ — client island for the accordion on /pricing.
 * Six honest Q&As. No "frequently lied to" copy.
 */

"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";

const ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel inside your billing tab and your Pro features stay active through the end of the current billing cycle. We never auto-renew you onto a longer plan.",
  },
  {
    q: "Do you offer refunds?",
    a: "If you cancel within the first 14 days of your Pro trial there is nothing to refund. Past that, we issue prorated refunds on request within 30 days of any charge.",
  },
  {
    q: "What counts as a saved cell?",
    a: "Any (country, geography, industry) page you star. The 50-cell Pro cap is generous on purpose; if you hit it, we hear about it. Team plans are uncapped.",
  },
  {
    q: "Can I pay in EUR, GBP, or another currency?",
    a: "Yes. Atlas bills via Stripe in your local currency where Stripe supports it, at the prevailing wholesale rate, with no surcharge from us.",
  },
  {
    q: "Is there an educational or non-profit discount?",
    a: "Verified educational and registered non-profit accounts get Pro for $7 per month and Team at $39 per month. Email us from your institutional address to apply.",
  },
  {
    q: "Where do the methodology answers live?",
    a: "Every cell links to its sources, sample size, and coverage tier on the methodology page. Pro and Team can attend office hours twice a month for follow-up questions.",
  },
];

export default function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="bg-cream-50">
      <div className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">Honest answers</p>
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
                  <span className="font-display text-base sm:text-lg font-semibold text-ink-900">{it.q}</span>
                  <span
                    aria-hidden="true"
                    className="text-atlas-700"
                    style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0)", transition: "transform 180ms ease" }}
                  >
                    <Plus size={16} weight="regular" />
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm sm:text-base text-cocoa-700 leading-relaxed">{it.a}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
