/**
 * src/components/home/WhatAtlasWeighs.tsx
 *
 * The homepage "decision factors" strip (bible Section 25 voice, Section 26
 * first-angles). It makes the hero promise concrete: the average margin is
 * not the point. What decides whether a business works is what eats the
 * margin before the owner sees a cent. This block names those forces in the
 * blunt, operator register and lands the reader on the page that holds the
 * real numbers.
 *
 * Reworked 2026-06-06 (founder: the old five-card icon grid read vague and
 * feeling-less). Eight forces now, each written as a FELT consequence with a
 * concrete texture: a real number or a hard verdict, not an abstraction. The
 * decorative house/car/customer iconography is gone. Each row is a clean,
 * number-forward line on a hairline-separated list, white throughout. A
 * single restrained vermillion tick is the only mark.
 *
 * Server component, no client JS. All colour and type from tokens.
 *
 * Design system: application section. Page-local (one consumer, the
 * homepage), so it lives beside the other home/* sections rather than in
 * the ui/ system layer.
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

type Factor = {
  /** The force, in two or three plain words. */
  label: string;
  /** The felt consequence: a real number or a hard verdict, with texture. */
  note: string;
};

const FACTORS: Factor[] = [
  {
    label: "Rent",
    note: "On the wrong street, rent alone eats a fifth of every sale before payroll.",
  },
  {
    label: "Competition",
    note: "Forty barbershops in one district and nobody is ever full.",
  },
  {
    label: "Owner take-home",
    note: "A million in sales can still leave the owner under fifty thousand.",
  },
  {
    label: "Wages",
    note: "When staff is most of the cost, one extra hire is the difference between a wage and a loss.",
  },
  {
    label: "Pricing power",
    note: "Whether you set the price, or the market sets it for you.",
  },
  {
    label: "Taxes and friction",
    note: "What the taxman and the paperwork take before you see a cent.",
  },
  {
    label: "Foot traffic",
    note: "The same shop clears double on a corner that thousands pass and dies on the quiet one.",
  },
  {
    label: "Break-even",
    note: "High costs are survivable above a revenue line that most concepts never reach.",
  },
];

export function WhatAtlasWeighs() {
  return (
    <section aria-labelledby="weigh-h2" className="py-12 md:py-16">
      <div className="max-w-2xl">
        <SectionEyebrow size="md" className="mb-3">
          What actually decides it
        </SectionEyebrow>
        <h2
          id="weigh-h2"
          className="font-display text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-ink-900 leading-tight"
        >
          Eight forces decide whether you keep anything
        </h2>
        <p className="mt-3 md:mt-4 text-base md:text-lg text-graphite leading-relaxed">
          The average margin hides all of them. Atlas reads each city and
          industry through the forces that actually move the answer, the ones
          that drain an owner long before the spreadsheet admits it.
        </p>
      </div>

      <dl className="mt-8 md:mt-10 border-t border-parchment">
        {FACTORS.map((f) => (
          <div
            key={f.label}
            className="grid grid-cols-1 sm:grid-cols-[minmax(0,11rem)_1fr] gap-x-6 gap-y-1 border-b border-parchment py-4 md:py-5"
          >
            <dt className="flex items-baseline gap-2 font-display text-base md:text-lg font-semibold tracking-tight text-ink-900">
              <span aria-hidden="true" className="text-atlas-700">
                /
              </span>
              {f.label}
            </dt>
            <dd className="text-sm md:text-base text-graphite leading-relaxed">
              {f.note}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
