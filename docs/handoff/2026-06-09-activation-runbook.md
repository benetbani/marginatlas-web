# Activation Runbook (founder-only) — 2026-06-09

Everything built for accounts and monetization ships **dormant behind flags**, so
production is unchanged until you do the steps below. This is the single ordered
runbook to take it live. It supersedes the M1-only note
(`2026-06-08-m1-activation.md`); follow this one top to bottom.

Nothing here needs an engineer. Each stage is independently safe: you can stop
after any stage and the site stays coherent.

---

## What is already built and live (but dormant)

- **Accounts (M1):** magic-link sign-in, `/account`, saved cells. Off until
  `NEXT_PUBLIC_AUTH_ENABLED=1`.
- **Subscriptions (M2):** Stripe checkout + webhook, entitlement lookup. Returns
  503 until the Stripe env is set.
- **The owner-take-home paywall (M2-3):** the figure is gated on all four
  surfaces (cell board, city table, industry table, Compare). Off until
  `NEXT_PUBLIC_GATING_ENABLED=1`. Verified no-leak on a preview.
- **Pricing CTA:** auto-switches from the newsletter signup to a real Checkout
  button once auth + Stripe are configured. No edit needed.

---

## Stage 1 — Turn on accounts (M1)

1. **Apply the accounts migration.** In the Supabase SQL Editor, run
   `db/migrations/2026-06-08-accounts-saved-cells.sql` (profiles, saved_cells,
   watchlist, recent_cells, with row-level security + the auto-profile trigger).
2. **Enable the email provider.** Supabase dashboard, Authentication, Providers,
   Email: enable, with "Confirm email" on (magic link).
3. **Allowlist the redirect URL.** Supabase, Authentication, URL Configuration,
   add `https://marginatlas.com/auth/callback` (and your preview domain if you
   want to test there). Set the Site URL to `https://marginatlas.com`.
4. **Set the flag.** Vercel, Project, Settings, Environment Variables (Production
   + Preview): `NEXT_PUBLIC_AUTH_ENABLED=1`. Redeploy (any push, or Vercel,
   Deployments, Redeploy).
5. **Verify.** Visit `/signin`, request a link, confirm it lands on `/account`.
   Save a cell from any cell page and confirm it appears under `/account`.

After Stage 1: visitors can make free accounts and save cells. No paywall yet.

---

## Stage 2 — Turn on subscriptions (M2, Stripe)

> Auth (Stage 1) must be on first.

1. **Create the products + prices in Stripe** (live mode), each with a monthly
   and an annual price:
   - **Basic** — $37 / month, $372 / year
   - **Premium** — $77 / month, $768 / year

   Copy the four price IDs.
2. **Apply the subscriptions migration.** In the Supabase SQL Editor, run
   `db/migrations/2026-06-09-subscriptions.sql` (one subscription row per user;
   read-own RLS, writes happen only in the webhook via the service role).
3. **Set the Stripe env** in Vercel (Production + Preview):
   - `STRIPE_SECRET_KEY` (live secret key)
   - `STRIPE_PRICE_BASIC_MONTHLY`, `STRIPE_PRICE_BASIC_ANNUAL`
   - `STRIPE_PRICE_PREMIUM_MONTHLY`, `STRIPE_PRICE_PREMIUM_ANNUAL`
4. **Add the webhook.** Stripe, Developers, Webhooks, add endpoint
   `https://marginatlas.com/api/stripe/webhook` (use your canonical domain; add
   `www` if that is canonical) subscribed to
   `customer.subscription.created`, `customer.subscription.updated`,
   `customer.subscription.deleted`. Copy the signing secret into Vercel as
   `STRIPE_WEBHOOK_SECRET`.
5. **Redeploy.** The pricing CTA now reads "Continue with Basic / Premium" and
   starts a real Checkout. The paywall is still OFF (numbers still show in full).
6. **Verify with a real (or test-clock) subscription.** Subscribe as a test
   user; confirm a row lands in `subscriptions` and `/account` shows the tier.

After Stage 2: people can subscribe. Numbers still show in full to everyone
(the gate is the next stage).

---

## Stage 3 — Turn on the paywall (M2-3)

> Do this ONLY after Stages 1 and 2. The gate is wired on all four surfaces at
> once, so there is no leak: the cell board, the city everyday-trades table, the
> industry places table, and the Compare grid all redact owner take-home
> together.

1. **Set the flag** in Vercel (Production): `NEXT_PUBLIC_GATING_ENABLED=1`.
   Redeploy.
2. **Verify the three states:**
   - **Signed-out / free:** owner take-home shows the redacted placeholder
     (`$••,•••`) with a quiet "unlock with Basic"; the real value is not in the
     page source.
   - **Basic / Premium subscriber:** the real take-home appears (fetched by the
     browser from the authed `/api/cell-take-home`).
   - Every other number (revenue, wages, margins) is unchanged for everyone.
3. **Kill switch:** set `NEXT_PUBLIC_GATING_ENABLED=0` (or remove it) and
   redeploy to instantly revert to fully-open numbers.

---

## Stage 4 — City-data fill routine (one-time)

The scheduled `city-data-fill` routine that researches and stages city-specific
data still needs **one "Run now" click** to pre-approve its tools. Until then it
will not run on schedule. Open the routine and click **Run now** once.

---

## Quick reference — flags and env

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_AUTH_ENABLED` | Vercel | Accounts + sign-in (Stage 1) |
| `NEXT_PUBLIC_GATING_ENABLED` | Vercel | The owner-take-home paywall (Stage 3) |
| `STRIPE_SECRET_KEY` | Vercel | Stripe server key (Stage 2) |
| `STRIPE_PRICE_BASIC_MONTHLY` / `_ANNUAL` | Vercel | Basic price IDs |
| `STRIPE_PRICE_PREMIUM_MONTHLY` / `_ANNUAL` | Vercel | Premium price IDs |
| `STRIPE_WEBHOOK_SECRET` | Vercel | Verifies webhook signatures |

| Migration | Apply in |
|---|---|
| `db/migrations/2026-06-08-accounts-saved-cells.sql` | Supabase SQL Editor (Stage 1) |
| `db/migrations/2026-06-09-subscriptions.sql` | Supabase SQL Editor (Stage 2) |

**Order matters:** auth, then Stripe, then the gate. Each stage is safe to stop
at. The gate without auth would only ever show placeholders; auth without the
gate is just free accounts. Both are fine intermediate states.
