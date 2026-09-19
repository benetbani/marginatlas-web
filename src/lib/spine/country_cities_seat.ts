/**
 * src/lib/spine/country_cities_seat.ts
 *
 * THE CITIES SEAT: what `10 cities` says on a country with no covered city
 * (MODEL.md 8.2, the FLOOR paragraph's bracket, plan step 49, decided
 * 2026-09-19 by the controller, option A, reversible by his word). The 90
 * such countries ship below the composition with the cities band drawn as
 * the blocked seat: the cards' opener, ONE stated line, no figure, no door,
 * `data-blocked="1"` so BLOCK FLOOR counts it as it counts `07` and `11`,
 * and the page renders 21 of 21.
 *
 * THE LINE, read aloud on Afghanistan:
 *
 *   "Not gathered yet: any city here. Nearby: Delhi, Dhaka and Mumbai."
 *
 * It opens in the site's idiom for a data gap (M19, "Not gathered yet:",
 * the seat form's own law in BlockedSeat.tsx) and then names the three
 * largest covered cities of the country's own region, by the city list's
 * metro population, names only. WHY THE REGION IS NOT PRINTED BY NAME: the
 * seat's law caps the line at fourteen words (SEAT_LINE_WORDS_CAP; the
 * archetype harness reds fifteen at every width), and the profile's region
 * names run two to five words ("Middle East & North Africa") beside city
 * names that run to seven ("São Paulo, Mexico City and Buenos Aires", the
 * three largest of Latin America & Caribbean), so no line that names both
 * the region and its three cities fits under the cap on any region but
 * South Asia. The region is carried on the return value for the gate, never
 * as a code (the profile's `continent` is "SA", "MENA", "EU": codes, and a
 * code never prints), and the line says "Nearby" for it.
 *
 * PURE OVER TWO FILES and nothing else: the region from
 * `data/economic_indicators/country_profile_v2.json` `countries.{ISO2}
 * .world_bank_region` (the file, never `getCountryProfile`, whose fallback
 * row carries a region of its own that would print a fill), and the covered
 * cities from `data/cities/city_list_v1.json` `cities[]` (`iso2`, `name`,
 * `pop_m`). The tables are injectable so a story can draw the two-name and
 * the none line, which no live region reaches today (the fewest covered
 * cities a region holds is twelve, Sub-Saharan Africa; measured 2026-09-19).
 *
 * WHO STANDS ON THE SEAT: a country the city list holds NO row for (90 of
 * 195). A country that holds a covered city but draws no card (52 of 195 on
 * 2026-09-19: `buildCityCards` walks the top-100 draft list and keeps those
 * with a page, while the list of covered cities is the page index itself,
 * so Bangladesh holds Dhaka's page, its close door goes there, and no card
 * draws) is NOT seated: the seat's line would be false on it. That gap is
 * the card builder's and is queued, not papered over here.
 *
 * NO DOOR IN A SEAT (PART 7): the names are text. The city pages exist, and
 * a reader reaches them from the cities index; a seat carries no href.
 *
 * Defended by scripts/verify_archetype_copy.ts (THE CITIES SEAT): the line
 * composed on every country, held to the idiom, the cap, no digit, no door,
 * the region one of the profile's plain names and never a code, the names
 * the region's largest by the list; and by scripts/verify_model_laws_copy.ts
 * (BANNED CONSTRUCTION) on the composed lines.
 */
import profileJson from "../../../data/economic_indicators/country_profile_v2.json";
import cityListJson from "../../../data/cities/city_list_v1.json";
import { COPY } from "@/lib/spine/copy";

export type CitiesSeatProfileRow = { iso2: string; name?: string; world_bank_region?: string; continent?: string };
export type CitiesSeatCityRow = { iso2: string; name: string; slug?: string; pop_m?: number };
export type CitiesSeatTables = { profiles: Record<string, CitiesSeatProfileRow>; cities: CitiesSeatCityRow[] };

