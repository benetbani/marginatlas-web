# Phase B, steps 05 to 13: one Pro plan, checkout first, an account from the checkout email

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans, under `01-PROTOCOL.md` (never stop for review: he is
> asleep). Steps use checkbox syntax; tick them in this file as they finish and record each step in `LEDGER.md`.

**Goal:** the billing half of milestone 2: one plan, Pro, at $38 a month or $238 a year in dollars, bought on Stripe before any
account exists, the account made from the checkout email, managed and cancelled through Stripe's portal, every price printed from
one module, and no pop-up anywhere. All of it dormant in production until his launch-day switches.

**Architecture:** a pure core decides (the plan in `src/lib/monetization/plan.ts`, the checkout parameters in
`checkout_params.ts`, what a Stripe event does to an account in `stripe_sync.ts`); thin route handlers call it with real Stripe and
Supabase clients. Every event re-reads the subscription from Stripe, so events arriving out of order cannot re-grant a cancelled
plan, and a database error answers 500 so Stripe retries instead of being swallowed (the June webhook swallowed them).

**Tech stack:** Next.js 15 route handlers, `stripe` ^22 (installed), `@supabase/supabase-js` (installed), tsx tests in the repo's
PASS/red style (`scripts/lib/red`).

**His rulings this phase serves (interview of 2026-09-26):** 13 Pro sells depth; 14 the price $38 / $238; 16 Stripe as built, he
files VAT; 20 checkout first, the account made from the checkout email, no trial; 22 no pop-up; 33 dollars everywhere; 34
cancel any time, access to the end of the paid period, consent to immediate access at checkout.

**What already exists** (read `docs/superpowers/research/2026-10-04-pro-code-map.md` first): checkout and a signature-checked
webhook built for Basic/Premium at $37/$77, magic-link sign-in, the `subscriptions` migration never applied to the live database,
`PaywallModalRoot` mounted on every page, flags all off.

---

## Step 05: one Pro plan in code, and one tier name

**Why.** Three tiers and four prices are written in at least six places today; a price typed twice is a price that will disagree.
His ruling is one plan. Every later step imports the plan from here.

