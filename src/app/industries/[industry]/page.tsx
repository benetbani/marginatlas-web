/**
 * Industry landing page - /industries/{slug}.
 *
 * Reformation (bible Section 5, the Industry page row: "How [industry]
 * businesses make money", whose distinctive move is to show the "business
 * model anatomy"). The page now leads with an opinionated read of HOW this
 * kind of business makes money: where each dollar of a sale goes, how little
 * tends to survive to the bottom line, and what quietly kills the weak
 * operators. The decision framing comes from a pure synthesis module
 * (src/lib/scores/industry_verdict) fed only the data this page already loads,
 * the same established pattern as the cell-page verdict and the country verdict.
 *
 * Country-page rebuild §8 (2026-05-25): cross-country aggregate sections were
 * removed sitewide. Previously the page rendered three sections built from a
 * global cross-country revenue aggregate:
 *
 *   - industry-tiles (p10 / p50 / p90 across country medians)
 *   - revenue-distribution (log-normal curve from the same aggregate)
 *   - top-countries (countries ranked by typical revenue)
 *
 * The underlying extrapolated_cells data has wrong-aggregation tails that pull
 * the global picture to nonsense (India carpenters $11.6M sitting next to
 * Germany at $118K). Global averages are also misleading for any small-business
 * question because cost structure varies massively by country. The page keeps
 * only what is true worldwide: the curated cost-structure margins and the
 * model anatomy built from them. There is NO cross-place ranking here on
 * purpose; the country row is a chooser, not a leaderboard.
 *
 * Country-specific revenue lives on the cell page (/{country}/{geo}/
 * {industry}). The country chooser hands users off to the country page.
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
import { getIndustryHero } from "@/lib/images/industry_heroes";
import { getActivityCharacter } from "@/lib/content/activity_character";
import { generateIndustryVerdict } from "@/lib/scores/industry_verdict";
import { IndustryModelLede } from "@/components/industries/IndustryModelLede";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

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

// Cap build-time static generation. The rest render on
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
  const hero = getIndustryHero(ind.id);
  const character = getActivityCharacter(ind.id);

  // Reformation decision layer (bible Sections 4, 5, 25). Pure compute, no
  // queries: the opinionated business-model read and the cost-stage anatomy
  // come from the curated margin structure this page already loads, plus the
  // activity character when one is written. Every clause self-omits on null.
  const verdict = generateIndustryVerdict({
    industryName: ind.name,
    margins: {
      grossMargin: margin.gross_margin ?? null,
      operatingMargin: margin.operating_margin ?? null,
      netMargin: margin.net_margin ?? null,
      assetIntensity: margin.asset_intensity ?? null,
    },
    edge: character?.edge ?? null,
    watchOut: character?.watchOut ?? null,
  });

  // The visible H1 is the search-sensible money question (bible Section 5
  // headline formula). The page <title> stays the benchmark phrasing, set in
  // generateMetadata above.
  const moneyQuestion = `How ${ind.name.toLowerCase()} businesses make money`;

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

      {/* 1. hero. Founder direction 2026-05-25: each activity surfaces
         a representative photograph from the curated industries
         manifest. When an image is available the hero is a full-bleed
         photo with the activity name overlaid bottom-left, otherwise
         it falls back to the legacy ink-dark editorial frame.
         Reformation (2026-06-04): the H1 is now the decision-framed money
         question; the activity name reads as the eyebrow above it. */}
      {hero ? (
        <section
          id="hero"
          className="relative w-full h-[320px] md:h-[480px] overflow-hidden bg-ink-900 mb-8 -mx-4 md:-mx-6 rounded-none md:rounded-xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hero.url}
            alt={hero.alt}
            className="w-full h-full object-cover"
            style={{ filter: "contrast(1.04) saturate(0.92)" }}
            loading="eager"
          />
          {/* Dark gradient for text legibility against any photograph. */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/35 to-ink-900/15" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-xs md:text-sm uppercase tracking-[0.18em] text-cream-200/85 font-semibold mb-2">
                {ind.name}
                {sector ? <span className="text-cream-200/60"> in {sector.name}</span> : null}
              </div>
              <h1
                className="font-display text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.04] text-cream-50"
                style={{ whiteSpace: "normal" }}
              >
                {moneyQuestion}
              </h1>
              {ind.examples && ind.examples.length > 0 && (
                <p className="mt-3 text-base md:text-lg text-cream-200/85 max-w-2xl leading-relaxed">
                  {ind.examples.slice(0, 4).join(", ")}
                </p>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section id="hero" className={`py-8 ${getToneClass("hero")}`}>
          <header>
            <div className="text-xs uppercase tracking-wide text-cream-300/80 font-medium">
              {ind.name}
              {sector ? <span className="text-cream-200/70"> in {sector.name}</span> : null}
            </div>
            <h1 className="mt-2 text-4xl md:text-6xl font-semibold tracking-tight text-cream-50">
              {moneyQuestion}
            </h1>
            {ind.examples && ind.examples.length > 0 && (
              <p className="mt-4 text-lg text-cream-200/85 max-w-2xl leading-relaxed">
                {ind.examples.slice(0, 4).join(", ")}
              </p>
            )}
          </header>
        </section>
      )}

      {/* 1b. how-it-works: the opinionated business-model read and the
         cost-stage anatomy, built from the curated margins by the
         industry-verdict synthesis module. This is the "found nowhere else"
         decision layer. The block always renders (margins fall back to a
         conservative SMB default), but every individual clause and signal
         self-omits when its input is missing. The activity-character watch-out
         carries the verdict's closing line; the edge shows as a side note. */}
      <section id="how-it-works" className="py-8 md:py-10">
        <IndustryModelLede verdict={verdict} edge={character?.edge ?? null} />
        {character && (
          <div className="mt-8 max-w-3xl space-y-4">
            {/* The hand-written mechanics. The verdict's closing line already
               carries the watch-out, so it is not repeated here; this card
               adds the "how the money actually works" depth the model summary
               cannot. */}
            <div className="rounded-xl border border-parchment bg-cream-50 p-4">
              <div className="text-[10px] uppercase tracking-[0.16em] text-atlas-700 font-semibold mb-1.5">
                How the money actually works
              </div>
              <p className="text-sm text-ink-900 leading-relaxed">{character.economics}</p>
            </div>
            {character.categoryNote && (
              <p className="text-sm text-cocoa-700/85 italic leading-relaxed border-l-2 border-atlas-300 pl-3">
                {character.categoryNote}
              </p>
            )}
          </div>
        )}
      </section>

      {/* 2. margin-waterfall: where each dollar of a sale actually goes. The
         curated cost-structure margins are stable across countries within an
         activity (a restaurant's payroll-as-share-of-revenue is similar in
         Berlin and Brazil). The cell page scales them against country-specific
         revenue; here they carry the model anatomy. */}
      <section id="margin-waterfall" className={`py-6 ${getToneClass("margin-waterfall")}`}>
        <SectionEyebrow className="mb-3">Where each dollar goes</SectionEyebrow>
        <p className="max-w-2xl text-base leading-relaxed text-graphite mb-2">
          The bars below trace a typical sale down the cost stack: what survives
          the direct cost of what is sold, what running the business leaves, and
          what reaches the bottom line. The gap between the top bar and the
          bottom one is the whole game.
        </p>
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

      {/* 3. country chooser. Country-specific revenue, employment, and cost
         benchmarks live on the cell page (/[country]/[geo]/[industry]). This
         is a chooser, not a ranking: the same activity reads very differently
         once local rent, wages, and tax land on it, so the reader picks the
         place that matters to the decision and sees the real numbers there. */}
      <section className="py-8">
        <div className="rounded-2xl bg-white border border-parchment p-5">
          <h2 className="text-lg font-semibold text-ink-900">
            See where this plays out
          </h2>
          <p className="mt-1 text-sm text-cocoa-700/85 max-w-2xl">
            The model above is the same wherever you run it. What changes the
            outcome is local rent, wages, tax, and competition. Open a country
            to see real revenue and cost numbers for {ind.name.toLowerCase()},
            then drill into regions and cities.
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
