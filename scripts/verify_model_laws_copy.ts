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

type Rule = "BANNED WORDS" | "ROW SENTENCE" | "DISTRICT ADJECTIVE" | "BANNED CONSTRUCTION";
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

/* ------------------------------------------------------------------ *
 * BANNED CONSTRUCTION, added 2026-09-10 after the district card's column
 * head "Times the cheapest" passed every one of this repo's 140 gates and
 * was then struck out by the founder in four words: "What the fuck is
 * time's the cheapest? What, what, what's that sort of wording? It's
 * unnatural."
 *
 * THE BLIND SPOT, DECLARED, because it is the whole reason that string got
 * through: THIS CANNOT TEST WHETHER A PHRASE IS NATURAL ENGLISH, ONLY
 * WHETHER IT MATCHES A KNOWN-BAD SHAPE, SO IT IS A FLOOR AND NOT A
 * SUBSTITUTE FOR READING THE CARD ALOUD.
 *
 * Why the existing instruments could not catch it. `COPY.banned` is a list
 * of literal substrings ("against the", "leverage", ...) and it is applied
 * by verify_archetype_copy.ts to caveats, column heads, notes and doors,
 * never to a kicker; and the two strings this rule finds slip the list
 * anyway, because "Times the cheapest" contains no banned substring and
 * "{dearest} against {cheapest}" carries no "the" between its placeholders.
 * A word list cannot see a SHAPE. These three entries watch shapes.
 *
 * Applied to every kicker, column head and basis line that ships: the
 * static ones walked out of COPY by key, and the composed ones taken from
 * the shipped builders on the same lettered fixtures the rest of this file
 * uses. A static string carrying a `{placeholder}` is SKIPPED here and
 * proven in its composed form instead, so no string is counted twice and
 * what is tested is what a reader actually meets.
 *
 * EACH ENTRY WAS PLANTED INTO COPY AND WATCHED GO RED, 2026-09-10, then
 * removed; a rule nobody has seen fire is a rule nobody knows is wired:
 *   (1) "Against the average"        -> bare comparative
 *   (2) "Rent index" / "London vs Paris rent" / "Rent per capita" /
 *       "Rent multiple by district" / "Rent against the baseline"
 *                                    -> banned term, all five
 *   (3) "Per square metre a year" / "Percent"
 *                                    -> unit without a subject
 * Live, it finds two, both on the district/verdict pair and both real; the
 * baseline records them as the work queue for the rebuild that is blocked
 * on data, not as strings anyone thinks are fine.
 * ------------------------------------------------------------------ */

/** A comparator: the word that sets one thing against another. "per" is
 *  deliberately NOT here: "rent per square metre" is a unit construction, not
 *  a comparison, and entry (3) is the rule that judges it. "per capita" is a
 *  banned term in its own right under entry (2). */
const COMPARATORS = ["times", "against", "versus", "vs", "compared", "relative"];

/** Words that NAME what is being measured, or who is on the other side of a
 *  comparison. A comparator with none of these anywhere in the phrase is a
 *  comparison with nothing to compare: the reader is told the operation and
 *  never the subject. Extend this list when a card names a subject it does
 *  not yet hold; do NOT extend it to quiet a red on a phrase that genuinely
 *  names no subject. */
const SUBJECTS = [
  "rent", "rents", "pay", "wage", "wages", "salary", "salaries", "cost", "costs", "price", "prices",
  "fee", "fees", "tax", "taxes", "margin", "margins", "profit", "revenue", "income", "earnings",
  "spend", "spending", "sales", "takings", "keep", "keeps", "time", "days", "share", "shares",
  "staff", "payroll", "customers", "visitors", "people", "peers", "cities", "city", "districts",
  "district", "countries", "country", "trades", "trade", "shop", "shops", "business", "businesses",
  "premises", "paperwork", "population", "money", "capital", "hours", "week", "living",
];

/** Units and measurement furniture: how a thing is counted, never what. */
const UNITS = [
  "times", "multiple", "multiples", "percent", "pct", "%", "index", "baseline", "score", "points",
  "rate", "ratio", "metre", "metres", "meter", "meters", "square", "sqm", "m2", "usd", "dollars",
  "pounds", "euros", "year", "years", "month", "months", "week", "weeks", "day", "days", "capita",
];

/** Grammar, not content: dropped before asking whether anything is left. */
const FUNCTION_WORDS = ["the", "a", "an", "of", "per", "in", "at", "by", "on", "for", "to", "and", "each", "every", "its"];

/** Literal terms the model bans outright in a head: jargon that names the
 *  machinery instead of the thing (his "furthermore, the label replaces the
 *  number" is the same complaint one step further on). */
