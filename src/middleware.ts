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
const BUCKET = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60_000;
const PAGE_LIMIT = 60; // requests per minute per IP

function rateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const b = BUCKET.get(ip);
  if (!b || now - b.windowStart > WINDOW_MS) {
    BUCKET.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: PAGE_LIMIT - 1 };
  }
  b.count++;
  return { allowed: b.count <= PAGE_LIMIT, remaining: Math.max(0, PAGE_LIMIT - b.count) };
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
    const res = NextResponse.next({ request: { headers: withPathname(req, path) } });
    res.headers.set("X-RateLimit-Limit", String(PAGE_LIMIT));
    res.headers.set("X-RateLimit-Remaining", String(remaining));
    return res;
  }

  return NextResponse.next({ request: { headers: withPathname(req, path) } });
}

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
