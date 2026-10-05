/**
 * src/lib/home/destination.ts
 *
 * WHERE A HOME SEARCH LANDS (milestone 3, masterplan step 33; his interview of 2026-09-26, ruling 11: "a place-and-trade search,
 * then the UK's headline answers"). One pure function, answering only with pages that exist, read off the same lists the routes
 * and the sitemap read:
 *
 *   the UK, London, a trade        /gb/london/<trade>     every live trade has its London page (src/app/sitemap.ts lists them)
 *   the UK, another city, a trade  /cities/<city>         no other UK city's trade pages are listed, so the city's own page
 *   the UK, anywhere, a trade      /industries/<trade>    the trade's own page: London's is a different place
 *   the UK and a city alone        /cities/<city>
 *   the UK alone                   /gb
 *   another country                today's behaviour: /<cc>/<city or its default region>/<trade>, or its page alone
 *
 * The UK's cities are the city list's (data/cities/city_list_v1.json, through src/lib/home/uk_cities_generated.ts), never typed
 * here. Never /gb/gb/..., which no page answers.
 */
import { COUNTRIES, industryToSlug, SLUG_TO_INDUSTRY } from "@/lib/taxonomy";
import { RETIRED } from "@/lib/taxonomy/retired";
import { getDefaultRegionForCountry } from "@/lib/regions/default_region_by_country";
import { UK_CITY_PAGES } from "@/lib/home/uk_cities_generated";

/** The UK's cities with a page of their own, by name: the city list's, through a generated module small enough for the
 *  search form to carry (scripts/cities/build_uk_cities.ts; the test holds it to the list). */
export const UK_CITIES: ReadonlyArray<{ slug: string; label: string }> = UK_CITY_PAGES;

/** A trade's live slug (an id or a slug in), or null where the taxonomy holds none or the trade is retired. */
export function liveTradeSlug(trade: string | null | undefined): string | null {
  const t = String(trade ?? "").trim();
  if (!t) return null;
  const slug = t in SLUG_TO_INDUSTRY ? t : industryToSlug(t);
  return slug in SLUG_TO_INDUSTRY && !(slug in RETIRED) ? slug : null;
}

export function homeDestination({ country, city = "", trade = "" }: { country: string; city?: string | null; trade?: string | null }): string {
  const cc = String(country ?? "").toUpperCase();
  const place = String(city ?? "").toLowerCase();
  const slug = liveTradeSlug(trade);
  if (cc === "GB") {
    const ukCity = UK_CITIES.find((c) => c.slug === place) ?? null;
    if (ukCity?.slug === "london" && slug) return `/gb/london/${slug}`;
    if (ukCity) return `/cities/${ukCity.slug}`;
    if (slug) return `/industries/${slug}`;
    return "/gb";
  }
  if (!COUNTRIES.some((c) => c.code === cc)) return "/";
  const cl = cc.toLowerCase();
  if (!trade) return `/${cl}`;
  /* Today's behaviour off the UK: the picked city's slug is the cell route's geo, else the country's curated default region. */
  const geo = place || getDefaultRegionForCountry(cc) || cl;
  return `/${cl}/${geo}/${industryToSlug(String(trade))}`;
}
