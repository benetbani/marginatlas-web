/**
 * verify_model_laws_copy , the browser-free, database-free third of the
 * model's twelve laws (task 4, 2026-09-08): BANNED WORDS, ROW SENTENCE and
 * DISTRICT ADJECTIVE, the three PART 8.5 clauses that are pure copy/data
 * facts, so they sit in the prebuild chain beside `archetype-copy` (no
 * network, no browser, no database). The other nine of the twelve need a
 * rendered page and live in `scripts/harness/check_model_laws.mjs`, run by
 * hand as `npm run harness:laws`, never in the chain.
 *
 * WHAT CAN AND CANNOT RUN HERE. A country-level builder (buildHeroFacts,
 * buildPeerTable, getCountryRates, ...) reads local, static tables and needs
 * neither a browser nor a database, which is why `archetype-copy` already
 * loops every country. A city-level builder (buildCityDistrictBars,
 * buildCityPeerTable, cityVerdictFacts) takes a SEED object a live per-city
 * adapter builds, and that adapter DOES hit the database
 * (render_page.tsx's own comment: "the render needs the database for the
 * money card"), so this file never calls one with a real city's live seed.
 * It calls each with a synthetic, lettered fixture instead, exactly the
 * pattern verify_archetype_copy.ts already uses for its own city-level
 * tests ("THE CITY VERDICT CARD", "THE DISTRICT RANKING"): the LAW is
 * proven on the real, shipped function; the DATA is invented and lettered,
 * never a real place.
 *
 * WHAT THIS FOUND, live in the repo today, recorded in the task 4 report and
 * left alone here (this task's subject is the instrument, not the pages):
 *  - `buildCityDistrictBars` attaches a district's `character` field as
 *    `note` whenever the source data holds one (district_rows.ts), and
 *    RankedBars.tsx prints that note as free text beside the district's
 *    name. DISTRICT ADJECTIVE bans this with no exception.
 *  - `cityVerdictFacts`'s own city-average cell is a literal "x1.00"
 *    (verify_archetype_copy.ts's own fixture test asserts this as the
 *    CORRECT reading today); BANNED WORDS bans "x1.00" as a whole cell.
 *  - `COPY.cityVerdict.cells.averageNote` is the literal string
 *    "the baseline". BANNED WORDS bans "baseline" as a whole cell; this
 *    checker strips a leading "the "/"a " before comparing, so "the
 *    baseline" matches.
 *  - Five of the twelve spectra poles in `COPY.character.people.rows` run
 *    past three words: open.right "Quick to include you", innovation.left
 *    "The old way rules", direct.left "Read between the lines", direct.right
 *    "Said to your face", straight.right "A word is kept". ROW SENTENCE caps
 *    a pole at three words or 24 characters.
 *  - `buildCityPeerTable`'s "index"/"pctdiff" columns print "same"
 *    (CompareTable.tsx's fmt()) for ANY non-home row whose value ties the
 *    home row's exactly. Proven here on a synthetic tie; whether today's
 *    LIVE data for any real city actually holds one is unknowable without
 *    the database this gate must not touch, which is stated rather than
 *    guessed at.
 *    RETIRED task 9 (2026-09-10): his ruling of 2026-09-07 ("you just say you
 *    mention the word same. That's a major mistake") deleted the index/pctdiff
 *    units themselves (peer_rows.ts, CompareTable.tsx) along with
 *    COPY.cityPeers.same, so this finding no longer exists to find; see the
 *    retirement comment lower in this file where the proof used to sit.
 *
 * NOT CHECKED HERE, stated rather than silently skipped:
 *  - Hero fact cell labels (buildHeroFacts): PART 9 rule 9 caps THOSE at
 *    four words, a different, already-gated cap (`archetype-copy`'s own
 *    LABELS check), not ROW SENTENCE's three; running the three-word cap on
 *    them would fail a label the model does not ban.
 *  - PART 8.5's fuller BANNED WORDS clause also names "any country name
 *    inside a chart's furniture." Step 2 of the task 4 brief narrows BANNED
 *    WORDS to four literal phrases; this file (and check_model_laws.mjs)
 *    both implement that narrower, concrete spec, not the fuller prose.
 *  - `COPY.cityVerdict.cells.average`, "City average": PART 9 rule 17 also
 *    bans "the city average" as a value, but it is not one of Step 2's four
 *    literal phrases, so it is not checked here either.
 *
 * A RATCHET, NOT A BLOCKER (DEBUG.md section 7): a check built before the
 * cards ship sees a standing backlog the moment it can see anything, and
 * that backlog is the work queue, not a reason to fail every build from
 * here on. This gate's first run found the twelve above, all real, none
 * fixed by this task (task 4's subject is the instrument). The same
 * convention already used for `verify_full_width_sitewide.mjs` and the flag
 * gate applies here, taken further (IMPORTANT 4, review fix wave 2026-09-08):
 * the baseline used to be a single `{total, date}` number, which let one
 * fixed pole and one new banned cell net to the same total and pass
 * silently, the exact blind spot `fullwidth_baseline.json` already avoids by
 * being a per-key map. `scripts/model_laws_copy_baseline.json` is now a
 * per-rule map, `{"BANNED WORDS": n, "ROW SENTENCE": n,
 * "DISTRICT ADJECTIVE": n}`, compared key by key; a rule's count rising
 * above its own stored number fails even if the total held or fell. No date
 * field: `--write-baseline` used to hardcode a literal date string, which
 * would have recorded a false date on every later re-seed; the other
 * per-key baselines (`fullwidth_baseline.json`, `flags_baseline.json`) carry
 * no date either, so this file now matches that shape rather than inventing
 * one. `--write-baseline` also refuses to WRITE a baseline that raises any
 * rule's stored count: the baseline may only come down, and that is now
 * enforced at the point where it could be broken, not just stated in prose.
 */
