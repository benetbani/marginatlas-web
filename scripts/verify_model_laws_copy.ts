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
 * WHAT THIS FOUND, live in the repo on 2026-09-08, recorded in the task 4
 * report and left alone then (that task's subject was the instrument, not
 * the pages). The city verdict card named twice below, and its builder
 * `cityVerdictFacts`, were RETIRED on plan step 32 (2026-09-18: MODEL.md 8.3
 * dissolves the rent verdict into the masthead's answer), so those two
 * entries are history:
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
import { buildCityDistrictBars, countWord } from "@/lib/spine/district_rows";
import { buildMarkList } from "@/lib/spine/mark_list_rows";
import { buildCityDemand, buildCityLiving, buildCityRunway, buildCitySeason } from "@/lib/spine/fact_rows";
import { buildCityPeopleTable } from "@/lib/spine/character_rows";
import { buildCityNeighbourhoods } from "@/lib/spine/hood_rows";
import { spineHoodCities, spineHoodDistricts } from "@/lib/spine/hood_scheme";
import { buildHoodTake } from "@/lib/spine/hood_take_rows";
import { buildHoodRank } from "@/lib/spine/hood_rank_rows";
import { buildHoodPremium } from "@/lib/spine/hood_premium_rows";
import { buildHoodCompare } from "@/lib/spine/hood_compare_rows";
import { buildHoodCharacter } from "@/lib/spine/hood_character_rows";
import { buildHoodCloseDoors } from "@/lib/spine/close_rows";
import { buildCityEarningsStrip } from "@/lib/spine/range_rows";
import { cityTypicalIncome } from "@/lib/spine/city_income";
import { buildGlance } from "@/lib/spine/glance_rows";
import { buildWorldSeat } from "@/lib/spine/world_seat_rows";
import { buildCityGlance } from "@/lib/spine/city_glance_rows";
import { buildSuits } from "@/lib/spine/suits_rows";
import { buildTradeSpread } from "@/lib/spine/trade_spread_rows";
import { tradeHeroFacts } from "@/lib/spine/trade_hero_facts";
import { resolveTradeNet } from "@/lib/spine/trade_net";
import { buildPermits } from "@/lib/spine/permits_rows";
import { buildOpen } from "@/lib/spine/open_rows";
import { buildTradePeers } from "@/lib/spine/trade_peer_rows";
import { buildClears } from "@/lib/spine/clears_rows";
import { buildLasts } from "@/lib/spine/lasts_rows";
import { buildMix } from "@/lib/spine/mix_rows";
import { buildMarket, MARKET_CELLS } from "@/lib/spine/market_rows";
import { buildRivals } from "@/lib/spine/rivals_rows";
import { buildWorth } from "@/lib/spine/worth_rows";
import { industryHeroFacts } from "@/lib/spine/industry_hero_facts";
import { buildIndustrySplit } from "@/lib/spine/split_rows";
import { buildIndustryOpen } from "@/lib/spine/industry_open_rows";
import { buildPays, PAYS_CELLS } from "@/lib/spine/pays_rows";
import { buildFormats, FORMAT_NAME_FITS } from "@/lib/spine/formats_rows";
import { MAJOR_CITIES } from "@/lib/markets/major_cities";
import { buildBenchmark } from "@/lib/spine/benchmark_rows";
import { buildKnow } from "@/lib/spine/know_rows";
import { buildIndustryCloseDoors } from "@/lib/spine/close_rows";
import { ALL_INDUSTRIES } from "@/lib/taxonomy";
import { readdirSync } from "node:fs";
import { buildCitySeat } from "@/lib/spine/city_seat_rows";
import { buildPremisesBento } from "@/lib/spine/premises_bento_rows";
import { buildEntryBill } from "@/lib/spine/entry_bill_rows";
import { buildRunningCosts } from "@/lib/spine/running_costs_rows";
import { placementSentence } from "@/lib/spine/placement";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import cityListJson from "../data/cities/city_list_v1.json";

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

/* BANNED WORDS on the city verdict card, static and composed, LEFT WITH THE
   CARD (plan step 32, 2026-09-18): this gate's one direct finding was that
   card's "the baseline" cell (task 13 deleted the cell), and its composed
   sweep ran the verdict builder on a lettered fixture; MODEL.md 8.3
   dissolves the verdict into the masthead's answer and the builder is
   deleted, so there is nothing here to read. The district card's composed
   strings are still swept below. */

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
   cell labels are deliberately excluded; see the header comment.

   THIS INSTRUMENT'S BLIND SPOT, and it is load-bearing for one entry:
   it counts the words of the STATIC string, so a `{placeholder}` counts as
   one word whatever it is filled with. `COPY.cityDistricts.phoneHead.value`
   is "Rent, against {district}", three words here and FOUR on the page
   ("Rent, against South London"), or five for a district whose name is three
   words. That is not the check failing to notice: it is THE MODEL'S ONE
   RECORDED EXCEPTION to the three-word cap (MODEL.md PART 5, district rows),
   because a head that names the district its figures are measured against
   cannot be shorter than the name, and the alternative the founder struck out
   on 2026-09-10 was the short head that named nothing ("Times the cheapest").
   The cap still binds everything around the placeholder: put a fourth word of
   your own in this string and it reds here, today. */
const rowLabels: Array<[string, string]> = [
  ["COPY.pay.minimum", COPY.pay.minimum],
  ["COPY.pay.average", COPY.pay.average],
  ["COPY.margin.phoneHead.trade", COPY.margin.phoneHead.trade],
  ["COPY.margin.phoneHead.value", COPY.margin.phoneHead.value],
  ["COPY.cityDistricts.phoneHead.name", COPY.cityDistricts.phoneHead.name],
  ["COPY.cityDistricts.phoneHead.value", COPY.cityDistricts.phoneHead.value],
  /* THE MARK LIST'S COLUMN HEADS (B3, 2026-09-10). Its unit is said once, in
     the value head, so these are the strings a reader meets over its figures,
     and the three-word cap binds them exactly as it binds the pay bars' and
     the money card's. None of them carries a placeholder, so unlike the
     district head there is no exception to record here. */
  ["COPY.markList.pay.head.name", COPY.markList.pay.head.name],
  ["COPY.markList.pay.head.value", COPY.markList.pay.head.value],
  ["COPY.markList.visitors.head.name", COPY.markList.visitors.head.name],
  ["COPY.markList.visitors.head.value", COPY.markList.visitors.head.value],
  ["COPY.markList.trade.head.name", COPY.markList.trade.head.name],
  ["COPY.markList.trade.head.value", COPY.markList.trade.head.value],
  /* THE QUESTION LIST'S LABELS (MODEL.md 8.2 `18 checks`, plan step 31's
     fifth dispatch, 2026-09-18): the three labels a reader meets over the
     questions, on NoteList's law, held to the same three words as every row
     label (PART 5). The questions under them are not labels and are held by
     verify_archetype_copy.ts to the bank and the 220 ceiling. */
  ["COPY.checks.rows.price.label", COPY.checks.rows.price.label],
  ["COPY.checks.rows.margin.label", COPY.checks.rows.margin.label],
  ["COPY.checks.rows.wait.label", COPY.checks.rows.wait.label],
  /* THE COST TO OPEN'S TWO HEADS (MODEL.md 8.6 `04 open`, plan step 33's
     second dispatch, 2026-09-18): the line's name and its cost, over the
     RankedBars table of the bill's lines, held to the same three words. */
  ["COPY.tradeOpen.phoneHead.name", COPY.tradeOpen.phoneHead.name],
  ["COPY.tradeOpen.phoneHead.value", COPY.tradeOpen.phoneHead.value],
  /* THE SPLIT'S LEGEND LABELS (MODEL.md 8.6 `05 split`, plan step 33's third
     dispatch, 2026-09-18): the copy table's short form of every held driver
     name that runs past three words, each a row label a reader meets beside
     a share, held to the same three words; and the plus's two row labels. */
  ...Object.entries(COPY.tradeSplit.lineLabels).map(([name, short]) => [`COPY.tradeSplit.lineLabels["${name}"]`, short] as [string, string]),
  ["COPY.tradeSplit.detail.fixed", COPY.tradeSplit.detail.fixed],
  ["COPY.tradeSplit.detail.variable", COPY.tradeSplit.detail.variable],
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
  /* "places" joined 2026-09-18 (plan step 33's fourth dispatch): the trade
     page's peers table names the other side of its comparison as "other
     places" (MODEL.md 8.6 `07 peers`, M12: states or cities in one country),
     the same subject the city's "other cities" and the country's "the peers"
     name; a card naming a subject this list did not yet hold, the extension
     the note above allows, not a red quieted. */
  "places", "place",
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
  const bars = buildCityDistrictBars(fixture);
  /* THE COLUMN HEAD IS COMPOSED NOW, AND THIS RULE EXISTS BECAUSE OF IT.
     "Times the cheapest" was a STATIC `COPY.cityDistricts.phoneHead.value`
     when the founder struck it out, so the static sweep above saw it. Task 14
     (2026-09-10) rewrote it as "Rent, against {district}", filled from the
     data so no place name is ever typed, and a string carrying a placeholder
     is skipped by `collectCopyHeads` by design. Pushed here in its composed
     form, or this rule would go quiet about the exact string it was written
     for , the failure mode of every gate that watches a shape instead of a
     location. */
  if (bars) heads.push(["buildCityDistrictBars.basis", bars.basis], ["buildCityDistrictBars.phoneHead.value", bars.phoneHead.value], ["buildCityDistrictBars.phoneHead.name", bars.phoneHead.name]);

  /* THE MARK LIST'S COMPOSED STRINGS (B3, 2026-09-10), pushed for the same
     reason the district head above is: its basis line counts its own rows and
     names the size of its set, so it carries a `{n}` and a `{universe}` and is
     SKIPPED by the static sweep by design, and the trade card's kicker names
     the trade beside the metric, so that one is composed too. A rule that
     watches a shape has to be handed the string a reader actually meets or it
     goes quiet about exactly the strings it was written for. These come off
     the shipped builder reading the real, local files, no browser and no
     database, the same way this gate already reads the district builder. */
  for (const key of ["cities:pay", "cities:visitors", "trade:auto_repair_shops"]) {
    const d = buildMarkList(key);
    if (!d) continue;
    heads.push([`buildMarkList(${key}).kicker`, d.kicker], [`buildMarkList(${key}).basis`, d.basis], [`buildMarkList(${key}).middleLabel`, d.middleLabel]);
  }

  /* THE CITY FACT BANK'S THREE CARDS (2026-09-17, CITY-PROGRAMME step 1a),
     pushed composed for the same reason. The spend's basis gains a clause
     naming the city where the figure is a placeholder (London), so the
     static sweep skips it by design; Frankfurt is held (the bare basis). The
     two KvGrid seats (MODEL.md 8.3 `05 living` and `06 runway`; plan step
     32's third dispatch, 2026-09-18) push their labels, basis, foot and
     withheld line composed, over the shapes a city can take: the exemplar
     (every cell held, no foot), Abidjan (the living card held; the share
     withheld for standing over 100, the income alone under the line) and
     the first modelled city off the builder (every cell modelled, the foot
     naming all four, and the share's foot naming both inputs). All come off
     the shipped builders reading the city list and the local bank files, no
     browser, no database. */
  /* THE SPEND CARD AND THE EARNINGS STRIP (MODEL.md 8.3 `08 demand` and `07
     earnings`; plan step 32's fourth dispatch, 2026-09-18), composed the same
     way: the spend's basis, foot and withheld line over the exemplar (the
     placeholder withheld with its line naming London), Frankfurt (modelled,
     the foot) and the first held city off the builder; the strip's basis and
     note over the exemplar (the three marks), Abidjan (no deciles), the first
     city whose typical falls outside its country's deciles and the first
     modelled one; and the masthead's answer basis off the one income builder
     for the same cities (the country-naming basis is a template and the
     static sweep skips it by design). */
  {
    const slugs = (cityListJson as { cities: Array<{ slug: string }> }).cities.map((c) => c.slug).sort();
    const heldSpend = slugs.find((s) => buildCityDemand(s)?.tag === "held");
    for (const slug of ["london", "frankfurt", ...(heldSpend ? [heldSpend] : [])]) {
      const spend = buildCityDemand(slug);
      if (!spend) continue;
      if (spend.basis) heads.push([`buildCityDemand(${slug}).basis`, spend.basis]);
      if (spend.foot) heads.push([`buildCityDemand(${slug}).foot`, spend.foot]);
      if (spend.withheld) heads.push([`buildCityDemand(${slug}).withheld`, spend.withheld]);
    }
    const outside = slugs.find((s) => buildCityEarningsStrip(s)?.figures.outside);
    const modelledPay = slugs.find((s) => cityTypicalIncome(s)?.sample);
    for (const slug of ["london", "abidjan", ...(outside ? [outside] : []), ...(modelledPay ? [modelledPay] : [])]) {
      const strip = buildCityEarningsStrip(slug);
      if (strip) {
        heads.push([`buildCityEarningsStrip(${slug}).basis`, strip.basis]);
        if (strip.note) heads.push([`buildCityEarningsStrip(${slug}).note`, strip.note]);
        for (const m of strip.marks) heads.push([`buildCityEarningsStrip(${slug}).marks.${m.key}`, m.label]);
      }
      const typical = cityTypicalIncome(slug);
      if (typical && typical.from === "city") heads.push([`cityTypicalIncome(${slug}).answerBasis`, typical.sample ? COPY.cityHero.answerBasisModelled : COPY.cityHero.answerBasis]);
    }
    for (const line of Object.values(COPY.cityDemand.withheld)) heads.push(["COPY.cityDemand.withheld", line]);
    heads.push(["COPY.cityDemand.footModelled", COPY.cityDemand.footModelled], ["COPY.cityCustomers.basisAlone", COPY.cityCustomers.basisAlone], ["COPY.cityCustomers.noSpread", COPY.cityCustomers.noSpread], ["COPY.cityCustomers.outside", COPY.cityCustomers.outside], ["COPY.cityCustomers.modelled", COPY.cityCustomers.modelled], ["COPY.cityHero.answerBasisModelled", COPY.cityHero.answerBasisModelled]);
  }
  {
    const modelledCity = (cityListJson as { cities: Array<{ slug: string }> }).cities.map((c) => c.slug).sort().find((s) => buildCityLiving(s)?.confidence === "modeled");
    for (const slug of ["london", "frankfurt", "abidjan", ...(modelledCity ? [modelledCity] : [])]) {
      const living = buildCityLiving(slug);
      if (living) {
        for (const c of living.cells) heads.push([`buildCityLiving(${slug}).cells.${c.key}`, c.label]);
        heads.push([`buildCityLiving(${slug}).basis`, living.basis]);
        if (living.foot) heads.push([`buildCityLiving(${slug}).foot`, living.foot]);
        if (living.withheld) heads.push([`buildCityLiving(${slug}).withheld`, living.withheld]);
      }
      const runway = buildCityRunway(slug);
      if (runway) {
        for (const c of runway.cells) heads.push([`buildCityRunway(${slug}).cells.${c.key}`, c.label]);
        heads.push([`buildCityRunway(${slug}).basis`, runway.basis]);
        if (runway.foot) heads.push([`buildCityRunway(${slug}).foot`, runway.foot]);
        if (runway.withheld) heads.push([`buildCityRunway(${slug}).withheld`, runway.withheld]);
      }
    }
    for (const line of Object.values(COPY.cityLiving.reasons)) heads.push(["COPY.cityLiving.reasons", line]);
    for (const line of Object.values(COPY.cityRunway.withheld)) heads.push(["COPY.cityRunway.withheld", line]);
  }

  /* TURN THREE OF THE CITY PAGE (MODEL.md 8.3 `12` to `15`; plan step 32's
     sixth dispatch, 2026-09-18), pushed composed: the people table's basis
     in its three shapes (New York all its own, London mixed, Frankfurt the
     country's), the season pair's basis and both feet (Paris held, Frankfurt
     modelled off the shard, London off the slope) and its two withheld lines
     (reachable by the builder's shape and by no city today, so pushed from
     the copy table), the neighbourhoods pager's foot and "all" link (London)
     and the seat's line naming the city (Frankfurt), and the seats' foot. */
  for (const slug of ["london", "new-york", "frankfurt", "paris", "abidjan"]) {
    const p = buildCityPeopleTable(slug);
    if (p) heads.push([`buildCityPeopleTable(${slug}).basis`, p.basis]);
    const se = buildCitySeason(slug);
    if (se) {
      if (se.basis) heads.push([`buildCitySeason(${slug}).basis`, se.basis]);
      if (se.foot) heads.push([`buildCitySeason(${slug}).foot`, se.foot]);
      if (se.withheld) heads.push([`buildCitySeason(${slug}).withheld`, se.withheld]);
    }
    const h = buildCityNeighbourhoods(slug);
    if (h?.foot) heads.push([`buildCityNeighbourhoods(${slug}).foot`, h.foot]);
    if (h?.seatLine) heads.push([`buildCityNeighbourhoods(${slug}).seatLine`, h.seatLine]);
  }
  for (const line of Object.values(COPY.citySeason.withheld)) heads.push(["COPY.citySeason.withheld", line]);
  heads.push(["COPY.citySeason.footModelled", COPY.citySeason.footModelled], ["COPY.citySeason.footSlope", COPY.citySeason.footSlope], ["COPY.cityNeighbourhoods.allLabel", COPY.cityNeighbourhoods.allLabel], ["COPY.blocked.cityNeighbourhoods.foot", COPY.blocked.cityNeighbourhoods.foot], ["COPY.blocked.locals.line", COPY.blocked.locals.line]);

  /* THE COUNTRY'S TWO KvGrid SEATS (MODEL.md 8.2 `01 glance` and `02
     world-seat`, plan step 31's second dispatch, 2026-09-17), pushed composed
     for the same reason: the glance's basis is joined from the units of the
     cells it prints, its foot carries the snapshot's year and a list of the
     modelled cells, and its withheld line a count and joined reasons, so all
     three are skipped by the static sweep by design. Three countries cover
     the shapes: the exemplar (every cell), Yemen (the GDP from the profile,
     the two-name modelled foot, two withheld) and Cuba (the GDP alone, four
     withheld, no basis). Both builders read local files only. */
  for (const iso2 of ["GB", "YE", "CU"]) {
    const g = buildGlance(iso2);
    if (g) {
      if (g.basis) heads.push([`buildGlance(${iso2}).basis`, g.basis]);
      if (g.foot) heads.push([`buildGlance(${iso2}).foot`, g.foot]);
      if (g.withheld) heads.push([`buildGlance(${iso2}).withheld`, g.withheld]);
    }
    const s = buildWorldSeat(iso2);
    if (s) heads.push([`buildWorldSeat(${iso2}).basis`, s.basis], [`buildWorldSeat(${iso2}).foot`, s.foot], [`buildWorldSeat(${iso2}).withheld`, s.withheld]);
  }

  /* THE CITY'S TWO KvGrid SEATS (MODEL.md 8.3 `01 glance` and `02
     among-cities`, plan step 32's first dispatch, 2026-09-18), pushed
     composed for the same reason as the country's: the glance's basis is
     joined from the units of the cells it prints, its foot lists the
     modelled cells and its withheld line a count and joined reasons; the
     seat's basis is joined from its two units and its foot from the
     modelled clauses and the placement sentence. Three cities cover the
     shapes: the exemplar (three cells, one modelled), Frankfurt (the visitor
     count withheld as the country's, two withheld) and Abidjan (the visitor
     count not on file, every cell held, no foot). Both builders read the
     city list and the city shard only. */
  for (const slug of ["london", "frankfurt", "abidjan"]) {
    const g = buildCityGlance(slug);
    if (g) {
      if (g.basis) heads.push([`buildCityGlance(${slug}).basis`, g.basis]);
      if (g.foot) heads.push([`buildCityGlance(${slug}).foot`, g.foot]);
      if (g.withheld) heads.push([`buildCityGlance(${slug}).withheld`, g.withheld]);
    }
    const s = buildCitySeat(slug);
    if (s) heads.push([`buildCitySeat(${slug}).basis`, s.basis], [`buildCitySeat(${slug}).foot`, s.foot]);
  }

  /* THE PREMISES BENTO (MODEL.md 8.3 `04 premises`, plan step 32's second
     dispatch, 2026-09-18), pushed by name and composed: its four openers sit
     under `kickers.*` and its basis clauses under `basis.*`, leaves the static
     sweep does not read (it reads a leaf named `kicker` or `basis`), and the
     lines a reader meets are composed (the count's rate filled in, the
     modelled clause joined on) so they come off the builder. Three cities
     cover the shapes: the exemplar (every figure held, the count rounded),
     Frankfurt (held, a whole rate, no rounding clause) and Abidjan (every
     figure modelled, the clause on all four lines). The five withheld lines
     are pushed from COPY, since no city takes them today. */
  for (const k of Object.values(COPY.premisesBento.kickers)) heads.push(["COPY.premisesBento.kickers", k]);
  for (const line of Object.values(COPY.premisesBento.withheld)) heads.push(["COPY.premisesBento.withheld", line]);
  for (const slug of ["london", "frankfurt", "abidjan"]) {
    const d = buildPremisesBento(slug);
    if (!d) continue;
    for (const [name, cell] of [["rent", d.rent], ["fitOut", d.fitOut], ["deposit", d.deposit], ["empty", d.empty]] as const) {
      heads.push([`buildPremisesBento(${slug}).${name}`, "withheld" in cell ? cell.withheld : cell.basis]);
    }
  }

  /* THE BILL TO REGISTER (MODEL.md 8.2 `04 entry-bill`, plan step 31's third
     dispatch, 2026-09-17), pushed composed: its basis is joined from the
     clauses of the figures it prints, its foot carries the share-capital
     exclusion and the modelled sentence, and its withheld lines stand where a
     figure would. Five countries cover the shapes the guard can leave the
     card in, the same five the story sheet draws: the exemplar (both
     figures), Azerbaijan (the bill withheld), the Emirates (the days
     withheld), Angola (neither) and Georgia (no bill on file). */
  for (const iso2 of ["GB", "AZ", "AE", "AO", "GE"]) {
    const b = buildEntryBill(iso2);
    if (!b) continue;
    if (b.basis) heads.push([`buildEntryBill(${iso2}).basis`, b.basis]);
    if (b.foot) heads.push([`buildEntryBill(${iso2}).foot`, b.foot]);
    if (b.withheld) heads.push([`buildEntryBill(${iso2}).withheld`, b.withheld]);
    heads.push([`buildEntryBill(${iso2}).second`, "figure" in b.second ? `${b.second.figure} ${b.second.words}` : b.second.withheld]);
  }

  /* POWER AND LIVING COSTS (MODEL.md 8.2 `06 running-costs`, plan step 31's
     fourth dispatch, 2026-09-18), pushed composed: its basis is joined from
     the clauses of the cells it prints, its foot names the modelled cells and
     counts the cities the living figure stands on, and its withheld lines
     count the countries sharing the fill. Four countries cover the shapes:
     the exemplar (both cells, seven cities), Angola (the rate withheld for
     the fill, one city), Afghanistan (the rate alone, living costs not on
     file) and Benin (neither; two lines, no basis, no foot). */
  for (const iso2 of ["GB", "AO", "AF", "BJ"]) {
    const r = buildRunningCosts(iso2);
    if (!r) continue;
    if (r.basis) heads.push([`buildRunningCosts(${iso2}).basis`, r.basis]);
    if (r.foot) heads.push([`buildRunningCosts(${iso2}).foot`, r.foot]);
    for (const line of r.withheld) heads.push([`buildRunningCosts(${iso2}).withheld`, line]);
  }

  /* BEFORE YOU COMMIT (MODEL.md 8.2 `18 checks`, plan step 31's fifth
     dispatch, 2026-09-18): the two basis lines sit under `basis.three` and
     `basis.two`, leaves the static sweep does not read (it reads a leaf named
     `basis`), so they are pushed by name; the kickers of `18` and `19` the
     sweep already takes by key. */
  heads.push(["COPY.checks.basis.three", COPY.checks.basis.three], ["COPY.checks.basis.two", COPY.checks.basis.two]);

  /* THE PLACEMENT SENTENCE (MODEL.md PART 6 decision 2, PART 9 clause 37, R2;
     plan step 31's sixth dispatch, 2026-09-18), pushed composed: its two
     templates carry `{n}` and `{noun}` and are skipped by the static sweep by
     design, and the one builder in placement.ts fills them. Every sentence the
     builder can produce is pushed, nineteen strings: nine tenths for each
     noun and the one lowest-tenth sentence. */
  for (const noun of ["countries", "cities"] as const) {
    for (let lower = 0; lower < 10; lower++) {
      const s = placementSentence(lower, 10, noun);
      if (s) heads.push([`placementSentence(${lower}, 10, ${noun})`, s]);
    }
  }

  /* THE COUNTRY PAGE'S THREE CHAPTER HEADINGS (MODEL.md 8.2, the same
     dispatch): leaves named `costs`, `where` and `place`, which the static
     sweep does not read (it reads a leaf named `kicker` or `basis`), so they
     are pushed by name; a heading is read aloud like a kicker. */
  for (const [key, text] of Object.entries(COPY.chapters)) heads.push([`COPY.chapters.${key}`, text]);

  /* THE DRAWN BLOCKED SEATS (MODEL.md 8.2, the two on every country and the
     four of "THE THIN COUNTRY, SEATED"; plan step 31's seventh dispatch,
     2026-09-18): each seat's stated line and its foot are leaves named `line`
     and `foot`, which the static sweep does not read (it reads a leaf named
     `kicker` or `basis`; the seats' kickers it already takes by key), so they
     are pushed by name. A seat's line stands where a card's focal would and
     is read aloud like a basis line. */
  for (const [key, seat] of Object.entries(COPY.blocked)) heads.push([`COPY.blocked.${key}.line`, seat.line], [`COPY.blocked.${key}.foot`, seat.foot]);

  /* THE TRADE ROWS' FOOT (MODEL.md 8.3 `09 trades`; plan step 32's fifth
     dispatch, 2026-09-18): the card's one line, in the coverage form, carries
     `{n}` and is skipped by the static sweep by design, so it is pushed in the
     forms a reader meets: the count as a word for every count the card can
     draw (four, the floor under which it self-omits, to seven, the cap the
     slate holds; counted 2026-09-18 through the adapter's path, cities draw
     five, six or seven). The kicker the sweep takes by key. The peers' three
     corrected strings (the kicker, "Cost of living", "Typical pay") the sweep
     takes by key too, as `kicker` and `cols`. */
  for (let n = 4; n <= 7; n++) heads.push([`COPY.cityTrades.foot(${n})`, COPY.cityTrades.foot.replace("{n}", countWord(n))]);

  /* THE TRADE PAGE'S OPENING (MODEL.md 8.6 `00 take`, `01 spread`, `02
     suits`; plan step 33's first dispatch, 2026-09-18), pushed by name and
     composed: the masthead's answer label and basis, the state word and its
     note, the three companion labels and the takings' note, the withheld
     foot; the strip's two basis lines and its withheld line (its kicker the
     sweep takes by key); the suits card's three note labels, its
     not-gathered row and its basis; the three chapter headings; and the one
     net builder's three notes, each in the form a reader meets. The
     composed forms come off the shipped builders over two fixture seeds (the
     exemplar's shape with money shown, and the untrusted shape without),
     the district builder's own idiom in this file, and off the real shard
     for the net (restaurants on the ladder; the engine on London's 5). */
  {
    const shown = { meta: { trade: "Restaurants", city: "London", country_name: "United Kingdom", iso2: "GB", industry_id: "restaurants", money_shown: true, provenance_line: "National business statistics" }, owner: { take_home_usd: 36000 }, headline: { n_firms: 13000, rev_p10_usd: 360000, rev_p50_usd: 720000, rev_p90_usd: 1296000, rev_spread_basis: "modelled" }, net: resolveTradeNet("restaurants", { moneyShown: true, netMarginPct: 5 }) };
    const hidden = { meta: { trade: "Cafés & coffee shops", city: "Mumbai", country_name: "India", iso2: "IN", industry_id: "cafes_coffee", money_shown: false, provenance_line: "Modeled from national business statistics." }, headline: { n_firms: 100 }, net: resolveTradeNet("cafes_coffee", { moneyShown: false, netMarginPct: 11.3 }) };
    for (const [name, seed] of [["shown", shown], ["hidden", hidden]] as const) {
      const f = tradeHeroFacts(seed);
      if (f) {
        if (f.answer) heads.push([`tradeHeroFacts(${name}).answer.label`, f.answer.label], [`tradeHeroFacts(${name}).answer.basis`, f.answer.basis]);
        heads.push([`tradeHeroFacts(${name}).absent.label`, f.absent.label], [`tradeHeroFacts(${name}).absent.word`, f.absent.word], [`tradeHeroFacts(${name}).absent.note`, f.absent.note]);
        for (const c of f.cells) { heads.push([`tradeHeroFacts(${name}).cells.${c.key}`, c.label]); if (c.note) heads.push([`tradeHeroFacts(${name}).cells.${c.key}.note`, c.note]); }
        if (f.foot) heads.push([`tradeHeroFacts(${name}).foot`, f.foot.text]);
      }
      const sp = buildTradeSpread(seed);
      if (sp) { if (sp.basis) heads.push([`buildTradeSpread(${name}).basis`, sp.basis]); if (sp.withheld) heads.push([`buildTradeSpread(${name}).withheld`, sp.withheld]); for (const m of sp.marks) heads.push([`buildTradeSpread(${name}).marks.${m.key}`, m.label]); }
    }
    for (const [id, iso2] of [["restaurants", "GB"], ["no_such_trade", "GB"], ["restaurants", "AF"]] as const) {
      const su = buildSuits(id, iso2);
      for (const r of su.rows) heads.push([`buildSuits(${id}, ${iso2}).rows.${r.key}.label`, r.label]);
      heads.push([`buildSuits(${id}, ${iso2}).basis`, su.basis]);
    }
    heads.push(["COPY.tradeSpread.basisMeasured", COPY.tradeSpread.basisMeasured], ["COPY.tradeSuits.notGathered", COPY.tradeSuits.notGathered], ["COPY.tradeHero.withheld", COPY.tradeHero.withheld]);
    for (const [key, text] of Object.entries(COPY.tradeChapters)) heads.push([`COPY.tradeChapters.${key}`, text]);
    for (const [key, text] of Object.entries(COPY.tradeNet.notes)) heads.push([`COPY.tradeNet.notes.${key}`, text]);
    /* THE PERMITS AND THE COST TO OPEN (MODEL.md 8.6 `03 permits | 04 open`;
       plan step 33's second dispatch, 2026-09-18). The permits' labels are the
       shards' own licence names, five to twelve words a reader meets over a
       figure, so the sweep reads EVERY shard (243 local files, no database):
       each label, the basis, the foot and the one withheld line (the zero-day
       licence). The cost to open composed in its three states off fixture
       seeds (the district builder's idiom): held (nine lines, the exemplar's
       shape), baseline (a keyed trade, no lines) and withheld (a trade on the
       default), each pushing its basis, its withheld line, its foot line and
       the companions' words; the static strings (the kicker, the ceiling's
       words, the two heads) by key. */
    for (const id of readdirSync("data/facts/industry").filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""))) {
      const p = buildPermits(id);
      if (!p) continue;
      for (const c of p.cells) heads.push([`buildPermits(${id}).cells.${c.key}`, c.label]);
      if (p.withheld) heads.push([`buildPermits(${id}).withheld`, p.withheld]);
    }
    heads.push(["COPY.tradePermits.basis", COPY.tradePermits.basis], ["COPY.tradePermits.foot", COPY.tradePermits.foot], ["COPY.tradePermits.withheldOne", COPY.tradePermits.withheldOne], ["buildPermits(withheldMany)", COPY.tradePermits.withheldMany.replace("{n}", "2")]);
    const lines = { items: [{ name: "Fit-out", usd: 250000 }, { name: "Equipment", usd: 100000 }, { name: "Lease deposit", usd: 40000 }] };
    const nine = { items: [...lines.items, { name: "Initial inventory", usd: 20000 }, { name: "Pre-opening marketing", usd: 12000 }, { name: "Business registration", usd: 20 }, { name: "Industry licences", usd: 1500 }, { name: "Insurance and bonds", usd: 2000 }, { name: "Certifications", usd: 500 }] };
    const openSeeds: Array<[string, any]> = [
      ["held", { meta: { industry: "restaurants", industry_id: "restaurants" }, setup: lines }],
      ["held, nine lines", { meta: { industry: "restaurants", industry_id: "restaurants" }, setup: nine }],
      ["held, six lines", { meta: { industry: "restaurants", industry_id: "restaurants" }, setup: { items: nine.items.slice(0, 6) } }],
      ["held, no shard", { meta: { industry: "restaurants", industry_id: "no_such_trade" }, setup: nine }],
      ["baseline", { meta: { industry: "restaurants", industry_id: "restaurants" } }],
      ["withheld", { meta: { industry: "shoe-repair", industry_id: "shoe_repair" } }],
      ["baseline, no shard", { meta: { industry: "restaurants", industry_id: "no_such_trade" } }],
    ];
    for (const [name, seed] of openSeeds) {
      const o = buildOpen(seed);
      if (!o) { pushRed("BANNED CONSTRUCTION", `buildOpen(${name}): the builder returned nothing for a seed that names a trade`); continue; }
      if (o.basis) heads.push([`buildOpen(${name}).basis`, o.basis]);
      if (o.withheld) heads.push([`buildOpen(${name}).withheld`, o.withheld]);
      if (o.footLine) heads.push([`buildOpen(${name}).footLine`, o.footLine]);
      if (o.tailLine) heads.push([`buildOpen(${name}).tailLine`, o.tailLine]);
      for (const c of o.foot) heads.push([`buildOpen(${name}).foot`, c.words]);
    }
    heads.push(["COPY.tradeOpen.biggest", COPY.tradeOpen.biggest], ["COPY.tradeOpen.footWithheld", COPY.tradeOpen.footWithheld]);
    /* THE SPLIT AND THE TEAM (MODEL.md 8.6 `05 split | 06 team`; plan step
       33's third dispatch, 2026-09-18): the two basis lines (one per feed),
       the withheld line, the foot, the plus's summary and note; the team's
       basis, foot and the no-median line. The kickers and the team's three
       heads the static sweep takes by key. The legend labels are row labels
       and sit in the ROW SENTENCE list above. */
    heads.push(["COPY.tradeSplit.basisShard", COPY.tradeSplit.basisShard], ["COPY.tradeSplit.basisProfile", COPY.tradeSplit.basisProfile], ["COPY.tradeSplit.basisWithheld", COPY.tradeSplit.basisWithheld], ["COPY.tradeSplit.withheld", COPY.tradeSplit.withheld], ["COPY.tradeSplit.foot", COPY.tradeSplit.foot], ["COPY.tradeSplit.detail.summary", COPY.tradeSplit.detail.summary], ["COPY.tradeSplit.detail.note", COPY.tradeSplit.detail.note]);
    heads.push(["COPY.tradeTeam.basis", COPY.tradeTeam.basis], ["COPY.tradeTeam.foot", COPY.tradeTeam.foot], ["COPY.tradeTeam.noMedian", COPY.tradeTeam.noMedian]);
    /* THE PEERS, THE SHARE AND THE SURVIVAL (MODEL.md 8.6 `07 peers`, `08
       clears`, `09 lasts`; plan step 33's fourth dispatch, 2026-09-18). The
       peers' kicker, its two heads and its basis the static sweep takes by
       key (`kicker`, `cols`, `basis`); its two stated lines (the not-gathered
       line where no peer resolves, the dash line where the home row's
       takings are not shown) are pushed by name and composed off three
       fixture seeds in the district builder's idiom (a United States cell
       with a slate, London with none, a cell off `moneyShown`), with the row
       names a reader meets. The share's basis the sweep takes by key; its
       foot by name; composed on the engine branch (money shown) and on the
       shard's for every one of the 243 shard ids. The survival's basis the
       sweep takes by key; its three cell labels and its foot by name and
       composed off every shard id. */
    const slate = { meta: { trade: "Restaurants", city: "California", country_name: "United States", iso2: "US", industry_id: "restaurants", money_shown: true }, headline: { rev_p50_usd: 1100000 }, nearby: { places: [{ name: "Texas", home: false, rev_p50_usd: 900000 }, { name: "Florida", home: false, rev_p50_usd: 850000 }, { name: "New York", home: false, rev_p50_usd: 1200000 }] } };
    const seated = { meta: { trade: "Restaurants", city: "London", country_name: "United Kingdom", iso2: "GB", industry_id: "restaurants", money_shown: true }, headline: { rev_p50_usd: 620000 } };
    const dashed = { meta: { trade: "Cafés & coffee shops", city: "Mumbai", country_name: "India", iso2: "IN", industry_id: "cafes_coffee", money_shown: false }, headline: { rev_p50_usd: 5215000 } };
    for (const [name, seed] of [["slate", slate], ["seated", seated], ["dashed", dashed]] as const) {
      const p = buildTradePeers(seed);
      if (!p) { pushRed("BANNED CONSTRUCTION", `buildTradePeers(${name}): the builder returned nothing for a seed that names a place`); continue; }
      if (p.notGathered) heads.push([`buildTradePeers(${name}).notGathered`, p.notGathered]);
      if (p.homeWithheld) heads.push([`buildTradePeers(${name}).homeWithheld`, p.homeWithheld]);
      /* The row names are place names (a state, a city), judged here as the ROW SENTENCE loop above judges its list, which has already run. */
      for (const r of p.rows) { const n = r.name.trim().split(/\s+/).filter(Boolean).length; if (n > 3) pushRed("ROW SENTENCE", `buildTradePeers(${name}).rows.${r.key}: "${r.name}" is a label of ${n} words, over three`); }
    }
    heads.push(["COPY.tradeClears.foot", COPY.tradeClears.foot], ["COPY.tradeLasts.foot", COPY.tradeLasts.foot]);
    for (const [key, text] of Object.entries(COPY.tradeLasts.cells)) heads.push([`COPY.tradeLasts.cells.${key}`, text]);
    const engineClears = buildClears({ meta: { industry_id: "restaurants", money_shown: true }, break_even: { share_pct: 75 } });
    if (!engineClears || engineClears.branch !== "engine") pushRed("BANNED CONSTRUCTION", "buildClears(engine): a seed with money shown and the engine's share does not build on the engine branch");
    else heads.push(["buildClears(engine).basis", engineClears.basis], ["buildClears(engine).foot", engineClears.foot]);
    for (const id of readdirSync("data/facts/industry").filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""))) {
      const cl = buildClears({ meta: { industry_id: id, money_shown: false } });
      if (cl) heads.push([`buildClears(${id}).basis`, cl.basis], [`buildClears(${id}).foot`, cl.foot]);
      const l = buildLasts(id);
      if (l) { for (const c of l.cells) heads.push([`buildLasts(${id}).cells.${c.key}`, c.label]); heads.push([`buildLasts(${id}).basis`, l.basis], [`buildLasts(${id}).foot`, l.foot]); }
      /* THE MIX AND THE MARKET (MODEL.md 8.6 `11 mix`, `12 market`; plan step
         33's fifth dispatch, 2026-09-18): the mix's labels are the shards' own
         channel names (one to nine words a reader meets over a figure, the
         permits' rule), so each is swept off every shard with the basis and
         the foot; the market's four basis lines composed off every shard. The
         seat's line and foot go with the other seats above (COPY.blocked);
         the mix's kicker, its withheld line, the market's four openers and
         its withheld lines the static sweep takes by key and by name. */
      const mx = buildMix(id);
      if (mx) { for (const c of mx.cells) heads.push([`buildMix(${id}).cells.${c.key}`, c.label]); heads.push([`buildMix(${id}).basis`, mx.basis], [`buildMix(${id}).foot`, mx.foot]); }
      const mk = buildMarket(id);
      if (mk) for (const key of MARKET_CELLS) { const cell = mk[key]; heads.push([`buildMarket(${id}).${key}`, "withheld" in cell ? cell.withheld : cell.basis]); }
    }
    heads.push(["COPY.tradeMix.withheld", COPY.tradeMix.withheld]);
    for (const [key, k] of Object.entries(COPY.tradeMarket.kickers)) heads.push([`COPY.tradeMarket.kickers.${key}`, k]);
    for (const [key, w] of Object.entries(COPY.tradeMarket.withheld)) heads.push([`COPY.tradeMarket.withheld.${key}`, w]);
    /* THE EXIT (MODEL.md 8.6 `13 rivals`, `14 worth`; plan step 33's sixth
       dispatch, 2026-09-18). The rivals composed off fixture seeds in the
       district builder's idiom, every state a reader meets: six siblings
       with four keyed (the exemplar's shape: the headline's label, the
       withheld line for two), six all keyed (Berlin's shape), one withheld
       (the singular line), three keyed of six (the state line with its
       count in words), two siblings both keyed (the state line under the
       floor from the low side) and no sibling at all (the shorter line);
       the kicker, the two heads and the basis the static sweep takes by
       key. The worth composed off every one of the 243 shard ids in each of
       its states (the strip on a seed with money shown and a take-home; the
       withheld line off `moneyShown`; the operating-earnings line on its
       38 shards), the basis and the note by key. The sibling names on the
       rivals rows are the taxonomy's own trade names, judged as the peers'
       place names are, by the ROW SENTENCE loop's rule. */
    const siblings = (slugs: string[]) => ({ list: slugs.map((slug) => ({ name: slug.replace(/-/g, " "), slug, href: `/gb/london/${slug}` })) });
    const rivalSeeds: Array<[string, any]> = [
      ["four keyed of six", { meta: { trade: "Restaurants" }, rivals: siblings(["legal-services", "software-development", "office-business-support", "real-estate-agencies", "employment-services", "grocery-stores"]) }],
      ["six keyed", { meta: { trade: "Restaurants" }, rivals: siblings(["marketing-design-agencies", "real-estate-agencies", "specialty-trades-mixed", "engineering-architecture", "software-development", "legal-services"]) }],
      ["one withheld", { meta: { trade: "Restaurants" }, rivals: siblings(["legal-services", "software-development", "real-estate-agencies", "grocery-stores", "employment-services"]) }],
      ["three keyed of six", { meta: { trade: "Restaurants" }, rivals: siblings(["legal-services", "software-development", "real-estate-agencies", "office-business-support", "employment-services", "vocational-other-training"]) }],
      ["two siblings", { meta: { trade: "Restaurants" }, rivals: siblings(["legal-services", "software-development"]) }],
      ["no sibling", { meta: { trade: "Restaurants" }, rivals: { list: [] } }],
    ];
    for (const [name, seed] of rivalSeeds) {
      const r = buildRivals(seed);
      if (!r) { pushRed("BANNED CONSTRUCTION", `buildRivals(${name}): the builder returned nothing for a seed that names a trade`); continue; }
      if (r.state === "list") heads.push([`buildRivals(${name}).middleLabel`, r.middleLabel]);
      if (r.withheldLine) heads.push([`buildRivals(${name}).withheldLine`, r.withheldLine]);
      if (r.stateLine) heads.push([`buildRivals(${name}).stateLine`, r.stateLine]);
      for (const row of r.rows) { const n = row.name.trim().split(/\s+/).filter(Boolean).length; if (n > 3) pushRed("ROW SENTENCE", `buildRivals(${name}).rows.${row.key}: "${row.name}" is a label of ${n} words, over three`); }
    }
    heads.push(["COPY.tradeRivals.basis", COPY.tradeRivals.basis], ["COPY.tradeRivals.head.name", COPY.tradeRivals.head.name], ["COPY.tradeRivals.head.value", COPY.tradeRivals.head.value]);
    heads.push(["COPY.tradeWorth.basis", COPY.tradeWorth.basis], ["COPY.tradeWorth.note", COPY.tradeWorth.note], ["COPY.tradeWorth.marks.low", COPY.tradeWorth.marks.low], ["COPY.tradeWorth.marks.high", COPY.tradeWorth.marks.high]);
    let worthStrips = 0, worthOther = 0, worthWithheld = 0;
    for (const id of readdirSync("data/facts/industry").filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""))) {
      const shown = buildWorth({ meta: { industry_id: id, money_shown: true }, owner: { take_home_usd: 36000 } });
      const hidden = buildWorth({ meta: { industry_id: id, money_shown: false } });
      if (!shown || !hidden) { pushRed("BANNED CONSTRUCTION", `buildWorth(${id}): the builder returned nothing for a shard that holds both sale figures`); continue; }
      if (shown.state === "strip") worthStrips++; else if (shown.state === "otherBasis") worthOther++;
      if (hidden.state === "withheld") worthWithheld++;
      for (const [name, w] of [["shown", shown], ["hidden", hidden]] as const) {
        if (w.withheld) heads.push([`buildWorth(${id}, ${name}).withheld`, w.withheld]);
        if (w.basis) heads.push([`buildWorth(${id}, ${name}).basis`, w.basis]);
        if (w.note) heads.push([`buildWorth(${id}, ${name}).note`, w.note]);
        for (const m of w.marks) heads.push([`buildWorth(${id}, ${name}).marks.${m.key}`, m.label]);
      }
    }
    console.log(`worth (14): ${worthStrips} shards draw the strip with money shown, ${worthOther} hold the operating-earnings line, ${worthWithheld} the withheld line off moneyShown`);
  }

  /* THE INDUSTRY PAGE'S OPENING (MODEL.md 8.7 `00 take`, `01 lasts`, `02
     benchmark`; plan step 34's first dispatch, 2026-09-18), pushed by name
     and composed off the shipped builders over every one of the 243
     taxonomy ids, no seed, no database: the take's answer label, its two
     basis lines (one per branch of the one net builder), the state word and
     its note, the three companion labels and notes, and the foot in every
     shape the 243 produce (all three printed, one or more withheld in the
     not-gathered idiom; deduplicated, since 243 trades share a few strings);
     the survival grid's world basis; the benchmark's kicker, its ceiling
     words, its basis on every one of the 25 sectors (the sector's count and
     name composed) and its line in every shape the states produce
     (deduplicated). THE ROW NAMES ARE THE TAXONOMY'S OWN TRADE NAMES and
     are not redded here: the country money card's rows are the same names
     and this gate has never judged them, because the fault is in the
     taxonomy's name ("Catering & food service contractors", five words) and
     not in a card, and the rendered laws list (check_model_laws.mjs, ROW
     SENTENCE on `[data-label]`) already reports every such name on every
     page that draws it. Over 243 trades' ten rows the same name would be
     counted hundreds of times, and a ratchet that may only fall cannot
     seed hundreds of reds for one copy fault. The distinct names over
     three words are COUNTED and printed as the queue line instead. The
     chapter headings, read aloud like a kicker. */
  {
    const ids = ALL_INDUSTRIES.map((i) => i.id);
    heads.push(["COPY.industryHero.answerLabel", COPY.industryHero.answerLabel], ["COPY.industryHero.answerBasisShard", COPY.industryHero.answerBasisShard], ["COPY.industryHero.answerBasisProfile", COPY.industryHero.answerBasisProfile], ["COPY.industryHero.absent", COPY.industryHero.absent], ["COPY.industryHero.absentNote", COPY.industryHero.absentNote]);
    for (const [key, c] of Object.entries(COPY.industryHero.cells)) heads.push([`COPY.industryHero.cells.${key}.label`, c.label], [`COPY.industryHero.cells.${key}.note`, c.note]);
    const feet = new Map<string, string>();
    const lines = new Map<string, string>();
    const bases = new Map<string, string>();
    const longNames = new Set<string>();
    for (const id of ids) {
      const f = industryHeroFacts(id);
      if (f?.foot && !feet.has(f.foot.text)) feet.set(f.foot.text, id);
      const b = buildBenchmark(id);
      if (b) {
        if (!bases.has(b.basis)) bases.set(b.basis, id);
        if (b.line && !lines.has(b.line)) lines.set(b.line, id);
        for (const r of b.rows) { const n = r.name.trim().split(/\s+/).filter(Boolean).length; if (n > 3) longNames.add(r.name); }
      }
    }
    for (const [text, id] of feet) heads.push([`industryHeroFacts(${id}).foot`, text]);
    for (const [text, id] of bases) heads.push([`buildBenchmark(${id}).basis`, text]);
    for (const [text, id] of lines) heads.push([`buildBenchmark(${id}).line`, text]);
    heads.push(["COPY.industryLasts.basis", COPY.industryLasts.basis], ["COPY.industryBenchmark.topLabel", COPY.industryBenchmark.topLabel]);
    for (const [key, text] of Object.entries(COPY.industryChapters)) heads.push([`COPY.industryChapters.${key}`, text]);
    console.log(`industry opening: ${feet.size} foot shapes, ${bases.size} benchmark bases (one per sector), ${lines.size} line shapes over ${ids.length} trades; ${longNames.size} distinct taxonomy names over three words stand in the benchmark's rows, a copy fault in the taxonomy the rendered laws list reports page by page, not redded here`);
  }

  /* THE INDUSTRY PAGE'S TURN ONE (MODEL.md 8.7 `03 split`, `04 open`, `05
     pays`; plan step 34's second dispatch, 2026-09-18), pushed by name and
     composed off the shipped builders over every one of the 243 ids, no
     seed, no database. The split is the trade's card off the trade's
     builder, so its strings are `tradeSplit`'s, swept above; its composed
     basis and withheld line are pushed again off every id (deduplicated) in
     case a branch the trade fixtures never reach prints here. The open
     card's kicker and basis the static sweep takes by key; its three cell
     labels, its foot, the plus's summary, its two withheld lines (the many
     form composed) and the three not-gathered lines by name; the licence
     names behind its plus are the permits' own cells, swept above off every
     shard. The bento's two openers and the share cell's (the trade's own
     `tradeClears.kicker`, by key) and every basis and withheld line by name,
     and the lines the 243 compose (deduplicated). */
  {
    const ids = ALL_INDUSTRIES.map((i) => i.id);
    for (const [key, text] of Object.entries(COPY.industryOpen.cells)) heads.push([`COPY.industryOpen.cells.${key}`, text]);
    heads.push(["COPY.industryOpen.foot", COPY.industryOpen.foot], ["COPY.industryOpen.detail.summary", COPY.industryOpen.detail.summary], ["COPY.industryOpen.detail.withheldOne", COPY.industryOpen.detail.withheldOne], ["COPY.industryOpen.detail.withheldMany(2)", COPY.industryOpen.detail.withheldMany.replace("{n}", "2")]);
    for (const [key, text] of Object.entries(COPY.industryOpen.withheld)) heads.push([`COPY.industryOpen.withheld.${key}`, text]);
    for (const [key, text] of Object.entries(COPY.industryPays.kickers)) heads.push([`COPY.industryPays.kickers.${key}`, text]);
    for (const [key, text] of Object.entries(COPY.industryPays.basis)) heads.push([`COPY.industryPays.basis.${key}`, text]);
    for (const [key, text] of Object.entries(COPY.industryPays.withheld)) heads.push([`COPY.industryPays.withheld.${key}`, text]);
    const splitLines = new Map<string, string>();
    const openLines = new Map<string, string>();
    const paysLines = new Map<string, string>();
    for (const id of ids) {
      const sp = buildIndustrySplit(id);
      if (sp) { for (const t of [sp.basis, sp.withheld ?? "", sp.foot]) if (t && !splitLines.has(t)) splitLines.set(t, id); }
      const o = buildIndustryOpen(id);
      if (o) { for (const t of [o.basis, o.foot, ...o.withheldLines, o.detail?.summary ?? "", o.detail?.withheldLine ?? ""]) if (t && !openLines.has(t)) openLines.set(t, id); }
      const p = buildPays(id);
      if (p) for (const key of PAYS_CELLS) { const cell = p[key]; const t = "withheld" in cell ? cell.withheld : cell.basis; if (!paysLines.has(t)) paysLines.set(t, id); }
    }
    for (const [text, id] of splitLines) heads.push([`buildIndustrySplit(${id})`, text]);
    for (const [text, id] of openLines) heads.push([`buildIndustryOpen(${id})`, text]);
    for (const [text, id] of paysLines) heads.push([`buildPays(${id})`, text]);
    console.log(`industry turn one: ${splitLines.size} split lines, ${openLines.size} open lines, ${paysLines.size} bento lines over ${ids.length} trades`);
  }

  /* THE INDUSTRY PAGE'S TURN TWO (MODEL.md 8.7 `06 places`, `07 formats`, `08
     channels`; plan step 34's third dispatch, 2026-09-19). The places table's
     kicker, its three column heads and its basis by key; its seat's three
     lines composed with the slate's size and a count, its foot and its two
     notes (the many form composed), because the slate is the database and
     the composed forms are what a reader meets. The formats' kicker, the two
     heads, the two bases and the state line (composed with a count) by key,
     and the bases the 243 compose off the shipped builder (deduplicated:
     two, one per branch). THE FORMAT NAMES ARE THE SHARDS' OWN and are
     counted here as the benchmark's taxonomy names are, never redded: the
     distinct names over three words, and the distinct names over the row's
     width (FORMAT_NAME_FITS, the width measured to spill the mark list's
     one-line row), both the data track's (item 71's class). The mix's world
     basis by key. */
  {
    const ids = ALL_INDUSTRIES.map((i) => i.id);
    const slate = String(MAJOR_CITIES.length);
    heads.push(["COPY.industryPlaces.kicker", COPY.industryPlaces.kicker], ["COPY.industryPlaces.basis", COPY.industryPlaces.basis], ["COPY.industryPlaces.withheldOne", COPY.industryPlaces.withheldOne], ["COPY.industryPlaces.withheldMany(2)", COPY.industryPlaces.withheldMany.replace("{n}", "2")]);
    for (const [key, text] of Object.entries(COPY.industryPlaces.cols)) heads.push([`COPY.industryPlaces.cols.${key}`, text]);
    heads.push(["COPY.industryPlaces.blocked.none", COPY.industryPlaces.blocked.none.replace("{slate}", slate)], ["COPY.industryPlaces.blocked.one", COPY.industryPlaces.blocked.one.replace("{slate}", slate)], ["COPY.industryPlaces.blocked.some(3)", COPY.industryPlaces.blocked.some.replace("{n}", "3").replace("{slate}", slate)], ["COPY.industryPlaces.blocked.foot", COPY.industryPlaces.blocked.foot]);
    heads.push(["COPY.industryFormats.kicker", COPY.industryFormats.kicker], ["COPY.industryFormats.head.name", COPY.industryFormats.head.name], ["COPY.industryFormats.head.value", COPY.industryFormats.head.value], ["COPY.industryFormats.state(one)", COPY.industryFormats.state.replace("{k}", "one")]);
    heads.push(["COPY.industryMix.basis", COPY.industryMix.basis]);
    const formatBases = new Map<string, string>();
    const labels = new Map<string, string>();
    const longNames = new Set<string>();
    const wideNames = new Set<string>();
    for (const id of ids) {
      const f = buildFormats(id);
      if (!f) continue;
      if (!formatBases.has(f.basis)) formatBases.set(f.basis, id);
      if (!labels.has(f.middleLabel)) labels.set(f.middleLabel, id);
      for (const r of f.rows) {
        if (r.name.trim().split(/\s+/).filter(Boolean).length > 3) longNames.add(r.name);
        if (r.name.length > FORMAT_NAME_FITS) wideNames.add(r.name);
      }
    }
    for (const [text, id] of formatBases) heads.push([`buildFormats(${id}).basis`, text]);
    for (const [text, id] of labels) heads.push([`buildFormats(${id}).middleLabel`, text]);
    console.log(`industry turn two: ${formatBases.size} format bases (one per branch) and ${labels.size} middle labels over ${ids.length} trades; ${longNames.size} distinct format names over three words and ${wideNames.size} over ${FORMAT_NAME_FITS} characters stand in the formats' rows, a copy fault in the shards the rendered laws list and the archetype harness report page by page, not redded here`);
  }

  /* THE INDUSTRY PAGE'S TURN THREE AND ITS EXIT (MODEL.md 8.7 `09 know`, `10
     field`, `11 close`; plan step 34's fourth dispatch, 2026-09-19). The
     know card's kicker and basis the static sweep takes by key; every note
     LABEL the 243 compose (deduplicated: the trade page's two character
     labels and the failure-modes file's own labels, 32 of them, read aloud
     as a kicker is because a label over a note is the first thing a reader
     meets; the file's "Booth-rent vs commission imbalance" was corrected on
     this dispatch after this sweep found it), the not-gathered label and
     line. The field card's kicker and basis by key; its foot, the two notes
     under its figures and the three world cell bases by name; the labels
     are the trade market's openers, swept above by key. The close's doors
     as the 243 compose them (deduplicated: one leader door per trade next
     door, the pill per trade name), and the city door on the table's
     fixture, because a door's words are a reader's next step. */
  {
    const ids = ALL_INDUSTRIES.map((i) => i.id);
    const noteLabels = new Map<string, string>();
    for (const id of ids) {
      const k = buildKnow(id);
      if (!k) continue;
      for (const r of k.rows) if (!noteLabels.has(r.label)) noteLabels.set(r.label, id);
    }
    for (const [text, id] of noteLabels) heads.push([`buildKnow(${id}).rows.label`, text]);
    heads.push(["COPY.industryKnow.notGatheredLabel", COPY.industryKnow.notGatheredLabel], ["COPY.industryKnow.notGathered", COPY.industryKnow.notGathered]);
    heads.push(["COPY.industryField.foot", COPY.industryField.foot]);
    for (const [key, text] of Object.entries(COPY.industryField.notes)) heads.push([`COPY.industryField.notes.${key}`, text]);
    for (const [key, text] of Object.entries(COPY.industryField.cellBasis)) heads.push([`COPY.industryField.cellBasis.${key}`, text]);
    const doorLabels = new Map<string, string>();
    for (const id of ids) for (const d of buildIndustryCloseDoors(id, null, buildBenchmark(id))) if (!doorLabels.has(d.label)) doorLabels.set(d.label, id);
    for (const [text, id] of doorLabels) heads.push([`buildIndustryCloseDoors(${id}).label`, text]);
    heads.push(["COPY.industryClose.cityDoor(restaurants, London)", COPY.industryClose.cityDoor.replace("{trade}", "restaurants").replace("{city}", "London")]);
    console.log(`industry turn three and the exit: ${noteLabels.size} note labels and ${doorLabels.size} door labels over ${ids.length} trades`);
  }

  /* THE NEIGHBOURHOOD PAGES (MODEL.md 8.8; plan step 35, 2026-09-19), every
     composed string a reader meets on the hub and on every district page of
     every admitted city, off the six hood builders reading the files by the
     slug (no seed, no database): the take's label, basis, cell labels and
     foot; the rank's clip line (the basis and the head are the city district
     builder's, swept on its fixture above); the visitor list's headline
     label and withheld line; the table's heads, caveat and dash note; the
     notes' kicker, labels and facts, basis and foot; the doors' labels; the
     two chapter headings and the seat's three strings. The static ones
     (hoodPremium.kicker, .basis, .head; hoodCompare.kicker, .cols;
     hoodCharacter.kicker, .basis; hoodTake.basis; blocked.hoodWorks.kicker)
     the sweep above takes by key. */
  {
    let hoodPages = 0;
    for (const city of spineHoodCities()) {
      const districts = spineHoodDistricts(city) ?? [];
      const rank = buildHoodRank(city);
      if (rank?.clipLine) heads.push([`buildHoodRank(${city}).clipLine`, rank.clipLine]);
      const premium = buildHoodPremium(city);
      if (premium) {
        heads.push([`buildHoodPremium(${city}).headline.label`, premium.headline.label], [`buildHoodPremium(${city}).basis`, premium.basis]);
        if (premium.withheldLine) heads.push([`buildHoodPremium(${city}).withheldLine`, premium.withheldLine]);
      }
      for (const focus of [null, ...districts.map((d) => d.slug)]) {
        const where = `hood ${city}${focus ? `:${focus}` : ""}`;
        hoodPages++;
        const take = buildHoodTake(city, focus);
        if (take) heads.push([`${where} take.label`, take.answer.label], [`${where} take.basis`, take.answer.basis], [`${where} take.subtitle`, take.subtitle], [`${where} take.foot`, take.foot.text], ...take.cells.map((c) => [`${where} take.cell.${c.key}`, c.label] as [string, string]));
        const compare = buildHoodCompare(city, focus);
        if (compare) heads.push([`${where} compare.entityHead`, compare.entityHead], [`${where} compare.caveat`, compare.caveat], ...compare.columns.map((c) => [`${where} compare.head.${c.key}`, c.head] as [string, string]), ...(compare.note ? [[`${where} compare.note`, compare.note] as [string, string]] : []));
        const character = buildHoodCharacter(city, focus);
        if (character) heads.push([`${where} character.kicker`, character.kicker], [`${where} character.basis`, character.basis], [`${where} character.foot`, character.foot], ...character.rows.flatMap((r) => [[`${where} character.label.${r.key}`, r.label], [`${where} character.fact.${r.key}`, r.fact]] as Array<[string, string]>));
        for (const d of buildHoodCloseDoors(city, focus)) heads.push([`${where} close.door.${d.key}`, d.label]);
      }
    }
    heads.push(["COPY.hoodChapters.rent", COPY.hoodChapters.rent], ["COPY.hoodChapters.works", COPY.hoodChapters.works], ["COPY.blocked.hoodWorks.line", COPY.blocked.hoodWorks.line], ["COPY.blocked.hoodWorks.foot", COPY.blocked.hoodWorks.foot], ["COPY.hoodPremium.withheldOne", COPY.hoodPremium.withheldOne.replace("{n}", "One")], ["COPY.hoodCompare.dash", COPY.hoodCompare.dash], ["COPY.hoodCharacter.sentenceWithheld", COPY.hoodCharacter.sentenceWithheld], ["COPY.cityNeighbourhoods.footPages", COPY.cityNeighbourhoods.footPages.replace("{n}", "Seven")]);
    console.log(`hood pages: every composed string swept on ${hoodPages} page(s) of ${spineHoodCities().length} admitted city(ies)`);
  }

  for (const [where, text] of heads) {
    const why = bannedConstruction(text);
    if (why) pushRed("BANNED CONSTRUCTION", `${where}: "${text}" is ${why}`);
  }
}

console.log(`model laws (copy): ${reds.length} red(s) across ${poleCount} spectra poles, ${rowLabels.length} row labels, the city-district builder on a synthetic fixture, and the city-peers "same" reachability proof`);
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
