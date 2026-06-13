/**
 * src/lib/scores/band_labels.ts
 *
 * The ONE place the score-band WORDS live (2026-06-13). The internal band keys
 * (forgiving / manageable / demanding / brutal) drive color the same way
 * everywhere, but the founder found the two old vocabularies strange: a business
 * read "Forgiving ... Brutal" while a city read "Excellent ... Difficult", and
 * "Brutal" was jarring. This module replaces both with one plain, calmer scale,
 * and every surface (break-in masthead, city climate, peer cards, the
 * cities-of-country and industries-across panels) reads from here so the words
 * can never drift apart again.
 *
 * Higher band = easier to break in / a better city climate.
 */
import type { BreakInBand } from "./break_in_rating";

/** Business break-in difficulty, plain and calm. Higher band = easier. */
export function breakInWord(band: BreakInBand): string {
  switch (band) {
    case "forgiving":
      return "Easy";
    case "manageable":
      return "Doable";
    case "demanding":
      return "Hard";
    case "brutal":
      return "Very hard";
  }
}

/** City Business Climate Score word. Higher band = a better climate. */
export function climateWord(band: BreakInBand): string {
  switch (band) {
    case "forgiving":
      return "Excellent";
    case "manageable":
      return "Good";
    case "demanding":
      return "Fair";
    case "brutal":
      return "Hard";
  }
}
