/**
 * scripts/lib/answer_type.mjs , ONE ANSWER TYPE A LIST, READ FROM THE MARKUP (plan 2026-10-13 country-page-journey, Task 1C; spec
 * E:/atlas/docs/superpowers/specs/2026-10-13-country-page-journey-design.md, sections 3 and 6: "a new chain gate reads each row's value
 * class and reds a list that mixes money, time, share, position or state"; his words of 2026-10-13, "in a declarative section you cannot
 * switch from words to numbers").
 *
 * A LIST is an element carrying `data-answer` (money, share, time, position, state, dated-pair, table, doors); its ROWS are the elements
 * carrying `data-value` whose nearest `data-answer` ancestor is the list. A row's CLASS is read from its value's text and, for a bare
 * number, from its label (the row's `[data-label]`) or the fold's head (`summary [data-label]`), because the unit lives there (spec
 * section 3: "units sit in the label or the column head, never in the cell"):
 *   position  a row carrying `data-placed` (a figure placed among the countries), whatever its unit;
 *   state     no digit in the value;
 *   money     a currency sign, or pence ("43.2p");
 *   share     a percent sign, or a bare number whose label or head says "per 100";
 *   time      a time word in the value, or a bare number whose label or head ends with one;
 *   count     any other bare number.
 * THE RULES:
 *   WRONG TYPE   a row whose class is not its list's type (a dated pair is read for its date instead; a table's columns are UNIT MIX's,
 *                in check_model_laws.mjs; doors hold no value class);
 *   UNIT IN CELL a value with a unit after its last digit (days, weeks, months, years, hours, "/100", "/mo", "a week", "an hour", "a
 *                month", "a year", "per");
 *   FOLD ROWS    an answer fold (`[data-fold="answer"]`) of fewer than two rows or more than eight;
 *   UNDECLARED   with `requireDeclared`, a fact-rows list, a detail panel or the board's rows that declare no type;
 *   SLOT TYPE    a slot (`[data-slot]`) whose own fact rows, outside its folds, declare another type than the slot.
 * ITS BLIND SPOT, stated: it reads text, not meaning ("12" under "Steps in all" is a count; a figure written in words reads as a state);
 * a value outside `data-value` is unread; a closed fold's rows are read, because the markup holds them and the plus is part of its
 * section.
 */
export const LIST_TYPES = ["money", "share", "time", "position", "state", "dated-pair", "table", "doors"];
const TIME_WORD = /\b(days?|weeks?|months?|years?|hours?)\b/i;
const TIME_END = /\b(days?|weeks?|months?|years?|hours?)$/i;
const UNIT_AFTER = /\d[\d.,]*\s*(?:[KMB]\b)?\s*(?:\/\s*\d+|\/\s*mo\b|\b(?:days?|weeks?|months?|years?|hours?)\b|\ba (?:week|month|year)\b|\ban hour\b|\bper\b)/i;
/* A row's text runs its cells together ("1 Apr 2026Minimum wage"), so the year ends at its last digit, not at a word boundary. */
const DATE = /\b\d{1,2}\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s\d{4}(?!\d)/;
const fold = (s) => (s || "").replace(/[\s\u00a0]+/g, " ").trim();

/** The class of one row. */
export function classifyRow({ value, label = "", head = "", placed = false }) {
  const v = fold(value);
  if (!v || /^[\u2013-]$/.test(v)) return null;
  if (placed) return "position";
  if (!/\d/.test(v)) return "state";
  if (/[£$€]/.test(v) || /\d\s?p\b/.test(v)) return "money";
  if (/%/.test(v)) return "share";
  if (TIME_WORD.test(v)) return "time";
  const l = fold(label);
  const h = fold(head);
  if (/\bper 100\b/i.test(l) || /\bper 100\b/i.test(h)) return "share";
  if (TIME_END.test(l) || TIME_END.test(h)) return "time";
  return "count";
}

/** A value that carries its unit after its last digit. */
export function unitInCell(value) {
  return UNIT_AFTER.test(fold(value));
}

/** Reads one parsed render or fragment. */
export function readAnswerTypes(doc, { requireDeclared = false } = {}) {
  const root = doc.querySelector("main") || doc.body;
  const findings = [];
  const where = (el) => el.closest("[data-slot]")?.getAttribute("data-slot") || el.closest("[data-block]")?.getAttribute("data-block") || "page";
  /* `data-answer="1"` is older than this reading: it marks the page's answer on the masthead and the answer cards (AnswerCard,
     HeroBoard, IncomeBreakdown, MarkList), not a list, so it is not read as one. */
  const lists = [...root.querySelectorAll('[data-answer]:not([data-answer="1"])')];
  let rowsRead = 0;
  for (const list of lists) {
    const type = list.getAttribute("data-answer");
    if (!LIST_TYPES.includes(type)) { findings.push({ rule: "WRONG TYPE", where: where(list), detail: `a list declares "${type}", not one of ${LIST_TYPES.join(", ")}` }); continue; }
    const head = list.matches('[data-fold="answer"]') ? list.querySelector("summary [data-label]")?.textContent ?? "" : "";
    const values = [...list.querySelectorAll("[data-value]")].filter((v) => v.parentElement?.closest("[data-answer]") === list);
    for (const v of values) {
      rowsRead++;
      const rowEl = v.closest("[data-row], [data-detail-row]") || v.parentElement;
      const label = rowEl?.querySelector("[data-label]")?.textContent ?? "";
      const text = v.textContent ?? "";
      if (type === "dated-pair") {
        if (!DATE.test(rowEl?.textContent ?? "")) findings.push({ rule: "WRONG TYPE", where: where(list), detail: `a dated pair with no date: "${fold(rowEl?.textContent).slice(0, 60)}"` });
        continue;
      }
      if (type === "table" || type === "doors") continue;
      const placed = !!(rowEl && (rowEl.hasAttribute("data-placed") || rowEl.closest("[data-placed]")));
      const cls = classifyRow({ value: text, label, head, placed });
      if (cls && cls !== type) findings.push({ rule: "WRONG TYPE", where: where(list), detail: `"${fold(label)}" reads ${cls} ("${fold(text)}") in a ${type} list` });
      if (unitInCell(text)) findings.push({ rule: "UNIT IN CELL", where: where(list), detail: `"${fold(text)}" under "${fold(label)}": the unit belongs in the label or the head` });
    }
    if (list.matches('[data-fold="answer"]') && (values.length < 2 || values.length > 8)) findings.push({ rule: "FOLD ROWS", where: where(list), detail: `an answer fold of ${values.length} row(s); two to eight` });
  }
  if (requireDeclared) {
    for (const el of root.querySelectorAll('[data-archetype="fact-rows"], [data-archetype="detail-panel"], [data-hero-rows]')) {
      if (!el.hasAttribute("data-answer")) findings.push({ rule: "UNDECLARED", where: where(el), detail: `a ${el.getAttribute("data-archetype") ?? "hero rows"} list declares no answer type` });
    }
  }
  for (const slot of root.querySelectorAll("[data-slot]")) {
    const st = slot.getAttribute("data-answer");
    if (st === "table" || st === "doors") continue;
    for (const l of slot.querySelectorAll('[data-archetype="fact-rows"][data-answer]')) {
      if (l.closest("details") || l.closest("[data-slot]") !== slot) continue;
      if (l.getAttribute("data-answer") !== st) findings.push({ rule: "SLOT TYPE", where: slot.getAttribute("data-slot"), detail: `the slot answers ${st} and its own rows declare ${l.getAttribute("data-answer")}` });
    }
  }
  return { lists: lists.length, rows: rowsRead, findings };
}
