/**
 * Cities directory - /cities.
 *
 * Reformation (bible Section 14, the City directory row: "local discovery" with
 * key modules "industries, rent, demand, rankings", whose stated things to avoid
 * are "tourism fluff" and, for any directory, an "alphabetical dump only").
 *
 * White-reset 2026-06-06 (founder): the page leads with the geographic map, then
 * a ranked strip of the most visitor-skewed markets, then a curated single column
 * of city cards. Each card carries three real figures (visitors a year, average
 * salary, metro GDP) instead of qualitative words, and any missing figure shows
 * the board dash. The old grouped "metropolis / major / secondary" dump and the
 * per-city word-signals are retired; the long tail stays reachable through the
 * map and the country pages.
 *
 * The two shapes the page renders (the ranked visitor list and the curated
 * showcase) come from a pure synthesis module (src/lib/scores/city_directory)
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
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { StatCard } from "@/components/board/StatCard";
import { RankRow } from "@/components/board/RankRow";
import { fmtUSD, fmtUSDBillions, fmtMillions } from "@/components/board/format";
import { elevation } from "@/lib/design-tokens";
import {
  buildCityDirectory,
  type DirectoryCity,
  type DirectoryCityInput,
} from "@/lib/scores/city_directory";

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

// The whole directory, computed once at build time. Pure; no queries.
const DIRECTORY = buildCityDirectory(CITIES);

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
  const { total, topVisitorRatio, showcase } = DIRECTORY;

  return (
    <article className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
      {/* The world map is the first thing a reader meets on /cities; the
          breadcrumb, the header, the ranked visitor strip, and the curated
          cards all follow below it. */}
      <section aria-labelledby="cities-map-heading">
        <h2 id="cities-map-heading" className="sr-only">
          Map of covered cities
        </h2>
        <div
          className="rounded-2xl bg-white border border-parchment p-2 md:p-3"
          style={{ boxShadow: elevation.card }}
        >
          <CitiesWorldMap cities={MAP_CITIES} />
        </div>
      </section>

      <nav aria-label="Breadcrumb" className="text-sm text-cocoa-700/70 mt-10 md:mt-12 mb-8">
        <Link href="/" className="hover:text-atlas-700">
          Home
        </Link>
        <span className="mx-2 text-cocoa-300">/</span>
        <span className="text-ink-900">Cities</span>
      </nav>

      <header className="max-w-3xl">
        <SectionEyebrow size="md" className="mb-3">
          The directory
        </SectionEyebrow>
        <h1 className="font-display text-4xl md:text-5xl lg:text-[3.3rem] font-semibold tracking-tight text-ink-900 leading-[1.04]">
          Where small business actually works, city by city
        </h1>
        <p className="mt-5 text-lg md:text-xl text-graphite leading-relaxed">
          What a cafe makes in Tokyo, a salon in Lagos, a corner shop in Mumbai.
          The numbers bend with the city: rent, wages, and what people will pay
          all shift from one place to the next.{" "}
          <span className="text-ink-900">
            Open a city for its industries, costs, and rankings, or start with
            the deepest markets below.
          </span>
        </p>
        <p className="mt-4 text-sm text-cocoa-700/85 tabular-nums">
          <span className="text-ink-900 font-medium">{total}</span> cities on
          the map.
        </p>
      </header>

      {/* The honest tourism read (bible: tourism signal, not tourism fluff): the
          cities where visitors most outnumber residents, ranked. Self-omits when
          fewer than three cities carry both numbers. */}
      {topVisitorRatio.length >= 3 ? (
        <section
          className="mt-12 md:mt-16 rounded-2xl bg-white border border-parchment px-5 py-6 md:px-7 md:py-7"
          aria-labelledby="visitor-led-heading"
          style={{ boxShadow: elevation.card }}
        >
          <SectionEyebrow className="mb-2">The visitor economy</SectionEyebrow>
          <h2
            id="visitor-led-heading"
            className="font-display text-xl md:text-2xl font-semibold tracking-tight text-ink-900"
          >
            Where the customer is a visitor, not a local
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-graphite leading-relaxed">
            In these cities, arrivals outnumber residents by the widest margin on
            the map. That lifts revenue and pricing power in the season and pulls
            both back out of it, so plan for the swing before you sign a
            year-round lease.
          </p>
          <div className="mt-5">
            {topVisitorRatio.map((c) => (
              <RankRow
                key={c.slug}
                rank={c.rank}
                label={c.name}
                href={`/cities/${c.slug}`}
                value={`${c.ratio.toFixed(1)}x visitors vs residents`}
                texture={c.texture}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* The curated showcase: the deepest markets, one card each, single
          column. Three real figures per city; a missing figure shows the board
          dash. The long tail stays reachable via the map and the country pages,
          so this stays a showcase rather than a dump. */}
      {showcase.length > 0 ? (
        <section className="mt-14 md:mt-20" aria-labelledby="showcase-heading">
          <SectionEyebrow className="mb-2">The deepest markets</SectionEyebrow>
          <h2
            id="showcase-heading"
            className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink-900 leading-tight"
          >
            The biggest metros, by the numbers
          </h2>
          <p className="mt-3 max-w-2xl text-base text-graphite leading-relaxed">
            The deepest demand pools on the map: almost any concept finds enough
            customers here, which is exactly why the rent and the wage bill come
            for the margin first. The figures below frame the size of each
            market before you open it.
          </p>

          <div className="mt-6 md:mt-8 flex flex-col gap-3 md:gap-4">
            {showcase.map((city) => (
              <CityStatCard key={city.slug} city={city} />
            ))}
          </div>

          <p className="mt-6 max-w-2xl text-xs leading-relaxed text-cocoa-700/70">
            Visitor, salary, and metro GDP figures are approximate and modeled to
            stay consistent across cities, so they read as comparisons rather than
            audited accounts. Open a city for the fuller picture.
          </p>
        </section>
      ) : null}
    </article>
  );
}
