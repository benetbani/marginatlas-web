/**
 * Margin Atlas anti-scraping middleware.
 *
 * Three layers of defense, in order:
 *
 * 1. **AI training crawlers blocked outright** — same list as robots.ts.
 *    These don't honor robots.txt anyway; we 451 them at the edge.
 *
 * 2. **Generic bot/scraper signatures blocked** from /api/* and from
 *    deep crawl patterns. Real browsers always send a populated
 *    Accept-Language header; absence is a strong signal.
 *
 * 3. **Soft rate limit** — 60 page requests per IP per minute. Above
 *    that returns 429. State lives in-memory per Edge runtime instance,
 *    which is sufficient for the volume we expect and keeps the
 *    free-tier serverless cost at zero.
 *
 * This is defense in depth, not a wall. Anyone who really wants the
 * data can scrape it. But casual scrapers, naive LLM crawlers, and
 * accidental tool loops get caught.
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { COUNTRIES } from "@/lib/taxonomy";
import { getRegionsForCountry } from "@/lib/regions/regions-by-country";

const AI_CRAWLER_PATTERNS = [
  /gptbot/i,
  /claudebot/i,
  /anthropic-ai/i,
  /google-extended/i,
  /ccbot/i,
  /bytespider/i,
  /chatgpt-user/i,
  /perplexitybot/i,
  /cohere-ai/i,
  /facebookbot/i,
  /meta-externalagent/i,
  /diffbot/i,
  /amazonbot/i,
  /youbot/i,
  /imagesiftbot/i,
];

// Cheap signal: scrapers often skip Accept-Language AND match obvious tool UAs.
// CC.6 — only block on BOTH conditions. Brave / Firefox in strict-privacy
// modes legitimately omit Accept-Language, so we don't 403 them on that
// signal alone.
function looksLikeBareScraper(req: NextRequest): boolean {
  const ua = req.headers.get("user-agent") || "";
  const lang = req.headers.get("accept-language") || "";
  // Allow legit search bots
  if (/(googlebot|bingbot|duckduckbot|slurp|baiduspider|yandex)/i.test(ua)) {
    return false;
  }
  // Allow real browser UAs even when Accept-Language is missing (privacy modes)
  if (
    /(mozilla|firefox|safari|chrome|edg\/|brave|opera|seamonkey|chromium)/i.test(
      ua
    )
  ) {
    return false;
  }
  // No UA at all = bot
  if (!ua) return true;
  // Tool-UA + missing Accept-Language = scraper
  if (!lang && /(curl|wget|python|httpx|axios|node-fetch|libwww|java\/|go-http|ruby|perl|scrapy)/i.test(ua)) {
    return true;
  }
  return false;
}

// In-memory IP → bucket. Edge runtime keeps state per instance.
//
// Memory bound: each entry is ~80 bytes. Without a sweep, a long-lived
// Edge instance accumulates one entry per unique IP forever. At 100k
// uniques that is ~8MB; at 10M (a year of traffic) it is GB scale.
// We do a lazy sweep when the map grows past BUCKET_HIGH_WATER:
// drop every entry whose window has expired. Worst case the sweep
// touches BUCKET_HIGH_WATER entries on one request — bounded and
// cheap compared to a SIGTERM from OOM.
const BUCKET = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60_000;
const PAGE_LIMIT = 60; // requests per minute per IP
const BUCKET_HIGH_WATER = 10_000;

function sweepExpired(now: number): void {
  for (const [ip, b] of BUCKET) {
    if (now - b.windowStart > WINDOW_MS) BUCKET.delete(ip);
  }
}

function rateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  if (BUCKET.size >= BUCKET_HIGH_WATER) sweepExpired(now);
  const b = BUCKET.get(ip);
  if (!b || now - b.windowStart > WINDOW_MS) {
    BUCKET.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: PAGE_LIMIT - 1 };
  }
  b.count++;
  return { allowed: b.count <= PAGE_LIMIT, remaining: Math.max(0, PAGE_LIMIT - b.count) };
}

/* ---------------------------------------------------------------------------
 * Places this site does not hold: a real 404 instead of a soft one.
 *
 * The country and region pages both call notFound() for a slug they cannot
 * resolve, and both were answering 200 anyway. The reason is the streaming
 * shell: a loading skeleton sits above those pages, so React finishes the
 * shell and the response headers go out on the wire before the page body has
 * even run. By the time notFound() throws, the status is already sent, and
 * every wrong URL reads as a live page to a crawler. Moving the call into
 * generateMetadata does not help either: Next rethrows that error at the page
 * position inside the same boundary (see the MetadataOutlet in
 * next/dist/server/app-render/create-component-tree.js).
 *
 * Middleware is the one place that runs BEFORE any of that. It cannot render
 * the not-found page itself, but it can rewrite the request back onto the very
 * same path while pinning the status to 404. The page then renders exactly as
 * it does today, calls its own notFound(), and shows the same not-found screen.
 * Nothing about what the reader sees changes. Only the status code does.
 *
 * Scope is deliberately narrow, and the narrowness is the whole safety story.
 * Middleware runs before routing, so it cannot ask Next whether a path belongs
 * to a real page or to the country wildcard. It must not guess. Two rules it
 * can be sure of:
 *
 *   One segment, two letters, not a country. Every entry in COUNTRIES is two
 *   letters, so a two-letter slug that is missing from it can never resolve.
 *   The only two-letter route folder on this site holds children and nothing at
 *   its own root, so no real page lives at a bare two-letter path.
 *
 *   Two segments, a KNOWN country first. Once the first segment is a country we
 *   hold, the path is certainly inside the country tree, so the second segment
 *   is judged against that country's own region list.
 *
 * Everything else is left alone, on purpose. A first segment that is not two
 * letters could be any static page, and an UNKNOWN two-letter first segment
 * with a child could be a route namespace rather than a country. Both keep
 * their soft 404 rather than risk a real page answering 404.
 *
 * The two lists below are the same two the routes themselves check. Nothing new
 * is invented here, and a place that gains coverage stops 404ing on its own.
 * ------------------------------------------------------------------------- */
