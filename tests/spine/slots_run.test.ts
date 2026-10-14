/**
 * STAGE 4, SLOTS 8 TO 11 (plan 2026-10-13 country-page-journey, Task 3F; spec sections 2 to 4; R5 section 5, slots 8 to 11): running costs
 * (electricity at 30, placed with its signal, diesel a row; the UK's premises tax, insurance, the lease's state, terms and costs and the
 * peers' electricity behind the plus), credit and card fees (the lending rate at 30, placed with its signal, on the stage's one world
 * track, its reference a tick; the UK's card and payment shares as rows, its loans, payment split and waits behind the plus, the loan's
 * lever under the rows), filing deadlines (the UK's: the accounts at 30, the other deadlines a time each with its unit in its label, the
 * costs behind the plus) and the peers (the comparison table, stamped). On the UK, Cambodia, Afghanistan and Germany; each read clean by
 * the answer-type gate; every placed figure's mark the direction table's.
 * BLIND SPOT, stated: the builders and the components' markup; the track's drawing is WorldRange's own, read by its tests.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/slots_run.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { buildRunningCostsSlot, buildCreditSlot, buildFilingsSlot, buildPeersSlot, durationParts } from "../../src/lib/spine/slots/run";
import { RunningCostsSlot, CreditSlot, FilingsSlot, PeersSlot } from "../../src/components/spine/country/slots/StageRun";
import { getCountryProfile } from "../../src/lib/economic_profile";
import { worldValues } from "../../src/lib/spine/world_stats";
import { signalState } from "../../src/lib/spine/signal";
import { OWNER_DIRECTION } from "../../src/lib/spine/owner_direction";
import { readAnswerTypes } from "../../scripts/lib/answer_type.mjs";
import { red, redSummary } from "../../scripts/lib/red";

/* Some components the slots draw lean on Next's automatic JSX runtime and import no React (CountryFlag, the city cards); outside Next the
   classic runtime looks React up by name, as the render spikes set it (scripts/spikes/render_country.tsx). */
(globalThis as unknown as { React: typeof React }).React = React;

const RULE = "slots-run";
const FILE = "src/lib/spine/slots/run.ts";
const REMEDY = "build slots 8 to 11 from today's builders: the lead of the slot's type, placed with its signal where its measure has a direction, one type a list, units in the labels, the peers' table stamped";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const TODAY = "2026-10-13";
const read = (el: React.ReactElement) => new JSDOM(`<!doctype html><html><body><main>${renderToStaticMarkup(el)}</main></body></html>`).window.document;
const findings = (doc: Document) => readAnswerTypes(doc, { requireDeclared: true }).findings.map((f: { rule: string; detail: string }) => `${f.rule}: ${f.detail}`);
const marks = (doc: Document) => [...doc.querySelectorAll("[data-placed]")].map((el) => {
  const m = el.getAttribute("data-placed") ?? "";
  const dir = (OWNER_DIRECTION as Record<string, { direction: string }>)[m]?.direction;
  const has = !!el.querySelector(`[data-signal][data-measure="${m}"]`);
  return dir && (dir === "none" ? !has : has || ["set", "fill"].includes(el.getAttribute("data-no-signal") ?? "")) ? null : m;
}).filter(Boolean);

check("a duration's figure, unit and words", JSON.stringify(durationParts("14 days' warning")) === JSON.stringify({ figure: "14", unit: "days", rest: "warning" }) && JSON.stringify(durationParts("Over 7 years")) === JSON.stringify({ figure: "7", unit: "years", rest: "Over" }) && durationParts("3 to 12 months")?.figure === "3 to 12" && durationParts("By law") === null);

