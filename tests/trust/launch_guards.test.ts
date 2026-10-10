/**
 * TRUST AND THE LAUNCH GUARDS (plan docs/superpowers/plans/2026-10-10-home-reform, Task 8, in the design repo; the spec's decisions
 * 10 and 11 and section 4, "Trust"; the ship audit's 4.2, 4.5, 4.6, 5.2 to 5.4, 5.9 and 5.10). What a reader is told must be true:
 *   - the newsletter bar at every page's foot promises only what happens (no monthly read while nothing sends), says when an address
 *     is wrong or a post fails (`role="alert"`) and when it worked (`role="status"`, always in the document), names its field
 *     (`name`, `autocomplete="email"`), is 44px tall to touch with 16px type on a phone and a 3:1 edge, and is a labelled form inside
 *     a named region; the dead card that promised a monthly deep-dive is gone;
 *   - the privacy page names Sentry in the words the code earns, promises no unsubscribe link while no email is sent, and is dated
 *     10 October 2026 (he reads this text before any deploy); FIX ROUND 8: it says what the email list holds beside the address and
 *     both reasons for it, and the Sentry configs keep what its words say: sendDefaultPii false, traces at 5 percent, no replay, no
 *     setUser, and a server report or trace without the request's cookies, location, copy of the headers and body (the real server
 *     config is handed an event that carries them all, and what it hands back is read);
 *   - the status page names what a reader uses (Pages, Figures), prints no raw error text, no vendor or table name, and no entity
 *     as letters; its headings are plain;
 *   - the error screens say what they are (no chrome promised that is not there) in the spine's tokens, with no cream and no brown.
 * HOW: the bar rendered server-side and mounted in jsdom (a bad address, a failed post, a good one; fetch stood in for), the privacy
 * page rendered with the switches off, the status page and the error screens read as source (the status page fetches the network on
 * render, which a gate may not). BLIND SPOT, stated: jsdom proves the bar's words and roles, not how a given screen reader voices
 * them, and not the bar's pixels.
 * Run: npx tsx tests/trust/launch_guards.test.ts
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
const sourceFiles = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? sourceFiles(`${dir}/${e.name}`) : /\.(?:ts|tsx)$/.test(e.name) ? [`${dir}/${e.name}`] : []));
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
  /* FIX ROUND 8: the field has a name now, so a native submit before the page hydrated (Enter in the field, or a tap on the button)
     would be a GET with the address in the URL: the browser's history, the host's logs, any error report's page address. The
     server markup holds the button disabled, which also stops Enter (a form whose default button is disabled submits nothing). */
  check("the button is disabled in the server markup, so nothing can submit before the page has hydrated", /^<button\b[^>]*\sdisabled(?:=""|\s|>)/.test(button), { file: BAR, remedy: "keep the submit button disabled until a first effect has run (useState ready, useEffect sets it): the field is named, and a native submit before hydration is a GET with the address in the URL" });
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
  let answer: "ok" | "fail" | 400 | 429 | 500 = "ok";
  g.fetch = async () => { if (answer === "fail") throw new Error("offline"); if (typeof answer === "number") return { ok: false, status: answer } as Response; return { ok: true, status: 200 } as Response; };
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
  check("after the first effect has run the button is enabled", (a.host.querySelector("button") as HTMLButtonElement).disabled === false, { file: BAR, remedy: "set ready in a useEffect, so the button is enabled once the page has hydrated" });
  await send(a.host);
  const alertA = a.host.querySelector('[role="alert"]');
  const fieldA = a.host.querySelector("input")!;
  check(`an empty or bad address says so in an alert the field points at ("${alertA?.textContent ?? ""}")`, alertA?.textContent === NEWSLETTER_COPY.badAddress && fieldA.getAttribute("aria-invalid") === "true" && fieldA.getAttribute("aria-describedby") === alertA?.id);
  await type(a.host, "reader@example.com");
  answer = "fail";
  await send(a.host);
  check(`a failed post says so in an alert ("${a.host.querySelector('[role="alert"]')?.textContent ?? ""}")`, a.host.querySelector('[role="alert"]')?.textContent === NEWSLETTER_COPY.failed);
  /* CLEANUP ROUND 2 (item 7): aria-invalid says the ADDRESS is wrong. After a 429 or a 500 the address is fine and the post did not
     go through, so the field is not invalid, though the alert still describes the failure and the field still points at it. */
  const ARIA_REMEDY = { file: BAR, remedy: "set aria-invalid on the field only when status is \"invalid\" (the address itself is wrong); keep aria-describedby pointing at the alert for a failed post too" };
  const failedField = a.host.querySelector("input")!;
  check(`after a failed post the field is not marked invalid, and still points at the alert (aria-invalid ${failedField.getAttribute("aria-invalid") ?? "absent"})`, failedField.getAttribute("aria-invalid") === null && failedField.getAttribute("aria-describedby") === a.host.querySelector('[role="alert"]')?.id, ARIA_REMEDY);
  answer = "ok";
  await send(a.host);
  const status = a.host.querySelector('[role="status"]');
  check(`a good post says so in the status region, and the alert goes ("${status?.textContent ?? ""}")`, (status?.textContent ?? "").includes(NEWSLETTER_COPY.done) && !a.host.querySelector('[role="alert"]') && !a.host.querySelector("input"));
  await act(async () => { a.root.unmount(); });

  /* FIX ROUND 8: the route answers 400 for an address its own check refuses (src/app/api/newsletter/route.ts: stricter than the
     bar's, which lets "a@b.c" through), and that is a bad address, not a post that did not go through. 429 (five a minute) and a
     server error are the posts that did not. */
  const b = await mount();
  await type(b.host, "a@b.c");
  const REFUSED = { file: BAR, remedy: "map the route's 400 to the bad-address line (setStatus invalid) and leave every other non-OK answer as a post that did not go through" };
  const BOTH = { file: BAR, remedy: `${REFUSED.remedy}, and for aria-invalid: ${ARIA_REMEDY.remedy}` };
  answer = 400;
  await send(b.host);
  const refused = b.host.querySelector('[role="alert"]');
  check(`a 400 from the route shows the bad-address line the field points at, not "try again" ("${refused?.textContent ?? ""}")`, refused?.textContent === NEWSLETTER_COPY.badAddress && b.host.querySelector("input")?.getAttribute("aria-invalid") === "true" && b.host.querySelector("input")?.getAttribute("aria-describedby") === refused?.id, REFUSED);
  answer = 429;
  await send(b.host);
  check(`a 429 shows the try-again line ("${b.host.querySelector('[role="alert"]')?.textContent ?? ""}") and does not mark the address invalid (aria-invalid ${b.host.querySelector("input")?.getAttribute("aria-invalid") ?? "absent"})`, b.host.querySelector('[role="alert"]')?.textContent === NEWSLETTER_COPY.failed && b.host.querySelector("input")?.getAttribute("aria-invalid") === null, BOTH);
  answer = 500;
  await send(b.host);
  check(`a server error shows the try-again line ("${b.host.querySelector('[role="alert"]')?.textContent ?? ""}") and does not mark the address invalid (aria-invalid ${b.host.querySelector("input")?.getAttribute("aria-invalid") ?? "absent"})`, b.host.querySelector('[role="alert"]')?.textContent === NEWSLETTER_COPY.failed && b.host.querySelector("input")?.getAttribute("aria-invalid") === null, BOTH);
  await act(async () => { b.root.unmount(); });

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
  /* CLEANUP ROUND 2 (the Task 8 re-review, item 8): the paragraph was scoped to "the bar at the foot of each page", but DepthNotify
     posts to the same route with a place as its source (the home page's ask and the foot of the pages for places we cover in less
     depth), to tell a reader when that place gains depth. The page and the draft say both forms and the three reasons, from one
     pair of constants (EMAIL_LIST_LEAD and EMAIL_LIST_WORDS in src/lib/legal/pro_legal.ts); the words are pinned whole here. */
  const EMAIL_LIST_LEAD_PINNED = "Email when new figures land, a place gains depth or Pro opens.";
  const EMAIL_LIST_WORDS_PINNED = "Two forms take an email. The bar at the foot of each page takes the address alone. The place form, on the home page and at the foot of pages for places we cover in less depth, also asks which place you want to hear about. We store the address with the day you signed up and the form you used, and for the place form the place you chose. We use it to write to you when new figures land, when a place you asked about gains depth, or when Pro opens. Nothing else is attached to it.";
  const { EMAIL_LIST_LEAD, EMAIL_LIST_WORDS } = (await import("../../src/lib/legal/pro_legal")) as unknown as { EMAIL_LIST_LEAD?: string; EMAIL_LIST_WORDS?: string };
  check("the privacy page says what the email list holds beside the address: both forms, the place a reader chose, and the three reasons (new figures land, a place gains depth, Pro opens)", privacy.includes(`${EMAIL_LIST_LEAD_PINNED} ${EMAIL_LIST_WORDS_PINNED}`) && EMAIL_LIST_LEAD === EMAIL_LIST_LEAD_PINNED && EMAIL_LIST_WORDS === EMAIL_LIST_WORDS_PINNED, { file: PRIVACY, remedy: "write the email-list paragraph from EMAIL_LIST_LEAD and EMAIL_LIST_WORDS (src/lib/legal/pro_legal.ts) as the page and the draft both print them, and name both forms (the bar, and the place form DepthNotify draws), what each row holds (the day, the form, the place) and the three reasons" });
  const emailListText = `${EMAIL_LIST_LEAD ?? ""} ${EMAIL_LIST_WORDS ?? ""}`.trim();
  check("the email-list words keep the copy rules: present, no semicolon, no em-dash, no 'newsletter' or 'unsubscribe'", emailListText.length > 0 && !emailListText.includes(";") && !emailListText.includes(String.fromCharCode(8212)) && !/newsletter|unsubscrib/i.test(emailListText), { file: "src/lib/legal/pro_legal.ts", remedy: "write the email-list words in plain sentences, with no semicolon, no em-dash and no promise of a newsletter or an unsubscribe link while nothing sends" });

  /* ---------------- WHAT SENTRY IS SET TO KEEP (fix round 8: the facts the privacy page's words rest on) ---------------- */
  const SENTRY_CLIENT = "src/instrumentation-client.ts", SENTRY_SERVER = "sentry.server.config.ts", SENTRY_EDGE = "sentry.edge.config.ts";
  const SENTRY_FILES = [SENTRY_CLIENT, SENTRY_SERVER, SENTRY_EDGE].filter((f) => existsSync(f));
  const SENTRY_REMEDY = "keep the Sentry configs as SENTRY_WORDS (src/lib/legal/pro_legal.ts, the privacy page's sentence, which he reads) says they are: sendDefaultPii false, traces at 5 percent, no replay, no setUser, and a server report without the request's cookies and location (sentry.server.config.ts); change the words and the code together, never one alone";
  check(`the browser's and the server's Sentry configs exist (${SENTRY_FILES.join(", ")})`, SENTRY_FILES.includes(SENTRY_CLIENT) && SENTRY_FILES.includes(SENTRY_SERVER), { file: SENTRY_SERVER, remedy: SENTRY_REMEDY });
  for (const f of SENTRY_FILES) {
    const c = code(f);
    check(`${f} sets sendDefaultPii: false, so no IP address is inferred and no user is attached`, /\bsendDefaultPii:\s*false\b/.test(c), { file: f, remedy: SENTRY_REMEDY });
    check(`${f} samples traces at 0.05, the small share of visits the words name`, /\btracesSampleRate:\s*0\.05\b/.test(c), { file: f, remedy: SENTRY_REMEDY });
  }
  /* CLEANUP ROUND 2 (item 5): the words said "a short trail", while the browser SDK keeps up to 100 breadcrumbs, console lines among
     them. The browser config caps the trail at 20, and the words say what a trail holds (pinned whole below). The server and edge
     configs set no cap: the words give no number, and their trail is the server's own requests and console lines. */
  check("the browser config keeps at most 20 breadcrumbs, the trail the privacy words describe", /\bmaxBreadcrumbs:\s*20\b/.test(code(SENTRY_CLIENT)), { file: SENTRY_CLIENT, remedy: SENTRY_REMEDY });
  const sentryScope = [...sourceFiles("src"), ...SENTRY_FILES.filter((f) => !f.startsWith("src/"))];
  const replays = sentryScope.filter((f) => /\b(?:replayIntegration|replaysSessionSampleRate|replaysOnErrorSampleRate)\b/.test(code(f)));
  const userSetters = sentryScope.filter((f) => /\bsetUser\b/.test(code(f)));
  check(`no session replay is recorded: no replayIntegration or replay sample rate in ${sentryScope.length} source files${replays.length ? ` (found in ${replays.join(", ")})` : ""}`, replays.length === 0, { file: replays[0] ?? SENTRY_CLIENT, remedy: SENTRY_REMEDY });
  check(`no user is attached to a report: no setUser in ${sentryScope.length} source files${userSetters.length ? ` (found in ${userSetters.join(", ")})` : ""}`, userSetters.length === 0, { file: userSetters[0] ?? SENTRY_CLIENT, remedy: SENTRY_REMEDY });
  const serverSrc = code(SENTRY_SERVER);
  check("the server config deletes the request's cookies, the cookie header, the x-vercel-ip location headers and x-vercel-id (its first part names the edge region that served the reader), from a report and from a trace", /delete\s+[\w.]*request\.cookies\b/.test(serverSrc) && /["']cookie["']/.test(serverSrc) && /x-vercel-ip-/.test(serverSrc) && /["']x-vercel-id["']/.test(serverSrc) && /\bbeforeSendTransaction\b/.test(serverSrc), { file: SENTRY_SERVER, remedy: SENTRY_REMEDY });
  check("the edge config adds no request data: no requestDataIntegration (the edge SDK adds it only when sendDefaultPii is true, so an edge report holds no headers and no cookies)", !/requestDataIntegration/.test(code(SENTRY_EDGE)), { file: SENTRY_EDGE, remedy: SENTRY_REMEDY });
  check("the browser config's comment says what it keeps, not 'no personal data'", !/no personal data/i.test(readFileSync(SENTRY_CLIENT, "utf8")), { file: SENTRY_CLIENT, remedy: SENTRY_REMEDY });

  /* The real server and edge configs, each handed an event that carries a signed-in reader's cookie (with the email in it), the
     reader's place and the copy of the headers a trace's root span makes of itself, and what they hand back read. Only
     @sentry/nextjs is stood in for (its init records the options the config gives it), so nothing starts and nothing is sent. */
  const sentryPath = require.resolve("@sentry/nextjs");
  const optionsOf = (which: "server" | "edge"): Record<string, any> => {
    const configPath = require.resolve(which === "server" ? "../../sentry.server.config" : "../../sentry.edge.config");
    const real = require.cache[sentryPath];
    let given: Record<string, any> | undefined;
    require.cache[sentryPath] = { id: sentryPath, filename: sentryPath, loaded: true, children: [], paths: [], exports: { init: (o: Record<string, any>) => { given = o; } } } as unknown as NodeJS.Module;
    delete require.cache[configPath];
    try { require(configPath); } finally {
      delete require.cache[configPath];
      if (real) require.cache[sentryPath] = real; else delete require.cache[sentryPath];
    }
    if (!given) throw new Error(`the ${which} Sentry config never called Sentry.init`);
    return given;
  };
  const READER = "reader@example.com", READER_IP = "203.0.113.7", READER_LATITUDE = "51.5072", READER_EDGE = "lhr1";
  const dirty = (kind: "error" | "transaction") => ({
    ...(kind === "transaction" ? { type: "transaction" } : {}),
    request: {
      url: "https://www.marginatlas.com/gb/london?x=1",
      method: "GET",
      cookies: { "sb-ref-auth-token": `{"user":{"email":"${READER}"}}`, theme: "dark" },
      headers: {
        host: "www.marginatlas.com", "user-agent": "Reader/1.0", "accept-language": "en-GB", referer: "https://www.marginatlas.com/gb", "x-vercel-id": `${READER_EDGE}::t`,
        [kind === "error" ? "Cookie" : "cookie"]: `sb-ref-auth-token=${encodeURIComponent(READER)}; theme=dark`,
        "X-Vercel-IP-City": "London", "x-vercel-ip-country": "GB", "x-vercel-ip-latitude": READER_LATITUDE, "X-Vercel-Proxied-For": READER_IP,
      } as Record<string, string>,
      data: { email: READER, note: "kept" } as Record<string, string>,
    },
    contexts: { trace: { trace_id: "t", span_id: "s", data: { "next.route": "/[country]/[geo]", "http.request.header.user_agent": "Reader/1.0", "http.request.header.cookie.theme": "dark", "http.request.header.x_real_ip": READER_IP, "http.request.header.x_vercel_ip_city": "London" } as Record<string, string> } },
    spans: [{ span_id: "c", trace_id: "t", data: { "http.url": "https://example.test/", "http.request.header.x_real_ip": READER_IP } as Record<string, string> }],
  });
  const leftIn = (out: any): string[] => {
    const left: string[] = [];
    const request = out?.request ?? {};
    if (request.cookies !== undefined) left.push("request.cookies");
    for (const h of Object.keys(request.headers ?? {})) { const lower = h.toLowerCase(); if (lower === "cookie" || lower.startsWith("x-vercel-ip-") || lower === "x-vercel-proxied-for" || lower === "x-vercel-id") left.push(`header ${h}`); }
    for (const k of Object.keys(out?.contexts?.trace?.data ?? {})) if (k.startsWith("http.request.header.")) left.push(`trace attribute ${k}`);
    for (const s of out?.spans ?? []) for (const k of Object.keys(s.data ?? {})) if (k.startsWith("http.request.header.")) left.push(`span attribute ${k}`);
    const whole = JSON.stringify(out);
    for (const needle of [READER, READER_IP, READER_LATITUDE, READER_EDGE]) if (whole.includes(needle)) left.push(`the text ${needle}`);
    return left;
  };
  const keptIn = (out: any): boolean => out?.request?.url === "https://www.marginatlas.com/gb/london?x=1" && ["host", "user-agent", "accept-language", "referer"].every((h) => typeof out?.request?.headers?.[h] === "string") && out?.contexts?.trace?.data?.["next.route"] === "/[country]/[geo]" && out?.spans?.[0]?.data?.["http.url"] === "https://example.test/";
  const server = optionsOf("server");
  const errorOut = typeof server.beforeSend === "function" ? server.beforeSend(dirty("error"), { originalException: new Error("a page failed") }) : null;
  const errorLeft = errorOut === null ? ["no beforeSend in the config, or it dropped the report"] : leftIn(errorOut);
  check(`a server report leaves the config without cookies, without the reader's place (the edge region too) and without a copy of them (left: ${errorLeft.join(", ") || "nothing"})`, errorLeft.length === 0, { file: SENTRY_SERVER, remedy: SENTRY_REMEDY });
  check("a server report keeps the request's address and its other headers, and the form-field scrub still runs", keptIn(errorOut) && errorOut?.request?.data?.email === "[scrubbed]" && errorOut?.request?.data?.note === "kept", { file: SENTRY_SERVER, remedy: SENTRY_REMEDY });
  check("a server report for Next's own dynamic-render signal is still dropped", typeof server.beforeSend === "function" && server.beforeSend(dirty("error"), { originalException: new Error("Dynamic server usage: cookies") }) === null, { file: SENTRY_SERVER, remedy: SENTRY_REMEDY });
  const traceOut = typeof server.beforeSendTransaction === "function" ? server.beforeSendTransaction(dirty("transaction"), {}) : null;
  const traceLeft = traceOut === null ? ["no beforeSendTransaction in the config, or it dropped the trace"] : leftIn(traceOut);
  check(`a server trace leaves the config without cookies, without the reader's place, without the reader's address and without a copy of the headers (left: ${traceLeft.join(", ") || "nothing"})`, traceLeft.length === 0, { file: SENTRY_SERVER, remedy: SENTRY_REMEDY });
  check("a server trace keeps its timings' names and the request's address and other headers", keptIn(traceOut), { file: SENTRY_SERVER, remedy: SENTRY_REMEDY });
  /* The Node SDK reads up to 10 KB of any body a route handler reads and attaches it as TEXT, so the contact, correction and
     newsletter forms' names, emails and messages would ride on a report or a trace; the field-name scrub only reads objects. */
  const textBody = JSON.stringify({ name: "Made Up Reader", email: READER, message: "hello from the test" });
  const withTextBody = (e: any) => ({ ...e, request: { ...e.request, data: textBody } });
  const bodyReport = typeof server.beforeSend === "function" ? server.beforeSend(withTextBody(dirty("error")), { originalException: new Error("a page failed") }) : null;
  const bodyTrace = typeof server.beforeSendTransaction === "function" ? server.beforeSendTransaction(withTextBody(dirty("transaction")), {}) : null;
  check("a server report and a server trace leave without a request body the SDK captured as text (a form's name, email and message)", bodyReport !== null && bodyTrace !== null && bodyReport.request?.data === undefined && bodyTrace.request?.data === undefined && !JSON.stringify([bodyReport, bodyTrace]).includes("Made Up Reader"), { file: SENTRY_SERVER, remedy: SENTRY_REMEDY });
  const edge = optionsOf("edge");
  check("the edge config still drops Next's dynamic-render signal and hands any other report on whole", typeof edge.beforeSend === "function" && edge.beforeSend(dirty("error"), { originalException: new Error("couldn't be rendered statically") }) === null && edge.sendDefaultPii === false, { file: SENTRY_EDGE, remedy: SENTRY_REMEDY });
  check(`SENTRY_WORDS promises none of "no name", "no email" or "no personal data" (${SENTRY_WORDS.split(/\s+/).length} words)`, !/\bno (?:name|email|personal data)\b/i.test(SENTRY_WORDS), { file: "src/lib/legal/pro_legal.ts", remedy: SENTRY_REMEDY });
  /* THE WORDS, WHOLE (cleanup round 2, item 6): two clauses pinned by substring let a flipped clause elsewhere in the sentence through
     (the IP one, "Sentry is set to keep no IP address"). The exact text is held here, so any edit to it reds until this line moves
     with it, which is the moment he reads it. */
  const SENTRY_WORDS_PINNED = "When a page fails, in your browser or on our servers, Sentry, the service we use to find bugs, receives a report. It holds what failed, the page's address, the address you came from, a trail of your last clicks, page changes, requests and console lines, and details of your browser such as its language and time zone. A report from our servers also holds the request's headers, without cookies or location. A small share of visits also send how long the page and the files it needs took to load. Sentry is set to keep no IP address. We do not attach your name or account to a report, but anything written in an address or an error message goes with it.";
  check("SENTRY_WORDS is the pinned text, whole", SENTRY_WORDS === SENTRY_WORDS_PINNED, { file: "src/lib/legal/pro_legal.ts", remedy: "change SENTRY_WORDS and SENTRY_WORDS_PINNED in tests/trust/launch_guards.test.ts together, after he has read the new sentence: it is the privacy page's Sentry paragraph and the draft's, and every clause of it is a fact about the configs" });
  check("SENTRY_WORDS says what a server report leaves out and what still goes with a report", SENTRY_WORDS.includes("A report from our servers also holds the request's headers, without cookies or location.") && SENTRY_WORDS.includes("We do not attach your name or account to a report, but anything written in an address or an error message goes with it."), { file: "src/lib/legal/pro_legal.ts", remedy: SENTRY_REMEDY });

  /* ---------------- LAUNCH:CHECK'S ITEM (j) SEES THE SWITCH IT GUARDS (fix round 8) ---------------- */
  /* Launch day sets NEXT_PUBLIC_AUTH_ENABLED and NEXT_PUBLIC_PAYWALL in Vercel's dashboard (LAUNCH-SWITCHES row 10) and runs
     launch:check from his terminal (row 13), where neither is set: item (j) read isPaywallOn() from this process's environment
     alone and printed "[ok] ... the paywall is off" while production had it on. It now reads both switches through
     verify_sample_switch's readFlag (the environment, then .env.production, then .env.local), prints where each came from, and
     treats a switch no source answers as unknown. Item (j) runs by hand as a subset (`--only=j`) over a scratch folder of env
     files (`--env-root`) and an unreachable site (`--site`), so nothing reads the real env files and nothing leaves the machine. */
  const J_FILE = "scripts/verify_launch_ready.ts";
  const J_REMEDY = "read both switches through readFlag (scripts/lib/paywall_switches.ts), print the source of each, and treat a switch no source answers as unknown: with a gap left that is a reason that says it cannot see Vercel's switches (scripts/verify_launch_ready.ts, itemJ)";
  const { PRO_LEGAL: legalDrafts, gapsIn: gapsOf } = await import("../../src/lib/legal/pro_legal");
  const gapsLeft = legalDrafts.flatMap((d) => gapsOf(d)).length;
  const SWITCH_NAMES = ["NEXT_PUBLIC_PAYWALL", "NEXT_PUBLIC_AUTH_ENABLED"];
  const scratchFolder = (files: Record<string, string>) => { const dir = mkdtempSync(join(tmpdir(), "fix8-switches-")); for (const [name, text] of Object.entries(files)) writeFileSync(join(dir, name), text); return dir; };
  const noSwitches = scratchFolder({});
  const bothOnInFile = scratchFolder({ ".env.production": "NEXT_PUBLIC_PAYWALL=1\nNEXT_PUBLIC_AUTH_ENABLED=1\n" });
  const itemJ = (root: string) => {
    const env: NodeJS.ProcessEnv = { ...process.env };
    for (const name of SWITCH_NAMES) delete env[name];
    const r = spawnSync(process.execPath, ["node_modules/tsx/dist/cli.mjs", J_FILE, "--only=j", `--env-root=${root}`, "--site=http://127.0.0.1:9"], { encoding: "utf8", env, cwd: process.cwd(), timeout: 180_000 });
    const out = r.stdout ?? "";
    return { status: r.status, line: out.split("\n").find((l) => /^\[(?:ok|no)\] \(j\)/.test(l)) ?? `(no item (j) line: exit ${r.status}, ${r.error?.message ?? (r.stderr ?? "").slice(0, 200)})` };
  };
  const blind = itemJ(noSwitches);
  check(`with no switch in the environment and none in the env files, item (j) does not call the paywall off (${blind.line.slice(0, 260)})`,
    gapsLeft === 0 ? /^\[ok\] \(j\)/.test(blind.line) && blind.status === 0
      : /^\[no\] \(j\)/.test(blind.line) && blind.line.includes("cannot see Vercel's switches: fill the gaps first, or measure /terms on production") && !/paywall is off/.test(blind.line) && blind.status === 1, { file: J_FILE, remedy: J_REMEDY });
  const seen = itemJ(bothOnInFile);
  check(`with both switches in a scratch .env.production, item (j) reads them and names the file (${seen.line.slice(0, 260)})`,
    gapsLeft === 0 ? /^\[ok\] \(j\)/.test(seen.line) && seen.status === 0
      : /^\[no\] \(j\)/.test(seen.line) && seen.line.includes("the paywall is on") && seen.line.includes("NEXT_PUBLIC_PAYWALL ON (.env.production)") && seen.line.includes("NEXT_PUBLIC_AUTH_ENABLED ON (.env.production)") && seen.status === 1, { file: J_FILE, remedy: J_REMEDY });
  const switchReader = await import("../../scripts/lib/paywall_switches").catch(() => null);
  check("the paywall switch reader exists and reads the paywall's two switches through readFlag", switchReader !== null && typeof switchReader.readPaywallSwitches === "function", { file: "scripts/lib/paywall_switches.ts", remedy: J_REMEDY });
  if (switchReader) {
    const readWith = (root: string, env: Record<string, string> = {}) => {
      const saved = SWITCH_NAMES.map((name) => [name, process.env[name]] as const);
      for (const name of SWITCH_NAMES) delete process.env[name];
      Object.assign(process.env, env);
      try { return switchReader.readPaywallSwitches(root); } finally { for (const [name, value] of saved) { if (value === undefined) delete process.env[name]; else process.env[name] = value; } }
    };
    const none = readWith(noSwitches);
    check(`no source answers: the paywall is unknown, not off (${none.words})`, none.on === null && none.paywall.source === "unset" && none.accounts.source === "unset", { file: "scripts/lib/paywall_switches.ts", remedy: J_REMEDY });
    const filed = readWith(bothOnInFile);
    check(`both switches on in .env.production: on, and the words name the file (${filed.words})`, filed.on === true && filed.paywall.source === ".env.production" && filed.words.includes("NEXT_PUBLIC_PAYWALL ON (.env.production)"), { file: "scripts/lib/paywall_switches.ts", remedy: J_REMEDY });
    const overruled = readWith(bothOnInFile, { NEXT_PUBLIC_PAYWALL: "0" });
    check(`the environment is read before the files: PAYWALL=0 over a file with both on is off, from the environment (${overruled.words})`, overruled.on === false && overruled.paywall.source === "environment", { file: "scripts/lib/paywall_switches.ts", remedy: J_REMEDY });
    const half = readWith(scratchFolder({ ".env.local": "NEXT_PUBLIC_AUTH_ENABLED=1\n" }));
    check(`accounts on in .env.local and the paywall unanswered: unknown, since the paywall needs both (${half.words})`, half.on === null && half.accounts.source === ".env.local", { file: "scripts/lib/paywall_switches.ts", remedy: J_REMEDY });
    const off = readWith(scratchFolder({ ".env.production": "NEXT_PUBLIC_PAYWALL=0\n" }));
    check(`the paywall off in a file and accounts unanswered: off, since either switch off keeps it off (${off.words})`, off.on === false && off.paywall.source === ".env.production", { file: "scripts/lib/paywall_switches.ts", remedy: J_REMEDY });
  }

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
  check("the root error screen's Go home link is 44px tall to touch, as error.tsx's is, with its label in the middle", /minHeight:\s*44\b/.test(glob) && /boxSizing:\s*"border-box"/.test(glob) && /display:\s*"inline-flex"/.test(glob) && /alignItems:\s*"center"/.test(glob), { file: "src/app/global-error.tsx", remedy: "give the Go home link minHeight: 44 with boxSizing border-box (this page has no stylesheet, so the default content-box would make it 68px), display inline-flex and alignItems center, as src/app/error.tsx's min-h-11 does; it was about 41px" });
  const loading = readFileSync("src/app/loading.tsx", "utf8");
  check("the loading screen's comment says what it is (no chrome claimed)", !/mirrors the typical page chrome/.test(loading) && /draws no bar and no footer/.test(loading), { file: "src/app/loading.tsx" });

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("trust/launch_guards: all pass");
}

main().catch((e) => {
  red({ rule: RULE, file: BAR, detail: `the launch-guards test crashed: ${e instanceof Error ? e.message : String(e)}`, remedy: REMEDY });
  process.exit(1);
});
