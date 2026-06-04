/**
 * Admin-1 region lookup.
 *
 * Returns the list of administrative-1 divisions for a given country
 * (states for US, regions for FR, counties for AL, etc.) sourced from
 * GeoNames + ISO 3166-2. Independent of whether we have benchmark data
 * for those regions — the UI may decide to render the full list or
 * only the subset with data.
 */
// Static JSON import (no node:fs) so this module is safe to import from client
// components too. regions-by-country.ts now sources its top-level region list
// from here, and that module is pulled into client bundles via the homepage
// NavigatorForm and the CalculatorForm. A node:fs read would break the client
// build (UnhandledSchemeError); a bundled JSON import does not.
import admin1Json from "../../../data/coverage/admin1_regions_v1.json";

export type Admin1Region = {
  admin1_code: string;
  name: string;
  ascii_name: string;
  slug: string;
  geoname_id: number | null;
};

const MANIFEST = admin1Json as unknown as Record<string, Admin1Region[]>;

export function getAdmin1Regions(iso2: string): Admin1Region[] {
  return MANIFEST[iso2.toUpperCase()] || [];
}