const BANNED_TERMS = ["index", "multiple", "multiples", "baseline", "vs", "per capita"];

const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9%\s]/g, " ").split(/\s+/).filter(Boolean);

/** Returns the entry a string trips, or null. First match wins, so one bad
 *  string is one red and the per-rule count stays a count of strings. */
function bannedConstruction(text: string): string | null {
  const w = words(text);
  if (!w.length) return null;
  const lower = text.toLowerCase();

  // (2) BANNED TERM, checked first because it is the most literal.
  for (const term of BANNED_TERMS) {
    const hit = term.includes(" ") ? lower.includes(term) : w.includes(term);
    if (hit) return `a head carrying the banned term "${term}"`;
  }

  // (1) BARE COMPARATIVE: a comparison whose subject never arrives.
  const comparator = w.find((t) => COMPARATORS.includes(t));
  if (comparator && !w.some((t) => SUBJECTS.includes(t))) {
    return `a bare comparative: it sets something "${comparator}" something else and never names what is being compared`;
  }

  // (3) UNIT WITHOUT A SUBJECT: it says how it is counted, never what.
  const content = w.filter((t) => !FUNCTION_WORDS.includes(t));
  if (content.length && content.every((t) => UNITS.includes(t))) {
    return `a head made only of units (${content.join(", ")}); it names how the figure is counted and never what is being counted`;
  }
  return null;
}

/** Every static kicker, column head and basis line in COPY, found by KEY so a
 *  card added later is covered without this list being edited. */
function collectCopyHeads(node: unknown, path: string, out: Array<[string, string]>): void {
  if (typeof node === "string") {
    const leaf = path.split(".").pop() ?? "";
    const parent = path.split(".").slice(-2, -1)[0] ?? "";
    const isHead =
      ["kicker", "basis", "answerLabel", "basisNoTier", "countryBasis"].includes(leaf) ||
      ["phoneHead", "heads", "head", "cols", "columns"].includes(parent);
    if (isHead && !node.includes("{")) out.push([path, node]);
    return;
  }
  if (node && typeof node === "object" && !Array.isArray(node)) {
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) collectCopyHeads(v, path ? `${path}.${k}` : k, out);
  }
}
{
  const heads: Array<[string, string]> = [];
  collectCopyHeads(COPY, "COPY", heads);

  /* The composed heads: the same lettered fixtures used above, so the strings
     that only exist after a placeholder is filled are tested in the form a
     reader meets them. */
  const fixture = { where_to_trade: { list: [{ name: "B", slug: "b", rent_mult: 1.2 }, { name: "A", slug: "a", rent_mult: 0.9 }, { name: "C", slug: "c", rent_mult: 3 }] } };
  const v = cityVerdictFacts(fixture);
  if (v) heads.push(["cityVerdictFacts.kicker", v.kicker], ["cityVerdictFacts.answer.label", v.answer.label], ["cityVerdictFacts.answer.basis", v.answer.basis]);
  const bars = buildCityDistrictBars(fixture);
  if (bars) heads.push(["buildCityDistrictBars.basis", bars.basis]);

  for (const [where, text] of heads) {
    const why = bannedConstruction(text);
    if (why) pushRed("BANNED CONSTRUCTION", `${where}: "${text}" is ${why}`);
  }
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
const RULES: Rule[] = ["BANNED WORDS", "ROW SENTENCE", "DISTRICT ADJECTIVE", "BANNED CONSTRUCTION"];
const counts: Record<Rule, number> = { "BANNED WORDS": 0, "ROW SENTENCE": 0, "DISTRICT ADJECTIVE": 0, "BANNED CONSTRUCTION": 0 };
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
    /* A RULE WITH NO STORED ENTRY IS BEING SEEDED, NOT RAISED (2026-09-10).
       `existing[r] ?? 0` read a brand-new rule key as a stored zero, so
       adding BANNED CONSTRUCTION to this gate was refused as an attempt to
       raise a baseline from 0 to 2, and there was no way to add a fourth
       rule to this file at all. The guard's purpose is that a rule ALREADY
       ON THE BOOKS may only come down; a rule that has never been counted
       has nothing to come down from. The two are distinguished explicitly
       now rather than collapsed by a nullish default, and the seeding of a
       new rule is announced rather than done quietly. */
    const seeded = RULES.filter((r) => existing[r] === undefined);
    for (const r of seeded) console.log(`  seeding a rule never counted before: ${r} = ${counts[r]}`);
    const raised = RULES.filter((r) => existing[r] !== undefined && counts[r] > (existing[r] as number));
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
