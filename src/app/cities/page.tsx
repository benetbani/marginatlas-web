/**
 * Cities directory - /cities.
 *
 * Reformation (bible Section 14, the City directory row: "local discovery" with
 * key modules "industries, rent, demand, rankings", whose stated things to avoid
 * are "tourism fluff" and, for any directory, an "alphabetical dump only").
 *
 * The page leads with the geographic map, then a by-name search box (a client
 * island) directly under it, then the breadcrumb, the header, and the city
 * showcase grouped by world region (Europe, Asia, Americas, Middle East and
 * Africa, Oceania). Each card carries three real figures (visitors a year,
 * average salary, metro GDP) instead of qualitative words, and any missing
 * figure shows the board dash. A region with no cities self-omits.
 *
 * Each city is resolved to its rendered figures by buildDirectoryCity from the
 * pure synthesis module (src/lib/scores/city_directory) and placed into one of
 * the five buckets by worldRegionForCity (src/lib/regions/world_region), both
 * fed only the city list the page already imports. It invents no numbers.
 *
 * Plan v27 Lane C anchored this hub at /cities; v34 added the full-bleed map.
 * Both are preserved: URL, metadata, and revalidate are unchanged, and every
 * /cities/{slug} link still resolves to the same city page.
 */
import Link from "next/link";
import type { Metadata } from "next";
import cityListJson from "../../../data/cities/city_list_v1.json";
import cityCoordsJson from "../../../data/cities/city_coordinates_v1.json";
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
import { fmtUSD, fmtUSDBillions, fmtMillions } from "@/components/board/format";
import { elevation } from "@/lib/design-tokens";
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
  description: "Two hundred cities of the world with small business benchmarks, neighborhood breakdowns, and side-by-side comparisons.",
};

type City = DirectoryCityInput & {
  gdp_b?: number;
  pop_m: number;
};

const CITIES = (cityListJson as { cities: City[] }).cities;

type CityCoord = { slug: string; lat: number; lon: number };
const COORDS = (cityCoordsJson as { coordinates: CityCoord[] }).coordinates;
const COORD_BY_SLUG = new Map(COORDS.map((c) => [c.slug, c]));

// Join the city list to the coordinates table. A city missing coords at 0,0
// would distort the map, so we filter it out of the map only; the full set
// still reaches a reader through the map markers and the country pages.
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

// The by-name search list handed to the client box: only the three fields it
// needs to match and link. Sorted by name so any equal-rank matches read in a
// stable order.
const SEARCH_CITIES: CitySearchItem[] = CITIES.map((c) => ({
  name: c.name,
  slug: c.slug,
  iso2: c.iso2,
})).sort((a, b) => a.name.localeCompare(b.name));

// The showcase, grouped by world region. Every city is resolved to its
// rendered figures and placed in exactly one of the five buckets (Europe,
// Asia, Americas, Middle East and Africa, Oceania); within a bucket the
// largest metros lead, then ties break by name. A region with zero cities is
// dropped so it never renders an empty heading.
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
    cities: (byRegion.get(region) ?? []).sort(
      (a, b) => b.pop_m - a.pop_m || a.name.localeCompare(b.name),
    ),
  })).filter((g) => g.cities.length > 0);
})();

/**
 * One curated city, rendered as a board StatCard: the flag and the city name as
 * the link, then three real figures. Any figure the city is missing degrades to
 * the board dash inside the card. The modeled note is one line for the whole
 * section, not a badge per card, so it lives on the section rather than here.
 */
function CityStatCard({ city }: { city: DirectoryCity }) {
  return (
    <StatCard
      title={city.name}
      href={`/cities/${city.slug}`}
      leading={<CountryFlag iso2={city.iso2} className="w-6" />}
      stats={[
        {
          label: "Visitors",
          hint: "per year",
          value:
            city.tourist_arrivals_m != null
              ? fmtMillions(city.tourist_arrivals_m)
              : null,
        },
        {
          label: "Average salary",
          value:
            city.avg_gross_salary_usd_year != null
              ? fmtUSD(city.avg_gross_salary_usd_year)
              : null,
        },
        {
          label: "Metro GDP",
          value: city.gdp_b != null ? fmtUSDBillions(city.gdp_b) : null,
        },
      ]}
    />
  );
}

