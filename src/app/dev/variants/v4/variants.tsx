/**
 * V4, seasonality. Three renderers over one real twelve-month index.
 *
 * WHAT THE DATA IS, and it decides the shape of this family. The series is
 * already an index whose unit is "revenue index, year average = 100". There are
 * no absolute monthly pounds anywhere in this repo to draw instead, so "level"
 * here means the index drawn from zero, not real money drawn from zero.
 *
 * A follows `kit/sections.tsx`: px-height columns against a fixed ceiling,
 * div-based rather than SVG. Modelled on that one deliberately, because the two
 * other level implementations both use `preserveAspectRatio="none"`, which
 * distorts, and reproducing a distortion as a candidate would put a known defect
 * on the page as if it were a choice.
 *
 * B follows `city2/CityYearStrip`, which the founder RATIFIED on 2026-08-08.
 * That is stated on the page rather than hidden: this family is closer to a
 * confirmation than to an open choice, and the harness should not pretend
 * otherwise.
 *
 * C is the one nothing in the repo does: level, with the year average drawn.
 */
import * as React from "react";

export type Month = { month: string; index: number };

const H = 96;
const CEIL = 56;

/** A. Level, drawn from zero, the majority shape (three of the five). */
export function SeasonA({ months }: { months: Month[] }) {
  const max = Math.max(...months.map((m) => m.index)) || 1;
  return (
    <figure className="w-full">
      <div className="flex items-end gap-1" style={{ height: `${CEIL}px` }}>
        {months.map((m) => (
          <div key={m.month} className="flex min-w-0 flex-1 flex-col justify-end">
            <div
              className="w-full rounded-sm bg-paper-400"
              style={{ height: `${Math.max(2, (m.index / max) * CEIL)}px` }}
              title={`${m.month}, ${m.index}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-1">
        {months.map((m) => (
          <div key={m.month} className="min-w-0 flex-1 text-center text-[9px] text-ink-600">
            {m.month.slice(0, 1)}
          </div>
        ))}
      </div>
      <figcaption className="mt-1 text-[11px] leading-snug text-ink-600">
        Each column is that month against a zero floor.
      </figcaption>
    </figure>
  );
}

/** B. Deviation from the year average, one hue either side by intensity. */
export function SeasonB({ months }: { months: Month[] }) {
  const dev = months.map((m) => m.index - 100);
  const span = Math.max(...dev.map(Math.abs)) || 1;
  const mid = H / 2;
  const bw = 100 / months.length;
  return (
    <figure className="w-full">
      <svg viewBox={`0 0 100 ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet" role="img"
        aria-label={`Each month against the year average of 100, from ${Math.min(...months.map(m=>m.index))} to ${Math.max(...months.map(m=>m.index))}`}>
        <line x1="0" x2="100" y1={mid} y2={mid} className="stroke-ink-600" strokeWidth={0.4} />
        {months.map((m, i) => {
          const d = m.index - 100;
          const h = (Math.abs(d) / span) * (mid - 10);
          const y = d >= 0 ? mid - h : mid;
          return (
            <rect
              key={m.month}
              x={i * bw + bw * 0.18}
              y={y}
              width={bw * 0.64}
              height={Math.max(1.2, h)}
              rx={0.8}
              className={Math.abs(d) >= span * 0.6 ? "fill-paper-400" : "fill-paper-350"}
            >
              <title>{`${m.month}, ${m.index} against a year of 100`}</title>
            </rect>
          );
        })}
      </svg>
      <div className="mt-1 flex gap-1">
        {months.map((m) => (
          <div key={m.month} className="min-w-0 flex-1 text-center text-[9px] text-ink-600">
            {m.month.slice(0, 1)}
          </div>
        ))}
      </div>
      <figcaption className="mt-1 text-[11px] leading-snug text-ink-600">
        Above and below the line is the year average. Same hue both ways, darker
        the further from normal.
      </figcaption>
    </figure>
  );
}

/** C. Level, with the year average drawn across it. Nothing here does this. */
export function SeasonC({ months }: { months: Month[] }) {
  const max = Math.max(...months.map((m) => m.index)) || 1;
  const avgY = CEIL - (100 / max) * CEIL;
  return (
    <figure className="w-full">
      <div className="relative" style={{ height: `${CEIL}px` }}>
        <div className="flex h-full items-end gap-1">
          {months.map((m) => (
            <div key={m.month} className="flex min-w-0 flex-1 flex-col justify-end">
              <div
                className="w-full rounded-sm bg-paper-400"
                style={{ height: `${Math.max(2, (m.index / max) * CEIL)}px` }}
                title={`${m.month}, ${m.index}`}
              />
            </div>
          ))}
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 border-t border-dashed border-atlas-600"
          style={{ top: `${avgY}px` }}
        />
        <span
          className="pointer-events-none absolute right-0 text-[9px] font-medium text-atlas-700"
          style={{ top: `${Math.max(0, avgY - 12)}px` }}
        >
          year average
        </span>
      </div>
      <div className="mt-1 flex gap-1">
        {months.map((m) => (
          <div key={m.month} className="min-w-0 flex-1 text-center text-[9px] text-ink-600">
            {m.month.slice(0, 1)}
          </div>
        ))}
      </div>
      <figcaption className="mt-1 text-[11px] leading-snug text-ink-600">
        Columns from zero, with the year average drawn across them.
      </figcaption>
    </figure>
  );
}
