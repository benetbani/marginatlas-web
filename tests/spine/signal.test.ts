/**
 * THE SIGNAL (plan 2026-10-13 country-page-journey, Task 2; spec section 4): the state's arithmetic (src/lib/spine/signal.ts) on fixtures and
 * on the UK's electricity; the triangle (src/components/spine/signal/Signal.tsx) at its five angles and two sizes, its word its accessible
 * name; the five colours held by one file and named once in the palette gate; and, on the country renders, every triangle a signal
 * (Review Focus 1: the world track's reference mark is a tick, never a second triangle beside the signal).
 * BLIND SPOT, stated: on the renders a triangle is read as a CSS border triangle or a three-point polygon; one drawn another way is unread.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/signal.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import { signalState, signalFor, SIGNAL_ANGLE, SIGNAL_SET_FLOOR } from "../../src/lib/spine/signal";
import { Signal, SignalKey } from "../../src/components/spine/signal/Signal";
import { WorldRangeRows } from "../../src/components/spine/charts/WorldRange";
import { worldValues, worldRange } from "../../src/lib/spine/world_stats";
import { getCountryProfile } from "../../src/lib/economic_profile";
import { COPY } from "../../src/lib/spine/copy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "signal";
const LIB = "src/lib/spine/signal.ts";
const REMEDY = "turn the placement rank by the measure's direction into fifths (no mark under twenty), draw one solid triangle at the state's angle in its token, its word its name, the five tokens in one file the palette gate names, and no other triangle on the page";
let failed = 0;
const check = (label: string, ok: boolean, file = LIB) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

/* THE ARITHMETIC: a hundred members, 1 to 100. */
const set = Array.from({ length: 100 }, (_, i) => i + 1);
const higher = (v: number) => signalState(v, set, "higher");
const lower = (v: number) => signalState(v, set, "lower");
check(`higher is easier: the fifths by the share strictly below (100: ${higher(100)}, 80: ${higher(80)}, 61: ${higher(61)}, 60: ${higher(60)}, 41: ${higher(41)}, 40: ${higher(40)}, 21: ${higher(21)}, 20: ${higher(20)})`,
  higher(100) === 1 && higher(81) === 1 && higher(80) === 2 && higher(61) === 2 && higher(60) === 3 && higher(41) === 3 && higher(40) === 4 && higher(21) === 4 && higher(20) === 5 && higher(1) === 5);
check(`lower is easier: the fifths by the share strictly above (1: ${lower(1)}, 100: ${lower(100)}, 50: ${lower(50)})`, lower(1) === 1 && lower(100) === 5 && lower(50) === 3);
/* A TIE IS NOT LOWER, as the placement sentence counts it (final review I5): thirty equal figures sit in the bottom tenth, "Among the lowest
   tenth", so where higher is easier the mark is very poor, and where lower is easier very good. */
check("a tie is not lower: all ties sit in the bottom tenth, read from each end", signalState(5, Array(30).fill(5), "higher") === 5 && signalState(5, Array(30).fill(5), "lower") === 1);
/* ONE SENTENCE, ONE STATE (final review I5): every figure whose placement sentence names the same tenth carries the same state. */
{
  const odd = Array.from({ length: 197 }, (_, i) => Math.round((i * 7919) % 1000) / 10);
  const byTenth = new Map<string, Set<number>>();
  for (const dir of ["higher", "lower"] as const) for (const v of odd) {
    const st = signalState(v, odd, dir);
    const t = Math.min(9, Math.floor((10 * odd.filter((x) => x < v).length) / odd.length));
    const k = `${dir}:${t}`;
    if (st != null) byTenth.set(k, (byTenth.get(k) ?? new Set()).add(st));
  }
  const split = [...byTenth].filter(([, st]) => st.size > 1).map(([k]) => k);
  check(`one placement tenth carries one state, both directions (${split.join(", ") || "none split"})`, byTenth.size === 20 && split.length === 0);
}
check(`no state under a set of ${SIGNAL_SET_FLOOR}, none without a direction`, signalState(5, set.slice(0, 19), "higher") === null && signalState(5, set, "none") === null);
check("a measure with no owner direction draws nothing and owes no reason", JSON.stringify(signalFor("salary", 50, set)) === JSON.stringify({ signal: null, noSignal: null }));
check("a directed measure on a small set draws nothing and says so", JSON.stringify(signalFor("electricity", 5, set.slice(0, 10))) === JSON.stringify({ signal: null, noSignal: "set" }));
const gbKwh = getCountryProfile("GB").electricity_usd_per_kwh_commercial as number;
check(`the UK's business electricity, the world's dearest, is very poor (${signalFor("electricity", gbKwh, worldValues("electricity_usd_per_kwh_commercial")).signal?.state})`, signalFor("electricity", gbKwh, worldValues("electricity_usd_per_kwh_commercial")).signal?.state === 5);

