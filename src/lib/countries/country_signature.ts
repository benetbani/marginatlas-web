/**
 * country_signature.ts - typed accessor for the per-country character data
 * (demographics, signature sectors, culture spectrums, government scores).
 *
 * Lives in the data layer so presentation components import a typed accessor
 * rather than reaching into data/ directly (the layering gate forbids the
 * latter from src/components). Source: data/cities/country_signature_v1.json.
 */
import countrySignatureJson from "../../../data/cities/country_signature_v1.json";

export type CountryCulture = {
  punctuality: number;
  openness_to_foreigners: number;
  innovation: number;
  communication_directness: number;
  corruption_rejection: number;
  ambition_chest_beating: number;
};
export type CountryGovernment = {
  tax_predictability: number;
  low_bribery: number;
  task_efficiency: number;
  time_efficiency: number;
  judicial_impartiality: number;
  innovation_capacity: number;
};
export type CountrySignature = {
  foreign_born_pct?: number;
  foreign_owned_pct?: number;
  signature_sectors?: { label: string; blurb: string }[];
  culture?: CountryCulture;
  government?: CountryGovernment;
};

const COUNTRIES = (countrySignatureJson as { countries: Record<string, CountrySignature> })
  .countries;

/** The character signature for an ISO2 country code, or null when none is held. */
export function getCountrySignature(iso2: string): CountrySignature | null {
  return COUNTRIES[iso2.toUpperCase()] ?? null;
}
