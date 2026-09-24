/**
 * verify_gloss_tap: the "?" gloss opens on a tap, on hover and from the
 * keyboard, and closes again (the goal's A8, 2026-09-24).
 *
 * InfoTip moved onto a Radix tooltip on 2026-08-21, and a Radix TOOLTIP never
 * opens from a touch: its trigger marks the press, ignores the focus that
 * follows and closes on the click. From then until this gate, every "?" on
 * the site took focus on a phone and showed nothing (measured on production
 * with a touch device on the city's premises, the district rent card and the
 * country's registering card), while the kit's note said "it works on TAP at
 * 390px". A render cannot see this: the harness pages are server markup with
 * no script. So this gate bundles the component itself (esbuild, from
 * src/components/kit/InfoTip.tsx through the tsconfig alias), mounts three
 * tips in a bare page and drives a real browser:
 *
 *   1. PHONE (375, touch): a tap opens the panel with the gloss; a second tap
 *      on the same "?" closes it; a tap opens it again and a tap on the page
 *      beside it closes it;
 *   2. DESKTOP (1280, mouse): hovering the "?" opens it, and leaving closes it;
 *   3. KEYBOARD: Tab to the "?" opens it and Escape closes it.
 *
 * Open means the trigger carries `aria-describedby` and the element it names
 * holds the gloss, which is how Radix exposes it to a screen reader too.
 *
 * BLIND SPOT: it tests the component alone, not a page's placement of it; a
 * card that clips its overflow could still hide an open panel. No network: the
 * bundle and the browser are local. A BUILD SERVER HAS NO BROWSER, so it skips
 * loudly there through requireBrowser, as every browser gate does (its first
 * push lacked the call and failed batch eight's deploy on Vercel: "Executable
 * doesn't exist at /vercel/.cache/ms-playwright/...").
 */
import { build } from "esbuild";
import { chromium } from "playwright";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { red } from "./lib/red.mjs";
import { requireBrowser } from "./lib/local_only.mjs";

const RULE = "gloss-tap";
const FILE = "src/components/kit/InfoTip.tsx";
const COMPONENT = resolve(process.argv[2] ?? FILE);
const GLOSS = "The share of every $100 of sales that is still there once every cost has been paid.";
const reds = [];
const fail = (detail, remedy) => reds.push(red({ rule: RULE, file: FILE, detail, remedy }));

await requireBrowser(RULE, "whether the \"?\" gloss opens on a tap at 375, on hover at 1280 and from the keyboard (InfoTip bundled and driven in a real browser)");

const dir = mkdtempSync(join(tmpdir(), "gloss-tap-"));
const entry = join(dir, "entry.tsx");
writeFileSync(entry, `
import * as React from "react";
import { createRoot } from "react-dom/client";
import { InfoTip } from ${JSON.stringify(COMPONENT.replace(/\\/g, "/"))};
function Page() {
  return (
    <div style={{ padding: 120, fontFamily: "sans-serif" }}>
      <p id="a">Net profit margin <InfoTip gloss={${JSON.stringify(GLOSS)}} /></p>
      <p id="b" style={{ marginTop: 200 }}>Fit-out <InfoTip gloss="What it costs to turn an empty shop into your shop." /></p>
      <p id="c" style={{ marginTop: 200 }}>Legal form <InfoTip gloss="The shape a business takes in law." /></p>
      <p id="away" style={{ marginTop: 400 }}>Elsewhere on the page.</p>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<Page />);
`);

let js;
try {
  const out = await build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    format: "iife",
    platform: "browser",
    jsx: "automatic",
    tsconfig: resolve("tsconfig.json"),
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "silent",
    absWorkingDir: resolve("."),
    nodePaths: [resolve("node_modules")],
  });
  js = out.outputFiles[0].text;
} catch (e) {
  fail(`the component did not bundle: ${String(e.message ?? e).split("\n")[0]}`, "keep InfoTip a self-contained client component the bundler can build");
}

