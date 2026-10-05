/**
 * src/lib/monetization/pro_route.ts
 *
 * WHICH UK PAGES LOCK, BY ADDRESS (milestone 2, masterplan step 17; his interview of 2026-09-26: 18, half of every UK chapter
 * behind Pro; 27, UK pages only). The pages that lock anything: the country page, a UK city page, a London trade page. The
 * district pages lock nothing (each of their chapters is one level), the how-to page has no chapters, and these three are the UK
 * pages the sitemap lists. `/gb/london/industries` is a static page of its own, never a trade. Each page type counts only while
 * its spine page is on, the one body that draws locks. The public routes ask it whether to draw their locks; the middleware asks
 * it before sending a signed-in reader to the uncached mirror (step 18). Edge-safe: it reads the slug tables and the
 * environment, nothing else.
 */
import { cityPathFor } from "@/lib/cities/city_path";
import { GEO_STATIC_CHILDREN } from "@/lib/routing/edge_not_found";
import { isSpineReformEnabledFor } from "@/lib/feature_flags";

export function lockablePath(path: string): boolean {
  if (path === "/gb") return isSpineReformEnabledFor("country");
  const trade = /^\/gb\/london\/([a-z0-9-]+)$/.exec(path)?.[1];
  if (trade) return !GEO_STATIC_CHILDREN.has(trade) && isSpineReformEnabledFor("cell");
  const city = /^\/cities\/([a-z0-9-]+)$/.exec(path)?.[1];
  return !!city && cityPathFor("GB", city) !== null && isSpineReformEnabledFor("city");
}
