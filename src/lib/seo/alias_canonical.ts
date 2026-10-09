/**
 * src/lib/seo/alias_canonical.ts
 *
 * AN ALIAS NAMES ITS LIVE TRADE'S PAGE (P1-C of the page architecture, 2026-10-09; QUEUE seo:alias-canonical). An address whose
 * trade word the taxonomy reads as a live trade under another slug renders that trade's page (/gb/london/plumber is the
 * plumbers' page, /tr/istanbul/cafes-coffee the cafes', /industries/hostel the hostels'), and until 2026-10-09 named itself
 * canonical: two addresses for one page, each claiming to be the original. Each now names the live slug's page, until the
 * alias's one 308 ships with the inventory (the spec's section 4b). A word the taxonomy does not read (a census description,
 * /us/mississippi/offices-of-lawyers) keeps its own address. Read by the trade route, its /opening and /buy-or-start pages and
 * the industry route, and by the sitemap gate's self-canonical check.
 */
import { industryToSlug } from "@/lib/taxonomy";
import { resolveDisplayIndustry } from "@/lib/cells/industry_resolution";
import { TOP_LEVEL_SEGMENTS } from "@/lib/routing/top_level_segments";
import { TRADE_SUB_PAGES } from "@/lib/routing/edge_not_found";

/** The live trade's own slug for a trade word, or the word itself when it names no live trade or already is the slug. */
export function liveTradeSlug(word: string): string {
  const w = String(word ?? "").toLowerCase();
  const live = resolveDisplayIndustry(w);
  return live ? industryToSlug(live.id) : w;
}

/** The canonical of a trade page under a place, or of its /opening or /buy-or-start page. */
export function tradeCanonicalPath(country: string, place: string, word: string, sub?: string): string {
  const base = `/${String(country).toLowerCase()}/${String(place).toLowerCase()}/${liveTradeSlug(word)}`;
  return sub ? `${base}/${sub}` : base;
}

/** The canonical of an industry page. */
export function industryCanonicalPath(word: string): string {
  return `/industries/${liveTradeSlug(word)}`;
}

/** The canonical of any address, as its route names it: the trade and industry shapes through the helpers above, every other
 *  address itself. */
export function canonicalPath(path: string): string {
  const segs = String(path ?? "").toLowerCase().split(/[?#]/)[0].split("/").filter(Boolean);
  if (segs.length === 2 && segs[0] === "industries") return industryCanonicalPath(segs[1]);
  const countryTree = segs.length >= 3 && /^[a-z]{2}$/.test(segs[0]) && !TOP_LEVEL_SEGMENTS.has(segs[0]) && segs[1] !== "industries";
  if (countryTree && segs.length === 3 && segs[2] !== "industries") return tradeCanonicalPath(segs[0], segs[1], segs[2]);
  if (countryTree && segs.length === 4 && TRADE_SUB_PAGES.has(segs[3])) return tradeCanonicalPath(segs[0], segs[1], segs[2], segs[3]);
  return segs.length ? `/${segs.join("/")}` : "/";
}
