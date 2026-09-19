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
 * honestly (the 14 brief). THE HREF is real on every city, and since plan
 * step 35 (2026-09-19, MODEL.md 8.8) it lands on the DISTRICT'S OWN PAGE
 * where one exists: `/cities/<slug>/neighborhoods/<district>`, through the
 * one resolver that says which place pages exist (page_targets.ts
 * `districtPageTarget`: the hub's admission gate, London's seven today, and
 * the neighbourhood spine's flag). Where no district page exists (the 42
 * other curated cities, whose hubs are the legacy page) the card keeps the
 * hub's anchor: that page plants `id={n.slug}` on each district's card, so
 * the fragment lands on the named district there. The spine hub plants no
 * per-district anchor and needs none: its city's districts all have pages.
 *
 * EVERY CARD DECLARES WHAT IT PROMISES (plan step 39, 2026-09-19): `lands`,
 * the answer of the page it opens, from the same resolvers that say the page
 * exists (page_targets.ts): the district's own rent on a district page, the
 * district list on the legacy hub's anchor. The chain's `doors` gate reads it
 * off the render and holds it to the route the href reaches.
 */
import neighborhoodsJson from "../../../data/cities/neighborhoods_v1.json";
import cityListJson from "../../../data/cities/city_list_v1.json";
import { countWord } from "@/lib/spine/district_rows";
import { COPY } from "@/lib/spine/copy";
import { districtPageTarget, neighbourhoodsHubTarget } from "@/lib/geo/page_targets";
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
  /** True where every card lands on a district page of its own (the hub's admitted cities), false where the cards land on the hub's anchors. */
  onPages: boolean;
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
    return { slug: key, name, scheme: scheme.scheme, cards: null, allHref, foot: null, seatLine: fill(COPY.blocked.cityNeighbourhoods.line, { city: name }), onPages: false };
  }
  const pages = hoods.map((h) => districtPageTarget(key, h.slug));
  /* The hub the anchors land on, through the resolver: it exists for every
     city with a scheme (the same two conditions this builder checked above),
     and a card is never assembled toward a hub the route would refuse. */
  const hub = neighbourhoodsHubTarget(key);
  if (!hub) return null;
  const cards: PagerCard[] = hoods.map((h, i) => {
    const page = pages[i];
    return page
      ? { id: h.slug, name: h.name, href: page.href, lands: page.answers }
      : { id: h.slug, name: h.name, href: `${hub.href}#${h.slug}`, lands: hub.answers };
  });
  /* The foot says where the cards land: on the district pages where every one has one, on the hub's anchors otherwise. */
  const onPages = pages.length > 0 && pages.every((p) => p != null);
  return {
    slug: key,
    name,
    scheme: scheme.scheme,
    cards,
    allHref,
    foot: capFirst(fill(onPages ? COPY.cityNeighbourhoods.footPages : COPY.cityNeighbourhoods.foot, { n: countWord(cards.length) })),
    seatLine: null,
    onPages,
  };
}

/** Every slug the neighbourhoods file holds, for the stories and the gates. */
export function citiesWithScheme(): string[] { return Object.keys(SCHEMES); }
