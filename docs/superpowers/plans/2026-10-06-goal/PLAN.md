# The deep goal (2026-10-06)

His words, verbatim in rules/FOUNDER-VERDICTS.md ("The deep goal"): deeper backend and SaaS functions, planning, debugging, the
architecture checked, obsolete files removed, the structure solidified, unfinished tasks and cleanups, a better home page, a
very high standard. Branch `goal-2026-10-06` from live `main` bd78bb1c. The ranking is the checkup's (docs/checkup/2026-10-06.md);
the unfinished-work and backend surveys behind it are summarised there.

**Binding:** no switch flipped, no Stripe/Supabase/Vercel/DNS setting changed, no migration applied (files only, his to run),
no deploy without his word, no invented figure, no `.env` value printed; the copy, page-law and like-for-like rules; one
hypothesis per commit, its gate run before the next; the full chain before any push. "Make the homepage better" lifts DOCTRINE
section 11's home-page exclusion for this goal; the hero (his design, his curated words) is left as it is and its gaps go to
him as a choice.

## Batches, in order (each: build, its own gates, commit; the full chain at the end of a batch)

### A. The SaaS layer made safe before launch (checkup findings 1 to 4)
1. Row level security on every form table: `db/migrations/2026-10-06-rls-forms.sql`; gate `migrations-rls` (a migration
   that creates a table enables it in the same file); LAUNCH-SWITCHES row 2 names the file.
2. Billing core: the account by Stripe customer first; the reader's state re-derived from all of the customer's
   subscriptions on every event; `billing_events` (migration file) recorded per event, the webhook working without it;
   Sentry on failure; tests for duplicates, out-of-order events and a changed email.
3. Checkout: a Pro reader goes to the portal; an existing customer is reused.
4. Reconcile: `scripts/billing/reconcile.ts`, a dry run by default, his to run after launch.
5. The public data API redacts what the paywall locks while `isPaywallOn()`.
6. Per-route rate limits on the routes that have none (checkout, portal, lookups, take-home, saved cells).
7. Sign-in: the session refreshed in the middleware; the callback's error shown on /signin.
8. The forms stop storing the sender's IP and user agent, so the privacy page's "what you gave us and nothing more" is true.

### B. Pages that promise nothing they cannot keep, and a better home page (findings 5)
1. The home page's ask: his ruled "notify me when my place reaches this depth" in place of the free-report PDF.
2. The notebook: the newest posts across categories, text first, no repeated photograph.
3. `/download/2026-benchmarks` redirects to `/data`, the real free pack; nothing promises the PDF.
4. `/account`'s saved-cells line says what is true.
5. The answer level's middle card without its hole, if a figure the feed holds can fill it honestly.
6. Harness at zero on home-gb; photographs at 1280 and 375.

### C. The structure (findings 6 to 8)
1. `tsconfig.json` excludes the scratch folders (measured before and after).
2. Per-icon phosphor imports (measured).
3. The twelve unreachable files deleted, each checked by grep; comments citing them struck.
4. Old prototype generations (`/dev` routes and kits no gate reads) deleted under the tag `archive/dev-2026-10-06`.
5. One carrier for the counts block.
6. Ratchet baselines lowered by their writers where today's counts are lower.

### D. Unfinished code-only rows from the survey, by launch value
city:invented-words-elsewhere; copy:legacy-modeled-strings (if mounted); ui:exit-intent-dead; the `.env.production` comment
that contradicts ruling 5 (comment only, no value); the stale entry in the geo-link baseline; the v34 placeholder checks.

### E. The record
The checkup ledger's deltas after the changes; the handoff; STATE.md; memory; his word asked before any push.

## Ledger

(appended as each batch lands)
