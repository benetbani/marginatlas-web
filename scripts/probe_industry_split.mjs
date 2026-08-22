/**
 * probe_industry_split , can the trade page's $100 stack fail to total 100?
 *
 * Unlike the cell page's version, this one is built as a residual: the fixed
 * stage is whatever is left after the other three, so the four parts add to
 * exactly a hundred and no rounding can escape. That is the good design.
 *
 * BUT EVERY STAGE IS FLOORED AT ZERO, and a floor is a silent correction. This
 * runs the real arithmetic over margin ladders that are not in textbook order,
 * which measured data is under no obligation to be, and reports what the stack
 * totals when a floor fires.
 *
 *   node scripts/probe_industry_split.mjs
 */
const split = (gross, operating, net) => {
  const direct = Math.max(0, 100 - gross);
  const running = Math.max(0, gross - operating);
  const kept = net;
  const fixed = Math.max(0, 100 - direct - running - kept);
  return { direct, running, fixed, kept, total: direct + running + fixed + kept };
};

/* Ladders in the order a textbook expects, and ladders that are not. Nothing
   upstream promises the second kind cannot arrive. */
const CASES = [
  ["ordinary", 62, 14, 7],
  ["thin", 38, 9, 3],
  ["fat", 74, 31, 22],
  ["operating above gross", 40, 52, 6],
  ["net above operating", 60, 8, 15],
  ["net above gross", 45, 20, 55],
  ["all equal", 30, 30, 30],
];

let broken = 0;
console.log(`\n  ladder                     direct running fixed kept   total`);
console.log(`  ${"-".repeat(62)}`);
for (const [name, g, o, n] of CASES) {
  const s = split(g, o, n);
  const bad = Math.abs(s.total - 100) > 0.001;
  if (bad) broken++;
  console.log(
    `  ${name.padEnd(24)} ${String(s.direct).padStart(6)} ${String(s.running).padStart(7)} ${String(s.fixed).padStart(5)} ${String(s.kept).padStart(4)}   ${String(s.total).padStart(5)}${bad ? "   <= NOT 100" : ""}`,
  );
}
console.log(`  ${"-".repeat(62)}`);
console.log(`\n  ${broken} of ${CASES.length} ladders produce a stack that does not total 100.`);
console.log(`  Where the total runs over, the bar is asked to be wider than its own track.`);
console.log(`  Where it runs short, the bar stops before the end of a track labelled $100.\n`);

/* And the second half of the question: the on-bar percentage labels are laid out
   in a separate row using the SAME raw percentages as widths. If the segments are
   ever normalised and the labels are not, every label drifts off its segment. */
console.log(`  The percentage labels are positioned by a second row of boxes using the same`);
console.log(`  raw widths. Whatever is done to one must be done to the other, or the labels`);
console.log(`  slide off the segments they name.\n`);
