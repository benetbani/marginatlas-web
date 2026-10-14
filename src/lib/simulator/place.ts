/**
 * src/lib/simulator/place.ts , THE PLACE A VIEW NAMES (plan 2026-10-13 cost-simulator, Task 2; spec section 3, "an unknown country, city or trade
 * answers 404"; the plan's Readings 2 and 16). Pure, so the edge, the door gate and the client may read it.
 *
 * Missing words: no country is London; a city with no country names no place; a country with no city is "anywhere in" it; no trade is
 * restaurants. A word is lower case letters, digits and hyphens, or it names nothing. The UK's cities carry their nation (GB_CITY_NATION, held
 * to the city list by tests/simulator/defaults.test.ts): England reads the register and the valuation, Scotland does not (no England rates, and
 * the law module's income tax is the rest of the UK's); "anywhere in" the UK reads England's rows, said.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
import { COUNTRIES, INDUSTRIES, industryToSlug, isDefaultVisible } from "@/lib/taxonomy";
import { own } from "@/lib/own";
import { DEFAULT_PLACE } from "./bundle";

export type Nation = "england" | "scotland" | "wales" | "northern-ireland";
export type Place = { iso2: string; country: string; countryName: string; city: string | null; cityName: string | null; trade: string; industryId: string; tradeName: string; nation: Nation | null };

/** Declared in bundle.ts, which the browser loads, so the client never reaches this file's city list and taxonomy. */
export { DEFAULT_PLACE };

export const GB_CITY_NATION: Readonly<Record<string, Nation>> = {
  birmingham: "england",
  bristol: "england",
  edinburgh: "scotland",
  glasgow: "scotland",
  leeds: "england",
  london: "england",
  manchester: "england",
};

const CITIES = (cityListJson as { cities: Array<{ slug: string; iso2: string; name: string }> }).cities;
const TRADES = INDUSTRIES.filter(isDefaultVisible).map((i) => ({ slug: industryToSlug(i.id), id: i.id, name: i.name })).sort((a, b) => a.name.localeCompare(b.name));
const WORD = /^[a-z0-9-]{1,64}$/;

export function simulatorTrades(): Array<{ slug: string; id: string; name: string }> {
  return TRADES;
}
export function simulatorCountries(): Array<{ code: string; name: string }> {
  return COUNTRIES.map((c) => ({ code: c.code.toLowerCase(), name: c.name }));
}
export function simulatorCities(): Array<{ slug: string; iso2: string; name: string }> {
  return CITIES.map((c) => ({ slug: c.slug, iso2: c.iso2.toUpperCase(), name: c.name })).sort((a, b) => a.name.localeCompare(b.name));
}

/** The city slug when the city list holds it for that country, else null (a trade page's geography may be a region or a council). */
export function cityOfCountry(iso2: string, slug: string | null | undefined): string | null {
  if (!slug) return null;
  const s = slug.toLowerCase();
  return CITIES.some((c) => c.slug === s && c.iso2.toUpperCase() === iso2.toUpperCase()) ? s : null;
}

export function resolvePlace(q: { country?: string | null; city?: string | null; trade?: string | null }): Place | null {
  const word = (w: string | null | undefined) => (w == null || w === "" ? null : String(w).toLowerCase());
  let country = word(q.country);
  let city = word(q.city);
  const trade = word(q.trade) ?? DEFAULT_PLACE.trade;
  if ([country, city, trade].some((w) => w !== null && !WORD.test(w))) return null;
  if (country === null) {
    if (city !== null) return null;
    country = DEFAULT_PLACE.country;
    city = DEFAULT_PLACE.city;
  }
  const c = COUNTRIES.find((x) => x.code.toLowerCase() === country);
  if (!c) return null;
  const iso2 = c.code.toUpperCase();
  const row = city === null ? null : CITIES.find((x) => x.slug === city && x.iso2.toUpperCase() === iso2) ?? null;
  if (city !== null && !row) return null;
  const t = TRADES.find((x) => x.slug === trade);
  if (!t) return null;
  const nation: Nation | null = iso2 !== "GB" ? null : row ? own(GB_CITY_NATION, row.slug) ?? null : "england";
  return { iso2, country: iso2.toLowerCase(), countryName: c.name, city: row ? row.slug : null, cityName: row ? row.name : null, trade: t.slug, industryId: t.id, tradeName: t.name, nation };
}
