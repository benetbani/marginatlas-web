/**
 * Phase 2, first migration: BusinessFormationCosts onto the shadcn table.
 *
 * STRUCTURE ADAPTS, SUBSTANCE DOES NOT. Same five columns, same order, same
 * rows, same figures, same formatters, same empty state. What changes is what
 * the table is BUILT OUT OF, and three defects go with it:
 *   - every header gains scope="col"
 *   - the header row becomes sticky, so a long table keeps its labels
 *   - the overflow container comes from the primitive rather than a hand note
 */
import { readFileSync, writeFileSync } from "node:fs";

const p = "src/components/cities/BusinessFormationCosts.tsx";
let s = readFileSync(p, "utf8");

const TH = "text-left px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85";
const THR = "text-right px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85";

const before = `        <div className="rounded-2xl border border-parchment bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-paper-100 border-b border-parchment">
                <th className="${TH}">
                  Tier
                </th>
                <th className="${TH}">
                  Local name
                </th>
                <th className="${THR}">
                  Fees
                </th>
                <th className="${THR}">
                  Time
                </th>
                <th className="${TH}">
                  Complexity
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={\`\${row.tier}-\${row.local_term}-\${i}\`}
                  className="border-t border-parchment"
                >
                  <td className="px-4 py-3 text-ink-900 font-medium">
                    {row.tier}
                  </td>
                  <td className="px-4 py-3 text-ink-800">
                    {row.local_term}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink-900 font-semibold">
                    {formatCost(row.setup_cost_usd)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-ink-800">
                    {formatDays(row.setup_days)}
                  </td>
                  <td className="px-4 py-3 text-left">
                    <ComplexityDots score={row.complexity_score} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>`;

const after = `        /* MIGRATED to the shadcn table primitive, 2026-08-21. Same five
           columns, same order, same rows, same figures, same formatters:
           structure adapts, substance does not.

           THREE DEFECTS GO WITH THE SWAP:
             - every header now carries scope="col". Eleven reader-facing files
               had a table with none at all, and a screen reader cannot
               associate a figure with its column without it.
             - the header row is sticky, so a long table keeps its labels. One
               table on the whole site had this before.
             - the horizontal scroll container comes from the primitive. The
               hand-written note that used to live here recorded a real bug,
               measured at 375 on /gb: the table laid out at 389px inside a
               269px box and overflow-hidden made the last column unreachable
               by any means. Table's own wrapper is overflow-x-auto, so that
               class of bug cannot come back through this component. */
        <div className="rounded-2xl border border-parchment bg-white">
          <Table className="text-sm">
            <TableHeader className="sticky top-0 z-raised bg-paper-100">
              <TableRow className="border-b border-parchment hover:bg-transparent">
                <TableHead scope="col" className="${TH}">
                  Tier
                </TableHead>
                <TableHead scope="col" className="${TH}">
                  Local name
                </TableHead>
                <TableHead scope="col" className="${THR}">
                  Fees
                </TableHead>
                <TableHead scope="col" className="${THR}">
                  Time
                </TableHead>
                <TableHead scope="col" className="${TH}">
                  Complexity
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow
                  key={\`\${row.tier}-\${row.local_term}-\${i}\`}
                  className="border-t border-parchment"
                >
                  <TableCell className="px-4 py-3 text-ink-900 font-medium">
                    {row.tier}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-ink-800">
                    {row.local_term}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right tabular-nums text-ink-900 font-semibold">
                    {formatCost(row.setup_cost_usd)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right tabular-nums text-ink-800">
                    {formatDays(row.setup_days)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-left">
                    <ComplexityDots score={row.complexity_score} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>`;

if (!s.includes(before)) {
  console.error("  the markup did not match. Not touching the file.");
  process.exit(1);
}

s = s.replace(before, after);

/* The import. Placed after the last existing import so nothing reorders. */
const lastImport = s.lastIndexOf("\nimport ");
const eol = s.indexOf("\n", lastImport + 1);
s = s.slice(0, eol + 1) +
  'import {\n  Table,\n  TableBody,\n  TableCell,\n  TableHead,\n  TableHeader,\n  TableRow,\n} from "@/components/ui/table";\n' +
  s.slice(eol + 1);

writeFileSync(p, s);
console.log("  migrated " + p);
