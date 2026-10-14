/**
 * STAGE 1, ORIENT (plan 2026-10-13 country-page-journey, Task 3B; spec sections 3 and 4; R5 section 5, slots 1 and 2): his masthead holds slot 1
 * (the tax on profit, its thin state the company rate under its own label, never "Not known yet") and slot 2 (the placed figures, each a
 * figure with its unit in its label and its signal where its measure has a direction; "Hiring staff" gone to slot 7), on the UK, Cambodia,
 * Afghanistan and Germany; the board read clean by the answer-type gate, its one key line drawn. Admin ease carries its signal (the
 * controller's ruling on Q3: higher is easier); the living cost carries none.
 * BLIND SPOT, stated: the builder and the archetype's markup, not the page's layout; the page is the country-slots gate's.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/slots_orient.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { buildHeroBoard } from "../../src/lib/spine/hero_board";
import { HeroBoard } from "../../src/components/spine/archetypes/HeroBoard";
import { signalState } from "../../src/lib/spine/signal";
import { getCountryProfile, listCountryProfiles } from "../../src/lib/economic_profile";
import { getCountryCostOfLivingIndex } from "../../src/lib/economics/country_metrics";
import { OWNER_DIRECTION } from "../../src/lib/spine/owner_direction";
import { COPY } from "../../src/lib/spine/copy";
import { readAnswerTypes } from "../../scripts/lib/answer_type.mjs";
import { red, redSummary } from "../../scripts/lib/red";

/* Some components the slots draw lean on Next's automatic JSX runtime and import no React (CountryFlag, the city cards); outside Next the
   classic runtime looks React up by name, as the render spikes set it (scripts/spikes/render_country.tsx). */
(globalThis as unknown as { React: typeof React }).React = React;

const RULE = "slots-orient";
const FILE = "src/lib/spine/hero_board.ts";
const REMEDY = "slot 1 answers on every country (the company rate under its own label where no regime is held); slot 2's rows carry their units in their labels, their measures and their signals; the board stamped for the gates";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const clean = listCountryProfiles().map((p) => p.corruption_perception_index).filter((v): v is number => typeof v === "number" && Number.isFinite(v));
const admins = listCountryProfiles().map((p) => p.ease_of_doing_business_index).filter((v): v is number => typeof v === "number" && Number.isFinite(v));
const TABLE = OWNER_DIRECTION as Record<string, { direction: string }>;

for (const iso2 of ["GB", "KH", "AF", "DE"]) {
  const b = buildHeroBoard(iso2);
  const p = getCountryProfile(iso2);
  check(`${iso2} slot 1: the board answers (${b.answer?.label}: ${b.answer?.value})`, !!b.answer);
  check(`${iso2} slot 2: no "Hiring staff" row (it is slot 7's), every row's unit in its label, no level on a country row`, !b.rows.some((r) => r.key === "hiring") && b.rows.every((r) => r.unit === "" && r.level === null));
  check(`${iso2} slot 2: every row placed on a measure of the direction table, its mark where the measure has a direction (${b.rows.map((r) => `${r.key}:${r.placed}:${r.signal?.state ?? r.noSignal ?? "-"}`).join(" ")})`, b.rows.every((r) => !!r.placed && !!TABLE[r.placed] && (TABLE[r.placed].direction === "none" ? !r.signal : !!r.signal || r.noSignal === "set")));
  const row = b.rows.find((r) => r.key === "clean");
  const want = row ? signalState(p.corruption_perception_index as number, clean, "higher") : null;
  check(`${iso2} clean dealing is placed and carries its signal, ${want}`, !!row && row.placed === "clean-dealing" && row.signal?.state === want && row.label === COPY.journey.boardRows.clean);
  const salary = b.rows.find((r) => r.key === "salary-month");
  check(`${iso2} the monthly salary is placed and carries no mark (salaries: no owner direction)`, !salary || (salary.placed === "salary" && !salary.signal && salary.label === COPY.journey.boardRows.salary));
  const admin = b.rows.find((r) => r.key === "admin");
  const adminWant = admin ? signalState(p.ease_of_doing_business_index as number, admins, "higher") : null;
  check(`${iso2} admin ease is placed, its year in its readout, its signal ${adminWant} (Q3)`, !admin || (admin.placed === "admin-ease" && admin.signal?.state === adminWant && (admin.readout ?? "").includes("2020")));
  check(`${iso2} the other taxes: a fold of two to eight shares, or none`, !b.taxes || (b.taxes.length >= 2 && b.taxes.length <= 8 && b.taxes.every((t) => /%$/.test(t.value))));
  const html = renderToStaticMarkup(React.createElement(HeroBoard, { id: "take", board: b, slotted: true }));
  const doc = new JSDOM(`<!doctype html><html><body><main>${html}</main></body></html>`).window.document;
  check(`${iso2} the masthead holds slots 1 and 2, stamped`, !!doc.querySelector('#take [data-slot="tax-on-profit"][data-stage="1"][data-answer="share"]') && !!doc.querySelector('#take [data-slot="where-it-stands"][data-stage="1"][data-answer="position"]'), "src/components/spine/archetypes/HeroBoard.tsx");
  check(`${iso2} no "Not known yet" anywhere on the board`, !/Not known yet/.test(doc.body.textContent ?? ""), "src/components/spine/archetypes/HeroBoard.tsx");
  const f = readAnswerTypes(doc, { requireDeclared: true }).findings;
  check(`${iso2} the board reads clean through the answer-type gate (${f.map((x: { rule: string; detail: string }) => `${x.rule}: ${x.detail}`).join("; ") || "clean"})`, f.length === 0, "src/components/spine/archetypes/HeroBoard.tsx");
  check(`${iso2} one key line under the placed figures`, doc.querySelectorAll("[data-signal-key]").length === 1, "src/components/spine/archetypes/HeroBoard.tsx");
}
const kh = buildHeroBoard("KH");
const khRate = `${Math.round((getCountryProfile("KH").corporate_income_tax_combined_pct as number) * 1000) / 10}%`;
check(`Cambodia's thin state: "${COPY.journey.thinTax.label}" ${khRate}, its own words, the company rate gone from its other taxes`, kh.answer?.label === COPY.journey.thinTax.label && kh.answer?.value === khRate && kh.answerBasis === COPY.journey.thinTax.words && !(kh.taxes ?? []).some((t) => t.key === "company_tax"));
check("Germany keeps its regime's rate under his label", buildHeroBoard("DE").answer?.label === COPY.answer.label);
const gb = buildHeroBoard("GB");
check("the UK's other taxes take the director's loan charge, a share the failing slot no longer prints", (gb.taxes ?? []).some((t) => t.key === "directors_loan" && /%$/.test(t.value)));
check("the UK prints no living cost on its board (its premises rules stand in the running costs)", !gb.rows.some((r) => r.key === "living"));
const khLiving = kh.rows.find((r) => r.key === "living");
check("Cambodia places its living cost on the city scale, no mark (Q3); Afghanistan, with no covered city, holds none", getCountryCostOfLivingIndex("KH") != null && !!khLiving && khLiving.placed === "cost-of-living" && !khLiving.signal && khLiving.label === COPY.journey.boardRows.living && !buildHeroBoard("AF").rows.some((r) => r.key === "living"));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/slots_orient: all pass");
