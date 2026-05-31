/**
 * Next.js 15 instrumentation entry point.
 *
 * Runs once per runtime (nodejs / edge) at startup. Sentry uses this
 * to wire server-side and edge-side error capture.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

// Capture errors that escape React's error boundaries on the server.
export { captureRequestError as onRequestError } from "@sentry/nextjs";
