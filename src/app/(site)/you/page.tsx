import type { Metadata } from "next";
import { CompareToMeClient } from "./CompareToMeClient";
import { YouDashboard } from "./YouDashboard";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

/**
 * A private surface, so it says so rather than competing for a search result.
 *
 * This page declared a title and a description but no `alternates`, and Next
 * resolves metadata down the segment tree per top-level KEY, so it inherited the
 * root layout's `alternates: { canonical: "/" }` whole and told every crawler it
 * WAS the home page. The honest correction is not a self-canonical. Everything
 * on this page is read from the reader's own browser storage, so what a crawler
 * fetches is an empty shell of somebody else's shortlist. It should not be
 * listed at all.
 *
 * Two details of how Next resolves this, both load-bearing, and the same two
 * that govern /account and /signin:
 *
 *   `robots` replaces the root's key wholesale rather than deep-merging, so the
 *   root's `googleBot: { index: true }` does not survive alongside this. One
 *   noindex is enough.
 *
 *   `canonical: null` clears the inherited "/" instead of replacing it with
 *   "/you". A page that has said do not list me should not also be nominating a
 *   canonical URL; the two are conflicting instructions. Null resolves to no tag
 *   at all, which is the unambiguous answer.
 */
export const metadata: Metadata = {
  title: "Your Atlas | Margin Atlas",
  description:
    "Your shortlist, your standing context, and the comparisons you looked at, in one calm place. Everything stays on your device.",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export const revalidate = 86400;

/**
 * /you - the reader's own corner of the Atlas.
 *
 * A calm server shell around a client dashboard. The dashboard aggregates the
 * three durable, on-device things the reader builds as they go: the watch list,
 * the standing context, and recent comparisons (all from localStorage, so the
 * dashboard hydrates after mount with honest empty states until then). Below it,
 * the long-standing "how do I compare?" calculator stays available as a section.
 *
 * Nothing here is stored on a server: the page reads only what the reader's own
 * browser holds.
 */
export default function YouPage() {
  return (
    <div className="pb-16">
      <header className="border-b border-parchment/60 py-8 sm:py-10">
        <SectionEyebrow size="md" className="mb-3">
          Your Atlas
        </SectionEyebrow>
        <h1 className="max-w-3xl font-display text-3xl font-medium leading-tight tracking-tight text-ink-900 sm:text-4xl">
          Your shortlist, your context, and what you compared.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-graphite">
          Everything you keep as you read lives here, and only here on your
          device. Nothing is sent to a server, and nothing is tied to an account.
        </p>
      </header>

      <section className="py-8 sm:py-10">
        <YouDashboard />
      </section>

      {/* The calculator, kept as a calm tool below the dashboard. */}
      <section className="border-t border-parchment/60 py-8 sm:py-10">
        <SectionEyebrow size="md" className="mb-3">
          Tool
        </SectionEyebrow>
        <h2 className="max-w-3xl font-display text-2xl font-medium leading-tight tracking-tight text-ink-900 sm:text-3xl">
          How do I compare?
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-graphite">
          Type in your own revenue and see where you sit against the typical firm
          in your industry and region. The calculation runs entirely in your
          browser, and we never store your numbers.
        </p>
        <div className="mt-6">
          <CompareToMeClient />
        </div>
      </section>
    </div>
  );
}
