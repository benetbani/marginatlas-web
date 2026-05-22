/**
 * Reformation idea #1 — place-first hero with photograph.
 *
 * Loads the pre-fetched city_heroes_v1.json (Unsplash API) at module
 * init and exposes a single helper.
 *
 * Honors 600 MB RAM cap — JSON file is ~100 KB. Imports inline at
 * build time so no node:fs required.
 */
import cityHeroesJson from "../../../data/images/city_heroes_v1.json";

export type CityHero = {
  city_slug: string;
  city_name: string;
  iso2: string;
  image_url_full: string;
  image_url_regular: string;
  image_url_small: string;
  image_url_thumb: string;
  blur_hash?: string;
  alt: string;
  photographer_name: string;
  photographer_username: string;
  photographer_url: string;
  unsplash_url: string;
  download_location: string;
};

type HeroesFile = {
  heroes: CityHero[];
};

const HEROES = (cityHeroesJson as unknown as HeroesFile).heroes || [];
const BY_SLUG: Record<string, CityHero> = {};
for (const h of HEROES) {
  BY_SLUG[h.city_slug] = h;
}

/**
 * Look up the pre-fetched hero for a city slug.
 * Returns undefined if no hero is cached for that city.
 */
export function getCityHero(citySlug: string | null | undefined): CityHero | undefined {
  if (!citySlug) return undefined;
  return BY_SLUG[citySlug.toLowerCase()];
}

/** Total cached heroes count (for diagnostics). */
export function totalCachedHeroes(): number {
  return HEROES.length;
}
