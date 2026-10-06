/**
 * WHAT A STRIPE EVENT DOES TO AN ACCOUNT (milestone 2; rulings 14, 20, 34; the checkup of 2026-10-06, finding 2): checkout first,
 * so an event finds the buyer (the account the checkout names, the account holding the customer, then by email, made when none
 * exists) and writes the customer's governing subscription, so an old cancelled one never downgrades a paying reader; every event re-reads the subscription from Stripe, so an event arriving late
 * cannot re-grant a cancelled plan; a database error rejects, so the route answers 500 and Stripe retries.
 *
 * Run: npx tsx tests/monetization/stripe_sync.test.ts
 */
import { governingSubscription, handleStripeEvent, rowFromSubscription, type SubLike, type SubscriptionRow } from "../../src/lib/monetization/stripe_sync";
import { isProRow } from "../../src/lib/monetization/pro_row";
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

  /* THE CHECKUP OF 2026-10-06 (finding 2): many subscriptions per customer, one row per account, and a changed email. */
  const s = (id: string, status: string, end: number, created = 0, price = "price_m"): SubLike => ({ id, status, customer: "cus_1", cancel_at_period_end: false, created, items: { data: [{ price: { id: price }, current_period_end: end }] } });
  const oldCancelled = s("sub_old", "canceled", 1790000000, 100);
  const livePro = s("sub_live", "active", 1793836800, 200);
  check("the governing subscription is the entitled Pro one, whatever came newer", governingSubscription([oldCancelled, livePro], env)?.id === "sub_live" && governingSubscription([livePro, s("sub_new", "canceled", 1799999999, 300)], env)?.id === "sub_live");
  check("among entitled ones, the latest period end governs", governingSubscription([s("a", "active", 1793000000), s("b", "past_due", 1794000000)], env)?.id === "b");
  check("with none entitled, the newest governs (period end, then created)", governingSubscription([s("a", "canceled", 1790000000, 1), s("b", "incomplete_expired", 1790000000, 2)], env)?.id === "b");
  check("a subscription on a price that is not Pro's never governs over a Pro one", governingSubscription([s("x", "active", 1799999999, 9, "price_old"), s("p", "active", 1793000000)], env)?.id === "p");

  writes.length = 0; made.length = 0;
  const many = { ...deps(oldCancelled), userForCustomer: async () => "u-existing", listSubscriptions: async () => [oldCancelled, livePro] };
  await handleStripeEvent({ type: "customer.subscription.deleted", data: { object: oldCancelled } }, many);
  check("an event for an old cancelled subscription leaves a paying reader on Pro", writes[0]?.tier === "pro" && writes[0]?.stripe_subscription_id === "sub_live" && writes[0]?.user_id === "u-existing");
  check("and finds the account by the customer, making none", made.length === 0);

  writes.length = 0; made.length = 0;
  const renamed = { ...deps(livePro, { email: "new.address@example.com" }), userForCustomer: async () => "u-original", listSubscriptions: async () => [livePro] };
  await handleStripeEvent({ type: "customer.subscription.updated", data: { object: livePro } }, renamed);
  check("a buyer who changed their email at Stripe stays one account", writes[0]?.user_id === "u-original" && made.length === 0);

  writes.length = 0; made.length = 0;
  await handleStripeEvent({ type: "checkout.session.completed", data: { object: { id: "cs_3", mode: "subscription", customer: "cus_1", customer_email: "typed@example.com", client_reference_id: "u-signed-in", subscription: "sub_live" } } }, deps(livePro));
  check("a signed-in buyer's checkout writes to the account it names", writes[0]?.user_id === "u-signed-in" && made.length === 0);

  writes.length = 0; made.length = 0;
  const unknown = { ...deps(livePro, { email: null }), userForCustomer: async () => null, listSubscriptions: async () => [livePro] };
  const none = await handleStripeEvent({ type: "customer.subscription.updated", data: { object: livePro } }, unknown);
  check("no account holds the customer and Stripe holds no email: nothing written, the reason said", !none.handled && writes.length === 0 && !!none.skipped);

  /* The one Pro rule the session's tier and checkout's guard both read (src/lib/monetization/pro_row.ts). */
  const at = new Date("2026-10-06T00:00:00Z");
  check("a row is Pro while active or past_due on pro, in its paid period", isProRow({ tier: "pro", status: "active", current_period_end: "2026-11-01T00:00:00Z" }, at) && isProRow({ tier: "pro", status: "past_due", current_period_end: null }, at));
  check("a row is not Pro once its period has ended, when cancelled, or on free", !isProRow({ tier: "pro", status: "active", current_period_end: "2026-10-01T00:00:00Z" }, at) && !isProRow({ tier: "pro", status: "canceled" }, at) && !isProRow({ tier: "free", status: "active" }, at) && !isProRow(null, at));

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("monetization/stripe_sync: all pass");
}
main();
