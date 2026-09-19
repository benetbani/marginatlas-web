/**
 * src/lib/spine/close_rows.ts
 *
 * THE TERMINUS'S DOORS for a country page: down into a city (the largest
 * covered city by population, a figure the city list holds), across to the
 * country's trades, and to the pricing page with the promise that page keeps
 * today ("Notify me"), never "with Pro" while Pro cannot be bought. Every href
 * is a route the app folder holds; the copy gate proves it. Local and
 * synchronous. A country with no covered city gets two doors.
 *
 * EVERY DOOR DECLARES WHAT IT PROMISES (plan step 39, 2026-09-19): `lands`,
 * a kind from door_kinds.ts, the answer the door's landing page leads with,
 * taken from the resolver that says the page exists (page_targets.ts hands
 * every target its `answers`) or from SURFACE_ANSWERS where the href is a
 * static route's. The `doors` gate reads the promise off the render and holds
 * it to the route the href reaches; a door promising what its page does not
 * answer is a wrong door, and is fixed here, in the builder that owns it.
 */
import { coveredCities } from "@/lib/cities/city_pages";
import { COPY } from "@/lib/spine/copy";
import type { Door } from "@/components/spine/archetypes/Terminus";
import { countryPageTarget, geoPageTarget, neighbourhoodsHubTarget } from "@/lib/geo/page_targets";
import { inSentence } from "@/lib/spine/place_names";
import { industryToSlug, INDUSTRIES, INDUSTRY_BY_ID } from "@/lib/taxonomy";
import type { IndustryPlacesData } from "@/lib/spine/industry_places_rows";
import type { BenchmarkData } from "@/lib/spine/benchmark_rows";
import { hoodCity, spineHoodDistricts, HOOD_BENCHMARK_TRADE } from "@/lib/spine/hood_scheme";
import { SURFACE_ANSWERS } from "@/lib/spine/door_kinds";

const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");

