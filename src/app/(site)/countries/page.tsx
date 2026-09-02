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
import { getCoverageRows } from "@/lib/coverage/report";
import { CountryFlag } from "@/components/CountryFlag";
import cityListJson from "../../../../data/cities/city_list_v1.json";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "All countries | Margin Atlas",
  description:
    "Every country covered by Margin Atlas, grouped by continent. Open a country to see the small-business benchmark, regions, and cities inside.",
  alternates: { canonical: "/countries" },
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

  /* Benchmarks per country, from the one coverage reader.
     This header said "Atlas coverage" over the figure 195, which is how many
     countries have a PAGE. 94 of them hold a benchmark, so the headline claim
     of the page overstated its own coverage twofold, and every card in the grid
     below looked equally covered. Both numbers are shown now, because both are
     true and only one of them was being said. */
  const benchmarksByIso2 = new Map(
    getCoverageRows().map((r) => [r.iso2, r.cellCount]),
  );

  const totalCountries = COUNTRIES.length;
  const totalCities = CITY_LIST.length;
  const measuredCountries = COUNTRIES.filter((c) =>
    benchmarksByIso2.has(c.code),
  ).length;

  return (
    /* max-w-7xl mx-auto px-4 md:px-6 removed. SiteChrome already gives this
       route max-w-content mx-auto px-6, so the 1280 cap never applied and the
       second padding just doubled the gutter into a 1024 column inside the
       site's 1072: the cohesion audit's item 7. */
    <article className="py-10 md:py-14">
      {/* Header: an editorial masthead on a seated card, a faint survey-grid
         motif behind it, and the coverage in three figures. */}
      {/* Canonical surface: was "rounded-2xl border border-parchment
          bg-cream-50", a fully opaque hand-roll, and bg-cream-50 is #ffffff.
          AtlasFrame paints a fixed photograph behind every route with no
          centre plate, so an opaque fill blocks the picture dead where
          .atlas-card carries it at .955. .atlas-card already sets
          position:relative, which is what the survey-grid motif below needs
          to position against, and what keeps the card above the frame's own
          fixed layers. */}
      <header className="atlas-card overflow-hidden px-6 py-8 md:px-10 md:py-12 mb-7">
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
            Every country with a page
          </h1>
          <p className="max-w-2xl text-base md:text-lg text-cocoa-700/85 leading-relaxed">
            Open any country for its small-business benchmark, the regions
            inside, and the cities beneath it. Grouped by continent.
          </p>
          {/* The continent count stood in the third slot and told a reader
              nothing: the continents are the headings of the page directly
              below, and six was never a fact anyone needed. It gave up its
              place to the number this page exists to report. */}
          <div className="mt-6 flex flex-wrap gap-x-9 gap-y-2">
            <Stat value={measuredCountries} label="with benchmarks" />
            <Stat value={totalCountries} label="countries" />
            <Stat value={totalCities} label="cities" />
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
              /* Same conversion as the header above. The 195 country tiles
                 INSIDE this card are deliberately left on their own
                 rounded-lg: they sit on a card, not on the photograph, so
                 their fill is not what carries the picture, and .atlas-card's
                 16px radius on a 56px tile is a worse drawing than the 8px
                 they have. Converging a surface is not the same as converging
                 a mark. */
              className="atlas-card px-5 py-5 md:px-7 md:py-6"
            >
              <div className="mb-4 flex items-baseline justify-between gap-3">
                <h2 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-ink-900">
                  {continent}
                </h2>
                <span className="text-xs uppercase tracking-wide text-ink-500 tabular-nums">
                  {sorted.length} countries
                </span>
              </div>
              {/* ONE COLUMN AT PHONE, measured rather than chosen. Two columns
                  inside a 327px card leave a name 68px, and 68px does not hold
                  "Cameroon" (69px), let alone "Madagascar" (83px): 27 names
                  still overflowed after they were allowed to wrap, because a
                  single word has nowhere to break. One column gives the name
                  219px and every country on the list fits, one name on one
                  line, except the longest, which wraps in two. Step 6's own
                  instruction: at phone width a wide thing reconfigures.
                  The ladder above phone moved down one rung with it, 1 / 2 / 3 /
                  4 / 5, because the old 3-at-640 and 4-at-768 were the two rungs
                  that still overflowed after the wrap: 88px of name at 768 does
                  not hold "Turkmenistan" or "Liechtenstein" (91px each), and a
                  single word has nowhere to break. Counted at eight widths after
                  the change, no name is cut at any of them. */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {sorted.map((country) => {
                  const cityCount = CITY_COUNT_BY_ISO2.get(country.code) || 0;
                  /* Benchmarks first, cities second, because the benchmark is
                     what this site is for and a reader scanning 195 identical
                     cards had no way to tell which ones hold one. A card with
                     neither line still links: the country page carries tax
                     rates, formation costs and cities regardless, so a missing
                     line means no benchmarks, not an empty page. */
                  const benchmarks = benchmarksByIso2.get(country.code) || 0;
                  return (
                    <Link
                      key={country.code}
                      href={`/${country.code.toLowerCase()}`}
                      className="group flex items-center gap-3 rounded-lg border border-parchment bg-white p-3 transition-all hover:-translate-y-px hover:border-atlas-300 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2"
                    >
                      {/* No radius class here, and none anywhere else that
                          draws a flag: CountryFlag strips one now, and the
                          note in that file says why. This tile carried
                          `rounded-sm` on all 194 of its flags. */}
                      <CountryFlag iso2={country.code} className="w-8 shrink-0" />
                      <span className="min-w-0">
                        {/* A NAME WRAPS, IT NEVER CLIPS. `truncate` cut a
                            country's name at every width this page renders at:
                            measured on the render, 55 of 194 at 375, 20 at 768,
                            10 at 1280 and at 1440, and "Saint Vincent and the
                            Grenadines" needs 224px against the widest column
                            this grid ever gives a name, 125px, so it was cut on
                            every screen there is. A visitor comes here to find
                            the country they came for; a clipped name defeats
                            that. C6 settled the same fault the same way on the
                            trades card: wrap. `leading-snug` keeps the second
                            line tight to the first so the pair still reads as
                            one name. */}
                        <span className="block text-sm font-semibold leading-snug text-ink-900 group-hover:text-atlas-700">
                          {country.name}
                        </span>
                        {benchmarks > 0 ? (
                          <span className="block text-[11px] text-atlas-700/80 tabular-nums">
                            {benchmarks.toLocaleString()} benchmarks
                          </span>
                        ) : cityCount > 0 ? (
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
