/**
 * scripts/lib/paywall_switches.ts , THE PAYWALL'S TWO SWITCHES, AS THE TERMINAL THAT RUNS launch:check CAN SEE THEM
 * (fix round 8 of plan 2026-10-10, the home reformed to ship, Task 8's review, group 2).
 *
 * WHY. isPaywallOn() (src/lib/feature_flags.ts) is NEXT_PUBLIC_PAYWALL and NEXT_PUBLIC_AUTH_ENABLED both on. Launch day sets both in
 * Vercel's dashboard (LAUNCH-SWITCHES row 10) and runs `npm run launch:check` from his terminal (row 13), where neither is set. Item
 * (j) asked isPaywallOn() of its own process, so it printed "[ok] ... the paywall is off" while production had the paywall on.
 *
 * WHAT. The reader item (d) uses, verify_sample_switch.ts's readFlag(): the process environment, then .env.production (committed),
 * then .env.local, and which of them answered. Each switch is on, off or unknown (no source answers). Seen from here the paywall is
 * ON when both are on, OFF when either is off (either switch off keeps it off), and UNKNOWN otherwise: never off by default.
 * `root` is the folder the two env files are read from (the repo, unless a test hands a scratch folder).
 *
 * BLIND SPOT, stated. This reads what a build on this machine would bake in. It cannot see a variable that exists only in
 * Vercel's dashboard, and Vercel's build reads the dashboard's variables before the files, so an OFF read from a file is the
 * file's answer and not production's. The words print the source of each reading, and item (j) measures production's /terms beside
 * them.
 */
import { readFlag, type Source } from "../verify_sample_switch";

export const PAYWALL_SWITCH = "NEXT_PUBLIC_PAYWALL";
export const ACCOUNTS_SWITCH = "NEXT_PUBLIC_AUTH_ENABLED";

export type Reading = { on: boolean | null; source: Source };

/** isPaywallOn() as far as two readings can say it: true when both are on, false when either is off, null when no answer settles it. */
export function paywallFrom(paywall: Reading, accounts: Reading): boolean | null {
  if (paywall.on === false || accounts.on === false) return false;
  if (paywall.on === true && accounts.on === true) return true;
  return null;
}

const word = (name: string, r: Reading) => `${name} ${r.on === null ? "unset (no source answers)" : `${r.on ? "ON" : "OFF"} (${r.source})`}`;

/** Both switches through readFlag, the paywall they make, and one line that says where each reading came from. */
export function readPaywallSwitches(root?: string): { paywall: Reading; accounts: Reading; on: boolean | null; words: string } {
  const paywall = readFlag(PAYWALL_SWITCH, root);
  const accounts = readFlag(ACCOUNTS_SWITCH, root);
  return { paywall, accounts, on: paywallFrom(paywall, accounts), words: `${word(PAYWALL_SWITCH, paywall)}, ${word(ACCOUNTS_SWITCH, accounts)}` };
}
