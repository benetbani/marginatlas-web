/**
 * scripts/billing/reconcile.ts
 *
 * THE BILLING RECONCILE (the checkup of 2026-10-06, finding 2: nothing compared the subscriptions table with Stripe; a webhook
 * failure reached only the console). For every account row that holds a Stripe customer, the customer's subscriptions are read
 * from Stripe, the governing one chosen by the webhook's own core (src/lib/monetization/stripe_sync.ts), and the row it would
 * write compared with the row stored. Each difference is printed; nothing is written unless `--apply` is given, and then only
 * the rows that differ, through the same upsert the webhook uses.
 *
 * By hand, after launch, never in the chain (it needs Stripe and the database):
 *   npx tsx --env-file=.env.local scripts/billing/reconcile.ts            a dry run: what differs, and why
 *   npx tsx --env-file=.env.local scripts/billing/reconcile.ts --apply    write the derived rows that differ
 * Prints account ids, never an email, a key or a card.
 */
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { governingSubscription, rowFromSubscription, type SubLike, type SubscriptionRow } from "../../src/lib/monetization/stripe_sync";

/** The fields a stored row and a derived one must agree on; the update time is not one of them. */
export const RECONCILED_FIELDS = ["tier", "status", "stripe_subscription_id", "current_period_end", "cancel_at_period_end"] as const;

/** What differs between a stored row and the row Stripe implies, field by field (an empty list: they agree). */
export function diffPlanRows(stored: Partial<SubscriptionRow>, derived: SubscriptionRow): Array<{ field: string; stored: unknown; derived: unknown }> {
  const norm = (f: string, v: unknown) => (f === "current_period_end" && v ? new Date(String(v)).toISOString() : v ?? null);
  return RECONCILED_FIELDS.filter((f) => norm(f, stored[f]) !== norm(f, derived[f])).map((f) => ({ field: f, stored: stored[f] ?? null, derived: derived[f] }));
}

async function main() {
  const apply = process.argv.includes("--apply");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!url || !service || !secret) {
    console.error("reconcile: needs NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and STRIPE_SECRET_KEY (names only)");
    process.exit(2);
  }
  const db = createClient(url, service, { auth: { persistSession: false } });
  const stripe = new Stripe(secret);
  const { data: rows, error } = await db.from("subscriptions").select("*").not("stripe_customer_id", "is", null);
  if (error) { console.error(`reconcile: the subscriptions table could not be read: ${error.message}`); process.exit(1); }
  let differing = 0;
  for (const stored of (rows ?? []) as SubscriptionRow[]) {
    const subs = (await stripe.subscriptions.list({ customer: stored.stripe_customer_id as string, status: "all", limit: 20 })).data as unknown as SubLike[];
    const governing = governingSubscription(subs);
    if (!governing) { console.log(`${stored.user_id}: Stripe holds no subscription for the customer; left as it is`); continue; }
    const derived = rowFromSubscription(governing, stored.user_id, new Date());
    const diff = diffPlanRows(stored, derived);
    if (!diff.length) continue;
    differing++;
    console.log(`${stored.user_id}: ${diff.map((d) => `${d.field} ${JSON.stringify(d.stored)} -> ${JSON.stringify(d.derived)}`).join("; ")}`);
    if (apply) {
      const { error: e } = await db.from("subscriptions").upsert(derived, { onConflict: "user_id" });
      console.log(e ? `  not written: ${e.message}` : "  written");
    }
  }
  console.log(`reconcile: ${rows?.length ?? 0} account(s) with a customer, ${differing} differing${apply ? ", the differing rows written" : " (a dry run; --apply writes them)"}`);
}

if (process.argv[1] && /reconcile\.ts$/.test(process.argv[1].split("\\").join("/"))) main();
