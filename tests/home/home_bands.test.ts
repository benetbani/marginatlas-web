/**
 * THE HOME PAGE'S CITIES, WHAT THE ATLAS HOLDS, AND PRO SAID ONCE (milestone 3, masterplan step 35; his ruling 23 of 2026-09-26:
 * "a quiet band after the search and the UK answers: what Pro opens, the price, one button"). What the atlas holds prints the
 * ledger module's own counts, each stamped as counted; the Pro band draws only while the paywall's switch is on, its prices
 * through the plan, one button to /pricing; and the launch check's item (i) reads the new section as well as the old band.
 *
 * Run: npx tsx tests/home/home_bands.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { buildAtlasHolds } from "../../src/lib/spine/home_answers";
import { getAtlasLedger } from "../../src/lib/home/atlas_ledger";
import { ProBand } from "../../src/components/spine/home/ProBand";
import { priceLine } from "../../src/lib/monetization/plan";
import { buildNotebook, NOTEBOOK_SLUGS } from "../../src/lib/home/notebook";
import { CITY_CARD_PLACEHOLDER_IMAGE } from "../../src/lib/spine/city_cards";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-bands";
const FILE = "src/components/spine/home/home-view.tsx";
const REMEDY = "print the ledger module's counts, stamped; draw Pro only with the paywall's switch on, its prices through the plan";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const l = getAtlasLedger();
const holds = buildAtlasHolds();
check(`the focal is the ledger's benchmarks, ${l.benchmarks.toLocaleString("en-US")}`, holds.focal.figure === l.benchmarks.toLocaleString("en-US"));
const row = (k: string) => holds.rows.find((r) => r.key === k)?.value;
check(`the rows are the ledger's: ${l.countriesMeasured} of ${l.countriesTotal} countries, ${l.cities} cities, ${l.districts} districts, ${l.trades} trades`, row("countries") === `${l.countriesMeasured} of ${l.countriesTotal}` && row("cities") === String(l.cities) && row("districts") === l.districts.toLocaleString("en-US") && row("trades") === String(l.trades));
check("every count is stamped as counted, from the ledger module", [holds.focal.prov, ...holds.rows.map((r) => r.prov)].every((p) => p?.kind === "counted" && /^lib\/home\/atlas_ledger\.ts:/.test(p.src)));

const set = (on: boolean) => { process.env.NEXT_PUBLIC_AUTH_ENABLED = on ? "1" : ""; process.env.NEXT_PUBLIC_PAYWALL = on ? "1" : ""; };
set(false);
const off = renderToStaticMarkup(React.createElement(ProBand));
set(true);
const on = renderToStaticMarkup(React.createElement(ProBand));
set(false);
check("nothing about Pro prints while the switch is off", off === "");
check(`with the switch on: the line, both prices through the plan (${priceLine("month")}, ${priceLine("year")}), one button to /pricing`, on.includes(priceLine("month")) && on.includes(priceLine("year")) && (on.match(/href="\/pricing"/g) ?? []).length === 1 && (on.match(/<a /g) ?? []).length === 1);

/* The notebook (masterplan step 36): the two kept posts, each on its own picture or the UK's, never the old rail's skyline. */
const notebook = buildNotebook();
check(`the notebook shows the two kept posts (${notebook.map((c) => c.slug).join(", ")})`, JSON.stringify(notebook.map((c) => c.slug)) === JSON.stringify([...NOTEBOOK_SLUGS]));
check("each on its own picture or the UK's photograph, never the old rail's skyline", notebook.every((c) => !!c.image.src && c.image.src !== CITY_CARD_PLACEHOLDER_IMAGE && !/positano/i.test(c.image.src)));

const launch = readFileSync("scripts/verify_launch_ready.ts", "utf8");
check("the launch check's item (i) reads the new section's stamped counts as well as the old band", /atlas_ledger\\\.ts:/.test(launch) && /What the atlas holds/.test(launch));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("home/home_bands: all pass");
