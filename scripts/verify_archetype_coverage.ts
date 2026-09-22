/**
 * verify_archetype_coverage , every section of every spine page is either on an
 * archetype or named, with a reason, in the exceptions file. The build loop's
 * system row of 2026-09-06 (run 9): the loop points sections at archetypes one
 * at a time, and this gate is the ratchet that stops a new section arriving
 * on the old kit unnoticed and stops an exception outliving its section.
 *
 * WHAT IT READS: every .tsx under src/components/spine/<page>/ except the
 * archetypes folder and the kit; in each, every `<Box` element and the JSX up
 * to its `</Box>` (Boxes do not nest). A section is COVERED when that block
 * contains an archetype component tag. A section is EXCEPTED when
 * data/archetypes/coverage_exceptions.json names it (file#id, or file#<n> for a
 * Box without an id, counted from 1 in file order) with a reason.
 *
 * RED when a section is neither covered nor excepted (a new section on the old
 * kit), and RED when an excepted section is now covered (a stale exception:
 * delete it, the set only shrinks). `--init` writes the exceptions for every
 * uncovered section that has none, with the reason "not yet on an archetype",
 * and is for the first commit only; never run it to clear a red.
 *
 * BLIND SPOT: it reads source, not renders; an archetype rendered through a
 * wrapper component the view imports is invisible to it and needs an
 * exception saying so. Sections drawn without a Box (the answer card wraps
 * its own) are not sections to this gate.
 */
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { stripCommentLines } from "./lib/strip_comments";

const ROOT = "src/components/spine";
const SKIP_DIRS = new Set(["archetypes"]);
const SKIP_FILES = new Set(["kit.tsx", "shell.tsx", "marks.tsx", "forms-v2.tsx"]);
/* HeroBoard, SegmentBar (2026-09-20): his hero and his gold standard's segmented unit bar, both catalogued by his word (rules/FORM-CATALOG.md VERSION 6 and the reference of that date). */
const ARCHETYPES = ["AnswerCard", "KvGrid", "RankedBars", "CompareTable", "CardPager", "CityCards", "TiersTable", "RangeStrip", "SpectraTable", "NoteList", "Terminus", "PayBars", "IncomeBreakdown", "BentoBand", "MarkList", "DetailPanel", "HeroBoard", "SegmentBar", "BentoMetric", "BlockedSeat", "Donut", "Ring", "MonthLine", "ShareBar", "WorkedFigure"];
const EXCEPTIONS_PATH = "data/archetypes/coverage_exceptions.json";
const INIT = process.argv.includes("--init");

type Exception = { section: string; reason: string };
type Section = { key: string; file: string; id: string | null; covered: boolean; archetype: string | null };

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name).replace(/\\/g, "/");
    if (statSync(full).isDirectory()) { if (!SKIP_DIRS.has(name)) walk(full, out); continue; }
    if (name.endsWith(".tsx") && !SKIP_FILES.has(name)) out.push(full);
  }
  return out;
}

const NEWLINE = String.fromCharCode(10);
const CR = String.fromCharCode(13);

function sectionsOf(file: string): Section[] {
  const raw = readFileSync(file, "utf8").split(CR).join("");
  const src = stripCommentLines(raw.split(NEWLINE)).join(NEWLINE);
  /* A TAG COUNTS ONLY WHEN THE FILE IMPORTS IT FROM THE ARCHETYPES FOLDER: the
     older kit exports a SpectraTable of its own, and the city's quick reads
     were read as covered by the name alone on the gate's first run. */
  const imported = new Set<string>();
  const importRe = /import\s*\{([^}]*)\}\s*from\s*"(?:@\/components\/spine\/archetypes\/[^"]+|\.\.?\/(?:[^"]*\/)?archetypes\/[^"]+)"/g;
  let im: RegExpExecArray | null;
  while ((im = importRe.exec(src))) for (const name of im[1].split(",")) { const n = name.trim().split(/\s+as\s+/).pop()?.trim(); if (n) imported.add(n); }
  const out: Section[] = [];
  const re = /<Box\b([^>]*)>/g;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(src))) {
    n++;
    const idMatch = /\bid=(?:"([^"]+)"|\{`?([^}`]+)`?\})/.exec(m[1]);
    const id = idMatch ? (idMatch[1] ?? idMatch[2]).trim() : null;
    const end = src.indexOf("</Box>", m.index);
    const block = end === -1 ? src.slice(m.index) : src.slice(m.index, end);
    const archetype = ARCHETYPES.find((a) => imported.has(a) && new RegExp(`<${a}\\b`).test(block)) ?? null;
    out.push({ key: `${file}#${id ?? n}`, file, id, covered: archetype != null, archetype });
  }
  return out;
}

