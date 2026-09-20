/**
 * src/lib/spine/character_rows.ts
 *
 * THE SPECTRA TABLES' ROWS for a country: dealing with the state (six
 * government reads, 0 to 10) and dealing with people (six culture reads, 1
 * to 10), each normalised to a position from 0 to 1 with the better end on
 * the right, and the foot figure under each table (foreign-owned firms, born
 * abroad). Local and synchronous; the reads are the signature file's, anchored
 * to published indices, so the section is tagged modelled. A table with fewer
 * than two reads is not drawn.
 *
 * THE CITY'S TABLES (city:character, the build loop's run 14, 2026-09-06) come
 * from the per-city signature file, curated one city at a time on the same two
 * scales, and never from the country's reads: a city with no reads of its own
 * draws nothing under a city heading. On 2026-09-06 the file holds 59 cities,
 * one with a state table (New York, six and six), nineteen with a people table,
 * forty with neither; London holds three people reads.
 */
import { getCountrySignature } from "@/lib/countries/country_signature";
import citySignatureJson from "../../../data/cities/city_signature_v1.json";
import cityListJson from "../../../data/cities/city_list_v1.json";
import { COPY } from "@/lib/spine/copy";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export type SpectrumRow = { key: string; name: string; left: string; right: string; position: number };
export type SpectraData = {
  rows: SpectrumRow[];
  dot: "ink" | "terra";
  foot: { value: string; label: string } | null;
  confidence: "modeled";
};
export type CharacterTables = { state: SpectraData | null; people: SpectraData | null };

const STATE_KEYS: Array<[keyof typeof COPY.character.state.rows, string]> = [
  ["tax", "tax_predictability"],
  ["bribery", "low_bribery"],
  ["tasks", "task_efficiency"],
  ["time", "time_efficiency"],
  ["courts", "judicial_impartiality"],
  /* FIVE TRAITS, NOT SIX (his ruling of 2026-09-19, "dealing with people, there have to be five categories, six is a little bit too much", applied to both tables): "openness to the new" leaves the state table, since the people table's "innovation" reads the same thing from the other side; "ambition" leaves the people table, the one trait with no pole a stranger can act on. The keys stay in the copy for the gate's sweep. */
];
const PEOPLE_KEYS: Array<[keyof typeof COPY.character.people.rows, string]> = [
  ["open", "openness_to_foreigners"],
  ["innovation", "innovation"],
  ["direct", "communication_directness"],
  ["punctual", "punctuality"],
  ["straight", "corruption_rejection"],
];

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const foot = (pct: unknown, label: string) => (isNum(pct) && pct >= 0 ? { value: `${Math.round(pct)}%`, label } : null);

type Reads = Record<string, unknown> | undefined | null;
function tablesFrom(government: Reads, culture: Reads, foreignOwnedPct: unknown, foreignBornPct: unknown): CharacterTables {
  const stateRows: SpectrumRow[] = [];
  if (government) {
    for (const [key, field] of STATE_KEYS) {
      const v = government[field];
      if (!isNum(v)) continue;
      const w = COPY.character.state.rows[key];
      stateRows.push({ key, name: w.name, left: w.left, right: w.right, position: clamp01(v / 10) });
    }
  }
  const peopleRows: SpectrumRow[] = [];
  if (culture) {
    for (const [key, field] of PEOPLE_KEYS) {
      const v = culture[field];
      if (!isNum(v)) continue;
      const w = COPY.character.people.rows[key];
      peopleRows.push({ key, name: w.name, left: w.left, right: w.right, position: clamp01((v - 1) / 9) });
    }
  }
  return {
    state: stateRows.length >= 2 ? { rows: stateRows, dot: "ink", foot: foot(foreignOwnedPct, COPY.character.state.foot), confidence: "modeled" } : null,
    people: peopleRows.length >= 2 ? { rows: peopleRows, dot: "terra", foot: foot(foreignBornPct, COPY.character.people.foot), confidence: "modeled" } : null,
  };
}

export function buildCharacterTables(iso2: string): CharacterTables {
  const s = getCountrySignature(iso2);
  if (!s) return { state: null, people: null };
  return tablesFrom(s.government as unknown as Reads, s.culture as unknown as Reads, s.foreign_owned_pct, s.foreign_born_pct);
}

/* The city signature file: an object of cities keyed by slug, or a list with a slug on each. */
type CitySig = { slug?: string; government?: Reads; culture?: Reads; foreign_owned_pct?: unknown; foreign_born_pct?: unknown };
const CITY_SIGS: Record<string, CitySig> = (() => {
  const raw = (citySignatureJson as { cities: Record<string, CitySig> | CitySig[] }).cities;
  if (Array.isArray(raw)) return Object.fromEntries(raw.filter((c) => typeof c.slug === "string").map((c) => [c.slug as string, c]));
  return raw;
})();
const CITY_LIST = (cityListJson as { cities: Array<{ slug: string; name: string; iso2: string }> }).cities;
const CITY_NAMES: Record<string, string> = Object.fromEntries(CITY_LIST.map((c) => [c.slug, c.name]));
const CITY_ISO2: Record<string, string> = Object.fromEntries(CITY_LIST.map((c) => [c.slug, String(c.iso2 ?? "").toUpperCase()]));

