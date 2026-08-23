/**
 * probe_split_identity , what does the resident/visitor bar do when its two
 * figures do not add to 100?
 *
 * The bar is two segments whose widths are the two percentages. It claims, by
 * being a whole bar, that they account for everything. Nothing checks that they
 * do. The two figures are rounded independently upstream, which is exactly how a
 * pair like that drifts off its own total.
 *
 * WHAT THIS CANNOT DISTINGUISH: it reproduces the geometry, it does not render
 * the component. It answers "what would the bar look like", not "does this
 * happen", and today it does not: all eight real cities land on exactly 100.
 *
 *   node scripts/probe_split_identity.mjs
 */
const CASES = [
  [72, 28, "today's London"],
  [92, 8, "today's Tokyo"],
  [71, 28, "each rounded down"],
  [72, 29, "each rounded up"],
  [60, 25, "a third slice that was dropped upstream"],
];

console.log("");
for (const [res, vis, why] of CASES) {
  const total = res + vis;
  const gap = 100 - total;
  const look =
    gap === 0
      ? "correct"
      : gap > 0
        ? `a ${gap}% GAP of bare card showing through the end of the bar`
        : `${-gap}% too much: the last segment is squeezed, so the drawn widths stop matching the printed figures`;
  console.log(`  ${String(res).padStart(3)} + ${String(vis).padStart(2)} = ${String(total).padStart(3)}   ${look}`);
  console.log(`      (${why})`);
}
console.log(
  `\n  The bar draws whatever it is given. A reader sees a whole bar and reads it as\n` +
    `  a whole, so a bar that is 99% full is a claim about the missing 1% that nobody\n` +
    `  made.\n`,
);
