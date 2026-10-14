/**
 * THE COST SIMULATOR'S PAGE (plan 2026-10-13 cost-simulator, Task 4B; spec section 4, the page phone first; Review Focus 2 and 5).
 * The body drawn statically for London restaurants (the UK model, its sales the register's anchor) and Berlin restaurants (the world rows, no sales
 * held): the seven parts, the one 40 in terracotta, one 30 a section, every figure stamped, the bar outside the switch, each empty figure's reason
 * (Review Focus 2), no NaN; the loud seats declared; the client's module graph free of the server's modules; and, mounted, a currency change that
 * redraws the figures and writes no lever (Review Focus 5).
 * NOT HERE YET: the country plan's signal on the firms above break-even and on the margin. Its component and direction table
 * (src/components/spine/signal, src/lib/spine/signal.ts, owner_direction.ts) are another branch's and not on this one; their checks join
 * this file when that branch lands (the build report carries their text).
 * BLIND SPOT, stated: jsdom computes no layout; sizes are read from the type tokens in the classes, and the browser gates read the chain's render
 * (Task 4C).
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/simulator/page.test.ts
 */
import { JSDOM } from "jsdom";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { red, redSummary } from "../../scripts/lib/red";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/calculator" });
(globalThis as any).window = dom.window;
(globalThis as any).document = dom.window.document;
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
(globalThis as any).localStorage = dom.window.localStorage;
(globalThis as any).CustomEvent = dom.window.CustomEvent;
(globalThis as any).HTMLElement = dom.window.HTMLElement;
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
/* React ships `act` in its development build only and reads NODE_ENV when first evaluated: set before the dynamic imports. */
Object.assign(process.env, { NODE_ENV: "development" });

const RULE = "calc-page";
const VIEW = "src/components/spine/calculator/calculator-view.tsx";
const REMEDY = "draw the seven parts in their zones as plan 2026-10-13 Task 4B gives them: the one 40 in terracotta, one 30 a section, every figure stamped, the bar outside the switch, each missing figure's reason in its place, and no server module in the browser";
let failed = 0;
const check = (label: string, ok: boolean, file = VIEW) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };
const KINDS = new Set(["counted", "worked out", "looked up", "estimate", "yours"]);

/* THE CLIENT'S MODULE GRAPH, walked statically from the client component: value imports only (an `import type` is erased). */
function reach(entry: string): string[] {
  const seen = new Set<string>();
  const file = (p: string) => existsSync(p) && statSync(p).isFile();
  const resolveSpec = (from: string, spec: string): string | null => {
    const base = spec.startsWith("@/") ? join("src", spec.slice(2)) : spec.startsWith(".") ? join(dirname(from), spec) : null;
    if (!base) return null;
    for (const e of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) { const p = (base + e).replace(/\\/g, "/"); if (file(p)) return p; }
    return null;
  };
  const visit = (f: string) => {
    if (seen.has(f)) return;
    seen.add(f);
    if (!/\.tsx?$/.test(f)) return;
    for (const m of readFileSync(f, "utf8").matchAll(/^\s*(?:import|export)\s+(?!type\b)(?:[\s\S]*?\sfrom\s+)?["']([^"']+)["']/gm)) {
      if (/^(node:)?fs$/.test(m[1])) { seen.add(`builtin:${m[1]}`); continue; }
      const r = resolveSpec(f, m[1]);
      if (r) visit(r);
    }
  };
  visit(entry);
  return [...seen];
}

