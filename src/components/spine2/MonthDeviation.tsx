/**
 * src/components/spine2/MonthDeviation.tsx
 *
 * The 12-month seasonality chart, the BATCH-B year + touryear merge (D8).
 * Exactly twelve monthly values indexed so the year average = 100.
 *
 * mode "deviation" (default, cell ch10): columns grow up or down from a drawn
 * midline, clamped to `span` (default 36), the final v6 grid-column form from
 * atlas-spine.css (.year .bars .col). This is the honest default: the layer
 * comment records that a zero-suppressed bar made a 1.65x spread read as 6x.
 *
 * mode "level" (city ch04, the touryear merge): absolute slim bars with the
 * drawn average line at 100. DELIBERATE DEVIATION from the frozen mockup:
 * the mockup floors these bars at 40 (a suppressed zero, the exact defect
 * class the deviation rebuild fixed), so level bars here START AT 0 and the
 * scale top is the series maximum.
 *
 * Derived marks (M5): PEAK = argmax(months) is the only terracotta, computed,
 * never passed. Caption coupling (M7): captions must interpolate max/min from
 * the same array, use monthDeviationSummary() so prose and marks share one
 * source. Self-omit (M9): anything other than 12 finite values renders
 * nothing, a deviation strip with holes misreads as "no deviation".
 */
import * as React from "react";

export const MONTH_INITIALS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** The deviation clamp, the SPAN constant from the cell mockup IIFE. */
export const DEFAULT_SPAN = 36;
/** The named midline (M6: the axis pole carries its name). */
export const MID_LABEL = "the year average";

export interface MonthDeviationProps {
  /** Exactly 12 monthly values, indexed so the year average = 100. */
  months: Array<number | null | undefined>;
  mode?: "deviation" | "level";
  /** Deviation clamp in index points, default 36. */
  span?: number;
  /** Header row (deviation form's .strip-h). Omit for none. */
  header?: { title: string; sub?: string };
  monthLabels?: string[];
  monthNames?: string[];
  /** Midline label, deviation form only. Defaults to MID_LABEL. */
  midLabel?: string;
}

/**
 * M7 helper: peak and trough derived from the same array the bars read, so a
 * caption ("December runs 32% above the year...") can interpolate rather than
 * hand-write. Returns null when the series is not 12 finite values.
 */
export function monthDeviationSummary(
  months: Array<number | null | undefined>,
  monthNames: string[] = MONTH_NAMES,
): {
  peak: { index: number; value: number; name: string; pctAbove: number };
  trough: { index: number; value: number; name: string; pctBelow: number };
} | null {
  const v = validate(months);
  if (!v) return null;
  const peakIndex = argmax(v);
  const troughIndex = argmin(v);
  return {
    peak: {
      index: peakIndex,
      value: v[peakIndex],
      name: monthNames[peakIndex],
      pctAbove: Math.round(v[peakIndex] - 100),
    },
    trough: {
      index: troughIndex,
      value: v[troughIndex],
      name: monthNames[troughIndex],
      pctBelow: Math.round(100 - v[troughIndex]),
    },
  };
}

export function MonthDeviation({
  months,
  mode = "deviation",
  span = DEFAULT_SPAN,
  header,
  monthLabels = MONTH_INITIALS,
  monthNames = MONTH_NAMES,
  midLabel = MID_LABEL,
}: MonthDeviationProps) {
  const v = validate(months);
  if (!v || span <= 0) return null;
  const peak = argmax(v);

  const axis = (
    <div className="axis-m">
      {monthLabels.slice(0, 12).map((m, i) => (
        <span key={i}>{m}</span>
      ))}
    </div>
  );

  const title = (i: number) =>
    `${monthNames[i]}, index ${v[i]}${v[i] >= 100 ? ", above" : ", below"} the year average`;

  if (mode === "level") {
    /* Level bars start at 0, never the mockup's suppressed 40-floor. */
    const top = Math.max(...v);
    return (
      <div className="touryear">
        <div className="plot">
          <div className="bars">
            {v.map((x, i) => (
              <span
                key={i}
                className={i === peak ? "m pk" : "m"}
                title={title(i)}
                style={{ height: `${((x / top) * 100).toFixed(2)}%` }}
              />
            ))}
          </div>
          <div className="avg" style={{ bottom: `${((100 / top) * 100).toFixed(2)}%` }} />
        </div>
        {axis}
      </div>
    );
  }

  return (
    <div className="year">
      <div className="strip">
        {header ? (
          <div className="strip-h">
            <span>{header.title}</span>
            {header.sub ? <span>{header.sub}</span> : null}
          </div>
        ) : null}
        <span className="midlab">{midLabel}</span>
        <div className="bars">
          {v.map((x, i) => {
            const d = x - 100;
            const h = Math.max((Math.min(Math.abs(d), span) / span) * 50, 1.2);
            return (
              <div
                key={i}
                className={`col ${d >= 0 ? "up" : "dn"}${i === peak ? " peak" : ""}`}
                title={title(i)}
              >
                <i style={{ height: `${h.toFixed(2)}%` }} />
              </div>
            );
          })}
        </div>
        {axis}
      </div>
    </div>
  );
}

function validate(months: Array<number | null | undefined>): number[] | null {
  if (!months || months.length !== 12) return null;
  const out: number[] = [];
  for (const m of months) {
    if (m == null || !Number.isFinite(m)) return null;
    out.push(m);
  }
  return out;
}

function argmax(v: number[]): number {
  let k = 0;
  for (let i = 1; i < v.length; i++) if (v[i] > v[k]) k = i;
  return k;
}

function argmin(v: number[]): number {
  let k = 0;
  for (let i = 1; i < v.length; i++) if (v[i] < v[k]) k = i;
  return k;
}
