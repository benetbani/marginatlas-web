/**
 * SectionEmpty - the always-present placeholder state for a required section.
 *
 * The founder's rule (2026-06-13): every section a page type should have is
 * ALWAYS present, even when we hold no data for this instance. A required
 * section with no data renders THIS, never self-omits and never a wall of
 * dashes. It carries the same eyebrow + heading as the filled section (so the
 * page reads as one complete, consistent structure) and one calm line saying we
 * do not hold it yet. A dashed border + muted ground distinguishes it from a
 * filled card at a glance, so it reads as intentional scaffolding, not broken.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names. No fabricated
 * data ever appears here, it is an honest "not yet" placeholder.
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export type SectionEmptyProps = {
  /** The section eyebrow (same label the filled section uses). */
  eyebrow: string;
  /** The section heading (same as the filled section). */
  heading?: string | null;
  /** Anchor id for the sticky nav (same id the filled section uses). */
  id?: string;
  /** Optional place name, woven into the default line ("for London yet"). */
  place?: string | null;
  /** Optional override for the placeholder line. */
  note?: string | null;
  className?: string;
};

export function SectionEmpty({
  eyebrow,
  heading,
  id,
  place,
  note,
  className,
}: SectionEmptyProps) {
  const line =
    note ??
    (place
      ? `We do not hold this for ${place} yet. It fills in as our coverage deepens.`
      : "We do not hold this yet. It fills in as our coverage deepens.");
  return (
    <section
      id={id}
      aria-label={heading || eyebrow}
      className={[
        "rounded-lg border border-dashed border-parchment bg-cream-50/50",
        "px-5 py-5 md:px-7 md:py-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <SectionEyebrow className="mb-1">{eyebrow}</SectionEyebrow>
      {heading ? (
        <h2 className="font-display text-xl font-medium tracking-tight text-balance text-cocoa-700/80 md:text-2xl">
          {heading}
        </h2>
      ) : null}
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cocoa-500">
        {line}
      </p>
    </section>
  );
}
