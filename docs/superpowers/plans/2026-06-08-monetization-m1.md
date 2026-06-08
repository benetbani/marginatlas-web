# Monetization Milestone 1: Auth + Free Accounts (Implementation Plan)

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax. Same repo constraints as the city reform: no local `npm run build`/`tsc` (Vercel builds remotely); commit on `reform-v2/palette-brick`; ship by fast-forward to `main`; per-file staging; bracket paths need `GIT_LITERAL_PATHSPECS=1`. **Secrets rule:** the Supabase service-role key and any secret live in `.env.local` (gitignored) and Vercel env. NEVER print, echo, or commit a secret value; reference env var NAMES only.

**Goal:** Ship Milestone 1 of the real business model: Supabase magic-link auth and free accounts with **saved cells, watchlist, and recently-viewed** persisted per user. No payment, no gating, no Premium.

**Architecture (dormant-by-default):** Everything ships behind a single flag, `isAuthEnabled()` (`NEXT_PUBLIC_AUTH_ENABLED`, default **off**). With the flag off, the site behaves **exactly as today**: no sign-in UI, `CellActions` uses localStorage, `/account` shows "Coming soon", and the middleware does no auth. The flag is the master switch the founder flips **after** configuring Supabase Auth and applying the migration. All auth code is fail-soft: a Supabase/auth error degrades to the signed-out experience, never a 500.

**Why dormant:** the magic-link flow cannot be fully tested without the founder enabling Supabase Auth (email provider + redirect-URL allowlist) and applying the `saved_cells` migration, which are dashboard/SQL-editor actions only the founder can do. So M1 is built, shipped inert, and verified to not disturb production; the founder activates it with the checklist at the bottom.

