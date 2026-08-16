/**
 * src/lib/home/atlas_ledger.ts , the figures the homepage states about itself.
 *
 * WHY THESE ARE COMPUTED AND NOT TYPED. The homepage carried "105 countries"
 * for months. It matched nothing: the picker offers 195 and the atlas holds
 * benchmarks in 94. It was a figure from some earlier shape of the data, left
 * on the one surface where a wrong number costs most. Every figure here is
 * derived from the same source the page it links to is built from, so a claim
 * and its proof cannot drift.
 *
 * WHY IT LIVES IN lib/ AND NOT IN THE COMPONENT. The layering gate forbids
 * src/components and src/app from importing out of data/, and it caught the
 * first version of CatalogPlates doing exactly that. Same door, same reason:
 * a component that reaches into a data file owns a shape nobody typed.
 *
 * THE LAST FIELD IS THE POINT. `topFiveShare` says that two thirds of the
 * benchmarks sit in five countries. It is the least flattering number the site
 * could print about itself and the most useful one a reader can have, because
 * it says where the atlas is thin before they trust it somewhere thin. A
 * coverage claim without it is a boast; with it, it is a map.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import neighborhoodsJson from "../../../data/cities/neighborhoods_v1.json";
import { getCoverageRows } from "../coverage/report";
import { COUNTRIES, INDUSTRIES, isDefaultVisible } from "../taxonomy";

export type AtlasLedger = {
  /** Cells carrying a confidence tier. Never the allocated total. */
  benchmarks: number;
  /** Countries holding at least one classified benchmark. */
  countriesMeasured: number;
  /** Countries with a page, measured or not. */
  countriesTotal: number;
  cities: number;
  districts: number;
  trades: number;
  /** Percent of all benchmarks held by the five deepest countries. */
  topFiveShare: number;
  /** Those five, deepest first, for naming them rather than implying them. */
  topFive: string[];
};

let cached: AtlasLedger | null = null;

export function getAtlasLedger(): AtlasLedger {
  if (cached) return cached;

  const rows = getCoverageRows();
  const benchmarks = rows.reduce((n, r) => n + r.cellCount, 0);
  const topFive = rows.slice(0, 5);
  const topFiveTotal = topFive.reduce((n, r) => n + r.cellCount, 0);

  cached = {
    benchmarks,
    countriesMeasured: rows.length,
    countriesTotal: COUNTRIES.length,
    cities: (cityListJson as { cities: unknown[] }).cities.length,
    districts: Object.values(
      (neighborhoodsJson as { cities: Record<string, { neighborhoods: unknown[] }> }).cities,
    ).reduce((n, v) => n + v.neighborhoods.length, 0),
    trades: INDUSTRIES.filter(isDefaultVisible).length,
    topFiveShare: benchmarks > 0 ? Math.round((topFiveTotal / benchmarks) * 100) : 0,
    topFive: topFive.map((r) => r.name),
  };
  return cached;
}
