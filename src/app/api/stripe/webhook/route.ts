/**
 * /api/stripe/webhook: Stripe's events into the subscriptions table (milestone 2).
 *
 * Verifies the signature, then hands the event to the pure core (src/lib/monetization/stripe_sync.ts, which says why each
 * decision is made) with the real clients. Any failure answers 500 so Stripe retries; a success answers 200 with nothing about
 * the buyer in the body.
 *
 * Dormant until STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are set (503). The founder registers this URL in the Stripe dashboard
 * with the events checkout.session.completed and customer.subscription.created, .updated, .deleted.
 *
 * THE CHECKUP OF 2026-10-06 (finding 2): the core finds the account holding the Stripe customer before it looks at an email,
 * and writes the customer's governing subscription among all of theirs, so the clients below include both lookups. Each event
 * is recorded with what the sync did (billing_events, db/migrations/2026-10-06-billing-events.sql), best effort: the record
 * never decides the answer. A failure goes to Sentry as well as the console, since a caught error never reached it.
 */
import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
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

  /* Best effort: the record of what was done never changes the answer Stripe gets. */
  const record = async (outcome: string) => {
    const { error } = await supabaseAdmin
      .from("billing_events")
      .upsert({ id: event.id, type: event.type, livemode: event.livemode, outcome }, { onConflict: "id" });
    if (error) console.warn("[stripe webhook] event not recorded:", error.message);
  };
  try {
    const outcome = await handleStripeEvent(event, {
      customerEmail: async (id) => {
        const c = await stripe.customers.retrieve(id);
        return "deleted" in c && c.deleted ? null : ((c as Stripe.Customer).email ?? null);
      },
      ensureUser: ensureUserForEmail,
      userForCustomer: async (customerId) => {
        const { data, error } = await supabaseAdmin.from("subscriptions").select("user_id").eq("stripe_customer_id", customerId).limit(1).maybeSingle();
        if (error) throw new Error(error.message);
        return typeof data?.user_id === "string" ? data.user_id : null;
      },
      listSubscriptions: async (customerId) =>
        (await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 20 })).data as unknown as SubLike[],
      upsert: async (row) => {
        const { error } = await supabaseAdmin.from("subscriptions").upsert(row, { onConflict: "user_id" });
        if (error) throw new Error(error.message);
      },
      retrieveSubscription: async (id) => (await stripe.subscriptions.retrieve(id)) as unknown as SubLike,
      now: () => new Date(),
    });
    await record(outcome.handled ? (outcome.tier ?? "handled") : `skipped: ${outcome.skipped ?? ""}`).catch(() => undefined);
    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[stripe webhook] sync failed:", (e as Error).message);
    Sentry.captureException(e, { tags: { area: "stripe-webhook", event_type: event.type } });
    await record(`failed: ${(e as Error).message}`.slice(0, 500)).catch(() => undefined);
    return NextResponse.json({ error: "sync failed" }, { status: 500 });
  }
}
