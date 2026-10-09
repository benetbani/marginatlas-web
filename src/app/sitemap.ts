/**
 * THE SITEMAPS, ONE SHARD PER FAMILY (P1-E of the page architecture, 2026-10-09; his "Adopt the plan").
 *
 * Next 15's generateSitemaps writes one file per id at /sitemap/{id}.xml. Which id holds which family, and which are listed, answer
 * empty or are reserved, is one table, SITEMAP_FAMILIES (src/lib/seo/sitemap_families.ts), read here, by robots.txt and by
 * scripts/gen_served_files.ts. Every address a listed shard writes is one indexFor admits (src/lib/seo/indexable.ts), names itself
 * canonical, passes the edge and sits in one shard only; lastmod is a page's own date where it has one (a post's) and absent
 * elsewhere, never the build's time. The gate sitemap-families holds all of it, offline: no shard reads the database.
 *
 * WHAT LEFT ON 2026-10-09: the 195 country industries hubs from shard 0 and the region hubs of shard 4, noindex now (P1-B); the
 * United States cells of shard 1, named by census descriptions and noindex now, and the regional cells of shard 2, none at its
 * floor; London's trade pages moved from shard 6 to their family's shard 8, and the posts from shard 0 to the articles' shard 7.
 * Shards 1, 2, 4 and 5 still answer, empty and unlisted.
 *
 * /browse and /you are absent on purpose (2026-08-09): the first is a permanentRedirect to /world, the second sets noindex because
 * everything on it lives in the reader's browser. A sitemap lists the pages to index; a redirect and a noindex page are not among
 * them (the gate sitemap-no-redirects).
 */
import type { MetadataRoute } from "next";
import { COUNTRIES, SLUG_TO_INDUSTRY } from "@/lib/taxonomy";
import { getCoverageRows } from "@/lib/coverage/report";
import { isIndexable } from "@/lib/seo/indexable";
import { countryPageTarget } from "@/lib/geo/page_targets";
import { RETIRED } from "@/lib/taxonomy/retired";
import { hasOwn } from "@/lib/own";
import { spineHoodDistricts } from "@/lib/spine/hood_scheme";
import { getAllPosts } from "@/lib/blog";
import { LEARN_ARTICLES } from "@/lib/learn/articles";
import { SITEMAP_FAMILIES, servedShardIds } from "@/lib/seo/sitemap_families";
import neighborhoodsJson from "../../data/cities/neighborhoods_v1.json";
import cityListJson from "../../data/cities/city_list_v1.json";
import cityComparisonsJson from "../../data/cities/city_comparisons_v1.json";

const BASE_URL = "https://www.marginatlas.com";

/** The live trades' own slugs, as every link on the site spells them. */
const liveTradeSlugs = (): string[] => Object.keys(SLUG_TO_INDUSTRY as Record<string, unknown>).filter((slug) => !hasOwn(RETIRED, slug));

export async function generateSitemaps() {
  return servedShardIds().map((id) => ({ id }));
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  /* Next 15 passes `id` as a STRING ("0", "1", ...) even when generateSitemaps returned numbers; strict equality against a number
     fell through to the empty array, which is why every shard was 110 bytes before this was coerced. */
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  if (SITEMAP_FAMILIES.find((s) => s.id === numId)?.state !== "listed") return [];
  if (numId === 0) return upperSitemap();
  if (numId === 3) return coverageScorecardSitemap();
  if (numId === 6) return citiesSitemap();
  if (numId === 7) return articlesSitemap();
  if (numId === 8) return tradeInPlaceSitemap();
  return [];
}

