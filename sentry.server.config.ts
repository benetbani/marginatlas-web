/**
 * Sentry — Node.js server runtime (API routes, server components).
 *
 * Same DSN as the client, different runtime context. Errors thrown
 * during SSR, in route handlers, or in server actions land here.
 *
 * WHAT A SERVER REPORT KEEPS OF THE REQUEST (plan 2026-10-10, the home reformed to ship, Task 8, fix round 8; the privacy page's
 * Sentry paragraph, SENTRY_WORDS in src/lib/legal/pro_legal.ts, says it, and he reads that text before any deploy). The Node SDK
 * adds the request to every event whatever `sendDefaultPii` says: @sentry/core's request-data integration defaults to the headers
 * AND the cookies (only the IP address follows that flag), Next hands onRequestError (src/instrumentation.ts) the raw headers, and
 * the http server integration reads up to 10 KB of any body a route handler reads and attaches it as TEXT. From launch day the
 * session cookie holds the reader's email, Vercel adds the reader's place as `x-vercel-ip-*` headers, and the contact, correction
 * and newsletter forms post names, emails and messages. A trace (5 percent of requests) is the same request again, and its root
 * span also copies the headers onto itself as `http.request.header.*` attributes, past the SDK's own filter, which lets `x-real-ip`
 * and `x-vercel-forwarded-for`, the reader's address, through. So a report and a trace leave here without the cookies, the cookie
 * header, the location headers (x-vercel-ip-* and x-vercel-id, whose first part names the edge region that served the reader), that
 * copy of the headers, and any body. The headers that stay are the rest of the request's own
 * (the browser, its language, the address it came from); the SDK already drops the address headers from the request itself.
 * tests/trust/launch_guards.test.ts hands this file an event that carries all of it, and holds the privacy page's words to it.
 */
import * as Sentry from "@sentry/nextjs";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

/** The request details no server report or trace may carry; see the header above. Mutates and returns the event. */
function keepNoCookiesPlaceOrBody<T extends Sentry.Event>(event: T): T {
  const request = event.request;
  if (request) {
    delete request.cookies;
    const headers = request.headers;
    if (headers) {
      for (const name of Object.keys(headers)) {
        const lower = name.toLowerCase();
        // x-vercel-proxied-for is an address header the SDK's own list of them (which it drops from the request) does not know.
        // x-vercel-id starts with the code of the edge region that served the reader (lhr1::...), a coarse location (cleanup round 2).
        if (lower === "cookie" || lower.startsWith("x-vercel-ip-") || lower === "x-vercel-proxied-for" || lower === "x-vercel-id") delete headers[name];
      }
    }
    // Drop the request body whole, in whatever shape the SDK holds it: the header's "any body". The SDK captures a body it read as
    // text, which cannot be searched for field names; and an object's keys that do not look like one (a form's `message`) would go
    // with the report if only the matching keys were replaced, so no key is read: the body is not kept (fix round F1, final review M1).
    delete request.data;
  }
  // A trace's root span copies the request's headers onto itself (Next's handleOnSpanStart): the same cookies and place, and the address.
  for (const attributes of [event.contexts?.trace?.data, ...(event.spans ?? []).map((span) => span.data)]) {
    for (const key of Object.keys(attributes ?? {})) {
      if (key.startsWith("http.request.header.")) delete attributes![key];
    }
  }
  return event;
}

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

    return keepNoCookiesPlaceOrBody(event);
  },

  // A trace carries the request as a report does, so it leaves by the same door.
  beforeSendTransaction(event) {
    return keepNoCookiesPlaceOrBody(event);
  },

  // Suppress noisy/expected errors.
  ignoreErrors: [
    // Aborted requests from clients navigating away
    "AbortError",
    "ECONNRESET",
  ],
});
