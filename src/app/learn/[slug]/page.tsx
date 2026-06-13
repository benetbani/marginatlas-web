/**
 * Individual knowledge-base article.
 *
 * Route: /learn/[slug]
 *
 * Content-map reading order for a LEARN page (page-content-map.md):
 *   1. Breadcrumb + family tag
 *   2. Question-form h1 + headline answer (large, with optional number)
 *   3. A worked example: a real sample P&L (revenue minus each cost = kept)
 *   4. The revenue spread (the signature seven-stop RangeStrip)
 *   5. The honest take (the through-line)
 *   6. The explanation in plain words (the body)
 *   7. Other businesses worth a look: adjacent trades with their economics
 *   8. Links into the real live Atlas benchmarks (resolved to a real trade +
 *      representative city, so a link never points at a slug that 404s)
 *   9. Related KB cross-links
 *  10. FAQ schema for the question
 *
 * Server-rendered. revalidate: 24h. Tokens only via the kit; no raw color, no
 * em-dashes, no source-agency names.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { LEARN_ARTICLES, LEARN_BY_SLUG } from "@/lib/learn/articles";
import { buildLearnView } from "@/lib/learn/learn_view";
import {
  MoneyGoesBreakdown,
  RangeStrip,
  HonestTakeBox,
  SameBusinessNearby,
} from "@/components/kit";

export const revalidate = 86400;

function usd(n: number): string {
  if (!Number.isFinite(n)) return "–";
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}

export async function generateStaticParams() {
  return LEARN_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = LEARN_BY_SLUG.get(slug);
  if (!a) return { title: "Not found | Margin Atlas" };
  return {
    title: `${a.title} | Margin Atlas`,
    description: a.oneLineAnswer,
  };
}

const FAMILY_LABEL: Record<"A" | "B" | "C", string> = {
  A: "How much does X make?",
  B: "What is a healthy margin?",
  C: "How to read benchmarks",
};

export default async function LearnArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = LEARN_BY_SLUG.get(slug);
  if (!article) notFound();

  const view = buildLearnView(article);

  const related = article.relatedSlugs
    .map((s) => LEARN_BY_SLUG.get(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .slice(0, 4);

  return (
    <article className="max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
      {/* FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: article.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: article.oneLineAnswer + " " + article.body.join(" "),
                },
              },
            ],
          }),
        }}
      />

      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-cocoa-700/60 font-semibold mb-3">
        <Link href="/learn" className="hover:text-atlas-700">
          Knowledge base
        </Link>
        <span>·</span>
        <span>{FAMILY_LABEL[article.family]}</span>
      </div>

      <h1 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-ink-900 mb-6 leading-tight">
        {article.title}
      </h1>

      {/* 2. Headline answer */}
      <section className="mb-10 md:mb-12">
        {article.headlineNumber && (
          <div className="mb-4 rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6">
            <div className="font-display text-4xl md:text-5xl font-medium text-ink-900 tabular-nums leading-none">
              {article.headlineNumber.value}
            </div>
            <div className="text-sm text-cocoa-700/70 mt-2">
              {article.headlineNumber.label}
            </div>
          </div>
        )}
        <p className="text-lg md:text-xl text-ink-900 leading-relaxed font-medium">
          {article.oneLineAnswer}
        </p>
      </section>

      {/* 3. The worked example: a real sample P&L, between the answer and the
          prose. Built only from the cost shares the article itself states, so it
          restates real figures rather than inventing a split. */}
      {view.pnl ? (
        <section className="mb-10">
          <MoneyGoesBreakdown
            eyebrow="A worked example"
            heading="Where every $100 of sales goes"
            lede={
              view.pnl.lede ??
              "The typical split of a dollar of sales for this trade, before the owner draws a wage."
            }
            items={view.pnl.rows}
          />
        </section>
      ) : null}

      {/* 4. The spread: the typical figure is a half-truth, the range is the
          story. Seven gradations, the signature strip. */}
      {view.spread ? (
        <section className="mb-10 rounded-lg border border-parchment bg-cream-50 shadow-subtle px-5 py-5 md:px-7 md:py-6">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-cocoa-500 mb-3">
            The revenue spread
          </div>
          <RangeStrip
            p10={view.spread.p10}
            p25={view.spread.p25}
            p50={view.spread.p50}
            p75={view.spread.p75}
            p90={view.spread.p90}
            format={usd}
          />
          <p className="mt-3 text-[11px] leading-relaxed text-cocoa-500">
            Bottom tenth to top tenth, with the typical operator marked. Most of
            the spread is location and format, not how hard anyone works.
          </p>
        </section>
      ) : null}

      {/* 5. The honest take: the through-line, right after the headline numbers. */}
      {view.honestTake ? (
        <div className="mb-10">
          <HonestTakeBox verdict={view.honestTake.verdict}>
            {view.honestTake.body}
          </HonestTakeBox>
        </div>
      ) : null}

      {/* 6. Body: the explanation in plain words. */}
      <section className="prose prose-stone max-w-none mb-12">
        {article.body.map((para, i) => (
          <p key={i} className="text-base md:text-lg text-ink-800 leading-relaxed mb-4">
            {para}
          </p>
        ))}
      </section>

      {/* 7. Other businesses worth a look: adjacent trades with their economics
          in view, so a reader can branch to a comparable one. The headline
          figure (and what it measures) rides in the sub-line, so the economics
          are visible without leaving the page. */}
      {view.adjacent ? (
        <section className="mb-10">
          <SameBusinessNearby
            eyebrow="Other businesses worth a look"
            heading="Adjacent trades, with the headline economics"
            rows={view.adjacent.map((a) => ({
              name: a.title,
              href: a.href,
              sub: a.value
                ? [a.value, a.sub].filter(Boolean).join(" · ")
                : a.sub,
            }))}
            note="Each opens its own explainer. Read the typical revenue, then the margin, before the dollars."
          />
        </section>
      ) : null}

      {/* 8. Atlas deep links: the live benchmarks. Each tag resolves to a REAL
          trade and a representative city, so a link never points at a slug that
          404s (the old hardcoded NY / London / Tokyo trio linked unmapped tags
          that did not resolve). */}
      {view.benchmarks ? (
        <section className="mb-10 rounded-lg border border-parchment bg-white shadow-subtle px-5 py-5 md:px-7 md:py-6">
          <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-3">
            Show me the data
          </div>
          <p className="text-sm text-cocoa-700/80 mb-4">
            Open the full benchmark for this trade in Atlas:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {view.benchmarks.map((b) => (
              <Link
                key={b.href}
                href={b.href}
                className="text-sm text-atlas-700 hover:text-atlas-900 font-medium underline decoration-atlas-200 hover:decoration-atlas-700 underline-offset-2"
              >
                {b.label} &rarr;
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* 9. Related KB */}
      {related.length > 0 && (
        <section className="border-t border-parchment pt-8">
          <div className="text-xs uppercase tracking-wide text-cocoa-700/60 font-semibold mb-3">
            Related questions
          </div>
          <ul className="space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/learn/${r.slug}`}
                  className="text-base text-atlas-700 hover:text-atlas-900 underline decoration-atlas-200 hover:decoration-atlas-700 underline-offset-2"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
