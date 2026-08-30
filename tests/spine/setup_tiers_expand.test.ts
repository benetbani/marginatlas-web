/**
 * The expandable legal-form table actually expands (2026-08-30).
 *
 * WHY THIS EXISTS. The founder ordered the section expandable ("I've told you
 * multiple times"), and the harness's static renders CANNOT verify it: the
 * final-pages HTML ships without hydration, so a click in that artifact does
 * nothing whether the component is right or broken. A screenshot of the
 * collapsed state was taken and proved only the collapsed state. This test is
 * the other half: it mounts the real client component in jsdom, clicks a
 * tier, and asserts the explainer panel appears, carries the tier's own
 * figures, and closes again on the second click.
 *
 * BLIND SPOT, stated: jsdom proves the React mechanism, not the pixels. The
 * expanded panel's LOOK is judged from the live page once the preview flag is
 * set; its BEHAVIOUR is proven here.
 */
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", { pretendToBeVisual: true });
(globalThis as any).window = dom.window;
(globalThis as any).document = dom.window.document;
/* globalThis.navigator is getter-only on modern Node; defineProperty wins. */
Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });

async function main() {
  const React = (await import("react")).default;
  const { createRoot } = await import("react-dom/client");
  const { act } = await import("react");
  const { SetupTiers } = await import("../../src/components/spine/country/setup-tiers");

  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

  const tiers = [
    { tier: "Sole Trader", local_term: "Sole Trader", cost_usd: 0, days: 1, complexity_1_5: 1 },
    { tier: "LLC", local_term: "Private Limited Company (Ltd)", cost_usd: 15, days: 1, complexity_1_5: 2 },
  ];

  const container = dom.window.document.getElementById("root")!;
  const root = createRoot(container);
  await act(async () => {
    root.render(React.createElement(SetupTiers, { tiers }));
  });

  const fail = (msg: string) => {
    console.error("x setup_tiers_expand: " + msg);
    process.exit(1);
  };

  const buttons = [...container.querySelectorAll("button")];
  if (buttons.length !== 2) fail(`expected 2 tier buttons, found ${buttons.length}`);
  if (container.textContent!.includes("no wall between the owner")) fail("the explainer renders while collapsed");

  await act(async () => {
    buttons[0].dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  });
  if (!container.textContent!.includes("no wall between the owner")) fail("clicking a tier did not reveal its explainer");
  if (!container.textContent!.includes("Registers free")) fail("the expanded panel does not restate the tier's own figures");
  if (buttons[0].getAttribute("aria-expanded") !== "true") fail("aria-expanded did not follow the open state");

  await act(async () => {
    buttons[0].dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  });
  if (container.textContent!.includes("no wall between the owner")) fail("a second click did not close the panel");

  console.log("PASS setup_tiers_expand. The legal-form rows open, restate their figures, and close.");
  process.exit(0);
}

main().catch((e) => {
  console.error("x setup_tiers_expand crashed:", e);
  process.exit(1);
});
