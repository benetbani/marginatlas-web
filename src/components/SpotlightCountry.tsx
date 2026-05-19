/**
 * SpotlightCountry — Track BB.4.
 *
 * Big card mid-page rotating daily through the curated set of countries
 * with signatures. Deterministic per day-of-year so the same country
 * shows for everyone on the same day; cycles through the full pool
 * over the year.
 */
import Link from "next/link";
import { CountryFlag } from "@/components/CountryFlag";

type Spotlight = {
  iso2: string;
  name: string;
  /** Kept on entries for source-readability; rendered via <CountryFlag iso2=…> not as an emoji. */
  flag?: string;
  line: string;
  topIndustries: { label: string; href: string }[];
};

// Curated pool of countries with signature lines and 3 representative cells.
// Order is stable so the rotation is deterministic.
const SPOTLIGHTS: Spotlight[] = [
  {
    iso2: "us",
    name: "United States",
    flag: "🇺🇸",
    line: "America's small-business heartland: restaurants, real estate, software.",
    topIndustries: [
      { label: "Restaurants, California", href: "/us/california/restaurants" },
      { label: "Real-estate agencies, New York", href: "/us/new-york/real-estate-agencies" },
      { label: "Software development, California", href: "/us/california/software-development" },
    ],
  },
  {
    iso2: "gb",
    name: "United Kingdom",
    flag: "🇬🇧",
    line: "Boutique services, indie retail, hospitality, creative agencies.",
    topIndustries: [
      { label: "Legal services, London", href: "/gb/london/legal-services" },
      { label: "Cafés & coffee, Manchester", href: "/gb/manchester/cafes-coffee-shops" },
      { label: "Software development, London", href: "/gb/london/software-development" },
    ],
  },
  {
    iso2: "de",
    name: "Germany",
    flag: "🇩🇪",
    line: "The Mittelstand: small to mid-size manufacturing and precision trades.",
    topIndustries: [
      { label: "Metal products mfg, Bayern", href: "/de/de21/metal-products-manufacturing" },
      { label: "Software development, Berlin", href: "/de/berlin/software-development" },
      { label: "Restaurants, Munich", href: "/de/munich/restaurants" },
    ],
  },
  {
    iso2: "es",
    name: "Spain",
    flag: "🇪🇸",
    line: "Tourism, hospitality, and family hotels across coast and city.",
    topIndustries: [
      { label: "Cafés & coffee, Madrid", href: "/es/madrid/cafes-coffee-shops" },
      { label: "Restaurants, Barcelona", href: "/es/barcelona/restaurants" },
      { label: "Hotels & lodging, Spain", href: "/es/spain/hotels-lodging" },
    ],
  },
  {
    iso2: "jp",
    name: "Japan",
    flag: "🇯🇵",
    line: "Family-run restaurants, ateliers, and precision craft trades.",
    topIndustries: [
      { label: "Restaurants, Tokyo", href: "/jp/jp-13000/restaurants" },
      { label: "Cafés & coffee, Japan", href: "/jp/japan/cafes-coffee-shops" },
      { label: "Software development, Japan", href: "/jp/japan/software-development" },
    ],
  },
  {
    iso2: "br",
    name: "Brazil",
    flag: "🇧🇷",
    line: "Restaurants, craft beverages, fashion, agriculture.",
    topIndustries: [
      { label: "Restaurants, São Paulo", href: "/br/br-sp/restaurants" },
      { label: "Grocery stores, São Paulo", href: "/br/br-sp/grocery-stores" },
      { label: "Cafés & coffee, Rio", href: "/br/br-rj/cafes-coffee-shops" },
    ],
  },
  {
    iso2: "mx",
    name: "Mexico",
    flag: "🇲🇽",
    line: "Restaurants, small manufacturing, retail, construction, professional services.",
    topIndustries: [
      { label: "Restaurants, Mexico City", href: "/mx/mx-cmx/restaurants" },
      { label: "Grocery stores, Jalisco", href: "/mx/mx-jal/grocery-stores" },
      { label: "Cafés & coffee, Mexico City", href: "/mx/mx-cmx/cafes-coffee-shops" },
    ],
  },
  {
    iso2: "ch",
    name: "Switzerland",
    flag: "🇨🇭",
    line: "Watches, precision instruments, boutique services.",
    topIndustries: [
      { label: "Legal services, Zurich", href: "/ch/zurich/legal-services" },
      { label: "Software development, Switzerland", href: "/ch/ch/software-development" },
      { label: "Restaurants, Geneva", href: "/ch/geneva/restaurants" },
    ],
  },
  {
    iso2: "al",
    name: "Albania",
    flag: "🇦🇱",
    line: "Cafés, hospitality on the Adriatic coast, family-run construction.",
    topIndustries: [
      { label: "Cafés & coffee, Tirana", href: "/al/tirana/cafes-coffee-shops" },
      { label: "Restaurants, Albania", href: "/al/al/restaurants" },
      { label: "Residential construction, Albania", href: "/al/al/residential-construction" },
    ],
  },
  {
    iso2: "il",
    name: "Israel",
    flag: "🇮🇱",
    line: "Software, security, biotech, boutique hospitality.",
    topIndustries: [
      { label: "Software development, Tel Aviv", href: "/il/tel-aviv/software-development" },
      { label: "Cafés & coffee, Tel Aviv", href: "/il/tel-aviv/cafes-coffee-shops" },
      { label: "Legal services, Israel", href: "/il/il/legal-services" },
    ],
  },
];

function dayOfYear(d: Date): number {
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const now = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.floor((now - start) / 86400000);
}

export function SpotlightCountry() {
  const today = new Date();
  const idx = dayOfYear(today) % SPOTLIGHTS.length;
  const s = SPOTLIGHTS[idx];

  return (
    <section className="py-10">
      <div className="rounded-2xl bg-cream-100 border border-parchment p-6 md:p-8">
        <div className="flex items-center gap-3">
          <CountryFlag iso2={s.iso2} label={s.name} className="w-14" />
          <div>
            <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
              Country of the day
            </div>
            <h2 className="mt-0.5 text-2xl md:text-3xl font-semibold tracking-tight text-ink-900">
              {s.name}
            </h2>
          </div>
        </div>
        <p className="mt-3 text-sm md:text-base text-ink-700 max-w-2xl leading-relaxed">
          {s.line}
        </p>
        <div className="mt-5 grid sm:grid-cols-3 gap-2">
          {s.topIndustries.map((ind) => (
            <Link
              key={ind.href}
              href={ind.href}
              className="block px-3 py-2.5 rounded-lg bg-white border border-ink-200/60 hover:border-atlas-500 transition text-sm text-ink-900"
            >
              {ind.label} →
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <Link
            href={`/${s.iso2}`}
            className="text-sm text-atlas-700 hover:text-atlas-900 font-medium"
          >
            Open the {s.name} country page →
          </Link>
        </div>
      </div>
    </section>
  );
}
