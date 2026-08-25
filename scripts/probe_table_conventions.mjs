/**
 * probe_table_conventions , WHAT EVERY TABLE ON THE FOUR PAGES ACTUALLY DOES.
 *
 * NOT A GATE, and deliberately not one yet. Three instruments written this week
 * were wrong on their first reading, each in a way that only a picture exposed,
 * and two of them shouted about faults that were not there. So this REPORTS FACTS
 * per table and leaves the verdict to a person looking at a crop.
 *
 * Section J of the art direction names F2 to F8 as held by nothing but attention.
 * These pages are largely tables, so that is the largest unchecked surface left.
 *
 *   F2  header row micro, uppercase, muted, never bold, never filled
 *   F3  hairline rules between rows; no zebra striping, no vertical rules
 *   F4  the reference row or column is tinted; nothing is bolded
 *   F5  the best value in each COMPARISON takes terracotta; nothing else does.
 *       THE COMPARISON IS NOT ALWAYS A COLUMN. Where the rows are measures and
 *       the columns are cases, the winner is per ROW, and counting per column
 *       reports a correct table as one fault per row. This probe counts per
 *       column only, so read its F5 lines against the table orientation.
 *   F6  an unknown cell renders an en-dash, never a zero, never blank
 *   F7  a nil difference against the reference reads "same", not "0"
 *   F8  four or more columns must still fit half a band
 *
 * WHAT IT CANNOT SEE, stated before the numbers are quoted. It cannot tell which
 * row is the REFERENCE, so F4 is reported as "rows carrying a tint" and "rows
 * carrying bold" and a person decides whether those are the same row. It cannot
 * tell which value in a column is BEST, so F5 is reported as a count of coloured
 * cells per column: one is expected, more than one is worth looking at, zero may
 * be correct where no value wins. It cannot tell a signed-difference column from
 * any other, so F7 is reported as "columns whose cells are mostly signed" and
 * whether any of those cells is a bare zero.
 *
 * Usage: node scripts/probe_table_conventions.mjs [--width N]
 */
import { eachPageAtWidths } from "./lib/measure_pages.mjs";

const argv = process.argv.slice(2);
const WIDTH = argv.includes("--width") ? Number(argv[argv.indexOf("--width") + 1]) : 1280;

function collect() {
  const TERRA = ["rgb(251, 132, 105)", "rgb(194, 65, 12)"];
  const isTerra = (c) => TERRA.includes(c);
  const out = [];

  for (const t of document.querySelectorAll("table")) {
    const rect = t.getBoundingClientRect();
    if (rect.width < 40) continue;

    /* The card this table sits in, so its width can be judged against the space
       it was given rather than against the viewport. */
    let card = t.parentElement;
    while (card && getComputedStyle(card).backdropFilter === "none") card = card.parentElement;
    const cardW = card ? card.getBoundingClientRect().width : 0;

    const rail = card ? card.querySelector("h2, h3, [class*=rail]") : null;
    const label = ((rail && rail.textContent) || (t.textContent || "")).trim().replace(/\s+/g, " ").slice(0, 40);

    const heads = [...t.querySelectorAll("thead th")];
    const headStyles = heads.map((h) => {
      const s = getComputedStyle(h);
      return {
        weight: Number(s.fontWeight),
        transform: s.textTransform,
        size: parseFloat(s.fontSize),
        filled: s.backgroundColor !== "rgba(0, 0, 0, 0)",
      };
    });

    const bodyRows = [...t.querySelectorAll("tbody tr")];
    const rowBg = bodyRows.map((r) => getComputedStyle(r).backgroundColor);
    const distinctBg = [...new Set(rowBg)];
    /* Zebra is an ALTERNATING pattern, not merely two colours: one tinted row in a
       table of plain ones is a reference row, which F4 asks for. */
    let zebra = false;
    if (distinctBg.length === 2 && rowBg.length >= 4) {
      zebra = rowBg.every((c, i) => c === rowBg[i % 2]);
    }

    let rowRules = 0, vertRules = 0;
    for (const r of bodyRows) {
      if (parseFloat(getComputedStyle(r).borderBottomWidth) > 0) rowRules++;
      for (const c of r.children) {
        const s = getComputedStyle(c);
        if (parseFloat(s.borderLeftWidth) > 0 || parseFloat(s.borderRightWidth) > 0) vertRules++;
      }
      if (parseFloat(getComputedStyle(r).borderBottomWidth) === 0) {
        for (const c of r.children) {
          if (parseFloat(getComputedStyle(c).borderBottomWidth) > 0) { rowRules++; break; }
        }
      }
    }

    const tintedRows = rowBg.filter((c) => c !== "rgba(0, 0, 0, 0)" && c !== rowBg[0]).length;
    const boldRows = bodyRows.filter((r) =>
      [...r.children].some((c) => Number(getComputedStyle(c).fontWeight) >= 600),
    ).length;

    /* Per column: how many cells carry the accent, how many are empty, whether the
       column reads as signed differences, and whether any signed cell is a bare 0. */
    const colCount = Math.max(1, ...bodyRows.map((r) => r.children.length));
    const cols = [];
    for (let i = 0; i < colCount; i++) {
      let accent = 0, empty = 0, signed = 0, bareZero = 0, cells = 0;
      for (const r of bodyRows) {
        const c = r.children[i];
        if (!c) continue;
        cells++;
        const txt = (c.textContent || "").trim();
        if (!txt) { empty++; continue; }
        const s = getComputedStyle(c);
        if (isTerra(s.color) || [...c.querySelectorAll("*")].some((e) => isTerra(getComputedStyle(e).color))) accent++;
        if (/^[+-]/.test(txt)) signed++;
        if (/^0(\.0+)?(pp|%|x)?$/.test(txt)) bareZero++;
      }
      if (cells) cols.push({ i, accent, empty, signed, bareZero, cells });
    }

    out.push({
      label,
      w: Math.round(rect.width),
      cardW: Math.round(cardW),
      colCount,
      rows: bodyRows.length,
      headBold: headStyles.filter((h) => h.weight >= 700).length,
      headNotUpper: headStyles.filter((h) => h.transform !== "uppercase").length,
      headFilled: headStyles.filter((h) => h.filled).length,
      headSizes: [...new Set(headStyles.map((h) => Math.round(h.size)))],
      rowRules,
      vertRules,
      zebra,
      tintedRows,
      boldRows,
      cols,
    });
  }
  return out;
}

