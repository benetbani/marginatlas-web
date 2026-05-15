/**
 * Pro-UI gate (Plan v3.0 §P).
 *
 * Until real auth ships, "Pro" is signalled by:
 *   - a query string flag `?pro=1` for ad-hoc demos
 *   - a cookie `atlas_pro=1` set by the future paid flow
 *   - or `?show_large=1` for the corp_only reveal specifically
 *
 * Both server (route handler) and client (component) call-sites use the
 * same `isProUI()` shape. On the server, pass headers; on the client we
 * read window.location + document.cookie.
 *
 * Phase R will replace this with Supabase session + Stripe subscription.
 */

export type AudienceGate = {
  revealMixed: boolean;
  revealCorp: boolean;
  isPro: boolean;
};

const DEFAULT: AudienceGate = {
  revealMixed: false,
  revealCorp: false,
  isPro: false,
};

/** Read the gate from a URL + cookie string (server-safe). */
export function readGateFromRequest(
  searchParams: URLSearchParams | { get(k: string): string | null },
  cookieHeader?: string | null
): AudienceGate {
  const pro = (searchParams.get("pro") || "").toLowerCase();
  const showLarge = (searchParams.get("show_large") || "").toLowerCase();
  const showMixed = (searchParams.get("show_mixed") || "").toLowerCase();
  const cookieIsPro =
    !!cookieHeader && /(?:^|;\s*)atlas_pro=1(?:;|$)/.test(cookieHeader);

  const isPro = pro === "1" || pro === "true" || cookieIsPro;
  const revealCorp = isPro || showLarge === "1" || showLarge === "true";
  const revealMixed =
    isPro || showMixed === "1" || showMixed === "true" || showLarge === "1";

  if (!isPro && !revealCorp && !revealMixed) return DEFAULT;
  return { isPro, revealCorp, revealMixed };
}

/** Convenience for the home page / nav — accepts a plain searchParams record. */
export function readGateFromObject(
  obj: Record<string, string | string[] | undefined>,
  cookieHeader?: string | null
): AudienceGate {
  const get = (k: string) => {
    const v = obj[k];
    if (Array.isArray(v)) return v[0] || null;
    return v ?? null;
  };
  return readGateFromRequest({ get }, cookieHeader);
}
