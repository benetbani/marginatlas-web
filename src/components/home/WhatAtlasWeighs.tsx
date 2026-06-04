/**
 * src/components/home/WhatAtlasWeighs.tsx
 *
 * The homepage "decision factors" strip (bible Section 25 voice, Section 26
 * first-angles). It makes the hero promise concrete: the average margin is
 * not the point. What decides whether a business works is what eats the
 * margin before the owner sees a cent. This block names those forces in the
 * blunt, skeptical register and lands the reader on the page that holds the
 * real numbers.
 *
 * Server component, no client JS. Warm editorial layout, all colour and type
 * from tokens. The five factors map to the bible's first five information
 * angles: owner take-home, rent pressure, market saturation, break-even,
 * pricing power.
 *
 * Design system: application section. Page-local (one consumer, the
 * homepage), so it lives beside the other home/* sections rather than in
 * the ui/ system layer.
 */
import * as React from "react";
import {
  Wallet,
  Buildings,
  UsersThree,
  Scales,
  TrendUp,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhIcon } from "@phosphor-icons/react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

type Factor = {
  icon: PhIcon;
  label: string;
  /** One blunt line: what this force does to the margin, and the catch. */
  note: string;
};

const FACTORS: Factor[] = [
  {
    icon: Wallet,
    label: "Owner take-home",
    note: "A business can create jobs without paying its owner a decent wage. That is not the same as a good business.",
  },
  {
    icon: Buildings,
    label: "Rent pressure",
    note: "High rent is not automatically fatal. It only works above a revenue threshold, and most concepts never clear it.",
  },
  {
    icon: UsersThree,
    label: "Competition",
    note: "The revenue can be there while the margin is gone, because too many operators are already splitting the same demand.",
  },
  {
    icon: Scales,
    label: "Taxes and friction",
    note: "Payroll taxes, permits, and informal rivals quietly widen the gap between the spreadsheet and the operating reality.",
  },
  {
    icon: TrendUp,
    label: "Pricing power",
    note: "Whether you can raise prices, or have to discount to survive, usually decides the business before the costs do.",
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
          The average margin is the least useful number in the room
        </h2>
        <p className="mt-3 md:mt-4 text-base md:text-lg text-graphite leading-relaxed">
          What separates a business that works from one that quietly drains
          its owner is what eats the margin first. Atlas reads each city and
          industry through the forces that actually move the answer.
        </p>
      </div>

      <dl className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {FACTORS.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.label}
              className="rounded-lg border border-parchment bg-cream-50 p-5"
            >
              <div className="flex items-center gap-2 text-atlas-700">
                <Icon size={20} weight="duotone" aria-hidden="true" />
                <dt className="font-display text-lg font-semibold tracking-tight text-ink-900">
                  {f.label}
                </dt>
              </div>
              <dd className="mt-2 text-sm text-graphite leading-relaxed">
                {f.note}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
