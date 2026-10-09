/**
 * src/lib/taxonomy/retired_paths.ts
 *
 * A RETIRED TRADE UNDER A PLACE (milestone 1, M1; his interview of 2026-09-26, answer 12: "permanent redirect to the nearest live
 * page"; QUEUE launch:retired-trades-live). The middleware has redirected `/industries/<retired>` since 2026-08-21, but the same
 * trade under a place, `/gb/london/banking` or `/us/new-york/banking`, still answered 200 with a default page (probed on production
 * 2026-10-04). This sends it, in one hop, to the nearest page that lives:
 *  - a trade MERGED into another (its retired entry points at `/industries/<successor>`): the successor's page in the same place
 *    (`/gb/london/sit-down-restaurants` to `/gb/london/restaurants`), every successor a live trade by the generator's own rule;
 *  - a trade retired with no successor: the place's own page, a region's (`/us/new-york`), else the city's (`/cities/london`, the
 *    page `/gb/london` itself sends a reader to, so no chain), else the country's.
 *
 * Pure, and cheap enough for the edge: the retired table, the country list, the regions and the city slug table the middleware
 * already reads. Only a three-part path under a country code is a place path; `/cities/...`, `/industries/...` and a country's
 * static children (`/gb/how-to-open`) are never one.
 */
import { COUNTRIES } from "@/lib/taxonomy";
import { redirectFor } from "@/lib/taxonomy/retired";
import { getRegionsForCountry } from "@/lib/regions/regions-by-country";
import { COUNTRY_STATIC_CHILDREN, TOP_LEVEL_SEGMENTS } from "@/lib/routing/top_level_segments";
import { cityPathFor } from "@/lib/cities/city_path";
import { placeNotHeldIn } from "@/lib/routing/place_words";

/** Where a retired trade's place path goes, or null when the path is not a place path or its trade is not retired. */
export function retiredPlaceTarget(path: string): string | null {
  const parts = path.split("/").filter(Boolean).map((s) => s.toLowerCase());
  if (parts.length !== 3) return null;
  /* A place no table holds is the edge's 404, never a hop to the country (P1-A of the page architecture, 2026-10-09). */
  if (placeNotHeldIn(path)) return null;
  const [country, geo, slug] = parts;
  if (TOP_LEVEL_SEGMENTS.has(country) || COUNTRY_STATIC_CHILDREN.has(geo)) return null;
  const iso2 = country.toUpperCase();
  const meta = COUNTRIES.find((c) => c.code === iso2);
  if (!meta) return null;
  const to = redirectFor(slug);
  if (!to) return null;
  const merged = /^\/industries\/([a-z0-9-]+)$/.exec(to);
  if (merged) return `/${country}/${geo}/${merged[1]}`;
  if (getRegionsForCountry(iso2, meta.name).some((r) => r.value === geo)) return `/${country}/${geo}`;
  return cityPathFor(iso2, geo) ?? `/${country}`;
}