const COUNTRY_NAME_BY_SLUG = new Map<string, string>(
  COUNTRIES.map((c) => [c.code.toLowerCase(), c.name]),
);

/** Region slugs per country, resolved once per country per runtime instance. */
const REGION_SLUGS = new Map<string, Set<string>>();
function regionSlugsFor(countrySlug: string, countryName: string): Set<string> {
  let slugs = REGION_SLUGS.get(countrySlug);
  if (!slugs) {
    slugs = new Set(
      getRegionsForCountry(countrySlug.toUpperCase(), countryName).map(
        (r) => r.value,
      ),
    );
    REGION_SLUGS.set(countrySlug, slugs);
  }
  return slugs;
}

/**
 * True when the path names a country or a region this site does not hold, and
 * the page it routes to would therefore call notFound() anyway.
 *
 * Expects an already-canonical path: lowercase, no trailing slash. The
 * canonicalization redirect above guarantees that by the time this runs.
 */
function isPlaceWeDoNotHold(path: string): boolean {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0 || segments.length > 2) return false;

  const [countrySlug, geoSlug] = segments;
  if (!/^[a-z]{2}$/.test(countrySlug)) return false;

  const countryName = COUNTRY_NAME_BY_SLUG.get(countrySlug);

  // A two-letter slug on its own. Held countries pass; anything else cannot be
  // a country and no page sits at a bare two-letter path.
  if (geoSlug === undefined) return countryName === undefined;

  // Deeper than one segment, so the first segment has to be a country we hold
  // before this is allowed to judge the second. An unknown two-letter first
  // segment here may be a route namespace, and guessing would 404 a real page.
  if (countryName === undefined) return false;

  // The one static child of the country segment. It is a real page, not a
  // region, so it must never be judged against the region list.
  if (geoSlug === "industries") return false;

  return !regionSlugsFor(countrySlug, countryName).has(geoSlug);
}

