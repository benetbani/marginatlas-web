/**
 * Industry landing page — /industries/{slug}.
 *
 * Plan v13 Wave 2b — canonical 6-section order per INDUSTRY_PAGE_SECTIONS.
 * Sister industry pages MUST render the same sections in the same order;
 * sections degrade with empty-state fallbacks rather than disappearing.
 */
import { notFound } from "next/navigation";
import {
  INDUSTRIES,
  INDUSTRY_BY_ID,
  SECTOR_BY_ID,
  COUNTRIES,
  industryToSlug,
  slugToIndustry,
  resolveToMeasuredIndustry,
} from "@/lib/taxonomy";
import { getSameIndustryAcrossCountries } from "@/lib/cells";
import { purifyCountries } from "@/lib/geo/is_sovereign_country";
import { REVENUE_PER_FIRM_BOUNDS, DEFAULT_REVENUE_BOUNDS } from "@/lib/qa/smb_bounds";
import { CountryFlag } from "@/components/CountryFlag";
import { RevenueTiles } from "@/components/RevenueTiles";
import { RevenueDistribution } from "@/components/RevenueDistribution";
import { MarginWaterfall } from "@/components/MarginWaterfall";
import industryMarginsJson from "@/lib/finance/industry_margins.json";
import { INDUSTRY_PAGE_SECTIONS, getToneClass } from "@/lib/page-layout/section-order";
import { MoreDepthBanner } from "@/components/monetization";

void INDUSTRY_PAGE_SECTIONS;

export const revalidate = 86400;
export const dynamicParams = true;

type Params = { industry: string };

type IndustryMarginRow = {
  gross_margin: number;
  operating_margin: number;
  net_margin: number;
  asset_intensity?: number;
  notes?: string;
};
const INDUSTRY_MARGINS = industryMarginsJson as unknown as {
  default_fallback: IndustryMarginRow;
  industries: Record<string, IndustryMarginRow>;
};

function lookupIndustryMargin(industryId: string | null | undefined): IndustryMarginRow {
  if (!industryId) return INDUSTRY_MARGINS.default_fallback;
  return INDUSTRY_MARGINS.industries[industryId] || INDUSTRY_MARGINS.default_fallback;
}

// Plan v16: cap build-time static generation to the top 30 SMB-core
// industries (alphabetical). The rest render on demand via
// dynamicParams=true. Previous behavior pre-built all 192 industries,
// which routinely timed out Vercel's per-page 60s budget. Once S-100
// (ISR restore) lands, this cap can grow.
const STATIC_INDUSTRY_CAP = 30;

