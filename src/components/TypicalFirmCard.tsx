/**
 * TypicalFirmCard — a "biography" of the median firm in this cell.
 *
 * Pulls together derived ratios the user actually cares about:
 * employees per firm, revenue per employee, wage per employee, plus
 * a profitability-proxy spread (revenue per employee minus wage per
 * employee). All numbers come from a single Cell, so no extra fetch.
 */

import { Tooltip } from "./Tooltip";
import { fmtMoney } from "@/lib/format/money";

type CellLike = {
  industry_name?: string | null;
  geo_name?: string | null;
  n_enterprises?: number | null;
  n_employees?: number | null;
  revenue_per_firm?: number | null;
  payroll_per_employee?: number | null;
};

export function TypicalFirmCard({ cell, currencySymbol = "$" }: { cell: CellLike; currencySymbol?: string }) {
  // Plan v30 Phase 2 — unit-detection fix. Different data sources use
  // different conventions for cell.n_employees: some give the TOTAL
  // employees across the region (so divide by n_enterprises to get
  // per-firm), others give a per-firm average already. We detect which
  // by checking the ratio: if n_employees < n_enterprises, it's almost
  // certainly already per-firm (you don't get fewer total employees
  // than enterprises). Clamp the result to ≥ 1 (no fractional people).
  // This fixes the $2.9B / $101M-per-employee bug.
  const rawEmp = cell.n_employees ?? 0;
  const rawEnt = cell.n_enterprises ?? 0;
  let empPerFirm: number | null = null;
  if (rawEmp > 0) {
    if (rawEnt > 0) {
      const ratio = rawEmp / rawEnt;
      // If the ratio is sub-1, n_employees is already per-firm scale.
      // Use n_employees directly. Otherwise treat n_employees as total
      // and divide.
      empPerFirm = ratio < 1 ? rawEmp : ratio;
    } else {
      empPerFirm = rawEmp;
    }
    empPerFirm = Math.max(1, empPerFirm);
  }
  const rawRevPerEmp =
    cell.revenue_per_firm && empPerFirm && empPerFirm > 0 ? cell.revenue_per_firm / empPerFirm : null;
  // Plan v30 Phase 2 — hard sanity ceiling. Revenue per employee above
  // $500K is essentially never an SMB benchmark. Anything above this
  // band signals a unit error upstream; suppress the cell rather than
  // render an absurd number.
  const revPerEmployee = rawRevPerEmp != null && rawRevPerEmp <= 500_000 ? rawRevPerEmp : null;
  const wage = cell.payroll_per_employee ?? null;
  const grossSpread =
    revPerEmployee != null && wage != null ? revPerEmployee - wage : null;

  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-ink-700/70 font-medium mb-2 flex items-center">
        The typical firm
        <Tooltip text="Derived per-employee ratios: revenue each person generates, what they earn, and the gap between the two." />
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-3">
        <Row
          label="Revenue per employee"
          value={revPerEmployee != null ? fmtMoney(revPerEmployee, currencySymbol) : "-"}
          tooltip="How much revenue each employee brings in on average."
        />
        <Row
          label="Wage per employee"
          value={wage != null ? fmtMoney(wage, currencySymbol) : "-"}
        />
        <Row
          label="Revenue minus wages"
          value={grossSpread != null ? fmtMoney(grossSpread, currencySymbol) : "-"}
          tooltip="What's left per employee after paying wages. A rough gross-margin proxy before rent, materials, and taxes."
        />
      </div>
    </div>
  );
}

function Row({ label, value, tooltip }: { label: string; value: string; tooltip?: string }) {
  return (
    <div>
      <div className="text-xs text-ink-700/70 flex items-center">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <div className="text-base font-semibold text-ink-900 mt-0.5">{value}</div>
    </div>
  );
}


