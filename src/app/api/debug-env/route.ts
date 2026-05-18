/**
 * TEMPORARY diagnostic — Track V.4.
 *
 * Returns presence-only info about server-side env vars so we can confirm
 * whether ANTHROPIC_API_KEY is reaching the runtime in production.
 *
 * Returns no values, only booleans. Safe to ship temporarily; remove
 * after the /ask production issue is diagnosed.
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    has_anthropic_api_key: !!process.env.ANTHROPIC_API_KEY,
    has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    has_supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    has_supabase_service_role_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    anthropic_key_length: process.env.ANTHROPIC_API_KEY?.length ?? 0,
    anthropic_key_prefix: process.env.ANTHROPIC_API_KEY?.slice(0, 12) ?? null,
    env_keys_visible_count: Object.keys(process.env).length,
    runtime: "nodejs",
  });
}
