# Launch switches: what to turn on, in order, on launch day

Written by step 10 of the masterplan (2026-10-05) and completed by step 38 the same night, in the order you work: your desk
first, then Supabase, Stripe, Vercel, the push, and the checks after the deploy. Nothing here is turned on by the code: every
row is a click or a setting, and only you make it. Do them top to bottom: each one needs the ones above it.

Two things never to do on launch day: never add `NEXT_PUBLIC_SHOW_SAMPLE_MARKS` anywhere (your ruling 5: the sample marks stay
off; the `sample-switch` gate fails any build with them on), and never run `db/migrations/2026-06-09-subscriptions.sql` (the
October file replaces it).

| # | Where | What to do | What you should see |
|---|---|---|---|
| 1 | Your desk | Approve the legal drafts in `E:/atlas/design/loop/build/m2/legal/PRO-LEGAL-DRAFT.md` (PARKED P30.1), fill the gaps marked `[HIS: ...]` in `src/lib/legal/pro_legal.ts` (P30.2: who we are, the address, the contact), and move `PRO_LEGAL_UPDATED` to the day you approve. The terms, privacy and cookies pages draw these drafts once the paywall's switch is on (row 10). | `npx tsx tests/legal/pro_legal.test.ts` passes and prints "gaps for him: 0". |
| 2 | Supabase, SQL Editor | Run `db/migrations/2026-06-08-accounts-saved-cells.sql`, then `db/migrations/2026-10-05-pro-subscriptions.sql`. | "Success. No rows returned" for each. Then `npm run query:outcomes` shows `profiles`, `saved_cells`, `watchlist` and `subscriptions` each "ok: 0 rows". |
| 3 | Supabase, Authentication | Turn the Email provider on; add `https://www.marginatlas.com/**` to the redirect URLs. | Both saved. The sign-in test waits for the deploy (row 13). |
| 4 | Stripe, Product catalogue | Create the product "Pro" with two prices in US dollars: $38 every month and $238 every year, both tax-inclusive (your ruling on P09.1: the prices include VAT). | Two price ids starting `price_`. |
| 5 | Stripe, Settings, Customer portal | Allow cancelling at the end of the period and updating the card; set the return link to `https://www.marginatlas.com/account`. | The portal preview shows "Cancel plan". |
| 6 | Stripe, Settings, Checkout | Set your terms link to `https://www.marginatlas.com/terms` (once row 1 is done). | The link saved; Checkout can ask for consent (row 10 turns it on). |
| 7 | Stripe, Tax | Turn on Stripe Tax with your VAT registration (P09.1). | The registration listed as active. |
| 8 | Stripe, Settings, emails, invoices and billing | Make the receipt Stripe emails after a payment carry the checkout's consent line, for example in the footer it prints on receipts (P30.3: the law asks for that confirmation on a durable medium); turn on the email before a subscription renews, for yearly plans at least (the terms promise it). | A test receipt reads "I ask for access to start now, so my 14-day right to cancel ends when access begins." |
| 9 | Stripe, Developers | Copy the live secret key. Add the webhook endpoint `https://www.marginatlas.com/api/stripe/webhook` with four events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`; copy its signing secret. Both go straight into Vercel (row 10), never anywhere else. | The endpoint listed as enabled. |
| 10 | Vercel, Settings, Environment Variables, Production | Set ten: `STRIPE_SECRET_KEY` (the live key), `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PRO_MONTHLY` and `STRIPE_PRICE_PRO_ANNUAL` (row 4's ids), `STRIPE_TERMS_CONSENT=1`, `STRIPE_AUTOMATIC_TAX=1`, `NEXT_PUBLIC_AUTH_ENABLED=1`, `NEXT_PUBLIC_PAYWALL=1` (it does nothing without the one before), `NEXT_PUBLIC_HOME_REFORM=1` (the new home page), `NEXT_PUBLIC_WEB_ANALYTICS=1`. | The ten listed under Production. |
| 11 | Vercel, Analytics | Enable Web Analytics for the project (PARKED P0.1). | The Analytics tab says it is enabled. |
| 12 | The repo, your terminal | After your review, push the night branch `night-2026-10-05` and merge it into `main`; then the branch `launch-day`, one commit on top of it that deletes `NEXT_PUBLIC_SITE_PRIVATE=1` from `.env.production` and adds nothing. Vercel builds production from `main`. | The build passes its chain; `sample-switch` prints "the site is public, the marks are off by ruling 5, and its honesty stands". |
| 13 | Your terminal, after the deploy | `npm run deploy:watch -- --marker="if you form a company" --marker-url=/` (a line only the new home page prints), then `npm run launch:check -- --marker="if you form a company" --marker-url=/`. If you want a purchase before the live keys, do it first in Stripe's test mode with test keys. | deploy:watch finds the marker on `/`; launch:check ends "LAUNCH READY" or names each reason. `/pricing` offers the two buttons; a checkout ends on `/welcome` saying Pro is yours; a magic link from `/signin` signs you in (row 3). |
| 14 | Google Search Console | Submit the seven sitemaps `robots.txt` lists: `https://www.marginatlas.com/sitemap/0.xml` to `4.xml`, `6.xml` and `7.xml` (shard 5 stays out on purpose: the neighbourhood pages withdrawn on 2026-08-08). | "Success" for each. |
| 15 | Your own accounts | The launch posts (step 39), on launch day after row 13 passes: the drafts and where each goes are in `E:/atlas/design/loop/build/launch/posts/`. | Each posted by you, from your account. |
