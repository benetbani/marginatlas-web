/**
 * THE SECTION CENSUS: PAGES.md's generated block, written from the code, so
 * the loop's map of every page's sections never drifts from the views. The
 * build loop's system row sys:section-census (run 18, 2026-09-06).
 *
 * WHAT IT READS: every .tsx under src/components/spine/<page>/ (the archetypes
 * folder and the kit files skipped, as the coverage gate skips them); in each,
 * every `<Box` and the JSX up to its `</Box>`. For each section: the page (the
 * folder, the how-to view its own page), the section id (`id=` or `#n` in file
 * order, the coverage gate's own key), the enclosing component, the kicker
 * (a Rail's `kicker`, a Head's or WideRail's text; `COPY.x.y` resolved through
 * the copy table), the archetype inside it (a tag imported from the archetypes
 * folder) or "kit", with the form the Box DECLARES in brackets where it
 * declares one (`data-form="door"` on the country's `19 compare`, which
 * stands on Terminus and is a door card, not a second terminus; MODEL.md 8.2's
 * rhythm line counts "two forms in the census because 19 declares
 * data-form"; plan step 31's fifth dispatch, 2026-09-18), and the first
 * builder the enclosing component calls.
 *
 * THE LOUD-MOMENTS LEDGER LIVES BESIDE THE CENSUS (plan-2026-09-17/04-PAGES.md
 * step 40, 2026-09-19; MODEL.md PART 6, "three loud moments or fewer", and
 * PART 8's seat tables). Under each page's section table the block prints
 * "Loud today: n of 3" and the three seats as the page's view DECLARES them:
 * `export const LOUD_SEATS` in the view, read off the source by
 * scripts/lib/loud_seats.ts (seat, card, figure, state, condition; the states
 * LIT, HELD EMPTY, NO HONEST CANDIDATE, and FIELD since plan 2026-10-10). n counts the LIT and FIELD seats (a FIELD seat is lit by its terracotta zone); a LIT seat
 * is unlit on a render whose figure the data withholds (the country's rate off
 * a held regime, the trade's take off `moneyShown`), which is the render's
 * business and the loud-seats gate's (scripts/verify_loud_seats.ts holds every
 * render in scripts/harness/pages.json to its declaration with the page
 * filter's own accent walk). A page with no declaration, two, or one that is
 * not literals is a fault that stops every mode of this script: the ledger is
 * never printed half-read.
 *
 * usage: npx tsx scripts/harness/census.ts            prints the census and exits 1 when PAGES.md's block is stale
 *        npx tsx scripts/harness/census.ts --check    the chain gate: exits 1 when docs/loop/CENSUS.md (in-repo) is stale, or a render in scripts/harness/pages.json draws a block the census has no row for; never reads the other repo
 *        npx tsx scripts/harness/census.ts --write    writes the block between the markers in PAGES.md
 *        --pages=<path>  another PAGES.md (default ../design/loop/build/PAGES.md from the site root)
 *
 * A SECTION IS A BLOCK, COUNTED THE WAY THE HARNESS COUNTS IT (QUEUE
 * ui:census-cannot-see-a-card-an-archetype-draws, 2026-09-24). Until that day
 * a section was a `<Box` written in a view, and a card an archetype draws with
 * its own root (the country's take, entry bill, peers, money and spend; the
 * city's crew, market, districts; every trade and industry card on RankedBars,
 * MarkList, IncomeBreakdown, a bento) was invisible: the census printed 10
 * country sections where the page draws 15 blocks. Now:
 *   - THE ARCHETYPES ARE READ FROM THEIR FOLDER, never typed: every exported
 *     component under src/components/spine/archetypes/ whose body stamps
 *     `data-archetype` (the archetype law, DOCTRINE section 5), so a sub-part
 *     that stamps none (CompanionRow, TierPanel) is not one and a new
 *     archetype is known the day it lands. A card-owning archetype is one whose
 *     body renders a `<Box` or stamps `data-block` itself.
 *   - A SECTION is a `<Box` in a view, or a card-owning archetype called in a
 *     view with an `id` prop and outside any view Box. A call with no id is a
 *     cell of a band or a piece of a card, never a block (Box stamps no block
 *     without an id, kit.tsx).
 *   - ITS ID is what the render stamps: a literal `data-block` wins, then the
 *     id (a literal, or a prop's literal default in the component's own
 *     signature), then `#n`, the n-th Box in the file, the coverage gate's key.
 *   - ITS ARCHETYPE is the first archetype drawn inside it (the harness's own
 *     reading of a card, the first `[data-archetype]` in document order), or
 *     the tag itself for a card-owning call.
 *   - THE COUNTRY'S SLOTS ARE ROWS OF THE REGISTRY (src/lib/spine/country_slots.ts, read as data; registrySlot below): the view draws
 *     every slot through one frame whose id is `def.domId`, which as source is one unreadable row; a frame with a literal slot is that
 *     slot's row, a frame with any other `def` stands for every slot (the locked card for stages 2 to 6), each its own row under the
 *     registry's DOM id and heading, carrying its stage component, its first archetype and the builder plan.ts asks for it.
 *   - ONE SECTION, ONE ROW: the rows of one page that share an id are one
 *     section in its states (a drawn card and the seat that stands where its
 *     data is absent, `peers` on CompareTable or BlockedSeat), printed once
 *     with their forms joined by "or".
 * `--check`, the chain gate, then holds the census to the page: every block
 * each render in scripts/harness/pages.json draws (its `[data-block]` ids, the
 * unit BLOCK FLOOR counts) must be a row of its page's census; `pages-fresh`
 * renders them at the head of the chain, and a missing render is a red with
 * its remedy, never a pass. A census row no render draws is a branch that page
 * does not take today (a seat, a state) and is printed, not redded.
 *
 * BLIND SPOT: it reads source, not renders, for everything but the block
 * check; a card written outside the spine folders is not seen, a kicker built
 * from a template prints as its template, and a builder called outside the
 * enclosing component is not seen. The coverage gate
 * (scripts/verify_archetype_coverage.ts) still reads `<Box` alone, which only
 * undercounts coverage. The ledger is the declaration: whether a render
 * carries the accents it declares is measured by the loud-seats gate, never
 * here.
 */
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, basename, resolve, dirname } from "node:path";
import { stripCommentLines } from "../lib/strip_comments";
import { readLoudSeats, litCount, loudCount, SPINE_PAGES, type LoudDeclaration } from "../lib/loud_seats";
import { COPY } from "../../src/lib/spine/copy";
import { SLOTS, stageOfSlot, type SlotDef } from "../../src/lib/spine/country_slots";
import { preflight } from "./preflight.mjs";
import { pageRenders, describeRenders, missingLine } from "../lib/page_renders.mjs";

