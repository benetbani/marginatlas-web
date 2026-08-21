/**
 * City-vs-city comparison page.
 *
 * Route: /compare/cities/[pair]
 *
 * pair = {left-slug}-vs-{right-slug}, with the slugs in canonical
 * alphabetical order so each comparison has a unique URL. Twenty
 * hand-picked pairs are seeded in city_comparisons_v1.json.
 *
 * Each page renders:
 *   - Two heroes side by side
 *   - Stat block: population, GDP, GDP per capita, median wage
 *   - Industry side-by-side bar chart (10 industries, est. revenue)
 *   - Deep-link grid: 6 per side
 *   - One paragraph of editorial framing
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import cityListJson from "../../../../../../data/cities/city_list_v1.json";
import comparisonsJson from "../../../../../../data/cities/city_comparisons_v1.json";
import countryFactorsJson from "../../../../../../data/economic_indicators/country_factors_v1.json";
import countryBaselineJson from "@/lib/cells/country_smb_baseline.json";
import { getCityHero } from "@/lib/images/city_heroes";
import { colors } from "@/lib/design-tokens";
import { CountryFlag } from "@/components/CountryFlag";
import { COUNTRIES } from "@/lib/taxonomy";

export const revalidate = 43200;

type City = {
  slug: string;
  name: string;
  iso2: string;
  pop_m: number;
  gdp_b: number;
  wealth_z: number;
};
type Pair = { left: string; right: string; hook: string };
type CountryFactors = { gdp_per_capita_usd: number; cpi_score: number; urbanization_pct: number };
type CountryBaseline = { payroll_per_employee_usd: number; revenue_multiplier: number };

const CITIES = (cityListJson as { cities: City[] }).cities;
const CITIES_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));
const PAIRS = (comparisonsJson as { pairs: Pair[] }).pairs;
const FACTORS = countryFactorsJson as { default_fallback: CountryFactors; countries: Record<string, CountryFactors> };
const BASELINES = countryBaselineJson as unknown as { default_fallback: CountryBaseline; countries: Record<string, CountryBaseline> };

/**
 * The rows of the city-versus-city comparison, and where each one opens.
 *
 * NINE OF THE TEN IDS WERE NOT SLUGS THIS TAXONOMY PRODUCES, and `id` is
 * interpolated straight into a cell URL further down. slugToIndustry never
 * fails, so every link worked, and two of them opened a different business
 * entirely:
 *
 *   "fitness-centers"  ->  garden-centres-nurseries
 *   "specialty-retail" ->  specialty-food-production
 *
 * A reader clicking "Fitness" on a comparison of two cities landed on garden
 * centres, under a heading naming garden centres. That is the failure this
 * project treats as the worst one available, and it was two clicks from the
 * home page.
 *
 * `slug` is now the canonical, default-visible trade, and it is NULL where
 * there is no honest destination:
 *
 *   Law     the only law entry is sole-practitioner law firms, which is not
 *           default-visible and so has no page of its own
 *   Retail  a category, not a trade. The nearest entries are eyewear, bags and
 *           bakeries, which are three different shops
 *
 * Those two rows keep their estimate, which is modelled from `base` and does
 * not depend on the taxonomy at all, and simply do not link. The row set is the
 * founder's and is unchanged; only the destinations are.
 */
const HEADLINE_INDUSTRIES: Array<{
  /* A REACT KEY, NOT A TRADE. It was called `id` and was interpolated into
     cell URLs, which is how "fitness-centers" came to open garden centres.
     `slug` below is the trade reference now; this only has to be unique and
     stable. Renamed so nothing reads it as a taxonomy id again, and so the
     industry-reference gate stops treating these strings as trades. */
  key: string;
  slug: string | null;
  label: string;
  base: number;
}> = [
  { key: "restaurants", slug: "restaurants", label: "Restaurants", base: 1.0 },
  { key: "coffee-shops", slug: "cafes-coffee-shops", label: "Coffee", base: 0.6 },
  { key: "law-offices", slug: null, label: "Law", base: 2.0 },
  { key: "hair-salons", slug: "hairdressers-beauty", label: "Hair", base: 0.4 },
  { key: "construction-residential", slug: "carpenters-finish-work", label: "Carpentry", base: 1.4 },
  { key: "software-dev-services", slug: "software-development", label: "Software", base: 2.4 },
  { key: "fitness-centers", slug: "sports-fitness", label: "Fitness", base: 0.7 },
  { key: "specialty-retail", slug: null, label: "Retail", base: 0.8 },
  { key: "auto-repair", slug: "auto-repair-shops", label: "Auto repair", base: 0.5 },
  { key: "real-estate-brokerage", slug: "real-estate-agencies", label: "Real estate", base: 1.6 },
];

function pairSlug(left: string, right: string): string {
  return `${left}-vs-${right}`;
}

