/**
 * POST /api/contact: accept a message from the /contact page.
 *
 * Lands the message in Supabase table `contact_messages` for founder review.
 * It SENDS NOTHING. No auto-reply, no notification, no third-party form
 * service, no outbound webhook. The only network call this handler makes is the
 * insert into our own Supabase project, and that is deliberate: the page tells
 * the reader "sending this does not email anyone", and this is the file that
 * has to keep that true.
 *
 * Built to the pattern of /api/correction, which is the hardened reference:
 *   - Per-IP rate limit (5 / min). Page-level middleware deliberately excludes
 *     /api/*, so without this each IP could spam unboundedly.
 *   - Email is validated, not just length-capped: garbage strings get nulled
 *     rather than persisted alongside a legitimate message.
 *   - The JSON response is always shaped `{ok:true|false, error?}` and NEVER
 *     echoes back user-submitted content. That closes a reflection vector and
 *     it is not an accident of the shape. Do not "improve" it by returning what
 *     was sent.
 *   - Returns 200 even when the table is missing, so the form can never break
 *     the page.
 *   - The message is length-capped (truncated at MAX_MESSAGE, same as the
 *     correction endpoint caps at 2000).
 *
 * The correction endpoint's own comment records that these endpoints keep their
 * validation inline rather than sharing it, because their needs diverge over
 * time. This one follows that: it repeats the email shape rather than importing
 * it.
 *
 * TWO REQUEST SHAPES, ONE HANDLER. The /contact page posts a plain HTML form so
 * it works with JavaScript switched off, exactly as /auth/signout and /api/go
 * already do on this site. So:
 *   - `application/json` in  → `{ok:true|false, error?}` out.
 *   - form-encoded in        → 303 to /contact?sent=1, or ?error=<code>.
 * The redirect carries only a code from a closed set, never anything the sender
 * typed, so the no-echo rule holds on both paths.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, clientIp } from "@/lib/rate_limit";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Same shape as /api/correction and /api/newsletter, kept inline rather than
// shared because the three endpoints have different validation needs over time.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Longer than a correction note (2000) because this form also takes questions. */
const MAX_MESSAGE = 4000;
const MIN_MESSAGE = 10;
const MAX_PAGE_REF = 500;
const MAX_EMAIL = 254; // RFC 5321 4.5.3.1.3

/** Closed set. Anything else falls back to "other" rather than being persisted. */
const TOPICS = new Set(["correction", "other"]);

/** The only error codes that can reach a reader. No user content among them. */
type ErrorCode = "invalid_body" | "message_too_short" | "too_many_requests";

function jsonOk() {
  return NextResponse.json({ ok: true });
}

function jsonFail(error: ErrorCode, status: number, headers?: HeadersInit) {
  return NextResponse.json({ ok: false, error }, { status, headers });
}

/** Browser (no-JS) path: back to the page with a state code, never with content. */
function redirectBack(req: NextRequest, query: string) {
  const { origin } = new URL(req.url);
  return NextResponse.redirect(`${origin}/contact${query}`, { status: 303 });
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/**
 * Length cap. Truncating at a fixed offset can split a surrogate pair, and a
 * lone surrogate makes a JSON body that PostgREST rejects with "unsupported
 * Unicode escape sequence". The row would then be dropped while the sender was
 * told the message had been received, which is precisely the outcome the
 * contact page exists to rule out. So the orphaned half goes.
 */
function capped(s: string, max: number): string {
  return s.slice(0, max).replace(/[\uD800-\uDBFF]$/, "");
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";
  const isBrowserForm =
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data");

  const ip = clientIp(req);
  const rl = checkRateLimit("contact", ip, { limit: 5, windowMs: 60_000 });
  if (!rl.allowed) {
    return isBrowserForm
      ? redirectBack(req, "?error=rate")
      : jsonFail("too_many_requests", 429, { "Retry-After": String(rl.retryAfter) });
  }

  let fields: Record<string, unknown>;
  try {
    if (isBrowserForm) {
      const form = await req.formData();
      fields = Object.fromEntries(form.entries());
    } else {
      const body = await req.json();
      if (!body || typeof body !== "object") throw new Error("not an object");
      fields = body as Record<string, unknown>;
    }
  } catch {
    return isBrowserForm
      ? redirectBack(req, "?error=server")
      : jsonFail("invalid_body", 400);
  }

  const rawTopic = str(fields.topic).trim();
  const topic = TOPICS.has(rawTopic) ? rawTopic : "other";
  const pageRef = capped(str(fields.page).trim(), MAX_PAGE_REF);
  const message = capped(str(fields.message).trim(), MAX_MESSAGE);
  const rawEmail = str(fields.email).trim().slice(0, MAX_EMAIL);
  // Null out malformed addresses instead of persisting garbage next to a real
  // message. An unusable address is worse than none: it looks like a route back.
  const email = rawEmail && EMAIL_RE.test(rawEmail) ? rawEmail.toLowerCase() : "";

  if (message.length < MIN_MESSAGE) {
    return isBrowserForm
      ? redirectBack(req, "?error=short")
      : jsonFail("message_too_short", 400);
  }

  // Persist if configured. If the table does not exist yet, fail softly: a
  // reader must never see the form break because of our schema.
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          topic,
          page_ref: pageRef || null,
          message,
          email: email || null,
          ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
          user_agent: req.headers.get("user-agent") || null,
        }),
      });
      if (r.status === 404) {
        /* THE SILENT-DROP CASE, AND THE ONE THAT MUST BE LOUDEST ON OUR SIDE.
           A missing table is soft to the READER on purpose, because a form must
           never break a page. But it is the only failure that loses every
           message while telling every sender "received", so it cannot also be
           silent to us. It was the one status excluded from logging, which is
           exactly backwards: every other error here is visible and the one that
           costs the most was not. */
        console.error(
          "[contact] MESSAGES ARE BEING DROPPED. The contact_messages table does " +
            "not exist. Apply db/migrations/2026-08-01-contact-messages.sql. " +
            "Every sender is being told their message was received.",
        );
      } else if (!r.ok) {
        console.error("[contact] supabase error", r.status, await r.text());
      }
    } catch (e) {
      console.error("[contact] supabase fetch failed", e);
    }
  }

  return isBrowserForm ? redirectBack(req, "?sent=1") : jsonOk();
}
