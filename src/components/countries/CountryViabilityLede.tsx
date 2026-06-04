/**
 * src/components/countries/CountryViabilityLede.tsx
 *
 * The country-page decision lede (bible Section 5: the Country page, with a
 * friction-adjusted view). It is the country-altitude sibling of the cell
 * page's VerdictHero: a blunt opinionated read of where the money tends to
 * be and the operating reality that gets in the way, followed by a compact
 * row of qualitative signals and a closing condition.
 *
 * Server component, no client JS. Warm editorial layout, all colour and type
 * from tokens. Renders nullable inputs gracefully: a country with no
 * computable verdict simply does not mount this block (the caller checks).
 *
 * Design system: application section. Consumes the country-verdict domain
 * (src/lib/scores/country_verdict). It deliberately does NOT render a
 * <section id=> so it stays out of the canonical country-page skeleton order
 * (it is a framing block, not one of the registered data sections).
 */
import * as React from "react";
import type { CountryVerdict, CountrySignal } from "@/lib/scores/country_verdict";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export interface CountryViabilityLedeProps {
  verdict: CountryVerdict;
}

function signalToneText(tone: CountrySignal["tone"]): string {
  switch (tone) {
    case "good":
      return "text-moss-700";
    case "bad":
      return "text-clay-700";
    default:
      return "text-atlas-700";
  }
}

export function CountryViabilityLede({ verdict }: CountryViabilityLedeProps) {
  return (
    <section className="border-y border-parchment/60 py-8 md:py-10">
      <SectionEyebrow className="mb-3">Can a business make money here?</SectionEyebrow>

      <div className="max-w-2xl space-y-3 text-base md:text-lg leading-relaxed text-graphite">
        <p>{verdict.lead}</p>
        <p className="text-ink-900">{verdict.close}</p>
      </div>

      {verdict.signals.length > 0 ? (
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          {verdict.signals.map((s) => (
            <div key={s.label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-cocoa-500">
                {s.label}
              </dt>
              <dd
                className={`mt-1 font-serif text-xl capitalize leading-none ${signalToneText(
                  s.tone,
                )}`}
              >
                {s.word}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
