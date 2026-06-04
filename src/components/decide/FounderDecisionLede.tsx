/**
 * src/components/decide/FounderDecisionLede.tsx
 *
 * The /decide index founder-decision lede (bible Section 21, "What business
 * should I start in this city?", and Section 5, the "Best businesses to start"
 * row whose distinctive move is to frame by the founder's real constraint
 * rather than print a listicle). It is the index-altitude sibling of the
 * cell-page VerdictHero and the place-level GeoViabilityLede: a blunt,
 * opinionated read that the founder decision is which business, not only where,
 * followed by an honest best-versus-hardest contrast drawn from the curated
 * margin shape of every activity a founder can pick here.
 *
 * Server component, no client JS. Warm editorial layout, all colour and type
 * from tokens. Renders nullable inputs gracefully: every entry is pre-filtered
 * by the synthesis module (src/lib/scores/founder_decision), and the contrast
 * block simply does not mount when the catalogue is too thin to rank.
 *
 * Each activity links to its model page ("How [industry] businesses make
 * money"), the natural next read once the lede says to judge a business by what
 * reaches an owner. The city decision stays in the picker above.
 *
 * Design system: application section. It deliberately does NOT render its own
 * <section id=>; the page mounts it as a framing block.
 */
import * as React from "react";
import Link from "next/link";
import type {
  FounderDecision,
  FounderActivityRead,
} from "@/lib/scores/founder_decision";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export interface FounderDecisionLedeProps {
  decision: FounderDecision;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function entryToneText(tone: FounderActivityRead["tone"]): string {
  switch (tone) {
    case "good":
      return "text-moss-700";
    case "bad":
      return "text-clay-700";
    default:
      return "text-atlas-700";
  }
}

function ContrastColumn({
  eyebrow,
  entries,
  accentBorder,
}: {
  eyebrow: string;
  entries: FounderActivityRead[];
  accentBorder: string;
}) {
  if (entries.length === 0) return null;
  return (
    <div>
      <SectionEyebrow className="mb-3">{eyebrow}</SectionEyebrow>
      <dl className="space-y-4">
        {entries.map((e) => (
          <div key={e.industryId} className={`border-l-2 ${accentBorder} pl-4`}>
            <dt className="flex flex-wrap items-baseline gap-x-2">
              <Link
                href={`/industries/${e.slug}`}
                className="font-display text-lg font-medium leading-snug text-ink-900 hover:text-atlas-700"
              >
                {e.name}
              </Link>
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${entryToneText(
                  e.tone,
                )}`}
              >
                {e.note}
              </span>
            </dt>
            <dd className="mt-1">
              <span
                className={`text-xs font-semibold uppercase tracking-wide ${entryToneText(
                  e.tone,
                )}`}
              >
                {e.keepWord} keep
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-graphite">
                {cap(e.why)}.
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function FounderDecisionLede({ decision }: FounderDecisionLedeProps) {
  const hasContrast = decision.best.length > 0 || decision.hardest.length > 0;
  return (
    <section className="border-y border-parchment py-8 md:py-10">
      <SectionEyebrow className="mb-3">
        What business, not only where
      </SectionEyebrow>

      <div className="max-w-2xl space-y-3 text-base leading-relaxed text-graphite md:text-lg">
        <p>{decision.lead}</p>
        <p className="text-ink-900">{decision.close}</p>
      </div>

      {hasContrast ? (
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <ContrastColumn
            eyebrow="Leaves the most for an owner"
            entries={decision.best}
            accentBorder="border-moss-300"
          />
          <ContrastColumn
            eyebrow="The harder way to make a living"
            entries={decision.hardest}
            accentBorder="border-clay-300"
          />
        </div>
      ) : null}
    </section>
  );
}
