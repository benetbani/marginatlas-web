/**
 * src/lib/monetization/stripe_sync.ts
 *
 * WHAT A STRIPE EVENT DOES TO AN ACCOUNT (milestone 2; his interview of 2026-09-26: 14, one plan; 20, checkout first, the account
 * made from the checkout email, no trial; 34, access to the end of the paid period).
 *
 * Three decisions the June webhook got wrong, each made here once:
 *  - THE BUYER IS FOUND, AND MADE WHEN NONE EXISTS. Checkout first means the buyer may have no account when they pay. In order:
 *    the account the checkout itself names (`client_reference_id`, set by our own server for a signed-in buyer); the account
 *    already holding the Stripe customer; the account for the checkout or customer email, made when none exists.
 *  - THE READER'S STATE IS RE-DERIVED FROM STRIPE on every event. Stripe does not promise order: an "updated: active" can arrive
 *    after a "deleted". The event's own copy is never trusted; the row is written from what Stripe says now.
 *  - A DATABASE ERROR REJECTS. The route answers 500 and Stripe retries for days; a swallowed error was a paying customer locked out.
 *
 * Two the night build got wrong, found by the checkup of 2026-10-06 (finding 2), fixed here:
 *  - ONE ROW PER ACCOUNT, MANY SUBSCRIPTIONS PER CUSTOMER. A customer can hold two subscriptions (a second checkout, an old
 *    cancelled one), and the row is keyed on the account, so an event for the cancelled one wrote "free" over a paying reader.
 *    Every event now writes the GOVERNING subscription among all the customer's: an entitled one on a Pro price, the latest
 *    period end first; else the newest. The event only says when to look.
 *  - A CHANGED EMAIL MADE A SECOND ACCOUNT. The customer's email is read only when no account holds the customer yet, so a
 *    buyer who changes their email at Stripe stays one account (and the unique index on the subscription id never collides).
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
  /** When Stripe made it (seconds), the tie-break for the newest. */
  created?: number;
  items: { data: Array<{ price?: { id?: string | null } | null; current_period_end?: number }> };
};

/** The parts of a Stripe Checkout Session the sync reads. */
export type SessionLike = {
  id: string;
  mode: string;
  customer: string | { id: string } | null;
  customer_email: string | null;
  customer_details?: { email?: string | null } | null;
  /** The account our own server named when it made the session (a signed-in buyer), or null. */
  client_reference_id?: string | null;
  subscription: string | { id: string } | null;
};

export type SyncDeps = {
  /** The email Stripe holds for a customer, or null. */
  customerEmail: (customerId: string) => Promise<string | null>;
  /** The account id for an email, made when none exists. */
  ensureUser: (email: string) => Promise<string>;
  /** The account already holding this Stripe customer, or null. Absent: the customer is not looked up. */
  userForCustomer?: (customerId: string) => Promise<string | null>;
  /** Every subscription the customer holds now, any status. Absent: the event's own subscription governs. */
  listSubscriptions?: (customerId: string) => Promise<SubLike[]>;
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

/** The subscription that decides a customer's row: an entitled one on a Pro price, the latest period end first; else the newest. */
export function governingSubscription(subs: SubLike[], env?: Record<string, string | undefined>): SubLike | null {
  if (subs.length === 0) return null;
  const end = (x: SubLike) => x.current_period_end ?? x.items?.data?.[0]?.current_period_end ?? 0;
  const entitled = subs.filter((x) => ENTITLED_STATUSES.has(x.status) && intervalOfPrice(x.items?.data?.[0]?.price?.id ?? null, env) !== null);
  const pool = entitled.length ? entitled : subs;
  return [...pool].sort((a, b) => end(b) - end(a) || (b.created ?? 0) - (a.created ?? 0))[0];
}

const SUBSCRIPTION_EVENTS = new Set(["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"]);

/** Find the account (the checkout's own, the customer's, then by email, made when none exists) and write the governing row. */
async function writeFor(
  a: { customerId: string | null; reference: string | null; email: () => Promise<string>; fallback: SubLike },
  deps: SyncDeps,
): Promise<SyncOutcome> {
  let userId = a.reference;
  if (!userId && a.customerId && deps.userForCustomer) userId = await deps.userForCustomer(a.customerId);
  if (!userId) {
    const email = cleanEmail(await a.email());
    if (!email) return { handled: false, skipped: "no account holds the customer and Stripe holds no email for it" };
    userId = await deps.ensureUser(email);
  }
  const all = a.customerId && deps.listSubscriptions ? await deps.listSubscriptions(a.customerId) : [];
  const governing = governingSubscription(all.length ? all : [a.fallback], deps.env) ?? a.fallback;
  const row = rowFromSubscription(governing, userId, deps.now(), deps.env);
  await deps.upsert(row);
  return { handled: true, tier: row.tier };
}

/** Apply one Stripe event. Resolves with what it did; rejects on any client error so the caller answers 500. */
export async function handleStripeEvent(event: { type: string; data: { object: unknown } }, deps: SyncDeps): Promise<SyncOutcome> {
  if (event.type === "checkout.session.completed") {
    const s = event.data.object as SessionLike;
    if (s.mode !== "subscription") return { handled: false, skipped: "not a subscription checkout" };
    const email = cleanEmail(s.customer_details?.email ?? s.customer_email);
    const subId = idOf(s.subscription);
    if (!subId) return { handled: false, skipped: "the checkout holds no subscription" };
    const reference = typeof s.client_reference_id === "string" && s.client_reference_id ? s.client_reference_id : null;
    if (!email && !reference && !idOf(s.customer)) return { handled: false, skipped: "the checkout holds no email and names no account" };
    const fresh = await deps.retrieveSubscription(subId);
    return writeFor({ customerId: idOf(fresh.customer) ?? idOf(s.customer), reference, email: async () => email, fallback: fresh }, deps);
  }
  if (SUBSCRIPTION_EVENTS.has(event.type)) {
    const seen = event.data.object as SubLike;
    const fresh = await deps.retrieveSubscription(seen.id);
    const customerId = idOf(fresh.customer) ?? idOf(seen.customer);
    return writeFor(
      { customerId, reference: null, email: async () => (customerId ? (await deps.customerEmail(customerId)) ?? "" : ""), fallback: fresh },
      deps,
    );
  }
  return { handled: false, skipped: `not an event Pro needs (${event.type})` };
}