/* THE GROUND FIRST (sys:harness-preflight, run 24): the site root, free memory printed; a wrong ground stops here with the remedy. */
preflight({ name: "census" });

const ROOT = "src/components/spine";
/* THREE FOLDERS HOLD ARCHETYPES, NONE A PAGE (2026-09-25): archetypes/, and since that day charts/ (the four chart forms) and
   sections/ (the page-agnostic sections he asked for that night, AgeMix, FirstYears and the rest). Walked as pages, a section's own
   Box counted as a section of a page called "sections", and a view that seated one printed it on the kit ("kit", beside a
   component that stamps `data-archetype` like any other); read as archetypes, the country's `age-mix` prints as AgeMix. The
   coverage gate skips the same three (scripts/verify_archetype_coverage.ts, SKIP_DIRS). */
const ARCHETYPE_FOLDERS = ["archetypes", "charts", "sections", "interact"];
const SKIP_DIRS = new Set(ARCHETYPE_FOLDERS);
const SKIP_FILES = new Set(["kit.tsx", "shell.tsx", "marks.tsx", "forms-v2.tsx", "motion.tsx"]);
const ARCHETYPE_DIR = `${ROOT}/archetypes`;
const ARCHETYPE_DIRS = ARCHETYPE_FOLDERS.map((f) => `${ROOT}/${f}`);

/* THE ARCHETYPES, READ FROM THEIR FOLDER (the header says why): every exported
   component whose body stamps `data-archetype`; card-owning where the body
   renders a `<Box` or stamps `data-block` itself. */
function readArchetypes(): { names: Set<string>; cardOwning: Set<string> } {
  const names = new Set<string>();
  const cardOwning = new Set<string>();
  const bodies: Array<{ name: string; body: string }> = [];
  for (const dir of ARCHETYPE_DIRS) for (const file of readdirSync(dir).sort()) {
    if (!file.endsWith(".tsx") || file === "stories.tsx") continue;
    const src = readFileSync(join(dir, file), "utf8");
    const starts: Array<{ name: string; at: number }> = [];
    const re = /export function ([A-Z]\w*)\s*\(/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) starts.push({ name: m[1], at: m.index });
    starts.forEach((s, i) => {
      const body = src.slice(s.at, i + 1 < starts.length ? starts[i + 1].at : src.length);
      bodies.push({ name: s.name, body });
      if (!/data-archetype=["{]/.test(body)) return;
      names.add(s.name);
      if (/<Box\b/.test(body) || /data-block/.test(body)) cardOwning.add(s.name);
    });
  }
  /* A CARD WHOSE DRAWING IS ANOTHER ARCHETYPE'S (2026-09-26): FirstYears draws its card's Box and hands the curve, the figure and
     the region's choice to the region lever (interact/SurvivalCurve.tsx), which stamps `survival-curve`; read only for its own
     stamp, the card stopped being an archetype and the census lost the United Kingdom's first-years block. A component of these
     folders that renders a Box and draws an archetype of these folders is a card-owning archetype too. */
  for (const { name, body } of bodies) {
    if (names.has(name) || !/<Box\b/.test(body)) continue;
    if ([...names].some((a) => new RegExp(`<${a}\\b`).test(body))) { names.add(name); cardOwning.add(name); }
  }
  return { names, cardOwning };
}
const { names: ARCHETYPES, cardOwning: CARD_OWNING } = readArchetypes();
/* The page order is the loud-seats reader's list, so the census and the ledger name the same six pages. */
const PAGE_ORDER: readonly string[] = SPINE_PAGES;
const START = "<!-- census:start -->";
const END = "<!-- census:end -->";
const WRITE = process.argv.includes("--write");
const CHECK = process.argv.includes("--check");
const PAGES_PATH = process.argv.find((a) => a.startsWith("--pages="))?.slice("--pages=".length) ?? resolve(process.cwd(), "..", "design", "loop", "build", "PAGES.md");
/* THE IN-REPO COPY (plan step 24, 2026-09-17). The loop's PAGES.md lives in the
   other repo, which Vercel does not have, so a chain gate that read it would
   exit 2 on every deploy. The census therefore also writes the generated block
   to a tracked file inside this repo, and the chain gate (`--check`) reads THAT
   file and never the sibling repo. `--write` writes both when the sibling
   exists and only the in-repo copy when it does not. The loop's PAGES.md is a
   convenience view; the in-repo file is what the gate defends. */
const CENSUS_PATH = resolve(process.cwd(), "docs", "loop", "CENSUS.md");
const NL = String.fromCharCode(10);

type Section = { page: string; file: string; id: string; component: string; kicker: string; archetype: string; builder: string; at: number };
/** One section in all its states: the rows of a page that share an id, merged (the header's ONE SECTION, ONE ROW). */
type Row = { page: string; id: string; files: string[]; components: string[]; kicker: string; forms: string[]; builder: string };

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name).replace(/\\/g, "/");
    if (statSync(full).isDirectory()) { if (!SKIP_DIRS.has(name)) walk(full, out); continue; }
    if (name.endsWith(".tsx") && !SKIP_FILES.has(name)) out.push(full);
  }
  return out;
}

function pageOf(file: string): string {
  const base = basename(file);
  if (base.startsWith("how-to")) return "howto";
  return file.split("/")[3];
}

/** `const C = COPY.countryExit;` in a component's own text: the local names that stand for a COPY path. */
function copyAliases(scope: string): Map<string, string> {
  const out = new Map<string, string>();
  const re = /\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*(COPY(?:\.\w+)+)\s*;/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(scope))) out.set(m[1], m[2]);
  return out;
}

