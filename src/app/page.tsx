import { NavigatorForm } from "@/components/NavigatorForm";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { FeaturedCellTile, type FeaturedTileSpec } from "@/components/FeaturedCellTile";
import { SectorMasterMenu } from "@/components/SectorMasterMenu";
import { FirstFrameStrip } from "@/components/FirstFrameStrip";
import { CellOfTheWeek } from "@/components/CellOfTheWeek";
import { GlobalCoverageStrip } from "@/components/GlobalCoverageStrip";
import { TaxOverlayTeaser } from "@/components/TaxOverlayTeaser";
import { AskWidget } from "@/components/AskWidget";
import { CityPicker } from "@/components/CityPicker";
import { QualityLegend } from "@/components/QualityLegend";
import { RecentlyAddedStrip } from "@/components/RecentlyAddedStrip";
import { WhatsHotStrip } from "@/components/WhatsHotStrip";
import { SpotlightCountry } from "@/components/SpotlightCountry";
import { GlobalSearch } from "@/components/GlobalSearch";
import { RotatingWord } from "@/components/RotatingWord";
import { HERO_CITIES, HERO_BUSINESSES } from "@/lib/hero-words";
import { getToneClass } from "@/lib/page-layout/section-order";

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
 */
const FEATURED: FeaturedTileSpec[] = [
  { iso2: "US", geo: "new-york",          industry: "restaurants",                title: "Restaurants",              region: "New York",         glyph: "🍽️" },
  { iso2: "GB", geo: "gb",                industry: "legal-services",             title: "Legal services",           region: "United Kingdom",   glyph: "⚖️" },
  { iso2: "DE", geo: "germany",           industry: "software-development",       title: "Software development",     region: "Germany",          glyph: "💻" },
  { iso2: "ES", geo: "madrid",            industry: "cafes-coffee-shops",         title: "Cafés & coffee shops",     region: "Madrid",           glyph: "☕" },
  { iso2: "JP", geo: "japan",             industry: "restaurants",                title: "Restaurants",              region: "Japan",            glyph: "🍱" },
  { iso2: "BR", geo: "br-sp",             industry: "grocery-stores",             title: "Grocery & retail",         region: "São Paulo",        glyph: "🛒" },
  { iso2: "MX", geo: "mx-cmx",            industry: "restaurants",                title: "Restaurants",              region: "Mexico City",      glyph: "🌮" },
  { iso2: "AU", geo: "australia",         industry: "cafes-coffee-shops",         title: "Cafés & coffee shops",     region: "Australia",        glyph: "🥐" },
  { iso2: "AL", geo: "al",                industry: "cafes-coffee-shops",         title: "Cafés & coffee shops",     region: "Albania",          glyph: "☕" },
  { iso2: "CH", geo: "ch",                industry: "legal-services",             title: "Professional services",    region: "Switzerland",      glyph: "🏛️" },
  { iso2: "AE", geo: "ae",                industry: "grocery-stores",             title: "Retail",                   region: "United Arab Emirates", glyph: "🛍️" },
  { iso2: "IN", geo: "india",             industry: "software-development",       title: "Software development",     region: "India",            glyph: "💻" },
];

