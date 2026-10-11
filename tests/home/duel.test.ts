/**
 * THE DUEL, WHICH TRADES FAIL MOST (his ruling of 2026-10-05 on PARKED P36.2, option (a): "the duel" from the trades that fail most,
 * checked against the 45-day rule before it prints). src/lib/home/duel.ts reads data/editorial/editorial_feed.json.
 *
 * Holds: the feed's own rules on every item (a title of four words or fewer, a line of twelve or fewer, no em dash and no
 * semicolon, the dimension ranked and the place held named, a floor); the duel's four rows are the set's two highest and two
 * lowest, each in the trade pages' unit (per 100, one decimal), each a door to its live London trade page, each stamped; its figure
 * is the set's middle, which no row prints; it prints for 45 days from its data's end and not a day after, and never without that
 * date; the restaurants row reads what London restaurants' page prints; since plan 2026-10-09 (home introduction) /gb's render
 * carries the duel in chapter 04, beside where new firms last, stamped; and the drawing (src/components/spine/country/Duel.tsx)
 * fills its half of that even level: its four rows as the table, never the fixed-height columns.
 *
 * Run: npx tsx tests/home/duel.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { buildDuel, isFresh, FRESH_DAYS } from "../../src/lib/home/duel";
import { Duel } from "../../src/components/spine/country/Duel";
import { COPY } from "../../src/lib/spine/copy";
import { SLUG_TO_INDUSTRY } from "../../src/lib/taxonomy";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-duel";
const FILE = "src/lib/home/duel.ts";
const REMEDY = "print the duel from the feed only, in the trade pages' unit, its middle as its figure, fresh by the 45-day rule";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: at?.file ?? FILE, detail: label, remedy: at?.remedy ?? REMEDY }); };

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
    /* THE DRAWING (plan 2026-10-09, home introduction, Task 4): it stands in a half of /gb's even level and takes the taller card's
       height, so its four rows are the table (RankedBars `fill`), which shares that height, and never the columns, whose fixed height
       stood 52px of blank foot at 1280 (the page laws' CARD FOOT BLANK, clause 52). The columns alone stamp `data-bar` on a row. */
    const html = renderToStaticMarkup(React.createElement(Duel, { duel }));
    check("the duel fills its half: its four rows are the table at every width, never the fixed-height columns", /id="duel"/.test(html) && !/data-bar=/.test(html) && (html.match(/data-track="set"/g) ?? []).length === 4, { file: "src/components/spine/country/Duel.tsx", remedy: "draw the duel as Duel holds it, RankedBars with fill, so its four rows are the table at every width from sm and share the height /gb's even level gives it (the columns' fixed height stood 52px of blank foot at 1280)" });
    /* THE VALUE HEAD KEEPS ITS LINE (fix round F1, group G8; the built page's finding 3, .superpowers/sdd/hr-p16-report.md). "Of 100" wrapped to two
       lines ("Of" over "100") in the table's head at 768, where the card is half the column: its flex row holds the head and the ceiling's "Highest 2.9",
       and the head, the shrinkable one, gave. It is the pattern round D2 fixed in MarkList's unit head and FiguresTable's year heads. The TABLE's value head
       takes shrink-0 whitespace-nowrap, so the ceiling's label gives, never the head. THE PHONE LIST'S HEAD DOES NOT (fix round F2, item M12; the final review):
       the phone list has the whole row, so its head wraps if a longer district name ever needs it, as the head over a phone's list always could, where
       whitespace-nowrap would let it run past the card. BLIND SPOT: classes as written; that the head stands on one line is Chromium's (the round's probe,
       scratchpad/home-reform/f1_g8_head.mjs, at 768). */
    const valueHeads =[...html.matchAll(new RegExp(`<span class="([^"]*)">${COPY.home.duel.phoneValue}</span>`, "g"))].map((m) => m[1].split(" "));
    /* AND THE ROW LEAVES THE ROOM FOR IT (measured on the first try of this fix): at 768 the head row has 91px for the head (38.5), the ceiling label's longest
       word, "Highest" (42.1), and the gap between them, and with the head held to one line the old 12px gap made the row 93 wide, the label spilling 2px past
       it. The row's gap is 8 (gap-x-2): 88.6 of 91. justify-between spreads the pair wherever there is room, so the gap only matters when it is tight. */
    const headRowGap = new RegExp(`<div class="col-span-2 flex items-baseline justify-between (gap-x-\\d+)"><span class="[^"]*">${COPY.home.duel.phoneValue}</span>`).exec(html)?.[1];
    check(`the table's head row leaves room for the head and the ceiling's longest word at 768: its gap is gap-x-2 (${headRowGap ?? "no head row found"})`, headRowGap === "gap-x-2", { file: "src/components/spine/archetypes/RankedBars.tsx", remedy: "the head row that holds the value head and the ceiling's label takes gap-x-2 (8px): 38.5 + 8 + 42.1 fits the 91px it has at 768, where 12 spilled the label 2px" });
    const tableHead = (new RegExp(`<div class="col-span-2 flex items-baseline justify-between gap-x-\\d+"><span class="([^"]*)">${COPY.home.duel.phoneValue}</span>`).exec(html)?.[1] ?? "").split(" ");
    const phoneHeads = valueHeads.filter((c) => c.join(" ") !== tableHead.join(" "));
    check(`the value head "${COPY.home.duel.phoneValue}" keeps its line in the table, shrink-0 whitespace-nowrap (${tableHead.filter((k) => k === "shrink-0" || k === "whitespace-nowrap").join(" ") || "neither"}), and the phone list's wraps as its whole row allows (${phoneHeads.map((c) => c.filter((k) => k === "shrink-0" || k === "whitespace-nowrap").join(" ") || "neither").join("; ") || "no phone head found"})`, valueHeads.length === 2 && tableHead.includes("whitespace-nowrap") && tableHead.includes("shrink-0") && phoneHeads.length === 1 && !phoneHeads[0].includes("whitespace-nowrap") && !phoneHeads[0].includes("shrink-0"), { file: "src/components/spine/archetypes/RankedBars.tsx", remedy: "give RankedBars' table head (beside the ceiling's label) shrink-0 whitespace-nowrap, and leave the phone list's value head without either: at 768 the table's head wrapped to two lines in a half-width card, and the phone list has the whole row" });
  }
  check(`it prints on day ${FRESH_DAYS} and not on day ${FRESH_DAYS + 1} after its data ends`, !!buildDuel(day(FRESH_DAYS)) && buildDuel(day(FRESH_DAYS + 1)) === null);
}
check("a monthly item with no data date never prints; a yearly one always does", !isFresh({ refresh: "monthly" }, "2026-10-05") && isFresh({ refresh: "yearly" }, "2099-01-01"));

