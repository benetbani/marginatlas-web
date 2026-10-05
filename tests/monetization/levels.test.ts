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
  { key: "years", chapter: "04" },
  { key: "close", outside: true },
];
check("/gb locks seven of eleven chapter levels", same(lockedLevelKeys(gb), ["staff", "running", "peers", "money", "people", "cities", "spend"]));

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
