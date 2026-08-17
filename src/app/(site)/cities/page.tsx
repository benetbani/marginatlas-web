/**
 * Cities directory - /cities.
 *
 * Reformation (bible Section 14, the City directory row: "local discovery" with
 * key modules "industries, rent, demand, rankings", whose stated things to avoid
 * are "tourism fluff" and, for any directory, an "alphabetical dump only").
 *
 * WHAT WAS WRONG, MEASURED 2026-08-17. The founder: "it's just a big list of
 * cities which doesn't end, and it's executed completely, completely awful
 * way." He is describing 252 StatCards, three figures each, laid out in five
 * flat grids: 20,459 rendered pixels, 30.4 screens of scroll at a 674px
 * viewport, and 2.54 MB of HTML for one directory page. The grouping existed
 * and did nothing, because a region holding 80 cards is still an endless list.
 *
 * The page also promised three figures per card and the first of the three was
 * not safe to print. `tourist_arrivals_m` is stored as "country arrivals /
 * tier divisor", so 124 of the 246 cities carrying it share their figure with a
 * same-country sibling: 21 US cities all read 13.4M visitors, Milwaukee and
 * Raleigh among them, while Orlando read 8.4M and Las Vegas 6M. A reader does
 * not need the provenance note to see that Milwaukee outdrawing Orlando is
 * wrong. That figure is now absent from this page, and the ranked strip in
 * src/lib/scores/city_directory that would have ordered cities BY that ratio
 * stays unwired for the same reason.
 *
 * WHAT IT IS NOW, in three moves:
 *   1. A hero card carrying the map and the by-name search. Not a list.
 *   2. The twelve biggest metro economies as cards, each with two figures that
 *      are per-city rather than per-country: metro GDP and the average salary.
 *      Ranked, bounded, and the way in for most readers.
 *   3. The complete index, still grouped by world region, but as a dense
 *      four-column link grid instead of a card wall. Every one of the 252
 *      cities keeps its link and its /cities/{slug} URL; nothing is hidden
 *      behind a control and nothing needs JavaScript to reach.
 *
 * Each city is placed into one of the five buckets by worldRegionForCity
 * (src/lib/regions/world_region) and resolved by buildDirectoryCity from the
 * pure synthesis module (src/lib/scores/city_directory), both fed only the city
 * list this page already imports. It invents no numbers.
 *
 * URL, metadata canonical, and revalidate are unchanged.
 *
 * EVERY SURFACE HERE IS POSITIONED, AND IT HAS TO BE. AtlasFrame paints the
 * page photograph from FIXED layers at z-index 0, not behind at a negative one.
 * CSS paints positioned elements after the backgrounds of static ones, so a
 * plain `bg-white` card is drawn UNDER the picture: the hero card was rendering
 * at 1001x820 with a white background and reading on screen as a washed patch
 * of sky, while the map inside it looked correct purely because its own
 * container carries `relative`. Adding `relative` puts the card back on top of
 * the picture, which is the arrangement the founder asked for, the card being
 * the thing that softens the photograph. This is a property of the frame, so
 * any new band added here needs it too.
 */
import Link from "next/link";
import type { Metadata } from "next";
import cityListJson from "../../../../data/cities/city_list_v1.json";
import cityCoordsJson from "../../../../data/cities/city_coordinates_v1.json";
import { COUNTRIES } from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";
import CitiesWorldMap, {
  type CitiesWorldMapCity,
} from "@/components/cities/CitiesWorldMap";
import {
  CitySearchBox,
  type CitySearchItem,
} from "@/components/cities/CitySearchBox";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { StatCard } from "@/components/board/StatCard";
import { fmtUSD, fmtUSDBillions } from "@/components/board/format";
import {
  buildDirectoryCity,
  type DirectoryCity,
  type DirectoryCityInput,
} from "@/lib/scores/city_directory";
import {
  WORLD_REGIONS,
  worldRegionForCity,
  type WorldRegion,
} from "@/lib/regions/world_region";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "All cities | Margin Atlas",
  description:
    "Every city in the atlas, on one map and grouped by region, with small business benchmarks, neighborhood breakdowns, and side-by-side comparisons.",
  alternates: { canonical: "/cities" },
};

type City = DirectoryCityInput & {
  gdp_b?: number;
  pop_m: number;
};

const CITIES = (cityListJson as { cities: City[] }).cities;

