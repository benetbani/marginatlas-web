/**
 * src/lib/monetization/pro_row.ts
 *
 * Whether a subscriptions row makes its reader Pro: a pure rule with no client, so the session's tier (entitlement.ts), checkout's
 * guard (/api/stripe/checkout) and their tests read one definition. Moved here from entitlement.ts by the checkup of 2026-10-06.
 */
import { ENTITLED_STATUSES } from "@/lib/monetization/stripe_sync";

/** The fields of a subscriptions row the Pro question reads. */
export type PlanRow = { tier?: unknown; status?: unknown; current_period_end?: unknown };

/* ONE PAID TIER, NO TRIAL (masterplan step 05; his rulings 14 and 20): Pro while Stripe says the plan is paid, or is retrying a
   failed payment (past_due), the webhook's core's own two statuses, read from it (src/lib/monetization/stripe_sync.ts), and the
   paid period not yet over. One rule, read by every caller that asks (the session's tier; checkout's guard, the checkup of
   2026-10-06). */
export function isProRow(row: PlanRow | null | undefined, now: Date = new Date()): boolean {
  if (!row) return false;
  const active = ENTITLED_STATUSES.has(String(row.status));
  const periodOk = !row.current_period_end || new Date(String(row.current_period_end)).getTime() > now.getTime();
  return active && periodOk && row.tier === "pro";
}
