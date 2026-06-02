/**
 * src/lib/cells/geo.ts
 *
 * Architecture-audit strategy F (2026-05-27). Extracted from
 * src/lib/cells.ts to give the geo-resolution helpers their own
 * focused module. Re-exported from cells.ts so external imports
 * continue to work unchanged.
 *
 * Contents:
 *   - US_STATES, SLUG_TO_GEO_ID, GEO_ID_TO_NAME — US state lookup
 *     tables keyed by FIPS code / slug / geo_id.
 *   - slugify() — canonical URL slug producer.
 *   - regionalSlugToGeoId() — URL slug → regional_cells.geo_id.
 *   - listUsStates() — public iterator over US_STATES.
 *   - geoNameFromSlug() — best-effort human display label when no
 *     real DB row is available (used by synthesizeCell).
 */
import { lookupNeighborhoodGeoId } from "@/lib/cities";
import {
  CITY_FRIENDLY_TO_GEO_ID,
  CITY_FRIENDLY_DISPLAY_LABEL,
} from "@/lib/cities/city_aliases_generated";
import {
  MANUAL_FRIENDLY_TO_GEO_ID,
  MANUAL_DISPLAY_LABEL,
} from "@/lib/cities/manual_city_aliases";
import { getPopularPlaceName } from "@/lib/geo/popular_place_overrides";
import { REGIONS_BY_COUNTRY_AUTO } from "@/lib/regions/regions_generated";

// US state FIPS code → human name → URL slug
export const US_STATES: Record<string, { name: string; slug: string }> = {
  "01": { name: "Alabama", slug: "alabama" },
  "02": { name: "Alaska", slug: "alaska" },
  "04": { name: "Arizona", slug: "arizona" },
  "05": { name: "Arkansas", slug: "arkansas" },
  "06": { name: "California", slug: "california" },
  "08": { name: "Colorado", slug: "colorado" },
  "09": { name: "Connecticut", slug: "connecticut" },
  "10": { name: "Delaware", slug: "delaware" },
  "11": { name: "District of Columbia", slug: "district-of-columbia" },
  "12": { name: "Florida", slug: "florida" },
  "13": { name: "Georgia", slug: "georgia" },
  "15": { name: "Hawaii", slug: "hawaii" },
  "16": { name: "Idaho", slug: "idaho" },
  "17": { name: "Illinois", slug: "illinois" },
  "18": { name: "Indiana", slug: "indiana" },
  "19": { name: "Iowa", slug: "iowa" },
  "20": { name: "Kansas", slug: "kansas" },
  "21": { name: "Kentucky", slug: "kentucky" },
  "22": { name: "Louisiana", slug: "louisiana" },
  "23": { name: "Maine", slug: "maine" },
  "24": { name: "Maryland", slug: "maryland" },
  "25": { name: "Massachusetts", slug: "massachusetts" },
  "26": { name: "Michigan", slug: "michigan" },
  "27": { name: "Minnesota", slug: "minnesota" },
  "28": { name: "Mississippi", slug: "mississippi" },
  "29": { name: "Missouri", slug: "missouri" },
  "30": { name: "Montana", slug: "montana" },
  "31": { name: "Nebraska", slug: "nebraska" },
  "32": { name: "Nevada", slug: "nevada" },
  "33": { name: "New Hampshire", slug: "new-hampshire" },
  "34": { name: "New Jersey", slug: "new-jersey" },
  "35": { name: "New Mexico", slug: "new-mexico" },
  "36": { name: "New York", slug: "new-york" },
  "37": { name: "North Carolina", slug: "north-carolina" },
  "38": { name: "North Dakota", slug: "north-dakota" },
  "39": { name: "Ohio", slug: "ohio" },
  "40": { name: "Oklahoma", slug: "oklahoma" },
  "41": { name: "Oregon", slug: "oregon" },
  "42": { name: "Pennsylvania", slug: "pennsylvania" },
  "44": { name: "Rhode Island", slug: "rhode-island" },
  "45": { name: "South Carolina", slug: "south-carolina" },
  "46": { name: "South Dakota", slug: "south-dakota" },
  "47": { name: "Tennessee", slug: "tennessee" },
  "48": { name: "Texas", slug: "texas" },
  "49": { name: "Utah", slug: "utah" },
  "50": { name: "Vermont", slug: "vermont" },
  "51": { name: "Virginia", slug: "virginia" },
  "53": { name: "Washington", slug: "washington" },
  "54": { name: "West Virginia", slug: "west-virginia" },
  "55": { name: "Wisconsin", slug: "wisconsin" },
  "56": { name: "Wyoming", slug: "wyoming" },
};

