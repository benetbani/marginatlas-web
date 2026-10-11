/**
 * src/lib/cells/place_name.ts
 *
 * WHAT A TRADE PAGE CALLS ITS PLACE WHEN THE LOOKUP HELD NO ROW FOR IT (truth-fixes round 1, 2026-10-11; QUEUE uk:place-title-fallback).
 * /gb/boston/restaurants was titled "How much do restaurants earn in GB?" on production. getCellBySlug answers a place word that no
 * regional row holds with its country's extrapolated row (src/lib/cells.ts), and that row's name column carries the country's own code in
 * 47 of 195 countries (read over the restaurants rows on 2026-10-11: GB, DE, FR, IT, JP and 42 more), so `cell.geo_name` was "GB" and the
 * head, the breadcrumb and the share card printed it. The cityOfCountry guard (80b8dad8) is why /gb/boston no longer reads Boston,
 * Massachusetts. It never named anything, and what the page prints is this.
 *
 * placeNameOf is the one reading of that name, for the head (generateMetadata), the seed (loadCellView, so every crumb and card) and the
 * share card: the cell's own name when it is a name; when it is the country's own code, the place word as the site's own tables spell it
 * (geoNameFromSlug for the word, else the label whose slug the place table holds as this word: its words are the slugs of the labels its
 * sources hold, scripts/gen_place_slugs.ts), the country's name for the country's own word and for a word no label spells; never a bare
 * code. A cell with no name at all answers null, and the caller's own fallback stands (the head's raw word, the seed's country).
 * Every figure of such a page is the trade's typical (the copy half, fe2e3ac7), so naming the place claims no local data.
 *
 * NOTHING HERE SPELLS A WORD FROM ITS LETTERS. "king-s-lynn-and-west-norfolk" is "King's Lynn and West Norfolk" because a region table
 * holds that label and its slug is that word; a word whose slug no label holds ("gb-e06000004", "ukk1") names the country.
 * BLIND SPOTS, stated: this cannot tell a place the site holds no label for from one it holds under another word, and a word that is the
 * slug of two labels takes the first the table lists. A statistics code the country list does not hold (UK, EL) has no country name to
 * give, so a bare code there stays what the page printed (uk:statistics-code-uk-pages, the final review's I-2, is that page's own question).
 */
import { iso2ToIso3, iso2ToName } from "@/lib/countries";
import { geoNameFromSlug, slugify } from "@/lib/cells/geo";
import { placeWordsFor } from "@/lib/routing/place_words";

/** The labels of a held country's place words, by the word each label spells; built once per country on first use. A Map, so a word from
 *  an address ("constructor") is a key like any other (src/lib/own.ts is for plain objects). */
const SPELLED = new Map<string, ReadonlyMap<string, string>>();

/** True when a name is the country's own code, in either of its forms (GB, GBR): the one name a page never prints. */
function isBareCode(name: string, iso2: string): boolean {
  const n = name.trim().toUpperCase();
  return n === iso2 || n === iso2ToIso3(iso2);
}

/** A label of the site's tables, or undefined when there is none or it is the country's bare code. */
function named(label: string | null | undefined, iso2: string): string | undefined {
  return label && !isBareCode(label, iso2) ? label : undefined;
}

/** Every label the country's place words carry (geoNameFromSlug, the lookup's own reading), indexed by its slug: "boston" for the label
 *  "Boston" that the table holds under the id gb-e07000136. Only a country the place table holds is cached, so the cache stays as small as the table. */
function spelledBy(iso2: string): ReadonlyMap<string, string> {
  const cc = iso2.toLowerCase();
  const known = SPELLED.get(cc);
  if (known) return known;
  const words = placeWordsFor(cc);
  const spelled = new Map<string, string>();
  for (const w of words) {
    const label = named(geoNameFromSlug(iso2, w), iso2);
    const spelling = label ? slugify(label) : "";
    if (label && spelling && !spelled.has(spelling)) spelled.set(spelling, label);
  }
  if (words.size > 0) SPELLED.set(cc, spelled);
  return spelled;
}

/**
 * The name a trade page prints for its place. `country` is the page's country (any case), `geoSlug` its place word as the route
 * received it, `geoName` the cell's own name (`cell.geo_name`). The cell's name stays whenever it is a name; null stays null.
 */
export function placeNameOf(country: string, geoSlug: string, geoName: string | null | undefined): string | null {
  if (typeof geoName !== "string" || !geoName.trim()) return null;
  const iso2 = String(country ?? "").trim().toUpperCase();
  if (!isBareCode(geoName, iso2)) return geoName;
  const countryName = iso2ToName(iso2);
  const word = String(geoSlug ?? "").trim().toLowerCase();
  if (word === iso2.toLowerCase() || word === slugify(countryName)) return countryName;
  return named(geoNameFromSlug(iso2, word), iso2) ?? spelledBy(iso2).get(word) ?? countryName;
}
