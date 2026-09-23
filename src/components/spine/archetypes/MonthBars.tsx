/**
 * MonthBars, THE YEAR AS TWELVE COLUMNS (2026-09-23, his ruling: "year swing
 * should have vertical candles as visual choice"). It replaces MonthLine,
 * which is deleted in the same commit rather than left in the kit unused.
 *
 * WHY A COLUMN AND NOT A LINE, which is the reasoning the ruling asks for and
 * the rule this site now follows for any series:
 *  - A line interpolates. It draws a value between March and April, and there
 *    is no such value: there are twelve monthly totals and nothing in between.
 *    A column stands on its own base and claims nothing about the gap.
 *  - The reader's question here is "which months are strong and which are
 *    weak", which is a comparison of magnitudes. A column answers it with
 *    length from a shared floor, the one visual comparison the eye does well.
 *    A line answers it with vertical position, which needs the axis read first.
 *  - A line's most salient feature is its slope, the rate of change. That is
 *    not the question a seasonality figure is asked.
 *  - Twelve columns also carry the peak and the trough in tone, so the figure
 *    needs no pill floating over the drawing.
 * A LINE IS STILL RIGHT for a genuinely continuous series read for its shape
 * over time. This site holds none today, which is why the line form goes.
 *
 * NOT A CANDLE IN THE TRADING SENSE, and the distinction is honest rather than
 * pedantic: a candle carries an open, a high, a low and a close. The shard
 * holds one index per month, so a body and its wicks would be four readings
 * invented from one. Columns are the same picture without the invention.
 *
 * THE LAW, inside the component:
 *  - TWELVE COLUMNS, always, in month order. Fewer and it draws nothing: a
 *    part-year is a different subject and needs its own form.
 *  - THE FLOOR IS ZERO and the tallest column is the tallest month. The scale
 *    is the data's own maximum, never a rounded one, and every column is a
 *    share of it, so a reader comparing two columns compares two months.
 *  - THE PEAK IS THE ACCENT AND EVERY OTHER COLUMN IS ONE NEUTRAL. The trough
 *    carried the accent's tint in the first cut and read as an empty slot; the
 *    shortest column is already the quietest and needs no second colour. One
 *    loud column a drawing, which is PART 6's budget read at this scale.
 *  - 96 TALL (DISTANCES.md section 3.2), columns flexed to the width with a 4
 *    gap, month initials under at the micro rung, the peak's initial in ink.
 *  - `data-archetype="month-bars"`, `data-visual="1"`, `data-points`,
 *    `data-peak`, `data-trough`. It is a drawing: it counts as its level's
 *    visual and toward the bar budget.
 *
 * Gated by the archetype harness (stories `month-bars`), the page laws and the
 * model laws on every page that seats it.
 */
import * as React from "react";
import { COPY } from "@/lib/spine/copy";

export const MONTH_BAR_POINTS = 12;
const H = 96;

export type MonthPoint = { month: number; value: number };

export function MonthBars({ points, unit = "" }: { points: MonthPoint[]; unit?: string }) {
  const live = points
    .filter((p) => p && Number.isFinite(p.value) && Number.isInteger(p.month) && p.month >= 0 && p.month < MONTH_BAR_POINTS)
    .sort((a, b) => a.month - b.month);
  if (live.length !== MONTH_BAR_POINTS) return null;
  const values = live.map((p) => p.value);
  const max = Math.max(...values), min = Math.min(...values);
  if (!(max > 0)) return null;
  const peak = values.indexOf(max), trough = values.indexOf(min);
  const months = COPY.monthLine.initials;
  const peakLabel = `${Number.isInteger(max) ? max : max.toFixed(1)}${unit}`;
  return (
    <div
      data-archetype="month-bars"
      data-visual="1"
      data-points={String(live.length)}
      data-peak={String(peak)}
      data-trough={String(trough)}
      className="w-full"
    >
      <div className="flex w-full items-end gap-1" style={{ height: H }} role="img" aria-label={COPY.monthLine.aria.replace("{peak}", months[peak]).replace("{trough}", months[trough]).replace("{figure}", peakLabel)}>
        {live.map((p, i) => (
          <span
            key={p.month}
            data-month-bar={String(i)}
            data-share={String(Math.round((p.value / max) * 100))}
            className="min-w-0 flex-1 rounded-t-[2px]"
            style={{
              height: `${Math.max(4, (p.value / max) * 100)}%`,
              /* ONE LOUD COLUMN AND ONE TONE FOR THE REST (2026-09-23, measured on the render): the trough drawn in the accent's tint read as an EMPTY slot rather than the quietest month, which is the opposite of what it meant. The shortest column is already the quietest; it needs no second colour to say so. */
              background: i === peak ? "var(--terra)" : "var(--c-soft2)",
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex w-full gap-1 text-[length:var(--t-micro)] leading-none text-[var(--c-muted)]" aria-hidden="true">
        {months.map((m, i) => (
          <span key={i} data-month={i} className={`min-w-0 flex-1 text-center ${i === peak ? "font-semibold text-[var(--c-ink2)]" : ""}`}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
