/**
 * Obstacles, WHAT HOLDS SMALL FIRMS BACK (2026-09-25; his message that night: "Decisive factors that decide whether a business
 * survives the 1st year"). Page-agnostic, keyed by country (sections/first_years.ts, buildObstacles). It stood inside the
 * survival card until the card was seated: a curve and eight bars stacked in one card ran to twice the height of anything that
 * could sit beside it, so the two are two cards on one level.
 *
 * THE LAW, inside the component:
 *  - THE CARD'S ONE FIGURE is the obstacle small employers name most, its share said large above the drawing; its column is the
 *    one in the accent, a flat --terra, and prints its share small over it as every other column does (critique pass 2, fix
 *    round C2, item P1.5: a mark with no number in a list where every other has one read as a rendering fault; the label on a
 *    drawing is its key, not a second statement of the figure).
 *  - THE OBSTACLES AS COLUMNS, ranked, on one scale from zero (the most named is the tallest), each its share over it and its
 *    name under it. Columns and not a ranked bar list, because the country page already draws two bar lists, and his clause 55
 *    allows a kind of drawing twice a page.
 *  - THE COLUMNS TAKE THE HEIGHT THE LEVEL LENDS THE CARD (`fill`, the kit's word): the drawing is the part that stretches, so a
 *    taller card beside it never leaves a blank under the names.
 *  - UNDER 480px OF CARD, ROWS: the name, the share and a thin bar under them, since eight names do not fit under eight columns on
 *    a phone. The same order, the same accent, the same share on every row.
 *  - `data-archetype="obstacles"`, `data-visual="1"`, `data-cols`; `data-row` and `data-label` on each row of the phone's form,
 *    `data-col` on each column, `data-mark-label` on a column's share and its name (a mark's own label, the one thing centred).
 */
import * as React from "react";
import { Marks } from "@/components/spine/interact/Marks";
import { Box, Fig, Focal, Rail } from "@/components/spine/kit";
import { provAttrs } from "@/lib/spine/provenance";
import { COPY } from "@/lib/spine/copy";
import type { Obstacles as ObstaclesData } from "@/lib/spine/sections/first_years";

/* EACH MARK AS BARLIST DRAWS ITS BARS: a painted track the full length of the slot, and the bar over it filled with a colour under
   a gradient that runs from the tint at its base to the full tone at its tip. The colour is what the page filter reads as ink; a
   gradient alone read as a blank (the first render: 350 by 396 where eight bars stood), and a ranked chart with no track leaves
   the corner over its short marks empty (the second: 292 by 138 over the last four columns). THE TOP'S BAR IS FLAT --terra (critique
   pass 2, fix round C2, item P1.5): the longest bar was the one drawn in a gradient and the only one with nothing beside it; it is
   the one mark in the accent, plain, and the greys keep their soft gradient. */
const fill = (deg: 0 | 90) => ({ backgroundColor: "var(--c-line-strong)", backgroundImage: `linear-gradient(${deg}deg, var(--c-border), var(--c-line-strong))` });
const FLAT_TERRA = { backgroundColor: "var(--terra)" };

export function Obstacles({ id = "obstacles", data }: { id?: string; data: ObstaclesData }) {
  const C = COPY.firstYears;
  const items = [...data.items].sort((a, b) => b.pct - a.pct);
  const top = items[0];
  const max = top.pct;
  const h = (pct: number) => Math.max(2, (pct / max) * 100);
  return (
    <Box id={id} className="flex flex-col">
      {/* "watch", not "safety": the insurance card on the same page opens on the shield (2026-09-25). */}
      <Rail icon="watch" kicker={C.obstaclesKicker} />
      <Focal figure={`${top.pct}%`} words={C.obstaclesWords.replace("{item}", top.label.toLowerCase())} />
      {/* EACH OBSTACLE READS ITS SHARE (goal 2026-09-26, M1), the leading column too (item P1.5), its label held inside the plot by the 20px above the bars. */}
      <Marks label={C.obstaclesKicker} data-archetype="obstacles" data-visual="1" data-cols={String(items.length)} className="flex flex-1 flex-col [container-type:inline-size]">
        <div className="hidden flex-1 flex-col [@container(min-width:480px)]:flex">
          <div className="flex min-h-40 flex-1 items-stretch gap-2 pt-5" role="img" aria-label={`${C.obstaclesKicker}: ${items.map((o) => `${o.label} ${o.pct}%`).join(", ")}`}>
            {items.map((o) => (
              <div key={o.key} data-col={o.key} data-readout-figure={`${o.pct}%`} data-readout-words={o.label} className="relative min-w-0 flex-1">
                <span aria-hidden className="absolute inset-0 rounded-t-[2px] bg-[var(--c-soft2)]" />
                <span aria-hidden data-bar className="absolute inset-x-0 bottom-0 rounded-t-[2px]" style={{ height: `${h(o.pct)}%`, ...(o === top ? FLAT_TERRA : fill(0)) }}>
                  <span data-mark-label className="absolute inset-x-0 bottom-full mb-1 text-center text-[length:var(--t-micro)] font-semibold tabular-nums text-[var(--c-ink2)]" {...provAttrs(o.prov)}>{o.pct}%</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            {items.map((o) => (
              <span key={o.key} data-mark-label className="min-w-0 flex-1 text-center text-[length:var(--t-micro)] leading-tight text-[var(--c-ink2)]">{o.label}</span>
            ))}
          </div>
        </div>
        <ol className="m-0 list-none p-0 [@container(min-width:480px)]:hidden">
          {items.map((o) => (
            <li key={o.key} data-row={o.key} data-readout-figure={`${o.pct}%`} data-readout-words={o.label} className="max-w-none py-2">
              <div className="flex items-baseline justify-between gap-3">
                <span data-label className="text-[length:var(--t-body)] leading-tight text-[var(--c-ink)]">{o.label}</span>
                <Fig prov={o.prov} className="text-[length:var(--t-body)] font-semibold leading-tight text-[var(--c-ink)]">{o.pct}%</Fig>
              </div>
              <span aria-hidden className="relative mt-2 block h-2 rounded-full">
                <span className="absolute inset-0 rounded-full bg-[var(--c-soft2)]" />
                <span data-bar className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${h(o.pct)}%`, ...(o === top ? FLAT_TERRA : fill(90)) }} />
              </span>
            </li>
          ))}
        </ol>
      </Marks>
    </Box>
  );
}
