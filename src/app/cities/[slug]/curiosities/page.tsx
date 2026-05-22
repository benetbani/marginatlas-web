/**
 * Plan v27 Lane C.4 — curiosities page for a city.
 *
 * Route: /cities/[slug]/curiosities
 *
 * Six deterministic facts per city, server-rendered from
 * city_list_v1.json + country_factors_v1.json + country_smb_baseline.
 * No LLM, no fluff. Numbers only where defensible.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import cityListJson from "../../../../../data/cities/city_list_v1.json";
import countryFactorsJson from "../../../../../data/economic_indicators/country_factors_v1.json";
import countryBaselineJson from "@/lib/cells/country_smb_baseline.json";
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
  tier: number;
};
type CountryFactors = {
  gdp_per_capita_usd: number;
  cpi_score: number;
  urbanization_pct: number;
};
type CountryBaseline = {
  payroll_per_employee_usd: number;
  revenue_multiplier: number;
};

const CITIES = (cityListJson as { cities: City[] }).cities;
const CITIES_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));
const FACTORS = (countryFactorsJson as { default_fallback: CountryFactors; countries: Record<string, CountryFactors> });
const BASELINES = (countryBaselineJson as unknown as { default_fallback: CountryBaseline; countries: Record<string, CountryBaseline> });

export async function generateStaticParams() {
  return CITIES.filter((c) => c.tier <= 2).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = CITIES_BY_SLUG.get(slug);
  if (!city) return { title: "City not found | Margin Atlas" };
  return {
    title: `${city.name} curiosities | Margin Atlas`,
    description: `What stands out about small business in ${city.name} — six anchor facts.`,
  };
}

function fmtUsd(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${Math.round(v / 1_000)}K`;
  return `$${v.toFixed(0)}`;
}

function gdpTier(g: number): string {
  if (g >= 60000) return "high-income";
  if (g >= 25000) return "upper-middle-income";
  if (g >= 10000) return "middle-income";
  return "lower-income";
}

function costTier(rm: number): string {
  if (rm >= 1.6) return "luxury";
  if (rm >= 1.2) return "expensive";
  if (rm >= 0.85) return "mid-tier";
  if (rm >= 0.5) return "affordable";
  return "budget";
}

export default async function CuriositiesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = CITIES_BY_SLUG.get(slug);
  if (!city) notFound();

  const cf = FACTORS.countries[city.iso2] || FACTORS.default_fallback;
  const cb = BASELINES.countries[city.iso2] || BASELINES.default_fallback;
  const countryName = COUNTRIES.find((c) => c.code === city.iso2)?.name || city.iso2;

  const gdpPerCapitaCity = (city.gdp_b * 1_000_000_000) / (city.pop_m * 1_000_000);
  const cityVsCountryGdp = gdpPerCapitaCity / cf.gdp_per_capita_usd;

  const facts: Array<{ title: string; body: string; tag: string }> = [
    {
      tag: "Wage anchor",
      title: `Median wage: ${fmtUsd(cb.payroll_per_employee_usd)}`,
      body: `In ${city.name}, the median full-time small-business wage is around ${fmtUsd(cb.payroll_per_employee_usd)} per year. That puts ${countryName} in the ${gdpTier(cf.gdp_per_capita_usd)} bracket; the city itself runs ${cityVsCountryGdp >= 1.4 ? "well above" : cityVsCountryGdp >= 1.1 ? "above" : cityVsCountryGdp >= 0.9 ? "around" : "below"} the national average.`,
    },
    {
      tag: "Cost tier",
      title: `${costTier(cb.revenue_multiplier).charAt(0).toUpperCase() + costTier(cb.revenue_multiplier).slice(1)} pricing market`,
      body: `Local prices run about ${cb.revenue_multiplier.toFixed(2)}x the global SMB median. That makes ${city.name} a ${costTier(cb.revenue_multiplier)} market: typical revenue per firm scales with that multiplier, even when the cost base looks similar to neighboring countries.`,
    },
    {
      tag: "Density signal",
      title: `${city.pop_m.toFixed(1)}M people, $${city.gdp_b.toFixed(0)}B metro GDP`,
      body: `${city.name} concentrates about $${(gdpPerCapitaCity / 1000).toFixed(0)}K of GDP per resident. ${gdpPerCapitaCity >= 50000 ? "That density supports premium professional services and a dense small-business cluster." : gdpPerCapitaCity >= 20000 ? "That density supports a healthy mix of services and retail." : "That density tilts the business mix toward staples — food, retail, repair — over premium services."}`,
    },
    {
      tag: "Governance",
      title: `Cleaner-than-average governance: ${cf.cpi_score >= 60 ? "yes" : cf.cpi_score >= 40 ? "middling" : "no"}`,
      body: `On the international corruption-perception scale (0-100, higher is cleaner), ${countryName} scores ${cf.cpi_score}. ${cf.cpi_score >= 60 ? "Reported small-business revenue tracks true revenue closely; benchmarks here are reliable." : cf.cpi_score >= 40 ? "Reported revenue tracks reasonably well; some shadow-economy adjustment is appropriate for construction and real estate." : "Significant shadow-economy effects — actual SMB revenue likely exceeds reported figures, particularly in construction, real estate, and retail."}`,
    },
    {
      tag: "Urban concentration",
      title: `${cf.urbanization_pct >= 80 ? "Highly urban" : cf.urbanization_pct >= 60 ? "Mostly urban" : cf.urbanization_pct >= 40 ? "Mixed" : "Mostly rural"} country (${cf.urbanization_pct}%)`,
      body: `${cf.urbanization_pct}% of ${countryName} lives in cities. ${cf.urbanization_pct >= 80 ? `Urban industries — software, professional services, finance — earn well above the national average in ${city.name}.` : cf.urbanization_pct >= 60 ? `Urban industries earn moderately above national; rural-anchored sectors (agriculture, forestry) thin out in the metro.` : `Rural-anchored industries remain meaningful; ${city.name} pulls demand from a wider hinterland than headcount suggests.`}`,
    },
    {
      tag: "Wealth tier",
      title: `Z-score vs global median: ${city.wealth_z >= 0 ? "+" : ""}${city.wealth_z.toFixed(1)}`,
      body: `${city.name} sits ${Math.abs(city.wealth_z).toFixed(1)} standard deviations ${city.wealth_z >= 0 ? "above" : "below"} the global median for cities of comparable scale. ${city.wealth_z >= 2 ? "It's in the top decile of world cities by per-resident productivity." : city.wealth_z >= 1 ? "It's clearly above average — a wealth-concentrated metro." : city.wealth_z >= 0 ? "It's an average global city by per-resident output." : "It runs below the global median; small-business revenue is correspondingly compressed."}`,
    },
  ];

  return (
    <article className="pb-16 max-w-4xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-cocoa-700/60 font-semibold mb-3">
        <Link href={`/cities/${city.slug}`} className="hover:text-atlas-700">
          {city.name}
        </Link>
        <span>·</span>
        <CountryFlag iso2={city.iso2} className="w-4" />
        <span>{countryName}</span>
      </div>
      <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-ink-900 mb-3">
        Curiosities about {city.name}
      </h1>
      <p className="text-base md:text-lg text-cocoa-700/80 mb-10 max-w-2xl">
        Six anchor facts that shape how to read small-business numbers
        in this metro. Each one is a number, not an opinion.
      </p>

      <div className="space-y-4">
        {facts.map((f, i) => (
          <section key={i} className="rounded-2xl border border-parchment bg-white p-5 md:p-6">
            <div className="text-[10px] uppercase tracking-[0.14em] text-atlas-600 font-bold mb-2">
              {f.tag}
            </div>
            <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight text-ink-900 mb-2">
              {f.title}
            </h2>
            <p className="text-sm md:text-base text-cocoa-700/90 leading-relaxed">
              {f.body}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-10 text-sm text-cocoa-700/70">
        Want the underlying benchmarks?{" "}
        <Link
          href={`/cities/${city.slug}`}
          className="text-atlas-700 font-medium underline decoration-atlas-300 hover:decoration-atlas-700 underline-offset-2"
        >
          Back to {city.name} →
        </Link>
      </div>
    </article>
  );
}
