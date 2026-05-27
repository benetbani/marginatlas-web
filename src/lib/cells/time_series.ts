/**
 * src/lib/cells/time_series.ts
 *
 * Architecture-audit strategy F (2026-05-27). Extracted from
 * src/lib/cells.ts. Time-series helpers operate on an array of cells
 * (typically the result of getCellVariants) and collapse it into a
 * one-row-per-year shape suitable for the trend chart.
 *
 * Re-exported from cells.ts so external imports continue to work.
 */
import type { Cell } from "@/lib/cells";

/** Distinct size bands present for a given (geo, industry). */
export function distinctSizeBands(cells: Cell[]): string[] {
  const seen = new Set<string>();
  for (const c of cells) if (c.size_band) seen.add(c.size_band);
  return Array.from(seen);
}

/** Distinct years present for a given (geo, industry). */
export function distinctYears(cells: Cell[]): number[] {
  const seen = new Set<number>();
  for (const c of cells) if (c.year) seen.add(c.year);
  return Array.from(seen).sort((a, b) => b - a);
}

export type TimePoint = {
  year: number;
  revenue_per_firm: number | null;
  n_enterprises: number | null;
  n_employees: number | null;
  payroll_per_employee: number | null;
};

/**
 * Collapse variants into a one-row-per-year time series. Picks the row
 * with the largest n_enterprises in each year (a proxy for the
 * "all sizes" aggregate when a true total row is not present).
 */
export function buildTimeSeries(cells: Cell[]): TimePoint[] {
  const byYear = new Map<number, Cell>();
  for (const c of cells) {
    if (!c.year) continue;
    const prev = byYear.get(c.year);
    if (!prev || (c.n_enterprises ?? 0) > (prev.n_enterprises ?? 0)) {
      byYear.set(c.year, c);
    }
  }
  return Array.from(byYear.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, c]) => ({
      year,
      revenue_per_firm: c.revenue_per_firm ?? null,
      n_enterprises: c.n_enterprises ?? null,
      n_employees: c.n_employees ?? null,
      payroll_per_employee: c.payroll_per_employee ?? null,
    }));
}
