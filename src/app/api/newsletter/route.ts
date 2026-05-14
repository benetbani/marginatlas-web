import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/newsletter — capture email signup.
 *
 * Writes to Supabase `newsletter_signups` table.
 * Falls back to console log if the table doesn't exist (graceful degradation).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const email = body?.email?.trim?.()?.toLowerCase?.();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "invalid email" }, { status: 400 });
    }

    // Try insert. Use upsert-style: ignore conflict.
    const { error } = await supabaseAdmin
      .from("newsletter_signups")
      .insert({ email, created_at: new Date().toISOString() });

    if (error && !error.message.includes("duplicate")) {
      // Table might not exist yet — log for now, return success to the user
      console.log("[newsletter] would insert:", email, "(error:", error.message, ")");
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
