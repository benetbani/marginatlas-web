/**
 * check_panels_opened , EVERY BROWSER CHECK READS INSIDE A CLOSED PLUS (plan 2026-10-13 country-page-journey, Task 1E; spec section 5: "every
 * browser check that reads a section's content opens the panels first (seven skip a closed panel today: their reading is fixed in the same
 * change, each a red first on a planted closed panel)"). It writes planted pages, each hiding one fault of one check's kind behind a closed
 * <details>, runs that check on it as the chain runs it, and holds the check's output to a finding marked " (panels open)"; and it plants
 * two bar lists on neighbouring zones and holds the page laws to KIND ADJACENT (Review Focus 2: clause 64 read on zones).
 * BLIND SPOT, stated: each fixture proves that one check opens the panels and reads one rule inside them, not every rule; the planted sizes
 * are set to trip the named rule, so a change to that rule's threshold can need the fixture resized.
 *
 *   node scripts/harness/check_panels_opened.mjs
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { preflight } from "./preflight.mjs";
import { requireBrowser } from "../lib/local_only.mjs";
import { red, redSummary } from "../lib/red.mjs";

await requireBrowser("panels-opened", "whether the seven browser checks read inside a closed plus, and KIND ADJACENT on zones");
preflight({ browser: true, name: "check_panels_opened" });

const RULE = "panels-opened";
const DIR = "scratchpad/journey/panels";
/* The planted renders stand in their own directory, never beside the real ones (final review M10, 2026-10-15): the two gates that read a
   render list take it from HARNESS_PAGES_DIR, so a crash here leaves nothing among the chain's renders. */
const PAGES_DIR = `${DIR}/pages`;
mkdirSync(DIR, { recursive: true });
mkdirSync(PAGES_DIR, { recursive: true });
const zone = (inner) => `<section data-zone="lone" data-tone="tint"><div data-zone-level=""><div data-zone-cell="" class="min-w-0">${inner}</div></div></section>`;
const card = (id, inner, style = "width:900px", attrs = "") => `<div id="${id}" data-block="${id}" data-card="" class="spine-card"${attrs} style="${style}"><div data-rail=""><h3 data-rail-title="">Planted</h3></div>${inner}</div>`;
const shut = (inner) => `<details><summary>More</summary>${inner}</details>`;
const page = (body) => `<!doctype html><html><head><meta charset="utf-8"><title>planted</title></head><body style="margin:0;font-family:sans-serif"><main style="width:1120px;margin:0 auto;padding:16px">${body}</main></body></html>`;
const PLANTS = {
  /* model laws, ROW SENTENCE: a five-word label behind the plus. */
  laws: page(zone(card("planted", `<p>Two lines.</p>${shut(`<dl><div data-detail-row><dt data-label>A label of five words</dt><dd><span class="fig">1</span></dd></div><div data-detail-row><dt data-label>Short</dt><dd><span class="fig">2</span></dd></div></dl>`)}`))),
  /* page holes, WHITE SPACE: the open plus grows its column and leaves the other empty inside the card. */
  holes: page(zone(card("planted", `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px"><div>${shut(`<div style="height:900px;background:#555"></div>`)}</div><div><p>Short</p></div></div>`))),
  /* page laws, TEXT OUT OF BOX: an unbroken line behind the plus runs out of its 300px card. */
  pageLaws: page(zone(card("planted", `<p>One line.</p>${shut(`<p style="white-space:nowrap">${"Unbroken".repeat(60)}</p>`)}`, "width:300px"))),
  /* the probe: the open plus adds height to the card's content. */
  probe: page(zone(card("planted", `<p>One line.</p>${shut(`<div style="height:400px;background:#555"></div>`)}`))),
  /* art direction: accent text behind the plus (the gate's own accent colours), more than a card's budget. */
  art: page(zone(card("planted", `<p>One line.</p>${shut(`<p><span style="color:rgb(194,65,12)">$1</span> <span style="color:rgb(194,65,12)">$2</span> <span style="color:rgb(194,65,12)">$3</span> <span style="color:rgb(194,65,12)">$4</span></p>`)}`))),
  /* full width: a narrow section whose open plus spans the column. The gate measures a section by the ink its leaves draw, so the plant's
     title and the plus's summary stand inline (a block's text box spans the card and read full width with the plus closed, the first run
     of 2026-10-14). */
  wide: page(zone(`<div id="planted" data-block="planted" data-card="" class="spine-card" style="width:auto"><div data-rail=""><h3 data-rail-title="" style="display:inline-block">Planted</h3></div><p style="width:300px">Narrow.</p><details><summary style="display:inline-block">More</summary><div style="width:1088px;height:40px;background:#555"></div></details></div>`)),
  /* gathered emptiness, E6: the open plus leaves a blank beside it in a two-column card. */
  empty: page(zone(card("planted", `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px"><div>${shut(`<div style="height:900px;background:#555"></div>`)}</div><div><p>Short</p></div></div>`))),
  /* KIND ADJACENT on zones (Review Focus 2): two visual cards of one kind on neighbouring zones. */
  kind: page(zone(card("bars-a", `<p>Bars A</p>`, "width:900px", ' data-archetype="bar-list" data-visual="1"')) + zone(card("bars-b", `<p>Bars B</p>`, "width:900px", ' data-archetype="bar-list" data-visual="1"'))),
};
for (const [k, html] of Object.entries(PLANTS)) writeFileSync(`${DIR}/${k}.html`, html, "utf8");
/* The gates that read the harness list read a list of one planted page in the plants' own directory (scripts/lib/page_renders.mjs reads
   HARNESS_PAGES_LIST and HARNESS_PAGES_DIR). */
