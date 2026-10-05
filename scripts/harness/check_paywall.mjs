/**
 * THE PAYWALL'S SHAPE (milestone 2, masterplan step 20; his interview of 2026-09-26: 18, half of every UK chapter behind Pro,
 * each chapter's first level free; 22, a locked section is its title and icon, the drawing blurred behind, one line and one
 * button, and no pop-up; "contradictions reconciled", the closed half declared isAccessibleForFree false). Every rule of the
 * paywall phase as a check that runs on every deploy (the repo's working method, rule 4).
 *
 * It renders three locked UK pages itself through the routes' own renderers (scripts/harness/render_page.tsx --locked: the
 * country page, London's city page, London restaurants), never through scripts/harness/pages.json, whose gates would read a
 * locked page's sections as faults, and holds each, read with jsdom, to:
 *   1. the locked sections are exactly the cards of the levels lockedLevelKeys locks, the levels read as drawn: the zones in
 *      order, a chapter opening at its head, the zones before chapter 01 and the close ("Where to next") outside;
 *   2. no first level of a chapter holds a locked section;
 *   3. each locked section has its block, the class pro-locked, a rail with an icon, one paragraph of at most twelve words in
 *      plain copy (no semicolon, no em dash, none of the struck method words), and one link, to /pricing;
 *   4. inside a locked section: no figure (.fig), no provenance (data-kind, data-src), no digit;
 *   5. no dialog, no aria-modal and no fixed full-screen overlay anywhere on the page;
 *   6. one JSON-LD script declaring the page not wholly free, whose selector finds the locked sections.
 * And, from step 16: the open renders pages-fresh writes carry no locked section. Reported, never failed: the distinct internal
 * links a free reader loses on each page (PARKED.md, P20.1).
 *
 * BLIND SPOT: it reads static markup, so it cannot see a pop-up a script would open after load, nor how a locked card looks;
 * the photographs read the drawn page. It reads three pages, one of each locked type, not every UK page.
 *
 * usage: npx tsx scripts/harness/check_paywall.mjs             renders the three locked pages, then checks them
 *        npx tsx scripts/harness/check_paywall.mjs --dir=<d>   checks <d>/<stem>-locked.html without rendering (for plants)
 * Runs under tsx (the chain's runner): it reads the level rule and the copy table from source.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { JSDOM } from "jsdom";
import { preflight } from "./preflight.mjs";
import { red, redSummary } from "../lib/red.mjs";
import { lockedLevelKeys } from "../../src/lib/monetization/levels";
import { COPY } from "../../src/lib/spine/copy";

preflight({ name: "check_paywall" });

const RULE = "paywall-shape";
const REMEDY = "draw a locked UK page as his rulings 18 and 22 say: each chapter's first level open, every later level locked, each locked card its title, icon, one plain line and one link to /pricing, no figure and no pop-up, the closed half declared to search engines";
const DIR = "scratchpad/harness/pages";
const PAGES = [
  { spec: "country:gb", stem: "country-gb", open: "country-GB", source: "src/components/spine/country/country-view.tsx" },
  { spec: "city:london", stem: "city-london", open: "city-london", source: "src/components/spine/city/city-view.tsx" },
  { spec: "cell:gb:london:restaurants", stem: "cell-gb-london-restaurants", open: "cell-gb-london-restaurants", source: "src/components/spine/cell/cell-view.tsx" },
];
/* The plain-copy gate's own list (scripts/harness/check_copy_plain.mjs, BANNED, evaluated in its browser): the method words his
   copy correction of 2026-09-24 struck. Held here as well because that list lives inside a function the browser runs. */
const STRUCK = [/\bmodell?ed\b/i, /\bwithheld\b/i, /\bon file\b/i, /\bnot gathered\b/i, /\bnot measured\b/i, /typical for the trade anywhere/i, /\bthe model\b/i, /\bplaceholder\b/i, /as on the opening card/i, /\bworked from\b/i];