type CityCoord = { slug: string; lat: number; lon: number };
const COORDS = (cityCoordsJson as { coordinates: CityCoord[] }).coordinates;
const COORD_BY_SLUG = new Map(COORDS.map((c) => [c.slug, c]));

/** ISO2 to a reader-facing country name, from the one taxonomy the site
 *  already names countries with. All 105 country codes in the city list
 *  resolve; the fallback is the bare code rather than a blank. */
const COUNTRY_NAME = new Map(
  COUNTRIES.map((c) => [c.code.toUpperCase(), c.name]),
);
function countryName(iso2: string): string {
  return COUNTRY_NAME.get(iso2.toUpperCase()) ?? iso2.toUpperCase();
}

// Join the city list to the coordinates table. A city missing coords at 0,0
// would distort the map, so we filter it out of the map only; the full set
// still reaches a reader through the index below and the country pages.
const MAP_CITIES: CitiesWorldMapCity[] = CITIES.map((c) => {
  const coord = COORD_BY_SLUG.get(c.slug);
  if (!coord) return null;
  return {
    slug: c.slug,
    name: c.name,
    iso2: c.iso2,
    lat: coord.lat,
    lon: coord.lon,
  };
}).filter((c): c is CitiesWorldMapCity => c !== null);

// Total cities placed: every input is read, none dropped from the count.
const TOTAL = CITIES.length;
// Countries those cities sit in. Counted, not asserted.
const TOTAL_COUNTRIES = new Set(CITIES.map((c) => c.iso2.toUpperCase())).size;

// The by-name search list handed to the client box: only the three fields it
// needs to match and link. Sorted by name so any equal-rank matches read in a
// stable order.
const SEARCH_CITIES: CitySearchItem[] = CITIES.map((c) => ({
  name: c.name,
  slug: c.slug,
  iso2: c.iso2,
})).sort((a, b) => a.name.localeCompare(b.name));

/** Largest metro economy first, then by name so the order is deterministic. */
function byMarketSize(a: DirectoryCity, b: DirectoryCity): number {
  return (b.gdp_b ?? 0) - (a.gdp_b ?? 0) || a.name.localeCompare(b.name);
}

/** By name. THE INDEX IS ALPHABETICAL, and the ranked view is the twelve cards
 *  above it. Seen at 1440: Europe's 73 entries ran London, Munich, Stuttgart,
 *  Zurich, Cologne, Bucharest, Warsaw, which is metro-economy order and is
 *  indistinguishable from no order at all to a reader looking for Rome. A
 *  section headed "the full index" that cannot be scanned for one name is the
 *  founder's "big list which doesn't end" wearing a card. */
function byName(a: DirectoryCity, b: DirectoryCity): number {
  return a.name.localeCompare(b.name);
}

/** How many cities lead the page as cards. Twelve fills a three-column grid
 *  four rows deep, which is a showcase; the tail is the index below. */
const LEAD_COUNT = 12;

const LEAD_CITIES: DirectoryCity[] = CITIES.map(buildDirectoryCity)
  .filter((c) => c.gdp_b != null)
  .sort(byMarketSize)
  .slice(0, LEAD_COUNT);

// The index, grouped by world region. Every city is placed in exactly one of
// the five buckets (Europe, Asia, Americas, Middle East and Africa, Oceania);
// within a bucket the cities are ALPHABETICAL, because this is an index and an
// index is scanned for one name. A region with zero cities is dropped so it
// never renders an empty heading.
type RegionGroup = { region: WorldRegion; cities: DirectoryCity[] };

const REGION_GROUPS: RegionGroup[] = (() => {
  const byRegion = new Map<WorldRegion, DirectoryCity[]>();
  for (const c of CITIES) {
    const region = worldRegionForCity(c.continent, c.iso2);
    const bucket = byRegion.get(region) ?? [];
    bucket.push(buildDirectoryCity(c));
    byRegion.set(region, bucket);
  }
  return WORLD_REGIONS.map((region) => ({
    region,
    cities: (byRegion.get(region) ?? []).sort(byName),
  })).filter((g) => g.cities.length > 0);
})();

/** One hero figure: the number set large, its label quiet underneath. */
function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl md:text-3xl font-semibold tabular-nums leading-none text-ink-900">
        {value.toLocaleString("en-US")}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wide text-cocoa-500">
        {label}
      </div>
    </div>
  );
}

/**
 * One of the twelve lead cities as a board StatCard: the flag and the name as
 * the link, then two per-city figures. The visitor count that used to sit in
 * the first slot is gone; see the header note.
 */
