import { NavigatorForm } from "@/components/NavigatorForm";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { FeaturedCellTile, type FeaturedTileSpec } from "@/components/FeaturedCellTile";
import { SectorMasterMenu } from "@/components/SectorMasterMenu";
import { CellOfTheWeek } from "@/components/CellOfTheWeek";
import { GlobalCoverageStrip } from "@/components/GlobalCoverageStrip";
import { TaxOverlayTeaser } from "@/components/TaxOverlayTeaser";
import { AskWidget } from "@/components/AskWidget";
import { CityPicker } from "@/components/CityPicker";
import { TopCitiesMosaic } from "@/components/home/TopCitiesMosaic";
import { CitiesDotsMap } from "@/components/CitiesDotsMap";
import { QualityLegend } from "@/components/QualityLegend";
import { RotatingWord } from "@/components/RotatingWord";
import { DidYouKnow } from "@/components/DidYouKnow";
import { ExploreCards } from "@/components/ExploreCards";
import { HERO_CITIES, HERO_BUSINESSES } from "@/lib/hero-words";
import { getToneClass } from "@/lib/page-layout/section-order";
import { getAllPosts, type BlogPost } from "@/lib/blog";

/**
 * Plan v14 6b: full-bleed tone wrapper for homepage sections. The inner
 * content lives inside the layout's `max-w-7xl mx-auto px-6` constraint,
 * but the background color spans the full viewport via the same trick
 * the hero already uses (`left-1/2 right-1/2 -mx-[50vw] w-screen`).
 */
function ToneBand({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <div className={`relative left-1/2 right-1/2 -mx-[50vw] w-screen ${getToneClass(tone)}`}>
      <div className="max-w-7xl mx-auto px-6">{children}</div>
    </div>
  );
}

export const revalidate = 86400; // 1 day

/**
 * Plan v16 Block E — founder-specified set, 3×3 symmetric grid. Every tuple
 * must resolve in the data layer; FeaturedCellTile returns null on miss,
 * which would break the grid, so any tuple here must be pre-validated.
 * Tiles use measured parent industries (no sub-niches) per Plan v4 Step 16.
 */
const FEATURED: FeaturedTileSpec[] = [
  { iso2: "US", geo: "california",   industry: "software-development", title: "Software development", region: "San Francisco",  glyph: "💻" },
  { iso2: "GB", geo: "gb",           industry: "legal-services",       title: "Legal services",       region: "United Kingdom", glyph: "⚖️" },
  { iso2: "DE", geo: "de21",         industry: "fabricated-metal-mfg", title: "Metal manufacturing",  region: "Bavaria",        glyph: "🔩" },
  { iso2: "ES", geo: "es511",        industry: "restaurants",          title: "Restaurants",          region: "Barcelona",      glyph: "🥘" },
  { iso2: "MX", geo: "mx-roo",       industry: "hotels-lodging",       title: "Hotels",               region: "Cancún",         glyph: "🏨" },
  // Six is the symmetric grid size (2 rows × 3 cols on md). All six are
  // verified resolvable in the current snapshot. Tuples for Tokyo ramen,
  // LA gyms, Milan boutiques, Paris jewelry were dropped because the
  // underlying data isn't currently in cells_master / regional_cells
  // and the founder rule (Plan v24 Block 2) says no half-empty grids.
  { iso2: "US", geo: "california",   industry: "restaurants",          title: "Restaurants",          region: "California",     glyph: "🍽️" },
];

/**
 * Plan v15 Block 3 — blog rail. Pulls live posts when available, falls
 * back to curated placeholders so the rail always shows six cards.
 */
const BLOG_FALLBACK: BlogPost[] = [
  {
    slug: "tokyo-vs-paris-bakery-margins",
    title: "Why bakery margins in Tokyo are half what they are in Paris",
    excerpt: "Rent per square meter, flour pricing, and a labor market that punishes scale.",
    date: "2026-05-12",
  },
  {
    slug: "new-mid-market-services",
    title: "The new mid-market: services firms in 100-employee tiers",
    excerpt: "Where the headcount band stopped being a back-office detail and started shaping margin.",
    date: "2026-05-05",
  },
  {
    slug: "reading-eurostat-sbs",
    title: "How to read a European business-statistics release without getting lost",
    excerpt: "The three tables that matter and the four columns most analysts misread.",
    date: "2026-04-28",
  },
  {
    slug: "ppp-vs-fx-for-margins",
    title: "PPP vs FX: which one belongs in a margin comparison",
    excerpt: "A short, opinionated case for using PPP when the question is about lived economics.",
    date: "2026-04-19",
  },
  {
    slug: "quality-grades-explained",
    title: "What a B-grade benchmark actually means",
    excerpt: "Every number on Atlas has a grade. Here's the rubric, in plain language.",
    date: "2026-04-10",
  },
  {
    slug: "establishment-vs-firm",
    title: "Establishment vs firm: the distinction that breaks comparisons",
    excerpt: "Two countries reporting the same NAICS code can be measuring two different things.",
    date: "2026-04-02",
  },
];

