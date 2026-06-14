/**
 * AtlasTable - the metric-row x place-column primitive every comparison-shaped
 * table in the kit is built on. One data shape renders both:
 *   - sm and up: the full table (one hairline under the header, whitespace rows,
 *     right-aligned tabular figures, the quiet terracotta leader tint, the faint
 *     warm hover wash, the honest dash);
 *   - below sm: the mandatory .atbl-stack reflow (one labeled group per metric,
 *     one labeled row per place), so a 375px column never scrolls sideways.
 *
 * It is server-renderable (no client state). The leader tint is opt-out per
 * column-set (noLeaderMark) for cross-border / price-regime comparisons where a
 * raw figure must never be crowned, and per-row (row.noLeader) for facts rows.
 *
 * Tokens only, nullable inputs, self-omitting. No em-dashes, no source-agency
 * names. tabular-nums on every figure. WCAG AA contrast on every tone.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  DASH,
  hasText,
  isNum,
  figureCellClass,
  resolveLeaderKey,
} from "./helpers";

export type AtlasColumn = {
  key: string;
  label: string;
  /** A small second line under the column label (e.g. a country, a year). */
  sub?: string;
  /** A country-flag (or other) glyph before the label. Data label only. */
  flag?: string;
  /** The subject / highlighted place. Its label + figures read accent. */
  subject?: boolean;
};

export type AtlasRow = {
  /** The metric label (the row header). */
  label: string;
  /** A unit shown faint after the label (e.g. "a year", "%"). */
  unit?: string;
  /** A hint line under the label (desktop: under the row header). */
  hint?: string;
  /**
   * Comparable numbers per column key. Used both to render the figure (via
   * `format`) and to resolve the leader mark.
   */
  values: Record<string, number | null | undefined>;
  /**
   * Pre-formatted display strings per column key. When present for a key it
   * wins over `format(values[key])` (lets a caller pass strings it already has).
   */
  display?: Record<string, string | null | undefined>;
  /** Format a held number for this row. Defaults to String(). */
  format?: (n: number) => string;
  /** Higher value is the stronger one for the leader mark. Default true. */
  higherIsBetter?: boolean;
  /** Suppress the leader mark on this row only (a facts row). */
  noLeader?: boolean;
};

export type AtlasTableProps = {
  columns: AtlasColumn[];
  rows: AtlasRow[];
  /** The metric-column header label (top-left). Empty by default. */
  metricLabel?: string;
  /** Suppress every leader mark (columns span price regimes / borders). */
  noLeaderMark?: boolean;
  /** Hover/focus row wash. Default true; off for tiny static tables. */
  hoverable?: boolean;
  className?: string;
  /** Accessible name for the table element. */
  ariaLabel?: string;
};

function cellDisplay(row: AtlasRow, key: string): { held: boolean; text: string } {
  const pre = row.display?.[key];
  if (hasText(pre)) return { held: true, text: pre };
  const v = row.values[key];
  if (!isNum(v)) return { held: false, text: DASH };
  return { held: true, text: row.format ? row.format(v) : String(v) };
}

