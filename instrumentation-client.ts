/**
 * Sentry — browser-side error monitoring.
 *
 * Next.js 15 + Turbopack convention: a top-level instrumentation-client.ts
 * (replaces the deprecated sentry.client.config.ts pattern) runs once on
 * page load before any app code.
 *
 * Sample policy:
 *   errors  → 1.0  (catch everything that breaks)
 *   traces  → 0.1  (sample 10% of perf transactions)
 *
 * PII scrubbing: beforeSend strips email/name/password fields off any
 * captured event so form contents never leak into Sentry. We monitor
 * shape of errors, not user content.
 */
import * as Sentry from "@sentry/nextjs";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: DSN,
  enabled: Boolean(DSN) && process.env.NODE_ENV === "production",

  // Errors: catch everything.
  sampleRate: 1.0,
  // Perf traces: sample 10%.
  tracesSampleRate: 0.1,

  // Session replay disabled by default — opt in later if needed.
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // Don't auto-capture PII from headers, URLs, request bodies.
  sendDefaultPii: false,

  // Scrub form-field PII before send.
  beforeSend(event) {
    if (event.request?.data && typeof event.request.data === "object") {
      const data = event.request.data as Record<string, unknown>;
      for (const key of Object.keys(data)) {
        if (/(email|name|password|phone|address|ssn|token|secret)/i.test(key)) {
          data[key] = "[scrubbed]";
        }
      }
    }
    // Strip query strings on URLs that look like search/calculator forms.
    if (event.request?.url) {
      try {
        const u = new URL(event.request.url);
        if (u.searchParams.has("q") || u.searchParams.has("email")) {
          u.search = "";
          event.request.url = u.toString();
        }
      } catch {
        // Ignore malformed URLs.
      }
    }
    return event;
  },

  // Ignore noisy errors that aren't actionable.
  ignoreErrors: [
    // Browser extensions
    /extension:\//i,
    /moz-extension:\//i,
    // Network noise
    "Network request failed",
    "Failed to fetch",
    "Load failed",
    // ResizeObserver loop warnings — harmless
    /ResizeObserver loop/i,
    // Hydration warnings that don't break anything
    "Hydration failed",
  ],
});

// Hook App Router navigation events into Sentry's tracing. Lets Sentry
// produce a span per route change so we can see perf per page navigation.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
