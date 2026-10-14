/**
 * STAGE 5, TO LAST (plan 2026-10-13 country-page-journey, Task 3G; spec sections 2 and 3; R5 section 5, slots 12 and 13): how many last (the
 * UK's survival curve with its figure at 30 and its region lever, what holds firms back, by city and the trades that fail most behind the
 * plus, shares each) and selling or failing (off the UK, the time to sell at 30, placed among the countries with its signal, the buyers in
 * its words; on the UK, if it fails: the months to be freed at 30, its times as rows with their units in their labels, its costs and what it
 * reaches behind the plus, the director's loan charge left for slot 1). On the UK, Cambodia, Afghanistan and Germany.
 * BLIND SPOT, stated: the builders and the markup; the duel prints only while its feed is fresh (45 days), so its plus is read where it draws.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/slots_last.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { buildLastingSlot, buildExitSlot } from "../../src/lib/spine/slots/last";
import { LastingSlot, ExitSlot } from "../../src/components/spine/country/slots/StageLast";
import { buildCountryExit, worldExitHighs } from "../../src/lib/spine/country_exit_rows";
import { signalState } from "../../src/lib/spine/signal";
import { readAnswerTypes } from "../../scripts/lib/answer_type.mjs";
import { red, redSummary } from "../../scripts/lib/red";

/* Some components the slots draw lean on Next's automatic JSX runtime and import no React (CountryFlag, the city cards); outside Next the
   classic runtime looks React up by name, as the render spikes set it (scripts/spikes/render_country.tsx). */
(globalThis as unknown as { React: typeof React }).React = React;

const RULE = "slots-last";
const FILE = "src/lib/spine/slots/last.ts";
const REMEDY = "build slots 12 and 13 from the survival file, the exit shard and the UK's failure law: one type a list, units in the labels, the time to sell placed with its signal";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const TODAY = "2026-10-13";
const clean = (el: React.ReactElement) => readAnswerTypes(new JSDOM(`<!doctype html><html><body><main>${renderToStaticMarkup(el)}</main></body></html>`).window.document, { requireDeclared: true }).findings.map((f: { rule: string; detail: string }) => `${f.rule}: ${f.detail}`);

const gb = buildLastingSlot("GB", TODAY);
check(`the UK's slot 12: the curve drawn, its pluses ${gb?.more.map((l) => l.key).join(", ")}`, !!gb && gb.lead === null && gb.more[0]?.key === "back" && gb.more[1]?.key === "by-city" && gb.more.every((l) => l.type === "share" && ["back", "by-city", "fail-most"].includes(l.key)));
if (gb) { const f = clean(React.createElement(LastingSlot, { model: gb })); check(`the UK's slot 12 reads clean (${f.join("; ") || "clean"})`, f.length === 0, "src/components/spine/country/slots/StageLast.tsx"); }
check("Cambodia, Afghanistan and Germany draw no slot 12 (no survival file)", !buildLastingSlot("KH", TODAY) && !buildLastingSlot("AF", TODAY) && !buildLastingSlot("DE", TODAY));

for (const iso2 of ["KH", "AF", "DE"]) {
  const m = buildExitSlot(iso2, TODAY);
  const exit = buildCountryExit(iso2);
  const hi = exit?.marks[exit.marks.length - 1].value;
  const highs = worldExitHighs();
  check(`${iso2} slot 13: the time to sell at 30, placed, its signal recomputed (${m?.lead?.figure})`, !!m && !!exit && typeof hi === "number" && !!highs && m.lead?.placed === "time-to-sell" && m.lead.signal?.state === signalState(hi, highs, "lower") && /months?$/.test(m.lead.figure));
  if (m) { const f = clean(React.createElement(ExitSlot, { model: m })); check(`${iso2} slot 13 reads clean (${f.join("; ") || "clean"})`, f.length === 0, "src/components/spine/country/slots/StageLast.tsx"); }
}
const gbExit = buildExitSlot("GB", TODAY)!;
check(`the UK's slot 13 is if it fails: the months to be freed at 30, the times ${gbExit.rows?.rows.map((r) => r.key).join(", ")}, the pluses ${gbExit.more.map((l) => l.key).join(", ")}`, gbExit.rows?.type === "time" && JSON.stringify(gbExit.rows.rows.map((r) => r.key)) === JSON.stringify(["liquidation-time", "director-ban", "strike-off-notice", "no-trading-period"]) && JSON.stringify(gbExit.more.map((l) => l.key)) === JSON.stringify(["costs", "reach"]));
check("the director's loan charge is slot 1's, never here", ![...(gbExit.rows?.rows ?? []), ...gbExit.more.flatMap((l) => l.rows)].some((r) => r.key === "directors-loan"));
check(`the UK's times carry their units in their labels, their values bare (${(gbExit.rows?.rows ?? []).map((r) => `${r.label}=${r.value}`).join("; ")})`, (gbExit.rows?.rows ?? []).every((r) => /, (months|years)$/.test(r.label) && /^\d+( to \d+)?$/.test(r.value)));
{ const f = clean(React.createElement(ExitSlot, { model: gbExit })); check(`the UK's slot 13 reads clean (${f.join("; ") || "clean"})`, f.length === 0, "src/components/spine/country/slots/StageLast.tsx"); }

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/slots_last: all pass");