**Files:**
- Create: `src/lib/monetization/plan.ts`
- Modify: `src/lib/monetization/viewer_tier.ts` (the `ViewerTier` union and `gateValue`'s rank)
- Modify: every file `tsc` then names (expected: `src/app/api/cell-take-home/route.ts`, `src/app/api/export-csv/route.ts`,
  `src/app/api/stripe/checkout/route.ts`, `src/app/api/stripe/webhook/route.ts`, `src/lib/monetization/entitlement.ts`,
  `src/components/monetization/*`, `src/app/dev/lock-states/page.tsx`, `src/app/_design/monetized/page.tsx`,
  `src/lib/monetization/free_paid_map.ts`, `src/components/spine/hood/blocks.tsx`, `src/lib/spine/sections/stock_kit.ts`,
  `src/components/spine/archetypes/stories.tsx`)
- Test: `tests/monetization/pro_plan.test.ts`

- [ ] **Write the failing test** `tests/monetization/pro_plan.test.ts`:

```ts
/**
 * THE ONE PRO PLAN (milestone 2; his interview of 2026-09-26, rulings 14, 20, 33): one paid plan at $38 a month or $238 a year,
 * dollars everywhere, the Stripe price ids read by name, a price written one way.
 *
 * Run: npx tsx tests/monetization/pro_plan.test.ts
 */
import { PRO, proPriceId, intervalOfPrice, priceLine } from "../../src/lib/monetization/plan";
import { gateValue } from "../../src/lib/monetization/viewer_tier";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "pro-plan";
const FILE = "src/lib/monetization/plan.ts";
const REMEDY = "keep one plan, Pro, at $38 a month and $238 a year, its price ids read from STRIPE_PRICE_PRO_MONTHLY and STRIPE_PRICE_PRO_ANNUAL";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const env = { STRIPE_PRICE_PRO_MONTHLY: "price_m", STRIPE_PRICE_PRO_ANNUAL: " price_y " };
check("the plan is Pro at 38 and 238", PRO.name === "Pro" && PRO.monthlyUsd === 38 && PRO.yearlyUsd === 238);
check("the monthly price id is read by name", proPriceId("month", env) === "price_m");
check("the yearly price id is read by name, trimmed", proPriceId("year", env) === "price_y");
check("an unset price id is null (billing dormant)", proPriceId("month", {}) === null && proPriceId("year", { STRIPE_PRICE_PRO_ANNUAL: "  " }) === null);
check("a price id maps back to its interval", intervalOfPrice("price_m", env) === "month" && intervalOfPrice("price_y", env) === "year");
check("a price that is not Pro's maps to nothing", intervalOfPrice("price_basic", env) === null && intervalOfPrice(null, env) === null);
check("a price is written one way", priceLine("month") === "$38 a month" && priceLine("year") === "$238 a year");
check("a free viewer gets no gated value", gateValue(5, "pro", "free") === null);
check("a Pro viewer gets the gated value", gateValue(5, "pro", "pro") === 5);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("monetization/pro_plan: all pass");
```

- [ ] **Run it:** `npx tsx tests/monetization/pro_plan.test.ts`. Expected: fails to import `plan.ts` (module not found).
- [ ] **Write `src/lib/monetization/plan.ts`:**

```ts
/**
 * src/lib/monetization/plan.ts
 *
 * THE ONE PRO PLAN (milestone 2; his interview of 2026-09-26: ruling 13, Pro sells depth; 14, the price; 20, checkout first and
 * no trial; 33, dollars everywhere). One paid plan. Every price the site prints and every Stripe price id the code reads comes
 * from this file, so no page can print a price this file does not hold.
 *
 * The price ids are read by name at call time, never cached: unset means billing is dormant, and every caller answers 503 or
 * draws its "not open yet" state rather than guessing.
 */
export const PRO = { name: "Pro", monthlyUsd: 38, yearlyUsd: 238 } as const;

export type BillingInterval = "month" | "year";

type Env = Record<string, string | undefined>;

/** The Stripe price id for an interval, or null when it is not set. */
export function proPriceId(interval: BillingInterval, env: Env = process.env): string | null {
  const raw = interval === "year" ? env.STRIPE_PRICE_PRO_ANNUAL : env.STRIPE_PRICE_PRO_MONTHLY;
  const id = (raw ?? "").trim();
  return id ? id : null;
}

/** The interval a Stripe price id belongs to, or null when it is not one of Pro's two. */
export function intervalOfPrice(priceId: string | null | undefined, env: Env = process.env): BillingInterval | null {
  if (!priceId) return null;
  if (priceId === proPriceId("month", env)) return "month";
  if (priceId === proPriceId("year", env)) return "year";
  return null;
}

/** The one way a price is written: "$38 a month", "$238 a year". */
export function priceLine(interval: BillingInterval): string {
  return interval === "year" ? `$${PRO.yearlyUsd} a year` : `$${PRO.monthlyUsd} a month`;
}
```

- [ ] **Change the tier union** in `src/lib/monetization/viewer_tier.ts` to `export type ViewerTier = "free" | "pro";` and
  `gateValue`'s rank to `{ free: 0, pro: 1 }`; update its header comment (one paid tier, ruling 14).
- [ ] **Let `tsc` list every use:** `npx tsc --noEmit -p . > <file>`; for each error, the rule is: anything that meant "paid" is
  `"pro"`; anything that compared to `"premium"` (the CSV history) compares to `"pro"`; demo pages under `src/app/dev` and
  `src/app/_design` show the two states `free` and `pro`. In `entitlement.ts` accept only `data.tier === "pro"` and drop
  `"trialing"` from the active statuses (ruling 20: no trial exists). Keep the checkout and webhook routes compiling with the
  smallest edit; steps 08 and 09 replace them.
- [ ] **Run:** the test (PASS lines, "all pass"), then `tsc` clean.
- [ ] **Wire the gate:** add `{ name: "pro-plan", script: "tests/monetization/pro_plan.test.ts" },` to `GATES` in
  `scripts/prebuild_all.ts` beside the other monetization entries; `npx tsx scripts/counts.ts --write`; commit the carriers.
- [ ] **Commit:** `05: one Pro plan in code; the tier is free or pro (his rulings 14, 20, 33)`.

---

## Step 06: the subscriptions table for one plan, and the account lookup the webhook needs

**Why.** The June migration allows `basic` and `premium` and was never applied (`scripts/query_outcomes.ts`). Checkout first means
the webhook meets an email before it meets an account, so it needs a safe way to find an account by email: a function only the
service role can call, never a table anyone can read.

**Files:**
- Create: `db/migrations/2026-10-05-pro-subscriptions.sql`
- Modify: `db/migrations/2026-06-09-subscriptions.sql` (a header line only: superseded, never applied)
- Modify: `PARKED.md` (an entry: apply the migration)

- [ ] **Write `db/migrations/2026-10-05-pro-subscriptions.sql`:**

```sql
-- db/migrations/2026-10-05-pro-subscriptions.sql
-- THE ONE PRO PLAN (milestone 2; his interview of 2026-09-26, rulings 14 and 20). Supersedes 2026-06-09-subscriptions.sql, which
-- was never applied to the live database (scripts/query_outcomes.ts, 2026-09-17). DO NOT run automatically: the founder applies
-- it in the Supabase SQL Editor. Additive and idempotent: correct whether or not the June table exists.
--
-- Security model, unchanged from June: a user may read their own row and never write it; every write is the Stripe webhook's,
-- through the service role, which bypasses row level security.

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  tier text not null default 'free',
  status text not null default 'inactive',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);

-- One paid tier. Postgres named the June inline check subscriptions_tier_check.
alter table public.subscriptions drop constraint if exists subscriptions_tier_check;
update public.subscriptions set tier = 'pro' where tier in ('basic', 'premium');
alter table public.subscriptions add constraint subscriptions_tier_check check (tier in ('free', 'pro'));

alter table public.subscriptions enable row level security;
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);

create index if not exists subscriptions_customer_idx on public.subscriptions (stripe_customer_id);
create unique index if not exists subscriptions_subscription_idx
  on public.subscriptions (stripe_subscription_id) where stripe_subscription_id is not null;

-- Checkout first (ruling 20): the account for a checkout email. The service role only; never anon, never a signed-in user.
create or replace function public.auth_user_id_by_email(p_email text)
returns uuid
language sql
stable
security definer
set search_path = public, auth
as $$
  select id from auth.users where lower(email) = lower(p_email) limit 1
$$;
revoke all on function public.auth_user_id_by_email(text) from public, anon, authenticated;
grant execute on function public.auth_user_id_by_email(text) to service_role;
```

- [ ] **Mark the June file superseded:** add under its first line: `-- SUPERSEDED 2026-10-05 by 2026-10-05-pro-subscriptions.sql (one Pro tier); never applied, do not apply.`
- [ ] **Park it** in `PARKED.md`: "Apply `db/migrations/2026-10-05-pro-subscriptions.sql` (and `2026-06-08-accounts-saved-cells.sql`
  if accounts open at launch) in the Supabase SQL Editor before Pro sells. Recommendation: apply both on launch day, before the
  switches." Then `npm run query:outcomes` stays as it is (it already expects `subscriptions` absent while billing is off).
- [ ] **Commit:** `06: the subscriptions migration for one Pro tier, and the checkout email's account lookup (parked for him)`.

---

## Step 07: what a Stripe event does to an account, as a pure core

**Why.** The June handler trusted the event's own copy of the subscription, so a delayed "updated: active" after a "deleted" would
re-grant Pro; it matched users by metadata a checkout-first buyer never has; and it swallowed database errors. The core fixes all
three and is tested without a network.

**Files:**
- Create: `src/lib/monetization/stripe_sync.ts`
- Test: `tests/monetization/stripe_sync.test.ts`

- [ ] **Write the failing test** `tests/monetization/stripe_sync.test.ts`:

