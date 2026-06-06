/**
 * HomepageEditorialBlocks
 * =======================
 *
 * Three vertically-stacked editorial blocks, each with a distinct visual
 * treatment so the homepage does not feel monotone.
 *
 * Design intent:
 *   - Block A reads like a magazine spread (text-left, list-right).
 *   - Block B reads like a process diagram (three cards connected by a
 *     hairline amber pipeline).
 *   - Block C reads like a quiet directory of audiences (four-up row).
 *
 * All three share the homepage's warm-paper palette and the visual tokens
 * defined in src/styles/homepage-visual-tokens.css.
 */

import Link from "next/link";
import {
  Database, MapPin, Calculator,
  Briefcase, Rocket, ChartLine, BookOpen,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhIcon } from "@phosphor-icons/react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

// ============================================================================
// Block A — What you can ask Atlas
// ============================================================================
// Each question carries a teaser: the shape of the answer it lands on (a
// figure or a verdict word), so the block reads "ask this, get this" instead
// of listing questions with no payoff. The teaser is the promise; the cell
// behind the link is the proof.
export type AtlasQuestion = { text: string; href: string; teaser?: string };

const DEFAULT_QUESTIONS: AtlasQuestion[] = [
  { text: "How much does a bakery make in Lisbon?",        href: "/pt/lisbon/bakeries",            teaser: "Revenue per shop, and what survives as profit." },
  { text: "What's a healthy margin for a small law firm?", href: "/industries/legal-services",     teaser: "The net margin a solo practice should clear." },
  { text: "Which industries thrive in Singapore?",          href: "/sg",                            teaser: "The lines that keep the most for their owners." },
  { text: "How much should a Nairobi salon owner pay?",     href: "/ke/nairobi/salons#wages",       teaser: "Typical wage, against what the chair brings in." },
  { text: "What does a Berlin software studio earn?",       href: "/de/berlin/software-studios",    teaser: "Take-home, against a rising wage bill." },
  { text: "How are Mexico City restaurants doing in 2026?", href: "/mx/mexico-city/restaurants",    teaser: "Net margin once rent and staff are paid." },
];

