# Launch switches: what to turn on, in order, on launch day

Written by step 10 of the masterplan (2026-10-05); step 38 completes it with the checks to run after each switch. Nothing here
is turned on by the code: every row is a click in Supabase, Stripe or Vercel, and only you make it. Do them top to bottom: each
one needs the ones above it.

| # | Where | What to do | What you should see |
|---|---|---|---|
| 1 | Supabase, SQL Editor | Run `db/migrations/2026-10-05-pro-subscriptions.sql`, then `db/migrations/2026-06-08-accounts-saved-cells.sql`. Never run `2026-06-09-subscriptions.sql` (superseded). | "Success. No rows returned" for each. `npm run query:outcomes` then counts `subscriptions` and `saved_cells` at 0 rows. |
| 2 | Supabase, Authentication | Email provider on; add `https://www.marginatlas.com/**` to the redirect URLs. | A test magic link from `/signin` arrives and signs you in. |
| 3 | Stripe, Product catalogue | Create the product "Pro" with two prices: $38 every month and $238 every year, in US dollars (tax-inclusive if you choose P09.1's recommendation). | Two price ids starting `price_`. |
| 4 | Stripe, Developers, API keys | Copy the live secret key into Vercel as `STRIPE_SECRET_KEY` (Production). | The key in Vercel, never anywhere else. |
| 5 | Stripe, Developers, Webhooks | Add the endpoint `https://www.marginatlas.com/api/stripe/webhook` with four events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`. Copy its signing secret into Vercel as `STRIPE_WEBHOOK_SECRET`. | The endpoint listed as enabled. |
| 6 | Stripe, Settings, Customer portal | Allow cancelling at the end of the period and updating the card; set the return link to `https://www.marginatlas.com/account`. | The portal preview shows "Cancel plan". |
| 7 | Your desk | Approve the legal drafts in `E:/atlas/design/loop/build/m2/legal/PRO-LEGAL-DRAFT.md` (PARKED P30.1) and fill their gaps marked `[HIS: ...]` in `src/lib/legal/pro_legal.ts` (P30.2); move `PRO_LEGAL_UPDATED` to the day you approve. The paywall's switch (row 13) makes the terms, privacy and cookies pages draw them. | `npx tsx tests/legal/pro_legal.test.ts` passes and prints "gaps for him: 0". |
| 8 | Stripe, Settings (emails, invoices and billing) | Make the receipt Stripe emails after a payment carry the checkout's consent line, for example in the footer it prints on invoices and receipts (P30.3: the law asks for that confirmation on a durable medium); turn on Stripe's email before a subscription renews, for yearly plans at least (the terms promise it). | A test receipt reads "I ask for access to start now, so my 14-day right to cancel ends when access begins." |
| 9 | Stripe, Settings, Checkout | Set your terms URL (`https://www.marginatlas.com/terms` once step 30's draft is approved), then set `STRIPE_TERMS_CONSENT=1` in Vercel. | Checkout shows the box asking consent to immediate access. |
| 10 | Stripe, Tax | Turn on Stripe Tax with your VAT registration, then set `STRIPE_AUTOMATIC_TAX=1` in Vercel. | Checkout asks for the billing address and shows the VAT line. |
| 11 | Vercel, Environment Variables | `STRIPE_PRICE_PRO_MONTHLY` and `STRIPE_PRICE_PRO_ANNUAL`, the two price ids from row 3 (Production). | Both set. |
| 12 | Vercel, Environment Variables | `NEXT_PUBLIC_AUTH_ENABLED=1`. | Sign-in appears in the site's header after the deploy. |
| 13 | Vercel, Environment Variables | `NEXT_PUBLIC_PAYWALL=1` (it does nothing without row 12). | The second half of each UK chapter shows its lock after the deploy. |
| 14 | Vercel, Environment Variables | `NEXT_PUBLIC_WEB_ANALYTICS=1`, and Analytics enabled for the project (PARKED P0.1). | Visits counting in Vercel's Analytics tab. |
| 15 | Vercel, Deployments | Redeploy production. | The deploy succeeds; `/pricing` offers the two buttons; a test checkout with a real card ends on `/welcome` saying Pro is yours. |
