import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkRateLimit, clientIp } from "@/lib/rate_limit";

/**
 * POST /api/newsletter — capture email signup.
 *
 * Writes to Supabase `newsletter_signups` table.
 * Falls back to console log if the table doesn't exist (graceful degradation).
 *
 * Hardened (2026-05-27 security pass):
 *   - Proper RFC-shaped email validation (rejects "x@" style strings).
 *   - Per-IP rate limit (5 / min). Newsletter forms are a classic
 *     signup-bomb target where attacker pumps a victim's address
 *     through legit-looking forms to bury real mail.
 *   - Same `{ok:true}` response for "fresh insert", "duplicate", and
 *     "table missing" — denies any signal that would let an attacker
 *     enumerate whether an address is already subscribed.
 */

// Loose email shape: one local part, exactly one @, a TLD-shaped
// domain. Rejects "x@", "@y", "a@b", "no-at-here". Doesn't try to
// implement full RFC 5322 — overkill for a marketing signup.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_EMAIL_LEN = 254; // RFC 5321 §4.5.3.1.3

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    const rl = checkRateLimit("newsletter", ip, { limit: 5, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "too_many_requests" },
        {
          status: 429,
          headers: { "Retry-After": String(rl.retryAfter) },
        },
      );
    }

    const body = await request.json().catch(() => null);
    const raw = body?.email;
    const email =
      typeof raw === "string" ? raw.trim().toLowerCase().slice(0, MAX_EMAIL_LEN) : "";

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("newsletter_signups")
      .insert({ email, created_at: new Date().toISOString() });

    if (error && !error.message.includes("duplicate")) {
      // Table might not exist yet — log for now, return success.
      console.log("[newsletter] would insert:", email, "(error:", error.message, ")");
    }

    return NextResponse.json({ ok: true });
  } catch {
    // Don't leak error details to the client.
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
