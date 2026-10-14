/**
 * THE SIGNAL'S MARK RULE (plan 2026-10-13 country-page-journey, Task 1D; spec section 4, and section 8: "the signal's direction table read
 * for every mark printed"). Over the country renders pages-fresh writes, statically:
 *   NAMED   every mark ([data-signal]) names a measure (data-measure) of the direction table (src/lib/spine/owner_direction.ts) whose
 *           direction is lower or higher, and a state from 1 to 5;
 *   PLACED  every placed figure ([data-placed]) names a measure of the table; where the measure has a direction its row or focal holds its
 *           mark, unless it says why not (data-no-signal: "set", under 20 countries hold it; "fill", the file's stand-in value); where the
 *           measure has none, no mark;
 *   KEY     a page that draws a mark carries the one-line key ([data-signal-key]) once;
 *   READ    each country render holds at least one placed figure (a rule that reads nothing is no rule);
 *   STATE   the state of each mark whose measure this file can read from the files (electricity, the lending rate, clean dealing), recomputed.
 * BLIND SPOT, stated: it reads the stamps the builders write, not the arithmetic; Task 2's STATE checks recompute the states printed for
 * the measures they can read from the files.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/signal_marks.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { OWNER_DIRECTION, directionOf, type MeasureKey } from "../../src/lib/spine/owner_direction";
import { signalState } from "../../src/lib/spine/signal";
import { worldValues } from "../../src/lib/spine/world_stats";
import { getCountryProfile, listCountryProfiles } from "../../src/lib/economic_profile";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "signal-marks";
const REMEDY = "stamp each placed figure with its measure (data-placed), draw the signal beside it where the direction table gives the measure a direction (src/components/spine/signal/Signal.tsx), none where it gives none, and carry the page's one key line";
let failed = 0;
const check = (label: string, ok: boolean, file = "src/components/spine/country/country-view.tsx") => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const TABLE = OWNER_DIRECTION as Record<string, { direction: string }>;

const pages = (JSON.parse(readFileSync("scripts/harness/pages.json", "utf8")).pages as Array<{ surface: string; slugs: string[] }>).filter((p) => p.surface === "country").map((p) => `country-${p.slugs.join("-")}`);
check(`country renders to read (${pages.length})`, pages.length > 0, "scripts/harness/pages.json");
for (const name of pages) {
  const file = `scratchpad/harness/pages/${name}.html`;
  if (!existsSync(file)) { check(`${name}: a render to read (run the pages-fresh gate)`, false, file); continue; }
  const main = new JSDOM(readFileSync(file, "utf8").replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document.querySelector("main");
  if (!main) { check(`${name}: the render holds a main`, false, file); continue; }
  const marks = [...main.querySelectorAll("[data-signal]")];
  const badMarks = marks.filter((m) => !/^[1-5]$/.test(m.getAttribute("data-signal") ?? "") || !["lower", "higher"].includes(TABLE[m.getAttribute("data-measure") ?? ""]?.direction ?? "")).map((m) => `${m.getAttribute("data-measure")}=${m.getAttribute("data-signal")}`);
  check(`${name} NAMED: every mark names a directed measure and a state 1 to 5 (${marks.length} marks; bad: ${badMarks.join(", ") || "none"})`, badMarks.length === 0);
  const placed = [...main.querySelectorAll("[data-placed]")];
  check(`${name} READ: at least one placed figure on the render (${placed.length})`, placed.length > 0);
  const faults: string[] = [];
  for (const el of placed) {
    const m = el.getAttribute("data-placed") ?? "";
    const dir = TABLE[m]?.direction;
    const box = el.matches("[data-row], [data-focal-row]") ? el : el.closest("[data-row], [data-focal-row]") ?? el;
    const has = !!box.querySelector(`[data-signal][data-measure="${m}"]`);
    const why = box.getAttribute("data-no-signal") ?? el.getAttribute("data-no-signal");
    if (!dir) faults.push(`${m}: a placed measure the direction table does not name`);
    else if (dir === "none" && has) faults.push(`${m}: a mark on a measure with no owner direction`);
    else if (dir !== "none" && !has && why !== "set" && why !== "fill") faults.push(`${m}: a directed measure placed without its mark or its reason`);
  }
  check(`${name} PLACED: every placed figure follows the table (${faults.join("; ") || "all"})`, faults.length === 0);
  const keys = main.querySelectorAll("[data-signal-key]").length;
  check(`${name} KEY: ${marks.length ? "one key line for its marks" : "no mark, so no key is owed"} (${keys})`, marks.length === 0 ? keys <= 1 : keys === 1);
  /* STATE (plan 2026-10-13 country-page-journey, Task 2): the marks this file can recompute from the files. */
  const FIELD: Record<string, string> = { electricity: "electricity_usd_per_kwh_commercial", "lending-rate": "bank_lending_rate_pct", "clean-dealing": "corruption_perception_index" };
  const iso2 = name.slice("country-".length);
  for (const m of marks) {
    const measure = m.getAttribute("data-measure") ?? "";
    const field = FIELD[measure];
    if (!field) continue;
    const value = (getCountryProfile(iso2) as unknown as Record<string, number>)[field];
    const values = measure === "clean-dealing" ? listCountryProfiles().map((p) => (p as unknown as Record<string, number>)[field]).filter((v) => Number.isFinite(v)) : worldValues(field);
    const want = signalState(value, values, directionOf(measure as MeasureKey));
    check(`${name} STATE: ${measure} prints ${m.getAttribute("data-signal")}, the arithmetic gives ${want}`, String(want) === m.getAttribute("data-signal"), "src/lib/spine/signal.ts");
  }
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/signal_marks: all pass");
