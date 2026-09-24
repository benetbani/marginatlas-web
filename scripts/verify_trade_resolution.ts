/**
 * verify_trade_resolution: every word, id and old slug the site resolves to a
 * trade lands on a trade the atlas covers, or on nothing (the goal's A6,
 * 2026-09-24).
 *
 * Found while proving batch six on production: /industries/consulting printed
 * "Management consulting", /gb/london/plumber "residential construction",
 * /industries/bakeries "food manufacturing", /gb/london/metal-products-mfg
 * "fabricated metal manufacturing", every one an activity the founder retired
 * on 2026-08-21; and /gb/london/chemicals-mfg printed Custom jewelers. Three
 * roads led there: 53 aliases in src/lib/taxonomy.ts pointed at retired
 * activities and the alias step returned any id it was handed; the fuzzy step
 * added up scores, so one word found in a name carried two found nowhere; and
 * the legacy crosswalk in src/lib/cells/industry_resolution.ts named a page
 * after eleven retired targets. This gate holds eight things:
 *
 *   1. every live trade resolves to itself by its URL slug and by its id;
 *   2. every alias resolves to a live trade or to nothing, and to its own
 *      target's live activity (a merged one's survivor) where it has one;
 *   3. every retired slug resolves to nothing;
 *   4. every renamed slug resolves to the page its URL now lands on;
 *   5. over every name, keyword, example, id, alias and slug the taxonomy
 *      holds, nothing resolves to an activity the atlas does not cover;
 *   6. a word the fuzzy step resolves has every one of its words in the
 *      trade's name or keywords (the rule its own comment states);
 *   7. the legacy crosswalk names a live activity or nothing;
 *   8. the cases that were live faults answer as ruled.
 *
 * BLIND SPOT: it reads the resolvers, not the pages. A route that names a page
 * from a database row without asking a resolver would pass here; the live
 * proof is a fetch of the pinned addresses after a deploy.
 */
import { red } from "./lib/red";
import {
  ALL_INDUSTRIES,
  INDUSTRIES,
  INDUSTRY_BY_ID,
  INDUSTRY_SLUG_ALIASES,
  SLUG_TO_INDUSTRY,
  industryToSlug,
  liveIndustryFor,
  slugToIndustry,
} from "../src/lib/taxonomy";
import { RETIRED } from "../src/lib/taxonomy/retired";
import { TAXONOMY_REDIRECTS } from "../src/lib/taxonomy/legacy_redirects";
import { LEGACY_DB_TO_TAXONOMY, resolveDisplayIndustry } from "../src/lib/cells/industry_resolution";

const RULE = "trade-resolution";
const TAX = "src/lib/taxonomy.ts";
const XWALK = "src/lib/cells/industry_resolution.ts";
const reds: string[] = [];
/* Every red through the one formatter (scripts/lib/red): the rule, the file, what was found, what to do. */
const fail = (file: string, detail: string, remedy: string) => reds.push(red({ rule: RULE, file, detail, remedy }));

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const live = new Set(INDUSTRIES.map((i) => i.id));
const idOf = (x: string) => slugToIndustry(x)?.id ?? null;
const shown = (x: string | null) => x ?? "nothing";

// 1. Every live trade, by slug and by id.
for (const i of INDUSTRIES) {
  const slug = industryToSlug(i.id);
  if (idOf(slug) !== i.id) fail(TAX, `the live trade's slug ${slug} resolves to ${shown(idOf(slug))}`, "keep the canonical step first in slugToIndustry");
  if (idOf(i.id) !== i.id) fail(TAX, `the live trade's id ${i.id} resolves to ${shown(idOf(i.id))}`, "resolve an id as written or hyphenated before the alias step");
}

// 2. Every alias, to a live trade or nothing; to its own target where that target is covered.
const aliases = Object.entries(INDUSTRY_SLUG_ALIASES);
for (const [word, target] of aliases) {
  const got = idOf(word);
  if (got !== null && !live.has(got)) fail(TAX, `the alias "${word}" resolves to ${got}, an activity the atlas does not cover`, "point the alias at the live trade the word names, or let it resolve to nothing");
  const want = liveIndustryFor(target)?.id ?? null;
  const claimedFirst = !!SLUG_TO_INDUSTRY[word] || !!INDUSTRY_BY_ID[word.replace(/-/g, "_")] || !!(TAXONOMY_REDIRECTS as Record<string, string>)[word];
  if (want && got !== want && !claimedFirst) fail(TAX, `the alias "${word}" points at ${target} (live as ${want}) and resolves to ${shown(got)}`, "resolve an alias to its target's live activity before any other step");
}

// 3. Every retired slug, to nothing.
for (const slug of Object.keys(RETIRED)) {
  const got = idOf(slug);
  if (got !== null) fail(TAX, `the retired slug ${slug} resolves to ${got}`, "check RETIRED before the phrase and fuzzy steps");
}

