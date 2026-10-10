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
 *
 * SENTRY STARTS AFTER THE PAGE, NOT BEFORE IT (plan 2026-10-10, the home
 * reformed to ship, Task 7; the ship audit's 3.4). `Sentry.init` ran at
 * startup, before hydration, for every visitor. It now runs when the browser is
 * first idle, and within four seconds at the latest (Safari has no
 * requestIdleCallback and takes the next tick). An error in those first moments
 * is the one it can miss. What it sends is unchanged, and the privacy page
 * names it (SENTRY_WORDS in src/lib/legal/pro_legal.ts, which he reads before
 * any deploy): every error and 5 percent of traces, each with the page's
 * address, the address the reader came from, a trail of the last 20 clicks, page
 * changes, requests and console lines (`maxBreadcrumbs: 20`; the SDK's default is
 * 100), and the browser's language and time zone. `sendDefaultPii: false`
 * tells Sentry not to infer an IP address and to attach no user; the browser
 * SDK's default integrations read no cookies (httpClientIntegration is the one
 * that does, and it is not added); no replay is recorded and nothing calls setUser. What
 * is NOT promised is that a report holds nothing personal: anything written in
 * an address or an error message goes with it. tests/trust/launch_guards.test.ts
 * holds these facts to the words.
 */
import * as Sentry from "@sentry/nextjs";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

function startSentry(): void {
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

    // The trail a report carries: the SDK keeps 100 breadcrumbs by default (clicks, page changes, requests, console lines), more than
    // the privacy page's "a trail of your last clicks, page changes, requests and console lines" suggests. Twenty is a trail
    // (cleanup round 2; tests/trust/launch_guards.test.ts pins the number and the words).
    maxBreadcrumbs: 20,

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
}

if (typeof window !== "undefined") {
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(startSentry, { timeout: 4000 });
  else window.setTimeout(startSentry, 1);
}

// Next-native client navigation instrumentation hook for @sentry/nextjs.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