export type CityCharacterTables = CharacterTables & { name: string };
/** The city's own two tables, from the city signature file; null when the city has no entry or fewer than two reads on both sides. */
export function buildCityCharacterTables(slug: string | null | undefined): CityCharacterTables | null {
  const key = String(slug ?? "").trim().toLowerCase();
  if (!key) return null;
  const c = CITY_SIGS[key];
  if (!c) return null;
  const t = tablesFrom(c.government, c.culture, c.foreign_owned_pct, c.foreign_born_pct);
  if (!t.state && !t.people) return null;
  return { ...t, name: CITY_NAMES[key] ?? key };
}
/** The slugs the signature file holds, for the stories. */
export function citiesWithSignature(): string[] { return Object.keys(CITY_SIGS); }

/* ------------------------------------------------------------------------- */
/* The city's people table at full form, `12 character-people` (MODEL.md 8.3). */
/* ------------------------------------------------------------------------- */

export type CityPeopleTable = SpectraData & {
  slug: string;
  name: string;
  /** How many of the six rows are the city's own reads; the rest are the country's. */
  own: number;
  /** The one line under the table saying whose the reads are, and that they are modelled. */
  basis: string;
};

const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");
const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const listOf = (names: string[]) => (names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`);

/**
 * DEALING WITH PEOPLE, THE CITY'S TABLE AT FULL FORM (MODEL.md 8.3, `12
 * character-people`; plan step 32's sixth dispatch, 2026-09-18): six traits on
 * every listed city. Each row is the city's own read where the per-city
 * signature file holds one (19 of 252 hold two or more, London three, New
 * York six; item 13), and the country's read from the country signature
 * where it does not, the city's word for the trait either way; the basis says
 * which rows are whose and says modelled, because the reads on both files are
 * anchored to published indices and the sample mark is off site-wide. This is
 * M5's pattern one card over: the city's own figure where the city holds
 * one, the country's named as the country's where it does not. COUNTED
 * 2026-09-18 over the 252 listed cities: 252 draw six rows; New York's six
 * are its own, 36 mix the city's own with the country's (the 19 holding two
 * or more reads and 17 holding one), 215 are the country's throughout. THE
 * FOOT is the city's own share born abroad where the city file holds it (55
 * cities) and the country's share where it does not (197), under a label
 * that says so ("born abroad, nationwide"; the country signature holds it for
 * all 196): a national figure under a city's name needs the word, and a
 * table with no foot has no lead (measured on Frankfurt and Abidjan with the
 * page filter: every word in the card 12px, NO LEAD). Fewer than two rows on
 * both files is not a table and draws nothing (no listed city today).
 */
export function buildCityPeopleTable(slug: string | null | undefined): CityPeopleTable | null {
  const key = String(slug ?? "").trim().toLowerCase();
  if (!key || !(key in CITY_NAMES)) return null;
  const name = CITY_NAMES[key];
  const city = CITY_SIGS[key];
  const country = getCountrySignature(CITY_ISO2[key] ?? "");
  const own = (city?.culture ?? null) as Reads;
  const theirs = (country?.culture ?? null) as unknown as Reads;
  const rows: SpectrumRow[] = [];
  const ownNames: string[] = [];
  for (const [k, field] of PEOPLE_KEYS) {
    const mine = own ? own[field] : undefined;
    const v = isNum(mine) ? mine : theirs && isNum(theirs[field]) ? (theirs[field] as number) : null;
    if (v == null) continue;
    const w = COPY.character.people.rows[k];
    if (isNum(mine)) ownNames.push(w.name.toLowerCase());
    rows.push({ key: k, name: w.name, left: w.left, right: w.right, position: clamp01((v - 1) / 9) });
  }
  if (rows.length < 2) return null;
  const C = COPY.character.city;
  const basis =
    ownNames.length === rows.length ? fill(C.basisOwn, { city: name })
    : ownNames.length === 0 ? fill(C.basisCountry, { city: name })
    : capFirst(fill(C.basisMixed, { traits: listOf(ownNames), verb: ownNames.length === 1 ? "is" : "are", city: name }));
  return {
    slug: key,
    name,
    rows,
    dot: "terra",
    foot: foot(city?.foreign_born_pct, COPY.character.people.foot) ?? foot(country?.foreign_born_pct, COPY.character.people.footCountry),
    confidence: "modeled",
    own: ownNames.length,
    basis,
  };
}
/** Every listed city's slug, for the stories and the gates. */
export function listedCitySlugsForCharacter(): string[] { return CITY_LIST.map((c) => c.slug); }
