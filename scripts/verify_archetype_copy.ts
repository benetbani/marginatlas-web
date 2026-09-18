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
 *  SEATS: every drawn blocked seat's copy (MODEL.md 8.2; plan step 31's
 *    seventh dispatch, 2026-09-18): one line in the site's idiom, under
 *    fifteen words, a foot naming a DATA-REQUIREMENTS item, no banned word,
 *    a kicker within four words that is the drawn card's own; and the four
 *    thin-country seats' conditions counted over the taxonomy from the
 *    builders the view reads, so the count a comment quotes is measured.
 * BLIND SPOT: it cannot see a wrap or a hole; the browser half does that.
 */
import { COUNTRIES } from "@/lib/taxonomy";
import { buildHeroFacts } from "@/lib/spine/hero_facts";
import { COPY } from "@/lib/spine/copy";
import { buildPeerTable } from "@/lib/spine/peer_rows";
import { marginCardFromSnapshot, snapshotCountries } from "@/lib/spine/margin_rows";
import { buildLocalsNotes, countriesWithNotes, NOTE_CAP, LABEL_WORDS_CAP, FACT_CHARS_CAP } from "@/lib/spine/locals_rows";
import { buildCloseDoors, buildCityCloseDoors, buildCompareDoor } from "@/lib/spine/close_rows";
import { buildChecks, CHECKS_BANK, WAIT_DAYS_THRESHOLD } from "@/lib/spine/checks_rows";
import { getSmbRegime } from "@/lib/tax/smb_effective_rates";
import { getFormationRowByTier } from "@/lib/tax/country_rates";
import { buildPayBars, PAY_RATIO_FLOOR } from "@/lib/spine/pay_rows";
import { buildGlance } from "@/lib/spine/glance_rows";
import { buildWorldSeat } from "@/lib/spine/world_seat_rows";
import { buildCityGlance, CITY_GLANCE_CELLS, isVisitorsRead } from "@/lib/spine/city_glance_rows";
import { buildCitySeat } from "@/lib/spine/city_seat_rows";
import { buildPremisesBento } from "@/lib/spine/premises_bento_rows";
import { buildEntryBill } from "@/lib/spine/entry_bill_rows";
import { buildRunningCosts } from "@/lib/spine/running_costs_rows";
import { buildHowTo } from "@/lib/spine/howto_rows";
import { buildCityDistrictBars, rentMult } from "@/lib/spine/district_rows";
import { DOOR_CAP } from "@/components/spine/archetypes/Terminus";
import { MARK_LIST_FLOOR } from "@/components/spine/archetypes/MarkList";
import { SEAT_LINE_WORDS_CAP } from "@/components/spine/archetypes/BlockedSeat";
import { buildSetupRows } from "@/lib/spine/setup_rows";
import { buildMarkList, MARK_LIST_CAP } from "@/lib/spine/mark_list_rows";
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
/* THE CITY VERDICT CARD'S TESTS LEFT WITH THE CARD (plan step 32, 2026-09-18):
   MODEL.md 8.3 dissolves the rent verdict into the masthead's answer, the
   builder city_verdict_facts.ts is deleted, and the district ranking below
   is the one card that prints the district rents. */
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
/* THE MARK LIST (B3, 2026-09-10): the builder's law on the REAL files, not on
   a fixture, because both of the files behind it are local and static
   (`data/cities/city_list_v1.json` and the margin snapshot), so nothing here
   needs a browser or the database. What is proved: every drawn row carries a
   figure that prints as a figure, the rows fall in order, the withheld count
   and the withheld line agree in both directions, the set adds up, no
   placeholder survives into a printed string, no head runs past three words,
   and the floor holds from the low side on a real country rather than only
   from the high side on a comfortable one. */
{
  const markListKeys = ["cities:pay", "cities:visitors", "trade:auto_repair_shops"];
  let markLists = 0;
  for (const key of markListKeys) {
    const d = buildMarkList(key);
    if (!d) { reds.push(`mark list ${key}: draws nothing, and this key is one the files hold`); continue; }
    markLists++;
    if (d.rows.length < MARK_LIST_FLOOR) reds.push(`mark list ${key}: ${d.rows.length} rows, under the floor of ${MARK_LIST_FLOOR}`);
    if (d.rows.length > MARK_LIST_CAP) reds.push(`mark list ${key}: ${d.rows.length} rows, over the cap of ${MARK_LIST_CAP}`);
    for (const r of d.rows) {
      if (!Number.isFinite(r.value)) reds.push(`mark list ${key}: row "${r.name}" carries no figure`);
      else if (!/\d/.test(d.fmt(r.value))) reds.push(`mark list ${key}: row "${r.name}" prints no figure ("${d.fmt(r.value)}")`);
    }
    for (let i = 1; i < d.rows.length; i++) {
      if (d.rows[i].value > d.rows[i - 1].value) reds.push(`mark list ${key}: "${d.rows[i].name}" ranks below "${d.rows[i - 1].name}" and holds the larger figure`);
    }
    /* BOTH DIRECTIONS: a withheld member with no line is a silent drop, and a
       line with nothing withheld is a card apologising for nothing. */
    if ((d.withheld > 0) !== (d.withheldLine != null)) reds.push(`mark list ${key}: ${d.withheld} withheld and the line is ${d.withheldLine ? "printed" : "absent"}`);
    if (d.withheldLine && !/\d/.test(d.withheldLine)) reds.push(`mark list ${key}: the withheld line counts nothing ("${d.withheldLine}")`);
    if (d.rows.length + d.withheld > d.universe) reds.push(`mark list ${key}: ${d.rows.length} rows and ${d.withheld} withheld out of a set of ${d.universe}`);
    /* THE HEADLINE IS THE SET'S MIDDLE, so it can never sit above the highest
       row the card draws; if it does, it is being measured over some other
       set than the one the rows come from. */
    if (d.middle > d.rows[0].value) reds.push(`mark list ${key}: the middle (${d.fmt(d.middle)}) stands above the highest row (${d.fmt(d.rows[0].value)})`);
    const texts = [d.kicker, d.basis, d.middleLabel, d.head.name, d.head.value, d.withheldLine ?? ""];
    if (texts.some((t) => /[{}]/.test(t))) reds.push(`mark list ${key}: a placeholder was never filled ("${texts.find((t) => /[{}]/.test(t))}")`);
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`mark list ${key}: banned word "${b}" in "${t}"`);
      if (/—/.test(t)) reds.push(`mark list ${key}: an em dash in "${t}"`);
    }
    /* THE HEADS ARE ROW GRAMMAR, three words (PART 5). THE HEADLINE LABEL IS
       ANSWER GRAMMAR, four, the cap the hero's own "Total effective tax
       burden" already sits at: it names the card's one figure, not a column. */
    for (const [where, t] of [["the name head", d.head.name], ["the value head", d.head.value]] as Array<[string, string]>) {
      if (t.trim().split(/\s+/).length > 3) reds.push(`mark list ${key}: ${where} is ${t.trim().split(/\s+/).length} words, over three ("${t}")`);
    }
    if (d.middleLabel.trim().split(/\s+/).length > 4) reds.push(`mark list ${key}: the headline label is ${d.middleLabel.trim().split(/\s+/).length} words, over four ("${d.middleLabel}")`);
  }
  /* THE FLOOR FROM THE LOW SIDE, on a real country: New Zealand holds three
     covered cities, one under the floor, so it must draw nothing. Proving the
     floor only on sets that clear it is proving nothing. */
  if (buildMarkList("cities:pay:NZ")) reds.push("mark list: a country with three covered cities draws a card, under the floor of four");
  if (buildMarkList("trade:unlisted_sector")) reds.push("mark list: a trade the taxonomy does not hold draws a card");
  if (buildMarkList("cities:pay:ZZ")) reds.push("mark list: a country with no covered city draws a card");
  console.log(`mark list: ${markLists} of ${markListKeys.length} subjects build; the floor holds from the low side`);
}

