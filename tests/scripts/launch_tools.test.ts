/**
 * THE LAUNCH TOOLS SAY WHAT THE CHECKLIST SAYS (2026-10-06). LAUNCH-SWITCHES row 13 passes --marker-url to deploy:watch,
 * which read only --url; the watcher would have polled /gb for a line only the home page prints. And Git Bash rewrites a
 * bare "/" into a Windows folder ("C:/Program Files/Git/") before node sees it, which the watcher fetched as an unknown
 * scheme for the whole of its deadline. Run: npx tsx tests/scripts/launch_tools.test.ts
 */
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync as wf, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { watchArgs } from "../../scripts/lib/watch_args.mjs";
import { rebuildLaunchBranch, withoutPrivateLine } from "../../scripts/launch_branch.mjs";

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

const withBuild = spawnSync(process.execPath, ["scripts/verify_deploy.mjs", "--build", "--print-steps"], { encoding: "utf8" });
check(
  "verify:deploy --build lists the chain, next build, then postbuild, as npm run build runs them",
  withBuild.status === 0 && /^the gate chain/m.test(withBuild.stdout) && /^next build/m.test(withBuild.stdout) && /^postbuild: npm run postbuild/m.test(withBuild.stdout),
  (withBuild.stdout + withBuild.stderr).slice(0, 300),
);
const chainOnly = spawnSync(process.execPath, ["scripts/verify_deploy.mjs", "--print-steps"], { encoding: "utf8" });
check("verify:deploy without --build lists the chain alone", chainOnly.status === 0 && !/next build|postbuild/.test(chainOnly.stdout), chainOnly.stdout.slice(0, 300));

const repo = mkdtempSync(join(tmpdir(), "launch-branch-"));
const g = (...args: string[]) => execFileSync("git", args, { cwd: repo, encoding: "utf8" }).trim();
g("init", "-q", "-b", "main");
g("config", "user.email", "test@example.com");
g("config", "user.name", "Test");
wf(join(repo, ".env.production"), "# public flags only\nNEXT_PUBLIC_SITE_PRIVATE=1\n");
wf(join(repo, "a.txt"), "one\n");
g("add", "-A");
g("commit", "-q", "-m", "base");
const first = rebuildLaunchBranch({ cwd: repo });
check("the branch is one commit on main", g("rev-parse", "launch-day~1") === g("rev-parse", "main"));
check("its only change: one line out of .env.production", g("diff", "--numstat", "main", "launch-day") === "0\t1\t.env.production");
check("the private key is gone from the branch's file", !g("show", "launch-day:.env.production").includes("NEXT_PUBLIC_SITE_PRIVATE"));
wf(join(repo, "a.txt"), "two\n");
g("commit", "-q", "-am", "main moves");
const second = rebuildLaunchBranch({ cwd: repo });
check("rebuilt after main moves, it sits on the new main", g("rev-parse", "launch-day~1") === g("rev-parse", "main") && second.commit !== first.commit);
let threw = false;
try { withoutPrivateLine("A=1\nB=2\n"); } catch { threw = true; }
check("a file without the private line is refused, not committed", threw);
rmSync(repo, { recursive: true, force: true });

if (failed > 0) { console.error(`scripts/launch_tools: ${failed} failure(s). Remedy: make each FAIL line above pass in the file it names (scripts/lib/watch_args.mjs for the flags), then run npx tsx tests/scripts/launch_tools.test.ts`); process.exit(1); }
console.log("scripts/launch_tools: all pass");