for (const iso2 of ["GB", "KH", "AF", "DE"]) {
  const p = getCountryProfile(iso2);
  const run = buildRunningCostsSlot(iso2, TODAY);
  const kwh = p.electricity_usd_per_kwh_commercial as number;
  check(`${iso2} slot 8 leads with electricity at two places, placed, its signal recomputed (${run?.lead?.figure})`, !!run && run.lead?.figure === `$${kwh.toFixed(2)}` && run.lead.placed === "electricity" && run.lead.signal?.state === signalState(kwh, worldValues("electricity_usd_per_kwh_commercial"), "lower"));
  if (run) { const d = read(React.createElement(RunningCostsSlot, { model: run })); const f = findings(d); check(`${iso2} slot 8 reads clean, its marks the table's (${[...f, ...marks(d)].join("; ") || "clean"})`, f.length === 0 && marks(d).length === 0 && !!d.querySelector('#running-costs[data-slot="running-costs"][data-stage="4"][data-answer="money"]'), "src/components/spine/country/slots/StageRun.tsx"); }
  const credit = buildCreditSlot(iso2, TODAY);
  const rate = p.bank_lending_rate_pct as number;
  check(`${iso2} slot 9 leads with the lending rate, placed, its signal recomputed (${credit?.lead?.figure})`, !!credit && credit.lead?.figure === `${Math.round(rate * 1000) / 10}%` && credit.lead.placed === "lending-rate" && credit.lead.signal?.state === signalState(rate, worldValues("bank_lending_rate_pct"), "lower"));
  if (credit) { const d = read(React.createElement(CreditSlot, { model: credit })); const f = findings(d); check(`${iso2} slot 9 reads clean, its marks the table's, the track drawn (${[...f, ...marks(d)].join("; ") || "clean"})`, f.length === 0 && marks(d).length === 0 && !!d.querySelector('#credit[data-slot="credit"] [data-archetype="world-range"]'), "src/components/spine/country/slots/StageRun.tsx"); }
}
check("filings: the UK's alone", !!buildFilingsSlot("GB", TODAY) && !buildFilingsSlot("KH", TODAY) && !buildFilingsSlot("AF", TODAY) && !buildFilingsSlot("DE", TODAY));
check("the peers: the UK and Germany, not Cambodia or Afghanistan", !!buildPeersSlot("GB") && !!buildPeersSlot("DE") && !buildPeersSlot("KH") && !buildPeersSlot("AF"));
const gbRun = buildRunningCostsSlot("GB", TODAY)!;
check(`the UK's running costs pluses: ${gbRun.more.map((l) => l.key).join(", ")}`, JSON.stringify(gbRun.more.map((l) => l.key)) === JSON.stringify(["premises", "insurance", "lease", "lease-terms", "lease-costs", "peers-power"]));
check(`the UK's lease terms: a time each, its unit in its label, its value bare (${(gbRun.more.find((l) => l.key === "lease-terms")?.rows ?? []).map((r) => `${r.label}=${r.value}`).join("; ")})`, (gbRun.more.find((l) => l.key === "lease-terms")?.rows ?? []).every((r) => /, (days|weeks|months|years)$/.test(r.label) && /^\d+( to \d+)?$/.test(r.value)));
check("diesel is a row with its unit in its label (no '/L' in the cell)", gbRun.rows?.type === "money" && (gbRun.rows.rows ?? []).every((r) => !/\/L/.test(r.value)));
const gbCredit = buildCreditSlot("GB", TODAY)!;
check(`the UK's credit rows (${gbCredit.rows?.rows.map((r) => r.key).join(", ")}) and pluses (${gbCredit.more.map((l) => l.key).join(", ")})`, gbCredit.rows?.type === "share" && JSON.stringify(gbCredit.more.map((l) => l.key)) === JSON.stringify(["loans", "pay", "lands"]) && gbCredit.drawing.loan !== null && gbCredit.drawing.base !== null);
check("Cambodia's credit: the rate on its track alone", buildCreditSlot("KH", TODAY)!.rows === null && buildCreditSlot("KH", TODAY)!.more.length === 0);
const gbFile = buildFilingsSlot("GB", TODAY)!;
const d = read(React.createElement(FilingsSlot, { model: gbFile }));
check(`the UK's filings read clean (${findings(d).join("; ") || "clean"}), the accounts at 30, the costs behind the plus`, findings(d).length === 0 && /\d/.test(gbFile.lead?.figure ?? "") && gbFile.more.some((l) => l.key === "costs" && l.type === "money"), "src/components/spine/country/slots/StageRun.tsx");
const peers = read(React.createElement(PeersSlot, { model: buildPeersSlot("GB")! }));
check("the peers' table is the slot, stamped, one Box", !!peers.querySelector('#peers[data-slot="peers"][data-stage="4"][data-answer="table"][data-archetype="compare-table"]') && peers.querySelectorAll("#peers").length === 1, "src/components/spine/country/slots/StageRun.tsx");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/slots_run: all pass");
