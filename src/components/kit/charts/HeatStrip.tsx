/**
 * HeatStrip - footfall / intensity over one sequence (design-system 10.1, charts
 * family). Hours of a day, days of a week, or months: a row of cells shaded by a
 * single warm atlas ramp (the one place opacity reads as magnitude on data, per
 * the kit law). The peak is marked directly with an outline and named in the
 * caption, never a legend or a rainbow.
 *
 * This is DATA: opaque cells on one warm ramp, direct peak label, no axis chrome.
 * Reduces to a legible 375px row (cells flex down, labels stay at 11px and may
 * thin to every-other when the run is long). Filled + empty states.
 * Server-renderable, no client JS (the cells carry no animation; the page's one
 * count-up lives in the masthead).
 *
 * Section: feeds the "busy by day" / "busy by hour" footfall blocks on the city +
 * neighbourhood pages where a single sequence is enough; FootfallGrid covers the
 * richer hour x day case.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { isNum, hasText, clamp01, ChartEmpty, ChartEyebrow } from "./helpers";

export type HeatCell = {
  label: string;
  value: number | null | undefined;
};

export type HeatStripProps = {
  cells: HeatCell[];
  /** Inline chart eyebrow above the strip. */
  label?: string | null;
  /** Unit suffix appended to figures, e.g. "%". */
  unit?: string;
  /** @default "Busiest" */
  peakLabel?: string;
  className?: string;
};

export function HeatStrip({ cells, label, unit = "", peakLabel = "Busiest", className }: HeatStripProps) {
  const clean = (cells ?? []).filter((c): c is HeatCell & { value: number } => hasText(c.label) && isNum(c.value));

  if (clean.length === 0) {
    return (
      <ChartEmpty
        eyebrow={label}
        note="Not held yet. Footfall appears once activity here is measured."
        className={className}
      />
    );
  }

  const max = Math.max(...clean.map((c) => c.value)) || 1;
  let peakIdx = 0;
  clean.forEach((c, i) => {
    if (c.value > clean[peakIdx].value) peakIdx = i;
  });
  const peak = clean[peakIdx];
  // Long runs (e.g. 14 hourly cells) thin their labels to every other so they
  // never collide or shrink below the 11px floor on a phone.
  const thin = clean.length > 9;

  return (
    <figure
      role="img"
      aria-label={`${label || "Footfall"}. Busiest: ${peak.label}, ${peak.value}${unit}.`}
      className={["m-0", className].filter(Boolean).join(" ")}
    >
      {hasText(label) ? <ChartEyebrow className="mb-3">{label}</ChartEyebrow> : null}

      <div className="flex gap-[3px]">
        {clean.map((c, i) => {
          const intensity = clamp01(c.value / max);
          const op = 0.1 + intensity * 0.85;
          const isPeak = i === peakIdx;
          const showLabel = !thin || i % 2 === 0 || isPeak;
          return (
            <div key={c.label + i} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                title={`${c.label}: ${c.value}${unit}`}
                className={[
                  "h-[34px] w-full rounded-md bg-chart-primary",
                  isPeak ? "outline outline-2 outline-offset-1 outline-ink-900" : "",
                ].join(" ")}
                style={{ opacity: op }}
              />
              <span
                className={[
                  "text-center text-[11px] leading-none tracking-wide",
                  isPeak ? "font-bold text-ink-900" : "font-medium text-cocoa-700",
                  showLabel ? "" : "invisible",
                ].join(" ")}
              >
                {c.label}
              </span>
            </div>
          );
        })}
      </div>

      <figcaption className="mt-3 text-[13px] text-cocoa-700">
        <span className="mr-2 text-[10px] font-bold uppercase tracking-[0.1em] text-atlas-700">{peakLabel}</span>
        {peak.label} ·{" "}
        <span className="font-sans font-semibold tabular-nums text-ink-900">
          {peak.value}
          {unit}
        </span>
      </figcaption>
    </figure>
  );
}
