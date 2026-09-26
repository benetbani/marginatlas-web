/**
 * verify_interact: A DRAWING'S PARTS ANSWER THE READER, AND ONLY WITH THE DRAWING'S OWN DATA (goal 2026-09-26, his message of that
 * afternoon: "study the potential dynamism of all sections ... popup effects, hover on inside elements, data change as lever";
 * the mechanisms and their laws are E:/atlas/design/loop/build/goal-2026-09-26/PLAN.md section 3).
 *
 * PART 1, THE BEHAVIOUR, IN A REAL BROWSER. The pages the harness reads are server markup with no script, so a render cannot see
 * a hover. As verify_gloss_tap does for the "?", this gate bundles the component itself (esbuild, through the tsconfig alias),
 * mounts it on a fixture shaped like the age bars (two bars of five parts and a legend) and drives it:
 *   M1 THE READOUT: at 1280 a mouse over a band opens the panel with that band's figure and words, and leaving the drawing closes
 *     it; from the keyboard, Tab to the drawing opens the first band, the right arrow the second, End the last, Escape closes;
 *     at 375 with a touch screen a tap opens a band, a second tap on it closes it, and a tap outside closes it; the panel stays
 *     inside the drawing's width at the first band and the last.
 *   M2 THE LINKED PARTS: while a band is active every element of another part carries `data-dim` and none of its own part does;
 *     a mouse over a legend entry lights that part in both bars; nothing is dimmed once the drawing is left.
 * PART 2, THE MARKUP ON EVERY PAGE THE HARNESS RENDERS (scripts/harness/pages.json): a mark carrying a reading or a part outside a
 * drawing that listens (`[data-interactive="marks"]`) is a reading nobody can reach; a listening drawing with no role, no tab stop or no name
 * is one a keyboard or a screen reader cannot use; and a reading whose figure appears nowhere in its drawing's words or labels
 * says something the drawing does not hold (the panel may only say what is already there).
 *
 * BLIND SPOT: part 1 tests the component on a fixture, not each page's placement; part 2 reads the markup, not the motion. A
 * build server has no browser, so the gate skips loudly there through requireBrowser, as every browser gate does.
 */