/* THE TWO COUNTRY SEATS KvGrid HOLDS (MODEL.md 8.2 `01 glance` and `02
   world-seat`; plan step 31's second dispatch, 2026-09-17), on every
   country: a label of four words or fewer (a fact cell's cap, PART 9 clause
   9), no banned word or placeholder in any string, no empty cell, and the
   withheld line agreeing with the cells BOTH WAYS (a missing cell with no
   line is a silent drop; a line with nothing missing apologises for nothing):
   the glance's count is five minus its cells, the seat's payroll sentence
   prints exactly when its payroll cell does not, and its lending sentence
   always, because the lending rate is withheld on every country (item 38).
   The 0.45 fingerprint on the minimum salary has its own gate,
   verify_min_wage_not_fill.ts, and is not repeated here. */
{
  let glances = 0;
  let seats = 0;
  for (const iso2 of codes) {
    const g = buildGlance(iso2);
    if (g) {
      glances++;
      const texts = [...g.cells.map((c) => c.label), g.basis ?? "", g.foot ?? "", g.withheld ?? ""];
      for (const t of texts) {
        for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`glance ${iso2}: banned word "${b}" in "${t}"`);
        if (/[{}]/.test(t)) reds.push(`glance ${iso2}: a placeholder was never filled ("${t}")`);
      }
      for (const c of g.cells) {
        if (c.label.split(/\s+/).length > 4) reds.push(`glance ${iso2}: label over four words: "${c.label}"`);
        if (c.value === "" || c.value == null) reds.push(`glance ${iso2}: empty cell ${c.key}`);
      }
      const missing = 5 - g.cells.length;
      if ((missing > 0) !== (g.withheld != null)) reds.push(`glance ${iso2}: ${missing} cell(s) missing and the withheld line is ${g.withheld ? "printed" : "absent"}`);
      if (g.withheld && !g.withheld.startsWith(`${missing} of 5`)) reds.push(`glance ${iso2}: ${missing} cell(s) missing but the line reads "${g.withheld}"`);
      if (g.gdpYear != null && !(g.foot ?? "").includes(String(g.gdpYear))) reds.push(`glance ${iso2}: the snapshot year ${g.gdpYear} is held and the foot does not say it`);
    }
    const s = buildWorldSeat(iso2);
    if (s) {
      seats++;
      const texts = [...s.cells.map((c) => c.label), s.basis, s.foot, s.withheld];
      for (const t of texts) {
        for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`world-seat ${iso2}: banned word "${b}" in "${t}"`);
        if (/[{}]/.test(t)) reds.push(`world-seat ${iso2}: a placeholder was never filled ("${t}")`);
      }
      for (const c of s.cells) {
        if (c.label.split(/\s+/).length > 4) reds.push(`world-seat ${iso2}: label over four words: "${c.label}"`);
        if (c.value === "" || c.value == null) reds.push(`world-seat ${iso2}: empty cell ${c.key}`);
      }
      const hasPayroll = s.cells.some((c) => c.key === "payroll");
      if (hasPayroll === s.withheld.includes(COPY.worldSeat.withheld.payroll)) reds.push(`world-seat ${iso2}: the payroll cell is ${hasPayroll ? "drawn" : "absent"} and its withheld sentence is ${hasPayroll ? "printed" : "missing"}`);
      if (!s.withheld.includes(COPY.worldSeat.withheld.lending)) reds.push(`world-seat ${iso2}: the lending rate is withheld on every country and the line does not say so`);
    }
  }
  console.log(`country seats: ${glances} glance cards and ${seats} world-seat cards build; labels, withheld lines and the year in the foot held`);
}

