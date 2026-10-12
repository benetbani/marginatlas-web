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
 * WHOLE-COUNTRY WORDS AND LABELS BUILT FROM A CODE (truth-fixes round 3A, the review's M3). The code and its zero-padded statistics entries
 * (af, dk0, cy0, cy00) are the country. They name it in English whatever label a table gives them ("Danmark", "Kýpros", "All of AF"), so
 * the slug of such a label ("danmark", "k-pros", "all-of-af") spells nothing either. A label that holds the code as a word of its own
 * ("All of AF", "Centro (IT)") is no name, from whichever table it comes. A code the country list holds no name for is left to the cell.
 * That paragraph holds for a cell named by its country's bare code, which is not what the live lookup hands over (the next paragraph).
 * THE NAME THE LOOKUP STAMPED (truth-fixes round 3A2, 2026-10-12; the review of round 3A, I1). cells.ts gives every cell whose word a table labels
 * geoNameFromSlug's answer as its name, so for each of the 2,510 labelled words of the 15,685 place words (measured) the name read here is that label and
 * none of the bare-code rules ran. Read as the lookup feeds it, 68 own-code words printed "All of AF", 15 whole-country words printed a native name
 * ("Danmark", "Kýpros") and 8 regional rows printed their country's code ("Prov. Limburg (BE)"). Two rules, at the top of placeNameOf. A whole-country
 * word whose stamped name is the lookup's own label for it (geoNameFromSlug, so a name a row carried itself is kept) is the country, named in English.
 * And a label is printed without a TAIL that says the classification's vintage ("(NUTS 2021)") or the page's own country again ("(BE)", "(PT)"): at
 * display only, never at the generator, because the place table builds the address of every label from its slug (scripts/gen_place_slugs.ts), so a
 * rewritten label would move addresses. Over the 15,685 words the words printing a code go from 76 to 1, and those printing no English name for the
 * country from 83 to 0.
 * BLIND SPOTS, stated: this cannot tell a place the site holds no label for from one it holds under another word, and a word that is the
 * slug of two labels takes the first the table lists. The display rule reads a label's tail only, so a label that holds the code anywhere else
 * still prints it: "RUP FR - Régions Ultrapériphériques Françaises" (/fr/fry) is the one word that does, and the test names it and no other.
 * THE STATISTICS CODES (truth-fixes round 3B; uk:statistics-code-uk-pages): UK and EL are the United Kingdom's and Greece's own spellings, so the
 * country's name and the bare-code test read the site's code for the same country (siteCountryCode, src/lib/countries.ts): a cell named "UK" is
 * named by its place word's label or else "United Kingdom", as a cell named "GB" is. The tables stay keyed by the code the address holds (the
 * place words and the labels of "uk" and "el"), which is the code the route received. A code neither held nor mapped has no country name to give,
 * so a bare code there stays what the cell was called.
 *
 * headPlaceOf, below, is this module's second rule: which place a figure may be printed beside (truth-fixes round 3A, 2026-10-11).
 */
import { iso2ToIso3, iso2ToName, siteCountryCode } from "@/lib/countries";
import { geoNameFromSlug, slugify } from "@/lib/cells/geo";
import { placeWordsFor } from "@/lib/routing/place_words";
import { inSentence } from "@/lib/spine/place_names";

/** The labels of a held country's place words, by the word each label spells; built once per country on first use. A Map, so a word from
 *  an address ("constructor") is a key like any other (src/lib/own.ts is for plain objects). */
const SPELLED = new Map<string, ReadonlyMap<string, string>>();

/** The codes a country answers to: the one its address holds (UK), the site's code for the same country (GB), and each in its three-letter
 *  form where it has one (GBR). A statistics code and the site's code are one country (siteCountryCode, src/lib/countries.ts). */
function codesOf(iso2: string): string[] {
  const site = siteCountryCode(iso2);
  const codes = new Set<string>([iso2, site]);
  for (const code of [iso2, site]) {
    const three = iso2ToIso3(code);
    if (three) codes.add(three);
  }
  codes.delete("");
  return [...codes];
}

/** True when a name is one of the country's own codes (UK, GB, GBR): the one name a page never prints. */
function isBareCode(name: string, iso2: string): boolean {
  return codesOf(iso2).includes(name.trim().toUpperCase());
}

/** True when a label holds one of the country's codes as a word of its own ("All of AF", "Centro (IT)", "South East (UK)"). The code in
 *  capitals only, since a code is printed so and "it" or "me" inside a name is a word. Read by splitting the label, never by a pattern
 *  built from the code: the code comes from the address. */