function loadBlogRail(): { posts: BlogPost[]; sourced: boolean } {
  try {
    const live = getAllPosts();
    if (live.length >= 6) return { posts: live.slice(0, 6), sourced: true };
  } catch {
    // fall through to placeholder
  }
  return { posts: BLOG_FALLBACK, sourced: false };
}

function formatPostDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function HomePage() {
  const { posts: blogPosts } = loadBlogRail();
  return (
    <div>
      {/*
        Hero: Plan v16 Block B rebuild.
        Eyebrow rewritten to a marketing claim. Question-mark spacing locked
        via whitespace-nowrap so short cities (Dubai, Lagos) and long cities
        (São Paulo, Barcelona) keep the ? hugged to the word. The two large
        text-link CTAs were removed (founder explicit). The navigator form
        is the primary call-to-action and sits directly under the hero copy.
      */}
      <ToneBand tone="home-hero">
        <section className="pt-8 pb-10 md:pt-12 md:pb-14 lg:pt-14 lg:pb-16">
          <div className="max-w-4xl">
            {/* Plan v19 Block E — bigger, bolder eyebrow. */}
            <div className="text-sm md:text-base font-bold uppercase tracking-[0.12em] text-atlas-700 mb-4 md:mb-5">
              № 1 site for tracking small to medium business benchmarks globally
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-ink-900 leading-[1.08] flex flex-col">
              <span className="block w-full">
                How much does a{" "}
                <span className="text-atlas-600">
                  <RotatingWord
                    words={HERO_BUSINESSES as unknown as string[]}
                    interval={2000}
                  />
                </span>
              </span>
              {/* Plan v19 Block D — question mark anchored to a fixed-width
                  container. City name centers within. Short cities sit
                  centered with whitespace either side; long cities expand
                  but never reach the bookends. The `?` never moves. */}
              <span className="block w-full whitespace-nowrap">
                make in
                <span className="inline-block min-w-[12ch] px-3 md:px-4 text-center text-atlas-600 align-baseline">
                  <RotatingWord
                    words={HERO_CITIES as unknown as string[]}
                    interval={2000}
                    offset={1000}
                  />
                </span>
                <span className="text-ink-900">?</span>
              </span>
            </h1>
            <p className="mt-4 md:mt-5 max-w-2xl text-base md:text-lg text-ink-800 leading-relaxed">
              Revenue, margins, and what they actually mean, for the businesses behind every street.
            </p>
          </div>
        </section>
      </ToneBand>

      {/* Primary navigator — lifted into the hero band per Plan v16 Block B5.
          Required fields are country, category, industry; everything else
          is optional. */}
      <ToneBand tone="home-navigator">
        <section className="pt-2 pb-10 md:pb-14">
          <NavigatorForm />
        </section>
      </ToneBand>

      {/* Plan v21 Block 5 — image-card explore section replaces the
          pair of compact CTAs. Two big symmetric cards, full-bleed
          background image, click the whole card. */}
      <ToneBand tone="home-featured">
        <section className="py-8 md:py-10">
          <ExploreCards />
        </section>
      </ToneBand>

      {/* Plan v16 Block D — top cities band. "Coming soon" chip and
          "coming this summer" copy were removed per founder direction.
          The map visual sits to the right of a commitment statement. */}
      <ToneBand tone="home-cities-placeholder">
        <section className="py-10 md:py-14">
          <div className="rounded-md bg-cream-100 border border-parchment border-l-4 border-l-atlas-600 px-6 py-8 md:px-10 md:py-10">
            <div className="grid md:grid-cols-[1fr_minmax(0,420px)] gap-8 md:gap-10 items-center">
              <div>
                <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-ink-900">
                  Top 100 cities, drilled to the neighborhood
                </h2>
                <p className="mt-3 md:mt-4 max-w-xl text-base md:text-lg text-ink-800 leading-relaxed">
                  Manhattan blocks. Central Tokyo wards. Paris arrondissements. The
                  same benchmarks at neighborhood resolution, rolling out city by city.
                </p>
              </div>
              <CitiesDotsMap />
            </div>
          </div>
        </section>
      </ToneBand>

      {/* Featured benchmarks. Plan v16 Block E: 9 tiles in 3×3 symmetric grid. */}
      <ToneBand tone="home-featured">
        <section className="py-10">
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink-900">
              Start with something familiar
            </h2>
            <a
              href="/browse"
              className="text-sm text-atlas-700 hover:text-atlas-900 font-medium"
            >
              Browse everything →
            </a>
          </div>
          <p className="text-sm text-cocoa-700/80 max-w-2xl mb-6">
            Six benchmarks people recognize on sight. Click any tile for the full
            numbers: where every business lands, time series, comparable industries.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 auto-rows-fr">
            {FEATURED.map((spec) => (
              <FeaturedCellTile key={`${spec.iso2}-${spec.geo}-${spec.industry}`} spec={spec} />
            ))}
          </div>
        </section>
      </ToneBand>

      {/* Plan v19 Block H — Did You Know surprise facts. Two rotating
          curated factoids about unexpected SMB economics. Sits between
          the FEATURED grid and the global coverage strip. */}
      <ToneBand tone="home-blog-rail">
        <DidYouKnow />
      </ToneBand>

      {/* Global coverage strip: Plan v8 Track S.2 */}
      <ToneBand tone="home-global-coverage">
        <GlobalCoverageStrip />
      </ToneBand>

      {/* Sector master menu: Plan v4.0 Step 13 */}
      <ToneBand tone="home-sectors">
        <SectorMasterMenu />
      </ToneBand>

      {/* Cell of the week: Plan v4.0 Step 19 */}
      <ToneBand tone="home-cell-of-the-week">
        <CellOfTheWeek />
      </ToneBand>

      {/* Tax overlay teaser: Plan v8 Track S.6 */}
      <ToneBand tone="home-tax-overlay">
        <TaxOverlayTeaser />
      </ToneBand>

      {/* Ask Atlas widget: Plan v8 Track S.5 (live after key in Vercel) */}
      <ToneBand tone="home-ask">
        <div id="ask-atlas" className="scroll-mt-20">
          <AskWidget />
        </div>
      </ToneBand>

      {/* Pick a city: Plan v27 Lane C.1 — replace flat CityPicker with
          continent-grouped TopCitiesMosaic. CityPicker still imported
          and available at /world for the dense alphabetical list. */}
      <ToneBand tone="home-city-picker">
        <div id="pick-a-city" className="scroll-mt-20">
          <TopCitiesMosaic limit={12} />
        </div>
      </ToneBand>

      {/* Quality legend: Plan v8 Track S.7 */}
      <ToneBand tone="home-quality">
        <QualityLegend />
      </ToneBand>

      {/* Stats strip */}
      <ToneBand tone="home-stats">
        <section className="py-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ["Worldwide", "every country covered"],
            ["Every SMB industry", "from cafés to manufacturing"],
            ["Free", "to browse"],
          ].map(([n, label]) => (
            <div key={label} className="rounded-2xl bg-cream-100 border border-parchment p-5">
              <div className="text-3xl font-semibold text-ink-900 tabular-nums">{n}</div>
              <div className="text-sm text-cocoa-700/80 mt-1">{label}</div>
            </div>
          ))}
        </section>
      </ToneBand>

      {/* Plan v16 Block C — methodology relocated below the fold and
          rewritten in marketing voice. Earlier copy named source agencies
          and gave away too much; this version positions capability
          (machine-learning aggregation, on-the-ground correspondents,
          modern quantitative methodologies) without naming providers. */}
      <ToneBand tone="home-methodology">
        <section className="py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-atlas-700 mb-3">
              How we build numbers you can trust
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-ink-900">
              Built differently than what you&apos;ve seen before
            </h2>
            <div className="mt-5 md:mt-6 space-y-4 text-base md:text-lg text-ink-800 leading-relaxed">
              <p>
                Atlas combines machine-learning aggregation over hundreds of public
                and closely-held data streams with direct access to filings most
                aggregators never see, and on-the-ground correspondents in territories
                that don&apos;t publish to the open web.
              </p>
              <p>
                Every benchmark is cross-validated against the most recent quantitative
                methodologies in applied industry economics. Inflation and purchasing-power
                overlays keep every figure current to today, never years out of date.
              </p>
              <p>
                Each benchmark carries a quality grade A through D telling you exactly
                how directly it was sourced, how thinly the sample was sliced, and how
                much modeling sits between the underlying signal and the figure on the
                page. No black boxes, no surprises.
              </p>
            </div>
            <div className="mt-6 md:mt-7">
              <a
                href="/about-data"
                className="inline-flex items-center gap-1.5 text-atlas-700 hover:text-atlas-900 font-medium text-base border-b border-atlas-200 hover:border-atlas-500 pb-0.5 transition-colors"
              >
                Read the full methodology
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      </ToneBand>

      {/* Plan v15 Block 3 — blog rail. */}
      <ToneBand tone="home-blog-rail">
        <section className="py-12 md:py-16">
          <div className="flex items-baseline justify-between gap-4 flex-wrap mb-6 md:mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900">
              From the Atlas notebook
            </h2>
            <a
              href="/blog"
              className="text-sm text-atlas-700 hover:text-atlas-900 font-medium"
            >
              All posts →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {blogPosts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-md bg-white border border-parchment hover:border-atlas-500 transition-colors p-5 md:p-6 flex flex-col"
              >
                <div className="text-xs text-ink-500 tabular-nums">
                  {formatPostDate(post.date)}
                </div>
                <h3 className="mt-2 font-display text-lg md:text-xl font-medium tracking-tight text-ink-900 group-hover:text-atlas-700 transition-colors leading-snug">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="mt-2 text-sm text-ink-700 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
              </a>
            ))}
          </div>
        </section>
      </ToneBand>

      {/* Newsletter signup */}
      <ToneBand tone="home-newsletter">
        <section id="newsletter" className="py-10 scroll-mt-20">
          <NewsletterSignup />
        </section>
      </ToneBand>
    </div>
  );
}
