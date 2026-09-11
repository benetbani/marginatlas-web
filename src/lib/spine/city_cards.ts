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

/**
 * THE PLACEHOLDER PHOTOGRAPH, AND IT IS NOT A PHOTOGRAPH OF ANY CITY WE COVER.
 *
 * Founder, 2026-09-11, reversing "no photographs anywhere" (2026-09-07) for the
 * city card and for nothing else: "the cities should have their placeholder
 * image ... just keep a placeholder image, you can just blast the London in all
 * of them, the London image with the bridge that we have, you know, not the
 * map."
 *
 * THE FILE HE NAMED DOES NOT EXIST. The site ships three raster images in total
 * and that was checked by listing them, not assumed: `/spine/london.jpeg` is a
 * grey STREET MAP, which is the thing he ruled out by name; `/london-cities.png`
 * is that map in terracotta; and `/spine/_skyline.jpeg` is the only real
 * photograph in the repository. It is POSITANO, ITALY, the shot that used to sit
 * behind the page hero. There is no London bridge photograph to blast, so the
 * only honest placeholder is the one photograph that exists, named here for
 * exactly what it is so that nobody downstream reads it as a city's own picture.
 *
 * THE MAP LEFT THE PHOTOGRAPH FOLDER ON 2026-09-11. Until then a second copy of
 * it sat at `public/cities/london.jpeg`, which is the folder the image manifest
 * is generated from, so the manifest said London held a photograph and the CITY
 * MASTHEAD painted the map he had ruled out as an 80 by 60 thumbnail on the
 * page hero. The manifest's own contract is "a real photograph the atlas has the
 * right to show"; the map broke it. It was deleted from that folder (the same
 * bytes stay at `/spine/london.jpeg`, which nothing paints), the manifest was
 * regenerated to empty, and the masthead now draws London the way it draws the
 * other 251 cities: no picture until a real one lands. A denylist of the map's
 * paths stood here for one commit and is gone with it: it claimed a real
 * photograph dropped at the same path would replace the map with no edit, and
 * the opposite was true, because the list would have kept denying the path.
 *
 * IT IS SCOPED TO THE CARD, not to `cityImageSrc`. The city page's own masthead
 * reads that helper directly and must keep getting null for a city with no
 * photograph, or a single placeholder would spread to 252 page mastheads and
 * reverse the 2026-09-07 ruling everywhere instead of on the one card he named.
 *
 * A REAL FILE REPLACES IT WITH NO CODE CHANGE: drop `<slug>.jpeg` into
 * `public/cities/`, run `scripts/build_city_images_manifest.ts`, and that city's
 * own photograph wins below.
 */
export const CITY_CARD_PLACEHOLDER_IMAGE = "/spine/_skyline.jpeg";

/** The card's photograph: the city's own when the manifest holds one, the
 *  single placeholder otherwise. Never null, since 2026-09-11: a card with no
 *  image is the hole he was pointing at. */
export function cityCardImage(slug: string | null | undefined): { src: string; placeholder: boolean } {
  const own = cityImageSrc(slug);
  if (own) return { src: own, placeholder: false };
  return { src: CITY_CARD_PLACEHOLDER_IMAGE, placeholder: true };
}

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
  /** The city's OWN photograph, or null. Read by the live card pager, which
   *  draws no slot for a null and must keep doing so: see `photo` below. */
  image: string | null;
  /** THE CITY CARD'S PHOTOGRAPH, NEVER NULL, and a SECOND field rather than a
   *  widening of `image` on purpose.
   *
   *  The founder's 2026-09-11 placeholder ruling lands on the city CARD. The
   *  country page still renders the older `CardPager`, which was built around
   *  "a city without a photograph draws no slot" and puts its image to the LEFT
   *  of the name inside a 155px track. Filling that slot on every card was tried
   *  first and the harness measured the result: three city names clipped at 1280
   *  and 768, and a hole in the single-city form, 12 design reds on a shipped
   *  section. Re-proportioning that section is its own piece of work and needs
   *  his eye, so the two fields stay separate and the pager is untouched.
   *
   *  `placeholder` is true when this is the stand-in rather than the city's own
   *  picture. The card marks it in the DOM so the harness keeps counting how
   *  many REAL city photographs are held: the stand-in closes the hole on the
   *  page without quietly closing the data track's open question. */
  photo: { src: string; placeholder: boolean };
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
    const photo = cityCardImage(slug);
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
      photo,
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