function resolveCopy(expr: string, aliases: Map<string, string> = new Map()): string | null {
  let e = expr.trim();
  /* A KICKER THAT DEPENDS ON THE CARD'S STATE (2026-09-26, the cost split titled "Costs and margin" where it draws the costs
     alone): `cond ? COPY.a : COPY.b` prints both titles, the usual one first, rather than the expression. */
  const tern = /^[^?]+\?\s*(COPY(?:\.\w+)+)\s*:\s*(COPY(?:\.\w+)+)$/.exec(e);
  if (tern) {
    const a = resolveCopy(tern[1], aliases), b = resolveCopy(tern[2], aliases);
    if (a && b) return `${b} / ${a}`;
  }
  /* A LOCAL ALIAS (`C.kicker` with `const C = COPY.countryExit`) resolves
     through the component's own text; the exit card printed "C.kicker". */
  const head = /^([A-Za-z_$][\w$]*)((?:\.\w+)*)$/.exec(e);
  if (head && head[1] !== "COPY" && aliases.has(head[1])) e = `${aliases.get(head[1])}${head[2]}`;
  const m = /^COPY((?:\.\w+)+)$/.exec(e);
  if (!m) return null;
  let cur: unknown = COPY;
  for (const key of m[1].split(".").filter(Boolean)) {
    if (cur && typeof cur === "object" && key in (cur as Record<string, unknown>)) cur = (cur as Record<string, unknown>)[key];
    else return null;
  }
  return typeof cur === "string" ? cur : null;
}

function kickerOf(block: string, aliases: Map<string, string> = new Map()): string {
  /* A kicker expression may hold a template with `${...}` inside it, so the
     braces are matched one level deep (the hood's `Open a trade in ${cityName}`
     printed cut at its inner brace on the first run). */
  const rail = /<(?:Rail|WideRail)\b[^>]*\bkicker=(?:"([^"]*)"|\{((?:[^{}]|\{[^{}]*\})*)\})/.exec(block);
  if (rail) {
    if (rail[1] != null) return rail[1];
    const expr = rail[2].trim();
    return resolveCopy(expr, aliases) ?? expr.replace(/^`|`$/g, "");
  }
  const head = /<(?:Head|WideRail)\b[^>]*>([\s\S]*?)<\/(?:Head|WideRail)>/.exec(block);
  if (head) {
    const inner = head[1].replace(/\{\s*(COPY(?:\.\w+)+)\s*\}/g, (_m, e) => resolveCopy(e, aliases) ?? e).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (inner) return inner;
  }
  return "";
}

/**
 * The index just past the `>` that ends the JSX opening tag starting at
 * `start` (its `<`), or -1. Braces and strings are skipped, so a prop's
 * arrow (`=>`), a comparison, or JSX nested in a prop never ends the tag; a
 * template literal's `${...}` is followed into and out of.
 */
function openTagEnd(src: string, start: number): number {
  let depth = 0;
  let quote: string | null = null;
  const templates: number[] = [];
  for (let i = start + 1; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === "\\") { i++; continue; }
      if (quote === "`" && c === "$" && src[i + 1] === "{") { templates.push(depth); depth++; i++; quote = null; continue; }
      if (c === quote) quote = null;
      continue;
    }
    if (c === "\"" || c === "'" || c === "`") { quote = c; continue; }
    if (c === "{") { depth++; continue; }
    if (c === "}") { depth--; if (templates.length && templates[templates.length - 1] === depth) { templates.pop(); quote = "`"; } continue; }
    if (c === ">" && depth === 0) return i + 1;
  }
  return -1;
}

/**
 * A prop at the tag's own level (never one inside a nested element's JSX):
 * `name="x"` as a string, `name={x}` as the expression inside the braces.
 */
function topProp(tag: string, name: string): { kind: "string" | "expr"; value: string } | null {
  let depth = 0;
  let quote: string | null = null;
  for (let i = 1; i < tag.length; i++) {
    const c = tag[i];
    if (quote) { if (c === "\\") { i++; continue; } if (c === quote) quote = null; continue; }
    if (c === "\"" || c === "'" || c === "`") { quote = c; continue; }
    if (c === "{") { depth++; continue; }
    if (c === "}") { depth--; continue; }
    if (depth !== 0 || !/\s/.test(tag[i - 1]) || !tag.startsWith(`${name}=`, i)) continue;
    const v = i + name.length + 1;
    if (tag[v] === "\"") { const e = tag.indexOf("\"", v + 1); return e === -1 ? null : { kind: "string", value: tag.slice(v + 1, e) }; }
    if (tag[v] === "{") {
      let d = 0;
      let q: string | null = null;
      for (let j = v; j < tag.length; j++) {
        const x = tag[j];
        if (q) { if (x === "\\") { j++; continue; } if (x === q) q = null; continue; }
        if (x === "\"" || x === "'" || x === "`") { q = x; continue; }
        if (x === "{") d++;
        else if (x === "}" && --d === 0) return { kind: "expr", value: tag.slice(v + 1, j).trim() };
      }
    }
    return null;
  }
  return null;
}

/** The end of the JSX element whose opening tag spans [start, tagEnd): past its matching `</Box>`, nesting counted; the tag's own end when it closes itself. */
function boxEnd(src: string, start: number, tagEnd: number): number {
  if (/\/\s*>$/.test(src.slice(start, tagEnd))) return tagEnd;
  let depth = 1;
  const re = /<Box\b|<\/Box>/g;
  re.lastIndex = tagEnd;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m[0] === "</Box>") { if (--depth === 0) return m.index + m[0].length; continue; }
    const e = openTagEnd(src, m.index);
    if (e !== -1 && !/\/\s*>$/.test(src.slice(m.index, e))) depth++;
  }
  return src.length;
}

