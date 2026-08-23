/**
 * sweep_cross_page_figures , does the same claim disagree between two pages?
 *
 * A reader who reads the London city page and then a London restaurant page is
 * reading two modules that never speak to each other. The city adapter already
 * carries a written warning that one field name holds a median in one place and
 * a mean in another, and that "the gap between them is real". Nothing has ever
 * checked what a reader would actually see.
 *
 * ================== THE GROUPING, AND THE BUG IT REPLACES ==================
 *
 * The first version of this grouped every industry page together under "world"
 * and duly reported three conflicts: restaurants keep $7 per $100, nail salons
 * keep $13, cafes keep $9. Those are THREE DIFFERENT TRADES and they are
 * supposed to differ. The instrument had invented its own finding, and the site
 * has a ratified rule against exactly that error: never compare across business
 * and geography, always like for like.
 *
 * So the grouping is now explicit about what makes two pages comparable:
 *
 *   a CITY page is about a place, and no trade.
 *   a CELL page is about a place AND a trade.
 *   an INDUSTRY page is about a trade, and no place, and is world-wide.
 *
 * Two pages are compared only when they describe the SAME PLACE, and only on
 * PLACE-LEVEL claims (what people earn, what a home costs). A trade-level claim
 * such as the cost to open is never compared across trades, and a world-wide
 * trade figure is never compared against one city's.
 *
 * WHAT THIS STILL CANNOT DISTINGUISH: two figures that should differ from two
 * that should not, when both are place-level but measured differently (a median
 * against a mean is the known case). It reports the pair; the judgement is a
 * human's.
 *
 * See the header of scripts/lib/render_pages.tsx for how to run this.
 */
import { renderAll, text, reportFailures } from "./lib/render_pages";

/** Claims about a PLACE. Deliberately excludes anything trade-specific. */
const PLACE_CLAIMS: Array<{ label: string; re: RegExp }> = [
  { label: "median income", re: /median income[^$]{0,40}(\$[\d.,]+[KMB]?)/i },
  { label: "one-bed rent", re: /one-bed rent[^$]{0,40}(\$[\d.,]+[KMB]?)/i },
  { label: "rent a month", re: /(\$[\d.,]+[KMB]?)\s*a month/i },
  { label: "spent per resident", re: /(\$[\d.,]+[KMB]?)\s*spent per resident/i },
];

/** The place a page is about, or null when it is about a trade instead. */
function placeOf(p: { kind: string; name: string }): string | null {
  if (p.kind === "city") return p.name.toLowerCase().replace(/\s+/g, "-");
  if (p.kind === "cell") return p.name.split("/")[0].toLowerCase();
  if (p.kind === "hood") return p.name.toLowerCase();
  return null; // industry pages are world-wide
}

void (async () => {
  const pages = await renderAll();
  reportFailures(pages);
  const live = pages.filter((p) => !p.failed).map((p) => ({ ...p, t: text(p.html) }));

  const byPlace = new Map<string, typeof live>();
  for (const p of live) {
    const k = placeOf(p);
    if (!k) continue;
    if (!byPlace.has(k)) byPlace.set(k, []);
    byPlace.get(k)!.push(p);
  }

  const comparable = [...byPlace.entries()].filter(([, g]) => g.length >= 2);
  let conflicts = 0;
  let agreements = 0;
  let nothingToCompare = 0;

  console.log(`\n  ${live.length} pages rendered.`);
  console.log(`  ${comparable.length} place(s) described by two or more pages, which is the only`);
  console.log(`  situation in which a like-for-like comparison exists at all:`);
  for (const [k, g] of comparable) console.log(`    ${k.padEnd(12)} ${g.map((p) => `${p.kind}/${p.name}`).join(", ")}`);

  for (const [k, group] of comparable) {
    for (const claim of PLACE_CLAIMS) {
      const found = group
        .map((g) => ({ where: `${g.kind}/${g.name}`, v: (g.t.match(claim.re) ?? [])[1] }))
        .filter((x): x is { where: string; v: string } => Boolean(x.v));
      if (found.length < 2) { nothingToCompare++; continue; }
      if (new Set(found.map((f) => f.v)).size === 1) { agreements++; continue; }
      conflicts++;
      console.log(`\n  ${k} , "${claim.label}" reads differently on two pages:`);
      for (const f of found) console.log(`    ${f.where.padEnd(26)} ${f.v}`);
    }
  }

  console.log(`\n  ${conflicts} place-level claim(s) that DISAGREE between two pages about the same place`);
  console.log(`  ${agreements} that appear on two such pages and AGREE`);
  console.log(`  ${nothingToCompare} where fewer than two pages print it, so nothing could be compared\n`);
  console.log(
    `  Read those three together. A zero on the first line means nothing on its own:\n` +
      `  when the third is large, the claims simply never meet, and that is the more\n` +
      `  likely reading on this site because half its sections reach no reader.\n`,
  );
})();
