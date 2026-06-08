# Monetization Milestone 2: The First Paywall (Plan + Activation)

> Repo constraints as before: no local build/tsc; commit on `reform-v2/palette-brick`; ship by fast-forward; per-file staging. **Secrets:** Stripe keys live in Vercel env + `.env.local`, never in source. Reference env var NAMES only.

**Goal:** Gate the **owner take-home** number behind Basic ($37) so the static page never leaks the real value, a free user sees a redacted placeholder with one calm "Unlock", and an entitled subscriber sees the real number fetched from an authed API. Plus the Stripe subscription machinery to sell Basic/Premium.

**Status:** the plumbing is built and shipped **dormant**. The gating wiring (M2-3) is specced below and is best built with Stripe live so the subscriber reveal can be verified end to end.

## What shipped dormant (M2-1 + M2-2)

- **Entitlement:** `db/migrations/2026-06-09-subscriptions.sql` (a `subscriptions` row per user: tier/status/stripe ids/period end, RLS **read-own only** — writes happen in the webhook via the service role, so a viewer can never grant themselves a tier). `src/lib/monetization/entitlement.ts` `getSessionTier()` reads it (async, fail-soft to "free"). This is **separate** from the sync `viewer_tier.getViewerTier()` (always "free"), which the static prerender uses so a tier is never baked into static HTML.
- **Stripe:** `/api/stripe/checkout` (creates a Checkout Session for Basic/Premium monthly/annual, **no trial**) and `/api/stripe/webhook` (verifies the signature, syncs subscription status into `subscriptions` via the service role). Both return 503 until the env is set. `stripe` dep added.

## Stripe activation checklist (founder-only)

1. **Stripe dashboard:** create two products, **Basic** and **Premium**, each with a **monthly** and an **annual** price (Basic $37/mo + $372/yr; Premium $77/mo + $768/yr). Copy the four price IDs.
2. **Vercel env (Production + Preview):** set `STRIPE_SECRET_KEY`, `STRIPE_PRICE_BASIC_MONTHLY`, `STRIPE_PRICE_BASIC_ANNUAL`, `STRIPE_PRICE_PREMIUM_MONTHLY`, `STRIPE_PRICE_PREMIUM_ANNUAL`. (Auth must already be on from M1: `NEXT_PUBLIC_AUTH_ENABLED=1`.)
3. **Webhook:** in Stripe, add an endpoint `https://www.marginatlas.com/api/stripe/webhook` subscribed to `customer.subscription.created/updated/deleted`. Copy the signing secret into Vercel as `STRIPE_WEBHOOK_SECRET`.
4. **Apply the migration:** run `db/migrations/2026-06-09-subscriptions.sql` in the Supabase SQL Editor.
5. **Pricing CTA:** the pricing page CTA still points at the newsletter; once Stripe is live, switch it to POST `/api/stripe/checkout` (a small edit, noted in M2-3).
6. **Flip the gating flag:** `NEXT_PUBLIC_GATING_ENABLED=1` to turn the paywall on (see M2-3). Until then every number shows in full.

## M2-3: the no-leak gating (spec, build with Stripe live)

**Hard rule (v34 Gate D):** the true owner-take-home value must NEVER appear in the static HTML, a data attribute, an aria field, or JSON-LD. The static page ships only the placeholder; the real value comes from the authed API.

**Flag:** `NEXT_PUBLIC_GATING_ENABLED` (default off). Off = every number shows in full, exactly as today. On = the gating below.

**The four surfaces that render owner take-home (must gate together, or it leaks):**
1. **Cell board** `src/lib/scores/cell_board.ts:412` ("Owner take-home" StatRow, section A) + the cell page. This is SSG.
2. **City table** `src/app/cities/[slug]/page.tsx` (the two-column everyday-trades; `a.takeHome`).
3. **Industry places table** `src/app/industries/[industry]/page.tsx` (`p.takeHome`).
4. **Compare grid** `src/app/compare/CompareClient.tsx`, fed by `/api/cell-lookup` which currently returns the real `owner_take_home` to anyone.

**Pattern (mirror the shipped `QuartileMarkers`):** at render, compute `const shown = isGatingEnabled() ? gateValue(takeHome, "basic", getViewerTier()) : takeHome;`. Since `getViewerTier()` is "free" on the static render, `shown` is `null` when gating is on -> render `<RedactedNumber tier="basic" entry="cell_owner_take_home" ariaLabel="Owner take-home, unlock with Basic" />` instead of the number. The real value is never emitted. (StatGrid needs a small `node?: ReactNode` escape on StatRow so the board cell can render the component; the city/industry tables render it inline.)

**Authed reveal (client island):** a small client component, mounted where the placeholder is, that — only when `NEXT_PUBLIC_AUTH_ENABLED` — fetches `/api/cell-take-home?country=&geo=&industry=` and, if the response carries a value (the API ran `getSessionTier()` and the viewer is Basic+), swaps the placeholder for the real number. New route `src/app/api/cell-take-home/route.ts`: resolves the cell, computes take-home via the single source of truth (`resolveOwnerTakeHome`), and returns the value ONLY if `getSessionTier()` is basic/premium; otherwise `{ value: null }`.

**Close the API leak:** `/api/cell-lookup` (used by Compare) must redact `owner_take_home` to `null` when gating is on and `getSessionTier()` is free, then the Compare grid renders `RedactedNumber` for the null.

**Pricing CTA:** swap the Basic/Premium CTA from `#newsletter` to a POST to `/api/stripe/checkout` (`{ tier, interval }`) and redirect to the returned `url`.

**Why build this with Stripe live:** the flag-off and flag-on-free states are verifiable now (placeholder shows, no leak), but the *subscriber reveal* (a Basic user sees the real number) can only be verified with a real subscription, which needs the Stripe setup above. So the safe sequence is: founder does the Stripe checklist -> we build + ship M2-3 behind the flag -> verify the free (redacted) and subscribed (revealed) states on a preview -> flip the flag.

## Milestone 3 (after M2): Premium tools
Exports (gate the existing `/api/export-csv` on Premium), neighborhood-level depth, side-by-side comparison, and email alerts on watched cells — all via the same `getSessionTier()` + authed-API pattern.