/** An id prop resolved as the render stamps it: a literal, or a bare prop name's literal default in the component's own signature. */
function resolveId(prop: { kind: "string" | "expr"; value: string } | null, signature: string): string | null {
  if (!prop) return null;
  if (prop.kind === "string") return prop.value;
  const bare = prop.value.replace(/^`|`$/g, "");
  if (/^[a-z_$][\w$]*$/i.test(prop.value)) {
    const def = new RegExp(`\\b${prop.value}\\s*=\\s*"([^"]+)"`).exec(signature);
    if (def) return def[1];
  }
  return bare;
}

/** The names a file imports from the archetype folders (archetypes, charts, sections and interact, which holds the survival curve), as local names. */
function importedFromArchetypeFolders(src: string): string[] {
  const out: string[] = [];
  const importRe = /import\s*\{([^}]*)\}\s*from\s*"(?:@\/components\/spine\/(?:archetypes|charts|sections|interact)\/[^"]+|\.\.?\/(?:[^"]*\/)?(?:archetypes|charts|sections|interact)\/[^"]+)"/g;
  let im: RegExpExecArray | null;
  while ((im = importRe.exec(src))) for (const name of im[1].split(",")) { const n = name.trim().split(/\s+as\s+/).pop()?.trim(); if (n) out.push(n); }
  return out;
}

/* THE COUNTRY PAGE'S SLOTS ARE ROWS OF THE REGISTRY (plan 2026-10-13 country-page-journey; the census after the merge with the rhythm plan).
   The country view draws every slot through one frame, `<Box id={def.domId}>` with `def = slotDef(model.id)`, and a few through their own
   (`def = slotDef("margins")`, "peers", "close"). Read as source, that id is the text `def.domId`, so the census printed ONE row for the whole
   page (and the block check, which holds the renders to the census, read 42 blocks it could not see). The registry (src/lib/spine/country_slots.ts)
   is data, so the census reads it: a frame whose `def` is a literal slot is that slot's row, under the registry's own DOM id and heading; a
   frame whose `def` is any other expression stands for every slot of the registry (stages 2 to 7 for the page's one frame, stages 2 to 6 for the
   locked card, which locks every slot after a stage's first), each its own row, carrying the stage component that draws it (`<Pascal id>Slot`,
   read from the folder for its first archetype), the builder plan.ts asks for it, and its answer type. BLIND SPOT: a slot whose stage
   component does not follow the `<Pascal id>Slot` name prints the frame's own form (FactRows), and a slot the registry gains is a row the day it
   lands; whether the page draws it is the block check's reading of the render. */
const EVERY = "slot:every";
function registrySlot(id: string | null, scope: string): SlotDef | typeof EVERY | null {
  if (!id) return null;
  const lit = /^slotDef\(\s*"([a-z-]+)"\s*\)\.domId$/.exec(id);
  const viaDef = id === "def.domId" ? /\bconst\s+def\s*=\s*slotDef\(\s*(?:"([a-z-]+)"|[^)]*)\)/.exec(scope) : null;
  const key = lit?.[1] ?? viaDef?.[1];
  if (key) return SLOTS.find((x) => x.id === key) ?? null;
  return viaDef ? EVERY : null;
}
/** The builder plan.ts asks for each slot: `const x = buildXSlot(...); if (x) slots.push({ id: "x", ...`. Read from its code alone
 *  (scripts/lib/strip_comments), so a commented-out or quoted call in plan.ts names no builder. */
