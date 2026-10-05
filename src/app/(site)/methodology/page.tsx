/**
 * src/app/methodology/page.tsx
 *
 * The methodology page: the trust spine of the product thesis. Reformed from a
 * bare redirect into a warm, editorial, trust-forward read (bible Section 19
 * trust system, Section 25 voice, Section 26 #9 "treat data confidence as a
 * product feature, not a disclaimer", Section 9 confidence labels).
 *
 * It explains plainly how a number is built (official where it exists,
 * triangulated where it does not, estimated where needed), how a page marks a
 * figure, the honest limits of false precision, and the blunt line that these
 * are decision benchmarks, not your books and not financial, tax, or legal
 * advice.
 *
 * WHAT A PAGE MARKS, said as the pages print it (masterplan step 02,
 * 2026-10-05). This page promised "a confidence label on every figure", a
 * "coverage chip" and four tiers, and a "How we know this" link beside every
 * headline number; the rebuilt pages print none of them. It now says what they
 * print: the four kinds (/about-data#reading), the line under a figure, and a
 * small half-filled circle on an estimate. No new promise is written.
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
    "How Margin Atlas builds its small-business numbers: official data where it exists, triangulated where it does not, and an estimate where no record holds the figure.",
  alternates: { canonical: "/methodology" },
};

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
            and largest firms in a trade. Some of that is counted from official
            records. Some of it has to be triangulated. Some of it is an
            estimate. We would rather tell you which is which than dress every
            figure up as fact.
          </p>
          <p className="text-ink-900">
            So where it matters, the line under a figure says which kind it is.
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
              Estimated, where needed
            </h3>
            <p className="mt-2 text-base leading-relaxed text-graphite">
              For the thinnest slices, we estimate: global patterns for the
              trade, scaled by country-level signals like income per head,
              governance quality, and urbanisation. It is an honest expectation
              of where a typical firm would land, and the page says it is an
              estimate so nobody mistakes it for a count.
            </p>
          </div>
        </div>
      </section>

      {/* How a page marks a figure: what the pages print, nothing more (masterplan step 02). */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl text-ink-900 sm:text-3xl">
          How a page marks a figure
        </h2>
        <p className="mt-4 text-base leading-relaxed text-graphite">
          A figure is one of four kinds: counted, worked out, looked up or
          estimated. Where it matters, the line under it says which, and an
          estimate carries a small half-filled circle beside that line. The four
          kinds, each with a figure you will meet, are set out on{" "}
          <Link
            href="/about-data#reading"
            className="font-medium text-atlas-700 underline decoration-atlas-300 underline-offset-2 hover:text-atlas-900 hover:decoration-atlas-700"
          >
            About the figures
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
              About the figures
            </Link>{": "}
            the four kinds of figure, and the sources.
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
