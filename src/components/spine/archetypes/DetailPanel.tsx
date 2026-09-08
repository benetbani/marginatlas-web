import * as React from "react";
import { InlineDisclosure } from "@/components/spine/kit";

/**
 * THE FOUNDER'S PLUS (2026-09-08, his words): "the click and show button was
 * removed, I hoped that you would keep it for those sections where the person
 * clicks a plus and some more info appears for the particular query he is
 * looking at."
 *
 * THE LAW, INSIDE THE COMPONENT:
 *  - It takes ROWS, not children, so nothing can smuggle a drawing behind the
 *    plus. The kit's assertNoGraphics guards the same boundary at runtime;
 *    this type makes it impossible to reach.
 *  - It is closed on arrival. A panel that opens itself is not a disclosure,
 *    it is a wall of prose with a hinge (ruling 15).
 *  - It sits at the FOOT of a card, under the drawing, never in place of it.
 *    The answer is always visible; the plus carries the detail behind the
 *    answer, for the reader who wants that one query.
 *  - Under two rows it draws nothing. One row behind a plus is worse than one
 *    row printed.
 *  - The summary is one line at every width. The harness measures it.
 *  - THE PLUS IS COMFORTABLE TO HIT AT 375 (the harness's BOTCHED MOBILE
 *    floor of 44px), AND STILL ONE LINE (the harness reads a summary's line
 *    count off its box height divided by its own computed line-height, so
 *    padding alone inflates the box without moving that ratio and reads as a
 *    false wrap). `InlineDisclosure`'s own summary is a bare 24px text row,
 *    sized for the desktop-first cards it already sits in; this is the one
 *    place this component reaches past its own markup, and only for its own
 *    instance: the `[&>summary]` arbitrary variants on the `className` it
 *    hands `InlineDisclosure` raise the line-height itself (`leading-9`,
 *    2.25rem, the token immediately below `Expand`'s own boxed row) and add
 *    a small pad (`py-1`) to clear 44px on that taller line, so the ratio the
 *    harness measures stays at one. No other InlineDisclosure call site is
 *    touched.
 */
export type DetailRow = { label: string; value: string; note?: string };

export function DetailPanel({ name, summary, rows }: { name: string; summary: string; rows: DetailRow[] }) {
  if (!rows || rows.length < 2) return null;
  return (
    <div data-archetype="detail-panel" data-rows={rows.length}>
      <InlineDisclosure name={name} summary={summary} className="group mt-3 [&>summary]:py-1 [&>summary]:leading-9">
        <dl className="mt-2 grid gap-2">
          {rows.map((r) => (
            <div key={r.label} data-detail-row className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
              <dt className="text-[length:var(--t-micro)] text-[var(--c-ink2)]">{r.label}</dt>
              <dd className="text-[length:var(--t-micro)] font-medium text-[var(--c-ink)] tabular-nums">{r.value}</dd>
              {r.note ? <p className="col-span-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">{r.note}</p> : null}
            </div>
          ))}
        </dl>
      </InlineDisclosure>
    </div>
  );
}
