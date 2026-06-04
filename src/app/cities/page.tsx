/**
 * Cities directory - /cities.
 *
 * Reformation (bible Section 14, the City directory row: "local discovery"
 * with key modules "industries, rent, demand, rankings", whose stated things
 * to avoid are "tourism fluff" and, for any directory, an "alphabetical dump
 * only"). The page now leads with a blunt read of what the directory is for,
 * keeps the geographic map as the anchor, then groups the cities by the depth
 * of the local market instead of listing them flat by alphabet. Each city
 * carries the real signal the city page already loads: how deep the market is,
 * what the locals can pay, and how much of the demand walks in as a visitor.
 *
 * The reading groups and the per-city words come from a pure synthesis module
 * (src/lib/scores/city_directory) fed only the city list the page already
 * imports. It invents no numbers; it restates the same figures through the
 * same break tables the city hero uses, and any city missing a field degrades
 * to a plain link (bible: hide weakness, no apologetic placeholder).
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

// Join the city list to the coordinates table. v34 sanity sweep section
// 2 hard target 2.4: render exactly the full set, do not silently drop.
// A city missing coords at 0,0 would distort the map, so we filter it out of
// the map only; it still appears in the grouped list below.
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
 * One city, rendered as an editorial directory row: the flag, the name as the
 * link, and the real signals as quiet qualitative words. Each signal self-omits
 * when its field is thin, so a sparse city is still a usable, honest link.
 */
function CityRow({ city }: { city: DirectoryCity }) {
  return (
    <article className="border-t border-parchment py-3.5">
      <div className="flex items-center gap-2.5">
        <CountryFlag iso2={city.iso2} className="w-5 shrink-0" />
        <Link
          href={`/cities/${city.slug}`}
          className="font-display text-base md:text-lg font-semibold text-ink-900 hover:text-atlas-700 transition-colors"
        >
          {city.name}
        </Link>
      </div>
      {city.signals.length > 0 ? (
        <dl className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 pl-[1.875rem]">
          {city.signals.map((s) => (
            <div key={s.label} className="flex items-baseline gap-1.5">
              <dt className="text-[10px] font-medium uppercase tracking-[0.12em] text-cocoa-500">
                {s.label}
              </dt>
              <dd className="text-[13px] capitalize text-graphite">{s.word}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </article>
  );
}

export default function CitiesHub() {
  const { groups, total, visitorLed } = DIRECTORY;

  return (
    <article className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-cocoa-700/70 mb-8">
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
            So the cities below are grouped by the depth of the local market,
            not by alphabet. A deeper market forgives a narrow concept; a shallow
            one punishes it.
          </span>{" "}
          Pick a city to see its industries, costs, and rankings.
        </p>
        <p className="mt-4 text-sm text-cocoa-700/85 tabular-nums">
          <span className="text-ink-900 font-medium">{total}</span> cities
          across{" "}
          <span className="text-ink-900 font-medium">{groups.length}</span>{" "}
          reading groups.
        </p>
      </header>

      {/* Cities §1: the geographic map stays as the page anchor, one marker per
          covered city, each linking to its city page. */}
      <section className="mt-10 md:mt-12" aria-labelledby="cities-map-heading">
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

      {/* The honest tourism read (bible: tourism signal, not tourism fluff).
          The cities where visitors most outnumber residents, named plainly so
          the reader can find the markets whose economics tilt to the visitor.
          Self-omits if no city carries both numbers. */}
      {visitorLed.length > 0 ? (
        <section
          className="mt-10 md:mt-12 rounded-2xl bg-cream-100 border border-parchment px-5 py-6 md:px-7 md:py-7"
          aria-labelledby="visitor-led-heading"
        >
          <h2
            id="visitor-led-heading"
            className="font-display text-xl md:text-2xl font-semibold tracking-tight text-ink-900"
          >
            Where the customers are visitors, not locals
          </h2>
          <p className="mt-2 text-sm text-graphite leading-relaxed max-w-2xl">
            In these cities, arrivals outnumber residents by a wide margin. That
            lifts revenue and pricing power in the season and pulls both back out
            of it, so plan for the swing before you sign a year-round lease.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {visitorLed.map((c) => (
              <Link
                key={c.slug}
                href={`/cities/${c.slug}`}
                className="inline-flex items-center gap-2 text-[15px] text-cocoa-700 hover:text-atlas-700 transition-colors"
              >
                <CountryFlag iso2={c.iso2} className="w-4" />
                <span className="font-medium text-ink-900">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* The reading groups. Each is a real section with a real heading; a group
          with no cities self-omits. The grouping is the editorial spine that
          replaces the alphabetical dump. */}
      <div className="mt-14 md:mt-20 space-y-14 md:space-y-20">
        {groups.map((group) => (
          <section key={group.meta.id} aria-labelledby={`group-${group.meta.id}`}>
            <div className="max-w-3xl">
              <h2
                id={`group-${group.meta.id}`}
                className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-ink-900 leading-tight"
              >
                {group.meta.title}{" "}
                <span className="text-base font-normal text-cocoa-700/60 tabular-nums">
                  {group.cities.length}
                </span>
              </h2>
              <p className="mt-3 text-base text-graphite leading-relaxed">
                {group.meta.blurb}
              </p>
            </div>
            <div className="mt-6 md:mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-0">
              {group.cities.map((city) => (
                <CityRow key={city.slug} city={city} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-16 pt-8 border-t border-parchment text-xs text-cocoa-700/70 max-w-2xl leading-relaxed">
        Reading groups follow the depth of the local market, the single signal
        that most changes how a small business reads a place. The words on each
        city are a starting point, not a verdict. Open a city for the figures.
      </p>
    </article>
  );
}