/** Shard 0, the upper levels: the home, the static pages, the countries, their how-to pages and the industry pages. */
function upperSitemap(): MetadataRoute.Sitemap {
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/compare`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/world`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/coverage`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/pricing`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about-data`, changeFrequency: "monthly", priority: 0.6 },
    /* The page carrying the site's FAQPage structured data: it answers questions people type into a search box. */
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.6 },
    /* Who runs this, the free data pack and the corrections log (his rulings of 2026-10-05 on PARKED P0.2, P0.3 and P31.1). */
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/data`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/corrections`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/status`, changeFrequency: "daily", priority: 0.4 },
  ];
  const countryUrls: MetadataRoute.Sitemap = COUNTRIES.filter((c) => {
    const href = countryPageTarget(c.code)?.href;
    return !!href && isIndexable(href);
  }).map((c) => ({ url: `${BASE_URL}/${c.code.toLowerCase()}`, changeFrequency: "weekly" as const, priority: 0.7 }));
  const howToUrls: MetadataRoute.Sitemap = COUNTRIES.filter((c) => isIndexable(`/${c.code.toLowerCase()}/how-to-open`)).map((c) => ({
    url: `${BASE_URL}/${c.code.toLowerCase()}/how-to-open`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const industryUrls: MetadataRoute.Sitemap = liveTradeSlugs()
    .filter((slug) => isIndexable(`/industries/${slug}`))
    .map((slug) => ({ url: `${BASE_URL}/industries/${slug}`, changeFrequency: "monthly" as const, priority: 0.7 }));
  return [...staticUrls, ...countryUrls, ...howToUrls, ...industryUrls];
}

/** Shard 3, the coverage scorecards: the countries with something on the page (the same reader as the hub and the scorecard). */
function coverageScorecardSitemap(): MetadataRoute.Sitemap {
  return getCoverageRows().map((c) => ({ url: `${BASE_URL}/coverage/${c.iso2.toLowerCase()}`, changeFrequency: "weekly" as const, priority: 0.5 }));
}

/** Shard 6, the city pages: the city index, each city the policy indexes, the neighbourhood hubs and districts it indexes, and the
 *  city comparisons. */
function citiesSitemap(): MetadataRoute.Sitemap {
  type CityListEntry = { slug: string; tier: number };
  type Pair = { left: string; right: string };
  const cities = (cityListJson as { cities: CityListEntry[] }).cities;
  const pairs = (cityComparisonsJson as { pairs: Pair[] }).pairs;
  const neighborhoodCities = (neighborhoodsJson as { cities: Record<string, unknown> }).cities;
  const out: MetadataRoute.Sitemap = [{ url: `${BASE_URL}/cities`, changeFrequency: "weekly", priority: 0.8 }];
  for (const c of cities) {
    if (!isIndexable(`/cities/${c.slug}`)) continue;
    out.push({ url: `${BASE_URL}/cities/${c.slug}`, changeFrequency: "weekly", priority: c.tier === 1 ? 0.85 : c.tier === 2 ? 0.75 : 0.6 });
  }
  for (const slug of Object.keys(neighborhoodCities)) {
    if (!isIndexable(`/cities/${slug}/neighborhoods`)) continue;
    out.push({ url: `${BASE_URL}/cities/${slug}/neighborhoods`, changeFrequency: "monthly", priority: 0.7 });
    for (const d of spineHoodDistricts(slug) ?? []) {
      const path = `/cities/${slug}/neighborhoods/${d.slug}`;
      if (isIndexable(path)) out.push({ url: `${BASE_URL}${path}`, changeFrequency: "monthly", priority: 0.6 });
    }
  }
  for (const p of pairs) out.push({ url: `${BASE_URL}/compare/cities/${p.left}-vs-${p.right}`, changeFrequency: "monthly", priority: 0.7 });
  return out;
}

/** Shard 7, the articles: the blog and its posts (each dated by its last change), the learn index and its articles. */
function articlesSitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.5 },
    /* Every post in content/blog: the gate blog-content holds each to its figures before any build (BLOG.md: "a sitemap entry only
       for a post that passes"). Its own date, never the build's. */
    ...getAllPosts().map((p) => ({ url: `${BASE_URL}/blog/${p.slug}`, lastModified: p.updated ?? p.date, changeFrequency: "monthly" as const, priority: 0.5 })),
    { url: `${BASE_URL}/learn`, changeFrequency: "weekly", priority: 0.8 },
  ];
  for (const a of LEARN_ARTICLES) out.push({ url: `${BASE_URL}/learn/${a.slug}`, changeFrequency: "monthly", priority: 0.7 });
  return out;
}

/** Shard 8, trade in a place: London's trade pages, the only ones Phase 1 indexes. */
function tradeInPlaceSitemap(): MetadataRoute.Sitemap {
  return liveTradeSlugs()
    .filter((slug) => isIndexable(`/gb/london/${slug}`))
    .map((slug) => ({ url: `${BASE_URL}/gb/london/${slug}`, changeFrequency: "weekly" as const, priority: 0.75 }));
}
