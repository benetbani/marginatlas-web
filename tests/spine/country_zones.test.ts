/**
 * THE COMPOSITION (plan 2026-10-13 country-page-journey, Task 4; spec section 6: "The stage order is the phone's one column; a desktop pair
 * joins only two neighbouring slots of one stage"; section 3: "A slot without its data omits itself"). Over every set of the optional slots
 * (slots 3 to 16 and the ruled 5b, 32,768 sets), the zones keep the stage order, hold every drawn slot once, pair only two neighbouring
 * drawn slots of one stage, keep three full widths at most, and give art direction's D3 nothing to find (a chapter's opening zone starting
 * afresh, Q4's answer A); and the four countries' plans draw the slots the replicability gate expects.
 * BLIND SPOT, stated: the plan and the zones as data; the drawn page is the replicability and art-direction gates'.
 *
 * Run: node node_modules/tsx/dist/cli.mjs tests/spine/country_zones.test.ts
 */
import { composeZones, PAIR_SPLIT, WIDE_SLOTS } from "../../src/lib/spine/slots/zones";
import { planCountry } from "../../src/lib/spine/slots/plan";
import { SLOTS, slotDef, type SlotId } from "../../src/lib/spine/country_slots";
import { marginCardFromSnapshot } from "../../src/lib/spine/margin_rows";
import { zoneRhythm } from "../../scripts/lib/zone_rhythm.mjs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "country-zones";
const FILE = "src/lib/spine/slots/zones.ts";
const REMEDY = "pair only two neighbouring drawn slots of one stage (PAIR_SPLIT names each pair's split), keep the stage order and three full widths, and leave D3 nothing to find";
let failed = 0;
const check = (label: string, ok: boolean, file = FILE) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file, detail: label, remedy: REMEDY }); };

const OPTIONAL = SLOTS.filter((s) => s.n >= 3).map((s) => s.id);
const faults: string[] = [];
for (let mask = 0; mask < 1 << OPTIONAL.length; mask++) {
  const drawn: SlotId[] = ["tax-on-profit", "where-it-stands", ...OPTIONAL.filter((_, i) => mask & (1 << i))];
  const zones = composeZones(drawn);
  const flat = zones.flatMap((z) => z.slots);
  const say = (f: string) => { if (faults.length < 12) faults.push(`${drawn.slice(2).join(",") || "(none)"}: ${f}`); };
  if (JSON.stringify(flat) !== JSON.stringify(drawn)) say(`the zones hold ${flat.join(",")}`);
  for (const z of zones) {
    if (new Set(z.slots.map((id) => slotDef(id).stage)).size !== 1) say(`zone ${z.key} joins two stages`);
    if (z.slots.length === 2 && z.stage !== "orient") {
      const [a, b] = z.slots;
      if (drawn.indexOf(b) !== drawn.indexOf(a) + 1 || PAIR_SPLIT[`${a}|${b}`] !== z.split) say(`zone ${z.key} pairs ${a} and ${b} as ${z.split}`);
    }
    if (z.slots.some((id) => WIDE_SLOTS.has(id)) && (z.split !== "wide" || z.slots.length !== 1)) say(`zone ${z.key} holds a full-width slot beside another`);
  }
  if (zones.filter((z) => z.split === "wide").length > 3) say("more than three full widths");
  const d3 = zoneRhythm(zones.map((z) => z.split), zones.map((z) => !!z.chapter));
  if (d3.length) say(`D3: ${d3.join("; ")}`);
}
check(`every set of the optional slots composes clean (${faults.join(" | ") || `all ${1 << OPTIONAL.length}`})`, faults.length === 0);

/* The UK draws every slot but 5b (its trade margins are neither sourced nor marked); Germany draws 5b where its seed holds its margins,
   here the harness snapshot standing in for the seed (the replicability gate reads the render, which holds 5b only with the database). */
const GB: SlotId[] = SLOTS.map((s) => s.id).filter((id) => id !== "margins");
const THIN: SlotId[] = ["tax-on-profit", "where-it-stands", "customers", "spend", "open", "hire", "running-costs", "credit", "exit", "dealings", "close"];
const DE: SlotId[] = ["tax-on-profit", "where-it-stands", "customers", "spend", "margins", "open", "hire", "running-costs", "credit", "peers", "exit", "dealings", "close"];
const TODAY = "2026-10-13";
for (const [iso2, name, want] of [["GB", "the United Kingdom", GB], ["KH", "Cambodia", THIN], ["AF", "Afghanistan", THIN], ["DE", "Germany", DE]] as const) {
  const p = planCountry(iso2, name, TODAY, { card: marginCardFromSnapshot(iso2) });
  check(`${iso2} plans ${p.drawn.length} slots, the replicability gate's ${want.length} (${p.drawn.join(" ")})`, JSON.stringify(p.drawn) === JSON.stringify(want), "src/lib/spine/slots/plan.ts");
}
check("without the seed's margins Germany plans no 5b", !planCountry("DE", "Germany", TODAY).drawn.includes("margins"), "src/lib/spine/slots/plan.ts");

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/country_zones: all pass");
