/**
 * src/lib/corrections.ts
 *
 * THE CORRECTIONS LOG, READ (his ruling of 2026-10-05 on PARKED P31.1): data/corrections.json, append only, newest first. The
 * page /corrections draws it; the gate corrections-log holds its shape. Pages read it from here, never from data/ directly (the
 * layering rule).
 */
import log from "../../data/corrections.json";

/** One correction: the day (ISO), the page's path, what it said, what it says now, and why. */
export type Correction = { date: string; page: string; said: string; says: string; why: string };

/** Every correction, newest first. */
export function getCorrections(): Correction[] {
  return [...((log as { corrections: Correction[] }).corrections ?? [])].sort((a, b) => b.date.localeCompare(a.date));
}
