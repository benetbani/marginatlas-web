/**
 * probe_rent_identity , does the percentage on the card reconcile with the two
 * figures printed under it?
 *
 * The card prints a monthly rent, a yearly income, and the share of one that the
 * other takes. A reader can check that third figure against the first two, so it
 * has to survive being checked. Both printed figures are ROUNDED and the
 * percentage is computed from the unrounded ones, so the two can disagree.
 *
 * The rent is printed to one decimal of thousands ON PURPOSE: the card's own
 * comment says it is so "the two sides of the ratio reconcile with the focal
 * percentage". The income beside it is rounded to whole thousands. This measures
 * what that half-measure costs.
 *
 * WHAT THIS CANNOT DISTINGUISH: it sweeps plausible inputs, it does not read the
 * site's data, because this card's inputs are omitted for every city and there is
 * no real pair to test. It answers "how far apart can they get", not "how far
 * apart are they".
 *
 *   node scripts/probe_rent_identity.mjs
 */
const usd = (v) => (v >= 1e6 ? "$" + (v / 1e6).toFixed(1) + "M" : "$" + (v >= 1000 ? Math.round(v / 1000) + "K" : Math.round(v)));

let worst = null;
let n = 0;
let off = 0;
const hist = new Map();

for (let rent = 400; rent <= 5000; rent += 1) {
  for (let inc = 12000; inc <= 120000; inc += 137) {
    const shownPct = Math.round(((rent * 12) / inc) * 100);
    /* Only pairs a real city could produce. An unconstrained sweep reaches a rent of
       $4,750 a month against an income of $12,411 a year, which prints 459%; quoting
       its 21-point gap would be quoting my own test data back as a finding. */
    if (shownPct < 10 || shownPct > 120) continue;
    const rentShown = +(rent / 1000).toFixed(1) * 1000; // what "$1.2K" means
    const incShown = Math.round(inc / 1000) * 1000;     // what "$12K" means
    if (incShown === 0) continue;
    n++;
    const readerPct = Math.round(((rentShown * 12) / incShown) * 100);
    const gap = Math.abs(readerPct - shownPct);
    if (gap > 0) off++;
    hist.set(gap, (hist.get(gap) ?? 0) + 1);
    if (!worst || gap > worst.gap) worst = { gap, rent, inc, shownPct, readerPct, rentShown, incShown };
  }
}

console.log(`\n  ${n.toLocaleString()} plausible rent/income pairs swept`);
console.log(`  ${((off / n) * 100).toFixed(1)}% print a percentage a reader cannot reproduce from the two figures beside it`);
console.log(`  worst gap: ${worst.gap} percentage point(s)`);
console.log(`    rent $${worst.rent} a month shown as ${usd(worst.rentShown)}, income $${worst.inc} shown as ${usd(worst.incShown)}`);
console.log(`    the card prints ${worst.shownPct}%; multiplying the two printed figures gives ${worst.readerPct}%`);
console.log(`\n  how far apart:`);
for (const [g, c] of [...hist.entries()].sort((a, b) => a[0] - b[0]).slice(0, 6)) {
  console.log(`    ${String(g).padStart(2)} point(s)  ${((c / n) * 100).toFixed(1).padStart(5)}%`);
}
console.log(
  `\n  The rent's extra decimal fixes the rent's half of it. The income keeps whole\n` +
    `  thousands, and at a low income that rounding is worth several points.\n`,
);
