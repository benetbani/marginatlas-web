/**
 * SpendByIncome, WHO SPENDS ON IT, BY INCOME (2026-09-25; his message that night: "By purchasing power, poor middle class,
 * wealthy, millionaire"). Page-agnostic, keyed by country and trade (sections/spend_by_income.ts).
 *
 * THE LAW, inside the component:
 *  - THE CARD'S ONE FIGURE is the richest fifth's share of the item's spending, the one number the builder computes; the two
 *    richest columns are the ones in the accent, so the figure is read off the drawing.
 *  - TEN COLUMNS, one an income tenth, poorest left to richest right, on painted tracks from one zero (the tallest column is
 *    the tenth that spends most), each its weekly dollars over it from 480px of card; the two ends named under the columns.
 *  - Under 480px of card the ten values do not fit over ten columns: the columns stay, and the two ends carry their values.
 *  - `data-archetype="spend-by-income"`, `data-visual="1"`, `data-cols`; `data-col` on each column, `data-mark-label` on a
 *    column's value (a mark's own label, the one thing centred).
 */
import * as React from "react";
import { Marks } from "@/components/spine/interact/Marks";
import { Box, Rail, usdCents } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { SpendByIncome as SpendByIncomeData } from "@/lib/spine/sections/spend_by_income";

/* As BarList and Obstacles draw a bar: a colour under a gradient from the tint at the base to the full tone at the tip, the colour
   being what the page filter reads as ink. */
const fill = (rich: boolean) =>
  rich
    ? { backgroundColor: "var(--terra)", backgroundImage: "linear-gradient(0deg, var(--terra-border), var(--terra))" }
    : { backgroundColor: "var(--c-line-strong)", backgroundImage: "linear-gradient(0deg, var(--c-border), var(--c-line-strong))" };

export function SpendByIncome({ id = "spend-by-income", data }: { id?: string; data: SpendByIncomeData }) {
  const C = COPY.spendByIncome;
  const max = Math.max(...data.tenths.map((t) => t.usd));
  const h = (v: number) => Math.max(2, (v / max) * 100);
  const first = data.tenths[0], last = data.tenths[data.tenths.length - 1];
  return (
    <Box id={id} className="flex flex-col">
      <Rail icon="spending-power" kicker={C.kicker} />
      <div className="mb-5">
        <div data-focal="1" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">{data.figure}</div>
        <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{data.words}</p>
      </div>
      {/* EACH TENTH READS ITS WEEK (goal 2026-09-26, M1): under 480px of card the ten values are not printed, and a tap reads one. */}
      <Marks label={C.caption} data-archetype="spend-by-income" data-visual="1" data-cols={String(data.tenths.length)} className="flex flex-1 flex-col [container-type:inline-size]">
        <div className="mb-2 text-[length:var(--t-body)] font-medium leading-snug text-[var(--c-ink2)]">{C.caption}</div>
        <div className="flex min-h-36 flex-1 items-stretch gap-1 pt-5 [@container(min-width:480px)]:gap-2" role="img" aria-label={`${C.caption}: ${data.tenths.map((t) => usdCents(t.usd)).join(", ")}`}>
          {data.tenths.map((t) => (
            <div key={t.tenth} data-col={t.tenth} data-readout-figure={usdCents(t.usd)} data-readout-words={C.readout.replace("{n}", String(t.tenth))} className="relative min-w-0 flex-1">
              <span aria-hidden className="absolute inset-0 rounded-t-sm bg-[var(--c-soft2)]" />
              <span aria-hidden data-bar className="absolute inset-x-0 bottom-0 rounded-t-sm" style={{ height: `${h(t.usd)}%`, ...fill(t.rich) }}>
                <span data-mark-label className="absolute inset-x-0 bottom-full mb-1 hidden text-center text-[length:var(--t-micro)] font-semibold tabular-nums text-[var(--c-ink2)] [@container(min-width:480px)]:block">{usdCents(t.usd)}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-start justify-between gap-4 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">
          <span>
            {C.poorest}
            <span className="tabular-nums text-[var(--c-ink2)] [@container(min-width:480px)]:hidden"> {usdCents(first.usd)}</span>
          </span>
          <span className="text-right">
            {C.richest}
            <span className="tabular-nums text-[var(--c-ink2)] [@container(min-width:480px)]:hidden"> {usdCents(last.usd)}</span>
          </span>
        </div>
      </Marks>
    </Box>
  );
}
