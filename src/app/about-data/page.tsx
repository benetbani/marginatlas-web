export const revalidate = 86400;

export const metadata = {
  title: "About the data | Margin Atlas",
  description: "What Margin Atlas covers and how to read it.",
};

export default function AboutDataPage() {
  return (
    <article className="max-w-2xl">
      {/* Plan v32 (audit Sprint A5) — decorative placeholder image at the
         top removed (founder rule: no decorative images on overview
         pages). Stale "40+ countries" copy updated to reflect the real
         coverage. */}
      <h1 className="text-4xl font-semibold tracking-tight text-ink-900">
        About the data
      </h1>
      <p className="mt-4 text-lg text-ink-800 leading-relaxed">
        Margin Atlas brings together small-business benchmarks across every
        country: revenue, employment, wages, and the spread between the
        smallest and largest firms in every industry.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink-900">What you'll find</h2>
        <ul className="mt-4 space-y-3 text-ink-800">
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>Typical numbers.</strong> What the middle firm in an industry actually earns, employs, and pays.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>The spread.</strong> What the smallest 10% and biggest 10% look like, so you understand the full range.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>Cross-country comparison.</strong> Friendly industry names that match across borders, so a "Restaurant" in California compares directly to a "Restaurant" in Paris.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-atlas-500 shrink-0">·</span>
            <span><strong>Sub-national depth.</strong> State-level, regional, and county-level data where available.</span>
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink-900">Quality ratings</h2>
        <p className="mt-3 text-ink-800">
          Every benchmark shows a 5-star quality rating:
        </p>
        <ul className="mt-3 space-y-2 text-sm text-ink-800">
          <li><span className="text-atlas-500">★★★★★</span>. Direct primary measurement, highest confidence.</li>
          <li><span className="text-atlas-500">★★★★</span><span className="text-ink-300">☆</span>. Modeled from primary sources, high confidence.</li>
          <li><span className="text-atlas-500">★★★</span><span className="text-ink-300">☆☆</span>. Derived or estimated, moderate confidence.</li>
          <li><span className="text-atlas-500">★★</span><span className="text-ink-300">☆☆☆</span>. Extrapolated from regional patterns.</li>
        </ul>
        <p className="mt-3 text-sm text-ink-700">
          Every benchmark page carries a "How we know this" link beside the headline number so the source and method are one click away.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink-900">Coverage tiers</h2>
        <p className="mt-3 text-ink-800">
          Every page in Atlas shows a coverage chip next to the headline number.
          Four tiers, one vocabulary:
        </p>

        <div id="measured" className="mt-6 border-l-4 border-l-emerald-500 bg-emerald-50 px-5 py-4 rounded-r-lg scroll-mt-24">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-900 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Measured
          </div>
          <p className="text-ink-800 text-sm leading-relaxed">
            Direct measurement of the firms in this geography and industry.
            Highest confidence; the number is what the average firm actually earns.
          </p>
        </div>

        <div id="regional" className="mt-3 border-l-4 border-l-sky-500 bg-sky-50 px-5 py-4 rounded-r-lg scroll-mt-24">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-sky-900 mb-1">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            Regional
          </div>
          <p className="text-ink-800 text-sm leading-relaxed">
            A broader regional or national benchmark applied to this geography.
            Strong directional signal; precision drops the smaller the cell.
          </p>
        </div>

        <div id="estimated" className="mt-3 border-l-4 border-l-amber-500 bg-amber-50 px-5 py-4 rounded-r-lg scroll-mt-24">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-amber-900 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Estimated
          </div>
          <p className="text-ink-800 text-sm leading-relaxed">
            Estimated from country-level economic indicators (GDP per capita,
            governance index, urbanization) combined with global industry
            averages. Useful as orientation; not a precise reading.
          </p>
        </div>

        <div id="modeled" className="mt-3 border-l-4 border-l-stone-500 bg-stone-50 px-5 py-4 rounded-r-lg scroll-mt-24">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-stone-900 mb-1">
            <span className="w-2 h-2 rounded-full bg-stone-500" />
            Modeled
          </div>
          <p className="text-ink-800 text-sm leading-relaxed">
            A transparent model output combining global industry averages
            with country-level scaling factors. No underlying observation
            for this cell; the number is what we'd expect on average.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink-900">Business formation data</h2>
        <p className="mt-3 text-ink-800">
          Setup cost and days-to-start figures cover 152 countries. Numbers
          combine commercial registry filings, national investment promotion
          agency guides, and international benchmarking archives. Formation
          regimes change slowly: most countries' setup days have moved by
          less than a week in the last decade.
        </p>
        <p className="mt-3 text-ink-800">
          Costs are the mandatory government and notary fees in USD-equivalent.
          Professional service fees (lawyers, accountants, registered office
          rental) are not included.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink-900">Updates</h2>
        <p className="mt-3 text-ink-800">
          The dataset is refreshed regularly. Each benchmark page indicates the recency of the underlying observation.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink-900">Citing Atlas</h2>
        <p className="mt-3 text-ink-800">
          You're welcome to cite Atlas in articles, reports, or presentations. We ask only that you link back to the benchmark page you're citing.
        </p>
      </section>
    </article>
  );
}
