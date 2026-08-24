/**
 * probe_adapter_pool , what does each adapter carry, and what does its page use?
 *
 * The gap between those two is the whole backlog. On 2026-08-24 the trade adapter
 * handed over fourteen blocks and its page rendered four chapters, which means
 * most of the work is CONNECTING what already exists rather than sourcing
 * anything new. This is the instrument that tells the two apart per block.
 *
 * WHAT THIS CANNOT DISTINGUISH: a block that is carried and correctly unused from
 * one that is carried and wrongly ignored. Some blocks are deliberately not
 * rendered (a provenance line, a slug used only to build a link). It reports
 * CARRIED, NOT RENDERED, which is a candidate list, and every entry has to be
 * opened before it is acted on.
 *
 * A SECOND LIMIT worth stating: "used" is decided by looking for the block's own
 * string values in the rendered text. A block carrying only numbers can therefore
 * read as unused when it is drawn as a bar. Those are marked separately rather
 * than lumped in with the genuinely dark ones.
 *
 * See the header of scripts/lib/render_pages.tsx for how to run this.
 */
import { renderAll, text, reportFailures } from "./lib/render_pages";
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";
import { buildSpineCellSeed } from "../src/lib/spine/adapt_cell";
import { buildSpineIndustrySeed } from "../src/lib/spine/adapt_industry";
import { buildSpineHoodSeed } from "../src/lib/spine/adapt_hood";

/** Every string value inside a block, at any depth, long enough to be searched for. */
function strings(v: unknown, out: string[] = []): string[] {
  if (typeof v === "string") {
    /* The cap was 80 and the trade page's headline is 91 characters, so the one
       string that block exists to show was excluded from the search and the block
       came back as unrendered while sitting at the top of the page. Raised, and
       the lower bound kept: a 4-character value collides with everything. */
    if (v.length >= 5 && v.length <= 300) out.push(v);
    return out;
  }
  if (Array.isArray(v)) {
    for (const x of v) strings(x, out);
    return out;
  }
  if (v && typeof v === "object") {
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
      if (k.startsWith("_")) continue; // provenance envelopes are never rendered
      strings(x, out);
    }
  }
  return out;
}

/** Every number inside a block, for the blocks that carry no prose at all. */
function numbers(v: unknown, out: number[] = []): number[] {
  if (typeof v === "number" && Number.isFinite(v)) { out.push(v); return out; }
  if (Array.isArray(v)) { for (const x of v) numbers(x, out); return out; }
  if (v && typeof v === "object") {
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
      if (k.startsWith("_")) continue;
      numbers(x, out);
    }
  }
  return out;
}

void (async () => {
  const pages = await renderAll();
  reportFailures(pages);
  /* Entities are decoded before comparing: the page renders "Cafes &amp; coffee"
     and the block carries "Cafes & coffee", which never match as written. */
  const decode = (t: string) =>
    t.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"')
     .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
  const byKey = new Map(
    pages.filter((p) => !p.failed).map((p) => [`${p.kind}:${p.name}`, decode(text(p.html))]),
  );

  const targets: Array<[string, unknown]> = [
    ["city:London", await buildSpineCitySeed("london")],
    ["cell:london/restaurants", await buildSpineCellSeed("gb", "london", "restaurants")],
    ["industry:restaurants", await buildSpineIndustrySeed("restaurants")],
    ["hood:london", await buildSpineHoodSeed("london")],
  ];

  let darkTotal = 0;
  for (const [key, data] of targets) {
    if (!data || typeof data !== "object") { console.log(`\n  ${key}: the adapter returned nothing`); continue; }
    const rendered = byKey.get(key) ?? "";
    const blocks = Object.entries(data as Record<string, unknown>).filter(([k]) => !k.startsWith("_"));
    console.log(`\n  ${key}   ${blocks.length} block(s) carried, page renders ${rendered.length} chars`);

    const dark: string[] = [];
    const numeric: string[] = [];
    for (const [k, v] of blocks.sort(([a], [b]) => a.localeCompare(b))) {
      const size = Array.isArray(v) ? v.length : v && typeof v === "object" ? Object.keys(v).length : v == null ? 0 : 1;
      if (!size) continue;
      /* A block counts as USED when EITHER its prose or its figures reach the
         page. Checking prose alone and only falling back to figures when there is
         no prose at all was wrong in a way that made the count go UP after a fix
         that should only ever find more matches: a block whose caption is dropped
         but whose numbers are drawn as a bar came back dark. */
      const ss = strings(v);
      /* The floor was 10 and it hid a real result: the trade page's net margin is
         the single number 5, it is printed on the page as "5%", and the block came
         back dark. A floor exists because small integers collide with everything,
         so it is 3 now and the collision risk is accepted: a false "used" is much
         cheaper than a false "dark", which sends someone hunting a section that
         already renders. */
      const ns = numbers(v).filter((n) => Math.abs(n) >= 3);
      const proseHit = ss.some((x) => rendered.includes(x));
      const figureHit = ns.some(
        (n) => rendered.includes(String(Math.round(n))) || rendered.includes(String(Math.round(n / 1000))),
      );
      if (proseHit || figureHit) {
        if (!proseHit && ss.length) numeric.push(`${k} (figures only, its prose does not reach the page)`);
        continue;
      }
      dark.push(`${k} (${size})`);
    }

    for (const d of dark) console.log(`      CARRIED, NOT RENDERED   ${d}`);
    darkTotal += dark.length;
    for (const n of numeric) console.log(`      PARTLY RENDERED         ${n}`);
    if (!dark.length) console.log(`      every carried block reaches the page`);
  }

  console.log(`\n  ${darkTotal} block(s) carried and not rendered across the four London pages.`);
  console.log(
    `  Every line is a CANDIDATE. Some blocks are correctly unused: a provenance\n` +
      `  line, a slug that only builds a link. Open each before acting on it.\n`,
  );
})();
