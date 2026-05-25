/**
 * Industry landing page - /industries/{slug}.
 *
 * Country-page rebuild §8 (2026-05-25): cross-country aggregate
 * sections removed sitewide. Previously the page rendered three
 * sections built from a global cross-country revenue aggregate:
 *
 *   - industry-tiles (p10 / p50 / p90 across country medians)
 *   - revenue-distribution (log-normal curve from the same aggregate)
 *   - top-countries (countries ranked by typical revenue)
 *
 * The underlying extrapolated_cells data has wrong-aggregation tails
 * that pull the global picture to nonsense (India carpenters $11.6M
 * sitting next to Germany at $118K). Global averages are also
 * misleading for any small-business question because cost structure
 * varies massively by country. The page now keeps only what's true
 * worldwide: the curated cost-structure margin waterfall.
 *
 * Country-specific revenue lives on the cell page (/{country}/{geo}/
 * {industry}). The activity index hands users off to the country page.
 */
import { notFound } from "next/navigation";
import {
  INDUSTRIES,
  INDUSTRY_BY_ID,
  SECTOR_BY_ID,
  industryToSlug,
  slugToIndustry,
  resolveToMeasuredIndustry,
} from "@/lib/taxonomy";
import { MarginWaterfall } from "@/components/MarginWaterfall";
import industryMarginsJson from "@/lib/finance/industry_margins.json";
import { INDUSTRY_PAGE_SECTIONS, getToneClass } from "@/lib/page-layout/section-order";

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

// Plan v16: cap build-time static generation. The rest render on
// demand via dynamicParams=true.
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
  if (!ind) return { title: "Activity not found | Margin Atlas" };
  return {
    title: `${ind.name}: small-business benchmarks | Margin Atlas`,
    description: `Margin structure and cost stack for ${ind.name.toLowerCase()}. Pick a country for revenue benchmarks.`,
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

  void INDUSTRY_BY_ID;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="text-sm text-ink-700/70 mb-4">
        <a href="/" className="hover:text-atlas-600">Home</a>
        <span className="mx-2">/</span>
        <a href="/industries" className="hover:text-atlas-600">Activities</a>
        <span className="mx-2">/</span>
        <span>{ind.name}</span>
      </nav>

      {/* 1. hero */}
      <section id="hero" className={`py-8 ${getToneClass("hero")}`}>
        <header>
          <div className="text-xs uppercase tracking-wide text-cream-300/80 font-medium">
            {sector ? sector.name : "Activity"}
          </div>
          <h1 className="mt-2 text-4xl md:text-6xl font-semibold tracking-tight text-cream-50">
            {ind.name}
          </h1>
          {ind.examples && ind.examples.length > 0 && (
            <p className="mt-4 text-lg text-cream-200/85 max-w-2xl leading-relaxed">
              {ind.examples.slice(0, 4).join(" - ")}
            </p>
          )}
        </header>
      </section>

      {/* 2. margin-waterfall: cost-structure margins from the curated
         industry_margins.json table. These ratios are stable across
         countries within an activity (a restaurant's payroll-as-share-
         of-revenue is similar in Berlin and Brazil). The cell page
         scales them against country-specific revenue. */}
      <section id="margin-waterfall" className={`py-6 ${getToneClass("margin-waterfall")}`}>
        <MarginWaterfall
          grossMargin={margin.gross_margin}
          operatingMargin={margin.operating_margin}
          netMargin={margin.net_margin}
        />
        {margin.notes && !/Cloned from|Wave \d|To-?Do|Fix-?Me/i.test(margin.notes) && ( // allow-internal-note
          <p className="mt-2 text-xs text-ink-700/60 italic max-w-2xl">
            {margin.notes}
          </p>
        )}
      </section>

      {/* 3. country handoff. Country-specific revenue, employment,
         and cost benchmarks live on the cell page (/[country]/[geo]/
         [industry]). The user picks a country here to see the real
         numbers. */}
      <section className="py-8">
        <div className="rounded-2xl bg-white border border-parchment p-5">
          <h2 className="text-lg font-semibold text-ink-900">
            Pick a country for {ind.name.toLowerCase()} benchmarks
          </h2>
          <p className="mt-1 text-sm text-cocoa-700/85 max-w-2xl">
            Revenue, employee counts, and cost structure are country-specific.
            Open the country page to see real local numbers, then drill into
            regions and cities.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["us","gb","de","fr","it","es","nl","jp","br","mx","au","in"] as const).map((cc) => (
              <a
                key={cc}
                href={`/${cc}/${cc === "us" ? "california" : cc}/${industryToSlug(ind.id)}`}
                className="px-3 py-1.5 rounded-full bg-cream-100 hover:bg-cream-200 border border-parchment text-sm text-ink-900 transition"
              >
                {cc.toUpperCase()}
              </a>
            ))}
          </div>
          <a
            href="/"
            className="mt-4 inline-flex items-center gap-1 text-sm text-atlas-700 hover:text-atlas-900 font-medium"
          >
            Or use the navigator on the homepage &rarr;
          </a>
        </div>
      </section>
    </div>
  );
}
