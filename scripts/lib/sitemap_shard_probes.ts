/**
 * scripts/lib/sitemap_shard_probes.ts
 *
 * What a deployed site must answer for each sitemap shard, read from the one table (SITEMAP_FAMILIES in
 * src/lib/seo/sitemap_families.ts; P1-E of the page architecture, 2026-10-09), for the post-deploy smoke test
 * (scripts/audit/deploy_smoke_test.ts):
 *
 *   listed    a sitemap over 1 KB with addresses in it
 *   empty     a valid empty urlset, by design since the families split: the XML declaration and a urlset in the sitemap namespace
 *             that holds nothing (Next writes 110 characters)
 *   reserved  not asked: a later phase's family, its id not written yet
 *
 * The rows come from the table, so a shard listed, emptied or reserved there changes the smoke test with no edit here.
 */
import { SITEMAP_FAMILIES, type SitemapShard } from "../../src/lib/seo/sitemap_families";

/** A listed shard answers more than this many characters: the smoke test's rule since its first version, one KB. */
export const LISTED_OVER = 1024;

const TABLE = "SITEMAP_FAMILIES (src/lib/seo/sitemap_families.ts)";

/** A valid empty sitemap: the XML declaration, then a urlset in the sitemap namespace that holds nothing, not even a comment. */
const EMPTY_URLSET = /^\s*<\?xml\b[^>]*\?>\s*<urlset\b[^>]*\bxmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"[^>]*>\s*<\/urlset>\s*$/;
export const isEmptyUrlset = (body: string): boolean => EMPTY_URLSET.test(body);

/** A sitemap that lists something: over one KB, a urlset, at least one address. */
export const isListedSitemap = (body: string): boolean => body.length > LISTED_OVER && /<urlset\b/.test(body) && /<loc>/.test(body);

/** One row of the smoke test: the address asked, the check on the answer, and the remedy a failure prints. */
export type ShardProbe = {
  name: string;
  url: string;
  check: (status: number, headers: Headers, body: string) => boolean;
  remedy: string;
};

/** The probes the table asks for: one per listed or empty shard, none for a reserved one. */
export function shardProbes(shards: readonly SitemapShard[] = SITEMAP_FAMILIES): ShardProbe[] {
  const out: ShardProbe[] = [];
  for (const s of shards) {
    if (s.state === "reserved") continue;
    const url = `/sitemap/${s.id}.xml`;
    if (s.state === "listed") {
      out.push({
        name: `Sitemap shard ${s.id} is listed (${s.holds}): over 1 KB`,
        url,
        check: (status, _headers, body) => status === 200 && isListedSitemap(body),
        remedy: `shard ${s.id} is listed in ${TABLE}, so the deploy must answer a sitemap over 1 KB with addresses in it: run this from the commit that was deployed, then check the shard's builder in src/app/sitemap.ts, or change the row in the table if the shard should not be listed`,
      });
    } else {
      out.push({
        name: `Sitemap shard ${s.id} answers empty (${s.holds}): a valid empty urlset`,
        url,
        check: (status, _headers, body) => status === 200 && isEmptyUrlset(body),
        remedy: `shard ${s.id} is empty in ${TABLE}, so the deploy must answer a valid empty urlset with no address in it: run this from the commit that was deployed, then check src/app/sitemap.ts (only a listed row writes addresses), or change the row in the table if the shard should list pages`,
      });
    }
  }
  return out;
}
