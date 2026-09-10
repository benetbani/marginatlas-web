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
 *  PAY: every country's pay pair is withheld exactly when the average is
 *    under 110 percent of the minimum, the words are the founder's, and no
 *    figure exceeds the world's highest.
 *  DOORS: every country's terminus holds at most three doors, one pill,
 *    distinct first words, no "with Pro", and every href resolves to a route
 *    in the app folder (route groups dropped, [params] matched).
 *  NOTES: every authored note list holds at most five notes, a label of at
 *    most seven words and a fact of at most 140 characters, no banned word.
 * BLIND SPOT: it cannot see a wrap or a hole; the browser half does that.
 */
import { COUNTRIES } from "@/lib/taxonomy";
import { buildHeroFacts } from "@/lib/spine/hero_facts";
import { COPY } from "@/lib/spine/copy";
import { buildPeerTable } from "@/lib/spine/peer_rows";
import { marginCardFromSnapshot, snapshotCountries } from "@/lib/spine/margin_rows";
import { buildLocalsNotes, countriesWithNotes, NOTE_CAP, LABEL_WORDS_CAP, FACT_CHARS_CAP } from "@/lib/spine/locals_rows";
import { buildCloseDoors, buildCityCloseDoors } from "@/lib/spine/close_rows";
import { buildPayBars, PAY_RATIO_FLOOR } from "@/lib/spine/pay_rows";
import { buildHowTo } from "@/lib/spine/howto_rows";
import { cityVerdictFacts } from "@/lib/spine/city_verdict_facts";
import { buildCityDistrictBars, rentMult } from "@/lib/spine/district_rows";
import { DOOR_CAP } from "@/components/spine/archetypes/Terminus";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import cityListJson from "../data/cities/city_list_v1.json";

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
/* THE COMPARISON TABLE: every country's rows build without a throw; the
   heads and the caveat carry no banned word; a table never has a single row. */
let peerTables = 0;
for (const iso2 of codes) {
  const t = buildPeerTable(iso2);
  if (!t) continue;
  peerTables++;
  if (t.rows.length < 2) reds.push(`${iso2}: a peer table with one row`);
  for (const txt of [t.caveat, ...t.columns.map((c) => c.head)]) for (const b of COPY.banned) if (txt.toLowerCase().includes(b)) reds.push(`${iso2}: banned word "${b}" in the peers table`);
}
/* THE RANKED BARS: from the snapshot, a card never carries a loss or a floor
   as a row, and the withheld line counts what it dropped. */
let barCards = 0;
for (const iso2 of snapshotCountries()) {
  const card = marginCardFromSnapshot(iso2);
  if (!card || card.rows.length < 2) continue;
  barCards++;
  for (const r of card.rows) if (!(r.margin > 0.03)) reds.push(`${iso2}: a floored or negative margin reached the card (${r.name})`);
  if (card.withheld > 0 && !card.withheldLine) reds.push(`${iso2}: rows withheld without a line`);
}
let noteLists = 0;
for (const iso2 of countriesWithNotes()) {
  const d = buildLocalsNotes(iso2);
  if (!d) continue;
  noteLists++;
  if (d.notes.length > NOTE_CAP) reds.push(`${iso2}: ${d.notes.length} notes, over ${NOTE_CAP}`);
  for (const n of d.notes) {
    if (n.label.split(/\s+/).length > LABEL_WORDS_CAP) reds.push(`${iso2}: a note label over ${LABEL_WORDS_CAP} words: "${n.label}"`);
    if (n.fact.length > FACT_CHARS_CAP) reds.push(`${iso2}: a note fact over ${FACT_CHARS_CAP} characters: "${n.fact.slice(0, 40)}"`);
    for (const b of COPY.banned) if (`${n.label} ${n.fact}`.toLowerCase().includes(b)) reds.push(`${iso2}: banned word "${b}" in a note`);
    if (/\u2014/.test(n.label + n.fact)) reds.push(`${iso2}: an em dash in a note`);
  }
}
/* THE ROUTES, read from the app folder: every page.tsx becomes a pattern with
   route groups "(site)" dropped and "[param]" as one path segment. */
