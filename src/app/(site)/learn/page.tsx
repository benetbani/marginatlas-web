/**
 * Knowledge base hub.
 *
 * Route: /learn
 *
 * Reformation (bible Section 14, the directory row: a guided read, never an
 * "alphabetical dump only"; Section 25 voice: blunt, practical, skeptical of
 * easy money). The page leads with a blunt framing of what the learn section
 * is for, understanding the economics behind the numbers before you bet money
 * on a business, then groups the articles into three reading tracks instead of
 * listing them flat:
 *
 *   A — "How much does X make?"     -> what actually moves through the till
 *   B — "What is a healthy margin?" -> what the owner actually keeps
 *   C — "How to read benchmarks"    -> reading the numbers without fooling yourself
 *
 * The three families and every /learn/{slug} link are unchanged. Each row
 * carries the article's own headline figure as a quiet signal where one
 * exists; the reference track (C) has no figure and degrades to a plain row
 * (bible: hide weakness, no apologetic placeholder). Counts are derived from
 * the registry at render time, never hardcoded.
 *
 * URL, metadata, and revalidate are preserved. Server-rendered, no client JS.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { LEARN_BY_FAMILY } from "@/lib/learn/articles";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Knowledge base | Margin Atlas",
  description: "Plain answers about small business revenue, margins, and how benchmarks work. A calm reference for operators, founders, and analysts.",
};

type Article = ReturnType<typeof LEARN_BY_FAMILY>[number];

/**
 * The three reading tracks. Each is reframed from a search-intent bucket into
 * a stage of the same argument: see the revenue, then see how little of it the
 * owner keeps, then learn to read the figures honestly. Every blurb names what
 * the number hides, per the voice rule "never quote a figure without saying
 * what can break it".
 */
type Track = {
  family: "A" | "B" | "C";
  title: string;
  blurb: string;
  signalLabel: string | null;
};

const TRACKS: Track[] = [
  {
    family: "A",
    title: "What actually moves through the till",
    blurb:
      "Start with the headline question everyone asks: what does this kind of business take in? These give you the typical revenue and the spread around it, by format. Treat the figure as a sanity check, not a target. The till total is the easy number to find and the easy one to misread, because none of it is yet the owner's to keep.",
    signalLabel: "Typical revenue",
  },
  {
    family: "B",
    title: "What the owner actually keeps",
    blurb:
      "Revenue is not income. After food, wages, rent, and the rest, a busy business can leave its owner thin, and a quiet one can leave its owner comfortable. These pages give the healthy margin band for each trade, what good looks like, and where the margin usually leaks. Read this track before you fall for a big top-line number.",
    signalLabel: "Healthy margin",
  },
  {
    family: "C",
    title: "Reading the numbers without fooling yourself",
    blurb:
      "A benchmark is only useful if you know what it can and cannot claim. This track is the skeptic's toolkit: what a median really says, why the same trade looks different across cities, how to read the percentile spread, and what the confidence label on every figure is warning you about. Short, plain, and built to stop a tidy number from leading you somewhere expensive.",
    signalLabel: null,
  },
];

export default function LearnHub() {
  const byFamily: Record<Track["family"], Article[]> = {
    A: LEARN_BY_FAMILY("A"),
    B: LEARN_BY_FAMILY("B"),
    C: LEARN_BY_FAMILY("C"),
  };
  const total = byFamily.A.length + byFamily.B.length + byFamily.C.length;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-cocoa-700/70 mb-6">
        <Link href="/" className="hover:text-atlas-700">
          Home
        </Link>
        <span className="mx-2 text-cocoa-500">/</span>
        <span className="text-ink-900">Learn</span>
      </nav>

      <header className="max-w-2xl">
        <SectionEyebrow size="md" className="mb-3">
          Knowledge base
        </SectionEyebrow>
        <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-balance text-ink-900 leading-[1.05]">
          Understand the economics before you bet on a business
        </h1>
        <p className="mt-5 text-base md:text-lg text-graphite leading-relaxed">
          Revenue is the number everyone quotes, and the one that fools the most
          people.{" "}
          <span className="text-ink-900">
            A storefront that takes in a million dollars can still pay its owner
            less than the staff, and a quiet trade with light costs can keep a
            real share.
          </span>{" "}
          These pages explain the money behind the benchmarks: what a business
          earns, what it actually keeps, and how to read a figure without letting
          it talk you into a bad lease or a bad idea. Every page is short, plain,
          and links back into the Atlas numbers it draws on.
        </p>
        <p className="mt-4 text-sm text-cocoa-700/85 tabular-nums">
          <span className="text-ink-900 font-medium">{total}</span> articles, in
          three tracks. Read them in order or jump to the one you need.
        </p>
      </header>

      {/* The three reading tracks. Each is a real section with a real heading;
          a track with no articles self-omits. The grouping is the editorial
          spine that replaces the flat family lists. */}
      <div className="mt-12 md:mt-16 space-y-14 md:space-y-20">
        {TRACKS.map((track, i) => {
          const articles = byFamily[track.family];
          if (articles.length === 0) return null;
          return (
            <section key={track.family} aria-labelledby={`track-${track.family}`}>
              <div className="max-w-2xl">
                <div className="flex items-baseline gap-3">
                  <span
                    className="font-display text-lg text-atlas-700/70 tabular-nums leading-none"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2
                    id={`track-${track.family}`}
                    className="font-display text-2xl md:text-3xl font-medium tracking-tight text-balance text-ink-900 leading-tight"
                  >
                    {track.title}
                  </h2>
                </div>
                <p className="mt-3 text-base text-graphite leading-relaxed">
                  {track.blurb}
                </p>
                <p className="mt-2 text-[13px] text-cocoa-700/75 tabular-nums">
                  {articles.length} articles
                </p>
              </div>
              <ArticleList articles={articles} signalLabel={track.signalLabel} />
            </section>
          );
        })}
      </div>

      <p className="mt-16 pt-8 border-t border-parchment text-xs text-cocoa-700/70 max-w-2xl leading-relaxed">
        Every figure here is a benchmark, a read on how a trade tends to perform,
        not your books and not advice. Your own rent, payroll, and concept will
        move you off the typical number, often a long way.
      </p>
    </div>
  );
}

/**
 * One reading track's articles, as an editorial index. Each row is the title
 * plus the search-intent question beneath it, and, where the article carries
 * one, its own headline figure as a quiet right-aligned signal. Rows without a
 * figure (the reference track) simply omit it.
 */
function ArticleList({
  articles,
  signalLabel,
}: {
  articles: Article[];
  signalLabel: string | null;
}) {
  return (
    <ul className="mt-6 md:mt-8 divide-y divide-parchment border-t border-parchment">
      {articles.map((a) => (
        <li key={a.slug}>
          <Link
            href={`/learn/${a.slug}`}
            className="group flex items-baseline justify-between gap-5 py-4 -mx-3 px-3 rounded-lg hover:bg-cream-50 transition-colors"
          >
            <span className="min-w-0">
              <span className="block font-medium text-ink-900 group-hover:text-atlas-700 transition-colors">
                {a.title}
              </span>
              <span className="mt-0.5 block text-sm text-cocoa-700/70 leading-snug">
                {a.question}
              </span>
            </span>
            {signalLabel && a.headlineNumber ? (
              <span className="hidden sm:block text-right shrink-0">
                <span className="block font-serif text-lg text-atlas-700 tabular-nums leading-none">
                  {a.headlineNumber.value}
                </span>
                <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.12em] text-cocoa-500">
                  {signalLabel}
                </span>
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
