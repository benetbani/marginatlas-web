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
import { SpotlightCountry } from "@/components/SpotlightCountry";
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
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-ink-900 leading-[1.08]">
              <span className="block">
                How much does a{" "}
                <span className="text-atlas-600">
                  <RotatingWord
                    words={HERO_BUSINESSES as unknown as string[]}
                    interval={2000}
                  />
                </span>
              </span>
              <span className="block">
                make in{" "}
                <span className="inline-flex justify-start text-atlas-600 min-w-[9ch]">
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
            Twelve benchmarks most people recognize on sight. Click any tile for the full
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

      {/* Newsletter signup */}
      <ToneBand tone="home-newsletter">
        <section className="py-10">
          <NewsletterSignup />
        </section>
      </ToneBand>
    </div>
  );
}
