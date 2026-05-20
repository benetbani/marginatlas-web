import { NavigatorForm } from "@/components/NavigatorForm";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { FeaturedCellTile, type FeaturedTileSpec } from "@/components/FeaturedCellTile";
import { SectorMasterMenu } from "@/components/SectorMasterMenu";
import { CellOfTheWeek } from "@/components/CellOfTheWeek";
import { GlobalCoverageStrip } from "@/components/GlobalCoverageStrip";
import { TaxOverlayTeaser } from "@/components/TaxOverlayTeaser";
import { AskWidget } from "@/components/AskWidget";
import { CityPicker } from "@/components/CityPicker";
import { QualityLegend } from "@/components/QualityLegend";
import { RotatingWord } from "@/components/RotatingWord";
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
 * Plan v4.0 Step 16: featured tiles use only measured parent industries
 * (no sub-niches) so every tile resolves to live data. Tiles that don't
 * resolve are filtered out at render time — no "Coming soon" ever ships.
 *
 * Plan v15 Block 3: Albania removed; trimmed from 12 to 8 to keep the
 * grid symmetric on the 4-col layout after Albania's removal (8 = 2×4).
 */
const FEATURED: FeaturedTileSpec[] = [
  { iso2: "US", geo: "new-york",          industry: "restaurants",                title: "Restaurants",              region: "New York",         glyph: "🍽️" },
  { iso2: "GB", geo: "gb",                industry: "legal-services",             title: "Legal services",           region: "United Kingdom",   glyph: "⚖️" },
  { iso2: "DE", geo: "germany",           industry: "software-development",       title: "Software development",     region: "Germany",          glyph: "💻" },
  { iso2: "ES", geo: "madrid",            industry: "cafes-coffee-shops",         title: "Cafés & coffee shops",     region: "Madrid",           glyph: "☕" },
  { iso2: "JP", geo: "japan",             industry: "restaurants",                title: "Restaurants",              region: "Japan",            glyph: "🍱" },
  { iso2: "BR", geo: "br-sp",             industry: "grocery-stores",             title: "Grocery & retail",         region: "São Paulo",        glyph: "🛒" },
  { iso2: "MX", geo: "mx-cmx",            industry: "restaurants",                title: "Restaurants",              region: "Mexico City",      glyph: "🌮" },
  { iso2: "IN", geo: "india",             industry: "software-development",       title: "Software development",     region: "India",            glyph: "💻" },
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
    title: "How to read a Eurostat SBS release without getting lost",
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
        Hero: Plan v14 6d — quiet editorial masthead.
        Per impeccable shape doc 2026-05-20: dark cinematic frame removed;
        the hero is a typographic broadsheet masthead sitting directly on
        cream-100 paper. Rotating headline preserved; in-hero search
        removed (HeaderSearch in layout.tsx covers it globally).
      */}
      <ToneBand tone="home-hero">
        <section className="pt-8 pb-10 md:pt-12 md:pb-14 lg:pt-14 lg:pb-16">
          <div className="max-w-4xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-atlas-700 mb-4 md:mb-5">
              Small-business benchmarks · worldwide
            </div>
            {/* Two-line layout so the question mark stays anchored to the city.
               Each rotating word sits at the END of its line, so length changes
               only affect the right edge of one line, never the rest of the
               headline. */}
            {/* Plan v15 Block 5: each line is its own true block element so
               business word + "make" can never visually concatenate. flex
               flex-col on the h1 forces vertical stacking regardless of
               child display rules. min-w-[8ch] reserves just enough room
               for "New York" — Barcelona/Sao Paulo expand the span, which
               is acceptable per founder. */}
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
              <span className="block w-full">
                make in{" "}
                <span className="inline-flex justify-start text-atlas-600 min-w-[8ch]">
                  <RotatingWord
                    words={HERO_CITIES as unknown as string[]}
                    interval={2000}
                    offset={1000}
                  />
                </span>
                <span className="text-ink-900">?</span>
              </span>
            </h1>
            <p className="mt-4 md:mt-5 max-w-2xl text-base md:text-lg text-ink-700/90 leading-relaxed">
              Revenue, margins, and what they actually mean, for the businesses behind every street.
            </p>
            <div className="mt-5 md:mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm md:text-base">
              <a
                href="/browse"
                className="inline-flex items-center gap-1.5 font-medium text-ink-800 hover:text-atlas-600 transition-colors border-b border-parchment hover:border-atlas-500 pb-0.5"
              >
                Browse the whole world
                <span aria-hidden="true">→</span>
              </a>
              <a
                href="/about-data"
                className="inline-flex items-center gap-1.5 font-medium text-ink-800 hover:text-atlas-600 transition-colors border-b border-parchment hover:border-atlas-500 pb-0.5"
              >
                See the methodology
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      </ToneBand>

      {/* Plan v15 Block 3 — primary CTAs sit directly under the hero. */}
      <ToneBand tone="home-primary-ctas">
        <section className="py-10 md:py-14">
          <div className="flex flex-col md:flex-row gap-4 md:gap-5">
            <a
              href="/browse"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-atlas-600 hover:bg-atlas-700 text-white font-medium text-base md:text-lg px-6 py-4 md:py-5 transition-colors shadow-sm"
            >
              Browse by country
              <span aria-hidden="true">→</span>
            </a>
            <a
              href="/industries"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-cream-100 hover:bg-cream-50 text-ink-900 font-medium text-base md:text-lg px-6 py-4 md:py-5 border border-ink-200 hover:border-atlas-500 transition-colors"
            >
              Browse by industry
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </ToneBand>

      {/* Plan v15 Block 3 — inline methodology read. */}
      <ToneBand tone="home-methodology">
        <section className="py-12 md:py-16">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-ink-900">
              How the numbers get built
            </h2>
            <div className="mt-5 md:mt-6 space-y-4 text-base md:text-lg text-ink-800 leading-relaxed">
              <p>
                Atlas starts with official business statistics — national statistical offices,
                tax authorities, and central banks — and standardizes them onto a single
                taxonomy so a restaurant in Lisbon can be compared with one in Osaka.
              </p>
              <p>
                Where source releases lag, figures are rolled forward with inflation and
                PPP overlays so the snapshot you read is current rather than three years
                stale. The underlying source year is always visible on the benchmark page.
              </p>
              <p>
                Every number carries a quality grade — A through D — that tells you how
                directly it came from the source, how thinly the sample was sliced, and
                how much modeling sits between the raw filing and the figure on the page.
              </p>
            </div>
            <div className="mt-6 md:mt-7">
              <a
                href="/about-data"
                className="inline-flex items-center gap-1.5 text-atlas-600 hover:text-atlas-700 font-medium text-base border-b border-atlas-200 hover:border-atlas-500 pb-0.5 transition-colors"
              >
                Read the full methodology
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      </ToneBand>

      {/* Plan v15 Block 3 — top cities placeholder (coming soon). */}
      <ToneBand tone="home-cities-placeholder">
        <section className="py-10 md:py-14">
          <div className="rounded-md bg-cream-100 border border-parchment border-l-4 border-l-atlas-600 px-6 py-8 md:px-10 md:py-10">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.14em] text-atlas-700 bg-white border border-atlas-200 rounded-full px-2.5 py-0.5">
                Coming soon
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-ink-900">
              Top 100 cities, drilled to the neighborhood
            </h2>
            <p className="mt-3 md:mt-4 max-w-2xl text-base md:text-lg text-ink-800 leading-relaxed">
              Coming this summer — Manhattan blocks, central Tokyo wards, Paris arrondissements.
              Same benchmarks, finer geography.
            </p>
          </div>
        </section>
      </ToneBand>

      {/* Navigator: full width, dominant */}
      <ToneBand tone="home-navigator">
        <section className="py-8 md:py-12">
          <div className="mt-8 md:mt-10">
            <NavigatorForm />
          </div>
        </section>
      </ToneBand>

      {/* Featured benchmarks (Plan v4.0 Step 15 + Step 16 + Step 19).
          Plan v15 Block 3: 8 tiles, lg:grid-cols-4 only, keeps 2×4 symmetry. */}
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
            Eight benchmarks most people recognize on sight. Click any tile for the full
            numbers: distribution, spread, time series, comparable industries.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-fr">
            {FEATURED.map((spec) => (
              <FeaturedCellTile key={`${spec.iso2}-${spec.geo}-${spec.industry}`} spec={spec} />
            ))}
          </div>
        </section>
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

      {/* Pick a city: Plan v8 Track S.4 */}
      <ToneBand tone="home-city-picker">
        <div id="pick-a-city" className="scroll-mt-20">
          <CityPicker />
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
        <section className="py-10">
          <NewsletterSignup />
        </section>
      </ToneBand>
    </div>
  );
}
