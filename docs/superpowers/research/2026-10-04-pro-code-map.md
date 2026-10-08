# What exists for Pro (read-only map, 2026-10-04 night, for milestone 2)

> **Superseded as a map of the code (the checkup of 2026-10-08).** Milestone 2 was built after this was written (masterplan
> of 2026-10-05, then the checkup fixes of 2026-10-06), so it describes the code before Pro. Of its nine "missing" items,
> eight are built: one plan at $38/$238 (`src/lib/monetization/plan.ts`), checkout first with the account made from the
> checkout email, the portal and the annual button, the UK levels locked server-side with a `/pro` mirror, no pop-up, the
> locked sections' structured data, the old prices left only in history comments, trialing no longer entitled. The ninth,
> the tables applied to the live database, is his (LAUNCH-SWITCHES row 2). The paid layer as it stands, and what two tiers,
> a logged-in menu, an API and an MCP server would need, is in `docs/checkup/2026-10-08.md`. Kept as the record of the
> starting point.

Read on branch `milestone-1` (cd2185a6); nothing below differs from `main` 38f81e8a except a no-op in `analytics.ts`. No `.env*`
file was opened, so what production has set is unknown. The ruling it is measured against: his interview of 2026-09-26,
`E:/atlas/design/loop/build/INTERVIEW-2026-09-26.md` (milestone 2, around lines 88 to 95): Pro at $38 a month or $238 a year,
Stripe checkout first, the account made from the checkout email, no trial; on UK pages each chapter's first level free and the
rest locked (title, icon, blurred drawing, one line, one button, never a pop-up); locked sections' structured data.

**In one line:** nearly all the machinery exists, switched off, built for the old Basic and Premium plans, and wired to no live page.

## 1. Flags (`src/lib/feature_flags.ts`)

- `NEXT_PUBLIC_AUTH_ENABLED` via `isAuthEnabled()` (L74), default OFF: the master switch for sign-in, sessions, checkout and saved
  cells. Readers: `src/lib/auth/session.ts:18`, `src/lib/monetization/entitlement.ts:22`, `src/app/api/stripe/checkout/route.ts:31`,
  `api/saved-cells/route.ts:42,83`, `api/cell-take-home/route.ts:67`, `api/export-csv/route.ts:138`, `app/auth/callback/route.ts:19`,
  `app/auth/signout/route.ts:13`, `(site)/account/page.tsx:49`, `(site)/signin/SignInForm.tsx:32`, `components/HeaderAuth.tsx:15`,
  `components/monetization/GatedTakeHome.tsx:34`, `(site)/pricing/page.tsx:240`.
- `NEXT_PUBLIC_GATING_ENABLED` via `isGatingEnabled()` (L86), OFF: hides owner take-home and makes CSV history Premium only
  (`TakeHomeValue.tsx:27`, `CompareClient.tsx:188`, `api/cell-lookup/route.ts:297`, `cell-take-home:67`, `export-csv:138`).
- `NEXT_PUBLIC_ACCOUNT_PREVIEW` via `isAccountPreviewEnabled()` (L63), OFF: `AccountPreview.tsx:73` picks a dummy design or
  "Coming soon".
- `NEXT_PUBLIC_REVIEW_UNVEIL` via `isReviewBuild()` (L160): true in any non-production build; its only reader is
  `src/app/dev/spine/page.tsx:961`. `LockVeil` does NOT read it, whatever the flag's comment says.
- Billing has no flag: `pricing/page.tsx:240` computes `billingLive = isAuthEnabled() && !!STRIPE_SECRET_KEY` at build time.
- No pro, paywall or billing flag exists; `isSpineReformEnabledFor` (L201) has nothing to do with paywalls.

## 2. Stripe (two routes, no customer portal; commits 833f2cd1 and 31ce4471 of 2026-06-08/09; `stripe ^22.2.0`)

- `src/app/api/stripe/checkout/route.ts`: POST `{tier: basic|premium, interval: month|year}`. 503 unless auth is on and
  `STRIPE_SECRET_KEY` is set (L31); **401 with no signed-in user** (L35). `PRICE_IDS` (L18-27) reads
  `STRIPE_PRICE_BASIC_MONTHLY`, `_BASIC_ANNUAL`, `_PREMIUM_MONTHLY`, `_PREMIUM_ANNUAL`. The session (L53-63): subscription mode,
  `customer_email`, `client_reference_id`, `supabase_user_id` metadata, success `/account?upgraded=1`, cancel `/pricing`, no
  trial; it writes nothing to the database.
- `src/app/api/stripe/webhook/route.ts`: needs `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` (503 otherwise, L46); **verifies
  the signature** with `constructEvent` (L56), 400 on failure; handles only `customer.subscription.created|updated|deleted`
  (L62-66); `priceTier()` (L19-32) maps a price id back to basic or premium; upserts `public.subscriptions` on `user_id` through
  `supabaseAdmin` (`SUPABASE_SERVICE_ROLE_KEY`, `src/lib/supabase.ts:12`) with tier, status, `stripe_customer_id`,
  `stripe_subscription_id`, `current_period_end`, `cancel_at_period_end`, `updated_at` (L75-88); skips an event without
  `supabase_user_id` (L70); swallows database errors (L91-94).
- `CheckoutButton.tsx`: a 401 goes to `/signin?next=/pricing` (L42-44), any other failure to `#newsletter`. The pricing page
  never passes `interval`, so checkout is always monthly.

## 3. Accounts (Supabase magic link through `@supabase/ssr`)

