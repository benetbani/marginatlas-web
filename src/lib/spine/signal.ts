/**
 * src/lib/spine/signal.ts , THE SIGNAL'S STATE (plan 2026-10-13 country-page-journey, Task 2; spec section 4: "the placement rank among the
 * countries holding the measure, turned by its direction, in fifths; no mark under a set of 20").
 *
 * THE ARITHMETIC, the whole of it. Among the members holding the measure (the figure's own country included), `lower` hold a figure
 * strictly below it; a tie is not lower. Its tenth is the placement sentence's own, t = floor(10 * lower / total) (placement.ts), so a mark
 * and the sentence beside it never read two ranks (final review I5, 2026-10-15). Where higher is easier for an owner
 * (src/lib/spine/owner_direction.ts) the state by tenth is [5, 5, 4, 4, 3, 3, 2, 2, 1, 1]: the top two tenths very good (1), then good
 * (2), middle (3), poor (4), the bottom two very poor (5); where lower is easier, the same read from the other end. No state for a measure
 * with no owner direction, nor under a set of twenty. Computed at render, never
 * stored (GUIDELINES' derived-accents rule). A caller passes the set it places the figure in (fills already left out, world_stats.ts), and
 * never places a fill value.
 * ITS BLIND SPOT, stated: it ranks what it is handed; a set of interpolated values ranks as if measured (146 of 197 profiles are
 * interpolated), which the placement sentence beside it shares.
 */
import { directionOf, type MeasureKey, type OwnerDirection } from "@/lib/spine/owner_direction";

export type SignalState = 1 | 2 | 3 | 4 | 5;
export type Signalled = { state: SignalState; measure: MeasureKey };

export const SIGNAL_SET_FLOOR = 20;

/** The triangle's angle for each state (spec section 4): up very good, up-left good, left middle, down-left poor, down very poor. */
export const SIGNAL_ANGLE: Record<SignalState, number> = { 1: 0, 2: -45, 3: -90, 4: -135, 5: 180 };

export function signalRank(value: number, values: readonly number[]): { lower: number; higher: number; total: number } {
  let lower = 0, higher = 0, total = 0;
  if (!Number.isFinite(value)) return { lower, higher, total };
  for (const v of values) {
    if (!Number.isFinite(v)) continue;
    total++;
    if (v < value) lower++;
    else if (v > value) higher++;
  }
  return { lower, higher, total };
}

/** The state by the placement sentence's tenth, where higher is easier; lower-is-easier reads it from the other end. */
const STATE_BY_TENTH: readonly SignalState[] = [5, 5, 4, 4, 3, 3, 2, 2, 1, 1];

export function signalState(value: number, values: readonly number[], direction: OwnerDirection): SignalState | null {
  if (direction === "none") return null;
  const { lower, total } = signalRank(value, values);
  if (total < SIGNAL_SET_FLOOR) return null;
  const tenth = Math.min(9, Math.floor((10 * lower) / total));
  return direction === "higher" ? STATE_BY_TENTH[tenth] : STATE_BY_TENTH[9 - tenth];
}

/** The mark for one placed figure, or the reason it draws none: no owner direction owes no reason; a set under twenty says "set". */
export function signalFor(measure: MeasureKey, value: number, values: readonly number[]): { signal: Signalled | null; noSignal: "set" | null } {
  const direction = directionOf(measure);
  if (direction === "none") return { signal: null, noSignal: null };
  const state = signalState(value, values, direction);
  return state == null ? { signal: null, noSignal: "set" } : { signal: { state, measure }, noSignal: null };
}
