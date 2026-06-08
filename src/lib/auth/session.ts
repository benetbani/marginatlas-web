/**
 * src/lib/auth/session.ts
 *
 * The current signed-in user, server-side. Returns null immediately when auth is
 * disabled (the M1 master flag) and is fail-soft (null) on any error, so a
 * Supabase hiccup degrades to the signed-out experience rather than a 500. This
 * is the one accessor pages/components use to branch on "signed in or not".
 */
import { isAuthEnabled } from "@/lib/feature_flags";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SessionUser = {
  id: string;
  email: string | null;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isAuthEnabled()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return null;
    return { id: data.user.id, email: data.user.email ?? null };
  } catch {
    return null;
  }
}
