/**
 * Plan v21 Block 2 — public wrapper around the auto-generated regions
 * table.
 *
 * Source of truth: REGIONS_BY_COUNTRY_AUTO in regions_generated.ts,
 * built by scripts/regions/build_regions_table.ts from regional_cells.
 * Currently covers 199 countries with 1163 region entries.
 *
 * US is overridden with the canonical state-slug list because cell pages
 * for US states (cells_master) use slugs like "california", not the
 * regional_cells geo_id form. Every other country reads from the auto
 * table directly.
 */
import { REGIONS_BY_COUNTRY_AUTO } from "./regions_generated";

export type RegionOption = {
  value: string;
  label: string;
};

const US_STATES: RegionOption[] = [
  { value: "alabama", label: "Alabama" },
  { value: "alaska", label: "Alaska" },
  { value: "arizona", label: "Arizona" },
  { value: "arkansas", label: "Arkansas" },
  { value: "california", label: "California" },
  { value: "colorado", label: "Colorado" },
  { value: "connecticut", label: "Connecticut" },
  { value: "delaware", label: "Delaware" },
  { value: "district-of-columbia", label: "District of Columbia" },
  { value: "florida", label: "Florida" },
  { value: "georgia", label: "Georgia" },
  { value: "hawaii", label: "Hawaii" },
  { value: "idaho", label: "Idaho" },
  { value: "illinois", label: "Illinois" },
  { value: "indiana", label: "Indiana" },
  { value: "iowa", label: "Iowa" },
  { value: "kansas", label: "Kansas" },
  { value: "kentucky", label: "Kentucky" },
  { value: "louisiana", label: "Louisiana" },
  { value: "maine", label: "Maine" },
  { value: "maryland", label: "Maryland" },
  { value: "massachusetts", label: "Massachusetts" },
  { value: "michigan", label: "Michigan" },
  { value: "minnesota", label: "Minnesota" },
  { value: "mississippi", label: "Mississippi" },
  { value: "missouri", label: "Missouri" },
  { value: "montana", label: "Montana" },
  { value: "nebraska", label: "Nebraska" },
  { value: "nevada", label: "Nevada" },
  { value: "new-hampshire", label: "New Hampshire" },
  { value: "new-jersey", label: "New Jersey" },
  { value: "new-mexico", label: "New Mexico" },
  { value: "new-york", label: "New York" },
  { value: "north-carolina", label: "North Carolina" },
  { value: "north-dakota", label: "North Dakota" },
  { value: "ohio", label: "Ohio" },
  { value: "oklahoma", label: "Oklahoma" },
  { value: "oregon", label: "Oregon" },
  { value: "pennsylvania", label: "Pennsylvania" },
  { value: "rhode-island", label: "Rhode Island" },
  { value: "south-carolina", label: "South Carolina" },
  { value: "south-dakota", label: "South Dakota" },
  { value: "tennessee", label: "Tennessee" },
  { value: "texas", label: "Texas" },
  { value: "utah", label: "Utah" },
  { value: "vermont", label: "Vermont" },
  { value: "virginia", label: "Virginia" },
  { value: "washington", label: "Washington" },
  { value: "west-virginia", label: "West Virginia" },
  { value: "wisconsin", label: "Wisconsin" },
  { value: "wyoming", label: "Wyoming" },
];

/**
 * Returns the regions for a given country. Uses the auto-generated
 * table (199 countries, 1163 entries) plus the US-state override.
 * Falls back to a single country-level option when the country has
 * no entry in either source.
 */
export function getRegionsForCountry(iso2: string, countryName: string): RegionOption[] {
  const upper = iso2.toUpperCase();
  if (upper === "US") return US_STATES;
  const auto = REGIONS_BY_COUNTRY_AUTO[upper];
  if (auto && auto.length > 0) {
    return auto.map((e) => ({ value: e.value, label: e.label }));
  }
  const slug = countryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return [{ value: slug, label: `All of ${countryName}` }];
}
