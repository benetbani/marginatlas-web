/**
 * Plan v21 Blocks 2 + 3 — public wrapper around the auto-generated
 * regions + subdivisions table.
 *
 * Source of truth: REGIONS_BY_COUNTRY_AUTO in regions_generated.ts,
 * built by scripts/regions/build_regions_table.ts from regional_cells.
 * Currently covers 199 countries with 1163 region entries plus their
 * parent relationships for subdivision cascading.
 *
 * US is overridden with the canonical state-slug list because cell pages
 * for US states (cells_master) use slugs like "california", not the
 * regional_cells geo_id form. Subdivisions for US states map via the
 * FIPS-to-state-slug table below.
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

// US-state slug → FIPS 2-digit code. Counties in regional_cells have
// geo_id "us-{fips}-{county}", so this map lets us cascade from a
// state slug to its child counties.
const US_STATE_TO_FIPS: Record<string, string> = {
  alabama: "01", alaska: "02", arizona: "04", arkansas: "05",
  california: "06", colorado: "08", connecticut: "09", delaware: "10",
  "district-of-columbia": "11", florida: "12", georgia: "13",
  hawaii: "15", idaho: "16", illinois: "17", indiana: "18", iowa: "19",
  kansas: "20", kentucky: "21", louisiana: "22", maine: "23",
  maryland: "24", massachusetts: "25", michigan: "26", minnesota: "27",
  mississippi: "28", missouri: "29", montana: "30", nebraska: "31",
  nevada: "32", "new-hampshire": "33", "new-jersey": "34",
  "new-mexico": "35", "new-york": "36", "north-carolina": "37",
  "north-dakota": "38", ohio: "39", oklahoma: "40", oregon: "41",
  pennsylvania: "42", "rhode-island": "44", "south-carolina": "45",
  "south-dakota": "46", tennessee: "47", texas: "48", utah: "49",
  vermont: "50", virginia: "51", washington: "53",
  "west-virginia": "54", wisconsin: "55", wyoming: "56",
};

/**
 * Top-level regions for a given country.
 * - US returns the 50 states (+ DC) override
 * - Other countries return entries from the auto-generated table where
 *   parent === null (top-level only)
 * - Countries with no data get a single "All of {country}" option
 */
export function getRegionsForCountry(iso2: string, countryName: string): RegionOption[] {
  const upper = iso2.toUpperCase();
  if (upper === "US") return US_STATES;
  const auto = REGIONS_BY_COUNTRY_AUTO[upper];
  if (auto && auto.length > 0) {
    const topLevel = auto.filter((e) => e.parent === null);
    if (topLevel.length === 0) {
      // Fallback if everything has a parent (shouldn't happen)
      return auto.map((e) => ({ value: e.value, label: e.label }));
    }
    return topLevel.map((e) => ({ value: e.value, label: e.label }));
  }
  const slug = countryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return [{ value: slug, label: `All of ${countryName}` }];
}

/**
 * Plan v21 Block 3 — subdivisions for a given (country, region).
 *
 * For non-US: returns entries whose `parent` field matches the region.
 * For US: there's no parent geo_id in regional_cells (the state lives in
 * cells_master and uses slugs like "california"), so we prefix-match
 * the geo_id form (us-{fips}-{county}) against the picked state's FIPS.
 *
 * Limits to 60 subdivisions per region to keep the dropdown usable.
 */
export function getSubdivisionsForRegion(iso2: string, regionValue: string): RegionOption[] {
  const upper = iso2.toUpperCase();
  const auto = REGIONS_BY_COUNTRY_AUTO[upper];
  if (!auto) return [];

  let matched: typeof auto;
  if (upper === "US") {
    const fips = US_STATE_TO_FIPS[regionValue];
    if (!fips) return [];
    const prefix = `us-${fips}-`;
    matched = auto.filter((e) => e.value.startsWith(prefix));
  } else {
    const parentMatch = regionValue.toLowerCase();
    matched = auto.filter((e) => e.parent === parentMatch);
  }

  return matched
    .slice(0, 60)
    .map((e) => ({ value: e.value, label: e.label }));
}
