/**
 * src/components/monetization/PlanStatus.tsx
 *
 * THE ACCOUNT'S PLAN (milestone 2; masterplan step 11; his interview of 2026-09-26, ruling 34: cancel any time, keep access to
 * the end of the period paid for). Server component: reads the signed-in reader's own row (row level security lets a user read
 * only their own), says Free or Pro and the date that matters, and offers the way to manage or cancel through Stripe's portal.
 * A free reader gets one link to what Pro opens. No modal, no toast.
 */
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ManagePlanButton } from "./ManagePlanButton";

type PlanRow = { tier: string; status: string; current_period_end: string | null; cancel_at_period_end: boolean };

const LONG_DATE = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** The plan in words: "Free", or "Pro" with when it renews or ends, or that the payment failed. Pure, for the test. */
export function planStatusLine(row: PlanRow | null, now: Date): { label: string; line: string | null } {
  void now;
  if (!row || row.tier !== "pro") return { label: "Free", line: null };
  if (row.status === "past_due") return { label: "Pro", line: "Payment failed. Update your card" };
  const end = row.current_period_end ? new Date(row.current_period_end) : null;
  if (!end || Number.isNaN(end.getTime())) return { label: "Pro", line: null };
  return { label: "Pro", line: `${row.cancel_at_period_end ? "Ends" : "Renews"} on ${LONG_DATE.format(end)}` };
}

export async function PlanStatus({ userId }: { userId: string }) {
  let row: PlanRow | null = null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("subscriptions")
      .select("tier, status, current_period_end, cancel_at_period_end")
      .eq("user_id", userId)
      .maybeSingle();
    row = (data as PlanRow | null) ?? null;
  } catch {
    row = null;
  }
  const { label, line } = planStatusLine(row, new Date());
  return (
    <section className="mt-10" aria-labelledby="plan-heading">
      <h2 id="plan-heading" className="font-display text-xl font-semibold text-ink-900">Your plan</h2>
      <p className="mt-3 font-display text-3xl font-semibold leading-none text-ink-900">{label}</p>
      {line ? <p className="mt-2 text-sm text-cocoa-700">{line}</p> : null}
      {label === "Pro" ? (
        <div className="mt-4">
          <ManagePlanButton />
        </div>
      ) : (
        <Link href="/pricing" className="mt-4 inline-block text-sm font-medium text-atlas-700 underline underline-offset-2 hover:text-atlas-900">
          See what Pro opens
        </Link>
      )}
    </section>
  );
}
