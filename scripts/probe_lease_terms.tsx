/**
 * probe_lease_terms , does the lease-terms card reach a reader, and does the
 * peer strip beside it compute a real gap?
 *
 * WHAT THIS CANNOT DISTINGUISH: it reads ONE city. A field the adapter drops
 * unconditionally is dropped for every city, but a field that depends on a
 * per-city record would need the whole set. Both fields checked here are
 * unconditional in the adapter, which is why one city settles it.
 *
 *   npx tsx --tsconfig scripts/tsconfig.harness.json scripts/probe_lease_terms.tsx
 */
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";
import { spineCitySeed } from "../src/lib/spine-seeds";

const seed: any = spineCitySeed;

function report(name: string, d: any) {
  const s = d?.space ?? {};
  const hasTerms =
    s.deposit_months != null && s.lease_years_typical != null && s.rent_free_months != null;
  console.log(`\n  ${name}`);
  console.log(`    space present:       ${d?.space ? "yes" : "NO"}`);
  console.log(`    deposit_months:      ${s.deposit_months ?? "(absent)"}`);
  console.log(`    lease_years_typical: ${s.lease_years_typical ?? "(absent)"}`);
  console.log(`    rent_free_months:    ${s.rent_free_months ?? "(absent)"}`);
  console.log(`    => the lease-terms card ${hasTerms ? "RENDERS" : "does NOT render"}`);

  const list = d?.peers?.list ?? [];
  const withIdx = list.filter((p: any) => p.rent_index != null);
  console.log(`    peers carrying a rent index: ${withIdx.length} of ${list.length}`);
  for (const p of withIdx) {
    const delta = (p.rent_index || 0) - 100;
    console.log(
      `      ${p.home ? "HOME " : "     "}${String(p.name).padEnd(12)} index ${String(p.rent_index).padStart(4)}   drawn as ${delta > 0 ? "+" : ""}${delta}pp`,
    );
  }
  const home = withIdx.find((p: any) => p.home);
  if (home) {
    const hd = (home.rent_index || 0) - 100;
    console.log(
      `    => the home city is drawn ${hd === 0 ? "at 0, correct" : `at ${hd > 0 ? "+" : ""}${hd}pp AGAINST ITSELF`}`,
    );
  }
}

async function main() {
  const live: any = await buildSpineCitySeed("london");
  report("LIVE, through the adapter a real city page uses", live);
  report("SEED, the bundled sample the workshop renders", seed);
}
void main();
