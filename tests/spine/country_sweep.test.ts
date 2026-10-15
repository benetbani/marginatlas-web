/**
 * THE PROGRAMMATIC PROMISE ON EVERY COUNTRY (plan 2026-10-13 country-page-journey, final review M2, 2026-10-15). The gates render a handful
 * of countries; the page is built for every country in the taxonomy. For each of them, from the files alone (no database: the trades' margins, slot 5b,
 * come from the seed and are not asked here), the slot plan builds without a throw (a fold over eight rows throws in `list()`, which during
 * the site's regeneration would fail that country's page rather than a gate), every slot drawn is one the model holds, in the model's order,
 * and every slot's lists read clean through the answer-type gate's own reading (scripts/lib/answer_type.mjs), each list one type, each fold
 * two to eight rows. The masthead (slots 1 and 2) has its own tests (hero_rows, slots_orient).
 * BLIND SPOT, stated: it reads the slot frame's lists (rows and folds) drawn without their stage drawings, so a drawing's own markup is the
 * render gates'; and it holds today's files, so a shard that grows tomorrow is read when this runs again, not before.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/country_sweep.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { COUNTRIES } from "../../src/lib/taxonomy";
import { planCountry } from "../../src/lib/spine/slots/plan";
import { SLOTS } from "../../src/lib/spine/country_slots";
import { Slot } from "../../src/components/spine/country/Slot";
import type { SlotModel } from "../../src/lib/spine/slots/types";
import { readAnswerTypes } from "../../scripts/lib/answer_type.mjs";
import { red, redSummary } from "../../scripts/lib/red";

(globalThis as unknown as { React: typeof React }).React = React;

const RULE = "country-sweep";
const FILE = "src/lib/spine/slots/plan.ts";
const REMEDY = "keep every country's slot plan building from its files, its slots in the model's order, each list one answer type and each fold two to eight rows: cut a long list by its question, never drop a row";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

const TODAY = new Date().toISOString().slice(0, 10);
const ORDER = SLOTS.map((s) => s.id as string);
const countries = (COUNTRIES as Array<{ code?: string; iso2?: string; name?: string }>).map((c) => ({ iso2: String(c.code ?? c.iso2 ?? "").toUpperCase(), name: String(c.name ?? "") })).filter((c) => c.iso2.length === 2);
const threw: string[] = [], disordered: string[] = [], mixed: string[] = [];
let slotsRead = 0, listsRead = 0;
for (const { iso2, name } of countries) {
  let plan: ReturnType<typeof planCountry> | null = null;
  try { plan = planCountry(iso2, name, TODAY); } catch (e) { threw.push(`${iso2} (${(e as Error).message.slice(0, 80)})`); continue; }
  const at = plan.drawn.map((id) => ORDER.indexOf(id));
  if (at.some((i) => i < 0) || at.some((i, k) => k > 0 && i <= at[k - 1])) disordered.push(`${iso2}: ${plan.drawn.join(" ")}`);
  const frames = plan.slots.filter((s) => s.model).map((s) => renderToStaticMarkup(React.createElement(Slot, { model: s.model as SlotModel<unknown> }))).join("");
  slotsRead += plan.slots.filter((s) => s.model).length;
  const doc = new JSDOM(`<!doctype html><html><body><main>${frames}</main></body></html>`).window.document;
  const r = readAnswerTypes(doc, { requireDeclared: true });
  listsRead += r.lists;
  for (const f of r.findings as Array<{ where: string; rule: string; detail: string }>) mixed.push(`${iso2} #${f.where}: ${f.rule}: ${f.detail}`);
}
check(`the sweep read ${countries.length} countries, ${slotsRead} slots and ${listsRead} lists (a sweep of nothing is no pass)`, countries.length >= 190 && slotsRead > countries.length * 3 && listsRead > countries.length);
check(`every country's slot plan builds from its files (${threw.join("; ") || "none threw"})`, threw.length === 0);
check(`every country draws its slots in the model's order (${disordered.slice(0, 5).join(" | ") || "all"})`, disordered.length === 0);
check(`every slot's lists read one answer type, each fold two to eight rows (${mixed.length}: ${mixed.slice(0, 6).join(" | ") || "clean"})`, mixed.length === 0, "src/lib/spine/slots");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log(`spine/country_sweep: all pass (${countries.length} countries)`);
