/**
 * src/lib/supabase/client.ts
 *
 * Supabase BROWSER client via @supabase/ssr. Use in client components for the
 * sign-in flow (signInWithOtp) and any client-side session reads. It stores the
 * session + PKCE verifier in cookies the server can read at /auth/callback, and
 * auto-refreshes the access token client-side.
 */
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
