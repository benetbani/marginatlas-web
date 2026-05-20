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
  tracesSampleRate: 0.1,

  sendDefaultPii: false,
});
