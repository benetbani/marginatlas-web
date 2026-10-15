/**
 * src/lib/simulator/respond.ts , THE PLACE SWITCH'S ANSWER (plan 2026-10-13 cost-simulator, Task 3; spec section 3: "a place switch fetches its defaults
 * from one API route"). Pure over its loader, so the chain's test runs it on the real defaults builder without the database. An unknown place answers
 * 404, the page's own rule; the answer holds the place and its defaults and never a reader's figure (the levers stay in the browser).
 */
import { resolvePlace, type Place } from "./place";
import type { SimBundle } from "./bundle";

export type Answer = { status: 200 | 404; body: { place: Place; bundle: SimBundle } | { place: null; reason: string }; headers: Record<string, string> };

/** The defaults change when the data does, a few times a year: six hours at the edge, a day stale. */
export const ANSWER_CACHE = "public, s-maxage=21600, stale-while-revalidate=86400";

export async function respond(q: { country?: string | null; city?: string | null; trade?: string | null }, load: (place: Place) => Promise<SimBundle>): Promise<Answer> {
  const place = resolvePlace(q);
  if (!place) return { status: 404, body: { place: null, reason: "no such place or trade" }, headers: { "Cache-Control": ANSWER_CACHE } };
  return { status: 200, body: { place, bundle: await load(place) }, headers: { "Cache-Control": ANSWER_CACHE } };
}
