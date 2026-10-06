/**
 * src/lib/spine/checked.ts
 *
 * THE "CHECKED" DATE A PAGE MAY PRINT (milestone 2, masterplan step 31; the credibility doctrine of 2026-10-02: the page foot
 * holds "Checked [date]"). Only a date the data holds, never today's standing in for a check, and only on a page whose figures
 * that data backs. The register slices under data/uk/registers back the UK's country-level pages (the country, its how-to) and
 * the pages of a UK city the registers hold (today London, Greater London: the city, its trades, its districts); their date is
 * the slices' build date, the manifest's `built`, which E:/atlas/registers/uk/export_for_site.py writes at export: the day the
 * export ran, since 2026-10-06 (QUEUE data:uk-register-built-date). The other UK cities' figures are the city list's and the
 * shard's (QUEUE uk:cities-sourced-or-marked), which no export dates, so their pages print no line; nor does any other
 * country's page.
 *
 * WHAT THE DATE CANNOT SAY: an export on a later day moves it even when no slice changed, so "Checked" is the day the slices
 * were last cut from the register tables and fingerprinted, not a new reading of the sources (each table's own date stays in
 * the manifest's `files`).
 */
import manifest from "../../../data/uk/registers/manifest.json";
import { cityRegisterPlace, countryHeldToRegisters } from "@/lib/uk/registers/register_city";

/** A real calendar day: the pattern alone let "2026-13-45" through to an "Invalid Date" foot. */
function realDay(value: unknown): string | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const at = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(at) && new Date(at).toISOString().slice(0, 10) === value ? value : null;
}

export const REGISTER_BUILT: string | null = realDay((manifest as { built?: unknown }).built);

/** A country-level page (the country, its how-to): the United Kingdom's, held to the registers, prints the slices' date. */
export function checkedDateForCountry(iso2: string | null | undefined): string | null {
  return countryHeldToRegisters(iso2) ? REGISTER_BUILT : null;
}

/** A city-level page (the city, its trades, its districts): only a city the registers hold prints the slices' date. */
export function checkedDateForCity(iso2: string | null | undefined, citySlug: string | null | undefined): string | null {
  if (!iso2 || !citySlug) return null;
  return cityRegisterPlace(String(iso2), String(citySlug).toLowerCase()) ? REGISTER_BUILT : null;
}
