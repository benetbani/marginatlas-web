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