const PLAN_BUILDERS: Map<string, string> = (() => {
  const out = new Map<string, string>();
  const text = stripCommentLines(readFileSync("src/lib/spine/slots/plan.ts", "utf8").split(String.fromCharCode(13)).join("").split(NL)).join(NL);
  for (const m of text.matchAll(/\b(build\w+)\([^)]*\);\s*if \(\w+\) slots\.push\(\{ id: "([a-z-]+)"/g)) out.set(m[2], m[1]);
  return out;
})();
const pascal = (id: string) => id.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");

function sectionsOf(file: string): Section[] {
  const raw = readFileSync(file, "utf8").split(String.fromCharCode(13)).join("");
  const src = stripCommentLines(raw.split(NL)).join(NL);
  const imported = new Set<string>();
  for (const name of importedFromArchetypeFolders(src)) imported.add(name);
  const fns: Array<{ name: string; at: number }> = [];
  const fnRe = /(?:export\s+)?function\s+([A-Z]\w*)\s*\(/g;
  let fm: RegExpExecArray | null;
  while ((fm = fnRe.exec(src))) fns.push({ name: fm[1], at: fm.index });
  const fnAt = (at: number) => [...fns].reverse().find((f) => f.at < at);
  /* A PROP ID WITH A LITERAL DEFAULT IS THE SEAT'S ID (plan step 33's second
     dispatch, 2026-09-18): a card drawn once for the page and the stories
     takes `id` as a prop (cell/turn-one.tsx, `id = "permits"`), the page
     passing nothing and a story its own key; the census reads the default
     from the component's own signature, so the row names the seat the page
     draws. A prop with no literal default prints as written, which is the
     fault it was. */
  const signatureOf = (fn: { at: number } | undefined) => (fn ? src.slice(fn.at, src.indexOf(")", fn.at) + 1) : "");
  const drawn = [...ARCHETYPES].filter((a) => imported.has(a));
  /* THE ARCHETYPE OF A CARD is the first one drawn inside it, by position: the
     harness reads a card's form as its first `[data-archetype]` in document
     order, and the census reads it the same way. */
  const firstArchetype = (text: string): string => {
    let best: { a: string; at: number } | null = null;
    for (const a of drawn) {
      const i = text.search(new RegExp(`<${a}\\b`));
      if (i !== -1 && (!best || i < best.at)) best = { a, at: i };
    }
    return best ? best.a : "kit";
  };
  const out: Section[] = [];
  const boxSpans: Array<[number, number]> = [];
  const boxRe = /<Box\b/g;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = boxRe.exec(src))) {
    n++;
    const at = m.index;
    const tagEnd = openTagEnd(src, at);
    if (tagEnd === -1) continue;
    const tag = src.slice(at, tagEnd);
    const end = boxEnd(src, at, tagEnd);
    boxSpans.push([at, end]);
    const block = src.slice(at, end);
    const fn = fnAt(at);
    const scope = src.slice(fn ? fn.at : 0, end);
    /* THE ID THE RENDER STAMPS (kit.tsx's Box): a literal `data-block` wins,
       then the id, then `#n`; the country's `character-people` and `locals`
       printed as `#4` and `#8` while the page stamped their names. */
    const blockProp = topProp(tag, "data-block");
    let id = (blockProp?.kind === "string" ? blockProp.value : null) ?? resolveId(topProp(tag, "id"), signatureOf(fn)) ?? `#${n}`;
    const reg = registrySlot(id, scope);
    if (reg && reg !== EVERY) id = reg.domId;
    /* A Box that DECLARES its form (`data-form="door"`) prints the declaration
       beside the tag it stands on, so the census tells a door card from the
       terminus it is built on (MODEL.md 8.2, `19 compare`). */
    const declared = topProp(tag, "data-form");
    const form = firstArchetype(block);
    const archetype = declared?.kind === "string" ? `${form} (${declared.value})` : form;
    const builder = /\b(build[A-Z]\w*)\s*\(/.exec(scope)?.[1] ?? "";
    const kicker = kickerOf(block, copyAliases(scope));
    out.push({ page: pageOf(file), file: basename(file), id: reg === EVERY ? EVERY : id, component: fn?.name ?? "", kicker: reg && reg !== EVERY && kicker === "def.heading" ? reg.heading : kicker, archetype, builder: reg && reg !== EVERY ? PLAN_BUILDERS.get(reg.id) ?? builder : builder, at });
  }
  /* A KIT VIEW'S CARDS (a view that exports LOUD_SEATS_KIT: the industry page, src/components/spine/industry/kit3-view.tsx, v6 from
     2026-10-21 (his "v6 is the approved industry target."), v7 in its place since (FOUNDER-VERDICTS, "v7 approved")): it draws no Box; its sections are its own `Sub`
     (v4's `Card`) called with a literal id, and cards stamped with a literal `data-block` (the hero's answer card). Each is a section of
     its page, its kicker the call's `title` as written, its builder the one whose type the view reads (buildIndustryV7, else V4). */
  if (/export\s+const\s+LOUD_SEATS_KIT\b/.test(src)) {
    const kitBuilder = /\bIndustryV7\b/.test(src) ? "buildIndustryV7" : "buildIndustryV4";
    const kitRe = /<(?:Card|Sub)\s+id="([a-z][a-z0-9-]*)"|<(?:div|article)\b[^>]*?\sdata-block="([a-z][a-z0-9-]*)"/g;
    let km: RegExpExecArray | null;
    while ((km = kitRe.exec(src))) {
      const at = km.index;
      const tagEnd = openTagEnd(src, at);
      const tag = tagEnd === -1 ? "" : src.slice(at, tagEnd);
      const fn = fnAt(at);
      const title = /\btitle=\{([^}]*)\}/.exec(tag)?.[1] ?? "";
      out.push({ page: pageOf(file), file: basename(file), id: km[1] ?? km[2], component: fn?.name ?? "", kicker: title, archetype: "kit", builder: kitBuilder, at });
    }
  }
  /* THE CARDS AN ARCHETYPE DRAWS (the header's SECTION): a card-owning
     archetype called with an id, outside every Box of this file. Without an
     id it is a cell of a band or a piece of a card, never a block. */
  const calls: Array<Section & { fnAt: number }> = [];
  for (const a of drawn) {
    if (!CARD_OWNING.has(a)) continue;
    const callRe = new RegExp(`<${a}\\b`, "g");
    while ((m = callRe.exec(src))) {
      const at = m.index;
      if (boxSpans.some(([s, e]) => at > s && at < e)) continue;
      const tagEnd = openTagEnd(src, at);
      if (tagEnd === -1) continue;
      const tag = src.slice(at, tagEnd);
      const fn = fnAt(at);
      let id = resolveId(topProp(tag, "id"), signatureOf(fn));
      if (id == null) continue;
      const scope = src.slice(fn ? fn.at : 0, tagEnd);
      const reg = registrySlot(id, scope);
      if (reg && reg !== EVERY) id = reg.domId;
      const k = topProp(tag, "kicker");
      const kickerText = !k ? "" : k.kind === "string" ? k.value : resolveCopy(k.value, copyAliases(scope)) ?? k.value.replace(/^`|`$/g, "");
      const kicker = reg && reg !== EVERY && kickerText === "def.heading" ? reg.heading : kickerText;
      /* THE BUILDER OF A CALL is the one its own props call (`board={buildHeroBoard(iso2)}`); failing that, the enclosing component's first,
         but only when that component draws this one card: a page body that seats a dozen would name whichever builder it called first. */
      const builder = (reg && reg !== EVERY ? PLAN_BUILDERS.get(reg.id) : null) ?? /\b(build[A-Z]\w*)\s*\(/.exec(tag)?.[1] ?? "";
      calls.push({ page: pageOf(file), file: basename(file), id: reg === EVERY ? EVERY : id, component: fn?.name ?? "", kicker, archetype: a, builder, at, fnAt: fn ? fn.at : -1 });
    }
  }
  for (const c of calls) {
    if (c.builder) continue;
    const fn = fns.find((f) => f.at === c.fnAt);
    if (!fn) continue;
    const next = fns.find((f) => f.at > fn.at);
    const idsHere = new Set([...out, ...calls].filter((s) => s.at > fn.at && (!next || s.at < next.at)).map((s) => s.id));
    if (idsHere.size === 1) c.builder = /\b(build[A-Z]\w*)\s*\(/.exec(src.slice(fn.at, next ? next.at : src.length))?.[1] ?? "";
  }
  out.push(...calls.map(({ fnAt: _drop, ...s }) => s));
  return out.sort((x, y) => x.at - y.at);
}

/* A CARD ONE PAGE BORROWS FROM ANOTHER (2026-09-24): the industry page draws
   the trade page's LastsCard, SplitCard, CloseCard and MixCard (the last as
   ChannelsCard), imported or re-exported from src/components/spine/cell/, and
   a census keyed by folder filed all four under the trade page alone, so the
   industry render drew four blocks the census had no industry row for. A call
   in one page's file to a component whose definition, through its import and
   any re-export, sits in ANOTHER page's folder counts that component's
   sections for the calling page too, under the id the call site stamps (its
   own `id` prop wins over the card's default: ChannelsCard stamps "channels",
   not MixCard's "mix"). */
const folderOf = (file: string) => file.split("/")[3];
const specToFile = (from: string, spec: string): string | null => {
  const base = spec.startsWith("@/") ? `src/${spec.slice(2)}` : spec.startsWith(".") ? join(dirname(from), spec).replace(/\\/g, "/") : null;
  if (!base || !base.startsWith(`${ROOT}/`) || ARCHETYPE_DIRS.some((d) => base.startsWith(`${d}/`))) return null;
  const file = base.endsWith(".tsx") ? base : `${base}.tsx`;
  return existsSync(file) ? file : null;
};
const sourceOf = (file: string) => stripCommentLines(readFileSync(file, "utf8").split(String.fromCharCode(13)).join("").split(NL)).join(NL);
/** Where an exported name is DEFINED, following `export { A as B } from "..."` up to three hops; null when it is not a component of the spine folders. */
function definitionOf(file: string, name: string, hops = 0): { file: string; name: string } | null {
  const src = sourceOf(file);
  if (new RegExp(`\\bfunction\\s+${name}\\s*\\(`).test(src)) return { file, name };
  if (hops >= 3) return null;
  const re = /export\s*\{([^}]*)\}\s*from\s*"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    for (const part of m[1].split(",")) {
      const [orig, alias] = part.trim().split(/\s+as\s+/).map((x) => x.trim());
      if ((alias ?? orig) !== name) continue;
      const target = specToFile(file, m[2]);
      return target ? definitionOf(target, orig, hops + 1) : null;
    }
  }
  return null;
}
function borrowedOf(file: string, own: Map<string, Section[]>): Section[] {
  const src = sourceOf(file);
  const out: Section[] = [];
  const fns: Array<{ name: string; at: number }> = [];
  const fnRe = /(?:export\s+)?function\s+([A-Z]\w*)\s*\(/g;
  let fm: RegExpExecArray | null;
  while ((fm = fnRe.exec(src))) fns.push({ name: fm[1], at: fm.index });
  const importRe = /import\s*\{([^}]*)\}\s*from\s*"([^"]+)"/g;
  let im: RegExpExecArray | null;
  while ((im = importRe.exec(src))) {
    const target = specToFile(file, im[2]);
    if (!target) continue;
    for (const part of im[1].split(",")) {
      const [orig, alias] = part.trim().replace(/^type\s+/, "").split(/\s+as\s+/).map((x) => x.trim());
      if (!orig || !/^[A-Z]/.test(orig)) continue;
      const local = alias ?? orig;
      const def = definitionOf(target, orig);
      if (!def || pageOf(def.file) === pageOf(file)) continue;
      const theirs = (own.get(def.file) ?? []).filter((s) => s.component === def.name);
      if (theirs.length === 0) continue;
      const callRe = new RegExp(`<${local}\\b`, "g");
      let m: RegExpExecArray | null;
      while ((m = callRe.exec(src))) {
        const at = m.index;
        const tagEnd = openTagEnd(src, at);
        if (tagEnd === -1) continue;
        const fn = [...fns].reverse().find((f) => f.at < at);
        const signature = fn ? src.slice(fn.at, src.indexOf(")", fn.at) + 1) : "";
        const rawId = resolveId(topProp(src.slice(at, tagEnd), "id"), signature);
        /* A CALL WITH A SLOT'S REGISTRY ID (the country's locked card): the slot's row, or every slot's (registrySlot). */
        const reg = registrySlot(rawId, src.slice(fn ? fn.at : 0, tagEnd));
        const callId = reg === EVERY ? EVERY : reg ? reg.domId : rawId;
        for (const s of theirs) {
          out.push({ ...s, page: pageOf(file), file: `${s.file} (${folderOf(def.file)})`, id: callId ?? s.id, component: local === def.name ? local : `${local} (${def.name})`, kicker: reg && reg !== EVERY ? reg.heading : s.kicker, at });
        }
      }
    }
  }
  return out;
}

