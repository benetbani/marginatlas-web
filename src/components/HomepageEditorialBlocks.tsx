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

// ============================================================================
// Block A — What you can ask Atlas
// ============================================================================
export type AtlasQuestion = { text: string; href: string };

const DEFAULT_QUESTIONS: AtlasQuestion[] = [
  { text: "How much does a bakery make in Lisbon?",        href: "/pt/lisbon/bakeries" },
  { text: "What's a healthy margin for a small law firm?", href: "/sectors/professional_services/law-firms" },
  { text: "Which industries thrive in Singapore?",          href: "/sg" },
  { text: "How much should a Nairobi salon owner pay?",     href: "/ke/nairobi/salons#wages" },
  { text: "What does a Berlin software studio earn?",       href: "/de/berlin/software-studios" },
  { text: "How are Mexico City restaurants doing in 2026?", href: "/mx/mexico-city/restaurants" },
];

function BlockA({ questions = DEFAULT_QUESTIONS }: { questions?: AtlasQuestion[] }) {
  return (
    <section aria-labelledby="block-a-h2" className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <p className="text-xs uppercase tracking-[0.22em] font-semibold text-atlas-700">
          What you can ask Atlas
        </p>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
          <div className="md:col-span-5">
            <h2
              id="block-a-h2"
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance text-ink-900 leading-[1.1]"
            >
              The simple questions a working operator actually asks.
            </h2>
            <p className="mt-4 text-base text-cocoa-700 leading-relaxed">
              Atlas turns public data, primary surveys, and operator filings into answers you can compare across borders. Pick a question to land on the cell that holds the numbers.
            </p>
          </div>

          <div className="md:col-span-7">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              {questions.map((q, i) => (
                <li key={q.text} className="border-b border-parchment last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                  <Link
                    href={q.href}
                    className="group flex items-center justify-between gap-4 py-4 text-base text-ink-900 hover:text-atlas-700 transition-colors"
                  >
                    <span className="font-medium">{q.text}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-cocoa-700/50 group-hover:text-atlas-700 transition-colors translate-x-0 group-hover:translate-x-0.5 transition-transform"
                    >
                      →
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
// Block B — How the numbers are built (3-step pipeline)
// ============================================================================
type Step = {
  icon: PhIcon;
  title: string;       // exactly three words
  explain: string;     // around twelve words
};

const STEPS: Step[] = [
  {
    icon: Database,
    title: "Measured primary data",
    explain: "Audited filings and operator surveys feed cells where the sample is large enough.",
  },
  {
    icon: MapPin,
    title: "Regional benchmarks",
    explain: "Where a city is sparse we lean on the region, flagged honestly in the chip.",
  },
  {
    icon: Calculator,
    title: "Calibrated estimates",
    explain: "Sparse cells are modeled from peers, then recalibrated each quarter as filings arrive.",
  },
];

function BlockB() {
  return (
    <section aria-labelledby="block-b-h2" className="w-full bg-cream-50">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <p className="text-xs uppercase tracking-[0.22em] font-semibold text-atlas-700">
          How the numbers are built
        </p>
        <h2
          id="block-b-h2"
          className="font-display mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-balance text-ink-900 leading-[1.1] max-w-3xl"
        >
          Every cell carries one of three coverage tiers, never hidden.
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
          Read the full methodology, the source list, and the refresh cadence on the
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
    <section aria-labelledby="block-c-h2" className="w-full bg-parchment">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <p className="text-xs uppercase tracking-[0.22em] font-semibold text-atlas-700">
          Who uses Atlas
        </p>
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
  // Plan v32 Sprint B — Block C ("Who uses Atlas" / audience archetypes)
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