function BlockA({ questions = DEFAULT_QUESTIONS }: { questions?: AtlasQuestion[] }) {
  return (
    <section aria-labelledby="block-a-h2" className="w-full bg-white border-t border-parchment/60">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <SectionEyebrow size="md">What you can ask Atlas</SectionEyebrow>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
          <div className="md:col-span-5">
            <h2
              id="block-a-h2"
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance text-ink-900 leading-[1.1]"
            >
              The simple questions a working operator actually asks.
            </h2>
            <p className="mt-4 text-base text-cocoa-700 leading-relaxed">
              Ask one, get the figure it lands on. Every line below opens the cell that holds the real numbers, comparable across borders.
            </p>
          </div>

          <div className="md:col-span-7">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              {questions.map((q) => (
                <li key={q.text} className="border-b border-parchment last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                  <Link
                    href={q.href}
                    className="group flex items-start justify-between gap-4 py-4 text-base text-ink-900 hover:text-atlas-700 transition-colors"
                  >
                    <span className="min-w-0">
                      <span className="block font-medium leading-snug">{q.text}</span>
                      {q.teaser && (
                        <span className="mt-1 flex items-baseline gap-1.5 text-sm text-cocoa-700/80">
                          <span aria-hidden="true" className="text-atlas-700">
                            &rarr;
                          </span>
                          {q.teaser}
                        </span>
                      )}
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 pt-1 text-cocoa-700/50 group-hover:text-atlas-700 transition-colors translate-x-0 group-hover:translate-x-0.5 transition-transform"
                    >
                      &rarr;
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Block B — How we know, and how sure we are (3 plain steps)
// ============================================================================
// Rewritten 2026-06-06 (founder: the tier/pipeline language was too
// technical). Three plain operator sentences: where the number came from and
// how sure we are of it. No "coverage tiers", no "calibrated", no pipeline.
type Step = {
  icon: PhIcon;
  title: string;       // one plain word
  explain: string;     // one plain sentence
};

const STEPS: Step[] = [
  {
    icon: Database,
    /* useless-tile-ok: plain-language confidence label, not a count-of-things tile */
    title: "Measured",
    explain: "Where governments publish the figures, we use them as reported.",
  },
  {
    icon: MapPin,
    title: "Benchmarked",
    explain: "Where they do not, we borrow from the region next door and say so.",
  },
  {
    icon: Calculator,
    title: "Estimated",
    explain: "For the long tail, we estimate, and we label it as such.",
  },
];

function BlockB() {
  return (
    <section aria-labelledby="block-b-h2" className="w-full bg-white border-t border-parchment/60">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <SectionEyebrow size="md">How the numbers are built</SectionEyebrow>
        <h2
          id="block-b-h2"
          className="font-display mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-balance text-ink-900 leading-[1.1] max-w-3xl"
        >
          How we know, and how sure we are.
        </h2>

        <div className="atlas-pipeline mt-10">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <article
                key={s.title}
                className="atlas-pipeline-step rounded-lg border border-parchment bg-white p-6"
                data-pipeline-step={i + 1}
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-amber-50 border border-amber-200 text-atlas-700">
                    <Icon size={18} weight="regular" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-cocoa-700/60">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display mt-4 text-xl font-semibold tracking-tight text-ink-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-cocoa-700 leading-relaxed">
                  {s.explain}
                </p>
              </article>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-cocoa-700/85">
          Every cell says which of the three it is, in plain sight. See where each
          number comes from on the
          {" "}
          <Link href="/methodology" className="font-semibold text-atlas-700 underline-offset-4 hover:underline">
            methodology page
          </Link>.
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// Block C — Who uses Atlas (four-up audience strip)
// ============================================================================
type Audience = {
  icon: PhIcon;
  label: string;
  blurb: string;
};

const AUDIENCES: Audience[] = [
  {
    icon: Briefcase,
    label: "Operators",
    blurb: "Compare your shop to the typical operator in your city, and to peers across borders.",
  },
  {
    icon: Rocket,
    label: "Founders",
    blurb: "Size new markets, set realistic targets, and find the cells with room to grow.",
  },
  {
    icon: ChartLine,
    label: "Analysts",
    blurb: "Drop calibrated SMB benchmarks into models, with sourcing trails for every cell.",
  },
  {
    icon: BookOpen,
    label: "Curious readers",
    blurb: "Browse the world's small economies the way you would a fine reference book.",
  },
];

function BlockC() {
  return (
    <section aria-labelledby="block-c-h2" className="w-full bg-white border-t border-parchment/60">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <SectionEyebrow size="md">Who uses Atlas</SectionEyebrow>
        <h2
          id="block-c-h2"
          className="font-display mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-balance text-ink-900 leading-[1.1] max-w-3xl"
        >
          Four kinds of readers, one shared reference.
        </h2>

        <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-8">
          {AUDIENCES.map((a) => {
            const Icon = a.icon;
            return (
              <li key={a.label} className="atlas-editorial-line">
                <div className="flex items-center gap-2 text-atlas-700">
                  <Icon size={18} weight="regular" aria-hidden="true" />
                  <span className="font-display text-lg font-semibold tracking-tight">
                    {a.label}
                  </span>
                </div>
                <p className="mt-2 text-sm text-cocoa-700 leading-relaxed">
                  {a.blurb}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ============================================================================
// Composed export
// ============================================================================
export default function HomepageEditorialBlocks({
  questions,
}: { questions?: AtlasQuestion[] } = {}) {
  // Block C ("Who uses Atlas" / audience archetypes)
  // removed from the default composition. The four-tile audience grid
  // reads as SaaS-landing-page muscle, not editorial. Still exported
  // as a named export below if a future page wants to reuse it.
  return (
    <>
      <BlockA questions={questions} />
      <BlockB />
    </>
  );
}

// Named exports too, in case the page wants to interleave them with other
// homepage modules (e.g. drop a featured-cell carousel between A and B).
export { BlockA, BlockB, BlockC };