/* THE TRIANGLE. */
const SPEC_FILL = { 1: "#1b5e20", 2: "#2e7d32", 3: "#8a6d00", 4: "#c62828", 5: "#7f0000" } as const;
for (const s of [1, 2, 3, 4, 5] as const) {
  const html = renderToStaticMarkup(React.createElement(Signal, { state: s, measure: "electricity" }));
  const word = COPY.journey.signal.words[s];
  check(`state ${s}: one polygon turned ${SIGNAL_ANGLE[s]} degrees about the centre, filled ${SPEC_FILL[s]}, named "${word}"`,
    (html.match(/<polygon/g) ?? []).length === 1 && html.includes(`rotate(${SIGNAL_ANGLE[s]} 8 8)`) && html.includes(`fill="${SPEC_FILL[s]}"`) && html.includes(`aria-label="${word}"`) && html.includes(`title="${word}"`) && html.includes('role="img"') && html.includes(`data-signal="${s}"`) && html.includes('data-measure="electricity"') && html.includes('aria-hidden="true"'),
    "src/components/spine/signal/Signal.tsx");
}
/* THE SHAPE (final review C1): a narrow arrowhead whose apex points up at rotate(0), its apex angle 45 degrees or less, so no two of the
   five turns look alike (an equilateral drawing repeats every 120 degrees); its centroid within 0.25 of the box's centre (8, 8), so every
   turn stays in place. */
{
  const pts = (/points="([^"]+)"/.exec(renderToStaticMarkup(React.createElement(Signal, { state: 1, measure: "electricity" })))?.[1] ?? "").trim().split(/\s+/).map((p) => p.split(",").map(Number));
  const ang = (i: number) => { const [a, b, c] = [pts[i], pts[(i + 1) % 3], pts[(i + 2) % 3]]; const u = [b[0] - a[0], b[1] - a[1]], v = [c[0] - a[0], c[1] - a[1]]; return (Math.acos((u[0] * v[0] + u[1] * v[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(v[0], v[1]))) * 180) / Math.PI; };
  const angles = pts.length === 3 && pts.every((p) => p.length === 2 && p.every(Number.isFinite)) ? [0, 1, 2].map(ang) : [];
  const apex = angles.length ? angles.indexOf(Math.min(...angles)) : -1;
  const cx = pts.reduce((a, p) => a + p[0], 0) / 3, cy = pts.reduce((a, p) => a + p[1], 0) / 3;
  check(`the triangle is a narrow arrowhead: apex ${angles.length ? angles[apex].toFixed(1) : "?"} degrees (at most 45), pointing up, centroid (${cx.toFixed(2)}, ${cy.toFixed(2)}) within 0.25 of (8, 8)`,
    angles.length === 3 && angles[apex] <= 45 && pts[apex][1] === Math.min(...pts.map((p) => p[1])) && Math.abs(cx - 8) <= 0.25 && Math.abs(cy - 8) <= 0.25, "src/components/spine/signal/Signal.tsx");
}
check("the angles are the spec's: up, up-left, left, down-left, down", JSON.stringify(SIGNAL_ANGLE) === JSON.stringify({ 1: 0, 2: -45, 3: -90, 4: -135, 5: 180 }));
check("16px beside a row's figure, 20px beside a 30px figure", /h-4 w-4/.test(renderToStaticMarkup(React.createElement(Signal, { state: 3, measure: "electricity" }))) && /h-5 w-5/.test(renderToStaticMarkup(React.createElement(Signal, { state: 3, measure: "electricity", size: "focal" }))), "src/components/spine/signal/Signal.tsx");
check("the page's key: one line, twelve words at most", /data-signal-key=""/.test(renderToStaticMarkup(React.createElement(SignalKey))) && COPY.journey.signal.key.split(/\s+/).length <= 12, "src/components/spine/signal/Signal.tsx");

