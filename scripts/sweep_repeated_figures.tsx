/**
 * sweep_repeated_figures , which figures does one page print more than once?
 *
 * A reader meeting the same number twice on one page assumes they are two
 * different measurements that happen to agree, or that they have lost their
 * place. Neither is what the page means.
 *
 * WHAT THIS CANNOT DISTINGUISH: a genuine repeat from a coincidence. Two
 * unrelated things can honestly both be $2.4K; a total restated beside its parts
 * is correct; and a page that opens with its answer and closes with the same
 * answer is doing that on purpose. It reports a COUNT PER PAGE and the words
 * around the first two appearances, so each can be judged without opening a
 * file. It does not judge.
 *
 * SMALL NUMBERS ARE EXCLUDED. "1", "2%", "3 mo" collide constantly and carry no
 * information about duplication. The threshold is in the code, not implicit, so
 * a later reader can argue with it.
 *
 * TWO BUGS IN THIS INSTRUMENT, FOUND ON ITS FIRST RUN AND FIXED HERE:
 *
 *   1. The figure pattern ended in a character class holding a comma, so a
 *      figure at the end of a clause came back as "$100," and was counted as a
 *      different figure from "$100". Two rows of the first output were that.
 *   2. The COUNT came from the pattern but the CONTEXT came from a plain
 *      substring search, so "$8" was located inside "$180K" and the sweep
 *      printed a quotation that had nothing to do with the figure it named. The
 *      count was right and the evidence beside it was wrong, which is worse than
 *      being wrong twice.
 *
 * See the header of scripts/lib/render_pages.tsx for how to run this.
 */
import { renderAll, text, reportFailures } from "./lib/render_pages";

/** Money, or a percentage-like value. A comma is only part of a figure when three
 *  digits follow it, so "$100," at the end of a clause reads as "$100" and not as
 *  a separate figure. The first version allowed a bare trailing comma and duly
 *  reported "$100," and "$100" as two different numbers on three pages. */
const FIG = /\$\d{1,3}(?:,\d{3})*(?:\.\d+)?[KMB]?|\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\s?(?:%|pp|mo)\b/g;

/** A figure worth caring about. A one-digit percentage repeating is noise. */
function interesting(f: string): boolean {
  if (f.startsWith("$")) return true;
  const n = parseFloat(f.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n >= 10;
}

/** Where the nth occurrence of a figure sits AS A FIGURE, never as a substring
 *  of a longer one. Returns character offsets into the visible text. */
function occurrences(t: string, fig: string): number[] {
  const at: number[] = [];
  FIG.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = FIG.exec(t))) {
    if (m[0] === fig) at.push(m.index);
  }
  return at;
}

void (async () => {
  const pages = await renderAll();
  reportFailures(pages);
  const live = pages.filter((p) => !p.failed);

  let flagged = 0;
  for (const p of live) {
    const t = text(p.html);
    const counts = new Map<string, number>();
    FIG.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = FIG.exec(t))) {
      if (interesting(m[0])) counts.set(m[0], (counts.get(m[0]) ?? 0) + 1);
    }
    const repeats = [...counts.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]);
    if (!repeats.length) continue;
    console.log(`\n  ${p.kind} / ${p.name}`);
    for (const [fig, n] of repeats.slice(0, 6)) {
      flagged++;
      const at = occurrences(t, fig);
      console.log(`    ${fig.padEnd(9)} x${n}`);
      for (const [i, pos] of at.slice(0, 2).entries()) {
        console.log(`      ${i + 1}: ...${t.slice(Math.max(0, pos - 45), pos + 45).trim()}...`);
      }
    }
    if (repeats.length > 6) console.log(`    ...and ${repeats.length - 6} more on this page`);
  }

  console.log(`\n  ${flagged} repeated figure(s) shown, across ${live.length} pages.`);
  console.log(
    `  A repeat is not automatically a fault: two honest measurements can agree, a\n` +
      `  total restated beside its parts is correct, and answer-first pages restate\n` +
      `  their answer at the close on purpose. Every entry needs judging, and the\n` +
      `  judgement belongs in the ledger with its reason.\n`,
  );
})();
