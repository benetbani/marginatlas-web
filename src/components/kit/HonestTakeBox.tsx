/**
 * HonestTakeBox - THE through-line (design-system Article 5 / 13.1 #2).
 *
 * Every Atlas page, right after the headline numbers, says the quiet part out
 * loud: who this is really for, what the numbers hide, where the catch is. It
 * is the one editorial device that appears on every page type, so the reader
 * learns to look for it. The honest-take spot lives here, its single brand
 * moment for the band (design-system 9.3: at most one spot per band).
 *
 * Self-omitting: with no verdict line AND no body it renders nothing, so a page
 * that holds no honest read stays silent rather than printing an empty frame.
 * The pages source the verdict line and body from the verdict modules
 * (industry_verdict, founder_decision, geo_verdict, country_verdict,
 * compare_verdict) or write them inline for the curated exemplar.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { AtlasSpot } from "@/components/brand/spots";
import type { AtlasSpotId } from "@/components/brand/spots";

export type HonestTakeBoxProps = {
  /** The one-line bottom read. The visual lead; omit to lead with the body. */
  verdict?: string | null;
  /** The explanation. A string, or rich nodes for a page that needs them. */
  children?: React.ReactNode;
  /** Optional supporting points, each self-omitting on empty. */
  points?: Array<string | null | undefined> | null;
  /** The eyebrow label. Defaults to the canonical "The honest take". */
  eyebrow?: string;
  /** Which spot to host; defaults to the honest-take spot. */
  spot?: AtlasSpotId | null;
  /** Anchor id for the sticky section nav. */
  id?: string;
  className?: string;
};

function hasText(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

export function HonestTakeBox({
  verdict,
  children,
  points,
  eyebrow = "The honest take",
  spot = "honest-take",
  id,
  className,
}: HonestTakeBoxProps) {
  const cleanPoints = (points ?? []).filter(hasText) as string[];
  const hasBody = children != null && children !== false;
  // Silence out: nothing to say means no frame.
  if (!hasText(verdict) && !hasBody && cleanPoints.length === 0) return null;

  return (
    <section
      id={id}
      aria-label={eyebrow}
      className={[
        "rounded-lg border border-parchment bg-cream-100",
        "px-5 py-5 md:px-7 md:py-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <SectionEyebrow className="mb-2">{eyebrow}</SectionEyebrow>
          {hasText(verdict) ? (
            <p className="font-display text-xl font-medium leading-snug tracking-tight text-balance text-ink-900 md:text-2xl">
              {verdict}
            </p>
          ) : null}
          {hasBody ? (
            <div className="mt-2.5 max-w-2xl space-y-2.5 text-sm leading-relaxed text-graphite md:text-base">
              {typeof children === "string" ? <p>{children}</p> : children}
            </div>
          ) : null}
          {cleanPoints.length > 0 ? (
            <ul className="mt-3 space-y-1.5">
              {cleanPoints.map((pt, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-sm leading-relaxed text-cocoa-700"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-atlas-500"
                  />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {spot ? (
          <div className="hidden shrink-0 text-cocoa-500/80 sm:block">
            <AtlasSpot id={spot} width={132} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