export const SLUG_TO_GEO_ID: Record<string, string> = Object.fromEntries(
  Object.entries(US_STATES).map(([fips, v]) => [v.slug, `US-${fips}`]),
);

export const GEO_ID_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(US_STATES).map(([fips, v]) => [`US-${fips}`, v.name]),
);

export function slugify(s: string | null | undefined): string {
  if (!s) return "";
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Convert a URL slug to a regional_cells geo_id. Handles the four
 * observed patterns:
 *   - EU NUTS (no prefix):     'de212'             → 'DE212'
 *   - JP / BR / CA prefixed:   'jp-13000'          → 'JP-13000'
 *   - US county (FIPS):        'us-06-037'         → 'US-06-037'
 *   - City overlay:            'us-city-new-york'  → 'US-CITY-new-york'
 *
 * The city-overlay case is special because the city name part stays
 * lowercase in the geo_id; everything else uppercases cleanly.
 */
export function regionalSlugToGeoId(country: string, geoSlug: string): string {
  const c = country.toUpperCase();
  const slug = geoSlug.toLowerCase();
  // Manual city alias supplement. Checked BEFORE the auto-generated
  // map so hand-curated entries (Frankfurt → DE712, not the NUTS-1
  // Hessen region) take precedence. Fixes the founder-reported
  // "/de/frankfurt → Hessen" bug.
  const manual = MANUAL_FRIENDLY_TO_GEO_ID[c]?.[slug];
  if (manual) {
    if (manual.includes("-city-")) {
      const idx = manual.indexOf("-city-");
      const prefix = manual.slice(0, idx).toUpperCase();
      return `${prefix}-CITY-${manual.slice(idx + 6)}`;
    }
    return manual.toUpperCase();
  }
  // Friendly city aliases. Resolves URLs like
  // /us/los-angeles/restaurants → cells lookup against US-06-037.
  const friendly = CITY_FRIENDLY_TO_GEO_ID[c]?.[slug];
  if (friendly) {
    if (friendly.includes("-city-")) {
      const idx = friendly.indexOf("-city-");
      const prefix = friendly.slice(0, idx).toUpperCase();
      return `${prefix}-CITY-${friendly.slice(idx + 6)}`;
    }
    return friendly.toUpperCase();
  }
  // Neighborhood alias (Track O): friendly names like 'manhattan' → 'US-36-061'.
  const aliased = lookupNeighborhoodGeoId(c, slug);
  if (aliased) return aliased;
  const cityPrefix = `${c.toLowerCase()}-city-`;
  if (slug.startsWith(cityPrefix)) {
    return `${c}-CITY-${slug.slice(cityPrefix.length)}`;
  }
  return slug.toUpperCase();
}

export function listUsStates(): { name: string; slug: string }[] {
  return Object.values(US_STATES).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Best-effort human label for a geo slug when we don't have a real
 * cell row to read geo_name from. Used by synthesizeCell to render a
 * sensible hero (e.g. "Frankfurt am Main" instead of "DE71").
 *
 * Popular-name override fires FIRST, so Quintana Roo displays as
 * Cancún (the name the world knows) regardless of which data source
 * the row came from. One name, one place.
 */
export function geoNameFromSlug(country: string, geoSlug: string): string | undefined {
  // Popular-name overrides take priority.
  const popular = getPopularPlaceName(country, geoSlug);
  if (popular) return popular;
  const manualLabel = MANUAL_DISPLAY_LABEL[country]?.[geoSlug.toLowerCase()];
  if (manualLabel) return manualLabel;
  const friendlyLabel =
    CITY_FRIENDLY_DISPLAY_LABEL[country]?.[geoSlug.toLowerCase()];
  if (friendlyLabel) return friendlyLabel;
  // US state slug
  const usState = SLUG_TO_GEO_ID[geoSlug.toLowerCase()];
  if (usState) return GEO_ID_TO_NAME[usState];
  // Sub-national region code (NUTS / province) via the generated table.
  // Exact match first; for a NUTS3 code not listed (e.g. es511) fall back to
  // the nearest listed parent (es51 -> Cataluna) by trimming trailing digits.
  const regions = REGIONS_BY_COUNTRY_AUTO[country.toUpperCase()];
  if (regions) {
    const lc = geoSlug.toLowerCase();
    const exact = regions.find((r) => r.value === lc);
    if (exact) return exact.label;
    if (/^[a-z]{2}\d+$/.test(lc)) {
      let code = lc;
      while (code.length > 3) {
        code = code.slice(0, -1);
        const parent = regions.find((r) => r.value === code);
        if (parent) return parent.label;
      }
    }
  }
  return undefined;
}