/* THE CITY'S TWO KvGrid SEATS (MODEL.md 8.3 `01 glance` and `02
   among-cities`; plan step 32's first dispatch, 2026-09-18), the country's
   rule one altitude down, on every covered city: a label of four words or
   fewer, no banned word or placeholder in any string, no empty cell, and the
   withheld line agreeing with the cells BOTH WAYS. The glance's count is
   four minus its cells, since the human development index is withheld on
   every city (no row is a reading of the city); the visitor cell prints
   exactly where the row's own source note says the city counted it, and
   never a figure the file derived from the country's arrivals (item 20),
   which is the fill R11 withholds. The seat prints its two cells on every
   city, its GDP always modelled (no row carries a source, item 31), and its
   foot always says the placement is not shown. Both builders read the city
   list and the city shard only, no browser, no database. */
{
  const cities = (cityListJson as { cities: Array<{ slug: string; tourist_arrivals_m?: number; sources?: Record<string, string> }> }).cities;
  let glances = 0;
  let seats = 0;
  let visitorsDrawn = 0;
  for (const c of cities) {
    const g = buildCityGlance(c.slug);
    if (!g) reds.push(`city glance ${c.slug}: builds nothing (the permit days and the business count are held for every city)`);
    else {
      glances++;
      const texts = [...g.cells.map((x) => x.label), g.basis ?? "", g.foot ?? "", g.withheld ?? ""];
      for (const t of texts) {
        for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`city glance ${c.slug}: banned word "${b}" in "${t}"`);
        if (/[{}]/.test(t)) reds.push(`city glance ${c.slug}: a placeholder was never filled ("${t}")`);
      }
      for (const x of g.cells) {
        if (x.label.split(/\s+/).length > 4) reds.push(`city glance ${c.slug}: label over four words: "${x.label}"`);
        if (x.value === "" || x.value == null) reds.push(`city glance ${c.slug}: empty cell ${x.key}`);
      }
      const missing = CITY_GLANCE_CELLS - g.cells.length;
      if ((missing > 0) !== (g.withheld != null)) reds.push(`city glance ${c.slug}: ${missing} cell(s) missing and the withheld line is ${g.withheld ? "printed" : "absent"}`);
      if (g.withheld && !g.withheld.startsWith(`${missing} of ${CITY_GLANCE_CELLS}`)) reds.push(`city glance ${c.slug}: ${missing} cell(s) missing but the line reads "${g.withheld}"`);
      if (g.cells.some((x) => x.key === "hdi") || !(g.withheld ?? "").includes(COPY.cityGlance.reasons.hdi)) reds.push(`city glance ${c.slug}: the human development index is withheld on every city and the line does not say so`);
      const visitorsOwn = typeof c.tourist_arrivals_m === "number" && c.tourist_arrivals_m > 0 && isVisitorsRead(c.sources?.tourist_arrivals_m);
      const drawn = g.cells.some((x) => x.key === "visitors");
      if (drawn !== visitorsOwn) reds.push(`city glance ${c.slug}: the visitor cell is ${drawn ? "drawn" : "absent"} and the row's count is ${visitorsOwn ? "the city's own" : "not the city's own"}`);
      if (drawn) visitorsDrawn++;
      const modelledCells = g.cells.filter((x) => x.confidence !== "measured").length;
      if ((modelledCells > 0) !== (g.foot != null)) reds.push(`city glance ${c.slug}: ${modelledCells} modelled cell(s) and the foot is ${g.foot ? "printed" : "absent"}`);
    }
    const s = buildCitySeat(c.slug);
    if (!s) reds.push(`city seat ${c.slug}: builds nothing (the metro GDP and the living index are held for every city)`);
    else {
      seats++;
      const texts = [...s.cells.map((x) => x.label), s.basis, s.foot];
      for (const t of texts) {
        for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`city seat ${c.slug}: banned word "${b}" in "${t}"`);
        if (/[{}]/.test(t)) reds.push(`city seat ${c.slug}: a placeholder was never filled ("${t}")`);
      }
      for (const x of s.cells) {
        if (x.label.split(/\s+/).length > 4) reds.push(`city seat ${c.slug}: label over four words: "${x.label}"`);
        if (x.value === "" || x.value == null) reds.push(`city seat ${c.slug}: empty cell ${x.key}`);
      }
      const gdpCell = s.cells.find((x) => x.key === "gdp");
      if (gdpCell && gdpCell.confidence === "measured") reds.push(`city seat ${c.slug}: the metro GDP carries no source on any row and is marked measured`);
      if (!s.foot.includes("not shown yet")) reds.push(`city seat ${c.slug}: the placement is not drawn and the foot does not say so ("${s.foot}")`);
      if (/in ten/.test(s.cells.map((x) => `${x.label} ${x.note ?? ""}`).join(" ") + s.basis + s.foot)) reds.push(`city seat ${c.slug}: a placement sentence is drawn before his click`);
    }
  }
  console.log(`city seats: ${glances} glance cards (the visitor cell drawn on ${visitorsDrawn}, the human development index withheld on all) and ${seats} placement seats build over ${cities.length} cities; labels, withheld lines and the foot held`);
}

