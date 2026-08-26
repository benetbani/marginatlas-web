import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync } from "node:fs";
import { spineCitySeed } from "../src/lib/spine-seeds";
import { CommercialSpace } from "../src/components/spine/city/city-view";
const C = CommercialSpace as unknown as React.FC<{ d: unknown }>;
const d: any = JSON.parse(JSON.stringify(spineCitySeed));
if (process.argv[3] === "cluster" && d.peers?.list) {
  /* Three peers within a few points of each other. The strip alternates its
     labels above and below by INDEX, so two of the three land on the same side
     with almost no gap between them. */
  const names = d.peers.list.map((p: any) => p.name);
  d.peers.list = d.peers.list.map((p: any, i: number) => ({ ...p, rent_index: [62, 78, 80, 82, 100][i] ?? p.rent_index }));
  void names;
}
writeFileSync(process.argv[2], renderToStaticMarkup(React.createElement(C, { d })), "utf8");
console.log("  captured", process.argv[2]);
