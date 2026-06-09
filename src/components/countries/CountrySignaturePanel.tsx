/**
 * CountrySignaturePanel — the same SignaturePanel used on city pages,
 * mounted on /[country] pages. Reuses CitySignaturePanel because the
 * data structure is the same; passes the country's first major city
 * slug as a placeholder when no specific city is needed (the panel's
 * commercial-streets block is suppressed since this is country-level).
 *
 * Founder direction 2026-05-26: signature panel renders on both city
 * AND country pages. Country pages skip the commercial-streets block
 * (street-level data is intrinsically per-city).
 *
 * 2026-05-26.
 */
import { CitySignaturePanel } from "@/components/cities/CitySignaturePanel";

export function CountrySignaturePanel({
  iso2,
  countryName,
}: {
  iso2: string;
  countryName: string;
}) {
  // Reuses CitySignaturePanel with a synthetic citySlug ("") so the
  // city-override lookup misses and the country baseline applies.
  // showInstitutions=true: the culture-spectrum and government-score blocks
  // are country-altitude reads and render here (the city page passes false).
  return (
    <CitySignaturePanel
      citySlug=""
      cityName={countryName}
      iso2={iso2}
      showInstitutions={true}
      showSectors={false}
    />
  );
}
