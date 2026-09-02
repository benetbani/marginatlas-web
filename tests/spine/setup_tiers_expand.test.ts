/**
 * The expandable legal-form table actually expands (2026-08-30).
 *
 * WHY THIS EXISTS. The founder ordered the section expandable ("I've told you
 * multiple times"), and the harness's static renders CANNOT verify it: the
 * final-pages HTML ships without hydration, so a click in that artifact does
 * nothing whether the component is right or broken. A screenshot of the
 * collapsed state was taken and proved only the collapsed state. This test is
 * the other half: it mounts the real client component in jsdom, clicks a
 * tier, and asserts the right panel opens, carries the right prose, hides no
 * figure, and closes again on the second click.
 *
 * BLIND SPOT, stated: jsdom proves the React mechanism, not the pixels. The
 * expanded panel's LOOK is judged from the live page once the preview flag is
 * set; its BEHAVIOUR is proven here.
 *
 * ============ REPAIRED 2026-09-03, AND THE TEST WAS THE WRONG ONE ===========
 *
 * It failed at head with "the expanded panel does not restate the tier's own
 * figures", and that assertion had been wrong since `e30163b4` (B8), three
 * commits after this file was written in `53a735f8`. B8 DELETED the panel line
 * that restated the row's fee and filing time, deliberately and with a reason
 * recorded in the component, in the ledger and in the queue: the line repeated
 * three figures sitting forty pixels above it, which is the duplication B3 and
 * B7 had already been made to cut from their own cards. It put the meaning of
 * the paperwork LEVEL there instead, which is the one thing a dot count cannot
 * say. B8 changed the panel and did not change this file, so a stale assertion
 * held the whole prebuild chain red for eighteen runs.
 *
 * THE PANEL IS RIGHT AND THE PROOF WAS WRONG, and the reason is a ratified rule
 * rather than a preference. The founder's order is that a click shows MORE about
 * a category. The card's own K6 holds that every FIGURE is visible collapsed and
 * only prose lives behind the disclosure, which is rulebook 18: never hide a
 * graphic or a figure behind a disclosure, disclosures move text out of the
 * first view. A panel that restated the row's figures would be breaking that
 * rule, so restoring the old assertion would have meant breaking the page to
 * satisfy the test.
 *
 * WHAT THE OLD ASSERTION WAS REACHING FOR IS KEPT, BECAUSE A TEST WEAKENED
 * UNTIL IT ASSERTS NOTHING IS NOT COVERAGE. "Registers free" was the Sole
 * Trader row's own string, so it proved the open panel belongs to the CLICKED
 * row and not to another one. That property is still true, still worth
 * proving, and is now proved against content the panel actually carries: each
 * tier's paperwork level renders its own sentence, and the two fixture rows sit
 * at different levels on purpose.
 *
 * FOUR THINGS THIS NOW PROVES THAT THE OLD FILE DID NOT:
 *   1. ONLY the clicked row opens. Proved structurally, by counting each row's
 *      children, rather than by searching the whole card for a string.
 *   2. The panel carries the clicked row's OWN paperwork sentence and NOT its
 *      neighbour's, which is what "the tier's own figures" was really testing.
 *   3. NOTHING IS HIDDEN BEHIND THE DISCLOSURE (K6, rule 18): every figure the
 *      row draws is present while collapsed, and the open panel contains no
 *      digit at all. The panel's prose is deliberately digit-free, so this is
 *      an exact test and not an approximation of one.
 *   4. THE DUPLICATE TIER NAME, which is a live defect with eleven countries in
 *      it and had no test. Germany files a UG and a GmbH as LLC, Italy an
 *      S.r.l.s. and an S.r.l.; the state used to be keyed by tier NAME, so
 *      `open === t.tier` matched BOTH rows and clicking one opened the other as
 *      well. DE, IT, IN, GR, VN, PH, AR, CL, LT, LU and ZW all reach it. The
 *      fixture below is Germany's shape, and it fails against the keyed-by-name
 *      version.
 */
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", { pretendToBeVisual: true });
(globalThis as any).window = dom.window;
(globalThis as any).document = dom.window.document;
/* globalThis.navigator is getter-only on modern Node; defineProperty wins. */
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });

/* Fragments of the component's own copy, short enough to survive an edit to the
   sentence around them and distinct enough that no two can match each other.
   They are duplicated here rather than imported because EXPLAINERS and
   PAPERWORK are module-private, which is correct: a test that imports the
   string it asserts on proves only that the string equals itself. */
const SOLE_TRADER = "no wall between the owner";
const LLC = "liability stops at what the company owns";
const PAPERWORK_1 = "An online form in under an hour";
const PAPERWORK_2 = "Online in a day";
const PAPERWORK_3 = "Several steps, a registered office";
const PAPERWORK_4 = "A notary or a court";

