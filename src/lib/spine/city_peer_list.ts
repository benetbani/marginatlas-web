/**
 * src/lib/spine/city_peer_list.ts
 *
 * ONE ROW OF THE CITY PEERS TABLE'S SEED (adapt_city.ts builds the list, peer_rows.ts `buildCityPeerTable` draws it), pure over
 * the city list and the two builders the page's other cards read, so the table and the masthead print one figure per city.
 * Split out of adapt_city.ts on plan 06, task B3 (2026-10-04), so a chain test can build a row without the adapter's database
 * client.
 *
 *  - rent_index: the list's cost-of-living index (the table puts it on the city scale);
 *  - median_income_usd: the city's typical pay off city_income.ts, a dash where the builder falls back to the country's;
 *  - visitors_m: the one resolver (city_glance_rows.ts `cityVisitorsM`): the sourced count the masthead prints (London's 20.9M,
 *    2024), and a dash for a peer whose count is a divisor of its country's (Munich, Osaka), never the list's 16.0M or 7.0M
 *    beside a counted figure.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import { cityTypicalIncome } from "@/lib/spine/city_income";
import { cityVisitorsM } from "@/lib/spine/city_glance_rows";

type CityRow = { slug: string; name: string; iso2: string; cost_of_living_index?: number; tourist_arrivals_m?: number; sources?: Record<string, string> };
const BY_SLUG = new Map((cityListJson as { cities: CityRow[] }).cities.map((c) => [c.slug, c]));

export type CityPeerListRow = {
  name: string;
  /** The slug and the country code, carried since run 22 for the peers table's row key and flag. */
  slug: string;
  iso2: string;
  home: boolean;
  rent_index: number | undefined;
  median_income_usd: number | undefined;
  visitors_m: number | undefined;
};

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** The row for a city on the list, or null for a slug the list does not hold. `name` defaults to the list's. */
export function cityPeerListRow(slug: string, home: boolean, name?: string): CityPeerListRow | null {
  const c = BY_SLUG.get(slug);
  if (!c) return null;
  const pay = cityTypicalIncome(slug);
  const seen = cityVisitorsM(c);
  return {
    name: name ?? c.name,
    slug: c.slug,
    iso2: c.iso2,
    home,
    rent_index: isNum(c.cost_of_living_index) ? Math.round(c.cost_of_living_index) : undefined,
    median_income_usd: pay && pay.from === "city" ? pay.value : undefined,
    visitors_m: seen == null ? undefined : +seen.toFixed(1),
  };
}
