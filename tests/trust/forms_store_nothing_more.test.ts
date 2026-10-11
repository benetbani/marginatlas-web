/**
 * THE FORMS STORE WHAT THE READER GAVE AND NOTHING MORE (the checkup of 2026-10-06): the privacy page says the site holds "what
 * you gave us and nothing more", and the contact and correction forms stored the sender's IP address and user agent, which
 * nothing ever read. Holds that no form route writes either again (the rate limits read the address in memory only), and that
 * the privacy page still makes the promise this holds.
 *
 * Run: npx tsx tests/trust/forms_store_nothing_more.test.ts
 */
import { readFileSync } from "node:fs";
import ts from "typescript";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "forms-minimal";
const REMEDY = "store only what the reader typed; read an address in memory for a rate limit, never into a row";
let failed = 0;
const check = (file: string, label: string, ok: boolean, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };

const ROUTES = ["src/app/api/contact/route.ts", "src/app/api/correction/route.ts", "src/app/api/newsletter/route.ts"];
for (const route of ROUTES) {
  const code = stripCommentLines(readFileSync(route, "utf8").split("\n")).join("\n");
  const stored = /\b(ip|user_agent|ip_address)\s*:/.test(code);
  check(route, `${route} stores no IP address or user agent`, !stored);
}
/* NO CONSOLE CALL HOLDS WHAT THE READER TYPED (cleanup round 2, item 4). The newsletter route logged the address when an insert
   failed ("would insert: <email>"): a console line reaches the host's logs and, as a breadcrumb, every error report Sentry sends
   (its trail holds console lines, which the privacy page now says). A failure is logged with the error's code and message and
   nothing the reader wrote. The scan is the route's syntax, not its text: any variable inside a console call's arguments named for
   what was typed (the address, the raw body value, the row built from it, the body, a message, a name) reds, whatever it is wrapped
   in; a property read off another object (error.message) is not a variable.
   THE DATABASE'S REPLY IS HELD TO THE SAME RULE (critique pass 3, fix round D2, cleanup item 25). The contact and correction routes
   logged `await r.text()`, the reply body of a failed insert, and PostgREST's body carries a `details` field that can echo the row
   the reader typed ("Failing row contains (...)", "Key (email)=(...) already exists"): a call result never passed the name scan above,
   because the scan reads variable names and a call has none. A failure is logged with the status and the reply's `code` and
   `message`, read from the parsed reply, as the newsletter route logs error.code and error.message. So a console call reds on a body
   read in its arguments (text, json, blob, arrayBuffer, formData, however wrapped or chained), and on a variable that holds a body
   read (a parsed reply) used in it for anything but its `code` and `message`: the whole reply, its `details`, a stringified copy.
   BLIND SPOT: it reads names and calls, so a reply copied into a variable called something else, or a body read stored by a helper
   and logged through a logger that is not `console`, would pass; the three routes hold neither today. The scan is held to what it
   hunts by the samples below, which run it on seven inline sources. */
