/**
 * STAGE 3, TO OPEN (plan 2026-10-13 country-page-journey, Task 3D; spec sections 2 and 3; R5 section 5, slot 6): one slot, "Forms, fees and
 * days": the bill at 30 (its own shard figure, stamped), the legal forms table, the days until trading as a row; behind the plus, lists of
 * one type each: the steps in days under fixed labels (the shard's words as each row's note), how each step goes, each step's cost where
 * more than one step costs money, the licences' waits in days, the UK's walls from abroad (their states, their costs, their waits). On the
 * UK, Cambodia, Afghanistan and Germany; each read clean by the answer-type gate.
 * BLIND SPOT, stated: the builder and the component's markup; whether a step label fits a shard's step is read here on four countries'
 * names, not on 198.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/slots_open.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { buildOpenSlot, inDays, stepLabel, uniqueLabels } from "../../src/lib/spine/slots/open";
import { OpenSlot } from "../../src/components/spine/country/slots/StageOpen";
import { buildEntryBill } from "../../src/lib/spine/entry_bill_rows";
import { buildSetupRows } from "../../src/lib/spine/setup_rows";
import { COPY } from "../../src/lib/spine/copy";
import { readAnswerTypes } from "../../scripts/lib/answer_type.mjs";
import { red, redSummary } from "../../scripts/lib/red";

/* Some components the slots draw lean on Next's automatic JSX runtime and import no React (CountryFlag, the city cards); outside Next the
   classic runtime looks React up by name, as the render spikes set it (scripts/spikes/render_country.tsx). */
(globalThis as unknown as { React: typeof React }).React = React;

const RULE = "slots-open";
const FILE = "src/lib/spine/slots/open.ts";
const REMEDY = "build slot 6 from the bill, the legal forms table and the steps: the bill at 30, one type a list behind the plus, units in the heads, labels from the closed list";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const TODAY = "2026-10-13";
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

check("durations in days: days as they are, weeks times seven, months at the calendar's average month, a range end by end", inDays("28 days") === "28" && inDays("1 day") === "1" && inDays("0 days") === "0" && inDays("6 to 10 weeks") === "42 to 70" && inDays("3 to 4 months") === "91 to 122" && inDays("Start immediately") === null && inDays("–") === null);
check("the steps' labels from the closed list (the UK's four)", JSON.stringify(["Register the company", "Register for tax", "Open a business bank account", "Register for VAT (if sales are high)"].map(stepLabel)) === JSON.stringify([COPY.journey.stepLabels.register, COPY.journey.stepLabels.tax, COPY.journey.stepLabels.bank, COPY.journey.stepLabels.vat]));
check("Cambodia's sentences read as labels", JSON.stringify(["Reserve the company name in Khmer on the CamDX business registration portal", "Register the company with the Ministry of Commerce via CamDX", "Tax registration with the tax department", "Open a corporate bank account and confirm it to the tax department"].map(stepLabel)) === JSON.stringify([COPY.journey.stepLabels.name, COPY.journey.stepLabels.register, COPY.journey.stepLabels.tax, COPY.journey.stepLabels.bank]));
check("a trade office and a licence are the licence step; a taxpayer number the tax step", stepLabel("Trade office registration (Gewerbeanmeldung) of the activity") === COPY.journey.stepLabels.licence && stepLabel("Obtain trade and investment license (annual)") === COPY.journey.stepLabels.licence && stepLabel("Receive taxpayer identification number (TIN)") === COPY.journey.stepLabels.tax);
check("a label met twice takes its count", JSON.stringify(uniqueLabels(["Registration", "Other step", "Registration"])) === JSON.stringify(["Registration", "Other step", "Registration 2"]));

for (const iso2 of ["GB", "KH", "AF", "DE"]) {
  const m = buildOpenSlot(iso2, TODAY);
  const bill = buildEntryBill(iso2);
  check(`${iso2} slot 6 draws`, !!m);
  if (!m) continue;
  check(`${iso2} the lead is the bill, stamped with its shard figure (${m.lead?.figure})`, bill?.figure ? m.lead?.figure === bill.figure && m.lead?.prov?.src === `facts/country/${iso2}.json:costs.license_setup_usd` && (m.lead?.words ?? "").length > 0 : m.lead === null);
  check(`${iso2} the legal forms table is the drawing, its rows the formation file's`, m.drawing.setup.length === buildSetupRows(iso2).length);
  check(`${iso2} every plus holds one type, its labels three words at most (${m.more.flatMap((l) => l.rows.filter((r) => words(r.label) > 3).map((r) => r.label)).join(", ") || "all"})`, m.more.every((l) => l.rows.every((r) => words(r.label) <= 3)) && m.more.every((l) => ["time", "state", "money"].includes(l.type)));
  const html = renderToStaticMarkup(React.createElement(OpenSlot, { model: m }));
  const doc = new JSDOM(`<!doctype html><html><body><main>${html}</main></body></html>`).window.document;
  const f = readAnswerTypes(doc, { requireDeclared: true }).findings.map((x: { rule: string; detail: string }) => `${x.rule}: ${x.detail}`);
  check(`${iso2} slot 6 reads clean (${f.join("; ") || "clean"})`, f.length === 0 && !!doc.querySelector('#open[data-slot="open"][data-stage="3"][data-answer="table"]'), "src/components/spine/country/slots/StageOpen.tsx");
}
const gb = buildOpenSlot("GB", TODAY)!;
const key = (m: NonNullable<ReturnType<typeof buildOpenSlot>>, k: string) => m.more.find((l) => l.key === k);
check(`the UK's pluses: ${gb.more.map((l) => l.key).join(", ")}`, JSON.stringify(gb.more.map((l) => l.key)) === JSON.stringify(["steps", "how", "licences", "abroad", "abroad-costs", "abroad-waits"]));
check("the UK: one step costs money, so the bill's words say the rest are free and no costs plus draws", !key(gb, "costs") && (gb.lead?.words ?? "") !== COPY.entryBill.focalWords);
check("the UK: the bank's wait has no source, so its row prints the dash and no days-until-trading row stands", key(gb, "steps")?.rows.find((r) => r.label === COPY.journey.stepLabels.bank)?.value === "–" && gb.rows === null);
check(`the UK's licences: waits in days, their short labels (${JSON.stringify(key(gb, "licences")?.rows.map((r) => `${r.label}=${r.value}`))})`, JSON.stringify(key(gb, "licences")?.rows.map((r) => r.value)) === JSON.stringify(["28", "42 to 70", "91 to 122", "28 to 56", "0"]));
check("the UK's walls from abroad: a state each, from the closed list", (key(gb, "abroad")?.rows ?? []).length >= 2 && (key(gb, "abroad")?.rows ?? []).every((r) => Object.values(COPY.fromAbroad.state).includes(r.value)));
const kh = buildOpenSlot("KH", TODAY)!;
check("Cambodia: three steps cost money, so their costs stand behind their own plus; its days until trading a row", !!key(kh, "costs") && key(kh, "costs")!.type === "money" && kh.rows?.type === "time" && kh.rows.rows.length === 1);
const af = buildOpenSlot("AF", TODAY)!;
check("Afghanistan: no legal form on file, so the bill alone and no steps behind a plus (the table's country draws them, as today)", af.drawing.setup.length === 0 && !key(af, "steps") && af.thin === true);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/slots_open: all pass");
