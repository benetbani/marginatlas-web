/**
 * Sanity Section 7 - country hero image lookup.
 *
 * Mirrors city_heroes.ts but keyed by ISO2 country code.
 *
 * Two-tier lookup:
 *   1. data/images/country_heroes_v1.json - the §7 Pexels/Unsplash fill
 *      (added in this commit for countries not covered by the legacy
 *      Wikimedia manifest, plus pattern-card fallbacks for the long
 *      tail where neither editorial source had a usable image).
 *   2. data/images/countries_manifest.json - the legacy Wikimedia
 *      manifest (126 countries) built by build_country_industry_images
 *      and friends. Used as a fallback so we get instant coverage for
 *      every country already present there.
 *
 * The file may not exist on first checkout (the §7 file is generated).
 * Both loaders are guarded so build does not break.
 *
 * Honors 600 MB RAM cap - manifests are small (<200 KB combined).
 */

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
  source: "unsplash" | "pexels" | "pattern" | "wikimedia";
  source_url: string;
};

type CountryHeroesFile = {
  heroes?: Array<Partial<CountryHero> & { country_iso2?: string; iso2?: string; slug?: string; name?: string }>;
};

type LegacyManifestEntry = {
  url: string;
  source?: string;
  attribution?: string;
  license?: string;
  width?: number | null;
  height?: number | null;
  description?: string | null;
};

let CACHE: Record<string, CountryHero> | undefined;

function loadHeroes(): Record<string, CountryHero> {
  if (CACHE) return CACHE;
  const map: Record<string, CountryHero> = {};

  // Tier 1: load the new §7 file. Pattern entries land here too so
  // pattern fallbacks win over the legacy Wikimedia entry only when we
  // explicitly chose pattern for that country.
  try {
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
        source: (h.source as CountryHero["source"]) || "unsplash",
        source_url: h.source_url || "",
      };
    }
  } catch {
    // file missing or unreadable
  }

  // Tier 2: layer the legacy Wikimedia manifest UNDER tier 1 (only fill
  // ISO2 slots that don't already have a real photo). Pattern fallbacks
  // from tier 1 are over-ridden here because a real Wikimedia photo is
  // better than a pattern card.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const legacy = require("../../../data/images/countries_manifest.json") as Record<
      string,
      LegacyManifestEntry[]
    >;
    for (const [iso2Raw, arr] of Object.entries(legacy)) {
      const iso2 = iso2Raw.toUpperCase();
      const entry = arr && arr[0];
      if (!entry || !entry.url) continue;
      const existing = map[iso2];
      if (existing && existing.variant === "photo") continue; // tier-1 photo wins
      // Pattern from tier 1, or unknown: use legacy
      map[iso2] = {
        country_iso2: iso2,
        country_name: existing?.country_name || iso2,
        image_url_full: entry.url,
        image_url_regular: entry.url,
        image_url_small: entry.url,
        image_url_thumb: entry.url,
        alt: entry.description || `${iso2} landscape`,
        photographer_name: stripHtml(entry.attribution || "Wikimedia Commons"),
        photographer_username: "",
        photographer_url: "https://commons.wikimedia.org/",
        download_location: "",
        variant: "photo",
        source: "wikimedia",
        source_url: entry.url,
      };
    }
  } catch {
    // legacy missing; tier 1 stands alone
  }

  CACHE = map;
  return map;
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 120);
}

/**
 * Look up the pre-fetched hero for a country ISO2 code.
 * Returns undefined if no hero is cached for that country.
 *
 * Note: the returned record may have variant="pattern" if no editorial
 * image was found in either tier. Callers that render <img> should
 * branch on variant and render their pattern-card component for the
 * pattern case.
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
