#!/usr/bin/env node
/**
 * scripts/loop/gate.mjs , the memory-resilient gate runner.
 *
 * WHY THIS EXISTS. This machine has ~1.5GB free of 8.5GB. `npm run prebuild`
 * runs four gates at once and eighteen of them died on 2026-08-07 with
 * `VirtualAlloc failed`, `spawn UNKNOWN` and exit 3221226505. Two of those
 * printed their own success line and STILL exited non-zero. A run that reports
 * eighteen failures when zero gates actually failed is worse than no run: it
 * trains a reader to ignore the output.
 *
 * THE DISTINCTION THIS TOOL MAKES, and it is the whole point:
 *
 *   PASS   exit 0.
 *   FAIL   non-zero exit, and nothing in the output looks like the OS running
 *          out of memory. A real defect. Stop and read it.
 *   CRASH  the process could not run. Retried with backoff; if every attempt
 *          crashed it is reported as CRASH, never as FAIL.
 *
 * A CRASH is a statement about the machine. A FAIL is a statement about the
 * code. Collapsing them is how a green build gets ignored and a red one gets
 * explained away.
 *
 * ONE CHILD AT A TIME, ALWAYS. There is no concurrency option and there will
 * not be one. The gap between children is not politeness, it is the time the
 * OS needs to return the pages the last child reserved.
 *
 * USAGE
 *   node scripts/loop/gate.mjs --all
 *   node scripts/loop/gate.mjs taxonomy no-em-dashes canonical-urls
 *   node scripts/loop/gate.mjs --all --retries 4 --gap 1200 --heap 1536
 *   node scripts/loop/gate.mjs --list
 *
 * EXIT CODE
 *   0  every gate PASSed, or PASSed with CRASHes and --allow-crash
 *   1  at least one real FAIL
 *   2  at least one CRASH survived its retries (without --allow-crash)
 *
 * The JSON result lands at `data/loop/gates-latest.json` so a later task can
 * read what the earlier one actually proved instead of trusting a summary.
 */
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const ROOT = resolve(new URL("../..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const REGISTRY = resolve(ROOT, "scripts/prebuild_all.ts");
const OUT = resolve(ROOT, "data/loop/gates-latest.json");

/* ------------------------------------------------------------------ args */

const argv = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : dflt;
};
const has = (name) => argv.includes(`--${name}`);

const RETRIES = Number(flag("retries", 3));
const GAP_MS = Number(flag("gap", 900));
const HEAP_MB = Number(flag("heap", 2048));
const TIMEOUT_MS = Number(flag("timeout", 300_000));
const ALLOW_CRASH = has("allow-crash");
const QUIET = has("quiet");

/* -------------------------------------------------------------- registry */

/**
 * The gate list is READ FROM `prebuild_all.ts`, never copied.
 *
 * A copied list is how `verify_stated_totals` sat in `scripts/` passing
 * nothing for hours: it was written, committed, and never registered. If this
 * file kept its own list it would drift the same way, and a gate that exists
 * in one runner and not the other is a gate nobody can trust.
 */
function loadGates() {
  const src = readFileSync(REGISTRY, "utf8");
  const start = src.indexOf("const GATES");
  if (start < 0) throw new Error(`no GATES array found in ${REGISTRY}`);
  const body = src.slice(start, src.indexOf("\n];", start));
  const out = [];
  const re = /\{\s*name:\s*"([^"]+)",\s*script:\s*"([^"]+)"([^}]*)\}/g;
  let m;
  while ((m = re.exec(body))) {
    const [, name, script, tail] = m;
    const argMatch = tail.match(/args:\s*\[([^\]]*)\]/);
    const args = argMatch
      ? argMatch[1].split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean)
      : [];
    out.push({ name, script, args });
  }
  if (!out.length) throw new Error("GATES array parsed to zero entries; the registry shape changed");
  return out;
}

/* --------------------------------------------------------- crash detector */

/**
 * Every signature here was observed on this machine on 2026-08-07. None of
 * them is a gate saying "no". They are Windows, the Cygwin layer, or V8
 * failing to obtain memory.
 *
 * Exit 3221226505 is 0xC0000409, the fast-fail stack cookie check. 4294963202
 * and 127 both show up when the shell cannot start the program at all.
 */
const CRASH_EXITS = new Set([127, 126, 3221226505, 3221225477, 4294963202, 4294967294]);
const CRASH_TEXT = [
  "VirtualAlloc failed",
  "spawn UNKNOWN",
  "cygheap",
  "Resource temporarily unavailable",
  "The system cannot execute",
  "not enough memory",
  "ENOMEM",
  "JavaScript heap out of memory",
  "low_level_alloc",
];

