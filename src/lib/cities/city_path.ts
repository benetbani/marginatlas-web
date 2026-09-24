/**
 * src/lib/cities/city_path.ts
 *
 * THE CITY UNDER ITS COUNTRY'S PATH (QUEUE launch:gb-london-404; the goal's
 * D4, 2026-09-24). A reader on `/gb/london/barbershops` who trims the last part
 * of the address lands on `/gb/london`, which answered "Not found" (fetched on
 * production 2026-09-22 and again after the first fix, which put the redirect in
 * the region route: the edge middleware's not-held rewrite pinned a 404 before
 * the route ran). London is a city, not a region of the United Kingdom, and its
 * page lives at `/cities/london`. The slug rule says add, never rename, so the
 * two-segment path REDIRECTS to the city's page, permanently, wherever the
 * country holds a city of that slug; the middleware asks this before its
 * rewrite, and the region route asks it after its own region lookup, so a
 * region of the same name always wins.
 *
 * Reads the generated slug table (src/lib/routing/city_paths_generated.ts,
 * written by scripts/gen_city_paths.ts from data/cities/city_list_v1.json), a
 * few kilobytes, because the middleware runs at the edge on every request and
 * the list itself is 216 KB of fields it never reads.
 */
import { CITY_SLUGS_BY_COUNTRY } from "@/lib/routing/city_paths_generated";

const SLUGS = new Map<string, Set<string>>(Object.entries(CITY_SLUGS_BY_COUNTRY).map(([cc, slugs]) => [cc, new Set(slugs)]));

/** `/cities/<slug>` where the country (ISO 3166 alpha-2, any case) holds a listed city of that slug; null otherwise. */
export function cityPathFor(iso2: string, geo: string): string | null {
  const cc = String(iso2 ?? "").trim().toLowerCase();
  const slug = String(geo ?? "").trim().toLowerCase();
  return slug && SLUGS.get(cc)?.has(slug) ? `/cities/${slug}` : null;
}
