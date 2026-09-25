/**
 * Thresholds, THE LINES A FIRST YEAR CROSSES (2026-09-25; his message that night: "1st year threshholds that should be met").
 * Page-agnostic, keyed by country (sections/thresholds.ts).
 *
 * THE LAW, inside the component:
 *  - THE CARD'S ONE FIGURE is the line most first years meet first (the country's `lead`: in the United Kingdom, the sales at which
 *    VAT registration begins), with what it switches on in one line.
 *  - THE OTHER LINES AS ROWS: each its glyph, its name over a note of five words or fewer, and its figure at the row's end, so the
 *    eye runs down one column of figures; no row repeats the card's figure. From 720px of card the rows stand beside the figure
 *    (a figure alone at the left of a wide card is a blank, the harness's LONE STAT, 501 by 234 at 1280).
 *  - `data-archetype="thresholds"`, `data-rows`; `data-row` and `data-label` on each line.
 */
import * as React from "react";
import { Box, Fig, Ico, Rail } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { Thresholds as ThresholdsData } from "@/lib/spine/sections/thresholds";

export function Thresholds({ id = "thresholds", data }: { id?: string; data: ThresholdsData }) {
  return (
    <Box id={id} className="flex flex-col">
      <Rail icon="taxes" kicker={COPY.thresholds.kicker} />
      <div className="[container-type:inline-size]">
      <div className="grid gap-x-10 [@container(min-width:720px)]:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="mb-5">
        <div data-focal="1" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">{data.lead.figure}</div>
        <p className="mt-2 max-w-[32ch] text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{data.lead.words}</p>
      </div>
      <ol data-archetype="thresholds" data-rows={String(data.rows.length)} className="m-0 list-none divide-y divide-[var(--c-border)] border-t border-[var(--c-border)] p-0 [@container(min-width:720px)]:border-t-0">
        {data.rows.map((r) => (
          <li key={r.key} data-row={r.key} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 py-3">
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
