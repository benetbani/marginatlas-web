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
import { countryPageTarget } from "@/lib/geo/page_targets";
import { inSentence } from "@/lib/spine/place_names";

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

/** THE COUNTRY'S COMPARE DOOR (MODEL.md 8.2, `19 compare`; plan step 31,
 *  fifth dispatch, 2026-09-18): one pill to the compare tool, built exactly
 *  as the city's compare door below is built, on the other noun, the name
 *  through `inSentence()` so "the United Kingdom" and "France" both read.
 *  It stands on its own card beside the checks, not in the terminus: the
 *  terminus already holds its three (DOOR_CAP), and the pill is the compare
 *  tool's by M21. The route is `/compare` (src/app/(site)/compare/page.tsx);
 *  the copy gate proves it against the app folder, and Terminus draws no
 *  door whose href it does not hold. Clause 11 bans naming the place twice on
 *  a page; this door names it after the h1 the way the built city door
 *  "Compare {city} with other cities" already does, and 8.2's row records
 *  the clash as the built pattern. */
export function buildCompareDoor(countryName: string): Door[] {
  const name = countryName.trim();
  if (!name) return [];
  return [{ key: "compare", label: fill(COPY.compare.door, { country: inSentence(name) }), href: "/compare", kind: "pill" }];
}

/** THE CITY'S DOORS (city:close, the build loop's run 19, 2026-09-06; MODEL.md
 *  8.3's `16 close`, checked on plan step 32's sixth dispatch, 2026-09-18):
 *  every district, to the city's neighbourhoods page; the country page, up
 *  one altitude, through the country address resolver; and the compare page
 *  as the pill, since it puts the same business in up to three cities side by
 *  side (M21). Built from the seed's meta alone, so the copy gate can prove
 *  every city's doors from the city list without the adapter. THE DOOR NO
 *  LONGER NAMES THE LIGHTEST-RENT DISTRICT: it read "Start in {district}" on
 *  London, the cheapest member of the set featured for being the cheapest,
 *  which is the reason he struck out on 2026-09-10 (PART 5, "no district is
 *  featured"); a door is a recommendation, and the set's rent ordering is not
 *  a reason a reader would accept. No pricing door: 8.3's row, as built. */
export function buildCityCloseDoors(seed: any): Door[] {
  const meta = seed?.meta ?? {};
  const slug = String(meta.slug ?? "").trim();
  const city = String(meta.city ?? "").trim();
  const iso2 = String(meta.iso2 ?? "").toUpperCase();
  if (!slug || !city) return [];
  const doors: Door[] = [];
  doors.push({ key: "districts", label: fill(COPY.cityClose.districtsDoor, { city }), href: `/cities/${slug}/neighborhoods`, kind: "link" });
  const country = iso2.length === 2 ? countryPageTarget(iso2) : null;
  if (country) doors.push({ key: "country", label: fill(COPY.cityClose.countryDoor, { country: inSentence(String(meta.country_name ?? country.label)) }), href: country.href, kind: "link" });
  doors.push({ key: "compare", label: fill(COPY.cityClose.compareDoor, { city }), href: "/compare", kind: "pill" });
  return doors;
}