function looksLikeCrash(code, output) {
  if (CRASH_EXITS.has(code)) return true;
  const hay = output.toLowerCase();
  return CRASH_TEXT.some((t) => hay.includes(t.toLowerCase()));
}

/* ------------------------------------------------------------------- run */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function runOnce(gate) {
  return new Promise((done) => {
    const isTs = gate.script.endsWith(".ts");
    const cmd = isTs ? "npx" : process.execPath;
    const args = isTs ? ["tsx", gate.script, ...gate.args] : [gate.script, ...gate.args];

    /* A LOWER heap ceiling, not a higher one. The failures here are the OS
       refusing a reservation, so asking for less is what helps. Raising it is
       the reflex and it is backwards on this box. */
    const child = spawn(cmd, args, {
      cwd: ROOT,
      shell: process.platform === "win32",
      env: { ...process.env, NODE_OPTIONS: `--max-old-space-size=${HEAP_MB}` },
    });

    let out = "";
    const grab = (d) => { out += d.toString(); };
    child.stdout.on("data", grab);
    child.stderr.on("data", grab);

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      out += "\n[gate.mjs] TIMEOUT, killed after " + TIMEOUT_MS + "ms";
    }, TIMEOUT_MS);

    child.on("error", (e) => {
      clearTimeout(timer);
      done({ code: 127, out: out + "\n" + String(e) });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      done({ code: code === null ? 137 : code, out });
    });
  });
}

async function runGate(gate) {
  let last = null;
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    const r = await runOnce(gate);
    last = r;
    if (r.code === 0) return { ...gate, status: "PASS", attempts: attempt, output: r.out };
    if (!looksLikeCrash(r.code, r.out)) {
      return { ...gate, status: "FAIL", attempts: attempt, exit: r.code, output: r.out };
    }
    /* Backoff grows, because a machine that just failed to allocate is
       usually still failing to allocate a second later. */
    if (attempt < RETRIES) await sleep(GAP_MS * attempt * 2);
  }
  return { ...gate, status: "CRASH", attempts: RETRIES, exit: last?.code, output: last?.out ?? "" };
}

/* ------------------------------------------------------------------ main */

const all = loadGates();

if (has("list")) {
  for (const g of all) console.log(g.name.padEnd(30), g.script, g.args.join(" "));
  console.log(`\n${all.length} gates registered.`);
  process.exit(0);
}

const wanted = argv.filter((a) => !a.startsWith("--") && !/^\d+$/.test(a));
const gates = has("all") || wanted.length === 0 ? all : all.filter((g) => wanted.includes(g.name));

if (!gates.length) {
  console.error(`No gate matched. Run with --list to see the ${all.length} names.`);
  process.exit(1);
}

console.log(`=== gate.mjs , ${gates.length} gate(s), ONE at a time ===`);
console.log(`retries=${RETRIES} gap=${GAP_MS}ms heap=${HEAP_MB}MB timeout=${TIMEOUT_MS}ms\n`);

const results = [];
const t0 = Date.now();

for (const g of gates) {
  const r = await runGate(g);
  results.push(r);
  const mark = r.status === "PASS" ? "OK  " : r.status === "FAIL" ? "FAIL" : "CRSH";
  const note = r.attempts > 1 ? ` (${r.attempts} attempts)` : "";
  console.log(`  ${mark}  ${g.name}${note}`);
  if (r.status === "FAIL" && !QUIET) {
    console.log(r.output.trim().split("\n").slice(-12).map((l) => "        " + l).join("\n"));
  }
  await sleep(GAP_MS);
}

const by = (s) => results.filter((r) => r.status === s);
const pass = by("PASS"), fail = by("FAIL"), crash = by("CRASH");

console.log(`\n=== summary , ${((Date.now() - t0) / 1000).toFixed(0)}s ===`);
console.log(`  PASS  ${pass.length}`);
console.log(`  FAIL  ${fail.length}${fail.length ? "   <-- real defects: " + fail.map((r) => r.name).join(", ") : ""}`);
console.log(`  CRASH ${crash.length}${crash.length ? "   <-- machine, not code: " + crash.map((r) => r.name).join(", ") : ""}`);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  JSON.stringify(
    {
      ranAt: new Date().toISOString(),
      total: gates.length,
      pass: pass.map((r) => r.name),
      fail: fail.map((r) => ({ name: r.name, exit: r.exit, tail: r.output.trim().split("\n").slice(-20) })),
      crash: crash.map((r) => ({ name: r.name, exit: r.exit })),
    },
    null,
    2,
  ),
);
console.log(`\n  written: data/loop/gates-latest.json`);

if (fail.length) process.exit(1);
if (crash.length && !ALLOW_CRASH) process.exit(2);
process.exit(0);
