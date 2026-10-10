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
 * A DATED ORDER, COUNTS, A QUIET TONE AND A STAMP (plan 2026-10-10, the home
 * reformed to ship, Task 4 and its closing cleanup; the spec's decision 8 and
 * the critique's P0.6), each off by default, so every other caller draws
 * exactly what it drew:
 *  - `start` ("2025-10") names the first column's month and the twelve run on
 *    from it, October to September, for a year that is not the calendar's;
 *    the year stands under the first column (when three or more of its
 *    months are drawn) and under every January, at the micro rung. A start
 *    that is not a month, or points that are not the twelve months once
 *    each, draw nothing.
 *  - `counts` ({ words, aria }) makes each column's reading the month's own
 *    count ("2,828", "notices in October 2025") and the drawing's label every
 *    month with its count, so the panel says only what the drawing holds;
 *    without it a column reads its share of the busiest month, as before.
 *  - `tone="ink"` draws the busiest column in ink2 and the rest in the soft
 *    grey, for a quiet card: no accent. THE QUIET COLUMNS ARE LEGIBLE (critique
 *    pass 2, P1.1): the soft grey alone is 1.19 to 1 on a white card and fails
 *    3:1 for a graphic a reader needs (WCAG 1.4.11), and the drawing held no
 *    number. Each quiet column keeps its soft fill and gains a 2px cap on its
 *    top in --control-line (3.25 to 1), so every height is drawn at 3:1 while
 *    the card stays quiet; the busiest stays whole ink2 and prints its count
 *    over itself in a 16px row (12 semibold ink, tabular, centred on its
 *    column, a figure stamped by `prov` as every figure is), the label's 16px
 *    taken out of the columns' height so the drawing is 96 tall as it was.
 *  - `prov` stamps the drawing's root with where the twelve counts came from
 *    (data-src and data-kind, src/lib/spine/provenance.ts), as a figure's own
 *    element is stamped: the counts are figures, one to a column, and they
 *    carried no stamp. None given, no attribute is drawn.
 *
 * Gated by the archetype harness (stories `month-bars`), the page laws and the
 * model laws on every page that seats it.
 */
import * as React from "react";
import { Marks } from "@/components/spine/interact/Marks";
import { Fig } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import { provAttrs, type Provenance } from "@/lib/spine/provenance";

export const MONTH_BAR_POINTS = 12;
const H = 96;
/** The row over the columns that holds the busiest month's count in a quiet tone: its 16px come out of the columns' height. */
const PEAK_ROW = 16;

export type MonthPoint = { month: number; value: number };

/** "2025-10" as its month's index (9) and its year (2025), or null where it is not a month. */
function startOf(start: string): { month: number; year: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(start);
  if (!m) return null;
  const month = Number(m[2]) - 1;
  return month >= 0 && month < MONTH_BAR_POINTS ? { month, year: Number(m[1]) } : null;
}

export function MonthBars({ points, unit = "", start, tone = "accent", counts, prov }: { points: MonthPoint[]; unit?: string; /** The first column's month, "YYYY-MM"; the twelve run on from it (plan 2026-10-10, home reform, Task 4). */ start?: string; /** "ink": the busiest column in ink2 and no accent, for a quiet card. */ tone?: "accent" | "ink"; /** Each column reads its month's count: `words` with {month}, `aria` with {first}, {last} and {months}. */ counts?: { words: string; aria: string }; /** Where the twelve counts came from, stamped on the drawing's root (data-src, data-kind). */ prov?: Provenance | null }) {
  const live = points
    .filter((p) => p && Number.isFinite(p.value) && Number.isInteger(p.month) && p.month >= 0 && p.month < MONTH_BAR_POINTS)
    .sort((a, b) => a.month - b.month);
  if (live.length !== MONTH_BAR_POINTS) return null;
  /* THE DATED ORDER: the columns run on from the start's month. A start that is not a month, or twelve points that are not the twelve
     months once each, draw nothing (a part-year or a doubled month is a different subject). */
  const from = start === undefined ? null : startOf(start);
  if (start !== undefined && (!from || live.some((p, i) => p.month !== i))) return null;
  const first = from ? from.month : 0;
  const drawn = from ? live.map((_, i) => live[(first + i) % MONTH_BAR_POINTS]) : live;
  const yearOf = (i: number) => (from ? from.year + Math.floor((first + i) / MONTH_BAR_POINTS) : 0);
  const values = drawn.map((p) => p.value);
  const max = Math.max(...values), min = Math.min(...values);
  if (!(max > 0)) return null;
  const peak = values.indexOf(max), trough = values.indexOf(min);
  const months = from ? drawn.map((p) => COPY.monthLine.initials[p.month]) : COPY.monthLine.initials;
  /* EVERY MONTH READS (goal 2026-09-26, M1; queue ui:reading-on-every-point): the drawing named the busiest month alone, so a
     reader who wanted March could not have it. Each column reads its share of the busiest month, and the drawing's label now
     says all twelve by name, so the readings are the drawing's own. Since plan 2026-10-10 a caller may hand `counts`, and each
     column then reads its month's own count, its name with its year where the order is dated. */
  const shares = drawn.map((p) => Math.round((p.value / max) * 100));
  const names = from ? drawn.map((p, i) => `${COPY.monthLine.names[p.month]} ${yearOf(i)}`) : COPY.monthLine.names;
  const count = (v: number) => v.toLocaleString("en-US");
  /* THE QUIET TONE'S LABEL AND CAPS (the header says why): the busiest count over its column, a 2px cap on each quiet column. */
  const labelled = tone === "ink";
  const label = counts
    ? counts.aria.replace("{first}", names[0]).replace("{last}", names[MONTH_BAR_POINTS - 1]).replace("{months}", names.map((m, i) => `${m} ${count(values[i])}`).join(", "))
    : COPY.monthLine.aria.replace("{peak}", names[peak]).replace("{trough}", names[trough]).replace("{months}", names.map((m, i) => `${m} ${shares[i]}%`).join(", "));
  return (
    <Marks
      label={label}
      data-archetype="month-bars"
      data-visual="1"
      data-points={String(drawn.length)}
      data-peak={String(peak)}
      data-trough={String(trough)}
      data-start={from ? start : undefined}
      {...provAttrs(prov)}
      className="w-full"
    >
      {labelled ? (
        <div data-peak-row="" className="flex w-full gap-1" style={{ height: PEAK_ROW }} aria-hidden="true">
          {drawn.map((p, i) => (
            <span key={p.month} className="flex min-w-0 flex-1 justify-center" {...(i === peak ? { "data-peak-label": "", "data-mark-label": "" } : {})}>
              {i === peak ? (
                <Fig prov={prov} className="shrink-0 whitespace-nowrap text-[length:var(--t-micro)] font-semibold leading-none tabular-nums text-[var(--c-ink)]">
                  {count(p.value)}
                </Fig>
              ) : null}
            </span>
          ))}
        </div>
      ) : null}
      <div className="flex w-full items-end gap-1" style={{ height: labelled ? H - PEAK_ROW : H }} role="img" aria-label={label}>
        {drawn.map((p, i) => (
          <span
            key={p.month}
            data-month-bar={String(i)}
            data-readout-figure={counts ? count(p.value) : `${shares[i]}%`}
            data-readout-words={counts ? counts.words.replace("{month}", names[i]) : COPY.monthLine.readout.replace("{month}", names[i])}
            data-share={String(Math.round((p.value / max) * 100))}
            className="min-w-0 flex-1 rounded-t-[2px]"
            style={{
              height: `${Math.max(4, (p.value / max) * 100)}%`,
              /* ONE LOUD COLUMN AND ONE TONE FOR THE REST (2026-09-23, measured on the render): the trough drawn in the accent's tint read as an EMPTY slot rather than the quietest month, which is the opposite of what it meant. The shortest column is already the quietest; it needs no second colour to say so. In a quiet card (`tone="ink"`, plan 2026-10-10) the loud column is ink2. */
              background: i === peak ? (tone === "ink" ? "var(--c-ink2)" : "var(--terra)") : "var(--c-soft2)",
              ...(labelled && i !== peak ? { boxShadow: "inset 0 2px 0 var(--control-line)" } : {}),
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex w-full gap-1 text-[length:var(--t-micro)] leading-none text-[var(--c-muted)]" aria-hidden="true">
        {months.map((m, i) => (
          <span key={i} data-month={i} data-mark-label className={`min-w-0 flex-1 text-center ${i === peak ? "font-semibold text-[var(--c-ink2)]" : ""}`}>
            {m}
          </span>
        ))}
      </div>
      {/* THE YEARS OF A DATED ORDER, on the columns' grid: under the first column where three or more of its months are drawn, and under
          every January; a year near the right end stands against it, so it never runs past the drawing. */}
      {from ? (
        <div data-years="" className="mt-1 grid w-full grid-cols-12 gap-1 text-[length:var(--t-micro)] leading-none text-[var(--c-muted)]" aria-hidden="true">
          {drawn.map((p, i) =>
            p.month === 0 || (i === 0 && MONTH_BAR_POINTS - first >= 3) ? (
              <span key={i} data-year={String(yearOf(i))} className="whitespace-nowrap tabular-nums" style={{ gridColumn: `${i + 1} / span ${Math.min(3, MONTH_BAR_POINTS - i)}`, ...(MONTH_BAR_POINTS - i < 3 ? { justifySelf: "end" } : {}) }}>
                {yearOf(i)}
              </span>
            ) : null,
          )}
        </div>
      ) : null}
    </Marks>
  );
}
