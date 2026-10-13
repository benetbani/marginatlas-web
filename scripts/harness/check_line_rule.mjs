/**
 * check_line_rule , EVERY SUPPORTING LINE STANDS WHERE ITS STRUCTURE PUTS IT (plan 2026-10-12 rhythm-air-inside, Task 2C; spec E:/atlas/docs/superpowers/specs/2026-10-12-
 * rhythm-air-inside-design.md, section 2.1; DISTANCES.md section 4, "the distance above a thing says what it belongs to"). On every spine render the chain draws (the country,
 * city, cell, industry and hood surfaces of scripts/harness/pages.json), at 1280, 768 and 375 (the beside and the stacked forms switch between them: RankedBars' head at a
 * 560px card, Thresholds at 900), each figure's own line stands 8 under it with the next group 24 under the block, each basis 24 under the group above it with the next group
 * 24 below it, a foot or a detail panel 12 under a line, a basis is never a figure's own line drawn in the wrong face, and no line is empty. scripts/lib/line_rule.mjs says what
 * a line is, each rule, what is never a red, the tolerance, and its blind spot. The spacing pin (tests/spine/spacing_pin.test.ts) reads source classes and stayed green through
 * five head lines standing 24 under their figure and 16 over their drawing, which is why this reads the page. No allowance file: a line a standing law forces off the rule
 * would need the controller's ruling first. A browser gate: what is visible is what the page computes, so a phone list and the table it stands in for are one reading per width.
 * THE SCAN SET IS KNOWN APART FROM WHAT WAS READ (the review of Task 1A, carried here by the controller's ruling): a spine surface the list holds no page of is a red, a listed
 * render that is not on disk is a red, and so is a render that reads no line at a width (a spine page always draws lines), so the gate never passes having read nothing.
 *
 *   node scripts/harness/check_line_rule.mjs --list[=scripts/harness/pages.json]
 */
import { chromium } from "playwright";
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { preflight } from "./preflight.mjs";
import { requireBrowser } from "../lib/local_only.mjs";
import { lineRuleInPage } from "../lib/line_rule.mjs";
import { red, redSummary } from "../lib/red.mjs";

await requireBrowser("line-rule", "every supporting line (a figure's words, a basis) stands where the line rule puts it on every spine page in scripts/harness/pages.json");
preflight({ browser: true, name: "check_line_rule" });

const RULE = "line-rule";
const SPINE = ["country", "city", "cell", "industry", "hood"];
const WIDTHS = [1280, 768, 375];
const HARNESS_LIST = "scripts/harness/pages.json";
const args = process.argv.slice(2);
const listArg = args.find((a) => a.startsWith("--list"));
const LIST = listArg && listArg.includes("=") ? listArg.slice("--list=".length) : HARNESS_LIST;
const pages = JSON.parse(readFileSync(LIST, "utf8")).pages.filter((p) => SPINE.includes(p.surface));
const REMEDIES = {
  "WORDS ABOVE": "a figure's own line stands 8 under it: draw it with the kit's Focal `words` (src/components/spine/kit.tsx), whose line takes mt-2",
  "WORDS BELOW": "the group under a figure's block stands 24 below it, 12 where it is a foot or a detail panel: the kit's Focal takes mb-6, and a margin of the next group that adds to it is the fault",
  "BASIS ABOVE": "a basis stands 24 under the group above it: draw it with the kit's Basis (src/components/spine/basis.tsx), whose line takes mt-6, and take any margin or padding above it away",
  "BASIS BELOW": "the group under a basis stands 24 below it, 12 where it is a foot or a detail panel: set that group's own top margin to the step (mt-6, mt-3 for a foot)",
  "FIGURE ABOVE": "draw it as the figure's words (the kit's Focal `words`), 8 under the figure",
  "EMPTY LINE": "a line with no text draws nothing: the kit's Basis returns null when its children hold no text, a Focal draws no words line unless it is given words, and a caller never keeps a margin for a line that is not there",
};
const EMPTY_REMEDY = "make the render draw its lines: a figure's words carry data-focal-words and a basis data-basis, inside a card (scripts/lib/line_rule.mjs), and the render is the page (run node node_modules/tsx/dist/cli.mjs scripts/verify_pages_fresh.mjs and fix what it names)";
const RENDER_REMEDY = "run node node_modules/tsx/dist/cli.mjs scripts/verify_pages_fresh.mjs and fix what it names";
const at = (widths) => widths.join(" and ");
const detailOf = (x) => {
  const said = `"${x.text}"`;
  if (x.rule === "WORDS ABOVE") return `${x.section}: the words ${said} stand ${x.got} under their figure, ${x.want} wanted (reads ${x.read})`;
  if (x.rule === "WORDS BELOW") return `${x.section}: the group under the figure's block ${said} stands ${x.got} below it, ${x.want} wanted (reads ${x.read})`;
  if (x.rule === "BASIS ABOVE") return `${x.section}: the basis ${said} stands ${x.got} under the group above it, ${x.want} wanted (reads ${x.read})`;
  if (x.rule === "BASIS BELOW") return `${x.section}: the group under the basis ${said} stands ${x.got} below it, ${x.want} wanted (reads ${x.read})`;
  if (x.rule === "FIGURE ABOVE") return `${x.section}: the basis ${said} is the figure's own line drawn as a basis, between a figure and the drawing under it (reads ${x.read})`;
  return `${x.section}: a ${x.line} line with no text keeps its distances and draws nothing (reads ${x.read})`;
};
/* A SPINE SURFACE THE LIST HOLDS NO PAGE OF (the review of Task 1A): the names in SPINE are the scan set, known apart from the pages found, so a
   surface with none is a red and zero renders read can never print PASS. */
