import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

import { getTopRegionalCells, regionalCellUrl } from "../src/lib/cells";
import { score100to10 } from "../src/components/QualityDots";

async function main() {
  for (const lim of [50, 100, 200, 500, 1000]) {
    const start = Date.now();
    const cells = await getTopRegionalCells(lim);
    console.log(`limit=${lim}: cells=${cells.length} elapsed=${Date.now() - start}ms`);
  }
  const cells = await getTopRegionalCells(500);
  console.log(`\nfinal cells: ${cells.length}`);
  if (cells.length === 0) {
    console.log("EMPTY — this is why shard 2 has 110 bytes");
    return;
  }
  const noGeo = cells.filter((c) => !c.geo_id).length;
  const noInd = cells.filter((c) => !c.industry_id).length;
  console.log(`null geo_id: ${noGeo}`);
  console.log(`null industry_id: ${noInd}`);
  const goodQuality = cells.filter((c) => score100to10(c.quality_score) >= 4);
  console.log(`good quality (score100to10 >= 4): ${goodQuality.length}`);
  const validUrls = goodQuality.map((c) => regionalCellUrl(c)).filter((u) => u.length > 0);
  console.log(`valid URLs: ${validUrls.length}`);
  if (validUrls.length > 0) {
    console.log("samples:");
    validUrls.slice(0, 5).forEach((u) => console.log(`  ${u}`));
  }
}
main();
