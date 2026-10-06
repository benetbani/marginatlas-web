# What is left: marginatlas after the deep goal (2026-10-06) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn everything still open on marginatlas into either a verified fix or a named decision of his, in launch order.

**Architecture:** Four batches of code, each green on its own gates before the next: the launch tools made true (1), the two routing branches another session left, replayed onto today's main with their two hidden breaks fixed (2), the QUEUE's 116 open rows set to what the code says today (3), and the launch-page fixes the verified rows call for (4). His launch day stays his checklist (`LAUNCH-SWITCHES.md`); his open decisions are listed once, each with a recommendation.

**Tech Stack:** Next.js 15 (App Router), TypeScript, tsx-run gate scripts (`scripts/prebuild_all.ts`), Supabase, Stripe, Vercel; the design repo `E:/atlas` (QUEUE, DATA-REQUIREMENTS, registers).

**Ground rules (binding on every task):** no push, deploy, merge into main or force-push without his word; no Stripe, Supabase,
Vercel or DNS setting changed; no migration applied; no `.env` value printed; no install or download; no invented figure; one
change, one verification, then a commit; `tsc --noEmit` after any restore or late fix (the chain runs no typecheck); patches
holding a backslash go through the Edit tool, never a Bash heredoc (it turns `\b` into a backspace).

---

## Where things stand (measured 2026-10-06, evening)

- Production: `main` 50ecd9e5, every switch off, proven on production 23 of 23. The site's own launch check, run read-only
  against production: items c to i all ok (tables, sample marks, a11y 0 findings, every door landing, every launch-blocking data
  requirement closed or withheld, no filled money figure, the home page's counts its own); items a and b need a browser render
  and a fresh chain. Absent from the live database, as expected until launch row 2: `saved_cells`, `profiles`, `watchlist`,
  `subscriptions`, `billing_events`.
- The QUEUE's 116 open rows, each verified against today's code by three read-only reviews (three of their claims spot-checked
  by hand, all three right): **43 already done**, **17 stale** (the section they describe was replaced), **10 his**, **46 still
  true**: 1 now blocking launch (`uk:cities-sourced-or-marked`, promoted: the six other UK city pages print their shards' rents,
  costs and pay as fact, and the paywall will sell those pages), 10 that help launch pages, 35 for later.
- Two branches another session left: `dotted-404` (4 commits, on GitHub as a preview branch) and `junk-url-real-middleware`
  (1 commit, local). A trial rebase of each onto main applied with no conflict and is wrong in two places (Batch 2).
- Three launch tools say something other than the checklist (Batch 1): row 13's `--marker-url` is a flag `deploy:watch` never
  reads; `verify:deploy -- --build` skips the postbuild guard that failed 56dd5b10; the launch branch's rebuild lives in a
  scratch folder.

## The order

| When | What | Who |
|---|---|---|
| Now | Batch 1: the launch tools and rows 12 and 13 made true | code |
| Now | Batch 2: `routing-hardening` built and verified; deployed on his word (D3) | code, then his word |
| Now | Batch 3: the QUEUE set to what the code says | records |
| Now | Batch 4: the launch-page fixes (4.1 on his D2) | code |
| Next plans | `uk:cities-sourced-or-marked`, `edge:place-segment`, the three small HELPS rows (below) | code, each its own plan |
| Before launch day | D1: a Pro purchase rehearsed in Stripe's test mode | his clicks, then our checks |
| Launch day | `LAUNCH-SWITCHES.md`, rows 1 to 15 | his |
| After launch | P36.3, the reconcile, the depth notices, the data track | each its own plan |

## What is his

### Launch day

`LAUNCH-SWITCHES.md`, top to bottom: the legal drafts' gaps (row 1, P30.2: name or company, its number, the address, the VAT
number), four SQL files (row 2), the email provider and SMTP (row 3), Stripe's product, prices, portal, checkout terms, tax,
receipts and live keys (rows 4 to 9), ten production variables (row 10), analytics (row 11), the launch branch pushed (row 12,
as Batch 1 rewrites it), the watch and the launch check (row 13, as Batch 1 rewrites it), Search Console (row 14), the posts (row 15).

### Decisions, each with the recommendation

