/**
 * src/components/board/ScoreStrip.tsx
 *
 * The compact score read for the board hero: one large overall 0..100 figure
 * with a band-toned color, and the four component scores tucked into a
 * disclosure so they are one tap away without crowding the top of the page.
 *
 * Banding is NOT reinvented here, and since 2026-08-17 neither is its colour.
 * The number is mapped to a ScoreBand with bandOf() from the scores domain (the
 * same 80/60/40/20 thresholds the rest of the site uses), and the band drives a
 * token color class out of src/lib/scores/band_tone, which is the ONE place the
 * whole family's colour lives. Higher always reads better, matching every other
 * score surface. A null overall renders MISSING.
 *
 * Server-rendered: the breakdown uses a native <details>/<summary>, so no
 * client JavaScript is needed for the expand/collapse. Tokens only.
 */
import * as React from "react";
import { bandOf, type ScoreBand } from "@/lib/scores";
import { scoreFigureTone, scorePillTone } from "@/lib/scores/band_tone";
import { MISSING } from "./format";

export interface ScoreStripProps {
  overall: number | null;
  parts: { label: string; score: number | null }[];
}

export function ScoreStrip({ overall, parts }: ScoreStripProps) {
  const hasOverall = typeof overall === "number" && Number.isFinite(overall);
  const band = hasOverall ? bandOf(overall as number) : null;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <span
          className={
            hasOverall
              ? `font-display text-3xl font-semibold leading-none tabular-nums ${scoreFigureTone(
                  band as ScoreBand,
                )}`
              : "font-display text-3xl font-semibold leading-none tabular-nums text-cocoa-400"
          }
        >
          {hasOverall ? Math.round(overall as number) : MISSING}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">
          Atlas score
        </span>
      </div>

      {parts.length > 0 ? (
        <details className="group">
          <summary className="inline-flex w-fit cursor-pointer list-none items-center gap-1 rounded-sm text-[11px] font-semibold uppercase tracking-wide text-atlas-700 transition-colors hover:text-atlas-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white [&::-webkit-details-marker]:hidden">
            <span>Score breakdown</span>
            <span
              aria-hidden="true"
              className="text-cocoa-500 transition-transform group-open:rotate-90 motion-reduce:transition-none"
            >
              {">"}
            </span>
          </summary>
          <div className="mt-2 flex flex-wrap gap-2">
            {parts.map((p) => {
              const ok =
                typeof p.score === "number" && Number.isFinite(p.score);
              const pBand = ok ? bandOf(p.score as number) : null;
              return (
                <span
                  key={p.label}
                  className={
                    ok
                      ? `inline-flex items-baseline gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${scorePillTone(
                          pBand as ScoreBand,
                        )}`
                      : "inline-flex items-baseline gap-1.5 rounded-full border border-parchment bg-paper-100 px-2.5 py-1 text-[11px] font-semibold text-cocoa-400"
                  }
                >
                  <span className="uppercase tracking-wide">{p.label}</span>
                  <span className="font-display tabular-nums">
                    {ok ? Math.round(p.score as number) : MISSING}
                  </span>
                </span>
              );
            })}
          </div>
        </details>
      ) : null}
    </div>
  );
}
