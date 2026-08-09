/**
 * src/lib/routing/top_level_segments.ts
 *
 * Every first URL segment a real route can occupy, other than the country
 * wildcard. GENERATED from src/app by scripts/verify_top_level_segments.mjs,
 * which fails the build if this list and the filesystem disagree. Do not hand
 * edit: add a route folder and run the gate.
 *
 * WHAT IT IS FOR, and it closes a hole the middleware documented but could not
 * close itself.
 *
 * src/middleware.ts pins a 404 on paths naming a place this site does not hold,
 * because notFound() alone cannot: a loading skeleton streams the response
 * headers before the page body runs, so by the time notFound() throws the 200
 * is already on the wire. Middleware is the only code that runs early enough.
 *
 * But it deliberately judged only two cases, and said why:
 *
 *     "Middleware runs before routing, so it cannot ask Next whether a path
 *      belongs to a real page or to the country wildcard. It must not guess."
 *
 * That was the right call with the information it had. This file is the
 * information it lacked. With the real set of top-level segments in hand, the
 * question stops being a guess: a first segment that is neither a country we
 * hold nor a route folder that exists can only ever have matched [country], and
 * [country] can only be a country.
 *
 * Measured before it was written. Of 2,847 URLs the site declares, 2,061 sit
 * under one of 195 real country codes and the remaining 786 under thirteen of
 * the names below. Zero would be caught.
 *
 * ONE COLLISION WORTH KNOWING: `og` is two letters and is not a country. It is
 * an image route. It is in this list, so it is safe, and it is the reason this
 * list is consulted BEFORE the two-letter country test rather than after.
 */

/** Static first segments that exist as route folders under src/app. */
export const TOP_LEVEL_SEGMENTS: ReadonlySet<string> = new Set([
  "about-data",
  "account",
  "admin",
  "api",
  "auth",
  "blog",
  "browse",
  "calculator",
  "check",
  "cities",
  "compare",
  "contact",
  "cookies",
  "countries",
  "coverage",
  "decide",
  "dev",
  "download",
  "embed",
  "extremes",
  "faq",
  "industries",
  "learn",
  "margin-index",
  "methodology",
  "og",
  "pricing",
  "privacy",
  "random",
  "saved",
  "signin",
  "status",
  "terms",
  "tools",
  "world",
  "you",
]);