/** ONE SECTION, ONE ROW (the header): a page's rows that share an id are one section in its states, its forms joined in the order they appear. `#n` rows are boxes without a name and stand alone. */
function mergeRows(sections: Section[]): Row[] {
  const out: Row[] = [];
  const byKey = new Map<string, Row>();
  for (const s of sections) {
    const fresh = (): Row => ({ page: s.page, id: s.id, files: [s.file], components: s.component ? [s.component] : [], kicker: s.kicker, forms: [s.archetype], builder: s.builder });
    if (s.id.startsWith("#")) { out.push(fresh()); continue; }
    const key = `${s.page} ${s.id}`;
    const have = byKey.get(key);
    if (!have) { const r = fresh(); byKey.set(key, r); out.push(r); continue; }
    if (!have.files.includes(s.file)) have.files.push(s.file);
    if (s.component && !have.components.includes(s.component)) have.components.push(s.component);
    if (!have.forms.includes(s.archetype)) have.forms.push(s.archetype);
    if (!have.kicker && s.kicker) have.kicker = s.kicker;
    if (!have.builder && s.builder) have.builder = s.builder;
  }
  return out;
}

const esc = (s: string) => s.replace(/\|/g, "\\|");
/* A DECLARED FORM DOES NOT PUT A KIT CARD ON AN ARCHETYPE (plan step 32's
   fifth dispatch, 2026-09-18): the city's trade rows declare
   `data-form="trade-rows"` on a kit Box and print as "kit (trade-rows)", and
   the count read that as an archetype because it tested the printed string
   against the bare word. The count reads the tag the declaration decorates. */
const onKit = (a: string) => a === "kit" || a.startsWith("kit (");
/* THE LEDGER'S ROWS, one page: the count line, then the three seats as declared. A cell never holds a pipe or a line break; the declaration is one line each. */
/* LOUD COUNTS LIT AND FIELD (plan 2026-10-10, the home reformed to ship, Task 5): the home's band is a loud moment with no accent figure,
   so the count is loudCount; a page with no FIELD seat prints the line it printed before. */
