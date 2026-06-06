/**
 * src/components/board/BoardHero.tsx
 *
 * The board's masthead. Deliberately quieter and shorter than the cell page's
 * VerdictHero: a plain left-aligned H1, a compact row carrying the headline
 * score and an optional switcher (country / size selector), and nothing else. No
 * verdict sentence, no entrance animation. The point is to get the data board
 * itself above the fold, so the hero earns as little vertical space as it can.
 *
 * The masthead carries exactly ONE headline score. On a cell page that is the
 * break-in rating (the single 0-100 "how easy is it to break in and win"
 * number), passed as `breakIn`; it renders <BreakInMasthead> and is the only
 * score shown, so the top of the page is never two competing scores. The older
 * `score` prop (the multi-part ScoreStrip) stays only for the other board
 * surfaces (city / industry / country mastheads) that still pass it; when both
 * are absent the hero degrades to just the title.
 *
 * Server component. Tokens only, mobile-first.
 */
import * as React from "react";
import { ScoreStrip } from "./ScoreStrip";
import { BreakInMasthead } from "./BreakInScore";
import type { BreakInRating } from "@/lib/scores/break_in_rating";

export interface BoardHeroProps {
  title: string;
  /**
   * The single headline break-in rating for a cell masthead, or null to omit
   * the score gracefully. When present this is the ONLY score shown, taking
   * precedence over the legacy `score` strip.
   */
  breakIn?: BreakInRating | null;
  /**
   * Legacy multi-part score strip, kept for the non-cell board mastheads that
   * still pass it. Ignored when `breakIn` is supplied so there is never a second
   * competing score.
   */
  score?: {
    overall: number | null;
    parts: { label: string; score: number | null }[];
  };
  /** Optional control slot (e.g. a country or business-size switcher). */
  switcher?: React.ReactNode;
}

export function BoardHero({ title, breakIn, score, switcher }: BoardHeroProps) {
  // The break-in rating is the single headline score where it is supplied; the
  // legacy strip only shows on surfaces that have no break-in rating, so the two
  // never appear together.
  const showBreakIn = breakIn != null;
  const showScore = !showBreakIn && score != null;

  return (
    <header className="pb-3 pt-6">
      <h1 className="text-balance font-display text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">
        {title}
      </h1>

      {showBreakIn || showScore || switcher ? (
        <div className="mt-3 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          {showBreakIn ? (
            <BreakInMasthead rating={breakIn} />
          ) : showScore ? (
            <ScoreStrip overall={score!.overall} parts={score!.parts} />
          ) : (
            <span />
          )}
          {switcher ? <div className="shrink-0">{switcher}</div> : null}
        </div>
      ) : null}
    </header>
  );
}
