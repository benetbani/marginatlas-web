import { renderToStaticMarkup } from "react-dom/server";
import * as React from "react";
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";
import { SpineCityBody } from "../src/components/spine/city/city-view";
import { SpineShell } from "../src/components/spine/shell";

const CITIES = ["london", "lagos", "dhaka", "tirana", "la-paz", "kinshasa", "mumbai", "sao-paulo"];
void (async () => {
  for (const c of CITIES) {
    const d: any = await buildSpineCitySeed(c).catch(() => null);
    if (!d) { console.log(`  ${c.padEnd(12)} adapter returned nothing`); continue; }
    const html = renderToStaticMarkup(
      React.createElement(SpineShell as any, null, React.createElement(SpineCityBody as any, { data: d })),
    );
    const text = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const chapters = (html.match(/class="[^"]*"[^>]*>0\d</g) || []).length;
    const cards = (html.match(/backdropFilter|backdrop-filter/g) || []).length;
    console.log(`  ${c.padEnd(12)} ${String(text.length).padStart(5)} chars  ${String(cards).padStart(2)} cards`);
  }
})();
