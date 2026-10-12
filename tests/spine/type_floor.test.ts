/**
 * THE TYPE FLOOR'S READER (plan 2026-10-12 rhythm-air-inside, Task 1A; spec E:/atlas/docs/superpowers/specs/2026-10-12-rhythm-air-inside-design.md,
 * sections 2.2 and 3 item 1): reader text is 14px or larger, the 12px rung kept for a chart's tick and axis labels and the foot's source line, each
 * place named in scripts/harness/type_floor_allow.json. Fixtures over scripts/lib/type_floor.mjs, the list's shape, the stylesheet the reader mirrors
 * and the gate's wiring.
 * BLIND SPOT, stated: fixtures prove the reading, not the pages; the pages are the `type-floor` gate's, over the renders pages-fresh writes.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/type_floor.test.ts
 */
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { readTypeFloor, ZONE_SIZES, FLOOR_PX, SHARE_MAX } from "../../scripts/lib/type_floor.mjs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "type-floor-reader";
const LIB = "scripts/lib/type_floor.mjs";
const LIST = "scripts/harness/type_floor_allow.json";
const GATE = "scripts/harness/check_type_floor.mjs";
const REMEDY = "read a render as R1 read it (the header of scripts/lib/type_floor.mjs): visible at 1280, the nearest size, THE ZONES' size rules, non-space characters";
let failed = 0;
const check = (label: string, ok: boolean, file = LIB, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };

const read = (inner: string, keys: string[] = []) => readTypeFloor(new JSDOM(`<!doctype html><html><body><main>${inner}</main></body></html>`).window.document, new Set(keys));
const M = "text-[length:var(--t-micro)]";
const B = "text-[length:var(--t-body)]";

let r = read(`<p class="${B}">abcd</p><p class="${M}">ab</p>`);
check(`a 12px run is small and a 14px run is not: 2 of 6 characters (got ${r.small} of ${r.chars})`, r.chars === 6 && r.small === 2);
r = read(`<p class="${M} md:hidden">phone</p><p class="hidden md:block ${M}">desk</p><p class="sr-only ${M}">sr</p><p hidden class="${M}">attr</p><p style="display: none" class="${M}">none</p>`);
check(`visible at 1280: a phone-only run and sr-only, hidden and display:none runs are not read, a run shown from md is (got ${r.small} of ${r.chars})`, r.chars === 4 && r.small === 4);
r = read(`<details><summary class="${B}">open me</summary><p class="${M}">inside</p></details><details open><p class="${M}">shown</p></details>`);
check(`a closed <details> is read only at its <summary>, an open one whole (got ${r.small} of ${r.chars})`, r.chars === 11 && r.small === 5);
r = read(`<div class="${M}"><span>inherits</span><span class="${B}">own</span></div>`);
check(`a run takes its nearest size: an inner class beats its parent's (got ${r.small} of ${r.chars})`, r.small === 8 && r.chars === 11);
r = read(`<p class="${M} lg:${B}">grows</p><p class="${B} 2xl:${M}">stays</p>`);
check(`a breakpoint class applies at 1280 from sm to xl, and 2xl does not (got ${r.small})`, r.small === 0 && r.chars === 10);
r = read(`<p class="${B} [@container(min-width:420px)]:${M}">query</p>`);
check("a container query's size is not read (the stated blind spot): the run stays 14", r.small === 0);
r = read(`<p>plain</p>`);
check("no size anywhere reads as the browser's 16", r.small === 0 && r.chars === 5);
r = read(`<svg><text font-size="9">ticks</text></svg>`);
check("an SVG text's font-size attribute is its size", r.small === 5);
r = read(`<section data-zone="1-1"><div class="spine-card"><h3 data-rail-title="" class="text-[length:var(--t-lead)]">Title</h3><p data-focal-words="" class="${M}">words</p></div></section>`);
check(`THE ZONES' rules: an open section's title reads 20 and the line under its figure 14 (got ${r.small} small)`, r.small === 0 && r.chars === 10);
r = read(`<section data-zone="1-1"><div class="spine-card" data-keep-card=""><p data-focal-words="" class="${M}">kept</p></div></section>`);
check("a kept card's line is not raised by the zone's rule", r.small === 4);
r = read(`<span data-type-allow="month-axis" class="${M}">JFM</span><span data-type-allow="nobody" class="${M}">xx</span><p class="${B}">abcde</p>`, ["month-axis"]);
check(`an allowance key the list names exempts its run; a key it does not name is reported and counted (allowed ${r.allowed}, small ${r.small}, unknown ${r.unknownKeys.join()})`, r.allowed === 3 && r.small === 2 && r.unknownKeys.join() === "nobody" && Math.abs(r.raw - 0.5) < 1e-9);
check(`the law's numbers are the spec's: ${FLOOR_PX}px, ${SHARE_MAX * 100}%`, FLOOR_PX === 14 && SHARE_MAX === 0.2);

/* THE READER MIRRORS THE STYLESHEET: THE ZONES set four font sizes over seven selectors; a rule added or dropped there is added or dropped in ZONE_SIZES. */
const css = readFileSync("src/app/globals.css", "utf8");
const zonesFrom = css.indexOf("THE ZONES (the band page");
const zones = zonesFrom === -1 ? "" : css.slice(zonesFrom, css.indexOf("atlas-eyebrow", zonesFrom));
const declared = [...zones.matchAll(/font-size:\s*var\(--t-(?:head|body)\)/g)].length;
check(`the reader holds THE ZONES' size rules: ${ZONE_SIZES.length} selectors for ${declared} font-size declarations`, declared === 4 && ZONE_SIZES.length === 7, "src/app/globals.css", "when THE ZONES gains or loses a font-size rule, add or drop its selectors in ZONE_SIZES (scripts/lib/type_floor.mjs)");

/* THE ALLOWANCE LIST'S SHAPE. */
type Entry = { key: string; kind: string; places: string[]; reason: string };
const list = JSON.parse(readFileSync(LIST, "utf8")) as Entry[];
const unfit = list.filter((e) => !(typeof e.key === "string" && /^[a-z][a-z0-9-]*$/.test(e.key) && (e.kind === "axis" || e.kind === "source") && Array.isArray(e.places) && e.places.length > 0 && e.places.every((p) => typeof p === "string" && p.startsWith("src/components/spine/")) && typeof e.reason === "string" && e.reason.trim().length > 0));
const twice = list.filter((e, i) => list.findIndex((x) => x.key === e.key) !== i);
check(`${LIST} holds ${list.length} places, each a key, a kind (axis or source), its files under src/components/spine and a reason, none twice (unfit: ${unfit.map((e) => e.key).join(", ") || "none"})`, list.length > 0 && unfit.length === 0 && twice.length === 0, LIST, 'give each entry { "key", "kind": "axis" | "source", "places": [files], "reason" }');
check("the list's one source place is the foot's licence line", list.filter((e) => e.kind === "source").map((e) => e.key).join() === "sources-foot", LIST, "the 12px rung stays for the source and licence line of a page's foot alone (spec section 2.2)");

/* THE GATE'S WIRING. */
const gate = readFileSync(GATE, "utf8");
check("the gate reads the allowance list and the spine surfaces of the harness list, and parses with jsdom, no browser", /type_floor_allow\.json/.test(gate) && /\["country", "city", "cell", "industry", "hood"\]/.test(gate) && /new JSDOM\(/.test(gate) && !/chromium/.test(gate), GATE, "read scripts/harness/type_floor_allow.json and the country, city, cell, industry and hood surfaces of scripts/harness/pages.json, statically");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/type_floor: all pass");
