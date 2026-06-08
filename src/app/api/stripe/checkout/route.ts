/**
 * /api/stripe/checkout — start a subscription checkout (Milestone 2).
 *
 * POST { tier: "basic"|"premium", interval: "month"|"year" } -> { url } (the
 * Stripe Checkout URL to redirect to). No trial (founder rule); annual is just a
 * different price. Dormant until the founder sets STRIPE_SECRET_KEY + the price
 * IDs in env; without them this returns 503, so the pricing page keeps its
 * newsletter CTA. Requires a signed-in user.
 *
 * Env: STRIPE_SECRET_KEY, STRIPE_PRICE_BASIC_MONTHLY, STRIPE_PRICE_BASIC_ANNUAL,
 * STRIPE_PRICE_PREMIUM_MONTHLY, STRIPE_PRICE_PREMIUM_ANNUAL.
 */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSessionUser } from "@/lib/auth/session";
import { isAuthEnabled } from "@/lib/feature_flags";

const PRICE_IDS: Record<"basic" | "premium", Record<"month" | "year", string | undefined>> = {
  basic: {
    month: process.env.STRIPE_PRICE_BASIC_MONTHLY,
    year: process.env.STRIPE_PRICE_BASIC_ANNUAL,
  },
  premium: {
    month: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
    year: process.env.STRIPE_PRICE_PREMIUM_ANNUAL,
  },
};

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!isAuthEnabled() || !secret) {
    return NextResponse.json({ error: "billing not configured" }, { status: 503 });
  }
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    // empty body is fine; defaults below
  }
  const tier: "basic" | "premium" = body.tier === "premium" ? "premium" : "basic";
  const interval: "month" | "year" = body.interval === "year" ? "year" : "month";
  const priceId = PRICE_IDS[tier][interval];
  if (!priceId) {
    return NextResponse.json({ error: "price not configured" }, { status: 503 });
  }

  try {
    const stripe = new Stripe(secret);
    const { origin } = new URL(request.url);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: user.email ?? undefined,
      client_reference_id: user.id,
      subscription_data: { metadata: { supabase_user_id: user.id } },
      metadata: { supabase_user_id: user.id },
      success_url: `${origin}/account?upgraded=1`,
      cancel_url: `${origin}/pricing`,
      allow_promotion_codes: false,
    });
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "checkout failed" }, { status: 500 });
  }
}
