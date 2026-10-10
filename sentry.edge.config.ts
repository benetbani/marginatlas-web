/**
 * Sentry — Edge runtime (middleware.ts, edge API routes).
 *
 * Edge runtime is V8 isolates, not full Node — Sentry needs its own
 * init here because the server config can't run.
 *
 * NO REQUEST SCRUB HERE, ON PURPOSE (plan 2026-10-10, the home reformed to ship, Task 8, fix round 8): with `sendDefaultPii: false`
 * the edge SDK does not add the request-data integration (@sentry/vercel-edge's getDefaultIntegrations adds it only when that flag
 * is true), so a report from here holds no headers, no cookies and no body, and there is nothing to drop. The Node SDK adds all of
 * them whatever the flag says, which is why sentry.server.config.ts drops them. tests/trust/launch_guards.test.ts holds this file
 * to `sendDefaultPii: false` and to no requestDataIntegration: if either ever changes, copy the server config's scrub here first,
 * because the privacy page says a report from our servers is without cookies or location.
 */
import * as Sentry from "@sentry/nextjs";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: DSN,
  enabled: Boolean(DSN) && process.env.NODE_ENV === "production",

  sampleRate: 1.0,
  // Free tier = 10k spans/mo. Static content site, low SSR volume.
  tracesSampleRate: 0.05,

  sendDefaultPii: false,

  beforeSend(event, hint) {
    // Filter Next 15's internal Dynamic Server Usage signal — it's not
    // a user-facing error, it's the framework's way of telling itself
    // to render dynamically. Sentry sees the throw and reports it.
    const error = hint?.originalException;
    const message = error instanceof Error ? error.message : String(error);
    if (
      message.includes("Dynamic server usage") ||
      message.includes("couldn't be rendered statically")
    ) {
      return null;
    }
    return event;
  },
});