export default function HomePage() {
  return (
    <div>
      {/*
        Hero: Plan v13 Wave 4e.
        Rotating headline ("How much does a [BUSINESS] make in [CITY]?") over a
        full-width background video. Card sits above the video with high opacity
        so the video only bleeds at the section edges.

        Founder to drop a 60-90s loop file at public/videos/hero-cities-loop.mp4
       : until then, the poster image displays as a static fallback.
      */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-ink-900 left-1/2 right-1/2 -mx-[50vw] w-screen -mt-10">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          poster="/images/hero-poster.svg"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/hero-cities-loop.mp4" type="video/mp4" />
        </video>

        {/* Subtle dark gradient overlay for legibility at top and bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/30 via-transparent to-ink-900/40 pointer-events-none" />

        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="w-full max-w-3xl bg-cream-50 border border-parchment rounded-3xl p-6 sm:p-8 md:p-12 shadow-sm">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-ink-900 text-center leading-tight">
              How much does a{" "}
              <span className="inline-block min-w-[5ch] text-atlas-600">
                <RotatingWord
                  words={HERO_BUSINESSES as unknown as string[]}
                  interval={2000}
                />
              </span>{" "}
              make in{" "}
              <span className="inline-block min-w-[7ch] text-atlas-600">
                <RotatingWord
                  words={HERO_CITIES as unknown as string[]}
                  interval={2000}
                  offset={1000}
                />
              </span>
              ?
            </h1>
            <div className="mt-6 md:mt-8">
              <GlobalSearch />
            </div>
          </div>
        </div>
      </section>

      {/* Navigator: full width, dominant */}
      <ToneBand tone="home-navigator">
        <section className="py-8 md:py-12">
          <div className="mt-8 md:mt-10">
            <NavigatorForm />
          </div>

          {/* First-frame data preview: Plan v4.0 Step 15 */}
          <FirstFrameStrip />
        </section>
      </ToneBand>

      {/* Featured cells: above the fold (Plan v4.0 Step 15 + Step 16 + Step 19) */}
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
            Twelve cells most people recognize on sight. Click any tile for the full
            numbers: distribution, spread, time series, comparable industries.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-fr">
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

      {/* Recently-added countries strip: Plan v9 Track BB.2 */}
      <ToneBand tone="home-recently-added">
        <RecentlyAddedStrip />
      </ToneBand>

      {/* Spotlight country of the day: Plan v9 Track BB.4 */}
      <ToneBand tone="home-spotlight">
        <SpotlightCountry />
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
        <section className="py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["191", "countries covered"],
            ["180+", "SMB industries"],
            ["357k+", "data cells"],
            ["Free", "to browse"],
          ].map(([n, label]) => (
            <div key={label} className="rounded-2xl bg-cream-100 border border-parchment p-5">
              <div className="text-3xl font-semibold text-ink-900 tabular-nums">{n}</div>
              <div className="text-sm text-cocoa-700/80 mt-1">{label}</div>
            </div>
          ))}
        </section>
      </ToneBand>

      {/* What's inside — numbered list, no card grid */}
      <ToneBand tone="home-what-youll-see">
        <section className="py-10">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink-900">
            What you&apos;ll see on every cell
          </h2>
          <ol className="mt-6 max-w-3xl divide-y divide-parchment border-t border-b border-parchment">
            <li className="grid grid-cols-[2.5rem_1fr] gap-4 py-5">
              <span className="text-xs uppercase tracking-wider text-atlas-700 font-semibold tabular-nums pt-1">
                01
              </span>
              <div>
                <div className="font-semibold text-lg text-ink-900">
                  The full distribution. Bottom 10%, Typical, Top 10%.
                </div>
                <p className="mt-1.5 text-sm text-cocoa-900/80 leading-relaxed">
                  Not just an average. Every cell shows the spread: what the smallest
                  businesses make, what the typical one does, and what the biggest 10%
                  bring in.
                </p>
              </div>
            </li>
            <li className="grid grid-cols-[2.5rem_1fr] gap-4 py-5">
              <span className="text-xs uppercase tracking-wider text-atlas-700 font-semibold tabular-nums pt-1">
                02
              </span>
              <div>
                <div className="font-semibold text-lg text-ink-900">
                  Side-by-side comparisons across countries and industries.
                </div>
                <p className="mt-1.5 text-sm text-cocoa-900/80 leading-relaxed">
                  Friendly industry names map across every country, so you can compare
                  bakeries in Paris to bakeries in California without wrestling with
                  classification codes.
                </p>
              </div>
            </li>
            <li className="grid grid-cols-[2.5rem_1fr] gap-4 py-5">
              <span className="text-xs uppercase tracking-wider text-atlas-700 font-semibold tabular-nums pt-1">
                03
              </span>
              <div>
                <div className="font-semibold text-lg text-ink-900">
                  Quality you can trust. Every cell rated, every number traceable.
                </div>
                <p className="mt-1.5 text-sm text-cocoa-900/80 leading-relaxed">
                  Each cell carries a 5-star quality rating so you know whether
                  you&apos;re looking at a direct measurement, a modeled estimate, or
                  something in between. No black boxes.
                </p>
              </div>
            </li>
          </ol>
        </section>
      </ToneBand>

      {/* What's hot: Plan v9 Track BB.10 */}
      <ToneBand tone="home-whats-hot">
        <WhatsHotStrip />
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
