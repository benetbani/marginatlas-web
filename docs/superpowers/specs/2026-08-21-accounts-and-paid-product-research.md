# Accounts, the paid product, and the missing UX logic — research

> Commissioned 2026-08-21, mid-Phase-1 of the scope reform. The founder's words:
> *"so much ux logic is still missing, also no login function yet, login is
> required for the paid plans obviously"* and *"paid users will have more access
> at it and need more functionalities, so effectively we need saas
> functionalities included."*
>
> **This is research, not a plan.** It establishes what is actually there before
> anything is designed, because the premise of the request turns out to be
> wrong in a way that changes the whole shape of the work.

---

## FOUNDER RULING, 2026-08-21, taken after this research was written

Asked which of the two conflicting strategies stands, he chose neither, and the
answer he gave instead is the operative one:

> **"keep everything free for now, we will hide them later"**

**What that decides:**

- **Nothing is gated. The paywall stays off.** `NEXT_PUBLIC_GATING_ENABLED`
  remains at its default and must not be flipped.
- **The tier question is DEFERRED, not settled.** §4 below proposes a tier shape
  and it is now a proposal awaiting a decision, not a direction to build toward.
  Do not design around it as though it were ratified.

**What that does NOT decide, and the distinction matters:**

- **The price list still has to be cut to what exists.** Six of the fourteen
  sold features cannot be delivered (§1), and that page is public today. "Free
  for now" is not a reason to keep advertising four features that have no code.
  This item survives the ruling intact and is still the only urgent one.
- **The workspace work survives too** (§3a). Saving a cell, a search or a
  comparison is worth building whether it is free or paid, and today nothing a
  reader does survives their visit.

**AND A STANDING CONSTRAINT THAT FALLS OUT OF "LATER".** The gating machinery is
built, wired through five surfaces, and must be **left intact**. Do not rip it
out, do not simplify it away, and do not let a later refactor quietly delete it
as dead code, because it is the option he has explicitly reserved. A comment
saying so belongs on anything that touches it.

---

## 0. The headline finding

**The sign-in and subscription stack is not missing. It is BUILT, and switched OFF.**

Every piece exists in the repository today:

| Piece | State |
|---|---|
| Sign-in page and form (Supabase magic link) | built |
| Auth callback and sign-out routes | built |
| Session helper, server and browser Supabase clients | built |
| Header sign-in / account control | built |
| `/account` page | built, renders "coming soon" |
| Stripe checkout route | built, reads four price ids |
| Stripe webhook route | built |
| Subscription tiers, Free / Basic $37 / Premium $77 | built, with a 25-row feature matrix |
| The paywall gate itself | built, wired through 5 surfaces |

It is held shut by **three environment switches, all defaulting off**:

- `NEXT_PUBLIC_AUTH_ENABLED` , sign-in, accounts, saved cells
- `NEXT_PUBLIC_GATING_ENABLED` , the paywall
- `NEXT_PUBLIC_ACCOUNT_PREVIEW` , the account page design

And by **four founder actions nobody can do from here**: enabling the Supabase
Auth email provider with a redirect allowlist, setting `STRIPE_SECRET_KEY` and
the four price ids, and applying the missing table migrations.

**So the question is not "how do we build accounts." It is "why has it never
been turned on, and what breaks the moment it is."** The rest of this document
answers the second half.

---

## 1. The price list describes a product that partly does not exist

The pricing page publishes a 25-row feature matrix. Eleven rows are free
browsing and are genuinely free. **Fourteen rows are sold.** Measured against
the codebase, by searching for any implementation at all:

| Sold as | Feature | Implementation found |
|---|---|---|
| Basic | Lower-mid quartile (p25) | **yes**, the data is held and rendered |
| Basic | Upper-mid quartile (p75) | **yes** |
| Basic | Year-over-year deltas | **yes**, 6 files |
| Basic | Source citation per line | **partial**. This is per-figure Origin, and `CONTEXT.md` records it as the module that does not exist yet: the predicate is "spelled nine ways" today |
| Basic | Saved cells, 25 max | **built, but the database table was never created.** Currently backed by browser storage, so it is lost on a new device, which is the one thing a watchlist exists to survive |
| Basic | Saved searches | **NONE. Zero files.** |
| Premium | Cell comparison side by side | **yes**, 9 files |
| Premium | CSV export | **yes**, 6 files, with its own gate on the column list |
| Premium | Email alerts on cell updates | **effectively none.** The two matches are the newsletter, and `newsletter_signups` does not exist either |
| Premium | Confidence intervals | **NONE. Zero files.** |
| Premium | Seasonality calendar | **yes**, 28 files. See §2, it is a problem for a different reason |
| Premium | Public-company peers panel | **NONE. Zero files.** |
| Premium | Equipment shopping list | **NONE. Zero files.** |

**Four sold features have no implementation whatsoever. Two more are built
against tables that do not exist.** A visitor can read all of this today and
click "Notify me when Premium opens".

This is the same defect class the founder sent this loop hunting, applied to the
product rather than to a figure: **something that looks like information and
carries none.** A price list is a promise, and six of these fourteen promises
cannot currently be kept.

---

## 2. Turning the paywall on would TAKE THINGS AWAY from readers

The matrix marks several things as paid that render free, in full, on every
cell page today. Confirmed in the rendered London restaurant page taken in
Phase 0: the seasonality section ("Busy months and slow months") is right
there, unlocked, and so is the full spread.

Worse, the gate's own design gates **owner take-home** , the single number the
product is named after, and the one the founder chose as the page's dominant
figure in the 2026-08-21 interview. The switch's own comment says the static
page ships "a redacted placeholder" and a subscriber's browser fetches the real
value.

**Two consequences worth stating plainly:**

1. **A returning reader would experience the launch as a downgrade.** Everything
   they could see last week is behind a card form this week. That is the worst
   possible first impression of a paid tier and it is entirely avoidable.
2. **It contradicts the newest ratified strategy.** The 2026-07-07 strategy
   interview ratified *all reading free, Pro is decision tools*. The pricing
   matrix comes from the 2026-05-25 monetization plan, which gates reading. Both
   are in force in the repository right now, and they disagree about the core
   question of what is sold. **The July ruling is newer and should win**, which
   would mean the matrix, not the strategy, is what changes.

---

## 3. The UX logic that is genuinely missing

Separated from the accounts question, because most of it is not about accounts.

### 3a. State a reader creates and then loses

| What | What happens now |
|---|---|
| Saving a cell | Kept in browser storage. New device, new browser, or cleared data means it is gone. The table to fix this exists as an unapplied migration |
| A newsletter signup | Says "thanks", discards it. Table missing |
| A reader correction | Says "thanks", discards it. Table missing |
| A search | Not saved at all, and sold as a Basic feature |
| A comparison | Not saved. Rebuilt from scratch every visit |

**Nothing a reader does on this site survives the visit.** That is the plainest
statement of the gap, and it is upstream of the paid tier: a subscription buys
access to a workspace, and there is no workspace.

### 3b. States that were never designed

From the production-readiness ledger, all currently **unmeasured**, meaning
nobody has looked:

- **Every interactive element reachable by keyboard, with a visible focus ring.**
  Unmeasured. A subscription product that cannot be operated from a keyboard is
  a support problem and, in some markets, a legal one.
- **Every tap target at least 24 by 24.** Unmeasured. The site is a dense table
  of small figures on a phone.
- **Empty, single-item, long-list and error states for every component.**
  Unmeasured. *"Sample content only is the untested half of every primitive."*
  An account product is mostly empty states: nothing saved yet, one thing saved,
  two hundred things saved, the save failed.
- **Dead links.** Unmeasured site-wide, and **502 dead navigation entries are
  already known on the city side**.

### 3c. Things that exist and nobody can reach

- Roughly **30 of about 150 graphics mount nowhere at all**.
- **9 more render only from a route that has no URL**.
- **9 components on the live country page ship a frame and an empty state and
  have never held a figure.**

