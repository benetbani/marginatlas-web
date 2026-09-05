/**
 * src/lib/spine/locals_rows.ts
 *
 * THE NOTE LIST'S NOTES for a country: what locals know, authored by hand one
 * country at a time in data/archetypes/locals_notes.json and never templated
 * (a note applied to many countries would be a fabrication). The founder's
 * verdict of 2026-08-27 on the legacy wall of prose ("just a block of text
 * that's unreadable") sets the shape: a label over one fact, at most five
 * notes, each fact one or two short sentences. Local and synchronous. A
 * country without notes returns null and the section self-omits.
 */
import notesJson from "../../../data/archetypes/locals_notes.json";

export type LocalNote = { label: string; fact: string };
export type LocalsNotes = { notes: LocalNote[]; confidence: "placeholder"; source: string };

/** At most five notes; a label of at most seven words; a fact of at most 140 characters (H7, one fact each). */
export const NOTE_CAP = 5;
export const LABEL_WORDS_CAP = 7;
export const FACT_CHARS_CAP = 140;
export const LOCALS_SOURCE = "Written by hand for this country, not derived from a dataset.";

const NOTES = notesJson as unknown as Record<string, unknown>;

export function buildLocalsNotes(iso2: string): LocalsNotes | null {
  const raw = NOTES[iso2.toUpperCase()];
  if (!Array.isArray(raw)) return null;
  const notes: LocalNote[] = raw
    .filter((n): n is LocalNote => !!n && typeof n === "object" && typeof (n as LocalNote).label === "string" && typeof (n as LocalNote).fact === "string")
    .map((n) => ({ label: n.label.trim(), fact: n.fact.trim() }))
    .filter((n) => n.label.length > 0 && n.fact.length > 0)
    .slice(0, NOTE_CAP);
  if (notes.length === 0) return null;
  return { notes, confidence: "placeholder", source: LOCALS_SOURCE };
}

/** Every country holding notes, for the stories and the gate. */
export function countriesWithNotes(): string[] {
  return Object.keys(NOTES).filter((k) => /^[A-Z]{2}$/.test(k) && Array.isArray(NOTES[k]));
}
