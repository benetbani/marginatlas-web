/**
 * src/lib/spine/character_rows.ts
 *
 * THE SPECTRA TABLES' ROWS for a country: dealing with the state (six
 * government reads, 0 to 10) and dealing with people (six culture reads, 1
 * to 10), each normalised to a position from 0 to 1 with the better end on
 * the right, and the foot figure under each table (foreign-owned firms, born
 * abroad). Local and synchronous; the reads are the signature file's, anchored
 * to published indices, so the section is tagged modelled. A table with fewer
 * than two reads is not drawn.
 */
import { getCountrySignature } from "@/lib/countries/country_signature";
import { COPY } from "@/lib/spine/copy";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export type SpectrumRow = { key: string; name: string; left: string; right: string; position: number };
export type SpectraData = {
  rows: SpectrumRow[];
  dot: "ink" | "terra";
  foot: { value: string; label: string } | null;
  confidence: "modeled";
};
export type CharacterTables = { state: SpectraData | null; people: SpectraData | null };

const STATE_KEYS: Array<[keyof typeof COPY.character.state.rows, string]> = [
  ["tax", "tax_predictability"],
  ["bribery", "low_bribery"],
  ["tasks", "task_efficiency"],
  ["time", "time_efficiency"],
  ["courts", "judicial_impartiality"],
  ["new", "innovation_capacity"],
];
const PEOPLE_KEYS: Array<[keyof typeof COPY.character.people.rows, string]> = [
  ["open", "openness_to_foreigners"],
  ["innovation", "innovation"],
  ["direct", "communication_directness"],
  ["punctual", "punctuality"],
  ["straight", "corruption_rejection"],
  ["ambition", "ambition_chest_beating"],
];

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const foot = (pct: unknown, label: string) => (isNum(pct) && pct >= 0 ? { value: `${Math.round(pct)}%`, label } : null);

export function buildCharacterTables(iso2: string): CharacterTables {
  const s = getCountrySignature(iso2);
  if (!s) return { state: null, people: null };
  const stateRows: SpectrumRow[] = [];
  if (s.government) {
    for (const [key, field] of STATE_KEYS) {
      const v = (s.government as unknown as Record<string, unknown>)[field];
      if (!isNum(v)) continue;
      const w = COPY.character.state.rows[key];
      stateRows.push({ key, name: w.name, left: w.left, right: w.right, position: clamp01(v / 10) });
    }
  }
  const peopleRows: SpectrumRow[] = [];
  if (s.culture) {
    for (const [key, field] of PEOPLE_KEYS) {
      const v = (s.culture as unknown as Record<string, unknown>)[field];
      if (!isNum(v)) continue;
      const w = COPY.character.people.rows[key];
      peopleRows.push({ key, name: w.name, left: w.left, right: w.right, position: clamp01((v - 1) / 9) });
    }
  }
  return {
    state: stateRows.length >= 2 ? { rows: stateRows, dot: "ink", foot: foot(s.foreign_owned_pct, COPY.character.state.foot), confidence: "modeled" } : null,
    people: peopleRows.length >= 2 ? { rows: peopleRows, dot: "terra", foot: foot(s.foreign_born_pct, COPY.character.people.foot), confidence: "modeled" } : null,
  };
}
