/**
 * THE BILLING RECONCILE'S COMPARISON (the checkup of 2026-10-06, finding 2; scripts/billing/reconcile.ts): a stored row and the
 * row Stripe implies agree or differ field by field, the update time never counting and a period end compared as an instant, not
 * as text. The script itself needs Stripe and the database and runs by hand; this holds the part that decides.
 *
 * Run: npx tsx tests/monetization/reconcile.test.ts
 */
import { diffPlanRows } from "../../scripts/billing/reconcile";
import type { SubscriptionRow } from "../../src/lib/monetization/stripe_sync";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "billing-reconcile";
const FILE = "scripts/billing/reconcile.ts";
const REMEDY = "compare the reconciled fields only, a period end as an instant";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const derived: SubscriptionRow = { user_id: "u1", tier: "pro", status: "active", stripe_customer_id: "cus_1", stripe_subscription_id: "sub_live", current_period_end: "2026-11-05T00:00:00.000Z", cancel_at_period_end: false, updated_at: "2026-10-06T10:00:00.000Z" };
check("a row that agrees reports nothing, whatever its update time", diffPlanRows({ ...derived, updated_at: "2026-01-01T00:00:00.000Z" }, derived).length === 0);
check("a period end written another way is the same instant", diffPlanRows({ ...derived, current_period_end: "2026-11-05T00:00:00+00:00" }, derived).length === 0);
const downgraded = diffPlanRows({ ...derived, tier: "free", status: "canceled", stripe_subscription_id: "sub_old" }, derived);
check("a reader written free by an old subscription's event is found, field by field", downgraded.map((d) => d.field).join(",") === "tier,status,stripe_subscription_id");
check("a missing field in the stored row counts as a difference", diffPlanRows({ user_id: "u1", tier: "pro" }, derived).some((d) => d.field === "status"));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("monetization/reconcile: all pass");
