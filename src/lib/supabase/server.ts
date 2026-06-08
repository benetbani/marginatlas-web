/**
 * src/lib/supabase/server.ts
 *
 * Supabase SERVER client bound to the request's cookies, via @supabase/ssr.
 * Use in Server Components, route handlers, and server actions. In a Server
 * Component cookie writes are not permitted, so setAll swallows that error; the
 * session is set/refreshed in route handlers (the /auth/callback exchange) and,
 * as a future hardening, in middleware.
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY (both present in
 * .env.local and Vercel). Never references the service-role key here; that stays
 * in src/lib/supabase.ts for trusted server-only data reads.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, where cookie writes are not
            // allowed. Safe to ignore: the session is written in the route
            // handlers that own the auth exchange.
          }
        },
      },
    },
  );
}
