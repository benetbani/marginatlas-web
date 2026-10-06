/**
 * THE LAUNCH TOOLS SAY WHAT THE CHECKLIST SAYS (2026-10-06). LAUNCH-SWITCHES row 13 passes --marker-url to deploy:watch,
 * which read only --url; the watcher would have polled /gb for a line only the home page prints. And Git Bash rewrites a
 * bare "/" into a Windows folder ("C:/Program Files/Git/") before node sees it, which the watcher fetched as an unknown
 * scheme for the whole of its deadline. Run: npx tsx tests/scripts/launch_tools.test.ts
 */
import { watchArgs } from "../../scripts/lib/watch_args.mjs";

let failed = 0;
function check(name: string, ok: boolean, detail = "") {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` :: ${detail}` : ""}`);
}

const a = watchArgs(["--marker=x", "--url=/"]);
check("--url names the address", a.url === "https://marginatlas.com/", JSON.stringify(a));
const b = watchArgs(["--marker=x", "--marker-url=/"]);
check("--marker-url names it too, as launch:check reads it (row 13)", b.url === "https://marginatlas.com/", JSON.stringify(b));
const c = watchArgs(["--marker=x"]);
check("no address flag: /gb, as before", c.url === "https://marginatlas.com/gb", JSON.stringify(c));
const d = watchArgs(["--marker=x", "--url=C:/Program Files/Git/"]);
check("a path Git Bash rewrote is refused with the remedy", typeof d.error === "string" && d.error.includes("MSYS_NO_PATHCONV"), JSON.stringify(d));
const e = watchArgs(["--marker=x", "--minutes=3"]);
check("--minutes is read", e.minutes === 3, JSON.stringify(e));
check("--marker is read", watchArgs(["--marker=if you form a company"]).marker === "if you form a company");

if (failed > 0) { console.error(`scripts/launch_tools: ${failed} failure(s). Remedy: make each FAIL line above pass in the file it names (scripts/lib/watch_args.mjs for the flags), then run npx tsx tests/scripts/launch_tools.test.ts`); process.exit(1); }
console.log("scripts/launch_tools: all pass");
