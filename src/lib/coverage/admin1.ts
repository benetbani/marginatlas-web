/**
 * Plan v13 Wave 4d — admin-1 region lookup.
 *
 * Returns the list of administrative-1 divisions for a given country
 * (states for US, regions for FR, counties for AL, etc.) sourced from
 * GeoNames + ISO 3166-2. Independent of whether we have benchmark data
 * for those regions — the UI may decide to render the full list or
 * only the subset with data.
 */
import fs from "node:fs";
import path from "node:path";

export type Admin1Region = {
  admin1_code: string;
  name: string;
  ascii_name: string;
  slug: string;
  geoname_id: number | null;
};

const manifestPath = path.resolve(
  process.cwd(), "data", "coverage", "admin1_regions_v1.json"
);

let MANIFEST: Record<string, Admin1Region[]> = {};
try {
  MANIFEST = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
} catch {
  MANIFEST = {};
}

export function getAdmin1Regions(iso2: string): Admin1Region[] {
  return MANIFEST[iso2.toUpperCase()] || [];
}