function CityStatCard({ city }: { city: DirectoryCity }) {
  return (
    <StatCard
      /* Positioned, like every other surface on this page: the frame paints its
         photograph from a fixed layer at z-index 0, so a static background
         paints UNDER the picture and the card reads as a washed-out patch of
         sky. See the note on the article below. */
      className="relative"
      title={city.name}
      href={`/cities/${city.slug}`}
      eyebrow={countryName(city.iso2)}
      leading={<CountryFlag iso2={city.iso2} className="w-6" />}
      stats={[
        {
          label: "Metro economy",
          value: city.gdp_b != null ? fmtUSDBillions(city.gdp_b) : null,
        },
        {
          label: "Average salary",
          hint: "a year",
          value:
            city.avg_gross_salary_usd_year != null
              ? fmtUSD(city.avg_gross_salary_usd_year)
              : null,
        },
      ]}
    />
  );
}

/** One index entry: flag, city, and the country in a quieter tone beside it. */
function CityIndexLink({ city }: { city: DirectoryCity }) {
  return (
    <Link
      href={`/cities/${city.slug}`}
      /* `break-inside-avoid` so a multi-column box never splits a flag from
         its city across a column boundary. */
      className="group flex break-inside-avoid items-center gap-2 rounded-md py-1.5 pl-1 pr-2 transition-colors hover:bg-atlas-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40"
    >
      <CountryFlag iso2={city.iso2} className="w-5 shrink-0 rounded-[2px]" />
      <span className="min-w-0 truncate text-sm text-ink-900 group-hover:text-atlas-700">
        {city.name}
        {/* `hidden sm:inline`. The index runs two columns from the base width
            so the page is not 15 screens on a phone, which gives each entry
            139px at 375. The country NAME does not fit in that: printed, it
            truncated 113 of the 252 entries. It is also the one thing here
            that is already said twice, since the flag to its left says it
            without spending a character. Dropped below sm, kept from sm up
            where the column is wide enough to carry both. Measured after: 2 of
            252 truncate at 375, 0 from 414 up. */}
        <span className="ml-1.5 hidden text-xs text-cocoa-500 sm:inline">
          {countryName(city.iso2)}
        </span>
      </span>
    </Link>
  );
}

