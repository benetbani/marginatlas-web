/**
 * THE PAYWALL'S SWITCH, ON ONLY WITH ACCOUNTS (milestone 2; masterplan step 10; his interview of 2026-09-26, rulings 18, 21, 27:
 * half of every UK chapter locked, one launch day, the UK pages only). Locking a section while nobody can buy would be a page
 * that takes and offers nothing, so NEXT_PUBLIC_PAYWALL turns the lock on only when NEXT_PUBLIC_AUTH_ENABLED is on too.
 *
 * Run: npx tsx tests/monetization/paywall_flag.test.ts
 */
import { isPaywallOn } from "../../src/lib/feature_flags";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "paywall-flag";
const FILE = "src/lib/feature_flags.ts";
const REMEDY = "isPaywallOn is NEXT_PUBLIC_PAYWALL and isAuthEnabled together, read at call time";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

const saved = { paywall: process.env.NEXT_PUBLIC_PAYWALL, auth: process.env.NEXT_PUBLIC_AUTH_ENABLED };
const set = (paywall: string | undefined, auth: string | undefined) => {
  if (paywall === undefined) delete process.env.NEXT_PUBLIC_PAYWALL; else process.env.NEXT_PUBLIC_PAYWALL = paywall;
  if (auth === undefined) delete process.env.NEXT_PUBLIC_AUTH_ENABLED; else process.env.NEXT_PUBLIC_AUTH_ENABLED = auth;
};
try {
  set("1", undefined);
  check("the paywall on with accounts off stays off", isPaywallOn() === false);
  set("1", "0");
  check("the paywall on with accounts switched off stays off", isPaywallOn() === false);
  set("1", "1");
  check("both on: the paywall is on", isPaywallOn() === true);
  set(undefined, "1");
  check("accounts on, the paywall unset: off", isPaywallOn() === false);
  set("0", "1");
  check("accounts on, the paywall off: off", isPaywallOn() === false);
  set(undefined, undefined);
  check("neither set (today's production): off", isPaywallOn() === false);
} finally {
  set(saved.paywall, saved.auth);
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("monetization/paywall_flag: all pass");
