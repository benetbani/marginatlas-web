/**
 * src/components/spine2/page/ChapterGap.tsx
 *
 * WHAT A CHAPTER LOOKS LIKE WHEN ITS DATA DOES NOT EXIST.
 *
 * Until 2026-07-27 the answer was "nothing": the adapter filtered the spine to
 * chapters that had data and the page skipped the rest, so the real trade page
 * rendered 17 chapters instead of 21 and its chapter numbers closed up over the
 * holes.
 *
 * The founder overruled that, and the reasoning is worth keeping because it is
 * not obvious. Across a lattice of hundreds of places, **a page whose shape
 * changes by place teaches a reader that some places are second class.** Worse,
 * a reader cannot tell the difference between a section that is missing and a
 * section that was never designed , so a silent omission reads as "this site
 * does not cover that", which is a stronger and less true claim than "we have
 * not published this figure for this place".
 *
 * So the gap becomes content. The chapter keeps its number, its icon, its title
 * and its anchor; only the body changes. The page is the same shape in London
 * and in a place we have barely filled.
 *
 * WHAT THIS DELIBERATELY IS NOT:
 * - **Not an error.** Nothing here is broken. The quiet register is the point;
 *   an alarm state would be a lie about severity.
 * - **Not accented.** Terracotta means "this is the answer" and is spent about
 *   once per chapter. An absence is never the answer, so this never takes it.
 * - **Not a promise.** It does not say "coming soon". We do not know that, and
 *   a date we cannot keep is worse than a blank.
 * - **Not a placeholder shape.** No skeleton bars, no greyed-out fake chart.
 *   Drawing the ghost of a chart we do not have is the closest thing to
 *   fabricating one.
 */
import * as React from "react";

export interface ChapterGapProps {
  /**
   * Why the figure is absent, in the page's own voice, when the data file knows.
   * The cell schema's null slots already carry a `reason` string for exactly
   * this ("no source grounds the peer-city revenue figures ..."), so where one
   * exists the page can say the true specific thing instead of the generic one.
   */
  reason?: string | null;
  /** What is missing, named as a reader would name it ("peer cities"). */
  subject?: string | null;
}

export function ChapterGap({ reason, subject }: ChapterGapProps) {
  const what = subject
    ? `We have not published ${subject} for this place yet.`
    : "We have not published this for this place yet.";

  /* The data files write their reasons as sentence fragments, lowercase and
     without a stop, because they were authored to be read inside a JSON field.
     Appended raw they run straight on from the sentence above and read as one
     long broken sentence. This is the only place that knows they are about to
     become prose, so this is where they become prose. */
  const said = reason
    ? `${reason[0].toUpperCase()}${reason.slice(1)}${/[.!?]$/.test(reason) ? "" : "."}`
    : null;

  return (
    <div className="panel pad">
      <p className="note" style={{ maxWidth: "62ch", margin: 0 }}>
        {what}
        {said ? ` ${said}` : null}
      </p>
    </div>
  );
}