function routePatterns(): RegExp[] {
  const out: RegExp[] = [];
  const walk = (dir: string, segs: string[]) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) { walk(full, name.startsWith("(") ? segs : [...segs, name]); continue; }
      if (name === "page.tsx") out.push(new RegExp("^/" + segs.map((sg) => (sg.startsWith("[") ? "[^/]+" : sg.replace(/[.*+?^${}()|\\]/g, "\\$&"))).join("/") + "/?$"));
    }
  };
  walk("src/app", []);
  return out;
}
const ROUTES = routePatterns();
const resolves = (href: string) => ROUTES.some((re) => re.test(href.split("?")[0].split("#")[0]));
function checkDoors(iso2: string, doors: ReturnType<typeof buildCloseDoors>, page: string) {
  if (doors.length > DOOR_CAP) reds.push(`${iso2} ${page}: ${doors.length} doors, over ${DOOR_CAP}`);
  if (doors.filter((d) => d.kind === "pill").length > 1) reds.push(`${iso2} ${page}: more than one pill door`);
  const firsts = doors.map((d) => d.label.split(/\s+/)[0].toLowerCase());
  if (new Set(firsts).size !== firsts.length) reds.push(`${iso2} ${page}: doors share a first word (${firsts.join(", ")})`);
  for (const d of doors) {
    if (!resolves(d.href)) reds.push(`${iso2} ${page}: door "${d.label}" points at ${d.href}, which is not a route`);
    if (/with pro/i.test(d.label)) reds.push(`${iso2} ${page}: a door promises "with Pro"`);
    for (const b of COPY.banned) if (d.label.toLowerCase().includes(b)) reds.push(`${iso2} ${page}: banned word "${b}" in a door`);
  }
}
let howtos = 0;
for (const iso2 of codes) {
  const h = buildHowTo(iso2);
  if (!h) continue;
  howtos++;
  checkDoors(iso2, h.doors, "how-to");
  for (const n of [...h.forms, ...h.dots]) for (const b of COPY.banned) if (`${n.label} ${n.fact}`.toLowerCase().includes(b)) reds.push(`${iso2} how-to: banned word "${b}" in a note`);
}
let termini = 0;
for (const iso2 of codes) {
  const doors = buildCloseDoors(iso2);
  if (doors.length === 0) continue;
  termini++;
  if (doors.length > DOOR_CAP) reds.push(`${iso2}: ${doors.length} doors, over ${DOOR_CAP}`);
  if (doors.filter((d) => d.kind === "pill").length > 1) reds.push(`${iso2}: more than one pill door`);
  const firsts = doors.map((d) => d.label.split(/\s+/)[0].toLowerCase());
  if (new Set(firsts).size !== firsts.length) reds.push(`${iso2}: doors share a first word (${firsts.join(", ")})`);
  for (const d of doors) {
    if (!resolves(d.href)) reds.push(`${iso2}: door "${d.label}" points at ${d.href}, which is not a route`);
    if (/with pro/i.test(d.label)) reds.push(`${iso2}: a door promises "with Pro"`);
    for (const b of COPY.banned) if (d.label.toLowerCase().includes(b)) reds.push(`${iso2}: banned word "${b}" in a door`);
  }
}
let payCards = 0, payWithheld = 0;
for (const iso2 of codes) {
  const d = buildPayBars(iso2);
  if (!d) continue;
  payCards++;
  const f = d.rows.find((r) => r.key === "minimum")?.value, a = d.rows.find((r) => r.key === "average")?.value;
  const shouldWithhold = f != null && a != null && a < f * PAY_RATIO_FLOOR;
  if (shouldWithhold !== !!d.withheld) reds.push(`${iso2}: withholding disagrees with the ratio (${f}, ${a})`);
  if (d.withheld) payWithheld++;
  for (const r of d.rows) { if (!/^(Minimum salary|Average salary)$/.test(r.label)) reds.push(`${iso2}: a pay label is not the founder's word ("${r.label}")`); if (d.worldMax && r.value > d.worldMax.value) reds.push(`${iso2}: ${r.label} ${r.value} exceeds the world's highest ${d.worldMax.value}`); }
}
/* THE CITY TERMINI (city:close, run 19): every city in the list gets its doors
   from its meta alone (no adapter, so no district is ranked here and the door
   reads "Every district of ..."; London's district form is on the harness
   sheet), and each door is held to the same rules as a country's. */
