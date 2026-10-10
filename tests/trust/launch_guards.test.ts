/**
 * TRUST AND THE LAUNCH GUARDS (plan docs/superpowers/plans/2026-10-10-home-reform, Task 8, in the design repo; the spec's decisions
 * 10 and 11 and section 4, "Trust"; the ship audit's 4.2, 4.5, 4.6, 5.2 to 5.4, 5.9 and 5.10). What a reader is told must be true:
 *   - the newsletter bar at every page's foot promises only what happens (no monthly read while nothing sends), says when an address
 *     is wrong or a post fails (`role="alert"`) and when it worked (`role="status"`, always in the document), names its field
 *     (`name`, `autocomplete="email"`), is 44px tall to touch with 16px type on a phone and a 3:1 edge, and is a labelled form inside
 *     a named region; the dead card that promised a monthly deep-dive is gone;
 *   - the privacy page names Sentry in the words the code earns, promises no unsubscribe link while no email is sent, and is dated
 *     10 October 2026 (he reads this text before any deploy);
 *   - the status page names what a reader uses (Pages, Figures), prints no raw error text, no vendor or table name, and no entity
 *     as letters; its headings are plain;
 *   - the error screens say what they are (no chrome promised that is not there) in the spine's tokens, with no cream and no brown.
 * HOW: the bar rendered server-side and mounted in jsdom (a bad address, a failed post, a good one; fetch stood in for), the privacy
 * page rendered with the switches off, the status page and the error screens read as source (the status page fetches the network on
 * render, which a gate may not). BLIND SPOT, stated: jsdom proves the bar's words and roles, not how a given screen reader voices
 * them, and not the bar's pixels.
 * Run: npx tsx tests/trust/launch_guards.test.ts
 */
import { readFileSync } from "node:fs";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

/* React ships `act` in its development build only (tests/spine/setup_tiers_expand.test.ts): set before React first loads. */
Object.assign(process.env, { NODE_ENV: "development" });

const RULE = "launch-guards";
const BAR = "src/components/newsletter/NewsletterSignupVariants.tsx";
const PRIVACY = "src/app/(site)/privacy/page.tsx";
const STATUS = "src/app/(site)/status/page.tsx";
const REMEDY = "say only what is true: the bar promises no send, says its errors and its success in roles a screen reader reads; the privacy page names Sentry and no unsubscribe link; the status page plain; the error screens true";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: at?.file ?? BAR, detail: label, remedy: at?.remedy ?? REMEDY });
};
const code = (f: string) => stripCommentLines(readFileSync(f, "utf8").split("\n")).join("\n");
const words = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