/* THE PREMISES BENTO (MODEL.md 8.3 `04 premises`; plan step 32's second
   dispatch, 2026-09-18), on every covered city: the cluster builds for every
   listed city (the shard's four `realestate.*` fields, 252 of 252); each of
   the four cells holds a figure OR a stated line and never neither (the
   builder's type makes both impossible; the count here is the withheld
   number agreeing with the cells both ways); the four openers are 8.3's own
   words, within PART 7's four; every basis within its fourteen words, saying
   "modelled" exactly when its figure's tag is not held (the sample mark is
   behind the switch, so the basis is the only line that can) and never on a
   held figure; the count cell's basis prints the shard's rate and says
   "rounded" exactly when the drawn part is not the rate; the count's part a
   whole number in 0 to 100; no banned word or unfilled placeholder in any
   string. The counts by tag are printed so the numbers 8.3 quotes (133 held,
   119 modelled) are measured here rather than remembered. */
{
  const cities = (cityListJson as { cities: Array<{ slug: string }> }).cities;
  let built = 0, held = 0, modelled = 0, withheldCells = 0, rounded = 0;
  const K = COPY.premisesBento.kickers;
  for (const k of Object.values(K)) if (k.split(/\s+/).length > 4) reds.push(`premises: the opener runs over four words: "${k}"`);
  for (const c of cities) {
    const d = buildPremisesBento(c.slug);
    if (!d) { reds.push(`premises ${c.slug}: builds nothing (every listed city holds a shard)`); continue; }
    built++;
    if (d.withheld === 0 && !d.sample) held++;
    if (d.sample) modelled++;
    const cells = [d.rent, d.fitOut, d.deposit, d.empty] as const;
    const lines: string[] = [];
    let withheld = 0;
    for (const cell of cells) {
      if ("withheld" in cell) { withheld++; lines.push(cell.withheld); continue; }
      lines.push(cell.basis);
      const figure = "figure" in cell ? cell.figure : `${cell.part} of ${cell.whole}`;
      if (!figure || figure === "undefined") reds.push(`premises ${c.slug}: an empty figure`);
      if (cell.basis.split(/\s+/).filter(Boolean).length > 14) reds.push(`premises ${c.slug}: a basis over fourteen words: "${cell.basis}"`);
      if ((cell.tag !== "held") !== /modelled/.test(cell.basis)) reds.push(`premises ${c.slug}: ${cell.tag !== "held" ? "a modelled figure and the basis does not say so" : "a held figure and the basis says modelled"}: "${cell.basis}"`);
      if ("part" in cell) {
        if (!Number.isInteger(cell.part) || cell.part < 0 || cell.part > 100) reds.push(`premises ${c.slug}: the count's part is ${cell.part}, not a whole number in 0 to 100`);
        const didRound = cell.part !== cell.rate;
        if (didRound) rounded++;
        if (didRound !== /rounded/.test(cell.basis)) reds.push(`premises ${c.slug}: the part ${cell.part} against the rate ${cell.rate} and the basis ${didRound ? "does not say rounded" : "says rounded"}: "${cell.basis}"`);
        if (!cell.basis.includes(String(cell.rate))) reds.push(`premises ${c.slug}: the basis does not print the rate ${cell.rate}: "${cell.basis}"`);
      }
    }
    withheldCells += withheld;
    if (withheld !== d.withheld) reds.push(`premises ${c.slug}: ${withheld} withheld cell(s) and the cluster counts ${d.withheld}`);
    for (const t of [...Object.values(K), ...lines]) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`premises ${c.slug}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`premises ${c.slug}: a placeholder was never filled ("${t}")`);
    }
  }
  console.log(`premises bento: ${built} clusters build over ${cities.length} cities, ${held} every figure held, ${modelled} modelled and saying so, ${withheldCells} withheld cell(s), ${rounded} counts rounded and saying so; openers and basis lines within their caps, no banned word`);
}

/* THE BILL TO REGISTER (MODEL.md 8.2 `04 entry-bill`; plan step 31's third
   dispatch, 2026-09-17), on every country: no banned word or unfilled
   placeholder in any string the card prints, the kicker within PART 7's four
   words, the composed basis within its fourteen (the both-figures line sits
   exactly at the cap), each slot holding a figure OR a stated line and never
   neither, and the foot saying "modelled" exactly when a printed figure's tag
   is not held (the sample mark is behind the switch, so the foot is the only
   line that can). The guard's arithmetic against the formation table has its
   own gate, entry-bill-guard, and is not repeated here. */
{
  let bills = 0;
  for (const iso2 of codes) {
    const d = buildEntryBill(iso2);
    if (!d) continue;
    bills++;
    const secondText = "figure" in d.second ? `${d.second.figure} ${d.second.words}` : d.second.withheld;
    const texts = [COPY.entryBill.kicker, d.figure ?? "", d.withheld ?? "", secondText, d.basis ?? "", d.foot ?? ""];
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`entry-bill ${iso2}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`entry-bill ${iso2}: a placeholder was never filled ("${t}")`);
    }
    if (COPY.entryBill.kicker.split(/\s+/).length > 4) reds.push(`entry-bill: the kicker runs over four words: "${COPY.entryBill.kicker}"`);
    if (d.basis && d.basis.split(/\s+/).filter(Boolean).length > 14) reds.push(`entry-bill ${iso2}: the basis runs over fourteen words: "${d.basis}"`);
    if ((d.figure == null) === (d.withheld == null)) reds.push(`entry-bill ${iso2}: the focal slot holds ${d.figure == null ? "neither a figure nor a line" : "a figure and a line"}`);
    if (!("figure" in d.second) && !("withheld" in d.second)) reds.push(`entry-bill ${iso2}: the second slot holds neither a figure nor a line`);
    if (d.sample !== /modelled/.test(d.foot ?? "")) reds.push(`entry-bill ${iso2}: ${d.sample ? "a printed figure is modelled and the foot does not say so" : "nothing printed is modelled and the foot says modelled"}`);
  }
  console.log(`entry bill: ${bills} cards build; no banned word, the kicker and basis within their caps, every slot a figure or a line, modelled said in the foot`);
}

