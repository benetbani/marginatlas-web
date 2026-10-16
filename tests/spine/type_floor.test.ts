/**
 * THE TYPE FLOOR'S READER (plan 2026-10-12 rhythm-air-inside, Task 1A; spec E:/atlas/docs/superpowers/specs/2026-10-12-rhythm-air-inside-design.md,
 * sections 2.2 and 3 item 1): reader text is 14px or larger, the 12px rung kept for a chart's tick and axis labels and the foot's source line, each
 * place named in scripts/harness/type_floor_allow.json. Fixtures over scripts/lib/type_floor.mjs, the list's shape, the stylesheet the reader mirrors
 * and the gate's wiring.
 * BLIND SPOT, stated: fixtures prove the reading, not the pages; the pages are the `type-floor` gate's, over the renders pages-fresh writes.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/type_floor.test.ts
 */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import { readTypeFloor, ZONE_SIZES, FLOOR_PX, SHARE_MAX } from "../../scripts/lib/type_floor.mjs";
import { red, redSummary } from "../../scripts/lib/red";
import { scanSpine } from "../../scripts/lib/spine_scan.mjs";
import { stripCommentLines } from "../../scripts/lib/strip_comments";

const RULE = "type-floor-reader";
const LIB = "scripts/lib/type_floor.mjs";
const LIST = "scripts/harness/type_floor_allow.json";
const GATE = "scripts/harness/check_type_floor.mjs";
const PAGES = "scripts/harness/pages.json";
const REMEDY = "read a render as R1 read it (the header of scripts/lib/type_floor.mjs): visible at 1280, the nearest size, THE ZONES' size rules, non-space characters";
let failed = 0;
const check = (label: string, ok: boolean, file = LIB, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };

const read = (inner: string, keys: string[] = []) => readTypeFloor(new JSDOM(`<!doctype html><html><body><main>${inner}</main></body></html>`).window.document, new Set(keys));
const M = "text-[length:var(--t-micro)]";
const B = "text-[length:var(--t-body)]";

let r = read(`<p class="${B}">abcd</p><p class="${M}">ab</p>`);
check(`a 12px run is small and a 14px run is not: 2 of 6 characters (got ${r.small} of ${r.chars})`, r.chars === 6 && r.small === 2);
r = read(`<p class="${M} md:hidden">phone</p><p class="hidden md:block ${M}">desk</p><p class="sr-only ${M}">sr</p><p hidden class="${M}">attr</p><p style="display: none" class="${M}">none</p>`);
check(`visible at 1280: a phone-only run and sr-only, hidden and display:none runs are not read, a run shown from md is (got ${r.small} of ${r.chars})`, r.chars === 4 && r.small === 4);
r = read(`<details><summary class="${B}">open me</summary><p class="${M}">inside</p></details><details open><p class="${M}">shown</p></details>`);
check(`a closed <details> is read only at its <summary>, an open one whole (got ${r.small} of ${r.chars})`, r.chars === 11 && r.small === 5);
r = read(`<div class="${M}"><span>inherits</span><span class="${B}">own</span></div>`);
check(`a run takes its nearest size: an inner class beats its parent's (got ${r.small} of ${r.chars})`, r.small === 8 && r.chars === 11);
r = read(`<p class="${M} lg:${B}">grows</p><p class="${B} 2xl:${M}">stays</p>`);
check(`a breakpoint class applies at 1280 from sm to xl, and 2xl does not (got ${r.small})`, r.small === 0 && r.chars === 10);
r = read(`<p class="${B} [@container(min-width:420px)]:${M}">query</p>`);
check("a container query's size is not read (the stated blind spot): the run stays 14", r.small === 0);
r = read(`<p>plain</p>`);
check("no size anywhere reads as the browser's 16", r.small === 0 && r.chars === 5);
r = read(`<svg><text font-size="9">ticks</text></svg>`);
check("an SVG text's font-size attribute is its size", r.small === 5);
r = read(`<section data-zone="1-1"><div class="spine-card"><h3 data-rail-title="" class="text-[length:var(--t-lead)]">Title</h3><p data-focal-words="" class="${M}">words</p></div></section>`);
check(`THE ZONES' rules: an open section's title reads 20 and the line under its figure 14 (got ${r.small} small)`, r.small === 0 && r.chars === 10);
r = read(`<section data-zone="1-1"><div class="spine-card" data-keep-card=""><p data-focal-words="" class="${M}">kept</p></div></section>`);
check("a kept card's line is not raised by the zone's rule", r.small === 4);
r = read(`<span data-type-allow="month-axis" class="${M}">JFM</span><span data-type-allow="nobody" class="${M}">xx</span><p class="${B}">abcde</p>`, ["month-axis"]);
check(`an allowance key the list names exempts its run; a key it does not name is reported and counted (allowed ${r.allowed}, small ${r.small}, unknown ${r.unknownKeys.join()})`, r.allowed === 3 && r.small === 2 && r.unknownKeys.join() === "nobody" && Math.abs(r.raw - 0.5) < 1e-9);
check(`the law's numbers are the spec's: ${FLOOR_PX}px, ${SHARE_MAX * 100}%`, FLOOR_PX === 14 && SHARE_MAX === 0.2);

