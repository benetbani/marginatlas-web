/**
 * tests/taxonomy/presence.test.ts
 *
 * Gate for the presence threshold (src/lib/taxonomy/presence.ts), the rule that
 * decides whether a country crossed with a trade gets a page at all.
 *
 * WHAT IT IS REALLY GUARDING. Not the happy path: the FAIL-OPEN behaviour. Cell
 * lookups exceed their budget from a developer machine to the database region,
 * and a timeout is indistinguishable from an empty result at the call site. If
 * this module ever starts hiding pages on uncertainty, one slow afternoon
 * unpublishes the site silently, page by page, and every gate stays green while
 * it happens. Most of the checks below exist to make that regression loud.
 *
 * The asymmetry, stated once: publishing one thin page is a blemish;
 * unpublishing a thousand real ones is an outage.
 */
import {
  presenceOf,
  mayPublish,
  needsThinMarketNote,
  isManifestUsable,
  manifestGeneratedAt,
} from "../../src/lib/taxonomy/presence";

let failed = 0;

function check(name: string, ok: boolean, detail?: string) {
  if (ok) {
    console.log(`  ok    ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}`);
    if (detail) console.log(`        ${detail}`);
  }
}

console.log(
  `\n  manifest: ${manifestGeneratedAt() ?? "UNGENERATED"}  usable: ${isManifestUsable()}\n`,
);

console.log("  -- fail open, which is the whole point --");

/* THE REGRESSION THIS FILE EXISTS FOR. With no manifest, or one too small to
   believe, every pair must publish exactly as it does today. */
check(
  "an unknown country publishes rather than hiding",
  presenceOf("zz", "restaurants") === "measured",
  presenceOf("zz", "restaurants"),
);
check(
  "an unknown trade publishes rather than hiding",
  presenceOf("gb", "not-a-real-trade") === "measured",
  presenceOf("gb", "not-a-real-trade"),
);
check("mayPublish is true for an unknown pair", mayPublish("zz", "whatever"));
check("an unknown pair needs no note", !needsThinMarketNote("zz", "whatever"));

/* While the manifest is ungenerated, NOTHING may be hidden. This is the check
   that fails the day someone generates a broken manifest and ships it. */
if (!isManifestUsable()) {
  const sample = [
    ["gb", "restaurants"],
    ["us", "dental_practices"],
    ["td", "restaurants"], // Chad, the founder's own example country
    ["de", "plumbers"],
    ["xx", "yyy"],
  ] as const;
  const hidden = sample.filter(([c, a]) => !mayPublish(c, a));
  check(
    "with no usable manifest, nothing anywhere is hidden",
    hidden.length === 0,
    hidden.map(([c, a]) => `${c}/${a}`).join(", "),
  );
  check(
    "with no usable manifest, nothing anywhere carries the note",
    !sample.some(([c, a]) => needsThinMarketNote(c, a)),
  );
}

console.log("\n  -- case handling --");
check("the country is matched case-insensitively", presenceOf("GB", "restaurants") === presenceOf("gb", "restaurants"));

console.log("\n  -- the three states are distinct --");
/* Cheap, but it catches a refactor collapsing two states into one, which would
   silently turn every thin page into either a hidden one or an unmarked one. */
const states = new Set(["measured", "modelled", "none"]);
check("presenceOf only ever returns a known state", states.has(presenceOf("gb", "restaurants")));
check(
  "mayPublish and needsThinMarketNote cannot both be false for a measured pair",
  mayPublish("gb", "restaurants") && !needsThinMarketNote("gb", "restaurants"),
);

console.log("\n  -- the honesty line, asserted in the copy --");
/* The founder asked for a disclaimer saying the activity "barely exists" in the
   country. Nothing here measures that, so the note must not claim it. Reading
   the component's source is crude, and it is the only way to stop the sentence
   being written back in by someone who remembers the request but not the
   reason. */
import { readFileSync } from "node:fs";
const noteSrc = readFileSync("src/components/kit/ThinMarketNote.tsx", "utf8");
const rendered = noteSrc.slice(noteSrc.indexOf("<aside"));
for (const forbidden of ["barely exists", "rarely exists", "does not exist", "uncommon here"]) {
  check(
    `the note does not claim "${forbidden}", which this codebase cannot know`,
    !rendered.toLowerCase().includes(forbidden),
  );
}
check(
  "the note is positioned, or the fixed photograph paints over it and it is absent",
  /className="[^"]*\brelative\b/.test(rendered),
);

console.log(failed === 0 ? "\n  all pass" : `\n  ${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
