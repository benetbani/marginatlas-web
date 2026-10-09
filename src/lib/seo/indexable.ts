/**
 * src/lib/seo/indexable.ts
 *
 * WHICH PAGES A SEARCH ENGINE MAY INDEX: the index policy (U1 of the page architecture, 2026-10-09, his "Adopt the plan";
 * docs/superpowers/specs/2026-10-09-page-architecture-design.md in the design repo), grown from milestone 1's rule (M10; his
 * interview of 2026-09-26, answer 6: "UK pages + every page at its floor; thin pages noindexed until they reach it").
 *
 *  - classify(path) names the page's family (the spec's section 1) or the kind of page that belongs to none: an upper level, a
 *    region, an industries hub, a /decide pair, a district's trade page.
 *  - indexFor(path) answers { index, follow: true, family, reason }: a robots value and nothing else. It cannot redirect and
 *    cannot answer 404; a page that loses its index status keeps its address.
 *  - Phase 1 (the spec's section 4a, P1-B): the 1,066 industries hubs, the /decide pairs, every UK trade page off London and the
 *    United States pages named by a census description are noindex; an /opening and a /buy-or-start page take their trade
 *    page's status. Everywhere else milestone 1's rule holds: a UK page indexes; any other spine page indexes when the floor
 *    census counted it at its type's floor (data/seo/floor_census.json, written by scripts/seo/floor_census.tsx); a spine page the
 *    census holds no entry for does not. The pages outside the spine (the static pages, the articles, the coverage scorecards,
 *    the region pages, /across, the city index and the city comparisons) keep their root layout's default.
 *
 * Read by each family, hub and /decide route's metadata (robotsFor; tests/seo/indexable.test.ts holds the list of routes) and by
 * every sitemap shard (isIndexable). The five-part test of Phase 2 replaces the census rule country by country.
 */
import censusJson from "../../../data/seo/floor_census.json";
import cityListJson from "../../../data/cities/city_list_v1.json";
import { COUNTRY_STATIC_CHILDREN, TOP_LEVEL_SEGMENTS } from "@/lib/routing/top_level_segments";
import { US_DESCRIPTION_SLUGS } from "@/lib/routing/place_slugs_generated";
import { TRADE_SUB_PAGES } from "@/lib/routing/edge_not_found";

type Census = { generated_at: string; floors: Record<string, number>; pages: Record<string, { surface: string; blocks: number }> };
const CENSUS = censusJson as unknown as Census;
const UK_CITIES = new Set(
  (cityListJson as { cities: Array<{ slug: string; iso2: string }> }).cities.filter((c) => String(c.iso2).toUpperCase() === "GB").map((c) => c.slug),
);

