/**
 * Sentry — Node.js server runtime (API routes, server components).
 *
 * Same DSN as the client, different runtime context. Errors thrown
 * during SSR, in route handlers, or in server actions land here.
 */
import * as Sentry from "@sentry/nextjs";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: DSN,
  enabled: Boolean(DSN) && process.env.NODE_ENV === "production",

  sampleRate: 1.0,
  tracesSampleRate: 0.1,

  sendDefaultPii: false,

  beforeSend(event) {
    // Drop any captured request body that looks form-shaped.
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

  // Suppress noisy/expected errors.
  ignoreErrors: [
    // Aborted requests from clients navigating away
    "AbortError",
    "ECONNRESET",
  ],
});
