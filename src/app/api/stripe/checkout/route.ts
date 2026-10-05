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
