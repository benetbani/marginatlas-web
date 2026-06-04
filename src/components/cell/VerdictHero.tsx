/**
 * src/components/cell/VerdictHero.tsx
 *
 * The reformed entity-page hero (bible Section 6, module 1). It answers the
 * page's question with a verdict, not just a number: the H1 stays the
 * search-friendly question, and directly under it sits the opinionated
 * answer, the typical-revenue reality, and the headline Opportunity score.
 *
 * Server component, no client JS. Warm editorial layout: serif display on
 * warm paper, single terracotta accent, generous whitespace. All colour and
 * type come from tokens.
 *
 * Design system: application section. Consumes the score + verdict domain
 * (src/lib/scores). Renders nullable inputs gracefully (a missing score
 * simply drops, never a placeholder).
 */
import * as React from "react";
import { bandWord, type Score, type ScoreBand } from "@/lib/scores";
import type { Verdict } from "@/lib/scores/verdict";

export interface VerdictHeroProps {
  sectorLabel?: string | null;
  /** The page question, kept verbatim as the H1 for search continuity. */
  question: string;
  verdict: Verdict;
  opportunity: Score | null;
  /** Typical (median) annual revenue per firm, in the display currency. */
  typical: number | null;
  p10: number | null;
  p90: number | null;
  /** Currency-aware money formatter supplied by the page. */
  fmt: (n: number) => string;
}

function scoreToneText(band: ScoreBand): string {
  switch (band) {
    case "strong":
      return "text-moss-700";
    case "workable":
      return "text-atlas-700";
    case "mixed":
      return "text-atlas-600";
    case "weak":
      return "text-clay-700";
    default:
      return "text-clay-700";
  }
}

function scoreToneRing(band: ScoreBand): string {
  switch (band) {
    case "strong":
      return "border-moss-300";
    case "workable":
    case "mixed":
      return "border-atlas-200";
    default:
      return "border-clay-300";
  }
}

export function VerdictHero({
  sectorLabel,
  question,
  verdict,
  opportunity,
  typical,
  p10,
  p90,
  fmt,
}: VerdictHeroProps) {
  const hasRange = p10 != null && p90 != null;
  return (
    <section className="border-b border-parchment/60 py-8 sm:py-10">
      <div>
        {sectorLabel ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-atlas-700">
            {sectorLabel}
          </p>
        ) : null}

        <h1 className="font-serif text-3xl leading-tight text-ink-900 sm:text-4xl">
          {question}
        </h1>

        <p className="mt-5 font-serif text-2xl leading-snug text-atlas-700 sm:text-3xl">
          {verdict.headline}.
        </p>

        <div className="mt-4 max-w-2xl space-y-3 text-base leading-relaxed text-graphite">
          <p>{verdict.lead}</p>
          <p>{verdict.close}</p>
        </div>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-10">
          {typical != null ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cocoa-500">
                Typical yearly revenue
              </p>
              <p className="mt-1 font-serif text-3xl text-ink-900">
                {fmt(typical)}
              </p>
              {hasRange ? (
                <p className="mt-1 text-sm text-cocoa-500">
                  most land between {fmt(p10 as number)} and {fmt(p90 as number)}
                </p>
              ) : null}
            </div>
          ) : null}

          {opportunity ? (
            <div
              className={`inline-flex items-center gap-3 self-start rounded-lg border bg-cream-50 px-4 py-3 ${scoreToneRing(
                opportunity.band,
              )}`}
            >
              <span
                className={`font-serif text-4xl leading-none ${scoreToneText(
                  opportunity.band,
                )}`}
              >
                {opportunity.value}
              </span>
              <span className="text-sm leading-tight text-cocoa-700">
                <span className="block font-semibold text-ink-900">
                  Opportunity
                </span>
                <span className="block capitalize">
                  {bandWord(opportunity.band)} out of 100
                </span>
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
