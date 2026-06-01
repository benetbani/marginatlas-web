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
