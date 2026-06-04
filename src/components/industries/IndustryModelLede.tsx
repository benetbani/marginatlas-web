/**
 * src/components/industries/IndustryModelLede.tsx
 *
 * The industry-page decision lede (bible Section 5: the Industry page, whose
 * distinctive move is to show the "business model anatomy"). It is the
 * activity-altitude sibling of the cell page's VerdictHero and the country
 * page's CountryViabilityLede: a blunt, opinionated read of how this kind of
 * business actually makes money, where the margin really goes, and what tends
 * to kill the weak operators, followed by the cost-stage anatomy and (where
 * written) the one thing the strong operators do.
 *
 * Server component, no client JS. Warm editorial layout, all colour and type
 * from tokens. Renders nullable inputs gracefully: every clause and signal is
 * pre-filtered by the synthesis module, and the optional "edge" card simply
 * does not mount when the activity has no written character.
 *
 * Design system: application section. Consumes the industry-verdict domain
 * (src/lib/scores/industry_verdict). It does NOT render its own <section id=>;
 * the page mounts it inside the registered "how-it-works" section so it stays
 * out of the canonical industry-page skeleton order.
 */
import * as React from "react";
import type {
  IndustryVerdict,
  IndustrySignal,
} from "@/lib/scores/industry_verdict";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export interface IndustryModelLedeProps {
  verdict: IndustryVerdict;
  /** What the strong operators do, lifted from the activity character. Optional. */
  edge?: string | null;
}

function signalToneText(tone: IndustrySignal["tone"]): string {
  switch (tone) {
    case "good":
      return "text-moss-700";
    case "bad":
      return "text-clay-700";
    default:
      return "text-atlas-700";
  }
}

export function IndustryModelLede({ verdict, edge }: IndustryModelLedeProps) {
  return (
    <div className="max-w-3xl">
      <SectionEyebrow className="mb-3">How this business makes money</SectionEyebrow>

      <p className="font-serif text-2xl leading-snug text-atlas-700 sm:text-3xl">
        {verdict.headline}.
      </p>

      <div className="mt-5 max-w-2xl space-y-3 text-base leading-relaxed text-graphite">
        <p>{verdict.lead}</p>
        <p className="text-ink-900">{verdict.close}</p>
      </div>

      {/* The business-model anatomy: each cost stage as a qualitative word,
          read top-of-sale to bottom-line. This is the distinctive move. */}
      {verdict.signals.length > 0 ? (
        <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {verdict.signals.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-parchment/70 bg-cream-50 p-4"
            >
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
              <p className="mt-2 text-sm leading-relaxed text-graphite">
                {s.note}
              </p>
            </div>
          ))}
        </dl>
      ) : null}

      {edge && edge.trim() ? (
        <div className="mt-6 border-l-2 border-moss-300 pl-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-moss-700">
            What the best operators do
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-900">{edge}</p>
        </div>
      ) : null}
    </div>
  );
}