/* The same fact, one figure: London restaurants' page prints the restaurants row's rate. */
const cell = existsSync("scratchpad/harness/pages/cell-gb-london-restaurants.html") ? readFileSync("scratchpad/harness/pages/cell-gb-london-restaurants.html", "utf8").replace(/<[^>]+>/g, "|") : "";
const r0 = item?.top[0];
if (cell && r0) check(`London restaurants' page prints ${(Math.round(r0.value) / 10).toFixed(1)} of 100, as the duel does`, cell.includes(`|${(Math.round(r0.value) / 10).toFixed(1)}|`));

/* ON THE UK PAGE (plan 2026-10-09, home introduction, Task 4): /gb's chapter 04, beside where new firms last, while the item is fresh. */
const gb = existsSync("scratchpad/harness/pages/country-GB.html") ? readFileSync("scratchpad/harness/pages/country-GB.html", "utf8") : "";
if (gb && buildDuel()) check("/gb's render carries the duel beside where new firms last, its middle stamped from the feed", /id="duel"/.test(gb) && /data-src="editorial\/editorial_feed\.json:fail-most:the middle/.test(gb) && gb.indexOf('id="firms-last"') > -1 && gb.indexOf('id="firms-last"') < gb.indexOf('id="duel"'));
else if (!gb) console.log("DEFER  scratchpad/harness/pages/country-GB.html is not rendered here; the /gb render's check did not run");

/* OFF THE HOME (plan 2026-10-09, home introduction, Task 10): the section is drawn on the page it belongs on, and the home no longer
   draws it. */
const homeRender = existsSync("scratchpad/harness/pages/home-gb.html") ? readFileSync("scratchpad/harness/pages/home-gb.html", "utf8") : "";
if (homeRender) check("the home render no longer carries the section", !/id="duel"/.test(homeRender), { file: "src/components/spine/home/home-view.tsx", remedy: "take the duel out of SpineHomeBody's zones" });

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("home/duel: all pass");
