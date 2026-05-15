import { NavigatorForm } from "@/components/NavigatorForm";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { SmartImage } from "@/components/SmartImage";
import { FeaturedCellTile, type FeaturedTileSpec } from "@/components/FeaturedCellTile";

export const revalidate = 86400; // 1 day

/**
 * 12 hand-curated stereotypical featured cells (Plan v3.0 §N).
 *
 * City-level URLs degrade gracefully — Italy/Spain/India/Canada/Australia
 * point at country-level pages until sub-national data lands. The titles
 * still say "Milan", "Paris", etc., because that's the recognizable name
 * users come for; URLs auto-upgrade later without breaking anything.
 */
const FEATURED: FeaturedTileSpec[] = [
  { iso2: "IT", geo: "italy",                   industry: "boutique-clothing",       title: "Clothing boutiques",                  region: "Milan, Italy",          glyph: "👗" },
  { iso2: "US", geo: "new-york",                industry: "real-estate-agencies",    title: "Real estate agencies",                 region: "New York, USA",         glyph: "🏘️" },
  { iso2: "FR", geo: "france",                  industry: "cosmetics-shops",         title: "Cosmetics shops",                       region: "Paris, France",         glyph: "💄" },
  { iso2: "US", geo: "california",              industry: "software-development",    title: "Software development",                  region: "California, USA",       glyph: "💻" },
  { iso2: "IN", geo: "india",                   industry: "custom-software-contract", title: "Custom software & IT services",        region: "Bangalore, India",      glyph: "⚙️" },
  { iso2: "CA", geo: "canada",                  industry: "residential-construction", title: "Residential construction",              region: "Toronto, Canada",       glyph: "🏗️" },
  { iso2: "ES", geo: "spain",                   industry: "independent-hotels",      title: "Hotels & inns",                         region: "Barcelona, Spain",      glyph: "🏨" },
  { iso2: "DE", geo: "germany",                 industry: "machinery-manufacturing", title: "Industrial machinery",                  region: "Germany",               glyph: "⚙️" },
  { iso2: "US", geo: "district-of-columbia",    industry: "management-consulting",   title: "Management consulting",                 region: "Washington, D.C.",      glyph: "📋" },
  { iso2: "BR", geo: "brazil",                  industry: "craft-breweries-taprooms", title: "Craft beer & beverages",               region: "Brazil",                glyph: "🍺" },
  { iso2: "AU", geo: "australia",               industry: "cafes-coffee-shops",      title: "Cafés & coffee shops",                  region: "Melbourne, Australia",  glyph: "☕" },
  { iso2: "US", geo: "california",              industry: "restaurants",             title: "Restaurants",                            region: "California, USA",       glyph: "🍽️" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-10 md:py-14 lg:grid lg:grid-cols-[1.4fr_1fr] lg:gap-10 lg:items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-ink-900 max-w-4xl">
            How much does a typical{" "}
            <span className="gradient-name">small business</span> earn?
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ink-800/80 max-w-3xl leading-relaxed">
            Revenue, employment, and wages for small businesses across 219
            countries. Compiled from official business statistics, standardized
            so a bakery in Paris compares directly to a bakery in California.
            Pick what you want to know below.
          </p>

          {/* Navigator — the centerpiece */}
          <div className="mt-10">
            <NavigatorForm />
          </div>
        </div>
        <div className="hidden lg:block">
          {/* Image placeholder HOME-1: stylized world map illustration */}
          <SmartImage
            alt="Stylized world atlas of small-business benchmarks"
            glyph="🗺️"
            caption="Atlas"
            aspectRatio={1.5}
            intent="hero"
            rounded="3xl"
          />
        </div>
      </section>

      {/* Featured cells — above the fold (Plan v3.0 §N) */}
      <section className="py-10">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-ink-900">
              Start with something familiar
            </h2>
            <p className="mt-1 text-sm md:text-base text-ink-700/80 max-w-2xl">
              Twelve cells most people recognize on sight. Click any tile to see the
              full numbers — distribution, spread, time series.
            </p>
          </div>
          <a
            href="/browse"
            className="text-sm text-atlas-700 hover:text-atlas-900 font-medium"
          >
            Browse everything →
          </a>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {FEATURED.map((spec) => (
            <FeaturedCellTile key={`${spec.iso2}-${spec.geo}-${spec.industry}`} spec={spec} />
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          ["219", "countries"],
          ["150+", "industries"],
          ["780k", "data cells"],
          ["Free", "to browse"],
        ].map(([n, label]) => (
          <div key={label} className="card">
            <div className="text-3xl font-semibold text-ink-900">{n}</div>
            <div className="text-sm text-ink-700/70 mt-1">{label}</div>
          </div>
        ))}
      </section>

      {/* What's inside */}
      <section className="py-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-ink-900">
          What you&apos;ll see
        </h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
              The full distribution
            </div>
            <div className="mt-2 font-semibold text-lg text-ink-900">
              Bottom 10% · Typical · Top 10%
            </div>
            <p className="mt-3 text-sm text-ink-700/80">
              Not just an average. Every cell shows the spread — what the
              smallest businesses make, what the typical one does, and what the
              biggest 10% bring in.
            </p>
          </div>
          <div className="card">
            <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
              Side-by-side comparisons
            </div>
            <div className="mt-2 font-semibold text-lg text-ink-900">
              Across countries and industries
            </div>
            <p className="mt-3 text-sm text-ink-700/80">
              Friendly industry names map across every country, so you can
              compare bakeries in Paris to bakeries in California without
              wrestling with classification codes.
            </p>
          </div>
          <div className="card">
            <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
              Quality you can trust
            </div>
            <div className="mt-2 font-semibold text-lg text-ink-900">
              Every cell rated, every number traceable
            </div>
            <p className="mt-3 text-sm text-ink-700/80">
              Each cell carries a 5-star quality rating so you know whether
              you&apos;re looking at a direct measurement, a modeled estimate, or
              something in between. No black boxes.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter signup */}
      <section className="py-12">
        <NewsletterSignup />
      </section>
    </div>
  );
}
