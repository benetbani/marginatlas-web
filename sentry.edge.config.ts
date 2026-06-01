/**
 * Sentry — Edge runtime (middleware.ts, edge API routes).
 *
 * Edge runtime is V8 isolates, not full Node — Sentry needs its own
 * init here because the server config can't run.
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