```ts
/**
 * WHAT A STRIPE EVENT DOES TO AN ACCOUNT (milestone 2; rulings 14, 20, 34): checkout first, so every event finds the buyer by
 * email and makes the account when none exists; every event re-reads the subscription from Stripe, so an event arriving late
 * cannot re-grant a cancelled plan; a database error rejects, so the route answers 500 and Stripe retries.
 *
 * Run: npx tsx tests/monetization/stripe_sync.test.ts
 */
import { handleStripeEvent, rowFromSubscription, type SubLike, type SubscriptionRow } from "../../src/lib/monetization/stripe_sync";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "stripe-sync";
const FILE = "src/lib/monetization/stripe_sync.ts";
const REMEDY = "resolve the buyer by email, re-read the subscription from Stripe on every event, grant pro only while active or past_due on a Pro price, and reject on a database error";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const env = { STRIPE_PRICE_PRO_MONTHLY: "price_m", STRIPE_PRICE_PRO_ANNUAL: "price_y" };
const NOW = new Date("2026-10-05T00:00:00Z");
const sub = (status: string, price = "price_m"): SubLike => ({ id: "sub_1", status, customer: "cus_1", cancel_at_period_end: false, items: { data: [{ price: { id: price }, current_period_end: 1793836800 }] } });

check("active on a Pro price is pro", rowFromSubscription(sub("active"), "u1", NOW, env).tier === "pro");
check("past_due keeps access while Stripe retries", rowFromSubscription(sub("past_due"), "u1", NOW, env).tier === "pro");
check("canceled is free", rowFromSubscription(sub("canceled"), "u1", NOW, env).tier === "free");
check("trialing is free (no trial exists)", rowFromSubscription(sub("trialing"), "u1", NOW, env).tier === "free");
check("active on a price that is not Pro's is free", rowFromSubscription(sub("active", "price_old"), "u1", NOW, env).tier === "free");
check("the period end is read from the item", rowFromSubscription(sub("active"), "u1", NOW, env).current_period_end === "2026-11-05T00:00:00.000Z");

async function main() {
  const writes: SubscriptionRow[] = [];
  const made: string[] = [];
  const deps = (fresh: SubLike, opts: { failWrite?: boolean; email?: string | null } = {}) => ({
    customerEmail: async () => (opts.email === undefined ? "Buyer@Example.com" : opts.email),
    ensureUser: async (email: string) => { made.push(email); return "u-" + email; },
    upsert: async (row: SubscriptionRow) => { if (opts.failWrite) throw new Error("db down"); writes.push(row); },
    retrieveSubscription: async () => fresh,
    now: () => NOW,
    env,
  });

  const done = await handleStripeEvent({ type: "checkout.session.completed", data: { object: { id: "cs_1", mode: "subscription", customer: "cus_1", customer_email: null, customer_details: { email: " Buyer@Example.com " }, subscription: "sub_1" } } }, deps(sub("active")));
  check("a completed checkout makes the account from its email, lower-cased", made[0] === "buyer@example.com" && done.handled);
  check("and writes pro for it", writes[0]?.tier === "pro" && writes[0]?.user_id === "u-buyer@example.com");

  writes.length = 0;
  await handleStripeEvent({ type: "customer.subscription.updated", data: { object: sub("active") } }, deps(sub("canceled")));
  check("a late 'updated: active' after a cancellation writes free (Stripe re-read)", writes[0]?.tier === "free" && writes[0]?.status === "canceled");

  writes.length = 0;
  const skipped = await handleStripeEvent({ type: "customer.subscription.created", data: { object: sub("active") } }, deps(sub("active"), { email: null }));
  check("no email for the customer: nothing written, the reason said", !skipped.handled && writes.length === 0 && !!skipped.skipped);

  const other = await handleStripeEvent({ type: "invoice.paid", data: { object: {} } }, deps(sub("active")));
  check("an event Pro does not need is ignored", !other.handled);

  let rejected = false;
  try { await handleStripeEvent({ type: "customer.subscription.updated", data: { object: sub("active") } }, deps(sub("active"), { failWrite: true })); } catch { rejected = true; }
  check("a database error rejects, so the route answers 500 and Stripe retries", rejected);

  const oneTime = await handleStripeEvent({ type: "checkout.session.completed", data: { object: { id: "cs_2", mode: "payment", customer: null, customer_email: "x@y.z", subscription: null } } }, deps(sub("active")));
  check("a checkout that is not a subscription is ignored", !oneTime.handled);

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("monetization/stripe_sync: all pass");
}
main();
```

- [ ] **Run it:** expected failure: module `stripe_sync` not found.
- [ ] **Write `src/lib/monetization/stripe_sync.ts`:**