function ledger(d: LoudDeclaration): string[] {
  const loud = loudCount(d.seats);
  const field = d.seats.some((s) => s.state === "FIELD") ? "; a FIELD seat is lit by its terracotta zone, never by an accent figure" : "";
  const out = [`Loud today: ${loud} of 3, as \`LOUD_SEATS\` in ${basename(d.file)} declares (a LIT seat is unlit on a render whose figure is withheld${field}; the loud-seats gate reads that off the render).`, "", "| seat | card | figure | state | condition |", "|---|---|---|---|---|"];
  for (const s of d.seats) out.push(`| ${s.seat} | ${esc(s.card)}${s.id ? ` (\`#${s.id}\`)` : ""} | ${esc(s.figure)} | ${s.state} | ${esc(s.condition.replace(/\s+/g, " "))} |`);
  return out;
}
/* A row stands on the kit where any of its forms does: a section whose drawn card is hand-built is not on an archetype because its seat is. */
const rowOnKit = (r: Row) => r.forms.some(onKit);
function render(rows: Row[], files: string[], loud: Map<string, LoudDeclaration>): string {
  const onArch = rows.filter((r) => !rowOnKit(r)).length;
  const litTotal = [...loud.values()].reduce((n, d) => n + litCount(d.seats), 0);
  const fieldTotal = [...loud.values()].reduce((n, d) => n + d.seats.filter((s) => s.state === "FIELD").length, 0);
  const lines: string[] = [START, `Generated by \`npm run census -- --write\` from \`src/components/spine\`; do not edit between the markers. ${rows.length} sections in ${files.length} files: ${onArch} on archetypes, ${rows.length - onArch} on the kit. A section is a block: a view's \`<Box\`, or a card an archetype draws itself, called with an id; its id is what the render stamps (\`data-block\`, then the id); rows that share an id are one section in its states, their forms joined by "or". A section id of \`#n\` is a box without a name, counted in file order, the coverage gate's own key. The chain's census gate holds every block the harness renders draw to a row here. The loud-moments ledger under each page (plan step 40): the three seats as the page's view declares them, ${litTotal} declared LIT${fieldTotal ? ` and ${fieldTotal} FIELD` : ""} across ${loud.size} pages, three a page or fewer (MODEL.md PART 6).`, ""];
  for (const page of PAGE_ORDER) {
    const pageRows = rows.filter((r) => r.page === page);
    if (pageRows.length === 0) continue;
    const pageFiles = [...new Set(pageRows.flatMap((r) => r.files))];
    const arch = pageRows.filter((r) => !rowOnKit(r)).length;
    lines.push(`### ${page} (${pageFiles.join(", ")}): ${pageRows.length} sections, ${arch} on archetypes`, "", "| section id | component | kicker | archetype | builder |", "|---|---|---|---|---|");
    for (const r of pageRows) lines.push(`| ${esc(r.id)} | ${esc(r.components.join(" / "))} | ${esc(r.kicker)} | ${esc(r.forms.join(" or "))} | ${esc(r.builder)} |`);
    lines.push("");
    const d = loud.get(page);
    if (d) lines.push(...ledger(d), "");
  }
  lines.push(END);
  return lines.join(NL);
}

