/**
 * /dev/waterfall , the before and after for the money waterfall.
 *
 * Internal, noindex, not linked from anywhere. It exists for one judgement:
 * does the library-built waterfall read better than the hand-cut one, at the
 * widths a reader actually gets.
 *
 * THE COMPARISON IS RUN AT THREE WIDTHS ON PURPOSE. The hand-cut version draws
 * into a fixed 480-unit box and scales the whole drawing to fit, which scales
 * its TEXT along with it. That defect is invisible at one width and obvious
 * across three, which is exactly why every previous look at this chart missed
 * it. The two charts are fed the SAME numbers in every column.
 */
import * as React from "react";
import type { Metadata } from "next";
import { AtlasWaterfall } from "@/components/kit/charts/AtlasWaterfall";
import { SteppedWaterfall } from "@/components/spine/cell/money-chapter";

export const metadata: Metadata = {
  title: "Waterfall, before and after (internal)",
  robots: { index: false, follow: false },
};

/* One split, used everywhere on this page. A neighbourhood restaurant's
   hundred dollars of sales, shaped the way the cell page already shapes it.
   These are SAMPLE numbers for a design comparison, not a published figure. */
const COSTS = [
  { name: "Food + drink", pct: 31 },
  { name: "Wages", pct: 30 },
  { name: "Rent", pct: 9 },
  { name: "Other", pct: 22 },
];
const KEEP = 8;

const STEPS = COSTS.map((c) => ({ label: c.name, value: c.pct }));

function Column({ width, note }: { width: number; note: string }) {
  return (
    <div>
      <div className="mb-3 text-[11px] uppercase tracking-[0.12em] text-neutral-500">
        {width}px wide {"·"} {note}
      </div>
      <div style={{ width }} className="max-w-full space-y-8">
        <div>
          <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-400">
            After, on the library
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <AtlasWaterfall
              start={{ label: "Sales", value: 100 }}
              steps={STEPS}
              end={{ label: "Keeps", value: KEEP }}
              prefix="$"
              height={190}
            />
          </div>
        </div>
        <div>
          <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-400">
            Before, hand cut
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <SteppedWaterfall
              costs={COSTS.map((c) => ({ name: c.name, pct: c.pct }))}
              keep={KEEP}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WaterfallComparePage() {
  return (
    <div className="space-y-10 bg-neutral-50 px-6 py-10">
      <header className="max-w-3xl">
        <h1 className="text-2xl tracking-tight text-neutral-900">
          The money waterfall, before and after
        </h1>
        <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-neutral-600">
          The same hundred dollars of sales, drawn twice. The upper chart is
          built on the chart library; the lower one is the hand cut version it
          replaces. Read the labels across the three widths: the lower chart
          scales its own text, so the same words are one size in a narrow column
          and another size in a wide one.
        </p>
      </header>

      <div className="flex flex-wrap items-start gap-10">
        <Column width={320} note="a phone" />
        <Column width={480} note="a half card" />
        <Column width={760} note="a full band" />
      </div>

      <p className="max-w-[68ch] text-xs leading-relaxed text-neutral-500">
        Sample numbers, chosen to look like a real split. Nothing on this page is
        published anywhere.
      </p>
    </div>
  );
}