/** The two files as shipped. A story passes its own cut of them; the page never does. */
export const LIVE_CITIES_SEAT_TABLES: CitiesSeatTables = {
  profiles: (profileJson as unknown as { countries: Record<string, CitiesSeatProfileRow> }).countries,
  cities: (cityListJson as unknown as { cities: CitiesSeatCityRow[] }).cities,
};

/** How many of the region's covered cities the line names: the three largest. */
export const CITIES_SEAT_NAMES_CAP = 3;

/** The seven region names the profile file carries, in its own plain words
 *  (an ampersand, never a code). A region outside this set is a fault the
 *  gate names, not a line the page prints. */
export const PROFILE_REGIONS: readonly string[] = [
  "North America",
  "East Asia & Pacific",
  "Europe & Central Asia",
  "South Asia",
  "Latin America & Caribbean",
  "Middle East & North Africa",
  "Sub-Saharan Africa",
];

export type CitiesSeat = {
  /** The one stated line, composed. */
  line: string;
  /** The profile's region, in its plain words, carried for the gate; not printed. */
  region: string;
  /** The covered cities the line names, largest first, names only. */
  names: string[];
  /** How many covered cities the region holds in the list (the country's own excluded by construction: it holds none). */
  regionCovered: number;
  /** Which form the line took. */
  form: "three" | "fewer" | "none";
};

/** The names joined the way a person says them: "Delhi, Dhaka and Mumbai", "Lagos and Luanda", "Cairo". */
export function sayNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** The region's covered cities, largest metro first by the list's `pop_m`, ties by name. */
export function regionCoveredCities(region: string, tables: CitiesSeatTables = LIVE_CITIES_SEAT_TABLES): CitiesSeatCityRow[] {
  const inRegion = new Set(Object.values(tables.profiles).filter((p) => p.world_bank_region === region).map((p) => String(p.iso2).toUpperCase()));
  return tables.cities
    .filter((c) => inRegion.has(String(c.iso2).toUpperCase()))
    .slice()
    .sort((a, b) => (typeof b.pop_m === "number" ? b.pop_m : -1) - (typeof a.pop_m === "number" ? a.pop_m : -1) || a.name.localeCompare(b.name));
}

/** The line for a set of names: the three-name form, the fewer form (the same words over one or two names), or the none line. */
export function composeCitiesSeatLine(names: string[]): string {
  if (names.length === 0) return COPY.blocked.cities.lineNone;
  return COPY.blocked.cities.line.replace("{cities}", sayNames(names));
}

/**
 * THE STORY'S CUT of the two files: the region's covered cities cut to its
 * `n` largest (real rows, the file's own order, nothing invented), so the
 * sheet can draw the two-name line and the none line, which no live region
 * reaches. The profiles stay whole, so the country's region resolves as on
 * the page.
 */
export function cutCitiesSeatTables(region: string, n: number, tables: CitiesSeatTables = LIVE_CITIES_SEAT_TABLES): CitiesSeatTables {
  return { profiles: tables.profiles, cities: regionCoveredCities(region, tables).slice(0, Math.max(0, n)) };
}

/**
 * Null when the country holds a covered city (the cards' business, drawn or
 * not) or when the profile holds no row for it (no region to name, and a
 * line that said "nearby" of nowhere would be a guess). Otherwise the seat.
 */
export function buildCitiesSeat(iso2In: string, tables: CitiesSeatTables = LIVE_CITIES_SEAT_TABLES): CitiesSeat | null {
  const iso2 = iso2In.toUpperCase();
  if (tables.cities.some((c) => String(c.iso2).toUpperCase() === iso2)) return null;
  const profile = tables.profiles[iso2];
  const region = profile?.world_bank_region?.trim();
  if (!profile || !region) return null;
  const covered = regionCoveredCities(region, tables);
  const names = covered.slice(0, CITIES_SEAT_NAMES_CAP).map((c) => String(c.name).replace(/\s*\([^)]*\)\s*$/, "").trim());
  const form: CitiesSeat["form"] = names.length === 0 ? "none" : names.length < CITIES_SEAT_NAMES_CAP ? "fewer" : "three";
  return { line: composeCitiesSeatLine(names), region, names, regionCovered: covered.length, form };
}
