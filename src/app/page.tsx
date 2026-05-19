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
          <div className="w-full max-w-3xl bg-cream-50/85 backdrop-blur-md border border-cream-200/50 rounded-3xl p-6 sm:p-8 md:p-12 shadow-lg">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-ink-900 text-center leading-tight">
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
      <section className="py-8 md:py-12">
        <div className="mt-8 md:mt-10">
          <NavigatorForm />
        </div>

        {/* First-frame data preview: Plan v4.0 Step 15 */}
        <FirstFrameStrip />
      </section>

      {/* Global coverage strip: Plan v8 Track S.2 */}
      <GlobalCoverageStrip />

      {/* Recently-added countries strip: Plan v9 Track BB.2 */}
      <RecentlyAddedStrip />

      {/* Featured cells: above the fold (Plan v4.0 Step 15 + Step 16 + Step 19) */}
      <section className="py-6">
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

      {/* Spotlight country of the day: Plan v9 Track BB.4 */}
      <SpotlightCountry />

      {/* Sector master menu: Plan v4.0 Step 13 */}
      <SectorMasterMenu />

      {/* Cell of the week: Plan v4.0 Step 19 */}
      <CellOfTheWeek />

      {/* Tax overlay teaser: Plan v8 Track S.6 */}
      <TaxOverlayTeaser />

      {/* Ask Atlas widget: Plan v8 Track S.5 (live after key in Vercel) */}
      <div id="ask-atlas" className="scroll-mt-20">
        <AskWidget />
      </div>

      {/* Pick a city: Plan v8 Track S.4 */}
      <div id="pick-a-city" className="scroll-mt-20">
        <CityPicker />
      </div>

      {/* Quality legend: Plan v8 Track S.7 */}
      <QualityLegend />

      {/* Stats strip */}
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

      {/* What's inside */}
      <section className="py-10">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink-900">
          What you&apos;ll see on every cell
        </h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="card">
            <div className="text-xs uppercase tracking-wider text-atlas-700 font-semibold">
              The full distribution
            </div>
            <div className="mt-2 font-semibold text-lg text-ink-900">
              Bottom 10% · Typical · Top 10%
            </div>
            <p className="mt-3 text-sm text-cocoa-900/80">
              Not just an average. Every cell shows the spread: what the smallest
              businesses make, what the typical one does, and what the biggest 10%
              bring in.
            </p>
          </div>
          <div className="card">
            <div className="text-xs uppercase tracking-wider text-atlas-700 font-semibold">
              Side-by-side comparisons
            </div>
            <div className="mt-2 font-semibold text-lg text-ink-900">
              Across countries and industries
            </div>
            <p className="mt-3 text-sm text-cocoa-900/80">
              Friendly industry names map across every country, so you can compare
              bakeries in Paris to bakeries in California without wrestling with
              classification codes.
            </p>
          </div>
          <div className="card">
            <div className="text-xs uppercase tracking-wider text-atlas-700 font-semibold">
              Quality you can trust
            </div>
            <div className="mt-2 font-semibold text-lg text-ink-900">
              Every cell rated, every number traceable
            </div>
            <p className="mt-3 text-sm text-cocoa-900/80">
              Each cell carries a 5-star quality rating so you know whether
              you&apos;re looking at a direct measurement, a modeled estimate, or
              something in between. No black boxes.
            </p>
          </div>
        </div>
      </section>

      {/* What's hot: Plan v9 Track BB.10 */}
      <WhatsHotStrip />

      {/* Newsletter signup */}
      <section className="py-10">
        <NewsletterSignup />
      </section>
    </div>
  );
}
