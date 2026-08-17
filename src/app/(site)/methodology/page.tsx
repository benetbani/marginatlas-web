/**
 * src/app/methodology/page.tsx
 *
 * The methodology page: the trust spine of the product thesis. Reformed from a
 * bare redirect into a warm, editorial, trust-forward read (bible Section 19
 * trust system, Section 25 voice, Section 26 #9 "treat data confidence as a
 * product feature, not a disclaimer", Section 9 confidence labels).
 *
 * It explains plainly how a number is built (official where it exists,
 * triangulated where it does not, modeled where needed), what the four
 * confidence tiers mean, the honest limits of false precision, and the blunt
 * line that these are decision benchmarks, not your books and not financial,
 * tax, or legal advice.
 *
 * Server component, no client JS. All colour and type from tokens. The deep
 * reference page (/about-data) keeps its own anchors and is linked from here;
 * this page is the editorial front door, that one is the long-form annex.
 *
 * Design system: application page. Reuses SectionEyebrow (system primitive).
 */
import Link from "next/link";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export const revalidate = 86400;

export const metadata = {
  title: "Methodology | Margin Atlas",
  description:
    "How Margin Atlas builds its small-business numbers: official data where it exists, triangulated where it does not, modeled where needed, and a confidence label on every figure.",
  alternates: { canonical: "/methodology" },
};

type Tier = {
  id: string;
  name: string;
  dot: string;
  rail: string;
  blurb: string;
};

// The four-tier coverage vocabulary is the one canonical confidence scale used
// across the product (chips, badges, the "How we know this" annex). Tier colour
// rides the shared tier tokens, warmest for the strongest reading.
const TIERS: Tier[] = [
  {
    id: "measured",
    name: "Measured",
    dot: "bg-tier-deep",
    rail: "border-l-tier-deep",
    blurb:
      "Built from a direct reading of the firms in this place and trade. This is the strongest tier: the figure is close to what the middle business actually earns, employs, and pays.",
  },
  {
    id: "regional",
    name: "Regional",
    dot: "bg-tier-good",
    rail: "border-l-tier-good",
    blurb:
      "A broader regional or national reading applied down to this place. The direction is dependable; the precision loosens the smaller and more specific the slice gets.",
  },
  {
    id: "estimated",
    name: "Estimated",
    dot: "bg-tier-starter",
    rail: "border-l-tier-starter",
    blurb:
      "Inferred from country-level economic signals, such as income per head, governance, and urbanisation, blended with global patterns for the trade. Read it as orientation, not a precise figure.",
  },
  {
    id: "modeled",
    name: "Modeled",
    dot: "bg-tier-modeled",
    rail: "border-l-tier-modeled",
    blurb:
      "A transparent model output: global patterns for the trade scaled by what the local economy looks like. There is no direct observation behind this cell, so it shows what we would expect on average, in a range.",
  },
];

