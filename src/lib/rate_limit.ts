/**
 * src/lib/rate_limit.ts
 *
 * Per-IP, per-key in-memory rate limiter for API routes that the
 * page-level middleware deliberately excludes (it skips /api/* so
 * /api/cell-lookup, the JSON endpoint serving the /compare page,
 * isn't throttled like a page navigation).
 *
 * The middleware's coarse 60/min page limit is the right default
 * for page reads. Writes (/api/correction, /api/newsletter) and
 * expensive reads (/api/export-csv) need tighter, per-route caps
 * so a script can't drain the function-invocation budget. This
 * module is what those routes call.
 *
 * Architecture-audit security pass (2026-05-27).
 *
 * State: one Map per `key` (the route's logical name), keyed by IP.
 * Bounded by HIGH_WATER so a single Edge runtime instance can't
 * grow unboundedly under unique-IP traffic — same pattern as
 * src/middleware.ts BUCKET.
 *
 * Usage:
 *   import { checkRateLimit, clientIp } from "@/lib/rate_limit";
 *   const ip = clientIp(req);
 *   const r = checkRateLimit("newsletter", ip, { limit: 10, windowMs: 60_000 });
 *   if (!r.allowed) return new NextResponse("Too many requests", { status: 429 });
 */
import type { NextRequest } from "next/server";

type Bucket = { count: number; windowStart: number };
type RouteState = Map<string, Bucket>;

const ROUTES = new Map<string, RouteState>();
const HIGH_WATER = 10_000;

export function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function sweepExpired(state: RouteState, windowMs: number, now: number): void {
  for (const [ip, b] of state) {
    if (now - b.windowStart > windowMs) state.delete(ip);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
};

export function checkRateLimit(
  key: string,
  ip: string,
  opts: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  let state = ROUTES.get(key);
  if (!state) {
    state = new Map<string, Bucket>();
    ROUTES.set(key, state);
  }
  if (state.size >= HIGH_WATER) sweepExpired(state, opts.windowMs, now);
  const b = state.get(ip);
  if (!b || now - b.windowStart > opts.windowMs) {
    state.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: opts.limit - 1, retryAfter: 0 };
  }
  b.count++;
  const allowed = b.count <= opts.limit;
  return {
    allowed,
    remaining: Math.max(0, opts.limit - b.count),
    retryAfter: allowed ? 0 : Math.ceil((opts.windowMs - (now - b.windowStart)) / 1000),
  };
}

/**
 * Constant-time string equality. Use for admin keys, API tokens,
 * and any other secret comparison. The standard `===` operator
 * short-circuits on the first mismatching character, leaking the
 * compared prefix length via response timing — a theoretical
 * vector at scale.
 */
export function timingSafeEqualString(a: string, b: string): boolean {
  // Different lengths are immediately not-equal, but the comparison
  // itself is constant-time over the maximum of the two lengths to
  // avoid leaking length difference via timing.
  const max = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < max; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}
