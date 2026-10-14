/**
 * THE SHARED PIECES OF THE JOURNEY (plan 2026-10-13 country-page-journey, Task 3A; spec sections 3 and 5): DetailPanel's answer fold (closed,
 * the head, the count and the plus at the row's end, a 44px row, two to eight rows of one type, the browser's own marker hidden), every other
 * page's panel unchanged; FactRows declaring its type, a word list in the body face; the kit's Focal carrying a signal beside a placed
 * figure, unchanged where it carries none; the slot's frame in its order with its stamps; list() refusing a plus under two rows or over eight.
 * BLIND SPOT, stated: static markup, no layout: the 44px is read as the class that sets it, the one line of the summary on the renders.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/answer_fold.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { DetailPanel } from "../../src/components/spine/archetypes/DetailPanel";
import { FactRows } from "../../src/components/spine/archetypes/FactRows";
import { Focal } from "../../src/components/spine/kit";
import { Slot } from "../../src/components/spine/country/Slot";
import { list, valueClass } from "../../src/lib/spine/slots/types";
import { readAnswerTypes } from "../../scripts/lib/answer_type.mjs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "answer-fold";
const REMEDY = "the fold as spec section 5 draws it (the head, its count, the plus at the row's end, closed, 44px, two to eight rows of one type), FactRows and Focal stamping what the gates read, the slot's frame in its order";
let failed = 0;
const check = (label: string, ok: boolean, file: string) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const h = (el: React.ReactElement) => renderToStaticMarkup(el);
const doc = (html: string) => new JSDOM(`<!doctype html><html><body><main>${html}</main></body></html>`).window.document;
const PANEL = "src/components/spine/archetypes/DetailPanel.tsx";

const rows = [{ label: "London", value: "$65K", href: "/cities/london" }, { label: "Leeds", value: "$42K" }, { label: "Bristol", value: "$44K" }];
const fold = h(React.createElement(DetailPanel, { name: "customers-cities", summary: "Customer pay by city", rows, type: "money" }));
const f = doc(fold);
const sum = f.querySelector("summary");
check("the fold is closed on arrival and stamped as an answer fold of its type", !!f.querySelector("details") && !f.querySelector("details[open]") && !!f.querySelector('[data-fold="answer"][data-answer="money"][data-rows="3"]'), PANEL);
check("the summary holds the head, then the rows' count, then the plus, the plus hidden from a screen reader", !!sum && sum.querySelector("[data-fold-head]")?.textContent === "Customer pay by city" && sum.querySelector("[data-fold-count]")?.textContent === "3" && sum.lastElementChild?.getAttribute("aria-hidden") === "true" && sum.lastElementChild?.textContent === "+", PANEL);
check("the whole summary is a 44px row and the browser's own marker is hidden", /\bmin-h-11\b/.test(sum?.getAttribute("class") ?? "") && /\blist-none\b/.test(sum?.getAttribute("class") ?? "") && /details-marker\]:hidden/.test(sum?.getAttribute("class") ?? ""), PANEL);
check("each row's value is stamped for the answer-type gate, a row with a page links its label", f.querySelectorAll("[data-detail-row] [data-value]").length === 3 && !!f.querySelector('[data-detail-row] a[href="/cities/london"]'), PANEL);
check("the fold reads clean through the answer-type gate", readAnswerTypes(f, { requireDeclared: true }).findings.length === 0, PANEL);
const words = doc(h(React.createElement(DetailPanel, { name: "hire-hiring", summary: "How hiring goes", rows: [{ label: "Taking on staff", value: "Moderate" }, { label: "Letting go", value: "Easy" }], type: "state" })));
check("a word list's values are words, not figures", words.querySelectorAll(".fig").length === 0 && words.querySelectorAll("[data-value]").length === 2, PANEL);
const old = h(React.createElement(DetailPanel, { name: "x", summary: "The other taxes", rows: [{ label: "VAT", value: "20%" }, { label: "Corporation tax", value: "25%" }] }));
check("without a type the panel every other page draws is unchanged (no fold stamp, no answer type)", !/data-fold=/.test(old) && !/data-answer=/.test(old) && /data-archetype="detail-panel"/.test(old), PANEL);

const FACT = "src/components/spine/archetypes/FactRows.tsx";
const fr = doc(h(React.createElement(FactRows, { answer: "money", rows: [{ key: "a", label: "Diesel, a litre", value: "$2.59" }, { key: "b", label: "Business rates", value: "43.2p", placed: null }] })));
check("FactRows declares its type and stamps each value", !!fr.querySelector('[data-archetype="fact-rows"][data-answer="money"]') && fr.querySelectorAll("[data-value]").length === 2, FACT);
const st = doc(h(React.createElement(FactRows, { answer: "state", rows: [{ key: "a", label: "Renewal", value: "By law" }, { key: "b", label: "Repairs claim", value: "Capped" }] })));
check("a state list's values are words in the body face, never .fig", st.querySelectorAll(".fig").length === 0, FACT);
const sig = doc(h(React.createElement(FactRows, { answer: "share", rows: [{ key: "a", label: "Rate", value: "6.6%", placed: "lending-rate", signal: { state: 2, measure: "lending-rate" } }, { key: "b", label: "Card fees", value: "1.7%" }] })));
check("a placed row carries its measure and its signal in the row", !!sig.querySelector('[data-row="a"][data-placed="lending-rate"] [data-signal="2"][data-measure="lending-rate"]'), FACT);
const plainRows = h(React.createElement(FactRows, { rows: [{ key: "a", label: "A", value: "$1" }, { key: "b", label: "B", value: "$2" }] }));
check("without an answer type FactRows draws as before (no answer stamp)", !/data-answer=/.test(plainRows), FACT);

const KIT = "src/components/spine/kit.tsx";
const plain = h(React.createElement(Focal, { figure: "$1", words: "w" }));
check("a Focal with no signal renders as before (the spacing pin's shape)", /^<div class="mb-6"><div data-focal="1" class="fig/.test(plain) && !/data-focal-row/.test(plain), KIT);
const placed = doc(h(React.createElement(Focal, { figure: "$0.32", words: "per kWh", placed: "electricity", signal: { state: 5, measure: "electricity" } })));
check("a placed Focal stands its 20px signal beside the figure, in a row carrying the measure", !!placed.querySelector('[data-focal-row][data-placed="electricity"] [data-focal="1"]') && !!placed.querySelector('[data-focal-row] [data-signal="5"] .h-full') && /h-5 w-5/.test(placed.querySelector("[data-signal]")?.getAttribute("class") ?? ""), KIT);

const SLOT = "src/components/spine/country/Slot.tsx";
const model = { id: "running-costs" as const, lead: { figure: "$0.32", words: "per kWh of business electricity", placed: "electricity" as const, signal: { state: 5 as const, measure: "electricity" as const } }, rows: { key: "rows", head: "", type: "money" as const, rows: [{ key: "diesel", label: "Diesel, a litre", value: "$2.59" }] }, more: [{ key: "premises", head: "Premises tax", type: "money" as const, rows: [{ key: "relief", label: "Full rates relief", value: "£12,000" }, { key: "rates", label: "Business rates", value: "43.2p" }] }], drawing: null, thin: false };
const s = doc(h(React.createElement(Slot, { model }, React.createElement("div", { "data-drawing": "" }))));
const box = s.querySelector('[data-slot="running-costs"]');
check("the slot's frame: its Box stamped with its slot, stage and type, its DOM id the model's", !!box && box.id === "running-costs" && box.getAttribute("data-stage") === "4" && box.getAttribute("data-answer") === "money", SLOT);
const order = [...(box?.querySelectorAll("[data-rail], [data-focal-row], [data-drawing], [data-archetype='fact-rows'], [data-fold='answer']") ?? [])].map((e) => e.hasAttribute("data-rail") ? "rail" : e.hasAttribute("data-focal-row") ? "lead" : e.hasAttribute("data-drawing") ? "drawing" : e.getAttribute("data-archetype") === "fact-rows" ? "rows" : "fold");
check(`the frame's order: opener, lead, drawing, rows, folds (${order.join(", ")})`, JSON.stringify(order) === JSON.stringify(["rail", "lead", "drawing", "rows", "fold"]), SLOT);
check("the frame reads clean through the answer-type gate", readAnswerTypes(s, { requireDeclared: true }).findings.length === 0, SLOT);
const TYPES = "src/lib/spine/slots/types.ts";
let threw = false;
try { list("x", "X", "money", Array.from({ length: 9 }, (_, i) => ({ key: String(i), label: `R${i}`, value: "$1" }))); } catch { threw = true; }
check("list(): none under two rows, a throw over eight (a caller cuts a long list by its question, never drops a row)", list("x", "X", "money", [{ key: "a", label: "A", value: "$1" }]) === null && threw, TYPES);
check("valueClass reads a value as the gate does", valueClass("$1") === "money" && valueClass("8%") === "share" && valueClass("21 days") === "time" && valueClass("Easy") === "state" && valueClass("5") === "count", TYPES);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/answer_fold: all pass");
