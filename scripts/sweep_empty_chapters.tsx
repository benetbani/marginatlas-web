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
 * CALIBRATION, NOW A REGRESSION CHECK. It was built to prove the closing chapter
 * of a city page was empty on New York, Mumbai, Lagos and Sydney. It was, on all
 * four, and the cause was a comparison table whose guard checked a display key
 * against a data object so it could never draw. With that repaired the four fill,
 * so the check is inverted: they must never go empty again.
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

  /* THE CALIBRATION TURNED INTO A REGRESSION CHECK, 2026-08-24. It used to assert
     that the closing chapter WAS empty on these four cities, which is what this
     sweep was built to prove. That emptiness was then traced to a comparison
     table whose guard checked a display key against a data object, so it could
     never draw; repairing it filled all four. A calibration pinned to a fixed bug
     reports a false failure forever, so it now asserts the opposite: these four
     must never go empty again. */
  const watch = ["New York", "Mumbai", "Lagos", "Sydney"];
  const regressed = empties
    .filter(([, n, t]) => t === "The next move" && watch.includes(n))
    .map(([, n]) => n);
  console.log(
    regressed.length
      ? `\n  REGRESSION. The closing chapter is empty again on ${regressed.join(", ")}.\n  It was empty on all four until 2026-08-24, when repairing the peer comparison\n  table's guard filled them.\n`
      : `\n  Regression check passed: the closing chapter carries content on all four\n  cities that used to render it empty.\n`,
  );
})();
