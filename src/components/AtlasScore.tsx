/**
 * AtlasScore — a single 0-100 composite "industry health" score per cell,
 * derived from four signals weighted equally:
 *
 *  - Density: log scale of firm count, normalized to 0-1
 *  - Distribution: ratio of p90/p50 (high = lots of headroom)
 *  - Wage: log scale of mean wage, normalized
 *  /* useless-tile-ok: JSDoc describes an internal score signal, not a tile */
 *  - Data quality: cell.quality_score / 100
 *
 * Pure derivation — no extra fetch. Renders as a colored chip with a
 * tier label ("Strong" / "Solid" / "Mixed" / "Tough").
 */

import { Tooltip } from "./Tooltip";

type CellLike = {
  n_enterprises?: number | null;
  revenue_per_firm?: number | null;
  rev_p50?: number | null;
  rev_p90?: number | null;
  payroll_per_employee?: number | null;
  quality_score?: number | null;
};

export function computeAtlasScore(cell: CellLike): number {
  function clamp01(v: number): number {
    if (isNaN(v)) return 0;
    return Math.max(0, Math.min(1, v));
  }
  const density = cell.n_enterprises
    ? clamp01(Math.log10(cell.n_enterprises) / 6) // saturates around 1M firms
    : 0;
  const spread =
    cell.rev_p50 && cell.rev_p90 && cell.rev_p50 > 0
      ? clamp01((cell.rev_p90 / cell.rev_p50 - 1) / 4) // ratio of 5x = 1.0
      : 0;
  const wage = cell.payroll_per_employee
    ? clamp01(Math.log10(cell.payroll_per_employee) / 5.5)
    : 0;
  const qual = cell.quality_score ? clamp01(cell.quality_score / 100) : 0.5;

  const raw = density * 0.25 + spread * 0.25 + wage * 0.25 + qual * 0.25;
  return Math.round(raw * 100);
}

function scoreTier(score: number): { label: string; tone: string } {
  if (score >= 70) return { label: "Strong", tone: "bg-moss-100 text-moss-700 border-moss-300" };
  if (score >= 55) return { label: "Solid",  tone: "bg-atlas-100 text-atlas-800 border-atlas-300" };
  if (score >= 40) return { label: "Mixed",  tone: "bg-cream-200 text-cocoa-700 border-cream-300" };
  return { label: "Tough", tone: "bg-clay-100 text-clay-700 border-clay-300" };
}

export function AtlasScore({ cell }: { cell: CellLike }) {
  const score = computeAtlasScore(cell);
  const tier = scoreTier(score);
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide text-ink-700/70 font-medium mb-2 flex items-center">
        Atlas Score
        <Tooltip text="A 0-100 composite score reflecting how attractive this cell looks on four signals: firm count, spread between typical and top firms, wage level, and data quality. Higher is generally better: but read the underlying numbers; the score is a starting point, not a verdict." />
      </div>
      <div className="flex items-baseline gap-4">
        <div className="text-4xl md:text-5xl font-semibold text-ink-900 tabular-nums">{score}</div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${tier.tone}`}>
          {tier.label}
        </div>
      </div>
      <div className="mt-3 h-2 bg-cream-200 rounded overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-atlas-300 via-atlas-500 to-atlas-700"
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="mt-2 text-[10px] text-ink-700/50 uppercase tracking-wide">
        Composite · density · spread · wage · quality
      </div>
    </div>
  );
}
