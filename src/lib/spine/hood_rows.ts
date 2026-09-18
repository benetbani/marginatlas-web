/**
 * src/lib/spine/hood_rows.ts
 *
 * THE CITY'S NEIGHBOURHOODS, `14 neighbourhoods` (MODEL.md 8.3; plan step
 * 32's sixth dispatch, 2026-09-18): the card pager, four a row, each card a
 * name and an arrow to the city's neighbourhoods page at the district's own
 * anchor, no image (8.3's row: NO IMAGE; DATA-REQUIREMENTS item 14's
 * photograph half is retired), no sub-line (a district's `character` tag is
 * a one-word summary of a place, PART 9 clause 19), no figure (the intensity
 * file is 1,215 of 1,266 rows quality C, item 30). Local and synchronous,
 * pure over data/cities/neighborhoods_v1.json.
 *
 * TWO STATES, COUNTED 2026-09-18 over the 252 listed cities: 43 hold a
 * curated scheme (`α-macro`, 40 at five districts; `α-macro+fine`, London
 * seven, New York ten, one at four) with real names, and DRAW the pager; 209
 * hold `scheme: "alpha-auto"`, the file's own default of five compass zones
 * on the city's name ("North Abidjan"), one identical pattern site-wide, and
 * draw the BLOCKED SEAT instead (city-view.tsx): a placeholder name never
 * prints (clause 32, R11), and the seat's line says what is not gathered.
 * The builder returns the placeholder state as `cards: null` with the
 * scheme named, so the view and the gates read one answer.
 *
 * THE ORDER IS THE FILE'S: never re-sorted by a figure the page cannot show
 * honestly (the 14 brief). THE HREF is real on every city: the route
 * src/app/(site)/cities/[slug]/neighborhoods/page.tsx exists for every slug
 * in the file (generateStaticParams), and the legacy page plants
 * `id={n.slug}` on each district's card, so the fragment lands on the named
 * district there; on London, the one city whose hub renders the spine
 * explorer (NeighborhoodExplorer selects by state and plants no per-district
 * id), the fragment lands at the top of the same page, recorded for the
 * controller under plan step 39 (the doors land where they promise).
 */
import neighborhoodsJson from "../../../data/cities/neighborhoods_v1.json";
import cityListJson from "../../../data/cities/city_list_v1.json";
import { countWord } from "@/lib/spine/district_rows";
import { COPY } from "@/lib/spine/copy";
import type { PagerCard } from "@/components/spine/archetypes/CardPager";

type Hood = { slug: string; name: string; character?: string; description?: string };
type Scheme = { scheme: string; neighborhoods: Hood[] };
const SCHEMES = (neighborhoodsJson as { cities: Record<string, Scheme> }).cities;
type CityRow = { slug: string; name: string };
const CITY_NAMES = new Map(((cityListJson as { cities: CityRow[] }).cities).map((c) => [c.slug, c.name]));

/** The file's own name for its default: five compass zones on the city's name, no real district. */
export const PLACEHOLDER_SCHEME = "alpha-auto";

export type CityNeighbourhoodsData = {
  slug: string;
  name: string;
  scheme: string;
  /** The pager's cards on a curated scheme; null on the placeholder scheme (the seat draws). */
  cards: PagerCard[] | null;
  allHref: string;
  /** The coverage line under the pager, the count as a word; null on the seat. */
  foot: string | null;
  /** The seat's line, the city's name filled; null where the pager draws. */
  seatLine: string | null;
};

const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");
const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function buildCityNeighbourhoods(slug: string): CityNeighbourhoodsData | null {
  const key = String(slug ?? "").trim().toLowerCase();
  const scheme = SCHEMES[key];
  const name = CITY_NAMES.get(key);
  if (!scheme || !name) return null;
  const allHref = `/cities/${key}/neighborhoods`;
  const hoods = Array.isArray(scheme.neighborhoods) ? scheme.neighborhoods.filter((h) => h && h.slug && h.name) : [];
  if (scheme.scheme === PLACEHOLDER_SCHEME || hoods.length === 0) {
    return { slug: key, name, scheme: scheme.scheme, cards: null, allHref, foot: null, seatLine: fill(COPY.blocked.cityNeighbourhoods.line, { city: name }) };
  }
  const cards: PagerCard[] = hoods.map((h) => ({ id: h.slug, name: h.name, href: `${allHref}#${h.slug}` }));
  return {
    slug: key,
    name,
    scheme: scheme.scheme,
    cards,
    allHref,
    foot: capFirst(fill(COPY.cityNeighbourhoods.foot, { n: countWord(cards.length) })),
    seatLine: null,
  };
}

/** Every slug the neighbourhoods file holds, for the stories and the gates. */
export function citiesWithScheme(): string[] { return Object.keys(SCHEMES); }
