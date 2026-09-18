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
 * usage: npx tsx scripts/harness/census.ts            prints the census and exits 1 when PAGES.md's block is stale
 *        npx tsx scripts/harness/census.ts --check    the chain gate: exits 1 when docs/loop/CENSUS.md (in-repo) is stale; never reads the other repo
 *        npx tsx scripts/harness/census.ts --write    writes the block between the markers in PAGES.md
 *        --pages=<path>  another PAGES.md (default ../design/loop/build/PAGES.md from the site root)
 *
 * BLIND SPOT: it reads source, not renders; a section drawn without a Box is
 * not a section to it, a kicker built from a template prints as its template,
 * and a builder called outside the enclosing component is not seen.
 */
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, basename, resolve, dirname } from "node:path";
import { stripCommentLines } from "../lib/strip_comments";
import { COPY } from "../../src/lib/spine/copy";
import { preflight } from "./preflight.mjs";

/* THE GROUND FIRST (sys:harness-preflight, run 24): the site root, free memory printed; a wrong ground stops here with the remedy. */
preflight({ name: "census" });

const ROOT = "src/components/spine";
const SKIP_DIRS = new Set(["archetypes"]);
const SKIP_FILES = new Set(["kit.tsx", "shell.tsx", "marks.tsx", "forms-v2.tsx", "motion.tsx"]);
const ARCHETYPES = ["AnswerCard", "KvGrid", "RankedBars", "CompareTable", "CardPager", "CityCards", "TiersTable", "RangeStrip", "SpectraTable", "NoteList", "Terminus", "PayBars", "IncomeBreakdown", "BentoBand", "MarkList", "DetailPanel"];
const PAGE_ORDER = ["country", "howto", "city", "hood", "cell", "industry"];
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

type Section = { page: string; file: string; id: string; component: string; kicker: string; archetype: string; builder: string };

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

function resolveCopy(expr: string): string | null {
  const m = /^COPY((?:\.\w+)+)$/.exec(expr.trim());
  if (!m) return null;
  let cur: unknown = COPY;
  for (const key of m[1].split(".").filter(Boolean)) {
    if (cur && typeof cur === "object" && key in (cur as Record<string, unknown>)) cur = (cur as Record<string, unknown>)[key];
    else return null;
  }
  return typeof cur === "string" ? cur : null;
}

function kickerOf(block: string): string {
  /* A kicker expression may hold a template with `${...}` inside it, so the
     braces are matched one level deep (the hood's `Open a trade in ${cityName}`
     printed cut at its inner brace on the first run). */
  const rail = /<(?:Rail|WideRail)\b[^>]*\bkicker=(?:"([^"]*)"|\{((?:[^{}]|\{[^{}]*\})*)\})/.exec(block);
  if (rail) {
    if (rail[1] != null) return rail[1];
    const expr = rail[2].trim();
    return resolveCopy(expr) ?? expr.replace(/^`|`$/g, "");
  }
  const head = /<(?:Head|WideRail)\b[^>]*>([\s\S]*?)<\/(?:Head|WideRail)>/.exec(block);
  if (head) {
    const inner = head[1].replace(/\{\s*(COPY(?:\.\w+)+)\s*\}/g, (_m, e) => resolveCopy(e) ?? e).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (inner) return inner;
  }
  return "";
}

