/**
 * STAGES 6 AND 7 (plan 2026-10-13 country-page-journey, Task 3H; spec sections 2 and 3; R5 section 5, slots 14 to 16): how dealings go (the
 * state's and the people's spectra under one switch, their two foot figures behind the plus as shares), the rule changes (the coming and the
 * recent runs, each row a dated pair) and where to next (the doors). Then the coverage of "each change also dated on the row it changes":
 * every change the UK's ledger holds as coming, or in force within the recent window, is dated on a row some slot prints, or named in
 * UNDATED with the reason no country row prints it; read on a fixed day and on today.
 * BLIND SPOT, stated: the coverage reads the slot models' rows (`change`), not the render; the render's agreement is the dated row's own test.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/slots_rules.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { buildDealingsSlot, buildChangesSlot, buildCloseSlot } from "../../src/lib/spine/slots/rules";
import { getCountryProfile } from "../../src/lib/economic_profile";
import { DealingsSlot, ChangesSlot, CloseSlot } from "../../src/components/spine/country/slots/StageRules";
import { buildOpenSlot } from "../../src/lib/spine/slots/open";
import { buildHireSlot } from "../../src/lib/spine/slots/hire";
import { buildRunningCostsSlot, buildCreditSlot, buildFilingsSlot } from "../../src/lib/spine/slots/run";
import { buildExitSlot } from "../../src/lib/spine/slots/last";
import { DATED_RECENT_DAYS, UNDATED } from "../../src/lib/spine/slots/dated";
import changesJson from "../../data/sections/changes.json";
import { readAnswerTypes } from "../../scripts/lib/answer_type.mjs";
import { red, redSummary } from "../../scripts/lib/red";

/* Some components the slots draw lean on Next's automatic JSX runtime and import no React (CountryFlag, the city cards); outside Next the
   classic runtime looks React up by name, as the render spikes set it (scripts/spikes/render_country.tsx). */
(globalThis as unknown as { React: typeof React }).React = React;

const RULE = "slots-rules";
const FILE = "src/lib/spine/slots/rules.ts";
const REMEDY = "build slots 14 to 16 from the spectra, the ledger and the doors; date every coming or recent change on the row it changes, or name in UNDATED why no country row prints it";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const read = (el: React.ReactElement) => new JSDOM(`<!doctype html><html><body><main>${renderToStaticMarkup(el)}</main></body></html>`).window.document;
const clean = (doc: Document) => readAnswerTypes(doc, { requireDeclared: true }).findings.map((f: { rule: string; detail: string }) => `${f.rule}: ${f.detail}`);
const TODAY = "2026-10-13";

for (const [iso2, name] of [["GB", "the United Kingdom"], ["KH", "Cambodia"], ["AF", "Afghanistan"], ["DE", "Germany"]] as const) {
  const deal = buildDealingsSlot(iso2);
  check(`${iso2} slot 14: the spectra drawn, the foot figures behind the plus as shares`, !!deal && (!!deal.drawing.state || !!deal.drawing.people) && deal.more.every((l) => l.key === "who" && l.type === "share") && !deal.drawing.state?.foot && !deal.drawing.people?.foot);
  if (deal) { const doc = read(React.createElement(DealingsSlot, { model: deal })); const f = clean(doc); check(`${iso2} slot 14 reads clean, a switch where both tables stand (${f.join("; ") || "clean"})`, f.length === 0 && (!(deal.drawing.state && deal.drawing.people) || !!doc.querySelector("#dealings [data-switch]")), "src/components/spine/country/slots/StageRules.tsx"); }
  /* NOTHING PRINTED IS LOST (final review I1): the labour force and informal economy shares every country but the UK printed under its
     staff card stand in "Who trades here" as shares in the old card's rounding, stamped with their profile fields. */
  if (iso2 !== "GB") {
    const prof = getCountryProfile(iso2) as unknown as Record<string, number>;
    const rows = deal?.more.find((l) => l.key === "who")?.rows ?? [];
    const want = [["labour-force", "labor_force_participation_pct"], ["informal", "informal_economy_share_pct"]].map(([key, field]) => ({ key, field, value: `${Math.round(prof[field] * 10) / 10}%` }));
    const got = want.map((w) => rows.find((r) => r.key === w.key));
    check(`${iso2} slot 14: the labour force and informal economy shares behind the plus (${got.map((r) => r?.value ?? "none").join(", ")}), each stamped with its field`,
      got.every((r, i) => !!r && r.value === want[i].value && r.prov?.src === `economic_indicators/country_profile_v2.json:${want[i].field}`));
  }
  const close = buildCloseSlot(iso2, name);
  check(`${iso2} slot 16: doors`, !!close && close.drawing.doors.length > 0);
  if (close) { const doc = read(React.createElement(CloseSlot, { model: close })); check(`${iso2} slot 16 is the terminus, stamped`, !!doc.querySelector('[data-terminus] #close[data-slot="close"][data-stage="7"][data-answer="doors"] [data-archetype="terminus"]'), "src/components/spine/country/slots/StageRules.tsx"); }
}
const ch = buildChangesSlot("GB", TODAY);
check(`the UK's slot 15: ${ch?.drawing.coming.length} coming, ${ch?.drawing.recent.length} in force, ${ch?.drawing.shown} shown`, !!ch && ch.drawing.coming.length + ch.drawing.recent.length >= 3);
if (ch) { const doc = read(React.createElement(ChangesSlot, { model: ch })); const f = clean(doc); check(`the UK's slot 15 reads clean, every row a dated pair (${f.join("; ") || "clean"})`, f.length === 0 && doc.querySelectorAll('[data-answer="dated-pair"] [data-value]').length > 0, "src/components/spine/country/slots/StageRules.tsx"); }
check("Cambodia, Afghanistan and Germany draw no slot 15 (no ledger)", !buildChangesSlot("KH", TODAY) && !buildChangesSlot("AF", TODAY) && !buildChangesSlot("DE", TODAY));

/* EACH CHANGE DATED ON THE ROW IT CHANGES: on a fixed day and on today. */
type FileChange = { key: string; date: string };
const ledger = ((changesJson as unknown as Record<string, { changes?: FileChange[] }>).GB?.changes ?? []);
const days = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
for (const day of [TODAY, new Date().toISOString().slice(0, 10)]) {
  const models = [buildOpenSlot("GB", day), buildHireSlot("GB", day), buildRunningCostsSlot("GB", day), buildCreditSlot("GB", day), buildFilingsSlot("GB", day), buildExitSlot("GB", day)];
  const dated = new Set(models.flatMap((m) => [...(m?.rows?.rows ?? []), ...(m?.more.flatMap((l) => l.rows) ?? [])]).map((r) => (r as { change?: string | null }).change).filter((k): k is string => typeof k === "string"));
  const owed = [...new Set(ledger.filter((c) => c.date > day || days(c.date, day) <= DATED_RECENT_DAYS).map((c) => c.key))];
  const missing = owed.filter((k) => !dated.has(k) && !UNDATED[k]);
  check(`on ${day}: every coming or recent change is dated on a row or named in UNDATED (${missing.join(", ") || "all"})`, missing.length === 0, "src/lib/spine/slots/dated.ts");
}
check("every UNDATED entry names a ledger key and says why", Object.entries(UNDATED).every(([k, why]) => ledger.some((c) => c.key === k) && why.trim().length > 20), "src/lib/spine/slots/dated.ts");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/slots_rules: all pass");
