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
 *  - COST OF LIVING: `cost_of_living_index`, the index as held, PUT ON THE
 *    CITY SCALE since the evening of 2026-09-20 (his ruling of that day on
 *    the country's running-costs card, applied at this altitude: 1 at the
 *    cheapest covered city, 100 at the dearest, neither named; the card
 *    printed "where New York is 100" before, a named city). The view draws
 *    it as the segmented bar the country's card draws, `SegmentBar`, so
 *    the figure `living` here is the scale figure (`costOfLivingOnCityScale`
 *    over the same file's ends) and the source index stays in
 *    `figures.livingIndex` for the gates; the cell is no longer in `cells`
 *    (the grid holds the GDP alone).
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
import { costOfLivingOnCityScale } from "@/lib/economics/country_metrics";
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
  /** `living` is the figure on the city scale (1 to 100), `livingIndex` the source index it was read from; `livingMeasured` says whether the row's index was read at city level. */
  figures: { gdp: number | null; living: number | null; livingIndex: number | null };
  livingMeasured: boolean;
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

  const livingIndex = isPos(city.cost_of_living_index) ? Math.round(city.cost_of_living_index) : null;
  const living = livingIndex != null ? costOfLivingOnCityScale(city.cost_of_living_index as number) : null;
  const livingMeasured = living != null && isLivingRead(city.sources?.cost_of_living_index);

  if (cells.length === 0 && living == null) return null;

  /* The basis names a unit for every cell the card prints and for none it does not (the glance's rule). */
  const unitParts: string[] = [];
  if (gdp != null) unitParts.push(COPY.citySeat.units.gdp);
  if (living != null) unitParts.push(COPY.citySeat.units.living);
  const basis = `${unitParts.join("; ")}.`.replace(/^./, (ch) => ch.toUpperCase());

  /* The foot: the modelled clauses that apply, then the placement sentence. */
  const modelled: string[] = [];
  if (gdp != null) modelled.push(COPY.citySeat.footGdp);
  if (living != null && !livingMeasured) modelled.push(COPY.citySeat.footLiving);
  /* The bar places the cost of living among the cities (the scale's ends are the covered cities' cheapest and dearest), so the unshown placement is the GDP's alone where both print. */
  const placement = living != null && gdp != null ? COPY.citySeat.footPlacementGdp : cells.length > 1 ? COPY.citySeat.footPlacement : COPY.citySeat.footPlacementOne;
  const foot = (modelled.length > 0 ? `${modelled.join(" and ")}; ${placement}` : placement).replace(/^./, (ch) => ch.toUpperCase());

  return {
    slug,
    iso2: String(city.iso2).toUpperCase(),
    name: city.name,
    cells,
    figures: { gdp, living, livingIndex },
    livingMeasured,
    basis,
    foot,
    confidence: modelled.length > 0 ? "modeled" : "measured",
  };
}
