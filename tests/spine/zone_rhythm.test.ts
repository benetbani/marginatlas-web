/**
 * ART DIRECTION D3 AND D6 ON THE ZONES (plan 2026-10-12 rhythm-air-inside, Task 1D; spec E:/atlas/docs/superpowers/specs/2026-10-12-rhythm-air-inside-design.md,
 * section 3 item 4). Both found a level by the old Band class, which no live page carries, and passed reading nothing. The judging is
 * scripts/lib/zone_rhythm.mjs's: fixtures, among them the zone sequences the chain's renders drew on 2026-10-12, and the gate's wiring, among
 * it the stop on a render that read no zone (a reading of nothing is a finding, never a pass: the plan's standing ruling).
 * BLIND SPOT, stated: it judges sequences and distances handed to it; the pages are the art-direction gate's, at 1440.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/zone_rhythm.test.ts
 */
import { readFileSync } from "node:fs";
import { zoneRhythm, zoneLadder } from "../../scripts/lib/zone_rhythm.mjs";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "zone-rhythm";
const LIB = "scripts/lib/zone_rhythm.mjs";
const GATE = "scripts/verify_art_direction.mjs";
const REMEDY = "judge the zones as the spec reads them: no zone repeats the split before it (a wide zone holds none, lone is one), never three equal halves in a row; a level further from the next than two sections in a level, they further than a kept box's padding";
let failed = 0;
const check = (label: string, ok: boolean, file = LIB, remedy = REMEDY) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy }); };
const same = (got: string[], want: string[]) => JSON.stringify(got) === JSON.stringify(want);

const GB = ["wide", "1-1", "3-2", "lone", "1-1-1", "3-2", "lone", "wide", "1-1", "1-1", "lone", "lone", "1-1", "2-1", "2-1", "3-2", "1-1", "wide"];
check(`country-GB as drawn on 2026-10-12: zones 9 and 10, 11 and 12, 14 and 15 (${zoneRhythm(GB).join("; ")})`, same(zoneRhythm(GB), ["zones 9 and 10 both split 1-1", "zones 11 and 12 both split lone", "zones 14 and 15 both split 2-1"]));
check("industry-restaurants: zones 5 and 6", same(zoneRhythm(["wide", "1-2", "2-1", "wide", "2-1", "2-1", "wide"]), ["zones 5 and 6 both split 2-1"]));
check("country-AF: zones 3 and 4, met because its peers zone drops", same(zoneRhythm(["wide", "2-3", "1-1", "1-1", "1-1-1", "1-1", "2-1", "wide"]), ["zones 3 and 4 both split 1-1"]));
check("cell-gb-london-barbershops: zones 4 and 5, met because it draws no peers zone", same(zoneRhythm(["wide", "1-2", "lone", "3-2", "3-2", "1-1", "wide", "1-2", "3-2", "lone", "wide"]), ["zones 4 and 5 both split 3-2"]));
check("city-london opens with two wide zones: a wide zone holds no split, so no repeat", same(zoneRhythm(["wide", "wide", "1-1", "1-1-1", "1-1", "2-1", "1-1", "2-1", "wide"]), []));
check("three equal halves in a row read twice as repeats and once as the run", same(zoneRhythm(["1-1", "1-1", "1-1"]), ["zones 1 and 2 both split 1-1", "zones 2 and 3 both split 1-1", "zones 1 to 3 are three equal halves in a row"]));
check("the band page's ladder at 1440 holds: 128 over 64 over 20", same(zoneLadder({ levelGaps: [128, 128], pairGaps: [64, 32], keptPads: [20] }), []));
check("a level no further from the next than two sections in it is a D6 red", zoneLadder({ levelGaps: [64], pairGaps: [64], keptPads: [20] }).length === 1);
check("two sections no further apart than a kept box's padding is a D6 red", zoneLadder({ levelGaps: [128], pairGaps: [16], keptPads: [20] }).length === 1);
check("no distances read, no D6 finding (a page of one zone has no level to measure; whether any zone was read is zoneRhythm's, next)", same(zoneLadder({ levelGaps: [], pairGaps: [], keptPads: [] }), []));
const none = zoneRhythm([]);
check(`a render that reads no zone is one finding that names the zone markup, never a pass (${none.length} finding)`, none.length === 1 && /Remedy: .*src\/components\/spine\/zones\.tsx/.test(none[0]), LIB, "return NO_ZONE_READ for an empty splits array in zoneRhythm: a reading of nothing is a finding, never [], and its remedy names src/components/spine/zones.tsx");

const gate = stripCommentLines(readFileSync(GATE, "utf8").split(/\r?\n/)).join("\n");
check("a chapter's opening zone starts afresh: two lone zones with a chapter head between them are no repeat", same(zoneRhythm(["wide", "lone", "lone", "wide"], [false, true, true, false]), []));
check("inside one chapter two lone neighbours still repeat", same(zoneRhythm(["wide", "lone", "lone"], [false, true, false]), ["zones 2 and 3 both split lone"]));
check("no run of three equal halves crosses a chapter's head", same(zoneRhythm(["1-1", "1-1", "1-1"], [false, false, true]), ["zones 1 and 2 both split 1-1"]));
/* LONE ZONES ALTERNATING THEIR SIDE (plan Q4's option C; final review I3, 2026-10-15): a lone zone on the right is "lone-end", so a run that
   alternates is no repeat, and two on one side still are; the art-direction gate reads the side off `data-zone-side`. */
check("lone zones that alternate their side are no repeat; two on one side are", same(zoneRhythm(["wide", "lone", "lone-end", "lone", "wide"], [false, true, false, false, false]), []) && same(zoneRhythm(["lone-end", "lone-end"]), ["zones 1 and 2 both split lone-end"]));
check("the art-direction gate reads a right-hand lone zone as lone-end", /data-zone-side/.test(gate) && /"lone-end"/.test(gate));
check("the art-direction gate reads the zones, judges them with zone_rhythm.mjs, a chapter's opening zone afresh, and no longer looks for the old Band class", /from "\.\/lib\/zone_rhythm\.mjs"/.test(gate) && /querySelectorAll\("main \[data-zone\]"\)/.test(gate) && /zoneRhythm\(result\.zoneSplits, result\.zoneStarts\)/.test(gate) && /zoneLadder\(result\)/.test(gate) && !/mt-8 grid grid-cols-1 items-start gap-8/.test(gate), GATE, "read `main [data-zone]` in collect() and judge in node with zoneRhythm and zoneLadder");
const unreadAt = gate.indexOf("const unread = pages.filter((p) => !p.result.zoneSplits.length);");
const unreadExit = unreadAt === -1 ? -1 : gate.indexOf("process.exit(1);", unreadAt);
check("the art-direction gate stops on a render that read no zone, printing NO_ZONE_READ, ahead of the baseline's write and compare", unreadAt !== -1 && unreadExit !== -1 && gate.slice(unreadAt, unreadExit).includes("if (unread.length)") && gate.slice(unreadAt, unreadExit).includes("NO_ZONE_READ") && unreadExit < gate.indexOf('process.argv.includes("--write-baseline")'), GATE, "keep `const unread = pages.filter(...)`, its NO_ZONE_READ line and its process.exit(1) above the --write-baseline branch, so no baseline can absorb a render that was not read");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/zone_rhythm: all pass");