const runs = await eachPageAtWidths([WIDTH], collect);

console.log(`\n  every table on the four pages at ${WIDTH}px\n`);
let n = 0;
for (const { name, result } of runs[0].result) {
  for (const t of result) {
    n++;
    const page = name.replace("-london", "").replace("london-", "");
    console.log(`  ${page} / ${t.label}`);
    console.log(`    ${t.colCount} columns, ${t.rows} rows, ${t.w}px wide in a ${t.cardW}px card`);

    const notes = [];
    if (t.headBold) notes.push(`F2 ${t.headBold} header cell(s) at weight 700 or more`);
    if (t.headNotUpper) notes.push(`F2 ${t.headNotUpper} header cell(s) not uppercase`);
    if (t.headFilled) notes.push(`F2 ${t.headFilled} header cell(s) carry a fill`);
    if (t.headSizes.length > 1) notes.push(`F2 header cells at ${t.headSizes.join(" and ")}px`);
    if (t.rows > 1 && t.rowRules < t.rows - 1) notes.push(`F3 ${t.rowRules} rule(s) between ${t.rows} rows`);
    if (t.vertRules) notes.push(`F3 ${t.vertRules} vertical rule(s)`);
    if (t.zebra) notes.push("F3 alternating row fills");
    if (t.tintedRows && t.boldRows) notes.push(`F4 ${t.tintedRows} tinted row(s) AND ${t.boldRows} row(s) carrying bold`);
    else if (t.boldRows && !t.tintedRows) notes.push(`F4 ${t.boldRows} row(s) carrying bold, none tinted`);
    for (const c of t.cols) {
      if (c.accent > 1) notes.push(`F5 column ${c.i + 1} has ${c.accent} accented cells`);
      if (c.empty) notes.push(`F6 column ${c.i + 1} has ${c.empty} empty cell(s) of ${c.cells}`);
      if (c.signed >= Math.ceil(c.cells / 2) && c.bareZero) {
        notes.push(`F7 column ${c.i + 1} reads as signed differences and carries ${c.bareZero} bare zero(s)`);
      }
    }
    if (t.colCount >= 4 && t.cardW && t.w > t.cardW * 0.98) {
      notes.push(`F8 ${t.colCount} columns filling the whole card`);
    }

    if (notes.length) notes.forEach((x) => console.log(`      ${x}`));
    else console.log("      nothing to look at");
    console.log("");
  }
}
console.log(`  ${n} table(s) examined. Every line above is a FACT, not a verdict: look at the crop before changing anything.\n`);
