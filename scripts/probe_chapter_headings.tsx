/**
 * probe_chapter_headings , does a chapter heading ever announce a chapter that
 * turns out to be empty?
 *
 * A chapter divider is a promise: a number, a title, and a rule, above the
 * sections it opens. The guard that decides whether the divider renders is
 * SEPARATE from the guards inside each section, so the two can disagree, and the
 * failure a reader sees is a numbered heading with a blank space under it. Row 38
 * found exactly that one level down, in a card.
 *
 * WHAT THIS CANNOT DISTINGUISH: a section that renders an empty wrapper from one
 * that renders nothing. It measures RENDERED TEXT under each heading, so an
 * invisible empty div reads the same as no div. That is the right reading here:
 * the question is what a reader sees, not what the tree holds.
 *
 *   npx tsx --tsconfig scripts/tsconfig.harness.json scripts/probe_chapter_headings.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SpineCityBody } from "../src/components/spine/city/city-view";
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";
import { spineCitySeed } from "../src/lib/spine-seeds";

const SLUGS = ["london", "tokyo", "new-york", "sao-paulo", "berlin", "mumbai", "lagos", "sydney"];

/** Split the rendered page at each chapter heading and measure what follows it. */
function chapters(html: string) {
  const out: Array<{ title: string; chars: number }> = [];
  const re = /<h2\b[^>]*>([\s\S]*?)<\/h2>/g;
  const marks: Array<{ title: string; at: number; end: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    marks.push({
      title: m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
      at: m.index,
      end: re.lastIndex,
    });
  }
  for (let i = 0; i < marks.length; i++) {
    const slice = html.slice(marks[i].end, i + 1 < marks.length ? marks[i + 1].at : html.length);
    const text = slice.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    out.push({ title: marks[i].title, chars: text.length });
  }
  return out;
}

function report(name: string, d: any) {
  const C = SpineCityBody as unknown as React.FC<{ data: any }>;
  const html = renderToStaticMarkup(React.createElement(C, { data: d }));
  const ch = chapters(html);
  const empty = ch.filter((c) => c.chars === 0);
  console.log(`\n  ${name}   ${ch.length} chapter heading(s)`);
  for (const c of ch) {
    console.log(`    ${c.chars === 0 ? "EMPTY  " : "       "}${c.title.slice(0, 40).padEnd(42)} ${String(c.chars).padStart(5)} chars follow`);
  }
  return empty.length;
}

async function main() {
  let bad = 0;
  for (const slug of SLUGS) {
    const d: any = await buildSpineCitySeed(slug);
    if (!d) continue;
    bad += report(d.meta?.city ?? slug, d);
  }
  /* The bundled sample is NOT rendered whole here. It carries map coordinates, and
     the map is a client component that asks Next for a router, which does not exist
     outside a request. Real cities hold no coordinates so their map self-omits and
     they render fine. This instrument therefore reads REAL pages only, which is the
     population the question is about. */
  console.log(`\n  ${bad} chapter heading(s) with nothing under them.\n`);
}
/* ------------------------------------------------------------------------- *
 * THE TWO SECTIONS THE LEDGER NEVER LISTED. The customers chapter is built to
 * hold four cards: the spending pool, the seasonal split, what customers earn,
 * and rent measured against that income. Only the first two were ever written
 * down. This asks whether the other two reach a reader at all.
 * ------------------------------------------------------------------------- */
async function unlisted() {
  const { IncomeCurve, RentAffordability } = await import("../src/components/spine/city/chapters");
  console.log("  the two sections that were never in the ledger\n");
  for (const slug of [...SLUGS]) {
    const d: any = await buildSpineCitySeed(slug);
    if (!d) continue;
    const draws = (C: unknown) => {
      const html = renderToStaticMarkup(React.createElement(C as React.FC<{ d: any }>, { d }));
      return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;
    };
    const a = draws(IncomeCurve);
    const b = draws(RentAffordability);
    console.log(
      `    ${String(d.meta?.city ?? slug).padEnd(11)} what customers earn ${a ? String(a).padStart(4) + " chars" : "  nothing"}   rent against income ${b ? String(b).padStart(4) + " chars" : "  nothing"}`,
    );
  }
  const s: any = spineCitySeed;
  const draws = (C: unknown) =>
    renderToStaticMarkup(React.createElement(C as React.FC<{ d: any }>, { d: s })).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length;
  console.log(
    `    ${"the sample".padEnd(11)} what customers earn ${String(draws(IncomeCurve)).padStart(4)} chars   rent against income ${String(draws(RentAffordability)).padStart(4)} chars\n`,
  );
}
void main().then(unlisted);