import { COPY } from "@/lib/spine/copy";
import { buildCityDistrictBars } from "@/lib/spine/district_rows";
import { cityVerdictFacts } from "@/lib/spine/city_verdict_facts";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

type Rule = "BANNED WORDS" | "ROW SENTENCE" | "DISTRICT ADJECTIVE";
const reds: { rule: Rule; text: string }[] = [];
const pushRed = (rule: Rule, text: string) => reds.push({ rule, text });

const BANNED = ["same", "baseline", "x1.00", "world's highest"];
const stripArticle = (s: string) => s.toLowerCase().replace(/^(the|a)\s+/, "");
function checkBannedCell(where: string, text: string | null | undefined) {
  if (text == null) return;
  const norm = stripArticle(text.trim());
  if (BANNED.includes(norm)) pushRed("BANNED WORDS", `${where}: a whole cell reading "${text}", banned`);
}

/* BANNED WORDS, on static COPY strings that print as a whole cell or note.
   `COPY.cityVerdict.cells.averageNote` used to be read here and was this
   gate's one direct finding: it read "the baseline", the note under a cell
   whose value was the number 1. Task 13 (2026-09-10) deleted the cell and the
   note with it, on his ruling, so there is no static string left on this card
   that prints as a whole cell; every cell's text is composed now and is
   proven clean by the fixture sweep directly below, which is the stronger
   check of the two anyway. */
for (const [key, text] of Object.entries(COPY.cityVerdict.cells)) checkBannedCell(`COPY.cityVerdict.cells.${key}`, text);

