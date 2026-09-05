/**
 * src/lib/cities/city_pages.ts
 *
 * WHICH CITIES HAVE A PAGE, and the one link builder every surface uses to
 * reach one. Lifted from the country adapter (2026-09-05) so the archetype
 * stories and the card pager read the same index the adapter reads, and a
 * card can never point at a city page that does not exist.
 */
import cityListJson from "../../../data/cities/city_list_v1.json";
type CityListRow = { slug: string; name: string; iso2: string; pop_m?: number };
const CITY_PAGE_BY_ISO = (() => {
  const out: Record<string, CityListRow[]> = {};
  for (const c of (cityListJson as { cities: CityListRow[] }).cities) {
    const k = String(c.iso2 || "").toUpperCase();
    if (!out[k]) out[k] = [];
    out[k].push(c);
  }
  return out;
})();
export function normalizePlaceName(value: string): string {
  let out = "";
  let depth = 0;
  for (const ch of String(value).toLowerCase()) {
    if (ch === "(") depth += 1;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    else if (depth === 0 && ch >= "a" && ch <= "z") out += ch;
    else if (depth === 0 && ch >= "0" && ch <= "9") out += ch;
  }
  return out;
}

/** The city page's slug for a covered city name, or undefined when none joins. */
export function cityPageSlug(iso2: string, cityName: string): string | undefined {
  const pool = CITY_PAGE_BY_ISO[iso2.toUpperCase()] ?? [];
  const target = normalizePlaceName(cityName);
  const hit = pool.find((c) => normalizePlaceName(c.name) === target) ?? pool.find((c) => normalizePlaceName(c.slug) === target);
  return hit?.slug;
}
/** Every covered city of a country, with its population in millions where the list holds it. */
export function coveredCities(iso2: string): Array<{ slug: string; name: string; pop_m?: number }> {
  return (CITY_PAGE_BY_ISO[iso2.toUpperCase()] ?? []).map((c) => ({ slug: c.slug, name: c.name, pop_m: typeof c.pop_m === "number" ? c.pop_m : undefined }));
}
/** The metropolis-page href for a covered city, or undefined when none joins. */
export function cityPageHref(iso2: string, cityName: string): string | undefined {
  const slug = cityPageSlug(iso2, cityName);
  return slug ? `/cities/${slug}` : undefined;
}
