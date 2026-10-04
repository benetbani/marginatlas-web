/**
 * src/lib/seo/indexable.ts
 *
 * WHICH SPINE PAGES A SEARCH ENGINE MAY INDEX (milestone 1, M10; his interview of 2026-09-26, answer 6: "UK pages + every page at
 * its floor; thin pages noindexed until they reach it", which supersedes his 2026-07-07 "sample pages still index").
 *
 *  - A UK page indexes, whatever its count: the country (`/gb` and everything under it: its how-to page, its trade pages) and the
 *    UK's cities with their neighbourhood pages (`/cities/<a UK city>`).
 *  - Any other spine page indexes only when the floor census counted it at its page type's floor (data/seo/floor_census.json,
 *    written by scripts/seo/floor_census.tsx with the model laws' BLOCK FLOOR counted on a static render; the floors are the
 *    model laws' own table, carried in the file).
 *  - A spine page the census holds no entry for is not indexed: "noindex on the rest".
 *
 * Read by each spine route's metadata (the robots tag) and by the sitemap (which lists only what may be indexed). Non-spine pages
 * (the articles, the static pages) are not this module's business.
 */
import censusJson from "../../../data/seo/floor_census.json";
import cityListJson from "../../../data/cities/city_list_v1.json";

type Census = { generated_at: string; floors: Record<string, number>; pages: Record<string, { surface: string; blocks: number }> };
const CENSUS = censusJson as unknown as Census;
const UK_CITIES = new Set(
  (cityListJson as { cities: Array<{ slug: string; iso2: string }> }).cities.filter((c) => String(c.iso2).toUpperCase() === "GB").map((c) => c.slug),
);

const norm = (path: string) => {
  const p = String(path || "/").toLowerCase().split(/[?#]/)[0];
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
};

/** True for a page of the United Kingdom: the country and everything under `/gb`, and a UK city with its neighbourhood pages. */
export function isUkPage(path: string): boolean {
  const p = norm(path);
  if (p === "/gb" || p.startsWith("/gb/")) return true;
  const city = /^\/cities\/([a-z0-9-]+)(?:\/|$)/.exec(p)?.[1];
  return !!city && UK_CITIES.has(city);
}

/** What the census counted for a page outside the UK, against its type's floor; null where it holds no entry. */
export function floorStanding(path: string): { surface: string; blocks: number; floor: number; atFloor: boolean } | null {
  const e = CENSUS.pages[norm(path)];
  if (!e) return null;
  const floor = CENSUS.floors[e.surface];
  return { surface: e.surface, blocks: e.blocks, floor, atFloor: typeof floor === "number" && e.blocks >= floor };
}

/** The rule: a UK page indexes; any other spine page indexes only when counted at its floor. */
export function isIndexable(path: string): boolean {
  if (isUkPage(path)) return true;
  return floorStanding(path)?.atFloor === true;
}

/** The robots value for a spine page's metadata: indexed or not, its links always followed. */
export function robotsFor(path: string): { index: boolean; follow: boolean } {
  return { index: isIndexable(path), follow: true };
}

/** When the census was written, for the sitemap's and the gate's reports. */
export const FLOOR_CENSUS_AT = CENSUS.generated_at;
