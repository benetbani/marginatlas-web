/**
 * src/lib/uk/registers/register_city.ts
 *
 * THE CITIES HELD TO A REGISTER REGION (plan 06, task B3; his ruling of 2026-10-04: London is Greater London, E12000007, on
 * every page). Until that evening "London" was three places on the site: the 14.3M metro (the city list's metro GDP, the shard's
 * densities over the metro's residents), Greater London (the register, the people file's visits) and the City of London local
 * authority (the cell every trade page read). A city named here is the region: its page reads the register's counts there, and a
 * metro-wide figure is a different place on it and does not print (the hero's metro GDP and density, the market card's
 * densities).
 *
 * Keyed by country and city slug; the geography is the register's own code (london_trade.ts reads the same constant).
 */
import { LONDON_GEOGRAPHY } from "./london_trade";

export type RegisterPlace = { geography: string; name: string };

const REGISTER_CITY: Readonly<Record<string, RegisterPlace>> = {
  "GB:london": { geography: LONDON_GEOGRAPHY, name: "Greater London" },
};

/** THE COUNTRY WHOSE PAGE IS HELD TO THE REGISTERS (masterplan step 04, 2026-10-05): the United Kingdom's page prints a sourced figure,
 *  a marked one, or none, as its London pages do; every other country's page says once that its figures are estimates. */
export function countryHeldToRegisters(iso2: string | null | undefined): boolean {
  return String(iso2 ?? "").toUpperCase() === "GB";
}

/** The register region a city's page is held to, or null for a city whose figures stand as the city list and shard hold them. */
export function cityRegisterPlace(iso2: string, slug: string): RegisterPlace | null {
  return REGISTER_CITY[`${String(iso2).toUpperCase()}:${slug}`] ?? null;
}
