# 39 · Track II — Auth + Stripe + Pro Features

> Supabase Auth (magic link + Google OAuth) + Stripe checkout +
> Pro feature gating. Founder hasn't asked for this yet, but it's
> on the original roadmap (Plan v4 §28+§29).

---

## 1 · Goal

Real user accounts. Real paid tiers. Real recurring revenue.

---

## 2 · Sub-tracks

### II.1 — Supabase Auth setup

1. Supabase dashboard → Authentication → enable Email magic link + Google OAuth
2. Configure redirect URLs (production + preview)
3. Add Google OAuth credentials to Supabase

Founder action: ~15 min.

### II.2 — Auth context provider

`src/lib/auth.tsx`:
- `<AuthProvider>` wraps `RootLayout`
- `useAuth()` hook returns `{ user, signIn, signOut }`
- Server-side: `getServerUser()` from cookies

Effort: 2 hr.

### II.3 — Sign-in page

`/sign-in` route with:
- Email input → "Send magic link"
- "Sign in with Google" button
- Returns to last page after auth

Effort: 1.5 hr.

### II.4 — Avatar + menu in header

`<UserMenu>` in `RootLayout` header:
- When signed out: "Sign in" link
- When signed in: avatar + dropdown (Account, Saved, Billing, Sign out)

Effort: 1.5 hr.

### II.5 — Saved-cells migration

When user signs in for the first time:
1. Check localStorage for any saved cells
2. Prompt "Sync N saved cells to your account?"
3. If yes: POST to /api/user/saved with the list
4. Server inserts into `user_saved_cells` table

Effort: 2 hr.

### II.6 — Stripe setup

1. Stripe dashboard → create products:
   - Starter $38/mo / $304/yr
   - Pro $78/mo / $624/yr
   - Enterprise (invoice-only)
2. Webhook endpoint at `/api/stripe/webhook`
3. Customer portal session for billing management

Founder action: ~30 min in Stripe dashboard.

### II.7 — Checkout flow

`/api/stripe/checkout`:
- Auth-gated (sign in first)
- Creates Checkout session per tier
- Redirects to Stripe-hosted checkout

`/api/stripe/webhook`:
- Handles `checkout.session.completed`
- Inserts row in `user_subscriptions`
- Flips `is_pro` flag on user

Effort: 3 hr.

### II.8 — Pro feature gating

Replace `?pro=1` URL flag with real `isPro(user)` server check.

Pro features:
- Regional tax overlay (US states, DE Länder)
- 100k-row CSV export
- Parquet downloads
- Unlimited saved cells
- Unlimited /ask queries (vs 10/hour free)
- Custom API key with rate limit

Effort: 3 hr.

### II.9 — `/account` page

For signed-in users:
- Email + Google identity
- Current tier
- Usage stats (cells viewed, asks used, exports)
- Billing portal link
- Saved-cells list with management

Effort: 2 hr.

### II.10 — `/account/billing`

Stripe Customer Portal session iframe OR link-out:
- Update payment method
- Cancel subscription
- Download invoices

Effort: 1 hr.

### II.11 — Email notifications

Transactional emails (via Resend or Supabase native):
- Welcome on sign-up
- Subscription confirmation
- Payment failed
- Cancellation confirmation

Effort: 2 hr.

---

## 3 · Steps + effort

| Step | Effort |
|---|---|
| II.1 Supabase Auth (founder) | 15 min |
| II.2 Auth context | 2 hr |
| II.3 Sign-in page | 1.5 hr |
| II.4 UserMenu | 1.5 hr |
| II.5 Saved migration | 2 hr |
| II.6 Stripe setup (founder) | 30 min |
| II.7 Checkout + webhook | 3 hr |
| II.8 Pro gating | 3 hr |
| II.9 /account page | 2 hr |
| II.10 /account/billing | 1 hr |
| II.11 Email notifications | 2 hr |
| **Total** | **~18 hr engineering + ~45 min founder** |

---

## 4 · Verification gate

- Sign-in works via magic link + Google
- Stripe checkout flow completes end-to-end on a test card
- Pro user sees regional tax overlay; free user doesn't
- Webhook flips `is_pro` flag correctly
- /account renders user data
- Saved-cells migrate on first login

---

## 5 · What this unlocks

- Revenue path live
- Real moats (user accounts, saved data)
- Foundation for Pro-tier API access (Track NN)