export async function generateStaticParams(): Promise<Params[]> {
  return INDUSTRIES
    .filter((i) => (i.audience || "smb_friendly") === "smb_core")
    .slice(0, STATIC_INDUSTRY_CAP)
    .map((i) => ({ industry: industryToSlug(i.id) }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { industry } = await params;
  const raw = slugToIndustry(industry);
  const ind = resolveToMeasuredIndustry(raw) || raw;
  if (!ind) return { title: "Industry not found | Margin Atlas" };
  return {
    title: `${ind.name}: small-business benchmarks | Margin Atlas`,
    description: `How much do ${ind.name.toLowerCase()} earn worldwide? Revenue, margins, and where the industry concentrates.`,
    alternates: { canonical: `/industries/${industry.toLowerCase()}` },
  };
}

export default async function IndustryPage({ params }: { params: Promise<Params> }) {
  const { industry } = await params;
  const raw = slugToIndustry(industry);
  const ind = resolveToMeasuredIndustry(raw) || raw;
  if (!ind) notFound();

  const sector = ind ? SECTOR_BY_ID[ind.sector_id] : null;
  const margin = lookupIndustryMargin(ind.id);

  // "Top countries" by revenue-per-firm proxy via extrapolated_cells,
  // pass an empty exclude so we get the global ranking.
  // v34 sanity sweep §5: purify (filter to sovereigns + dedupe by iso2)
  // before any downstream use. Fixes the "Denmark x3" bug on auto_dealers
  // and the city/state contamination on every industry page.
  const topCountriesRaw = await getSameIndustryAcrossCountries(industry, "", 20);
  const topCountries = purifyCountries(topCountriesRaw, (c) => c.country).slice(0, 10);

  // Aggregate percentiles across geographies for industry-tiles + distribution.
  // The extrapolated_cells data set doesn't carry p10/p90 percentiles, so we
  // approximate with min / median / max of country-level medians as a proxy
  // for the global cross-country spread. This is a deliberately conservative
  // empty state, the real cross-country distribution will replace it later.
  //
  // v34 sanity sweep §6: enforce per-industry plausibility bounds at the
  // render layer. Any country-level median outside [lo/5, hi*2] is dropped
  // BEFORE the aggregate is computed. Fixes the cleaning_services $37M bug
  // and any future case where extrapolated_cells has a wrong-scale row.
  const indBounds = REVENUE_PER_FIRM_BOUNDS[ind.id] ?? DEFAULT_REVENUE_BOUNDS;
  const aggLo = indBounds.lo / 5;
  const aggHi = indBounds.hi * 2;
  let aggP10: number | null = null;
  let aggP50: number | null = null;
  let aggP90: number | null = null;
  if (topCountries.length >= 3) {
    const vals = topCountries
      .map((c) => c.revenue_per_firm ?? c.rev_p50 ?? null)
      .filter((v): v is number => v != null && v > 0)
      .filter((v) => v >= aggLo && v <= aggHi)
      .sort((a, b) => a - b);
    if (vals.length >= 3) {
      const pick = (q: number) => vals[Math.floor((vals.length - 1) * q)];
      aggP10 = pick(0.1);
      aggP50 = pick(0.5);
      aggP90 = pick(0.9);
    }
  }

  void INDUSTRY_BY_ID;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-ink-700/70 mb-4">
        <a href="/" className="hover:text-atlas-600">Home</a>
        <span className="mx-2">/</span>
        <a href="/industries" className="hover:text-atlas-600">Industries</a>
        <span className="mx-2">/</span>
        <span>{ind.name}</span>
      </nav>

      {/*
        Plan v13 Wave 2b: canonical industry page section order.
        Sections render in the exact order defined in INDUSTRY_PAGE_SECTIONS.
      */}

      {/* 1. hero: Plan v14 A.1 (T-A1.3): canonical ink-dark tone applied.
         Sector eyebrow + name + examples flipped to cream variants for
         legibility on bg-ink-900. */}
      <section id="hero" className={`py-8 ${getToneClass("hero")}`}>
        <header>
          <div className="text-xs uppercase tracking-wide text-cream-300/80 font-medium">
            {sector ? sector.name : "Industry"}
          </div>
          <h1 className="mt-2 text-4xl md:text-6xl font-semibold tracking-tight text-cream-50">
            {ind.name}
          </h1>
          {ind.examples && ind.examples.length > 0 && (
            <p className="mt-4 text-lg text-cream-200/85 max-w-2xl leading-relaxed">
              {ind.examples.slice(0, 4).join(" · ")}
            </p>
          )}
        </header>
      </section>

      {/* 2. industry-tiles: aggregated revenue tiles across geographies.
         Plan v13 Wave 4a (D2): silent omission when no aggregated percentiles. */}
      {aggP50 != null && (
        <section id="industry-tiles" className={`py-6 ${getToneClass("industry-tiles")}`}>
          <RevenueTiles
            p10={aggP10}
            p50={aggP50}
            p90={aggP90}
          />
          {/* v34 Phase C: industry page banner. Per Part 5.1, p25/p75
             column LockPills + TruncatedTease for regions > 10 are
             the locked surfaces here. */}
          <MoreDepthBanner
            headline="See lower-mid and upper-mid quartiles for every region in this industry."
            tier="basic"
            entry="industry_topregions_p25_p75"
          />
        </section>
      )}

      {/* 3. revenue-distribution: log-normal curve from same aggregated percentiles.
         Plan v13 Wave 4a (D2): silent omission when insufficient points. */}
      {aggP50 != null && (
        <section id="revenue-distribution" className={`py-6 ${getToneClass("revenue-distribution")}`}>
          <RevenueDistribution
            p10={aggP10}
            p50={aggP50}
            p90={aggP90}
          />
        </section>
      )}

      {/* 4. margin-waterfall: sourced directly from canonical industry_margins.json.
         MarginWaterfall returns null when all three margins are null. */}
      <section id="margin-waterfall" className={`py-6 ${getToneClass("margin-waterfall")}`}>
        <MarginWaterfall
          grossMargin={margin.gross_margin}
          operatingMargin={margin.operating_margin}
          netMargin={margin.net_margin}
        />
        {margin.notes && (
          <p className="mt-2 text-xs text-ink-700/60 italic max-w-2xl">
            {margin.notes}
          </p>
        )}
      </section>

      {/*
        * 5. top-countries: countries ranked by median revenue per firm.
        * Plan v32 hotfix: display strictly uses COUNTRIES taxonomy
        * lookup for the country name. Some prior code paths were
        * leaking US state names ("California") into geo_name when the
        * row was a regional aggregate; that surfaced under a "Top
        * countries" header which was a catastrophic mislabel.
        */}
      {topCountries.length > 0 && (
        <section id="top-countries" className={`py-8 ${getToneClass("top-countries")}`}>
          <h2 className="text-xl md:text-2xl font-semibold text-ink-900">
            Top countries for {ind.name.toLowerCase()}
          </h2>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topCountries.slice(0, 9).map((c) => {
              const iso2 = c.country.toUpperCase();
              const countryRow = COUNTRIES.find((x) => x.code === iso2);
              const countryName = countryRow?.name ?? iso2;
              return (
                <a
                  key={iso2}
                  href={`/${iso2.toLowerCase()}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-cream-300 bg-white hover:border-atlas-600 hover:shadow-[0_6px_18px_rgba(120,53,15,0.08)] transition"
                >
                  <CountryFlag iso2={iso2} className="w-6" />
                  <span className="text-sm font-semibold text-ink-900">
                    {countryName}
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. top-cities-for-industry: Plan v13 Wave 4a (D2): stub removed.
         Section will be re-added when the city-level rollup ships. */}
    </div>
  );
}
