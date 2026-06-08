/**
 * /auth/signout — ends the session (Milestone 1).
 *
 * POST only (a sign-out should not be triggered by a GET / prefetch). Clears the
 * Supabase session, then redirects home. Inert + fail-soft when auth is disabled.
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAuthEnabled } from "@/lib/feature_flags";

export async function POST(request: NextRequest) {
  const { origin } = new URL(request.url);
  if (isAuthEnabled()) {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase.auth.signOut();
    } catch {
      // fail-soft: redirect home regardless
    }
  }
  return NextResponse.redirect(`${origin}/`, { status: 303 });
}
