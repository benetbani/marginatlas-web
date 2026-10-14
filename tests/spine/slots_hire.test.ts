/**
 * STAGE 4, SLOT 7, WHAT A HIRE COSTS, AND THE DATED ROW (plan 2026-10-13 country-page-journey, Task 3E; spec sections 2 and 3; R5 section 5,
 * slot 7; Review Focus 3). The wage floor's full-time year at 30; the UK's money rules as rows; behind the plus, lists of one type: what
 * the employer adds, the rules of employing (each unit in its label), statutory pay a week, how hiring goes (the shard's four words, on
 * every country), an hour all in, the job market; the hire's lever under the rows. A rule the changes ledger dates prints its value in
 * force on `today` and a note that agrees with the ledger, switching together on the change's day.
 * BLIND SPOT, stated: the builder and the markup on four countries and three dates; the ledger's own truth is the changes file's.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/slots_hire.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { buildHireSlot } from "../../src/lib/spine/slots/hire";
import { datedRow, monthsOf } from "../../src/lib/spine/slots/dated";
import { HireSlot } from "../../src/components/spine/country/slots/StageHire";
import { buildPayBars } from "../../src/lib/spine/pay_rows";
import { dateText, lawValue } from "../../src/lib/spine/sections/country_rules";
import { usd } from "../../src/lib/spine/money";
import { COPY } from "../../src/lib/spine/copy";
import { readAnswerTypes } from "../../scripts/lib/answer_type.mjs";
import { red, redSummary } from "../../scripts/lib/red";

/* Some components the slots draw lean on Next's automatic JSX runtime and import no React (CountryFlag, the city cards); outside Next the
   classic runtime looks React up by name, as the render spikes set it (scripts/spikes/render_country.tsx). */
(globalThis as unknown as { React: typeof React }).React = React;

const RULE = "slots-hire";
const FILE = "src/lib/spine/slots/hire.ts";
const REMEDY = "slot 7 from the pay pair, the employer's rate, the UK's rules and the shard's hiring words: the floor at 30, one type a list, units in the labels, a dated rule's value and note switching together";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const bare = (v: Parameters<typeof lawValue>[0]) => lawValue(v, true);
const D = COPY.journey.dated;

/* THE DATED ROW (Review Focus 3): the minimum wage the day before its change, the day of it, and long after. */
const before = datedRow("GB", "minimum-wage-21", "2026-03-31", bare);
const dayOf = datedRow("GB", "minimum-wage-21", "2026-04-01", bare);
const later = datedRow("GB", "minimum-wage-21", "2026-10-13", bare);
check(`the day before: the old value and the coming one dated (${before?.value}, ${before?.note})`, before?.value === "£12.21" && before.note === D.coming.replace("{to}", "£12.71 an hour").replace("{date}", dateText("2026-04-01") as string), "src/lib/spine/slots/dated.ts");
check(`the day of: the new value, dated since (${dayOf?.value}, ${dayOf?.note})`, dayOf?.value === "£12.71" && dayOf.note === D.since.replace("{date}", dateText("2026-04-01") as string), "src/lib/spine/slots/dated.ts");
check("past the recent window: the value, no note", later?.value === "£12.71" && later.note === null && later.change === "minimum-wage-21", "src/lib/spine/slots/dated.ts");
check("a key the ledger does not hold dates nothing", datedRow("GB", "no-such-change", "2026-10-13", bare) === null && monthsOf({ years: 2 }) === "24" && monthsOf({ months: 6 }) === "6", "src/lib/spine/slots/dated.ts");
const row = (today: string) => buildHireSlot("GB", today)?.more.find((l) => l.key === "employing")?.rows.find((r) => r.key === "dismissal");
const eve = row("2026-12-31");
const day = row("2027-01-01");
check(`the UK's unfair dismissal row on 31 Dec 2026: 24 months, 6 months coming (${eve?.value}, ${eve?.note})`, eve?.value === "24" && eve.note === D.coming.replace("{to}", "6 months").replace("{date}", dateText("2027-01-01") as string) && eve.change === "unfair-dismissal-period");
check(`and on 1 Jan 2027: 6 months, since that day (${day?.value}, ${day?.note})`, day?.value === "6" && day.note === D.since.replace("{date}", dateText("2027-01-01") as string));

const TODAY = "2026-10-13";
for (const iso2 of ["GB", "KH", "AF", "DE"]) {
  const m = buildHireSlot(iso2, TODAY);
  const floor = buildPayBars(iso2)?.rows.find((r) => r.key === "minimum")?.value;
  check(`${iso2} slot 7 leads with the wage floor's full-time year (${m?.lead?.figure})`, !!m && typeof floor === "number" && m.lead?.figure === usd(floor));
  if (!m) continue;
  check(`${iso2} how hiring goes: the shard's four words, a state each`, m.more.find((l) => l.key === "hiring")?.rows.length === 4 && m.more.find((l) => l.key === "hiring")!.type === "state");
  const html = renderToStaticMarkup(React.createElement(HireSlot, { model: m }));
  const doc = new JSDOM(`<!doctype html><html><body><main>${html}</main></body></html>`).window.document;
  const f = readAnswerTypes(doc, { requireDeclared: true }).findings.map((x: { rule: string; detail: string }) => `${x.rule}: ${x.detail}`);
  check(`${iso2} slot 7 reads clean (${f.join("; ") || "clean"})`, f.length === 0 && !!doc.querySelector('#hire[data-slot="hire"][data-stage="4"][data-answer="money"]'), "src/components/spine/country/slots/StageHire.tsx");
}
const kh = buildHireSlot("KH", TODAY)!;
check("Cambodia: the employer's share stands alone, so it rides the lead's words (Reading 15), no plus of one row", /%/.test(kh.lead?.words ?? "") && !kh.more.some((l) => l.key === "adds") && kh.rows === null);
const gb = buildHireSlot("GB", TODAY)!;
check(`the UK's pluses: ${gb.more.map((l) => l.key).join(", ")}`, JSON.stringify(gb.more.map((l) => l.key)) === JSON.stringify(["adds", "employing", "statutory", "hiring", "hour", "jobs"]));
check(`the UK's own rows are money (the hourly floor, the allowance, the enrolment trigger), and the lead's words name no share (${gb.rows?.rows.map((r) => r.key).join(", ")})`, gb.rows?.type === "money" && JSON.stringify(gb.rows.rows.map((r) => r.key)) === JSON.stringify(["minimum-wage-21", "employment-allowance", "pension-trigger"]) && gb.lead?.words === COPY.pay.focalWords);
check(`every row of the rules of employing carries its unit in its label, its value bare (${(gb.more.find((l) => l.key === "employing")?.rows ?? []).map((r) => `${r.label}=${r.value}`).join("; ")})`, (gb.more.find((l) => l.key === "employing")?.rows ?? []).every((r) => /, (days|weeks|months|hours)$/.test(r.label) && /^\d+( to \d+)?$/.test(r.value)));
check("the hire's lever stands where its inputs do", gb.drawing.pay !== null && gb.drawing.rate !== null);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/slots_hire: all pass");