export default function CitiesHub() {
  return (
    /* No column cap and no gutter of its own. SiteChrome's <main> already gives
       this route `max-w-content mx-auto px-6`, so `max-w-6xl mx-auto px-4
       md:px-6` here was a second cap inside the first and a second gutter on
       top of the first: 1024px where the rest of the site reads at 1072. Same
       defect the city page carried, same fix. */
    <article className="py-6 md:py-8">
      <nav aria-label="Breadcrumb" className="relative text-sm text-cocoa-700/70">
        <Link href="/" className="hover:text-atlas-700">
          Home
        </Link>
        <span className="mx-2 text-cocoa-300">/</span>
        <span className="text-ink-900">Cities</span>
      </nav>

      {/* The hero, seated on one card so the copy and the map read against a
          surface rather than against the page photograph. The map is the
          dominant element and the by-name search sits directly under it: the
          spatial way in and the by-name way in, both above the fold. */}
      <section
        aria-labelledby="cities-hero-heading"
        /* Canonical surface. Was `relative rounded-2xl border border-parchment
           bg-white` plus an inline boxShadow from the elevation token, which is
           `.atlas-card` rebuilt by hand and one shade wrong: opaque white where
           the canonical card is rgba(255,255,255,.955) and lets the photograph
           read through. `.atlas-card` is also `position: relative` itself, so
           the explicit `relative` the frame requires comes with it. */
        className="atlas-card mt-4 p-5 md:p-7"
      >
        <SectionEyebrow size="md" className="mb-2">
          The directory
        </SectionEyebrow>
        <h1
          id="cities-hero-heading"
          className="font-display text-3xl md:text-4xl lg:text-[2.85rem] font-semibold tracking-tight text-ink-900 leading-[1.06]"
        >
          Where small business actually works, city by city
        </h1>
        <p className="mt-3 max-w-2xl text-base md:text-lg text-graphite leading-relaxed">
          What a cafe makes in Tokyo, a salon in Lagos, a corner shop in Mumbai.
        </p>

        <div className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
          <HeroStat value={TOTAL} label="cities" />
          <HeroStat value={TOTAL_COUNTRIES} label="countries" />
        </div>

        <div className="mt-5 md:mt-6">
          <CitiesWorldMap cities={MAP_CITIES} />
        </div>

        {/* A client island: it filters the covered-city list in the browser and
            links to each /cities/{slug}. With JS off the input is inert and the
            index below still reaches every city. */}
        <CitySearchBox cities={SEARCH_CITIES} />
      </section>

      {/* The lead: the biggest metro economies as cards. Ranked and bounded, so
          the page opens with an answer rather than an inventory. */}
      <section
        className="relative mt-8 md:mt-10"
        aria-labelledby="biggest-markets-heading"
      >
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <SectionEyebrow className="mb-1.5">Start here</SectionEyebrow>
            <h2
              id="biggest-markets-heading"
              className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink-900 leading-tight"
            >
              The biggest markets
            </h2>
          </div>
          <span className="shrink-0 text-[11px] uppercase tracking-wide text-cocoa-500">
            By metro economy
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {LEAD_CITIES.map((city) => (
            <CityStatCard key={city.slug} city={city} />
          ))}
        </div>
      </section>

      {/* The index: every covered city, grouped by region, as links rather than
          cards. Each region is one seated card; the largest metro economies
          lead inside it. */}
      {REGION_GROUPS.length > 0 ? (
        <section
          className="relative mt-10 md:mt-14"
          aria-labelledby="by-region-heading"
        >
          <SectionEyebrow className="mb-1.5">Every city</SectionEyebrow>
          <h2
            id="by-region-heading"
            className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink-900 leading-tight"
          >
            The full index, region by region
          </h2>

          <div className="mt-5 flex flex-col gap-4">
            {REGION_GROUPS.map((group) => (
              <section
                key={group.region}
                className="atlas-card px-4 py-4 md:px-6 md:py-5"
              >
                <div className="flex items-baseline justify-between gap-3 border-b border-parchment pb-3">
                  <h3 className="font-display text-lg md:text-xl font-semibold tracking-tight text-ink-900">
                    {group.region}
                  </h3>
                  <span className="shrink-0 text-[11px] uppercase tracking-wide text-cocoa-500 tabular-nums">
                    {group.cities.length} cities
                  </span>
                </div>
                {/* CSS COLUMNS, NOT A GRID, and the difference is the whole
                    point of sorting alphabetically. A four-column grid flows
                    ACROSS its rows, so an A-to-Z list reads A B C D on the
                    first line and E F G H on the second, which is not how
                    anybody scans an index. Multi-column boxes flow DOWN each
                    column and then across, so the first column is A to E and
                    a reader can jump straight to the letter they want. */}
                {/* `columns-2` AT THE BASE, not `columns-1`. The §6 fix took
                    this page from 20,459px to 5,148px and was measured at
                    desktop only; at 375x812 it was still 12,679px, roughly 15
                    screens, which is the "big list of cities which doesn't end"
                    the fix existed to answer, surviving at the width most
                    readers hold. 8,064 of those pixels were this index running
                    one city per line down a 293px column.

                    Two columns halves it to 4,096 and the page to 8,711. The
                    cost is measured, not assumed: at two columns each entry
                    gets 139px, and with the country NAME still printed 113 of
                    the 252 entries truncated, worst case 95px off "Santo
                    Domingo Dominican Republic". So the name goes below sm and
                    the FLAG carries the country instead, which it was already
                    doing. That takes truncation to 2 of 252 at 375 and 0 at
                    414 and up. See CityIndexLink for the other half. */}
                <div className="mt-2 columns-2 gap-x-4 lg:columns-4">
                  {group.cities.map((city) => (
                    <CityIndexLink key={city.slug} city={city} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* SEATED, because it was the one piece of copy on this page sitting
              straight on the photograph. Seen at 1440 and again at 1280: the
              smallest and lightest type on the page, `text-xs` at 70% of a
              muted brown, over sky and sea. It read, barely, at the crop this
              picture happens to give; the country page's section nav is the
              same class of defect and it went illegible over the buildings
              lower down the same photograph. Provenance is the last thing that
              should be hard to read, so it gets a ground of its own. */}
          <div className="atlas-card mt-6 px-4 py-3">
            <p className="max-w-2xl text-xs leading-relaxed text-cocoa-700">
              Metro economy and salary figures are modeled to stay consistent
              across cities, so they read as comparisons rather than audited
              accounts. Open a city for the fuller picture.
            </p>
          </div>
        </section>
      ) : null}
    </article>
  );
}
