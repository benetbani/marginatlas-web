/**
 * /methodology/key-benchmarks — ATO Phase 8.
 *
 * Public-facing explainer of the key-benchmark framework adopted from
 * the ATO Small Business Benchmarks model. Plain language, operator
 * audience, no source-agency names (R-002).
 */

export const revalidate = 86400;

export const metadata = {
  title: "The one ratio to watch | Margin Atlas methodology",
  description:
    "How Margin Atlas picks the single most-predictive ratio per industry, the cost stack we render against revenue, and how revenue bands segment operator comparisons.",
  alternates: { canonical: "/methodology/key-benchmarks" },
};

export default function KeyBenchmarksMethodologyPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-10 md:py-14 prose prose-ink">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-atlas-700 mb-3">
        Methodology
      </div>
      <h1 className="font-display text-3xl md:text-5xl tracking-tight text-ink-900 leading-[1.1] mb-4">
        The one ratio to watch
      </h1>
      <p className="text-base md:text-lg text-cocoa-700 leading-relaxed">
        Every industry has many cost ratios. Most have one that matters
        more than the others. Margin Atlas designates that ratio
        explicitly on every cell page, so operators do not have to
        guess which number to chase.
      </p>

      <h2 className="font-display text-2xl mt-10 mb-3 text-ink-900">Why a single ratio</h2>
      <p className="text-base text-cocoa-700 leading-relaxed">
        Five ratios at equal weight produce paralysis. One designated
        headline ratio gives the operator a single answer to a single
        question: am I roughly normal? The other ratios remain visible
        as supporting evidence when they cluster around the right
        neighbourhood.
      </p>

      <h2 className="font-display text-2xl mt-10 mb-3 text-ink-900">How the headline is chosen</h2>
      <ul className="text-base text-cocoa-700 leading-relaxed space-y-2">
        <li>
          <strong>Cost of sales</strong> for businesses where variable
          input cost moves with revenue: restaurants, cafes,
          retailers, bakeries, manufacturing.
        </li>
        <li>
          <strong>Labour</strong> for businesses where people are the
          product: lawyers, accountants, designers, software firms,
          clinics, pet services.
        </li>
        <li>
          <strong>Motor vehicle</strong> for transport businesses where
          the vehicle is the operational unit.
        </li>
        <li>
          <strong>Total expenses</strong> when no single line dominates:
          hotels, trades with mixed materials and labour, repair shops,
          galleries, agencies in commission economies.
        </li>
      </ul>

      <h2 className="font-display text-2xl mt-10 mb-3 text-ink-900">Revenue bands</h2>
      <p className="text-base text-cocoa-700 leading-relaxed">
        A coffee shop turning over $200,000 a year is not in the same
        operating reality as one turning over $1.5 million, even if
        both have four employees. Margin Atlas classifies every cell
        into one of three revenue bands per industry. Operators see
        their band on the cell page and can also enter their own
        revenue at <a href="/check" className="text-atlas-700 hover:text-atlas-900 underline">/check</a>
        {" "}to get a band-specific verdict.
      </p>

      <h2 className="font-display text-2xl mt-10 mb-3 text-ink-900">The cost stack</h2>
      <p className="text-base text-cocoa-700 leading-relaxed">
        Every cell carries a nine-line breakdown of where revenue
        goes: rent, payroll, cost of sales, utilities, marketing,
        insurance, equipment, motor vehicle (for trades and transport),
        regulatory. The lines sum to the operating cost; the gap from
        revenue is the operating margin. Motor vehicle is broken out
        because for a plumber or electrician it is a real five-to-eight
        percent of revenue, not a footnote.
      </p>

      <h2 className="font-display text-2xl mt-10 mb-3 text-ink-900">Where the numbers come from</h2>
      <p className="text-base text-cocoa-700 leading-relaxed">
        Cost-share baselines derive from official national business
        statistics (sector aggregates), industry operator surveys, and
        published academic and practitioner cost studies. They are
        country-adjusted at render time for rent, energy, wages, and
        trade flow using the country economic profile attached to
        every page. Quality grades are visible per cell.
      </p>

      <h2 className="font-display text-2xl mt-10 mb-3 text-ink-900">Outside the range</h2>
      <p className="text-base text-cocoa-700 leading-relaxed">
        Being outside the typical band is not a problem on its own. It
        is a flag worth understanding. Operators above the range are
        likely paying for something a peer is not; below it, you may
        be cutting where others are not. Margin Atlas calls out the
        biggest deviation but does not score operators good or bad on
        any single line.
      </p>

      <div className="mt-12 p-5 rounded-2xl bg-cream-100 border border-parchment">
        <div className="text-xs font-semibold uppercase tracking-wide text-atlas-700 mb-2">
          Try the comparator
        </div>
        <div className="font-display text-xl text-ink-900 mb-2">
          Where do your numbers sit?
        </div>
        <p className="text-sm text-cocoa-700 mb-3">
          Type your real annual revenue and a few cost lines. See your
          per-ratio verdict in under a minute.
        </p>
        <a
          href="/check"
          className="inline-block px-4 py-2 rounded-lg bg-atlas-700 hover:bg-atlas-800 text-cream-50 text-sm font-semibold transition"
        >
          Open the comparator
        </a>
      </div>
    </article>
  );
}
