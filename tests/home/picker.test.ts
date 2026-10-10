/**
 * THE HOME PICKER IN THE SPINE'S TOKENS (plan docs/superpowers/plans/2026-10-10-home-reform, Task 2; the critique's P0.4, P1.2, P1.3,
 * P1.14 and P2.9; the ship audit's 1b.1 to 1b.5 and 3.2). A field: its label in sentence case at 14px, weight 500, ink2, no star and
 * aria-required in its place; 48px tall, the card's 12px corner, the control token's edge, 16px type under 768, an ink ring whenever
 * focus is inside; on focus its label kept and selected; a row and a polite live region that say "No match for 'x'"; 44px rows, the
 * soft fill and an ink bar on the highlighted one, the examples muted. The form: the spine's card, kept on the band; one solid ink
 * action; the examples' line in ink2 under the row; a failure said in the card; "Loading…" with its ellipsis; no static import of
 * the taxonomy, the cascade, the destination, the regions or the city tables, its lists loaded with import() on first use, and its
 * first paint from the server's seed, whose labels are the lists' own.
 * ComboField is rendered on the server and mounted in jsdom, and steered with the keys (the Task 2 fix round: Enter chooses the lit
 * row whatever is typed, and keeps the visitor in the field over "No match"). NavigatorForm needs Next's router to render, so its markup is read from
 * the home's render (tests/trust/home_shape.test.ts, the hero's checks) and its source here, comments stripped.
 * Run: npx tsx tests/home/picker.test.ts
 */
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", { pretendToBeVisual: true });
(globalThis as any).window = dom.window;
(globalThis as any).document = dom.window.document;
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
/* jsdom draws nothing, so it has no scrollIntoView; the field calls it to keep the highlighted row on screen. */
Object.defineProperty(dom.window.HTMLElement.prototype, "scrollIntoView", { configurable: true, writable: true, value() {} });
/* React's `act` is in its development build only (tests/spine/setup_tiers_expand.test.ts says why): set before the imports. */
Object.assign(process.env, { NODE_ENV: "development" });

const RULE = "home-picker";
const FIELD = "src/components/ComboField.tsx";
const FORM = "src/components/NavigatorForm.tsx";
const PICKER = "src/lib/home/picker.ts";
const REMEDY = "keep the home picker in the spine's tokens as plan 2026-10-10 (home reform, Task 2) builds it: sentence-case labels, 48px fields on --control-line with an ink focus ring, a No match row, the ink action, the lists loaded on first use from src/lib/home/picker.ts";
let failed = 0;
const check = (label: string, ok: boolean, file: string, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };

async function main() {
  const React = (await import("react")).default;
  const { act } = await import("react");
  const { createRoot } = await import("react-dom/client");
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { ComboField } = await import("../../src/components/ComboField");
  const P = await import("../../src/lib/home/picker");
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

  /* A FIELD, AS THE SERVER RENDERS IT. */
  const options = [
    { value: "GB", label: "United Kingdom" },
    { value: "FR", label: "France", keywords: ["fr"] },
    { value: "ES", label: "Spain", examples: ["Madrid", "Seville"] },
  ];
  const props = { id: "country", label: "Country", required: true, options, value: "GB", onChange: () => {} };
  const html = renderToStaticMarkup(React.createElement(ComboField, props));
  check("the label is sentence case at 14px, weight 500, ink2, 8px above the field, with no star", html.includes('<label for="country" class="mb-2 block text-sm font-medium text-[var(--c-ink2)]">Country</label>'), FIELD, "draw the label as <label className=\"mb-2 block text-sm font-medium text-[var(--c-ink2)]\"> with the call site's words and no star");
  check("a required field says so with aria-required", /<input[^>]*aria-required="true"/.test(html), FIELD);
  const wrap = /<div class="(flex h-12 [^"]*)">/.exec(html)?.[1] ?? "";
  check(`the field is 48px, the card's 12px corner, the control token's edge, and an ink ring of 2px whenever focus is inside (read: ${wrap || "no field box"})`, ["h-12", "rounded-xl", "border-[var(--control-line)]", "focus-within:ring-2", "focus-within:ring-[var(--c-ink)]", "focus-within:border-[var(--c-ink)]", "transition-colors"].every((c) => wrap.split(" ").includes(c)), FIELD);
  const input = /<input[^>]*class="([^"]*)"/.exec(html)?.[1] ?? "";
  check(`the type is 16px under 768 and 14 from it, the placeholder the muted grey, the input's own outline off under the ring (read: ${input})`, ["text-base", "md:text-sm", "placeholder:text-[var(--c-muted)]", "focus-visible:outline-none"].every((c) => input.split(" ").includes(c)), FIELD);
  check("no capitals, no brown, no terracotta and no transition on every property in the field", !/uppercase|tracking-|cocoa-|atlas-|parchment|transition-all/.test(html), FIELD);
  check("the field carries a polite live region", /<p role="status" aria-live="polite" class="sr-only"><\/p>/.test(html), FIELD);
  check("an empty label draws no label element (a page that labels the field itself)", !/<label/.test(renderToStaticMarkup(React.createElement(ComboField, { ...props, label: "" }))), FIELD, "draw the <label> only when the label has words");

  /* A FIELD, MOUNTED. */
  const container = document.getElementById("root")!;
  const root = createRoot(container);
  let picked = "";
  await act(async () => { root.render(React.createElement(ComboField, { ...props, onChange: (v: string) => { picked = v; } })); });
  const field = container.querySelector("input")!;
  await act(async () => { field.focus(); });
  check(`on focus the label stays and is selected whole (value "${field.value}", selected ${field.selectionStart} to ${field.selectionEnd})`, field.value === "United Kingdom" && field.selectionStart === 0 && field.selectionEnd === "United Kingdom".length, FIELD, "keep the picked label as the value on focus and select it (setSelectionRange), so typing replaces it and a tap never blanks it");
  const rows = () => [...container.querySelectorAll('[role="option"]')];
  check(`focus opens the list, every row 44px (py-3 and a 20px line) (${rows().length} rows)`, rows().length === 3 && rows().every((r) => ["py-3", "leading-5", "text-sm"].every((c) => r.classList.contains(c))), FIELD);
  await act(async () => { field.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })); });
  const first = rows()[0];
  check("the highlighted row is the soft fill with an ink bar, named to a screen reader", !!first && first.classList.contains("bg-[var(--c-soft)]") && first.classList.contains("border-[var(--c-ink)]") && first.getAttribute("aria-selected") === "true" && field.getAttribute("aria-activedescendant") === first.id, FIELD);
  check("a row's examples are the muted grey", (container.querySelector('[role="option"]:nth-child(3) span + span')?.className ?? "").includes("text-[var(--c-muted)]"), FIELD);
  const type = async (v: string) => {
    const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value")!.set!;
    await act(async () => { setter.call(field, v); field.dispatchEvent(new dom.window.Event("input", { bubbles: true })); });
  };
  await type("zz");
  const none = container.querySelector("[data-no-match]");
  const status = container.querySelector('[role="status"]');
  check(`a query that matches nothing says so in a row and to a screen reader ("${none?.textContent ?? ""}", status "${status?.textContent ?? ""}")`, none?.textContent === "No match for ‘zz’" && status?.textContent === "No match for ‘zz’" && !container.querySelector('[role="listbox"]') && field.getAttribute("aria-expanded") === "false", FIELD, "when the filter leaves nothing, draw one row \"No match for ‘x’\" and put the same words in the field's role=\"status\" region");
  await act(async () => { field.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
  check(`Escape gives the field its label back and clears the row and the region (value "${field.value}")`, field.value === "United Kingdom" && !container.querySelector("[data-no-match]") && (container.querySelector('[role="status"]')?.textContent ?? "x") === "", FIELD);
  await type("fra");
  await act(async () => { field.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Enter", bubbles: true })); });
  check(`Enter commits the top match of what was typed (picked "${picked}")`, picked === "FR", FIELD);
  await act(async () => { root.unmount(); });

  /* A FIELD IN A PARENT'S SHAPE, MOUNTED: its value follows each pick as the form's state does, every pick is logged, and the keys are
     cancelable events, so an Enter the field took for itself can be told from one left to submit the form. */
  async function mountField(start: string) {
    const box = document.createElement("div");
    document.body.appendChild(box);
    const r = createRoot(box);
    const log: string[] = [];
    const Parent = () => {
      const [v, setV] = React.useState(start);
      return React.createElement(ComboField, { ...props, value: v, onChange: (x: string) => { log.push(x); setV(x); } });
    };
    await act(async () => { r.render(React.createElement(Parent)); });
    const input = box.querySelector("input")!;
    const rowsOf = () => [...box.querySelectorAll('[role="option"]')];
    const press = async (name: string) => {
      const ev = new dom.window.KeyboardEvent("keydown", { key: name, bubbles: true, cancelable: true });
      await act(async () => { input.dispatchEvent(ev); });
      return ev;
    };
    const typeIn = async (v: string) => {
      const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value")!.set!;
      await act(async () => { setter.call(input, v); input.dispatchEvent(new dom.window.Event("input", { bubbles: true })); });
    };
    return { box, input, log, rowsOf, press, typeIn, unmount: async () => { await act(async () => { r.unmount(); }); box.remove(); } };
  }

  /* ENTER ON A HIGHLIGHTED ROW (the Task 2 review's Important finding). The arrow keys alone reach a row, with nothing typed; the Enter
     branch stopped the browser's default for it and then asked the top-match commit, which gives up on an empty query: nothing was
     picked and the Enter was lost. The keys now choose the row that is lit, whatever is typed, and an Enter over "No match" stays in
     the field, so the form never sends the previous pick for words the visitor typed. */
  const ENTER_REMEDY = "in src/components/ComboField.tsx onKey, Enter commits filtered[focusIdx] whatever the query (the arrow keys alone reach a row), commits the top match when a query is typed with no row lit, keeps the visitor in the field over \"No match\", and leaves every other Enter to the form";
  const keys = await mountField("GB");
  await act(async () => { keys.input.focus(); });
  await keys.press("ArrowDown");
  await keys.press("ArrowDown");
  const lit = keys.rowsOf()[1];
  const litSecond = !!lit && lit.getAttribute("aria-selected") === "true" && keys.input.getAttribute("aria-activedescendant") === lit.id;
  const enterOnSecond = await keys.press("Enter");
  check(`ArrowDown, ArrowDown, Enter with nothing typed picks the second row, France, and closes the list (second row lit ${litSecond}, picked [${keys.log.join(",")}], Enter kept by the field ${enterOnSecond.defaultPrevented}, field reads "${keys.input.value}", ${keys.rowsOf().length} rows left, expanded ${keys.input.getAttribute("aria-expanded")})`, litSecond && keys.log.join() === "FR" && enterOnSecond.defaultPrevented && keys.input.value === "France" && keys.rowsOf().length === 0 && keys.input.getAttribute("aria-expanded") === "false", FIELD, ENTER_REMEDY);
  keys.log.length = 0;
  await keys.typeIn("a");
  await keys.press("ArrowDown");
  const enterOnTop = await keys.press("Enter");
  check(`ArrowDown, Enter with "a" typed picks the highlighted row (picked [${keys.log.join(",")}], Enter kept by the field ${enterOnTop.defaultPrevented}, field reads "${keys.input.value}")`, keys.log.join() === "FR" && enterOnTop.defaultPrevented && keys.input.value === "France" && keys.rowsOf().length === 0, FIELD, ENTER_REMEDY);
  keys.log.length = 0;
  await keys.typeIn("a");
  await keys.press("ArrowDown");
  await keys.press("ArrowDown");
  const enterBelowTop = await keys.press("Enter");
  check(`ArrowDown, ArrowDown, Enter with "a" typed picks the lit row, Spain, not the top match (picked [${keys.log.join(",")}], Enter kept by the field ${enterBelowTop.defaultPrevented}, field reads "${keys.input.value}")`, keys.log.join() === "ES" && enterBelowTop.defaultPrevented && keys.input.value === "Spain" && keys.rowsOf().length === 0, FIELD, ENTER_REMEDY);
  keys.log.length = 0;
  await keys.typeIn("zz");
  const enterOnNone = await keys.press("Enter");
  check(`Enter over "No match" keeps the visitor in the field: nothing is picked, the Enter does not submit the previous pick, the words and the row stay, focus stays (picked [${keys.log.join(",")}], Enter kept by the field ${enterOnNone.defaultPrevented}, field reads "${keys.input.value}", row "${keys.box.querySelector("[data-no-match]")?.textContent ?? ""}", focus ${document.activeElement === keys.input})`, keys.log.length === 0 && enterOnNone.defaultPrevented && keys.input.value === "zz" && keys.box.querySelector("[data-no-match]")?.textContent === "No match for ‘zz’" && document.activeElement === keys.input, FIELD, ENTER_REMEDY);
  await keys.press("Escape");
  const enterAtRest = await keys.press("Enter");
  check(`Enter with nothing typed and no row lit is left to the form's own submit (picked [${keys.log.join(",")}], Enter kept by the field ${enterAtRest.defaultPrevented})`, keys.log.length === 0 && !enterAtRest.defaultPrevented, FIELD, ENTER_REMEDY);
  /* A row lit on the way past is not lit at the next visit: the Enter chooses the lit row, so a stale one would be chosen unseen. */
  await keys.press("ArrowDown");
  await keys.press("ArrowDown");
  await act(async () => { keys.input.blur(); });
  await act(async () => { keys.input.focus(); });
  const litAfterVisit = keys.rowsOf().filter((r) => r.getAttribute("aria-selected") === "true").length;
  const enterAfterVisit = await keys.press("Enter");
  check(`a row lit before the field was left is not lit when it is entered again, so that Enter is the form's (rows lit ${litAfterVisit}, picked [${keys.log.join(",")}], Enter kept by the field ${enterAfterVisit.defaultPrevented})`, litAfterVisit === 0 && keys.log.length === 0 && !enterAfterVisit.defaultPrevented, FIELD, "reset the highlight when the field is left without a pick (the blur path in src/components/ComboField.tsx), because Enter chooses the lit row");
  await keys.unmount();

  /* THE FORM, FROM ITS SOURCE (comments stripped). */
  const code = stripCommentLines(readFileSync(FORM, "utf8").split("\n")).join("\n");
  check("the form imports no list statically: not the taxonomy, the cascade, the destination, the picker, the regions or the city tables", !/^import (?!type\b)[^\n]*from "@\/lib\/(taxonomy|regions\/[^"]*|cities\/[^"]*|home\/(search_cascade|destination|picker))";/m.test(code), FORM, "import those modules as types only; the lists come with import(\"@/lib/home/picker\") on first use");
  check("its lists load with import() when a pointer enters the form or focus lands in it", /loading\.current = import\("@\/lib\/home\/picker"\)\.then\(/.test(code) && /onPointerEnter=\{loadLists\}/.test(code) && /onFocus=\{loadLists\}/.test(code), FORM);
  check("a press before the lists load is the browser's own submit to /api/go", /if \(!lists\) return;\s*e\.preventDefault\(\);/.test(code) && /action="\/api\/go"/.test(code), FORM);
  check("any failure says so in the card, never a trip to /random", !/\/random/.test(code) && /role="alert"/.test(code), FORM, "show an inline role=\"alert\" message on a failed load or submit instead of sending the visitor to /random");
  check("\"Loading…\" with the ellipsis character", code.includes("Loading…") && !code.includes("Loading..."), FORM);
  check("the card is the spine's, kept on the band", code.includes('data-keep-card=""') && code.includes('className="spine-card relative rounded-xl border border-[var(--c-line-strong)] p-6"'), FORM);
  const button = /<button[\s\S]*?className="([^"]*)"/.exec(code)?.[1] ?? "";
  check(`the one action is solid ink, white 16px semibold on one line, 48px, the 12px corner, ink2 on hover, full width on a phone (read: ${button})`, ["bg-[var(--c-ink)]", "text-white", "text-base", "font-semibold", "whitespace-nowrap", "h-12", "rounded-xl", "hover:bg-[var(--c-ink2)]", "w-full", "md:w-auto", "transition-colors"].every((c) => button.split(" ").includes(c)), FORM);
  check("from 1024 the action is the row's fourth column at its own width, its foot on the fields' foot; from 768 under the fields at the right, the line beside it", code.includes("lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]") && code.includes('className="flex flex-col gap-3 md:col-span-3 md:flex-row-reverse md:items-center md:justify-between md:gap-6 lg:contents"') && code.includes('className="lg:col-start-4 lg:row-start-1 lg:self-end"') && /<p data-try="" className="[^"]*lg:col-span-4 lg:row-start-2"/.test(code), FORM);
  check("the footer strip and its divider are gone, and no brown, terracotta or warm paper class is left", !/rounded-b-2xl|border-t border-paper|\b(?:atlas|cocoa|paper)-\d/.test(code), FORM);
  check("the examples' line stands under the row at 14px in ink2, \"Or try\", its links underlined in the strong line and ink on hover", /<p data-try="" className="text-sm leading-5 text-\[var\(--c-ink2\)\][^"]*">\s*Or try\{" "\}/.test(code) && /className="underline decoration-\[var\(--c-line-strong\)\] underline-offset-2 transition-colors hover:text-\[var\(--c-ink\)\] hover:decoration-\[var\(--c-ink\)\]"/.test(code), FORM);

  /* THE SEED: THE FIRST PAINT, THE LISTS' OWN LABELS. */
  const seed = P.homePickerSeed();
  check(`the seed paints the form's own case (${seed.country.label}, ${seed.city.label}, ${seed.business.label})`, JSON.stringify([seed.country, seed.city, seed.business]) === JSON.stringify([{ value: "GB", label: "United Kingdom" }, { value: "london", label: "London" }, { value: "restaurants", label: "Restaurants" }]), PICKER);
  const label = (list: Array<{ value: string; label: string }>, value: string) => list.find((o) => o.value === value)?.label;
  check("each seeded label is its list's own", label(P.countryOptions(), seed.country.value) === seed.country.label && label(P.cityOptions(seed.country.value), seed.city.value) === seed.city.label && label(P.businessOptions({ revealMixed: false, revealCorp: false }), seed.business.value) === seed.business.label, PICKER);
  check(`the seed's no-script fields are the lists' own, and land where the scripted form does (${JSON.stringify(seed.hidden)})`, JSON.stringify(seed.hidden) === JSON.stringify(P.hiddenFields(seed.country.value, seed.city.value, seed.business.value)) && JSON.stringify(seed.hidden) === JSON.stringify({ country: "gb", region: "", subdivision: "london", industry: "restaurants" }) && P.homeDestination({ country: seed.hidden.country, city: seed.hidden.subdivision, trade: seed.hidden.industry }) === "/gb/london/restaurants", PICKER);
  check("the seed's examples are the destination's links, in London", JSON.stringify(seed.tries) === JSON.stringify(P.homeTryLinks()) && seed.tryCity === "London", PICKER);
  check(`the loaded lists are whole (${P.countryOptions().length} countries, ${P.cityOptions("GB").length - 1} UK cities, ${P.businessOptions({}).length} businesses)`, P.countryOptions().length > 100 && P.cityOptions("GB").length === 8 && P.businessOptions({}).length > 100, PICKER);

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("home/picker: all pass");
  process.exit(0);
}

main().catch((e) => {
  console.error("x home-picker crashed:", e);
  process.exit(1);
});