async function main() {
  const React = (await import("react")).default;
  const { createRoot } = await import("react-dom/client");
  const { act } = await import("react");
  const { SetupTiers } = await import("../../src/components/spine/country/setup-tiers");

  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

  const fail = (msg: string) => {
    console.error("x setup_tiers_expand: " + msg);
    process.exit(1);
  };

  const container = dom.window.document.getElementById("root")!;
  const root = createRoot(container);

  /* A ROW IS THE SET'S DIRECT CHILD, and the panel is the row's SECOND child
     element when it is open. Counting children is what makes "only the clicked
     row opened" provable; searching the card's whole textContent cannot tell
     one open row from two. */
  const rows = () => [...container.querySelectorAll('[data-idea="I5"] > div')];
  const openCount = () => rows().filter((r) => r.children.length > 1).length;
  const panelOf = (i: number) => {
    const r = rows()[i];
    return r && r.children.length > 1 ? (r.children[1] as any).textContent || "" : null;
  };
  const click = async (i: number) => {
    const b = rows()[i].querySelector("button");
    if (!b) fail(`row ${i} has no button to click`);
    await act(async () => {
      b!.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
    });
  };

  /* ---------- FIXTURE 1, two different legal forms (the UK's shape) --------- */
  const tiers = [
    { tier: "Sole Trader", local_term: "Sole Trader", cost_usd: 0, days: 1, complexity_1_5: 1 },
    { tier: "LLC", local_term: "Private Limited Company (Ltd)", cost_usd: 15, days: 1, complexity_1_5: 2 },
  ];
  await act(async () => {
    root.render(React.createElement(SetupTiers, { tiers }));
  });

  if (rows().length !== 2) fail(`expected 2 tier rows, found ${rows().length}`);
  const buttons = [...container.querySelectorAll("button")];
  if (buttons.length !== 2) fail(`expected 2 tier buttons, found ${buttons.length}`);
  if (openCount() !== 0) fail(`${openCount()} panel(s) render while collapsed; the card opens shut`);
  if (container.textContent!.includes(SOLE_TRADER)) fail("the explainer renders while collapsed");

  /* K6 / RULE 18: EVERY FIGURE IS VISIBLE WITH THE CARD SHUT. If one of these
     ever moves into the panel, the disclosure is hiding a figure, which is the
     one thing the disclosure may not do. */
  const collapsed = container.textContent!;
  for (const fig of ["Free", "$15", "1 day"]) {
    if (!collapsed.includes(fig)) fail(`the collapsed card does not show the figure "${fig}"; K6 says every figure is visible shut`);
  }

  await click(0);
  if (openCount() !== 1) fail(`clicking one tier opened ${openCount()} panel(s)`);
  const p0 = panelOf(0);
  if (p0 === null) fail("clicking a tier did not reveal its own explainer");
  if (!p0!.includes(SOLE_TRADER)) fail("the open panel does not carry the clicked tier's explainer");
  if (!p0!.includes(PAPERWORK_1)) fail("the open panel does not carry the clicked tier's own paperwork level");
  if (p0!.includes(PAPERWORK_2) || p0!.includes(LLC)) fail("the open panel carries the NEXT tier's prose; the panel is not built from the row that was clicked");
  /* The panel's prose is digit-free by design, so any digit inside it is a
     figure that has been moved behind the disclosure. */
  if (/\d/.test(p0!)) fail(`a figure is hidden behind the disclosure (rule 18): the open panel reads "${p0!.trim().slice(0, 80)}"`);
  if (buttons[0].getAttribute("aria-expanded") !== "true") fail("aria-expanded did not follow the open state");
  if (buttons[1].getAttribute("aria-expanded") !== "false") fail("the unclicked tier reports itself expanded");

  await click(0);
  if (openCount() !== 0) fail("a second click did not close the panel");

  /* ---------- FIXTURE 2, one legal family, two real forms (Germany) --------- */
  /* Both rows are named LLC and carry the SAME explainer, so the only thing that
     can tell the two panels apart is the paperwork level, which is exactly the
     state the keyed-by-name bug could not distinguish. */
  const dup = [
    { tier: "LLC", local_term: "UG", cost_usd: 300, days: 7, complexity_1_5: 3 },
    { tier: "LLC", local_term: "GmbH", cost_usd: 1500, days: 14, complexity_1_5: 4 },
  ];
  await act(async () => {
    root.render(React.createElement(SetupTiers, { tiers: dup }));
  });
  if (rows().length !== 2) fail(`two rows sharing a tier name collapsed to ${rows().length}`);

  await click(1);
  if (openCount() !== 1) fail(`clicking one of two rows named LLC opened ${openCount()} panel(s); the open state is keyed by NAME, not by position`);
  const p1 = panelOf(1);
  if (p1 === null) fail("the second of two rows named LLC did not open");
  if (!p1!.includes(PAPERWORK_4)) fail("the second LLC row's panel does not carry its own paperwork level");
  if (p1!.includes(PAPERWORK_3)) fail("the second LLC row's panel carries the first row's paperwork level");
  if (panelOf(0) !== null) fail("clicking the second LLC row opened the first one as well");

  console.log("PASS setup_tiers_expand. One row opens, carries its own prose, hides no figure, closes again, and two rows sharing a tier name stay independent.");
  process.exit(0);
}

main().catch((e) => {
  console.error("x setup_tiers_expand crashed:", e);
  process.exit(1);
});
