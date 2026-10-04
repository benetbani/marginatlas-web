/**
 * THE PROVENANCE RATCHET (plan 06, task B5, 2026-10-04): on every page in scripts/harness/pages.json, the figures that do not
 * say where they came from, counted, held to a baseline that only falls.
 *
 * A FIGURE IS AN ELEMENT CARRYING THE `fig` CLASS: the kit's `Fig`, the hero's answer, the answer card's figure, the class the
 * model laws' FIGURE FACE already reads as "a number the page prints". A figure SAYS WHERE IT CAME FROM when it carries both
 * `data-src` (the file and key it was read from) and `data-kind` (counted, worked out, looked up, estimate; src/lib/spine/
 * provenance.ts). The truth pass's figures carry both; every other figure is counted here, page by page, and the count may only
 * fall: a new figure printed without its provenance turns this red.
 *
 * ITS BLIND SPOT, stated before its numbers: it sees only HTML elements with the `fig` class. A number in a plain span (the hero
 * board's row values, a table cell drawn without the class), in an SVG `<text>` or in an aria label is no figure to this check,
 * so a page can print an unattributed number it never counts; and it cannot tell a true `data-src` from a false one, only that
 * one is there (the gates that test each builder check the figure against its file). It reads the static renders the chain's
 * `pages-fresh` writes, with no browser: a figure a client component adds after hydration is not in them.
 *
 * usage: node scripts/harness/check_provenance.mjs [--list[=scripts/harness/pages.json]] [--write-baseline]
 *        --write-baseline lowers a page's baseline to its count (never raises it); a page not yet in the file is seeded.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { basename } from "node:path";
import { JSDOM } from "jsdom";
import { preflight } from "./preflight.mjs";

preflight({ name: "check_provenance" });

const args = process.argv.slice(2);
const listArg = args.find((a) => a.startsWith("--list"));
const LIST = listArg && listArg.includes("=") ? listArg.slice("--list=".length) : "scripts/harness/pages.json";
const WRITE = args.includes("--write-baseline");
const BASELINE = "scripts/harness/provenance_baseline.json";
const KINDS = new Set(["counted", "worked out", "looked up", "estimate"]);

const files = JSON.parse(readFileSync(LIST, "utf8")).pages.map((p) => `scratchpad/harness/pages/${p.surface}-${p.slugs.join("-")}.html`);
const stored = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : { why: "", pages: {} };
const reds = [];
const rows = [];
let seeded = 0;

for (const file of files) {
  const name = basename(file, ".html");
  if (!existsSync(file)) { reds.push(`${name}: NO RENDER under scratchpad/harness/pages (run pages-fresh first)`); continue; }
  /* The render inlines the site's whole stylesheet; this check reads markup only, so the styles go before parsing (faster, and
     the parser's complaints about modern CSS stay out of the log). */
  const html = readFileSync(file, "utf8").replace(/<style[^>]*>[\s\S]*?<\/style>/g, "");
  const doc = new JSDOM(html).window.document;
  const figs = [...doc.querySelectorAll(".fig")];
  const said = figs.filter((el) => el.getAttribute("data-src") && KINDS.has(el.getAttribute("data-kind") ?? ""));
  /* A kind outside the ledger's four is a figure that says something wrong about itself: a red on its own, not a pass. */
  const wrongKind = figs.filter((el) => el.hasAttribute("data-kind") && !KINDS.has(el.getAttribute("data-kind") ?? ""));
  for (const el of wrongKind) reds.push(`${name}: a figure "${el.textContent.trim().slice(0, 40)}" says its kind is "${el.getAttribute("data-kind")}", not one of the ledger's four`);
  const silent = figs.length - said.length;
  rows.push(`${name}: ${figs.length} figures, ${said.length} say where they came from, ${silent} do not`);
  const base = stored.pages[name];
  if (base === undefined) {
    if (WRITE) { stored.pages[name] = silent; seeded++; }
    else reds.push(`${name}: no baseline (run with --write-baseline once to seed it at ${silent})`);
  } else if (silent > base) {
    reds.push(`${name}: ${silent} figures without their provenance against a baseline of ${base}`);
  } else if (silent < base && WRITE) {
    stored.pages[name] = silent;
  } else if (silent < base) {
    rows.push(`  ${name}: ${silent} under the baseline of ${base}; run with --write-baseline to lower it`);
  }
}

for (const r of rows) console.log(r);
if (WRITE) {
  stored.why = stored.why || "The provenance ratchet (plan 06, task B5): per harness page, the figures (the `fig` class) printed without both data-src and data-kind. It only falls: lower it with --write-baseline, never raise it by hand.";
  writeFileSync(BASELINE, `${JSON.stringify(stored, null, 2)}\n`);
  console.log(`provenance: baseline written${seeded ? ` (${seeded} page(s) seeded)` : ""}`);
}
if (reds.length) {
  for (const r of reds) console.log(`x provenance ${r}. Remedy: stamp the figure with its file and kind (src/lib/spine/provenance.ts) where its builder reads it; never raise the baseline`);
  process.exit(1);
}
console.log(`provenance: ${files.length} pages held to their baseline`);
