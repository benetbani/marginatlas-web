/**
 * THE LAUNCH TOOLS SAY WHAT THE CHECKLIST SAYS (2026-10-06). LAUNCH-SWITCHES row 13 passes --marker-url to deploy:watch,
 * which read only --url; the watcher would have polled /gb for a line only the home page prints. And Git Bash rewrites a
 * bare "/" into a Windows folder ("C:/Program Files/Git/") before node sees it, which the watcher fetched as an unknown
 * scheme for the whole of its deadline. verify:deploy --build runs the steps npm run build runs, in its order. And
 * launch:branch (row 12) rebuilds launch-day as one commit on main that takes the private line out of .env.production and
 * changes nothing else, whatever the file's endings or mode, proven on a throwaway repository with git's system and
 * global config, ignore and attributes files shut out. Run: npx tsx tests/scripts/launch_tools.test.ts
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync as wf } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { watchArgs } from "../../scripts/lib/watch_args.mjs";
import { LAUNCH_INDEX, gitEnv, rebuildLaunchBranch, refusalLine, withoutPrivateLine } from "../../scripts/launch_branch.mjs";

let failed = 0;
function check(name: string, ok: boolean, detail = "") {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${!ok && detail ? ` :: ${detail.trim()}` : ""}`);
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
  "verify:deploy --build lists the chain, next build, then postbuild, in the order npm run build runs them",
  withBuild.status === 0 && /^the gate chain[\s\S]*^next build[\s\S]*^postbuild: npm run postbuild/m.test(withBuild.stdout),
  (withBuild.stdout + withBuild.stderr).slice(0, 300),
);
const chainOnly = spawnSync(process.execPath, ["scripts/verify_deploy.mjs", "--print-steps"], { encoding: "utf8" });
check(
  "verify:deploy without --build lists the chain alone",
  chainOnly.status === 0 && /^the gate chain/m.test(chainOnly.stdout) && !/next build|postbuild/.test(chainOnly.stdout),
  chainOnly.stdout.slice(0, 300),
);

const refusal = (fn: () => unknown) => {
  try { fn(); return ""; } catch (err) { return refusalLine(err); }
};
const none = refusal(() => withoutPrivateLine("A=1\nB=2\n"));
check("a file without the private line is refused", none.includes("found 0"), none);
const twice = refusal(() => withoutPrivateLine("NEXT_PUBLIC_SITE_PRIVATE=1\nNEXT_PUBLIC_SITE_PRIVATE=0\n"));
check("a file with the private line twice is refused", twice.includes("found 2"), twice);

/* launch:branch on a throwaway repository: no system config (Git for Windows sets core.autocrlf=true there), an empty
   global config, ignore and attributes file, and no repository variables inherited from a hook, so the bytes written
   are the bytes committed. */
