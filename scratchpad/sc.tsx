import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";
void (async () => {
  const d: any = await buildSpineCitySeed("london");
  console.log("  scorecard tiles:", (d.scorecard ?? []).map((t: any) => `${t.label}=${t.value}${t.unit ?? ""}`).join(" | "));
  console.log("  quick reads:    ", (d.lenses?.scales ?? []).map((s: any) => s.label).join(" | "));
})();
