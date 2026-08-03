/**
 * front_page_figures.ts , every number the front page prints, in one place.
 *
 * WHY THIS MODULE EXISTS. The front page's whole argument is that it shows a
 * real answer before it asks for anything. That means it reads data, and a page
 * that reads `data/` directly is a layering violation the build gate rejects,
 * correctly: the presentation layer should receive typed figures, not parse
 * files. So the reads live here and the page consumes the result.
 *
 * TWO SHAPE TRAPS ARE HANDLED HERE, both of which a cast would hide.
 *
 * 1. `city_list_v1.json` is an OBJECT with a `cities` array, not an array. A
 *    `as unknown as Array<...>` cast typechecks clean and then throws
 *    "map is not a function" in the browser.
 * 2. That file also carries `totals.total: 200` while its `cities` array holds
 *    252. The file disagrees with itself. The array is the part that becomes
 *    routes, so the array is what gets counted. Nothing in `src/` currently
 *    reads `totals`, and nothing should start.
 */
import cellJson from "../../../data/cells/restaurants-in-london.json";
import cityListJson from "../../../data/cities/city_list_v1.json";

type CityEntry = { slug?: string; iso2?: string };

/** A figure as the cell files carry it: a value, and the route it came down. */
type Figure = { value?: number; tier?: string };
type Band = { taken?: number; lo?: number; hi?: number; tier?: string };

type CellShape = {
  population: Record<string, Figure & { p25?: { value: number } }>;
  modelRoom: Record<string, Band>;
};

/** The published tier vocabulary. Derived from the file, never authored here. */
const TIER_WORD: Record<string, string> = {
  measured: "Measured",
  built: "Built from published inputs",
  thin: "Thin",
};

export type FrontPageFigures = {
  /** What the middle restaurant in London takes in a year. */
  revenue: number;
  /** What its owner keeps on the conservative read. */
  keeps: number;
  /** The same, with running costs at their lowest. */
  keepsHi: number;
  /** One in four takes less than this. */
  p25: number;
  /** Percent of London restaurants paying their owner properly. */
  paidProperly: number;
  /** How the revenue figure was arrived at, in the site's own words. */
  revenueTier: string;
  /** Countries with a page. */
  countries: number;
  /** Cities with a page. */
  cities: number;
  /** Places whose figures have been reconciled line by line. */
  reconciled: number;
};

export function frontPageFigures(): FrontPageFigures {
  const C = cellJson as unknown as CellShape;
  const rows = (cityListJson as { cities: CityEntry[] }).cities;

  return {
    revenue: C.population.medianRevenue?.value ?? 0,
    keeps: C.modelRoom.ownerKeeps?.taken ?? 0,
    keepsHi: C.modelRoom.ownerKeeps?.hi ?? 0,
    p25: C.population.quartiles?.p25?.value ?? 0,
    paidProperly: C.population.ownerPaidProperly?.value ?? 0,
    revenueTier: TIER_WORD[C.population.medianRevenue?.tier ?? ""] ?? "",
    countries: new Set(rows.map((c) => c.iso2).filter(Boolean)).size,
    cities: rows.length,
    /* A CONSTANT, and deliberately not a directory count. Reading the
       filesystem at module scope is what broke forty consecutive deploys on
       this project: it works locally and the file is not there at build time.
       So this is maintained by hand, and the day a second cell is reconciled
       whoever does it updates this line. */
    reconciled: 1,
  };
}
