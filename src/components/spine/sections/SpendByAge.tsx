/**
 * SpendByAge, WHO SPENDS ON IT, BY AGE (2026-09-26; his list of 2026-09-25, "customer types"). Page-agnostic, keyed by country
 * and trade (sections/spend_by_age.ts).
 *
 * THE LAW, inside the component:
 *  - THE CARD'S ONE FIGURE is the largest age band's share of the category's money; that band is the one part in the accent on
 *    the money bar and in its tint on the households bar, and it carries no label of its own on the money bar (the figure says it).
 *  - TWO BARS, the households first and the money under them, each cut into the same bands in age order, so the eye sees which
 *    ages spend above their number before reading a figure; a band's share inside its segment where it fits (9% and over).
 *  - THE BANDS NAMED ONCE, as a legend under the bars; the grey bands step light to dark with age (AgeMix's ramp, a layer under
 *    each label so the label keeps its ink).
 *  - The bars and the legend share a height the card is lent, as rows of a grid (AgeMix's rule).
 *  - `data-archetype="spend-by-age"`, `data-visual="1"`, `data-bars`, `data-wedges`; `data-row` on each bar.
 */
import * as React from "react";
import { Marks } from "@/components/spine/interact/Marks";
import { Box, Rail } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { AgeBandShare, SpendByAge as SpendByAgeData } from "@/lib/spine/sections/spend_by_age";

const RAMP = [0.12, 0.26, 0.4, 0.54];

export function SpendByAge({ id = "spend-by-age", data }: { id?: string; data: SpendByAgeData }) {
  const C = COPY.spendByAge;
  const greys = data.bands.filter((b) => b.key !== data.lead);
  const tone = (key: string, onMoney: boolean): { background: string; opacity?: number } => {
    if (key === data.lead) return { background: onMoney ? "var(--terra)" : "var(--terra-border)" };
    const i = greys.findIndex((b) => b.key === key);
    return { background: "var(--c-ink2)", opacity: RAMP[Math.min(RAMP.length - 1, Math.max(0, i))] };
  };
  const bars: Array<{ key: string; name: string; money: boolean; value: (b: AgeBandShare) => number }> = [
    { key: "households", name: C.bars.households, money: false, value: (b) => b.households },
    { key: "money", name: C.bars.money, money: true, value: (b) => b.money },
  ];
  return (
    <Box id={id} className="flex flex-col">
      <Rail icon="spending-power" kicker={C.kicker} />
      <div className="mb-5">
        <div data-focal="1" className="fig text-[length:var(--t-focal)] leading-none text-[var(--c-ink)]">{data.figure}</div>
        <p className="mt-2 text-[length:var(--t-micro)] leading-snug text-[var(--c-muted)]">{data.words}</p>
      </div>
      {/* A BAND READS ITS SHARE, AND A BAND OR ITS LEGEND ENTRY LIGHTS THAT AGE IN BOTH BARS (goal 2026-09-26, M1 and M2). */}
      <Marks label={`${C.kicker}: ${data.words}`} data-archetype="spend-by-age" data-visual="1" data-bars={String(bars.length)} data-wedges={String(data.bands.length)} className="grid flex-1 content-between gap-4">
        {bars.map((bar) => (
          <div key={bar.key} data-row={bar.key}>
            <div className="mb-2 text-[length:var(--t-body)] font-medium leading-snug text-[var(--c-ink2)]">{bar.name}</div>
            <div className="flex h-9 w-full gap-0.5 overflow-hidden rounded-lg" role="img" aria-label={`${bar.name}: ${data.bands.map((b) => `${b.label} ${Math.round(bar.value(b))}%`).join(", ")}`}>
              {data.bands.map((b) => {
                const v = bar.value(b);
                const labelled = !(bar.money && b.key === data.lead) && v >= 9;
                return (
                  <span key={b.key} data-wedge={b.key} data-part-key={b.key} data-readout-figure={`${Math.round(v)}%`} data-readout-words={`${bar.name}, ${b.label}`} className="relative flex h-full min-w-0.5 items-center justify-center overflow-hidden first:rounded-l-lg last:rounded-r-lg" style={{ width: `${v}%` }}>
                    <span aria-hidden className="absolute inset-0" style={tone(b.key, bar.money)} />
                    {labelled ? <span className="relative text-[length:var(--t-micro)] font-semibold tabular-nums text-[var(--c-ink)]">{Math.round(v)}%</span> : null}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[length:var(--t-micro)] text-[var(--c-muted)]">
          {data.bands.map((b) => (
            <span key={b.key} data-part-key={b.key} className="inline-flex items-center gap-2">
              <span aria-hidden className="relative inline-block h-2.5 w-2.5 overflow-hidden rounded-sm border border-[var(--c-border)]"><span className="absolute inset-0" style={tone(b.key, false)} /></span>
              {b.label}
            </span>
          ))}
        </div>
      </Marks>
    </Box>
  );
}
