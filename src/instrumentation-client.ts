/**
 * Sentry — browser client init (Next.js 15 native client instrumentation).
 *
 * Next 15.3+ auto-loads `src/instrumentation-client.ts` on the client at
 * startup. This is the SAFE way to wire Sentry's browser SDK WITHOUT the
 * `withSentryConfig` webpack wrapper, which previously caused a
 * "RangeError: Maximum call stack size exceeded" on every SSR request under
 * Next 15.5 + @sentry/nextjs and was deliberately disabled (see the long note
 * in next.config.js). No build-config change is needed for this file to run, so
 * the deploy can never break from it.
 *
 * Tradeoff vs the wrapper: no automatic source-map upload, so client stack
 * frames are minified. Errors, messages, and Replay still work. Re-enabling the
 * wrapper for source maps is a separate, carefully-tested task (see
 * docs/handoff for the root-cause investigation plan).
 *
 * The DSN is a NEXT_PUBLIC_ var on purpose: Sentry DSNs are write-only ingest
 * keys designed to ship in the client bundle, not secrets.
 */
import * as Sentry from "@sentry/nextjs";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: DSN,
  enabled: Boolean(DSN) && process.env.NODE_ENV === "production",

  // Capture all errors (low volume for a content site).
  sampleRate: 1.0,
  // Performance traces sampled lightly to stay inside the free tier (10k
  // spans/mo). Low for a static content site.
  tracesSampleRate: 0.05,

  // Session Replay removed: it is a paid feature. After the trial ends this
  // site is on the free tier, where Replay does not ingest, so shipping the
  // replay integration would only add bundle weight and dead recording work.
  // Re-add Sentry.replayIntegration({...}) + replaysOnErrorSampleRate if a
  // paid plan is taken later.

  sendDefaultPii: false,

  ignoreErrors: [
    "AbortError",
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    "Non-Error promise rejection captured",
  ],

  beforeSend(event) {
    if (event.request?.data && typeof event.request.data === "object") {
      const data = event.request.data as Record<string, unknown>;
      for (const key of Object.keys(data)) {
        if (/(email|name|password|phone|address|ssn|token|secret|key)/i.test(key)) {
          data[key] = "[scrubbed]";
        }
      }
    }
    return event;
  },
});

// Next-native client navigation instrumentation hook for @sentry/nextjs.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
