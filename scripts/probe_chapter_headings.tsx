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
/* THE UNLISTED-SECTION HALF OF THIS PROBE IS GONE (plan step 32's fourth
 * dispatch, 2026-09-18). It rendered the customers chapter's earnings card
 * (`IncomeCurve`, chapters.tsx) alone to ask whether it reached a reader;
 * that card is retired and its seat, `Earnings` in city-view.tsx, is a
 * RangeStrip off `buildCityEarningsStrip(slug)`, in the census like every
 * other section, so the question is answered by the census and the page
 * filter rather than here. The heading half above stands. */
void main();
