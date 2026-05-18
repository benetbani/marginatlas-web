/**
 * POST /api/correction — accept a user-submitted correction note.
 *
 * Lands the note in Supabase table `corrections` for founder review.
 * No auth; rate-limited at the middleware layer. Returns 200 even when
 * the table is missing so the user-facing form never breaks the page.
 */
import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: NextRequest) {
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
  const email = typeof body.email === "string" ? body.email.slice(0, 200) : "";
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