export default function CitiesHub() {
  return (
    <article className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Hero (founder escalation 2026-06-14): the map dominates the top of the
          page. A tight hero band carries the H1, one line of intro, and the
          count compactly ABOVE the full-content-width map; the map's zoom
          controls now sit top-right, so the whole hero (compact copy + map +
          visible controls) lands on a standard first screen. The by-name search
          sits directly under the map; the breadcrumb and the region directory
          follow below. */}
      <section aria-labelledby="cities-hero-heading">
        <header className="max-w-3xl">
          <SectionEyebrow size="md" className="mb-2">
            The directory
          </SectionEyebrow>
          <h1
            id="cities-hero-heading"
            className="font-display text-3xl md:text-4xl lg:text-[2.85rem] font-semibold tracking-tight text-ink-900 leading-[1.06]"
          >
            Where small business actually works, city by city
          </h1>
          <p className="mt-3 text-base md:text-lg text-graphite leading-relaxed">
            What a cafe makes in Tokyo, a salon in Lagos, a corner shop in
            Mumbai. Open a city for its industries, costs, and rankings, or pick
            one off the map.{" "}
            <span className="text-cocoa-700/85 tabular-nums">
              <span className="text-ink-900 font-medium">{TOTAL}</span> cities
              placed.
            </span>
          </p>
        </header>

        {/* The dominant hero element: the world map, full content-width,
            immediately under the compact band. */}
        <div
          className="mt-5 md:mt-6 rounded-2xl bg-white border border-parchment p-2 md:p-3"
          style={{ boxShadow: elevation.card }}
        >
          <CitiesWorldMap cities={MAP_CITIES} />
        </div>

        {/* The by-name way in. A client island: it filters the covered-city
            list in the browser and links to each /cities/{slug}. With JS off
            the input is inert and the grouped directory below still works. */}
        <CitySearchBox cities={SEARCH_CITIES} />
      </section>

      <nav aria-label="Breadcrumb" className="text-sm text-cocoa-700/70 mt-10 md:mt-12">
        <Link href="/" className="hover:text-atlas-700">
          Home
        </Link>
        <span className="mx-2 text-cocoa-300">/</span>
        <span className="text-ink-900">Cities</span>
      </nav>

      <p className="mt-6 max-w-2xl text-base md:text-lg text-graphite leading-relaxed">
        The numbers bend with the city: rent, wages, and what people will pay
        all shift from one place to the next. Browse the covered cities by
        region below, or open any one for the fuller picture.
      </p>

      {/* The showcase, grouped by world region. Each region heading is
          followed by a compact card per city carrying the same three real
          figures (visitors a year, average salary, metro GDP); a missing
          figure shows the board dash. A region with no cities self-omits, so
          there is never an empty heading. The modeled note sits once at the
          end, under the last region. */}
      {REGION_GROUPS.length > 0 ? (
        <section className="mt-14 md:mt-20" aria-labelledby="by-region-heading">
          <SectionEyebrow className="mb-2">By region</SectionEyebrow>
          <h2
            id="by-region-heading"
            className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink-900 leading-tight"
          >
            The covered cities, region by region
          </h2>
          <p className="mt-3 max-w-2xl text-base text-graphite leading-relaxed">
            Each city carries three real figures: visitors a year, the average
            salary, and metro GDP. They frame the size of a market before you
            open in it, and the largest metros lead each region.
          </p>

          <div className="mt-8 md:mt-10 flex flex-col gap-10 md:gap-14">
            {REGION_GROUPS.map((group) => (
              <div key={group.region}>
                <h3 className="font-display text-lg md:text-xl font-semibold tracking-tight text-ink-900">
                  {group.region}
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
                  {group.cities.map((city) => (
                    <CityStatCard key={city.slug} city={city} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-xs leading-relaxed text-cocoa-700/70">
            Visitor, salary, and metro GDP figures are approximate and modeled to
            stay consistent across cities, so they read as comparisons rather than
            audited accounts. Open a city for the fuller picture.
          </p>
        </section>
      ) : null}
    </article>
  );
}
