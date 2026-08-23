/**
 * sweep_dead_sections , which section titles never reach a reader?
 *
 * A section here is a card with a title. When the module that builds a real page
 * drops that card's figures, the card omits itself, correctly, and its title is
 * never rendered. Eleven such sections have been found one at a time, an
 * iteration each. This finds the rest in one pass.
 *
 * WHAT THIS CANNOT DISTINGUISH: a title that is absent because the section
 * omitted from a title that is absent because this sample of entities happens
 * not to trigger it. It reports NEVER SEEN ACROSS THE SAMPLE, which is a
 * candidate, not a verdict. Each has to be opened, exactly like the table sweep.
 *
 * CALIBRATION: it must report "Rent against income" and "The lease terms", both
 * confirmed dead by hand. If it does not, the instrument is broken and its
 * zeroes mean nothing. Five instruments have produced false results in this loop
 * already, and one of them nearly hid a real result.
 *
 * See the header of scripts/lib/render_pages.tsx for how to run this.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";
import { renderAll, text, reportFailures } from "./lib/render_pages";

/** Every literal section title written in the spine source. */
function declaredTitles(): Map<string, string> {
  const titles = new Map<string, string>();
  const files: string[] = [];
  (function walk(d: string) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) {
        walk(p);
        continue;
      }
      if (extname(p) === ".tsx") files.push(p);
    }
  })("src/components/spine");
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    const rel = relative(process.cwd(), f).split(sep).join("/");
    /* <Head ...>Title</Head> and <Rail kicker="Title" ... /> are the two forms a
       section title takes in this codebase. Anything interpolated is skipped: a
       title built from data is not a fixed string and cannot be searched for. */
    for (const m of src.matchAll(/<Head\b[^>]*>([^<{}]{3,60})<\/Head>/g)) {
      if (!titles.has(m[1].trim())) titles.set(m[1].trim(), rel);
    }
    for (const m of src.matchAll(/kicker="([^"{}]{3,60})"/g)) {
      if (!titles.has(m[1].trim())) titles.set(m[1].trim(), rel);
    }
  }
  return titles;
}

void (async () => {
  const pages = await renderAll();
  reportFailures(pages);
  const rendered = pages.filter((p) => !p.failed).map((p) => ({ ...p, t: text(p.html) }));
  const titles = declaredTitles();

  const dead: Array<[string, string]> = [];
  const alive: Array<[string, number]> = [];
  for (const [title, file] of titles) {
    const hits = rendered.filter((p) => p.t.includes(title)).length;
    if (hits === 0) dead.push([title, file]);
    else alive.push([title, hits]);
  }

  console.log(`\n  ${titles.size} section titles declared in the spine`);
  console.log(`  ${alive.length} reach a reader on at least one of the ${rendered.length} real pages rendered`);
  console.log(`  ${dead.length} reach NONE of them\n`);
  for (const [t, f] of dead.sort()) console.log(`    never seen   ${t.padEnd(36)} ${f}`);

  const calib = ["Rent against income", "The lease terms"];
  const missed = calib.filter((c) => !dead.some(([t]) => t === c));
  console.log(
    missed.length
      ? `\n  CALIBRATION FAILED. These are dead and this sweep did not say so: ${missed.join(", ")}.\n  Do not trust the list above.\n`
      : `\n  Calibration passed: both hand-confirmed dead sections are in the list.\n`,
  );
  console.log(
    `  Each is a CANDIDATE. This cannot tell a section that never renders from one\n` +
      `  this sample of entities does not happen to trigger. Open each before acting.\n`,
  );
})();