```ts
/**
 * src/lib/monetization/stripe_sync.ts
 *
 * WHAT A STRIPE EVENT DOES TO AN ACCOUNT (milestone 2; his interview of 2026-09-26: 14, one plan; 20, checkout first, the account
 * made from the checkout email, no trial; 34, access to the end of the paid period).
 *
 * Three decisions the June webhook got wrong, each made here once:
 *  - THE BUYER IS FOUND BY EMAIL. Checkout first means the buyer may have no account when they pay, so no metadata can name one;
 *    the checkout email (or the Stripe customer's email) finds the account, and the account is made when none exists.
 *  - THE SUBSCRIPTION IS RE-READ FROM STRIPE on every event. Stripe does not promise order: an "updated: active" can arrive after a
 *    "deleted". The event's own copy is never trusted; the row is written from what Stripe says now.
 *  - A DATABASE ERROR REJECTS. The route answers 500 and Stripe retries for days; a swallowed error was a paying customer locked out.
 *
 * Pure: the clients are passed in (`SyncDeps`), so every branch is tested without a network (tests/monetization/stripe_sync.test.ts).
 */
import { intervalOfPrice } from "@/lib/monetization/plan";

export type SubscriptionRow = {
  user_id: string;
  tier: "free" | "pro";
  status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  updated_at: string;
};

/** The parts of a Stripe subscription the sync reads; `Stripe.Subscription` narrows to it. */
export type SubLike = {
  id: string;
  status: string;
  customer: string | { id: string } | null;
  cancel_at_period_end: boolean;
  current_period_end?: number;
  items: { data: Array<{ price?: { id?: string | null } | null; current_period_end?: number }> };
};

/** The parts of a Stripe Checkout Session the sync reads. */
export type SessionLike = {
  id: string;
  mode: string;
  customer: string | { id: string } | null;
  customer_email: string | null;
  customer_details?: { email?: string | null } | null;
  subscription: string | { id: string } | null;
};

export type SyncDeps = {
  /** The email Stripe holds for a customer, or null. */
  customerEmail: (customerId: string) => Promise<string | null>;
  /** The account id for an email, made when none exists. */
  ensureUser: (email: string) => Promise<string>;
  /** Write one row, keyed on user_id; throws on a database error. */
  upsert: (row: SubscriptionRow) => Promise<void>;
  /** The subscription as Stripe holds it now. */
  retrieveSubscription: (id: string) => Promise<SubLike>;
  now: () => Date;
  env?: Record<string, string | undefined>;
};

export type SyncOutcome = { handled: boolean; tier?: "free" | "pro"; skipped?: string };

/** Access holds while Stripe says the plan is paid, or is retrying a failed payment. No trial exists (ruling 20). */
export const ENTITLED_STATUSES: ReadonlySet<string> = new Set(["active", "past_due"]);

const idOf = (x: string | { id: string } | null | undefined): string | null => (x == null ? null : typeof x === "string" ? x : x.id);
const cleanEmail = (e: string | null | undefined): string => (e ?? "").trim().toLowerCase();

/** The period end, from the subscription or its first item (Stripe moved the field onto items in newer API versions). */
export function periodEndISO(sub: SubLike): string | null {
  const ts = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end;
  return typeof ts === "number" ? new Date(ts * 1000).toISOString() : null;
}

/** The row a subscription makes for an account: pro only while entitled and on one of Pro's two prices. */
export function rowFromSubscription(sub: SubLike, userId: string, now: Date, env?: Record<string, string | undefined>): SubscriptionRow {
  const onPro = intervalOfPrice(sub.items?.data?.[0]?.price?.id ?? null, env) !== null;
  return {
    user_id: userId,
    tier: ENTITLED_STATUSES.has(sub.status) && onPro ? "pro" : "free",
    status: sub.status,
    stripe_customer_id: idOf(sub.customer),
    stripe_subscription_id: sub.id,
    current_period_end: periodEndISO(sub),
    cancel_at_period_end: !!sub.cancel_at_period_end,
    updated_at: now.toISOString(),
  };
}

const SUBSCRIPTION_EVENTS = new Set(["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"]);

/** Apply one Stripe event. Resolves with what it did; rejects on any client error so the caller answers 500. */
export async function handleStripeEvent(event: { type: string; data: { object: unknown } }, deps: SyncDeps): Promise<SyncOutcome> {
  if (event.type === "checkout.session.completed") {
    const s = event.data.object as SessionLike;
    if (s.mode !== "subscription") return { handled: false, skipped: "not a subscription checkout" };
    const email = cleanEmail(s.customer_details?.email ?? s.customer_email);
    const subId = idOf(s.subscription);
    if (!email || !subId) return { handled: false, skipped: "the checkout holds no email or no subscription" };
    const userId = await deps.ensureUser(email);
    const row = rowFromSubscription(await deps.retrieveSubscription(subId), userId, deps.now(), deps.env);
    await deps.upsert(row);
    return { handled: true, tier: row.tier };
  }
  if (SUBSCRIPTION_EVENTS.has(event.type)) {
    const seen = event.data.object as SubLike;
    const fresh = await deps.retrieveSubscription(seen.id);
    const customerId = idOf(fresh.customer) ?? idOf(seen.customer);
    const email = customerId ? cleanEmail(await deps.customerEmail(customerId)) : "";
    if (!email) return { handled: false, skipped: "Stripe holds no email for the customer" };
    const userId = await deps.ensureUser(email);
    const row = rowFromSubscription(fresh, userId, deps.now(), deps.env);
    await deps.upsert(row);
    return { handled: true, tier: row.tier };
  }
  return { handled: false, skipped: `not an event Pro needs (${event.type})` };
}
```

- [ ] **Run the test:** every PASS line, "all pass". Then `tsc`.
- [ ] **Wire the gate** `{ name: "stripe-sync", script: "tests/monetization/stripe_sync.test.ts" },`; counts; carriers.
- [ ] **Commit:** `07: what a Stripe event does to an account, decided once and tested (checkout first, re-read, retry on error)`.

---

## Step 08: the webhook on the core, and the account maker

**Why.** The route becomes a thin shell: verify the signature, hand the event to the core with real clients, answer 500 on any
failure so Stripe retries.

**Files:**
- Create: `src/lib/monetization/accounts.ts`
- Modify (replace whole body): `src/app/api/stripe/webhook/route.ts`

- [ ] **Write `src/lib/monetization/accounts.ts`:**

```ts
/**
 * src/lib/monetization/accounts.ts
 *
 * THE ACCOUNT FOR A CHECKOUT EMAIL (milestone 2; ruling 20, checkout first). Finds the account through the service-role-only
 * function `auth_user_id_by_email` (db/migrations/2026-10-05-pro-subscriptions.sql) and makes it, confirmed, when none exists:
 * the buyer proved the address by paying with it, and signs in later with a magic link to it. No email is sent from here.
 *
 * Throws on any failure (no service role key, the function missing, the admin API refusing): the webhook answers 500 and Stripe
 * retries, so a buyer is never left paid and unlinked by a swallowed error.
 */
import { supabaseAdmin } from "@/lib/supabase";

async function findUserId(email: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.rpc("auth_user_id_by_email", { p_email: email });
  if (error) throw new Error(`account lookup failed: ${error.message}`);
  return typeof data === "string" && data ? data : null;
}

export async function ensureUserForEmail(email: string): Promise<string> {
  const found = await findUserId(email);
  if (found) return found;
  const { data, error } = await supabaseAdmin.auth.admin.createUser({ email, email_confirm: true });
  if (!error && data?.user?.id) return data.user.id;
  // Two events for one checkout can race to make the account: the loser finds the winner's.
  const again = await findUserId(email);
  if (again) return again;
  throw new Error(`could not make the account: ${error?.message ?? "no user returned"}`);
}
```

