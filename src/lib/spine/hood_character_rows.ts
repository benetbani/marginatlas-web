/**
 * src/lib/spine/hood_character_rows.ts
 *
 * WHAT THE DISTRICT IS LIKE, `05 character` (MODEL.md 8.8; plan step 35,
 * 2026-09-19): THE PAGE'S ONE PROSE SECTION (PART 9 clause 44, R9), on
 * NoteList's law with the editorial exemption on, a label over one fact,
 * hairlines between, never a paragraph. On the hub the card draws the
 * CHEAPEST district's rows (the page's answer names it as the reference,
 * which is the reason one of seven is drawn); on a district page, that
 * district's. The controller's ruling (e) names the rows and their order:
 *
 *  1. IN A SENTENCE: the district's authored character paragraph
 *     (`neighborhood_flavor_v1.json` `.character_paragraph`), CUT TO ITS
 *     OPENING SENTENCE, because the paragraphs run 252 to 289 characters on
 *     London's seven and NoteList's law is a fact within four lines at every
 *     width: measured 2026-09-19 on the story sheet at 375, a fact column is
 *     301 pixels and four lines hold about 150 characters (a 153-character
 *     fact took four lines, the archetype's cap). PART 9 clause 33 licenses
 *     exactly this ("Sentences are cut, sections are not") and nothing more:
 *     the fact is a verbatim prefix of the authored text ending at a sentence
 *     end, or, where the opening sentence itself runs past the cap, at its
 *     first colon or semicolon (the clause before it, closed with a full
 *     stop: the South Bank and South London today, whose opening sentences
 *     run 170 and 197). Nothing is composed and no word is changed; the
 *     basis says the line is the note's opening. Where even the clause runs
 *     past the cap (no district today) the row prints the stated line
 *     instead of a cut mid-sentence. The rest of each paragraph is printed
 *     nowhere on the spine, and the report says so.
 *  2. WHO IS HERE: `.demographic_skew`, the file's compact tag, sentence-cased
 *     and closed with a full stop (a fact is a sentence), nothing added.
 *  3. PRICE TIER: `.price_tier`, the file's own word (luxury, expensive, mid,
 *     affordable, budget), capitalised: a note is prose, not a figure cell.
 *  4. THE SCHEME'S DESCRIPTION (`neighborhoods_v1.json` `.description`) only
 *     where it is not a second telling of the paragraph. A district holding
 *     a paragraph has its description as the shorter telling of the same
 *     subject by construction (London's seven: each names the sub-areas its
 *     paragraph opens with), so the row draws only where the district holds
 *     NO paragraph, where the description is the only telling; none today.
 *  `walkability` is never read (item 66); "foot traffic" is never written.
 *
 * The foot says where the other districts' notes are, one line, no door
 * (PART 7). Pure over hood_scheme.ts's rows, synchronous.
 */
import { COPY } from "@/lib/spine/copy";
import { countWord } from "@/lib/spine/district_rows";
import { hoodCity, spineHoodDistricts, type HoodDistrict } from "@/lib/spine/hood_scheme";
import { byRent } from "@/lib/spine/hood_take_rows";
import type { LocalNote } from "@/lib/spine/locals_rows";

/** Four lines at a phone's fact column, measured: about 150 characters. */
export const CHARACTER_FACT_CHARS_CAP = 150;

export type HoodCharacterRow = LocalNote & { key: "sentence" | "who" | "price" | "description" };

export type HoodCharacterData = {
  citySlug: string;
  /** The district drawn: the cheapest on the hub, the focused one on its page. */
  district: HoodDistrict;
  kicker: string;
  rows: HoodCharacterRow[];
  basis: string;
  foot: string;
  /** How the first row was cut: the whole opening sentence, its clause before a colon or semicolon, or withheld. */
  cut: "sentence" | "clause" | "withheld";
  /** The notes are authored, not measured: the opener's mark is on, behind his switch. */
  sample: true;
};

const fill = (t: string, vars: Record<string, string>) => t.replace(/\{(\w+)\}/g, (_m, k) => vars[k] ?? "");
const capFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const closed = (s: string) => (/[.!?]$/.test(s) ? s : `${s}.`);

/** The paragraph's opening sentence, within the cap; else its clause before the first colon or semicolon; else null. */
export function openingLine(paragraph: string, cap = CHARACTER_FACT_CHARS_CAP): { text: string; cut: "sentence" | "clause" } | null {
  const text = paragraph.trim();
  const sentence = (/^(.*?[.!?])(?:\s|$)/.exec(text)?.[1] ?? text).trim();
  if (sentence.length <= cap) return { text: sentence, cut: "sentence" };
  const clauseEnd = sentence.search(/[:;]\s/);
  if (clauseEnd > 0) {
    const clause = closed(sentence.slice(0, clauseEnd).trim());
    if (clause.length <= cap) return { text: clause, cut: "clause" };
  }
  return null;
}

/** Null when the city is not admitted, `focus` names no district, or the district holds no authored row. */
export function buildHoodCharacter(citySlug: string, focus: string | null = null): HoodCharacterData | null {
  const city = hoodCity(citySlug);
  const rows = spineHoodDistricts(citySlug);
  if (!city || !rows) return null;
  const district = focus ? rows.find((d) => d.slug === focus) ?? null : byRent(rows)[0];
  if (!district) return null;
  const notes: HoodCharacterRow[] = [];
  let cut: HoodCharacterData["cut"] = "withheld";
  if (district.paragraph) {
    const line = openingLine(district.paragraph);
    cut = line?.cut ?? "withheld";
    notes.push({ key: "sentence", label: COPY.hoodCharacter.rows.sentence, fact: line ? line.text : COPY.hoodCharacter.sentenceWithheld });
  }
  if (district.skew) notes.push({ key: "who", label: COPY.hoodCharacter.rows.who, fact: closed(capFirst(district.skew)) });
  if (district.priceTier) notes.push({ key: "price", label: COPY.hoodCharacter.rows.price, fact: capFirst(district.priceTier) });
  if (!district.paragraph && district.description) notes.push({ key: "description", label: COPY.hoodCharacter.rows.description, fact: district.description });
  if (notes.length === 0) return null;
  return {
    citySlug: city.slug,
    district,
    kicker: focus ? COPY.hoodCharacter.kicker : fill(COPY.hoodCharacter.kickerNamed, { district: district.name }),
    rows: notes,
    basis: COPY.hoodCharacter.basis,
    foot: fill(COPY.hoodCharacter.foot, { n: countWord(rows.length - 1) }),
    cut,
    sample: true,
  };
}