function clientIp(req: NextRequest): string {
  // Vercel/Cloudflare set these; fallback to req.ip if available
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

// --- Plan v13 Wave 4b: split-industry redirects (auto-generated) ---
const TAXONOMY_REDIRECTS: Record<string, string> = {
  "auto-dealers-gas-stations": "auto-dealers",
  "broadcasting-telecom": "broadcasting",
  "chemical-pharmaceutical-manufacturing": "chemical-pharma-manufacturing",
  "crop-farming": "grain-farming",
  "food-beverage-manufacturing": "food-manufacturing",
  "furniture-home-goods-stores": "furniture-stores",
  "furniture-other-manufacturing": "furniture-manufacturing",
  "investment-securities": "securities-brokerage",
  "media-publishing": "news-periodical-publishing",
  "metal-products-manufacturing": "fabricated-metal-manufacturing",
  "mining-quarrying": "mining-quarrying-metals-stone",
  "passenger-transport": "transit-ground-passenger-transport",
  "postal-courier": "postal-service",
  "property-leasing-rental": "real-estate-leasing",
  "textile-apparel-manufacturing": "apparel-manufacturing",
  "wood-paper-products": "wood-products-manufacturing",
};
// --- end Plan v13 Wave 4b ---

export function middleware(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  const path = req.nextUrl.pathname;

  // -1. Apex → www canonical (Phase F server-side fallback).
  // Primary apex-to-www handling lives in Vercel DNS / project settings,
  // but if that mis-fires, this edge redirect still preserves the
  // canonical domain. 308 keeps method + body intact (vs 301 which
  // browsers may downgrade POST → GET).
  const host = req.headers.get("host") || "";
  if (host === "marginatlas.com") {
    const url = req.nextUrl.clone();
    url.host = "www.marginatlas.com";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  // 0. Canonicalization (CC.12) — redirect uppercase paths and trailing
  // slashes to the lowercase no-slash canonical form. Skip API and Next
  // internals.
  if (!path.startsWith("/api/") && !path.startsWith("/_next") && path !== "/") {
    const stripped = path.endsWith("/") ? path.slice(0, -1) : path;
    const lower = stripped.toLowerCase();
    if (lower !== path) {
      const url = req.nextUrl.clone();
      url.pathname = lower;
      return NextResponse.redirect(url, 308);
    }
  }

  // --- Plan v13 Wave 4b redirect handler ---
  // Match either /us/<geo>/<old-slug> or /industries/<old-slug>.
  // Rewrite the last URL segment to the new canonical slug.
  if (!path.startsWith("/api/") && !path.startsWith("/_next")) {
    const segments = path.split("/").filter(Boolean);
    if (segments.length > 0) {
      const last = segments[segments.length - 1];
      const target = TAXONOMY_REDIRECTS[last];
      if (target && target !== last) {
        segments[segments.length - 1] = target;
        const url = req.nextUrl.clone();
        url.pathname = "/" + segments.join("/");
        return NextResponse.redirect(url, 308);
      }
    }
  }
  // --- end Plan v13 Wave 4b redirect handler ---

  // --- Retired sector pages → /industries (308, preserves SEO equity) ---
  // Browse-by-sector was retired: /sectors and /sectors/<id> no longer
  // render. Permanently redirect both to the activity directory so the old
  // URLs never 404 and link equity flows to /industries.
  if (!path.startsWith("/api/") && !path.startsWith("/_next")) {
    if (/^\/sectors($|\/[a-z0-9_-]+$)/.test(path)) {
      const url = req.nextUrl.clone();
      url.pathname = "/industries";
      return NextResponse.redirect(url, 308);
    }
  }
  // --- end retired sector pages redirect ---

  // 1. AI crawlers — 451 Unavailable For Legal Reasons
  for (const re of AI_CRAWLER_PATTERNS) {
    if (re.test(ua)) {
      return new NextResponse("Not available to AI training crawlers.", {
        status: 451,
        headers: { "X-Robots-Tag": "noai, noimageai" },
      });
    }
  }

  // 2. Bare-scraper signatures hitting deep cell pages
  const isCellPage = /^\/[a-z]{2,3}\/[^/]+\/[^/]+$/i.test(path);
  if ((path.startsWith("/api/") || isCellPage) && looksLikeBareScraper(req)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 3. Soft rate limit on page navigation (skip _next + api assets)
  if (!path.startsWith("/_next") && !path.startsWith("/static") && !path.startsWith("/api/")) {
    const ip = clientIp(req);
    const { allowed, remaining } = rateLimit(ip);
    if (!allowed) {
      return new NextResponse("Too many requests. Slow down.", {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": String(PAGE_LIMIT),
          "X-RateLimit-Remaining": "0",
        },
      });
    }
    // 3b. A country or region we do not hold. Rewritten onto itself so the
    // page renders and shows its own not-found screen, with the status pinned
    // before the streaming shell can flush a 200. Returned here, above the
    // edge-cache header below, so a wrong URL is never held at the CDN for six
    // hours; the moment coverage lands, the next request resolves normally.
    if (isPlaceWeDoNotHold(path)) {
      return NextResponse.rewrite(req.nextUrl, {
        status: 404,
        request: { headers: withPathname(req, path) },
      });
    }

    const res = NextResponse.next({ request: { headers: withPathname(req, path) } });
    res.headers.set("X-RateLimit-Limit", String(PAGE_LIMIT));
    res.headers.set("X-RateLimit-Remaining", String(remaining));
    // Plan v17 Phase 4.3 — edge-cache rendered HTML for cacheable routes.
    // Vercel honors `s-maxage` at the CDN layer even when the underlying
    // route is `force-dynamic`. First request fills the cache; subsequent
    // requests serve from edge within s-maxage. `stale-while-revalidate`
    // keeps responses fast even after the window expires.
    if (CACHEABLE_PATTERNS.some((re) => re.test(path))) {
      res.headers.set(
        "Cache-Control",
        "public, s-maxage=21600, stale-while-revalidate=86400",
      );
    }
    return res;
  }

  return NextResponse.next({ request: { headers: withPathname(req, path) } });
}

// Paths the edge should cache for 6h with 24h stale. Excludes
// /api/, /random (intentionally rotating), /saved (per-user),
// /you and /compare (client-state-heavy).
//
// At traffic scale the single largest perf win is edge-cache hit
// rate. Every URL pattern here that we miss costs a function
// invocation per request; every one we add saves that cost on every
// hit after the first.
const CACHEABLE_PATTERNS: RegExp[] = [
  /^\/$/,
  /^\/about-data$/,
  /^\/browse$/,
  /^\/blog($|\/)/,
  /^\/cities($|\/[a-z0-9-]+($|\/neighborhoods)$)/,
  /^\/coverage($|\/)/,
  /^\/industries($|\/[a-z0-9-]+$)/,
  /^\/learn($|\/[a-z0-9-]+$)/,
  /^\/world$/,
  /^\/pricing$/,
  /^\/calculator$/,
  /^\/status$/,
  /^\/methodology($|\/[a-z0-9-]+$)/,
  // /{country}
  /^\/[a-z]{2}$/,
  // /{country}/{geo}
  /^\/[a-z]{2}\/[a-z0-9-]+$/,
  // /{country}/{geo}/{industry}
  /^\/[a-z]{2}\/[a-z0-9-]+\/[a-z0-9-]+$/,
  // /{country}/{geo}/{industry}/{sub} — neighborhood cell page
  /^\/[a-z]{2}\/[a-z0-9-]+\/[a-z0-9-]+\/[a-z0-9-]+$/,
  // /{country}/{geo}/industries
  /^\/[a-z]{2}\/[a-z0-9-]+\/industries$/,
  // /{country}/industries
  /^\/[a-z]{2}\/industries$/,
  // /embed/{country}/{geo}/{industry}
  /^\/embed\/[a-z]{2}\/[a-z0-9-]+\/[a-z0-9-]+$/,
];

function withPathname(req: NextRequest, path: string): Headers {
  const headers = new Headers(req.headers);
  headers.set("x-pathname", path);
  return headers;
}

export const config = {
  // Run on everything except static assets + favicons + Next internals.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico|woff2|woff)).*)",
  ],
};
