import { SmartImage } from "@/components/SmartImage";

export const revalidate = 86400;

export const metadata = {
  title: "About the data | Margin Atlas",
  description: "What Margin Atlas covers and how to read it.",
};

export default function AboutDataPage() {
  return (
    <article className="max-w-2xl">
      <div className="mb-8 hidden md:block">
        {/* Image placeholder ABOUT-1: distribution shapes infographic */}
        <SmartImage
          alt="Distribution shapes illustration"
          glyph="📈"
          caption="The spread"
          aspectRatio={3}
          rounded="xl"
        />
      </div>
      <h1 className="text-4xl font-semibold tracking-tight text-ink-900">
        About the data
      </h1>
      <p className="mt-4 text-lg text-ink-800 leading-relaxed">
        Margin Atlas brings together small-business benchmarks across 40+
        countries: revenue, employment, wages, and the spread between the
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
          Benchmarks with weaker ratings carry a clear "Estimated" label so you know what you're looking at.
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
