import { buildSpineCellSeed } from "../src/lib/spine/adapt_cell";
void (async () => {
  const d: any = await buildSpineCellSeed("in","mumbai","cafes-coffee-shops");
  console.log("  take_home:", JSON.stringify(d?.take_home ?? d?.headline ?? {}).slice(0,240));
  console.log("  meta.sample/prov:", JSON.stringify(d?.meta ?? {}).slice(0,300));
})();
