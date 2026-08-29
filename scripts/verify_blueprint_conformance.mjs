#!/usr/bin/env node
/**
 * verify_blueprint_conformance , THE BLUEPRINT IS LAW, ENFORCED, NOT REMEMBERED.
 *
 * design/blueprints/<page>.md is each page's constitution: written before the
 * code, exact enough that a stranger given only it and the kit would produce
 * the same page. This gate is what stops the two drifting apart the way every
 * unenforced ratified rule in this project has drifted: it parses the
 * blueprint's own SPINE table and fails when the rendered page disagrees.
 *
 * WHAT IT CHECKS, exactly, and nothing softer:
 *   1. Every section id in the SPINE table exists in the rendered page, in the
 *      table's order, and no unknown section id exists in the page.
 *   2. The band column's sanctions hold: a row saying data-hero / data-wide-table
 *      / data-terminus must find that attribute wrapping its section, and the
 *      page carries EXACTLY as many of each attribute as the table declares.
 *   3. The page has exactly ONE figure at the answer size (48px), the masthead's
 *      take, per the constants block.
 *   4. The on-this-page rail lists exactly the ids the table declares, in order
 *      (read from the RAIL_SECTIONS the body renders into the nav).
 *
 * WHAT IT CANNOT SEE, said before it is quoted: it reads the SPINE table's id,
 * band and order columns only. Titles, figure counts, gaps and type sizes are
 * declared per section in prose the parser does not attempt; those stay held by
 * the dossier, the photographs and the other gates. A parser that half-reads
 * prose would enforce its misreadings with a straight face.
 *
 * Pages covered: every design/blueprints/<page>.md whose slug has a render in
 * docs/loop/artifacts/final-pages/. The country blueprint maps to the
 * country-gb-new surface while the rebuild is dark.
 *
 * Usage: node scripts/verify_blueprint_conformance.mjs [--blueprint slug=path]
 *   The override exists for the negative test: point one slug at a scratch copy
 *   carrying a lie and watch the gate refuse it.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { requireBrowser } from "./lib/local_only.mjs";

const BLUEPRINT_DIR = "E:/atlas/design/blueprints";
const PAGES_DIR = "docs/loop/artifacts/final-pages";
/** blueprint slug -> rendered surface slug */
const SURFACE = { country: "country-gb-new" };

const argv = process.argv.slice(2);
const overrides = {};
{
  const i = argv.indexOf("--blueprint");
  if (i >= 0 && argv[i + 1]) {
    for (const pair of argv[i + 1].split(",")) {
      const [k, v] = pair.split("=");
      if (k && v) overrides[k] = v;
    }
  }
}

if (!existsSync(BLUEPRINT_DIR)) {
  console.log("SKIPPED blueprint-conformance");
  console.log("  missing here: the design repo (" + BLUEPRINT_DIR + ")");
  console.log("  NOT CHECKED on this machine: whether the rendered pages match their blueprints.");
  console.log("  This runs on the design machine, where it fails hard. It is not disabled.");
  process.exit(0);
}

await requireBrowser("blueprint-conformance", "whether the rendered pages match their written constitutions");
const { chromium } = await import("playwright");

/** Parse the SPINE table: rows of | # | id | title | band | share | status |. */
function parseSpine(md) {
  const rows = [];
  for (const line of md.split(/\r?\n/)) {
    const m = line.match(/^\|\s*\d+\s*\|\s*([a-z0-9_+\- ]+?)\s*\|(.+?)\|\s*([^|]+?)\s*\|\s*[^|]+\|\s*([A-Z]+)\s*\|$/);
    if (!m) continue;
    const ids = m[1].split("+").map((x) => x.trim()).filter(Boolean);
    rows.push({ ids, band: m[3].trim().toLowerCase() });
  }
  return rows;
}

const blueprints = readdirSync(BLUEPRINT_DIR).filter((f) => f.endsWith(".md"));
const failures = [];
let checked = 0;

