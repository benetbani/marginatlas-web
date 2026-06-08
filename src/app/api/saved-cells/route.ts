/**
 * /api/saved-cells — a signed-in user's saved cells (Milestone 1).
 *
 *   GET    -> list the user's saved cells (newest first). Empty when signed out.
 *   POST   -> add a cell { country, geo, industry, label }. RLS + the cap apply.
 *   DELETE -> remove a cell by ?country=&geo=&industry=.
 *
 * Ownership is enforced by Postgres RLS (auth.uid() = user_id); this route also
 * reads the user from the session and never trusts a user_id from the client.
 * Saved cells are a FREE feature, so the only limit is a generous abuse cap.
 * Inert when auth is disabled (GET returns empty, writes 404). Fail-soft.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAuthEnabled } from "@/lib/feature_flags";

/** Generous per-user cap. Saved cells are free; this only bounds abuse. */
const SAVE_CAP = 500;

function isGoodKey(v: unknown): v is string {
  return typeof v === "string" && v.length > 0 && v.length <= 120;
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ saved: [] });
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("saved_cells")
      .select("country, geo, industry, label, created_at")
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ saved: [] });
    return NextResponse.json({ saved: data ?? [] });
  } catch {
    return NextResponse.json({ saved: [] });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthEnabled()) return NextResponse.json({ error: "disabled" }, { status: 404 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const { country, geo, industry, label } = body;
  if (!isGoodKey(country) || !isGoodKey(geo) || !isGoodKey(industry)) {
    return NextResponse.json({ error: "bad cell key" }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { count } = await supabase
      .from("saved_cells")
      .select("*", { count: "exact", head: true });
    if ((count ?? 0) >= SAVE_CAP) {
      return NextResponse.json({ error: "cap" }, { status: 409 });
    }
    const { error } = await supabase.from("saved_cells").upsert(
      {
        user_id: user.id,
        country,
        geo,
        industry,
        label: typeof label === "string" ? label.slice(0, 200) : null,
      },
      { onConflict: "user_id,country,geo,industry" },
    );
    if (error) return NextResponse.json({ error: "save failed" }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "save failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthEnabled()) return NextResponse.json({ error: "disabled" }, { status: 404 });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country");
  const geo = searchParams.get("geo");
  const industry = searchParams.get("industry");
  if (!isGoodKey(country) || !isGoodKey(geo) || !isGoodKey(industry)) {
    return NextResponse.json({ error: "bad cell key" }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("saved_cells")
      .delete()
      .match({ user_id: user.id, country, geo, industry });
    if (error) return NextResponse.json({ error: "delete failed" }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "delete failed" }, { status: 500 });
  }
}