const files = walk(ROOT);
const sections = files.flatMap(sectionsOf);
const exceptions: Exception[] = existsSync(EXCEPTIONS_PATH) ? (JSON.parse(readFileSync(EXCEPTIONS_PATH, "utf8")) as { exceptions: Exception[] }).exceptions : [];
const excepted = new Map(exceptions.map((e) => [e.section, e.reason]));

const uncovered = sections.filter((s) => !s.covered);
const missing = uncovered.filter((s) => !excepted.has(s.key));
const stale = exceptions.filter((e) => { const s = sections.find((x) => x.key === e.section); return !s || s.covered; });

/* THE FILTER'S LIST (sys:page-filter-list, the build loop's run 12, 2026-09-06):
   a page with a section on an archetype is in scripts/harness/pages.json, so the
   page filter renders and reads it every run. The surface is the page folder's
   name; the how-to view, which lives in the country folder, is its own surface.
   `--pages=<path>` points the check at another list, for proving it. */
const PAGES_PATH = process.argv.find((a) => a.startsWith("--pages="))?.slice("--pages=".length) ?? "scripts/harness/pages.json";
const surfaceOf = (file: string) => (file.split("/").pop() ?? "").startsWith("how-to") ? "howto" : file.split("/")[3];
const listedSurfaces = new Set<string>(existsSync(PAGES_PATH) ? (JSON.parse(readFileSync(PAGES_PATH, "utf8")) as { pages: Array<{ surface: string }> }).pages.map((p) => p.surface) : []);
const onArchetypes = new Map<string, number>();
for (const s of sections.filter((x) => x.covered)) onArchetypes.set(surfaceOf(s.file), (onArchetypes.get(surfaceOf(s.file)) ?? 0) + 1);
const unlisted = [...onArchetypes].filter(([surface]) => !listedSurfaces.has(surface));

if (INIT) {
  const added = missing.map((s) => ({ section: s.key, reason: "not yet on an archetype; a build loop queue row" }));
  const next = { why: "Sections of the spine pages not yet rendered through an archetype, each with a reason. The set only shrinks: delete an entry the run its section lands on an archetype; never add one to clear a red without a written reason.", exceptions: [...exceptions.filter((e) => !stale.includes(e)), ...added] };
  writeFileSync(EXCEPTIONS_PATH, JSON.stringify(next, null, 2) + NEWLINE);
  console.log(`archetype-coverage --init: ${added.length} exception(s) written, ${stale.length} stale removed; ${sections.length} sections in ${files.length} files`);
  process.exit(0);
}

const covered = sections.filter((s) => s.covered).length;
console.log(`archetype-coverage: ${sections.length} sections in ${files.length} files; ${covered} on an archetype, ${uncovered.length} excepted or missing (${excepted.size} exceptions)`);
for (const s of missing) console.log(`  x NEW SECTION ON THE OLD KIT: ${s.key} has no archetype inside its Box and no exception`);
for (const e of stale) console.log(`  x STALE EXCEPTION: ${e.section} is now on an archetype or gone; delete its entry`);
for (const [surface, n] of unlisted) console.log(`  x PAGE NOT IN THE FILTER'S LIST: ${surface} has ${n} section(s) on archetypes and ${PAGES_PATH} names no page of it`);
if (missing.length || stale.length || unlisted.length) {
  console.log(`${NEWLINE}  Point the section at an archetype, or name it in ${EXCEPTIONS_PATH} with a reason; delete entries whose sections are done; add a page to ${PAGES_PATH} the run its first section lands.`);
  process.exit(1);
}
console.log("PASS verify_archetype_coverage.");
