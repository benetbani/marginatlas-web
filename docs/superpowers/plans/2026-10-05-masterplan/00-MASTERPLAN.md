# The masterplan: from milestone 1 live to launch day, in 40 steps

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (inline; never stop for review between batches, he is
> asleep: `01-PROTOCOL.md` replaces the checkpoints). Steps use checkbox syntax in their phase files; `LEDGER.md` records each.

**Goal:** everything left between today (milestone 1 live at website `main` 128c66b6, 2026-10-05) and his launch day (interview
of 2026-09-26: one day, early to mid November 2026, Pro selling, the site announced): the truth fixes Pro must not sell around,
milestone 2 (Pro: one plan at $38 / $238, checkout first, half of every UK chapter locked, the four Pro sections, the legal
drafts), milestone 3 (the home page), and launch readiness, each built and proven on the night branch, nothing pushed.

**Architecture:** seven phases, each a file, each ending in something provable. Pure cores decide (prices, Stripe events, which
levels lock, where a search lands, which address names nothing), thin routes and views draw; every ruling becomes a gate in the
same step that builds it (the repo's working method, rule 4); every switch that changes production waits for his launch day.

**Tech stack:** Next.js 15 App Router (ISR pages, edge middleware), React 19, TypeScript, Tailwind 3.4, Supabase (auth, the
subscriptions table), Stripe (Checkout, webhooks, the customer portal; `stripe` ^22 installed), the repo's tsx test style and
its 211-gate chain, the harness renderer and jsdom.

---

## Why this order

1. **Truth first (A).** Pro sells the UK pages; a wrong figure behind a paywall is a wrong figure sold. Addresses that name nothing
   stop answering pages before more pages index.
2. **Billing before the paywall (B before C).** A locked section with no way to buy is a page that takes and offers nothing; the
   paywall's switch is on only when accounts are (step 10).
3. **The paywall before the Pro sections (C before D).** The sections seat as later levels of their chapters and lock by his rule,
   with no special case; building the lock first means each section is born locked and checked so.
4. **Legal and trust close milestone 2 (E).** The drafts must match what checkout and the portal actually do (steps 09, 11).
5. **The home page after Pro (F).** His ruling 26: fixes, then Pro, then the home page; its Pro band needs the price module.
6. **Launch readiness last (G).** The checklist, the switches and the posts describe what exists, so they come after it.

## The 40 steps

| # | Phase | Step | File | Depends on | Ends with |
|---|---|---|---|---|---|
| 01 | A | An address for nothing answers 404 at the edge | 02-A | | `edge-not-found` |
| 02 | A | No coined score or struck word on any live page | 02-A | | `legacy-method-words` |
| 03 | A | London's city page: sourced figures or none (audit 19, 22, 23, 24) | 02-A | | harness, photos |
| 04 | A | London trade pages and /gb: the rest of the audit (10, 17, 18) | 02-A | | harness |
| 05 | B | One Pro plan in code; the tier is free or pro | 03-B | | `pro-plan` |
| 06 | B | The subscriptions migration for one tier; the email lookup | 03-B | 05 | parked: apply |
| 07 | B | What a Stripe event does to an account (pure, tested) | 03-B | 05 | `stripe-sync` |
| 08 | B | The webhook on the core; the account maker | 03-B | 06, 07 | gates |
| 09 | B | Checkout first; consent and tax behind his settings | 03-B | 05 | `checkout-params` |
| 10 | B | The paywall's switch, on only with accounts; LAUNCH-SWITCHES | 03-B | | `paywall-flag` |
| 11 | B | The welcome page, the account's plan, cancelling | 03-B | 08, 09 | `plan-status` |
| 12 | B | The pricing page sells one plan; no old price anywhere | 03-B | 05, 10 | `one-price` |
| 13 | B | No pop-up; the monetization gates say why | 03-B | 12 | gates |
| 14 | C | Which levels lock, one tested function | 04-C | | `paywall-levels` |
| 15 | C | The locked section | 04-C | 14 | stories, census |
| 16 | C | The three UK views draw their locks when told | 04-C | 14, 15 | `paywall-free-half` |
| 17 | C | The UK routes decide the lock | 04-C | 10, 16 | harness |
| 18 | C | A Pro reader's uncached mirror; the middleware rewrite | 04-C | 17 | `pro-route`, a build |
| 19 | C | The locked parts said to search engines | 04-C | 17 | `locked-data` |
| 20 | C | The gate that holds the paywall to his ruling | 04-C | 15-19 | `paywall-shape` |
| 21 | C | Milestone 2 checkpoint: the full chain, photographs | 04-C | 05-20 | chain, sheet |
| 22 | D | One hire, all in: the builder | 05-D | | `hire-all-in` |
| 23 | D | One hire, all in: the section | 05-D | 22 | harness, photo |
| 24 | D | The lease, by law: data and builder | 05-D | | `lease-by-law` |
| 25 | D | The lease, by law: the section | 05-D | 24 | harness, photo |
| 26 | D | Opening from abroad: data and builder | 05-D | | `from-abroad` |
| 27 | D | Opening from abroad: the section | 05-D | 26 | harness, photo |
| 28 | D | What failing costs: data and builder | 05-D | | `if-it-fails` |
| 29 | D | What failing costs: the section; the four closed | 05-D | 28 | harness, paywall-shape |
| 30 | E | Terms, refunds, privacy, cookies drafted for his approval | 06-E | 09, 10, 11 | parked: approve |
| 31 | E | Report a mistake from every page; milestone 2 closed | 06-E | 21-30 | chain, sheet |
| 32 | F | The home page's frame on the band page, in the harness | 07-F | | harness |
| 33 | F | The search lands on pages that exist; no modal search | 07-F | | `home-destination` |
| 34 | F | The UK's headline answers | 07-F | 32 | `home-answers` |
| 35 | F | The UK's cities, what the atlas holds, Pro quietly | 07-F | 12, 32 | gates |
| 36 | F | The notebook, the newsletter, no terracotta hover | 07-F | 32 | `no-terra-hover` |
| 37 | F | The home page held to the UK page's standard | 07-F | 32-36 | harness, sheet |
| 38 | G | Ruling 5 in the sample gate; the checklist fixed; the runbook | 08-G | 21-37 | launch:check |
| 39 | G | The launch posts drafted for him | 08-G | | drafts |
| 40 | G | The night's proof and the morning pack | 08-G | all | chain, report |

**Independent groups** (when a step blocks, the next runnable step is the first not depending on it): A (01-04); B's core (05,
07, 09, 10); C's pure parts (14, 15, 19); D's builders (22, 24, 26, 28); F's search (33); G's posts (39).

## A realistic night

At the protocol's pace (read, test, build, gates, commit) a step takes 20 to 60 minutes; three full chains take about two hours.
One night will not finish 40 steps. The order puts the most valuable work first: the truth fixes, then everything Pro needs to
sell. The ledger is the resume point for the next session; nothing is lost by stopping at any step boundary.

## What is his (never the loop's)

Live keys and Stripe settings; applying migrations; Vercel switches; his VAT registration and the price's VAT treatment; approving
the legal drafts and supplying his identity for them; the corrections promise; the blog's keep / rewrite / retire; the editorial
formats; posting; every push and deploy. Each reaches him through `PARKED.md` and `MORNING-REPORT.md` with a recommendation.

## Reading order for the executor

`01-PROTOCOL.md`, this file, `LEDGER.md`, then the current step's phase file. Background for Pro:
`docs/superpowers/research/2026-10-04-pro-code-map.md`. His rulings: `E:/atlas/design/loop/build/INTERVIEW-2026-09-26.md`.
The page laws: `E:/atlas/design/loop/build/briefs/MODEL.md` PART 9 and PART 10. The state of record: `E:/atlas/design/loop/build/STATE.md`.