writeFileSync(`${PAGES_DIR}/country-ZZART.html`, PLANTS.art, "utf8");
writeFileSync(`${PAGES_DIR}/country-ZZEMPTY.html`, PLANTS.empty, "utf8");
writeFileSync(`${DIR}/art.json`, JSON.stringify({ pages: [{ surface: "country", slugs: ["ZZART"] }] }), "utf8");
writeFileSync(`${DIR}/empty.json`, JSON.stringify({ pages: [{ surface: "country", slugs: ["ZZEMPTY"] }] }), "utf8");

const run = (args, env = {}) => { const r = spawnSync(process.execPath, args, { encoding: "utf8", env: { ...process.env, ...env }, maxBuffer: 32 * 1024 * 1024 }); return `${r.stdout ?? ""}${r.stderr ?? ""}`; };
const CASES = [
  { check: "scripts/harness/check_model_laws.mjs", out: () => run(["scripts/harness/check_model_laws.mjs", `${DIR}/laws.html`]), want: /ROW SENTENCE[^\n]*\(panels open\)/ },
  { check: "scripts/harness/check_page_holes.mjs", out: () => run(["scripts/harness/check_page_holes.mjs", `${DIR}/holes.html`]), want: /WHITE SPACE[^\n]*\(panels open\)/ },
  { check: "scripts/harness/check_page_laws.mjs", out: () => run(["scripts/harness/check_page_laws.mjs", `${DIR}/pageLaws.html`]), want: /TEXT OUT OF BOX[^\n]*\(panels open\)/ },
  { check: "scripts/harness/probe_page.mjs", out: () => run(["scripts/harness/probe_page.mjs", `${DIR}/probe.html`, "1280"]), want: /panels open[\s\S]*planted \d+x\d+ \(content \d+\)/ },
  { check: "scripts/verify_art_direction.mjs", out: () => run(["scripts/verify_art_direction.mjs"], { HARNESS_PAGES_LIST: `${DIR}/art.json`, HARNESS_PAGES_DIR: PAGES_DIR }), want: /\(panels open\)/ },
  { check: "scripts/verify_full_width_sitewide.mjs", out: () => run(["scripts/verify_full_width_sitewide.mjs", "--pages", `planted=${DIR}/wide.html`]), want: /\(panels open\)/ },
  { check: "scripts/verify_gathered_emptiness.mjs", out: () => run(["scripts/verify_gathered_emptiness.mjs"], { HARNESS_PAGES_LIST: `${DIR}/empty.json`, HARNESS_PAGES_DIR: PAGES_DIR }), want: /\(panels open\)/ },
  { check: "scripts/harness/check_page_laws.mjs (KIND ADJACENT)", out: () => run(["scripts/harness/check_page_laws.mjs", `${DIR}/kind.html`]), want: /KIND ADJACENT[^\n]*neighbouring levels/ },
];
let failed = 0;
for (const c of CASES) {
  const out = c.out();
  writeFileSync(`${DIR}/${c.check.replace(/[^a-z_]+/gi, "-")}.out.txt`, out, "utf8");
  if (c.want.test(out)) console.log(`PASS  ${c.check}: the planted fault is read`);
  else { failed++; red({ rule: RULE, file: c.check.split(" ")[0], detail: `${c.check}: the planted fault was not reported (its output is in ${DIR})`, remedy: "read the page again with every plus open (scripts/lib/open_panels.mjs) and report a finding only the open page makes with ' (panels open)'; read KIND ADJACENT's levels as zones" }); }
}
rmSync(`${PAGES_DIR}/country-ZZART.html`, { force: true });
rmSync(`${PAGES_DIR}/country-ZZEMPTY.html`, { force: true });
if (failed) { redSummary(RULE, failed, "every browser check reads inside a closed plus (spec section 5)", `${CASES.length} planted pages`); process.exit(1); }
console.log(`PASS panels-opened: ${CASES.length} planted pages read by their checks.`);
