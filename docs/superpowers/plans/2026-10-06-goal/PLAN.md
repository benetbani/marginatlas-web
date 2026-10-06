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

Every commit below is on `goal-2026-10-06`, local; nothing pushed, nothing deployed, no switch flipped, no migration applied.
Each commit message carries its hypothesis, its before and after, and the gates it ran.

**A. The SaaS layer made safe before launch** (9f65b48b to 9addb39f). Full chain 251 of 251, 1,116 s.
- A1 9f65b48b: row level security written into the migrations as the live database already enforces it (anon writes refused
  on 13 of 13 tables, measured); `db/migrations/2026-10-06-rls-everywhere.sql`; gate `migrations-rls`.
- A2, A3 2abdb17a: one account and one governing subscription per Stripe customer, from the webhook and the checkout alike;
  `billing_events` per event (migration file, his to run), Sentry on failure; the core's tests 26 checks.
- A5 ee1507f2: `/api/cell-lookup` and the cell CSV leave out what the UK pages lock while the paywall is on; gate `api-redaction`.
- A8 12149f64: the contact and correction forms store what the reader gave and nothing more; gate `forms-minimal`.
- A6 bd4854bd: every API route has a rate limit or says why not; gate `api-route-limits`.
- A7 c0111b47: the middleware refreshes a session (private, no-store) and /signin says when a link fails; gate `session-refresh`.
- A4 9addb39f: `npm run billing:reconcile`, a dry run unless `--apply`; gate `billing-reconcile`.

**B. Pages that promise nothing they cannot keep, and a better home page** (32b29407 to 9d28180c, c4ccb083).
- B1, B3 32b29407: the home page asks his ruled "notify me when my city reaches this depth" (203 thin cities, each its own
  tag) in place of a PDF that did not exist; `/download/2026-benchmarks` redirects to `/data`.
- B2 90481f55: the notebook shows the newest post of each category, text first.
- B5 6208bc1c: the trades answer prints /gb's first four trades, so its level ends without a hole.
- B4 9d28180c: /account shows saved cells only when there are some.
- Follow-up c4ccb083: "download" left the route list with its page (the B+C chain's one red, 250 of 251, 1,212 s).

**C. The structure** (8cac8c11 to 7a071ac2, ecc19949).
- C1 8cac8c11 and C2 939957a7: the typecheck reads 3,402 files, not 6,725 (no scratch folders, no 3,026-icon barrel).
- C3 8450c04f: eleven files nothing reached, deleted. C4 96b99646: nineteen unlisted /dev explorations and the components
  only they reached, deleted, archived under the tag `archive/dev-2026-10-06`; routes 121 to 101.
- C4 fix ecc19949: AtlasBarChart restored, the restored /dev/trade-sections draws it. The typecheck was red from C4 to here,
  because it was run before the route came back and not after; the chain runs no typecheck. Nothing was pushed.
- C5 d25c66a7: one carrier for the generated counts (CLAUDE.md). C6 7a071ac2: the page-laws ratchet locked at what the pages meet.

**D. Unfinished rows and the faults found on the way** (898775ba to 9a9c1085).
- D1 898775ba: the district overview deleted; 1,266 of 1,266 district addresses redirected before it (measured), 1,155 lines.
- D2 fe491db4: no page sums a place up in a word or two (QUEUE city:invented-words-elsewhere, closed); `tagLabel` deleted,
  the recommender's stock sentences and chips gone; gate `no-place-words` (16 fixtures).
- D3 849e97fb: twelve trades carry a count noun ("Estimates for a typical new" was live on news publishing); trade-row-names 7b.
- D3b d37af472: a or an by sound; the recommender's headline "Where to open a restaurants" is "a restaurant"; trade-row-names 7c.
- D4 79f4129b: the exit-intent pop-up deleted (QUEUE ui:exit-intent-dead, closed); "exit_intent" and "lead_magnet_2026" off
  the newsletter's list.
- D5 6bfc30c4: the v34 coverage gate's ten pending stubs given rules (50 green, 0 pending); a pending check now fails.
- D6 4c98a368: the geo-link baseline lowered by its writer (7 to 5 constructions). D7 9a9c1085: .env.production's launch-day
  comment says what ruling 5 says.
- D2c 3006edf5 (after the final chain): no-place-words reads a formatter's argument as words; a destructured `character`
  was tried as a fifth wire and withdrawn (it hit the hood page's card of authored notes), named as a blind spot instead.
- Read and not changed: copy:legacy-modeled-strings was done by masterplan step 02 (every listed string reworded, the
  `legacy-method-words` gate reads them at zero), closed in QUEUE; seo:alias-canonical stays TODO by its own condition (a crawl
  report showing an alias indexed).

**The end.** Full chain on 9a9c1085: 252 of 252, 1,122.7 s, nothing died on memory (three lattice checks deferred by
their data, as in every run today). D2c after it: its gate and counts-fresh green. The typecheck reads 3,361 files. Deltas
in `docs/checkup/2026-10-06.md`, "After the changes".

**Deployed** on his word ("Deploy it now"), 2026-10-06 about 3:40pm: `main` 50ecd9e5, proven on production 23 of 23. The
first build (56dd5b10) failed on the postbuild edge-size guard, which read the Sentry-carrying Node webhook as an edge
function; 50ecd9e5 fixes the guard. `launch-day` 09bff036 on 50ecd9e5.