export function AtlasTable({
  columns,
  rows,
  metricLabel = "",
  noLeaderMark = false,
  hoverable = true,
  className,
  ariaLabel,
}: AtlasTableProps) {
  const cols = (columns ?? []).filter((c) => hasText(c.key) && hasText(c.label));
  const validRows = (rows ?? []).filter((r) => hasText(r.label));
  if (cols.length < 1 || validRows.length === 0) return null;

  const leaderFor = (row: AtlasRow): string | null => {
    if (noLeaderMark || row.noLeader) return null;
    return resolveLeaderKey(
      row.values,
      cols.map((c) => c.key),
      row.higherIsBetter !== false,
    );
  };

  return (
    <div className={className}>
      {/* sm and up: the full table. overflow contained to the table only. */}
      <div className="hidden overflow-x-auto sm:block">
        <table
          aria-label={ariaLabel}
          className="w-full border-collapse text-left"
          style={{ minWidth: `${140 + cols.length * 116}px` }}
        >
          <thead>
            <tr className="border-b border-parchment align-bottom">
              <th
                scope="col"
                className="py-2 pr-4 text-left text-[13px] font-bold text-ink-900"
              >
                {hasText(metricLabel) ? metricLabel : <span className="sr-only">Metric</span>}
              </th>
              {cols.map((c) => (
                <th key={c.key} scope="col" className="px-3 py-2 align-bottom text-right">
                  <span
                    className={cn(
                      "inline-flex items-center justify-end gap-1.5 text-[13px] font-bold",
                      c.subject ? "text-atlas-700" : "text-ink-900",
                    )}
                  >
                    {hasText(c.flag) ? <span aria-hidden="true">{c.flag}</span> : null}
                    {c.label}
                  </span>
                  {hasText(c.sub) ? (
                    <span className="block text-[11px] font-medium text-cocoa-700">{c.sub}</span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {validRows.map((row, ri) => {
              const leader = leaderFor(row);
              return (
                <tr
                  key={ri}
                  className={cn(
                    hoverable &&
                      "transition-colors hover:bg-ink-900/[0.035] focus-within:bg-ink-900/[0.035]",
                  )}
                >
                  <th
                    scope="row"
                    className="py-3 pr-4 text-left align-middle text-[13.5px] font-medium text-cocoa-700"
                  >
                    <span className="whitespace-nowrap text-ink-900">
                      {row.label}
                      {hasText(row.unit) ? (
                        <span className="ml-1.5 text-[11px] font-medium text-cocoa-700">
                          {row.unit}
                        </span>
                      ) : null}
                    </span>
                    {hasText(row.hint) ? (
                      <span className="mt-0.5 block text-[11px] font-normal text-cocoa-700">
                        {row.hint}
                      </span>
                    ) : null}
                  </th>
                  {cols.map((c) => {
                    const { held, text } = cellDisplay(row, c.key);
                    const isLeader = leader === c.key;
                    return (
                      <td
                        key={c.key}
                        className={figureCellClass({
                          held,
                          leader: isLeader,
                          tone: c.subject && !isLeader ? "accent" : "default",
                        })}
                      >
                        {text}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* below sm: the mandatory stacked reflow. one group per metric, one
          labeled row per place. zero horizontal scroll. */}
      <div className="flex flex-col gap-[18px] sm:hidden">
        {validRows.map((row, ri) => {
          const leader = leaderFor(row);
          return (
            <div key={ri} className="border-t border-parchment pt-3 first:border-t-0 first:pt-0">
              <div className="mb-2 text-xs font-bold text-ink-900">
                {row.label}
                {hasText(row.unit) ? (
                  <span className="ml-1.5 text-[11px] font-medium text-cocoa-700">{row.unit}</span>
                ) : null}
                {hasText(row.hint) ? (
                  <span className="ml-1.5 text-[11px] font-normal text-cocoa-700">{row.hint}</span>
                ) : null}
              </div>
              <dl className="space-y-0">
                {cols.map((c, ci) => {
                  const { held, text } = cellDisplay(row, c.key);
                  const isLeader = leader === c.key;
                  return (
                    <div
                      key={c.key}
                      className={cn(
                        "flex items-baseline justify-between gap-4 py-1.5",
                        ci > 0 && "border-t border-parchment/60",
                      )}
                    >
                      <dt
                        className={cn(
                          "inline-flex items-center gap-1.5 text-[13px] font-medium",
                          c.subject ? "font-bold text-atlas-700" : "text-cocoa-700",
                        )}
                      >
                        {hasText(c.flag) ? <span aria-hidden="true">{c.flag}</span> : null}
                        {c.label}
                      </dt>
                      <dd
                        className={cn(
                          "shrink-0 text-right text-sm tabular-nums",
                          !held
                            ? "font-medium text-cocoa-700"
                            : isLeader
                              ? "font-bold text-atlas-700"
                              : c.subject
                                ? "font-semibold text-atlas-700"
                                : "font-semibold text-ink-900",
                        )}
                      >
                        {text}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          );
        })}
      </div>
    </div>
  );
}
