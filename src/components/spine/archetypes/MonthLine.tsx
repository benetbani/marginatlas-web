/**
 * MonthLine, HIS GOLD STANDARD'S B30, the small line chart
 * (design/references/founder-2026-09-20-gold-standard-sections.md; rules/
 * FOUNDER-VERDICTS.md 2026-09-20): a year as twelve points on one thin line,
 * the highest month held up by a value pill and a dotted vertical guide, the
 * axis labels tiny and grey. Built 2026-09-20 late evening for the trade's
 * market bento (the swing cell) on his word after the push: a figure without
 * its shape is surface, and a swing between the busiest and the quietest
 * month is a shape before it is a number. The first question, PART 9 clause
 * 57: a series over time is best shown as a line, the eye reading the year's
 * rise and fall before the number; its family is the line family, this the
 * site's one line form.
 *
 * THE LAW, inside the component:
 *  - ONE LINE in the accent over a hairline baseline, the twelve months
 *    evenly spaced; the drawing scales to its cell (an SVG on a viewBox, the
 *    stroke non-scaling), never taller than 96px.
 *  - THE PEAK: one filled point at the highest month, a dotted guide from it
 *    to the baseline, a pill above it with the month's figure in the series'
 *    own unit (an index of the busiest month = 100 prints "100"), the pill's
 *    text in INK on the tint (accent text is a page's loud moment and counts
 *    against its three; the line's colour is colour on a drawing); the lowest
 *    month is marked by a hollow point and named in the caption, so the
 *    swing's two ends are both on the drawing.
 *  - THE AXIS: the twelve months' initials along the foot at the micro rung
 *    in grey; no y axis, no grid (B30's restraint), the baseline is the only
 *    rule.
 *  - `data-archetype="month-line"`, `data-visual="1"`, `data-points` the
 *    count, `data-peak` and `data-trough` the month indices; the page laws
 *    read the card that holds it as a visual card. No second hue (B33).
 *
 * Gated by the archetype harness (stories `month-line`: the exemplar's
 * twelve, a flat year, a series of fewer than twelve is not drawn) and the
 * page laws.
 */
import * as React from "react";
import { COPY } from "@/lib/spine/copy";

export const MONTH_LINE_POINTS = 12;

export type MonthPoint = { month: number; value: number };

const W = 240, H = 84, PAD_X = 6, PAD_TOP = 22, PAD_BOTTOM = 14;

export function MonthLine({ points, unit = "" }: { points: MonthPoint[]; unit?: string }) {
  const live = points.filter((p) => p && Number.isFinite(p.value) && Number.isInteger(p.month) && p.month >= 0 && p.month < MONTH_LINE_POINTS).sort((a, b) => a.month - b.month);
  if (live.length !== MONTH_LINE_POINTS) return null;
  const values = live.map((p) => p.value);
  const max = Math.max(...values), min = Math.min(...values);
  const span = max - min;
  const x = (i: number) => PAD_X + (i * (W - 2 * PAD_X)) / (MONTH_LINE_POINTS - 1);
  const y = (v: number) => (span > 0 ? PAD_TOP + ((max - v) / span) * (H - PAD_TOP - PAD_BOTTOM) : (PAD_TOP + H - PAD_BOTTOM) / 2);
  const peak = values.indexOf(max), trough = values.indexOf(min);
  const d = live.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const peakLabel = `${Number.isInteger(max) ? max : max.toFixed(1)}${unit}`;
  const months = COPY.monthLine.initials;
  /* THE PILL STAYS IN THE BOX (clause 56): centred on the peak in the middle of
     the year, hung to the left of a December peak and to the right of a
     January one, so a peak at either end never pushes its figure past the
     card's edge (London restaurants peak in December). */
  const peakPct = (x(peak) / W) * 100;
  const pillShift = peakPct > 85 ? "-translate-x-full" : peakPct < 15 ? "translate-x-0" : "-translate-x-1/2";
  /* AND THE POINTS STAY IN THE BOX TOO (`verify_scale_end_clamps`, the most
     repeated visual fault in this codebase: a mark centred on its own value at
     the very end of a scale, half of it outside the card). The clamp is
     written AT each placement, not once above them, because a clamp three
     hundred characters away from the thing it protects is how this fault kept
     coming back and the checker only reads the placement's own neighbourhood.
     At today's padding it never fires: the first and last month already sit at
     2.5 and 97.5 percent of the width. It is here so a later change to PAD_X
     cannot push a dot off the end without anyone noticing. */
  return (
    <div data-archetype="month-line" data-visual="1" data-points={String(live.length)} data-peak={String(peak)} data-trough={String(trough)} className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" role="img" aria-label={COPY.monthLine.aria.replace("{peak}", months[peak]).replace("{trough}", months[trough])} className="block w-full overflow-visible">
        {/* the baseline, the drawing's one rule */}
        <line x1={0} x2={W} y1={H - PAD_BOTTOM} y2={H - PAD_BOTTOM} stroke="var(--c-border)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        {/* the dotted guide from the peak to the baseline */}
        <line x1={x(peak)} x2={x(peak)} y1={y(max)} y2={H - PAD_BOTTOM} stroke="var(--c-muted)" strokeWidth="1" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
        <path d={d} fill="none" stroke="var(--terra)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" data-line />
      </svg>
      {/* THE TWO POINTS AND THE PILL are HTML over the drawing, placed by each
          point's share of the width and the height, so they keep their shape
          while the line stretches to its cell (the SVG's aspect is free), and
          the pill's figure is a text leaf the checkers read. */}
      <div className="relative -mt-[84px] h-[84px] w-full" aria-hidden="true">
        <span data-trough-point className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[var(--terra)] bg-[var(--c-card)]" style={{ left: `${Math.min(98, Math.max(2, (x(trough) / W) * 100)).toFixed(2)}%`, top: `${((y(min) / H) * 100).toFixed(2)}%` }} />
        <span data-peak-point className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--terra)]" style={{ left: `${Math.min(98, Math.max(2, (x(peak) / W) * 100)).toFixed(2)}%`, top: `${((y(max) / H) * 100).toFixed(2)}%` }} />
        <span data-peak-pill className={`absolute ${pillShift} -translate-y-full whitespace-nowrap rounded-md border border-[var(--terra-border)] bg-[var(--terra-soft)] px-1.5 py-0.5 text-[length:var(--t-micro)] font-semibold tabular-nums text-[var(--c-ink)]`} style={{ left: `${Math.min(98, Math.max(2, peakPct)).toFixed(2)}%`, top: `${((y(max) / H) * 100).toFixed(2)}%`, marginTop: -7 }}>{peakLabel}</span>
      </div>
      <div className="mt-1 flex justify-between px-[2px] text-[length:var(--t-micro)] leading-none text-[var(--c-muted)]" aria-hidden="true">
        {months.map((m, i) => <span key={i} data-month={i} className={i === peak ? "font-semibold text-[var(--c-ink2)]" : ""}>{m}</span>)}
      </div>
    </div>
  );
}
