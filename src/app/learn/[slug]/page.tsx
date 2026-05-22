/**
 * Plan v27 Lane D — individual knowledge-base article.
 *
 * Route: /learn/[slug]
 *
 * Renders:
 *   1. Breadcrumb + family tag
 *   2. Question-form h1
 *   3. Headline answer (large, with optional number)
 *   4. Body paragraphs
 *   5. Deep links into Atlas benchmarks
 *   6. Related KB cross-links
 *   7. FAQ schema for the question
 *
 * Server-rendered. revalidate: 24h.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { LEARN_ARTICLES, LEARN_BY_SLUG } from "@/lib/learn/articles";

export const revalidate = 86400;

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

      {/* Headline answer */}
      <section className="mb-10 md:mb-12">
        {article.headlineNumber && (
          <div className="mb-4 rounded-2xl border border-parchment bg-cream-50 p-5 md:p-6">
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

      {/* Body */}
      <section className="prose prose-stone max-w-none mb-12">
        {article.body.map((para, i) => (
          <p key={i} className="text-base md:text-lg text-ink-800 leading-relaxed mb-4">
            {para}
          </p>
        ))}
      </section>

      {/* Atlas deep links */}
      {article.relatedIndustryIds.length > 0 && (
        <section className="mb-10 rounded-2xl border border-parchment bg-white p-5 md:p-6">
          <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-3">
            Show me the data
          </div>
          <p className="text-sm text-cocoa-700/80 mb-4">
            Open the full benchmark for this industry in Atlas:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {article.relatedIndustryIds.flatMap((ind) =>
              [
                { city: "new-york", iso2: "us", label: "New York" },
                { city: "london", iso2: "gb", label: "London" },
                { city: "tokyo", iso2: "jp", label: "Tokyo" },
              ].map((g) => (
                <Link
                  key={`${ind}-${g.city}`}
                  href={`/${g.iso2}/${g.city}/${ind.replace(/_/g, "-")}`}
                  className="text-sm text-atlas-700 hover:text-atlas-900 font-medium underline decoration-atlas-200 hover:decoration-atlas-700 underline-offset-2"
                >
                  {ind.replace(/_/g, " ")} in {g.label} →
                </Link>
              )),
            )}
          </div>
        </section>
      )}

      {/* Related KB */}
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
