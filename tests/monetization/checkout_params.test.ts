/**
 * CHECKOUT FIRST (milestone 2; rulings 20 and 34): a subscription checkout that needs no account, never a trial, returns to the
 * welcome page with its session, says the renewal plainly, and asks for consent and tax only when his Stripe settings exist.
 *
 * Run: npx tsx tests/monetization/checkout_params.test.ts
 */
import { checkoutParams, RENEWAL_LINE, CONSENT_LINE } from "../../src/lib/monetization/checkout_params";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "checkout-params";
const FILE = "src/lib/monetization/checkout_params.ts";
const REMEDY = "a subscription checkout with no account required, no trial, the welcome return, and consent and tax behind his switches";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const base = checkoutParams({ priceId: "price_m", origin: "https://www.marginatlas.com", email: null, userId: null, env: {} });
check("a subscription for the one price", base.mode === "subscription" && base.line_items?.[0]?.price === "price_m");
check("no account needed: no email or reference without a session", !("customer_email" in base) && !("client_reference_id" in base));
check("no trial anywhere", !JSON.stringify(base).includes("trial"));
check("success returns to the welcome page with the session id", base.success_url === "https://www.marginatlas.com/welcome?session_id={CHECKOUT_SESSION_ID}");
check("cancel returns to pricing", base.cancel_url === "https://www.marginatlas.com/pricing");
/* Stripe's types allow "" to unset a custom text, so the message is read through a narrowing. */
const messageOf = (t: unknown): string | undefined => (t && typeof t === "object" ? (t as { message?: string }).message : undefined);
check("the renewal is said at the button", messageOf(base.custom_text?.submit) === RENEWAL_LINE);
check("no consent box or tax until his settings exist", !base.consent_collection && !base.automatic_tax);

const signedIn = checkoutParams({ priceId: "price_y", origin: "https://x.test", email: "a@b.c", userId: "u1", env: {} });
check("a signed-in buyer's email and id are carried", signedIn.customer_email === "a@b.c" && signedIn.client_reference_id === "u1");

const switched = checkoutParams({ priceId: "price_y", origin: "https://x.test", email: null, userId: null, env: { STRIPE_TERMS_CONSENT: "1", STRIPE_AUTOMATIC_TAX: "1" } });
check("his consent switch asks for the terms and immediate access", switched.consent_collection?.terms_of_service === "required" && messageOf(switched.custom_text?.terms_of_service_acceptance) === CONSENT_LINE);
check("his tax switch turns on Stripe Tax and requires the address it needs", switched.automatic_tax?.enabled === true && switched.billing_address_collection === "required");
for (const line of [RENEWAL_LINE, CONSENT_LINE]) check(`plain copy, no em dash or semicolon: "${line}"`, !/[\u2014;]/.test(line));

/* The checkup of 2026-10-06 (finding 2): a returning customer checks out as that customer, never as a second one. */
const returning = checkoutParams({ priceId: "price_m", origin: "https://www.marginatlas.com", email: "a@b.c", userId: "u1", customerId: "cus_9", env: {} });
check("a returning customer is reused, its email not sent beside it (Stripe takes one)", returning.customer === "cus_9" && !("customer_email" in returning) && returning.client_reference_id === "u1");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("monetization/checkout_params: all pass");