- [ ] **Replace `src/app/api/stripe/webhook/route.ts`:**

```ts
/**
 * /api/stripe/webhook: Stripe's events into the subscriptions table (milestone 2).
 *
 * Verifies the signature, then hands the event to the pure core (src/lib/monetization/stripe_sync.ts, which says why each
 * decision is made) with the real clients. Any failure answers 500 so Stripe retries; a success answers 200 with nothing about
 * the buyer in the body.
 *
 * Dormant until STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are set (503). The founder registers this URL in the Stripe dashboard
 * with the events checkout.session.completed and customer.subscription.created, .updated, .deleted.
 */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { handleStripeEvent, type SubLike } from "@/lib/monetization/stripe_sync";
import { ensureUserForEmail } from "@/lib/monetization/accounts";

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const sig = request.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "no signature" }, { status: 400 });

  const raw = await request.text();
  const stripe = new Stripe(secret);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  try {
    await handleStripeEvent(event, {
      customerEmail: async (id) => {
        const c = await stripe.customers.retrieve(id);
        return "deleted" in c && c.deleted ? null : ((c as Stripe.Customer).email ?? null);
      },
      ensureUser: ensureUserForEmail,
      upsert: async (row) => {
        const { error } = await supabaseAdmin.from("subscriptions").upsert(row, { onConflict: "user_id" });
        if (error) throw new Error(error.message);
      },
      retrieveSubscription: async (id) => (await stripe.subscriptions.retrieve(id)) as unknown as SubLike,
      now: () => new Date(),
    });
    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[stripe webhook] sync failed:", (e as Error).message);
    return NextResponse.json({ error: "sync failed" }, { status: 500 });
  }
}
```

- [ ] **Verify:** `tsc`; `stripe-sync`, `pro-plan`, `no-silent-db-errors`, `layering` gates. If `no-silent-db-errors` or the layering
  gate names `accounts.ts`, follow its remedy (the gates' rules outrank this plan's code).
- [ ] **Commit:** `08: the webhook on the tested core; the account made from the checkout email; errors answer 500`.

---

## Step 09: checkout first

**Why.** Ruling 20: the buyer pays before any account exists. Ruling 34: consent to immediate access at checkout, cancel any time,
access to the end of the paid period. The consent tick box and automatic tax each need a setting only he can make in Stripe (a
terms URL; Stripe Tax), so each sits behind its own switch, parked, and the launch runbook turns both on.

**Files:**
- Create: `src/lib/monetization/checkout_params.ts`
- Modify (replace whole body): `src/app/api/stripe/checkout/route.ts`
- Test: `tests/monetization/checkout_params.test.ts`

- [ ] **Write the failing test** `tests/monetization/checkout_params.test.ts`:

```ts
/**
 * CHECKOUT FIRST (milestone 2; rulings 20 and 34): a subscription checkout that needs no account, never a trial, returns to the
 * welcome page with its session, says the renewal plainly, and asks for consent and tax only when his Stripe settings exist.
 *
 * Run: npx tsx tests/monetization/checkout_params.test.ts
 */
import { checkoutParams, RENEWAL_LINE, CONSENT_LINE } from "../../src/lib/monetization/checkout_params";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "checkout-params";
const FILE = "src/lib/monetization/checkout_params.ts";
const REMEDY = "a subscription checkout with no account required, no trial, the welcome return, and consent and tax behind his switches";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const base = checkoutParams({ priceId: "price_m", origin: "https://www.marginatlas.com", email: null, userId: null, env: {} });
check("a subscription for the one price", base.mode === "subscription" && base.line_items?.[0]?.price === "price_m");
check("no account needed: no email or reference without a session", !("customer_email" in base) && !("client_reference_id" in base));
check("no trial anywhere", !JSON.stringify(base).includes("trial"));
check("success returns to the welcome page with the session id", base.success_url === "https://www.marginatlas.com/welcome?session_id={CHECKOUT_SESSION_ID}");
check("cancel returns to pricing", base.cancel_url === "https://www.marginatlas.com/pricing");
check("the renewal is said at the button", base.custom_text?.submit?.message === RENEWAL_LINE);
check("no consent box or tax until his settings exist", !base.consent_collection && !base.automatic_tax);

const signedIn = checkoutParams({ priceId: "price_y", origin: "https://x.test", email: "a@b.c", userId: "u1", env: {} });
check("a signed-in buyer's email and id are carried", signedIn.customer_email === "a@b.c" && signedIn.client_reference_id === "u1");

const switched = checkoutParams({ priceId: "price_y", origin: "https://x.test", email: null, userId: null, env: { STRIPE_TERMS_CONSENT: "1", STRIPE_AUTOMATIC_TAX: "1" } });
check("his consent switch asks for the terms and immediate access", switched.consent_collection?.terms_of_service === "required" && switched.custom_text?.terms_of_service_acceptance?.message === CONSENT_LINE);
check("his tax switch turns on Stripe Tax and requires the address it needs", switched.automatic_tax?.enabled === true && switched.billing_address_collection === "required");
for (const line of [RENEWAL_LINE, CONSENT_LINE]) check(`plain copy, no em dash or semicolon: "${line}"`, !/[\u2014;]/.test(line));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("monetization/checkout_params: all pass");
```

- [ ] **Run it:** expected failure: module not found.
- [ ] **Write `src/lib/monetization/checkout_params.ts`:**

