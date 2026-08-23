/**
 * probe_city_peers_table , can the peer comparison table ever render?
 *
 * The table adds a row only when has(key) is true, and has(key) asks whether any
 * peer carries a field of that name. The four calls pass DISPLAY keys, "rent",
 * "spend", "income" and "vis". The data fields are rent_index, spend_index,
 * median_income_usd and visitors_m. So the check never finds anything, no row is
 * ever added, and the component returns null before it draws.
 *
 * This reproduces the check in isolation against both shapes of data the site
 * has: the bundled sample and a real city. If it fails on both, the table cannot
 * render for anyone and is not a data problem.
 *
 *   node scripts/probe_city_peers_table.mjs
 */
const SAMPLE = [
  { name: "London", home: true, rent_index: 100, median_income_usd: 47000, visitors_m: 20, spend_index: 100 },
  { name: "Paris", rent_index: 78, median_income_usd: 42000, visitors_m: 18, spend_index: 82 },
];
const REAL = [
  { name: "London", home: true, rent_index: 75, median_income_usd: 64800, visitors_m: 16 },
  { name: "Munich", rent_index: 75, median_income_usd: 62000, visitors_m: 8 },
];

/** The check exactly as the component writes it. */
const has = (rows, key) => rows.some((r) => r[key] != null);

for (const [label, rows] of [["the bundled sample", SAMPLE], ["a real city", REAL]]) {
  console.log(`\n  ${label}`);
  let added = 0;
  for (const [key, field] of [["rent", "rent_index"], ["spend", "spend_index"], ["income", "median_income_usd"], ["vis", "visitors_m"]]) {
    const asWritten = has(rows, key);
    const asIntended = has(rows, field);
    if (asWritten) added++;
    console.log(
      `    row "${key}"`.padEnd(18) +
        `checked as "${key}": ${String(asWritten).padEnd(5)}   should have checked "${field}": ${asIntended}`,
    );
  }
  console.log(`    rows added: ${added}  =>  the table ${added === 0 ? "RETURNS NULL BEFORE IT DRAWS" : "draws"}`);
}
console.log(`\n  The table cannot render for any input. It is not a data gap.\n`);