/** The stage component that draws a slot (`<Pascal id>Slot` in the country folder) and the first archetype it draws, read as the census reads a card; null when no such component is found. */
function stageComponent(slot: SlotDef, files: string[]): { name: string; archetype: string | null } | null {
  const name = `${pascal(slot.id)}Slot`;
  for (const f of files) {
    if (pageOf(f) !== "country") continue;
    const src = sourceOf(f);
    const m = new RegExp(`(?:export\\s+)?function\\s+${name}\\s*\\(`).exec(src);
    if (!m) continue;
    const rest = src.slice(m.index + m[0].length);
    const next = rest.search(/\n(?:export\s+)?function\s+[A-Z]\w*\s*\(/);
    const body = src.slice(m.index, m.index + m[0].length + (next === -1 ? rest.length : next));
    let best: { a: string; at: number } | null = null;
    for (const a of importedFromArchetypeFolders(src).filter((x) => ARCHETYPES.has(x))) {
      const i = body.search(new RegExp(`<${a}\\b`));
      if (i !== -1 && (!best || i < best.at)) best = { a, at: i };
    }
    return { name, archetype: best ? best.a : null };
  }
  return null;
}

/** A frame that stands for every slot of the registry (registrySlot's EVERY) becomes one section a slot: the page's one frame the slots whose own Box is not written elsewhere, the locked card the slots of stages 2 to 6 (locks.ts: each stage's first slot stays open and every later one locks, the masthead and the close stand outside). */
function expandSlots(sections: Section[], files: string[]): Section[] {
  const literal = new Set(sections.filter((s) => s.page === "country" && s.id !== EVERY && !s.id.startsWith("#")).map((s) => s.id));
  const out: Section[] = [];
  for (const s of sections) {
    if (s.id !== EVERY) { out.push(s); continue; }
    const locked = s.component.startsWith("LockedSection");
    const seen = new Set<string>();
    for (const slot of SLOTS) {
      const stage = stageOfSlot(slot.id).n;
      if (locked ? stage < 2 || stage > 6 : stage < 2) continue;
      if (!locked && literal.has(slot.domId)) continue;
      if (seen.has(slot.domId)) continue;
      seen.add(slot.domId);
      const drawn = locked ? null : stageComponent(slot, files);
      out.push({ ...s, id: slot.domId, component: locked ? s.component : drawn?.name ?? s.component, kicker: slot.heading, archetype: locked ? "kit" : drawn?.archetype ?? s.archetype, builder: PLAN_BUILDERS.get(slot.id) ?? "", at: s.at + slot.n / 1000 });
    }
  }
  return out;
}

const files = walk(ROOT);
const own = new Map(files.map((f) => [f, sectionsOf(f)]));
/* Each file's own sections and the cards it borrows, in the order they stand in the file; the frames that stand for every slot of the registry one section a slot. */
const merged = mergeRows(expandSlots(files.flatMap((f) => [...own.get(f)!, ...borrowedOf(f, own)].sort((a, b) => a.at - b.at)), files));
/* THE COUNTRY'S ROWS STAND IN THE REGISTRY'S ORDER (the page's own order), whichever file draws them. */
const slotOrder = (id: string) => { const i = SLOTS.findIndex((x) => x.domId === id); return i === -1 ? 1000 : i; };
const countryAt = merged.flatMap((r, i) => (r.page === "country" ? [i] : []));
const countrySorted = countryAt.map((i) => merged[i]).sort((a, b) => slotOrder(a.id) - slotOrder(b.id));
const rows = merged.map((r, i) => (r.page === "country" ? countrySorted[countryAt.indexOf(i)] : r));

/* THE CENSUS HELD TO THE PAGE (the header's `--check`): every block each fresh
   render draws, its `[data-block]` ids (the unit BLOCK FLOOR counts), must be
   a row of its page's census. A row no render draws is a branch that page
   does not take today, printed and never redded. */
function blockCheck(): { lines: string[]; reds: string[] } {
  const lines: string[] = [];
  const reds: string[] = [];
  const entries = pageRenders({ kinds: ["fresh"] });
  lines.push(`census: ${describeRenders(entries)}`);
  for (const e of entries) {
    if (!e.exists) { reds.push(missingLine("census-fresh", e)); continue; }
    const html = readFileSync(e.path, "utf8");
    const drawnIds = [...new Set([...html.matchAll(/data-block="([^"]+)"/g)].map((x) => x[1]))];
    const have = new Set(rows.filter((r) => r.page === e.surface).map((r) => r.id));
    const unseen = drawnIds.filter((b) => !have.has(b));
    const branches = [...have].filter((id) => !id.startsWith("#") && !drawnIds.includes(id));
    lines.push(`census: ${e.name}: ${drawnIds.length} blocks drawn, ${drawnIds.length - unseen.length} in the census's ${have.size} ${e.surface} rows${branches.length ? `; not drawn on this render: ${branches.join(", ")}` : ""}`);
    for (const b of unseen) reds.push(`x census-fresh ${e.path}: the render draws the block "${b}" and the census has no ${e.surface} row for it. Remedy: read how the card is written in src/components/spine/${e.surface === "howto" ? "country/how-to-view.tsx" : `${e.surface}/`} and teach census.ts to see it`);
  }
  return { lines, reds };
}
/* THE DECLARATIONS, read before anything is printed or written: a fault stops
   every mode with exit 1 and the file and line, so a stale block is never
   "refreshed" from a page that declares nothing. */
const loud = readLoudSeats(ROOT);
if (loud.faults.length) {
  console.log(`census: the loud-moments declarations cannot be read (${loud.faults.length} fault${loud.faults.length === 1 ? "" : "s"}); the ledger is not printed and nothing is written`);
  for (const f of loud.faults) console.log(`  ${f}`);
  process.exit(1);
}
const block = render(rows, files, loud.declarations);

/* --check: the chain gate. Reads only the in-repo copy; stale or missing is a red
   that names the command; the sibling repo is never touched. Then the census
   is held to the renders (blockCheck). */
if (CHECK) {
  if (!existsSync(CENSUS_PATH)) { console.log(`census-fresh: ${CENSUS_PATH} is missing; run \`npm run census -- --write\` and commit docs/loop/CENSUS.md`); process.exit(1); }
  const have = readFileSync(CENSUS_PATH, "utf8").split(String.fromCharCode(13)).join("").trim();
  if (have !== block.trim()) { console.log(`census-fresh: docs/loop/CENSUS.md is STALE against src/components/spine; run \`npm run census -- --write\` and commit it`); process.exit(1); }
  const check = blockCheck();
  for (const l of check.lines) console.log(l);
  if (check.reds.length) { for (const r of check.reds) console.log(r); console.log(`census-fresh: ${check.reds.length} block(s) drawn that the census cannot see, or a render missing`); process.exit(1); }
  console.log(`census-fresh: docs/loop/CENSUS.md matches the code (${rows.length} sections in ${files.length} files), and every block the renders draw is a row of it`);
  process.exit(0);
}

if (WRITE) {
  mkdirSync(dirname(CENSUS_PATH), { recursive: true });
  writeFileSync(CENSUS_PATH, block + NL, "utf8");
  console.log(`census: wrote ${rows.length} sections in ${files.length} files to ${CENSUS_PATH}`);
  for (const l of blockCheck().lines) console.log(l);
  if (!existsSync(PAGES_PATH)) { console.log(`census: no loop PAGES.md at ${PAGES_PATH}; the in-repo copy is written and that is the gated one`); process.exit(0); }
}
if (!existsSync(PAGES_PATH)) { console.error(`census: no PAGES.md at ${PAGES_PATH}`); process.exit(2); }
const pages = readFileSync(PAGES_PATH, "utf8").split(String.fromCharCode(13)).join("");
const a = pages.indexOf(START), b = pages.indexOf(END);
const hasMarkers = a !== -1 && b !== -1 && b > a;
const current = hasMarkers ? pages.slice(a, b + END.length) : null;

if (WRITE) {
  const next = hasMarkers ? pages.slice(0, a) + block + pages.slice(b + END.length) : pages.replace(/\s*$/, "") + NL + NL + "## The census (generated)" + NL + NL + block + NL;
  writeFileSync(PAGES_PATH, next, "utf8");
  console.log(`census: wrote ${rows.length} sections in ${files.length} files to ${PAGES_PATH}${hasMarkers ? "" : " (markers added at the end)"}`);
  process.exit(0);
}
console.log(block);
if (!hasMarkers) { console.log(`${NL}census: PAGES.md has no census markers; run \`npm run census -- --write\` once`); process.exit(1); }
if (current !== block) { console.log(`${NL}census: PAGES.md's census block is STALE; run \`npm run census -- --write\``); process.exit(1); }
console.log(`${NL}census: fresh (${rows.length} sections in ${files.length} files)`);