async function main() {
  const React = (await import("react")).default;
  const { renderToStaticMarkup } = await import("react-dom/server");
  (globalThis as unknown as { React: typeof React }).React = React;

  /* ---------------- THE NEWSLETTER BAR ---------------- */
  const barModule = await import("../../src/components/newsletter/NewsletterSignupVariants");
  const { FooterNewsletterBar, NEWSLETTER_COPY } = barModule;
  check(`the bar's module holds the bar alone: the card that promised a monthly deep-dive is gone (${Object.keys(barModule).sort().join(", ")})`, JSON.stringify(Object.keys(barModule).sort()) === JSON.stringify(["FooterNewsletterBar", "NEWSLETTER_COPY"]));
  const barCode = code(BAR);
  check("the bar promises no send: no monthly, weekly, deep-dive, inbox or hello", !/monthly|weekly|every month|deep-dive|inbox|hello/i.test(barCode) && !/monthly|weekly|inbox/i.test(Object.values(NEWSLETTER_COPY).join(" ")));
  check(`every line of the bar is twelve words or fewer, with no semicolon (${Object.values(NEWSLETTER_COPY).map((s) => s.split(/\s+/).length).join(", ")})`, Object.values(NEWSLETTER_COPY).every((s) => s.split(/\s+/).length <= 12 && !s.includes(";")));
  const idle = renderToStaticMarkup(React.createElement(FooterNewsletterBar));
  check("the bar is a region named by its own line", /^<section id="newsletter" aria-labelledby="atlas-newsletter-line"/.test(idle) && new RegExp(`<p id="atlas-newsletter-line"[^>]*>${NEWSLETTER_COPY.line.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</p>`).test(idle));
  check("the form is named by the same line", /<form[^>]*aria-labelledby="atlas-newsletter-line"/.test(idle));
  const input = /<input[^>]*>/.exec(idle)?.[0] ?? "";
  check(`the field has a name, autocomplete=email, 16px type on a phone, 44px, a 3:1 edge (${input.slice(0, 120)})`, /name="email"/.test(input) && /autoComplete="email"|autocomplete="email"/.test(input) && /type="email"/.test(input) && /\bh-11\b/.test(input) && /\btext-base\b/.test(input) && /\bmd:text-sm\b/.test(input) && /border-\[var\(--control-line\)\]/.test(input));
  const button = /<button[^>]*>[\s\S]*?<\/button>/.exec(idle)?.[0] ?? "";
  check(`the button is 44px and says ${NEWSLETTER_COPY.button}`, /\bh-11\b/.test(button) && words(button) === NEWSLETTER_COPY.button);
  check("a status region waits in the document for the success line, and no alert shows at rest", /<div role="status"/.test(idle) && !/role="alert"/.test(idle));
  check("the bar's line is upright in --c-ink2, no synthetic italic, no brown", !/italic|cocoa/.test(barCode) && /text-\[var\(--c-ink2\)\]/.test(barCode));

  /* The bar, pressed. */
  const { JSDOM } = await import("jsdom");
  const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", { pretendToBeVisual: true, url: "https://www.marginatlas.com/" });
  const g = globalThis as unknown as Record<string, unknown>;
  g.window = dom.window;
  g.document = dom.window.document;
  g.self = dom.window;
  Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
  g.IS_REACT_ACT_ENVIRONMENT = true;
  let answer: "ok" | "fail" = "ok";
  g.fetch = async () => { if (answer === "fail") throw new Error("offline"); return { ok: true } as Response; };
  const { createRoot } = await import("react-dom/client");
  const { act } = await import("react");
  const doc = dom.window.document;
  const mount = async () => {
    const host = doc.createElement("div");
    doc.body.appendChild(host);
    const root = createRoot(host);
    await act(async () => { root.render(React.createElement(FooterNewsletterBar)); });
    return { host, root };
  };
  const type = async (host: Element, value: string) => {
    const field = host.querySelector("input") as HTMLInputElement;
    const set = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value")!.set!;
    await act(async () => { set.call(field, value); field.dispatchEvent(new dom.window.Event("input", { bubbles: true })); });
  };
  const send = async (host: Element) => { await act(async () => { host.querySelector("form")!.dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true })); }); };

  const a = await mount();
  await send(a.host);
  const alertA = a.host.querySelector('[role="alert"]');
  const fieldA = a.host.querySelector("input")!;
  check(`an empty or bad address says so in an alert the field points at ("${alertA?.textContent ?? ""}")`, alertA?.textContent === NEWSLETTER_COPY.badAddress && fieldA.getAttribute("aria-invalid") === "true" && fieldA.getAttribute("aria-describedby") === alertA?.id);
  await type(a.host, "reader@example.com");
  answer = "fail";
  await send(a.host);
  check(`a failed post says so in an alert ("${a.host.querySelector('[role="alert"]')?.textContent ?? ""}")`, a.host.querySelector('[role="alert"]')?.textContent === NEWSLETTER_COPY.failed);
  answer = "ok";
  await send(a.host);
  const status = a.host.querySelector('[role="status"]');
  check(`a good post says so in the status region, and the alert goes ("${status?.textContent ?? ""}")`, (status?.textContent ?? "").includes(NEWSLETTER_COPY.done) && !a.host.querySelector('[role="alert"]') && !a.host.querySelector("input"));
  await act(async () => { a.root.unmount(); });

  /* ---------------- THE PRIVACY PAGE ---------------- */
  process.env.NEXT_PUBLIC_AUTH_ENABLED = "";
  process.env.NEXT_PUBLIC_PAYWALL = "";
  const { SENTRY_LEAD, SENTRY_WORDS } = await import("../../src/lib/legal/pro_legal");
  const Privacy = (await import("../../src/app/(site)/privacy/page")).default;
  const privacy = words(renderToStaticMarkup(React.createElement(Privacy)));
  check("the privacy page names Sentry, in the words the code earns", privacy.includes(`${SENTRY_LEAD} ${SENTRY_WORDS}`) && /Sentry receives the error reports described above/.test(privacy), { file: PRIVACY });
  check("the privacy page promises no unsubscribe link while nothing sends, and calls the list what it is", !/unsubscrib|link in every email|newsletter/i.test(privacy) && /the email list/.test(privacy), { file: PRIVACY });
  check("the privacy page is dated 10 October 2026, the day its text changed", privacy.includes("Last updated 10 October 2026"), { file: PRIVACY });
  check("the privacy page still holds what you gave us and nothing more", privacy.includes("what you gave us and nothing more"), { file: PRIVACY });

  /* ---------------- THE STATUS PAGE (source: it fetches the network when it renders) ---------------- */
  const status_ = code(STATUS);
  check("the status page decodes no entity at run time: no &apos; in a string", !/&apos;/.test(status_), { file: STATUS });
  check("the status page names Pages and Figures, no vendor or table in a reader's words", /name: "Pages"/.test(status_) && /name: "Figures"/.test(status_) && !/name: "[^"]*(?:Supabase|cells)/.test(status_) && !/description: "[^"]*(?:regional_cells|Supabase)/.test(status_), { file: STATUS });
  check("the status page prints no raw error text", !/\bdetail\b/.test(status_), { file: STATUS });
  const headings = [...status_.matchAll(/(?:allUp|anyDown|otherwise): "([^"]+)"/g)].map((m) => m[1]);
  check(`the status headings are plain, four words at most, no apostrophe (${headings.join(" / ")})`, headings.length === 3 && headings.every((h) => h.split(" ").length <= 4 && !/['\u2019]/.test(h)), { file: STATUS });
  check("the status page's words are sentence case, promise no public note, and carry no semicolon", !/uppercase|tracking-wide/.test(status_) && !/best-effort|public note|request edge/.test(status_) && /Each check runs when the page loads\. A brief network blip can show here, so reload once\./.test(status_), { file: STATUS });

  /* ---------------- THE ERROR AND LOADING SCREENS ---------------- */
  const err = readFileSync("src/app/error.tsx", "utf8"), errCode = code("src/app/error.tsx");
  check("the error screen no longer promises the chrome stays", !/chrome stays intact/.test(err) && /chrome is drawn per page/.test(err), { file: "src/app/error.tsx" });
  check("the error screen is in the spine's tokens, sentence case, no clay or tracked capitals", !/clay-|uppercase|tracking-wide|ink-900|paper-100/.test(errCode) && /text-\[var\(--c-ink\)\]/.test(errCode), { file: "src/app/error.tsx" });
  const glob = code("src/app/global-error.tsx");
  check("the root error screen paints no cream and no brown, and claims no notice it cannot know", !/#fbf9f4|#9b4f1f|#4a4744/i.test(glob) && !/notified/i.test(glob), { file: "src/app/global-error.tsx" });
  const loading = readFileSync("src/app/loading.tsx", "utf8");
  check("the loading screen's comment says what it is (no chrome claimed)", !/mirrors the typical page chrome/.test(loading) && /draws no bar and no footer/.test(loading), { file: "src/app/loading.tsx" });

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("trust/launch_guards: all pass");
}

main().catch((e) => {
  red({ rule: RULE, file: BAR, detail: `the launch-guards test crashed: ${e instanceof Error ? e.message : String(e)}`, remedy: REMEDY });
  process.exit(1);
});
