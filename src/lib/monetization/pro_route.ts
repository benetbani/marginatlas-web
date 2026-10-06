/**
 * src/lib/monetization/pro_route.ts
 *
 * WHICH UK PAGES LOCK, BY ADDRESS (milestone 2, masterplan steps 17 and 18; his interview of 2026-09-26: 18, half of every UK chapter
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

/** A Supabase session cookie, whole or in chunks (`sb-<project>-auth-token`, `.0`, `.1`); its code-verifier sibling is not one. */
const AUTH_COOKIE = /^sb-[a-z0-9]+-auth-token(\.\d+)?$/;

/** Whether a cookie name is a Supabase session cookie (the middleware's session refresh reads the same rule). */
export function isSessionCookie(name: string): boolean {
  return AUTH_COOKIE.test(name);
}

/** WHERE A SIGNED-IN READER OF A LOCKED UK PAGE GOES (masterplan step 18): `/pro<path>` when the paywall is on, the page locks
 *  and the request carries a session cookie; null otherwise. The mirror asks the account and draws the page open for Pro and
 *  locked for anyone else; a crawler never holds the cookie, so it never reaches the mirror. */
export function proRewrite(path: string, cookieNames: readonly string[], paywallOn: boolean): string | null {
  if (!paywallOn || !lockablePath(path)) return null;
  return cookieNames.some((n) => AUTH_COOKIE.test(n)) ? `/pro${path}` : null;
}
