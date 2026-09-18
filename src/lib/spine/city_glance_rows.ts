/**
 * src/lib/spine/city_glance_rows.ts
 *
 * AT A GLANCE, the city page's `01 glance` (MODEL.md 8.3; plan step 32,
 * first dispatch, 2026-09-18): the city's own figures, each in its own
 * unit, no rank and no verdict, the country's `01 glance` one altitude down
 * (R8, PART 9 clause 43: one form at two altitudes, the same cell rule).
 * Pure over the files, synchronous, no database: the city list is a JSON
 * import and the city shard is read through city_shard.ts (the file system,
 * so server only, as fact_rows.ts is), so the archetype harness and the
 * prebuild gates can build every city. Four cells at most, in this order,
 * each with its file and field:
 *
 *  - VISITORS A YEAR: `tourist_arrivals_m` in data/cities/city_list_v1.json,
 *    printed only where the row's own `sources` note says the figure is the
 *    city's count (45 of 252, "UNWTO / national tourism authority"). On 201
 *    rows the note says "Extrapolated from country arrivals / tier-N divisor":
 *    the country's arrivals divided by 3, 5 or 8, which is the mechanism's
 *    value and not this city's (DATA-REQUIREMENTS item 20: it puts Lyon and
 *    Marseille at 20.0M each, above Paris's real 19.0M), and on 5 the
 *    division left a literal 0. Those, and the 6 with no field, are WITHHELD
 *    with a stated line (R11's rule for a fill, PART 9 clause 46). The
 *    notation is the mark list's `visitorsM`, one notation for a count in
 *    millions on the site.
 *  - HUMAN DEVELOPMENT: `hdi` in the same file, 247 of 252, WITHHELD ON
 *    EVERY CITY. Read row by row (2026-09-18): 181 notes say "Extrapolated
 *    from country HDI + tier-N bump", and the 66 that name a statistics body
 *    name the SALARY's body (the wage survey pasted onto the field) while
 *    holding the same country-plus-step value (London 0.952 over the
 *    country's 0.940, Frankfurt 0.96 over 0.95, Abidjan 0.539 over 0.534).
 *    No row is a reading of the city, so no row prints, and the line says
 *    so. Item 31 names the overclaim; a subnational reading is the
 *    requirement.
 *  - CITY PERMITS: `reg.total_local_days` in data/facts/city/<ISO2>-<slug>.json
 *    through cityFigure(), 252 of 252 (133 held, 119 modelled): the
 *    warehouse's own definition is "realistic calendar days to clear ALL
 *    required local gates in parallel where possible, not a naive sum", on
 *    top of the national registration the country page prints. Marked with
 *    the shard's tag.
 *  - BUSINESSES PER 10,000 RESIDENTS: `comp.density_per_10k` in the same
 *    shard, 252 of 252 (56 held, 196 modelled), "all businesses per 10,000
 *    metro residents". Whole, marked with the shard's tag.
 *
 * THREE OF 8.3's SEVEN ARE NOT HERE, and are not withheld either: they print
 * elsewhere on the page, and one figure prints once (M1). `gdp_b` and
 * `cost_of_living_index` are `02 among-cities`' two cells (the glance yields
 * them to the placement seat, as the brief says it must); and
 * `avg_gross_salary_usd_year` is the masthead's answer, the page's 40.
 *
 * The withheld line names each cell the card does not hold and why, with
 * the count (PART 5: a label never stands where a number goes). The foot
 * names the modelled cells in words, because the sample mark is switched
 * off and the foot is the only line left that can. No year: no fact in the
 * city bank carries one (item 26), and the list holds none for its fields.
 *
 * NO CELL AT 30: the fact card with a focal (a first cell at 30 taking the
 * card's width) is candidate 1 of FORM-CATALOG's CANDIDATES AWAITING HIS
 * CLICK, unclicked, so the cells draw at the head rung and the FOCAL finding
 * on this card is expected until he clicks.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import { cityFigure } from "@/lib/facts/city_shard";
import type { FactTag } from "@/lib/facts/types";
import { visitorsM } from "@/lib/spine/mark_list_rows";
import { COPY } from "@/lib/spine/copy";
import type { KvCell } from "@/components/spine/archetypes/KvGrid";

type CityRow = {
  slug: string;
  name: string;
  iso2: string;
  hdi?: number;
  tourist_arrivals_m?: number;
  sources?: Record<string, string>;
};

const CITIES = (cityListJson as { cities: CityRow[] }).cities;
const BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");

/** The visitor count is the city's own only where its source note says a tourism body counted it; every other shape of note is the country's figure through a divisor. */
export const isVisitorsRead = (source: string | undefined): boolean => typeof source === "string" && /national tourism authority/i.test(source) && !/extrapolated/i.test(source);

