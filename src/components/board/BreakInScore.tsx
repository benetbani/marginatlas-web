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
 * Two exports, one shape of truth:
 *   - <BreakInMasthead> is the masthead read: the big band-toned number, the
 *     one-word band, the "break-in rating" caption, and the warm one-line
 *     headline that names the reality and the catch in a breath.
 *   - <BreakInWhy> is the honest breakdown for the "What it takes to open"
 *     section: the payback in plain words ("Breaks even in about X years") and
 *     the three drivers (entry cost, speed to open, room to grow) as small
 *     labelled bars, so the number is never a black box.
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
import type { BreakInRating, BreakInBand } from "@/lib/scores/break_in_rating";
import { breakInWord, climateWord } from "@/lib/scores/band_labels";
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

/**
 * The CITY masthead score, made visible. The city attractiveness score
 * (src/lib/scores/city_attractiveness.ts) is the city-altitude sibling of the
 * break-in rating: a single 0-100 number, higher = a better city to open a small
 * business in. The founder chose that cities carry a headline score while
 * countries and industries do not, so this is the only score the city masthead
 * shows and it reuses the exact band tones and markup of <BreakInMasthead> so the
 * badge reads identically across pages.
 *
 * Takes the already-computed score object (the caller owns the math), so this is
 * pure presentation. Renders nothing when the caller has no score (a thin city
 * with no demand signal omits the badge gracefully rather than showing a dash).
 */
export function CityScoreMasthead({
  score,
}: {
  score: { score: number; band: BreakInBand } | null;
}) {
  if (!score) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <span className="flex items-baseline gap-0.5">
        <span
          className={`font-display text-4xl font-semibold leading-none tabular-nums md:text-5xl ${bandFigureTone(
            score.band,
          )}`}
        >
          {score.score}
        </span>
        <span className="font-display text-xl font-semibold leading-none tabular-nums text-cocoa-500 md:text-2xl">
          /100
        </span>
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">
          Business Climate Score
        </span>
        <span
          className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${bandPillTone(
            score.band,
          )}`}
        >
          {climateWord(score.band)}
        </span>
      </span>
    </div>
  );
}

/** One driver row: a plain label, a token-toned bar filled to the sub-score. */
function DriverBar({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  // The sub-scores are already 0..100; clamp defensively so a bar can never
  // overrun its track or read negative.
  const pct = Math.max(0, Math.min(100, Math.round(score)));
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] uppercase tracking-wide text-cocoa-500">
          {label}
        </span>
        <span className="font-display text-[13px] font-semibold tabular-nums text-ink-900">
          {pct}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-100">
        <div
          className="h-full rounded-full bg-atlas-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Round a payback in years to a warm, plain phrase. Under a year reads in
 * months so a fast payback does not print "0.4 years"; a year or more reads in
 * years to one natural decimal. No em-dashes.
 */
function paybackPhrase(years: number): string {
  if (!Number.isFinite(years) || years <= 0) {
    return "Breaks even quickly on these numbers.";
  }
  if (years < 1) {
    const months = Math.max(1, Math.round(years * 12));
    return months === 1
      ? "Breaks even in about a month on these numbers."
      : `Breaks even in about ${months} months on these numbers.`;
  }
  const rounded = Math.round(years * 10) / 10;
  const figure = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `Breaks even in about ${figure} years on these numbers.`;
}

/**
 * The "why this score" breakdown, folded into the opening section. The payback
 * line gives the dominant driver in plain words, then the three sub-scores
 * (entry cost, speed to open, room to grow) sit as small labelled bars so the
 * reader sees what moved the number. When the rating rests on modeled inputs the
 * same quiet "modeled" footnote the board uses marks it. Renders nothing when
 * there is no rating, so the section degrades cleanly.
 */
export function BreakInWhy({ rating }: { rating: BreakInRating | null }) {
  if (!rating) return null;
  const { paybackScore, speedScore, roomScore } = rating.components;
  return (
    // Canonical surface: was "rounded-lg border border-parchment bg-cream-50".
    <div className="atlas-card mt-5 p-4 md:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-500">
          Why this rating
        </span>
        <span className="text-sm text-cocoa-700">{paybackPhrase(rating.paybackYears)}</span>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-3">
        <DriverBar label="Entry cost" score={paybackScore} />
        <DriverBar label="Speed to open" score={speedScore} />
        <DriverBar label="Room to grow" score={roomScore} />
      </div>
      {rating.restsOnModeled ? (
        <p className="mt-3 text-[11px] text-cocoa-500">
          The entry cost and crowding here lean on modeled estimates, so read the
          rating as directional.
        </p>
      ) : null}
    </div>
  );
}