export function buildCloseDoors(iso2: string): Door[] {
  const code = iso2.toUpperCase();
  const doors: Door[] = [];
  const cities = coveredCities(code);
  if (cities.length > 0) {
    const largest = [...cities].sort((a, b) => (b.pop_m ?? 0) - (a.pop_m ?? 0))[0];
    const label = cities.length === 1 ? fill(COPY.close.cityDoor, { city: largest.name }) : fill(COPY.close.cityDoorMany, { city: largest.name, n: String(cities.length) });
    /* Down to the largest covered city, landing on customer pay (8.2 `20 close`; the coherence check's handoff list). */
    doors.push({ key: "city", label, href: `/cities/${largest.slug}`, kind: "link", lands: SURFACE_ANSWERS.city });
  }
  doors.push({ key: "trades", label: COPY.close.tradesDoor, href: `/${code.toLowerCase()}/industries`, kind: "link", lands: SURFACE_ANSWERS["trades-index"] });
  doors.push({ key: "pro", label: COPY.close.proDoor, href: "/pricing", kind: "pill", lands: SURFACE_ANSWERS.pricing });
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
  return [{ key: "compare", label: fill(COPY.compare.door, { country: inSentence(name) }), href: "/compare", kind: "pill", lands: SURFACE_ANSWERS.compare }];
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
 *  a reason a reader would accept. No pricing door: 8.3's row, as built.
 *  THE DISTRICTS DOOR GOES THROUGH THE HUB RESOLVER (plan step 39): the hub
 *  route answers 404 for a city with no scheme, so the door is drawn only
 *  where `neighbourhoodsHubTarget` says the page exists, and it promises what
 *  that hub answers, the rent spread on the admitted cities (London) and the
 *  district list on the legacy hub elsewhere. */
export function buildCityCloseDoors(seed: any): Door[] {
  const meta = seed?.meta ?? {};
  const slug = String(meta.slug ?? "").trim();
  const city = String(meta.city ?? "").trim();
  const iso2 = String(meta.iso2 ?? "").toUpperCase();
  if (!slug || !city) return [];
  const doors: Door[] = [];
  const hub = neighbourhoodsHubTarget(slug);
  if (hub) doors.push({ key: "districts", label: fill(COPY.cityClose.districtsDoor, { city }), href: hub.href, kind: "link", lands: hub.answers });
  const country = iso2.length === 2 ? countryPageTarget(iso2) : null;
  if (country) doors.push({ key: "country", label: fill(COPY.cityClose.countryDoor, { country: inSentence(String(meta.country_name ?? country.label)) }), href: country.href, kind: "link", lands: country.answers });
  doors.push({ key: "compare", label: fill(COPY.cityClose.compareDoor, { city }), href: "/compare", kind: "pill", lands: SURFACE_ANSWERS.compare });
  return doors;
}

/** THE NEIGHBOURHOOD PAGES' DOORS (MODEL.md 8.8 `06 close`; plan step 35,
 *  2026-09-19, the controller's ruling (f)), three at Terminus's cap, the pill
 *  last (M21), no two sharing a first word, none promising what is not on
 *  sale. ON THE HUB: the city page up one altitude, "Opening a business in
 *  {city}" (the city masthead's answer, the trade close's own literal); the
 *  trade page in this city for the ONE benchmark trade the adapter reconciles
 *  its revenue with (hood_scheme.ts `HOOD_BENCHMARK_TRADE`, restaurants), "See
 *  restaurants in {city}" through the trade route (`/[country]/[geo]/
 *  [industry]`, the copy gate proves it against the app folder), one door and
 *  never `CANONICAL_TRADES`' four, which the old funnel band drew and the
 *  archetype's cap could not hold; and the compare pill, "Compare {city} with
 *  other cities" (the city's own). ON A DISTRICT PAGE: the hub, "Every
 *  district of {city}" (the city page's districts door, the same words for
 *  the same page), the city page, the compare pill. Built from the scheme
 *  alone, pure, so the copy gate proves every admitted city's doors without
 *  the adapter. The last-checked line and the report-an-error link 8.8 names
 *  are NOT built: no fact on these pages carries a year but the visitor count
 *  and no correction route exists (QUEUE close:furniture-lines, the city's
 *  and the trade's closes found the same). */
export function buildHoodCloseDoors(citySlug: string, focus: string | null = null): Door[] {
  const city = hoodCity(citySlug);
  const districts = spineHoodDistricts(citySlug);
  if (!city || !districts) return [];
  if (focus && !districts.some((d) => d.slug === focus)) return [];
  const doors: Door[] = [];
  /* The hub the district page returns to is this city's own spine hub (the
     city is admitted, or no district page exists): its answer through the one
     resolver, never assumed. */
  const hub = focus ? neighbourhoodsHubTarget(city.slug) : null;
  if (focus && hub) doors.push({ key: "districts", label: fill(COPY.cityClose.districtsDoor, { city: city.name }), href: hub.href, kind: "link", lands: hub.answers });
  const cityPage = geoPageTarget(city.iso2, city.slug);
  if (cityPage && cityPage.kind === "city") doors.push({ key: "city", label: fill(COPY.tradeClose.cityDoor, { city: city.name }), href: cityPage.href, kind: "link", lands: cityPage.answers });
  if (!focus) doors.push({ key: "trade", label: fill(COPY.industryClose.cityDoor, { trade: HOOD_BENCHMARK_TRADE.name, city: city.name }), href: `/${city.iso2.toLowerCase()}/${city.slug}/${HOOD_BENCHMARK_TRADE.slug}`, kind: "link", lands: SURFACE_ANSWERS.cell });
  doors.push({ key: "compare", label: fill(COPY.cityClose.compareDoor, { city: city.name }), href: "/compare", kind: "pill", lands: SURFACE_ANSWERS.compare });
  return doors;
}

/** THE TRADE'S DOORS (MODEL.md 8.6 `15 close`; plan step 33's sixth
 *  dispatch, 2026-09-18), three at Terminus's cap, the pill last (M21):
 *  across to the industry page, "See {trade} in other cities", the same
 *  trade elsewhere (M23 binds the industry page to open on the trade across
 *  places, so the door lands on its answer); up to the place's own page,
 *  "Opening a business in {city}", the city masthead's own idiom, through
 *  the one resolver that says which place pages exist (page_targets.ts:
 *  London to its city page, California to its state page, and NOTHING where
 *  neither resolves, so a door to a page that does not exist is never
 *  drawn); and the compare pill, "Compare {trade} across cities", to
 *  `/compare`, which puts the same business in up to three cities side by
 *  side. The pricing door leaves this close for the chrome, and "Look at
 *  {sibling} in {city} instead" leaves because `13 rivals` is that door on
 *  every row. The industry door's slug is the taxonomy's canonical one
 *  (`industryToSlug`, the route's own `generateStaticParams`), falling back
 *  to the URL's segment where the id is not carried. Built from the seed's
 *  meta alone, so the copy gate proves the doors on fixtures without the
 *  adapter; the trade's name in lowercase in a sentence, as the old close
 *  printed it. The last-checked line and the report-an-error link 8.6
 *  names under a hairline are NOT built: no fact on any shard carries a
 *  year and no correction route exists (the city's sixth dispatch found the
 *  same on its page), and both wait on the controller. */
export function buildTradeCloseDoors(seed: any): Door[] {
  const meta = seed?.meta ?? {};
  const trade = String(meta.trade ?? "").trim();
  const iso2 = String(meta.iso2 ?? "").toUpperCase();
  const geo = String(meta.geo ?? "").trim();
  if (!trade) return [];
  const doors: Door[] = [];
  const industrySlug = (typeof meta.industry_id === "string" ? industryToSlug(meta.industry_id) : null) || (typeof meta.industry === "string" ? meta.industry : null);
  const tradeInSentence = trade.toLowerCase();
  /* The industry door promises what the industry page answers today, the
     trade's keep of every $100 (8.7 `00`); its words name the trade in other
     cities, which M23 binds the industry composition to open on, PROVISIONAL
     there (door_kinds.ts says so beside the kind). */
  if (industrySlug) doors.push({ key: "industry", label: fill(COPY.tradeClose.industryDoor, { trade: tradeInSentence }), href: `/industries/${industrySlug}`, kind: "link", lands: SURFACE_ANSWERS.industry });
  const place = iso2.length === 2 && geo ? geoPageTarget(iso2, geo) : null;
  /* A city place lands on customer pay; a region place (California) on the region's cities, the resolver's own answer. */
  if (place) doors.push({ key: "place", label: fill(COPY.tradeClose.cityDoor, { city: place.name }), href: place.href, kind: "link", lands: place.answers });
  doors.push({ key: "compare", label: fill(COPY.tradeClose.compareDoor, { trade: tradeInSentence }), href: "/compare", kind: "pill", lands: SURFACE_ANSWERS.compare });
  return doors;
}

/** The pages the taxonomy publishes: an id in scope and not merged. A retired or merged slug answers a permanent redirect, which is not the page a door promises. */
const PUBLISHED = new Set(INDUSTRIES.map((i) => i.id));

/** THE TRADE NEXT DOOR (MODEL.md 8.7 `11 close`): the highest row of `02`
 *  that is not the trade itself and whose page exists, or null. The rows are
 *  `02`'s own (the sector's members holding a figure, highest first, capped
 *  at the card's five), so a sector whose other rows are all retired gives
 *  no door, and a retired leader passes the door to the next member in scope
 *  (69 of 243 on 2026-09-19; the label claims no superlative for that
 *  reason). Null where `02` is withheld (no rows). */
export function industryLeader(industryId: string, benchmark: BenchmarkData | null): { id: string; name: string; href: string } | null {
  if (!benchmark || benchmark.state === "withheld") return null;
  const row = benchmark.rows.find((r) => r.key !== industryId && PUBLISHED.has(r.key));
  if (!row) return null;
  const name = INDUSTRY_BY_ID[row.key]?.name ?? row.name;
  return { id: row.key, name, href: `/industries/${industryToSlug(row.key)}` };
}

/** THE INDUSTRY PAGE'S DOORS (MODEL.md 8.7 `11 close`; plan step 34's
 *  fourth dispatch, 2026-09-19), at most three at Terminus's cap, the pill
 *  last (M21), none promising what is not on sale: (a) the best-paying
 *  city's trade page off `06`'s top row, "See {trade} in {city}", through
 *  the link the resolver gave that city's column (`cellUrl`, the route
 *  `/[country]/[geo]/[industry]`; the copy gate proves it against the app
 *  folder), drawn only where the table draws, which under the own-row law
 *  is no trade today (the branch is proven on the table's own fixtures); (b)
 *  the trade next door off `02`'s rows, "{Leader}, the trade next door"
 *  (`industryLeader` above), drawn on every trade whose `02` holds another
 *  member in scope; (c) the compare pill, "Compare {trade} across cities",
 *  the trade page's own literal, on every trade. No sector door: the app
 *  folder holds no sector route (read 2026-09-19: `/industries`,
 *  `/industries/[industry]`, `/industries/[industry]/across`,
 *  `/[country]/industries`; none takes a sector), so none is drawn rather
 *  than one to the index dressed as the sector's. The trade's name in
 *  lowercase inside a sentence, as the trade close prints it; the leader's
 *  as the taxonomy prints it, at the head of its door. Pure over the two
 *  builders' results, so the gate proves every state on fixtures. The
 *  last-checked line and the report-an-error link are NOT built: no fact
 *  carries a year and no correction route exists (the trade's and the
 *  city's closes found the same; QUEUE close:furniture-lines). */
export function buildIndustryCloseDoors(industryId: string | undefined, places: IndustryPlacesData | null, benchmark: BenchmarkData | null): Door[] {
  if (!industryId) return [];
  const ind = INDUSTRY_BY_ID[industryId];
  if (!ind) return [];
  const trade = ind.name.trim().toLowerCase();
  const doors: Door[] = [];
  /* The best-paying city's trade page, landing on "A typical owner keeps" (8.7 `11 close`, the R4 door). */
  if (places && places.state === "table" && places.top) doors.push({ key: "city", label: fill(COPY.industryClose.cityDoor, { trade, city: places.top.name }), href: places.top.href, kind: "link", lands: SURFACE_ANSWERS.cell });
  const leader = industryLeader(industryId, benchmark);
  if (leader) doors.push({ key: "leader", label: fill(COPY.industryClose.leaderDoor, { leader: leader.name }), href: leader.href, kind: "link", lands: SURFACE_ANSWERS.industry });
  doors.push({ key: "compare", label: fill(COPY.tradeClose.compareDoor, { trade }), href: "/compare", kind: "pill", lands: SURFACE_ANSWERS.compare });
  return doors;
}