/* THE READER MIRRORS THE STYLESHEET: THE ZONES set four font sizes over seven selectors; a rule added or dropped there is added or dropped in ZONE_SIZES. */
const css = readFileSync("src/app/globals.css", "utf8");
const zonesFrom = css.indexOf("THE ZONES (the band page");
const zones = zonesFrom === -1 ? "" : css.slice(zonesFrom, css.indexOf("atlas-eyebrow", zonesFrom));
const declared = [...zones.matchAll(/font-size:\s*var\(--t-(?:head|body)\)/g)].length;
check(`the reader holds THE ZONES' size rules: ${ZONE_SIZES.length} selectors for ${declared} font-size declarations`, declared === 4 && ZONE_SIZES.length === 7, "src/app/globals.css", "when THE ZONES gains or loses a font-size rule, add or drop its selectors in ZONE_SIZES (scripts/lib/type_floor.mjs)");

/* THE ALLOWANCE LIST'S SHAPE. */
type Entry = { key: string; kind: string; places: string[]; reason: string };
const list = JSON.parse(readFileSync(LIST, "utf8")) as Entry[];
const unfit = list.filter((e) => !(typeof e.key === "string" && /^[a-z][a-z0-9-]*$/.test(e.key) && (e.kind === "axis" || e.kind === "source") && Array.isArray(e.places) && e.places.length > 0 && e.places.every((p) => typeof p === "string" && p.startsWith("src/components/spine/")) && typeof e.reason === "string" && e.reason.trim().length > 0));
const twice = list.filter((e, i) => list.findIndex((x) => x.key === e.key) !== i);
check(`${LIST} holds ${list.length} places, each a key, a kind (axis or source), its files under src/components/spine and a reason, none twice (unfit: ${unfit.map((e) => e.key).join(", ") || "none"})`, list.length > 0 && unfit.length === 0 && twice.length === 0, LIST, 'give each entry { "key", "kind": "axis" | "source", "places": [files], "reason" }');
check("the list's one source place is the foot's licence line", list.filter((e) => e.kind === "source").map((e) => e.key).join() === "sources-foot", LIST, "the 12px rung stays for the source and licence line of a page's foot alone (spec section 2.2)");

