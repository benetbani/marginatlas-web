/**
 * src/lib/spine/city_cards.ts
 *
 * THE CARD PAGER'S CARDS for a country: the covered cities that have a page,
 * each with its region, its link and its photograph when one is held (the
 * same file the city hero shows, founder ruling 2 of 2026-09-04). Local and
 * synchronous, the adapter's own rules: up to eight cities, a city without a
 * page is dropped, a trailing parenthetical is dropped from the name.
 */
import { getCitiesForCountry, type CityEntry } from "@/lib/cities";
import { cityPageHref, cityPageSlug } from "@/lib/cities/city_pages";
import { cityImageSrc } from "@/lib/cities/city_images";

export type CityCard = { id: string; name: string; sub?: string; href: string; image: string | null };
export type CityCards = { cards: CityCard[]; allHref: string };

/** Null when the country has no covered city with a page. */
export function buildCityCards(iso2In: string): CityCards | null {
  const iso2 = iso2In.toUpperCase();
  const rows = getCitiesForCountry(iso2).slice(0, 8);
  const cards: CityCard[] = [];
  for (const c of rows as CityEntry[]) {
    const href = cityPageHref(iso2, c.name);
    if (!href) continue;
    const slug = cityPageSlug(iso2, c.name);
    cards.push({ id: c.id, name: String(c.name).replace(/\s*\([^)]*\)\s*$/, ""), sub: c.region_name?.trim() || undefined, href, image: cityImageSrc(slug) });
  }
  if (cards.length === 0) return null;
  return { cards, allHref: `/cities#c-${iso2.toLowerCase()}` };
}