/* BANNED WORDS, on the shipped city-verdict builder against a synthetic,
   lettered fixture, the same one verify_archetype_copy.ts's own "THE CITY
   VERDICT CARD" test uses. */
{
  const fixture = { where_to_trade: { list: [{ name: "B", rent_mult: 1.2 }, { name: "A", rent_mult: 0.9 }, { name: "C", rent_mult: 3 }] } };
  const v = cityVerdictFacts(fixture);
  if (v) {
    for (const c of v.cells) { checkBannedCell(`cityVerdictFacts.cells[${c.label}]`, String(c.value)); checkBannedCell(`cityVerdictFacts.cells[${c.label}].note`, c.note); }
    checkBannedCell("cityVerdictFacts.answer", v.answer.value);
  }
}

/* DISTRICT ADJECTIVE, on the shipped district-ranking builder against a
   synthetic, lettered fixture: "No adjective, no tag word, no one-word
   summary ... tagLabel() stops feeding district notes and nothing replaces
   it" (PART 5). Zero tolerance: any row carrying a note is a fault. */
{
  const fixture = { where_to_trade: { list: [{ name: "B", slug: "b", rent_mult: 1.2, character: "Q" }, { name: "A", slug: "a", rent_mult: 0.9, character: "R" }, { name: "C", slug: "c", rent_mult: 3, character: "S" }] } };
  const b = buildCityDistrictBars(fixture);
  if (b) for (const r of b.rows) if (r.note) pushRed("DISTRICT ADJECTIVE", `buildCityDistrictBars: district "${r.name}" carries the free-text note "${r.note}"`);
}

/* BANNED WORDS, a reachability proof on the shipped city-peers builder,
   RETIRED task 9 (2026-09-10), not left in place to reference deleted
   symbols. It used to prove that a non-home row tied exactly to the home row
   on an index/pctdiff column printed the word "same" (CompareTable.tsx's old
   fmt()). His ruling of 2026-09-07 removed the mechanism this watched: the
   index/pctdiff units are gone from PeerColumn and CompareColumn
   (peer_rows.ts, CompareTable.tsx now type only "pct" | "usd" | "days" | "m"),
   and COPY.cityPeers.same is gone with them, so a tied peer now prints its
   own absolute figure like any other row and there is no branch left that
   can print a bare word. Kept as history in the header comment above, not
   as running code that would fail tsc against types that no longer exist. */

/* ROW SENTENCE, on the spectra poles: "a spectra pole over three words or 24
   characters is a copy fault" (PART 8.5); "three words and 24 characters
   maximum" (PART 5). Static COPY text: the pole pairs are the same for
   every country, so no country loop is needed. */
let poleCount = 0;
for (const table of [COPY.character.state.rows, COPY.character.people.rows]) {
  for (const [key, row] of Object.entries(table)) {
    for (const side of ["left", "right"] as const) {
      const t = (row as { left: string; right: string })[side];
      poleCount++;
      const words = t.trim().split(/\s+/).filter(Boolean);
      if (words.length > 3 || t.length > 24) pushRed("ROW SENTENCE", `COPY pole ${key}.${side}: "${t}" is ${words.length} words, ${t.length} characters, over the 3-word/24-character cap`);
    }
  }
}

/* ROW SENTENCE, on row labels outside the hero (PayBars, the two RankedBars
   phone heads): "a label over three words ... is a copy fault." Hero fact
   cell labels are deliberately excluded; see the header comment. */
const rowLabels: Array<[string, string]> = [
  ["COPY.pay.minimum", COPY.pay.minimum],
  ["COPY.pay.average", COPY.pay.average],
  ["COPY.margin.phoneHead.trade", COPY.margin.phoneHead.trade],
  ["COPY.margin.phoneHead.value", COPY.margin.phoneHead.value],
  ["COPY.cityDistricts.phoneHead.name", COPY.cityDistricts.phoneHead.name],
  ["COPY.cityDistricts.phoneHead.value", COPY.cityDistricts.phoneHead.value],
];
for (const [where, t] of rowLabels) {
  const words = t.trim().split(/\s+/).filter(Boolean);
  if (words.length > 3) pushRed("ROW SENTENCE", `${where}: "${t}" is a label of ${words.length} words, over three`);
}

