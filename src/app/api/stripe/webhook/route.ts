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