let cityTermini = 0;
for (const c of (cityListJson as { cities: Array<{ slug: string; name: string; iso2: string }> }).cities) {
  const country = (COUNTRIES as any[]).find((x) => String(x.code ?? x.iso2 ?? "").toUpperCase() === String(c.iso2).toUpperCase());
  const doors = buildCityCloseDoors({ meta: { slug: c.slug, city: c.name, iso2: c.iso2, country_name: country?.name } });
  if (doors.length === 0) { reds.push(`${c.slug}: a city with no door out`); continue; }
  cityTermini++;
  checkDoors(c.slug, doors, "city");
}
/* THE CITY VERDICT CARD (city:verdict, run 23): the builder's law on a synthetic
   fixture, since the ranked districts come from the async adapter and the gate
   is browser-free and offline. Letters, never a place: the gate fabricates no
   district. The law: the answer is the spread between the two ends and names
   both; the cells are the middle of the ranking and the count; the multiples
   are modelled and marked so; one district draws nothing; the words sit under
   the caps of the key-value grid's cells and hold no banned word.

   THREE DISTRICTS AND TWO, both proven (task 13 fix wave, 2026-09-10). The
   three-district fixture is the comfortable input: it has a middle. TWO is the
   case the middle cell was wrong for, because the same expression that finds
   the middle of a ranking returns the CHEAPEST when there are only two, so the
   card printed the reference district twice, once in the basis line naming it
   and once in a cell labelled "Middle district". London is the only city with
   districts today, so nothing renders two; a rule proven only on the input
   that suits it is not proven. */
{
  const fixture = { where_to_trade: { list: [{ name: "B", rent_mult: 1.2 }, { name: "A", rent_mult: 0.9 }, { name: "C", rent_mult: 3 }] } };
  const v = cityVerdictFacts(fixture);
  if (!v) reds.push("verdict: three ranked districts draw nothing");
  else {
    /* THE ANSWER IS THE SPREAD NOW, task 13 (2026-09-10), not the lightest
       district. Under a basis where the cheapest district IS the reference,
       "the lightest rent load" is a multiple of one and says nothing, which
       is his complaint about the old average cell arriving one column over.
       On this fixture the cheapest is A at 0.9, so C at 3 rebases to 3.33 and
       the basis has to name BOTH ends: an answer of "x3.33" with only one
       district beside it is a number measured against something the reader
       cannot see, the exact fault this task was opened for. THE NOTATION FLIPPED
       to a trailing "x" with task 14 (see rentMult): the same figure, read in
       the order it is said out loud. */
    if (v.answer.value !== "3.33x" || !v.answer.basis.includes("C") || !v.answer.basis.includes("A")) reds.push(`verdict: the answer is not the spread between the two ends (${v.answer.value}, ${v.answer.basis})`);
    if (v.answer.confidence === "measured") reds.push("verdict: the multiples are composed from tag constants and are marked measured");
    /* THE AVERAGE CELL'S ASSERTION CHANGED FROM "x1.00" TO "1" because of his
       ruling of 2026-09-04 ("then you say the city average times one which
       is the baseline. You don't seem to have an idea on how the information
       should be actually given"), not because the old literal collided with
       model-laws-copy's BANNED WORDS rule (it did, but that collision is the
       symptom, not the reason for this line): the banned-word gate is
       correct that "x1.00" is not information, and this assertion no longer
       requires the builder to keep printing it. */
    /* THE CELLS ARE THE MIDDLE AND THE COUNT. The average cell is gone with
       the basis that made it ("City average / 1 / the baseline", a value that
       was 1 for every city on earth by definition), and the heaviest cell is
       gone because the answer is now the heaviest: a cell repeating it would
       be the "repeating the front part" fault he named on 2026-08-25. What is
       left is what the spread cannot say. Three districts rebased on A put B
       in the middle at 1.33. */
    if (v.cells.length !== 2 || v.cells[0].value !== "1.33x" || v.cells[0].note !== "B" || v.cells[1].value !== "3") reds.push(`verdict: the cells are not the middle district and the count (${v.cells.map((c) => `${c.label} ${c.value} ${c.note ?? ""}`).join("; ")})`);
    for (const c of v.cells) {
      if (c.label.split(/\s+/).length > 4) reds.push(`verdict: label over four words: "${c.label}"`);
      if (c.note && c.note.length > 48) reds.push(`verdict: note over 48 characters: "${c.note}"`);
    }
    for (const t of [v.kicker, v.answer.label, v.answer.basis, ...v.cells.flatMap((c) => [c.label, c.note ?? ""])]) for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`verdict: banned word "${b}" in "${t}"`);
  }
  /* TWO DISTRICTS: the answer still stands (a spread between two ends is
     exactly what two districts hold), the middle cell is GONE, and the one
     surviving cell is the count. Asserted by shape, not by index, so a future
     reordering of the cells cannot make this pass by accident. */
  const two = cityVerdictFacts({ where_to_trade: { list: [{ name: "B", rent_mult: 1.2 }, { name: "A", rent_mult: 0.9 }] } });
  if (!two) reds.push("verdict: two ranked districts draw nothing");
  else {
    if (two.answer.value !== "1.33x" || !two.answer.basis.includes("B") || !two.answer.basis.includes("A")) reds.push(`verdict: two districts, the answer is not the spread (${two.answer.value}, ${two.answer.basis})`);
    if (two.cells.some((c) => c.key === "middle")) reds.push(`verdict: two districts, and a middle cell reading "${String(two.cells.find((c) => c.key === "middle")?.value)}" beside "${String(two.cells.find((c) => c.key === "middle")?.note)}"`);
    if (two.cells.length !== 1 || two.cells[0].key !== "ranked" || two.cells[0].value !== "2") reds.push(`verdict: two districts, the cells are ${two.cells.map((c) => `${c.label} ${c.value}`).join("; ")}`);
    /* NO CELL IS A BARE WORD. The middle cell's old value was one; this holds
       for every cell the card may ever grow, not just that one. */
    for (const c of two.cells) if (!/\d/.test(String(c.value))) reds.push(`verdict: two districts, a cell with no figure in it ("${c.label}": "${String(c.value)}")`);
  }
  if (cityVerdictFacts({ where_to_trade: { list: [{ name: "A", rent_mult: 1 }] } })) reds.push("verdict: one district draws a card");
  if (cityVerdictFacts({})) reds.push("verdict: no districts draw a card");
}
/* THE DISTRICT RANKING (city:districts, run 25): the builder's law on the same
   kind of synthetic fixture, lettered, never a place. */
{
  const fixture = { where_to_trade: { list: [{ name: "B", slug: "b", rent_mult: 1.2, character: "Q" }, { name: "A", slug: "a", rent_mult: 0.9, character: "R" }, { name: "C", slug: "c", rent_mult: 3, character: "S" }] } };
  const b = buildCityDistrictBars(fixture);
  if (!b) reds.push("districts: three ranked districts draw nothing");
  else {
    /* THE TOP OF THE SET IS REBASED TOO: 3 against a cheapest of 0.9 is 3.33,
       and a top rule still reading 3 would be measuring the card's ceiling on
       the basis the rows no longer use. */
    if (b.rows.length !== 3 || b.worldMax !== 3.33) reds.push(`districts: ${b.rows.length} rows, top rule ${b.worldMax}`);
    if (b.cheapest !== "A" || b.dearest.name !== "C" || b.middle?.name !== "B") reds.push(`districts: the ends and the middle are ${b.cheapest} / ${b.middle?.name} / ${b.dearest.name}`);
    /* THE REFERENCE IS SAID, NOT MARKED (task 14, 2026-09-10). `cheapestKey`
       is gone with the pill it fed, so what has to hold now is that the
       reference district is NAMED in both places a reader meets it , the
       basis line and the column head , and that it is the district the rows
       are actually rebased on. The old assertion proved a key pointed at a
       drawn row; this proves the words point at the right district, which is
       the only thing left carrying the reference. */
    if (!b.basis.includes("A")) reds.push(`districts: the basis line does not name the district every figure is measured against ("${b.basis}")`);
    if (!b.phoneHead.value.includes("A")) reds.push(`districts: the column head does not name the district the figures are against ("${b.phoneHead.value}")`);
    if (/[{}]/.test(b.basis + b.phoneHead.value + b.phoneHead.name)) reds.push(`districts: a placeholder was never filled ("${b.basis}" / "${b.phoneHead.value}")`);
    /* EVERY ROW CARRIES A FIGURE, THE REFERENCE'S INCLUDED, and the
       reference's is a multiple of itself: 1.00x, formatted like every other
       row rather than blanked or worded. His two rulings of 2026-09-10 in one
       assertion ("the label replaces the number, which is totally an idiotic
       thing out there"), on the shipped builder rather than on the card. */
    const refRow = b.rows.find((r) => r.key === "a");
    if (!refRow) reds.push("districts: the cheapest district draws no row of its own");
    else if (rentMult(refRow.value) !== "1.00x") reds.push(`districts: the reference row's figure is "${rentMult(refRow.value)}", not its own multiple of itself`);
    for (const r of b.rows) if (!/\d/.test(rentMult(r.value))) reds.push(`districts: row "${r.name}" prints no figure ("${rentMult(r.value)}")`);
    if (!b.tagged) reds.push("districts: the multiples are composed from tag constants and are not marked modelled");
    /* THE ASSERTION IS INVERTED, task 13 (2026-09-10). It used to demand that
       every row CARRY its character note; his ruling on this exact card
       ("you should never do it for city districts, to just summarize them in
       one or two words. It should never happen") makes a carried note the
       fault, so the fixture now feeds a `character` on all three rows and the
       gate proves the builder drops every one of them. Feeding the field and
       asserting it is dropped is the point: asserting on a fixture with no
       `character` would pass on a builder that still copies it. */
    if (b.rows.some((r) => r.note)) reds.push("districts: a row carries a one-word summary of a place");
    /* TWO DECIMALS ALWAYS, A TRAILING x, AND NEVER A WORD (task 13 fix wave,
       reversed notation task 14, 2026-09-10). The formatter formats and does
       nothing else: it used to answer 1 with the word "cheapest", which PART 5
       bans ("any bare word standing where a figure belongs"), and any sub-1
       multiple from any future caller got the same word by accident. The
       multiplier now TRAILS the number, the order the row is read out in.
       Three halves asserted: the notation, that 1 is a formatted figure and
       not a word or a blank, and that a sub-1 multiple is one too. */
    if (rentMult(2.5) !== "2.50x") reds.push(`districts: the multiple prints as ${rentMult(2.5)}`);
    if (rentMult(1) !== "1.00x") reds.push(`districts: the formatter answers 1 with "${rentMult(1)}", not a formatted multiple`);
    if (rentMult(0.5) !== "0.50x") reds.push(`districts: the formatter answers a sub-1 multiple with "${rentMult(0.5)}"`);
    for (const t of [COPY.cityDistricts.kicker, COPY.cityDistricts.basis, COPY.cityDistricts.dearest, COPY.cityDistricts.phoneHead.name, COPY.cityDistricts.phoneHead.value, b.basis, b.phoneHead.value]) for (const bw of COPY.banned) if (t.toLowerCase().includes(bw)) reds.push(`districts: banned word "${bw}" in "${t}"`);
  }
  /* TWO DISTRICTS, the case nothing renders today: the card still draws, both
     rows still carry a figure, and there is no middle to name. The
     three-district fixture above cannot prove any of that. */
  const b2 = buildCityDistrictBars({ where_to_trade: { list: [{ name: "B", slug: "b", rent_mult: 1.2, character: "Q" }, { name: "A", slug: "a", rent_mult: 0.9, character: "R" }] } });
  if (!b2) reds.push("districts: two ranked districts draw nothing");
  else {
    if (b2.rows.length !== 2 || b2.worldMax !== 1.33) reds.push(`districts: two districts, ${b2.rows.length} rows, top rule ${b2.worldMax}`);
    if (b2.middle !== null) reds.push(`districts: two districts, and a middle of "${b2.middle.name}", which is one of the two ends`);
    if (b2.cheapest !== "A" || !b2.rows.some((r) => r.key === "a")) reds.push(`districts: two districts, the reference is "${b2.cheapest}" and it draws no row`);
    if (b2.rows.some((r) => !/\d/.test(rentMult(r.value)))) reds.push("districts: two districts, and a row prints no figure");
    if (!b2.phoneHead.value.includes("A")) reds.push(`districts: two districts, the column head does not name the reference ("${b2.phoneHead.value}")`);
    if (b2.rows.some((r) => r.note)) reds.push("districts: two districts, and a row carries a one-word summary of a place");
  }
  if (buildCityDistrictBars({ where_to_trade: { list: [{ name: "A", rent_mult: 1 }] } })) reds.push("districts: one district draws a card");
  if (buildCityDistrictBars({})) reds.push("districts: no districts draw a card");
}
console.log(`archetype copy: the verdict card's and the district ranking's laws held on their fixtures; ${cityTermini} city termini; ${rendered} countries render the answer card, ${noAnswer} of them with no regime row (the state word); ${peerTables} peer tables; ${barCards} margin cards with two or more credible rows; ${noteLists} note lists; ${termini} termini against ${ROUTES.length} routes; ${payCards} pay cards, ${payWithheld} withheld; ${howtos} how-to pages; ${reds.length} red(s)`);
for (const r of reds.slice(0, 40)) console.log("  " + r);
if (reds.length) process.exit(1);
