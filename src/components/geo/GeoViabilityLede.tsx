/**
 * src/components/geo/GeoViabilityLede.tsx
 *
 * The city/region-page decision lede (bible Section 5: the City page row,
 * "Best and hardest businesses in [city]", whose distinctive move is to use the
 * actual economic modules rather than a listicle). It is the place-altitude
 * sibling of the cell page's VerdictHero, the country page's
 * CountryViabilityLede, and the industry page's IndustryModelLede: a blunt,
 * opinionated read of which kinds of business tend to work in this place and
 * which are hard, followed by an honest best-versus-hardest contrast drawn from
 * the local activity mix and its margin structure.
 *
 * Server component, no client JS. Warm editorial layout, all colour and type
 * from tokens. Renders nullable inputs gracefully: every clause and entry is
 * pre-filtered by the synthesis module (src/lib/scores/geo_verdict), and the
 * contrast block simply does not mount when the local mix is too thin to rank.
 *
 * Design system: application section. It deliberately does NOT render its own
 * <section id=>; the page mounts it as a framing block, so it stays out of the
 * canonical geo-page skeleton order (hero, top-cities, top-industries).
 */
import * as React from "react";
import type { GeoVerdict, GeoActivityRead } from "@/lib/scores/geo_verdict";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export interface GeoViabilityLedeProps {
  verdict: GeoVerdict;
  /** Build the cell-page href for an activity. Supplied by the page. */
  hrefFor: (industryId: string) => string;
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function entryToneText(tone: GeoActivityRead["tone"]): string {
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
  hrefFor,
}: {
  eyebrow: string;
  entries: GeoActivityRead[];
  accentBorder: string;
  hrefFor: (industryId: string) => string;
}) {
  if (entries.length === 0) return null;
  return (
    <div>
      <SectionEyebrow className="mb-3">{eyebrow}</SectionEyebrow>
      <dl className="space-y-4">
        {entries.map((e) => (
          <div key={e.industryId} className={`border-l-2 ${accentBorder} pl-4`}>
            <dt>
              <a
                href={hrefFor(e.industryId)}
                className="font-serif text-lg leading-snug text-ink-900 hover:text-atlas-700"
              >
                {e.name}
              </a>
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

export function GeoViabilityLede({ verdict, hrefFor }: GeoViabilityLedeProps) {
  const hasContrast = verdict.best.length > 0 || verdict.hardest.length > 0;
  return (
    <section className="border-y border-parchment/60 py-8 md:py-10">
      <SectionEyebrow className="mb-3">
        Best and hardest businesses here
      </SectionEyebrow>

      <div className="max-w-2xl space-y-3 text-base leading-relaxed text-graphite md:text-lg">
        <p>{verdict.lead}</p>
        <p className="text-ink-900">{verdict.close}</p>
      </div>

      {hasContrast ? (
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <ContrastColumn
            eyebrow="Leaves the most for an owner"
            entries={verdict.best}
            accentBorder="border-moss-300"
            hrefFor={hrefFor}
          />
          <ContrastColumn
            eyebrow="The harder way to make a living"
            entries={verdict.hardest}
            accentBorder="border-clay-300"
            hrefFor={hrefFor}
          />
        </div>
      ) : null}
    </section>
  );
}
