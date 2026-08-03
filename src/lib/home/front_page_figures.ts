/**
 * front_page_figures.ts , every number the front page prints, in one place.
 *
 * WHY THIS MODULE EXISTS. The front page's whole argument is that it shows a
 * real answer before it asks for anything. That means it reads data, and a page
 * that reads `data/` directly is a layering violation the build gate rejects,
 * correctly: the presentation layer should receive typed figures, not parse
 * files. So the reads live here and the page consumes the result.
 *
 * THE TRAP THAT MATTERS MOST IS NOT A SHAPE TRAP. This file carries TWO
 * different restaurants and they are easy to mix:
 *
 *   `population.*`  , the whole trade. medianRevenue 414K, quartiles, survival.
 *   `modelRoom.*`   , ONE explicit scenario, a 100 sqm room taking 618K, which
 *                     the file itself says "is not the typical room; it sits
 *                     near the 62nd percentile of the trade".
 *
 * Only `modelRoom` has a cost stack, so only `modelRoom` has an owner-keeps
 * figure. Printing that keeps figure next to `medianRevenue` reads as "the
 * typical restaurant takes 414K and keeps 43K" and is FALSE: the 43K belongs to
 * a room taking 618K. The median room keeps less. That pairing was live on this
 * page and passed every gate, because no gate can see that two true numbers
 * describe different subjects. The names here are deliberately unmistakable.
 *
 * TWO SHAPE TRAPS ARE ALSO HANDLED HERE, both of which a cast would hide.
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
type Band = { taken?: number; lo?: number; hi?: number; tier?: string; value?: number };

type Quartile = { value: number; notes?: string };

type CellShape = {
  population: Record<string, Figure & {
    p25?: Quartile;
    p50?: Quartile;
    p75?: Quartile;
    claim?: string;
    reality?: string;
  }>;
  modelRoom: Record<string, Band>;
};

/** The published tier vocabulary. Derived from the file, never authored here. */
const TIER_WORD: Record<string, string> = {
  measured: "Measured",
  built: "Built from published inputs",
  thin: "Thin",
};

export type FrontPageFigures = {
  /** What the MODELLED ROOM takes in a year. Not the median. */
  roomRevenue: number;
  /** That room's floor area, the thing every cost line is priced against. */
  roomSqm: number;
  /** Where that room sits on the trade's distribution. */
  roomPercentile: number;
  /** What the MIDDLE restaurant takes in a year. A population figure. */
  medianRevenue: number;
  /** What its owner keeps on the conservative read. */
  keeps: number;
  /** The same, with running costs at their lowest. */
  keepsHi: number;
  /** One in four takes less than this. */
  p25: number;
  /** One in four takes more than this. The spread is the story. */
  p75: number;
  /** The file's own note on the shape of that distribution. */
  skewNote: string;
  /** What everyone says, and what is actually true. */
  myth: { claim: string; reality: string } | null;
  /** Percent of London restaurants paying their owner properly. */
  paidProperly: number;
  /** How the ROOM's revenue was arrived at. Belongs to roomRevenue, not to
   *  medianRevenue: a tier shown beside the wrong figure is its own defect. */
  roomTier: string;
  /** Share of London restaurants taking more than the modelled room. */
  takeMoreThanRoom: number;
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
    roomRevenue: C.modelRoom.revenue?.value ?? 0,
    roomSqm: C.modelRoom.floorAreaSqm?.value ?? 0,
    roomPercentile: C.modelRoom.percentileOfPopulation?.value ?? 0,
    medianRevenue: C.population.medianRevenue?.value ?? 0,
    keeps: C.modelRoom.ownerKeeps?.taken ?? 0,
    keepsHi: C.modelRoom.ownerKeeps?.hi ?? 0,
    p25: C.population.quartiles?.p25?.value ?? 0,
    p75: C.population.quartiles?.p75?.value ?? 0,
    skewNote: C.population.quartiles?.p75?.notes ?? "",
    /* Self-omits rather than inventing a correction. A myth section with a
       claim and no reality is worse than no myth section. */
    myth:
      C.population.myth?.claim && C.population.myth?.reality
        ? { claim: C.population.myth.claim, reality: C.population.myth.reality }
        : null,
    paidProperly: C.population.ownerPaidProperly?.value ?? 0,
    roomTier: TIER_WORD[C.modelRoom.revenue?.tier ?? ""] ?? "",
    takeMoreThanRoom: 100 - (C.modelRoom.percentileOfPopulation?.value ?? 0),
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