```ts
/**
 * src/lib/monetization/checkout_params.ts
 *
 * CHECKOUT FIRST (milestone 2; his interview of 2026-09-26: 20, the account made from the checkout email, no trial; 34, cancel any
 * time, access to the end of the paid period, consent to immediate access at checkout).
 *
 * Two parts wait on settings only he can make in Stripe, each behind its own switch so the code is ready and nothing breaks
 * before then: STRIPE_TERMS_CONSENT=1 once a terms URL is set in the Stripe dashboard (Stripe refuses a consent box without
 * one), STRIPE_AUTOMATIC_TAX=1 once Stripe Tax is on for his VAT registration (ruling 16). The launch runbook turns both on.
 */
import type Stripe from "stripe";

export const RENEWAL_LINE = "Pro renews until you cancel. Cancel any time and keep access to the end of the period you paid for.";
export const CONSENT_LINE = "I ask for access to start now, so my 14-day right to cancel ends when access begins.";

type Env = Record<string, string | undefined>;

export function checkoutParams(a: { priceId: string; origin: string; email: string | null; userId: string | null; env: Env }): Stripe.Checkout.SessionCreateParams {
  const consent = a.env.STRIPE_TERMS_CONSENT === "1";
  const tax = a.env.STRIPE_AUTOMATIC_TAX === "1";
  return {
    mode: "subscription",
    line_items: [{ price: a.priceId, quantity: 1 }],
    ...(a.email ? { customer_email: a.email } : {}),
    ...(a.userId ? { client_reference_id: a.userId } : {}),
    success_url: `${a.origin}/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${a.origin}/pricing`,
    allow_promotion_codes: false,
    billing_address_collection: tax ? "required" : "auto",
    ...(tax ? { automatic_tax: { enabled: true } } : {}),
    ...(consent ? { consent_collection: { terms_of_service: "required" as const } } : {}),
    custom_text: {
      submit: { message: RENEWAL_LINE },
      ...(consent ? { terms_of_service_acceptance: { message: CONSENT_LINE } } : {}),
    },
  };
}
```

- [ ] **Replace `src/app/api/stripe/checkout/route.ts`:**

```ts
/**
 * /api/stripe/checkout: start a Pro checkout (milestone 2; ruling 20, checkout first).
 *
 * POST { interval: "month" | "year" } -> { url }. No account needed: a signed-in buyer's email is carried, anyone else gives
 * theirs to Stripe, and the webhook makes the account from it. Dormant (503) until auth is on and STRIPE_SECRET_KEY and the two
 * Pro price ids (STRIPE_PRICE_PRO_MONTHLY, STRIPE_PRICE_PRO_ANNUAL) are set. The parameters are src/lib/monetization/checkout_params.ts.
 */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSessionUser } from "@/lib/auth/session";
import { isAuthEnabled } from "@/lib/feature_flags";
import { proPriceId, type BillingInterval } from "@/lib/monetization/plan";
import { checkoutParams } from "@/lib/monetization/checkout_params";

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!isAuthEnabled() || !secret) return NextResponse.json({ error: "billing not configured" }, { status: 503 });

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    // an empty body buys the monthly plan
  }
  const interval: BillingInterval = body.interval === "year" ? "year" : "month";
  const priceId = proPriceId(interval);
  if (!priceId) return NextResponse.json({ error: "price not configured" }, { status: 503 });

  const user = await getSessionUser();
  try {
    const stripe = new Stripe(secret);
    const { origin } = new URL(request.url);
    const session = await stripe.checkout.sessions.create(
      checkoutParams({ priceId, origin, email: user?.email ?? null, userId: user?.id ?? null, env: process.env }),
    );
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "checkout failed" }, { status: 500 });
  }
}
```

- [ ] **Park** in `PARKED.md`: (1) the terms URL in Stripe's dashboard, then `STRIPE_TERMS_CONSENT=1`; (2) VAT: Stripe Tax on, then
  `STRIPE_AUTOMATIC_TAX=1`, and whether $38 / $238 include VAT for UK buyers (recommendation: prices shown to consumers include
  VAT, so set the two Stripe prices as tax-inclusive); (3) create the Pro product with the two prices, then
  `STRIPE_PRICE_PRO_MONTHLY` and `STRIPE_PRICE_PRO_ANNUAL` in Vercel.
- [ ] **Verify:** the test, `tsc`; wire `checkout-params`; counts; carriers.
- [ ] **Commit:** `09: checkout first (no account needed, no trial); consent and tax behind his Stripe settings`.

---

## Step 10: the paywall's switch, and what it needs before it can be on

**Why.** Locking half of every UK chapter while nobody can buy would be a page that takes and offers nothing. The switch can only
be on when accounts are on: one rule in one place, tested.

**Files:**
- Modify: `src/lib/feature_flags.ts` (add `isPaywallOn`)
- Test: `tests/monetization/paywall_flag.test.ts`
- Create: `docs/superpowers/plans/2026-10-05-masterplan/LAUNCH-SWITCHES.md` (the runbook stub step 38 completes)

- [ ] **Test first** (rule `paywall-flag`): with `NEXT_PUBLIC_PAYWALL=1` and auth off, `isPaywallOn()` is false; with both on,
  true; with the paywall unset and auth on, false. Set and restore `process.env` inside the test; import the module after
  setting (dynamic `await import`) if the flags read env at load time (read `feature_flags.ts` to see which).
- [ ] **Build:** `export function isPaywallOn(): boolean { return process.env.NEXT_PUBLIC_PAYWALL === "1" && isAuthEnabled(); }`
  with a comment citing rulings 18, 21 and 27 (half of every UK chapter, one launch day, UK pages only).
- [ ] **LAUNCH-SWITCHES.md:** a table, in the order he flips them on launch day: the two migrations applied; the Stripe product
  and two prices; `STRIPE_SECRET_KEY` (live), `STRIPE_WEBHOOK_SECRET`, the webhook endpoint and its four events; the portal's
  settings; the terms URL then `STRIPE_TERMS_CONSENT=1`; Stripe Tax then `STRIPE_AUTOMATIC_TAX=1`; `STRIPE_PRICE_PRO_MONTHLY`,
  `STRIPE_PRICE_PRO_ANNUAL`; `NEXT_PUBLIC_AUTH_ENABLED=1`; `NEXT_PUBLIC_PAYWALL=1`; `NEXT_PUBLIC_WEB_ANALYTICS=1`; then a redeploy.
  Each row: where (Vercel, Stripe, Supabase), what to click, what he should see.