/* THE FIVE COLOURS: one file holds them, Signal.tsx alone imports it, the palette gate names it once. */
const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:'"\\])\/\/.*$/gm, "$1");
const files: string[] = [];
const walk = (d: string) => { for (const e of readdirSync(d)) { const p = join(d, e).replace(/\\/g, "/"); if (statSync(p).isDirectory()) walk(p); else if (/\.(tsx?|css|mjs)$/.test(p)) files.push(p); } };
walk("src");
const HEX = Object.values(SPEC_FILL);
const holders = files.filter((f) => { const src = strip(readFileSync(f, "utf8")).toLowerCase(); return HEX.some((h) => src.includes(h)); });
check(`the five colours stand in one file, the signal's tokens (${holders.join(", ") || "none"})`, JSON.stringify(holders) === JSON.stringify(["src/components/spine/signal/tokens.ts"]), "src/components/spine/signal/tokens.ts");
const importers = files.filter((f) => /from "(?:\.\/tokens|@\/components\/spine\/signal\/tokens)"/.test(readFileSync(f, "utf8")));
check(`only Signal.tsx imports the tokens (${importers.join(", ")})`, JSON.stringify(importers) === JSON.stringify(["src/components/spine/signal/Signal.tsx"]), "src/components/spine/signal/Signal.tsx");
const gate = readFileSync("scripts/verify_palette_membership.mjs", "utf8");
check("the palette gate names one allowlist: the tokens file and the five colours, nothing else", /const SIGNAL_ALLOW = \{ file: "src\/components\/spine\/signal\/tokens\.ts"/.test(gate) && HEX.every((h) => gate.includes(`"${h}"`)) && (gate.match(/SIGNAL_ALLOW = /g) ?? []).length === 1, "scripts/verify_palette_membership.mjs");

/* REVIEW FOCUS 1: THE SIGNAL IS THE PAGE'S ONE TRIANGLE. The reference on a world track is a tick. */
const range = worldRange("bank_lending_rate_pct");
const track = range ? renderToStaticMarkup(React.createElement(WorldRangeRows, { rows: [{ key: "lending", label: "Rate", value: 0.066, display: "6.6%", range, fmt: (v: number) => `${v}`, refs: [{ key: "base", label: "Central bank rate", value: 0.0375 }] }] })) : "";
const refDoc = new JSDOM(`<main>${track}</main>`).window.document;
const ref = refDoc.querySelector('[data-mark="reference"]');
check("the world track's reference mark is a tick, not a triangle", !!ref && !/border-x-transparent/.test(ref.getAttribute("class") ?? "") && /\bw-0\.5\b/.test(ref.getAttribute("class") ?? ""), "src/components/spine/charts/WorldRange.tsx");
const pages = (JSON.parse(readFileSync("scripts/harness/pages.json", "utf8")).pages as Array<{ surface: string; slugs: string[] }>).filter((p) => p.surface === "country").map((p) => `country-${p.slugs.join("-")}`);
let read = 0;
for (const name of pages) {
  const file = `scratchpad/harness/pages/${name}.html`;
  if (!existsSync(file)) { check(`${name}: a render to read (run the pages-fresh gate)`, false, file); continue; }
  read++;
  const main = new JSDOM(readFileSync(file, "utf8").replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document.querySelector("main");
  const css = [...(main?.querySelectorAll("[class]") ?? [])].filter((el) => { const c = el.getAttribute("class") ?? ""; return /border-x-transparent/.test(c) && /border-[tb]-\[/.test(c); });
  const polys = [...(main?.querySelectorAll("polygon") ?? [])].filter((p) => (p.getAttribute("points") ?? "").trim().split(/\s+/).length === 3);
  const stray = [...css, ...polys].filter((el) => !el.closest("[data-signal]"));
  check(`${name}: every triangle on the page is a signal (${stray.length} other)`, stray.length === 0, "src/components/spine/charts/WorldRange.tsx");
}
check(`country renders read (${read})`, read > 0, "scripts/harness/pages.json");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/signal: all pass");
