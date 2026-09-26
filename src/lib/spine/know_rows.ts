/**
 * src/lib/spine/know_rows.ts
 *
 * BEFORE YOU SIGN, the industry page's `09 know` (MODEL.md 8.7; plan step
 * 34's fourth dispatch, 2026-09-19): THE PAGE'S ONE PROSE SECTION (PART 9
 * clause 44, R9), on NoteList's law with the editorial exemption on, at most
 * five notes in two columns at the wide seat, a label over one fact. Pure
 * over the files, synchronous, no seed and no database, so the stories, the
 * copy gates and the harness build every trade by its taxonomy id.
 *
 * THE ROWS, in this order, every one of them AUTHORED TEXT someone wrote:
 *  1. WHO DOES WELL and 2. THINK TWICE: the trade's `edge` and `watchOut`
 *     through the trade page's own `characterRows()` (suits_rows.ts, which
 *     merges the three hand-written entries in activity_character.ts with
 *     activity_character_generated.json and counts authored what the merged
 *     lookup holds), under the trade page's own labels, one literal on both
 *     pages. COUNTED 2026-09-19 over the 243 taxonomy ids: 243 of 243 hold
 *     both, so the two notes draw on every trade; the one-row case below
 *     fires on no live trade, as on the trade page (the brief's "the other
 *     240" repeats the count suits_rows.ts already corrected: it counted the
 *     hand-written const alone).
 *  3. and 4. THE FAILURE MODES: the first two of `getFailureModes()`
 *     (src/lib/qa/industry_failure_modes.ts, five authored per trade on 16
 *     trades, 15 in scope), each its own label over its one-sentence
 *     explanation; the `when` field is not printed (a range word where a
 *     figure would stand). The rest of the five are not carried: the card's
 *     cap is five notes and the two character notes come first.
 *  5. AN AUTHORED MYTH, only where the character file holds one as authored
 *     text. IT HOLDS NONE: the ActivityCharacter shape is id, hook,
 *     economics, watchOut, edge and categoryNote (counted 2026-09-19, no
 *     entry carries a myth field), so no fifth note exists and none is
 *     drawn. The computed sentence the old adapter built ("A high gross
 *     margin is misleading ...", a string fired by a threshold on the
 *     margins file's ladder, which nobody wrote) is NOT a note and never
 *     enters here; the archetype copy gate proves that every note's fact is
 *     one of the authored sources above, and a planted computed sentence
 *     was watched go red.
 *
 * Where nothing is authored (no character and no failure mode: no live
 * trade today, a planted id on the sheet) the card is ONE row in the site's
 * idiom, "Not gathered yet: what a working owner would tell you about this
 * trade." (M19), under its own label, the shape the trade page's suits card
 * takes on a trade with no character.
 *
 * WHAT THIS BUILDER CANNOT SHORTEN, and states: the facts are authored
 * prose, over the locals notes' 140-character cap on most rows (the edge 123
 * to 229 characters, the watch-out 78 to 237, the failure modes' first two
 * explanations 121 to 203; counted, the copy gate prints the count), never
 * cut here (the suits card's own rule); NoteList's law is a fact within
 * four lines at every width, measured on the rendered card. Two strings in
 * the failure-modes file were corrected by this dispatch before they could
 * reach a page: a label carrying "vs" (the shape the model-laws copy gate
 * bans, PART 5) and an explanation carrying "$X", a letter standing where a
 * figure goes (PART 5, his 2026-09-10 ruling); both are named in the
 * dispatch's report.
 */
import { characterRows } from "@/lib/spine/suits_rows";
import { getFailureModes } from "@/lib/qa/industry_failure_modes";
import { NOTE_CAP, type LocalNote } from "@/lib/spine/locals_rows";
import { COPY } from "@/lib/spine/copy";

/** How many of the trade's failure modes the card carries: the first two, after the two character notes. */
export const KNOW_FAILURE_MODES_CAP = 2;

export type KnowRow = LocalNote & { key: "suits" | "thinkTwice" | "failure" | "notGathered" };

export type KnowData = {
  industryId: string;
  rows: KnowRow[];
  /** True when the trade holds an edge or a watch-out (the two character notes draw). */
  hasCharacter: boolean;
  /** How many failure-mode notes draw (0 to 2). */
  failureModes: number;
  /** True when the one not-gathered row stands alone. */
  notGathered: boolean;
  basis: string;
  /** The notes are authored, not measured: the opener's mark is on, behind his switch (the locals card's own idiom). */
  sample: true;
};

/** The first two failure modes as notes, each the file's own label over its explanation; none where the file holds nothing for the trade. */
export function failureRows(industryId: string): KnowRow[] {
  const modes = getFailureModes(industryId) ?? [];
  return modes
    .slice(0, KNOW_FAILURE_MODES_CAP)
    .map((m) => ({ key: "failure" as const, label: m.label.trim(), fact: m.explanation.trim(), icon: "flag" as const }))
    .filter((r) => r.label && r.fact);
}

/** The notes, or the one row where nothing is authored; null only with no id. An id no file holds (the planted story `industry:none:know`) takes the one row, as the trade page's suits builder does, because "nothing authored" is exactly what such an id holds; the view never seats it alone, since the band is gated on the field card, which needs a shard. */
export function buildKnow(industryId: string | undefined): KnowData | null {
  if (!industryId) return null;
  const character = characterRows(industryId);
  const characterNotes: KnowRow[] = character.hasCharacter ? character.rows.filter((r): r is typeof r & { key: "suits" | "thinkTwice" } => r.key === "suits" || r.key === "thinkTwice") : [];
  const failures = failureRows(industryId);
  const authored: KnowRow[] = [...characterNotes, ...failures].slice(0, NOTE_CAP);
  const notGathered = authored.length === 0;
  const rows: KnowRow[] = notGathered ? [{ key: "notGathered", label: COPY.industryKnow.notGatheredLabel, fact: COPY.industryKnow.notGathered }] : authored;
  return { industryId, rows, hasCharacter: character.hasCharacter, failureModes: failures.length, notGathered, basis: COPY.industryKnow.basis, sample: true };
}

/** How a list of ids falls, counted rather than remembered, for the gates and the record. */
export function countKnow(ids: string[]): { total: number; notes: number; oneRow: number; withFailures: number; byRows: Record<number, number>; longFacts: number; longestFact: number } {
  const out = { total: 0, notes: 0, oneRow: 0, withFailures: 0, byRows: {} as Record<number, number>, longFacts: 0, longestFact: 0 };
  for (const id of ids) {
    const k = buildKnow(id);
    if (!k) continue;
    out.total++;
    if (k.notGathered) out.oneRow++; else out.notes++;
    if (k.failureModes > 0) out.withFailures++;
    out.byRows[k.rows.length] = (out.byRows[k.rows.length] ?? 0) + 1;
    for (const r of k.rows) { if (r.key !== "notGathered" && r.fact.length > 140) { out.longFacts++; out.longestFact = Math.max(out.longestFact, r.fact.length); } }
  }
  return out;
}
