/**
 * Plan v26 Phase B.4 — neighborhood cell page.
 *
 * URL: /[country]/[city]/[neighborhood]/[industry]
 *
 * Resolves the city-level cell via the existing getCellBySlug chain,
 * then applies the (industry, neighborhood-character) multiplier to
 * synthesize neighborhood-level numbers. Renders the same canonical
 * sections as the 3-segment cell page: hero, revenue tiles, profit
 * waterfall, distribution, across-cities strip.
 *
 * Tier 1+2 cities only — neighborhoods_v1.json lists which cities
 * have a scheme. Unknown city/neighborhood pairs 404.
 */
import { notFound } from "next/navigation";
import { getCellBySlug, slugify } from "@/lib/cells";
import { iso2ToName } from "@/lib/countries";
import {
  INDUSTRIES,
  industryToSlug,
  slugToIndustry,
  resolveToMeasuredIndustry,
} from "@/lib/taxonomy";
import {
  getNeighborhoodsForCity,
  getNeighborhood,
  applyNeighborhoodMultiplier,
} from "@/lib/cities/neighborhoods";
import { HeroBenchmark } from "@/components/HeroBenchmark";
import { MarginWaterfall } from "@/components/MarginWaterfall";
import { DistributionVisual } from "@/components/DistributionVisual";
import { NetProfitSummary } from "@/components/NetProfitSummary";
import { CoverageIndicator } from "@/components/CoverageIndicator";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CountryFlag } from "@/components/CountryFlag";
import { fmtMoney } from "@/lib/format/money";
import { estimateNetProfit } from "@/lib/finance/net_profit";
import { sectorIcon } from "@/lib/taxonomy/sector_icons";

export const revalidate = 21600;
export const dynamicParams = true;
// Plan v26 follow-up — Vercel Hobby defaults serverless function timeout
// to 10s, but cold-start cells_master queries on US can take 13-15s
// before warm-up. Raise to 60s (Hobby ceiling) so cold starts don't
// drop the request. After the index migration this returns to <2s.
export const maxDuration = 60;

type Params = {
  country: string;
  city: string;
  neighborhood: string;
  industry: string;
};

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { country, city, neighborhood, industry } = await params;
  const ind = slugToIndustry(industry);
  if (!ind) return { title: "Page not found" };
  const cityName = city
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" ");
  const nbName = neighborhood
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" ");
  const title = `How much do ${ind.name.toLowerCase()} earn in ${nbName}, ${cityName}? | Margin Atlas`;
  const desc = `Typical revenue, employment, and owner take-home for ${ind.name.toLowerCase()} in the ${nbName} neighborhood of ${cityName}. Synthesized from city-level data and neighborhood character.`;
  return {
    title,
    description: desc,
    alternates: {
      canonical: `/${country.toLowerCase()}/${city.toLowerCase()}/${neighborhood.toLowerCase()}/${industry.toLowerCase()}`,
    },
  };
}

