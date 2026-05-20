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
    sitemap: "https://www.marginatlas.com/sitemap.xml",
    host: "https://www.marginatlas.com",
  };
}