/* POWER AND LIVING COSTS (MODEL.md 8.2 `06 running-costs`; plan step 31's
   fourth dispatch, 2026-09-18), on every country: no banned word or unfilled
   placeholder in any string the card prints, a label of four words or fewer
   (the fact cell's cap), the kicker within PART 7's four words, the composed
   basis within its fourteen (the both-cells line is thirteen), each of the two
   slots holding a cell OR a stated line and never neither (a missing cell
   with no line is a silent drop; a line beside a printed cell apologises for
   nothing), the foot saying "modelled" exactly when a printed cell is
   modelled (the sample mark is behind the switch, so the foot is the only
   line that can), and the cost of living always marked modelled when it
   prints. The fill on the electricity rate has its own gate,
   verify_electricity_not_fill.ts, and is not repeated here. */
{
  let cards = 0;
  for (const iso2 of codes) {
    const r = buildRunningCosts(iso2);
    if (!r) continue;
    cards++;
    const texts = [COPY.runningCosts.kicker, ...r.cells.map((c) => c.label), ...r.withheld, r.basis ?? "", r.foot ?? ""];
    for (const t of texts) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`running-costs ${iso2}: banned word "${b}" in "${t}"`);
      if (/[{}]/.test(t)) reds.push(`running-costs ${iso2}: a placeholder was never filled ("${t}")`);
    }
    for (const c of r.cells) {
      if (c.label.split(/\s+/).length > 4) reds.push(`running-costs ${iso2}: label over four words: "${c.label}"`);
      if (c.value === "" || c.value == null) reds.push(`running-costs ${iso2}: empty cell ${c.key}`);
    }
    if (COPY.runningCosts.kicker.split(/\s+/).length > 4) reds.push(`running-costs: the kicker runs over four words: "${COPY.runningCosts.kicker}"`);
    if (r.basis && r.basis.split(/\s+/).filter(Boolean).length > 14) reds.push(`running-costs ${iso2}: the basis runs over fourteen words: "${r.basis}"`);
    if (r.cells.length + r.withheld.length !== 2) reds.push(`running-costs ${iso2}: ${r.cells.length} cell(s) and ${r.withheld.length} withheld line(s); two slots, each a cell or a line`);
    const living = r.cells.find((c) => c.key === "living");
    if (living && living.confidence !== "modeled") reds.push(`running-costs ${iso2}: the cost of living is a weighting and is not marked modelled`);
    const modelled = r.cells.some((c) => c.confidence === "modeled");
    if (modelled !== /modelled/.test(r.foot ?? "")) reds.push(`running-costs ${iso2}: ${modelled ? "a printed cell is modelled and the foot does not say so" : "nothing printed is modelled and the foot says modelled"}`);
  }
  console.log(`running costs: ${cards} cards build; no banned word, the kicker and basis within their caps, two slots each a cell or a line, modelled said in the foot`);
}
/* BEFORE YOU COMMIT (MODEL.md 8.2 `18 checks`; plan step 31's fifth dispatch,
   2026-09-18), on every country: two or three rows and the basis that counts
   them; every row a bank row word for word (the bank is the composition's
   section 9, and a rewritten question is a different check on the trade page,
   M20); the second row on the hero's own regime lookup and the third present
   exactly when the formation file holds an LLC row with a filing time, on the
   over-21 side exactly when that time is over 21 (R10: the row self-omits
   where the page holds no registration time, never a verdict); no banned
   word, the kicker within four words, the basis within fourteen, a label of
   three words or fewer (PART 5); and the E1 arithmetic held in copy, the
   questions plus the basis under 220 characters, so the render gate has
   nothing to find. The compare door beside it (`19 compare`): one pill,
   the name through inSentence(), an href the app folder holds, no banned
   word, held to the same door law as every terminus. */
{
  let cards = 0, three = 0, two = 0, over = 0;
  const bankFacts = new Set(Object.values(CHECKS_BANK).flatMap((r) => Object.values(r).map((n) => n!.fact)));
  for (const iso2 of codes) {
    const c = buildChecks(iso2);
    cards++;
    if (c.rows.length === 3) three++; else if (c.rows.length === 2) two++; else reds.push(`checks ${iso2}: ${c.rows.length} rows; two or three`);
    if (c.basis !== (c.rows.length === 3 ? COPY.checks.basis.three : COPY.checks.basis.two)) reds.push(`checks ${iso2}: the basis "${c.basis}" does not count ${c.rows.length} rows`);
    const llc = getFormationRowByTier(iso2, "LLC");
    const days = llc && typeof llc.days === "number" && llc.days > 0 ? llc.days : null;
    const wait = c.rows.find((r) => r.key === "wait");
    if ((wait != null) !== (days != null)) reds.push(`checks ${iso2}: the wait row is ${wait ? "drawn" : "omitted"} and the LLC filing time is ${days == null ? "not on file" : String(days)}`);
    if (wait && days != null && (wait.branch === "over") !== (days > WAIT_DAYS_THRESHOLD)) reds.push(`checks ${iso2}: the wait row reads "${wait.fact}" against ${days} days`);
    if (wait?.branch === "over") over++;
    const margin = c.rows.find((r) => r.key === "margin");
    if (!margin || (margin.branch === "held") !== (getSmbRegime(iso2) != null)) reds.push(`checks ${iso2}: the margin row's branch disagrees with the regime lookup`);
    if (c.rows[0]?.key !== "price") reds.push(`checks ${iso2}: the first row is not the price`);
    for (const r of c.rows) {
      if (!bankFacts.has(r.fact)) reds.push(`checks ${iso2}: a question not in the bank: "${r.fact}"`);
      if (r.label.split(/\s+/).length > 3) reds.push(`checks ${iso2}: a label over three words: "${r.label}"`);
      if (!/\?$/.test(r.fact)) reds.push(`checks ${iso2}: a check that is not a question: "${r.fact}"`);
    }
    const texts = [COPY.checks.kicker, c.basis, ...c.rows.flatMap((r) => [r.label, r.fact])];
    for (const t of texts) for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`checks ${iso2}: banned word "${b}" in "${t}"`);
    const prose = c.rows.map((r) => r.fact).concat(c.basis).filter((t) => t.length >= 30 && /\s/.test(t)).reduce((n, t) => n + t.length, 0);
    if (prose > 220) reds.push(`checks ${iso2}: ${prose} characters of prose, over the 220 ceiling`);
    checkDoors(iso2, buildCompareDoor(String((COUNTRIES as any[]).find((x) => x.code === iso2)?.name ?? "")), "compare");
  }
  if (COPY.checks.kicker.split(/\s+/).length > 4) reds.push(`checks: the kicker runs over four words: "${COPY.checks.kicker}"`);
  if (COPY.compare.kicker.split(/\s+/).length > 4) reds.push(`compare: the kicker runs over four words: "${COPY.compare.kicker}"`);
  for (const b of [COPY.checks.basis.three, COPY.checks.basis.two]) if (b.split(/\s+/).filter(Boolean).length > 14) reds.push(`checks: the basis runs over fourteen words: "${b}"`);
  console.log(`checks: ${cards} cards build, ${three} with three rows and ${two} with two, ${over} on the over-21 wait; every row a bank row, the compare door on every country against the routes`);
}
/* THE DRAWN BLOCKED SEATS (MODEL.md 8.2, `07 workforce`, `11 easiest` and the
   four of "THE THIN COUNTRY, SEATED"; plan step 31's seventh dispatch,
   2026-09-18). The seat's law is BlockedSeat.tsx's: one stated line in the
   idiom "Not gathered yet: ...", under fifteen words (the cap is the
   component's own constant, fourteen), no figure (a digit in the line would
   be one), a foot naming the requirement by its DATA-REQUIREMENTS item, no
   banned word and no em dash in either, the kicker within PART 7's four
   words. A seat that stands for a drawn card opens under that card's own
   kicker, referenced in copy.ts and never retyped, so the four are held to
   the literal their drawn card prints. Then the four seating conditions,
   counted over the taxonomy from the same builders the view and the stories
   read (no legal form, no peer table, under two credible margins in the
   snapshot, no authored notes), printed so the counts the comments quote are
   measured rather than remembered; each must seat at least one country, or
   the seat has no thin country to stand on and the story would draw nothing.
   The kicker is not held to COPY.banned: "Against the peers" is the table's
   own praised kicker and carries the banned substring by design (the list
   is applied to caveats, heads, notes and doors, never to a kicker). */
{
  const seats = Object.entries(COPY.blocked) as Array<[string, { kicker: string; line: string; foot: string }]>;
  for (const [key, seat] of seats) {
    const words = seat.line.trim().split(/\s+/).filter(Boolean).length;
    if (!seat.line.startsWith("Not gathered yet: ")) reds.push(`seat ${key}: the line is not in the idiom "Not gathered yet: ...": "${seat.line}"`);
    if (words > SEAT_LINE_WORDS_CAP) reds.push(`seat ${key}: the line runs ${words} words, over the cap of ${SEAT_LINE_WORDS_CAP}: "${seat.line}"`);
    if (/\d/.test(seat.line)) reds.push(`seat ${key}: a digit in a line whose law is no figure: "${seat.line}"`);
    if (!/^Waits on DATA-REQUIREMENTS items? \d+/.test(seat.foot)) reds.push(`seat ${key}: the foot does not name a DATA-REQUIREMENTS item: "${seat.foot}"`);
    if (seat.kicker.split(/\s+/).length > 4) reds.push(`seat ${key}: the kicker runs over four words: "${seat.kicker}"`);
    for (const t of [seat.line, seat.foot]) {
      for (const b of COPY.banned) if (t.toLowerCase().includes(b)) reds.push(`seat ${key}: banned word "${b}" in "${t}"`);
      if (/\u2014/.test(t)) reds.push(`seat ${key}: an em dash in "${t}"`);
    }
  }
  const drawnKicker: Record<string, string> = { setup: COPY.tiers.kicker, peers: COPY.peers.kicker, money: COPY.margin.kicker, locals: COPY.locals.kicker };
  for (const [block, kicker] of Object.entries(drawnKicker)) {
    if ((COPY.blocked as Record<string, { kicker: string }>)[block]?.kicker !== kicker) reds.push(`seat ${block}: its kicker is not the drawn card's own ("${kicker}")`);
  }
  const seated: Record<string, number> = { setup: 0, peers: 0, money: 0, locals: 0 };
  for (const iso2 of codes) {
    if (buildSetupRows(iso2).length === 0) seated.setup++;
    if (!buildPeerTable(iso2)) seated.peers++;
    const m = marginCardFromSnapshot(iso2);
    if (!m || m.rows.length < 2) seated.money++;
    if (!buildLocalsNotes(iso2)) seated.locals++;
  }
  for (const [block, n] of Object.entries(seated)) if (n === 0) reds.push(`seat ${block}: no country in the taxonomy takes this seat, so its story has nothing to draw`);
  console.log(`seats: ${seats.length} drawn blocked seats' copy held (one line each under ${SEAT_LINE_WORDS_CAP + 1} words, a foot naming its item); of ${codes.length} countries the thin seats stand on ${seated.setup} (setup), ${seated.peers} (peers), ${seated.money} (money) and ${seated.locals} (locals)`);
}
console.log(`archetype copy: the district ranking's laws held on its fixture; ${cityTermini} city termini; ${rendered} countries render the answer card, ${noAnswer} of them with no regime row (the state word); ${peerTables} peer tables; ${barCards} margin cards with two or more credible rows; ${noteLists} note lists; ${termini} termini against ${ROUTES.length} routes; ${payCards} pay cards, ${payWithheld} withheld; ${howtos} how-to pages; ${reds.length} red(s)`);
for (const r of reds.slice(0, 40)) console.log("  " + r);
if (reds.length) process.exit(1);
