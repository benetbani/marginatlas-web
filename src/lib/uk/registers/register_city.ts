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
 *
 * THE CITIES HELD TO SOURCES (plan 2026-10-08, uk:cities-sourced-or-marked) are the wider set, every UK city with a page:
 * `cityHeldToSources` says whether a card's lines say which figures are estimates; `cityRegisterPlace` still says which figures
 * a page reads, and names London alone.
 */
import cityListJson from "../../../../data/cities/city_list_v1.json";
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

/** THE UK'S CITIES WITH A PAGE (plan 2026-10-08, uk:cities-sourced-or-marked): the city list's United Kingdom rows, sorted. London
 *  and the six the paywall sells beside it (his ruling 27: the UK pages are the Pro pages). */
export const UK_CITY_SLUGS: readonly string[] = (cityListJson as { cities: Array<{ slug: string; iso2: string }> }).cities
  .filter((c) => String(c.iso2).toUpperCase() === "GB")
  .map((c) => c.slug)
  .sort();
const UK_CITIES: ReadonlySet<string> = new Set(UK_CITY_SLUGS);

/** A UK CITY'S PAGE IS HELD TO SOURCES (plan 2026-10-08, uk:cities-sourced-or-marked; the city twin of countryHeldToRegisters):
 *  it prints an official figure, a figure its card's one line calls an estimate, or none, as London's has since masterplan step
 *  03. This drives what a card's lines SAY. What a page READS stays cityRegisterPlace's (London alone: Greater London's register
 *  counts and valuation); a city held to sources and to no register region prints its shard's figures, each line saying they
 *  are estimates. A Set, so a word that names a built-in ("constructor") names no city. */
export function cityHeldToSources(iso2: string | null | undefined, slug: string | null | undefined): boolean {
  return countryHeldToRegisters(iso2) && UK_CITIES.has(String(slug ?? "").toLowerCase());
}

/** The register region a city's page is held to, or null for a city whose figures stand as the city list and shard hold them. */
export function cityRegisterPlace(iso2: string, slug: string): RegisterPlace | null {
  return REGISTER_CITY[`${String(iso2).toUpperCase()}:${slug}`] ?? null;
}
