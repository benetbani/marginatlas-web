/**
 * THE LOCKS FOLLOW THE SLOTS (plan 2026-10-13 country-page-journey, Task 5; spec section 8: "his ruling 18 by analogy: each stage's first slot
 * open, every later slot of the stage locked when the paywall is on; the lock order (lockedLevelKeys) follows the new slots"). The UK locks
 * eight slots, a thin country three; every slot that can lock has its line; the locked UK page draws each locked slot as its LockedSection
 * with the slot's stamps, and the trades' pages as free doors (his ruling of 2026-10-05 on PARKED P20.1); the open page draws no lock.
 * BLIND SPOT, stated: static markup; the paywall's own gate (paywall-shape) renders the locked forms and compares their links.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/country_locks.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { lockedSlots, lockLineKey } from "../../src/lib/spine/slots/locks";
import { planCountry } from "../../src/lib/spine/slots/plan";
import { SpineCountryBody } from "../../src/components/spine/country/country-view";
import { buildLondonTradeSales } from "../../src/lib/spine/country_depth_rows";
import { SLOTS, slotDef } from "../../src/lib/spine/country_slots";
import { COPY } from "../../src/lib/spine/copy";
import { red, redSummary } from "../../scripts/lib/red";

/* Some components the slots draw lean on Next's automatic JSX runtime and import no React (CountryFlag, the city cards); outside Next the
   classic runtime looks React up by name, as the render spikes set it (scripts/spikes/render_country.tsx). */
(globalThis as unknown as { React: typeof React }).React = React;

const RULE = "country-locks";
const FILE = "src/lib/spine/slots/locks.ts";
const REMEDY = "lock every slot after its stage's first (lockedLevelKeys over the slots), draw each as its LockedSection with the slot's stamps and its line, and stand the trades' pages as free doors";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const TODAY = "2026-10-13";
const sorted = (s: Set<string>) => [...s].sort().join(",");

const gb = planCountry("GB", "United Kingdom", TODAY);
check(`the UK locks eight slots (${sorted(lockedSlots(gb.drawn))})`, sorted(lockedSlots(gb.drawn)) === ["changes", "credit", "exit", "filings", "peers", "running-costs", "spend", "trades"].sort().join(","));
const kh = planCountry("KH", "Cambodia", TODAY);
check(`Cambodia locks three (${sorted(lockedSlots(kh.drawn))})`, sorted(lockedSlots(kh.drawn)) === ["credit", "running-costs", "spend"].sort().join(","));
const lockable = SLOTS.filter((s) => lockedSlots(SLOTS.map((x) => x.id)).has(s.id));
const lines = COPY.locked.lines as Record<string, string>;
check(`every slot that can lock has its line, no figure in it (${lockable.map((s) => lockLineKey(s.id)).filter((d) => !lines[d]).join(", ") || "all"})`, lockable.every((s) => typeof lines[lockLineKey(s.id)] === "string" && !/\d/.test(lines[lockLineKey(s.id)])), "src/lib/spine/copy.ts");

const html = (locked: boolean) => renderToStaticMarkup(React.createElement(SpineCountryBody, { data: { meta: { country_name: "United Kingdom", iso2: "GB" } }, locked }));
const open = new JSDOM(`<!doctype html><html><body><main>${html(false)}</main></body></html>`).window.document;
check("the open page draws no lock", open.querySelectorAll("[data-locked]").length === 0, "src/components/spine/country/country-view.tsx");
const shut = new JSDOM(`<!doctype html><html><body><main>${html(true)}</main></body></html>`).window.document;
const got = [...shut.querySelectorAll("[data-locked]")].map((el) => el.getAttribute("data-slot")).sort().join(",");
check(`the locked page draws each locked slot as its LockedSection, stamped (${got})`, got === sorted(lockedSlots(gb.drawn)) && [...shut.querySelectorAll("[data-locked]")].every((el) => el.id === slotDef(el.getAttribute("data-slot") as never).domId), "src/components/spine/country/country-view.tsx");
const sales = buildLondonTradeSales();
const doors = shut.querySelector('[data-free-doors="trades"]');
check("the trades' pages stand as free doors after the close", !!doors && !!sales && sales.rows.every((r) => !!doors.querySelector(`a[href="${r.href}"]`)), "src/components/spine/country/country-view.tsx");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/country_locks: all pass");
