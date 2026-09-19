/**
 * src/lib/markets/major_cities.ts
 *
 * THE CURATED SLATE, ON ITS OWN, WITH NO IMPORTS (plan step 34's third
 * dispatch, 2026-09-19). It lived inside across_cities.ts, which reads the
 * database and so loads the Supabase client on import; the industry page's
 * places builder (src/lib/spine/industry_places_rows.ts) needs only the
 * slate's SIZE, for its seat's line ("none of 15 cities holds a figure"),
 * and it is swept by the two copy gates inside the prebuild chain, which
 * must never need the network or a secret. A builder that imported the
 * slate from the resolver would have pulled the client into the chain and
 * thrown at load without an environment. So the list is here, dependency
 * free, and across_cities.ts imports and re-exports it unchanged: one
 * source of truth, the same fifteen entries in the same order.
 *
 * Each entry is the city's friendly URL slug (the geo part of a cell URL,
 * e.g. /us/miami/...) plus the country it sits in and the resident
 * population used for the density read. Drawn from the canonical top-cities
 * list (top100.json ids); a deliberate spread across regions and price tiers
 * so a business reads honestly worldwide, not just across one continent.
 * Cities that do not resolve cleanly for a given activity self-omit in the
 * resolver, so over-providing here is safe.
 */
export interface CityRef {
  /** Friendly geo slug, the {geo} segment of /{country}/{geo}/{activity}. */
  slug: string;
  /** ISO2 country slug, lowercased for the cell lookup. */
  country: string;
  /** Display fallback when a resolved cell carries no geo_name. */
  name: string;
  /** Resident population (metro), for the firms-per-10k density read. */
  population: number;
}

export const MAJOR_CITIES: CityRef[] = [
  { slug: "new-york", country: "us", name: "New York", population: 19_500_000 },
  { slug: "los-angeles", country: "us", name: "Los Angeles", population: 13_200_000 },
  { slug: "chicago", country: "us", name: "Chicago", population: 9_400_000 },
  { slug: "miami", country: "us", name: "Miami", population: 6_300_000 },
  { slug: "toronto", country: "ca", name: "Toronto", population: 6_400_000 },
  { slug: "london", country: "gb", name: "London", population: 9_500_000 },
  { slug: "paris", country: "fr", name: "Paris", population: 11_200_000 },
  { slug: "madrid", country: "es", name: "Madrid", population: 6_700_000 },
  { slug: "barcelona", country: "es", name: "Barcelona", population: 5_600_000 },
  { slug: "berlin", country: "de", name: "Berlin", population: 3_700_000 },
  { slug: "amsterdam", country: "nl", name: "Amsterdam", population: 2_500_000 },
  { slug: "tokyo", country: "jp", name: "Tokyo", population: 37_400_000 },
  { slug: "sydney", country: "au", name: "Sydney", population: 5_400_000 },
  { slug: "dubai", country: "ae", name: "Dubai", population: 3_500_000 },
  { slug: "singapore", country: "sg", name: "Singapore", population: 5_900_000 },
];