- [ ] **Verify** the test, `tsc`; wire `paywall-flag`; counts; carriers.
- [ ] **Commit:** `10: the paywall's switch, on only with accounts; the launch switches listed in order`.
## Step 11: the welcome page, the account's plan, and cancelling

**Why.** A checkout-first buyer lands somewhere that says the plan is theirs and how to sign in; a subscriber sees their plan and
can cancel without writing to anyone (ruling 34, cancel any time).

**Files:**
- Create: `src/app/(site)/welcome/page.tsx` (dynamic, noindex)
- Create: `src/app/api/stripe/portal/route.ts`
- Create: `src/components/monetization/PlanStatus.tsx` (server) and `src/components/monetization/ManagePlanButton.tsx` (client)
- Modify: `src/app/(site)/account/page.tsx` (mount PlanStatus above the saved cells)
- Modify: `src/app/(site)/signin/SignInForm.tsx` (an optional `initialEmail` prop; read the file first and keep its behaviour)
- Test: `tests/monetization/plan_status.test.ts`

- [ ] **Pure words first.** In `PlanStatus.tsx` export a pure `planStatusLine(row: { tier: string; status: string; current_period_end: string | null; cancel_at_period_end: boolean } | null, now: Date): { label: string; line: string | null }`
  returning: no row or tier free → `{ label: "Free", line: null }`; pro and not cancelling → `{ label: "Pro", line: "Renews on 5 November 2026" }`;
  pro and cancelling → `{ label: "Pro", line: "Ends on 5 November 2026" }`; status `past_due` → line `"Payment failed. Update your card"`.
  Dates in the site's long form (day, month name, year; `en-GB`). Test those four cases in `tests/monetization/plan_status.test.ts`
  (same PASS/red style as step 05; rule `plan-status`), see them fail, then build.
- [ ] **The portal route** `src/app/api/stripe/portal/route.ts`: POST; 503 unless `isAuthEnabled()` and `STRIPE_SECRET_KEY`; 401
  without `getSessionUser()`; read the user's own row with `createSupabaseServerClient()` (`from("subscriptions").select("stripe_customer_id").eq("user_id", user.id).maybeSingle()`);
  404 `{ error: "no plan" }` without a customer id; else `stripe.billingPortal.sessions.create({ customer, return_url: `${origin}/account` })`
  and answer `{ url }`; 500 on a throw. Header comment: the portal's settings (cancel at period end, card updates) are his, in the
  Stripe dashboard; park that.
- [ ] **ManagePlanButton** (client): one button "Manage or cancel"; on click POST `/api/stripe/portal`, then
  `window.location.assign(url)`; on failure one line under it, "Could not open billing. Try again." No modal, no toast.
- [ ] **PlanStatus** (server): reads the row the same way; draws the label at the card's figure rung, the line under it, and
  ManagePlanButton when tier is pro; a "See what Pro opens" link to `/pricing` when free.
- [ ] **The welcome page** `src/app/(site)/welcome/page.tsx`: `export const dynamic = "force-dynamic"`; metadata robots
  `{ index: false, follow: false }`; reads `searchParams.session_id`; with `STRIPE_SECRET_KEY` set, retrieves the session
  (`stripe.checkout.sessions.retrieve(id)`); when `status === "complete"`, shows "Pro is yours" and "Sign in with {email} to open
  it." above `SignInForm initialEmail={email}`; otherwise "We could not find that checkout." with a link to `/pricing`. Never
  prints the session id; never trusts the query string for the email.
- [ ] **Verify:** `tsc`; `plan-status` wired; `page-metadata`, `canonical-urls`, `main-landmark`, `route-chrome-contract` gates
  (new routes must satisfy them; follow their remedies).
- [ ] **Commit:** `11: the welcome page, the account's plan and cancelling through Stripe's portal`.

---

## Step 12: the pricing page sells one plan, and every old price leaves

**Why.** `/pricing` sells Basic $37 and Premium $77 today, its metadata repeats them, the home page's `UpgradeTeaser` and
`paywall_copy.ts` carry them, `README.md:21` too. One plan, from `plan.ts`, everywhere.

**Files:**
- Modify: `src/app/(site)/pricing/page.tsx` (rewrite the body; keep its route, metadata shape and newsletter fallback)
- Modify: `src/components/monetization/paywall_copy.ts`, `src/components/monetization/CheckoutButton.tsx`
- Modify: `README.md` (the stale line)
- Test: `tests/monetization/one_price.test.ts`

- [ ] **The gate first** `tests/monetization/one_price.test.ts` (rule `one-price`): walk `src/`, `content/` and `README.md`
  (skip `src/app/dev`, `src/app/_design`, `node_modules`), comments stripped with `scripts/lib/strip_comments`, and red on:
  any of the old price literals `$37`, `$77`, `$31`, `$64`, `$372`, `$768`, `$78`, `$150`, `$19/mo` anywhere; any `$38` or `$238`
  literal outside `src/lib/monetization/plan.ts` (prices print through `priceLine` or `PRO`); the words `Basic` and `Premium`
  only inside `src/components/monetization/`, `src/components/billing/`, `src/components/home/UpgradeTeaser.tsx`,
  `src/components/account/`, `src/app/(site)/account/`, `src/app/(site)/pricing/`, `src/lib/pricing/`, `src/lib/monetization/`
  (elsewhere "Premium" means other things: `copy.ts`'s kit budget tier, the decide page's "Premium pricing"). Run it: it fails on
  today's files. The map of 2026-10-05 found them: `pricing/page.tsx` L10, L54-55 (metadata), L2, 9, 17, 120, 283;
  `paywall_copy.ts` L46-94; `PaywallModalRoot.tsx`; `UpgradeTeaser.tsx` L42-43; `BlurredOverlay.tsx:46`; `LockPill.tsx`;
  `MoreDepthBanner.tsx:46`; `TruncatedTease.tsx`; `QuartileMarkers.tsx`; `RedactedNumber.tsx:33`; `TakeHomeValue.tsx`;
  `GatedTakeHome.tsx`; `CompareClient.tsx` L146, 154; `PricingFAQ.tsx` L20, 32, 36 (it also promises billing in local currency,
  against ruling 33); `api/export-csv/route.ts:158`; `src/lib/pricing/matrix.ts`; `free_paid_map.ts`; `AccountPreview.tsx:336`
  ("Pro · $19/mo"); `README.md:21` ("Free / $38 / $78 / $150+").
