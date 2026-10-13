/**
 * ART DIRECTION D3 AND D6 ON THE ZONES (plan 2026-10-12 rhythm-air-inside, Task 1D; spec E:/atlas/docs/superpowers/specs/2026-10-12-rhythm-air-inside-design.md,
 * section 3 item 4). Both found a level by the old Band class, which no live page carries, and passed reading nothing. The judging is
 * scripts/lib/zone_rhythm.mjs's: fixtures, among them the zone sequences the chain's renders drew on 2026-10-12, and the gate's wiring.
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
check("no zones, no reading, no red", same(zoneLadder({ levelGaps: [], pairGaps: [], keptPads: [] }), []));

const gate = stripCommentLines(readFileSync(GATE, "utf8").split(/\r?\n/)).join("\n");
check("the art-direction gate reads the zones, judges them with zone_rhythm.mjs, and no longer looks for the old Band class", /from "\.\/lib\/zone_rhythm\.mjs"/.test(gate) && /querySelectorAll\("main \[data-zone\]"\)/.test(gate) && /zoneRhythm\(result\.zoneSplits\)/.test(gate) && /zoneLadder\(result\)/.test(gate) && !/mt-8 grid grid-cols-1 items-start gap-8/.test(gate), GATE, "read `main [data-zone]` in collect() and judge in node with zoneRhythm and zoneLadder");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/zone_rhythm: all pass");
