/**
 * src/lib/spine/slots/zones.ts , THE SLOTS INTO ZONES (plan 2026-10-13 country-page-journey, Task 4; spec section 6: "The stage order is the
 * phone's one column; a desktop pair joins only two neighbouring slots of one stage").
 *
 * A stage's drawn slots, in order, pair two neighbours where PAIR_SPLIT names the pair (the split the pair takes from 1024px); a slot left
 * over stands alone (a lone zone, the left two thirds); the masthead is one full-width zone holding slots 1 and 2, the peers' table and the
 * close are full width (MODEL PART 10's three full widths). A stage pairs from its start or from its end, whichever leaves the page fewer
 * art-direction D3 findings (scripts/lib/zone_rhythm.mjs, read the same way here), the start winning a tie. Stages 2 to 6 each open a
 * chapter; the masthead and the close stand outside them.
 */
import { SLOTS, STAGES, slotDef, type SlotId, type StageDef, type StageId } from "@/lib/spine/country_slots";
import type { ZoneSplit } from "@/components/spine/zones";

export type ZoneShape = ZoneSplit | "lone";
export type ZonePlan = { key: string; split: ZoneShape; slots: SlotId[]; stage: StageId; chapter: { index: string; heading: string } | null; outside: boolean; label: string };
type Draft = { split: ZoneShape; slots: SlotId[] };

/** The slots that stand full width (the masthead is its own stage's one zone). */
export const WIDE_SLOTS: ReadonlySet<SlotId> = new Set<SlotId>(["peers", "close"]);

/** Every pair two neighbouring slots of one stage can make, and its split: the wider drawing on the wider side. Slot 5b (the margins'
 *  vertical bars) pairs with its neighbours as slot 5 does. */
export const PAIR_SPLIT: Readonly<Record<string, ZoneSplit>> = {
  "customers|spend": "3-2",
  "customers|trades": "3-2",
  "customers|margins": "3-2",
  "spend|trades": "1-1",
  "spend|margins": "1-1",
  "trades|margins": "1-1",
  "hire|running-costs": "1-1",
  "hire|credit": "1-1",
  "hire|filings": "1-1",
  "running-costs|credit": "1-1",
  "running-costs|filings": "1-1",
  "credit|filings": "3-2",
  "lasting|exit": "3-2",
  "dealings|changes": "2-3",
};

function pairUp(slots: SlotId[], fromEnd: boolean): Draft[] {
  const seq = fromEnd ? [...slots].reverse() : slots;
  const out: Draft[] = [];
  for (let i = 0; i < seq.length; i++) {
    const a = seq[i];
    const b = seq[i + 1];
    if (WIDE_SLOTS.has(a)) { out.push({ split: "wide", slots: [a] }); continue; }
    const [first, second] = fromEnd ? [b, a] : [a, b];
    const split = b && !WIDE_SLOTS.has(b) ? PAIR_SPLIT[`${first}|${second}`] : undefined;
    if (split) { out.push({ split, slots: [first, second] }); i++; }
    else out.push({ split: "lone", slots: [a] });
  }
  return fromEnd ? out.reverse() : out;
}

/** D3 as scripts/lib/zone_rhythm.mjs reads it (the country-zones test holds the two to one answer). */
function d3Count(splits: ZoneShape[], starts: boolean[], reset: boolean): number {
  let n = 0;
  for (let i = 1; i < splits.length; i++) if (!(reset && starts[i]) && splits[i] !== "wide" && splits[i] === splits[i - 1]) n++;
  for (let i = 2; i < splits.length; i++) if (!(reset && (starts[i] || starts[i - 1])) && splits[i] === "1-1" && splits[i - 1] === "1-1" && splits[i - 2] === "1-1") n++;
  return n;
}

export function composeZones(drawn: readonly SlotId[], { resetAtChapter = true }: { resetAtChapter?: boolean } = {}): ZonePlan[] {
  const has = new Set(drawn);
  const stages: Array<{ g: StageDef; slots: SlotId[] }> = STAGES.map((g) => ({ g, slots: SLOTS.filter((s) => s.stage === g.id && has.has(s.id)).map((s) => s.id) })).filter((x) => x.slots.length > 0);
  const choices: Draft[][][] = stages.map(({ g, slots }) => {
    if (g.id === "orient") return [[{ split: "wide", slots }]];
    const a = pairUp(slots, false);
    const b = pairUp(slots, true);
    return JSON.stringify(a) === JSON.stringify(b) ? [a] : [a, b];
  });
  let best: { picked: Draft[][]; score: number } | null = null;
  const walk = (i: number, picked: Draft[][]) => {
    if (i === choices.length) {
      const zs = picked.flatMap((p, si) => p.map((z, zi) => ({ z, start: zi === 0 && stages[si].g.index != null })));
      const score = d3Count(zs.map((x) => x.z.split), zs.map((x) => x.start), resetAtChapter);
      if (!best || score < best.score) best = { picked, score };
      return;
    }
    for (const c of choices[i]) walk(i + 1, [...picked, c]);
  };
  walk(0, []);
  const chosen = (best as { picked: Draft[][]; score: number } | null)?.picked ?? [];
  return chosen.flatMap((p, si) => p.map((z, zi): ZonePlan => {
    const g = stages[si].g;
    const first = slotDef(z.slots[0]);
    return { key: first.domId, split: z.split, slots: z.slots, stage: g.id, chapter: zi === 0 && g.index && g.heading ? { index: g.index, heading: g.heading } : null, outside: g.index == null, label: first.heading };
  }));
}
