/**
 * src/lib/home/site_search.ts
 *
 * THE SEARCH PAGE'S ROWS (milestone 3, masterplan step 33): what /search lists for a query, the UK first (its page, its cities,
 * London's trade pages), then other countries' pages, every row a page that exists (the destination's own lists,
 * src/lib/home/destination.ts). At most a screen of rows: a longer list is narrowed by the query, never paged (his refusals of
 * 2026-09-22).
 */
import { COUNTRIES, visibleIndustries } from "@/lib/taxonomy";
import { homeDestination, liveTradeSlug, UK_CITIES } from "@/lib/home/destination";

export type SearchRow = { href: string; label: string; kind: "country" | "city" | "trade" };
export const SEARCH_ROWS_MAX = 12;

/**
 * How well a name answers the query, lower is better: the header search's ranking of 2026-08 (an exact name, then a name that
 * starts with the query, then any word in it that does, then the aliases, then a bare substring; 6 is no match), moved here when
 * the dialog that held it went. Measured then: alphabetical order sent "rest" to fast-casual restaurants and ranked forestry
 * second ("fo-rest-ry").
 */
export function rankMatch(name: string, keywords: readonly string[], q: string): number {
  const n = name.toLowerCase();
  if (n === q) return 0;
  if (n.startsWith(q)) return 1;
  if (n.split(/[^a-z0-9]+/i).some((w) => w.toLowerCase().startsWith(q))) return 2;
  if (keywords.some((k) => k.toLowerCase() === q)) return 3;
  if (keywords.some((k) => k.toLowerCase().startsWith(q))) return 4;
  if (n.includes(q)) return 5;
  return 6;
}

function ranked<T>(items: readonly T[], name: (t: T) => string, keys: (t: T) => readonly string[], q: string): T[] {
  return items
    .map((t) => ({ t, r: rankMatch(name(t), keys(t), q) }))
    .filter((x) => x.r < 6)
    .sort((a, b) => a.r - b.r || name(a.t).localeCompare(name(b.t)))
    .map((x) => x.t);
}

export function searchSite(query: string): { uk: SearchRow[]; world: SearchRow[] } {
  const q = String(query ?? "").trim().toLowerCase();
  if (q.length < 2) return { uk: [], world: [] };
  const uk: SearchRow[] = [];
  if (rankMatch("United Kingdom", ["uk", "britain", "great britain", "england", "scotland", "wales", "gb"], q) < 6) uk.push({ href: homeDestination({ country: "GB" }), label: "United Kingdom", kind: "country" });
  for (const c of ranked(UK_CITIES, (c) => c.label, (c) => [c.slug], q)) uk.push({ href: homeDestination({ country: "GB", city: c.slug }), label: c.label, kind: "city" });
  for (const i of ranked(visibleIndustries(), (i) => i.name, (i) => i.keywords ?? [], q)) {
    if (liveTradeSlug(i.id)) uk.push({ href: homeDestination({ country: "GB", city: "london", trade: i.id }), label: `${i.name} in London`, kind: "trade" });
  }
  const ukRows = uk.slice(0, SEARCH_ROWS_MAX);
  const world = ranked(COUNTRIES.filter((c) => c.code !== "GB"), (c) => c.name, (c) => [c.code.toLowerCase()], q).map((c): SearchRow => ({ href: homeDestination({ country: c.code }), label: c.name, kind: "country" }));
  return { uk: ukRows, world: world.slice(0, Math.max(0, SEARCH_ROWS_MAX - ukRows.length)) };
}
