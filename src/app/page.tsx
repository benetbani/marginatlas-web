export const revalidate = 86400; // 1 day

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-ink-900 max-w-4xl">
          The unified database of <span className="gradient-name">SMB margins</span> across 40+ countries.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-ink-800/80 max-w-3xl leading-relaxed">
          Revenue, employment, and payroll distributions from US Census, Eurostat, OECD,
          and 6 national statistical offices — standardized into one queryable cells_master.
          400,000+ Tier-S cells covering every NACE section and every US state.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 items-center">
          <a
            href="/us/california/restaurants"
            className="px-6 py-3 rounded-xl bg-atlas-500 hover:bg-atlas-600 text-white font-medium transition"
          >
            See an example cell →
          </a>
          <a
            href="/pricing"
            className="px-6 py-3 rounded-xl border border-ink-700/20 hover:border-atlas-500 text-ink-900 font-medium transition"
          >
            Pricing
          </a>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          ["40+", "countries"],
          ["419,895", "Tier-S cells"],
          ["81 M", "raw rows"],
          ["18,132", "percentile groups"],
        ].map(([n, label]) => (
          <div key={label} className="card">
            <div className="text-3xl font-semibold text-ink-900">{n}</div>
            <div className="text-sm text-ink-700/70 mt-1">{label}</div>
          </div>
        ))}
      </section>

      {/* What's inside */}
      <section className="py-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-ink-900">What's inside</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
              Per-firm distribution
            </div>
            <div className="mt-2 font-semibold text-lg text-ink-900">
              p10 → p25 → p50 → p75 → p90
            </div>
            <p className="mt-3 text-sm text-ink-700/80">
              Not just averages. Every cell ships the full revenue, employment, and
              payroll distribution from statistical-agency size brackets.
            </p>
          </div>
          <div className="card">
            <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
              Cross-country joinable
            </div>
            <div className="mt-2 font-semibold text-lg text-ink-900">
              NAICS ↔ NACE ↔ ISIC
            </div>
            <p className="mt-3 text-sm text-ink-700/80">
              Industry crosswalks built-in. Compare US restaurants to French
              "restauration" or Polish "gastronomia" with a single query.
            </p>
          </div>
          <div className="card">
            <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
              USD-normalized
            </div>
            <div className="mt-2 font-semibold text-lg text-ink-900">
              Currency-neutral comparison
            </div>
            <p className="mt-3 text-sm text-ink-700/80">
              Native-currency totals plus USD-converted figures using World Bank
              annual FX rates. 310,520 cells have USD revenue.
            </p>
          </div>
        </div>
      </section>

      {/* Sample */}
      <section className="py-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-ink-900">Try a cell page</h2>
        <p className="mt-2 text-ink-700/80">
          Each (country × geography × industry) lives at its own URL. Bookmark, share, cite.
        </p>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            ["/us/california/restaurants", "US — California — Restaurants"],
            ["/us/texas/oil-and-gas-extraction", "US — Texas — Oil & Gas"],
            ["/us/new-york/securities", "US — New York — Securities"],
            ["/us/florida/real-estate", "US — Florida — Real Estate"],
            ["/us/massachusetts/pharmaceutical", "US — Massachusetts — Pharma"],
            ["/us/illinois/manufacturing", "US — Illinois — Manufacturing"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="block px-4 py-3 rounded-xl border border-slate-200/60 bg-white hover:border-atlas-500 transition text-sm text-ink-900"
            >
              {label} →
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
