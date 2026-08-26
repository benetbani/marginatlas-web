/**
 * Add scope="col" to every column header in the remaining reader-facing tables.
 *
 * WHY IT IS SAFE TO DO MECHANICALLY HERE, and it would not be in general. Every
 * one of these four files was checked first: all their <th> live inside <thead>
 * and NONE has a <th> inside <tbody>. So every header in them is a column
 * header, and there is no row-header case to get wrong. A file with headers in
 * both places needs a human, which is why kit/engraved/Compare.tsx was done by
 * hand: it is a metrics-by-countries grid and needed scope="col" on one axis
 * and scope="row" on the other.
 *
 * It only touches `<th ` and `<th>` that do not already carry a scope, so
 * running it twice changes nothing.
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILES = [
  "src/app/(site)/compare/CompareClient.tsx",
  "src/app/(site)/decide/[activity]/[city]/page.tsx",
  "src/app/(site)/industries/[industry]/across/page.tsx",
  "src/components/spine2/page/Ch13Cities.tsx",
];

let total = 0;

for (const f of FILES) {
  const before = readFileSync(f, "utf8");

  /* Guard: refuse the file entirely if a <th> appears after <tbody>. The
     pre-check said none do; this makes the script itself refuse rather than
     rely on that having stayed true. */
  const tbodyAt = before.indexOf("<tbody");
  if (tbodyAt !== -1 && before.indexOf("<th", tbodyAt) !== -1) {
    console.log(`  SKIP  ${f} , has a header inside tbody, needs a human`);
    continue;
  }

  let n = 0;
  const after = before
    /* `<th className=...` and friends. Negative lookahead on scope so a rerun
       is a no-op. */
    .replace(/<th(\s+)(?![^>]*\bscope=)/g, (_m, ws) => {
      n++;
      return `<th scope="col"${ws}`;
    })
    /* The bare `<th>` form. */
    .replace(/<th>/g, () => {
      n++;
      return '<th scope="col">';
    });

  if (n === 0) {
    console.log(`  none  ${f}`);
    continue;
  }
  writeFileSync(f, after);
  total += n;
  console.log(`  ${String(n).padStart(3)}   ${f}`);
}

console.log(`\n  ${total} column headers gained scope`);
