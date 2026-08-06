import type { Metadata } from "next";
import { SavedClient } from "./SavedClient";

/**
 * A private surface, so it says so rather than competing for a search result.
 *
 * This page declared a title but no `alternates`, and Next resolves metadata
 * down the segment tree per top-level KEY, so it inherited the root layout's
 * `alternates: { canonical: "/" }` whole and told every crawler it WAS the home
 * page. The honest correction is not a self-canonical. Nothing here is a search
 * answer: the starred list lives in one reader's browser and renders empty for
 * everybody else. It should not be listed at all.
 *
 * Two details of how Next resolves this, both load-bearing, and the same two
 * that govern /account and /signin:
 *
 *   `robots` replaces the root's key wholesale rather than deep-merging, so the
 *   root's `googleBot: { index: true }` does not survive alongside this. One
 *   noindex is enough.
 *
 *   `canonical: null` clears the inherited "/" instead of replacing it with
 *   "/saved". A page that has said do not list me should not also be nominating
 *   a canonical URL; the two are conflicting instructions. Null resolves to no
 *   tag at all, which is the unambiguous answer.
 */
export const metadata: Metadata = {
  title: "Saved | Margin Atlas",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function SavedPage() {
  return (
    <div>
      <header className="py-10">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
          Saved
        </h1>
        <p className="mt-3 text-lg text-ink-800/80 max-w-2xl leading-relaxed">
          Your starred items live in this browser. Free tier saves up to 5.
        </p>
      </header>
      <SavedClient />
    </div>
  );
}