// 4. Every renamed slug, to the page its URL lands on.
for (const [from, to] of Object.entries(TAXONOMY_REDIRECTS as Record<string, string>)) {
  if (from === to) continue;
  const want = SLUG_TO_INDUSTRY[to]?.id ?? null;
  const got = idOf(from);
  if (got !== want && !SLUG_TO_INDUSTRY[from]) fail(TAX, `the renamed slug ${from} (its URL lands on ${to}) resolves to ${shown(got)}, not ${shown(want)}`, "resolve a renamed slug through its redirect target");
}

// 5 and 6. The corpus: nothing lands on an activity the atlas does not cover; a fuzzy answer carries every word.
const phrases = new Set<string>();
for (const i of INDUSTRIES) for (const p of [...(i.keywords ?? []), ...(i.examples ?? [])]) phrases.add(slugify(p));
const corpus = new Set<string>();
for (const i of ALL_INDUSTRIES) {
  for (const w of [i.id, slugify(i.id), industryToSlug(i.id), slugify(i.name), ...(i.keywords ?? []).map(slugify), ...(i.examples ?? []).map(slugify)]) if (w) corpus.add(w);
}
for (const k of Object.keys(INDUSTRY_SLUG_ALIASES)) corpus.add(k);
for (const k of Object.keys(RETIRED)) corpus.add(k);
for (const [k, v] of Object.entries(TAXONOMY_REDIRECTS as Record<string, string>)) { corpus.add(k); corpus.add(v); }
const tokensOf = (s: string) => new Set(slugify(s).split("-").filter(Boolean));
let resolved = 0;
let fuzzy = 0;
for (const input of corpus) {
  const got = slugToIndustry(input);
  if (!got) continue;
  resolved++;
  if (!live.has(got.id)) {
    fail(TAX, `"${input}" resolves to ${got.id}, an activity the atlas does not cover`, "let the resolver answer a live trade or nothing");
    continue;
  }
  const norm = slugify(input);
  const exact = !!SLUG_TO_INDUSTRY[norm] || !!INDUSTRY_BY_ID[norm.replace(/-/g, "_")] || !!(TAXONOMY_REDIRECTS as Record<string, string>)[norm] || !!INDUSTRY_SLUG_ALIASES[norm] || phrases.has(norm);
  if (exact) continue;
  fuzzy++;
  const vocab = new Set<string>([...tokensOf(got.name), ...(got.keywords ?? []).flatMap((k) => [...tokensOf(k)])]);
  const missing = norm.split("-").filter((t) => t.length >= 3 && !vocab.has(t));
  if (missing.length) fail(TAX, `"${input}" resolves by the fuzzy step to ${got.id}, whose name and keywords lack "${missing.join('", "')}"`, "require every word of the input in the trade's name or keywords");
}

// 7. The legacy crosswalk names a live activity or nothing.
for (const legacy of Object.keys(LEGACY_DB_TO_TAXONOMY)) {
  for (const form of [legacy, slugify(legacy)]) {
    const got = resolveDisplayIndustry(form);
    if (got && !live.has(got.id)) fail(XWALK, `the legacy slug ${form} is displayed as ${got.id}, an activity the atlas does not cover`, "name a legacy slug after its crosswalk target only when liveIndustryFor answers it");
  }
}

// 8. The addresses that were live faults, answered as ruled.
const PINNED: Array<[string, string | null]> = [
  ["plumber", "plumbers"],
  ["bakeries", "bakeries_retail"],
  ["florist", "florist_shops"],
  ["consulting", null],
  ["chemicals-mfg", null],
  ["childcare", "daycare_preschool"],
  ["delivery", "courier_messenger"],
  ["specialty_grocery", "specialty_grocery"],
  ["zz-not-a-trade", null],
];
for (const [input, want] of PINNED) {
  const got = idOf(input);
  if (got !== want) fail(TAX, `"${input}" resolves to ${shown(got)}, ruled ${shown(want)}`, "restore the resolver step that answered it");
}
const display = resolveDisplayIndustry("metal-products-mfg")?.id ?? null;
if (display !== "metal_fab_machine_shops") fail(XWALK, `metal-products-mfg is displayed as ${shown(display)}, ruled metal_fab_machine_shops`, "skip a crosswalk target the atlas does not cover and resolve through the taxonomy");

if (reds.length) {
  console.error(`verify_trade_resolution: ${reds.length} red(s) above`);
  process.exit(1);
}
console.log(`verify_trade_resolution: ${INDUSTRIES.length} live trades resolve to themselves by slug and by id; ${aliases.length} aliases, ${Object.keys(RETIRED).length} retired slugs and every renamed slug answer a live trade or nothing; ${corpus.size} names, keywords, examples and slugs checked, ${resolved} resolve, none to an activity the atlas does not cover, and the ${fuzzy} the fuzzy step answers carry every word; the legacy crosswalk names a live activity or nothing; ${PINNED.length + 1} pinned addresses answer as ruled.`);