function sectionsOf(file: string): Section[] {
  const raw = readFileSync(file, "utf8").split(String.fromCharCode(13)).join("");
  const src = stripCommentLines(raw.split(NL)).join(NL);
  const imported = new Set<string>();
  const importRe = /import\s*\{([^}]*)\}\s*from\s*"(?:@\/components\/spine\/archetypes\/[^"]+|\.\.?\/(?:[^"]*\/)?archetypes\/[^"]+)"/g;
  let im: RegExpExecArray | null;
  while ((im = importRe.exec(src))) for (const name of im[1].split(",")) { const n = name.trim().split(/\s+as\s+/).pop()?.trim(); if (n) imported.add(n); }
  const fns: Array<{ name: string; at: number }> = [];
  const fnRe = /(?:export\s+)?function\s+([A-Z]\w*)\s*\(/g;
  let fm: RegExpExecArray | null;
  while ((fm = fnRe.exec(src))) fns.push({ name: fm[1], at: fm.index });
  const out: Section[] = [];
  const re = /<Box\b([^>]*)>/g;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(src))) {
    n++;
    const idMatch = /\bid=(?:"([^"]+)"|\{`?([^}`]+)`?\})/.exec(m[1]);
    const end = src.indexOf("</Box>", m.index);
    const block = end === -1 ? src.slice(m.index) : src.slice(m.index, end);
    const fn = [...fns].reverse().find((f) => f.at < m!.index);
    /* A PROP ID WITH A LITERAL DEFAULT IS THE SEAT'S ID (plan step 33's second
       dispatch, 2026-09-18): a card drawn once for the page and the stories
       takes `id` as a prop (cell/turn-one.tsx, `id = "permits"`), the page
       passing nothing and a story its own key; the census reads the default
       from the component's own signature, so the row names the seat the page
       draws. A prop with no literal default prints as written, which is the
       fault it was. */
    let id = idMatch ? (idMatch[1] ?? idMatch[2]).trim() : `#${n}`;
    if (idMatch && idMatch[2] && /^[a-z_$][\w$]*$/i.test(id) && fn) {
      const signature = src.slice(fn.at, src.indexOf(")", fn.at) + 1);
      const def = new RegExp(`\\b${id}\\s*=\\s*"([^"]+)"`).exec(signature);
      if (def) id = def[1];
    }
    const scope = src.slice(fn ? fn.at : 0, end === -1 ? src.length : end);
    const tag = ARCHETYPES.find((a) => imported.has(a) && new RegExp(`<${a}\\b`).test(block)) ?? "kit";
    /* A Box that DECLARES its form (`data-form="door"`) prints the declaration
       beside the tag it stands on, so the census tells a door card from the
       terminus it is built on (MODEL.md 8.2, `19 compare`). */
    const declared = /\bdata-form="([^"]+)"/.exec(m[1])?.[1];
    const archetype = declared ? `${tag} (${declared})` : tag;
    const builder = /\b(build[A-Z]\w*)\s*\(/.exec(scope)?.[1] ?? "";
    out.push({ page: pageOf(file), file: basename(file), id, component: fn?.name ?? "", kicker: kickerOf(block), archetype, builder });
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
function render(sections: Section[], files: string[]): string {
  const onArch = sections.filter((s) => !onKit(s.archetype)).length;
  const lines: string[] = [START, `Generated by \`npm run census -- --write\` from \`src/components/spine\`; do not edit between the markers. ${sections.length} sections in ${files.length} files: ${onArch} on archetypes, ${sections.length - onArch} on the kit. A section id of \`#n\` is a box without an id, counted in file order, the coverage gate's own key.`, ""];
  for (const page of PAGE_ORDER) {
    const rows = sections.filter((s) => s.page === page);
    if (rows.length === 0) continue;
    const pageFiles = [...new Set(rows.map((r) => r.file))];
    const arch = rows.filter((r) => !onKit(r.archetype)).length;
    lines.push(`### ${page} (${pageFiles.join(", ")}): ${rows.length} sections, ${arch} on archetypes`, "", "| section id | component | kicker | archetype | builder |", "|---|---|---|---|---|");
    for (const r of rows) lines.push(`| ${esc(r.id)} | ${esc(r.component)} | ${esc(r.kicker)} | ${esc(r.archetype)} | ${esc(r.builder)} |`);
    lines.push("");
  }
  lines.push(END);
  return lines.join(NL);
}

const files = walk(ROOT);
const sections = files.flatMap(sectionsOf);
const block = render(sections, files);

/* --check: the chain gate. Reads only the in-repo copy; stale or missing is a red
   that names the command; the sibling repo is never touched. */
if (CHECK) {
  if (!existsSync(CENSUS_PATH)) { console.log(`census-fresh: ${CENSUS_PATH} is missing; run \`npm run census -- --write\` and commit docs/loop/CENSUS.md`); process.exit(1); }
  const have = readFileSync(CENSUS_PATH, "utf8").split(String.fromCharCode(13)).join("").trim();
  if (have !== block.trim()) { console.log(`census-fresh: docs/loop/CENSUS.md is STALE against src/components/spine; run \`npm run census -- --write\` and commit it`); process.exit(1); }
  console.log(`census-fresh: docs/loop/CENSUS.md matches the code (${sections.length} sections in ${files.length} files)`);
  process.exit(0);
}

if (WRITE) {
  mkdirSync(dirname(CENSUS_PATH), { recursive: true });
  writeFileSync(CENSUS_PATH, block + NL, "utf8");
  console.log(`census: wrote ${sections.length} sections in ${files.length} files to ${CENSUS_PATH}`);
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
  console.log(`census: wrote ${sections.length} sections in ${files.length} files to ${PAGES_PATH}${hasMarkers ? "" : " (markers added at the end)"}`);
  process.exit(0);
}
console.log(block);
if (!hasMarkers) { console.log(`${NL}census: PAGES.md has no census markers; run \`npm run census -- --write\` once`); process.exit(1); }
if (current !== block) { console.log(`${NL}census: PAGES.md's census block is STALE; run \`npm run census -- --write\``); process.exit(1); }
console.log(`${NL}census: fresh (${sections.length} sections in ${files.length} files)`);
