/**
 * SegmentBar, THE SEGMENTED UNIT BAR (his gold standard of 2026-09-20,
 * design/references/founder-2026-09-20-gold-standard-sections.md, mechanic
 * B27): a figure over a total drawn as a row of small segments filled to the
 * share in the accent, the rest in the accent's pale tint, the figure and the
 * total written at the row's end. The first question, PART 9 clause 57: a
 * share of a fixed whole (a score of 100, a count of a cap) is best shown as
 * the whole, filled to the share, so the eye reads the size of the share
 * before it reads the number. Its family is the bar family's, its colour the
 * accent and the accent's tint, never a second hue (B33).
 *
 * THE LAW, inside the component:
 *  - `segments` cells of equal width in one row (25 by default, each four
 *    points of a hundred), `filled` of them in the accent, the rest in the
 *    tint; a share is rounded to the nearest cell, so a 66 of 100 fills
 *    sixteen or seventeen cells and the FIGURE beside the bar says which it
 *    is. The bar is a picture of the number, never its source.
 *  - the label on the left, the figure and the total on the right in one
 *    line ("66 of 100"), the figure at the body rung in ink and the total in
 *    grey; an optional level chip after them.
 *  - `data-archetype="segment-bar"` on the row, `data-visual="1"`; the page
 *    laws read the card that holds it as a visual card.
 *  - no accent text: the fill is colour on a drawing, not a figure in the
 *    accent, so the accent budget does not count it.
 */
import * as React from "react";

export const SEGMENT_BAR_CELLS = 25;

export function SegmentBar({ label, value, total = 100, figure, unit, chip, segments = SEGMENT_BAR_CELLS }: { label: string; value: number; total?: number; figure: string; unit: string; chip?: React.ReactNode; segments?: number }) {
  const share = total > 0 ? Math.max(0, Math.min(1, value / total)) : 0;
  const filled = Math.round(share * segments);
  return (
    <div data-archetype="segment-bar" data-visual="1" data-filled={String(filled)} data-segments={String(segments)} className="py-2">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span data-label className="min-w-0 text-[length:var(--t-body)] leading-tight text-[var(--c-ink)]">{label}</span>
        <span className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-[length:var(--t-body)] font-medium tabular-nums text-[var(--c-ink)]">
            {figure}
            <span className="ml-1 text-[length:var(--t-micro)] font-normal text-[var(--c-muted)]">{unit}</span>
          </span>
          {chip}
        </span>
      </div>
      <div className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: segments }, (_, i) => (
          <span key={i} className="h-3 min-w-0 flex-1 rounded-[2px]" style={{ background: i < filled ? "var(--terra)" : "var(--terra-soft)" }} />
        ))}
      </div>
    </div>
  );
}
