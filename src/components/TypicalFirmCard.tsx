/**
 * TypicalFirmCard — a "biography" of the median firm in this cell.
 *
 * Pulls together derived ratios the user actually cares about:
 * employees per firm, revenue per employee, wage per employee, plus
 * a profitability-proxy spread (revenue per employee minus wage per
 * employee). All numbers come from a single Cell, so no extra fetch.
 */

import { Tooltip } from "./Tooltip";

type CellLike = {
  industry_name?: string | null;
  geo_name?: string | null;
  n_enterprises?: number | null;
  n_employees?: number | null;
  revenue_per_firm?: number | null;
  payroll_per_employee?: number | null;
};

export function TypicalFirmCard({ cell, currencySymbol = "$" }: { cell: CellLike; currencySymbol?: string }) {
  // Plan v13 Wave 1 — firm-count display and the derived avg-employees-per-firm
  // were removed because the underlying n_enterprises field is unreliable.
  // Per-employee metrics are taken straight from the wage/revenue fields.
  const empPerFirm =
    cell.n_employees && cell.n_enterprises ? cell.n_employees / cell.n_enterprises : null;
  const revPerEmployee =
    cell.revenue_per_firm && empPerFirm && empPerFirm > 0 ? cell.revenue_per_firm / empPerFirm : null;
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

function fmtMoney(v: number, sym = "$"): string {
  if (v == null || isNaN(v)) return "-";
  if (v >= 1e9) return `${sym}${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${sym}${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${sym}${(v / 1e3).toFixed(0)}K`;
  return `${sym}${v.toFixed(0)}`;
}

