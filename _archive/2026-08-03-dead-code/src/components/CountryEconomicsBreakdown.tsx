/**
 * CountryEconomicsBreakdown — surfaces the country-specific cost split and
 * firm-size mix that ride on a cell (from src/lib/finance/country_industry_economics.json,
 * generated from the research drops). Renders two quiet stacked bars:
 *   - "Where the money goes": cost of goods / labor / rent / other, as a share
 *     of total costs (sums to ~100). Labor carries the lone atlas accent.
 *   - "Who runs these": share of firms per employee band.
 *
 * Self-suppresses (returns null) when neither dataset is present, per the
 * graceful-omission rule. Server component — no interactivity.
 */
import * as React from "react";

type CostStructure = { cogs: number; labor: number; rent: number; other: number };

type Props = {
  costStructure?: CostStructure | null;
  firmDistribution?: Record<string, number> | null;
  industryName?: string | null;
};

const COST_SEGMENTS: { key: keyof CostStructure; label: string; bar: string }[] = [
  { key: "cogs", label: "Cost of goods", bar: "bg-ink-700" },
  { key: "labor", label: "Labor", bar: "bg-atlas-500" },
  { key: "rent", label: "Rent and space", bar: "bg-ink-500" },
  { key: "other", label: "Everything else", bar: "bg-ink-300" },
];

const BAND_ORDER = ["1-4", "5-9", "10-19", "20-49", "50-99", "100+"];
const BAND_SHADES = ["bg-atlas-500", "bg-atlas-400", "bg-atlas-300", "bg-atlas-200", "bg-atlas-100", "bg-ink-300"];

export function CountryEconomicsBreakdown({ costStructure, firmDistribution, industryName }: Props) {
  const costTotal = costStructure
    ? costStructure.cogs + costStructure.labor + costStructure.rent + costStructure.other
    : 0;
  const hasCost = costTotal > 0;

  const bands = firmDistribution ? BAND_ORDER.filter((b) => (firmDistribution[b] ?? 0) > 0) : [];
  const hasFirms = bands.length > 0;
  const firmTotal = bands.reduce((s, b) => s + (firmDistribution?.[b] ?? 0), 0) || 1;

  if (!hasCost && !hasFirms) return null;

  const what = industryName ? industryName.toLowerCase() : "small business";

  return (
    <section className="atlas-card p-5 md:p-6 mt-6" aria-label="Cost structure and firm mix">
      {hasCost && costStructure && (
        <div>
          <div className="text-[10px] uppercase tracking-[0.16em] text-atlas-700 font-semibold mb-3">
            Where the money goes
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-ink-100">
            {COST_SEGMENTS.map((s) => {
              const v = costStructure[s.key];
              if (!v) return null;
              return (
                <div
                  key={s.key}
                  className={s.bar}
                  style={{ width: `${(v / costTotal) * 100}%` }}
                  aria-label={`${s.label} ${Math.round(v)} percent`}
                />
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
            {COST_SEGMENTS.map((s) => {
              const v = costStructure[s.key];
              if (!v) return null;
              return (
                <div key={s.key} className="flex items-center gap-2">
                  <span className={`inline-block h-2.5 w-2.5 rounded-sm ${s.bar}`} aria-hidden />
                  <span className="text-xs text-ink-700">
                    {s.label} <strong className="text-ink-900">{Math.round(v)}%</strong>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hasFirms && firmDistribution && (
        <div className={hasCost ? "mt-6 pt-5 border-t border-ink-100" : ""}>
          <div className="text-[10px] uppercase tracking-[0.16em] text-atlas-700 font-semibold mb-3">
            Who runs these, by team size
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-ink-100">
            {bands.map((b, i) => (
              <div
                key={b}
                className={BAND_SHADES[i] ?? "bg-ink-300"}
                style={{ width: `${(firmDistribution[b] / firmTotal) * 100}%` }}
                aria-label={`${b} employees, ${Math.round(firmDistribution[b])} percent of firms`}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {bands.map((b, i) => (
              <div key={b} className="flex items-center gap-1.5">
                <span className={`inline-block h-2.5 w-2.5 rounded-sm ${BAND_SHADES[i] ?? "bg-ink-300"}`} aria-hidden />
                <span className="text-xs text-ink-700">
                  {b} <strong className="text-ink-900">{Math.round(firmDistribution[b])}%</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-[11px] text-ink-500 leading-snug">
        Modeled estimate of a typical {what} in this market. The cost split is a share of total
        costs; figures are low-confidence.
      </div>
    </section>
  );
}
