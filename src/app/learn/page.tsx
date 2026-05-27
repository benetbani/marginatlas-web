/**
 * Knowledge base hub.
 *
 * Route: /learn
 *
 * Lists all articles grouped by family:
 *   A — "How much does X make?" — head-term search intent
 *   B — "What is a healthy margin for X?" — decision intent
 *   C — "How to read benchmarks" — educational intent
 *
 * Server-rendered. Quiet design: typographic list, calm spacing.
 */
import Link from "next/link";
import type { Metadata } from "next";
import { LEARN_BY_FAMILY } from "@/lib/learn/articles";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Knowledge base | Margin Atlas",
  description: "Plain answers about small business revenue, margins, and how benchmarks work. A calm reference for operators, founders, and analysts.",
};

export default function LearnHub() {
  const a = LEARN_BY_FAMILY("A");
  const b = LEARN_BY_FAMILY("B");
  const c = LEARN_BY_FAMILY("C");

  return (
    <article className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="text-xs uppercase tracking-wide text-atlas-600 font-semibold mb-2">
        Knowledge base
      </div>
      <h1 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-ink-900 mb-3">
        Plain answers about small business
      </h1>
      <p className="text-base md:text-lg text-cocoa-700/80 mb-12 max-w-2xl leading-relaxed">
        A calm reference for operators, founders, and analysts. Every
        page is short, deterministic, and links into the underlying
        Atlas benchmarks.
      </p>

      <Section title="How much does X make?" subtitle="Real revenue numbers for everyday businesses.">
        <ArticleList articles={a} />
      </Section>

      <Section title="What is a healthy margin?" subtitle="What good looks like in each category.">
        <ArticleList articles={b} />
      </Section>

      <Section title="How to read benchmarks" subtitle="A short guide to the numbers and what they mean.">
        <ArticleList articles={c} />
      </Section>
    </article>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="mb-14 md:mb-16">
      <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-ink-900 mb-1">
        {title}
      </h2>
      <p className="text-sm text-cocoa-700/70 mb-6">{subtitle}</p>
      {children}
    </section>
  );
}

function ArticleList({ articles }: { articles: ReturnType<typeof LEARN_BY_FAMILY> }) {
  return (
    <ul className="divide-y divide-parchment border-y border-parchment">
      {articles.map((a) => (
        <li key={a.slug}>
          <Link
            href={`/learn/${a.slug}`}
            className="group flex items-baseline justify-between gap-4 py-3 hover:bg-cream-50 -mx-3 px-3 rounded-lg transition-colors"
          >
            <span className="font-medium text-ink-900 group-hover:text-atlas-700 transition-colors">
              {a.title}
            </span>
            {a.headlineNumber && (
              <span className="hidden md:inline-block text-sm text-cocoa-700/60 tabular-nums shrink-0">
                {a.headlineNumber.value}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
