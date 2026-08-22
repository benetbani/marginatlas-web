/**
 * probe_ramp , how far does the break-even ramp section actually reach, and does
 * its drawing agree with the field it is drawn from?
 *
 *   npx tsx scripts/probe_ramp.ts
 */
import { timeToOpenWeeks } from "../src/lib/markets/opening_archetypes";
import { INDUSTRIES } from "../src/lib/taxonomy";
import seed from "../src/lib/spine-seeds/industries/restaurants.json";

function main() {
  const rampMonths = (seed as any).first_year?.ramp_to_breakeven_months;
  const be = Math.round(rampMonths * (52 / 12));
  const open = timeToOpenWeeks("restaurants");
  const openAt = Math.min(open, be);
  const horizon = Math.max(52, be);

  console.log(`\n  REACH`);
  console.log(`    trades in the live taxonomy: ${INDUSTRIES.length}`);
  console.log(`    trades carrying a bundled ramp figure: 1 ("${(seed as any).meta?.industry}")`);
  console.log(`    so this section appears on 1 trade in ${INDUSTRIES.length} and self-omits on the rest`);

  console.log(`\n  THE DRAWING, for the one trade that has it`);
  console.log(`    ramp_to_breakeven_months = ${rampMonths}  ->  week ${be}, counted from week 0`);
  console.log(`    modelled time to open      = ${open} weeks`);
  console.log(`    Fit-out   wk 0 to ${openAt}`);
  console.log(`    Ramp      wk ${openAt} to ${be}   = ${be - openAt} weeks of actual trading`);
  console.log(`    Profit    wk ${be} to ${horizon}`);

  console.log(`\n  THE DISAGREEMENT`);
  console.log(`    A field named "ramp to break-even, months" = ${rampMonths} reads as ${rampMonths} months`);
  console.log(`    of TRADING, which is ${be} weeks. The drawing gives the trading ramp`);
  console.log(`    ${be - openAt} weeks, because it spends the first ${openAt} on fit-out.`);
  console.log(`    Either the field means "from the day the lease is signed", in which case`);
  console.log(`    the drawing is right and the field's name is misleading, or it means`);
  console.log(`    "from opening", in which case break-even belongs at week ${openAt + be}`);
  console.log(`    and the chart is ${openAt} weeks optimistic.\n`);

  console.log(`  A LATENT CLIPPING FAULT, not firing today`);
  const tickPct = Math.min(100, (be / horizon) * 100);
  console.log(`    the break-even dot sits at ${tickPct.toFixed(0)}% of a track that hides its overflow.`);
  console.log(`    At 0% or 100% half the dot is cut off. A ramp of 52 weeks or more puts it`);
  console.log(`    at exactly 100%. No trade has one yet, so it cannot fire, and it will the`);
  console.log(`    day a slower trade gets a ramp figure.\n`);
}

main();
