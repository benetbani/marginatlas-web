/**
 * src/components/board/BoardHero.tsx
 *
 * The board's masthead. Deliberately quieter and shorter than the cell page's
 * VerdictHero: a plain left-aligned H1, a compact row carrying the ScoreStrip
 * and an optional switcher (country / size selector), and nothing else. No
 * verdict sentence, no entrance animation. The point is to get the data board
 * itself above the fold, so the hero earns as little vertical space as it can.
 *
 * Server component. Tokens only, mobile-first. The score and switcher are both
 * optional, so the hero degrades to just a title when either is absent.
 */
import * as React from "react";
import { ScoreStrip } from "./ScoreStrip";

export interface BoardHeroProps {
  title: string;
  score?: {
    overall: number | null;
    parts: { label: string; score: number | null }[];
  };
  /** Optional control slot (e.g. a country or business-size switcher). */
  switcher?: React.ReactNode;
}

export function BoardHero({ title, score, switcher }: BoardHeroProps) {
  return (
    <header className="pb-3 pt-6">
      <h1 className="text-balance font-display text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">
        {title}
      </h1>

      {score || switcher ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          {score ? (
            <ScoreStrip overall={score.overall} parts={score.parts} />
          ) : (
            <span />
          )}
          {switcher ? <div className="shrink-0">{switcher}</div> : null}
        </div>
      ) : null}
    </header>
  );
}
