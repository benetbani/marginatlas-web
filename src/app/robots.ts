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
 *
 * /dev/ IS THE WORKSHOP AND IT IS NOT THE SHOP, added 2026-08-09. 58 of this
 * repository's 113 page routes live under src/app/dev. They are prototypes and
 * founder review surfaces, they are served at 200 in production, and until this
 * line they were crawlable: /dev/cell2 alone is 202KB of public HTML naming an
 * older generation of a page that ships elsewhere. Nothing about them is
 * secret, so a 200 is fine; advertising them to a search engine is not.
 *
 * Pinned by tests/app/robots.test.ts, which also refuses to let the internals
 * already withheld quietly drop out of a rewritten list.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Major search engines — welcome with normal access
      {
        userAgent: ["Googlebot", "Bingbot", "DuckDuckBot", "Slurp"],
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin", "/dev/"],
      },
      // Answering agents: a person asked a question and one page is being
      // fetched to answer it. Same access as a search engine, and the same
      // internals withheld.
      {
        userAgent: ["ChatGPT-User", "PerplexityBot", "OAI-SearchBot"],
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin", "/dev/"],
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
        disallow: ["/api/", "/_next/", "/admin", "/dev/"],
        crawlDelay: 2,
      },
    ],
    /* Next 15's generateSitemaps emits per-id sub-sitemaps at
       /sitemap/[id].xml, not the conventional /sitemap.xml, so every shard is
       listed explicitly or a crawler never learns it exists.

       THIS LIST STOPPED AT 4 UNTIL 2026-08-09 AND EIGHT SHARDS ARE REGISTERED.
       Shard 6 is the cities (525 URLs) and shard 7 the learn corpus (55): 580
       live, distinct, indexable pages that this file did not mention. The same
       class of failure as the empty cell shards, from the opposite direction ,
       there the shard was empty, here the shard is full and undeclared.

       Shard 5 is absent ON PURPOSE and must stay absent: the 25,320
       neighbourhood pages were withdrawn from the index on the founder's
       instruction, 2026-08-08. Adding it back re-advertises them. */
    sitemap: [
      "https://www.marginatlas.com/sitemap/0.xml",
      "https://www.marginatlas.com/sitemap/1.xml",
      "https://www.marginatlas.com/sitemap/2.xml",
      "https://www.marginatlas.com/sitemap/3.xml",
      "https://www.marginatlas.com/sitemap/4.xml",
      "https://www.marginatlas.com/sitemap/6.xml",
      "https://www.marginatlas.com/sitemap/7.xml",
    ],
    host: "https://www.marginatlas.com",
  };
}
