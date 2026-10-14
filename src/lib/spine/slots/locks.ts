/**
 * src/lib/spine/slots/locks.ts , THE COUNTRY PAGE'S LOCKS BY SLOT (plan 2026-10-13 country-page-journey, Task 5; spec section 8: his ruling 18
 * by analogy). The slots are the levels lockedLevelKeys reads: the masthead (stage 1) and the close (stage 7) stand outside, each of stages
 * 2 to 6 is a chapter tagged on every slot it draws, so each stage's first slot drawn stays open and every later one locks. The paywall stays
 * on UK pages alone (his ruling 27); the view asks only when the page is drawn locked.
 */
import { lockedLevelKeys } from "@/lib/monetization/levels";
import { slotDef, stageOfSlot, type SlotId } from "@/lib/spine/country_slots";
import type { StandInKind } from "@/components/spine/LockedSection";

/** The stand-in nearest each slot's drawing, for its locked card. */
export const SLOT_STAND_IN: Record<SlotId, StandInKind> = {
  "tax-on-profit": "grid", "where-it-stands": "rows", customers: "grid", spend: "bars", trades: "bars", margins: "bars", open: "table", hire: "bars",
  "running-costs": "rows", credit: "track", filings: "rows", peers: "table", lasting: "track", exit: "rows", dealings: "track", changes: "rows", close: "rows",
};

/** The locked card's line key (COPY.locked.lines): the slot's DOM id, except where another page holds a line under that id (the city page's
 *  "trades"), when the slot's line takes its own key. */
const SLOT_LINE: Partial<Record<SlotId, string>> = { trades: "london-trades" };
export function lockLineKey(id: SlotId): string {
  return SLOT_LINE[id] ?? slotDef(id).domId;
}

export function lockedSlots(drawn: readonly SlotId[]): Set<string> {
  return lockedLevelKeys(drawn.map((id) => {
    const n = stageOfSlot(id).n;
    const inChapter = n >= 2 && n <= 6;
    return { key: id, chapter: inChapter ? String(n) : null, outside: !inChapter };
  }));
}
