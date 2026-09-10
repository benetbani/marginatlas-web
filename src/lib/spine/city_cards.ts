/**
 * src/lib/spine/city_cards.ts
 *
 * THE CITY CARDS for a country: the covered cities that have a page, each with
 * its region, its link, its photograph when one is held (the card pager's own
 * ruling of 2026-09-04) and, since 2026-09-10, THE ONE FIGURE THE CITY PAGE
 * ITSELF OPENS WITH. Local and synchronous, the adapter's own rules: up to
 * eight cities, a city without a page is dropped, a trailing parenthetical is
 * dropped from the name.
 *
 * WHY A FIGURE AT ALL (founder, 2026-09-10, on the coloured destination cards:
 * "those coloured beautiful vertical cards of cities should be used by us for
 * cities too", the current ones "stale and bland"). A card carrying a name and
 * a region is a list item wearing a border; there is nothing on it to look at
 * and nothing to compare. The country page was throwing away the figure its own
 * city pages answer with. `avg_gross_salary_usd_year` is held for all 252
 * covered cities with a per-field source, and `adapt_city.ts` already prints it
 * as the city masthead's "Customer income, average earner, a year", so a card
 * that prints it promises exactly what the page behind it delivers.
 *
 * THE SHARE, and what it may and may not claim. `payShare` is where a city's
 * pay sits between the lowest and the highest ON THIS CARD, and it exists so a
 * look can DRAW the figure. It is ordinal and nothing more: the set it is
 * measured within is drawn in full beside it, every card prints its own
 * absolute figure in its own column, and no card is crowned. `payOfTop` is the
 * zero-based reading of the same money for a look that draws a proportional
 * mark. Both are undefined when there is no set to scale within (one card, or
 * every card holding the same figure), and a look that cannot draw then draws
 * nothing rather than an empty track, which would read as zero.
 */
import { getCitiesForCountry, type CityEntry } from "@/lib/cities";
import { cityPageHref, cityPageSlug } from "@/lib/cities/city_pages";
import { cityImageSrc } from "@/lib/cities/city_images";
import { getCityAveragePayUsd } from "@/lib/cities/city_tier";

export type CityCard = {
  id: string;
  name: string;
  sub?: string;
  /** The region, DROPPED when it says the city's name back at the reader. A
   *  second field beside `sub` on purpose: the live card pager reads `sub` and
   *  is not being changed by this work, so the two forms cannot drift into one
   *  another by accident. */
  region?: string;
  href: string;
  image: string | null;
  /** What an average customer there earns in a year, gross, USD. */
  payUsd?: number;
  /** 0 to 1, ordinal: where that pay sits between the lowest and highest here. */
  payShare?: number;
  /** 0 to 1, zero-based: that pay as a part of the highest pay here. */
  payOfTop?: number;
};
export type CityCards = { cards: CityCard[]; allHref: string };

const bare = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
/** The region, or null when it says the city's name back at the reader. */
function keepRegion(name: string, region: string | undefined): string | null {
  const r = region?.trim();
  if (!r) return null;
  const a = bare(name);
  const b = bare(r);
  if (!a || !b) return null;
  return a.includes(b) || b.includes(a) ? null : r;
}

/** Null when the country has no covered city with a page. */
export function buildCityCards(iso2In: string): CityCards | null {
  const iso2 = iso2In.toUpperCase();
  const rows = getCitiesForCountry(iso2).slice(0, 8);
  const cards: CityCard[] = [];
  for (const c of rows as CityEntry[]) {
    const href = cityPageHref(iso2, c.name);
    if (!href) continue;
    const slug = cityPageSlug(iso2, c.name);
    const pay = getCityAveragePayUsd(slug);
    const name = String(c.name).replace(/\s*\([^)]*\)\s*$/, "");
    cards.push({
      id: c.id,
      name,
      sub: c.region_name?.trim() || undefined,
      /* A REGION THAT REPEATS THE CITY IS NOT A SECOND DETAIL. The city set
         gives Berlin the region "Berlin", Ho Chi Minh City "Ho Chi Minh",
         Lagos "Lagos State" and Tokyo "Tokyo Metropolis", and a card that
         prints the name and then almost the name again has spent one of its
         two details on nothing. Dropped when either name contains the other. */
      region: keepRegion(name, c.region_name) ?? undefined,
      href,
      image: cityImageSrc(slug),
      payUsd: pay ?? undefined,
      // filled below, once the whole set is known
    });
  }
  if (cards.length === 0) return null;
  const pays = cards.map((c) => c.payUsd).filter((v): v is number => typeof v === "number" && Number.isFinite(v) && v > 0);
  const lo = Math.min(...pays);
  const hi = Math.max(...pays);
  if (pays.length >= 2 && hi > lo) {
    for (const c of cards) {
      if (typeof c.payUsd !== "number") continue;
      c.payShare = (c.payUsd - lo) / (hi - lo);
      c.payOfTop = c.payUsd / hi;
    }
  }
  return { cards, allHref: `/cities#c-${iso2.toLowerCase()}` };
}
