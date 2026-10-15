/**
 * THE PROGRAMMATIC PROMISE (plan 2026-10-13 country-page-journey, Task 1B; spec section 8: "a replicability test that /gb, /kh, /af and /de
 * draw their slots in the model's order and types"; his question of 2026-10-13, "if the same page is done for Cambodia, would you fill it
 * roughly the same?"). Over the country renders pages-fresh writes (the country entries of scripts/harness/pages.json), statically:
 *   ORDER      the slots a render draws, in document order (the phone's one column), are the model's (src/lib/spine/country_slots.ts), in
 *              its order, each once, and exactly the set this file expects for that country;
 *   TYPE       each slot declares its stage's number and the model's answer type;
 *   NO SEAT    no drawn blocked seat, no "Not known yet";
 *   MASTHEAD   the masthead (#take) holds slots 1 and 2;
 *   INDEX      every link of the page's index ("On this page") lands on an id the render holds (the dead "Time to sell" of 2026-10-13);
 *   FIRST READ the slots a first read meets, printed (the spec's first measure).
 * BLIND SPOT, stated: it reads markup, not what a reader sees (a slot hidden by a stylesheet still counts). The expected sets are the
 * spec's for KH and AF (R5 section 5) and the plan's reading for GB and DE; a set changes only with the data that changes it, written in
 * the step's report, never to make this pass. Slot 5b (the trades' net margins, the controller's ruling on Q1) reads the seed's live cells,
 * which a render without the database cannot reach: where a country's margins stand in the harness snapshot (OPTIONAL below) the render may
 * hold 5b in its place or omit it, and this file cannot distinguish "omitted for want of the database" from "omitted for want of data".
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/country_slots.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { SLOTS, STAGES, type SlotId } from "../../src/lib/spine/country_slots";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "country-slots";
const VIEW = "src/components/spine/country/country-view.tsx";
const REMEDY = "draw the country page from the slot plan (src/lib/spine/slots/plan.ts): every slot its data holds, in the model's order, each stamped data-slot, data-stage and data-answer, no seat; the index built from the drawn slots";
let failed = 0;
const check = (label: string, ok: boolean, file = VIEW) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

/* The UK prints only sourced or marked figures, and its trades' margins are neither, so it draws London's sales (slot 5) and no 5b. */
const GB: SlotId[] = SLOTS.map((s) => s.id).filter((id) => id !== "margins");
const THIN: SlotId[] = ["tax-on-profit", "where-it-stands", "customers", "spend", "open", "hire", "running-costs", "credit", "exit", "dealings", "close"];
const EXPECT: Record<string, SlotId[]> = {
  "country-GB": GB,
  "country-KH": THIN,
  "country-AF": THIN,
  "country-DE": ["tax-on-profit", "where-it-stands", "customers", "spend", "margins", "open", "hire", "running-costs", "credit", "peers", "exit", "dealings", "close"],
};
/* Slots a render may omit where only the database holds their figures (the header's blind spot). */
const OPTIONAL: Record<string, SlotId[]> = { "country-DE": ["margins"] };
const pages = (JSON.parse(readFileSync("scripts/harness/pages.json", "utf8")).pages as Array<{ surface: string; slugs: string[] }>).filter((p) => p.surface === "country").map((p) => `country-${p.slugs.join("-")}`);
check(`the chain renders the four countries the spec names (${pages.join(", ") || "none"})`, ["country-GB", "country-KH", "country-AF", "country-DE"].every((n) => pages.includes(n)), "scripts/harness/pages.json");
const typeOf = new Map(SLOTS.map((s) => [s.id as string, s.type as string]));
const stageN = new Map(SLOTS.map((s) => [s.id as string, String(STAGES.find((g) => g.id === s.stage)?.n ?? "")]));

for (const name of pages) {
  const file = `scratchpad/harness/pages/${name}.html`;
  if (!existsSync(file)) { check(`${name}: a render to read (run the pages-fresh gate)`, false, file); continue; }
  const doc = new JSDOM(readFileSync(file, "utf8").replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document;
  const main = doc.querySelector("main");
  if (!main) { check(`${name}: the render holds a main`, false, file); continue; }
  const els = [...main.querySelectorAll("[data-slot]")];
  const ids = els.map((e) => e.getAttribute("data-slot") ?? "");
  const want = EXPECT[name];
  if (!want) { check(`${name}: this file writes the set it expects`, false, "tests/spine/country_slots.test.ts"); continue; }
  const optional = new Set(OPTIONAL[name] ?? []);
  const required = want.filter((id) => !optional.has(id) || ids.includes(id));
  check(`${name} ORDER: draws ${ids.join(" ") || "no slot"}; the model expects ${required.join(" ")}${optional.size ? ` (${[...optional].join(", ")} where the seed holds it)` : ""}`, JSON.stringify(ids) === JSON.stringify(required));
  const wrong = els.filter((e) => { const id = e.getAttribute("data-slot") ?? ""; return e.getAttribute("data-answer") !== typeOf.get(id) || e.getAttribute("data-stage") !== stageN.get(id); }).map((e) => `${e.getAttribute("data-slot")} (${e.getAttribute("data-stage")}, ${e.getAttribute("data-answer")})`);
  check(`${name} TYPE: each slot its stage and the model's answer type (wrong: ${wrong.join(", ") || "none"})`, els.length > 0 && wrong.length === 0);
  check(`${name} NO SEAT: no drawn blocked seat and no "Not known yet"`, !main.querySelector("[data-blocked]") && !/Not known yet/.test(main.textContent ?? ""));
  const take = main.querySelector("#take");
  check(`${name} MASTHEAD: #take holds slots 1 and 2`, !!take && !!take.querySelector('[data-slot="tax-on-profit"]') && !!take.querySelector('[data-slot="where-it-stands"]'));
  const nav = doc.querySelector('nav[aria-label="On this page"]');
  const dead = nav ? [...nav.querySelectorAll('a[href^="#"]')].map((a) => (a.getAttribute("href") ?? "").slice(1)).filter((id) => !doc.getElementById(id)) : ["the index itself"];
  check(`${name} INDEX: every index link lands on an id the render holds (dead: ${dead.join(", ") || "none"})`, dead.length === 0);
  const firstRead = els.filter((e) => { const d = e.closest("details"); return !d || d.hasAttribute("open"); }).length;
  console.log(`  ${name}: a first read meets ${firstRead} slot(s)`);
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/country_slots: all pass");
