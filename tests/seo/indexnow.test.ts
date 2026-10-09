/**
 * IndexNow stays a tool he runs by hand (P1-G of the page architecture, 2026-10-09: "a key file in public/ and
 * scripts/seo/indexnow.ts, run by hand after each deploy he approves to post the addresses whose status changed; never in the chain
 * or the build"). Its key file is served, its payload is the protocol's, Phase 1's list holds only addresses that are noindex now,
 * and nothing in the gate chain, the npm scripts or the build runs it: it posts to the network, and a post is his to make.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/seo/indexnow.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { INDEXNOW_KEY, INDEXNOW_HOST, KEY_FILE, KEY_LOCATION, BATCH, toUrls, batches, payload, phase1Sets } from "../../scripts/seo/indexnow";
import { SERVED_FILES } from "../../src/lib/routing/served_files";
import { isIndexable } from "../../src/lib/seo/indexable";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "indexnow";
const FILE = "scripts/seo/indexnow.ts";
const REMEDY =
  "Keep scripts/seo/indexnow.ts a tool run by hand after a deploy he approved: no gate, npm script or build step runs it, and its key file stays in public/ (rerun scripts/gen_served_files.ts)";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, detail: label, remedy: REMEDY });
};

/* THE KEY */
check(`the key is 32 lowercase hex characters (${INDEXNOW_KEY})`, /^[0-9a-f]{32}$/.test(INDEXNOW_KEY));
check(`the key file holds the key and nothing else (${KEY_FILE})`, existsSync(KEY_FILE) && readFileSync(KEY_FILE, "utf8") === INDEXNOW_KEY, KEY_FILE);
check(`the edge serves the key file at ${KEY_LOCATION}`, SERVED_FILES.has(`/${INDEXNOW_KEY}.txt`) && KEY_LOCATION === `https://www.marginatlas.com/${INDEXNOW_KEY}.txt`, "src/lib/routing/served_files.ts");

/* THE PAYLOAD */
const { urls, refused } = toUrls(["/gb/industries", "https://www.marginatlas.com/gb/industries", "https://example.com/x", "", "# a note", "/decide/restaurants/london"]);
check(
  "a list takes paths and the site's own addresses, once each, skips blanks and notes, and refuses another host",
  JSON.stringify(urls) === JSON.stringify(["https://www.marginatlas.com/gb/industries", "https://www.marginatlas.com/decide/restaurants/london"]) &&
    JSON.stringify(refused) === JSON.stringify(["https://example.com/x"]),
);
const many = Array.from({ length: 25_001 }, (_, i) => `https://www.marginatlas.com/x/${i}`);
check(`a post holds at most ${BATCH} addresses (25,001 in ${batches(many).map((b) => b.length).join(", ")})`, JSON.stringify(batches(many).map((b) => b.length)) === "[10000,10000,5001]");
check("the payload is the protocol's: host, key, keyLocation, urlList", JSON.stringify(Object.keys(payload(["https://www.marginatlas.com/gb"]))) === '["host","key","keyLocation","urlList"]' && payload([]).host === INDEXNOW_HOST && payload([]).keyLocation === KEY_LOCATION);

/* PHASE 1'S LIST: every address in it is noindex now (P1-B) */
const sets = phase1Sets();
for (const s of sets) console.log(`      ${s.name}: ${s.addresses.length}`);
const all = sets.flatMap((s) => s.addresses);
const stillIndexed = all.filter(isIndexable);
check(`every address Phase 1 changed is noindex now (${all.length})${stillIndexed.length ? `: ${stillIndexed.slice(0, 5).join(", ")}` : ""}`, all.length > 0 && stillIndexed.length === 0);
check("Phase 1's list holds its five sets, none empty", sets.length === 5 && sets.every((s) => s.addresses.length > 0));

/* NEVER IN THE CHAIN OR THE BUILD */
const chain = readFileSync("scripts/prebuild_all.ts", "utf8");
const gateScripts = [...chain.matchAll(/script:\s*"([^"]+)"/g)].map((m) => m[1]);
check("no gate runs the script", gateScripts.length > 0 && !gateScripts.includes(FILE), "scripts/prebuild_all.ts");
const pkg = JSON.parse(readFileSync("package.json", "utf8")) as { scripts?: Record<string, string> };
const npmRuns = Object.entries(pkg.scripts ?? {}).filter(([, cmd]) => cmd.includes("seo/indexnow"));
check(`no npm script runs it${npmRuns.length ? `: ${npmRuns.map(([n]) => n).join(", ")}` : ""}`, npmRuns.length === 0, "package.json");
const vercel = existsSync("vercel.json") ? readFileSync("vercel.json", "utf8") : "";
check("the build never runs it (vercel.json)", !vercel.includes("indexnow"), "vercel.json");
const src = readFileSync(FILE, "utf8");
check("it posts only with --send, a dry run otherwise, through one fetch", src.includes('args.includes("--send")') && (src.match(/\bfetch\(/g) ?? []).length === 1);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("seo/indexnow: all pass");
