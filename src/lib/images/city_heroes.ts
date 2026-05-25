/**
 * Reformation idea #1 — place-first hero with photograph.
 *
 * Loads the pre-fetched city_heroes_v1.json (Unsplash + Pexels + pattern
 * fallback) at module init and exposes typed lookup helpers.
 *
 * Sanity Section 7 — the file now also includes "pattern" variants for
 * cities where no good editorial image could be found. Callers must
 * branch on `variant` if they want to render a pattern card instead of
 * an <img>; getCityHero() still returns the record so the caller can
 * decide.
 *
 * Honors 600 MB RAM cap — JSON file is ~200 KB. Imports inline at
 * build time so no node:fs required.
 */
import cityHeroesJson from "../../../data/images/city_heroes_v1.json";

export type CityHeroVariant = "photo" | "pattern";

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
  /** Legacy field — kept for backwards compat with existing renderers. */
  unsplash_url: string;
  download_location: string;
  /** Sanity §7 additions. Optional so legacy records still type-check. */
  variant?: CityHeroVariant;
  source?: "unsplash" | "pexels" | "pattern";
  source_url?: string;
};

type HeroesFile = {
  heroes: Array<Partial<CityHero> & { city_slug: string; city_name?: string; iso2?: string; slug?: string; name?: string }>;
};

function normalize(h: HeroesFile["heroes"][number]): CityHero {
  // Some records (post-§7) use slug/name, others (legacy) use city_slug/city_name.
  // unsplash_url was renamed to source_url in §7 — accept both.
  const city_slug = h.city_slug || h.slug || "";
  const city_name = h.city_name || h.name || "";
  const sourceUrl = h.source_url || h.unsplash_url || "";
  return {
    city_slug,
    city_name,
    iso2: h.iso2 || "",
    image_url_full: h.image_url_full || "",
    image_url_regular: h.image_url_regular || "",
    image_url_small: h.image_url_small || "",
    image_url_thumb: h.image_url_thumb || "",
    blur_hash: h.blur_hash,
    alt: h.alt || `${city_name} cityscape`,
    photographer_name: h.photographer_name || "",
    photographer_username: h.photographer_username || "",
    photographer_url: h.photographer_url || "",
    unsplash_url: sourceUrl,
    download_location: h.download_location || "",
    variant: h.variant || "photo",
    source: h.source || (sourceUrl.includes("pexels") ? "pexels" : "unsplash"),
    source_url: sourceUrl,
  };
}

const HEROES: CityHero[] = ((cityHeroesJson as unknown as HeroesFile).heroes || []).map(
  normalize,
);
const BY_SLUG: Record<string, CityHero> = {};
for (const h of HEROES) {
  if (h.city_slug) BY_SLUG[h.city_slug.toLowerCase()] = h;
}

/**
 * Look up the pre-fetched hero for a city slug.
 * Returns undefined if no hero is cached for that city.
 *
 * Note: the returned record may have variant="pattern" if no editorial
 * image was found. Callers that render <img> should branch on variant
 * and render their pattern-card component for the pattern case.
 */
export function getCityHero(citySlug: string | null | undefined): CityHero | undefined {
  if (!citySlug) return undefined;
  return BY_SLUG[citySlug.toLowerCase()];
}

/** Total cached heroes count (for diagnostics). */
export function totalCachedHeroes(): number {
  return HEROES.length;
}

/** True if the hero is a pattern-card fallback (no editorial photo). */
export function isPatternHero(hero: CityHero | undefined): boolean {
  return !!hero && hero.variant === "pattern";
}
