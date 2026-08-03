/**
 * TangibleUnits — translate revenue into recognized operating units.
 *
 * Reads cell.revenue_per_firm + per-industry operating-units data;
 * computes daily transactions, average ticket, opening days per year,
 * one editorial texture-note. Renders nothing for industries without
 * an operating-units entry.
 *
 * Mount near the top of the cell page, above the cost stack. Makes
 * the abstract revenue figure visceral.
 */

import * as React from "react";
import type { Cell } from "@/lib/cells";
import { getOperatingUnits } from "@/lib/qa/industry_operating_units";
import { fmtMoney, fmtCount } from "@/lib/format/money";

type Props = {
  cell: Cell;
};

export function TangibleUnits({ cell }: Props) {
  const rev = cell.revenue_per_firm ?? cell.rev_p50;
  if (!rev || rev <= 0 || !cell.industry_id) return null;
  const units = getOperatingUnits(cell.industry_id);
  if (!units) return null;

  // Compute the primary count.
  const annualCount = rev / units.average_ticket_usd;
  const primaryCount =
    units.period === "day"
      ? annualCount / units.operating_days_per_year
      : annualCount;
  // For day-period industries also surface annual and weekly counts.
  const weeklyCount = units.period === "day" ? primaryCount * 7 : null;

  const dailyRevenue = rev / units.operating_days_per_year;

  return (
    <section
      aria-labelledby="tangible-units-heading"
      className="my-8 rounded-2xl border border-ink-200 bg-white overflow-hidden"
    >
      <div className="px-6 py-5 md:px-8 md:py-6 border-b border-ink-100">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-atlas-700 mb-2">
          What that revenue actually feels like
        </div>
        <h3
          id="tangible-units-heading"
          className="font-display text-lg md:text-xl text-ink-900 leading-snug"
        >
          {fmtMoney(rev)} a year for a typical {cell.industry_name ?? "firm"}
          {cell.geo_name ? ` in ${cell.geo_name}` : ""} works out to:
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink-100">
        <Stat
          big={
            units.period === "day"
              ? `${fmtCount(Math.round(primaryCount))} ${units.primary_unit_name} / day`
              : `${fmtCount(Math.round(primaryCount))} ${units.primary_unit_name} / year`
          }
          label="Primary volume"
        />
        <Stat
          big={`${fmtMoney(units.average_ticket_usd)} avg ticket`}
          label="Per transaction / visit"
        />
        <Stat
          big={
            units.period === "day"
              ? `${fmtMoney(dailyRevenue)} / day`
              : `${fmtMoney(rev / 12)} / month`
          }
          label={units.period === "day" ? "Average operating day" : "Average operating month"}
        />
      </div>

      {(units.period === "day" && weeklyCount != null) && (
        <div className="px-6 py-4 md:px-8 bg-ink-50 text-sm text-ink-700 border-t border-ink-100">
          That's about <span className="font-semibold text-ink-900">{fmtCount(Math.round(weeklyCount))}</span>{" "}
          {units.primary_unit_name} a week, or roughly{" "}
          <span className="font-semibold text-ink-900">{fmtCount(Math.round(annualCount))}</span>{" "}
          a year. Operating {units.operating_days_per_year} days.
        </div>
      )}

      <div className="px-6 py-4 md:px-8 text-sm text-ink-700 leading-relaxed border-t border-ink-100">
        {units.texture_note}
      </div>
    </section>
  );
}

function Stat({ big, label }: { big: string; label: string }) {
  return (
    <div className="px-6 py-5 md:px-7 md:py-6">
      <div className="font-display text-lg md:text-xl text-ink-900 leading-snug tabular-nums">
        {big}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wide text-ink-500">{label}</div>
    </div>
  );
}
