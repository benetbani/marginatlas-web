/**
 * src/lib/supabase/middleware_session.ts
 *
 * THE SESSION, REFRESHED AT THE EDGE (the checkup of 2026-10-06, finding 4). @supabase/ssr refreshes an expired access token only
 * where it can write cookies, and a Server Component cannot (src/lib/supabase/server.ts swallows the write), so with no refresh
 * in the middleware a signed-in reader whose hour-long token lapsed read the site as signed out until the browser's own client
 * happened to refresh it. Supabase's server-side guide puts this call in the middleware; here it is, applied to whatever
 * response the middleware already decided on.
 *
 * Three guards, each for a reason:
 *  - auth off (today, until launch day): nothing runs;
 *  - no session cookie on the request: nothing runs, so an anonymous reader or a crawler costs no call;
 *  - a redirect: left as it is.
 * A response that receives a refreshed cookie is marked `private, no-store`: the middleware marks the UK pages publicly cacheable,
 * and a Set-Cookie must never be cached and replayed to another reader.
 *
 * BLIND SPOT, stated: the refreshed cookie reaches the browser on this response; a Server Component rendering this same request
 * still reads the old token (a rewrite's request cookies are not rebuilt here), so the very first request after expiry renders
 * as before and the next one is fresh. A failed refresh (network, revoked session) leaves the response unchanged.
 */
import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import { isAuthEnabled } from "@/lib/feature_flags";
import { isSessionCookie } from "@/lib/monetization/pro_route";

export async function refreshSessionOn(req: NextRequest, res: NextResponse): Promise<NextResponse> {
  if (!isAuthEnabled()) return res;
  if (res.status >= 300 && res.status < 400) return res;
  if (!req.cookies.getAll().some((c) => isSessionCookie(c.name))) return res;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return res;
  let wrote = false;
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value, options } of list) res.cookies.set(name, value, options);
        if (list.length) wrote = true;
      },
    },
  });
  try {
    await supabase.auth.getUser();
  } catch {
    return res;
  }
  if (wrote) res.headers.set("Cache-Control", "private, no-store");
  return res;
}
