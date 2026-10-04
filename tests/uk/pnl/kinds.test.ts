/**
 * The kind algebra: an estimate anywhere makes an estimate; arithmetic on counted or looked-up figures is worked out;
 * one input passed through untouched keeps its kind.
 *
 * Run: npx tsx tests/uk/pnl/kinds.test.ts
 */
import { combineKinds } from "../../../src/lib/uk/pnl/kinds";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-pnl-kinds";
const FILE = "src/lib/uk/pnl/kinds.ts";
const REMEDY = "fix kinds.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

check("kinds: an estimate anywhere makes an estimate", combineKinds(["counted", "estimate"]) === "estimate");
check("kinds: arithmetic on counted figures is worked out", combineKinds(["counted", "looked up"]) === "worked out");
check("kinds: one input untouched keeps its kind", combineKinds(["counted"], false) === "counted");
check("kinds: a figure with no inputs is refused", (() => { try { combineKinds([]); return false; } catch { return true; } })());

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/pnl/kinds: all pass");
