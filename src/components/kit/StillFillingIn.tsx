/**
 * StillFillingIn - the grouped empty-state block, and the groupSectionStack
 * helper that decides when to use it.
 *
 * Round 5 (founder "do your best" on empty states): every section a page type
 * should have stays ALWAYS present, but a long run of unfilled sections must not
 * read as a wall of dashed cards (a thin cell page stacked up to 18). So a stack
 * renders filled sections in their manifest order, and collapses any run of
 * THREE OR MORE consecutive empty sections into ONE calm "still filling in" block
 * that lists the missing section names. Each listed name carries that section's
 * anchor id, so the sticky section nav still jumps to it (the contract holds: the
 * section is present, named, and reachable). Runs of one or two empties stay as
 * individual compact SectionEmpty rows, so small gaps are not over-grouped.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names. No fabricated
 * data: this is an honest "not yet" summary.
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { SectionEmpty } from "./SectionEmpty";

export type StillFillingInSection = { id: string; label: string };

/** The grouped block. Lists the unheld section names as anchored chips. */
export function StillFillingIn({
  sections,
  place,
}: {
  sections: StillFillingInSection[];
  place?: string | null;
}) {
  if (sections.length === 0) return null;
  return (
    <section
      aria-label={`Sections still filling in${place ? ` for ${place}` : ""}`}
      className="rounded-lg border border-dashed border-parchment bg-cream-50/50 px-5 py-4 md:px-7 md:py-5"
    >
      <SectionEyebrow>Still filling in</SectionEyebrow>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-cocoa-700">
        We do not hold these for {place ?? "this place"} yet. They fill in as our
        coverage deepens.
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {sections.map((s) => (
          // The anchor lives on the chip, so a nav jump to this section lands here.
          <li key={s.id} id={s.id}>
            <span className="inline-flex items-center rounded-full border border-parchment bg-cream-100 px-3 py-1 text-[12px] font-medium text-cocoa-700">
              {s.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Render an ordered section stack: filled sections in place, runs of >=3
 * consecutive empties grouped into one StillFillingIn, runs of 1-2 kept as
 * compact SectionEmpty rows. `content[id]` is the filled node or null/undefined.
 */
export function groupSectionStack(
  sections: Array<{ id: string; label: string; heading?: string | null }>,
  content: Record<string, React.ReactNode | null | undefined>,
  place?: string | null,
  minRun = 3,
): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let run: Array<{ id: string; label: string; heading?: string | null }> = [];

  const flush = () => {
    if (run.length === 0) return;
    if (run.length >= minRun) {
      out.push(
        <StillFillingIn
          key={`still-filling-${run[0].id}`}
          place={place}
          sections={run.map((s) => ({ id: s.id, label: s.label }))}
        />,
      );
    } else {
      for (const s of run) {
        out.push(
          <SectionEmpty key={s.id} id={s.id} eyebrow={s.label} heading={s.heading} place={place} />,
        );
      }
    }
    run = [];
  };

  for (const s of sections) {
    const node = content[s.id];
    if (node) {
      flush();
      out.push(<React.Fragment key={s.id}>{node}</React.Fragment>);
    } else {
      run.push(s);
    }
  }
  flush();
  return out;
}
