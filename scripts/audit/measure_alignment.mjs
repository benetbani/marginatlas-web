#!/usr/bin/env node
/**
 * measure_alignment , WHAT THE PAGES ACTUALLY ALIGN AND HOW (2026-09-23, his
 * ruling: "solidify rules about text alignment as I see that in some cases the
 * alignment is not good, so either left, center or right, and it damages the
 * readability").
 *
 * Measured before the rule is written, the way DISTANCES.md was. It reads the
 * rendered pages and reports four things, none of them judged here:
 *
 *  1. CENTRED RUNS OF TEXT: every leaf whose computed text-align is center,
 *     with its word count. A centred sentence is the fault he is naming; a
 *     centred month initial under its own column is not.
 *  2. RIGHT-ALIGNED LEAVES: the same for right, which is correct for a figure
 *     in a column of figures and wrong for a sentence.
 *  3. MIXED COLUMNS: inside one grid or table, a column whose cells do not
 *     share an alignment. This is the one a reader feels without seeing: two
 *     figures in a column, one right, one left.
 *  4. RAGGED FIGURE EDGES: right-aligned figures in one column whose right
 *     edges differ by more than a pixel, which means they are not in the same
 *     column at all.
 *
 * WHAT IT CANNOT SEE, STATED: alignment produced by a flex `justify-*` rather
 * than `text-align`, which is how most label-and-figure rows are built here.
 * Those are the LABEL GAP rule's business in the model laws, and this
 * instrument says nothing about them.
 *
 *   node scripts/audit/measure_alignment.mjs [--list] [<rendered.html> ...]
 */
import { readFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { chromium } from "playwright";
import { preflight } from "../harness/preflight.mjs";

preflight({ browser: true, name: "measure_alignment" });

const PAGES_DIR = "scratchpad/harness/pages";
const LIST = "scripts/harness/pages.json";
const named = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const files = named.length
  ? named
  : JSON.parse(readFileSync(LIST, "utf8")).pages.map((p) => join(PAGES_DIR, `${p.surface}-${p.slugs.join("-")}.html`)).filter((f) => existsSync(f));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1200 } });

const rows = [];
for (const f of files) {
  await page.goto("file://" + process.cwd().replace(/\\/g, "/") + "/" + f.replace(/\\/g, "/"));
  await page.waitForTimeout(250);
  const r = await page.evaluate(() => {
    const leaves = [...document.querySelectorAll("main *")].filter(
      (e) => e.children.length === 0 && (e.textContent || "").trim() && e.getClientRects().length,
    );
    const centred = [];
    const right = [];
    for (const e of leaves) {
      const a = getComputedStyle(e).textAlign;
      const text = (e.textContent || "").trim();
      const words = text.split(/\s+/).length;
      const card = e.closest("[data-card]");
      const inDrawing = !!e.closest("[data-visual='1'], [data-archetype='ring'], [data-archetype='donut']");
      const row = { text: text.slice(0, 40), words, card: card?.id || "", inDrawing };
      if (a === "center") centred.push(row);
      if (a === "right" || a === "end") right.push(row);
    }
    /* A COLUMN IS ONE POSITION INSIDE A REPEATED ROW. Rows are `[data-row]`
       elements that share a parent; the nth child of each is one column. */
    const mixed = [];
    const ragged = [];
    for (const host of new Set([...document.querySelectorAll("main [data-row]")].map((r) => r.parentElement))) {
      const rs = [...host.children].filter((c) => c.matches("[data-row]"));
      if (rs.length < 2) continue;
      const cols = Math.max(...rs.map((r) => r.children.length));
      for (let i = 0; i < cols; i++) {
        const cells = rs.map((r) => r.children[i]).filter(Boolean);
        if (cells.length < 2) continue;
        const aligns = new Set(cells.map((c) => getComputedStyle(c).textAlign));
        if (aligns.size > 1) mixed.push({ card: host.closest("[data-card]")?.id || "", col: i, aligns: [...aligns].join("/") });
        const rights = cells.filter((c) => getComputedStyle(c).textAlign === "right").map((c) => Math.round(c.getBoundingClientRect().right));
        if (rights.length > 1 && new Set(rights).size > 1) ragged.push({ card: host.closest("[data-card]")?.id || "", col: i, edges: [...new Set(rights)].join(",") });
      }
    }
    return { centred, right, mixed, ragged, leaves: leaves.length };
  });
  rows.push({ name: basename(f, ".html"), ...r });
}
await browser.close();

let totalCentredSentences = 0;
for (const r of rows) {
  const sentences = r.centred.filter((c) => c.words >= 4 && !c.inDrawing);
  totalCentredSentences += sentences.length;
  console.log(`${r.name}: ${r.leaves} text leaves, ${r.centred.length} centred (${sentences.length} of 4 words or more outside a drawing), ${r.right.length} right, ${r.mixed.length} mixed column(s), ${r.ragged.length} ragged figure column(s)`);
  for (const s of sentences) console.log(`   centred sentence in #${s.card}: "${s.text}" (${s.words} words)`);
  for (const m of r.mixed) console.log(`   mixed column ${m.col} in #${m.card}: ${m.aligns}`);
  for (const g of r.ragged) console.log(`   ragged right edges, column ${g.col} in #${g.card}: ${g.edges}`);
}
console.log(`\ncentred sentences outside a drawing, all pages: ${totalCentredSentences}`);
