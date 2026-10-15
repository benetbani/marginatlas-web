import * as React from "react";
import { Fig, InlineDisclosure } from "@/components/spine/kit";
import type { Provenance } from "@/lib/spine/provenance";
import type { AnswerType } from "@/lib/spine/country_slots";

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
 *
 * `prov` (plan 2026-10-08, home sections): where the row's figure came from, stamped on it; a row with none stamps nothing.
 */
export type DetailRow = { label: string; value: string; note?: string; prov?: Provenance | null; /** A row with a page of its own links its label (the answer fold only). */ href?: string };

/**
 * `name` is passed straight to the native `<details name>` attribute (review
 * finding, minor): the browser groups every open `<details>` sharing one
 * `name` into an EXCLUSIVE accordion, so two panels on the same page with the
 * same `name` close each other on open. Derive it from the section the panel
 * sits in (e.g. `detail-${sectionId}`) so a collision cannot happen by
 * accident; two panels are meant to open independently unless a caller wants
 * the accordion behaviour on purpose.
 */
export function DetailPanel({ name, summary, rows, withheldLine, type }: { name: string; summary: string; rows: DetailRow[]; withheldLine?: string | null; /** The answer fold's type (plan 2026-10-13 country-page-journey): given, the country page's fold; absent, the panel every other page draws. */ type?: AnswerType }) {
  if (!rows || rows.length < 2) return null;
  if (type) return <AnswerFold name={name} summary={summary} rows={rows} type={type} />;
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
              <dd className="text-[length:var(--t-micro)] text-[var(--c-ink)]"><Fig prov={r.prov}>{r.value}</Fig></dd>
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

/**
 * THE ANSWER FOLD (plan 2026-10-13 country-page-journey, Task 3A; spec section 5; R6 2.3): the country page's plus. Closed on arrival; the
 * whole summary row a 44px target: the list's head as its label, the count of its rows as its figure ("their count", so no figure shown
 * closed repeats inside), the plus at the row's end, hidden from a screen reader so the summary's words are its name. Open, two to eight
 * rows of one type in place, each value stamped data-value for the answer-type gate, a word list (state) in the body face and a figure list
 * in the figure face; a row with a page of its own links its label and carries the arrow after its value. No drawing, no fold inside a
 * fold, no terracotta on hover; the browser's own marker is hidden, the signal being the page's one triangle. Every other page keeps the
 * panel above until its own pass (spec section 9).
 * THE PLUS IS LEFT IN ITS OWN BOX, THE KIT'S PLUS (Task 4's page laws, ALIGNMENT): centred in a fixed box it read as centred text on
 * every fold at 1280; the glyph's own width is its box, so it turns in place. A LINKED ROW IS A THUMB'S TAP (TAP SIZE at 375, panels
 * open): its label's link takes the row 44 tall, so a list that links carries no gap between its rows, the height being its air.
 * STRAIGHT UNDER A FIGURE'S BLOCK it adds no margin: the block keeps 12 above a fold (Slot.tsx), DISTANCES 2.1's figure to its panel.
 */
function AnswerFold({ name, summary, rows, type }: { name: string; summary: string; rows: DetailRow[]; type: AnswerType }) {
  const words = type === "state";
  const linked = rows.some((r) => r.href);
  return (
    <div data-archetype="detail-panel" data-rows={rows.length} data-fold="answer" data-answer={type} className="mt-6 border-t border-[var(--c-border)] [:has(>[data-focal-words])+&]:mt-0">
      <details name={name} className="group">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 py-3 [&::-webkit-details-marker]:hidden">
          <span data-fold-head="" className="min-w-0 flex-1 text-[length:var(--t-body)] font-medium leading-5 text-[var(--c-ink)]">{summary}</span>
          <span data-fold-count className="tabular-nums text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]">{rows.length}</span>
          <span aria-hidden="true" className="text-[length:var(--t-lead)] leading-5 text-[var(--c-muted)] transition-transform group-open:rotate-45">+</span>
        </summary>
        <dl className={`grid pb-3 ${linked ? "" : "gap-2"}`}>
          {rows.map((r, i) => (
            <div key={i} data-detail-row className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-3">
              <dt data-label className="min-w-0 text-[length:var(--t-body)] leading-5 text-[var(--c-ink2)]">{r.href ? <a href={r.href} className="flex min-h-11 items-center underline-offset-2 hover:underline">{r.label}</a> : r.label}</dt>
              <dd className="flex items-baseline justify-end gap-2 text-[length:var(--t-body)] leading-5 text-[var(--c-ink)]">
                <span data-value="">{words ? <span className="font-medium">{r.value}</span> : <Fig prov={r.prov}>{r.value}</Fig>}</span>
                {r.href ? <span aria-hidden="true" className="text-[var(--c-muted)]">→</span> : null}
              </dd>
              {/* A note's figures stack down the fold as the values do (the loans' law pounds under their dollars), so they are tabular (F1). */}
              {r.note ? <dd className="col-span-2 text-[length:var(--t-body)] leading-5 tabular-nums text-[var(--c-muted)]">{r.note}</dd> : null}
            </div>
          ))}
        </dl>
      </details>
    </div>
  );
}
