import * as React from "react";
import { Fig, InlineDisclosure } from "@/components/spine/kit";

/**
 * THE FOUNDER'S PLUS (2026-09-08, his words): "the click and show button was
 * removed, I hoped that you would keep it for those sections where the person
 * clicks a plus and some more info appears for the particular query he is
 * looking at."
 *
 * THE LAW, INSIDE THE COMPONENT:
 *  - It takes ROWS, not children, so nothing can smuggle a drawing behind the
 *    plus. This is the ONLY enforcement of that boundary on this path: the
 *    kit's assertNoGraphics walks direct children only, and the sole direct
 *    child this component ever hands InlineDisclosure is a `dl` wrapper ,
 *    never one of the kit's graphic types , so the tripwire is structurally
 *    dead here and would not see a drawing nested inside a row even if the
 *    type allowed one. It does not, which is what actually holds the line.
 *  - It is closed on arrival. A panel that opens itself is not a disclosure,
 *    it is a wall of prose with a hinge (ruling 15).
 *  - It sits at the FOOT of a card, under the drawing, never in place of it.
 *    The answer is always visible; the plus carries the detail behind the
 *    answer, for the reader who wants that one query.
 *  - Under two rows it draws nothing. One row behind a plus is worse than one
 *    row printed.
 *  - A ROW THAT CANNOT HOLD AN HONEST FIGURE IS NOT DRAWN AT ALL, and
 *    `withheldLine` says which row is missing and why (PART 5, "A LABEL
 *    NEVER STANDS WHERE A NUMBER GOES"). This is the same instrument
 *    RankedBars and PayBars already carry, and the country money card is its
 *    precedent: a count and a reason, never a word parked in the figure
 *    column. A panel that falls under two rows once its unmeasured rows are
 *    dropped draws NOTHING, the withheld line included: the plus is an
 *    affordance on a set, and there is no set left to open behind it.
 *    The line sits after the rows, not before them like RankedBars' , there
 *    the withheld line joins a basis line in a caption block above a
 *    drawing; here the caption IS the summary the reader clicked, and a
 *    panel that opens on what it does not hold opens on an apology.
 *  - The summary is one line at every width. The harness measures it.
 *  - THE PLUS IS COMFORTABLE TO HIT AT 375 (the harness's BOTCHED MOBILE
 *    floor of 44px), AND STILL ONE LINE. `InlineDisclosure`'s own summary is
 *    a bare ~24px text row, sized for the desktop-first cards it already
 *    sits in; ordinary vertical padding (`py-2`, the row padding this file
 *    uses everywhere else) closes the gap to 44px on this instance only, via
 *    the `[&>summary]` arbitrary variant on the `className` handed to
 *    InlineDisclosure. No other call site is touched. (An earlier version of
 *    this raised the summary's line-height instead, to satisfy a harness
 *    check that divided the summary's FULL box height, padding included, by
 *    its line-height; that check was measuring padding as an extra line, and
 *    is now fixed at the source, in `check_archetypes.mjs`, the way the
 *    terminus door's own line count already did it. Padding is the ordinary
 *    way to reach a touch target and needs no more than that.)
 */
export type DetailRow = { label: string; value: string; note?: string };

/**
 * `name` is passed straight to the native `<details name>` attribute (review
 * finding, minor): the browser groups every open `<details>` sharing one
 * `name` into an EXCLUSIVE accordion, so two panels on the same page with the
 * same `name` close each other on open. Derive it from the section the panel
 * sits in (e.g. `detail-${sectionId}`) so a collision cannot happen by
 * accident; two panels are meant to open independently unless a caller wants
 * the accordion behaviour on purpose.
 */
export function DetailPanel({ name, summary, rows, withheldLine }: { name: string; summary: string; rows: DetailRow[]; withheldLine?: string | null }) {
  if (!rows || rows.length < 2) return null;
  return (
    <div data-archetype="detail-panel" data-rows={rows.length}>
      <InlineDisclosure name={name} summary={summary} className="group mt-3 [&>summary]:py-2.5">
        <dl className="mt-2 grid gap-2">
          {rows.map((r, i) => (
            <div key={i} data-detail-row className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
              <dt data-label className="text-[length:var(--t-micro)] text-[var(--c-ink2)]">{r.label}</dt>
              {/* A FIGURE IS A `Fig`, NOT A HAND-ROLLED CELL (2026-09-11).
                  This `dd` carried `font-medium tabular-nums` and no `.fig`,
                  which is how it stayed in the body sans on the day every
                  other archetype's figures moved to the display face: measured
                  on the story sheet, seven `<dd>` figures in Geist while the
                  card beside them drew Space Grotesk. `Fig` carries the face,
                  the tabular lining numerals and the weight, so both utilities
                  it used to spell out are redundant and gone with it. */}
              <dd className="text-[length:var(--t-micro)] text-[var(--c-ink)]"><Fig>{r.value}</Fig></dd>
              {/* THE dl'S OWN LAW (review finding 4): a div directly inside a
                  dl may hold only dt/dd, so the note is a second dd , a `p`
                  here rendered live, invalid HTML, since one story's row
                  carries one. col-span-2 still puts it on its own line. */}
              {r.note ? <dd className="col-span-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">{r.note}</dd> : null}
            </div>
          ))}
        </dl>
        {/* OUTSIDE THE dl, AND IT HAS TO BE: a `p` is not a permitted child of
            a definition list (the same rule that made the row note a second
            `dd` above), and it is not a row , it is what the list does not
            hold. Its one consequence, declared: check_archetypes.mjs walks
            the opened panel from `det.querySelector("dl")`, so this line is
            outside that walk. Nothing is lost by it, because the line is
            --t-micro (already on the ladder every row in here uses) and
            --c-muted (never the accent the walk counts), and a `p` wraps
            rather than overflowing. A line that ever needs measuring belongs
            inside the walk, and that is a harness change, not a class here. */}
        {withheldLine ? <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{withheldLine}</p> : null}
      </InlineDisclosure>
    </div>
  );
}
