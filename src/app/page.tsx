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
      {/* Hero — image OFF the right (Plan v4.0 Step 11). Navigator dominates full width (Step 12). */}
      <section className="py-8 md:py-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-ink-900 leading-[1.05]">
            Small-business benchmarks across{" "}
            <span className="gradient-name">191 countries</span>.
          </h1>
          <p className="mt-5 text-lg md:text-xl text-cocoa-900/80 max-w-3xl leading-relaxed">
            Revenue, payroll, and after-tax owner take-home for every covered
            country × industry × city × size combination — all from one query.
            Compiled from official statistics and standardized so a bakery in
            Paris compares directly to a bakery in California.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/browse"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-ink-900 text-cream-50 text-sm font-medium hover:bg-ink-800 transition"
            >
              Browse 191 countries →
            </a>
            <a
              href="#ask-atlas"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-cream-100 border border-parchment text-ink-900 text-sm font-medium hover:bg-parchment-100 transition"
            >
              Try Ask Atlas →
            </a>
            <a
              href="#pick-a-city"
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-cream-100 border border-parchment text-ink-900 text-sm font-medium hover:bg-parchment-100 transition"
            >
              Pick a city →
            </a>
          </div>
        </div>

        {/* Navigator — full width, dominant */}
        <div className="mt-8 md:mt-10">
          <NavigatorForm />
        </div>

        {/* First-frame data preview — Plan v4.0 Step 15 */}
        <FirstFrameStrip />
      </section>

      {/* Global coverage strip — Plan v8 Track S.2 */}
      <GlobalCoverageStrip />

      {/* Recently-added countries strip — Plan v9 Track BB.2 */}
      <RecentlyAddedStrip />

      {/* Featured cells — above the fold (Plan v4.0 Step 15 + Step 16 + Step 19) */}
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

      {/* Sector master menu — Plan v4.0 Step 13 */}
      <SectorMasterMenu />

      {/* Cell of the week — Plan v4.0 Step 19 */}
      <CellOfTheWeek />

      {/* Tax overlay teaser — Plan v8 Track S.6 */}
      <TaxOverlayTeaser />

      {/* Ask Atlas widget — Plan v8 Track S.5 (live after key in Vercel) */}
      <div id="ask-atlas" className="scroll-mt-20">
        <AskWidget />
      </div>

      {/* Pick a city — Plan v8 Track S.4 */}
      <div id="pick-a-city" className="scroll-mt-20">
        <CityPicker />
      </div>

      {/* Quality legend — Plan v8 Track S.7 */}
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
              Not just an average. Every cell shows the spread — what the smallest
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

      {/* What's hot — Plan v9 Track BB.10 */}
      <WhatsHotStrip />

      {/* Newsletter signup */}
      <section className="py-10">
        <NewsletterSignup />
      </section>
    </div>
  );
}
