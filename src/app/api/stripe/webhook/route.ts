/**
 * /api/stripe/webhook — sync Stripe subscription status into Supabase (M2).
 *
 * Verifies the Stripe signature, then on subscription create/update/delete writes
 * the user's tier + status into public.subscriptions via the SERVICE-ROLE client
 * (which bypasses RLS; users can never write their own tier). The user is matched
 * by the supabase_user_id we stamp on the subscription metadata at checkout.
 *
 * Dormant until STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET are set (returns 503).
 * The founder registers this endpoint URL in the Stripe dashboard.
 *
 * Env also read: STRIPE_PRICE_BASIC_MONTHLY/ANNUAL, STRIPE_PRICE_PREMIUM_MONTHLY/
 * ANNUAL (to map a price id back to a tier).
 */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";

function priceTier(priceId: string | undefined): "basic" | "premium" | null {
  if (!priceId) return null;
  if (
    priceId === process.env.STRIPE_PRICE_BASIC_MONTHLY ||
    priceId === process.env.STRIPE_PRICE_BASIC_ANNUAL
  )
    return "basic";
  if (
    priceId === process.env.STRIPE_PRICE_PREMIUM_MONTHLY ||
    priceId === process.env.STRIPE_PRICE_PREMIUM_ANNUAL
  )
    return "premium";
  return null;
}

/** Read the period end from the subscription or its first item (Stripe moved this
 * field onto items in newer API versions). Cast-guarded so it compiles either way. */
function periodEndISO(sub: Stripe.Subscription): string | null {
  const top = (sub as unknown as { current_period_end?: number }).current_period_end;
  const item = sub.items?.data?.[0] as unknown as { current_period_end?: number } | undefined;
  const ts = top ?? item?.current_period_end;
  return typeof ts === "number" ? new Date(ts * 1000).toISOString() : null;
}

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }
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
    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const sub = event.data.object as Stripe.Subscription;
      const userId =
        (sub.metadata?.supabase_user_id as string | undefined) ?? null;
      if (userId) {
        const deleted = event.type === "customer.subscription.deleted";
        const status = deleted ? "canceled" : sub.status;
        const entitledTier = priceTier(sub.items.data[0]?.price?.id);
        const active = status === "active" || status === "trialing";
        await supabaseAdmin.from("subscriptions").upsert(
          {
            user_id: userId,
            tier: active && entitledTier ? entitledTier : "free",
            status,
            stripe_customer_id:
              typeof sub.customer === "string" ? sub.customer : sub.customer.id,
            stripe_subscription_id: sub.id,
            current_period_end: periodEndISO(sub),
            cancel_at_period_end: sub.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );
      }
    }
  } catch {
    // Swallow + 200 so Stripe does not retry forever on a transient DB error;
    // the next subscription event will reconcile.
  }

  return NextResponse.json({ received: true });
}
