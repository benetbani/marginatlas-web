/**
 * src/lib/seo/sitemap_families.ts
 *
 * THE SITEMAPS BY FAMILY (P1-E of the page architecture, 2026-10-09; docs/superpowers/specs/2026-10-09-page-architecture-design.md
 * in the design repo, section 4a): one row per shard, read by src/app/sitemap.ts (which shards it writes), src/app/robots.ts
 * (which it lists) and scripts/gen_served_files.ts (which addresses the edge serves), so each shard Search Console reports on is
 * one family, and robots.txt and the sitemaps cannot disagree. The gate sitemap-families holds every listed address.
 *
 * listed    written and listed in robots.txt; every address one its family's policy indexes
 * empty     still answered, with no address, and listed nowhere: a shard a search console already holds reads as empty until he
 *           removes it there (the spec's section 6, his task 2)
 * reserved  a later phase's family: never written yet, its id never reused
 */
import type { Family } from "@/lib/seo/indexable";

export type ShardState = "listed" | "empty" | "reserved";
export type SitemapShard = { id: number; family: Family | "retired"; state: ShardState; holds: string };

export const SITEMAP_FAMILIES: readonly SitemapShard[] = [
  { id: 0, family: "upper", state: "listed", holds: "the home, the static pages, the countries, their how-to pages and the industry pages" },
  { id: 1, family: "trade-in-place", state: "empty", holds: "the United States trade pages named by a census description, noindex since 2026-10-09" },
  { id: 2, family: "trade-in-place", state: "empty", holds: "the regional trade pages, none at its floor on 2026-10-09" },
  { id: 3, family: "coverage", state: "listed", holds: "the coverage scorecards" },
  { id: 4, family: "hub", state: "empty", holds: "the region industries hubs, noindex since 2026-10-09" },
  { id: 5, family: "district-trade", state: "empty", holds: "the district trade pages, out of the index since 2026-08-08" },
  { id: 6, family: "city", state: "listed", holds: "the city pages, the UK neighbourhood pages and the city comparisons" },
  { id: 7, family: "article", state: "listed", holds: "the articles: the blog and the learn pages" },
  { id: 8, family: "trade-in-place", state: "listed", holds: "London's trade pages" },
  { id: 9, family: "trade-country", state: "reserved", holds: "the trade pages per country (Phase 3)" },
  { id: 10, family: "where-to-open", state: "reserved", holds: "the where-to-open lists (Phase 3)" },
  { id: 11, family: "edition", state: "reserved", holds: "the data editions (Phase 3)" },
  { id: 12, family: "retired", state: "reserved", holds: "the redirected addresses with equity, for 90 days once the inventory exists" },
];

export const SITE_ORIGIN = "https://www.marginatlas.com";

/** The shards generateSitemaps writes: every listed and every empty one. */
export function servedShardIds(): number[] {
  return SITEMAP_FAMILIES.filter((s) => s.state !== "reserved").map((s) => s.id);
}

/** The shards robots.txt lists. */
export function listedShardIds(): number[] {
  return SITEMAP_FAMILIES.filter((s) => s.state === "listed").map((s) => s.id);
}

/** A shard's address. */
export function shardUrl(id: number): string {
  return `${SITE_ORIGIN}/sitemap/${id}.xml`;
}
