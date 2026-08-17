/**
 * src/lib/scores/band_tone.ts
 *
 * The ONE place the score-band COLOUR lives, the way band_labels.ts is the one
 * place the band WORDS live.
 *
 * WHY THIS FILE EXISTS. The words were centralised in 2026-06-13 and the colour
 * was not, so eight components each carried their own copy of the same switch.
 * They agreed only because somebody kept pasting the same three lines, and the
 * comment at the top of five of them said so out loud: "the EXACT moss / atlas /
 * clay scale the break-in masthead uses". A scale duplicated eight times is a
 * scale that will diverge the first time one copy is edited, and converting one
 * copy alone would have made the same 0..100 score render one colour on a cell
 * masthead and another on the country page beside it.
 *
 * WHAT CHANGED, 2026-08-17. The old scale ran moss (green) at the favourable
 * end, atlas through the middle, clay at the hard end. Green is banned outright:
 * founder, 2026-08-09, asked directly and answered "no exceptions", terracotta
 * plus cool neutrals only. verify_palette_membership records the same ruling in
 * its own header and states the replacement in one line: "Show good-versus-bad
 * with intensity and position instead of hue."
 *
 * THE MAPPING, and it is intensity rather than hue. One colour, terracotta,
 * draining to a cool neutral as the read gets worse:
 *
 *     step 4  best      terracotta, tinted    the loud end, the brand accent
 *     step 3            terracotta, faint     the same hue, most of it drained
 *     step 2            neutral hairline      no accent left
 *     step 1  worst     neutral, stern rule   a heavier rule, still no hue
 *
 * THE SIGNAL IS NOT DELETED, AND IT IS FINER THAN IT WAS. Every surface in this
 * family prints the band WORD from band_labels ("Easy", "Doable", "Hard", "Very
 * hard", or the climate equivalent) and most print the 0..100 figure beside it,
 * so the ordinal was never carried by colour alone. The four bands used to
 * collapse onto THREE tones, because manageable and demanding shared the atlas
 * step in all five copies. They now resolve to four. A reader who could tell
 * Doable from Hard only by reading the word can now tell them apart by weight
 * too.
 *
 * WHAT IT CANNOT DO: a class string is not a pixel. This module fixes what a
 * component asks for; whether the badge is legible on the surface it lands on is
 * a render question and is checked there.
 *
 * Pure module: strings only, no imports beyond the band types, so it cannot trip
 * the layering gate and is trivially testable.
 */
import type { BreakInBand } from "./break_in_rating";
import type { ScoreBand } from "./index";

/**
 * The four steps of the shared scale, worst first so the index reads as rank.
 * Everything else in this file is a projection of this ladder onto one shape of
 * element, which is what keeps a badge, a chip and a figure in agreement.
 */
export type EaseStep = 0 | 1 | 2 | 3;

/**
 * A bordered pill: the break-in badge, the masthead band pill, the peer badge,
 * the across-cities badge. Border plus text always; a tint only at the two
 * favourable steps, so the hard end reads as an outline rather than a second
 * colour.
 *
 * NO BACKGROUND AT THE NEUTRAL STEPS, deliberately. These pills sit inside
 * `.atlas-card`, whose surface is translucent so the founder's photograph reads
 * through it. A `bg-white` pill on that card is a brighter patch rather than a
 * quieter one, which would invert the emphasis the ladder is trying to build.
 */
const PILL: Record<EaseStep, string> = {
  3: "border-atlas-300 bg-atlas-100/60 text-atlas-700",
  2: "border-atlas-200 bg-atlas-50/60 text-atlas-700",
  1: "border-parchment text-graphite",
  0: "border-cocoa-500 text-cocoa-900",
};

/**
 * A borderless filled chip: the kit's MeaningChip, which is the table-cell form
 * of the same scale (the city page maps BreakInBand straight onto it). A chip
 * with no border has only its fill to stand on, so this projection keeps a fill
 * at every step rather than draining to nothing the way PILL does. The neutral
 * grey at the hard end is `parchment`, a true neutral at s=0, so the drain is
 * from terracotta to no hue at all rather than from one hue to another.
 */
const CHIP: Record<EaseStep, { wrap: string; dot: string }> = {
  3: { wrap: "bg-atlas-100 text-atlas-700", dot: "bg-atlas-500" },
  2: { wrap: "bg-atlas-50 text-atlas-700", dot: "bg-atlas-300" },
  1: { wrap: "bg-parchment text-ink-900", dot: "bg-cocoa-500" },
  0: { wrap: "bg-parchment text-ink-900", dot: "bg-ink-900" },
};

/**
 * A large figure standing on its own (the masthead score, the atlas score).
 *
 * TWO STEPS, NOT FOUR, and the reason is that the figure IS the reading. A
 * numeral printed at 4xl already carries its own precision; tinting it four ways
 * asks colour to restate what the digits say. The accent marks the favourable
 * half and ink carries the rest, with the band pill beside it holding the full
 * four-step ladder. The old scale had three steps here for the same reason it
 * had three everywhere: two bands shared a tone.
 */
const FIGURE: Record<EaseStep, string> = {
  3: "text-atlas-700",
  2: "text-atlas-700",
  1: "text-ink-900",
  0: "text-ink-900",
};

/** Break-in difficulty. Higher band = easier to break in = further up the ladder. */
export function breakInStep(band: BreakInBand): EaseStep {
  switch (band) {
    case "forgiving":
      return 3;
    case "manageable":
      return 2;
    case "demanding":
      return 1;
    case "brutal":
      return 0;
  }
}

/** The 0..100 score bands from src/lib/scores. Five bands onto the four steps. */
export function scoreBandStep(band: ScoreBand): EaseStep {
  switch (band) {
    case "strong":
      return 3;
    case "workable":
      return 2;
    case "mixed":
      return 1;
    case "weak":
    case "avoid":
      return 0;
  }
}

/** Pill classes for a break-in / climate band. */
export function bandPillTone(band: BreakInBand): string {
  return PILL[breakInStep(band)];
}

/** Standalone-figure colour for a break-in / climate band. */
export function bandFigureTone(band: BreakInBand): string {
  return FIGURE[breakInStep(band)];
}

/** Pill classes for a 0..100 score band. */
export function scorePillTone(band: ScoreBand): string {
  return PILL[scoreBandStep(band)];
}

/** Standalone-figure colour for a 0..100 score band. */
export function scoreFigureTone(band: ScoreBand): string {
  return FIGURE[scoreBandStep(band)];
}

/** The ladder itself, for surfaces that already hold a step rather than a band. */
export function stepPillTone(step: EaseStep): string {
  return PILL[step];
}

/** The chip projection, for surfaces that already hold a step rather than a band. */
export function stepChipTone(step: EaseStep): { wrap: string; dot: string } {
  return CHIP[step];
}