- [ ] **The page:** one plan card at the page's figure rung: the name "Pro"; two buttons side by side (stacked under 420px),
  `CheckoutButton interval="month"` labelled `priceLine("month")` and `CheckoutButton interval="year"` labelled
  `priceLine("year")` with "billed annually" under it; "What Pro opens" as a short list: the second half of every chapter on UK
  pages, then the four Pro sections by their titles (step 22 onward names them; until then list "the lease, by law", "one hire,
  all in", "what failing costs", "opening from abroad" in lower case); the cancel-any-time block; one line "Prices in US
  dollars." When billing is dormant (`billingLive` false) the two buttons become the existing "Notify me when Pro opens" link to
  `#newsletter`. No Free column, no comparison table, no countdown, no "Upgrade now", no `.99`.
- [ ] **CheckoutButton:** prop `interval: "month" | "year"` sent in the POST body; a 401 can no longer happen (checkout first),
  so remove that branch; any failure shows one line under the button ("Checkout did not open. Try again."), no modal.
- [ ] **paywall_copy.ts:** one plan's words, prices from `plan.ts`; remove the Basic and Premium structures; `tsc` names their users.
  `verify_v34_research_rules.ts` rule 10 (L240-259) requires the pricing page to contain `priceAnnualTotal` and "billed annually"
  and `paywall_copy.ts` to match `priceAnnualTotal:\s*\d+` (a digit literal): change rule 10 to accept `priceAnnualTotal` taken
  from `PRO.yearlyUsd` (`priceAnnualTotal: PRO.yearlyUsd`), with a comment citing ruling 14 and the one-price gate (a price typed
  twice is the defect that gate exists for). Rule 11 requires `CANCEL_ANYTIME_BLOCK` on the pricing page: keep that name.
- [ ] **The promises that ruling 17 overturns** (the map found them): the pricing page's "free and will stay free" (L88), the
  terms' "Everything that is free today stays free", the FAQ's "Free to read, all of it" answer (L258-279, also printed as
  FAQPage structured data), `SiteChrome.tsx:285`, `UpgradeTeaser.tsx:54`. They are live and true until launch day, so each gets
  its launch wording beside it, chosen by `isPaywallOn()` (step 10):
  "Each UK chapter opens free. Pro opens the rest." The FAQPage JSON-LD follows the same switch, so search never reads a promise
  the page no longer makes.
- [ ] **Run:** `one-price` green, `tsc`, `v34-research-rules`, `monetization-coverage`, `banned-vocabulary`, `no-em-dashes`.
- [ ] **Commit:** `12: the pricing page sells one plan; no old price left anywhere`.

---

## Step 13: no pop-up, and the gates say why

**Why.** Ruling 22 (and his refusals of 2026-09-22): a locked section never opens a pop-up. `PaywallModalRoot` is mounted on every
page (`src/app/layout.tsx` L19, L226). `verify_monetization_coverage`'s check B (`scripts/audit/monetization/page_checks.ts`
L46-70) is GREEN only while it is mounted; removed, B turns PENDING, which passes silently. A check that passes either way says
nothing: B is inverted so the absence is what it proves, with his ruling written into it.

**Files:**
- Modify: `src/app/layout.tsx` (remove the `PaywallModalRoot` mount and import)
- Delete: `src/components/monetization/PaywallModalRoot.tsx` and any module only it imports (check with a search first)
- Modify: every lock that called the modal opener: it becomes a link to `/pricing`
- Modify: `scripts/audit/monetization/page_checks.ts` and `scripts/verify_monetization_coverage.ts` (check B inverted)
- Modify: `scripts/verify_v34_research_rules.ts` (read it whole first; change only what ruling 20, 22 or 34 overturns)

- [ ] **Invert check B** in `page_checks.ts`: it now passes only when NO modal root and no `role="dialog"` is mounted by the
  layout or by any monetization component, and its message cites "his ruling 22 of 2026-09-26: a locked section opens no pop-up".
  Plant: re-add the mount locally, see check B red, remove it.
- [ ] **v34 rules** (`scripts/verify_v34_research_rules.ts`; read it whole first). Keep every ban his rulings still hold (trial
  copy, contact sales, countdowns, confirmshaming, `.99`, "Upgrade now" / "Unlock now" / "Get access", "automatically charged",
  padlocks in `components/monetization`). Two bans have no scope today and reach the legal pages ruling 34 asks for: rule 2
  (`refund`, `money back`, L125-131) and rule 1's `for N days` (L116-123), which trips on the 14-day cancellation right. Exempt the
  legal pages by path (`src/app/(site)/terms/`, `privacy/`, `cookies/`, `refunds/` and `src/lib/legal/`) with a comment citing
  ruling 34; plant a "refund" line in a monetization component and see it still red. Rule 7's padlock scope compares paths with
  forward slashes, so on Windows it never fires: normalise the path (`replace(/\\/g, "/")`) and see what it then finds. Rule 12
  requires `src/components/monetization/BlurredOverlay.tsx` with `blur(6px)`: when step 15's lock replaces it, point rule 12 at the
  new component's file in the same commit; never delete the file while the rule names it.
- [ ] **Run:** `monetization-coverage`, `v34-research-rules`, `tsc`, `main-landmark`, `route-chrome-contract`.
- [ ] **Commit:** `13: no pop-up for a lock (his ruling 22); the monetization gates say so`.

---

