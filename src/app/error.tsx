"use client";

/**
 * Root error boundary (Track CC.9).
 *
 * Catches errors anywhere in the app tree that escape page-level boundaries and draws a plain recovery card: what happened, a
 * retry, and a way home. WHAT IT REPLACES, said truly (plan 2026-10-10, the home reformed to ship, Task 8; the ship audit's 5.10):
 * this boundary sits under the root layout and above every route group, and the site's chrome is drawn per page since 2026-08-09
 * (src/components/SiteChrome.tsx), so when it catches an error the bar and the footer go with the page. It claimed the layout's
 * chrome would survive an error, which was true only before that date. Spine tokens only; sentence case (it printed its kicker in
 * tracked capitals, in clay).
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
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--c-ink)]">
        This page broke
      </h1>
      <p className="mt-3 text-[var(--c-ink2)] leading-relaxed">
        Something went wrong while drawing it. Try again, or go home.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <button
          onClick={() => reset()}
          className="min-h-11 px-4 rounded-full bg-[var(--c-ink)] text-white hover:bg-[var(--c-ink2)] transition-colors font-medium"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-11 items-center px-4 rounded-full border border-[var(--c-line-strong)] bg-white text-[var(--c-ink)] hover:border-[var(--c-ink2)] transition-colors font-medium"
        >
          Go home
        </Link>
      </div>
      {error.digest ? (
        <p className="mt-6 text-xs text-[var(--c-muted)] font-mono">
          Error reference {error.digest}
        </p>
      ) : null}
    </div>
  );
}