console.log(`model laws (copy): ${reds.length} red(s) across ${poleCount} spectra poles, ${rowLabels.length} row labels, the city-verdict and city-district builders on a synthetic fixture, and the city-peers "same" reachability proof`);
for (const r of reds.slice(0, 60)) console.log(`  ${r.text}`);

/* THE RATCHET (IMPORTANT 4 fix, review fix wave 2026-09-08). Per-rule counts,
   compared per key, the same shape `fullwidth_baseline.json` and
   `flags_baseline.json` already use for `verify_full_width_sitewide.mjs`: a
   single total let one fixed pole and one new banned cell net to the same
   number and pass silently, which a per-key comparison cannot do. No date
   field, matching those two files: a hardcoded literal date would go false
   the moment this is re-seeded on a later day. */
const RULES: Rule[] = ["BANNED WORDS", "ROW SENTENCE", "DISTRICT ADJECTIVE"];
const counts: Record<Rule, number> = { "BANNED WORDS": 0, "ROW SENTENCE": 0, "DISTRICT ADJECTIVE": 0 };
for (const r of reds) counts[r.rule]++;
const BASELINE_PATH = "scripts/model_laws_copy_baseline.json";
/* A pre-migration file (`{total, date}`, the shape this gate used before the
   review fix wave) carries none of the three rule keys; read as a per-rule
   map it would silently default every rule to 0, which would score the
   one-time migration to per-rule counts as a raise from zero rather than as
   the same backlog re-shaped. Treated as absent instead, so the first
   `--write-baseline` after this change seeds the new shape rather than being
   refused. */
const readBaseline = (): Partial<Record<Rule, number>> | null => {
  if (!existsSync(BASELINE_PATH)) return null;
  let parsed: unknown;
  try { parsed = JSON.parse(readFileSync(BASELINE_PATH, "utf8")); } catch { return null; }
  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Record<string, unknown>;
  if (!RULES.some((r) => typeof obj[r] === "number")) return null;
  return obj as Partial<Record<Rule, number>>;
};
if (process.argv.includes("--write-baseline")) {
  const existing = readBaseline();
  /* REFUSE TO WRITE A BASELINE HIGHER THAN THE STORED ONE. The old code
     wrote whatever the live run counted, in either direction, which is what
     let "the baseline may only come down" be true in prose and false in
     code. */
  if (existing) {
    const raised = RULES.filter((r) => counts[r] > (existing[r] ?? 0));
    if (raised.length) {
      console.error(`x model-laws-copy: refusing to write a baseline that RAISES a rule's count above what is already stored. A baseline may only come down.`);
      for (const r of raised) console.error(`     ${r}: ${existing[r] ?? 0} -> ${counts[r]}`);
      process.exit(1);
    }
  }
  writeFileSync(BASELINE_PATH, JSON.stringify(counts, null, 2) + "\n");
  console.log(`  wrote ${BASELINE_PATH}: ${JSON.stringify(counts)}`);
  process.exit(0);
}
const baseline = readBaseline();
if (!baseline) {
  console.error(`x model-laws-copy: no baseline at ${BASELINE_PATH}. Seed it once with --write-baseline.`);
  process.exit(1);
}
const grew = RULES.filter((r) => counts[r] > (baseline[r] ?? 0));
if (grew.length) {
  console.log(`x model-laws-copy: a rule's count GREW above its own baseline (per-key, not a single total, so one fix cannot mask one new fault).`);
  for (const r of grew) console.log(`     ${r}: ${baseline[r] ?? 0} -> ${counts[r]}`);
  process.exit(1);
}
const total = RULES.reduce((a, r) => a + counts[r], 0);
console.log(`PASS model-laws-copy (ratchet): ${total} red(s) (${RULES.map((r) => `${r} ${counts[r]}`).join(", ")}); the findings above are a work queue for a later run, not a build blocker.`);
