/**
 * src/lib/open/sub_page_gates.ts
 *
 * WHERE A TRADE'S SUB-PAGE DRAWS, SAID ONCE FOR ITS ROUTE AND ITS DOORS (plan 2026-10-11, dynamic 404 remains; QUEUE site:dynamic-404-skeleton).
 * The edge cannot judge these pages (each stands on the trust gate over the live row), so a miss keeps its route's notFound(), a 200 with
 * the loading skeleton; the site therefore draws no door to one, and spells each door from the address its own page was asked at (the review
 * of 2026-10-12, I1 and M2). Pure: no database, no Next.
 */

/** The buy-or-start page draws (buildBuyVsStart, src/lib/open/buy_vs_start.ts) where the opening page it stands on carries a positive owner
 *  take-home and a positive total to open; the opening page's door to it (src/components/open/OpeningHero.tsx) asks the same. */
export function buyOrStartDraws(opening: { takeHomeUsd?: number | null; totalToOpenUsd?: number | null }): boolean {
  const pos = (n: number | null | undefined): boolean => typeof n === "number" && Number.isFinite(n) && n > 0;
  return pos(opening.takeHomeUsd) && pos(opening.totalToOpenUsd);
}

/** A trade page's own address, /{country}/{geo}/{industry}: the three parts a request carries (or a lookup was asked with), lowercased as the
 *  middleware's canonical hop writes them. Every door to one of its sub-pages is spelled from it and never from cellUrl(cell): that address is
 *  built from the cell's display label, and where the label does not slugify back to the geo (the prerendered flagship /mx/mx-roo/hotels-lodging
 *  is labelled "Quintana Roo") it is another address, whose lookup falls to the extrapolated row, which the trust gate refuses, so a door spelled
 *  there opens a 200 skeleton. The trade page spells its own opening door from its params the same way (src/app/[country]/[geo]/[industry]/page.tsx). */
export function tradePageHref(country: string, geo: string, industry: string): string {
  return `/${country}/${geo}/${industry}`.toLowerCase();
}

/** The address of a trade page's /opening or /buy-or-start page: its own address and the sub-page's name (TRADE_SUB_PAGES,
 *  src/lib/routing/edge_not_found.ts, holds the same two). */
export function subPageHref(tradeHref: string, sub: "opening" | "buy-or-start"): string {
  return `${tradeHref}/${sub}`;
}