/* THE GATE'S WIRING. */
const gate = readFileSync(GATE, "utf8");
check("the gate reads the allowance list and the spine surfaces of the harness list, and parses with jsdom, no browser", /type_floor_allow\.json/.test(gate) && /\["country", "city", "cell", "industry", "hood", "calculator"\]/.test(gate) && /new JSDOM\(/.test(gate) && !/chromium/.test(gate), GATE, "read scripts/harness/type_floor_allow.json and the country, city, cell, industry, hood and calculator surfaces of scripts/harness/pages.json, statically");

/* THE SCAN SET HOLDS A PAGE OF EACH SURFACE (the review of Task 1A): the surfaces are read from the gate's own SPINE, not retyped here, and each must occur in the harness list's pages, so the gate cannot pass having read no render. */
const spineNames = (/const SPINE = \[([^\]]*)\]/.exec(gate)?.[1] ?? "").split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
const harnessPages = (JSON.parse(readFileSync(PAGES, "utf8")) as { pages: Array<{ surface: string }> }).pages;
const unlisted = spineNames.filter((s) => !harnessPages.some((p) => p.surface === s));
check(`every spine surface the gate names (${spineNames.join(", ")}) occurs in ${PAGES}'s pages, so the gate cannot pass having read no render (missing: ${unlisted.join(", ") || "none"})`, spineNames.length > 0 && unlisted.length === 0, PAGES, `add a page of each spine surface the gate reads (${spineNames.join(", ")}) to ${PAGES}`);

/* THE FLOOR IN THE SOURCE (Task 3): in the spine the pages draw, comments stripped, a size under 14 sits only on an element the allowance
   list names, on the same line as its key. THE SCAN SET IS ONE HELPER'S (Task 1C, scripts/lib/spine_scan.mjs: every .tsx under src/components/spine but what
   SPINE_OUT names by path, so basis.tsx and any file added later are read from their first commit; the hand-kept folder list of the brief missed both).
   BLIND SPOT: an SVG `fontSize` attribute is not read here (the gate reads it on the renders), and a class split from its key across two lines reds here and
   is joined, never exempted. */
