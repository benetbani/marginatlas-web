"use client";

/**
 * Global error boundary — catches errors thrown inside the root layout
 * (which `error.tsx` can't see, because that one runs *inside* the layout).
 *
 * Sentry recommends having this file to capture React render errors that
 * escape the layout. It must define <html> and <body> itself because the
 * normal layout isn't available at this point, so it styles itself inline:
 * the root layout's stylesheet is not a promise here.
 *
 * NO CREAM AND NO BROWN (plan 2026-10-10, the home reformed to ship, Task 8; the ship audit's 5.10): it painted the banned cream
 * #FBF9F4 and a brown #9B4F1F, and said "We've been notified", which is true only where Sentry is switched on. The values below are
 * the spine's own (--c-ink #1b1b1a, --c-ink2 #565654, the card's white), written out because no token reaches this page; the words
 * claim nothing the page cannot know.
 */
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          background: "white",
          color: "#1b1b1a",
          padding: "4rem 1.5rem",
          margin: 0,
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h1
            style={{
              margin: 0,
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            The site broke
          </h1>
          <p style={{ marginTop: 12, lineHeight: 1.6, color: "#565654" }}>
            Something went wrong before the page could draw. Try reloading it.
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              marginTop: 24,
              padding: "0.75rem 1rem",
              borderRadius: 999,
              background: "#1b1b1a",
              color: "white",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            Go home
          </a>
          {error.digest ? (
            <p
              style={{
                marginTop: 24,
                fontSize: 12,
                color: "#565654",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              Error reference {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
