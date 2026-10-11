/**
 * src/lib/open/sub_page_gates.ts
 *
 * WHERE A TRADE'S SUB-PAGE DRAWS, SAID ONCE FOR ITS ROUTE AND ITS DOORS (plan 2026-10-11, dynamic 404 remains; QUEUE site:dynamic-404-skeleton).
 * The edge cannot judge these pages (each stands on the trust gate over the live row), so a miss keeps its route's notFound(), a 200 with
 * the loading skeleton; the site therefore draws no door to one. Pure: no database, no Next.
 */

/** The buy-or-start page draws (buildBuyVsStart, src/lib/open/buy_vs_start.ts) where the opening page it stands on carries a positive owner
 *  take-home and a positive total to open; the opening page's door to it (src/components/open/OpeningHero.tsx) asks the same. */
export function buyOrStartDraws(opening: { takeHomeUsd?: number | null; totalToOpenUsd?: number | null }): boolean {
  const pos = (n: number | null | undefined): boolean => typeof n === "number" && Number.isFinite(n) && n > 0;
  return pos(opening.takeHomeUsd) && pos(opening.totalToOpenUsd);
}
