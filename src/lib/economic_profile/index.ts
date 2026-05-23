/**
 * Plan v29 Phase 1 — Country Economic Profile loader.
 *
 * Build-time JSON import. Honors 600MB RAM cap (~120KB file).
 * Falls back to default_fallback for any country not in the table.
 */
import profileJson from "../../../data/economic_indicators/country_profile_v2.json";
import type { CountryEconomicProfile, CountryProfileFile } from "./types";

const FILE = profileJson as unknown as CountryProfileFile;

/** Look up the full economic profile for an ISO-2 country code. */
export function getCountryProfile(iso2: string | null | undefined): CountryEconomicProfile {
  if (!iso2) return FILE.default_fallback;
  return FILE.countries[iso2.toUpperCase()] || FILE.default_fallback;
}

/** List every country with a profile (sorted by ISO-2). */
export function listCountryProfiles(): CountryEconomicProfile[] {
  return Object.values(FILE.countries).sort((a, b) => a.iso2.localeCompare(b.iso2));
}

/** How many countries are fully populated. Used by audit pipeline. */
export function countCountryProfiles(): number {
  return Object.keys(FILE.countries).length;
}

/** Re-export types for downstream consumers. */
export type { CountryEconomicProfile, FieldQuality } from "./types";
