/**
 * POST /api/correction — accept a user-submitted correction note.
 *
 * Lands the note in Supabase table `corrections` for founder review.
 *
 * Hardened (2026-05-27 security pass):
 *   - Per-IP rate limit (10 / min) — write endpoint, page-level
 *     middleware deliberately excludes /api/* so without this each
 *     IP could spam unboundedly.
 *   - Email field is validated, not just length-capped: garbage
 *     strings get nulled rather than persisted alongside legit notes.
 *   - Response always shaped `{ok:true|false, error?}`; never echoes
 *     back user-submitted content (closes a reflection vector).
 *
 * Returns 200 even when the corrections table is missing so the
 * user-facing form never breaks the page.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, clientIp } from "@/lib/rate_limit";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Same shape as /api/newsletter — kept inline rather than shared
// because the two endpoints have different validation needs over time.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const rl = checkRateLimit("correction", ip, { limit: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "too_many_requests" },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfter) },
      },
    );
  }

  let body: Record<string, unknown> | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!body) {
    return NextResponse.json({ ok: false, error: "missing_body" }, { status: 400 });
  }
  const cellUrl = typeof body.cellUrl === "string" ? body.cellUrl.slice(0, 500) : "";
  const message = typeof body.message === "string" ? body.message.slice(0, 2000) : "";
  const rawEmail = typeof body.email === "string" ? body.email.trim().slice(0, 254) : "";
  // Null out malformed emails instead of persisting garbage.
  const email = rawEmail && EMAIL_RE.test(rawEmail) ? rawEmail.toLowerCase() : "";
  if (!message || message.length < 10) {
    return NextResponse.json(
      { ok: false, error: "message_too_short" },
      { status: 400 }
    );
  }

  // Persist to Supabase if configured. If the table doesn't exist yet, fail
  // softly so the user UX still works.
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/corrections`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          cell_url: cellUrl || null,
          message,
          email: email || null,
          ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
          user_agent: req.headers.get("user-agent") || null,
        }),
      });
      if (!r.ok && r.status !== 404) {
        console.error("[correction] supabase error", r.status, await r.text());
      }
    } catch (e) {
      console.error("[correction] supabase fetch failed", e);
    }
  }

  return NextResponse.json({ ok: true });
}
