/**
 * src/lib/spine/city_seat_rows.ts
 *
 * AMONG THE CITIES, the city page's `02 among-cities` (MODEL.md 8.3; plan
 * step 32, first dispatch, 2026-09-18), the country's `02 world-seat` one
 * altitude down (R8, PART 9 clause 43: "city 02 takes whatever form
 * world-seat resolves to, the same form at two altitudes"). The
 * composition's card is the placed-figures form, a figure with the sentence
 * "Higher than {n} cities in ten" under it, which is candidate 2 in
 * E:/atlas/rules/FORM-CATALOG.md's CANDIDATES AWAITING HIS CLICK, and a form
 * not in the catalogue is a candidate awaiting his click. So KvGrid holds
 * the seat with the two figures alone, no placement sentence, nothing at 30
 * (the FOCAL finding is expected), and the foot says the placement is not
 * shown yet. The day he clicks, the sentences come from placement.ts,
 * `placementOf(value, values, "cities")`, the one builder every page shares
 * (R2, clause 37), over the 252 rows of the same file; nothing else composes
 * that sentence. Pure over the file, synchronous.
 *
 * The cells, each with its file and field, both 252 of 252 in
 * data/cities/city_list_v1.json (the 02 brief, `research/2026-09-11/city/
 * 02-among-cities.md`, names these two and no third; the programme of
 * 2026-09-12 said three, and the brief and 8.3 that followed it say two):
 *
 *  - METRO GDP: `gdp_b`, whole billions of dollars a year, through the
 *    kit's `usd` (its billions and trillions rungs). NO ROW CARRIES A
 *    SOURCE: the file's own `convention` calls the field "approximate metro
 *    GDP ... cross-reference of public city statistics; not authoritative
 *    but consistent" (DATA-REQUIREMENTS item 31). Marked modelled on every
 *    city, and the foot says approximate in words.
 *  - COST OF LIVING: `cost_of_living_index`, the index as held, whole, where
 *    New York is 100 (the basis says so; the country's running-costs cell
 *    prints the same index under the same label, one name for one index).
 *    Per row (item 31): "Numbeo COL (city-level)" is a direct reading on 13
 *    cities and prints measured; "hand-anchor" on 239 is an analyst's
 *    estimate against the index and prints modelled, the foot naming it.
 *    The 8.3 row says "inverted": that is the placement's direction (a
 *    cheap city ranks high), which is the click's business, not this card's.
 *
 * NOT HERE, by the 02 brief: `unemployment_pct` and `gini` (national
 * figures on most rows, unverifiable for the 70 countries holding one
 * city), `wealth_z` (a coined z-score, clause 17), `pop_m` (clause 34) and
 * a bare `tourist_arrivals_m` (item 20; the glance prints it where the city
 * counted it).
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";
import type { KvCell } from "@/components/spine/archetypes/KvGrid";

type CityRow = {
  slug: string;
  name: string;
  iso2: string;
  gdp_b?: number;
  cost_of_living_index?: number;
  sources?: Record<string, string>;
};

const CITIES = (cityListJson as { cities: CityRow[] }).cities;
const BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

const isPos = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0;

/** The living index is a reading of the city only where the row's note says the city-level index was pulled; a hand anchor is an estimate. */
export const isLivingRead = (source: string | undefined): boolean => typeof source === "string" && /city-level/i.test(source) && !/hand-anchor/i.test(source);

export type CitySeatData = {
  slug: string;
  iso2: string;
  name: string;
  cells: KvCell[];
  figures: { gdp: number | null; living: number | null };
  basis: string;
  foot: string;
  confidence: "measured" | "modeled";
};

export function buildCitySeat(slug: string): CitySeatData | null {
  const city = BY_SLUG.get(slug);
  if (!city) return null;
  const cells: KvCell[] = [];

  const gdp = isPos(city.gdp_b) ? city.gdp_b : null;
  if (gdp != null) cells.push({ key: "gdp", label: COPY.citySeat.cells.gdp, value: usd(gdp * 1e9), confidence: "modeled" });

  const living = isPos(city.cost_of_living_index) ? Math.round(city.cost_of_living_index) : null;
  const livingMeasured = living != null && isLivingRead(city.sources?.cost_of_living_index);
  if (living != null) cells.push({ key: "living", label: COPY.runningCosts.cells.living, value: String(living), confidence: livingMeasured ? "measured" : "modeled" });

  if (cells.length === 0) return null;

  /* The basis names a unit for every cell the card prints and for none it does not (the glance's rule). */
  const unitParts: string[] = [];
  if (gdp != null) unitParts.push(COPY.citySeat.units.gdp);
  if (living != null) unitParts.push(COPY.citySeat.units.living);
  const basis = `${unitParts.join("; ")}.`.replace(/^./, (ch) => ch.toUpperCase());

  /* The foot: the modelled clauses that apply, then the placement sentence. */
  const modelled: string[] = [];
  if (gdp != null) modelled.push(COPY.citySeat.footGdp);
  if (living != null && !livingMeasured) modelled.push(COPY.citySeat.footLiving);
  const placement = cells.length > 1 ? COPY.citySeat.footPlacement : COPY.citySeat.footPlacementOne;
  const foot = (modelled.length > 0 ? `${modelled.join(" and ")}; ${placement}` : placement).replace(/^./, (ch) => ch.toUpperCase());

  return {
    slug,
    iso2: String(city.iso2).toUpperCase(),
    name: city.name,
    cells,
    figures: { gdp, living },
    basis,
    foot,
    confidence: modelled.length > 0 ? "modeled" : "measured",
  };
}
