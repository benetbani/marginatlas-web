/**
 * src/lib/monetization/accounts.ts
 *
 * THE ACCOUNT FOR A CHECKOUT EMAIL (milestone 2; ruling 20, checkout first). Finds the account through the service-role-only
 * function `auth_user_id_by_email` (db/migrations/2026-10-05-pro-subscriptions.sql) and makes it, confirmed, when none exists:
 * the buyer proved the address by paying with it, and signs in later with a magic link to it. No email is sent from here.
 *
 * Throws on any failure (no service role key, the function missing, the admin API refusing): the webhook answers 500 and Stripe
 * retries, so a buyer is never left paid and unlinked by a swallowed error.
 */
import { supabaseAdmin } from "@/lib/supabase";

async function findUserId(email: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.rpc("auth_user_id_by_email", { p_email: email });
  if (error) throw new Error(`account lookup failed: ${error.message}`);
  return typeof data === "string" && data ? data : null;
}

export async function ensureUserForEmail(email: string): Promise<string> {
  const found = await findUserId(email);
  if (found) return found;
  const { data, error } = await supabaseAdmin.auth.admin.createUser({ email, email_confirm: true });
  if (!error && data?.user?.id) return data.user.id;
  // Two events for one checkout can race to make the account: the loser finds the winner's.
  const again = await findUserId(email);
  if (again) return again;
  throw new Error(`could not make the account: ${error?.message ?? "no user returned"}`);
}