**Decisions (from the 2026-06-08 20-question brainstorm, all the recommended options):**
- First ship: **auth + free accounts** (no payment).
- Free account unlocks: **saved cells + watchlist + recently viewed** (all free; paid is data depth only, overriding v34's "saved = Basic").
- Sign-in entry: **header link + contextual prompt** at the save moment.
- Post-sign-in: **return to where they were** (preserve intent).
- Save while anonymous: **prompt sign-in, then complete the save**.
- Watch unit: **a cell** (industry in a city). Alerts: **none in v1** (the watchlist is a living list).
- No timed trial (the free account is the try-before-you-buy). Data model: **per-feature tables, RLS on `auth.uid()`**. SEO: **paid numbers never prerender** (M2 concern). Email: **Supabase default** for magic links now.

**Tech:** Next.js 15.5 App Router, React 19 server components, `@supabase/ssr` (cookie-based sessions), Supabase Auth (magic-link / OTP email), the existing `src/lib/supabase.ts` (anon + service clients), tokens-only UI.

---

## Build order (each chunk ships dormant, verified to compile + leave production unchanged with the flag off)

### Chunk 1: Foundation (deps + flag + SSR clients + middleware)

**Files:**
- Modify: `package.json` (add `@supabase/ssr`)
- Modify: `src/lib/feature_flags.ts` (add `isAuthEnabled`)
- Create: `src/lib/supabase/server.ts` (server client via `@supabase/ssr`, reads cookies)
- Create: `src/lib/supabase/client.ts` (browser client via `@supabase/ssr`)
- Create: `src/lib/auth/session.ts` (`getSessionUser()` server helper, fail-soft -> null)
- Modify: `src/middleware.ts` (refresh the Supabase session ONLY when `isAuthEnabled()`, wrapped in try/catch so it can never 500 the site)

- [ ] Add `@supabase/ssr` (run `npm install @supabase/ssr` locally to update package.json + lock; install is allowed, only `build`/`prebuild`/`tsc` are not).
- [ ] `isAuthEnabled()` follows the existing `parseFlag(process.env.NEXT_PUBLIC_AUTH_ENABLED, false)` pattern; add to `snapshotFlags()`.
- [ ] `server.ts`: `createServerClient(url, anonKey, { cookies: { getAll, setAll } })` reading `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`. `client.ts`: `createBrowserClient(url, anonKey)`.
- [ ] `getSessionUser()`: returns the authed user or null; returns null immediately when `!isAuthEnabled()`.
- [ ] Middleware: when `isAuthEnabled()`, call `supabase.auth.getUser()` to refresh the session cookie (the standard `@supabase/ssr` middleware pattern), in a try/catch that returns the normal response on any error. When the flag is off, the existing middleware runs unchanged.
- [ ] **Verify:** deploy preview (flag off by default), confirm build passes + a cell page and `/account` look identical to today. Ship.

### Chunk 2: Auth flow UI (sign-in, callback, sign-out, header)

**Files:**
- Create: `src/app/signin/page.tsx` (email field -> `signInWithOtp({ email, emailRedirectTo })`; shows "check your email"; honors a `?next=` return path)
- Create: `src/app/auth/callback/route.ts` (exchange the code/token for a session, redirect to `?next=` or `/account`)
- Create: `src/app/auth/signout/route.ts` (sign out, redirect home)
- Modify: header component (add a "Sign in" link / signed-in avatar, gated on `isAuthEnabled()`)

- [ ] `/signin`: a client component using the browser client; on submit, `signInWithOtp` with `emailRedirectTo = ${origin}/auth/callback?next=${next}`. When `!isAuthEnabled()`, render the existing "coming soon" message instead.
- [ ] `/auth/callback`: server route, `exchangeCodeForSession`, then redirect to the sanitized `next` (same-origin only) or `/account`.
- [ ] Header: a small "Sign in" link (server-reads `getSessionUser()`); when signed in, show the account link + sign-out. Entire block gated on `isAuthEnabled()` so the header is unchanged when off.
- [ ] **Verify:** preview with the flag off (no sign-in link, `/signin` shows coming-soon) AND a second preview with `NEXT_PUBLIC_AUTH_ENABLED=1` to confirm the sign-in form renders and submits (the email may not deliver until Supabase Auth is configured, but the UI must render and not error). Ship (flag stays off in production).

### Chunk 3: Saved cells persistence (migration + API + wiring)

**Files:**
- Create: `db/migrations/2026-06-08-accounts-saved-cells.sql` (the tables + RLS; NOT auto-applied)
- Create: `src/app/api/saved-cells/route.ts` (GET list / POST add / DELETE remove, user from session, RLS-backed)
- Modify: `src/components/CellActions.tsx` (when authed, use the API; else the existing localStorage path)
- Modify: `src/app/account/page.tsx` (when authed, load real saved cells; else the existing preview/coming-soon)

- [ ] Migration: `profiles` (1:1 with `auth.users`), `saved_cells (user_id, country, geo, industry, label, created_at, PRIMARY KEY (user_id, country, geo, industry))`, `watchlist` (same shape), `recent_cells (user_id, country, geo, industry, label, visited_at)`. RLS on each: `ENABLE ROW LEVEL SECURITY` + `USING (auth.uid() = user_id)` for all of select/insert/update/delete. A trigger to auto-create a `profiles` row on signup. Saved cells are **free** (no Basic cap); keep a generous sanity cap (e.g. 500) to bound abuse, not to gate.
- [ ] `/api/saved-cells`: reads `getSessionUser()`; 401 (graceful) when absent; otherwise queries the user's rows via the server client (RLS enforces ownership). POST validates the cell key shape `{country}/{geo}/{industry}`.
- [ ] `CellActions`: when `isAuthEnabled()` and signed in, read/write via the API (optimistic UI, fail-soft to localStorage on error); otherwise the current localStorage behavior, unchanged.
- [ ] `/account`: when `isAuthEnabled()` and signed in, render the user's real saved cells in the existing Saved tab; otherwise the current preview/coming-soon.
- [ ] **Verify:** preview flag-off (CellActions still saves to localStorage, `/account` coming-soon) confirms production is untouched. Ship.

### Chunk 4: Activation checklist doc

- [ ] Write `docs/handoff/2026-06-08-m1-activation.md` with the exact founder steps (below). Commit.

---

## Activation checklist (founder-only, when ready to turn M1 on)

1. **Supabase dashboard -> Authentication -> Providers -> Email:** enable email, turn ON "magic link" (OTP), and set the confirmation/magic-link email template if desired (Supabase default works).
2. **Supabase -> Authentication -> URL Configuration:** add the production site URL `https://www.marginatlas.com` and `https://marginatlas.com` to **Site URL** and the **Redirect allowlist** (add `https://www.marginatlas.com/auth/callback`). For preview testing, add the relevant `*.vercel.app/auth/callback` too.
3. **Apply the migration:** open `db/migrations/2026-06-08-accounts-saved-cells.sql` and run it in the Supabase **SQL Editor** (it is NOT auto-applied; the repo convention is manual apply).
4. **Vercel env:** confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` exist in the Vercel project (Production + Preview). They are already in `.env.local`; mirror them to Vercel if not already there.
5. **Flip the flag:** set `NEXT_PUBLIC_AUTH_ENABLED=1` in Vercel (Production), redeploy. Sign-in appears in the header, `/signin` sends magic links, saved cells persist per user.
6. **Test:** sign in with a real email on production, save a cell, sign out, sign back in, confirm the saved cell persists.

---

## Milestone 2 outline (the first paywall — needs Stripe credentials, build after M1 activates)

The gating UI is already built (`src/components/monetization/*`: `RedactedNumber`, `BlurredOverlay`, `PaywallModalRoot`, `paywall_copy.ts`) and `viewer_tier.gateValue` exists (stub returns "free"). M2 wires the real entitlement + Stripe + the first gated number:
- `subscriptions` table (user_id, tier, status, stripe_subscription_id, current_period_start/end, canceled_at) + RLS; `getViewerTier()` reads it.
- Stripe: products for Basic ($37/mo, $372/yr) and Premium ($77/mo, $768/yr); `/api/stripe/checkout` (creates a Checkout Session, annual default, **no trial**, cancel-at-period-end); `/api/stripe/webhook` (sync subscription status). Pricing page CTA swaps from `#newsletter` to Checkout.
- **First gated number: owner take-home / margin detail** on cell pages, via the decided **prerender-free + authed-API** path: the static HTML ships a `RedactedNumber` placeholder (true value never in the HTML, per the v34 no-leak gate); a signed-in subscriber's browser fetches the real value from `/api/cell-snapshot` which checks entitlement server-side. One calm inline "Unlock" prompt. Cancel = access to period end, no refund.
- Founder credential steps: create the Stripe account + products, set `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET`, register the webhook endpoint.

## Milestone 3 outline (Premium tools — after M2)

Exports (the `/api/export-csv` route exists, gate it on Premium), neighborhood-level depth, side-by-side comparison, and email alerts on watched cells. All entitlement-gated via the same `getViewerTier()` + authed-API pattern.

## Security constraints (carried from v34 + repo rules)

- A gated number's TRUE value must NEVER reach the browser in static HTML, data attributes, aria fields, or JSON-LD (M2). Reveal only via the authed API after an entitlement check.
- Never print/commit a secret (service-role key, Stripe secret, webhook secret). Env var names only in source.
- No em-dashes / source-agency names / raw hex in user-visible source. No `--no-verify`. Per-file staging.
- All auth/middleware code fail-soft: an error degrades to signed-out, never a 500.
