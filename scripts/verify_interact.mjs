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
 *   M4 THE SWITCH: the first view shows alone; a click on the second tab shows its panel alone and marks it selected; the left
 *     arrow moves back.
 *   M3 THE LEVERS: the hire lever opens at the card's own $59K; a typed pay of $40,000 gives $45K and a share of $5,005 (15% above
 *     $6,632, the rule and nothing else); the slider's arrow key moves it. The cover picker opens at the four covers' $2,200;
 *     unticking one takes its premium off; a click on the required cover changes nothing.
 *     The survival lever opens on the country's 38%; the South West gives 44% and its words, the country's curve kept behind.
 *     The loan lever opens at the largest amount over five years and moves by the fixed-rate repayment when three are chosen.
 * PART 2, THE MARKUP ON EVERY PAGE THE HARNESS RENDERS (scripts/harness/pages.json): a mark carrying a reading or a part outside a
 * drawing that listens (`[data-interactive="marks"]`) is a reading nobody can reach; a listening drawing with no role, no tab stop or no name
 * is one a keyboard or a screen reader cannot use; a reading whose figure appears nowhere in its drawing's words or labels says
 * something the drawing does not hold (the panel may only say what is already there); a tab without its state or its panel, a
 * slider without a label, a lever whose answer is not announced, and a drawing inside a hidden panel (his ruling of 2026-07-09).
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
import { Switch } from ${JSON.stringify(resolve("src/components/spine/interact/Switch.tsx").replace(/\\/g, "/"))};
import { HireLever } from ${JSON.stringify(resolve("src/components/spine/interact/HireLever.tsx").replace(/\\/g, "/"))};
import { CoverPicker } from ${JSON.stringify(resolve("src/components/spine/interact/CoverPicker.tsx").replace(/\\/g, "/"))};
import { SurvivalCurve } from ${JSON.stringify(resolve("src/components/spine/interact/SurvivalCurve.tsx").replace(/\\/g, "/"))};
import { LoanLever } from ${JSON.stringify(resolve("src/components/spine/interact/LoanLever.tsx").replace(/\\/g, "/"))};
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
      <div id="switch" style={{ marginTop: 60 }}>
        <Switch id="sw" label="Legal and admin costs" views={[{ key: "run", label: "To run", panel: <p id="panel-run">Sixty-six a year</p> }, { key: "close", label: "To close", panel: <p id="panel-close">Seventeen to close</p> }]} />
      </div>
      <div id="hire" style={{ marginTop: 60, maxWidth: 480 }}>
        <HireLever pay={51785} min={33000} rate={15} threshold={6632} words={{ label: "A full-time hire", unit: "a year", salary: "Salary", onCost: "employer's share", rule: "{rate} on pay above {threshold} a year.", lever: "Pay" }} />
      </div>
      <div id="covers" style={{ marginTop: 60, maxWidth: 480 }}>
        <CoverPicker covers={[{ key: "p", label: "Property and contents", usd: 700, required: false }, { key: "e", label: "Employers liability", usd: 600, required: true }, { key: "i", label: "Professional indemnity", usd: 550, required: false }, { key: "l", label: "Public liability", usd: 350, required: false }]} words={{ focal: "a year for the covers ticked", required: "Required", minimum: "at least $6.6M of cover once you employ", aYear: "/yr", tick: "The covers to count" }} />
      </div>
      <div id="survival" style={{ marginTop: 60, maxWidth: 480 }}>
        <SurvivalCurve id="sv" country={[{ year: 1, pct: 94.6 }, { year: 2, pct: 74.7 }, { year: 3, pct: 55.9 }, { year: 4, pct: 45 }, { year: 5, pct: 38.4 }]} regions={[{ key: "south-west", name: "South West", inName: "the South West", points: [{ year: 1, pct: 95 }, { year: 2, pct: 77.7 }, { year: 3, pct: 61 }, { year: 4, pct: 50.1 }, { year: 5, pct: 43.5 }] }]} best={{ name: "South West", pct: 43.5 }} worst={{ name: "West Midlands", pct: 30.6 }} words={{ focal: "of new firms still trading after {n} years", focalIn: "of new firms still trading after {n} years in {region}", start: "Start", year: "Year {n}", regions: "By region, year {n}", choose: "Region", country: "The UK", kicker: "Who is still trading" }} />
      </div>
      <div id="loan" style={{ marginTop: 60, maxWidth: 480 }}>
        <LoanLever min={663} max={33152} rate={7.5} termMin={1} termMax={5} words={{ label: "A start-up loan", perMonth: "a month", amount: "Amount", years: "Years", yearsUnit: "years", total: "{total} repaid over {n} years" }} />
      </div>
      <p id="away" style={{ marginTop: 300, position: "relative", zIndex: 30 }}>Elsewhere on the page.</p>
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

    /* M4 THE SWITCH, M3 THE LEVERS. */
    const d2 = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const p3 = await d2.newPage();
    await p3.goto(url);
    await p3.waitForSelector("#sw-tab-close");
    const SW = "src/components/spine/interact/Switch.tsx", HL = "src/components/spine/interact/HireLever.tsx", CP = "src/components/spine/interact/CoverPicker.tsx";
    const vis = (sel) => p3.evaluate((sel) => { const el = document.querySelector(sel); return !!el && el.getClientRects().length > 0; }, sel);
    if (!(await vis("#panel-run")) || (await vis("#panel-close"))) fail("the switch did not open on its first view alone", "show the first panel and hide the others (M4)", SW);
    await p3.locator("#sw-tab-close").click();
    await settle(p3);
    if (!(await vis("#panel-close")) || (await vis("#panel-run"))) fail("a click on the second tab did not show its panel alone", "the clicked tab's panel shows and the others hide", SW);
    const sel2 = await p3.getAttribute("#sw-tab-close", "aria-selected");
    if (sel2 !== "true") fail(`the clicked tab reads aria-selected="${sel2}"`, "the active tab carries aria-selected true", SW);
    await p3.keyboard.press("ArrowLeft");
    await settle(p3);
    if (!(await vis("#panel-run"))) fail("the left arrow on the second tab did not move to the first", "the arrows move and select (the WAI tabs pattern)", SW);

    const hireTotal = () => p3.evaluate(() => document.querySelector('#hire [aria-live="polite"]')?.textContent.trim() ?? "");
    let t0 = await hireTotal();
    if (t0 !== "$59K") fail(`the hire lever opened at "${t0}", not the card's $59K at the average salary`, "the lever's default is the figure the card prints (M3)", HL);
    const typed = p3.locator('#hire input[type="text"]');
    await typed.fill("40000");
    await typed.press("Enter");
    await settle(p3);
    t0 = await hireTotal();
    const share = await p3.evaluate(() => [...document.querySelectorAll("#hire .fig")].map((e) => e.textContent.trim()).find((t) => t.startsWith("$5,")) ?? "");
    if (t0 !== "$45K" || share !== "$5,005") fail(`a pay of $40,000 gave "${t0}" with a share of "${share}", not $45K and $5,005 (15% of pay above $6,632)`, "recompute by the card's own rule and nothing else", HL);
    const before = await p3.inputValue("#hire-pay-range");
    await p3.locator("#hire-pay-range").focus();
    await p3.keyboard.press("ArrowRight");
    await settle(p3);
    const after = await p3.inputValue("#hire-pay-range");
    if (after === before) fail("the right arrow on the pay slider moved nothing", "keep the native range's keyboard", "src/components/spine/interact/Range.tsx");

    const coverTotal = () => p3.evaluate(() => document.querySelector("#covers [data-focal]")?.textContent.trim() ?? "");
    let c0 = await coverTotal();
    if (c0 !== "$2,200") fail(`the cover picker opened at "${c0}", not the four covers' $2,200`, "all covers ticked at first", CP);
    await p3.locator("#covers label", { hasText: "Public liability" }).click();
    await settle(p3);
    c0 = await coverTotal();
    if (c0 !== "$1,850") fail(`unticking public liability left "${c0}", not $1,850`, "the figure is the sum of the ticked covers", CP);
    await p3.locator("#covers label", { hasText: "Employers liability" }).click({ force: true });
    await settle(p3);
    c0 = await coverTotal();
    const req = await p3.evaluate(() => { const b = [...document.querySelectorAll('#covers input[type="checkbox"]')].find((x) => x.getAttribute("aria-disabled") === "true"); return b ? b.checked : null; });
    if (c0 !== "$1,850" || req !== true) fail(`a click on the required cover changed the figure to "${c0}" or unticked it (${req})`, "the cover the law requires stays ticked", CP);

    const SV = "src/components/spine/interact/SurvivalCurve.tsx", LL = "src/components/spine/interact/LoanLever.tsx";
    const svFigure = () => p3.evaluate(() => document.querySelector("#survival [data-focal]")?.textContent.trim() ?? "");
    const svWords = () => p3.evaluate(() => document.querySelector("#survival [data-focal] + p")?.textContent.trim() ?? "");
    if ((await svFigure()) !== "38%") fail(`the survival lever opened at "${await svFigure()}", not the country's 38%`, "the default is the curve the card printed (M3)", SV);
    await p3.selectOption("#sv-region", "south-west");
    await settle(p3);
    const w2 = await svWords();
    if ((await svFigure()) !== "44%" || !w2.includes("in the South West")) fail(`choosing the South West gave "${await svFigure()}" and "${w2}"`, "the figure and its words follow the region, from the region's own curve", SV);
    const ref = await p3.evaluate(() => !!document.querySelector("#survival [data-reference]"));
    if (!ref) fail("with a region chosen, the country's curve is not drawn behind it", "keep the country's curve as the reference line", SV);

    const loanPay = () => p3.evaluate(() => document.querySelector('#loan [aria-live="polite"]')?.textContent.trim() ?? "");
    const expect = (P, years) => { const r = 0.075 / 12, n = years * 12; const m = (P * r) / (1 - Math.pow(1 + r, -n)); return "$" + Math.round(m).toLocaleString("en-US"); };
    if ((await loanPay()) !== expect(33000, 5)) fail(`the loan lever opened at "${await loanPay()}", not ${expect(33000, 5)} (the largest amount over the longest term)`, "the default is the card's own largest amount and longest term", LL);
    await p3.locator('#loan [role="radio"]', { hasText: "3" }).click();
    await settle(p3);
    if ((await loanPay()) !== expect(33000, 3)) fail(`three years gave "${await loanPay()}", not ${expect(33000, 3)}`, "the monthly repayment of a fixed-rate loan, and nothing else", LL);
    await d2.close();
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
      for (const list of document.querySelectorAll("main [role=tablist]")) {
        for (const tab of list.querySelectorAll("[role=tab]")) {
          const panel = document.getElementById(tab.getAttribute("aria-controls") || "");
          if (!tab.hasAttribute("aria-selected") || !panel || panel.getAttribute("role") !== "tabpanel") out.unnamed.push(`a tab (${(tab.textContent || "").trim()}) without aria-selected or its panel`);
        }
      }
      out.hiddenDrawings = document.querySelectorAll('main [role=tabpanel][hidden] [data-visual="1"]').length;
      for (const r of document.querySelectorAll("main input[type=range]")) {
        const named = (r.id && document.querySelector(`label[for="${r.id}"]`)) || r.getAttribute("aria-label");
        if (!named) out.unnamed.push("a slider without a label");
      }
      for (const lv of document.querySelectorAll("main [data-lever-card]")) {
        if (!lv.querySelector('[aria-live="polite"]')) out.unnamed.push(`a lever (${lv.getAttribute("data-lever-card")}) whose answer is not announced`);
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
    if (r.hiddenDrawings) fail(`${name}: ${r.hiddenDrawings} drawing(s) inside a hidden panel of a switch`, "never hide a drawing behind a switch (his ruling of 2026-07-09): keep the drawing outside and change its data", f);
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
