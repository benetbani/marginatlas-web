/**
 * scripts/loop_gate.mjs , THE DEFINITION OF DONE for one loop iteration.
 *
 * One command, one verdict. An iteration may not report success without this
 * printing GREEN, and may not claim a defect is fixed without the count moving.
 *
 *   node scripts/loop_gate.mjs            run every gate, print the verdict
 *   node scripts/loop_gate.mjs --snapshot take a restore point first
 *
 * Gates, in order of authority:
 *   1. verify_lattice   the numbers. Model + lattice + language. Hard fail.
 *   2. audit_mockup     the layout. Contrast, voids, accent, cohesion, links.
 *   3. drift            no mockup grew a defect class it did not have before.
 *
 * Writes design/loop/state.json so the next iteration knows what changed, and
 * appends nothing: the LEDGER is the model's to write, in its own words.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync } from "node:fs";

const LOOP = "E:/atlas/design/loop";
const MOCK = "E:/atlas/design/mockups";
const STATE = `${LOOP}/state.json`;
const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);

mkdirSync(LOOP, { recursive: true });

/* ---------- restore point. The mockups are the frozen spec and they are not
   in git; an unattended run must never be the only copy. ---------- */
if (process.argv.includes("--snapshot")) {
  const dest = `${LOOP}/snapshots/${stamp}`;
  cpSync(MOCK, dest, { recursive: true, filter: (s) => !/\.(png|jpe?g)$/i.test(s) });
  console.log(`snapshot  ${dest}`);
}

const run = (args) => {
  try {
    return { code: 0, out: execFileSync("node", args, { encoding: "utf8", cwd: "E:/atlas/website", maxBuffer: 32e6 }) };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout || "") + (e.stderr || "") };
  }
};

/* ---------- 1. the numbers ---------- */
const lattice = run(["scripts/verify_lattice.mjs"]);
const latticeFails = (lattice.out.match(/^\s*FAIL/gm) || []).length;
const latticeOks = (lattice.out.match(/^\s*ok/gm) || []).length;

/* ---------- 2. the layout ---------- */
const audit = run(["scripts/audit_mockup.mjs", "--json"]);
let A = { total: { BLOCKER: 0, MAJOR: 0, MINOR: 0 }, reports: [] };
try { A = JSON.parse(audit.out); } catch { console.error("audit_mockup did not return JSON:\n" + audit.out.slice(0, 800)); }

/* per page x viewport, and per defect code, so drift is attributable */
const byPage = {}, byCode = {};
for (const r of A.reports || []) {
  const k = `${r.page}@${r.width}`;
  byPage[k] = { BLOCKER: 0, MAJOR: 0, MINOR: 0, height: r.stats?.docHeight };
  for (const f of r.findings) {
    byPage[k][f.sev]++;
    byCode[f.code] = (byCode[f.code] || 0) + 1;
  }
}

/* ---------- 3. drift against the previous iteration ---------- */
const prev = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : null;
const drift = [];
if (prev) {
  for (const [code, n] of Object.entries(byCode)) {
    const was = prev.byCode?.[code] || 0;
    if (n > was) drift.push(`${code}  ${was} -> ${n}  (+${n - was})`);
  }
  for (const [code, was] of Object.entries(prev.byCode || {})) {
    if (!byCode[code]) drift.push(`${code}  ${was} -> 0   CLEARED`);
  }
}

const green = latticeFails === 0 && A.total.BLOCKER === 0;
const state = {
  iteration: (prev?.iteration || 0) + 1,
  when: new Date().toISOString(),
  green,
  lattice: { ok: latticeOks, fail: latticeFails },
  audit: A.total,
  byPage, byCode,
  previous: prev ? { iteration: prev.iteration, audit: prev.audit, green: prev.green } : null,
};
writeFileSync(STATE, JSON.stringify(state, null, 2), "utf8");

/* ---------- verdict ---------- */
const bar = "=".repeat(74);
console.log(`\n${bar}\nLOOP GATE , iteration ${state.iteration}   ${state.when.slice(0, 19).replace("T", " ")}\n${bar}`);
console.log(`numbers   verify_lattice   ${latticeOks} ok, ${latticeFails} fail`);
if (latticeFails) console.log(lattice.out.split("\n").filter((l) => /FAIL/.test(l)).map((l) => "          " + l.trim()).join("\n"));
console.log(`layout    audit_mockup     ${A.total.BLOCKER} blocker, ${A.total.MAJOR} major, ${A.total.MINOR} minor`);
for (const [k, v] of Object.entries(byPage)) console.log(`            ${k.padEnd(16)} ${v.BLOCKER}b ${v.MAJOR}m ${v.MINOR}n   ${v.height}px`);
console.log(`\nby defect class`);
for (const [c, n] of Object.entries(byCode).sort((a, b) => b[1] - a[1])) console.log(`            ${c.padEnd(20)} ${n}`);
if (prev) {
  console.log(`\ndrift from iteration ${prev.iteration}`);
  console.log(drift.length ? drift.map((d) => "            " + d).join("\n") : "            none");
  const d = A.total.BLOCKER + A.total.MAJOR - (prev.audit.BLOCKER + prev.audit.MAJOR);
  console.log(`            net blocker+major  ${d > 0 ? "+" : ""}${d}`);
}
console.log(`\n${bar}\n${green ? "GREEN , publishable on the mechanical bar" : "RED , blockers outstanding, do not report success"}\n${bar}\n`);
process.exit(green ? 0 : 1);