Some of that is the raw material for the paid tier. It is cheaper to finish a
built-and-unmounted component than to invent a new one.

### 3d. The sign-in flow itself

Built, but never exercised end to end by anyone, because it has never been on.
Unknowns that need answering before it is: what a signed-in header actually
looks like, what happens on a magic link that has expired, what an already-
subscribed reader sees on the pricing page, what happens when Stripe says paid
and Supabase has not caught up yet, and how a reader cancels.

---

## 4. What a paid tier should actually be, given what this atlas holds

The founder's own ratified answer, from the 2026-07-07 strategy interview:
**Pro is decision tools. All reading stays free.** That is also the better
answer commercially, and the reasons are specific to this product:

1. **Reading is the acquisition channel.** The whole SEO and AI-answer strategy
   depends on pages being readable by crawlers and quotable by assistants. A
   redacted headline figure is a page that cannot be quoted, on a site whose
   growth plan is being quoted.
2. **The figures are the proof, not the product.** Research already recorded in
   the design standard: design and structure account for roughly three quarters
   of what makes readers judge a site credible, and accuracy 14%. Hiding the
   figure hides the proof.
3. **A decision tool is worth more than a number.** "Where should I open a
   bakery, given 40,000 and these three constraints" is a question with a
   valuable answer. "What is the 75th percentile" is a number.

**The already-ratified headline tool is the recommender**: trade plus budget
produces a ranked shortlist. Free gives the top answer; paid gives the full
list, the working, and the ability to save and revisit it. A route for it
already exists.

**A defensible tier shape on that basis**, replacing rows that cannot be kept:

| Free | Paid |
|---|---|
| Every figure, every page, in full | The recommender's full ranked list, not just the top answer |
| Every chart | Save anything: cells, searches, shortlists, comparisons |
| The comparison tool, limited | Compare without limit, and keep comparisons |
| , | Export what you are looking at |
| , | Tell me when this changes |
| , | Your own numbers laid over ours: rent, wages, hours |

Every one of those is a **capability**, not a fact withheld. None of them
requires taking anything away from anyone.

---

## 5. What should happen, in order

Recommended sequence, with the reasoning rather than as a decree.

**First, before any building: settle which strategy is in force.** The two
documents disagree about whether reading is free. Every task below depends on
the answer and none of them can be sequenced without it. This is a founder
decision and it is one sentence.

**Then, in this order:**

1. **Cut the price list down to what exists.** Six promises cannot be kept
   today. Removing a row costs nothing and takes a real defect off a live page.
   This is the only item that is urgent, because the page is public.
2. **Apply the three missing tables.** Newsletter, corrections, saved cells.
   Founder action, minutes, and it stops the site discarding things people took
   the trouble to send.
3. **Exercise the sign-in flow end to end in the workshop** with the switches on
   locally. Nobody has ever done this. Expect it to surface several of §3d.
4. **Design the empty states before the features.** An account product is
   mostly empty states, and they are the untested half of every component here.
5. **Build the workspace**: save a cell, a search, a comparison, a shortlist.
   That is what a subscription actually buys.
6. **Finish the recommender as the paid headline.**
7. **Only then wire Stripe live.**

**Explicitly NOT recommended: turning the paywall on.** Not as currently
designed. It gates the number the product is named after and takes free features
away from existing readers, and it contradicts the newer of the two strategies.

---

## 6. What this research cannot tell you

- **Whether anyone will pay.** There is no traffic, no waiting list that
  persists, and no interviews. Every tier shape above is reasoning from the
  product, not evidence from customers.
- **Whether the built auth actually works.** It has never run. "Built" here
  means the code exists and typechecks, not that a magic link has ever arrived
  in an inbox.
- **What the Stripe account is configured with.** The four price ids are read
  from the environment and this repository cannot see them.
- **How much of §3c is salvageable.** "Mounts nowhere" was counted, not read.
  Some of those 30 components will be worth finishing and some will be dead.
