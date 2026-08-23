/**
 * probe_wage_roles , how many pay roles does a real cell actually carry?
 *
 * The wage card prints the first three roles at the top and then ALL of them in
 * rows below. A comment in that card justifies the repeat: "removing the repeat
 * takes a figure off the page". That justification only holds while there are
 * MORE than three roles. With exactly three, the two blocks are identical and
 * the top one is pure duplication.
 *
 * WHAT THIS CANNOT DISTINGUISH: it reads the cells in the shared sample. A cell
 * type carrying more roles would change the answer, so the count is per cell and
 * not averaged.
 *
 * See the header of scripts/lib/render_pages.tsx for how to run this.
 */
import { buildSpineCellSeed } from "../src/lib/spine/adapt_cell";
import { CELLS } from "./lib/render_pages";

void (async () => {
  console.log("");
  for (const [c, g, i] of CELLS) {
    const d: any = await buildSpineCellSeed(c, g, i);
    if (!d) { console.log(`  ${g}/${i}: no such cell`); continue; }
    const roles = d.wages?.roles ?? d.wages?.list ?? [];
    const n = Array.isArray(roles) ? roles.length : 0;
    console.log(
      `  ${`${g}/${i}`.padEnd(24)} ${String(n).padStart(2)} role(s)   ${
        n === 0 ? "card omits" : n <= 3 ? "TOP BLOCK IS A VERBATIM COPY OF THE ROWS" : `top block repeats 3 of ${n}`
      }`,
    );
    if (n) console.log(`      ${roles.map((r: any) => `${r.role} ${r.mid_usd}`).join(" / ")}`);
  }
  console.log("");
})();
