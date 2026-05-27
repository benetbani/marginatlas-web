/**
 * KeyBenchmarkBanner — ATO Phase 2.
 *
 * For every cell page, surface ONE ratio as the headline benchmark
 * (per the ATO Small Business Benchmarks framework). The chosen ratio
 * differs by industry: COGS for restaurants and retail, Labour for
 * professional services and clinics, Motor vehicle for transport,
 * Total expenses elsewhere.
 *
 * Renders a compact strip immediately below the cell-page hero,
 * before the revenue distribution chart. Returns null only when the
 * cell has no industry_id (defensive — the cost-engine has a sector
 * fallback that always resolves).
 *
 * Per docs/strategy/2026-05-26-ato-framework-execution-plan.md §3.2.
 */

import * as React from "react";
import type { Cell } from "@/lib/cells";
import {
  getKeyBenchmarkForIndustry,
  labelKeyBenchmark,
  type KeyBenchmark,
} from "@/lib/cost_engine/engine";
import { getComparativeLead } from "@/lib/content/comparative_narratives";
import { TurnoverBandChip } from "@/components/TurnoverBandChip";

type Props = {
  cell: Cell;
};

function pctFmt(v: number): string {
  return (v * 100).toFixed(0) + "%";
}

function rangeFmt(low: number, high: number): string {
  return `${pctFmt(low)} to ${pctFmt(high)}`;
}

/**
 * Short label for the ratio formula. Helps operators map the
 * benchmark name back to the math.
 */
function ratioFormula(kb: KeyBenchmark): string {
  switch (kb) {
    case "cogs":
      return "Cost of sales divided by revenue";
    case "labor":
      return "Total labour cost divided by revenue";
    case "rent":
      return "Rent divided by revenue";
    case "motor_vehicle":
      return "Vehicle plus fuel plus maintenance divided by revenue";
    case "total_expenses":
      return "All operating expenses divided by revenue";
  }
}

export function KeyBenchmarkBanner({ cell }: Props) {
  if (!cell.industry_id) return null;
  const { kb, range, rationale } = getKeyBenchmarkForIndustry(cell.industry_id);
  const label = labelKeyBenchmark(kb);
  const formula = ratioFormula(kb);
  // Comparative-voice lead. Replaces the descriptive
  // rationale with a "Watch your X" imperative sentence that frames
  // the benchmark as a deviation gauge, not a typical-firm portrait.
  const lead = getComparativeLead(cell.industry_id);

  return (
    <section
      aria-labelledby="key-benchmark-heading"
      className="my-8 rounded-2xl border border-ink-200 bg-white overflow-hidden"
    >
      <div className="px-6 py-5 md:px-8 md:py-6">
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-atlas-700">
            The one ratio to watch
          </div>
          <TurnoverBandChip cell={cell} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
          <div className="md:col-span-7">
            <h3
              id="key-benchmark-heading"
              className="font-display text-lg md:text-xl text-ink-900 leading-snug mb-2"
            >
              {label} as a share of revenue
            </h3>
            <p className="text-sm md:text-base text-cocoa-700 leading-relaxed mb-2">
              {lead ? lead.sentence : rationale}
            </p>
            <p className="text-xs text-cocoa-700/70">
              Formula: {formula}.
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="rounded-xl bg-cream-50 border border-ink-100 p-4 md:p-5">
              <div className="text-[11px] uppercase tracking-wide text-cocoa-700/70 font-semibold mb-1">
                Typical range for this activity
              </div>
              <div className="font-display text-3xl md:text-4xl font-semibold text-ink-900 tabular-nums leading-none">
                {rangeFmt(range.low, range.high)}
              </div>
              <div className="mt-2 text-[11px] text-cocoa-700/60 leading-relaxed">
                Middle band of operators. Outside the range is not a
                problem on its own; it is a flag worth understanding.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
