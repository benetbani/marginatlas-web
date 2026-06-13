/**
 * SectionEmpty - the always-present placeholder state for a required section.
 *
 * The founder's rule (2026-06-13): every section a page type should have is
 * ALWAYS present, even when we hold no data for this instance. A required
 * section with no data still renders, keeps its anchor, and reads as intentional
 * scaffolding, never as a broken or fabricated card.
 *
 * Round 5: this is now COMPACT, a single quiet row (eyebrow + heading on the
 * left, a "Not held yet" tag on the right), not a full-height dashed card. A run
 * of these no longer reads as a long TODO list on a thin page, while every
 * section stays present and its nav anchor still resolves. The tag (a dot plus
 * words) is a non-colour affordance, so the empty state never depends on the
 * dashed border alone. Solid muted tokens (cocoa-700) clear WCAG AA on the cream
 * grounds; no opacity-faded ink.
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
  /** Optional place name (kept for API compatibility; folded into the aria label). */
  place?: string | null;
  /** Optional short override line, shown quietly under the heading when set. */
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
  return (
    <section
      id={id}
      aria-label={`${heading || eyebrow}${place ? `, for ${place}, not held yet` : ", not held yet"}`}
      className={[
        "flex items-center justify-between gap-4 rounded-lg border border-dashed border-parchment bg-cream-50/50",
        "px-5 py-3.5 md:px-7",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="min-w-0">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        {heading ? (
          <h2 className="mt-0.5 font-display text-base font-medium tracking-tight text-balance text-cocoa-700 md:text-lg">
            {heading}
          </h2>
        ) : null}
        {note ? <p className="mt-1 text-sm leading-relaxed text-cocoa-700">{note}</p> : null}
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-parchment bg-cream-100 px-2.5 py-1 text-[11px] font-medium text-cocoa-700">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-cocoa-300" />
        Not held yet
      </span>
    </section>
  );
}