const scan = scanSpine();
check(`every entry under src/components/spine is read or named out with its reason (${scan.files.length} .tsx read, ${scan.outFiles.length} named out; findings: ${scan.findings.length})`, scan.findings.length === 0, scan.findings[0]?.entry ?? "src/components/spine", scan.findings[0]?.remedy ?? "name the entry in SPINE_OUT (scripts/lib/spine_scan.mjs) with the reason it is not read");
const scoped = scan.files;
const codeLines = (f: string) => stripCommentLines(readFileSync(f, "utf8").split(/\r?\n/));
const SMALL = /text-\[length:var\(--t-(?:micro|mark)\)\]|(?:^|[\s"'`])text-xs(?=[\s"'`])|text-\[(?:9|10|11|12|13)(?:\.5)?px\]/;
const tooSmall = scoped.flatMap((f) => codeLines(f).map((l, i) => (SMALL.test(l) && !/data-type-allow="[a-z0-9-]+"/.test(l) ? `${f}:${i + 1}` : null)).filter((x): x is string => x !== null));
check(`no reader text under 14px in the spine's source outside the allowance list (${tooSmall.length}${tooSmall.length ? `: ${tooSmall.slice(0, 12).join(", ")}${tooSmall.length > 12 ? ", ..." : ""}` : ""})`, tooSmall.length === 0, tooSmall[0]?.split(":")[0] ?? LIST, "set reader text at var(--t-body) with its leading pair (14 on 20; leading-4 becomes leading-5); a chart's tick or axis label, or the foot's source line, carries data-type-allow with its key on the same line");
/* THE LEADING THAT GOES WITH THE SIZE (Task 3, fix round 1): a line lifted to 14 stands on 20, and `leading-4` is the 12-on-16 pair. The size check above reads
   the size on a line; when the size is a constant (SortTable's HEAD) and the leading sits on the element's own line, the two are on different lines and
   the size check cannot see the leading (three phone sort heads stood at 14 on 16 that way). So no scanned line keeps `leading-4` outside the allowance.
   BLIND SPOT: this cannot tell a `leading-4` on a 12px allowance element whose key stands on another line from one on a lifted element (it reds both,
   and the key joins the line), and a leading set another way (an arbitrary value, a style attribute) is not read. */
const LEADING_16 = /(?:^|[\s"'`:])leading-4(?=[\s"'`])/;
const leading16 = scoped.flatMap((f) => codeLines(f).map((l, i) => (LEADING_16.test(l) && !/data-type-allow="[a-z0-9-]+"/.test(l) ? `${f}:${i + 1}` : null)).filter((x): x is string => x !== null));
check(`no scanned line keeps leading-4, the 12-on-16 pair, outside the allowance (${leading16.length}${leading16.length ? `: ${leading16.slice(0, 12).join(", ")}` : ""})`, leading16.length === 0, leading16[0]?.split(":")[0] ?? LIST, "text lifted to 14 takes leading-5 (14 on 20): change leading-4 to leading-5 on the element that takes the lifted size, whether the size is written on the line or comes from a constant");
const usedKeys = new Map<string, Set<string>>();
for (const f of scoped) for (const l of codeLines(f)) for (const m of l.matchAll(/data-type-allow="([a-z0-9-]+)"/g)) { if (!usedKeys.has(m[1])) usedKeys.set(m[1], new Set()); usedKeys.get(m[1])!.add(f); }
const notListed = [...usedKeys.keys()].filter((k) => !list.some((e) => e.key === k));
const notUsed = list.filter((e) => !usedKeys.has(e.key)).map((e) => e.key);
const wrongPlace = list.filter((e) => usedKeys.has(e.key) && [...usedKeys.get(e.key)!].some((f) => !e.places.includes(f))).map((e) => e.key);
check(`every key the source uses is listed with its files, and every listed key is used (not listed: ${notListed.join(", ") || "none"}; not used: ${notUsed.join(", ") || "none"}; files not named: ${wrongPlace.join(", ") || "none"})`, notListed.length === 0 && notUsed.length === 0 && wrongPlace.length === 0, LIST, "name each data-type-allow key with its files and reason in scripts/harness/type_floor_allow.json, and drop a key no component carries");
const unmarked = scoped.flatMap((f) => codeLines(f).map((l, i) => (/<p\b/.test(l) && /--t-body/.test(l) && /--c-muted/.test(l) && !/data-(?:line|basis|placement|focal-words)=/.test(l) ? `${f}:${i + 1}` : null)).filter((x): x is string => x !== null));
check(`every muted paragraph at 14 says what it is: a lifted supporting line (data-line), a basis (data-basis), a placement (data-placement), or the words of a section's figure (data-focal-words, which the law never counts) (${unmarked.length}${unmarked.length ? `: ${unmarked.slice(0, 8).join(", ")}` : ""})`, unmarked.length === 0, unmarked[0]?.split(":")[0] ?? LIST, "mark the paragraph data-line=\"\" (no muted paragraph stood at 14 before the floor, so each one now is a supporting line the plain-copy law reads)");

/* THE PLAIN-COPY LAW STILL READS A LIFTED LINE (Review Focus 1): the check's own inPage, read from its source and run in jsdom. */
const copyText = readFileSync("scripts/harness/check_copy_plain.mjs", "utf8");
const copyFrom = copyText.indexOf("function inPage(");
const copyLen = copyFrom === -1 ? -1 : copyText.slice(copyFrom).search(/\r?\n\}\r?\n/);
const copySrc = copyFrom === -1 || copyLen === -1 ? null : `${copyText.slice(copyFrom, copyFrom + copyLen)}\n}`;
const linesRed = (inner: string): number | null => {
  if (copySrc === null) return null;
  const dom = new JSDOM(`<!doctype html><html><body><main><section data-card id="c1"><h3>Costs</h3>${inner}</section></main></body></html>`, { runScripts: "outside-only" });
  try {
    const win = dom.window as unknown as { eval: (s: string) => unknown; Element: { prototype: { getClientRects: () => unknown[] } } };
    win.Element.prototype.getClientRects = function () { return [{}]; };
    const out = (win.eval(`(${copySrc})`) as (reader: unknown[]) => { reds: Array<{ rule: string }> })([]);
    return out.reds.filter((x) => x.rule === "LINES").length;
  } finally { dom.window.close(); }
};
const COPY_FILE = "scripts/harness/check_copy_plain.mjs";
const COPY_REMEDY = "a supporting line is a paragraph at the micro rung (13.5px or less) or one the floor lifted to 14, which carries data-line, data-basis or data-placement: the law reads the same lines after the floor as before";
check("two lifted lines (14px, data-line) are a card's two supporting lines: one LINES red", linesRed('<p style="font-size:14px" data-line="">One line.</p><p style="font-size:14px" data-line="">Two lines.</p>') === 1, COPY_FILE, COPY_REMEDY);
check("a basis and a placement at 14 are supporting lines too", linesRed('<p style="font-size:14px" data-basis="">Basis.</p><p style="font-size:14px" data-placement="">Higher than five countries in ten.</p>') === 1, COPY_FILE, COPY_REMEDY);
check("a 14px paragraph the floor did not lift (body text beside a drawing) is not a line", linesRed('<p style="font-size:14px">Body.</p><p style="font-size:14px">Body two.</p>') === 0, COPY_FILE, COPY_REMEDY);
check("below 13.5px the law is unchanged", linesRed('<p style="font-size:12px">One.</p><p style="font-size:12px">Two.</p>') === 1, COPY_FILE, COPY_REMEDY);
check("the words of a section's figure at 14 are no supporting line (data-focal-words): the figure's own line, as on every zone today", linesRed('<p style="font-size:14px" data-focal-words="">What it is.</p><p style="font-size:14px" data-basis="">Basis.</p>') === 0, COPY_FILE, COPY_REMEDY);

/* THE GATE NEVER PASSES HAVING READ NOTHING (the standing empty-scan ruling, Task 1A's review): a render with no visible character at 1280 is a red, since
   a share over no characters is 0 and would pass. The gate runs on a temp tree (--dir the renders, --list the pages): six renders, one a surface each, one a page that drew
   nothing, then the same six with text. BLIND SPOT: this proves the gate's own refusal on a planted render, not that a real render of the chain holds text. */
const tmp = mkdtempSync(join(tmpdir(), "type-floor-gate-"));
const runGate = (renders: Record<string, string>) => {
  const dir = join(tmp, "pages");
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const surfaces = ["country", "city", "cell", "industry", "hood", "calculator"];
  for (const s of surfaces) writeFileSync(join(dir, `${s}-x.html`), renders[s] ?? `<!doctype html><html><body><main><p class="${B}">A visible line of reader text.</p></main></body></html>`);
  const listFile = join(tmp, "pages.json");
  writeFileSync(listFile, JSON.stringify({ pages: surfaces.map((s) => ({ surface: s, slugs: ["x"] })) }));
  const r = spawnSync(process.execPath, [GATE, `--list=${listFile}`, `--dir=${dir}`], { encoding: "utf8" });
  return { status: r.status, out: `${r.stdout}\n${r.stderr}` };
};
try {
  const empty = runGate({ cell: "<!doctype html><html><body><main></main></body></html>" });
  check(`a render that read no visible character is a red, not a pass (exit ${empty.status}; says so: ${/no visible character/.test(empty.out)})`, empty.status === 1 && /no visible character/.test(empty.out), GATE, "red a render with no visible character at 1280: nothing was measured, so nothing can be said to hold");
  const full = runGate({});
  check(`the same six renders with text pass (exit ${full.status})`, full.status === 0 && /PASS type-floor: 6 render/.test(full.out), GATE, "a render with text under the share passes; only an empty one is red");
} finally { rmSync(tmp, { recursive: true, force: true }); }

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/type_floor: all pass");