const bare = SPINE.filter((s) => !pages.some((p) => p.surface === s));
const found = new Map();
const missing = [];
const empty = new Map();
const outside = new Map();
const OUTSIDE_REMEDY = "draw the line inside its section's card (a Box), or teach scripts/lib/line_rule.mjs where it stands: a line the rule cannot place is a line it never measured";
const browser = await chromium.launch();
for (const p of pages) {
  const name = `${p.surface}-${p.slugs.join("-")}`;
  const file = `scratchpad/harness/pages/${name}.html`;
  if (!existsSync(file)) { missing.push(file); continue; }
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(resolve(file)).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    const r = await page.evaluate(lineRuleInPage);
    console.log(`${name}@${w}: ${r.lines} line(s) read, ${r.reds.length} red(s)${r.outside ? `, ${r.outside} outside any card (not read)` : ""}`);
    /* A RENDER THAT READS NO LINE (the same ruling): a spine page always draws figure lines and bases, so a read of none is a gate that cannot see, never a clean page. */
    if (r.lines === 0) {
      if (!empty.has(name)) empty.set(name, []);
      empty.get(name).push(w);
    }
    if (r.outside) {
      if (!outside.has(name)) outside.set(name, new Map());
      outside.get(name).set(w, r.outside);
    }
    for (const x of r.reds) {
      const key = `${name}|${x.rule}|${x.section}|${x.line}|${x.text}|${x.read}`;
      if (!found.has(key)) found.set(key, { name, ...x, widths: [] });
      found.get(key).widths.push(w);
    }
    await ctx.close();
  }
}
await browser.close();
for (const s of bare) red({ rule: RULE, file: LIST, detail: `no page of the ${s} surface in ${LIST}, so no ${s} render was read`, remedy: `add a page of the ${s} surface to ${HARNESS_LIST}, the list the chain's harness gates read` });
for (const f of missing) red({ rule: RULE, file: f, detail: "no render", remedy: RENDER_REMEDY });
for (const [name, widths] of empty) red({ rule: RULE, file: `scratchpad/harness/pages/${name}.html`, detail: `${name}: no line read at ${at(widths)}, and a spine page always draws lines, so nothing was read`, remedy: EMPTY_REMEDY });
for (const [name, byWidth] of outside) red({ rule: RULE, file: `scratchpad/harness/pages/${name}.html`, detail: `${name}: ${[...byWidth.values()][0]} line(s) stand outside any card at ${at([...byWidth.keys()])}, so the line rule never read them`, remedy: OUTSIDE_REMEDY });
for (const x of found.values()) red({ rule: RULE, file: `scratchpad/harness/pages/${x.name}.html`, detail: `${x.rule}: ${detailOf(x)} at ${at(x.widths)}`, remedy: REMEDIES[x.rule] });
const total = bare.length + missing.length + empty.size + outside.size + found.size;
if (total) {
  /* The count line is the one a truncated tail keeps, so it names the remedy of each kind of finding present. */
  const rulesSeen = [...new Set([...found.values()].map((x) => x.rule))];
  const fix = [
    bare.length ? `add a page of each missing surface (${bare.join(", ")}) to ${HARNESS_LIST}` : "",
    missing.length ? RENDER_REMEDY : "",
    empty.size ? EMPTY_REMEDY : "",
    outside.size ? OUTSIDE_REMEDY : "",
    ...rulesSeen.map((rule) => `${rule}: ${REMEDIES[rule]}`),
  ].filter(Boolean).join("; ");
  redSummary(RULE, total, fix, `${pages.length} render(s) x ${WIDTHS.length} widths`);
  process.exit(1);
}
console.log(`PASS line-rule: ${pages.length} render(s) at ${WIDTHS.join(", ")}, every line where its structure puts it.`);