export default function MethodologyPage() {
  return (
    <article className="max-w-2xl pb-16">
      {/* Lede: the blunt thesis. Confidence is the product, not an apology. */}
      <header className="border-b border-parchment/60 pb-8">
        <SectionEyebrow size="md" className="mb-3">
          Methodology
        </SectionEyebrow>
        <h1 className="font-serif text-4xl leading-tight tracking-tight text-ink-900 sm:text-5xl">
          How these numbers are built
        </h1>
        <div className="mt-5 max-w-xl space-y-4 text-lg leading-relaxed text-graphite">
          <p>
            Margin Atlas compares how a small business performs in a specific
            place: revenue, headcount, wages, and the gap between the smallest
            and largest firms in a trade. Some of that is measured directly.
            Some of it has to be triangulated. Some of it is modeled. We would
            rather tell you which is which than dress every figure up as fact.
          </p>
          <p className="text-ink-900">
            So every number on the site carries a confidence label. That label
            is the product, not the fine print. It tells you how hard you can
            lean on a figure before you put your own money behind it.
          </p>
        </div>
      </header>

      {/* How a number is built: the three honest paths. */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">
          How we build a single number
        </h2>
        <p className="mt-4 text-base leading-relaxed text-graphite">
          Data is not evenly distributed across the world. A restaurant in a
          large, well-documented economy is easy to read. The same restaurant in
          a place with a big cash economy and light official reporting is not.
          We do not pretend otherwise. A figure reaches a page by one of three
          routes, and we say which.
        </p>

        <div className="mt-7 space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-atlas-700">
              Official, where it exists
            </h3>
            <p className="mt-2 text-base leading-relaxed text-graphite">
              The strongest figures come from primary records: national business
              statistics, commercial registries, labour and wage surveys, public
              company filings. Where this exists for a trade and a place, we use
              it directly and lean on it hard.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-atlas-700">
              Triangulated, where it does not
            </h3>
            <p className="mt-2 text-base leading-relaxed text-graphite">
              When no single source covers a slice cleanly, we cross several:
              firm-size patterns, regional benchmarks, sector structure, and the
              shape of the local economy. No one input is authoritative on its
              own, so the agreement between them is what we trust. The result is
              shown as a range, not a false point.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-atlas-700">
              Modeled, where needed
            </h3>
            <p className="mt-2 text-base leading-relaxed text-graphite">
              For the thinnest slices, we fall back to a transparent model:
              global patterns for the trade, scaled by country-level signals
              like income per head, governance quality, and urbanisation. It is
              an honest expectation of where a typical firm would land, and it is
              labelled as such so nobody mistakes it for a measurement.
            </p>
          </div>
        </div>
      </section>

      {/* The confidence tiers: the centrepiece. Confidence-as-feature. */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">
          What the confidence labels mean
        </h2>
        <p className="mt-4 text-base leading-relaxed text-graphite">
          Every page shows a coverage chip beside the headline number. Four
          tiers, one vocabulary across the whole site. Read the tier first, then
          the figure: it tells you how much weight the number can take.
        </p>

        <div className="mt-7 space-y-3">
          {TIERS.map((t) => (
            <div
              key={t.id}
              id={t.id}
              className={`scroll-mt-24 rounded-r-lg border-l-4 bg-cream-50 px-5 py-4 ${t.rail}`}
            >
              <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-atlas-700">
                <span className={`h-2 w-2 rounded-full ${t.dot}`} />
                {t.name}
              </div>
              <p className="text-sm leading-relaxed text-ink-800">{t.blurb}</p>
            </div>
          ))}
        </div>

        {/* "each benchmark carries a five-star quality rating" stood at the
            front of this sentence, and no benchmark does. The rating was
            deleted from the product deliberately, for the reason recorded in
            the cell page's own source: the 10/10 score and the stars "exposed
            engineering provenance the founder explicitly said never to
            display."

            It was the second copy of that claim. /about-data taught the same
            scale, and this paragraph sent readers there for "the fuller
            breakdown of ratings", so the two pages propped each other up: the
            cross-reference made the claim look sourced. Removing it from one
            page only would have left the other pointing at a section that no
            longer exists.

            The rest of the sentence is exact and stays. "How we know this" is
            HowWeKnowThis's real default label. */}
        <p className="mt-6 text-base leading-relaxed text-graphite">
          Alongside the tier, a quiet{" "}
          <span className="font-medium text-ink-900">How we know this</span> link
          sits next to the headline number so the route and method are one click
          away. The fuller breakdown of the definitions and the words we
          use lives on the{" "}
          <Link
            href="/about-data"
            className="font-medium text-atlas-700 underline decoration-atlas-300 underline-offset-2 hover:text-atlas-900 hover:decoration-atlas-700"
          >
            about-the-data reference
          </Link>
          .
        </p>
      </section>

      {/* The discipline: ranges over false precision; describe, never accuse. */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">
          Where we hold the line
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-graphite">
          <p>
            We would rather be usefully approximate than precisely wrong. If the
            honest answer to a margin is "eight to fifteen percent, depending on
            rent, labour, and the concept," we show that band. We do not invent a
            tidy single figure to look more certain than the data allows. A wide
            range is information; a fake decimal is a trap.
          </p>
          <p>
            When the picture turns on local friction, such as permits, informal
            competition, or rent that has come unstuck from local demand, we
            describe the pattern and what it does to the economics. We point at
            conditions and indicators, never at a named place, official, or
            business. The aim is to widen your risk range honestly, not to make
            an accusation.
          </p>
          <p className="text-ink-900">
            And when the data is genuinely thin, we say so plainly and keep the
            reading directional. A thin signal labelled as thin is worth more
            than a confident number nobody should trust.
          </p>
        </div>
      </section>

      {/* The honest framing: benchmarks, not your books, not advice. */}
      {/* Canonical surface: was a "bg-cream-100" panel, an opaque plate over
          the fixed page photograph. The tint was doing the work of marking
          this closing note as a callout; the card does that now, with
          elevation instead of a fill. */}
      <section className="atlas-card mt-14 px-6 py-7">
        <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">
          What this is, and what it is not
        </h2>
        <div className="mt-4 space-y-4 text-base leading-relaxed text-graphite">
          <p>
            These are decision benchmarks: a credible read on how a trade tends
            to perform in a place, built to help you judge whether a business is
            worth starting, buying, or running there. They are a sanity check
            against the wider market, not your books. Your own rent, payroll,
            concept, and discipline will move you off the typical number, often a
            long way.
          </p>
          <p className="text-ink-900">
            Nothing here is financial, tax, legal, or investment advice, and no
            figure is a guarantee of what any single business will earn. Treat
            every number as a starting point for your own diligence, and check
            anything that will carry real money with an advisor who knows your
            situation.
          </p>
        </div>
      </section>

      {/* Quiet exits. All links pre-existing and working. */}
      <nav className="mt-12 border-t border-parchment/60 pt-7" aria-label="Related references">
        <SectionEyebrow size="sm" className="mb-4">
          Keep reading
        </SectionEyebrow>
        <ul className="space-y-3 text-base text-graphite">
          <li>
            <Link
              href="/about-data"
              className="font-medium text-atlas-700 underline decoration-atlas-300 underline-offset-2 hover:text-atlas-900 hover:decoration-atlas-700"
            >
              About the data
            </Link>{": "}
            the long-form reference for ratings, tax overlay, glossary, and sources.
          </li>
          <li>
            <Link
              href="/coverage"
              className="font-medium text-atlas-700 underline decoration-atlas-300 underline-offset-2 hover:text-atlas-900 hover:decoration-atlas-700"
            >
              Coverage report
            </Link>{": "}
            where the data is deep and where it thins out, by place and trade.
          </li>
          <li>
            <Link
              href="/methodology/key-benchmarks"
              className="font-medium text-atlas-700 underline decoration-atlas-300 underline-offset-2 hover:text-atlas-900 hover:decoration-atlas-700"
            >
              Key benchmarks
            </Link>{": "}
            the headline ratios and how to read them on a page.
          </li>
        </ul>
      </nav>
    </article>
  );
}
