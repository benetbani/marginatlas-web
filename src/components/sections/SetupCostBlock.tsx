/**
 * SetupCostBlock (Plan v32 Sprint G — Phase 0e stub).
 *
 * Two boxes shown above the revenue tiles. Box 1 = registration +
 * licensing (the legal floor). Box 2 = capital fit-out + equipment
 * (where the big numbers are). Plus a derived break-even payback.
 *
 * Renders only when at least one of the two halves is populated.
 * Suppressed (returns null) for industries where setup ≈ 0
 * (consultants, independent professionals).
 *
 * Mobile: per founder, expander pattern. Both boxes collapse into
 * a single summary line "Cost to open: ~$X total"; user taps to
 * see the breakdown.
 */

import * as React from "react";
import type { Cell } from "@/lib/cells";
import type { SetupRegistration, SetupCapital } from "@/lib/types/deepening";
import { fmtMoney } from "@/lib/format/money";

type Props = {
  cell: Cell;
  /** Anchor id for the sticky section nav (the manifest "startup-cost" id). */
  id?: string;
};

const REGISTRATION_LINES: Array<{ field: keyof SetupRegistration; label: string }> = [
  { field: "business_registration_fee", label: "Business registration" },
  { field: "industry_licenses_fee", label: "Industry licenses" },
  { field: "professional_license_fee", label: "Professional licenses" },
  { field: "insurance_bond_initial", label: "Insurance / bonds (initial)" },
  { field: "certifications_initial", label: "Certifications (initial)" },
];

const CAPITAL_LINES: Array<{ field: keyof SetupCapital; label: string }> = [
  { field: "property_fitout", label: "Property fit-out" },
  { field: "equipment_initial", label: "Equipment" },
  { field: "initial_inventory", label: "Initial inventory" },
  { field: "lease_deposit", label: "Lease deposit" },
  { field: "pre_opening_marketing", label: "Pre-opening marketing" },
];

/** Whether SetupCostBlock will render a real card for this cell. The cell page
 * uses this to decide between the block and the always-present empty placeholder
 * (so the "startup-cost" section and its nav anchor are never silently dropped).
 */
export function hasSetupCostData(cell: Cell): boolean {
  const setup = cell.setup_costs;
  if (!setup) return false;
  const reg = setup.registration;
  const cap = setup.capital;
  const regTotal =
    reg?.total_estimated ??
    REGISTRATION_LINES.reduce((acc, line) => acc + (toNumber(reg?.[line.field]) ?? 0), 0);
  const capTotal =
    cap?.total_estimated ??
    CAPITAL_LINES.reduce((acc, line) => acc + (toNumber(cap?.[line.field]) ?? 0), 0);
  return regTotal + capTotal > 0;
}

export function SetupCostBlock({ cell, id }: Props) {
  const setup = cell.setup_costs;
  if (!setup) return null;

  const reg = setup.registration;
  const cap = setup.capital;

  const regTotal =
    reg?.total_estimated ??
    REGISTRATION_LINES.reduce((acc, line) => acc + (toNumber(reg?.[line.field]) ?? 0), 0);
  const capTotal =
    cap?.total_estimated ??
    CAPITAL_LINES.reduce((acc, line) => acc + (toNumber(cap?.[line.field]) ?? 0), 0);

  const grandTotal = regTotal + capTotal;
  if (grandTotal <= 0) return null;

  const grade = setup.grade ?? "C";
  const payback = setup.payback_months_estimate;

  return (
    <section
      id={id}
      aria-labelledby="setup-cost-heading"
      className="atlas-card my-8 overflow-hidden"
    >
      <details className="md:open" open>
        <summary
          id="setup-cost-heading"
          className="cursor-pointer list-none px-6 py-4 flex items-center justify-between gap-4 border-b border-ink-100 md:border-b md:cursor-default"
        >
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-atlas-700">
              Cost to open
            </div>
            <div className="mt-0.5 font-display text-xl text-ink-900 leading-tight">
              {fmtMoney(grandTotal)} estimated, one-time
            </div>
          </div>
          <span className="text-[10px] uppercase tracking-wide text-ink-500 shrink-0">
            Grade {grade}
          </span>
        </summary>

        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ink-100">
          <SetupColumn
            heading="Legal & licensing"
            total={regTotal}
            lines={reg ? REGISTRATION_LINES.map((line) => ({
              label: line.label,
              value: toNumber(reg[line.field]),
            })) : []}
            sourceNote={reg?.source_note}
          />
          <SetupColumn
            heading="Fit-out & equipment"
            total={capTotal}
            lines={cap ? CAPITAL_LINES.map((line) => ({
              label: line.label,
              value: toNumber(cap[line.field]),
            })) : []}
            sourceNote={cap?.source_note}
            footerExtras={cap?.working_capital_reserve_months ? (
              <div className="text-xs text-ink-600 pt-2 border-t border-ink-100">
                Plus a recommended working-capital reserve of
                {" "}<span className="font-medium text-ink-900">
                  {cap.working_capital_reserve_months} months
                </span>{" "}
                of operating expenses.
              </div>
            ) : null}
          />
        </div>

        {typeof payback === "number" && isFinite(payback) && payback > 0 && (
          <div className="px-6 py-3 bg-ink-50 text-xs text-ink-700 border-t border-ink-100">
            Approximate break-even payback:
            {" "}<span className="font-semibold text-ink-900">{Math.round(payback)} months</span>
            {" "}from opening at typical revenue and margin.
          </div>
        )}
      </details>
    </section>
  );
}

function SetupColumn({
  heading,
  total,
  lines,
  sourceNote,
  footerExtras,
}: {
  heading: string;
  total: number;
  lines: Array<{ label: string; value: number | null }>;
  sourceNote?: string;
  footerExtras?: React.ReactNode;
}) {
  const populated = lines.filter((line) => line.value != null && isFinite(line.value));
  return (
    <div className="px-6 py-4">
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-700">
          {heading}
        </div>
        <div className="text-sm font-semibold text-ink-900 tabular-nums">{fmtMoney(total)}</div>
      </div>

      {populated.length === 0 ? (
        <div className="text-sm text-ink-500">No itemized data yet.</div>
      ) : (
        <ul className="text-sm">
          {populated.map((line) => (
            <li key={line.label} className="flex justify-between gap-3 py-1.5 border-b border-ink-50 last:border-b-0">
              <span className="text-ink-700">{line.label}</span>
              <span className="text-ink-900 tabular-nums">{fmtMoney(line.value!)}</span>
            </li>
          ))}
        </ul>
      )}

      {sourceNote && (
        <div className="text-[11px] text-ink-500 mt-2 leading-snug">{sourceNote}</div>
      )}
      {footerExtras}
    </div>
  );
}

function toNumber(v: unknown): number | null {
  if (typeof v === "number" && isFinite(v)) return v;
  return null;
}
