import { NavigatorForm } from "@/components/NavigatorForm";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export const revalidate = 86400; // 1 day

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-10 md:py-14">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-ink-900 max-w-4xl">
          How much does a typical{" "}
          <span className="gradient-name">small business</span> earn?
        </h1>
        <p className="mt-6 text-lg md:text-xl text-ink-800/80 max-w-3xl leading-relaxed">
          Revenue, employment, and wages for 80 industries across 40+ countries,
          drawn from US Census, Eurostat, OECD, and national statistical
          agencies. Pick what you want to know below.
        </p>

        {/* Navigator — the centerpiece */}
        <div className="mt-10">
          <NavigatorForm />
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          ["40+", "countries"],
          ["80", "industries"],
          ["~420k", "data cells"],
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
          What you'll see
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
              Sources you can trust
            </div>
            <div className="mt-2 font-semibold text-lg text-ink-900">
              Government statistics, standardized
            </div>
            <p className="mt-3 text-sm text-ink-700/80">
              Every number traces back to a primary statistical agency — US
              Census, Eurostat, Destatis, INSEE, e-Stat — with quality rating
              shown on every cell.
            </p>
          </div>
        </div>
      </section>

      {/* Featured cells */}
      <section className="py-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-ink-900">
          Popular pages
        </h2>
        <p className="mt-2 text-ink-700/80">
          A few of the most-viewed industry × location combinations.
        </p>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            ["/us/california/restaurants", "Restaurants — California"],
            ["/us/new-york/legal-services", "Legal services — New York"],
            ["/us/texas/construction", "Construction — Texas"],
            ["/us/florida/hairdressers-beauty", "Hairdressers & beauty — Florida"],
            ["/us/massachusetts/software-development", "Software development — Massachusetts"],
            ["/us/illinois/manufacturing", "Manufacturing — Illinois"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="block px-4 py-3 rounded-xl border border-ink-200 bg-white hover:border-atlas-500 transition text-sm text-ink-900"
            >
              {label} →
            </a>
          ))}
        </div>
      </section>

      {/* Newsletter signup */}
      <section className="py-12">
        <NewsletterSignup />
      </section>
    </div>
  );
}
