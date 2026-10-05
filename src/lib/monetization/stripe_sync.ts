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
