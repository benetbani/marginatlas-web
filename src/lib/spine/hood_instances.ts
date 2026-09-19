/**
 * src/lib/spine/hood_instances.ts
 *
 * THE NEIGHBOURHOOD STORIES' INSTANCES (MODEL.md 8.8; plan step 35,
 * 2026-09-19), keyed `hood:<city>[:<district>]:<block>` on the archetype
 * sheet, the trade page's `cell:<handle>:<block>` idiom. Unlike the cell and
 * industry instances these load NO seed: every hood builder is pure over the
 * files by the city's slug (hood_scheme.ts), so the sheet, the targeted
 * render and the copy gates draw the cards without the adapter and without
 * the database. Each handle says which blocks it serves, so a district page
 * draws only the blocks that change in focus (the take, the table, the
 * notes, the close) and the sheet does not grow by a hub's worth per
 * district.
 *
 * THE HANDLES, each picked for a reason a reader of the sheet can check:
 *  - `london`: the hub, the exemplar and the one admitted city: seven
 *    districts, the spread at 40, two companions.
 *  - `london:city-of-london`: a district page on a district that is neither
 *    end of the set: its own rent at 40 (2.47x), all three companions, its
 *    row the tinted home row of the table, its own notes with the sentence
 *    cut at the colon, the three district doors.
 *  - `london:south-london`: the cheapest district's own page, the take's one
 *    degenerate state: its own figure would be one times itself, so the card
 *    prints the spread (the hub's answer) with its own 1.00x, the reference
 *    figure next to its own name, and the count beside it.
 */
import { spineHoodDistrict, spineHoodDistricts } from "@/lib/spine/hood_scheme";

export type HoodInstance = { city: string; focus: string | null; why: string; blocks?: readonly string[] };

export const HOOD_INSTANCES: Record<string, HoodInstance> = {
  london: { city: "london", focus: null, why: "the hub, the exemplar and the one admitted city: seven districts, the spread at 40, two companions" },
  "london:city-of-london": { city: "london", focus: "city-of-london", why: "a district page on neither end of the set: its own rent at 40, three companions, its row the home row, its notes cut at the colon", blocks: ["take", "compare", "character", "close"] },
  "london:south-london": { city: "london", focus: "south-london", why: "the cheapest district's own page: one times itself is not an answer, so the spread stands at 40, its own 1.00x and the count beside it", blocks: ["take"] },
};

/** Whether a handle serves a block's story: every block unless the handle names its own. */
export function hoodServes(handle: string, block: string): boolean {
  const inst = HOOD_INSTANCES[handle];
  return !!inst && (!inst.blocks || inst.blocks.includes(block));
}

/** The story key for a handle and a block. */
export const hoodKey = (handle: string, block: string) => `hood:${handle}:${block}`;

/** The handles whose city is admitted and whose district, where named, the scheme holds; a handle the files cannot draw self-omits from the sheet. */
export function hoodHandles(): string[] {
  return Object.keys(HOOD_INSTANCES).filter((h) => {
    const inst = HOOD_INSTANCES[h];
    return inst.focus ? spineHoodDistrict(inst.city, inst.focus) != null : spineHoodDistricts(inst.city) != null;
  });
}