import { build } from "esbuild";
import { chromium } from "playwright";
import { mkdtempSync, writeFileSync, rmSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { red } from "./lib/red.mjs";
import { requireBrowser } from "./lib/local_only.mjs";

const RULE = "interact";
const FILE = "src/components/spine/interact/Marks.tsx";
/* A path in argv[2] tests a copy of the component instead (the plant: a copy with a behaviour removed must red). */
const COMPONENT = resolve(process.argv[2] ?? FILE);
const reds = [];
const fail = (detail, remedy, file = FILE) => reds.push(red({ rule: RULE, file, detail, remedy }));

await requireBrowser(RULE, "whether a drawing's parts open their reading on hover, focus and tap and light their part (Marks bundled and driven in a real browser), and whether every page's readings sit in a drawing that listens");

const dir = mkdtempSync(join(tmpdir(), "interact-"));
const entry = join(dir, "entry.tsx");
writeFileSync(entry, `
import * as React from "react";
import { createRoot } from "react-dom/client";
import { Marks } from ${JSON.stringify(COMPONENT.replace(/\\/g, "/"))};
const BANDS = [["a", "Under 16", 18, 18], ["b", "16 to 24", 11, 12], ["c", "25 to 49", 33, 41], ["d", "50 to 64", 19, 17], ["e", "65 and over", 19, 12]];
function Bar({ name, i }) {
  return (
    <div style={{ display: "flex", height: 36, width: "100%", gap: 2, marginTop: 24 }} role="img" aria-label={name + ": " + BANDS.map((b) => b[1] + " " + b[2 + i] + "%").join(", ")}>
      {BANDS.map((b) => (
        <span key={b[0]} id={"bar" + i + "-" + b[0]} data-part-key={b[0]} data-readout-figure={b[2 + i] + "%"} data-readout-words={name + ", " + b[1]} style={{ width: b[2 + i] + "%", background: "#ccc", display: "block" }} />
      ))}
    </div>
  );
}
function Page() {
  return (
    <div style={{ padding: "120px 40px", fontFamily: "sans-serif" }}>
      <p id="before">Before the drawing.</p>
      <Marks label="People by age: the UK and London">
        <Bar name="The UK" i={0} />
        <Bar name="London" i={1} />
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          {BANDS.map((b) => <span key={b[0]} id={"leg-" + b[0]} data-part-key={b[0]}>{b[1]}</span>)}
        </div>
      </Marks>
      <p id="away" style={{ marginTop: 300 }}>Elsewhere on the page.</p>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<Page />);
`);

let js;
try {
  const out = await build({
    entryPoints: [entry], bundle: true, write: false, format: "iife", platform: "browser", jsx: "automatic",
    tsconfig: resolve("tsconfig.json"), define: { "process.env.NODE_ENV": '"production"' }, logLevel: "silent",
    absWorkingDir: resolve("."), nodePaths: [resolve("node_modules")],
  });
  js = out.outputFiles[0].text;
} catch (e) {
  fail(`the component did not bundle: ${String(e.message ?? e).split("\n")[0]}`, "keep Marks a self-contained client component the bundler can build");
}

const browser = await chromium.launch();
try {
  if (js) {
    const page = join(dir, "page.html");
    writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0"><div id="root"></div><script>${js.replace(/<\/script/gi, "<\\/script")}</script></body></html>`);
    const url = pathToFileURL(page).href;
    const state = (p) => p.evaluate(() => {
      const panel = document.querySelector("[data-readout-panel]");
      const root = document.querySelector('[data-interactive="marks"]');
      const open = !!panel && getComputedStyle(panel).clipPath === "none" && panel.textContent.trim().length > 0;
      const pb = panel?.getBoundingClientRect(), rb = root?.getBoundingClientRect();
      const dimmed = [...document.querySelectorAll("[data-part-key][data-dim]")].map((e) => e.id);
      return { open, text: panel ? panel.textContent.trim() : "", inside: open && pb && rb ? pb.left >= rb.left - 1 && pb.right <= rb.right + 1 : true, dimmed };
    });
    const settle = (p, ms = 150) => p.waitForTimeout(ms);

    /* Desktop: hover, leave, the legend. */
    const desk = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const p1 = await desk.newPage();
    await p1.goto(url);
    await p1.waitForSelector('[data-interactive="marks"]');
    await p1.locator("#bar1-c").hover();
    await settle(p1);
    let s = await state(p1);
    if (!s.open) fail("a mouse over a band at 1280 opened no reading", "open the panel on a mouse's pointer over a mark (M1)");
    else if (!s.text.includes("41%") || !s.text.includes("London, 25 to 49")) fail(`the band's panel read "${s.text}", not its own figure and words`, "fill the panel from the mark's data-readout-figure and data-readout-words");
    const others = s.dimmed.filter((id) => !id.endsWith("-c")).length, own = s.dimmed.filter((id) => id.endsWith("-c")).length;
    if (others !== 12 || own !== 0) fail(`with one band active, ${others} of 12 other parts' elements were dimmed and ${own} of its own`, "dim every element of another part and none of the active part's (M2)");
    await p1.mouse.move(5, 5, { steps: 8 });
    await settle(p1);
    s = await state(p1);
    if (s.open) fail("the panel stayed open after the mouse left the drawing", "close on the pointer leaving the drawing");
    if (s.dimmed.length) fail(`${s.dimmed.length} element(s) stayed dimmed after the mouse left`, "clear every data-dim when no part is active");
    await p1.locator("#leg-e").hover();
    await settle(p1);
    s = await state(p1);
    const lit = s.dimmed.filter((id) => id.endsWith("-e")).length, unlit = s.dimmed.filter((id) => !id.endsWith("-e")).length;
    if (lit !== 0 || unlit !== 12) fail(`a mouse over the legend's "65 and over" left ${unlit} of 12 other parts' elements dimmed and dimmed ${lit} of its own`, "a legend entry carries its part's key and lights the part in every bar");
    await p1.locator("#bar0-a").hover();
    await settle(p1);
    s = await state(p1);
    if (!s.inside) fail("the panel over the first band ran past the drawing's left edge", "clamp the panel inside the drawing's width");
    await p1.locator("#bar0-e").hover();
    await settle(p1);
    s = await state(p1);
    if (!s.inside) fail("the panel over the last band ran past the drawing's right edge", "clamp the panel inside the drawing's width");

    /* Keyboard. */
    await p1.mouse.move(5, 5);
    await p1.locator("#before").click();
    let reached = false;
    for (let i = 0; i < 5 && !reached; i++) {
      await p1.keyboard.press("Tab");
      reached = await p1.evaluate(() => document.activeElement?.getAttribute("data-interactive") === "marks");
    }
    await settle(p1);
    s = await state(p1);
    if (!reached) fail("Tab never reached the drawing", "the drawing is one tab stop (tabIndex 0 on the wrapper)");
    else {
      if (!s.open || !s.text.includes("18%")) fail(`focusing the drawing from the keyboard opened "${s.text}", not the first band`, "open the first readable mark on focus");
      await p1.keyboard.press("ArrowRight");
      await settle(p1);
      s = await state(p1);
      if (!s.text.includes("11%")) fail(`the right arrow opened "${s.text}", not the second band`, "walk the readable marks in the page's order");
      await p1.keyboard.press("End");
      await settle(p1);
      s = await state(p1);
      if (!s.text.includes("London, 65 and over")) fail(`End opened "${s.text}", not the last band`, "End goes to the last readable mark");
      await p1.keyboard.press("Escape");
      await settle(p1);
      s = await state(p1);
      if (s.open) fail("Escape left the panel open", "close on Escape");
    }
    await desk.close();

    /* Phone: taps. */
    const phone = await browser.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
    const p2 = await phone.newPage();
    await p2.goto(url);
    await p2.waitForSelector('[data-interactive="marks"]');
    await p2.locator("#bar0-c").tap();
    await settle(p2);
    s = await state(p2);
    if (!s.open || !s.text.includes("33%")) fail(`a tap on a band at 375 opened "${s.text}"`, "open the panel on a touch press (M1)");
    await p2.locator("#bar0-c").tap();
    await settle(p2);
    s = await state(p2);
    if (s.open) fail("a second tap on the same band left the panel open", "a second tap on the active mark closes it");
    await p2.locator("#bar0-d").tap();
    await settle(p2);
    await p2.locator("#away").tap();
    await settle(p2);
    s = await state(p2);
    if (s.open) fail("a tap elsewhere on the page left the panel open", "close on a press outside the drawing");
    if (s.dimmed.length) fail(`${s.dimmed.length} element(s) stayed dimmed after a tap elsewhere`, "clear every data-dim when the panel closes");
    await phone.close();
  }

  /* PART 2: the markup on the rendered pages. */
  const LIST = "scripts/harness/pages.json";
  const pages = JSON.parse(readFileSync(LIST, "utf8")).pages.map((p) => `scratchpad/harness/pages/${p.surface}-${p.slugs.join("-")}.html`).filter((f) => existsSync(f));
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const pg = await ctx.newPage();
  let drawings = 0, readings = 0;
  for (const f of pages) {
    await pg.goto(pathToFileURL(resolve(f)).href, { waitUntil: "load" });
    const r = await pg.evaluate(() => {
      const out = { orphans: [], unnamed: [], unheld: [], drawings: 0, readings: 0 };
      for (const el of document.querySelectorAll("main [data-readout-figure], main [data-part-key]")) {
        if (!el.closest('[data-interactive="marks"]')) out.orphans.push((el.getAttribute("data-readout-figure") || el.getAttribute("data-part-key") || "").slice(0, 30));
      }
      for (const root of document.querySelectorAll('main [data-interactive="marks"]')) {
        out.drawings++;
        if (root.getAttribute("role") !== "group" || root.getAttribute("tabindex") !== "0" || !(root.getAttribute("aria-label") || "").trim()) out.unnamed.push((root.closest("[id]") || {}).id || "?");
        const held = [root.textContent || "", ...[...root.querySelectorAll("[aria-label]")].map((e) => e.getAttribute("aria-label")), root.getAttribute("aria-label") || ""].join(" | ");
        for (const m of root.querySelectorAll("[data-readout-figure]")) {
          out.readings++;
          const fig = m.getAttribute("data-readout-figure");
          if (fig && !held.includes(fig)) out.unheld.push(`${(root.closest("[id]") || {}).id || "?"}: ${fig}`);
        }
      }
      return out;
    });
    drawings += r.drawings; readings += r.readings;
    const name = f.replace(/^.*\//, "");
    for (const o of r.orphans) fail(`${name}: a reading or part ("${o}") outside any drawing that listens`, "wrap the drawing in Marks (src/components/spine/interact/Marks.tsx) or drop the attribute", f);
    for (const u of r.unnamed) fail(`${name} #${u}: a listening drawing without role group, a tab stop or a name`, "keep Marks' role, tabIndex and aria-label", f);
    for (const u of r.unheld) fail(`${name} ${u}: a reading whose figure is in none of the drawing's words or labels`, "the panel may only say what the drawing holds: put the figure in the drawing's label", f);
  }
  await ctx.close();
  console.log(`verify_interact: the markup of ${pages.length} rendered page(s): ${drawings} listening drawing(s), ${readings} reading(s)`);
} finally {
  await browser.close();
  rmSync(dir, { recursive: true, force: true });
}

if (reds.length) {
  console.error(`verify_interact: ${reds.length} red(s) above`);
  process.exit(1);
}
console.log("verify_interact: a band's reading opens on a mouse, the keyboard and a tap, closes on leaving, Escape and a tap elsewhere, stays inside its drawing, and lights its part in every bar and its legend; every reading on the rendered pages sits in a listening drawing and says only what the drawing holds.");
