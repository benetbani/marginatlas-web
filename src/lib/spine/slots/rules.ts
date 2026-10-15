/**
 * src/lib/spine/slots/rules.ts , STAGES 6 AND 7: SLOTS 14 TO 16 (plan 2026-10-13 country-page-journey, Task 3H; spec sections 2 and 3; R5 section
 * 5): "Which rules bind me, and what is changing?" then "Where do I go from here?"
 *   14 HOW DEALINGS GO (POSITION on poles): the state's and the people's spectra under one switch (his keep since 2026-06-18), reads on two
 *      poles, not ranks among countries, so no signal (Reading 4); their two foot figures (foreign-owned firms, born abroad) behind the plus
 *      as shares, with the profile's labour force and informal economy shares the old staff card printed (final review I1: nothing a
 *      section printed is lost). Omits under two reads.
 *   15 RULE CHANGES (DATED PAIR): the ledger's coming run and its recent run, the lead rows shown and the rest in the run's own disclosure
 *      (Q6, answer A); each change is also dated on the row it changes (slots/dated.ts). The UK's alone today.
 *   16 WHERE TO NEXT (doors): the terminus's doors.
 */
import { COPY } from "@/lib/spine/copy";
import { buildCharacterTables, type SpectraData } from "@/lib/spine/character_rows";
import { buildRuleChanges } from "@/lib/spine/sections/country_rules";
import { buildCloseDoors, buildCompareDoor } from "@/lib/spine/close_rows";
import type { ChangeRow } from "@/components/spine/archetypes/DatedChanges";
import type { Door } from "@/components/spine/archetypes/Terminus";
import { getCountryProfile } from "@/lib/economic_profile";
import type { Provenance } from "@/lib/spine/provenance";
import { list, present, type SlotModel, type SlotRow } from "./types";

const J = COPY.journey;
const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** The changes a person opening a small business meets first (moved from country-view.tsx unchanged). */
export const CHANGES_LEAD = ["minimum-wage-21", "sick-pay-start", "incorporation-fee", "employer-ni"];

export type DealingsDrawing = { state: SpectraData | null; people: SpectraData | null };
export function buildDealingsSlot(iso2: string): SlotModel<DealingsDrawing> | null {
  const t = buildCharacterTables(iso2);
  if (!t.state && !t.people) return null;
  const who: SlotRow[] = present([
    t.state?.foot ? { key: "foreign-owned", label: capFirst(t.state.foot.label), value: t.state.foot.value } : null,
    t.people?.foot ? { key: "born-abroad", label: capFirst(t.people.foot.label), value: t.people.foot.value } : null,
    ...profileShares(iso2),
  ]);
  return {
    id: "dealings",
    lead: null,
    rows: null,
    more: present([list("who", J.more.whoTrades, "share", who)]),
    drawing: { state: t.state ? { ...t.state, foot: null } : null, people: t.people ? { ...t.people, foot: null } : null },
    thin: !(t.state && t.people),
  };
}

/** The profile's labour force and informal economy shares, in the old staff card's rounding (adapt_country.ts asWhole: one decimal),
 *  stamped with their fields; only where the profile holds the country's own row. */
function profileShares(iso2In: string): SlotRow[] {
  const iso2 = iso2In.toUpperCase();
  const p = getCountryProfile(iso2) as unknown as Record<string, unknown> & { iso2: string; tier?: string };
  if (String(p.iso2 ?? "").toUpperCase() !== iso2) return [];
  const prov = (field: string): Provenance => ({ src: `economic_indicators/country_profile_v2.json:${field}`, kind: p.tier === "A" ? "looked up" : "estimate" });
  const one = (key: string, label: string, field: string): SlotRow | null => {
    const v = p[field];
    return typeof v === "number" && Number.isFinite(v) ? { key, label, value: `${Math.round(v * 10) / 10}%`, prov: prov(field) } : null;
  };
  return present([one("labour-force", J.whoRows.labour, "labor_force_participation_pct"), one("informal", J.whoRows.informal, "informal_economy_share_pct")]);
}

export type ChangesDrawing = { coming: ChangeRow[]; recent: ChangeRow[]; shown: number };
export function buildChangesSlot(iso2: string, today: string): SlotModel<ChangesDrawing> | null {
  const c = buildRuleChanges(iso2, today, CHANGES_LEAD);
  if (!c || c.coming.length + c.inForce.length < 3) return null;
  return { id: "changes", lead: null, rows: null, more: [], drawing: { coming: c.coming, recent: c.inForce, shown: c.inForceLead }, thin: false };
}

export type CloseDrawing = { doors: Door[] };
export function buildCloseSlot(iso2: string, name: string): SlotModel<CloseDrawing> | null {
  const doors = [...buildCloseDoors(iso2).filter((d) => d.kind !== "pill"), ...buildCompareDoor(name)];
  if (doors.length === 0) return null;
  return { id: "close", lead: null, rows: null, more: [], drawing: { doors }, thin: doors.length < 3 };
}
