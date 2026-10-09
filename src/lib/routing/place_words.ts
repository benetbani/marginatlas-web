/**
 * src/lib/routing/place_words.ts
 *
 * A PLACE THE SITE HOLDS, BY ITS WORD (P1-A of the page architecture, 2026-10-09). The middle part of /{country}/{place}/{trade}
 * names a place only when one of the site's tables holds the word: the country's own code and its name (/jp/japan), its curated
 * default region (the home form's destination), its regions, its listed cities and the label addresses their links spell
 * (/de/frankfurt-am-main, /de/oberbayern), every city, district and state alias the cell route reads, the places the trade routes
 * prerender, and the county, city and region ids the database holds (src/lib/routing/place_slugs_generated.ts, written by
 * scripts/gen_place_slugs.ts). Pure and small enough for the edge: one generated table, read for its own entries (src/lib/own.ts).
 *
 * THE WORD IS THE ROUTE'S, NOT THE REQUEST'S (the review of 2026-10-09). The pathname the middleware reads is percent-encoded
 * (`/br/s%c3%a3o-paulo/restaurants`), the table spells the six accented places as the route receives them, decoded (the accented
 * keys of src/lib/geo/popular_place_overrides.json), and Next's route matcher decodes a dynamic segment before it reaches the page.
 * Every reader of an address here goes through routeWord, so a word is compared as its route reads it.
 */
import { COUNTRIES } from "@/lib/taxonomy";
import { TOP_LEVEL_SEGMENTS } from "@/lib/routing/top_level_segments";
import { PLACE_SLUGS_BY_COUNTRY } from "@/lib/routing/place_slugs_generated";
import { namesFile } from "@/lib/routing/names_file";
import { own } from "@/lib/own";

const HELD_COUNTRIES = new Set(COUNTRIES.map((c) => c.code.toLowerCase()));
/** The words of each code the table holds, built once on first use. Only a code the table holds is ever cached (its rows are the
 *  countries the site holds and the statistics codes it keeps, EL and UK among them), so the map stays as small as the table
 *  even when a caller passes a word from a request. */
const WORDS = new Map<string, ReadonlySet<string>>();
const NO_WORDS: ReadonlySet<string> = new Set();

/** Every place word the table holds for a code (its lowercase code): a country the site holds, or one of the statistics codes the
 *  table also keeps for the regions its trade pages are published under (EL for Greece, which the site holds as GR); empty, and
 *  never cached, for any other word. */
export function placeWordsFor(country: string): ReadonlySet<string> {
  const cc = String(country ?? "").toLowerCase();
  const cached = WORDS.get(cc);
  if (cached) return cached;
  const row = own(PLACE_SLUGS_BY_COUNTRY, cc);
  if (!row) return NO_WORDS;
  const words = new Set(row);
  WORDS.set(cc, words);
  return words;
}

/** One part of an address as its route reads it: percent-decoded, then lowercased (in that order, so a decoded capital such as
 *  `%C3%83`, a capital A with a tilde, is lowercased too). A malformed escape (`%e0%a4%a`, a cut-off byte sequence) makes
 *  decodeURIComponent throw, and the part is kept as written: no table holds it, so it names nothing, and the middleware answers
 *  404 instead of failing. The dot test is not this function's: it reads the last part as written (names_file.ts), so an encoded
 *  dot is no file's ending. */
export function routeWord(part: string): string {
  let word = String(part ?? "");
  try {
    word = decodeURIComponent(word);
  } catch {
    /* a malformed escape: the part as written */
  }
  return word.toLowerCase();
}

/** True when a table of the site holds the word as a place of the country. The word is the route's (routeWord), decoded once: an
 *  address part still in its percent-encoded form is not a word any table holds. */
export function isHeldPlace(country: string, place: string): boolean {
  return placeWordsFor(country).has(String(place ?? "").toLowerCase());
}

/** True for a three- or four-part address under a country the site holds whose place no table holds: the trade pages, their
 *  /opening and /buy-or-start pages and the district trade pages of a place that does not exist. Each part is read as its route
 *  reads it (routeWord). A dotted address is the file rule's (src/lib/routing/edge_not_found.ts). */
export function placeNotHeldIn(path: string): boolean {
  if (namesFile(path)) return false;
  const segs = String(path ?? "").split("/").filter(Boolean).map(routeWord);
  if (segs.length < 3 || segs.length > 4) return false;
  const [country, place] = segs;
  if (!HELD_COUNTRIES.has(country) || TOP_LEVEL_SEGMENTS.has(country)) return false;
  return !isHeldPlace(country, place);
}
