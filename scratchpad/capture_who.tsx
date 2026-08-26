import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync } from "node:fs";
import { spineIndustrySeed } from "../src/lib/spine-seeds";
import { WhoItSuits } from "../src/components/spine/industry/industry-view";
const C = WhoItSuits as unknown as React.FC<{ d: unknown }>;
const d: any = JSON.parse(JSON.stringify(spineIndustrySeed));
if (process.argv[3] === "onesided") {
  /* the live builder makes this shape whenever a trade has a thing to watch out
     for and no stated edge, or the reverse: it fires on either one alone. */
  d.who_suits = { suits: [], think_twice: [(d.who_suits?.think_twice ?? [])[0] ?? "Anyone expecting a passive income."] };
} else if (process.argv[3] === "live") {
  /* the live adapter builds exactly one line on each side, from the trade's
     character: one edge, one thing to watch out for. */
  d.who_suits = {
    suits: [(d.who_suits?.suits ?? [])[0] ?? "Operators who already know the trade."],
    think_twice: [(d.who_suits?.think_twice ?? [])[0] ?? "Anyone expecting a passive income."],
  };
}
writeFileSync(process.argv[2], renderToStaticMarkup(React.createElement(C, { d })), "utf8");
console.log("  captured", process.argv[2], process.argv[3] || "workshop");
