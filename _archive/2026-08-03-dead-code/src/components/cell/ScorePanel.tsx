/**
 * src/components/cell/ScorePanel.tsx
 *
 * The component-score panel (bible Section 10). Renders the computable
 * 0-to-100 scores as a calm grid of cards: title, score, band word, a thin
 * meter, and one blunt line of meaning. The blended Opportunity score is NOT
 * rendered here; it leads in the VerdictHero. If no component scores are
 * computable, the whole section returns null (graceful silent omission).
 *
 * Server component. Warm tokens only. Higher is always better, so the meter
 * fill and band word read the same direction for every row.
 */
import * as React from "react";
import { bandWord, type Score, type ScoreBand } from "@/lib/scores";

export interface ScorePanelProps {
  scores: Score[];
  /** Optional section eyebrow override. */
  eyebrow?: string;
}

function meterFill(band: ScoreBand): string {
  switch (band) {
    case "strong":
      return "bg-moss-500";
    case "workable":
      return "bg-atlas-500";
    case "mixed":
      return "bg-atlas-300";
    case "weak":
      return "bg-clay-300";
    default:
      return "bg-clay-500";
  }
}

function bandText(band: ScoreBand): string {
  switch (band) {
    case "strong":
      return "text-moss-700";
    case "workable":
    case "mixed":
      return "text-atlas-700";
    default:
      return "text-clay-700";
  }
}

export function ScorePanel({ scores, eyebrow = "The economics, scored" }: ScorePanelProps) {
  if (!scores.length) return null;
  return (
    <section aria-labelledby="score-panel-heading">
      <h2
        id="score-panel-heading"
        data-typography="custom"
        className="text-xs font-semibold uppercase tracking-wide text-atlas-700"
      >
        {eyebrow}
      </h2>
      <p className="mt-2 max-w-2xl text-base leading-relaxed text-graphite">
        Each score runs 0 to 100, and higher is always better. They are
        modelled from the costs, margins, and firm mix for this business in
        this place.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {scores.map((s) => (
          <article
            key={s.id}
            className="rounded-lg border border-parchment/70 bg-cream-50 p-5"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-base font-semibold text-ink-900">
                {s.label}
              </h3>
              <p className="flex items-baseline gap-1">
                <span className={`font-serif text-2xl leading-none ${bandText(s.band)}`}>
                  {s.value}
                </span>
                <span className="text-xs text-cocoa-500">/ 100</span>
              </p>
            </div>

            <div
              className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-cream-100"
              role="presentation"
            >
              <div
                className={`h-full rounded-full ${meterFill(s.band)}`}
                style={{ width: `${s.value}%` }}
              />
            </div>

            <p className={`mt-2 text-xs font-semibold capitalize ${bandText(s.band)}`}>
              {bandWord(s.band)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-graphite">
              {s.blurb}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
