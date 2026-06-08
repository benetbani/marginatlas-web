/**
 * /auth/callback — completes the magic-link sign-in (Milestone 1).
 *
 * Supabase redirects the clicked sign-in link here with a one-time ?code= (PKCE).
 * We exchange it for a session (the @supabase/ssr server client sets the session
 * cookies on this response), then redirect to a sanitized same-origin ?next= or
 * /account. Inert when auth is disabled. Fail-soft: any error returns to /signin.
 */
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAuthEnabled } from "@/lib/feature_flags";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") || "/account";
  const next = nextParam.startsWith("/") ? nextParam : "/account";

  if (!isAuthEnabled() || !code) {
    return NextResponse.redirect(`${origin}/`);
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(`${origin}/signin?error=1`);
  } catch {
    return NextResponse.redirect(`${origin}/signin?error=1`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
