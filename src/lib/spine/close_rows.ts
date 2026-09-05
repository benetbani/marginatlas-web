/**
 * src/lib/spine/close_rows.ts
 *
 * THE TERMINUS'S DOORS for a country page: down into a city (the largest
 * covered city by population, a figure the city list holds), across to the
 * country's trades, and to the pricing page with the promise that page keeps
 * today ("Notify me"), never "with Pro" while Pro cannot be bought. Every href
 * is a route the app folder holds; the copy gate proves it. Local and
 * synchronous. A country with no covered city gets two doors.
 */
import { coveredCities } from "@/lib/cities/city_pages";
import { COPY } from "@/lib/spine/copy";
import type { Door } from "@/components/spine/archetypes/Terminus";

const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");

export function buildCloseDoors(iso2: string): Door[] {
  const code = iso2.toUpperCase();
  const doors: Door[] = [];
  const cities = coveredCities(code);
  if (cities.length > 0) {
    const largest = [...cities].sort((a, b) => (b.pop_m ?? 0) - (a.pop_m ?? 0))[0];
    const label = cities.length === 1 ? fill(COPY.close.cityDoor, { city: largest.name }) : fill(COPY.close.cityDoorMany, { city: largest.name, n: String(cities.length) });
    doors.push({ key: "city", label, href: `/cities/${largest.slug}`, kind: "link" });
  }
  doors.push({ key: "trades", label: COPY.close.tradesDoor, href: `/${code.toLowerCase()}/industries`, kind: "link" });
  doors.push({ key: "pro", label: COPY.close.proDoor, href: "/pricing", kind: "pill" });
  return doors;
}
