import type { MetadataRoute } from "next";

/**
 * robots.txt policy.
 *
 * - Major search engines (Google, Bing, DuckDuckGo) are allowed.
 * - AI TRAINING crawlers are blocked. We don't want our work feeding
 *   competitors' models for free.
 * - AI ANSWERING agents are allowed. See below.
 * - API and internal routes disallowed for everyone.
 *
 * THE SPLIT, ratified by the founder 2026-08-01, reversing a blanket block.
 *
 * The old list treated two different things as one. A harvester like GPTBot or
 * CCBot crawls broadly to build a training corpus, and nothing comes back. A
 * fetcher like ChatGPT-User or PerplexityBot requests one page because a person
 * has just asked a question about it, and the answer cites the source.
 *
 * Blocking the second kind does not protect the work, it only removes us from
 * the answer. This site exists to answer "what does a cafe in Lisbon actually
 * earn", and that question is increasingly typed into an assistant rather than a
 * search box. Blocked, we are not the source it reads; someone less careful is.
 *
 * So: harvesters stay blocked, fetchers are let in. The line is whether a human
 * is waiting on the other end of the request.
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
      // Answering agents: a person asked a question and one page is being
      // fetched to answer it. Same access as a search engine, and the same
      // internals withheld.
      {
        userAgent: ["ChatGPT-User", "PerplexityBot", "OAI-SearchBot"],
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin"],
      },
      // Training harvesters: broad crawls that feed a corpus and cite nothing.
      {
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
          "CCBot",
          "Bytespider",
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
    // Next 15's generateSitemaps emits per-id
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
