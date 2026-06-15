/**
 * Countries hub at /countries.
 *
 * Founder spec 2026-05-25: the nav-bar "Countries" link points here.
 * Each country in the list links through to /[country], from which
 * the user can drill into the country's cities (via the existing
 * CountryCityShortcuts) and regions (via the admin1 region list).
 * Connected structure: nav -> countries -> country -> cities.
 *
 * Layout: per-continent section with a heading, then a responsive
 * grid of compact country cards (flag + name + optional city count),
 * mirroring the /world CountryTile. Compact, no wasted whitespace.
 *
 * No client JS. Server-rendered, revalidate 24h.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { COUNTRIES } from "@/lib/taxonomy";
import { CountryFlag } from "@/components/CountryFlag";
import cityListJson from "../../../data/cities/city_list_v1.json";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "All countries | Margin Atlas",
  description:
    "Every country covered by Margin Atlas, grouped by continent. Open a country to see the small-business benchmark, regions, and cities inside.",
};

type CityListEntry = { slug: string; iso2: string; continent: string };
const CITY_LIST = (cityListJson as { cities: CityListEntry[] }).cities;

// Build a per-iso2 city count from the curated city list. Used to badge
// each country with the number of cities we cover inside it.
const CITY_COUNT_BY_ISO2 = new Map<string, number>();
for (const c of CITY_LIST) {
  const iso = (c.iso2 || "").toUpperCase();
  if (!iso) continue;
  CITY_COUNT_BY_ISO2.set(iso, (CITY_COUNT_BY_ISO2.get(iso) || 0) + 1);
}

// Continent assignment per iso2. Sourced from the city list (most
// countries we cover have at least one city, so we get the continent
// from there). Countries that have no city in the curated list fall
// back to a hand-curated map below.
const CONTINENT_BY_ISO2 = new Map<string, string>();
for (const c of CITY_LIST) {
  const iso = (c.iso2 || "").toUpperCase();
  if (!iso || CONTINENT_BY_ISO2.has(iso)) continue;
  CONTINENT_BY_ISO2.set(iso, c.continent);
}

// Fallback continent map for countries not covered by the city list.
// Six bucket scheme matches /cities exactly.
const FALLBACK_CONTINENT: Record<string, string> = {
  // Africa
  BJ: "Africa", BW: "Africa", BF: "Africa", BI: "Africa", CV: "Africa",
  CM: "Africa", CF: "Africa", TD: "Africa", KM: "Africa", CG: "Africa",
  CD: "Africa", DJ: "Africa", GQ: "Africa", ER: "Africa", SZ: "Africa",
  GA: "Africa", GM: "Africa", GN: "Africa", GW: "Africa", LS: "Africa",
  LR: "Africa", LY: "Africa", MG: "Africa", MW: "Africa", ML: "Africa",
  MR: "Africa", MU: "Africa", MZ: "Africa", NA: "Africa", NE: "Africa",
  RW: "Africa", ST: "Africa", SC: "Africa", SL: "Africa", SO: "Africa",
  SS: "Africa", SD: "Africa", TZ: "Africa", TG: "Africa", UG: "Africa",
  ZM: "Africa", ZW: "Africa",
  // Asia
  AF: "Asia", BD: "Asia", BT: "Asia", BN: "Asia", KH: "Asia", TL: "Asia",
  KZ: "Asia", KG: "Asia", LA: "Asia", MV: "Asia", MN: "Asia", MM: "Asia",
  NP: "Asia", KP: "Asia", PK: "Asia", LK: "Asia", TJ: "Asia", TM: "Asia",
  UZ: "Asia",
  // Europe
  AD: "Europe", AM: "Europe", AZ: "Europe", BY: "Europe", BA: "Europe",
  CY: "Europe", GE: "Europe", IS: "Europe", LI: "Europe", LU: "Europe",
  MT: "Europe", MD: "Europe", SM: "Europe", VA: "Europe", XK: "Europe",
  ME: "Europe", MK: "Europe",
  // North America (incl. Caribbean & Central America)
  AG: "North America", BS: "North America", BB: "North America",
  BZ: "North America", CU: "North America", DM: "North America",
  SV: "North America", GD: "North America", GT: "North America",
  HT: "North America", HN: "North America", JM: "North America",
  NI: "North America", KN: "North America", LC: "North America",
  VC: "North America", TT: "North America",
  // South America
  BO: "South America", EC: "South America", GY: "South America",
  PY: "South America", SR: "South America", UY: "South America",
  VE: "South America",
  // Oceania
  FJ: "Oceania", KI: "Oceania", MH: "Oceania", FM: "Oceania", NR: "Oceania",
  PW: "Oceania", PG: "Oceania", WS: "Oceania", SB: "Oceania", TO: "Oceania",
  TV: "Oceania", VU: "Oceania",
  // MENA (we bucket into Asia + Africa above; LB/JO/SY/IQ/IR fall here)
  BH: "Asia", IR: "Asia", IQ: "Asia", IL: "Asia", JO: "Asia", KW: "Asia",
  LB: "Asia", OM: "Asia", PS: "Asia", QA: "Asia", SA: "Asia", SY: "Asia",
  YE: "Asia",
  // Egypt, Morocco, Tunisia, Algeria fall to Africa above. UAE = Asia.
  EG: "Africa", MA: "Africa", TN: "Africa", DZ: "Africa",
};

const CONTINENT_ORDER = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

function continentFor(iso2: string): string {
  const upper = iso2.toUpperCase();
  return (
    CONTINENT_BY_ISO2.get(upper) || FALLBACK_CONTINENT[upper] || "Other"
  );
}

export default function CountriesHub() {
  const grouped = new Map<string, typeof COUNTRIES>();
  for (const c of COUNTRIES) {
    const continent = continentFor(c.code);
    if (!grouped.has(continent)) grouped.set(continent, []);
    grouped.get(continent)!.push(c);
  }

  const totalCountries = COUNTRIES.length;
  const totalCities = CITY_LIST.length;
  const continentCount = CONTINENT_ORDER.filter(
    (c) => (grouped.get(c)?.length ?? 0) > 0,
  ).length;

  return (
    <article className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
      {/* Header: an editorial masthead on a seated card, a faint survey-grid
         motif behind it, and the coverage in three figures. */}
      <header className="relative overflow-hidden rounded-2xl border border-parchment bg-cream-50 px-6 py-8 md:px-10 md:py-12 mb-7">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{ backgroundImage: "url('/atlas-grid.svg')", backgroundSize: "34px 34px" }}
        />
        <div className="relative">
          <div className="text-xs uppercase tracking-[0.18em] text-atlas-700 font-semibold mb-2">
            Atlas coverage
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-ink-900 mb-3">
            Every country we cover
          </h1>
          <p className="max-w-2xl text-base md:text-lg text-cocoa-700/85 leading-relaxed">
            Open any country for its small-business benchmark, the regions
            inside, and the cities we cover. Grouped by continent.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-9 gap-y-2">
            <Stat value={totalCountries} label="countries" />
            <Stat value={totalCities} label="cities" />
            <Stat value={continentCount} label="continents" />
          </div>
        </div>
      </header>

      {/* Continent sections, each a seated card on the warm app ground. */}
      <div className="space-y-5">
        {CONTINENT_ORDER.map((continent) => {
          const list = grouped.get(continent);
          if (!list || list.length === 0) return null;
          const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name));
          return (
            <section
              key={continent}
              className="rounded-lg border border-parchment bg-cream-50 px-5 py-5 md:px-7 md:py-6"
            >
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-ink-900">
                  {continent}
                </h2>
                <span className="text-xs uppercase tracking-wide text-ink-500 tabular-nums">
                  {sorted.length} countries
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {sorted.map((country) => {
                  const cityCount = CITY_COUNT_BY_ISO2.get(country.code) || 0;
                  return (
                    <Link
                      key={country.code}
                      href={`/${country.code.toLowerCase()}`}
                      className="group flex items-center gap-3 rounded-lg border border-parchment bg-white p-3 transition-all hover:-translate-y-px hover:border-atlas-300 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2"
                    >
                      <CountryFlag
                        iso2={country.code}
                        className="w-8 shrink-0 rounded-sm"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-ink-900 group-hover:text-atlas-700">
                          {country.name}
                        </span>
                        {cityCount > 0 ? (
                          <span className="block text-[11px] text-cocoa-700/60 tabular-nums">
                            {cityCount} {cityCount === 1 ? "city" : "cities"}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}

/** One coverage figure in the header: the number in vermillion serif + label. */
function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-display text-2xl font-semibold tabular-nums text-atlas-700">
        {value}
      </span>
      <span className="text-sm text-cocoa-700/70">{label}</span>
    </div>
  );
}
