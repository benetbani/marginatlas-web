/**
 * sweep_empty_chapters , does any chapter heading open onto nothing?
 *
 * A chapter divider is a promise: a number, a title, a rule, and then the
 * sections it opens. The guard that decides whether the divider renders is
 * separate from the guards inside each section, so the two can disagree, and
 * what a reader gets is a numbered heading above a blank space.
 *
 * WHAT THIS CANNOT DISTINGUISH: a chapter holding an invisible empty container
 * from one holding nothing at all. It measures RENDERED TEXT between one heading
 * and the next, which is the right reading here: the question is what a reader
 * sees, not what the tree holds.
 *
 * CALIBRATION: it must report "The next move" empty on New York, Mumbai, Lagos
 * and Sydney, all four confirmed by hand. If it does not, the instrument is
 * broken and its zeroes mean nothing.
 *
 * See the header of scripts/lib/render_pages.tsx for how to run this.
 */
import { renderAll, reportFailures } from "./lib/render_pages";

function chapters(html: string) {
  const marks: Array<{ title: string; at: number; end: number }> = [];
  const re = /<h2\b[^>]*>([\s\S]*?)<\/h2>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    marks.push({
      title: m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
      at: m.index,
      end: re.lastIndex,
    });
  }
  return marks.map((mark, i) => {
    const slice = html.slice(mark.end, i + 1 < marks.length ? marks[i + 1].at : html.length);
    return { title: mark.title, chars: slice.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length };
  });
}

void (async () => {
  const pages = await renderAll();
  reportFailures(pages);
  const live = pages.filter((p) => !p.failed);

  const empties: Array<[string, string, string]> = [];
  const thin: Array<[string, string, string, number]> = [];
  let total = 0;
  for (const p of live) {
    for (const c of chapters(p.html)) {
      total++;
      if (c.chars === 0) empties.push([p.kind, p.name, c.title]);
      /* A chapter carrying less than its own heading again is not empty and is
         not healthy either. Reported separately so the two are never conflated. */
      else if (c.chars < 80) thin.push([p.kind, p.name, c.title, c.chars]);
    }
  }

  console.log(`\n  ${live.length} real pages rendered, ${total} chapter headings between them`);
  console.log(`  ${empties.length} with NOTHING under them\n`);
  for (const [k, n, t] of empties) console.log(`    EMPTY  ${k.padEnd(9)} ${n.padEnd(22)} ${t}`);

  console.log(`\n  ${thin.length} carrying under 80 characters, which is thin but not empty\n`);
  for (const [k, n, t, c] of thin) console.log(`    ${String(c).padStart(4)}c  ${k.padEnd(9)} ${n.padEnd(22)} ${t}`);

  const want = ["New York", "Mumbai", "Lagos", "Sydney"];
  const got = empties.filter(([, , t]) => t === "The next move").map(([, n]) => n);
  const missed = want.filter((w) => !got.includes(w));
  console.log(
    missed.length
      ? `\n  CALIBRATION FAILED. "The next move" is empty on ${missed.join(", ")} and this\n  sweep did not say so. Do not trust the lists above.\n`
      : `\n  Calibration passed: all four hand-confirmed empty chapters are in the list.\n`,
  );
})();
