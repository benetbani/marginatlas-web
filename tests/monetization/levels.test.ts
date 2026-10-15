/**
 * WHICH LEVELS LOCK (milestone 2; his ruling 18: "each chapter's first level free, the rest Pro"; 27: UK pages only). Membership
 * of a chapter is carried forward from the zone that opens it and stops at a level marked outside every chapter.
 *
 * Run: npx tsx tests/monetization/levels.test.ts
 */
import { lockedLevelKeys, type LevelRef } from "../../src/lib/monetization/levels";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "paywall-levels";
const FILE = "src/lib/monetization/levels.ts";
const REMEDY = "lock every level after the first of its chapter; never a level outside the chapters";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };
const same = (a: Set<string>, b: string[]) => a.size === b.length && b.every((k) => a.has(k));

const gb: LevelRef[] = [
  { key: "take", outside: true }, { key: "changes", outside: true },
  { key: "setup", chapter: "01" }, { key: "staff" }, { key: "running" }, { key: "peers" },
  { key: "state", chapter: "02" }, { key: "money" },
  { key: "trades", chapter: "03" }, { key: "people" }, { key: "cities" }, { key: "spend" },
  { key: "years", chapter: "04" }, { key: "lasts" },
  { key: "close", outside: true },
];
/* Chapter 04's second level since plan 2026-10-09 (home introduction): where new firms last beside which trades fail most. */
check("a page of zones carried forward (the /gb of 2026-10-09) locks eight of twelve chapter levels", same(lockedLevelKeys(gb), ["staff", "running", "peers", "money", "people", "cities", "spend", "lasts"]));

/* THE COUNTRY PAGE'S SLOTS (plan 2026-10-13 country-page-journey, Task 1F; spec section 8: his ruling 18 by analogy, each stage's first slot
   open and every later slot of the stage locked): the masthead's two slots and the close stand outside, each stage tags its slots. */
const gbSlots: LevelRef[] = [
  { key: "tax-on-profit", outside: true }, { key: "where-it-stands", outside: true },
  { key: "customers", chapter: "2" }, { key: "spend", chapter: "2" }, { key: "trades", chapter: "2" },
  { key: "open", chapter: "3" },
  { key: "hire", chapter: "4" }, { key: "running-costs", chapter: "4" }, { key: "credit", chapter: "4" }, { key: "filings", chapter: "4" }, { key: "peers", chapter: "4" },
  { key: "lasting", chapter: "5" }, { key: "exit", chapter: "5" },
  { key: "dealings", chapter: "6" }, { key: "changes", chapter: "6" },
  { key: "close", outside: true },
];
check("/gb's slots lock eight: every slot after its stage's first", same(lockedLevelKeys(gbSlots), ["spend", "trades", "running-costs", "credit", "filings", "peers", "exit", "changes"]));
check("a thin country's stages of one slot lock nothing but what follows a first", same(lockedLevelKeys(gbSlots.filter((s) => !["trades", "filings", "peers", "lasting", "changes"].includes(s.key))), ["spend", "running-costs", "credit"]));
/* Slot 5b (the controller's ruling on Q1) where a country draws it: a third slot of the market, locked after the first. */
check("a country drawing the trades' margins locks them with the market's later slots", same(lockedLevelKeys([...gbSlots.slice(0, 5), { key: "margins", chapter: "2" }, ...gbSlots.slice(5)]), ["spend", "trades", "margins", "running-costs", "credit", "filings", "peers", "exit", "changes"]));

const london: LevelRef[] = [
  { key: "premises", chapter: "01" }, { key: "gates", chapter: "01" }, { key: "living", chapter: "01" }, { key: "crew", chapter: "01" },
  { key: "districts", chapter: "02" }, { key: "peers", chapter: "03" }, { key: "hoods", chapter: "03" },
];
check("/cities/london locks four of seven", same(lockedLevelKeys(london), ["gates", "living", "crew", "hoods"]));

const restaurants: LevelRef[] = [
  { key: "take", outside: true }, { key: "opening", outside: true },
  { key: "permits", chapter: "01" }, { key: "split", chapter: "01" }, { key: "clears", chapter: "02" },
  { key: "market", chapter: "03" }, { key: "mix", chapter: "03" }, { key: "apps", chapter: "03" }, { key: "exit", chapter: "03" },
];
check("a London trade page (restaurants) locks four of seven", same(lockedLevelKeys(restaurants), ["split", "mix", "apps", "exit"]));

check("a chapter of one level locks nothing (the district pages)", lockedLevelKeys([{ key: "rank", chapter: "01" }, { key: "character", chapter: "02" }]).size === 0);
check("levels before the first chapter stay free", lockedLevelKeys([{ key: "a" }, { key: "b" }, { key: "c", chapter: "01" }, { key: "d" }]).size === 1);
check("a page with no chapters locks nothing (the how-to page)", lockedLevelKeys([{ key: "a" }, { key: "b" }]).size === 0);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("monetization/levels: all pass");
