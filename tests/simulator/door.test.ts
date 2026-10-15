/**
 * THE DOOR (plan 2026-10-13 cost-simulator, Task 6; spec section 3: "Each trade-in-place page gains a door, 'Run your own numbers', carrying its three
 * place parameters"; Q3 answered as written, A). The trade close's doors on the three seeds the archetype gate holds (London, California, a place with
 * no page), the door's place (a city of the country, else anywhere in it), no door where the calculator offers no such place or trade, the cap the
 * trade close alone raises, the door gate's landing for /calculator, and the London trade page's render with its four doors.
 * BLIND SPOT, stated: it reads the builder and the render; the browser walk of Task 9 follows the door to the page.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/simulator/door.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import { buildTradeCloseDoors } from "../../src/lib/spine/close_rows";
import { Terminus, DOOR_CAP } from "../../src/components/spine/archetypes/Terminus";
import { COPY } from "../../src/lib/spine/copy";
import { INDUSTRIES, isDefaultVisible, industryToSlug } from "../../src/lib/taxonomy";
import { red, redSummary } from "../../scripts/lib/red";
import { stripCommentLines } from "../../scripts/lib/strip_comments";

const RULE = "calc-door";
const FILE = "src/lib/spine/close_rows.ts";
const REMEDY = "add the run door to the trade close before the compare pill, carrying the trade page's place (its city where the calculator holds it, else the country) and trade, only where the calculator resolves it, the cap raised to four for the trade close alone";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

async function main(): Promise<void> {
  const T = await import("../../src/components/spine/archetypes/Terminus");
  check("the trade close's cap is exported, four", (T as { TRADE_CLOSE_CAP?: number }).TRADE_CLOSE_CAP === 4 && DOOR_CAP === 3, "src/components/spine/archetypes/Terminus.tsx");
  check(`the door's words: four, its own first word (${(COPY.tradeClose as Record<string, string>).runDoor})`, (COPY.tradeClose as Record<string, string>).runDoor === "Run your own numbers", "src/lib/spine/copy.ts");

  const seed = (trade: string, iso2: string, geo: string, industry: string, id: string, city: string) => ({ meta: { trade, iso2, geo, industry, industry_id: id, city } });
  const london = buildTradeCloseDoors(seed("Restaurants", "GB", "london", "restaurants", "restaurants", "London"));
  check(`London: industry, place, run, the pill (${london.map((d) => d.key).join(", ")})`, JSON.stringify(london.map((d) => d.key)) === JSON.stringify(["industry", "place", "run", "compare"]));
  const run = london.find((d) => d.key === "run");
  check(`London's door carries its three words and promises the break-even (${run?.href})`, run?.href === "/calculator?country=gb&city=london&trade=restaurants" && run?.lands === "break-even" && run?.kind === "link" && run?.label === "Run your own numbers");
  const cal = buildTradeCloseDoors(seed("Restaurants", "US", "california", "restaurants", "restaurants", "California"));
  check(`a region's trade page sends anywhere in its country (${cal.find((d) => d.key === "run")?.href})`, cal.length === 4 && cal.find((d) => d.key === "run")?.href === "/calculator?country=us&trade=restaurants");
  const pom = buildTradeCloseDoors(seed("Cafés & coffee shops", "GB", "gb-e06000043", "cafes-coffee-shops", "cafes_coffee", "Portsmouth"));
  check(`a place with no page of its own: industry, run, the pill (${pom.map((d) => d.key).join(", ")})`, JSON.stringify(pom.map((d) => d.key)) === JSON.stringify(["industry", "run", "compare"]) && pom[1].href === `/calculator?country=gb&trade=${industryToSlug("cafes_coffee")}`);
  const hidden = INDUSTRIES.find((i) => !isDefaultVisible(i));
  if (hidden) {
    const none = buildTradeCloseDoors(seed(hidden.name, "GB", "london", industryToSlug(hidden.id), hidden.id, "London"));
    check(`a trade the calculator does not offer (${hidden.id}) draws no run door`, !none.some((d) => d.key === "run"));
  }
  check("every first word stands alone, the pill last", [london, cal, pom].every((ds) => new Set(ds.map((d) => d.label.split(/\s+/)[0].toLowerCase())).size === ds.length && ds[ds.length - 1].kind === "pill"));

  /* THE CAP: four on the trade close, three everywhere else. */
  const four = renderToStaticMarkup(React.createElement(Terminus, { doors: london, cap: 4 } as React.ComponentProps<typeof Terminus>));
  const three = renderToStaticMarkup(React.createElement(Terminus, { doors: london }));
  check("the trade close draws its four doors; a terminus without the cap still draws three", (four.match(/data-door="/g) ?? []).length === 4 && (three.match(/data-door="/g) ?? []).length === 3, "src/components/spine/archetypes/Terminus.tsx");
  check("the trade page asks four of its close card", /<CloseCard doors=\{doors\} cap=\{TRADE_CLOSE_CAP\} \/>/.test(readFileSync("src/components/spine/cell/cell-view.tsx", "utf8")), "src/components/spine/cell/cell-view.tsx");
  /* EVERY CALLER OF `cap=`, pinned (review of run 1, I1): the archetype gate reads the trade close's four by where a terminus is
     drawn, and this list is the other half, so a new caller asking a cap anywhere reds here until it is named with its reason. Every
     `cap={...}` in a .tsx under src/, comments stripped, read as file and expression: an alias of Terminus or CloseCard cannot hide. */
  const CAP_CALLERS: ReadonlyArray<readonly [string, string, string]> = [
    ["src/components/spine/cell/cell-view.tsx", "TRADE_CLOSE_CAP", "the trade page's close, the one ruled four"],
    ["src/components/spine/archetypes/stories.tsx", "TRADE_CLOSE_CAP", "the trade close's story on the archetype sheet, drawn as the page draws it"],
    ["src/components/spine/cell/exit.tsx", "cap", "CloseCard forwarding its own prop to Terminus"],
    ["src/app/(site)/account/AccountPreview.tsx", "account.savedCap", "the saved-cells list's limit, no terminus"],
  ];
  const tsx = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? tsx(join(dir, e.name)) : e.name.endsWith(".tsx") ? [join(dir, e.name)] : []));
  const callers = tsx("src").flatMap((f) => [...stripCommentLines(readFileSync(f, "utf8").split("\n")).join("\n").matchAll(/(?<![\w-])cap=\{([^}]*)\}/g)].map((m) => `${f.replace(/\\/g, "/")} cap={${m[1].trim()}}`));
  const pinned = CAP_CALLERS.map(([f, e]) => `${f} cap={${e}}`);
  const stray = callers.filter((c) => !pinned.includes(c));
  const gone = pinned.filter((c) => !callers.includes(c));
  check(`every caller of cap= is pinned (${callers.length} read)${stray.length ? `; not pinned: ${stray.join("; ")}` : ""}${gone.length ? `; pinned and gone: ${gone.join("; ")}` : ""}`, callers.length > 0 && stray.length === 0 && gone.length === 0, "src/components/spine/archetypes/Terminus.tsx");
  check("the door gate lands /calculator by the place it resolves", /if \(path === "\/calculator"\) return calculatorLanding\(href\);/.test(readFileSync("scripts/verify_doors.ts", "utf8")), "scripts/verify_doors.ts");
  check("the archetype gate holds the trade close to four", /checkDoors\(name, doors, "trade close", TRADE_CLOSE_CAP\)/.test(readFileSync("scripts/verify_archetype_copy.ts", "utf8")), "scripts/verify_archetype_copy.ts");

  /* THE RENDER: London's restaurant page, its close. */
  const RENDER = "scratchpad/harness/pages/cell-gb-london-restaurants.html";
  if (!existsSync(RENDER)) check(`a render to read (run the pages-fresh gate): ${RENDER}`, false, RENDER);
  else {
    const doc = new JSDOM(readFileSync(RENDER, "utf8").replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document;
    const doors = [...doc.querySelectorAll("#close a[data-door]")].map((a) => (a.textContent ?? "").replace(/→/g, "").trim());
    check(`London's restaurant page closes on four doors, the run door before the pill (${doors.join(" | ")})`, doors.length === 4 && doors[2] === "Run your own numbers", RENDER);
  }

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("simulator/door: all pass");
  process.exit(0);
}

main().catch((e) => { console.error("x calc-door crashed:", e); process.exit(1); });
