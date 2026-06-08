/**
 * src/lib/monetization/entitlement.ts
 *
 * The AUTHED, async tier resolver (Milestone 2). Reads the signed-in user's
 * subscription from Supabase and returns their real tier.
 *
 * This is deliberately separate from viewer_tier.getViewerTier() (sync, always
 * "free"), which the STATIC prerender uses so a gated value is never baked into
 * the static HTML. getSessionTier is used only by the authed API routes that
 * reveal a gated number to an entitled subscriber after checking the session
 * server-side.
 *
 * Fail-soft: any error, no session, or auth disabled returns "free", so a gated
 * number stays gated on an error rather than leaking.
 */
import { isAuthEnabled } from "@/lib/feature_flags";
import { getSessionUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ViewerTier } from "@/lib/monetization/viewer_tier";

export async function getSessionTier(): Promise<ViewerTier> {
  if (!isAuthEnabled()) return "free";
  try {
    const user = await getSessionUser();
    if (!user) return "free";
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("subscriptions")
      .select("tier, status, current_period_end")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!data) return "free";

    const active = data.status === "active" || data.status === "trialing";
    const periodOk =
      !data.current_period_end ||
      new Date(data.current_period_end as string).getTime() > Date.now();
    if (active && periodOk && (data.tier === "basic" || data.tier === "premium")) {
      return data.tier as ViewerTier;
    }
    return "free";
  } catch {
    return "free";
  }
}
