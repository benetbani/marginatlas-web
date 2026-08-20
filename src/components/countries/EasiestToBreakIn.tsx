/**
 * src/components/countries/EasiestToBreakIn.tsx
 *
 * The place-level "easiest businesses to break into here" panel. It is the flip
 * side of the across-cities comparison: that surface fixes one business and ranks
 * places; this one fixes one place (a country or a city) and ranks the place's
 * own businesses by the single break-in rating (0..100, higher = easier to break
 * in and win). A buyer who lands on a place sees, at a glance, which activities
 * here are the friendliest to get started in.
 *
 * Every score is the SAME number that business's own cell masthead shows: the
 * rows are computed in the place board builder (buildEasiestToBreakIn) for the
 * exact cell each row links to, through the same break-in path the masthead uses,
 * so the badge here and the badge on that cell page agree. The badge tone comes
 * from src/lib/scores/band_tone, which is the ONE place the whole family's colour
 * lives, so a reader who has learned the scale reads it here for free. This file
 * used to carry its own copy of that switch, as four siblings did.
 *
 * Server component, no client JS. Tokens only, mobile-first, warm only in the one
 * short lead line. Renders nothing when the caller passes fewer than a few rows
 * (the builder already self-omits a thin ranking), so the page degrades cleanly.
 *
 * Design system: application section. Consumes the place-board domain
 * (EasiestBreakInRow from src/lib/scores/country_board). It renders no
 * <section id=> of its own; the caller wraps it in the page's section slot.
 *
 * Constraint-safe: no em-dashes, no source-agency names, USD-only, no raw hex.
 */
import * as React from "react";
import Link from "next/link";
import type { EasiestBreakInRow } from "@/lib/scores/country_board";
import { breakInWord } from "@/lib/scores/band_labels";
import { bandPillTone } from "@/lib/scores/band_tone";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export interface EasiestToBreakInProps {
  /** The ranked rows, easiest first (already sorted + filtered by the builder). */
  rows: EasiestBreakInRow[];
  /** The place name for the warm lead line ("...in Germany"). */
  placeName: string;
  /** How many rows to show. The scannable top set; defaults to 8. */
  limit?: number;
  /**
   * Whether to print the numeric 0..100 badge. When the panel rests only on
   * modeled archetypes (no trusted-local cell grounds any row), the score is
   * effectively country-invariant (Software 97 / Marketing 95 / Legal 94 came up
   * identically on Uganda, Nepal, the UK and the Netherlands), so we show the
   * ranking ORDER and the ease tone but withhold the false-precise number. The
   * caller sets this true only when at least one row is a trusted-local read.
   */
  showScores?: boolean;
}

/**
 * The panel. A short warm lead, then a scannable set of the place's businesses
 * ranked easiest first: each row is the business name, its band-toned break-in
 * badge (the masthead score), and a quiet link to that business's full read in
 * this place. Rows whose cell has a trusted-local cost-to-open page also show a
 * quiet "Cost to open" link one tap away; rows backed by an aggregate cell (whose
 * /opening would notFound()) omit it. Renders nothing when there are too few rows
 * to rank honestly.
 */
