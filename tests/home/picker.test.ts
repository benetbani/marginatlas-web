/**
 * THE HOME PICKER IN THE SPINE'S TOKENS (plan docs/superpowers/plans/2026-10-10-home-reform, Task 2; the critique's P0.4, P1.2, P1.3,
 * P1.14 and P2.9; the ship audit's 1b.1 to 1b.5 and 3.2). A field: its label in sentence case at 14px, weight 500, ink2, no star and
 * aria-required in its place; 48px tall, the card's 12px corner, the control token's edge, 16px type under 768, an ink ring whenever
 * focus is inside; on focus its label kept and selected; a row and a polite live region that say "No match for 'x'"; 44px rows, the
 * soft fill and an ink bar on the highlighted one, the examples muted. The form: the spine's card, kept on the band; one solid ink
 * action; the examples' line in ink2 under the row; a failure said in the card; "Loading…" with its ellipsis; no static import of
 * the taxonomy, the cascade, the destination, the regions or the city tables, its lists loaded with import() on first use, and its
 * first paint from the server's seed, whose labels are the lists' own.
 * ComboField is rendered on the server and mounted in jsdom, and steered with the keys (the Task 2 fix rounds: Enter chooses the lit
 * row whatever is typed, and only while its list is open, and keeps the visitor in the field over "No match" or "Loading…"; ArrowUp
 * opens a shut list as ArrowDown does; leaving the field closes its list; a press outside closes it and drops the highlight with it,
 * so a reopened list has no row lit; a field told its lists are coming draws one "Loading…" row). NavigatorForm is mounted inside the app router's context, the module cache the instrument for its lazy load (no list module
 * before a pointer, a focus or a key) and a submit event dispatched at it the instrument for its two submits (the browser's own
 * before the lists are in, the page's own after); its source is read here too, comments stripped, and its markup in the home's
 * render (tests/trust/home_shape.test.ts, the hero's checks). The field's sister forms are held to its language (fix round F2, item
 * P2.5): /compare's Region select and /you's three labels, select and revenue input read its label class and its field's tokens.
 * Run: npx tsx tests/home/picker.test.ts
 */
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";
/* A type only: it loads nothing, which the lazy-load proof below depends on. */
import type { PickerSeed } from "../../src/lib/home/picker";

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
  const { createRoot, hydrateRoot } = await import("react-dom/client");
  const { renderToStaticMarkup, renderToString } = await import("react-dom/server");
  const { ComboField } = await import("../../src/components/ComboField");
  /* The picker module is imported further down, where the seed is read: the lazy-load proof needs the module cache clean of the lists. */
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
  async function mountField(start: string, loadingAtStart = false) {
    const box = document.createElement("div");
    document.body.appendChild(box);
    const r = createRoot(box);
    const log: string[] = [];
    let setWaiting: (b: boolean) => void = () => {};
    const Parent = () => {
      const [v, setV] = React.useState(start);
      const [loading, setLoading] = React.useState(loadingAtStart);
      setWaiting = setLoading;
      return React.createElement(ComboField, { ...props, value: v, loading, onChange: (x: string) => { log.push(x); setV(x); } });
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
    const setLoading = async (b: boolean) => { await act(async () => { setWaiting(b); }); };
    return { box, input, log, rowsOf, press, typeIn, setLoading, unmount: async () => { await act(async () => { r.unmount(); }); box.remove(); } };
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

  /* ARROWUP, AND A LIST THAT IS SHUT (the re-review's Important finding). ArrowUp lit the first row without opening the list, so with a
     value picked, Escape, ArrowUp and Enter changed the field to the list's first row while the list stayed shut: a silent wrong value
     (on the home, "United Kingdom" became Afghanistan). ArrowUp now opens a shut list as ArrowDown does, so the row it lights is one the
     visitor can see, and an Enter chooses a lit row only while the list is open, so a highlight left behind by a list that shut without
     the field being left (a press outside closes the list and the field keeps its focus) is never chosen unseen. These start on Spain,
     because the list's first row is the United Kingdom: a wrong pick of the first row has to change the value to show. */
  const UP_REMEDY = "in src/components/ComboField.tsx onKey, ArrowUp opens the list as ArrowDown does (setOpen(true)), and the Enter chooses filtered[focusIdx] only while the list is expanded (expanded && focusIdx >= 0), so a row the visitor cannot see is never chosen";
  type Mounted = Awaited<ReturnType<typeof mountField>>;
  const view = (f: Mounted) => ({
    rows: f.rowsOf().length,
    expanded: f.input.getAttribute("aria-expanded"),
    lit: f.rowsOf().map((r, i) => (r.getAttribute("aria-selected") === "true" ? i : -1)).filter((i) => i >= 0).join(","),
    named: f.rowsOf().findIndex((r) => r.id === f.input.getAttribute("aria-activedescendant")),
  });
  const show = (v: ReturnType<typeof view>) => `${v.rows} rows, expanded ${v.expanded}, lit [${v.lit}], named ${v.named}`;
  const upKey = await mountField("ES");
  await act(async () => { upKey.input.focus(); });
  await upKey.press("Escape");
  const shut = view(upKey);
  await upKey.press("ArrowDown");
  const downOpens = view(upKey);
  await upKey.press("Escape");
  const upWasEscaped = view(upKey);
  const upEvent = await upKey.press("ArrowUp");
  const upOpens = view(upKey);
  check(`Escape, then ArrowUp opens the list as ArrowDown does, the first row lit and named to a screen reader, and chooses nothing yet (shut: ${show(shut)}; after Escape again: ${show(upWasEscaped)}; ArrowDown: ${show(downOpens)}; ArrowUp: ${show(upOpens)}; the key kept by the field ${upEvent.defaultPrevented}; picked [${upKey.log.join(",")}])`, shut.rows === 0 && shut.expanded === "false" && upWasEscaped.rows === 0 && downOpens.rows === 3 && downOpens.lit === "0" && upOpens.rows === 3 && upOpens.expanded === "true" && upOpens.lit === "0" && upOpens.named === 0 && JSON.stringify(upOpens) === JSON.stringify(downOpens) && upEvent.defaultPrevented && upKey.log.length === 0, FIELD, UP_REMEDY);
  const enterAfterUp = await upKey.press("Enter");
  check(`Escape, ArrowUp, Enter chooses the first row because the visitor can see it lit: the list was open when the Enter came (${upOpens.rows} rows), the row is chosen and the list closes (picked [${upKey.log.join(",")}], Enter kept by the field ${enterAfterUp.defaultPrevented}, field reads "${upKey.input.value}", ${upKey.rowsOf().length} rows left, expanded ${upKey.input.getAttribute("aria-expanded")})`, upOpens.rows === 3 && upKey.log.join() === "GB" && enterAfterUp.defaultPrevented && upKey.input.value === "United Kingdom" && upKey.rowsOf().length === 0 && upKey.input.getAttribute("aria-expanded") === "false", FIELD, UP_REMEDY);
  await upKey.unmount();
  /* A highlight a shut list was left with. A press outside closes the list and drops the typed words but not the lit row, and a press that
     moves no focus (an element that cancels its own mousedown) leaves the field focused: the next Enter would have chosen that row, shut. */
  const left = await mountField("GB");
  await act(async () => { left.input.focus(); });
  await left.press("ArrowDown");
  await left.press("ArrowDown");
  const litFirst = view(left);
  await act(async () => { document.body.dispatchEvent(new dom.window.MouseEvent("mousedown", { bubbles: true })); });
  const shutByPress = view(left);
  const focusKept = document.activeElement === left.input;
  const enterOnShut = await left.press("Enter");
  check(`a list shut by a press outside, which leaves the field its focus and a row lit, is not chosen from: that Enter is the form's (before the press: ${show(litFirst)}; after: ${show(shutByPress)}, focus kept ${focusKept}; picked [${left.log.join(",")}], Enter kept by the field ${enterOnShut.defaultPrevented}, field reads "${left.input.value}")`, litFirst.lit === "1" && shutByPress.rows === 0 && shutByPress.expanded === "false" && focusKept && left.log.length === 0 && !enterOnShut.defaultPrevented && left.input.value === "United Kingdom", FIELD, UP_REMEDY);
  /* THE HIGHLIGHT DOES NOT OUTLIVE THE LIST (the closing cleanup of plan 2026-10-10, the home reformed to ship, item 15; the Task 2 second
     re-review). The press outside shut the list but left the row lit (focusIdx), and the field kept its focus: the visitor opens the list
     again (a click on the field) and the row they had lit before is lit now, which an Enter then chooses unseen, and the arrow keys walk
     on from it instead of from the top. The press outside drops the highlight with the typed words. */
  const DOC_REMEDY = "in src/components/ComboField.tsx onDoc, a press outside closes the list, drops the typed words and the highlight (setFocusIdx(-1)), so a reopened list has no row lit and an Enter over it is the form's";
  await act(async () => { left.input.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
  const reopened = view(left);
  const enterAfterReopen = await left.press("Enter");
  check(`a list reopened after a press outside has no row lit, so that Enter is the form's and chooses nothing (before the press: ${show(litFirst)}; reopened: ${show(reopened)}; picked [${left.log.join(",")}], Enter kept by the field ${enterAfterReopen.defaultPrevented}, field reads "${left.input.value}")`, reopened.rows === 3 && reopened.expanded === "true" && reopened.lit === "" && reopened.named === -1 && left.log.length === 0 && !enterAfterReopen.defaultPrevented && left.input.value === "United Kingdom", FIELD, DOC_REMEDY);
  await left.unmount();
  /* The same press, and the arrow keys alone after the reopen (no Enter in between to clear the row): the walk starts at the top. */
  const walk = await mountField("GB");
  await act(async () => { walk.input.focus(); });
  await walk.press("ArrowDown");
  await walk.press("ArrowDown");
  await act(async () => { document.body.dispatchEvent(new dom.window.MouseEvent("mousedown", { bubbles: true })); });
  await act(async () => { walk.input.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
  await walk.press("ArrowDown");
  const walkedOn = view(walk);
  check(`the arrow keys walk a reopened list from its top, not on from the row lit before the press (after ArrowDown, ArrowDown, a press outside, a click and ArrowDown: ${show(walkedOn)})`, walkedOn.rows === 3 && walkedOn.lit === "0" && walkedOn.named === 0, FIELD, DOC_REMEDY);
  await walk.unmount();
  /* The key's other half, unchanged: in an open list ArrowUp moves the highlight up a row, stops at the first, and the Enter chooses the row it stands on. */
  const climb = await mountField("GB");
  await act(async () => { climb.input.focus(); });
  await climb.press("ArrowDown");
  await climb.press("ArrowDown");
  await climb.press("ArrowDown");
  const onThird = view(climb);
  await climb.press("ArrowUp");
  const onSecond = view(climb);
  await climb.press("ArrowUp");
  await climb.press("ArrowUp");
  await climb.press("ArrowUp");
  const onFirst = view(climb);
  await climb.press("ArrowDown");
  const enterAfterClimb = await climb.press("Enter");
  check(`in an open list ArrowUp moves the highlight up a row and stops at the first (rows lit: third [${onThird.lit}], then [${onSecond.lit}], then after three more [${onFirst.lit}], list still open ${onFirst.rows} rows), and the Enter chooses the row it stands on (picked [${climb.log.join(",")}], Enter kept by the field ${enterAfterClimb.defaultPrevented})`, onThird.lit === "2" && onSecond.lit === "1" && onFirst.lit === "0" && onFirst.rows === 3 && climb.log.join() === "FR" && enterAfterClimb.defaultPrevented, FIELD, UP_REMEDY);
  await climb.unmount();

  /* LEAVING THE FIELD (the review's missing test; the same field serves /compare, /you and the activity pages). Blur closes the list and
     gives the field its picked label back; words that match nothing are dropped with it; words that match pick the top match, which is
     the Berlin-nightclubs fix the field carries (a typed value always lands somewhere usable). */
  const blurs = await mountField("GB");
  await act(async () => { blurs.input.focus(); });
  const openRows = blurs.rowsOf().length;
  await act(async () => { blurs.input.blur(); });
  check(`leaving the field closes its list and the field reads the picked label (${openRows} rows open, ${blurs.rowsOf().length} after, expanded ${blurs.input.getAttribute("aria-expanded")}, reads "${blurs.input.value}", picked [${blurs.log.join(",")}])`, openRows === 3 && blurs.rowsOf().length === 0 && blurs.input.getAttribute("aria-expanded") === "false" && blurs.input.value === "United Kingdom" && blurs.log.length === 0, FIELD, "close the list on blur and give the field the picked label back (onBlur in src/components/ComboField.tsx)");
  await act(async () => { blurs.input.focus(); });
  await blurs.typeIn("zz");
  const rowShown = !!blurs.box.querySelector("[data-no-match]");
  await act(async () => { blurs.input.blur(); });
  const rowLeft = blurs.box.querySelector("[data-no-match]")?.textContent ?? "";
  const regionLeft = blurs.box.querySelector('[role="status"]')?.textContent ?? "";
  check(`leaving the field over words that match nothing drops them: the row and the live region clear and the field reads the picked label (row shown ${rowShown}, then "${rowLeft}", region "${regionLeft}", reads "${blurs.input.value}", picked [${blurs.log.join(",")}])`, rowShown && rowLeft === "" && regionLeft === "" && blurs.input.value === "United Kingdom" && blurs.log.length === 0, FIELD, "on blur drop words that match nothing and close the list (onBlur in src/components/ComboField.tsx)");
  await act(async () => { blurs.input.focus(); });
  await blurs.typeIn("fra");
  await act(async () => { blurs.input.blur(); });
  check(`leaving the field over words that match picks the top match (picked [${blurs.log.join(",")}], reads "${blurs.input.value}", ${blurs.rowsOf().length} rows)`, blurs.log.join() === "FR" && blurs.input.value === "France" && blurs.rowsOf().length === 0, FIELD, "commit the top match on blur (commitTopMatch in src/components/ComboField.tsx)");
  await blurs.unmount();

  /* THE LISTS ARE STILL COMING (the review: typing before the home picker's lists arrive filtered the one seeded option, and "No match"
     flashed). A field told it is loading shows one row, "Loading…", and no options, whatever is typed; keeps typed words in the field on
     Enter (the form would otherwise send the previous pick); and answers the words once the lists are in. */
  const wait = await mountField("GB", true);
  await act(async () => { wait.input.focus(); });
  const waitNote = () => wait.box.querySelector("[data-loading]")?.textContent ?? "";
  const waitRegion = () => wait.box.querySelector('[role="status"]')?.textContent ?? "";
  const LOADING_REMEDY = "pass loading to the fields until the lists are in (src/components/NavigatorForm.tsx) and let the field draw one \"Loading…\" row, with the same words in its role=\"status\" region, in place of a list or \"No match\", keeping typed words in the field on Enter (src/components/ComboField.tsx)";
  check(`while the lists are coming an open field shows one row, "Loading…", and no options (row "${waitNote()}", ${wait.rowsOf().length} options, expanded ${wait.input.getAttribute("aria-expanded")}, region "${waitRegion()}")`, waitNote() === "Loading…" && wait.rowsOf().length === 0 && wait.input.getAttribute("aria-expanded") === "false" && waitRegion() === "Loading…", FIELD, LOADING_REMEDY);
  await wait.typeIn("fra");
  check(`words typed before the lists arrive get "Loading…" and never "No match" (row "${waitNote()}", no-match row ${!!wait.box.querySelector("[data-no-match]")}, region "${waitRegion()}")`, waitNote() === "Loading…" && !wait.box.querySelector("[data-no-match]") && waitRegion() === "Loading…", FIELD, LOADING_REMEDY);
  const enterWhileWaiting = await wait.press("Enter");
  check(`Enter with words typed over "Loading…" keeps the visitor in the field, so the form does not send the previous pick (kept by the field ${enterWhileWaiting.defaultPrevented}, picked [${wait.log.join(",")}], reads "${wait.input.value}")`, enterWhileWaiting.defaultPrevented && wait.log.length === 0 && wait.input.value === "fra", FIELD, LOADING_REMEDY);
  await wait.setLoading(false);
  const answered = wait.rowsOf().map((r) => r.textContent).join("|");
  check(`when the lists arrive the typed words are answered: France is the one row and "Loading…" is gone (rows [${answered}], row "${waitNote()}")`, answered === "France" && waitNote() === "", FIELD, LOADING_REMEDY);
  await wait.setLoading(true);
  await act(async () => { wait.input.blur(); });
  await act(async () => { wait.input.focus(); });
  const noteAtRest = waitNote();
  const enterWaitingAtRest = await wait.press("Enter");
  check(`Enter with nothing typed over "Loading…" is left to the form's own submit (row "${noteAtRest}", kept by the field ${enterWaitingAtRest.defaultPrevented})`, noteAtRest === "Loading…" && !enterWaitingAtRest.defaultPrevented, FIELD, LOADING_REMEDY);
  await wait.unmount();

  /* THE FORM, FROM ITS SOURCE (comments stripped). */
  const code = stripCommentLines(readFileSync(FORM, "utf8").split("\n")).join("\n");
  check("the form imports no list statically: not the taxonomy, the cascade, the destination, the picker, the regions or the city tables", !/^import (?!type\b)[^\n]*from "@\/lib\/(taxonomy|regions\/[^"]*|cities\/[^"]*|home\/(search_cascade|destination|picker))";/m.test(code), FORM, "import those modules as types only; the lists come with import(\"@/lib/home/picker\") on first use");
  check("its lists load with import() when a pointer enters the form, focus lands in it or a key is pressed in it", /loading\.current = import\("@\/lib\/home\/picker"\)\.then\(/.test(code) && /onPointerEnter=\{loadLists\}/.test(code) && /onFocus=\{loadLists\}/.test(code) && /onKeyDown=\{loadLists\}/.test(code), FORM);
  check("each of the three fields is told it is loading until the lists are in", (code.match(/loading=\{loadingLists\}/g) ?? []).length === 3 && /const loadingLists = !lists && !failed;/.test(code), FORM, LOADING_REMEDY);
  check("a press before the lists load is the browser's own submit to /api/go", /if \(!lists\) return;\s*e\.preventDefault\(\);/.test(code) && /action="\/api\/go"/.test(code), FORM);
  check("any failure says so in the card, never a trip to /random", !/\/random/.test(code) && /role="alert"/.test(code), FORM, "show an inline role=\"alert\" message on a failed load or submit instead of sending the visitor to /random");
  check("\"Loading…\" with the ellipsis character", code.includes("Loading…") && !code.includes("Loading..."), FORM);
  check("the card is the spine's, kept on the band", code.includes('data-keep-card=""') && code.includes('className="spine-card relative rounded-xl border border-[var(--c-line-strong)] p-5 md:p-6"'), FORM);
  const button = /<button[\s\S]*?className="([^"]*)"/.exec(code)?.[1] ?? "";
  check(`the one action is solid ink, white 16px semibold on one line, 48px, the 12px corner, ink2 on hover, full width on a phone (read: ${button})`, ["bg-[var(--c-ink)]", "text-white", "text-base", "font-semibold", "whitespace-nowrap", "h-12", "rounded-xl", "hover:bg-[var(--c-ink2)]", "w-full", "md:w-auto", "transition-colors"].every((c) => button.split(" ").includes(c)), FORM);
  check("from 1024 the action is the row's fourth column at its own width, its foot on the fields' foot; from 768 under the fields at the right, the line beside it", code.includes("lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]") && code.includes('className="flex flex-col gap-3 md:col-span-3 md:flex-row-reverse md:items-center md:justify-between md:gap-6 lg:contents"') && code.includes('className="lg:col-start-4 lg:row-start-1 lg:self-end"') && /<p data-try="" className="[^"]*lg:col-span-4 lg:row-start-2"/.test(code), FORM);
  check("the footer strip and its divider are gone, and no brown, terracotta or warm paper class is left", !/rounded-b-2xl|border-t border-paper|\b(?:atlas|cocoa|paper)-\d/.test(code), FORM);
  check("the examples' line stands under the row at 14px in ink2, \"Or try\", its links underlined in the strong line and ink on hover", /<p data-try="" className="text-sm leading-5 text-\[var\(--c-ink2\)\][^"]*">\s*Or try\{" "\}/.test(code) && /className="underline decoration-\[var\(--c-line-strong\)\] underline-offset-2 transition-colors hover:text-\[var\(--c-ink\)\] hover:decoration-\[var\(--c-ink\)\]"/.test(code), FORM);
  /* NO WORD LEFT ALONE ON THE EXAMPLES' LINE (critique pass 4, fix round F2, item P2.2): at 320 the line broke "... or cafés in / London.", its
     city alone on the second line; the browser balances the last line when the paragraph asks (text-pretty), as the example's lines and the band
     do. BLIND SPOT: this reads the class; the last line's word count at seven widths is the browser's (f2_p22_probe.mjs). */
  check("the examples' line asks for a balanced last line (text-pretty), so it cannot end on a lone city", /<p data-try="" className="[^"]*\btext-pretty\b[^"]*">\s*Or try\{" "\}/.test(code), FORM, "add text-pretty to the <p data-try=\"\"> of src/components/NavigatorForm.tsx: at 320 it broke \"or cafés in / London.\"");

  /* THE SISTER FORMS SPEAK THE PICKER'S LANGUAGE (critique pass 4, fix round F2, item P2.5). The reform rebuilt the shared field and so split /compare
     and /you into two control systems one row apart: "Country" and "Activity" in the picker's label (14 medium in ink2) over a 48px field on the control
     token, then "REGION" in 11px tracked capitals in a brown over a native select on a 1.28:1 parchment edge with 14px type (iOS Safari zooms the page
     into it) and a focus ring of its own that replaced the site's ink floor; /you did the same with its three labels, its select and its revenue input.
     The labels now take the picker's own class, read from the rendered field and not typed here, and the select and the input take its field: 48px,
     the card's 12px corner, the control token's 3:1 edge, 16px under 768 and 14 from it, an ink hover, NO focus style of their own (the floor in
     globals.css draws the 2px ink ring), no capitals and no brown. BLIND SPOT: this reads class names in the two files' source; the border's contrast
     on white, the 16px under 768 and the ring on a Tab are the browser's (f2_p25_probe.mjs). */
  const COMPARE = "src/app/(site)/compare/CompareClient.tsx", YOU = "src/app/(site)/you/CompareToMeClient.tsx";
  const readCode = (f: string) => stripCommentLines(readFileSync(f, "utf8").split("\n")).join("\n");
  const compareSrc = readCode(COMPARE), youSrc = readCode(YOU);
  const pickerLabel = /<label for="country" class="([^"]*)"/.exec(html)?.[1] ?? "";
  const compareLabel = /<label\s+htmlFor=\{`region-\$\{idx\}`\}\s+className="([^"]*)"/.exec(compareSrc)?.[1] ?? "";
  const youLabels = [...youSrc.matchAll(/<label htmlFor="(cm-(?:industry|region|revenue))" className="([^"]*)"/g)].map((m) => ({ id: m[1], cls: m[2] }));
  check(`/compare's Region label and /you's three labels are the picker's own, "${pickerLabel}" (Region ${compareLabel === pickerLabel ? "is" : "is not"}, ${youLabels.filter((l) => l.cls === pickerLabel).length} of ${youLabels.length} of /you's)`, pickerLabel.length > 20 && compareLabel === pickerLabel && youLabels.length === 3 && youLabels.every((l) => l.cls === pickerLabel), COMPARE, "give the sister forms' labels the picker's own class, the one ComboField draws (mb-2 block text-sm font-medium text-[var(--c-ink2)]): /compare's Region and /you's Activity, Region (US) and Your yearly revenue");
  const classAfter = (src: string, tag: "select" | "input") => /\bclassName="([^"]*)"/.exec(src.slice(src.indexOf(`<${tag}`), src.indexOf(`<${tag}`) + 700))?.[1] ?? "";
  const sisters: Array<[string, string]> = [["/compare's Region select", classAfter(compareSrc, "select")], ["/you's Region select", classAfter(youSrc, "select")], ["/you's revenue input", classAfter(youSrc, "input")]];
  const FIELD_TOKENS = ["h-12", "w-full", "rounded-xl", "border", "border-[var(--control-line)]", "bg-white", "px-4", "text-base", "md:text-sm", "text-[var(--c-ink)]", "hover:border-[var(--c-ink2)]"];
  const lacks = sisters.flatMap(([who, cls]) => FIELD_TOKENS.filter((t) => !cls.split(" ").includes(t)).map((t) => `${who} lacks ${t}`));
  const foreign = sisters.flatMap(([who, cls]) => cls.split(" ").filter((t) => /^(?:focus|focus-visible|focus-within):|parchment|paper-|atlas-|cocoa-|ink-\d|uppercase|tracking-/.test(t)).map((t) => `${who} has ${t}`));
  check(`the sister forms' select and input are the picker's field: 48px, the 12px corner, the control token's edge, 16px under 768, an ink hover, no focus style of their own and no brown or capitals (${[...lacks, ...foreign].join("; ") || "all three"})`, sisters.every(([, cls]) => cls.length > 0) && lacks.length === 0 && foreign.length === 0, COMPARE, "give /compare's Region select and /you's Region select and revenue input the picker's field: h-12 w-full rounded-xl border border-[var(--control-line)] bg-white px-4 text-base font-medium text-[var(--c-ink)] transition-colors hover:border-[var(--c-ink2)] md:text-sm, with no focus: or focus-visible: class of their own (the floor in globals.css draws the 2px ink ring)");

  /* THE FORM, MOUNTED IN THE APP ROUTER'S CONTEXT: WHAT THE PAGE LOADS, AND WHAT TYPING BEFORE IT ARRIVES DOES (the review: the source
     check above says what the file contains, not what the page fetches). The module cache is the instrument: it holds every module this
     process has loaded, so a list module in it before the first pointer, focus or key means the lists came with the form. BLIND SPOTS,
     stated: the cache cannot tell a module the browser would fetch from one a server rendered with, which is why the form is mounted
     here and not rendered; it sees the first load in a process only; and it says nothing of how long the import takes, so the
     "Loading…" state is read before the first await. */
  const { AppRouterContext } = await import("next/dist/shared/lib/app-router-context.shared-runtime");
  const { NavigatorForm } = await import("../../src/components/NavigatorForm");
  const LIST_MODULES = ["/src/lib/taxonomy", "/src/lib/regions/", "/src/lib/cities/", "/src/lib/home/search_cascade", "/src/lib/home/destination", "/src/lib/home/picker"];
  const isList = (k: string) => LIST_MODULES.some((m) => k.replace(/\\/g, "/").includes(m));
  const cached = () => Object.keys(require.cache).filter(isList).map((k) => k.replace(/\\/g, "/").replace(/^.*\/src\//, "src/"));
  const LAZY_REMEDY = "load the lists only with import(\"@/lib/home/picker\") from the form's loadLists, started by a pointer entering the form, focus landing in it or a key pressed in it (src/components/NavigatorForm.tsx), and keep every list module out of its static imports";
  const SEED: PickerSeed = { country: { value: "GB", label: "United Kingdom" }, city: { value: "london", label: "London" }, business: { value: "restaurants", label: "Restaurants" }, hidden: { country: "gb", region: "", subdivision: "london", industry: "restaurants" }, tries: [], tryCity: "London" };
  /* Every push through the router is logged: a submit the page took for itself is told from one it left to the browser by the push. */
  const pushed: string[] = [];
  const router = { push(path: string) { pushed.push(path); }, replace() {}, back() {}, forward() {}, refresh() {}, prefetch() {} };
  /* The type argument is named because the form's own signature has a default parameter, which createElement cannot infer from. */
  const tree = () => React.createElement(AppRouterContext.Provider, { value: router as any }, React.createElement<{ seed?: PickerSeed }>(NavigatorForm, { seed: SEED }));
  const mountForm = async () => {
    const box = document.createElement("div");
    document.body.appendChild(box);
    const r = createRoot(box);
    await act(async () => { r.render(tree()); });
    return { box, form: box.querySelector("form")!, country: box.querySelector<HTMLInputElement>("#country")!, unmount: async () => { await act(async () => { r.unmount(); }); box.remove(); } };
  };
  /* Wait, in React's own turns, until the page shows what the test is waiting for (3 s at the most), then one turn more. */
  const until = async (done: () => boolean) => {
    for (let i = 0; i < 300 && !done(); i++) await act(async () => { await new Promise((res) => setTimeout(res, 10)); });
    await act(async () => { await new Promise((res) => setTimeout(res, 10)); });
  };
  const listsIn = () => { const c = cached(); return c.includes("src/lib/home/picker.ts") && c.some((k) => k.startsWith("src/lib/taxonomy")); };

  const byPointer = await mountForm();
  const coldPointer = cached();
  check(`mounted, the form has loaded none of its lists: not the taxonomy, the cascade, the destination, the picker, the regions or the city tables (${coldPointer.length} in the module cache${coldPointer[0] ? `, e.g. ${coldPointer[0]}` : ""})`, coldPointer.length === 0, FORM, LAZY_REMEDY);
  /* A SUBMIT BEFORE THE LISTS ARE IN IS THE BROWSER'S OWN (the review's probe B; the source regex further down says what the handler
     holds, not what it does). A cancelable submit event is dispatched at the form as the browser fires one before it navigates: the form
     leaves it alone and pushes nothing, so the browser sends the four hidden fields, which hold the seed's case, to /api/go. */
  const SUBMIT_REMEDY = "in src/components/NavigatorForm.tsx onSubmit, return before preventDefault while the lists are not in (the browser then sends the hidden fields to /api/go), and once they are in, preventDefault and push lists.homeDestination(...) through the router";
  const nativeSubmit = new dom.window.Event("submit", { bubbles: true, cancelable: true });
  await act(async () => { byPointer.form.dispatchEvent(nativeSubmit); });
  const sent = [...new dom.window.FormData(byPointer.form).entries()].map(([k, v]) => `${k}=${v}`).join("&");
  check(`a submit before the lists are in is the browser's own: the form does not stop it and pushes nothing, and the browser sends ${byPointer.form.getAttribute("method")} ${byPointer.form.getAttribute("action")}?${sent} (default prevented ${nativeSubmit.defaultPrevented}, pushed [${pushed.join(",")}])`, !nativeSubmit.defaultPrevented && pushed.length === 0 && byPointer.form.getAttribute("action") === "/api/go" && byPointer.form.getAttribute("method") === "get" && sent === "country=gb&region=&subdivision=london&industry=restaurants", FORM, SUBMIT_REMEDY);
  await act(async () => { byPointer.form.dispatchEvent(new dom.window.PointerEvent("pointerover", { bubbles: true })); });
  await until(listsIn);
  check(`a pointer entering the form loads them (the picker and the taxonomy are in the module cache now: ${listsIn()}, ${cached().length} list modules)`, listsIn(), FORM, LAZY_REMEDY);
  await act(async () => { byPointer.country.focus(); });
  const countryRows = byPointer.box.querySelectorAll("#country-listbox [role=\"option\"]").length;
  check(`and the country field then lists every country (${countryRows} rows)`, countryRows > 100, FORM, LAZY_REMEDY);
  /* The same submit once the lists are in (the list of every country is the proof the form holds them) is the page's own: the form stops
     the browser's and pushes the destination of the case on screen through the router. */
  const scriptedSubmit = new dom.window.Event("submit", { bubbles: true, cancelable: true });
  await act(async () => { byPointer.form.dispatchEvent(scriptedSubmit); });
  check(`a submit once the lists are in is the page's own: the form stops the browser's and pushes the destination through the router (default prevented ${scriptedSubmit.defaultPrevented}, pushed [${pushed.join(",")}])`, scriptedSubmit.defaultPrevented && pushed.join() === "/gb/london/restaurants", FORM, SUBMIT_REMEDY);
  await byPointer.unmount();

  /* From here the lists are in the module system for good: a second import() is served from the loader's own map and does not touch
     the cache (BLIND SPOT: the cache sees the first load only), so the next two triggers are read in the page. A field says "Loading…"
     until its form has taken the lists in, and lists them after. */
  const byFocus = await mountForm();
  act(() => { byFocus.country.focus(); });
  const noteFocus = byFocus.box.querySelector("[data-loading]")?.textContent ?? "";
  await until(() => byFocus.box.querySelectorAll('[role="option"]').length > 1);
  const rowsFocus = byFocus.box.querySelectorAll('[role="option"]').length;
  check(`focus landing in the form loads them: the open field says "Loading…" first (row "${noteFocus}") and lists every country once they are in (${rowsFocus} rows)`, noteFocus === "Loading…" && rowsFocus > 100, FORM, LAZY_REMEDY);
  await byFocus.unmount();

  /* A field focused before the page hydrated heard no focus (the server's HTML takes input before React is there), so the first key is
     what must start the load, and the words typed in the meantime meet "Loading…" and not "No match". */
  const hosted = document.createElement("div");
  document.body.appendChild(hosted);
  hosted.innerHTML = renderToString(tree());
  const early = hosted.querySelector<HTMLInputElement>("#country")!;
  early.focus();
  let hydrated!: ReturnType<typeof hydrateRoot>;
  await act(async () => { hydrated = hydrateRoot(hosted, tree()); });
  const heard = !!hosted.querySelector("[data-loading]") || !!hosted.querySelector('[role="listbox"]');
  check(`a field focused before the page hydrated is heard by nothing: it holds focus and its list is shut (focus kept ${document.activeElement === early}, a list or "Loading…" drawn: ${heard})`, document.activeElement === early && !heard, FORM, LAZY_REMEDY);
  const keystroke = new dom.window.KeyboardEvent("keydown", { key: "f", bubbles: true, cancelable: true });
  const enterEarly = new dom.window.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
  /* One synchronous stretch, no await, so the import the key starts cannot have landed when the rows are read. */
  act(() => {
    early.dispatchEvent(keystroke);
    Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value")!.set!.call(early, "fra");
    early.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
  });
  const earlyNote = hosted.querySelector("[data-loading]")?.textContent ?? "";
  const earlyNoMatch = hosted.querySelector("[data-no-match]")?.textContent ?? "";
  const earlyOptions = hosted.querySelectorAll('[role="option"]').length;
  act(() => { early.dispatchEvent(enterEarly); });
  check(`typing before the lists arrive: the open list is one "Loading…" row and never "No match" (row "${earlyNote}", no-match row "${earlyNoMatch}", ${earlyOptions} options), and the Enter stays in the field (kept ${enterEarly.defaultPrevented})`, earlyNote === "Loading…" && earlyNoMatch === "" && earlyOptions === 0 && enterEarly.defaultPrevented, FORM, LOADING_REMEDY);
  await until(() => hosted.querySelectorAll('[role="option"]').length > 0);
  const answeredEarly = [...hosted.querySelectorAll('[role="option"]')].map((r) => r.textContent);
  check(`the first key started the load, and once the lists are in the typed words are answered (rows include France: ${answeredEarly.includes("France")}, "Loading…" row left: ${!!hosted.querySelector("[data-loading]")})`, answeredEarly.includes("France") && !hosted.querySelector("[data-loading]"), FORM, LAZY_REMEDY);
  await act(async () => { hydrated.unmount(); });
  hosted.remove();

  /* THE SEED: THE FIRST PAINT, THE LISTS' OWN LABELS. */
  const P = await import("../../src/lib/home/picker");
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
