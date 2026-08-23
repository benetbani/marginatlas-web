/**
 * render_pages , render every spine page type from REAL data, once, for the
 * sweeps to share.
 *
 * WHAT THIS CANNOT DISTINGUISH: it renders a FIXED SAMPLE of entities, not all
 * of them. A fault that depends on one unusual city will be missed. It answers
 * "does this happen across a spread of real pages", never "does this never
 * happen". Every sweep that imports this must repeat that limit in its own
 * output rather than assume the reader knows it.
 *
 * THE SAMPLE IS DELIBERATE: four continents, and both a high-income and a
 * low-income city, because several faults found by hand only appear at one end
 * (the rent-against-income gap is worst at a low income; the peer strip's label
 * crowding needs two cities sharing an index).
 *
 * HOW TO RUN ANYTHING THAT IMPORTS THIS. The neighbourhood page reaches the
 * spine shell, which loads a font through Next's font loader, and that loader
 * only exists inside a Next build: without the stub it throws before a single
 * page renders. The two Supabase variables are needed because the adapters
 * construct a client at import time even when they never call it.
 *
 *   export $(grep -E "^NEXT_PUBLIC_SUPABASE_(URL|ANON_KEY)=" .env.local | xargs -d '
')
 *   npx tsx --tsconfig scripts/tsconfig.harness.json  *     --require ./scripts/spikes/stub_next_font.cjs scripts/<sweep>.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { buildSpineCitySeed } from "../../src/lib/spine/adapt_city";
import { buildSpineCellSeed } from "../../src/lib/spine/adapt_cell";
import { buildSpineIndustrySeed } from "../../src/lib/spine/adapt_industry";
import { buildSpineHoodSeed } from "../../src/lib/spine/adapt_hood";
import { SpineCityBody } from "../../src/components/spine/city/city-view";
import { SpineCellBody } from "../../src/components/spine/cell/cell-view";
import { SpineIndustryBody } from "../../src/components/spine/industry/industry-view";
import { SpineHoodBody } from "../../src/components/spine/hood/hood-view";

export type Page = { kind: string; name: string; html: string; failed?: string };

export const CITIES = [
  "london",
  "tokyo",
  "new-york",
  "sao-paulo",
  "berlin",
  "mumbai",
  "lagos",
  "sydney",
];
export const CELLS: Array<[string, string, string]> = [
  ["gb", "london", "restaurants"],
  ["gb", "london", "hair-salons"],
  ["us", "new-york", "restaurants"],
];
export const INDUSTRIES = ["restaurants", "hair-salons", "cafes"];
export const HOODS = ["london"];

function draw(C: unknown, data: any): { html: string; failed?: string } {
  try {
    return { html: renderToStaticMarkup(React.createElement(C as React.FC<{ data: any }>, { data })) };
  } catch (e: any) {
    /* A page that cannot render in this harness is REPORTED, never counted as
       clean. The map is a client component and asks Next for a router that does
       not exist outside a request, which is why the bundled samples cannot be
       rendered whole here. */
    return { html: "", failed: String(e?.message ?? e).slice(0, 90) };
  }
}

export async function renderAll(): Promise<Page[]> {
  const out: Page[] = [];
  for (const slug of CITIES) {
    const d = await buildSpineCitySeed(slug);
    if (!d) continue;
    out.push({ kind: "city", name: d.meta?.city ?? slug, ...draw(SpineCityBody, d) });
  }
  for (const [c, g, i] of CELLS) {
    const d = await buildSpineCellSeed(c, g, i);
    if (!d) continue;
    out.push({ kind: "cell", name: `${g}/${i}`, ...draw(SpineCellBody, d) });
  }
  for (const slug of INDUSTRIES) {
    const d = await buildSpineIndustrySeed(slug);
    if (!d) continue;
    out.push({ kind: "industry", name: slug, ...draw(SpineIndustryBody, d) });
  }
  for (const slug of HOODS) {
    const d = await buildSpineHoodSeed(slug);
    if (!d) continue;
    out.push({ kind: "hood", name: slug, ...draw(SpineHoodBody, d) });
  }
  return out;
}

/** Print, once, whatever could not be rendered. A sweep that stays silent about
 *  a page it never saw is reporting a clean bill for something it did not read. */
export function reportFailures(pages: Page[]): void {
  const bad = pages.filter((p) => p.failed);
  if (!bad.length) return;
  console.log(`\n  ${bad.length} page(s) COULD NOT BE RENDERED and are not in the counts below:`);
  for (const p of bad) console.log(`    ${p.kind}/${p.name}: ${p.failed}`);
}

/** Visible text of a render, whitespace collapsed. */
export const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

/** Every figure a reader can see: money, percentages, plain numbers with units. */
export function figures(html: string): string[] {
  return text(html).match(/\$[\d.,]+[KMB]?|\b\d[\d.,]*\s?(?:%|pp|mo|K|M|B)\b/g) ?? [];
}
