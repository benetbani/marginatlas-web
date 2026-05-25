/**
 * Sanity §7 - country hero image lookup.
 *
 * Mirrors city_heroes.ts but keyed by ISO2 country code. Reads from
 * data/images/country_heroes_v1.json which is populated by
 * scripts/images/import_unsplash.ts.
 *
 * The file may not exist on first checkout (the script writes it the
 * first time it runs). Guarded so build does not break.
 *
 * Honors 600 MB RAM cap - JSON file is small (<100 KB).
 */

// We import via require-on-load (try/catch) because the file is generated
// and may not exist on a fresh clone. Using a static `import` would crash
// the build when the JSON is missing.
import type { CityHeroVariant } from "./city_heroes";

export type CountryHero = {
  country_iso2: string;
  country_name: string;
  image_url_full: string;
  image_url_regular: string;
  image_url_small: string;
  image_url_thumb: string;
  blur_hash?: string;
  alt: string;
  photographer_name: string;
  photographer_username: string;
  photographer_url: string;
  download_location: string;
  variant: CityHeroVariant;
  source: "unsplash" | "pexels" | "pattern";
  source_url: string;
};

type CountryHeroesFile = {
  heroes?: Array<Partial<CountryHero> & { country_iso2?: string; iso2?: string; slug?: string; name?: string }>;
};

let CACHE: Record<string, CountryHero> | undefined;

function loadHeroes(): Record<string, CountryHero> {
  if (CACHE) return CACHE;
  const map: Record<string, CountryHero> = {};
  try {
    // Dynamic require so missing file does not break build.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const data = require("../../../data/images/country_heroes_v1.json") as CountryHeroesFile;
    for (const h of data.heroes || []) {
      const iso2 = (h.country_iso2 || h.iso2 || h.slug || "").toUpperCase();
      if (!iso2) continue;
      map[iso2] = {
        country_iso2: iso2,
        country_name: h.country_name || h.name || iso2,
        image_url_full: h.image_url_full || "",
        image_url_regular: h.image_url_regular || "",
        image_url_small: h.image_url_small || "",
        image_url_thumb: h.image_url_thumb || "",
        blur_hash: h.blur_hash,
        alt: h.alt || `${h.country_name || iso2} landscape`,
        photographer_name: h.photographer_name || "",
        photographer_username: h.photographer_username || "",
        photographer_url: h.photographer_url || "",
        download_location: h.download_location || "",
        variant: (h.variant as CityHeroVariant) || "photo",
        source: (h.source as "unsplash" | "pexels" | "pattern") || "unsplash",
        source_url: h.source_url || "",
      };
    }
  } catch {
    // file missing or unreadable; return empty map
  }
  CACHE = map;
  return map;
}

/**
 * Look up the pre-fetched hero for a country ISO2 code.
 * Returns undefined if no hero is cached for that country.
 *
 * Note: the returned record may have variant="pattern" if no editorial
 * image was found. Callers that render <img> should branch on variant
 * and render their pattern-card component for the pattern case.
 */
export function getCountryHero(iso2: string | null | undefined): CountryHero | undefined {
  if (!iso2) return undefined;
  const map = loadHeroes();
  return map[iso2.toUpperCase()];
}

/** Total cached country heroes count (for diagnostics). */
export function totalCachedCountryHeroes(): number {
  return Object.keys(loadHeroes()).length;
}

/** True if the hero is a pattern-card fallback (no editorial photo). */
export function isPatternCountryHero(hero: CountryHero | undefined): boolean {
  return !!hero && hero.variant === "pattern";
}
