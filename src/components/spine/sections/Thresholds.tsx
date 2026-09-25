/**
 * Thresholds, THE LINES A FIRST YEAR CROSSES (2026-09-25; his message that night: "1st year threshholds that should be met").
 * Page-agnostic, keyed by country (sections/thresholds.ts).
 *
 * THE LAW, inside the component:
 *  - THE CARD'S ONE FIGURE is the line most first years meet first (the country's `lead`: in the United Kingdom, the sales at which
 *    VAT registration begins), with what it switches on in one line.
 *  - THE OTHER LINES AS ROWS: each its glyph, its name over a note of five words or fewer, and its figure at the row's end, so the
 *    eye runs down one column of figures; no row repeats the card's figure. From 900px of card the rows stand beside the figure
 *    (a figure alone at the left of a wide card is a blank, the harness's LONE STAT, 501 by 234 at 1280); the forms by width
 *    are over the component.
 *  - `data-archetype="thresholds"`, `data-rows`; `data-row` and `data-label` on each line.
 */
import * as React from "react";
import { Box, Fig, Ico, Rail } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { Thresholds as ThresholdsData } from "@/lib/spine/sections/thresholds";

/** `fill` (2026-09-25, its first seat, beside the kit on a trade page): the rows share the height a taller neighbour lends the
 *  card (equal rows, `auto-rows-fr`), so its foot never stands empty.
 *  THREE FORMS BY THE CARD'S WIDTH, each measured on the trade page that day: under 600px the figure over one column of rows
 *  (a two-fifths seat at 1280); from 600px the figure over two columns of rows (a lone card at a 768 window, 680 inside: one
 *  column ran a name and its figure 420px apart, the model laws' LABEL GAP, and the figure beside the rows left a 298 by 162
 *  blank under it); from 900px the figure beside the rows (a full-width card). A rule over every row, the first beside the
 *  figure excepted. */
export function Thresholds({ id = "thresholds", data, fill = false }: { id?: string; data: ThresholdsData; fill?: boolean }) {
  return (
    <Box id={id} className="flex flex-col">
      <Rail icon="taxes" kicker={COPY.thresholds.kicker} />
      <div className={`[container-type:inline-size] ${fill ? "flex flex-1 flex-col" : ""}`}>
      <div className={`grid gap-x-10 [@container(min-width:900px)]:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] ${fill ? "flex-1 grid-rows-[auto_minmax(0,1fr)] [@container(min-width:900px)]:grid-rows-none" : ""}`}>
      <div className="mb-5">
        <div data-focal="1" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">{data.lead.figure}</div>
        <p className="mt-2 max-w-[32ch] text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{data.lead.words}</p>
      </div>
      <ol data-archetype="thresholds" data-rows={String(data.rows.length)} className={`m-0 grid list-none p-0 [@container(min-width:600px)]:grid-cols-2 [@container(min-width:600px)]:gap-x-8 [@container(min-width:900px)]:grid-cols-1 ${fill ? "auto-rows-fr" : ""}`}>
        {/* `max-w-none` on each row: globals.css gives every list item under main the prose measure (360px at a 768 window), and a
            row there stopped 312px short of the card's edge (the page filter's WHITE SPACE on the trade page at 768, 2026-09-25). */}
        {data.rows.map((r) => (
          <li key={r.key} data-row={r.key} className="grid max-w-none grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 border-t border-[var(--c-border)] py-3 [@container(min-width:900px)]:first:border-t-0">
            <Ico id={r.icon} tone="terra" />
            <span className="min-w-0">
              <span data-label className="block text-[length:var(--t-body)] leading-tight text-[var(--c-ink)]">{r.label}</span>
              {r.note ? <span className="block text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{r.note}</span> : null}
            </span>
            <Fig className="text-right text-[length:var(--t-body)] font-semibold leading-tight text-[var(--c-ink)]">{r.figure}</Fig>
          </li>
        ))}
      </ol>
      </div>
      </div>
    </Box>
  );
}
