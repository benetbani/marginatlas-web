# Phase G, steps 38 to 40: launch day made a list of his clicks, the posts drafted, the morning

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans, under `01-PROTOCOL.md`. Tick boxes here; record each
> step in `LEDGER.md`.

**His rulings:** 21 (one launch day: private until Pro is built, then public, announced and selling together); 5 (the sample marks
stay off; the quiet notes and "About the figures" carry the honesty); 8 (targeted posts: Show HN, Indie Hackers, two UK
small-business communities; the loop drafts, he posts from his own accounts); 37 (a final pre-launch review).

**What the map of 2026-10-05 found:**
- "Private" is a declaration only: `.env.production` holds `NEXT_PUBLIC_SITE_PRIVATE=1`, which no page reads; the site answers
  everyone and indexes by his ruling 6 since milestone 1.
- **The documented launch step contradicts ruling 5.** `docs/DEPLOY-PACK-spine-flags.md` L76-90 and
  `scripts/verify_sample_switch.ts` L25-28 say launch day deletes the private line and adds `NEXT_PUBLIC_SHOW_SAMPLE_MARKS=1`;
  the `sample-switch` gate (in the chain, so on every Vercel build) passes only while the marks are on or the site is private.
  Deleting the private line alone fails every build; adding the marks breaks ruling 5.
- `npm run launch:check` (`scripts/verify_launch_ready.ts`, never in the chain; needs the network, `.env.local` and a browser):
  last run 2026-09-26, NOT READY, 2 reasons, of which item (a) holds two parser drifts (the AF "option A" line now matches the
  cell paragraph's "FLOOR: 15." at MODEL.md:742; Mumbai's BLOCK FLOOR line gained "(the no-answer trade page's: ...)", which the
  regex at L277 does not allow) and one real shortfall (Frankfurt and Abidjan at 15 of 16), and item (b) wants a marker on the
  deployed build. Item (c) counts `saved_cells` and `subscriptions` as absent by design (`query_outcomes.ts` L49-50, required list
  L397) and does not list `profiles` or `watchlist`; item (i) reads the home page's "What the atlas holds" band.
- No launch post is drafted anywhere; the two UK communities were never named.

---

## Step 38: launch readiness: ruling 5 in the gate, the checklist's own faults fixed, the runbook complete

**Files:** Modify `scripts/verify_sample_switch.ts`, `docs/DEPLOY-PACK-spine-flags.md`, the comment in `src/lib/feature_flags.ts`
(L130-151); Modify `scripts/verify_launch_ready.ts`, `scripts/query_outcomes.ts`; Complete
`docs/superpowers/plans/2026-10-05-masterplan/LAUNCH-SWITCHES.md`.

- [ ] **The sample switch holds ruling 5:** the gate passes when the site is private (as today), or when the marks are off and
  ruling 5's honesty is in place: the half-filled mark and its line under a header (`AnswerCard`'s foot mark, `marks.tsx`'s
  estimate label "An estimate") and the About page's `#reading` section exist in source. It fails when the marks are on (ruling
  5) or when the site is public without those. Plant each failing case once. The deploy pack and the flags comment say the new
  launch step: delete the private line; never add the marks.
- [ ] **The checklist's own faults:** item (a) reads the country floor and option A from the country paragraph (anchor it to
  "PLAN STEP 49" or the country heading, never the first `FLOOR:` line), and its BLOCK FLOOR regex allows the parenthesis
  `check_model_laws.mjs` L1030 inserts; Frankfurt and Abidjan at 15 of 16 are real and stay reasons (park: the city floor needs
  the neighbourhood pager on non-curated cities, or his word on the floor). Item (c) requires `subscriptions`, `saved_cells`,
  `profiles` and `watchlist` when accounts are on (`isAuthEnabled()`), and counts them off otherwise. Item (i) reads the rebuilt
  ledger band (step 35).
- [ ] **Run** `npm run launch:check -- --only=a,c,d,e,f,g,h,i > <file>` (b needs a marker on production after his push) under the
  memory rule; record each line in the ledger; any reason that is the loop's to fix is fixed now and the subset rerun.