/** The shard's four tags collapse to the cell's three: held is measured, placeholder stays, the rest are modelled. */
const cellConfidence = (tag: FactTag): NonNullable<KvCell["confidence"]> => (tag === "held" ? "measured" : tag === "placeholder" ? "placeholder" : "modeled");

export type CityGlanceData = {
  slug: string;
  iso2: string;
  name: string;
  cells: KvCell[];
  /** The raw figures behind the cells, null where withheld or not held; the gates read these. */
  figures: { visitors: number | null; days: number | null; density: number | null; hdi: null };
  withheld: string | null;
  /** The units of the cells printed. */
  basis: string | null;
  foot: string | null;
  /** The weakest cell on the card, for the opener's mark. */
  confidence: "measured" | "modeled";
};

/** The count of candidate cells the withheld line counts against. */
export const CITY_GLANCE_CELLS = 4;

export function buildCityGlance(slug: string): CityGlanceData | null {
  const city = BY_SLUG.get(slug);
  if (!city) return null;
  const iso2 = String(city.iso2).toUpperCase();

  const cells: KvCell[] = [];
  const modelled: string[] = [];
  const missing: string[] = [];

  /* Visitors a year: the city's own count, or withheld with the reason. */
  const arrivals = city.tourist_arrivals_m;
  const visitorsSource = city.sources?.tourist_arrivals_m;
  let visitors: number | null = null;
  if (isNum(arrivals) && arrivals > 0 && isVisitorsRead(visitorsSource)) {
    visitors = arrivals;
    cells.push({ key: "visitors", label: COPY.cityGlance.cells.visitors, value: visitorsM(arrivals), confidence: "measured" });
  } else if (isNum(arrivals) && typeof visitorsSource === "string" && /extrapolated/i.test(visitorsSource)) {
    missing.push(COPY.cityGlance.reasons.visitorsCountry);
  } else {
    missing.push(COPY.cityGlance.reasons.visitorsNone);
  }

  /* Human development: withheld on every row (the header says why). */
  missing.push(COPY.cityGlance.reasons.hdi);

  /* City permits: the shard's realistic days to clear the local gates. Zero
     is a figure here (a city requiring no local gate clears them in no days;
     no city holds it today, all 252 above zero), where a zero business count
     below would not be. */
  const daysFig = cityFigure(iso2, slug, "reg.total_local_days");
  const days = daysFig ? Math.round(daysFig.value) : null;
  if (days != null && daysFig) {
    const c = cellConfidence(daysFig.tag);
    if (c !== "measured") modelled.push(COPY.cityGlance.footNames.days);
    cells.push({ key: "days", label: COPY.cityGlance.cells.days, value: `${days} ${days === 1 ? "day" : "days"}`, confidence: c });
  } else missing.push(COPY.cityGlance.reasons.daysNone);

  /* Businesses per 10,000 residents: whole, the shard's tag. */
  const densityFig = cityFigure(iso2, slug, "comp.density_per_10k");
  const density = densityFig && densityFig.value > 0 ? Math.round(densityFig.value) : null;
  if (density != null && densityFig) {
    const c = cellConfidence(densityFig.tag);
    if (c !== "measured") modelled.push(COPY.cityGlance.footNames.density);
    cells.push({ key: "density", label: COPY.cityGlance.cells.density, value: density.toLocaleString("en-US"), confidence: c });
  } else missing.push(COPY.cityGlance.reasons.densityNone);

  if (cells.length === 0) return null;

  /* The basis names a unit for every cell the card prints and for none it withholds. */
  const unitParts: string[] = [];
  if (visitors != null) unitParts.push(COPY.cityGlance.units.visitors);
  if (days != null) unitParts.push(COPY.cityGlance.units.days);
  if (density != null) unitParts.push(COPY.cityGlance.units.density);
  const basis = unitParts.length > 0 ? `${unitParts.join("; ")}.`.replace(/^./, (ch) => ch.toUpperCase()) : null;

  const withheld = missing.length > 0 ? fill(COPY.cityGlance.withheld, { n: String(missing.length), reasons: missing.join("; ") }) : null;

  let foot: string | null = null;
  if (modelled.length > 0) {
    const what = modelled.length === 1 ? modelled[0] : `${modelled.slice(0, -1).join(", ")} and ${modelled[modelled.length - 1]}`;
    const sentence = fill(COPY.cityGlance.footModelled, { what, verb: modelled.length === 1 ? "is" : "are" });
    foot = sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }

  return {
    slug,
    iso2,
    name: city.name,
    cells,
    figures: { visitors, days, density, hdi: null },
    withheld,
    basis,
    foot,
    confidence: cells.some((c) => c.confidence !== "measured") ? "modeled" : "measured",
  };
}