if (js) {
  const page = join(dir, "page.html");
  writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="root"></div><script>${js.replace(/<\/script/gi, "<\\/script")}</script></body></html>`);
  const url = pathToFileURL(page).href;
  const browser = await chromium.launch();
  const state = (p, id) =>
    p.evaluate((id) => {
      const t = document.querySelector(`#${id} [aria-label="What this means"]`);
      const d = t?.getAttribute("aria-describedby");
      const el = d ? document.getElementById(d) : null;
      return { open: !!el, text: el ? el.textContent.trim() : "" };
    }, id);
  const settle = (p, ms = 350) => p.waitForTimeout(ms);
  try {
    // 1. Phone.
    const phone = await browser.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true, isMobile: true });
    const p1 = await phone.newPage();
    await p1.goto(url);
    await p1.waitForSelector('#a [aria-label="What this means"]');
    const tipA = p1.locator('#a [aria-label="What this means"]');
    await tipA.tap();
    await settle(p1);
    let s = await state(p1, "a");
    if (!s.open) fail("a tap on the \"?\" at 375 with a touch screen opened nothing", "open the tip on a press (a controlled open that the click toggles)");
    else if (!s.text.includes("every $100")) fail(`the tapped tip opened without its gloss ("${s.text.slice(0, 60)}")`, "render the gloss in the tip's content");
    await tipA.tap();
    await settle(p1);
    s = await state(p1, "a");
    if (s.open) fail("a second tap on the same \"?\" left the tip open", "toggle from the state the tip was in when the press began");
    await tipA.tap();
    await settle(p1);
    await p1.locator("#away").tap();
    await settle(p1);
    s = await state(p1, "a");
    if (s.open) fail("a tap elsewhere on the page left the tip open", "let Radix's outside press close it");
    await phone.close();

    // 2. Desktop hover.
    const desk = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const p2 = await desk.newPage();
    await p2.goto(url);
    await p2.waitForSelector('#b [aria-label="What this means"]');
    await p2.locator('#b [aria-label="What this means"]').hover();
    await settle(p2, 500);
    s = await state(p2, "b");
    if (!s.open) fail("hovering the \"?\" at 1280 opened nothing", "keep Radix's hover open (onOpenChange wired to the controlled state)");
    /* In steps, as a hand moves a mouse: Radix closes a hoverable tip once a
       pointer move lands outside the grace area it drew when the pointer left. */
    await p2.mouse.move(5, 5, { steps: 10 });
    await settle(p2, 600);
    s = await state(p2, "b");
    if (s.open) fail("moving the mouse away left the tip open", "keep Radix's hover close wired to the controlled state");

    // 3. Keyboard.
    await p2.locator("body").click({ position: { x: 5, y: 5 } });
    let reached = false;
    for (let i = 0; i < 6 && !reached; i++) {
      await p2.keyboard.press("Tab");
      reached = await p2.evaluate(() => document.activeElement?.closest("#c") != null);
    }
    await settle(p2);
    s = await state(p2, "c");
    if (!reached) fail("Tab never reached the third \"?\"", "keep the trigger a focusable button");
    else if (!s.open) fail("focusing the \"?\" from the keyboard opened nothing", "keep Radix's focus open");
    await p2.keyboard.press("Escape");
    await settle(p2);
    s = await state(p2, "c");
    if (s.open) fail("Escape left the tip open", "keep Radix's Escape close");
    await desk.close();
  } finally {
    await browser.close();
  }
}
rmSync(dir, { recursive: true, force: true });

if (reds.length) {
  console.error(`verify_gloss_tap: ${reds.length} red(s) above`);
  process.exit(1);
}
console.log("verify_gloss_tap: the \"?\" opens on a tap at 375 with a touch screen and closes on a second tap and on a tap beside it; it opens on hover at 1280 and closes when the mouse leaves; it opens on keyboard focus and closes on Escape.");