function holdsCode(label: string, iso2: string): boolean {
  const codes = codesOf(iso2);
  return label.split(/[^A-Za-z0-9]+/).some((token) => codes.includes(token));
}

/** True when a word is the whole country: its code, or the code with the statistics' zero padding (af, dk0, cy0, cy00). Such a word is
 *  the country itself, whatever label a table gives it. */
function isWholeCountryWord(word: string, iso2: string): boolean {
  const cc = iso2.toLowerCase();
  return word.startsWith(cc) && /^0*$/.test(word.slice(cc.length));
}

/** A label of the site's tables, or undefined when there is none, it is the country's bare code, or it holds the code as a word. */
function named(label: string | null | undefined, iso2: string): string | undefined {
  return label && !isBareCode(label, iso2) && !holdsCode(label, iso2) ? label : undefined;
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
    /* A whole-country word spells no label: its table label ("Danmark", "Kýpros", "All of AF") is the country in another tongue or in
       the code, so the slug of that label ("danmark", "k-pros", "all-of-af") names the country in English like the code does. */
    if (isWholeCountryWord(w, iso2)) continue;
    const label = named(geoNameFromSlug(iso2, w), iso2);
    const spelling = label ? slugify(label) : "";
    if (label && spelling && !spelled.has(spelling)) spelled.set(spelling, label);
  }
  if (words.size > 0) SPELLED.set(cc, spelled);
  return spelled;
}

/** A label as a page prints it, at display only (truth-fixes round 3A2, the review's I1). A TAIL that says the classification's vintage ("(NUTS 2021)") or the
 *  page's own country again ("Prov. Limburg (BE)", "Centro (PT)") is not printed: the tables add the code to tell labels of different countries apart, and on
 *  that country's own page it says nothing. Only a trailing parenthetical, only those two kinds, the code in capitals as a code is printed: "Centro (IT)" on a
 *  Portuguese page, a note such as "(Surrey)" and a code inside a name ("RUP FR - ...") stay. The label is never rewritten where the tables hold it: the place
 *  table builds the address of each label from its slug (scripts/gen_place_slugs.ts), so a rewritten label would move addresses. */
function plain(label: string, iso2: string): string {
  const codes = codesOf(iso2);
  let shown = label;
  for (;;) {
    const tail = /^(.*\S)\s*\(([^()]*)\)\s*$/.exec(shown);
    if (!tail || (tail[2] !== "NUTS 2021" && !codes.includes(tail[2]))) return shown;
    shown = tail[1];
  }
}

/**
 * The name a trade page prints for its place. `country` is the page's country (any case), `geoSlug` its place word as the route
 * received it, `geoName` the cell's own name (`cell.geo_name`). The cell's name stays whenever it is a name, without a tail that says
 * the vintage or the country again (plain); null stays null.
 */
export function placeNameOf(country: string, geoSlug: string, geoName: string | null | undefined): string | null {
  if (typeof geoName !== "string" || !geoName.trim()) return null;
  const iso2 = String(country ?? "").trim().toUpperCase();
  const word = String(geoSlug ?? "").trim().toLowerCase();
  const countryName = heldCountryName(iso2);
  /* A WHOLE-COUNTRY WORD IS THE COUNTRY WHEN ITS NAME IS ITS TABLE'S OWN LABEL (truth-fixes round 3A2, the review's I1). cells.ts stamps geoNameFromSlug(country,
     word) on the cell whenever a table labels the word ("All of AF", "Danmark"), so on the live path the name is that label and never the bare code, and the rules
     below, which read a bare code, did not run for such a word. A stamped name that IS the lookup's own label for the word is no row's name: the word is the
     country, named in English. A name the lookup did not stamp ("Bahamas, The", read from the row itself) is the cell's own and stays. */
  if (countryName !== null && isWholeCountryWord(word, iso2) && geoName === geoNameFromSlug(iso2, word)) return countryName;
  const shown = plain(geoName, iso2);
  if (!isBareCode(shown, iso2)) return shown;
  /* A code that neither the country list holds nor the site maps to a country it holds (siteCountryCode, src/lib/countries.ts: the statistics'
     UK and EL ARE mapped, to GB and GR, since round 3B, so they have their country's name) has no English name to give, so the cell's own name
     stands, as the header says. */
  if (countryName === null) return geoName;
  if (isWholeCountryWord(word, iso2) || word === slugify(countryName)) return countryName;
  const label = named(geoNameFromSlug(iso2, word), iso2) ?? spelledBy(iso2).get(word);
  return label ? plain(label, iso2) : countryName;
}

