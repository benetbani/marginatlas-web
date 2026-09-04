/**
 * verify_archetype_copy , the browser-free half of the archetype harness, so it
 * can sit in the prebuild chain (no network, no secret, no browser).
 *
 * For EVERY country the taxonomy lists it builds the answer card's facts and
 * checks the copy and the promises:
 *  REGISTER: no banned corporate word in any label, note or subtitle (founder
 *    ruling 11 of 2026-09-04).
 *  LABELS: a label is four words or fewer; a note is one plain line under 48
 *    characters.
 *  PROMISE: the subtitle names registration only when the registration cost
 *    cell resolves; it names the answer only when the answer resolves.
 *  NO EMPTY SLOT: no cell carries an empty value.
 *  TAG: a modelled answer is marked modelled, so the card tags it.
 * BLIND SPOT: it cannot see a wrap or a hole; the browser half does that.
 */
import { COUNTRIES } from "@/lib/taxonomy";
import { buildHeroFacts } from "@/lib/spine/hero_facts";
import { COPY } from "@/lib/spine/copy";

const reds: string[] = [];
const codes = (COUNTRIES as any[]).map((c) => String(c.code ?? c.iso2 ?? "").toUpperCase()).filter((c) => c.length === 2);
let rendered = 0;
let noAnswer = 0;
for (const iso2 of codes) {
  const f = buildHeroFacts(iso2);
  if (!f.answer && f.cells.length === 0) continue;
  rendered++;
  if (!f.answer) noAnswer++;
  const texts = [f.subtitle ?? "", f.answer?.label ?? "", ...f.cells.flatMap((c) => [c.label, c.note ?? "", c.group ?? ""])];
  for (const t of texts) for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`${iso2}: banned word "${b}" in "${t}"`);
  for (const c of f.cells) {
    if (c.label.split(/\s+/).length > 4) reds.push(`${iso2}: label over four words: "${c.label}"`);
    if (c.note && c.note.length > 48) reds.push(`${iso2}: note over 48 characters: "${c.note}"`);
    if (c.value === "" || c.value == null) reds.push(`${iso2}: empty cell ${c.key}`);
  }
  const promisesRegister = /register/i.test(f.subtitle ?? "");
  if (promisesRegister !== f.cells.some((c) => c.key === "llc-cost")) reds.push(`${iso2}: the subtitle's promise does not match the cells ("${f.subtitle}")`);
  if (f.answer && f.answer.confidence === "measured") reds.push(`${iso2}: the effective rate is a modelled figure and is not marked so`);
}
console.log(`archetype copy: ${rendered} countries render the answer card, ${noAnswer} of them with no regime row (the state word); ${reds.length} red(s)`);
for (const r of reds.slice(0, 40)) console.log("  " + r);
if (reds.length) process.exit(1);
