/**
 * probe_gloss_city , does the "?" beside the peer strip name the page's own city?
 *
 * The gloss is inside a Radix tooltip, so it is NOT in the server markup and no
 * screenshot or content diff can see it. This walks the element tree the section
 * returns and reads the prop directly, which is the only way to check it without
 * a live browser.
 *
 *   npx tsx --tsconfig scripts/tsconfig.harness.json scripts/probe_gloss_city.tsx
 */
import * as React from "react";
import { CommercialSpace } from "../src/components/spine/city/city-view";
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";

function glosses(node: any, out: string[] = []): string[] {
  if (!node || typeof node !== "object") return out;
  if (Array.isArray(node)) { for (const n of node) glosses(n, out); return out; }
  const p = node.props;
  if (p && typeof p.gloss === "string") out.push(p.gloss);
  if (p && p.children) glosses(p.children, out);
  return out;
}

async function main() {
  for (const slug of ["london", "tokyo", "sao-paulo"]) {
    const d: any = await buildSpineCitySeed(slug);
    if (!d) { console.log(`  ${slug}: no such city`); continue; }
    const tree = (CommercialSpace as any)({ d });
    const g = glosses(tree).filter((s) => s.includes("percentage point"));
    console.log(`\n  ${d.meta?.city ?? slug}`);
    console.log(`    header: Against ${d.meta?.city}, in percentage points`);
    console.log(`    gloss:  ${g[0] ? g[0].slice(0, 120) : "(none)"}`);
    /* Checked by INCLUSION, not by a capture. The first version of this used
       `/the (.+?) rent level/`, whose leading `the` matched the one at the start
       of the sentence, so it captured the whole clause and reported a mismatch
       on three cities that were all correct. */
    if (g[0]) {
      const want = `the ${d.meta?.city} rent level`;
      console.log(`    names:  "${want}"   ${g[0].includes(want) ? "PRESENT" : "MISSING"}`);
    }
  }
}
void main();