/** What a trade page's head and its share card print about the place and about the one figure beside it. */
export type HeadPlace = {
  /** The place the page is about, as a label: the share card's title ("Boston", "United Kingdom"). */
  label: string;
  /** The place as the head's question spells it after "in": the place with its country when the row is the country's ("Boston, United
   *  Kingdom"), the country with its article when the place is the country ("the United Kingdom"), else the place itself. */
  titleIn: string;
  /** The place the figure belongs to, as a sentence reads it after "in" ("the United Kingdom", "London"), or null when the cell holds no
   *  figure of any place and the head and the card print none. */
  figureIn: string | null;
};

/** The country's English name as the country list holds it for the site's code (a statistics code reads as its country's: UK is the United
 *  Kingdom, EL Greece), or null for a code that neither the list holds nor the site maps. */
function heldCountryName(iso2: string): string | null {
  const site = siteCountryCode(iso2);
  const name = iso2ToName(site);
  return name && name.toUpperCase() !== site ? name : null;
}

/**
 * THE FIGURE'S OWN PLACE (truth-fixes round 3A, 2026-10-11; the review's I1, M2 and M5). placeNameOf says what the address names. The
 * figure on the cell may belong to somewhere else: a country's row (geo_level "country") answers any place word no regional row holds,
 * so its figure is the country's whatever the word, and a synthetic cell is drawn from country and trade averages, so it holds the
 * figure of no place. Anything that prints a figure beside a place names the place the figure belongs to, and this is the one rule for
 * it, read by the head (generateMetadata) and the share card (/og/cell):
 *  - label: the place the page is about, as placeNameOf names it, for a card's title.
 *  - titleIn: how the head's question spells it after "in". On a country's row it names the place with its country ("Boston, United
 *    Kingdom"), and where the place is the country it takes the article the site's helper gives ("the United Kingdom").
 *  - figureIn: where the figure belongs, as a sentence reads it. The country on a country's row, the place on its own row, and null
 *    for a synthetic cell and for a country's row of a code that neither the list holds nor the site maps, so the printer omits the figure.
 *    (The statistics' own UK and EL read as the United Kingdom and Greece since round 3B: siteCountryCode, src/lib/countries.ts.)
 * The article comes from inSentence and only ever on the country's name: its start-of-name rules would turn a place's label such as
 * "Central Bedfordshire" into "the Central Bedfordshire".
 * BLIND SPOT, stated: geo_level and is_synthetic are what the lookup stamped on the cell, so this cannot tell a country's row that was
 * stored under a regional level from a regional row, and a row's figure is taken to belong to the level it says.
 * NOR CAN IT TELL A REGIONAL ROW THAT CARRIES ANOTHER PLACE'S NAME THROUGH AN ALIAS (the review of round 3A, M3). A place word that an alias
 * points at a row of a larger region reads that row as its own: the review counted 166 of manual_city_aliases.ts's 180 aliases pointing at a larger
 * region, and the friendly aliases point a city at its county. So /de/dusseldorf and /de/essen both read the row DEA1 and one figure prints as
 * Düsseldorf's and as Essen's, /de/frankfurt prints Darmstadt's NUTS-2 figure "in Frankfurt am Main", and /us/boston prints Suffolk County's
 * figure "in Boston". The row is regional, so its figure is taken to belong to the place the cell is named for, which the alias makes untrue.
 * That is a ruling about the aliases, not a fix of this function: carried to the owner, outside truth-fixes round 3A2.
 */
export function headPlaceOf(country: string, geoSlug: string, cell: { geo_name?: string | null; geo_level?: string | null; is_synthetic?: boolean | null }): HeadPlace {
  const iso2 = String(country ?? "").trim().toUpperCase();
  const word = String(geoSlug ?? "").trim().toLowerCase();
  const label = placeNameOf(iso2, geoSlug, cell.geo_name) || String(geoSlug ?? "");
  const countryName = heldCountryName(iso2);
  /* The place is the country itself when its word is the country's code or its name, or the name the page prints is the country's. */
  const isCountry = countryName !== null && (word === iso2.toLowerCase() || word === slugify(countryName) || label.trim().toLowerCase() === countryName.toLowerCase());
  const countryIn = countryName === null ? null : inSentence(countryName);
  const countryRow = cell.geo_level === "country";
  const titleIn = isCountry && countryIn !== null ? countryIn : countryRow && countryName !== null ? `${label}, ${countryName}` : label;
  const figureIn = cell.is_synthetic === true ? null : isCountry || countryRow ? countryIn : label;
  return { label, titleIn, figureIn };
}
