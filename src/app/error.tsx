"use client";

/**
 * Root error boundary (Track CC.9).
 *
 * Catches errors anywhere in the app tree that escape page-level
 * boundaries. Renders a minimal recovery UI so the layout chrome stays
 * intact.
 */
import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="py-16 max-w-2xl">
      <div className="text-xs uppercase tracking-wide text-clay-700 font-medium">
        Hit a snag
      </div>
      <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-ink-900">
        That didn&apos;t render right.
      </h1>
      <p className="mt-3 text-ink-700 leading-relaxed">
        Something in this page threw an error. The rest of the site is fine:
        you can retry or jump elsewhere.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-full bg-ink-900 text-white hover:bg-ink-800 transition font-medium"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded-full bg-paper-100 border border-parchment text-ink-900 hover:bg-white transition font-medium"
        >
          Go home
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
