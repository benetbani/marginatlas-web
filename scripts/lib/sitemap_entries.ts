/**
 * scripts/lib/sitemap_entries.ts
 *
 * Every entry the sitemap shards write, asked of src/app/sitemap.ts itself, offline (P1-E of the page architecture, 2026-10-09):
 * since the families split no listed shard reads the database, so the gates indexable and sitemap-families can read what the
 * sitemaps list without the network or a secret.
 */
import sitemap from "../../src/app/sitemap";
import { listedShardIds } from "../../src/lib/seo/sitemap_families";

export type SitemapEntry = { shard: number; path: string; url: string; lastModified: unknown };

/** The entries of the given shards (the listed ones by default), each with its shard and its path. */
export async function sitemapEntries(ids: readonly number[] = listedShardIds()): Promise<SitemapEntry[]> {
  const out: SitemapEntry[] = [];
  for (const id of ids) {
    for (const e of await sitemap({ id })) out.push({ shard: id, path: new URL(e.url).pathname, url: e.url, lastModified: e.lastModified });
  }
  return out;
}
