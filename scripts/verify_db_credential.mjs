#!/usr/bin/env node
/**
 * verify_db_credential , the service-role key must actually be accepted.
 *
 * WHY THIS EXISTS. The Supabase service-role key was rotated some time before
 * 2026-08-08 and Vercel kept the old value, last updated May 20. Every
 * server-side read through `supabaseAdmin` failed for months. Nothing said so:
 * the readers did `if (error || !data) return []`, so a rejected credential and
 * an empty table were the same thing to every caller. The site degraded to
 * synthesised figures, labelled "Estimated", and looked completely healthy.
 *
 * It surfaced only when one `console.warn` was added and the next build log
 * read "Unregistered API key". Three firings of diagnosis had guessed
 * "build-time timeout" twice, because `withBudget` logs on TIMEOUT and a
 * fast-failing query logs nothing at all.
 *
 * A CREDENTIAL FAILS THE BUILD. A NETWORK BLIP DOES NOT. That distinction is
 * the whole design:
 *
 *   rejected key   permanent, silent, and every page quietly degrades.
 *                  Nobody notices for a quarter. FAIL.
 *   timeout, DNS,  transient, loud enough elsewhere, and failing the deploy
 *   socket reset   would trade a three-month outage for a five-minute one at
 *                  the worst possible moment. WARN and pass.
 *
 * NO KEY AT ALL IS A SKIP, NOT A FAILURE. A plain `tsx` prebuild run does not
 * load `.env.local` the way Next does, so on a developer machine this check has
 * nothing to test and must not block. In CI and on Vercel the variable is
 * present and the check is real.
 *
 * THE FILE THE RED NAMES (2026-09-17, plan-2026-09-17/02-ERRORS.md step 16).
 * The finding is about an environment variable, which is not a file in this
 * repo: on Vercel it lives in the project's settings and locally in
 * `.env.local`, which is untracked. `.env.local` is the one place an editor
 * can reach, so the red names it, with no line, and says in the detail where
 * the other copy is. The repo-relative rule of scripts/lib/red is kept: the
 * path is real, it is just not committed.
 *
 * Run: node scripts/verify_db_credential.mjs
 */
import { red } from "./lib/red.mjs";

const RULE = "db-credential";
const ENV_FILE = ".env.local";
const URL_VAR = "NEXT_PUBLIC_SUPABASE_URL";
const KEY_VAR = "SUPABASE_SERVICE_ROLE_KEY";
const TIMEOUT_MS = 15_000;

const url = process.env[URL_VAR];
const key = process.env[KEY_VAR];

if (!url || !key) {
  console.log(
    `verify_db_credential: SKIPPED, ${!url ? URL_VAR : KEY_VAR} is not set in this ` +
      `environment.\n  A bare prebuild run does not load .env.local; this check is for CI and Vercel.`,
  );
  process.exit(0);
}

/* The cheapest possible authenticated call: PostgREST answers the root with the
   schema it will serve, and rejects a bad key before it looks at any table. No
   row is read and no table name is assumed. */
const endpoint = `${url.replace(/\/+$/, "")}/rest/v1/`;
const ac = new AbortController();
const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);

let res;
try {
  res = await fetch(endpoint, {
    headers: { apikey: key, authorization: `Bearer ${key}` },
    signal: ac.signal,
  });
} catch (e) {
  clearTimeout(timer);
  console.log(
    `  verify_db_credential: could not reach ${new URL(endpoint).host} (${e.name}: ${e.message}).\n` +
      `  Treating as transient and NOT failing the build. A rejected key fails; an unreachable\n` +
      `  host does not, because failing a deploy on a network blip is the worse trade.`,
  );
  process.exit(0);
}
clearTimeout(timer);

if (res.ok) {
  console.log(`verify_db_credential: ${KEY_VAR} accepted by ${new URL(endpoint).host}.`);
  process.exit(0);
}

/* 401 and 403 are the credential answers. Everything else is the service having
   a bad day, which is not this gate's business. */
if (res.status === 401 || res.status === 403) {
  let detail = "";
  try {
    const body = await res.text();
    detail = body.slice(0, 300).replace(/\s+/g, " ").trim();
  } catch { /* body is optional; the status is the finding */ }
  console.error(
    `verify_db_credential: this is the failure that hid for three months. Every supabaseAdmin\n` +
      `  read returns empty, the sitemap cell shards ship 110 bytes, and every page falls\n` +
      `  back to synthesised figures while still rendering perfectly.`,
  );
  red({
    rule: RULE,
    file: ENV_FILE,
    detail:
      `${KEY_VAR} was rejected by ${new URL(endpoint).host} with HTTP ${res.status}` +
      (detail ? ` (${detail})` : "") +
      `; the same variable is set in Vercel's project settings`,
    remedy: `copy the service_role key from the Supabase dashboard (Settings, API) into ${KEY_VAR} in Vercel and in ${ENV_FILE}, then redeploy`,
  });
  process.exit(1);
}

console.log(
  `  verify_db_credential: ${new URL(endpoint).host} answered HTTP ${res.status}, which is not\n` +
    `  a credential verdict. Not failing the build.`,
);
process.exit(0);
