import type { MetadataRoute } from "next";
import { ANSWERING_AGENTS, HARVESTERS, INTERNALS, SEARCH_ENGINES } from "@/lib/seo/crawlers";

/**
 * robots.txt policy.
 *
 * - Search engines (Google, Bing, DuckDuckGo, Yahoo) are let in.
 * - AI answering agents are let in: a person asked a question and one page is fetched to answer it.
 * - AI training harvesters are blocked, here and with a 451 at the edge (src/middleware.ts).
 * - The internals (/api/, /_next/, /admin, /dev/) are withheld from every group let in.
 *
 * THE SPLIT, ratified by the founder 2026-08-01, reversing a blanket block. A harvester like GPTBot or CCBot crawls broadly to
 * build a training corpus, and nothing comes back. A fetcher like ChatGPT-User or Claude-User requests one page because a person
 * has just asked a question about it, and the answer cites the source. Blocking the second kind does not protect the work, it
 * only removes us from the answer. The line is whether a human is waiting on the other end of the request.
 *
 * ONE LIST SINCE 2026-10-09 (P1-F of the page architecture, his "Adopt the plan"): the groups come from src/lib/seo/crawlers.ts,
 * which the edge's 451 list reads too. Google-Extended joined the answering agents; Claude-SearchBot and Claude-User are named
 * there instead of falling through to "*".
 *
 * /dev/ IS THE WORKSHOP AND IT IS NOT THE SHOP, added 2026-08-09: prototypes and founder review surfaces, served at 200 and never
 * advertised to a search engine.
 *
 * Pinned by tests/app/robots.test.ts, which also refuses to let the internals already withheld quietly drop out of a rewritten
 * list.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: [...SEARCH_ENGINES], allow: "/", disallow: [...INTERNALS] },
      { userAgent: [...ANSWERING_AGENTS], allow: "/", disallow: [...INTERNALS] },
      { userAgent: [...HARVESTERS], disallow: "/" },
      { userAgent: "*", allow: "/", disallow: [...INTERNALS], crawlDelay: 2 },
    ],
    /* Next 15's generateSitemaps emits per-id sub-sitemaps at /sitemap/[id].xml, not the conventional /sitemap.xml, so every
       shard is listed explicitly or a crawler never learns it exists. Shard 5 is absent on purpose: the neighbourhood pages were
       withdrawn from the index on the founder's instruction, 2026-08-08. */
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