async function main(): Promise<void> {
  const React = (await import("react")).default;
  const { act } = await import("react");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { createRoot } = await import("react-dom/client");
  const V = await import("../../src/components/spine/calculator/calculator-view").catch(() => null);
  const C = await import("../../src/components/spine/calculator/CalculatorClient").catch(() => null);
  const Lv = await import("../../src/components/spine/calculator/levers").catch(() => null);
  const S = await import("../../src/lib/simulator/seed").catch(() => null);
  check("the view, the client, the levers and the seed are there", !!V && !!C && !!Lv && !!S);
  if (!V || !C || !Lv || !S) { redSummary(RULE, failed, REMEDY, "modules missing"); process.exit(1); }
  const P = await import("../../src/lib/simulator/place");
  const D = await import("../../src/lib/simulator/defaults");
  const Dp = await import("../../src/lib/simulator/display");
  const Dk = await import("../../src/lib/spine/door_kinds");
  const { readLoudSeats } = await import("../../scripts/lib/loud_seats");
  const { COPY } = await import("../../src/lib/spine/copy");
  const W = COPY.calculator;

  const lp = P.resolvePlace({ country: "gb", city: "london", trade: "restaurants" })!;
  const lb = D.buildBundle(lp, { cell: null });
  const bp = P.resolvePlace({ country: "de", city: "berlin", trade: "restaurants" })!;
  const bb = D.buildBundle(bp, { cell: null });
  const draw = (seed: ReturnType<typeof S.seedOf>) => new JSDOM(renderToStaticMarkup(React.createElement(V.SpineCalculatorBody, { data: seed }))).window.document;
  const ld = draw(S.seedOf(lp, lb));
  const bd = draw(S.seedOf(bp, bb));

  /* THE SEVEN PARTS, IN THEIR ZONES. */
  const ids = ["answer", "margin", "levers", "month", "moves", "opening", "sources"];
  check(`London draws the seven parts (${ids.filter((id) => ld.getElementById(id)).join(", ")}), the masthead's h1 and three pickers on 48px fields`, ids.every((id) => ld.getElementById(id)) && ld.querySelector("h1")?.textContent === W.title && ld.querySelectorAll("form[data-sim-pick] select.h-12").length === 3);
  check(`four zones, the instrument's wide (${[...ld.querySelectorAll("[data-zone]")].map((z) => z.getAttribute("data-zone")).join(", ")})`, JSON.stringify([...ld.querySelectorAll("[data-zone]")].map((z) => z.getAttribute("data-zone"))) === JSON.stringify(["wide", "wide", "lone", "1-1"]));
  check("every section's title is an h2 of four words or fewer", ids.every((id) => { const h = ld.querySelector(`#${id} h2[data-rail-title]`); return !!h && (h.textContent ?? "").trim().split(/\s+/).length <= 4; }));
  check("only the levers keep their box", ld.querySelectorAll("[data-keep-card]").length === 1 && !!ld.querySelector("#levers[data-keep-card]"));

  /* THE ANSWER: the page's one 40, in terracotta, in the reader's currency (dollars before the switch is read). */
  const answers = [...ld.querySelectorAll("[class*='var(--t-answer)']")];
  const expected = Dp.money(556017.36 / 12, "GBP", "USD");
  check(`one 40 on the page, in the answer, terracotta, stamped (${answers.map((a) => a.textContent).join(", ")} against ${expected})`, answers.length === 1 && !!answers[0].closest("#answer") && /--terra-text/.test(answers[0].getAttribute("class") ?? "") && answers[0].textContent === expected && !!answers[0].getAttribute("data-src"));
  check("the answer declares itself a page masthead answering the break-even", !!ld.querySelector('#answer[data-archetype="sim-answer"][data-level="page"][data-answers="break-even"]'));
  for (const id of ["margin", "levers", "month", "moves", "opening"]) {
    const focal = ld.querySelectorAll(`#${id} [class*='var(--t-focal)']`).length;
    check(`${id}: one figure at 30 (${focal})`, focal === 1);
  }
  check("no 30 in the answer", ld.querySelectorAll("#answer [class*='var(--t-focal)']").length === 0);

  /* EVERY FIGURE STAMPED; NO NaN, NO "$-". */
  for (const [name, d] of [["London", ld], ["Berlin", bd]] as const) {
    const figs = [...d.querySelectorAll(".fig")];
    const silent = figs.filter((el) => !el.getAttribute("data-src") || !KINDS.has(el.getAttribute("data-kind") ?? ""));
    check(`${name}: every one of ${figs.length} figures says where it came from (${silent.slice(0, 3).map((el) => el.outerHTML.slice(0, 80)).join(" | ") || "all"})`, figs.length > 10 && silent.length === 0);
    const text = d.body.textContent ?? "";
    check(`${name}: no NaN, Infinity, undefined or "$-" in the page`, !/NaN|Infinity|undefined|\$-/.test(text));
  }

  /* THE MONTH: one bar, outside the switch; the switch holds words and figures (his ruling of 2026-07-09). */
  check("the month's bar stands outside the switch, and the switch holds a month and a year", !!ld.querySelector("#month [data-archetype='month-bar']") && !ld.querySelector("[role='tabpanel'] [data-archetype='month-bar']") && ld.querySelectorAll("#month [role='tabpanel']").length === 2 && ld.querySelectorAll("#month [role='tabpanel'][hidden]").length === 1);

  /* THE DOOR KIND AND THE SURFACE. */
  check("the door kind and the surface: the calculator answers the break-even", Dk.SURFACE_ANSWERS.calculator === "break-even" && (Dk.DOOR_KINDS as readonly string[]).includes("break-even"), "src/lib/spine/door_kinds.ts");

  /* REVIEW FOCUS 2: Berlin holds no sales, so the margin, the month's profit and the payback say so where they would stand. */
  check("Berlin: no sales held, so the margin, the profit and the payback wait with their words", ["margin", "month", "opening"].every((id) => bd.querySelector(`#${id} [data-reason="no-sales"]`)?.textContent === W.reasons.noSales));
  check("Berlin: the break-even still prints, in dollars, and no rates line stands in its bill", !!bd.querySelector("#answer [data-sim-figure]") && (bd.querySelector("#answer [data-sim-figure] .fig")?.textContent ?? "").startsWith("$") && !bd.querySelector('#month [data-row="rates"]'));
  check("Berlin: the sales field stands empty with its line", bd.querySelector('[data-lever-row="sales"] [data-empty]') !== null && (bd.querySelector('[data-lever-row="sales"] p[data-line]')?.textContent ?? "") === W.lines.sales.none);

  /* EACH LEVER SHOWS ITS EFFECT BESIDE IT (spec section 7): the lever in hand carries the break-even as it now stands; none on arrival. */
  const Eng = await import("../../src/lib/simulator/engine");
  const Bn = await import("../../src/lib/simulator/bundle");
  const card = new JSDOM(renderToStaticMarkup(React.createElement(Lv.LeversCard, { W, bundle: lb, state: Bn.FRESH, r: Eng.simulate(Bn.toEngine(lb, Bn.FRESH)), fmt: Dp.makeFormat("GBP", "USD"), set: () => {}, active: "rent" }))).window.document;
  check(`the rent in hand shows the break-even beside it (${card.querySelector('[data-lever-row="rent"] [data-effect] .fig')?.textContent}), and the page on arrival shows none`, card.querySelector('[data-lever-row="rent"] [data-effect] .fig')?.textContent === expected && card.querySelectorAll("[data-effect]").length === 1 && ld.querySelectorAll("[data-effect]").length === 0, "src/components/spine/calculator/levers.tsx");

  /* WHERE FIGURES COME FROM: prose, five notes at most, no figure. */
  check(`the sources are a note list of five notes or fewer, no figure in them (${ld.querySelectorAll("#sources [data-note]").length})`, !!ld.querySelector("#sources [data-archetype='note-list']") && ld.querySelectorAll("#sources [data-note]").length <= 5 && ld.querySelectorAll("#sources .fig").length === 0);
  check("NoteList takes the note's shape from note_shape.ts, so the browser carries no country notes", /from "@\/lib\/spine\/note_shape"/.test(readFileSync("src/components/spine/archetypes/NoteList.tsx", "utf8")) && !/locals_rows/.test(readFileSync("src/components/spine/archetypes/NoteList.tsx", "utf8")), "src/components/spine/archetypes/NoteList.tsx");

  /* THE LOUD SEATS, declared beside the code that lights them. */
  const loud = readLoudSeats();
  const seats = loud.declarations.get("calculator" as never);
  check(`the calculator declares three seats, two lit (${loud.faults.join("; ") || seats?.seats.map((s) => s.state).join(", ")})`, loud.faults.length === 0 && JSON.stringify(seats?.seats.map((s) => s.state)) === JSON.stringify(["LIT", "LIT", "NO HONEST CANDIDATE"]), "scripts/lib/loud_seats.ts");

  /* THE BROWSER CARRIES NO SERVER MODULE. */
  const graph = reach("src/components/spine/calculator/CalculatorClient.tsx");
  const FORBIDDEN = ["src/lib/cells.ts", "src/lib/uk/pnl/london.ts", "src/lib/simulator/defaults.ts", "src/lib/simulator/load.ts", "src/lib/simulator/seed.ts", "src/lib/simulator/place.ts", "src/lib/facts/store.ts", "src/lib/spine/locals_rows.ts", "builtin:fs", "builtin:node:fs"];
  check(`the client's ${graph.length} modules hold no server module (${graph.filter((g) => FORBIDDEN.includes(g)).join(", ") || "none"})`, graph.length > 10 && !graph.some((g) => FORBIDDEN.includes(g)), "src/components/spine/calculator/CalculatorClient.tsx");

  /* REVIEW FOCUS 5, MOUNTED: a currency change redraws the answer and a lever's typed figure and writes no lever. */
  const host = document.getElementById("root") as HTMLElement;
  const root = createRoot(host);
  await act(async () => { root.render(React.createElement(C.CalculatorClient, { seed: S.seedOf(lp, lb) })); });
  const fig = () => host.querySelector("#answer [data-sim-figure] .fig")?.textContent ?? "";
  const before = fig();
  await act(async () => { window.dispatchEvent(new window.CustomEvent("atlas:currency-change", { detail: "GBP" })); });
  const after = fig();
  check(`a currency change redraws the answer in pounds, the law's own (${before} then ${after})`, before === expected && after === Dp.money(556017.36 / 12, "GBP", "GBP"));
  await act(async () => { root.unmount(); });
  let writes = 0;
  const rowHost = document.createElement("ul");
  document.body.appendChild(rowHost);
  const rowRoot = createRoot(rowHost);
  const row = (show: "USD" | "GBP") => React.createElement(Lv.LeverRow, { id: "rent", W, input: lb.inputs.rent, value: lb.inputs.rent.value, yours: false, kind: "money", unit: W.levers.units.year, fmt: Dp.makeFormat("GBP", show), onChange: () => { writes++; }, onClear: () => { writes++; }, onReset: () => { writes++; } });
  await act(async () => { rowRoot.render(row("USD")); });
  const typedUsd = (rowHost.querySelector('input[type="text"]') as HTMLInputElement | null)?.value;
  await act(async () => { rowRoot.render(row("GBP")); });
  const typedGbp = (rowHost.querySelector('input[type="text"]') as HTMLInputElement | null)?.value;
  check(`the rent's typed figure follows the currency and nothing is written (${typedUsd} then ${typedGbp}, ${writes} writes)`, typedUsd === "480" && typedGbp === "362" && writes === 0, "src/components/spine/calculator/levers.tsx");
  await act(async () => { rowRoot.unmount(); });

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("simulator/page: all pass");
  process.exit(0);
}

main().catch((e) => { console.error("x calc-page crashed:", e); process.exit(1); });
