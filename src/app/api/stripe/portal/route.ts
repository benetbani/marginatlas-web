/**
 * /api/stripe/portal: open Stripe's billing portal for the signed-in reader (milestone 2; masterplan step 11; ruling 34, cancel
 * any time and keep access to the end of the paid period).
 *
 * POST -> { url }. 503 until accounts are on and STRIPE_SECRET_KEY is set; 401 signed out; 404 when the reader's own row holds no
 * Stripe customer. The portal's own settings (cancel at the period's end, card updates, the return link) are his, in the Stripe
 * dashboard (LAUNCH-SWITCHES.md, row 5).
 */
import { tooMany } from "@/lib/rate_limit";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { isAuthEnabled } from "@/lib/feature_flags";
import { getSessionUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const limited = tooMany(request, "stripe-portal", 10);
  if (limited) return limited;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!isAuthEnabled() || !secret) return NextResponse.json({ error: "billing not configured" }, { status: 503 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "sign in" }, { status: 401 });
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("subscriptions").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();
    if (error) throw new Error(error.message);
    const customer = (data as { stripe_customer_id?: string | null } | null)?.stripe_customer_id ?? null;
    if (!customer) return NextResponse.json({ error: "no plan" }, { status: 404 });
    const stripe = new Stripe(secret);
    const { origin } = new URL(request.url);
    const session = await stripe.billingPortal.sessions.create({ customer, return_url: `${origin}/account` });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[stripe portal] failed:", (e as Error).message);
    return NextResponse.json({ error: "portal failed" }, { status: 500 });
  }
}