- `/signin` (`SignInForm.tsx:54` `signInWithOtp`), then `auth/callback` (`exchangeCodeForSession`, L25); "Coming soon" with the
  flag off. `/account` redirects to sign-in, then lists saved cells; it shows no plan. `/saved` and `/you` are browser storage
  only. `HeaderAuth` is mounted at `SiteChrome.tsx:119`. No session refresh in the middleware.
- A sign-in makes the `auth.users` row; the `handle_new_user` trigger adds `public.profiles`.
- Pro is known by a `subscriptions` row (tier check `free|basic|premium`), read by `getSessionTier()` (`entitlement.ts:21-45`,
  which also counts "trialing"); no cookie; `getViewerTier()` returns "free" for every static render.
- Migrations `db/migrations/2026-06-08-accounts-saved-cells.sql` and `2026-06-09-subscriptions.sql`: **not applied** to the live
  database (CLAUDE.md "Manual actions", `scripts/query_outcomes.ts:49-50`).

## 4. Paywall drawings

- `src/components/monetization/` (Basic/Premium wording): LockPill, RedactedNumber, BlurredOverlay (6px blur, card, button),
  TruncatedTease, GhostBar, QuartileMarkers, MoreDepthBanner, GatedTakeHome/TakeHomeValue, CheckoutButton, PaywallModalRoot,
  `paywall_copy.ts`. Every lock opens **the modal**, whose buttons link to `/pricing`.
- Mounted live: `PaywallModalRoot` on every page (`src/app/layout.tsx:226`); `TakeHomeValue` (`industries/[industry]/page.tsx:740`)
  and Compare (`:188`), active only with gating on; `UpgradeTeaser` (`src/app/page.tsx:576`, the old home page). The rest only on
  `/_design/monetized`, `/dev/lock-states`, `/dev/pricing2`. The cell page's gate was reverted
  (`[country]/[geo]/[industry]/page.tsx:89-93`); the city table (`cities/[slug]/page.tsx:714-730`) is ungated.
- The spine's own kit (`src/components/spine/kit-index.tsx`): `LockVeil` (L398-419) blurs the real content at 5px **but leaves it
  in the HTML**, with a lock tile, a headline, a note and an "Unlock with Pro" button that only calls `onUnlock`; `LockPill`
  (L424). Used only by `atlas-index.tsx:540` (mounted on `/dev/index-*`) and other dev routes.
- **No live spine page (cell, industry, city, hood, country) uses any lock.** `BlockedSeat` is a "not gathered yet" seat, not a
  paywall. The one Pro mention live: the country page's last card, "Get notified when Pro opens", to `/pricing`
  (`src/lib/spine/close_rows.ts:43`, `copy.ts:589`). `Zone` (`zones.tsx:84`) takes `chapter` on a chapter's first zone; it has no
  lock prop.

## 5. Pricing page (`src/app/(site)/pricing/page.tsx`)

Free $0, Basic $37, Premium $77; annual as $31 a month ($372 a year) and $64 ($768) (`paywall_copy.ts:54-77`); the metadata repeats
$37/$77 (L54-56). Free's button is static; the paid buttons are "Notify me when ... opens" links to `#newsletter` (L279-288), or
`CheckoutButton` once billing is live.

## 6. Structured data

Only `isAccessibleForFree: true` on the Dataset (`src/components/StructuredData.tsx:119`). No `false`, `hasPart` or `cssSelector`
anywhere in `src`.

## 7. Gates and tests

- `scripts/verify_monetization_coverage.ts` (in the chain, `prebuild_all.ts:392`): checks A to E per page; check B passes only
  while `<PaywallModalRoot />` is in the layout (`audit/monetization/page_checks.ts:46-58`).
- `scripts/verify_v34_research_rules.ts` (`:393`): bans trial copy, the word "refund" (L128), countdowns, .99 prices, "Upgrade
  now" and padlock icons inside `components/monetization`; requires "billed annually", the cancel-anytime block and `blur(6px)`.
- `query_outcomes.ts`, `verify_launch_ready.ts` (by hand) expect the two tables absent. `tests/`: nothing on Stripe, paywalls or
  subscriptions.

## What the ruling needs that is missing

1. One Pro plan: the code has Basic/Premium at $37/$77; no $38/$238 prices, no Pro price-id variables; the database's tier check
   allows only `basic` and `premium`.
2. Checkout first: checkout demands a signed-in user (401); no `checkout.session.completed` handler; nothing makes a user from the
   checkout email; `subscriptions.user_id` needs an existing auth user.
3. No customer portal or cancel route although the copy promises "cancel any time"; no annual button.
4. No paywall on UK pages: no gate that knows chapters or levels, no entitlement check, no UK scoping; `LockVeil` has no checkout
   and ships the locked content in static HTML (the take-home path hides the value on the server instead).
5. "Never a pop-up" conflicts with the modal on every page and with `verify_monetization_coverage` check B.
6. No locked-section structured data.
7. The two tables are not applied to the live database.
8. Old prices and wording remain on `/pricing`, its metadata, the old home page's `UpgradeTeaser`, the country page's notify link;
   `README.md:21` is stale.
9. `verify_v34_research_rules` bans the word "refund", which collides with drafting refund terms; paywall analytics does nothing;
   "trialing" still counts as entitled although his ruling has no trial.

**His alone:** the Stripe account and live keys, the price objects in Stripe, applying the two migrations in the Supabase SQL
editor, his VAT registration, approving the terms, privacy and refunds wording.
