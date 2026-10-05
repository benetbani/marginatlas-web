/**
 * src/components/board/BreakInScore.tsx
 *
 * The board's ONE headline score, made visible. The break-in rating
 * (src/lib/scores/break_in_rating.ts) is a single 0-100 number, higher = easier
 * to break in and win, and this is the only score the cell masthead shows, so a
 * reader learns one scale and reads it everywhere. It replaces the older
 * multi-part "Atlas score" strip on the masthead, so the top of the page is
 * never two competing scores.
 *
 * <BreakInMasthead> is the masthead read: the big band-toned number, the
 * one-word band, the "break-in rating" caption, and the warm one-line headline.
 * Only the legacy cell board (BoardHero, the cell route's branch with the spine
 * off) still draws it. Two exports left on 2026-10-05 (his ruling 11, "no
 * composite, ever"; masterplan step 02): <BreakInWhy>, the rating's three
 * sub-scores as bars on the opening page, and <CityScoreMasthead>, a "Business
 * Climate Score" out of 100 that no page imported.
 *
 * Both take the already-computed BreakInRating object (the caller owns the
 * math), so this file is pure presentation. Banding drives a token color out of
 * src/lib/scores/band_tone, the one place the whole family's colour lives:
 * terracotta at the favourable end draining to a cool neutral at the hard end,
 * with the band word carrying the ordinal. It used to carry its own copy of that
 * switch, in the moss / atlas / clay scale the palette ruling retired.
 *
 * Server-rendered. Tokens only, mobile-first, no raw hex, no em-dashes, no
 * source-agency names.
 */
import * as React from "react";
import type { BreakInRating } from "@/lib/scores/break_in_rating";
import { breakInWord } from "@/lib/scores/band_labels";
import { bandFigureTone, bandPillTone } from "@/lib/scores/band_tone";

/**
 * The masthead score. A large band-toned figure, the band word as a quiet pill,
 * the "break-in rating" caption, and the warm headline underneath. This is the
 * single headline score for the cell; render nothing when the caller has no
 * rating (the page omits the score gracefully rather than showing a placeholder).
 */
export function BreakInMasthead({
  rating,
  showHeadline = true,
}: {
  rating: BreakInRating | null;
  /**
   * Whether to print the warm one-line headline under the score. Default true
   * (the cell masthead). The opening page carries the same line as its own
   * full-width verdict, so it passes false here to avoid showing it twice.
   */
  showHeadline?: boolean;
}) {
  if (!rating) return null;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <span
          className={`font-display text-4xl font-semibold leading-none tabular-nums md:text-5xl ${bandFigureTone(
            rating.band,
          )}`}
        >
          {rating.score}
        </span>
        <span className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">
            Break-in rating
          </span>
          <span
            className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${bandPillTone(
              rating.band,
            )}`}
          >
            {breakInWord(rating.band)}
          </span>
        </span>
      </div>
      {showHeadline ? (
        <p className="max-w-xl text-sm leading-relaxed text-cocoa-700">
          {rating.headline}
        </p>
      ) : null}
    </div>
  );
}
