# Milestone 1 activation (auth + free accounts)

**Status: built and shipped to production, fully DORMANT.** Everything below is live in the codebase behind one flag, `NEXT_PUBLIC_AUTH_ENABLED` (default **off**). With it off, the site is byte-for-byte the same as before: no sign-in in the header, the save star still uses localStorage, `/account` and `/signin` show "coming soon". Nothing here is active until you do the steps below.

Plan + design: `docs/superpowers/plans/2026-06-08-monetization-m1.md`.

## What shipped (dormant)

- `@supabase/ssr` + server/browser Supabase auth clients (`src/lib/supabase/{server,client}.ts`) and `getSessionUser()` (`src/lib/auth/session.ts`, fail-soft, returns null when the flag is off).
- `/signin` (magic-link via `signInWithOtp`, PKCE), `/auth/callback` (code exchange), `/auth/signout`.
- `db/migrations/2026-06-08-accounts-saved-cells.sql` — `profiles`, `saved_cells`, `watchlist`, `recent_cells`, all with RLS keyed to `auth.uid()`, plus an auto-create-profile trigger. **Not applied yet** (repo convention: apply migrations by hand).
- `/api/saved-cells` (GET/POST/DELETE, RLS-backed, reads the user from the session, never trusts a client user_id).
- `CellActions` saves to the account when signed in (an anonymous save prompts sign-in and returns; the flag-off path is unchanged localStorage).
- `/account` shows the user's real saved cells when signed in; `HeaderAuth` adds a "Sign in" / "Account" entry. Both render nothing / the old "coming soon" when the flag is off, so the static site is unchanged.

## Activation steps (in order)

1. **Supabase dashboard → Authentication → Sign In / Providers → Email:** enable Email, and enable **magic link** (OTP). The default email template is fine to start.
2. **Supabase → Authentication → URL Configuration:**
   - Site URL: `https://www.marginatlas.com`
   - Redirect URLs (allowlist): add `https://www.marginatlas.com/auth/callback` and `https://marginatlas.com/auth/callback`. To test on a Vercel preview first, also add that preview's `https://<deployment>.vercel.app/auth/callback`.
3. **Apply the migration:** open `db/migrations/2026-06-08-accounts-saved-cells.sql`, paste it into the Supabase **SQL Editor**, and run it. It is additive and idempotent.
4. **Vercel env (Production + Preview):** confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` exist (they are already in `.env.local`; mirror them to Vercel if missing). The service-role key is NOT needed for M1 auth.
5. **Flip the flag:** add `NEXT_PUBLIC_AUTH_ENABLED=1` to the Vercel project (Production) and redeploy. Header shows "Sign in", `/signin` sends magic links, saved cells persist per account.
6. **Test on production:** sign in with a real email, click the link, confirm it lands on `/account` (or the page you started from), save a cell, sign out, sign back in, confirm the saved cell is still there.

## Known limits / follow-ups (deliberately deferred, none blocking)

- **Magic-link email template:** the `@supabase/ssr` PKCE flow expects the link to redirect to `/auth/callback?code=...`. The default template works in most setups; if the click does not complete the sign-in, switch the email template to the server-side pattern in the Supabase "Server-Side Auth (Next.js)" docs (token_hash + `/auth/callback`). The callback already redirects to `/signin?error=1` on failure, so a misconfig is visible, not a crash.
- **Middleware session refresh:** intentionally NOT added, to avoid touching the 295-line anti-scraping/cache middleware untested. The browser client auto-refreshes the token client-side and `/auth/callback` sets the session cookie, so sign-in works; a very long idle server-only session is the only soft edge. Add the standard `@supabase/ssr` middleware refresh as a hardening pass once the flow is verified.
- **`/account`** currently lists saved cells + sign-out; watchlist/recent/alerts/billing tabs remain the design preview. Wire them to the real tables (already created by the migration) as a fast follow.
- **Watchlist + recent** tables exist and are RLS-protected, but no UI writes to them yet (saved cells are wired first).

## Next: Milestone 2 (the first paywall) and Milestone 3 (Premium tools)

Outlined in the plan doc. M2 needs your Stripe account + keys and is where the gating UI (already built: `RedactedNumber`, `PaywallModalRoot`, etc.) goes live against the owner-take-home number via the prerender-free + authed-API path. M3 is exports / neighborhood depth / comparison / alerts. Both gate through the same `getViewerTier()` + authed-API pattern.