- [ ] **LAUNCH-SWITCHES.md, complete,** in the order he works, each row: where, what to click or set, what he should see:
  1. Supabase SQL Editor: `2026-06-08-accounts-saved-cells.sql`, then `2026-10-05-pro-subscriptions.sql`; then `npm run query:outcomes`.
  2. Stripe: the Pro product and its two prices (tax-inclusive or not, his VAT decision), the customer portal (cancel at period
     end, card updates), the terms URL, Stripe Tax, renewal reminders and the receipt line if step 30's note says the 2024 Act
     requires them, the webhook endpoint `https://www.marginatlas.com/api/stripe/webhook` with its four events.
  3. Vercel, Production environment: `STRIPE_SECRET_KEY` (live), `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PRO_MONTHLY`,
     `STRIPE_PRICE_PRO_ANNUAL`, `STRIPE_TERMS_CONSENT=1`, `STRIPE_AUTOMATIC_TAX=1`, `NEXT_PUBLIC_AUTH_ENABLED=1`,
     `NEXT_PUBLIC_PAYWALL=1`, `NEXT_PUBLIC_HOME_REFORM=1`, `NEXT_PUBLIC_WEB_ANALYTICS=1` (and Web Analytics enabled).
  4. The repo: the commit that deletes `NEXT_PUBLIC_SITE_PRIVATE=1` from `.env.production` (prepared on branch `launch-day` from
     the night branch, never merged by the loop), pushed by him with the night's work.
  5. After the deploy: `npm run deploy:watch -- --marker=...` and `npm run launch:check -- --marker=...`; a test purchase in Stripe's
     test mode first if he wants one (with test keys, before the live ones).
  6. Search Console: the sitemap files robots.txt lists. 7. The posts (step 39), from his accounts.
- [ ] **Commit:** `38: launch readiness: ruling 5 held by the sample gate, the checklist's faults fixed, the launch switches in his order`.

## Step 39: the launch posts, drafted for him

**Files:** Create `E:/atlas/design/loop/build/launch/posts/` with `show-hn.md`, `indie-hackers.md`, `uk-community-1.md`,
`uk-community-2.md`, and `README.md` (where each goes, its rules, when to post).

- [ ] **Research, reading only:** the posting rules of Show HN (the HN guidelines and the Show HN rules), Indie Hackers, and two
  UK small-business communities chosen for size, activity and their self-promotion rules (candidates: UK Business Forums, and a
  UK small-business subreddit; read each one's rules page and quote the rule that matters). Name the two in `README.md` with the
  reason.
- [ ] **The drafts,** his register (plain, short, first person, the finance student's voice, memory
  `feedback_report_humanization_register`): what the site answers for a UK owner in planning, three fresh like-for-like findings
  from the registers (only items the 45-day rule allows; each with the page that prints it), what is free and what Pro costs
  (from `plan.ts`), and nothing invented: no user count, no testimonial, no press, no "AI-powered". Each community's draft obeys
  its rules (Show HN: a title starting "Show HN:", the first comment written as his). A note: he posts from his own accounts,
  on launch day, after the deploy is proven.
- [ ] **Commit** the design repo: `39: the launch posts drafted for him (Show HN, Indie Hackers, two UK communities)`.

## Step 40: the night's proof and the morning pack

- [ ] **The full chain** on the night branch's head (protocol section 5); every red fixed; the count in the ledger.
- [ ] **PARKED.md** read through: every entry a question with two to four options, the recommendation first with its reason, and
  what is built either way.
- [ ] **MORNING-REPORT.md** (his register, short): per milestone, what now exists for a reader (one line each); what is proven
  (the chains, the photograph sheets by path); what is parked (each question, the recommendation first); his clicks (point to
  LAUNCH-SWITCHES.md); the steps not reached, if any, and where the ledger stands; one closing question: what to push and deploy
  (recommendation: milestone 2's billing and paywall code and the truth fixes now, every switch off; milestone 3 after his review).
- [ ] **Records:** STATE.md `step-in-flight`; the QUEUE rows the night closed; the handoff dossier
  (`docs/handoff/HANDOFF-marginatlas-2026-10-04.md`: a new section or a new dossier dated the morning); memory (a project file for
  the masterplan and its state, and its line in `MEMORY.md`).
- [ ] **Send** `MORNING-REPORT.md` and the sheets with `SendUserFile`, status `proactive`.
- [ ] **Commit** both repos: `40: the night's proof and the morning pack`.
