/**
 * AnnualCostStack (Plan v32 Sprint G — Phase 0e stub).
 *
 * Eight-line annual cost breakdown for a cell. Renders only when the
 * cell has cost_stack populated. Suppressed (returns null) otherwise.
 *
 * Mobile behavior: per founder, expander pattern. Sliver visible
 * (title + a one-line summary "Annual operating costs"); user taps
 * to reveal the 8 lines.
 */

import * as React from "react";
import type { Cell } from "@/lib/cells";
import type { CostStack } from "@/lib/types/deepening";
import { fmtMoney } from "@/lib/format/money";

type Props = {
  cell: Cell;
};

const LINES: Array<{ field: keyof CostStack; label: string; hint?: string }> = [
  { field: "rent_occupancy", label: "Rent / occupancy" },
  { field: "payroll_total", label: "Payroll", hint: "Wages + employer-side contributions" },
  { field: "cost_of_goods_sold", label: "Cost of goods sold" },
  { field: "utilities", label: "Utilities" },
  { field: "marketing_acquisition", label: "Marketing & acquisition" },
  { field: "insurance_professional", label: "Insurance & professional services" },
  { field: "equipment_maintenance", label: "Equipment & maintenance" },
  // Vehicle, fuel, maintenance, depreciation. Suppressed
  // automatically when the cost-stack value is absent or zero.
  { field: "motor_vehicle", label: "Motor vehicle", hint: "Vehicle, fuel, maintenance, depreciation" },
  { field: "regulatory_licensing", label: "Regulatory & licensing" },
];

export function AnnualCostStack({ cell }: Props) {
  const stack = cell.cost_stack;
  if (!stack) return null;
  // Exclude rows where the value is zero (motor_vehicle
  // is zero for office-based industries; rendering "$0" is noise).
  const populated = LINES.filter((line) => {
    const v = stack[line.field];
    return typeof v === "number" && isFinite(v) && v > 0;
  });
  if (populated.length === 0) return null;

  const total = populated.reduce((acc, line) => acc + (stack[line.field] as number), 0);
  const grade = stack.grade ?? "C";
  const refreshed = stack.refreshed_at;

  return (
    <section
      aria-labelledby="annual-cost-stack-heading"
      className="my-8 rounded-2xl border border-ink-200 bg-white overflow-hidden"
    >
      <details className="md:open" open>
        <summary
          id="annual-cost-stack-heading"
          className="cursor-pointer list-none px-6 py-4 flex items-center justify-between gap-4 border-b border-ink-100 md:border-b md:cursor-default"
        >
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-atlas-700">
              Annual operating costs
            </div>
            <div className="mt-0.5 font-display text-xl text-ink-900 leading-tight">
              {fmtMoney(total)} per typical firm per year
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-wide text-ink-500 shrink-0">
            Grade {grade}
          </span>
        </summary>

        <table className="w-full text-sm">
          <tbody>
            {LINES.map((line) => {
              const v = stack[line.field];
              // Fully suppress rows with no data OR zero
              // value. Motor vehicle is zero for office-based industries
              // and rendering "$0" was noise; the line vanishes entirely
              // when the industry doesn't have a real motor-vehicle cost.
              if (typeof v !== "number" || !isFinite(v) || v <= 0) {
                return null;
              }
              const share = total > 0 ? Math.round((v / total) * 100) : 0;
              return (
                <tr key={line.field} className="border-b border-ink-50 last:border-b-0">
                  <td className="px-6 py-2.5 text-ink-900">
                    <div>{line.label}</div>
                    {line.hint && (
                      <div className="text-[11px] text-ink-500 leading-tight">{line.hint}</div>
                    )}
                  </td>
                  <td className="px-6 py-2.5 text-right tabular-nums">
                    <span className="text-ink-900 font-medium">{fmtMoney(v)}</span>
                    <span className="ml-2 text-ink-500 text-xs">{share}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {(refreshed || stack.source_note) && (
          <div className="px-6 py-3 bg-ink-50 text-xs text-ink-600 border-t border-ink-100">
            {refreshed && <span>Refreshed {refreshed}. </span>}
            {stack.source_note && <span>{stack.source_note}</span>}
          </div>
        )}
      </details>
    </section>
  );
}
