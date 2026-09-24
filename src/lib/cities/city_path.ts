/**
 * src/lib/cities/city_path.ts
 *
 * THE CITY UNDER ITS COUNTRY'S PATH (QUEUE launch:gb-london-404; the goal's
 * D4, 2026-09-24). A reader on `/gb/london/barbershops` who trims the last part
 * of the address lands on `/gb/london`, and the region route answered "Not
 * found" there (fetched on production 2026-09-22): London is a city, not a
 * region of the United Kingdom, and the city's page lives at `/cities/london`.
 * The slug rule says add, never rename, so the two-segment path REDIRECTS to
 * the city's page, permanently, wherever the country holds a city of that
 * slug. No existing URL moves: a region of the same name still wins, because
 * the region route asks this only after its own lookup fails.
 *
 * Pure over the city list the city route itself reads
 * (`data/cities/city_list_v1.json`), so the gate
 * scripts/verify_city_path_redirect.ts can hold every city to its page.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";

type ListedCity = { slug: string; iso2: string };

const CITIES = (cityListJson as { cities: ListedCity[] }).cities;
const BY_SLUG = new Map(CITIES.map((c) => [String(c.slug).toLowerCase(), c]));

/** `/cities/<slug>` where the country (ISO 3166 alpha-2, any case) holds a listed city of that slug; null otherwise. */
export function cityPathFor(iso2: string, geo: string): string | null {
  const city = BY_SLUG.get(String(geo ?? "").trim().toLowerCase());
  if (!city) return null;
  return String(city.iso2).toUpperCase() === String(iso2 ?? "").trim().toUpperCase() ? `/cities/${city.slug}` : null;
}

/** Every listed city with its country, for the gate. */
export function listedCities(): ReadonlyArray<ListedCity> {
  return CITIES;
}
