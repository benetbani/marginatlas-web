/**
 * THE ACCOUNT'S PLAN, IN WORDS (milestone 2; masterplan step 11; his interview of 2026-09-26, ruling 34: cancel any time, access to
 * the end of the paid period). A reader's account says Free, or Pro and when it renews, or when it ends after a cancel, or that a
 * payment failed; the dates in the site's long form.
 *
 * Run: npx tsx tests/monetization/plan_status.test.ts
 */
import { planStatusLine } from "../../src/components/monetization/PlanStatus";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "plan-status";
const FILE = "src/components/monetization/PlanStatus.tsx";
const REMEDY = "say Free, or Pro with its renewal or end date in the long form, or that the payment failed";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const NOW = new Date("2026-10-05T12:00:00Z");
const END = "2026-11-05T00:00:00.000Z";
const row = (tier: string, status: string, cancel = false) => ({ tier, status, current_period_end: END, cancel_at_period_end: cancel });
const eq = (a: { label: string; line: string | null }, b: { label: string; line: string | null }) => a.label === b.label && a.line === b.line;

check("no row is Free", eq(planStatusLine(null, NOW), { label: "Free", line: null }));
check("a free row is Free", eq(planStatusLine(row("free", "canceled"), NOW), { label: "Free", line: null }));
check("Pro renewing says when", eq(planStatusLine(row("pro", "active"), NOW), { label: "Pro", line: "Renews on 5 November 2026" }));
check("Pro cancelling says when it ends", eq(planStatusLine(row("pro", "active", true), NOW), { label: "Pro", line: "Ends on 5 November 2026" }));
check("a failed payment says so", eq(planStatusLine(row("pro", "past_due"), NOW), { label: "Pro", line: "Payment failed. Update your card" }));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("monetization/plan_status: all pass");