const root = mkdtempSync(join(tmpdir(), "launch-branch-"));
const repo = join(root, "repo");
const empty = join(root, "empty");
const isolated = { GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: empty };
const saved = Object.fromEntries(Object.keys(isolated).map((key) => [key, process.env[key]]));
const cliPath = resolve("scripts/launch_branch.mjs");
const gitIn = (args: string[]) => execFileSync("git", args, { cwd: repo, env: gitEnv(), encoding: "buffer", stdio: ["pipe", "pipe", "pipe"] });
const g = (...args: string[]) => gitIn(args).toString("utf8").trim();
const blobOf = (rev: string) => gitIn(["cat-file", "blob", `${rev}:.env.production`]).toString("latin1");
const commitEnv = (bytes: string, message: string) => {
  wf(join(repo, ".env.production"), Buffer.from(bytes, "latin1"));
  g("add", "-A");
  g("commit", "-q", "-m", message);
};
const cli = () => spawnSync(process.execPath, [cliPath], { cwd: repo, env: gitEnv(), encoding: "utf8" });
const launchDay = () => g("rev-parse", "launch-day");
const indexGone = () => !existsSync(join(repo, ".git", LAUNCH_INDEX));
const oneLineOut = () => g("diff", "--numstat", "main", "launch-day") === "0\t1\t.env.production";
try {
  Object.assign(process.env, isolated);
  wf(empty, "");
  mkdirSync(repo);
  g("init", "-q", "-b", "main");
  g("config", "user.email", "test@example.com");
  g("config", "user.name", "Test");
  g("config", "core.excludesFile", empty);
  g("config", "core.attributesFile", empty);
  wf(join(repo, "a.txt"), "one\n");
  commitEnv("# public flags only\nNEXT_PUBLIC_SITE_PRIVATE=1\n", "base");
  const first = rebuildLaunchBranch({ cwd: repo });
  check("the branch is one commit on main", g("rev-parse", "launch-day~1") === g("rev-parse", "main"));
  check("its only change: one line out of .env.production", oneLineOut());
  check("the private key is gone from the branch's file", blobOf("launch-day") === "# public flags only\n");
  check("the temporary index is removed and the working tree untouched", indexGone() && g("status", "--porcelain") === "" && g("symbolic-ref", "HEAD") === "refs/heads/main");
  wf(join(repo, "a.txt"), "two\n");
  g("commit", "-q", "-am", "main moves");
  const second = rebuildLaunchBranch({ cwd: repo });
  check("rebuilt after main moves, it sits on the new main", g("rev-parse", "launch-day~1") === g("rev-parse", "main") && second.commit !== first.commit);
  g("update-index", "--chmod=+x", ".env.production");
  g("commit", "-q", "-m", "the env file marked executable");
  rebuildLaunchBranch({ cwd: repo });
  check("the file's mode is read from main, not assumed", g("ls-tree", "launch-day", "--", ".env.production").startsWith("100755 ") && oneLineOut());
  const good = cli();
  check(
    "the command, on a good file, prints its two lines and exits 0",
    good.status === 0 && good.stderr === "" && /^launch-day: [0-9a-f]{8}, one commit on main [0-9a-f]{8} that deletes the private line and adds nothing\nPush it on launch day/.test(good.stdout) && oneLineOut(),
    `${good.status} ${good.stderr.slice(0, 200)}`,
  );

  commitEnv("# public flags only\r\nA=1\nNEXT_PUBLIC_SITE_PRIVATE=1", "the private line last, with no newline");
  rebuildLaunchBranch({ cwd: repo });
  check("the private line last with no newline: one line out, the others byte for byte", oneLineOut() && blobOf("launch-day") === "# public flags only\r\nA=1\n");
  commitEnv("# caf\xe9\r\nNEXT_PUBLIC_SITE_PRIVATE=1\r\nB=2\n", "mixed endings and a byte that is not UTF-8");
  rebuildLaunchBranch({ cwd: repo });
  check("mixed endings and a non-UTF-8 byte: one line out, the others byte for byte", oneLineOut() && blobOf("launch-day") === "# caf\xe9\r\nB=2\n");

  const before = launchDay();
  commitEnv("A=\0\nNEXT_PUBLIC_SITE_PRIVATE=1\n", "a file git counts as binary");
  const binary = refusal(() => rebuildLaunchBranch({ cwd: repo }));
  check("a change git cannot count as one deleted line is refused, the branch unmoved", binary.includes("diff-tree --numstat") && launchDay() === before && indexGone(), binary);
  commitEnv("A=1\nB=2\n", "no private line");
  const refused = cli();
  check(
    "the command refuses a file without the private line in one line, exit 1, the branch unmoved",
    refused.status === 1 && refused.stdout === "" && /^launch:branch: expected exactly one [^\n]*\n$/.test(refused.stderr) && launchDay() === before && indexGone(),
    `${refused.status} ${refused.stderr.slice(0, 200)}`,
  );
  g("rm", "-q", ".env.production");
  g("commit", "-q", "-m", "no env file");
  const missing = refusal(() => rebuildLaunchBranch({ cwd: repo }));
  check("a main without the env file is refused, the branch unmoved", missing.includes("missing from main") && launchDay() === before, missing);
  g("checkout", "-q", "launch-day");
  const checkedOut = refusal(() => rebuildLaunchBranch({ cwd: repo }));
  check("never rebuilt while a worktree has it checked out", checkedOut.includes("checked out") && launchDay() === before, checkedOut);
} catch (err) {
  check("the launch-branch checks ran to the end", false, refusalLine(err));
} finally {
  for (const [key, value] of Object.entries(saved)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  rmSync(root, { recursive: true, force: true });
}

if (failed > 0) { console.error(`scripts/launch_tools: ${failed} failure(s). Remedy: make each FAIL line above pass in the file it names (scripts/lib/watch_args.mjs for the watch flags, scripts/verify_deploy.mjs for the steps, scripts/launch_branch.mjs for the launch branch), then run npx tsx tests/scripts/launch_tools.test.ts`); process.exit(1); }
console.log("scripts/launch_tools: all pass");