| # | Decision | Recommendation | Why |
|---|---|---|---|
| D1 | Rehearse a Pro purchase in Stripe's test mode before launch day | Yes: run row 2's four SQL files early (they add tables and match live's security), then one test purchase with test keys on a preview, then `npm run billing:reconcile` | A2, A3 and A4 have never run against Stripe; launch day is the wrong day to meet their first fault. A preview needs Vercel's protection bypass for Stripe's webhook (a setting, his) |
| D2 | UK trade pages outside London (`/gb/manchester/restaurants`: 200, a full page today) when the paywall goes on | Lock them as London's are (Task 4.1) | They are UK pages (ruling 27); open by address, they hand out what London's lock |
| D3 | Deploy `routing-hardening` (Batch 2) | Yes, a week before launch | Made-up dotted addresses stop drawing pages at 200; the widened matcher costs one middleware run per image, cheap once Task 2.1 keeps the session refresh off files |
| D4 | An email sender for the depth notices and the privacy page's "a link in every email" | Choose one before the first notice is due | Addresses are collected for "notify me when my city reaches this depth"; nothing can send one yet |
| D5 | Magic links across devices | Leave as is at launch | /signin says when a link fails; the template change can follow real complaints |
| D6 | Confirm what `past_due` means for Pro | Confirm as built: Pro stays on while Stripe retries (`src/lib/monetization/stripe_sync.ts:82`) | Cutting a reader off on the first failed card loses the renewal Stripe was retrying |
| D7 | The 15 dependencies nothing imports | Remove them in one commit with a fresh lockfile, after launch | A lockfile rewrite is an install; not a launch-week risk |
| D8 | 98 GB of worktrees; `E:/atlas` has no remote and 12,477 loose objects | Delete the four clean stale worktrees; give `E:/atlas` a private remote; `git gc` | Every ruling and register lives in that repo, with no copy off this machine |
| D9 | Generating the presence manifest (about 26,000 production lookups; unpublishes synthesized pages) | After launch, with the list it would unpublish in front of him | It removes pages: a scope decision, not a fix |
| D10 | `/saved`, which nothing writes | Keep it hidden until a save control exists | /account already hides the empty list |
| D11 | The hero's rotating-word gaps | His design; untouched | Named, not changed |
| D12 | `industry:route-resolves-to-parent`: four slugs (tiling, bricklaying, plastering, alarm installs) render their measured parent's page under their own URL | 404 them until each has figures of its own | The row offers his ruling between the two; a page that prints another trade's figures under a trade's name is the thing the copy rules forbid |
| D13 | The QUEUE's ten HIS rows: `country:character-pair-vs-clause-64`, `launch:ruling-30-or-the-seat`, `launch:publish-the-form-catalogue`, `research:search-cap`, `design:chapter-links`, `design:chapter-picture`, `design:icon-seat-lists`, `hood:crowd` (data item 79), `city:streets` (data budget), `launch:deploy-head-with-marker` (row 13 on launch day) | Rule the first seven in one sitting; the last three wait on data or on launch day | Each holds a page or a gate back |

---

## File structure

| File | Batch | Responsibility |
|---|---|---|
| `scripts/lib/watch_args.mjs` (new) | 1.1 | Reads a watcher's flags; refuses an address Git Bash rewrote |
| `scripts/deploy_watch.mjs` | 1.1 | Uses the helper |
| `scripts/verify_launch_ready.ts` | 1.1 | The same refusal for `--marker-url` |
| `scripts/verify_deploy.mjs` | 1.2 | Runs prebuild, build and postbuild, as `npm run build` does; `--print-steps` |
| `scripts/launch_branch.mjs` (new) | 1.3 | Rebuilds `launch-day` on main with git plumbing |
| `tests/scripts/launch_tools.test.ts` (new) | 1.1 to 1.3 | Gate `launch-tools` |
| `scripts/prebuild_all.ts`, `package.json` | 1.1, 1.3 | The gate registered; `launch:branch` |
| `docs/superpowers/plans/2026-10-05-masterplan/LAUNCH-SWITCHES.md` | 1.4 | Rows 12 and 13 |
| `src/lib/supabase/middleware_session.ts`, `tests/auth/session_refresh.test.ts` | 2.1 | No session refresh for a file |
| `tests/routing/junk_url_rule.test.ts` | 2.2 | The replayed test, on today's middleware |
| `src/lib/routing/served_files.ts` (regenerated) | 2.3 | The files the site serves |
| `E:/atlas/design/loop/build/QUEUE.md`, `scratchpad/_queue_truth.py` (not committed) | 3 | The truth pass |
| `src/lib/monetization/pro_route.ts`, `tests/monetization/pro_route.test.ts` | 4.1 | D2's lock |
| `src/app/(site)/cities/[slug]/neighborhoods/[district]/page.tsx` | 4.2 | The district title |
| `src/app/(site)/extremes/page.tsx`, `src/components/extremes/LensFilter.tsx` (deleted), `tests/trust/no_lens_chips.test.ts` (new) | 4.3 | No chip row |
| `E:/atlas/registers/uk/export_for_site.py`, `data/uk/registers/manifest.json`, `tests/spine/page_foot.test.ts` | 4.4 | The checked date |

---

## Batch 1. Launch day works as written

### Task 1.1: `deploy:watch` takes the address from `--url` or `--marker-url`, and refuses a path the shell rewrote

**Files:**
- Create: `scripts/lib/watch_args.mjs`
- Modify: `scripts/deploy_watch.mjs:22-27`, `scripts/verify_launch_ready.ts:99` and `:127`
- Create: `tests/scripts/launch_tools.test.ts`
- Modify: `scripts/prebuild_all.ts` (register the gate below `build-compare`)

- [ ] **Step 1: Write the failing test**

Create `tests/scripts/launch_tools.test.ts`:

```ts
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

if (failed > 0) { console.error(`scripts/launch_tools: ${failed} failure(s)`); process.exit(1); }
console.log("scripts/launch_tools: all pass");
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx tsx tests/scripts/launch_tools.test.ts`
Expected: an error that `../../scripts/lib/watch_args.mjs` cannot be found.

- [ ] **Step 3: Write the helper**

Create `scripts/lib/watch_args.mjs`:

```js
/**
 * THE WATCHER'S ARGUMENTS (2026-10-06). deploy:watch read the address from --url and launch:check from --marker-url, and
 * LAUNCH-SWITCHES row 13 passes --marker-url to both, so the watcher polled /gb for a line only the home page prints and
 * would have reported a good launch as unseen. Either flag names the address now. Git Bash rewrites a bare "/" argument
 * into a Windows folder ("C:/Program Files/Git/") before node sees it; such a value is refused with the remedy instead of
 * being fetched as an unknown scheme until the deadline.
 */
export function shellMangled(value) {
  return /^[A-Za-z]:[\\/]/.test(String(value ?? ""));
}

export function watchArgs(argv, site = "https://marginatlas.com") {
  const arg = (k) => {
    const a = argv.find((x) => x.startsWith(`--${k}=`));
    return a ? a.slice(k.length + 3) : null;
  };
  const path = arg("url") ?? arg("marker-url") ?? "/gb";
  if (shellMangled(path)) {
    return { error: `the address arrived as "${path}": Git Bash turned "/" into a folder. Run the command from PowerShell, or prefix it with MSYS_NO_PATHCONV=1` };
  }
  return { marker: arg("marker"), url: new URL(path, site).href, minutes: Number(arg("minutes") ?? "15") };
}
```

- [ ] **Step 4: Use it in the watcher**

In `scripts/deploy_watch.mjs`, replace lines 22 to 27:

```js
const argv = process.argv.slice(2);
const arg = (k, d) => { const a = argv.find((x) => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const marker = arg("marker", null);
const url = new URL(arg("url", "/gb"), "https://marginatlas.com").href;
const minutes = Number(arg("minutes", "15"));
if (!marker) { console.error("deploy_watch: --marker=<string the new deploy puts on the page> is required"); process.exit(2); }
```

with:

```js
import { watchArgs } from "./lib/watch_args.mjs";

const parsed = watchArgs(process.argv.slice(2));
if (parsed.error) { console.error(`deploy_watch: ${parsed.error}`); process.exit(2); }
const { marker, url, minutes } = parsed;
if (!marker) { console.error("deploy_watch: --marker=<string the new deploy puts on the page> is required"); process.exit(2); }
```

and change its header's usage line (line 7) to: ` *   npm run deploy:watch -- --marker='data-archetype="city-cards"' [--url=/gb | --marker-url=/gb] [--minutes=15]`.

- [ ] **Step 5: Give launch:check the same refusal**

In `scripts/verify_launch_ready.ts`, below line 99 (`import { preflight } from "./harness/preflight.mjs";`), add:

```ts
import { shellMangled } from "./lib/watch_args.mjs";
```

and after line 127 (`const MARKER_URL = arg("marker-url", "/gb")!;`), add:

```ts
if (shellMangled(MARKER_URL)) {
  console.error(`launch:check: the address arrived as "${MARKER_URL}": Git Bash turned "/" into a folder. Run it from PowerShell, or prefix it with MSYS_NO_PATHCONV=1`);
  process.exit(2);
}
```

- [ ] **Step 6: Run the test, then the watcher against production**

Run: `npx tsx tests/scripts/launch_tools.test.ts`
Expected: six PASS lines, then `scripts/launch_tools: all pass`.
Run (Git Bash): `MSYS_NO_PATHCONV=1 node scripts/deploy_watch.mjs --marker=data-home-notify --marker-url=/ --minutes=1`
Expected: `LIVE: https://marginatlas.com/ serves the marker data-home-notify` on the first poll.
Run (Git Bash, no prefix): `node scripts/deploy_watch.mjs --marker=x --url=/`
Expected: exit 2 at once, the message naming MSYS_NO_PATHCONV.

- [ ] **Step 7: Register the gate and commit**

In `scripts/prebuild_all.ts`, below `{ name: "build-compare", script: "tests/scripts/build_compare.test.ts" },` add:

```ts
  /* The launch tools read the flags the launch checklist passes, and refuse an address the shell rewrote (2026-10-06). */
  { name: "launch-tools", script: "tests/scripts/launch_tools.test.ts" },
```

Run: `git add scripts/lib/watch_args.mjs tests/scripts/launch_tools.test.ts && npx tsx scripts/counts.ts --write`
Run: `npx tsx scripts/prebuild_all.ts --concurrency=1 --no-bail --only=launch-tools,counts-fresh,single-gate-chain`
Expected: `Passed: 3`, `Failed: 0`.

```bash
git add scripts/lib/watch_args.mjs scripts/deploy_watch.mjs scripts/verify_launch_ready.ts tests/scripts/launch_tools.test.ts scripts/prebuild_all.ts scripts/gates.json CLAUDE.md
git commit -m "Launch tools: deploy:watch reads --marker-url as row 13 passes it, and both refuse a path Git Bash rewrote"
```

### Task 1.2: `verify:deploy -- --build` runs what `npm run build` runs, postbuild included

**Files:**
- Modify: `scripts/verify_deploy.mjs` (the body below the header)
- Modify: `tests/scripts/launch_tools.test.ts` (two checks)

- [ ] **Step 1: Write the failing checks**

In `tests/scripts/launch_tools.test.ts`, add beside the first import:

```ts
import { spawnSync } from "node:child_process";
```

and above the final `if (failed > 0)` line:

```ts
const withBuild = spawnSync(process.execPath, ["scripts/verify_deploy.mjs", "--build", "--print-steps"], { encoding: "utf8" });
check(
  "verify:deploy --build lists the chain, next build, then postbuild, as npm run build runs them",
  withBuild.status === 0 && /^the gate chain/m.test(withBuild.stdout) && /^next build/m.test(withBuild.stdout) && /^postbuild: npm run postbuild/m.test(withBuild.stdout),
  (withBuild.stdout + withBuild.stderr).slice(0, 300),
);
const chainOnly = spawnSync(process.execPath, ["scripts/verify_deploy.mjs", "--print-steps"], { encoding: "utf8" });
check("verify:deploy without --build lists the chain alone", chainOnly.status === 0 && !/next build|postbuild/.test(chainOnly.stdout), chainOnly.stdout.slice(0, 300));
```

- [ ] **Step 2: Do NOT run the test yet**

The runner as it stands ignores `--print-steps`, so running the test now would start the real chain and a Next build (twenty
minutes and the machine's memory), and stopping it mid-run leaves the chain's own child processes running. The first run is Step 4.

- [ ] **Step 3: Read the steps from package.json and print them on request**

In `scripts/verify_deploy.mjs`, change the `fs` import to `import { mkdirSync, readFileSync, writeFileSync } from "node:fs";` and
replace everything from `preflight({ browser: false, name: "verify_deploy", floor: CHAIN_FLOOR_MB });` to the end of the file with:

```js
const build = process.argv.includes("--build");
const printSteps = process.argv.includes("--print-steps");
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const TSX = [process.execPath, "node_modules/tsx/dist/cli.mjs"];

/* WHAT VERCEL RUNS IS `npm run build`, AND NPM RUNS ITS PRE AND POST HOOKS (2026-10-06): prebuild (the chain), build
   (next build), postbuild (the edge-size guard). This runner skipped postbuild, so a local --build passed where Vercel's
   failed on the guard (56dd5b10). The postbuild step is read from package.json, so a new hook is mirrored with no edit. */
const steps = [
  { name: "the gate chain, serial", cmd: [...TSX, "scripts/prebuild_all.ts", "--concurrency=1", "--no-bail"], file: "chain.txt" },
  ...(build ? [{ name: "next build", cmd: [process.execPath, "node_modules/next/dist/bin/next", "build"], file: "build.txt" }] : []),
  ...(build && pkg.scripts?.postbuild ? [{ name: "postbuild", cmd: ["npm", "run", "postbuild"], file: "postbuild.txt", shell: true }] : []),
];
if (printSteps) {
  for (const s of steps) console.log(`${s.name}: ${s.cmd.join(" ")}`);
  process.exit(0);
}

preflight({ browser: false, name: "verify_deploy", floor: CHAIN_FLOOR_MB });
const out = resolve("scratchpad/deploy");
mkdirSync(out, { recursive: true });

function step(name, cmd, file, shell = false) {
  const t0 = Date.now();
  console.log(`verify:deploy: ${name} ...`);
  const r = spawnSync(cmd[0], cmd.slice(1), { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, shell });
  const text = `$ ${cmd.join(" ")}\n\n${r.stdout ?? ""}${r.stderr ?? ""}`;
  writeFileSync(file, text);
  const secs = ((Date.now() - t0) / 1000).toFixed(0);
  /* The chain's own summary block, printed so the numbers sit beside the exit code and never three lines above it. */
  const i = text.indexOf("=== Summary ===");
  if (i !== -1) console.log(text.slice(i, i + 700).trim());
  console.log(`verify:deploy: ${name} exit ${r.status} in ${secs}s, full output in ${file}`);
  return r.status ?? 1;
}

for (const s of steps) {
  const code = step(s.name, s.cmd, resolve(out, s.file), s.shell === true);
  if (code !== 0) {
    console.log(`verify:deploy: ${s.name} failed; Vercel would fail this push. Read scratchpad/deploy/${s.file}.`);
    process.exit(code);
  }
}
if (!build) console.log("verify:deploy: chain green. The Next build was not run (add --build; it is minutes and a spare gigabyte).");
process.exit(0);
```

In the header's usage block, change the `--build` line to:
` *   npm run verify:deploy -- --build the chain, then next build, then postbuild, each to scratchpad/deploy/`.

- [ ] **Step 4: Run the test**

Run: `npx tsx tests/scripts/launch_tools.test.ts`
Expected: eight PASS lines and `scripts/launch_tools: all pass`.

- [ ] **Step 5: Commit**

```bash
git add scripts/verify_deploy.mjs tests/scripts/launch_tools.test.ts
git commit -m "verify:deploy --build runs postbuild too, as npm run build does on Vercel; --print-steps lists the steps"
```

### Task 1.3: the launch branch is a tested command, not a scratch script

**Files:**
- Create: `scripts/launch_branch.mjs`
- Modify: `package.json` (one script line)
- Modify: `tests/scripts/launch_tools.test.ts` (a temporary-repository check)

- [ ] **Step 1: Write the failing check**

In `tests/scripts/launch_tools.test.ts`, change Task 1.2's `import { spawnSync } from "node:child_process";` to
`import { execFileSync, spawnSync } from "node:child_process";` and add beside the other imports:

```ts
import { mkdtempSync, writeFileSync as wf, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { rebuildLaunchBranch, withoutPrivateLine } from "../../scripts/launch_branch.mjs";
```

and above the final `if (failed > 0)`:

```ts
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
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx tsx tests/scripts/launch_tools.test.ts`
Expected: an error that `../../scripts/launch_branch.mjs` cannot be found.

- [ ] **Step 3: Write the command**

Create `scripts/launch_branch.mjs`:

```js
/**
 * THE LAUNCH BRANCH, REBUILT ON MAIN (2026-10-06). LAUNCH-SWITCHES row 12: launch day pushes one commit on `main` that
 * deletes NEXT_PUBLIC_SITE_PRIVATE from .env.production and adds nothing (his ruling 5). `main` moves until then, so the
 * branch is rebuilt, never rebased by hand: git plumbing in a temporary index, the working tree untouched, and no line of
 * the env file printed (key names and counts only).
 *
 * usage, from E:/atlas/website: npm run launch:branch    (then, on his word: git push origin launch-day:main)
 */
import { execFileSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const PRIVATE_KEY = "NEXT_PUBLIC_SITE_PRIVATE=";

/** The env file without its private line; throws unless exactly one line sets the key. */
export function withoutPrivateLine(text) {
  const nl = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = text.split(nl);
  const hits = lines.filter((l) => l.trim().startsWith(PRIVATE_KEY)).length;
  if (hits !== 1) throw new Error(`expected exactly one ${PRIVATE_KEY} line in .env.production, found ${hits}`);
  return lines.filter((l) => !l.trim().startsWith(PRIVATE_KEY)).join(nl);
}

export function rebuildLaunchBranch({ cwd = process.cwd(), base = "main", branch = "launch-day" } = {}) {
  const git = (args, opts = {}) => execFileSync("git", args, { cwd, encoding: "utf8", ...opts }).trim();
  const baseSha = git(["rev-parse", base]);
  const source = execFileSync("git", ["show", `${baseSha}:.env.production`], { cwd }).toString("utf8");
  const blob = git(["hash-object", "-w", "--stdin"], { input: withoutPrivateLine(source) });
  const index = resolve(cwd, git(["rev-parse", "--git-dir"]), "launch-branch.index");
  if (existsSync(index)) rmSync(index);
  const env = { ...process.env, GIT_INDEX_FILE: index };
  git(["read-tree", baseSha], { env });
  git(["update-index", "--cacheinfo", `100644,${blob},.env.production`], { env });
  const tree = git(["write-tree"], { env });
  rmSync(index);
  const message = [
    "launch day: the site opens; the private line comes off, nothing is added",
    "",
    `His ruling 5 keeps the sample marks off; the sample gate passes a public build while the honesty stands in source. Built on ${base} ${baseSha.slice(0, 8)} by npm run launch:branch. LAUNCH-SWITCHES row 12: push this after his review, nothing else.`,
    "",
  ].join("\n");
  const commit = git(["commit-tree", tree, "-p", baseSha], { input: message });
  git(["update-ref", `refs/heads/${branch}`, commit]);
  return { base: baseSha, commit };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const { base, commit } = rebuildLaunchBranch();
  console.log(`launch-day: ${commit.slice(0, 8)}, one commit on main ${base.slice(0, 8)} that deletes the private line and adds nothing`);
  console.log("Push it on launch day, after his review: git push origin launch-day:main");
}
```

In `package.json`, below `"launch:check": "npx tsx scripts/verify_launch_ready.ts",` add `"launch:branch": "node scripts/launch_branch.mjs",`.

- [ ] **Step 4: Run the test**

Run: `npx tsx tests/scripts/launch_tools.test.ts`
Expected: thirteen PASS lines and `scripts/launch_tools: all pass`.

- [ ] **Step 5: Rebuild the real branch with it and check it**

Run: `npm run launch:branch`
Expected: `launch-day: <hash>, one commit on main <hash> that deletes the private line and adds nothing`.
Run: `git diff --numstat main launch-day`
Expected: `0	1	.env.production`
Run (PowerShell): `$env:NEXT_PUBLIC_SITE_PRIVATE="0"; npx tsx scripts/verify_sample_switch.ts; Remove-Item Env:NEXT_PUBLIC_SITE_PRIVATE`
Expected: `sample-switch: PASS (the site is public, the marks are off by ruling 5, ...)`.

- [ ] **Step 6: Commit**

```bash
git add scripts/launch_branch.mjs package.json tests/scripts/launch_tools.test.ts
git commit -m "npm run launch:branch: the launch branch rebuilt on main by a tested command, its env file never printed"
```

### Task 1.4: launch rows 12 and 13 say what is true today

**Files:**
- Modify: `docs/superpowers/plans/2026-10-05-masterplan/LAUNCH-SWITCHES.md:24-25`

- [ ] **Step 1: Rewrite row 12's "What to do" cell** to:
`Run npm run launch:branch (it rebuilds launch-day as one commit on today's main that deletes NEXT_PUBLIC_SITE_PRIVATE=1 from .env.production and adds nothing), then git push origin launch-day:main. Vercel builds production from main.`
Keep its "What you should see" cell.

- [ ] **Step 2: Rewrite row 13's two commands** to
`npm run deploy:watch -- --marker="if you form a company" --url=/` then `npm run launch:check -- --marker="if you form a company" --marker-url=/`,
followed by: `(From PowerShell. In Git Bash, prefix each with MSYS_NO_PATHCONV=1, or the shell turns "/" into a folder and the tools refuse it.)`

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/2026-10-05-masterplan/LAUNCH-SWITCHES.md
git commit -m "Launch rows 12 and 13: the launch branch by npm run launch:branch, and the watcher's flags as the tools read them"
```

---

## Batch 2. The two routing branches, onto today's main (deploy on his word, D3)

`dotted-404` (4 commits on 4db6389e; on GitHub as a preview branch): a made-up address with a dot in its last part answers 404
at the edge instead of a page at 200, and the middleware's matcher lets every address in. `junk-url-real-middleware` (1 commit
on 12fa8f2f): the junk-URL test asks the real middleware instead of a copy of one rule. A trial rebase of each onto main
(2026-10-06, in a throwaway worktree) applied with no conflict and is still wrong in two places no conflict marks:
- the junk-URL test calls `middleware(...)` and reads `.status`; since A7 `middleware` is async, so every verdict would read a
  Promise; and today's `/download` check calls `wouldBe404`, a helper the branch deleted;
- the dotted branch sends every address but Next's built files through the middleware, which since A7 refreshes the session on
  whatever it answers: with accounts on, every photograph, flag and icon a signed-in reader loads would call Supabase.
Neither branch is rebased in place (`dotted-404` is on GitHub; a rebased copy would need a force-push). Both are replayed onto a
new local branch, `routing-hardening`, which reaches `main` fast-forward, on his word.

### Task 2.1: the session refresh never runs for a file

**Files:**
- Modify: `src/lib/supabase/middleware_session.ts`
- Modify: `tests/auth/session_refresh.test.ts`

- [ ] **Step 1: Write the failing checks**

In `tests/auth/session_refresh.test.ts`, change line 12 to
`import { refreshSessionOn, isFileRequest } from "../../src/lib/supabase/middleware_session";`
and add, just before the `for (const [k, v] of ...` restore loop:

```ts
  check("a photograph's address is a file", isFileRequest("/cities/london.jpeg"));
  check("a data-pack file is a file", isFileRequest("/data/uk/2026.10/readme.md"));
  check("a page and an API route are not files", !isFileRequest("/gb") && !isFileRequest("/gb/london/restaurants") && !isFileRequest("/api/cell-lookup"));
  const src = readFileSync("src/lib/supabase/middleware_session.ts", "utf8");
  check("the file guard stands before the client is made", src.indexOf("isFileRequest(req.nextUrl.pathname)") > -1 && src.indexOf("isFileRequest(req.nextUrl.pathname)") < src.indexOf("createServerClient("));
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx tsx tests/auth/session_refresh.test.ts`
Expected: an error that `isFileRequest` is not exported.

- [ ] **Step 3: Add the helper and the guard**

In `src/lib/supabase/middleware_session.ts`, above `export async function refreshSessionOn`, add:

```ts
/** A request for a file (its last path part has an extension: a photograph, a flag, a font, a pack file, a sitemap shard). It
 *  never needs a session, and since the matcher may send every address through the middleware, refreshing on one would
 *  call Supabase for each image a signed-in reader's page loads. */
export function isFileRequest(pathname: string): boolean {
  return /\.[A-Za-z0-9]{1,10}$/.test(pathname.split("/").pop() ?? "");
}
```

In `refreshSessionOn`, after `if (!isAuthEnabled()) return res;`, add:

```ts
  if (isFileRequest(req.nextUrl.pathname)) return res;
```

In the header, change "Three guards, each for a reason:" to "Four guards, each for a reason:" and add the line
` *  - a file (a photograph, a flag, a font, a pack file): nothing runs; no file needs a session;` after the auth line.

- [ ] **Step 4: Run the test and its neighbours**

Run: `npx tsx tests/auth/session_refresh.test.ts`
Expected: every line PASS and `auth/session_refresh: all pass`.
Run: `npx tsx scripts/prebuild_all.ts --concurrency=1 --no-bail --only=session-refresh,metadata-routes,junk-url-rule,edge-not-found`
Expected: `Passed: 4`, `Failed: 0`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/supabase/middleware_session.ts tests/auth/session_refresh.test.ts
git commit -m "The session refresh never runs for a file: no Supabase call for each photograph a signed-in reader loads"
```

### Task 2.2: the junk-URL branch, replayed and corrected

**Files:**
- Modify (after the replay): `tests/routing/junk_url_rule.test.ts`

- [ ] **Step 1: Replay the commit onto a new branch**

```bash
git switch -c routing-hardening main
```
```bash
git cherry-pick aac6bb45
```
Expected: a new commit, no conflict. If `scripts/gates.json` or `scripts/gate_reds_baseline.json` conflict, run
`git checkout --ours scripts/gates.json scripts/gate_reds_baseline.json`, `git add` them and `git cherry-pick --continue`; both are
regenerated in Step 4.

- [ ] **Step 2: Ask the synchronous router, not the async wrapper**

In `tests/routing/junk_url_rule.test.ts`, replace `import { middleware } from "../../src/middleware";` with:

```ts
/* routeRequest, not middleware: since A7 (2026-10-06) `middleware` is async (the session refresh wraps the routing), and this
   test reads the routing decision itself, as tests/routing/metadata_routes.test.ts does. */
import { routeRequest as middleware } from "../../src/middleware";
```

- [ ] **Step 3: Say the /download rule in the branch's own form**

Delete these three lines:

```ts
/* /download left with its page (the checkup of 2026-10-06, finding 5). Its one address, /download/2026-benchmarks, is
   answered by next.config.js's redirect to /data, which runs before the middleware; anything else under it is junk. */
check("caught: /download", wouldBe404("/download"));
```

and add, after the closing brace of `function expectVerdict(...)`:

```ts
/* /download left with its page (the checkup of 2026-10-06, finding 5). Its one address, /download/2026-benchmarks, is
   answered by next.config.js's redirect to /data, which runs before the middleware; anything else under it is junk. */
expectVerdict("/download", "pinned to 404", "the /download page left in the checkup's B1", "keep download out of src/lib/routing/top_level_segments.ts; its one redirect lives in next.config.js");
```

- [ ] **Step 4: Run the test and its neighbours, then commit**

Run: `npx tsx tests/routing/junk_url_rule.test.ts`
Expected: every check PASS, `/download pinned to 404` among them.
Run: `npx tsx scripts/counts.ts --write`
Run: `npx tsx scripts/prebuild_all.ts --concurrency=1 --no-bail --only=junk-url-rule,metadata-routes,top-level-segments,edge-not-found,counts-fresh`
Expected: `Passed: 5`, `Failed: 0`.

```bash
git add tests/routing/junk_url_rule.test.ts scripts/gates.json scripts/gate_reds_baseline.json CLAUDE.md
git commit -m "Junk-URL test on today's main: it asks routeRequest (middleware is async since A7), and /download in its own form"
```

### Task 2.3: the dotted-404 branch, replayed on top

**Files:**
- Regenerate: `src/lib/routing/served_files.ts`
- Modify (only if Step 4 asks): `tests/routing/junk_url_rule.test.ts`

- [ ] **Step 1: Replay its four commits, oldest first**

```bash
git cherry-pick 173d23f8 0b017a03 d8e9c92e 2f279d17
```
Expected: four commits, no conflict (as the trial rebase applied). On a conflict in `scripts/gates.json`, take ours and continue.

- [ ] **Step 2: Regenerate the served files from today's public/**

Run: `npx tsx scripts/gen_served_files.ts`
Expected: it writes `src/lib/routing/served_files.ts`.

- [ ] **Step 3: Check the merged middleware still wraps routing in the refresh, with the file guard in force**

Run: `grep -n "export async function middleware" -A2 src/middleware.ts`
Expected: `return refreshSessionOn(req, routeRequest(req));`
Run: `npx tsx tests/auth/session_refresh.test.ts`
Expected: `auth/session_refresh: all pass`.

- [ ] **Step 4: Run every routing gate, the photograph gate and the typecheck**

Run: `npx tsx scripts/counts.ts --write`
Run: `npx tsx scripts/prebuild_all.ts --concurrency=1 --no-bail --only=junk-url-rule,metadata-routes,top-level-segments,edge-not-found,dev-routes-sealed,city-path-redirect,sitemap-no-redirects,robots,no-background-photo,session-refresh,counts-fresh`
Expected: `Failed: 0`. If `junk-url-rule` reds a dotted address it listed as passing, the dotted rule now pins it: change that
expectation to `"pinned to 404"` with the reason "a made-up file the site does not serve (dotted-404)".
Run: `node --max-old-space-size=3072 node_modules/typescript/bin/tsc --noEmit -p .`
Expected: exit 0, no output.

- [ ] **Step 5: Commit**

```bash
git add src/lib/routing/served_files.ts scripts/gates.json CLAUDE.md tests/routing/junk_url_rule.test.ts
git commit -m "routing-hardening on today's main: served files regenerated, counts, the junk-URL verdicts under the dotted rule"
```

### Task 2.4: the full chain, the build, then his word

- [ ] **Step 1:** Run: `npm run verify:deploy -- --build` (after Batch 1 it runs the chain, next build and postbuild). Expected: each
  step exit 0. It needs about 1.2 GB free; if the preflight refuses, wait and run it again (never close his apps).
- [ ] **Step 2:** Ask him: "Push routing-hardening to main and deploy, switches off?" On yes: `git push origin routing-hardening:main`.
  The change puts no new words on a page, so watch its status instead (Git Bash; about five minutes):
  `until [ "$(curl -s -o /dev/null -w '%{http_code}' -A 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0 Safari/537.36' https://www.marginatlas.com/gb/london/x.y)" = "404" ]; do sleep 30; done; echo live`
  Expected: `live` (it answered 200 before). Then with the same user agent: `/cities/london.jpeg` 200, `/gb` 200, `/icon` 200.
- [ ] **Step 3:** Run: `npm run launch:branch`.

---

## Batch 3. The QUEUE set to what the code says (records)

The three reviews' verdicts, one line per row. A done row closes with its evidence; a stale row says what replaced it; a still
true row keeps its status and gains its launch weight; a row of his says what it waits for.

### Task 3.1: apply the verdicts

**Files:**
- Create (not committed): `scratchpad/_queue_truth.py`
- Modify: `E:/atlas/design/loop/build/QUEUE.md`

- [ ] **Step 1: Write the script** (with the Write tool; it holds no backslash):

```python
"""The QUEUE truth pass of 2026-10-06: each open row set to what the code says today (three read-only reviews, spot-checked).
Run from E:/atlas/website: python3 scratchpad/_queue_truth.py"""
import io

P = "E:/atlas/design/loop/build/QUEUE.md"
DONE = {
    "country:city-cards-figure": "city_cards.ts reads cityTypicalIncome; verify_archetype_copy holds card equal to page",
    "close:furniture-lines": "ReportFoot prints Report a mistake and the Checked line on every spine view",
    "arch:compare-table-phone-head": "phone heads at --t-micro, interact/SortTable.tsx (4c634444)",
    "country:pipe": "GB's Getting paid card, country-view.tsx; other countries wait on data item 72",
    "launch:chain-under-load": "the entity index (src/lib/facts/store.ts, 2f25945b) took archetype-copy to 5 s",
    "sys:label-gap-marker": "29 spine components stamp data-label; check_model_laws.mjs measures it",
    "bug:useless-tiles-red": "the story row is withheld; useless-tiles green in the 252-of-252 chain",
    "sys:page-strip": "npm run strip:page (scripts/harness/strip_page.mjs, 65372672)",
    "sys:track-ceilings": "SpectraTable stamps data-track; PLACEMENT reds an undeclared ceiling",
    "city:emphasis": "the LOUD_SEATS ledger; loud-seats and accent-budget gates green",
    "country:emphasis": "the LOUD_SEATS ledger; one accent on GB",
    "city:peers-caption": "the caveat is one line (copy.ts)",
    "city:demand": "a quiet BentoMetric; the season a KvGrid pair",
    "city:locals": "no city draws 13 locals; the runway and the risks retired",
    "hood:census": "the generated census lists the hood's seven sections on archetypes (PAGES.md)",
    "hood:masthead": "HoodTake draws AnswerCard (spine/hood/blocks.tsx)",
    "cell:open-lone-figure": "68d46b93 and be56eb07 took the #open holes 40 to 0; clause 53 lifted on band pages",
    "sys:thin-pages-sweep": "scripts/sweep_trades.ts renders every live trade of a city and runs the filter",
    "cell:spread-thin": "closed on measurement (goal-2026-09-24 BACKLOG B11)",
    "arch:ranked-bars-table-doors": "rows carry hrefs (hood_rank_rows.ts, district_rows.ts)",
    "hood:close": "HoodClose on Terminus (spine/hood/blocks.tsx)",
    "hood:PAGE": "covered by hood:PAGE-8.8; holes and page laws at 0",
    "cell:census": "the generated census (PAGES.md); census-fresh",
    "cell:masthead": "masthead.tsx draws AnswerCard; trade_hero_facts.ts withholds",
    "cell:close": "CloseCard on Terminus (spine/cell/exit.tsx)",
    "cell:PAGE": "both trade renders in pages.json; holes and page laws at 0 since 7a071ac2",
    "ui:links-and-the-dead-link-walk": "the harness-links gate; trade pages at 10 links, 0 reds",
    "ui:reading-on-every-point": "MonthBars gives every month a reading; the interact gate",
    "ui:sections-on-the-kit": "the census names a component for running costs, runway and season",
    "ui:seasonality-everywhere-is-columns": "the season card a share on SegmentBar; the calendar on MonthBars",
    "industry:census": "the generated census (PAGES.md)",
    "industry:close": "CloseCard (industry-view.tsx)",
    "industry:PAGE": "industry-restaurants in pages.json; holes and page laws at 0",
    "industry:home-row": "RankedBars selfKey, passed by BenchmarkCard",
    "design:stacked-gap": "zones: gap-y-6, hairline, pt-6 below 768 (zones.tsx; DISTANCES.md)",
    "design:leading-ladder": "the leading pairs in DISTANCES.md with the band page he deployed 2026-10-04",
    "home:editorial": "P36.2 and P36.2b ruled; the duel and the kitchens list read the feed",
    "blog:keep-rewrite-retire": "P36.1 ruled; 58 retired with redirects, the rest kept or rewritten",
    "blog:frontmatter-gate": "the blog-content gate checks title, date, byline, category and pack-sourced figures",
    "cred:founder": "/about names him; the about-page gate",
    "cred:data-pack": "/data lists the 2026.10 pack; the data-pack gate",
    "home:newsletter-claims": "the home page's ask is the depth notice (B1, 32b29407); no PDF named",
    "city:floor-off-curated": "P38.1 ruled (a) 2026-10-05: the 203 pages stay unindexed",
}
STALE = {
    "arch:bento-on-a-page": "he ruled abandon the bento (2026-10-04); pages are zones",
    "harness:cell-less-kvgrid": "running costs no longer draws KvGrid",
    "arch:compare-table-name-column": "CompareTable draws through SortTable; the 1.2 share is gone",
    "howto:forms-air-DE": "the forms-beside-what pair is gone; the forms sit beside the steps",
    "sys:chain-artefacts": "since step 14b the browser gates read fresh renders",
    "city:masthead-photo": "his hero design of 2026-09-20 is the HeroBoard; interview 39 kept city photographs",
    "city:trades": "09 trades is PART 5 trade rows; its loud seat waits on ruling 30",
    "kv-grid:tag-line": "his ruling 5 keeps sample marks off",
    "city:PAGE-2": "the band page rebuilt the city page as zones",
    "hood:streets": "no streets section in MODEL 8.8; left out for want of a source",
    "cell:setup": "split into 03 permits and 04 open",
    "cell:who-walks-in": "not among MODEL 8.6's blocks; survives only in a dev route",
    "industry:cities": "replaced by 06 places on CompareTable",
    "industry:benchmark-lone-lasts": "a lone section is allowed on band pages (MODEL.md, the band-page lift)",
    "home:*": "the home page rebuilt as milestone 3's band page behind its switch; P36.3",
    "design:chapter-heading": "the zones redefined the distances (zones.tsx; DISTANCES.md)",
    "design:level-gaps-law": "the band page redefined the gaps; ZONE PAD holds the zone padding",
}
HIS = {
    "country:character-pair-vs-clause-64": "his line on the character pair is owed",
    "launch:deploy-head-with-marker": "production is current; the marker run is launch row 13",
    "launch:ruling-30-or-the-seat": "his ruling 30 is owed",
    "city:streets": "street footfall costs more than his data budget",
    "hood:crowd": "data item 79 (no workplace fields held)",
    "launch:publish-the-form-catalogue": "his line is owed",
    "research:search-cap": "his setting",
    "design:chapter-links": "F6 waits on his word (FLOW.md)",
    "design:chapter-picture": "F7 waits on his word (FLOW.md)",
    "design:icon-seat-lists": "the colour rule and seat (d) wait on his word (ICONS.md)",
}
TRUE = {
    "doors:aggregate-spelling": "launch HELPS, S", "doors:cell-route-unverifiable": "LATER, M", "country:cities-region-line": "LATER, S",
    "country:money-fallback-cell": "launch HELPS, S", "sys:coverage-keys": "LATER, S", "arch:wide-world-story": "LATER, S",
    "sys:panel-on-a-page": "LATER, S", "arch:row-plus": "LATER, M", "city:pot": "LATER, L", "city:staff": "LATER, L",
    "city:crowd-column": "LATER, M", "seo:alias-canonical": "LATER, S", "ui:the-gloss": "launch HELPS, S",
    "ui:alignment-audit": "LATER, M", "ui:cents-at-a-lower-weight": "LATER, S", "ui:state-says-what-happens-next": "LATER, M",
    "ui:comparison-inside-the-mark": "LATER, L", "ui:what-is-on-this-page": "LATER, S", "country:off-the-books": "LATER, M",
    "ui:the-answer-line": "LATER, M", "ui:one-shadow-scale": "LATER, M", "ui:one-honest-strip": "LATER, M",
    "industry:benchmark-rows": "LATER, S", "industry:chapter-one-string": "LATER, S",
    "industry:route-resolves-to-parent": "launch HELPS, S, his ruling D12", "design:spacing-prefixes": "LATER, S",
    "design:page-edges": "LATER, S", "design:kv-gap": "LATER, S", "design:twos-margins": "LATER, M", "design:row-rung": "LATER, M",
    "design:metrics-report": "LATER, M", "design:flow-report": "LATER, M", "design:density-band": "LATER, L",
    "design:icon-registry": "LATER, M", "guides:renderer": "LATER, L", "guides:nine-more": "LATER, L",
    "data:gb-p10-floor-year": "launch HELPS, S, when the April 2026 survey publishes (late October)",
    "uk:cities-sourced-or-marked": "launch BLOCKS (promoted 2026-10-06: the six cities print shard figures as fact on pages the paywall sells), M",
    "uk:district-pages-rent": "launch HELPS, S", "edge:place-segment": "launch HELPS, M", "edge:us-words": "LATER, M",
    "ui:extremes-chips": "launch HELPS, S", "paywall:uk-trades-off-london": "launch HELPS, S, his ruling D2",
    "icons:pro-cards": "LATER, M", "copy:pro-sections-labels-in-copy": "LATER, M", "data:uk-register-built-date": "launch HELPS, S",
}
s = io.open(P, encoding="utf-8", newline="").read()
nl = "\r\n" if "\r\n" in s else "\n"
lines = s.split(nl)
seen = []
for i, line in enumerate(lines):
    if not line.startswith("| ") or not line.rstrip().endswith("|"):
        continue
    rid = line.split("|")[1].strip()
    body = line.rstrip()[:-1]
    head = body[: body.rfind("|") + 1]
    old = body[body.rfind("|") + 1 :].strip()
    if rid in DONE:
        new = f"DONE (verified 2026-10-06, no change needed: {DONE[rid]})"
    elif rid in STALE:
        new = f"STALE (verified 2026-10-06: {STALE[rid]})"
    elif rid in HIS:
        new = f"HIS (verified 2026-10-06: {HIS[rid]})"
    elif rid in TRUE:
        new = f"{old} (verified 2026-10-06: still true; {TRUE[rid]})"
    else:
        continue
    seen.append(rid)
    lines[i] = f"{head} {new} |"
want = len(DONE) + len(STALE) + len(HIS) + len(TRUE)
assert len(seen) == len(set(seen)) == want == 116, (len(seen), len(set(seen)), want)
io.open(P, "w", encoding="utf-8", newline="").write(nl.join(lines))
print(f"set {len(seen)} rows: {len(DONE)} done, {len(STALE)} stale, {len(HIS)} his, {len(TRUE)} still true")
```

- [ ] **Step 2: Run it**

Run: `python3 scratchpad/_queue_truth.py`
Expected: `set 116 rows: 43 done, 17 stale, 10 his, 46 still true`.

- [ ] **Step 3: Check the diff touches only status cells**

Run: `git -C E:/atlas diff --stat design/loop/build/QUEUE.md`
Expected: `1 file changed, 116 insertions(+), 116 deletions(-)`.

- [ ] **Step 4: Commit in the design repo**

```bash
git -C E:/atlas add design/loop/build/QUEUE.md
git -C E:/atlas commit -m "QUEUE truth pass 2026-10-06: 116 open rows verified against the code; 43 done, 17 stale, 10 his, 46 still true"
```

---

## Batch 4. The launch-page fixes

### Task 4.1 (only on D2 = lock): every UK place's trade page locks as London's does

In `routeRequest` the city and district redirects (`src/middleware.ts:460`, `:468`) run before the Pro rewrite (`:486`), so
widening the rule cannot send a district address to a mirror.

**Files:**
- Modify: `src/lib/monetization/pro_route.ts:5` and `:18`
- Modify: `tests/monetization/pro_route.test.ts`

- [ ] **Step 1: Write the failing checks**

In `tests/monetization/pro_route.test.ts`, above `if (failed > 0)`, add:

```ts
check("a UK trade page outside London goes to its mirror (D2)", proRewrite("/gb/manchester/restaurants", session, true) === "/pro/gb/manchester/restaurants");
check("the UK aggregate's trade page too (D2)", proRewrite("/gb/gb/restaurants", session, true) === "/pro/gb/gb/restaurants");
check("a UK place's static child is not a trade", proRewrite("/gb/manchester/industries", session, true) === null);
check("a trade page in another country does not", proRewrite("/us/new-york/restaurants", session, true) === null);
```

- [ ] **Step 2: Run them to see the first two fail**

Run: `npx tsx tests/monetization/pro_route.test.ts`
Expected: two red lines (Manchester and the aggregate); the other two pass.

- [ ] **Step 3: Widen the trade rule from London to every UK place**

In `src/lib/monetization/pro_route.ts`, replace:

```ts
  const trade = /^\/gb\/london\/([a-z0-9-]+)$/.exec(path)?.[1];
```

with:

```ts
  /* Every UK place's trade page, not London's alone (his ruling D2, docs/superpowers/plans/2026-10-06-whats-left/PLAN.md):
     /gb/manchester/restaurants rendered open while London's locked. The city and district redirects run before this in
     routeRequest, so a district never reaches it. */
  const trade = /^\/gb\/[a-z0-9-]+\/([a-z0-9-]+)$/.exec(path)?.[1];
```

and in the header (line 5), change "a London trade page" to "a UK place's trade page".

- [ ] **Step 4: Run the test and every gate that reads the lock**

Run: `npx tsx tests/monetization/pro_route.test.ts`
Expected: `monetization/pro_route: all pass`.
Run: `npx tsx scripts/prebuild_all.ts --concurrency=1 --no-bail --only=pro-route,paywall-levels,locked-data,api-redaction,monetization-coverage,metadata-routes,junk-url-rule`
Expected: `Failed: 0`.

- [ ] **Step 5: See that a locked Manchester page has something to lock**

The tests prove the rule; this render shows the page it now locks draws its later levels as locked cards (the render forces the
lock, so it is a picture of the page, not a second proof of the rule).
Run: `npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/harness/render_page.tsx --locked cell:gb:manchester:restaurants`
Expected: `scratchpad/harness/pages/cell-gb-manchester-restaurants-locked.html`, where `grep -c "pro-locked"` prints a number above 0.

- [ ] **Step 6: Commit**

```bash
git add src/lib/monetization/pro_route.ts tests/monetization/pro_route.test.ts
git commit -m "D2: every UK place's trade page locks as London's does; a district never reaches the rule"
```

### Task 4.2: the district pages' title says what their take says (`uk:district-pages-rent`)

**Files:**
- Modify: `src/app/(site)/cities/[slug]/neighborhoods/[district]/page.tsx:49`

- [ ] **Step 1: Change the title**

Replace:

```ts
    title: `${row.name}, ${city.name}: what rent takes | Margin Atlas`,
```

with:

```ts
    /* "Estimated rents", as the hub's rank line and the page's own take say (QUEUE uk:district-pages-rent; P03.1 stands: no
       district rent source yet). The title said "what rent takes", a claim of measurement the page does not make. */
    title: `${row.name}, ${city.name}: estimated shop rents | Margin Atlas`,
```

- [ ] **Step 2: Typecheck, run the metadata gates, commit**

Run: `node --max-old-space-size=3072 node_modules/typescript/bin/tsc --noEmit -p .`
Expected: exit 0.
Run: `npx tsx scripts/prebuild_all.ts --concurrency=1 --no-bail --only=metadata-routes,no-em-dashes,legacy-method-words`
Expected: `Failed: 0`.

```bash
git add "src/app/(site)/cities/[slug]/neighborhoods/[district]/page.tsx"
git commit -m "District pages: the title says estimated shop rents, as the page's take does"
```

### Task 4.3: /extremes draws its lenses as sections, no chip row (`ui:extremes-chips`)

**Files:**
- Create: `tests/trust/no_lens_chips.test.ts`
- Modify: `src/app/(site)/extremes/page.tsx:32`, `:398-404`
- Delete: `src/components/extremes/LensFilter.tsx`
- Modify: `scripts/prebuild_all.ts`, `scripts/type_ladder_baseline.json` (by its writer)

- [ ] **Step 1: Write the failing test**

Create `tests/trust/no_lens_chips.test.ts`:

```ts
/**
 * NO FILTER CHIPS ON /extremes (QUEUE ui:extremes-chips; his refusals of 2026-09-22 name filter chips). The page draws every
 * lens as a section, in order, with its anchor. Run: npx tsx tests/trust/no_lens_chips.test.ts
 */
import { existsSync, readFileSync } from "node:fs";

let failed = 0;
const check = (name: string, ok: boolean) => { if (!ok) failed++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}`); };
const page = readFileSync("src/app/(site)/extremes/page.tsx", "utf8");
check("the page mounts no LensFilter", !/LensFilter/.test(page));
check("the chip component is gone", !existsSync("src/components/extremes/LensFilter.tsx"));
check("every lens is drawn as a section with its anchor", /lenses\.map\(\(l\) => \(\s*<section key=\{l\.key\} id=\{l\.key\}/.test(page));
if (failed > 0) { console.error(`trust/no_lens_chips: ${failed} failure(s)`); process.exit(1); }
console.log("trust/no_lens_chips: all pass");
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx tsx tests/trust/no_lens_chips.test.ts`
Expected: three FAIL lines.

- [ ] **Step 3: Draw the lenses as sections**

In `src/app/(site)/extremes/page.tsx`, replace line 32
`import { LensFilter, type LensEntry } from "@/components/extremes/LensFilter";` with:

```ts
import type { ReactNode } from "react";

/** One lens block, resolved on the server: its key (the anchor), its name and the block itself. */
type LensEntry = { key: "catalog" | "cost" | "take-home" | "break-in" | "crowding"; label: string; node: ReactNode };
```

and replace:

```tsx
      {/* The lens blocks, led by cost-to-open, behind a client-side filter. The
         filter is presentational only: the server renders every resolved block
         and the client component shows the chosen lens or all of them. With no
         JavaScript the chips are inert and every block stays visible. */}
      {lenses.length > 0 ? (
        <LensFilter lenses={lenses} />
      ) : (
```

with:

```tsx
      {/* EVERY LENS AS A SECTION, IN ORDER, NO CHIP ROW (QUEUE ui:extremes-chips; his refusals of 2026-09-22 name filter
         chips). The server resolved every block already; the chips only hid all but one. Each section keeps its anchor. */}
      {lenses.length > 0 ? (
        <div className="space-y-12 md:space-y-16">
          {lenses.map((l) => (
            <section key={l.key} id={l.key} aria-label={l.label}>
              {l.node}
            </section>
          ))}
        </div>
      ) : (
```

Then delete the component: `git rm src/components/extremes/LensFilter.tsx`.

- [ ] **Step 4: Run the test, the typecheck and the ratchets**

Run: `npx tsx tests/trust/no_lens_chips.test.ts`
Expected: `trust/no_lens_chips: all pass`.
Run: `node --max-old-space-size=3072 node_modules/typescript/bin/tsc --noEmit -p .`
Expected: exit 0.
Run: `npx tsx scripts/verify_type_ladder.ts`
Expected: `off-ladder sizes shrank, 855 -> 854` (the chip's `text-[13px]` left with the file); then lock it in:
`npx tsx scripts/verify_type_ladder.ts --write-baseline`.
Run: `npx tsx scripts/verify_width_discipline.ts`
Expected: PASS; if it prints "shrank", lock it in the same way with `--write-baseline`.

- [ ] **Step 5: Register the gate and commit**

In `scripts/prebuild_all.ts`, below `{ name: "legacy-method-words", script: "tests/copy/legacy_method_words.test.ts" },` add:

```ts
  /* /extremes draws every lens as a section, no chip row (QUEUE ui:extremes-chips; his refusals of 2026-09-22). */
  { name: "no-lens-chips", script: "tests/trust/no_lens_chips.test.ts" },
```

Run: `git add tests/trust/no_lens_chips.test.ts && npx tsx scripts/counts.ts --write`
Run: `npx tsx scripts/prebuild_all.ts --concurrency=1 --no-bail --only=no-lens-chips,type-ladder,width-discipline,render-graph,counts-fresh,layering`
Expected: `Failed: 0`.

```bash
git add "src/app/(site)/extremes/page.tsx" tests/trust/no_lens_chips.test.ts scripts/prebuild_all.ts scripts/gates.json scripts/type_ladder_baseline.json CLAUDE.md
git commit -m "/extremes draws every lens as a section, no chip row; LensFilter deleted; gate no-lens-chips"
```

### Task 4.4: the register export writes the day it ran, and the UK pages print "Checked" (`data:uk-register-built-date`)

**Files:**
- Modify: `E:/atlas/registers/uk/export_for_site.py:33` and the manifest line (`:103`)
- Regenerate: `data/uk/registers/manifest.json` (by the export, never by hand)
- Modify: `tests/spine/page_foot.test.ts` (the build-date check becomes a requirement)

- [ ] **Step 1: Make the gate require the date**

In `tests/spine/page_foot.test.ts`, replace:

```ts
check(`the UK's checked date is the manifest's build date or nothing (${REGISTER_BUILT ?? "none held"})`, built === (REGISTER_BUILT ?? null));
```

with:

```ts
check(`the register slices carry the day their export ran (${REGISTER_BUILT ?? "none held"}), and the UK's checked date is it`, REGISTER_BUILT !== null && built === REGISTER_BUILT);
```

- [ ] **Step 2: Run it to see it fail**

Run: `npx tsx tests/spine/page_foot.test.ts`
Expected: one red line, "none held".

- [ ] **Step 3: The export writes its own date**

In `E:/atlas/registers/uk/export_for_site.py`, add below `import sys`:

```python
from datetime import date
```

and in the manifest line (`manifest: dict = {"what": ..., "built_by": ..., "files": {}}`), add the key `"built": date.today().isoformat(),`
after `"built_by": "E:/atlas/registers/uk/export_for_site.py",`.

- [ ] **Step 4: Run the export and check it changed nothing but the date**

Run: `python E:/atlas/registers/uk/export_for_site.py`
Expected: four lines, one per file, each with its row count and sha256 prefix.
Run: `git diff --stat data/uk/registers`
Expected: `data/uk/registers/manifest.json | 1 +` and no other file. If a slice changed, the registers moved since the last export:
stop and read that diff before going on (a data change is its own commit, with its own checks).

- [ ] **Step 5: Re-render the UK pages and run the gate**

Run: `bash scratchpad/reform/render_some.sh "country GB" "city london" "cell gb london restaurants" "cell gb london barbershops" "howto GB" "hood london" "hood london city-of-london"`
Run: `npx tsx tests/spine/page_foot.test.ts`
Expected: `spine/page_foot: all pass`, the UK pages each holding one checked line with the export's date.

- [ ] **Step 6: Commit in both repositories**

```bash
git -C E:/atlas add registers/uk/export_for_site.py
git -C E:/atlas commit -m "The register export writes the day it ran into the site manifest's built"
git add data/uk/registers/manifest.json tests/spine/page_foot.test.ts
git commit -m "The UK pages print Checked from the register export's own date; page-foot requires it"
```

---

## The next plans (each written and run on its own, after Batches 1 to 4)

| Row | What the code shows today | Done means |
|---|---|---|
| `uk:cities-sourced-or-marked` (BLOCKS, M) | Manchester's page prints "Prime shop rent $3,550, a square metre of prime shop space, a year" with no source and no estimate mark (`src/lib/spine/premises_bento_rows.ts:171`; the copy's estimate marker is empty by his copy ruling); the same for the other five UK cities' premises, permits, living, crew and cost of living | Each figure on the six pages sourced, marked an estimate in its one line, or withheld, as London's are since masterplan step 03 (`tests/spine/london_city_sources.test.ts` is the pattern to extend to the six) |
| `edge:place-segment` (HELPS, M) | `/gb/atlantis/restaurants` renders: `src/lib/routing/edge_not_found.ts` judges the trade word, never the place; neither routing branch addresses it | A generated table of the place segments the cell route resolves, or a route-level 404 before the stream |
| `ui:the-gloss` (HELPS, S) | The glossary holds four terms (`src/lib/spine/copy.ts:2260-2266`); OpenCard, MarketBand and GatesCard pass no gloss | One gloss a card at most, beside the kicker, a sentence under 140 characters, starting with fit-out, firms per 10,000 and the deposit |
| `doors:aggregate-spelling` (HELPS, S) | Other countries' money rows link `/xx/<country-name>/<trade>` (`src/lib/spine/adapt_country.ts:725`, `:762`) while `/xx/xx/<trade>` is the prerendered aggregate | One spelling, the prerendered one; both keep resolving; the doors gate verifies the rows |
| `country:money-fallback-cell` (HELPS, S) | A money row keeps whatever cell resolved, a sector fallback included (`adapt_country.ts:742-762`; `src/lib/cells.ts:1220-1268`) | A row whose cell is another trade's is dropped, never drawn under this trade's door |
| `data:gb-p10-floor-year` (HELPS, S) | The UK's pay tenths are April 2025's, 3.2% under April 2026's wage floor | Read the April 2026 survey when it publishes (late October); a data commit |

## After launch

- **P36.3, the old home page retired** (ruled 2026-10-05): a day after `NEXT_PUBLIC_HOME_REFORM=1` is live, delete the old body
  of `src/app/page.tsx` and the components only it reaches (measured with the reachability script first, as the checkup's C3 was).
- **The first payments reconciled**: `npm run billing:reconcile` (a dry run) after the first ten Pro purchases, then weekly for a
  month; `--apply` only on a difference read and understood.
- **The depth notices sent**, once D4's sender exists.
- **The data track** (DATA-REQUIREMENTS.md): rents, footfall, pay, rates and licences, each with its owner and source.
- **The QUEUE's 35 LATER rows**, in the loop's own order.