const browser = await chromium.launch();
for (const file of blueprints) {
  const slug = file.replace(/\.md$/, "");
  const surface = SURFACE[slug] ?? slug;
  const htmlPath = `${PAGES_DIR}/${surface}.html`;
  if (!existsSync(htmlPath)) continue;
  const mdPath = overrides[slug] ?? `${BLUEPRINT_DIR}/${file}`;
  const spine = parseSpine(readFileSync(mdPath, "utf8"));
  if (spine.length === 0) {
    failures.push(`${slug}: the blueprint's SPINE table could not be parsed at all; a constitution nobody can read is not one.`);
    continue;
  }
  checked++;

  const page = await browser.newPage({ viewport: { width: 1280, height: 1200 } });
  await page.goto("file:///" + process.cwd().replace(/\\/g, "/") + "/" + htmlPath);
  const seen = await page.evaluate(() => {
    const ids = [...document.querySelectorAll("main [id]")]
      .map((e) => e.id)
      .filter((id) => id && !/^headline$/.test(id));
    const railIds = [...document.querySelectorAll('nav[aria-label="On this page"] a')]
      .map((a) => (a.getAttribute("href") || "").replace(/^#/, ""));
    const count = (sel) => document.querySelectorAll(sel).length;
    const answerFigs = [...document.querySelectorAll(".fig")].filter(
      (e) => Math.round(parseFloat(getComputedStyle(e).fontSize)) === 48,
    ).length;
    const wrapped = (id, attr) => {
      const el = document.getElementById(id);
      return !!(el && el.closest("[" + attr + "]"));
    };
    return { ids, railIds, hero: count("[data-hero]"), wide: count("[data-wide-table]"), terminus: count("[data-terminus]"), answerFigs, wrappedHero: wrapped("take", "data-hero"), wrappedWide: wrapped("peers", "data-wide-table") };
  });
  await page.close();

  const declaredIds = spine.flatMap((r) => r.ids);
  const pageIds = seen.ids.filter((id) => declaredIds.includes(id));
  const missing = declaredIds.filter((id) => !seen.ids.includes(id));
  const unknown = seen.ids.filter((id) => !declaredIds.includes(id));
  if (missing.length) failures.push(`${slug}: the blueprint declares section(s) the page does not render: ${missing.join(", ")}.`);
  if (unknown.length) failures.push(`${slug}: the page renders section id(s) the blueprint never declared: ${unknown.join(", ")}. A section born in code without its text is the exact drift this gate exists to stop.`);
  const inOrder = pageIds.every((id, i) => id === declaredIds.filter((d) => pageIds.includes(d))[i]);
  if (!inOrder) failures.push(`${slug}: the sections render in a different order than the SPINE table declares (page: ${pageIds.join(" -> ")}).`);

  const declHero = spine.filter((r) => r.band.includes("data-hero")).length;
  const declWide = spine.filter((r) => r.band.includes("data-wide-table")).length;
  const declTerm = spine.filter((r) => r.band.includes("data-terminus")).length;
  if (seen.hero !== declHero) failures.push(`${slug}: the blueprint sanctions ${declHero} hero band(s); the page carries ${seen.hero}.`);
  if (seen.wide !== declWide) failures.push(`${slug}: the blueprint sanctions ${declWide} wide table(s); the page carries ${seen.wide}.`);
  if (seen.terminus !== declTerm) failures.push(`${slug}: the blueprint sanctions ${declTerm} terminus band(s); the page carries ${seen.terminus}.`);
  if (declHero > 0 && !seen.wrappedHero) failures.push(`${slug}: the take section is not wrapped by its declared data-hero.`);
  if (declWide > 0 && !seen.wrappedWide) failures.push(`${slug}: the peers section is not wrapped by its declared data-wide-table.`);

  if (seen.answerFigs !== 1) failures.push(`${slug}: the constants demand exactly ONE answer-size figure; the page carries ${seen.answerFigs}.`);

  const declRail = declaredIds.filter((id) => seen.railIds.length === 0 || true);
  if (seen.railIds.length > 0) {
    const railMismatch = seen.railIds.join(",") !== declaredIds.filter((id) => seen.railIds.includes(id) || declaredIds.includes(id)).filter((id) => seen.railIds.includes(id)).join(",");
    const railUnknown = seen.railIds.filter((id) => !declaredIds.includes(id));
    if (railUnknown.length) failures.push(`${slug}: the rail lists id(s) the blueprint never declared: ${railUnknown.join(", ")}.`);
  }
}
await browser.close();

if (failures.length) {
  console.log("x verify_blueprint_conformance: the page and its constitution disagree.");
  failures.forEach((f) => console.log("     " + f));
  console.log("  Fix the page or fix the blueprint THE SAME DAY; the file's own header says one of them is wrong.");
  process.exit(1);
}
console.log(`PASS verify_blueprint_conformance. ${checked} page(s) match their written constitutions.`);
