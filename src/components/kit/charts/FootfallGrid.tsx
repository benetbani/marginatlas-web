/**
 * FootfallGrid - "when is this street busy" (design-system 10.1, charts family).
 * A compact hour x day heat grid (hours across the top, days down the side)
 * shaded by a single warm atlas ramp, never a rainbow. The peak window is marked
 * directly with an outline and named in plain language; no legend.
 *
 * This is DATA: opaque cells on one warm ramp, direct peak label, no axis chrome
 * beyond sparse hour ticks. Reduces to a legible 375px column (cells flex down to
 * a minimum width, the day labels stay at 11px, the hour ruler keeps its sparse
 * ticks). Filled + empty states. Server-renderable, no client JS.
 *
 * Section: feeds the "when the street is busy" footfall block on the city +
 * neighbourhood pages, the hour x day companion to HeatStrip's single sequence.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { clamp01, hasText, ChartEmpty, ChartEyebrow } from "./helpers";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export type FootfallGridProps = {
  /** days (rows) x hours (cols) matrix of intensities; null/mismatched renders empty. */
  grid: number[][] | null | undefined;
  /** Row labels. @default Mon..Sun */
  days?: string[];
  /** First hour (24h). @default 8 */
  hourStart?: number;
  /** Last hour (24h). @default 22 */
  hourEnd?: number;
  /** Inline chart eyebrow + aria label. @default "When the street is busy" */
  label?: string;
  /** Hours (24h) to label on the top ruler. */
  hourTicks?: number[];
  className?: string;
};

function fmtHour(h: number): string {
  const ap = h < 12 || h === 24 ? "am" : "pm";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}${ap}`;
}

export function FootfallGrid({
  grid,
  days = DAYS,
  hourStart = 8,
  hourEnd = 22,
  label = "When the street is busy",
  hourTicks = [9, 12, 15, 18, 21],
  className,
}: FootfallGridProps) {
  const hours: number[] = [];
  for (let h = hourStart; h <= hourEnd; h++) hours.push(h);

  const valid =
    Array.isArray(grid) &&
    grid.length === days.length &&
    Array.isArray(grid[0]) &&
    grid[0].length === hours.length;

  if (!valid) {
    return (
      <ChartEmpty
        eyebrow={label}
        note="Not held yet. Footfall appears once this street has measured activity."
        className={className}
      />
    );
  }

  let max = 0;
  let peak = { d: 0, h: 0, v: 0 };
  grid!.forEach((row, di) =>
    row.forEach((v, hi) => {
      if (v > max) max = v;
      if (v > peak.v) peak = { d: di, h: hi, v };
    }),
  );
  max = max || 1;

  return (
    <figure
      role="img"
      aria-label={`${label}. Busiest: ${days[peak.d]} around ${fmtHour(hours[peak.h])}.`}
      className={["m-0", className].filter(Boolean).join(" ")}
    >
      {hasText(label) ? <ChartEyebrow className="mb-3">{label}</ChartEyebrow> : null}

      <div className="grid grid-cols-[auto_1fr] items-center gap-x-2">
        {/* top hour ruler: sparse ticks only, no full axis */}
        <div />
        <div className="relative mb-1 h-3.5">
          {hourTicks.map((t) => {
            const idx = hours.indexOf(t);
            if (idx < 0) return null;
            const p = ((idx + 0.5) / hours.length) * 100;
            return (
              <span
                key={t}
                className="absolute -translate-x-1/2 whitespace-nowrap text-[11px] text-cocoa-700"
                style={{ left: `${p}%` }}
              >
                {fmtHour(t)}
              </span>
            );
          })}
        </div>

        {/* rows: one warm ramp, peak cell outlined */}
        {days.map((day, di) => (
          <React.Fragment key={day}>
            <div className="pr-1 text-right text-[11px] font-semibold text-cocoa-700">{day}</div>
            <div className="flex gap-[2px]">
              {grid![di].map((v, hi) => {
                const intensity = clamp01(v / max);
                const op = 0.08 + intensity * 0.86;
                const isPeak = di === peak.d && hi === peak.h;
                return (
                  <div
                    key={hi}
                    title={`${day} ${fmtHour(hours[hi])}: ${v}`}
                    className={[
                      "h-4 min-w-[4px] flex-1 rounded-sm bg-atlas-500",
                      isPeak ? "outline outline-2 outline-offset-1 outline-ink-900" : "",
                    ].join(" ")}
                    style={{ opacity: op }}
                  />
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>

      <figcaption className="mt-3.5 text-[13px] leading-relaxed text-cocoa-700">
        <span className="mr-2 text-[10px] font-bold uppercase tracking-[0.1em] text-atlas-700">Busiest</span>
        {days[peak.d]} around <span className="font-semibold text-ink-900">{fmtHour(hours[peak.h])}</span>. Quietest
        before {fmtHour(hours[0] + 1)} and after {fmtHour(hours[hours.length - 1] - 1)}.
      </figcaption>
    </figure>
  );
}
