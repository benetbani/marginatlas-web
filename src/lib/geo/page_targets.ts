/**
 * src/lib/geo/page_targets.ts , which place pages actually exist.
 *
 * WHY THIS IS ITS OWN MODULE. The equivalent resolvers live in
 * `related_links.ts`, which imports a Supabase client because it also fetches
 * rows. That is right for that module and wrong for everyone else: importing it
 * into the country adapter dragged a database client into a pure transformer,
 * and the adapter threw at module load trying to construct one.
 *
 * These two need nothing but two static tables, so they live where any surface
 * can ask "does this page exist" without paying for a database connection to
 * find out. That is the only way they get used everywhere they should be.
 *
 * They exist at all because of seven live link defects found in one night, every
 * one a URL assembled from parts and hoped over. The worst did not even 404:
 * "All of New York" opened New York STATE, because `new-york` is a city in one
 * list and a state in another.
 *
 * PURE. No fetch, no client, no environment. Unit-runnable.
 */
import { COUNTRIES } from "@/lib/taxonomy";
import { getCityIdentity } from "@/lib/cities/city_tier";
import { getRegionsForCountry } from "@/lib/regions/regions-by-country";

export type GeoPageTarget = { href: string; name: string; kind: "city" | "region" };
export type CountryPageTarget = { href: string; label: string };

/**
 * The country page, or null when we do not publish one.
 *
 * Checked against the same list `/[country]` gates on, so this cannot claim a
 * page the route would refuse. Greece is the case that proves it matters: the
 * country is held as `GR`, so every `/el` link ever emitted was dead, on every
 * Greek trade page, in the visible crumb and in the structured data.
 */
export function countryPageTarget(countrySlug: string): CountryPageTarget | null {
  const iso2 = (countrySlug ?? "").toUpperCase();
  const meta = COUNTRIES.find((c) => c.code === iso2);
  return meta ? { href: `/${iso2.toLowerCase()}`, label: meta.name } : null;
}

/**
 * The page for a place inside a country, or null when nothing resolves.
 *
 * A CITY IS TRIED FIRST AND THE ORDER IS LOAD-BEARING. The two-segment region
 * route accepts only US states and admin1 regions, so it 404s for a city slug.
 * Of 290 real country and place pairs, 248 resolve to nothing at all, which is
 * the scale at which "assemble it and trust it" produces dead links.
 *
 * Where this returns null the caller renders plain text or omits the link. It
 * must never fall back to the two-segment form, which is the bug this exists to
 * end.
 */
export function geoPageTarget(countrySlug: string, geoSlug: string): GeoPageTarget | null {
  const iso2 = (countrySlug ?? "").toUpperCase();
  const meta = COUNTRIES.find((c) => c.code === iso2);
  if (!meta) return null;
  const slug = (geoSlug ?? "").toLowerCase();
  if (!slug) return null;

  const city = getCityIdentity(slug);
  if (city && city.iso2.toUpperCase() === iso2) {
    return { href: `/cities/${slug}`, name: city.name, kind: "city" };
  }

  const region = getRegionsForCountry(iso2, meta.name).find((r) => r.value === slug);
  if (region) {
    return { href: `/${iso2.toLowerCase()}/${slug}`, name: region.label, kind: "region" };
  }
  return null;
}