const TYPED = new Set(["email", "raw", "row", "body", "message", "name"]);
const BODY_READS = new Set(["text", "json", "blob", "arrayBuffer", "formData"]);
const REPLY_FIELDS = new Set(["code", "message"]);
const isBodyRead = (m: ts.Node): m is ts.CallExpression => ts.isCallExpression(m) && ts.isPropertyAccessExpression(m.expression) && BODY_READS.has(m.expression.name.text);
const holdsBodyRead = (m: ts.Node): boolean => { let hit = false; const walk = (x: ts.Node): void => { if (isBodyRead(x)) hit = true; if (!hit) ts.forEachChild(x, walk); }; walk(m); return hit; };
function consoleCallsHoldingSource(file: string, text: string): string[] {
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  /* THE VARIABLES THAT HOLD A PARSED REPLY: any declared from an initializer that reads a body (`const reply = await r.json().catch(...)`). */
  const replies = new Set<string>();
  const collect = (n: ts.Node): void => { if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && n.initializer && holdsBodyRead(n.initializer)) replies.add(n.name.text); ts.forEachChild(n, collect); };
  collect(sf);
  const found: string[] = [];
  const visit = (n: ts.Node): void => {
    if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && ts.isIdentifier(n.expression.expression) && n.expression.expression.text === "console") {
      const seen = new Set<string>();
      const reads = new Set<string>();
      const look = (m: ts.Node): void => {
        const isPropertyName = ts.isIdentifier(m) && ts.isPropertyAccessExpression(m.parent) && m.parent.name === m;
        if (ts.isIdentifier(m) && !isPropertyName) {
          if (TYPED.has(m.text)) seen.add(m.text);
          const onlyCodeOrMessage = ts.isPropertyAccessExpression(m.parent) && m.parent.expression === m && REPLY_FIELDS.has(m.parent.name.text);
          if (replies.has(m.text) && !onlyCodeOrMessage) reads.add(`the parsed reply in ${m.text}`);
        }
        if (isBodyRead(m)) reads.add(`a reply body read, ${(m.expression as ts.PropertyAccessExpression).name.text}()`);
        ts.forEachChild(m, look);
      };
      n.arguments.forEach(look);
      const line = sf.getLineAndCharacterOfPosition(n.getStart()).line + 1;
      if (seen.size) found.push(`console.${n.expression.name.text} on line ${line} names ${[...seen].join(" and ")}`);
      if (reads.size) found.push(`console.${n.expression.name.text} on line ${line} holds ${[...reads].join(" and ")}`);
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return found;
}
const LOG_REMEDY = "log a failure with the status and the reply's code and message only, read from the parsed reply (`const reply = await r.json().catch(() => null)`, then r.status, reply?.code, reply?.message), as the newsletter route logs error.code and error.message; never the address, `await r.text()`, the parsed reply itself or its details: the database's reply can echo the row the reader typed, and a console line reaches the host's logs and, as a breadcrumb, every error report";
for (const route of ROUTES) {
  const held = consoleCallsHoldingSource(route, readFileSync(route, "utf8"));
  check(route, `${route} logs nothing the reader typed and nothing of the database's reply but its code and message: no console call names the address, the body or the row, or holds a reply's body (${held.join(", ") || "none"})`, held.length === 0, LOG_REMEDY);
}
/* THE SCAN SEES WHAT IT HUNTS: seven inline sources, six that must red and the form the routes now use that must not. */
const SAMPLES: Array<[string, string, number]> = [
  ["a body read in a console call: await r.text()", `async function f(r: Response) { console.error("x", r.status, await r.text()); }`, 1],
  ["a body read in a console call: await r.json()", `async function f(r: Response) { console.error("x", await r.json()); }`, 1],
  ["a chained read: (await r.json()).details", `async function f(r: Response) { console.error("x", (await r.json()).details); }`, 1],
  ["the parsed reply logged whole", `async function f(r: Response) { const reply = await r.json(); console.error("x", reply); }`, 1],
  ["the parsed reply's details", `async function f(r: Response) { const reply = await r.json().catch(() => null); console.error("x", reply?.details); }`, 1],
  ["the parsed reply stringified", `async function f(r: Response) { const reply = await r.json(); console.error("x", JSON.stringify(reply)); }`, 1],
  ["the status, code and message of the parsed reply: the form the routes use", `async function f(r: Response) { const reply = await r.json().catch(() => null); console.error("x", r.status, reply?.code, reply?.message); }`, 0],
];
const sampled = SAMPLES.map(([label, src, want]) => ({ label, want, got: consoleCallsHoldingSource("sample.ts", src).length }));
check("tests/trust/forms_store_nothing_more.test.ts", `the console scan sees what it hunts: it reds on ${sampled.filter((s) => s.want > 0).length} sources that log a reply's body, its parsed reply or its details, and passes the status, code and message (${sampled.filter((s) => s.got !== s.want).map((s) => `${s.label}: ${s.got}, wanted ${s.want}`).join("; ") || "all seven as wanted"})`, sampled.every((s) => s.got === s.want), "keep consoleCallsHoldingSource red on a body read inside a console call and on a parsed reply used for anything but its code and message");
const privacy = readFileSync("src/app/(site)/privacy/page.tsx", "utf8");
check("src/app/(site)/privacy/page.tsx", "the privacy page still promises what this holds", privacy.includes("what you gave us and nothing more"));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("trust/forms_store_nothing_more: all pass");
