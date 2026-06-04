/**
 * src/components/cell/CellDashboard.tsx
 *
 * The data-first dashboard that leads the cell page. A single dense block the
 * reader can perceive before any prose: a compact row of the proprietary
 * scores, then an ordered stack of labeled mini-tables ("The numbers", "The
 * market", "Survival", "Pricing and demand", "Where the money goes", "Setup
 * and capital", "Business climate"), each a tight stat grid built by
 * buildCellDashboard.
 *
 * Server component. Warm tokens only, mobile-first. No paragraphs: every value
 * is a label + figure, table-like and scannable. Empty rows and empty sections
 * are already omitted upstream (hide weakness), so this component never renders
 * a blank or faked cell, and whole sections self-suppress when their data is
 * absent. The component returns null only when there are zero sections.
 *
 * The scores strip renders the items as small chips rather than reusing
 * ScorePanel: ScorePanel is a prose-carrying card grid, which is the opposite
 * of the instantly-perceivable read the dashboard wants at the very top.
 *
 * One quiet footnote at the bottom flags that the market / survival / pricing /
 * climate figures are modeled from national business demography. There are no
 * per-row confidence badges: the rule is to show the number plainly or omit it.
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

/** Section keys whose figures come from the modeled London dataset. */
const MODELED_KEYS = new Set(["market", "survival", "pricing", "climate"]);

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
    <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-3">
      {rows.map((row) => (
        <div key={row.label}>
          <dt className="text-xs uppercase tracking-wide text-cocoa-500">{row.label}</dt>
          <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums text-ink-900">
            {row.value}
          </dd>
          {row.hint ? (
            <dd className="text-[11px] text-cocoa-500">{row.hint}</dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

export function CellDashboard({ scores, data }: CellDashboardProps) {
  const hasScores = scores.length > 0;
  const sections = data.sections;
  if (!hasScores && sections.length === 0) return null;

  const hasModeled = sections.some((s) => MODELED_KEYS.has(s.key));

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

      {sections.map((section, i) => (
        <section
          key={section.key}
          className={hasScores || i > 0 ? "mt-6" : undefined}
        >
          <SectionEyebrow size="sm">{section.title}</SectionEyebrow>
          {section.note ? (
            <p className="mt-1 text-xs text-cocoa-500">{section.note}</p>
          ) : null}
          <StatGrid rows={section.rows} />
        </section>
      ))}

      {hasModeled ? (
        <p className="mt-6 border-t border-parchment/60 pt-3 text-[11px] leading-relaxed text-cocoa-500">
          Market, survival, pricing, and climate figures are modeled from
          national business demography. Treat as directional.
        </p>
      ) : null}
    </div>
  );
}
