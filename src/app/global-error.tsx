"use client";

/**
 * Global error boundary — catches errors thrown inside the root layout
 * (which `error.tsx` can't see, because that one runs *inside* the layout).
 *
 * Sentry recommends having this file to capture React render errors that
 * escape the layout. It must define <html> and <body> itself because the
 * normal layout isn't available at this point.
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
          background: "#FBF9F4",
          color: "#000000",
          padding: "4rem 1.5rem",
          margin: 0,
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "#9B4F1F",
              fontWeight: 500,
            }}
          >
            Hit a snag
          </div>
          <h1
            style={{
              marginTop: 8,
              fontSize: "2rem",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            That didn&apos;t render right.
          </h1>
          <p style={{ marginTop: 12, lineHeight: 1.6, color: "#4A4744" }}>
            Something at the root of the app threw an error. We&apos;ve been
            notified. Try reloading.
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              marginTop: 24,
              padding: "0.5rem 1rem",
              borderRadius: 999,
              background: "#000000",
              color: "#FBF9F4",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            Reload home
          </a>
          {error.digest ? (
            <p
              style={{
                marginTop: 24,
                fontSize: 12,
                color: "rgba(74, 71, 68, 0.6)",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              Error ref: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
