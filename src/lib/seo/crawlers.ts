/**
 * src/lib/seo/crawlers.ts
 *
 * WHO MAY READ THE SITE: ONE LIST FOR robots.txt AND THE EDGE (P1-F of the page architecture, 2026-10-09; his "Adopt the plan",
 * with Google-Extended allowed). The founder's split of 2026-08-01 stands: a harvester crawls to build a corpus and cites
 * nothing; an answering agent fetches one page because a person asked, and the answer names its source. src/app/robots.ts
 * writes these groups and src/middleware.ts answers 451 to every harvester, from these same lists, so a crawler is never told
 * one thing and handed another.
 *
 * Google-Extended moved to the answering agents on 2026-10-09: Google says the token governs AI grounding beyond Search as well
 * as training, so blocking it was a choice about more than training. No request carries that token (robots.txt alone reads it),
 * so it was never the edge's to refuse. Claude-SearchBot and Claude-User are named rather than left to the generic group;
 * ClaudeBot, Anthropic's harvester, stays blocked.
 */

/** Search engines: every page a person may read, the internals withheld. */
export const SEARCH_ENGINES: readonly string[] = ["Googlebot", "Bingbot", "DuckDuckBot", "Slurp"];

/** Answering agents: one page fetched because a person asked; the same access as a search engine. */
export const ANSWERING_AGENTS: readonly string[] = ["ChatGPT-User", "PerplexityBot", "OAI-SearchBot", "Claude-SearchBot", "Claude-User", "Google-Extended"];

/** Training harvesters: blocked from everything in robots.txt and answered 451 at the edge. The test for adding a name: does a
 *  person wait on the other end of the request. If yes, it does not belong here. */
export const HARVESTERS: readonly string[] = [
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "CCBot",
  "Bytespider",
  "cohere-ai",
  "FacebookBot",
  "Meta-ExternalAgent",
  "Diffbot",
  "Amazonbot",
  "YouBot",
  "ImagesiftBot",
];

/** What every group let in is kept out of: the API, Next's own files, the admin and the workshop (/dev/, 2026-08-09). */
export const INTERNALS: readonly string[] = ["/api/", "/_next/", "/admin", "/dev/"];
