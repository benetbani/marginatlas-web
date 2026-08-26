import { isSpineReformEnabledFor, isSpineReformEnabled } from "@/lib/feature_flags";
const pages = ["country", "city", "cell", "hood", "industry", "region"] as const;
console.log("  master switch:", isSpineReformEnabled());
for (const p of pages) {
  console.log(`  ${p.padEnd(10)} spine=${isSpineReformEnabledFor(p as any)}`);
}
