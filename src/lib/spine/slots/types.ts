/**
 * src/lib/spine/slots/types.ts , A SLOT'S MODEL (plan 2026-10-13 country-page-journey, Task 3A; spec section 3): what a stage's builder hands
 * its component. A slot leads with one figure (`lead`, drawn at 30 by the kit's Focal, its signal beside it where placed), then rows of the
 * slot's own type (`rows`), then each list of another type behind its own plus (`more`, DetailPanel's answer fold), and the drawing its
 * component knows (`drawing`). A builder returns null where the slot's data is absent: the slot omits itself, no seat.
 */
import type { Provenance } from "@/lib/spine/provenance";
import type { AnswerType, SlotId } from "@/lib/spine/country_slots";
import type { Signalled } from "@/lib/spine/signal";
import type { MeasureKey } from "@/lib/spine/owner_direction";

export type SlotRow = { key: string; label: string; value: string; note?: string | null; prov?: Provenance | null; href?: string; placed?: MeasureKey | null; signal?: Signalled | null; noSignal?: "set" | "fill" | null; /** The changes ledger's key that dated this row (src/lib/spine/slots/dated.ts). */ change?: string | null; /** A row's own confidence where it is modelled (FactRows draws the mark). */ confidence?: "measured" | "modeled" | "placeholder" | null };
export type SlotList = { key: string; head: string; type: AnswerType; rows: SlotRow[] };
export type SlotLead = { figure: string; words: string; prov?: Provenance | null; placement?: string | null; placed?: MeasureKey | null; signal?: Signalled | null; noSignal?: "set" | "fill" | null };
export type SlotModel<D = null> = { id: SlotId; lead: SlotLead | null; rows: SlotList | null; more: SlotList[]; drawing: D; thin: boolean; /** A term the slot's title uses, glossed in the opener (the Rail's gloss). */ gloss?: string | null; /** The honesty mark on the opener (the Rail's `sample`, SampleTag behind his switch): set by the builder from its source's tag or confidence, as the page's old cards set it (final review I2). */ sample?: boolean };

export const FOLD_MIN = 2;
export const FOLD_MAX = 8;

/** One plus: two to eight rows of one type, or none under two. Over eight is a caller's fault (spec section 5): it cuts the list by its
 *  question, never drops a row, so this throws and the stage's test reds before a page is built. */
export function list(key: string, head: string, type: AnswerType, rows: SlotRow[]): SlotList | null {
  if (rows.length < FOLD_MIN) return null;
  if (rows.length > FOLD_MAX) throw new Error(`slots: the plus "${head}" holds ${rows.length} rows; eight at most, cut by its question`);
  return { key, head, type, rows };
}

export function present<T>(xs: ReadonlyArray<T | null | undefined>): T[] {
  return xs.filter((x): x is T => x != null);
}

/** A value's class by its text, the answer-type gate's first reading (scripts/lib/answer_type.mjs), so a builder sorts a row into the list
 *  of its type before the gate judges it. A bare number is a count here; its unit belongs in its label or its list's head. */
export function valueClass(text: string): "money" | "share" | "time" | "state" | "count" | null {
  const v = (text || "").replace(/[\s ]+/g, " ").trim();
  if (!v || /^[–-]$/.test(v)) return null;
  if (!/\d/.test(v)) return "state";
  if (/[£$€]/.test(v) || /\d\s?p\b/.test(v)) return "money";
  if (/%/.test(v)) return "share";
  if (/\b(days?|weeks?|months?|years?|hours?)\b/i.test(v)) return "time";
  return "count";
}

/** A duration's number with its unit word taken out ("21 days" to "21", "6 to 12 months" to "6 to 12"), for a list whose head or label
 *  carries the unit; null where the text holds no number. */
export function bareDuration(text: string): string | null {
  const v = (text || "").replace(/[\s ]+/g, " ").trim();
  if (!/\d/.test(v)) return null;
  return v.replace(/\s*\b(days?|weeks?|months?|years?|hours?)\b/gi, "").replace(/\s+/g, " ").trim();
}
