/**
 * src/lib/spine/internal_words.ts
 *
 * A PIPELINE'S WORD IS NOT A READER'S, said once (truth-fixes round 3B, 2026-10-11; read again in the final fixes of 2026-10-12, the review of round 3B, M7).
 * A source line is authored in the data and reaches a reader with nothing in between, and the data holds the pipeline's own names for things
 * ("wave5_extrapolation" in the extrapolated rows' source column). This module is the reading the sanitiser (sanitiseProvenance, src/lib/spine/adapt_cell.ts) cuts by,
 * and the reading the plain-copy check's INTERNAL rule (scripts/harness/check_copy_plain.mjs, which reads the rendered page in a browser) holds the page to. They are two
 * implementations of one sentence, because that check runs in a browser page and cannot import this file; tests/spine/trade_head.test.ts runs both over the same words, so
 * they cannot part, and both read the one allowance list.
 *
 * THE READING. A word is a run of letters (of any script), digits and underscores. A word is a pipeline's, and no reader's, when it is made of A to Z, a to z, digits and
 * underscores only (no pipeline names itself in another alphabet: "Zürich2" is a reader's, and read in ASCII alone it was "rich2") AND it holds an underscore
 * (wave5_extrapolation, cafes_coffee) or two or more letters run straight into a digit (wave5, NUTS2, UKI3, EL30) and is not on the allowance list. One letter before the
 * digit is a reader's: "v3" in "Open Government Licence v3.0", "Q4", "H1".
 *
 * THE ALLOWANCE LIST is src/lib/spine/reader_words.json: each word with the reason it is a reader's (UK postcode districts, CO2, MP3, FY24, Web3). It is exact, case and
 * all, and it excuses the letters-into-digits clause only: no reader says an underscore word. The plain-copy check reads the same file.
 *
 * BLIND SPOT, stated: a list names the words someone thought of. A reader's word on no list (a postcode district it does not name) is cut by the sanitiser, so its source part
 * goes, and is red in the check, loudly, with the remedy to name it, with its reason, in reader_words.json. And a pipeline's name that is also a listed word would pass
 * (none is today).
 */
import readerWordsJson from "./reader_words.json";

/** A reader's word that runs letters into digits, and the reason it is one. */
export type ReaderWord = { word: string; reason: string };

export const READER_WORDS: readonly ReaderWord[] = readerWordsJson;

const READER_SET: ReadonlySet<string> = new Set(READER_WORDS.map((e) => e.word));

/** The words of a text: runs of letters (of any script), digits and underscores. */
export function wordsOf(text: string): string[] {
  return text.match(/[\p{L}\p{N}_]+/gu) ?? [];
}

/** Is this one word a pipeline's? See the header for the reading. */
export function isInternalWord(word: string): boolean {
  if (!/^[A-Za-z0-9_]+$/.test(word)) return false;
  return word.includes("_") || (/[A-Za-z]{2,}\d/.test(word) && !READER_SET.has(word));
}

/** The pipeline's words in a text, in order, repeats kept. */
export function internalWordsIn(text: string): string[] {
  return wordsOf(text).filter(isInternalWord);
}
