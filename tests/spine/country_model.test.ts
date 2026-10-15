/**
 * THE COUNTRY PAGE'S MODEL (plan 2026-10-13 country-page-journey, Task 1A; spec E:/atlas/docs/superpowers/specs/2026-10-13-country-page-journey-design.md,
 * sections 2 to 4; R5 section 5, adopted row for row; the controller's ruling on Q1, a seventeenth slot 5b "What trades keep"): src/lib/spine/
 * country_slots.ts holds the spec's sixteen slots and 5b in its seven stages, in order, each with its type, heading and DOM id; the words they
 * print (COPY.journey) meet the copy rules; src/lib/spine/owner_direction.ts holds the spec's direction table row for row and names every
 * measure the page places (Q3: admin ease higher, the cost of living no mark).
 * BLIND SPOT, stated: it reads the model and its words, not the pages; the pages are the country-slots gate's (Task 1B).
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/country_model.test.ts
 */
import { SLOTS, STAGES, slotDef } from "../../src/lib/spine/country_slots";
import { OWNER_DIRECTION } from "../../src/lib/spine/owner_direction";
import { COPY } from "../../src/lib/spine/copy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "country-model";
const FILE = "src/lib/spine/country_slots.ts";
const REMEDY = "hold the spec's sixteen slots and the ruled 5b in its seven stages, in order, each its type, heading and id; the words in COPY.journey within the copy rules; the direction table the spec's, row for row";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

/* THE SPEC'S TABLE (section 3) and the ruled 5b (Q1): number, id, stage, type, in page order. */
const SPEC: Array<[string, string, string, string]> = [
  ["1", "tax-on-profit", "orient", "share"], ["2", "where-it-stands", "orient", "position"],
  ["3", "customers", "market", "money"], ["4", "spend", "market", "share"], ["5", "trades", "market", "money"], ["5b", "margins", "market", "share"],
  ["6", "open", "open", "table"],
  ["7", "hire", "run", "money"], ["8", "running-costs", "run", "money"], ["9", "credit", "run", "share"], ["10", "filings", "run", "time"], ["11", "peers", "run", "table"],
  ["12", "lasting", "last", "share"], ["13", "exit", "last", "time"],
  ["14", "dealings", "rules", "position"], ["15", "changes", "rules", "dated-pair"],
  ["16", "close", "next", "doors"],
];
check(`seventeen slots, the spec's sixteen and the ruled 5b (${SLOTS.length})`, SLOTS.length === 17);
SPEC.forEach(([num, id, stage, type], i) => {
  const s = SLOTS[i];
  check(`slot ${num} is ${id}, stage ${stage}, ${type} (${s ? `${s.num} ${s.id}, ${s.stage}, ${s.type}` : "missing"})`, !!s && s.n === i + 1 && s.num === num && s.id === id && s.stage === stage && s.type === type);
});
check("the stages are the spec's seven, in order", JSON.stringify(STAGES.map((g) => [g.id, g.n])) === JSON.stringify([["orient", 1], ["market", 2], ["open", 3], ["run", 4], ["last", 5], ["rules", 6], ["next", 7]]));
check("the chapters are stages 2 to 6, titled by the spec's names and numbered 01 to 05; the masthead and the close stand outside",
  JSON.stringify(STAGES.map((g) => [g.heading, g.index])) === JSON.stringify([[null, null], ["The market", "01"], ["To open", "02"], ["To run", "03"], ["To last", "04"], ["The rules", "05"], [null, null]]));
check("slots 1 and 2 are the masthead's (#take); every other slot its own DOM id",
  slotDef("tax-on-profit").domId === "take" && slotDef("where-it-stands").domId === "take" && new Set(SLOTS.slice(2).map((s) => s.domId)).size === 15 && !SLOTS.slice(2).some((s) => s.domId === "take"));
check("the ids are the plan's (slot 3 keeps `cities`, the anchor the home's All UK cities door opens)", JSON.stringify(SLOTS.slice(2).map((s) => s.domId)) === JSON.stringify(["cities", "spend", "trades", "margins", "open", "hire", "running-costs", "credit", "filings", "peers", "lasting", "exit", "dealings", "changes", "close"]));

/* THE WORDS (the copy rules): every string under COPY.journey. */
const strings: Array<[string, string]> = [];
const walk = (v: unknown, at: string) => { if (typeof v === "string") strings.push([at, v]); else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${at}.${k}`); };
walk(COPY.journey, "journey");
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
const BANNED = [/\bmodell?ed\b/i, /\bwithheld\b/i, /\bon file\b/i, /\bwe\b/i, /;/, /\u2014/];
const bad = strings.filter(([, s]) => words(s) > 12 || BANNED.some((re) => re.test(s))).map(([at]) => at);
check(`every journey string is twelve words or fewer, with no semicolon, em-dash, method word or "we" (${bad.join(", ") || "all"})`, strings.length > 0 && bad.length === 0, "src/lib/spine/copy.ts");
const heads = [...SLOTS.map((s) => s.heading), ...STAGES.flatMap((g) => (g.heading ? [g.heading] : [])), ...Object.values(COPY.journey.more)].filter((h) => words(h) > 4);
check(`every heading, chapter title and plus head is four words or fewer (${heads.join(" | ") || "all"})`, heads.length === 0, "src/lib/spine/copy.ts");

/* THE DIRECTION TABLE (spec section 4), row for row, and the two measures Q3 names (admin ease higher, his reading; the living cost none). */
const WANT: Record<string, string> = {
  "tax-on-profit": "lower", "employer-oncost": "lower", "register-cost": "lower", "card-fees": "lower", "lending-rate": "lower", electricity: "lower", diesel: "lower",
  "register-days": "lower", "time-to-sell": "lower", "time-to-discharge": "lower", "enforce-days": "lower",
  "firms-year-five": "higher", "hiring-ease": "higher", "tax-predictability": "higher",
  bribery: "lower", "official-wait": "lower", "clean-dealing": "higher",
  "customer-pay": "none", salary: "none", "wage-floor": "none", "household-spend": "none", population: "none",
  "admin-ease": "higher", "cost-of-living": "none",
};
const got = Object.fromEntries(Object.entries(OWNER_DIRECTION).map(([k, v]) => [k, v.direction]));
check(`the direction table holds the spec's rows and Q3's two, each its direction (${JSON.stringify(got)})`, JSON.stringify(Object.keys(got).sort()) === JSON.stringify(Object.keys(WANT).sort()) && Object.entries(WANT).every(([k, d]) => got[k] === d), "src/lib/spine/owner_direction.ts");
check("every row of the table says which spec line it reads", Object.values(OWNER_DIRECTION).every((v) => typeof v.spec === "string" && v.spec.trim().length > 0), "src/lib/spine/owner_direction.ts");
check("admin ease's row carries his reading's date (Q3)", OWNER_DIRECTION["admin-ease"].spec.includes("2026-10-13"), "src/lib/spine/owner_direction.ts");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/country_model: all pass");