const norm = (path: string) => {
  const p = String(path || "/").toLowerCase().split(/[?#]/)[0];
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
};
const partsOf = (p: string) => p.split("/").filter(Boolean);

/** True for a page of the United Kingdom: the country and everything under `/gb`, and a UK city with its neighbourhood pages. */
export function isUkPage(path: string): boolean {
  const p = norm(path);
  if (p === "/gb" || p.startsWith("/gb/")) return true;
  const city = /^\/cities\/([a-z0-9-]+)(?:\/|$)/.exec(p)?.[1];
  return !!city && UK_CITIES.has(city);
}

/** What the census counted for a page outside the UK, against its type's floor; null where it holds no entry. */
export function floorStanding(path: string): { surface: string; blocks: number; floor: number; atFloor: boolean } | null {
  const e = CENSUS.pages[norm(path)];
  if (!e) return null;
  const floor = CENSUS.floors[e.surface];
  return { surface: e.surface, blocks: e.blocks, floor, atFloor: typeof floor === "number" && e.blocks >= floor };
}

/** The page families of the spec's section 1, and the kinds of page that belong to none. */
export type Family =
  | "upper" //          the home, the static pages, a country, its how-to page, the industries directory and an industry page
  | "coverage" //       a coverage scorecard, /coverage/{iso2}
  | "city" //           family 1: /cities, a city page with its neighbourhood pages, a city comparison
  | "article" //        /blog, /learn and their articles
  | "trade-in-place" // family 5: /{country}/{place}/{trade}, its /opening and /buy-or-start pages
  | "trade-country" //  family 2, Phase 3: /{country}/industries/{trade}; no page yet
  | "where-to-open" //  family 3: /industries/{trade}/across
  | "edition" //        family 4, Phase 3: /editions/{slug}; no page yet
  | "region" //         /{country}/{region}
  | "hub" //            an industries hub: /{country}/industries, /{country}/{place}/industries
  | "decide" //         a /decide pair: /decide/{activity}/{city}
  | "district-trade"; // a district's trade page, /{country}/{city}/{district}/{trade}

export type IndexVerdict = { index: boolean; follow: true; family: Family; reason: string };

/** The upper levels the census counts: a country page, its how-to page, an industry page. An industry page is `/industries/` and
 *  any one word, not only a slug: the route also serves an industry id with underscores (/industries/craft_beer_mfg) and
 *  names its slug's page canonical, and such an address is a spine page the census holds no entry for, so it does not index. */
const SPINE_UPPER = /^\/(?:[a-z]{2}(?:\/how-to-open)?|industries\/[^/]+)$/;

/** The family of a page, by its address alone. */
export function classify(path: string): Family {
  const segs = partsOf(norm(path));
  const [a, b, c, d] = segs;
  const n = segs.length;
  if (a === "cities" || (a === "compare" && b === "cities")) return "city";
  if (a === "blog" || a === "learn") return "article";
  if (a === "coverage" && n === 2) return "coverage";
  if (a === "decide" && n === 3) return "decide";
  if (a === "industries" && n === 3 && c === "across") return "where-to-open";
  if (a === "editions" && n === 2) return "edition";
  if (a !== undefined && /^[a-z]{2}$/.test(a) && !TOP_LEVEL_SEGMENTS.has(a)) {
    if (n === 2) return b === "industries" ? "hub" : COUNTRY_STATIC_CHILDREN.has(b) ? "upper" : "region";
    if (n === 3) return b === "industries" ? "trade-country" : c === "industries" ? "hub" : "trade-in-place";
    if (n === 4) return TRADE_SUB_PAGES.has(d) ? "trade-in-place" : "district-trade";
  }
  return "upper";
}

function byCensus(p: string, say: (index: boolean, reason: string) => IndexVerdict): IndexVerdict {
  const s = floorStanding(p);
  if (!s) return say(false, "the census holds no entry: noindex on the rest");
  return say(s.atFloor, `${s.atFloor ? "counted at" : "under"} its floor (${s.blocks} of ${s.floor} blocks)`);
}

/** The robots value of a page and why: Phase 1's rules, else milestone 1's, else the route's default. */
export function indexFor(path: string): IndexVerdict {
  const p = norm(path);
  const family = classify(p);
  const say = (index: boolean, reason: string): IndexVerdict => ({ index, follow: true, family, reason });
  const segs = partsOf(p);
  if (family === "hub") return say(false, "an industries hub belongs to no family until it is rebuilt (P1-B)");
  if (family === "decide") return say(false, "a /decide pair (P1-B); the /decide tool page keeps its status");
  if (family === "trade-country" || family === "edition") return say(false, "a Phase 3 family: no page here yet");
  if (family === "district-trade") return say(false, "a district's trade page, out of the index since 2026-08-08");
  if (family === "region") return say(true, "a region page keeps its default until the test governs its country");
  if (family === "where-to-open") return say(true, "/across keeps its default in Phase 1");
  if (family === "coverage" || family === "article") return say(true, "keeps its route's default");
  if (family === "trade-in-place") {
    const [country, place, word] = segs;
    if (segs.length === 4) {
      const parent = indexFor(`/${country}/${place}/${word}`);
      return say(parent.index, `takes its trade page's status: ${parent.reason}`);
    }
    if (country === "gb") return place === "london" ? say(true, "London's trade pages index by the UK rule") : say(false, "a UK trade page off London (P1-B)");
    if (country === "us" && US_DESCRIPTION_SLUGS.has(word)) return say(false, "a United States page named by a census description (P1-B)");
    return byCensus(p, say);
  }
  if (family === "city") {
    if (p === "/cities" || p.startsWith("/compare/")) return say(true, "the city index and the city comparisons keep their default");
    return isUkPage(p) ? say(true, "a UK city page indexes by the UK rule") : byCensus(p, say);
  }
  if (!SPINE_UPPER.test(p)) return say(true, "an upper-level page outside the census keeps its default");
  return isUkPage(p) ? say(true, "a UK page indexes by the UK rule") : byCensus(p, say);
}

/** The rule as a yes or no, for the sitemap shards. */
export function isIndexable(path: string): boolean {
  return indexFor(path).index;
}

/** What a route's `robots` metadata holds: indexed or not, links always followed, and the googlebot half of the root layout's. */
export type RobotsMeta = {
  index: boolean;
  follow: boolean;
  googleBot: { index: boolean; follow: boolean; "max-image-preview"?: "large"; "max-snippet"?: number };
};

/** The hints for how an indexed page shows in results, as src/app/layout.tsx sets them (tests/seo/indexable.test.ts holds the two
 *  equal). Next replaces a page's `robots` wholesale, never merges it with the layout's, so a route that sets its own carries them. */
const GOOGLEBOT_HINTS = { "max-image-preview": "large", "max-snippet": -1 } as const;

/** The robots value for a route's metadata: indexed or not, its links always followed; an indexed page keeps the layout's hints,
 *  a noindex page has none to keep. */
export function robotsFor(path: string): RobotsMeta {
  const { index } = indexFor(path);
  return { index, follow: true, googleBot: index ? { index, follow: true, ...GOOGLEBOT_HINTS } : { index, follow: true } };
}

/** When the census was written, for the sitemap's and the gate's reports. */
export const FLOOR_CENSUS_AT = CENSUS.generated_at;