export default async function NeighborhoodCellPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country, city, neighborhood, industry } = await params;

  // Resolve the neighborhood. Unknown city/neighborhood → 404.
  const nb = getNeighborhood(city, neighborhood);
  if (!nb) notFound();

  // Resolve the industry. Unknown industry → 404.
  const rawInd = slugToIndustry(industry);
  if (!rawInd) notFound();
  const ind = resolveToMeasuredIndustry(rawInd) || rawInd;

  // Get the city-level cell (always returns something thanks to Plan v25 B.3).
  const cityCell = await getCellBySlug(country, city, industry);

  // Apply the neighborhood character multiplier.
  const cell = applyNeighborhoodMultiplier(cityCell, ind.id, nb.character);

  // Always-synthetic: even if the city cell was real, the neighborhood
  // multiplier introduces estimation, so this page is always flagged
  // as derived.
  cell.is_synthetic = true;
  cell.coverage_tier = "X";
  cell.coverage_source = `Estimated from ${cityCell.geo_name || city} city averages, adjusted for neighborhood character`;

  const cityName =
    cityCell.geo_name ||
    city
      .split("-")
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join(" ");

  const breadcrumbs = [
    { label: "Home", href: "/" },
    {
      label: iso2ToName(country) || country.toUpperCase(),
      href: `/${country.toLowerCase()}`,
    },
    {
      label: cityName,
      href: `/${country.toLowerCase()}/${city.toLowerCase()}`,
    },
    {
      label: nb.name,
      href: `/${country.toLowerCase()}/${city.toLowerCase()}/${neighborhood.toLowerCase()}`,
    },
    { label: ind.name },
  ];

  const profit = cell.revenue_per_firm
    ? estimateNetProfit({
        iso2: country.toUpperCase(),
        geoId: cell.geo_id,
        industryId: ind.id,
        sectorId: ind.sector_id || null,
        grossRevenue: cell.revenue_per_firm,
        payroll:
          cell.payroll_per_employee != null && cell.n_employees != null
            ? cell.payroll_per_employee * cell.n_employees
            : null,
      })
    : null;

  // Sister neighborhoods in the same city — for the strip below the
  // main content.
  const allNeighborhoods = getNeighborhoodsForCity(city) || [];
  const siblings = allNeighborhoods.filter((n) => n.slug !== nb.slug).slice(0, 4);

  return (
    <div className="xl:flex xl:gap-16">
      <div className="xl:flex-1 xl:min-w-0">
        <Breadcrumb items={breadcrumbs} />

        {/* Hero */}
        <HeroBenchmark
          iso2={country.toUpperCase()}
          countryName={iso2ToName(country) || country.toUpperCase()}
          geoName={`${nb.name}, ${cityName}`}
          industryName={ind.name}
          industryExamples={ind.examples}
          sectorName={
            ind.sector_id
              ? `${sectorIcon(ind.sector_id)} ${ind.sector_id.replace(/_/g, " ")}`
              : null
          }
          revenue={cell.revenue_per_firm ?? null}
          currencySymbol="$"
        />

        {/* Neighborhood character chip */}
        <section className="bg-cream-100 border-l-4 border-l-atlas-700 py-5 md:py-6">
          <div className="text-xs md:text-sm font-bold uppercase tracking-[0.14em] text-atlas-700 mb-2">
            Neighborhood character
          </div>
          <p className="text-base md:text-lg italic text-ink-900 max-w-3xl leading-relaxed">
            <strong className="not-italic font-semibold text-atlas-700">
              {nb.name}
            </strong>{" "}
            is classified as{" "}
            <strong className="not-italic font-semibold text-atlas-700">
              {nb.character.replace(/-/g, " ")}
            </strong>
            .{" "}
            {nb.description}
          </p>
        </section>

        <CoverageIndicator
          tier="estimated"
          variant="expanded"
          industryName={ind.name}
          geoName={`${nb.name}, ${cityName}`}
        />

        {/* Profit estimate */}
        <NetProfitSummary
          iso2={country.toUpperCase()}
          geoId={cell.geo_id}
          industryId={ind.id}
          sectorId={ind.sector_id || null}
          grossRevenue={cell.revenue_per_firm ?? null}
          payroll={
            cell.payroll_per_employee != null && cell.n_employees != null
              ? cell.payroll_per_employee * cell.n_employees
              : null
          }
          takeHome={profit?.net_profit ?? null}
        />

        {/* Profit waterfall — always-rendered after Plan v25 Block 4 */}
        <MarginWaterfall
          grossMargin={cell.gross_margin ?? null}
          operatingMargin={cell.operating_margin ?? null}
          netMargin={cell.net_margin ?? null}
        />

        {/* Distribution */}
        <DistributionVisual
          p10={cell.rev_p10 ?? null}
          p50={cell.rev_p50 ?? null}
          p90={cell.rev_p90 ?? null}
        />

        {/* Sister neighborhoods strip */}
        {siblings.length > 0 && (
          <section className="py-8">
            <h2 className="text-xl md:text-2xl font-semibold text-ink-900 mb-4">
              {ind.name} elsewhere in {cityName}
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
              {siblings.map((s) => (
                <a
                  key={s.slug}
                  href={`/${country.toLowerCase()}/${city.toLowerCase()}/${s.slug}/${industry.toLowerCase()}`}
                  className="block px-4 py-3 rounded-xl border border-parchment bg-white hover:border-atlas-500 transition"
                >
                  <div className="text-sm font-medium text-ink-900">
                    {s.name}
                  </div>
                  <div className="text-xs text-ink-700/70 mt-1">
                    {s.character.replace(/-/g, " ")}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Back to city + country */}
        <section className="py-6 border-t border-parchment text-sm text-ink-700/70">
          <div className="flex items-center gap-3 flex-wrap">
            <CountryFlag iso2={country.toUpperCase()} className="w-4" />
            <a
              href={`/${country.toLowerCase()}/${city.toLowerCase()}`}
              className="hover:text-atlas-700"
            >
              Back to {cityName}
            </a>
            <span>·</span>
            <a
              href={`/${country.toLowerCase()}/${city.toLowerCase()}/industries`}
              className="hover:text-atlas-700"
            >
              All industries in {cityName}
            </a>
            <span>·</span>
            <a
              href={`/industries/${industryToSlug(ind.id)}`}
              className="hover:text-atlas-700"
            >
              {ind.name} worldwide
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
