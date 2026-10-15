/**
 * /api/calculator , the cost simulator's place switch (plan 2026-10-13 cost-simulator, Task 3). ?country=gb&city=london&trade=restaurants answers
 * { place, bundle }; an unknown place answers 404. Rate-limited as the cell lookup is. The levers never come here: they recompute in the browser.
 */
import { NextRequest, NextResponse } from "next/server";
import { tooMany } from "@/lib/rate_limit";
import { respond } from "@/lib/simulator/respond";
import { loadPlaceBundle } from "@/lib/simulator/load";

export async function GET(req: NextRequest) {
  const limited = tooMany(req, "calculator", 120);
  if (limited) return limited;
  const q = new URL(req.url).searchParams;
  const answer = await respond({ country: q.get("country"), city: q.get("city"), trade: q.get("trade") }, loadPlaceBundle);
  return NextResponse.json(answer.body, { status: answer.status, headers: answer.headers });
}
