import type { MetadataRoute } from "next";

/**
 * robots.txt policy:
 *
 * - Major search engines (Google, Bing, DuckDuckGo) are allowed.
 * - AI training crawlers are explicitly blocked. We don't want our work
 *   feeding competitors' models for free.
 * - API and internal routes disallowed for everyone.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Major search engines — welcome with normal access
      {
        userAgent: ["Googlebot", "Bingbot", "DuckDuckBot", "Slurp"],
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin"],
      },
      // Block known AI training crawlers
      {
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
          "CCBot",
          "Bytespider",
          "ChatGPT-User",
          "PerplexityBot",
          "cohere-ai",
          "FacebookBot",
          "Meta-ExternalAgent",
          "Diffbot",
        ],
        disallow: "/",
      },
      // Generic fallback — allow with rate limit
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin"],
        crawlDelay: 2,
      },
    ],
    // Plan v24 Block 11 — Next 15's generateSitemaps emits per-id
    // sub-sitemaps at /sitemap/[id].xml, not the conventional
    // /sitemap.xml. List every shard explicitly so crawlers can
    // discover the full URL inventory.
    sitemap: [
      "https://www.marginatlas.com/sitemap/0.xml",
      "https://www.marginatlas.com/sitemap/1.xml",
      "https://www.marginatlas.com/sitemap/2.xml",
      "https://www.marginatlas.com/sitemap/3.xml",
      "https://www.marginatlas.com/sitemap/4.xml",
    ],
    host: "https://www.marginatlas.com",
  };
}
