/**
 * src/lib/finance/keep_credibility.ts
 *
 * The single definition of "is this modeled owner keep believable", shared by
 * every surface that prints one. One responsibility: judge a keep against the
 * country's own typical full-time pay.
 *
 * WHY THIS MODULE EXISTS. The high-side rule was founder-decided on 2026-08-29
 * and then written twice, as a bare `6` in the country funnel and again in the
 * cell view. Two copies of a ratified constant is the drift the take-home
 * resolver's own header warns about ("centralising it here means the two
 * surfaces can never disagree again"), and the whole point of the rule is that
 * the country page and the trade page cannot reach different verdicts about
 * the same figure. It is defined here once and imported.
 *
 * THE BAND, and why it is not symmetric.
 *
 * HIGH, six times the median wage. Founder-decided, applied as one fixed
 * formula rather than a picked list. A single everyday shop whose modeled keep
 * exceeds six times the country's median full-time pay is a chain's number
 * wearing one shop's name. Six is a generosity bound: a well-run single shop
 * clearing two or three times the median is believable everywhere.
 *
 * LOW, a twentieth of the median wage. Added 2026-08-29 after the all-sizes
 * blend fix, which corrected 531 wrong-high pairs across the country lattice
 * but moved eight from a GUARDED wrong into an UNGUARDED one: their revenue
 * fell to a shared placeholder, so San Marino auto repair printed an owner
 * keeping $1,247 a year against a $42,000 median. Before the fix those pairs
 * read too high and the high screen hid them; after it they read too low and
 * nothing looked. A figure that is wrong and hidden costs a reader nothing; a
 * figure that is wrong and shown is the defect this screen exists to remove,
 * so the low side had to be guarded too.
 *
 * The bound is NOT the mirror of six. Measured over all 1,150 judgeable
 * (country, everyday trade) pairs, a median/6 floor would withhold 323 of them,
 * 28 percent, which would take down a great many keeps that are merely thin
 * rather than wrong. A twentieth withholds 52, 4.5 percent, and catches every
 * one of the eight. It is also the honest reading of the number itself: an
 * owner keeping under five percent of what a typical employee earns is not a
 * thin margin, it is an artifact, because nobody operates a shop for that.
 *
 * WHERE NO MEDIAN IS HELD the screen cannot run and the keep passes with its
 * modeled tag. A screen with no yardstick withholding figures would be
 * guesswork in the other direction.
 *
 * Withholding is the only sanctioned outcome. Nothing here ever substitutes a
 * replacement figure; callers drop the keep and let their surface self-omit.
 *
 * Pure. Constraint-safe: no em-dashes, no source-agency names, USD-only money.
 */

/** A keep above this multiple of the median wage is a chain's number. */
export const KEEP_CREDIBLE_MAX_X_MEDIAN = 6;

/** A keep below this fraction of the median wage is an artifact, not a wage. */
export const KEEP_CREDIBLE_MIN_X_MEDIAN = 1 / 20;

function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}

/**
 * True when `keep` is believable for a single everyday business in a country
 * whose median full-time pay is `medianWageUsd`.
 *
 * Returns true (pass) when the screen cannot run: no keep to judge, or no
 * median to judge it against. Returns false ONLY for a real keep that a held
 * median puts outside the band.
 */
export function isKeepCredible(
  keep: number | null | undefined,
  medianWageUsd: number | null | undefined,
): boolean {
  if (!isNum(keep) || keep <= 0) return true;
  if (!isNum(medianWageUsd) || medianWageUsd <= 0) return true;
  return (
    keep <= medianWageUsd * KEEP_CREDIBLE_MAX_X_MEDIAN &&
    keep >= medianWageUsd * KEEP_CREDIBLE_MIN_X_MEDIAN
  );
}
