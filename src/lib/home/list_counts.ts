/**
 * src/lib/home/list_counts.ts
 *
 * A COUNT OF THE SITE'S OWN LISTS, IN FIGURES OR IN WORDS (his ruling of 2026-10-07: no country, city or trade-list count on the home;
 * plan docs/superpowers/plans/2026-10-13-home-quiet-editorial.md, Task 1C). One reader of the words for the home's no-counts law
 * (tests/home/no_counts.test.ts, over the render) and for the contents' reading department (src/lib/home/contents.ts), which passes over a
 * post whose title holds one, so a new post can never put a count on the home.
 *
 * A count is a number, as digits ("195", "1,234", "40+") or as words ("five", "thirty-eight", "hundreds", "a dozen"), then at most one
 * word, then one of the site's list nouns below.
 * ITS BLIND SPOT, stated before it is trusted: a count with two words or more between its number and its noun ("195 of the world's
 * countries"), a bare total ("all 138"), a singular noun ("one country") and a count drawn as a mark are not seen.
 */
const NOUNS = ["countries", "cities", "trades", "businesses", "industries", "activities", "places", "pages", "districts", "neighbourhoods", "neighborhoods", "boroughs", "regions", "sectors", "markets", "economies", "sources", "datasets", "benchmarks", "records"];
const UNITS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const NUMBER = [
  "\\d[\\d,.]*",
  `(?:${TENS.join("|")})(?:-(?:${UNITS.slice(0, 9).join("|")}))?`,
  UNITS.join("|"),
  "hundreds?",
  "thousands?",
  "millions?",
  "dozens?",
  "scores",
].join("|");

/** A number, at most one word, then a list noun; global and blind to case. */
export const LIST_COUNT_RE = new RegExp(`\\b(?:${NUMBER})\\+?\\s+(?:[A-Za-z\\u2019'-]+\\s+)?(?:${NOUNS.join("|")})\\b`, "gi");

/** Every count in a text, as written (runs of space read as one). */
export function listCounts(text: string): string[] {
  return [...String(text ?? "").replace(/\s+/g, " ").matchAll(LIST_COUNT_RE)].map((m) => m[0]);
}

/** Whether a text holds a count. */
export function holdsListCount(text: string): boolean {
  return listCounts(text).length > 0;
}
