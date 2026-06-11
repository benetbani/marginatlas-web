/**
 * search_cascade.ts -- data for the homepage three-field search cascade
 * (country to city to business). Pure and client-safe (no node:fs): the city
 * list comes from the generated city-alias tables the navigator already uses.
 */
import {
  CITIES_BY_STATE,
  CITY_FRIENDLY_DISPLAY_LABEL,
} from "@/lib/cities/city_aliases_generated";

export type CascadeCity = { slug: string; label: string };

/** Title-case a hyphen slug as a last-resort label. */
function prettifySlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/**
 * Flat, region-free list of the curated cities for a country (iso2). Unions the
 * city slugs across the country's regions in CITIES_BY_STATE, labels each from
 * CITY_FRIENDLY_DISPLAY_LABEL, de-dupes, and sorts by label. Every returned slug
 * is a URL-resolving geo (the curated set has no gaps). Returns [] for a country
 * with no curated cities, so the caller offers "Anywhere" only.
 */
export function getCitiesForCountryCode(iso2: string): CascadeCity[] {
  const cc = iso2.toUpperCase();
  const byRegion = CITIES_BY_STATE[cc];
  if (!byRegion) return [];
  const labels = CITY_FRIENDLY_DISPLAY_LABEL[cc] || {};
  const seen = new Set<string>();
  const out: CascadeCity[] = [];
  for (const region of Object.keys(byRegion)) {
    for (const slug of byRegion[region]) {
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push({ slug, label: labels[slug] || prettifySlug(slug) });
    }
  }
  out.sort((a, b) => a.label.localeCompare(b.label));
  return out;
}

export type CascadePrefill = {
  /** iso2 upper, matches the NavigatorForm country state + a COUNTRIES code. */
  country: string;
  /** A curated city slug (a resolving geo), or "" for "Anywhere in {country}". */
  city: string;
  /** An industry id (visibleIndustries .id); the form emits industryToSlug(id). */
  business: string;
};

/**
 * Curated rotating pre-fill examples. Each lands on a real, data-rich cell:
 * city-level entries use confirmed curated city slugs with restaurants (the most
 * widely covered activity); the "Anywhere" entries resolve to a country's
 * curated default region and reuse the homepage's confirmed example cells (UK
 * law, US software). The search_cascade test asserts every entry is valid.
 */
export const CASCADE_PREFILLS: CascadePrefill[] = [
  { country: "US", city: "los-angeles",   business: "restaurants" },
  { country: "GB", city: "",              business: "legal_services" },
  { country: "ES", city: "barcelona",     business: "restaurants" },
  { country: "US", city: "",              business: "software_development" },
  { country: "FR", city: "paris",         business: "restaurants" },
  { country: "JP", city: "tokyo",         business: "restaurants" },
  { country: "US", city: "new-york",      business: "restaurants" },
  { country: "DE", city: "munich",        business: "restaurants" },
];