export function EasiestToBreakIn({
  rows,
  placeName,
  limit = 8,
  showScores = true,
}: EasiestToBreakInProps) {
  if (!rows || rows.length < 3) return null;
  const shown = rows.slice(0, Math.max(3, limit));

  /* THE BADGE WAS A TAUTOLOGY AND IT LOOKED LIKE DATA. Founder, 2026-08-21:
     "you are just slapping an Easy on all of them, which makes the whole thing
     disgusting. Those cards have no character whatsoever."

     He is describing a structural defect, not a style one. This section selects
     the EASIEST businesses and then prints each one's difficulty band. The top
     of an easiest-first ranking is all in the top band by construction, so the
     badge could only ever read "Easy", eight times, on a page whose heading
     already says these are the easy ones. It carried no information at all.

     Worse, the number that DOES vary was hidden. `showScores` was passed as
     "does this row have a working link", so a real score was withheld because a
     LINK was broken, which is a category error: the score is a score whether or
     not the page it points at resolves.

     So the score always shows, and the word only appears when the rows on screen
     actually span more than one band, which is the only time it distinguishes
     anything. */
  const bandsShown = new Set(shown.map((r) => r.band));
  const wordCarriesInformation = bandsShown.size > 1;

  return (
    <div>
      <SectionEyebrow className="mb-2">Easiest to break in</SectionEyebrow>
      {/* The site's section-heading step. This was text-xl md:text-2xl with no
          font-display and font-semibold, so it was the one heading on the
          country and region pages set in the body sans and a weight heavier
          than every heading around it. */}
      <h2 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900">
        Where it is easiest to get started in {placeName}
      </h2>
      {/* useless-tile-ok: describes the break-in ranking, not a count of things we cover */}
      {/* CUT, 2026-08-17, 54 and 38 words down to 23 and 13. Both ledes opened
          by saying the heading again: "ranked by ... how easy it is to break in
          and win" and "ordered from easiest to hardest to break into and win"
          under a heading reading "Where it is easiest to get started in X",
          under an eyebrow reading "Easiest to break in". Both closed by
          instructing the reader to open a card, which every card already says
          on its own face ("See the full read", and "Cost to open" beside it).
          What is kept is the only part a reader cannot see: which direction the
          0 to 100 scale runs, that the badge is the same number the business
          carries on its own page, and, when no row is grounded in a local read,
          that the ranking rests on a modeled pattern. */}
      {/* THE SCALE IS ALWAYS STATED NOW, and it was not before. This sentence
          branched on `showScores`, so on any page where the scores were hidden
          the reader was never told what scale the ranking ran on. Now that every
          card carries its number, "97" without "out of 100, higher is easier" is
          the same defect one level down: a bare figure a reader cannot size.

          Stated ONCE here rather than as "/100" on all eight badges, because
          eight repetitions of the same three characters is the text bloat the
          founder is objecting to, not a fix for it. The modeled caveat is kept
          and appended when no row rests on a local read, since that is a
          different fact and still true. */}
      <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-graphite">
        {showScores
          ? "Scored 0 to 100, higher is easier to start. Each score is the one that business carries on its own page."
          : "Scored 0 to 100, higher is easier to start. Ordered on the modeled pattern for each trade, not on a local read."}
      </p>

      {/* TWO UP ON A PHONE, NOT ONE. Founder, 2026-08-21: "in mobile the look is
          always stacked with one card after another where there is a good
          opportunity that we can put two cards in the same row."

          THE BREAKPOINT WAS THE BUG, not the intent. This already went two-up,
          but at `sm:`, which is 640px. Phones are 375 to 430. So the two-column
          layout existed and **no phone ever reached it**: measured at 375, this
          grid ran 8 cards down one column, 597px tall. Two-up halves that.

          "SEE THE FULL READ" IS GONE, and that is what makes two-up fit. It sat
          under every trade name, 4 words x 8 cards = 32 words that say nothing:
          the whole card is a link, so it described the affordance the card
          already has. Founder, same message: "too much text, too little
          graphics, and they don't help each other at all." With it gone the name
          and the score pill sit on one line and a 172px column is enough. */}
      <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {shown.map((r) => (
          <li key={r.industryId}>
            <Link
              href={r.href}
              /* THE NAME WRAPS, IT DOES NOT TRUNCATE, and the pill drops below it
                 on a phone. First attempt at two-up kept the name and the pill on
                 one line and the names became "Softw...", "Legal ...", "Docto...",
                 which is shorter AND useless: it bought height by spending the one
                 thing the card is for. In a 172px column the trade name gets the
                 whole width and up to two lines, and the band pill sits under it. */
              className="atlas-card flex h-full flex-col items-start gap-1.5 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4"
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-snug text-ink-900 [overflow-wrap:anywhere] sm:truncate">
                  {r.industryName}
                </span>
              </span>
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${bandPillTone(
                  r.band,
                )}`}
              >
                <span className="tabular-nums">{r.score}</span>
                {wordCarriesInformation ? <span>{breakInWord(r.band)}</span> : null}
              </span>
            </Link>
            {r.openingHref && (
              <Link
                href={r.openingHref}
                className="mt-1 inline-flex items-center text-[11px] font-medium text-cocoa-500 transition-colors hover:text-atlas-700"
              >
                Cost to open
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