export async function generateStaticParams() {
  return PAIRS.map((p) => ({ pair: pairSlug(p.left, p.right) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pair: string }>;
}): Promise<Metadata> {
  const { pair } = await params;
  const p = PAIRS.find((q) => pairSlug(q.left, q.right) === pair);
  if (!p) return { title: "Comparison not found | Margin Atlas" };
  const a = CITIES_BY_SLUG.get(p.left);
  const b = CITIES_BY_SLUG.get(p.right);
  if (!a || !b) return { title: "Comparison not found | Margin Atlas" };
  // Rebuilt from the RESOLVED pair rather than echoing the raw param, so the
  // canonical always carries the one ordering this route serves. A comparison
  // reads both ways round in a reader's head but only one way in a URL, and
  // pairSlug is what generateStaticParams emits. Without an `alternates` of its
  // own this route inherited the root layout's `canonical: "/"`.
  const canonical = `/compare/cities/${pairSlug(p.left, p.right)}`;
  return {
    title: `${a.name} vs ${b.name} | Margin Atlas`,
    description: `Side-by-side small-business benchmarks for ${a.name} and ${b.name}: revenue, wages, industry mix.`,
    alternates: { canonical },
  };
}

function fmt(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${Math.round(v / 1_000)}K`;
  return `$${v.toFixed(0)}`;
}

function estimateRevenue(city: City, base: number): number {
  const cb = BASELINES.countries[city.iso2] || BASELINES.default_fallback;
  const cf = FACTORS.countries[city.iso2] || FACTORS.default_fallback;
  const cityBoost = Math.max(0.7, Math.min(1.6, 1.0 + city.wealth_z * 0.12));
  return 350_000 * base * cb.revenue_multiplier * cityBoost * (cf.urbanization_pct / 75);
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ pair: string }>;
}) {
  const { pair } = await params;
  const p = PAIRS.find((q) => pairSlug(q.left, q.right) === pair);
  if (!p) notFound();
  const a = CITIES_BY_SLUG.get(p.left);
  const b = CITIES_BY_SLUG.get(p.right);
  if (!a || !b) notFound();

  const aHeroRecord = getCityHero(a.slug);
  const bHeroRecord = getCityHero(b.slug);
  // Sanity §7 — pattern-fallback variants don't have a usable photo URL;
  // treat them as absent so the gradient block renders instead of a broken img.
  const aHero =
    aHeroRecord && aHeroRecord.variant !== "pattern" && aHeroRecord.image_url_full
      ? aHeroRecord
      : undefined;
  const bHero =
    bHeroRecord && bHeroRecord.variant !== "pattern" && bHeroRecord.image_url_full
      ? bHeroRecord
      : undefined;
  const aCountry = COUNTRIES.find((c) => c.code === a.iso2)?.name || a.iso2;
  const bCountry = COUNTRIES.find((c) => c.code === b.iso2)?.name || b.iso2;
  const aCb = BASELINES.countries[a.iso2] || BASELINES.default_fallback;
  const bCb = BASELINES.countries[b.iso2] || BASELINES.default_fallback;
  const aGdpPc = (a.gdp_b * 1_000_000_000) / (a.pop_m * 1_000_000);
  const bGdpPc = (b.gdp_b * 1_000_000_000) / (b.pop_m * 1_000_000);

  const industryEstimates = HEADLINE_INDUSTRIES.map((ind) => ({
    ...ind,
    aVal: estimateRevenue(a, ind.base),
    bVal: estimateRevenue(b, ind.base),
  }));
  const maxAcross = Math.max(...industryEstimates.flatMap((i) => [i.aVal, i.bVal]));

  return (
    <article className="pb-16">
      {/* Side-by-side heroes */}
      {/* `bg-stone-100` until 2026-08-17. stone is Tailwind's WARM neutral,
          which is off-palette for the same reason cream is, and it is a stock
          ramp no token file here defines, so the gate had no word for it. This
          is a letterbox behind two photographs, i.e. the ground that shows
          only where a hero is missing, so the honest replacement is the site's
          own hairline neutral rather than another tinted grey. */}
      <section className="grid grid-cols-2 w-full aspect-[21/8] overflow-hidden bg-parchment mb-8 md:mb-12">
        {[
          { city: a, hero: aHero, country: aCountry },
          { city: b, hero: bHero, country: bCountry },
        ].map((side, i) => (
          <div key={i} className="relative overflow-hidden">
            {side.hero ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={side.hero.image_url_full}
                  alt={side.hero.alt}
                  className="w-full h-full object-cover"
                  style={{ filter: "contrast(1.06) saturate(0.88)" }}
                />
                {/* Terracotta since 2026-08-17. This was the same amber photo
                    tint CityHero carried, rgba(212,119,6), pasted a second
                    time, so the two surfaces were one defect in two places.
                    atlas-700 at the same .22 and the same multiply blend. */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, rgba(0,0,0,0.1) 30%, ${colors.atlas[700]}38 100%)`, mixBlendMode: "multiply" }} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-paper-100 via-parchment to-paper-250" />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide font-semibold mb-1 opacity-90">
                <CountryFlag iso2={side.city.iso2} className="w-4" />
                {side.country}
              </div>
              <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight">
                {side.city.name}
              </h2>
            </div>
          </div>
        ))}
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
          City comparison
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-ink-900 mb-3 max-w-3xl">
          {a.name} <span className="text-cocoa-700/50">vs</span> {b.name}
        </h1>
        <p className="text-base md:text-lg text-cocoa-700/80 mb-10 max-w-2xl leading-relaxed">
          {p.hook}
        </p>

        {/* Stat grid */}
        <section className="grid grid-cols-2 gap-3 md:gap-5 mb-12">
          {[
            { label: "Metro population", aVal: `${a.pop_m.toFixed(1)}M`, bVal: `${b.pop_m.toFixed(1)}M` },
            { label: "Metro GDP", aVal: `$${a.gdp_b.toFixed(0)}B`, bVal: `$${b.gdp_b.toFixed(0)}B` },
            { label: "GDP per resident", aVal: fmt(aGdpPc), bVal: fmt(bGdpPc) },
            { label: "Typical pay, modeled", aVal: fmt(aCb.payroll_per_employee_usd), bVal: fmt(bCb.payroll_per_employee_usd) },
            { label: "Cost tier vs global", aVal: `${aCb.revenue_multiplier.toFixed(2)}x`, bVal: `${bCb.revenue_multiplier.toFixed(2)}x` },
            { label: "Wealth z-score", aVal: `${a.wealth_z >= 0 ? "+" : ""}${a.wealth_z.toFixed(1)}`, bVal: `${b.wealth_z >= 0 ? "+" : ""}${b.wealth_z.toFixed(1)}` },
          ].map((row) => (
            <div key={row.label} className="col-span-2 grid grid-cols-[1fr,auto,1fr] items-center gap-2 md:gap-6 py-3 border-b border-parchment last:border-0">
              <div className="text-right font-display text-lg md:text-2xl font-medium text-ink-900 tabular-nums">
                {row.aVal}
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-wide text-cocoa-700/60 font-semibold text-center min-w-[110px] md:min-w-[160px]">
                {row.label}
              </div>
              <div className="text-left font-display text-lg md:text-2xl font-medium text-ink-900 tabular-nums">
                {row.bVal}
              </div>
            </div>
          ))}
        </section>

        {/* Industry side-by-side bars */}
        <section className="mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-2">
            Ten activities, side by side
          </h2>
          <p className="text-sm text-cocoa-700/80 mb-6 max-w-2xl">
            A modeled revenue estimate per firm, scaled from each country&apos;s
            cost level and each city&apos;s wealth, not a direct measurement.
            Figures are in US dollars and are not adjusted for local prices, so
            read the pattern across activities rather than the exact totals or a
            head-to-head winner.
          </p>
          <div className="space-y-2">
            {industryEstimates.map((ind) => {
              const aPct = (ind.aVal / maxAcross) * 100;
              const bPct = (ind.bVal / maxAcross) * 100;
              return (
                <div key={ind.key} className="grid grid-cols-[1fr,140px,1fr] items-center gap-2 md:gap-3">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-[11px] md:text-xs text-cocoa-700/70 tabular-nums">
                      {fmt(ind.aVal)}
                    </span>
                    <div className="h-3 md:h-4 bg-atlas-500/70 rounded-l-full" style={{ width: `${aPct}%`, minWidth: "2px" }} />
                  </div>
                  <div className="text-[10px] md:text-xs uppercase tracking-wide text-cocoa-700/60 font-semibold text-center">
                    {ind.label}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 md:h-4 bg-cocoa-500/70 rounded-r-full" style={{ width: `${bPct}%`, minWidth: "2px" }} />
                    <span className="text-[11px] md:text-xs text-cocoa-700/70 tabular-nums">
                      {fmt(ind.bVal)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-cocoa-700/70">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-atlas-500/70 rounded-full" /> {a.name}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-cocoa-500/70 rounded-full" /> {b.name}
            </span>
          </div>
        </section>

        {/* Deep link grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {[
            { city: a, label: a.name },
            { city: b, label: b.name },
          ].map(({ city, label }) => (
            <div key={city.slug} className="atlas-card p-5 md:p-6">
              <h3 className="font-display text-lg md:text-xl font-medium tracking-tight text-ink-900 mb-3">
                Go deeper on {label}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {HEADLINE_INDUSTRIES.slice(0, 6)
                  .filter((ind) => ind.slug !== null)
                  .map((ind) => (
                  <Link
                    key={ind.key}
                    href={`/${city.iso2.toLowerCase()}/${city.slug}/${ind.slug}`}
                    className="text-sm text-atlas-700 hover:text-atlas-900 underline decoration-atlas-200 hover:decoration-atlas-700 underline-offset-2"
                  >
                    {ind.label} →
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-parchment">
                <Link
                  href={`/cities/${city.slug}`}
                  className="text-sm text-cocoa-700 font-medium hover:text-atlas-700"
                >
                  Full {city.name} page →
                </Link>
              </div>
            </div>
          ))}
        </section>
      </div>
    </article>
  );
}
