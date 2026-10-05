/**
 * THE DUEL ON THE HOME PAGE (his ruling of 2026-10-05 on PARKED P36.2, option (a): "the duel" from the trades that fail most,
 * checked against the 45-day rule before it prints). src/lib/home/duel.ts reads data/editorial/editorial_feed.json.
 *
 * Holds: the feed's own rules on every item (a title of four words or fewer, a line of twelve or fewer, no em dash and no
 * semicolon, the dimension ranked and the place held named, a floor); the duel's four rows are the set's two highest and two
 * lowest, each in the trade pages' unit (per 100, one decimal), each a door to its live London trade page, each stamped; its figure
 * is the set's middle, which no row prints; it prints for 45 days from its data's end and not a day after, and never without that
 * date; the restaurants row reads what London restaurants' page prints; the home render carries the duel, stamped.
 *
 * Run: npx tsx tests/home/duel.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { buildDuel, isFresh, FRESH_DAYS } from "../../src/lib/home/duel";
import { SLUG_TO_INDUSTRY } from "../../src/lib/taxonomy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-duel";
const FILE = "src/lib/home/duel.ts";
const REMEDY = "print the duel from the feed only, in the trade pages' unit, its middle as its figure, fresh by the 45-day rule";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

type Item = { id: string; title: string; line: string; dimension?: string; held?: string; floor?: string; refresh: string; as_of?: string; middle?: number; members: number; top: Array<{ member: string; trades: string[]; value: number }>; bottom: Array<{ member: string; trades: string[]; value: number }> };
const feed = JSON.parse(readFileSync("data/editorial/editorial_feed.json", "utf8")) as { items: Item[] };
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
const broken = feed.items.filter((i) => words(i.title) > 4 || words(i.line) > 12 || /[;—]/.test(i.title + i.line) || !i.dimension || !i.held);
check(`every feed item keeps the feed's rules: title, line, no em dash or semicolon, what is ranked and what is held (${broken.map((i) => i.id).join(", ") || "all"})`, broken.length === 0);

const item = feed.items.find((i) => i.id === "fail-most");
check("the feed holds the failures item with its floor, its middle and its data's end", !!item && !!item.floor && typeof item.middle === "number" && !!item.as_of);
if (item?.as_of) {
  const day = (n: number) => new Date(Date.parse(item.as_of as string) + n * 86_400_000).toISOString().slice(0, 10);
  const duel = buildDuel(day(10));
  check("the duel builds while fresh", !!duel);
  if (duel) {
    const want = [...item.top.slice(0, 2), ...item.bottom.slice(-2)];
    check(`four rows, the set's two highest and two lowest (${duel.rows.map((r) => `${r.name} ${r.value}`).join(", ")})`,
      duel.rows.length === 4 && duel.rows.every((r, i) => r.key === want[i].trades[0] && r.value === Math.round(want[i].value) / 10));
    check(`every row's name runs three words or fewer (his labels rule; a longer code name needs its plain name in COPY.home.duel.names)`, duel.rows.every((r) => r.name.split(/\s+/).length <= 3));
    check(`its figure is the set's middle, ${duel.middle.figure}, which no row prints`, duel.middle.value === Math.round(item.middle as number) / 10 && !duel.rows.some((r) => r.value === duel.middle.value));
    check("every row is a door to a live London trade page", duel.rows.every((r) => r.href === `/gb/london/${r.key}` && r.key in SLUG_TO_INDUSTRY && !!r.lands));
    check("every figure is stamped from the feed", [duel.middle.prov, ...duel.rows.map((r) => r.prov)].every((p) => p.src.startsWith("editorial/editorial_feed.json:fail-most") && !!p.kind));
  }
  check(`it prints on day ${FRESH_DAYS} and not on day ${FRESH_DAYS + 1} after its data ends`, !!buildDuel(day(FRESH_DAYS)) && buildDuel(day(FRESH_DAYS + 1)) === null);
}
check("a monthly item with no data date never prints; a yearly one always does", !isFresh({ refresh: "monthly" }, "2026-10-05") && isFresh({ refresh: "yearly" }, "2099-01-01"));

/* The same fact, one figure: London restaurants' page prints the restaurants row's rate. */
const cell = existsSync("scratchpad/harness/pages/cell-gb-london-restaurants.html") ? readFileSync("scratchpad/harness/pages/cell-gb-london-restaurants.html", "utf8").replace(/<[^>]+>/g, "|") : "";
const r0 = item?.top[0];
if (cell && r0) check(`London restaurants' page prints ${(Math.round(r0.value) / 10).toFixed(1)} of 100, as the duel does`, cell.includes(`|${(Math.round(r0.value) / 10).toFixed(1)}|`));

const home = existsSync("scratchpad/harness/pages/home-gb.html") ? readFileSync("scratchpad/harness/pages/home-gb.html", "utf8") : "";
if (home) check("the home render carries the duel, its middle stamped from the feed", /id="duel"/.test(home) && /data-src="editorial\/editorial_feed\.json:fail-most:the middle/.test(home));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("home/duel: all pass");
