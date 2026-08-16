import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { checkRateLimit, clientIp } from "@/lib/rate_limit";

/**
 * POST /api/newsletter — capture email signup.
 *
 * Writes email + which form it came from to Supabase `newsletter_signups`.
 * Falls back to console log if the table doesn't exist (graceful degradation),
 * and to an untagged insert if the `source` column doesn't exist yet.
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

/**
 * The four forms that post here, and the only values `source` may take.
 *
 * All four have been sending one since they were written, and the doc comment
 * above has described the body as `{ email, source }` the whole time. The
 * insert read only `email`, so the field arrived and was dropped.
 *
 * That is not a tidiness problem. /download/2026-benchmarks takes an address in
 * exchange for a PDF that does not exist yet and promises to send it when it
 * does; those people landed in the same undifferentiated table as everyone who
 * ticked the footer box, and there was no way to keep that promise to exactly
 * the people it was made to.
 *
 * An allowlist rather than free text because this value is written to the
 * database from a public endpoint, and an unbounded string from an unauthenticated
 * POST is a column that will eventually hold whatever somebody feels like
 * putting in it. An unrecognised source is recorded as NULL, which is the same
 * thing the pre-2026-08-16 rows say: not recorded.
 */
const SOURCES = new Set(["footer", "inline", "exit_intent", "lead_magnet_2026"]);

/**
 * True when Postgres is telling us the `source` column does not exist.
 *
 * Migrations here are applied BY HAND in the Supabase SQL editor (CLAUDE.md),
 * so there is an unbounded window where this code is deployed and the column
 * is not there yet. The insert would fail as a whole, not partially, and the
 * handler below deliberately swallows insert errors and returns {ok:true} to
 * avoid leaking whether an address is already subscribed. Together that means
 * shipping an unconditional `source` would have silently dropped every signup
 * on the site until somebody remembered to run the migration.
 *
 * PostgREST answers PGRST204 for an unknown column and names it in the
 * message. Matching on the code alone is too narrow across versions and on the
 * message alone is too loose, so this asks for either, then insists the column
 * name appears.
 */
function isMissingSourceColumn(error: { code?: string; message?: string }): boolean {
  const message = error.message || "";
  const looksLikeUnknownColumn =
    error.code === "PGRST204" || /column|schema cache/i.test(message);
  return looksLikeUnknownColumn && /\bsource\b/i.test(message);
}

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

    const rawSource = typeof body?.source === "string" ? body.source.trim() : "";
    const source = SOURCES.has(rawSource) ? rawSource : null;

    const insert = (withSource: boolean) => {
      const row: Record<string, unknown> = {
        email,
        created_at: new Date().toISOString(),
      };
      if (withSource && source) row.source = source;
      return supabaseAdmin.from("newsletter_signups").insert(row);
    };

    let { error } = await insert(true);

    // The column is not there yet. Keep the address, lose the tag: an
    // unrecorded source is a smaller loss than a dropped signup, and the tag
    // starts sticking the moment the migration is applied.
    if (error && source && isMissingSourceColumn(error)) {
      console.log("[newsletter] source column missing, retrying untagged");
      ({ error } = await insert(false));
    }

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
