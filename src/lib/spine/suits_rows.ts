/**
 * src/lib/spine/suits_rows.ts
 *
 * WHO THIS SUITS, the trade page's `02 suits` (MODEL.md 8.6; plan step 33's
 * first dispatch, 2026-09-18): THE PAGE'S ONE PROSE SECTION (PART 9 clause
 * 44, R9), on NoteList's law with the editorial exemption ON (the country's
 * `16 locals` idiom), at most five notes, a label over one fact. Pure over
 * the files, synchronous, no database, so the harness and the copy gates can
 * build every trade.
 *
 * THE ROWS, in this order:
 *  1. WHO DOES WELL: the trade's `edge` off `getActivityCharacter()` in
 *     src/lib/content/activity_character.ts, what separates the top operators
 *     from the median.
 *  2. THINK TWICE: the trade's `watchOut`, what quietly closes one.
 *     The lookup MERGES the three hand-written exemplars (hostels,
 *     restaurants, accounting_tax; they win on collision) with
 *     activity_character_generated.json, 243 entries keyed by the taxonomy's
 *     id, every one holding an edge and a watch-out (COUNTED 2026-09-18 by
 *     this dispatch: 243 of the 243 taxonomy ids resolve both). So the two
 *     notes draw on 243 of 243 trades. The brief and MODEL.md 8.6 count
 *     "three entries, 240 not gathered": that counted the hand-written
 *     const alone, not the lookup adapt_cell.ts has read since 2026-08-24
 *     (its own comment: "a generated set of 243 activities plus four
 *     hand-written overrides ... genuinely per-trade"); the industry page
 *     has printed the same prose for months and the 2026-08-30 critique
 *     reviewed it as the declared editorial exemption. Where the lookup
 *     holds nothing (no live trade today; the story `cell:none:suits`
 *     plants the case) the two notes are ONE row in the site's idiom, "Not
 *     gathered yet: ..." (M19).
 *  3. YOUR PRICE and 4. THE MARGIN: the two checks from the country's one
 *     string bank, `CHECKS_BANK` in checks_rows.ts (M20: the same check is
 *     the same words on both pages), phrased as questions (R10). The margin
 *     row is steered by the cell's country exactly as the country's card
 *     steers it: `getSmbRegime(iso2)` held (58 of 195) reads "Is there a real
 *     margin left after tax and payroll?", not held "Do you know what tax
 *     and payroll will take?". The bank's third row, the wait, is not
 *     carried: `08 clears` draws its figure (8.6's row).
 *
 * So the card holds four notes on every trade (two prose, two questions),
 * three on a trade with no character. 8.6's row says "two suits, one think
 * twice"; the file holds ONE edge and ONE watch-out per trade and nothing
 * else in the register (the hook is an essence, not a suit; the category
 * note a comparison), so the count is the data's, one and one, and this
 * header says so rather than inventing a second suit.
 *
 * WHAT THIS BUILDER CANNOT SHORTEN: the facts are authored prose, 123 to 229
 * characters on the edge (median 168) and 78 to 237 on the watch-out
 * (median 153), over the 140-character cap the authored locals notes keep
 * (locals_rows.ts). NoteList's own law is a fact within four lines at every
 * width, which the harness measures on the rendered card; a fact that runs
 * past it is a copy fault in the source file, never cut by this builder.
 */
import { getActivityCharacter } from "@/lib/content/activity_character";
import { getSmbRegime } from "@/lib/tax/smb_effective_rates";
import { checkRow, type CheckRow } from "@/lib/spine/checks_rows";
import type { LocalNote } from "@/lib/spine/locals_rows";
import type { AtlasIconId } from "@/components/brand/icons/atlas-icons-data";
import { COPY } from "@/lib/spine/copy";

export type SuitsRow = LocalNote & { key: "suits" | "thinkTwice" | "notGathered" | "price" | "margin" };

/** A GLYPH A NOTE (the goal of 2026-09-26, M6): the note's kind, drawn in the tile before it, so four notes read as four subjects
 *  before a word is read; the not-gathered row carries none. */
export const NOTE_ICON: Partial<Record<SuitsRow["key"], AtlasIconId>> = { suits: "verdict", thinkTwice: "watch", price: "sale-tag", margin: "margin" };

export type SuitsData = {
  industryId: string;
  iso2: string;
  rows: SuitsRow[];
  /** True when the trade holds an edge or a watch-out; false when the not-gathered row stands. */
  hasCharacter: boolean;
  /** The two checks as the bank keyed them, for the gates. */
  checks: CheckRow[];
  basis: string;
};

/** The two prose notes for a trade, or the one not-gathered row. */
export function characterRows(industryId: string): { rows: SuitsRow[]; hasCharacter: boolean } {
  const c = getActivityCharacter(industryId);
  const rows: SuitsRow[] = [];
  const edge = typeof c?.edge === "string" ? c.edge.trim() : "";
  const watch = typeof c?.watchOut === "string" ? c.watchOut.trim() : "";
  if (edge) rows.push({ key: "suits", label: COPY.tradeSuits.labels.suits, fact: edge, icon: NOTE_ICON.suits });
  if (watch) rows.push({ key: "thinkTwice", label: COPY.tradeSuits.labels.thinkTwice, fact: watch, icon: NOTE_ICON.thinkTwice });
  if (rows.length === 0) rows.push({ key: "notGathered", label: COPY.tradeSuits.labels.notGathered, fact: COPY.tradeSuits.notGathered });
  return { rows, hasCharacter: rows[0].key !== "notGathered" };
}

/** The two checks the trade page carries, from the country's bank, steered by the cell's country. */
export function suitsChecks(iso2In: string): CheckRow[] {
  const iso2 = iso2In.toUpperCase();
  const regimeHeld = getSmbRegime(iso2) != null;
  return [
    { key: "price", branch: "always", ...checkRow("price", "always") },
    regimeHeld ? { key: "margin", branch: "held", ...checkRow("margin", "held") } : { key: "margin", branch: "notHeld", ...checkRow("margin", "notHeld") },
  ];
}

export function buildSuits(industryId: string, iso2In: string): SuitsData {
  const iso2 = iso2In.toUpperCase();
  const character = characterRows(industryId);
  const checks = suitsChecks(iso2);
  const rows: SuitsRow[] = [...character.rows, ...checks.map((c) => ({ key: c.key as "price" | "margin", label: c.label, fact: c.fact, icon: NOTE_ICON[c.key as "price" | "margin"] }))];
  return { industryId, iso2, rows, hasCharacter: character.hasCharacter, checks, basis: COPY.tradeSuits.basis };
}