const dirArg = process.argv.find((a) => a.startsWith("--dir="));
const dir = dirArg ? dirArg.slice("--dir=".length) : DIR;

if (!dirArg) {
  const started = Date.now();
  const r = spawnSync(process.execPath, [
    "node_modules/tsx/dist/cli.mjs", "--tsconfig", "scripts/tsconfig.harness.json",
    "--require", "./scripts/harness/env.cjs", "--require", "./scripts/spikes/stub_next_font.cjs",
    "scripts/harness/render_page.tsx", "--locked", ...PAGES.map((p) => p.spec),
  ], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  /* The renderer can crash on exit after writing (the libuv assertion pages-fresh documents), so a render counts by its file,
     written after this run began, never by the exit code alone. */
  for (const p of PAGES) {
    const f = `${DIR}/${p.stem}-locked.html`;
    if (!existsSync(f) || statSync(f).mtimeMs < started - 1000) {
      console.error((r.stdout ?? "") + (r.stderr ?? ""));
      red({ rule: RULE, file: "scripts/harness/render_page.tsx", detail: `the locked render ${f} was not written by this run (exit ${r.status})`, remedy: "make render_page.tsx --locked draw the three UK pages" });
      redSummary(RULE, 1, REMEDY, "a locked page did not render");
      process.exit(1);
    }
  }
}

let failed = 0;
const fault = (p, detail) => { failed++; red({ rule: RULE, file: p.source, detail: `${p.stem}: ${detail}`, remedy: REMEDY }); };
const topBlocks = (root) => [...root.querySelectorAll("[data-block]")].filter((b) => !b.parentElement?.closest("[data-block]"));
const internalLinks = (doc) => new Set([...doc.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href")));

for (const p of PAGES) {
  const file = `${dir}/${p.stem}-locked.html`;
  if (!existsSync(file)) { fault(p, `no locked render at ${file}`); continue; }
  const dom = new JSDOM(readFileSync(file, "utf8").replace(/<style[\s\S]*?<\/style>/g, ""));
  const doc = dom.window.document;

  // 1 and 2: the levels as drawn, and what locks.
  let inChapters = false;
  const levels = [...doc.querySelectorAll("section[data-zone]")].map((z, i) => {
    const head = z.querySelector("[data-chapter-head]")?.getAttribute("data-chapter-head") ?? null;
    if (head) inChapters = true;
    const label = z.getAttribute("data-zone-label") ?? "";
    return { key: `z${i}`, chapter: head, outside: !inChapters || label === COPY.close.kicker, label, zone: z };
  });
  const lockedZones = lockedLevelKeys(levels.map(({ key, chapter, outside }) => ({ key, chapter, outside })));
  const expected = levels.filter((l) => lockedZones.has(l.key)).flatMap((l) => topBlocks(l.zone).map((b) => b.getAttribute("data-block"))).sort();
  const locked = [...doc.querySelectorAll("[data-locked]")];
  const got = locked.map((b) => b.getAttribute("data-block") ?? b.id).sort();
  if (expected.length === 0) fault(p, "no level locks: the page drew no chapters, or the render is not a locked one");
  if (JSON.stringify(got) !== JSON.stringify(expected)) fault(p, `locked ${got.join(", ") || "nothing"}; the levels lock ${expected.join(", ") || "nothing"} (rule 1, his ruling 18)`);
  for (const l of levels) if (l.chapter && l.zone.querySelector("[data-locked]")) fault(p, `chapter ${l.chapter}'s first level ("${l.label}") holds a locked section (rule 2, each chapter opens free)`);

  // 3 and 4: each locked card.
  for (const card of locked) {
    const id = card.getAttribute("data-block") ?? card.id ?? "?";
    if (!card.hasAttribute("data-block")) fault(p, `${id}: a locked card without its block`);
    if (!card.classList.contains("pro-locked")) fault(p, `${id}: a locked card without the class pro-locked`);
    if (!card.querySelector("[data-rail] svg")) fault(p, `${id}: a locked card without its rail's icon`);
    const ps = [...card.querySelectorAll("p")];
    if (ps.length !== 1) fault(p, `${id}: ${ps.length} paragraphs, one line is the rule`);
    for (const para of ps) {
      const text = (para.textContent ?? "").trim();
      const words = text.split(/\s+/).filter(Boolean).length;
      if (words > 12) fault(p, `${id}: its line runs ${words} words ("${text}"), twelve at most`);
      if (/[;—]/.test(text)) fault(p, `${id}: its line holds a semicolon or an em dash ("${text}")`);
      const struck = STRUCK.find((re) => re.test(text));
      if (struck) fault(p, `${id}: its line holds a struck method word ("${text}")`);
    }
    const links = [...card.querySelectorAll("a")];
    if (links.length !== 1 || links[0].getAttribute("href") !== "/pricing") fault(p, `${id}: links ${links.map((a) => a.getAttribute("href")).join(", ") || "nothing"}; one link, to /pricing`);
    if (card.querySelector(".fig, [data-kind], [data-src]")) fault(p, `${id}: a figure or its provenance inside a locked card (rule 4: a cached page is read by everyone)`);
    if (/\d/.test(card.textContent ?? "")) fault(p, `${id}: a digit inside a locked card ("${(card.textContent ?? "").trim().slice(0, 60)}")`);
  }

  // 5: no pop-up anywhere.
  const popup = doc.querySelector('[role="dialog"], [aria-modal], dialog');
  if (popup) fault(p, `a dialog on the page (<${popup.tagName.toLowerCase()}>), his ruling 22: no pop-up`);
  const overlay = [...doc.querySelectorAll("[class]")].find((el) => el.classList.contains("fixed") && el.classList.contains("inset-0"));
  if (overlay) fault(p, "a fixed full-screen overlay on the page, his ruling 22: no pop-up");

  // 6: the closed half, declared.
  const declared = [...doc.querySelectorAll('script[type="application/ld+json"]')]
    .map((s) => { try { return JSON.parse(s.textContent ?? ""); } catch { return null; } })
    .filter((d) => d && d.isAccessibleForFree === false);
  if (declared.length !== 1) fault(p, `${declared.length} JSON-LD scripts declare the page not wholly free; one is the rule`);
  for (const d of declared) {
    const selectors = (d.hasPart ?? []).map((part) => part.cssSelector).filter(Boolean);
    if (selectors.length === 0 || selectors.some((sel) => doc.querySelectorAll(sel).length === 0)) fault(p, `the declared selector (${selectors.join(", ") || "none"}) finds no locked section`);
  }

  // From step 16: the open render carries no lock. And the links a free reader loses, reported.
  const openFile = `${DIR}/${p.open}.html`;
  if (existsSync(openFile)) {
    const openDoc = new JSDOM(readFileSync(openFile, "utf8").replace(/<style[\s\S]*?<\/style>/g, "")).window.document;
    if (openDoc.querySelector("[data-locked]")) fault(p, `the open render ${openFile} holds a locked section; untold, a view draws no lock`);
    const open = internalLinks(openDoc);
    const kept = internalLinks(doc);
    const lost = [...open].filter((h) => !kept.has(h));
    console.log(`  ${p.stem}: ${locked.length} locked section(s); internal links ${open.size} open, ${kept.size} locked (${lost.length} lost: ${lost.slice(0, 8).join(" ")}${lost.length > 8 ? " ..." : ""})`);
  } else {
    console.log(`  ${p.stem}: ${locked.length} locked section(s); no open render at ${openFile} to compare (pages-fresh writes it)`);
  }
  dom.window.close();
}

if (failed > 0) {
  redSummary(RULE, failed, REMEDY, "the locked pages break the paywall's shape");
  process.exit(1);
}
console.log(`PASS paywall-shape: ${PAGES.length} locked UK pages hold his rulings 18 and 22 and declare their closed half.`);
