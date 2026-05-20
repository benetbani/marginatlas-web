"use client";

/**
 * Cell-page error boundary (Track CC.9).
 *
 * Catches uncaught errors in server components or data fetches and renders
 * a soft fallback instead of crashing the whole page.
 */
import { useEffect } from "react";
import Link from "next/link";

export default function CellError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console so the dev server picks it up; production Sentry hook
    // lives in Track JJ.4.
    console.error("Cell page error:", error);
  }, [error]);

  return (
    <div className="py-12 max-w-2xl">
      <div className="text-xs uppercase tracking-wide text-clay-700 font-medium">
        Something tripped
      </div>
      <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-ink-900">
        We couldn&apos;t load this cell.
      </h1>
      <p className="mt-3 text-ink-700 leading-relaxed">
        A data fetch failed mid-render. The atlas is still up: try one of
        the options below, or reload to re-fetch.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-full bg-ink-900 text-cream-50 hover:bg-ink-800 transition font-medium"
        >
          Try again
        </button>
        <Link
          href="/browse"
          className="px-4 py-2 rounded-full bg-cream-100 border border-parchment text-ink-900 hover:bg-white transition font-medium"
        >
          Browse other benchmarks
        </Link>
        <Link
          href="/"
          className="px-4 py-2 rounded-full bg-cream-100 border border-parchment text-ink-900 hover:bg-white transition font-medium"
        >
          Home
        </Link>
      </div>
      {error.digest ? (
        <p className="mt-6 text-xs text-ink-700/60 font-mono">
          Error ref: {error.digest}
        </p>
      ) : null}
    </div>
  );
}
