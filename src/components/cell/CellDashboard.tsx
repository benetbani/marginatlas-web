/**
 * src/components/cell/CellDashboard.tsx
 *
 * The data-first dashboard that leads the cell page. A single tight block the
 * reader can perceive in one glance, before any prose: a compact row of the
 * proprietary scores, then two stat grids ("The numbers" and "The market")
 * built by buildCellDashboard.
 *
 * Server component. Warm tokens only, mobile-first. No paragraphs: every value
 * is a label + figure, table-like and scannable. Rows that are absent in the
 * data are already omitted upstream (hide weakness), so this component never
 * renders a blank or faked cell. Whole blocks self-suppress when their data
 * array is empty.
 *
 * The scores strip renders the items as small chips rather than reusing
 * ScorePanel: ScorePanel is a prose-carrying card grid, which is the opposite
 * of the instantly-perceivable read the dashboard wants at the very top.
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import type { Score, ScoreBand } from "@/lib/scores";
import type { CellDashboardData, DashRow } from "@/lib/scores/cell_dashboard";

export interface CellDashboardProps {
  scores: Score[];
  /** The blended headline score, surfaced separately in the hero. */
  opportunity?: Score | null;
  data: CellDashboardData;
}

/** Chip tone per band. Higher is always better, so the colour direction is
 * consistent across every score. */
function chipTone(band: ScoreBand): string {
  switch (band) {
    case "strong":
      return "border-moss-300 bg-moss-50 text-moss-700";
    case "workable":
    case "mixed":
      return "border-atlas-300 bg-atlas-100/60 text-atlas-700";
    default:
      return "border-clay-300 bg-clay-100/60 text-clay-700";
  }
}

function StatGrid({ rows }: { rows: DashRow[] }) {
  return (
    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-3">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="text-xs uppercase tracking-wide text-cocoa-500">
            {row.label}
          </dt>
          <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums text-ink-900 md:text-xl">
            {row.value}
          </dd>
          {row.hint ? (
            <dd className="text-xs text-cocoa-500">{row.hint}</dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

export function CellDashboard({ scores, data }: CellDashboardProps) {
  const hasScores = scores.length > 0;
  const hasMoney = data.money.length > 0;
  const hasMarket = data.market.length > 0;
  if (!hasScores && !hasMoney && !hasMarket) return null;

  return (
    <div className="atlas-card my-6 p-4 md:p-6">
      {hasScores ? (
        <div className="flex flex-wrap gap-2">
          {scores.map((s) => (
            <span
              key={s.id}
              className={`inline-flex items-baseline gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${chipTone(
                s.band,
              )}`}
            >
              <span className="uppercase tracking-wide">{s.label}</span>
              <span className="font-display text-sm tabular-nums">{s.value}</span>
            </span>
          ))}
        </div>
      ) : null}

      {hasMoney ? (
        <section className={hasScores ? "mt-5" : undefined}>
          <SectionEyebrow size="sm">The numbers</SectionEyebrow>
          <StatGrid rows={data.money} />
        </section>
      ) : null}

      {hasMarket ? (
        <section className={hasScores || hasMoney ? "mt-6" : undefined}>
          <SectionEyebrow size="sm">The market</SectionEyebrow>
          <StatGrid rows={data.market} />
        </section>
      ) : null}
    </div>
  );
}
