/**
 * No session recording, only cookie-free counting, and only once switched on (milestone 1, M2; his interview of 2026-09-26,
 * answer 7: "Clarity removed; cookie-free analytics (Vercel Web Analytics or Plausible), no banner").
 *
 * BLIND SPOT, stated: it reads source, so a recorder injected by a third-party script at run time, or added in a file this list
 * does not name, passes. The list is every file that rendered a tracker on 2026-10-04 (the root layout) and the two pages that
 * describe what runs.
 *
 * Run: npx tsx tests/app/no_session_recording.test.ts
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "no-session-recording";
const FILE = "src/app/layout.tsx";
const REMEDY = "no session recorder on the site; analytics only through src/lib/site/web_analytics.ts, cookie-free, behind its switch";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const code = (p: string) => stripCommentLines(readFileSync(p, "utf8").split("\n")).join("\n");
const RECORDERS = /clarity\.ms|hotjar|fullstory|mouseflow|smartlook|logrocket|luckyorange|inspectlet/i;

/* Every source file under src/app and src/components, so a recorder cannot come back by another route either. */
const files: string[] = [];
const walk = (dir: string) => { for (const n of readdirSync(dir, { withFileTypes: true })) { const p = join(dir, n.name); if (n.isDirectory()) walk(p); else if (/\.(tsx?|jsx?)$/.test(n.name)) files.push(p); } };
walk("src/app");
walk("src/components");
const loaders = files.filter((f) => RECORDERS.test(code(f)));
check(`no session recorder's loader in the site's code${loaders.length ? `: ${loaders.join(", ")}` : ""}`, loaders.length === 0);

const layout = code(FILE);
check("the layout loads analytics only behind the switch", /WEB_ANALYTICS_ON\s*\?/.test(layout) && layout.includes("/_vercel/insights/script.js"));
for (const page of ["src/app/(site)/privacy/page.tsx", "src/app/(site)/cookies/page.tsx"]) {
  check(`${page} names no session recorder`, !/Clarity|session recording/i.test(code(page)));
  check(`${page} describes the visit count behind the same switch`, /WEB_ANALYTICS_ON\s*\?/.test(code(page)));
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("app/no_session_recording: all pass");
