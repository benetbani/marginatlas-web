/**
 * tests/scripts/build_compare.test.ts
 *
 * Gate for the founder's review document (scripts/build_compare.mjs).
 *
 * WHY THIS IS GATED AT ALL. This file is the only thing the founder actually
 * looks at between phases. If it silently drops a pair, or emits a linked image
 * instead of an embedded one, he reviews an incomplete document believing it is
 * complete, and approves work he has not seen. That is a worse failure than any
 * broken page, because it is invisible from both ends.
 *
 * Written in this repository's own test style: a `failed` counter, one line per
 * check, and an exit code. There is no vitest here, and adding a test runner to
 * land one file would be a larger change than the thing being tested.
 */
import { buildCompareHtml } from "../../scripts/build_compare.mjs";

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

/* THE DEFECT THIS EXISTS FOR: a linked image is a broken image the moment the
   file is moved or sent to a phone, and the founder reviews on a phone. */
const oneRow = buildCompareHtml({
  title: "test",
  pairs: [{ label: "desktop", before: "AAA", after: "BBB" }],
});

check(
  "embeds the BEFORE image as a data URI",
  oneRow.includes("data:image/jpeg;base64,AAA"),
);
check(
  "embeds the AFTER image as a data URI",
  oneRow.includes("data:image/jpeg;base64,BBB"),
);
check(
  "links no image by path, so the file survives being moved",
  !/<img[^>]+src="(?!data:)/.test(oneRow),
);

const twoRows = buildCompareHtml({
  title: "t",
  pairs: [
    { label: "desktop", before: "A", after: "B" },
    { label: "phone", before: "C", after: "D" },
  ],
});
check(
  "renders exactly one row per pair",
  (twoRows.match(/class="pair"/g) ?? []).length === 2,
  `got ${(twoRows.match(/class="pair"/g) ?? []).length}`,
);

check("labels each row", twoRows.includes(">desktop<") && twoRows.includes(">phone<"));

/* A label comes from a FILENAME, which is attacker-adjacent only in theory here
   but is still untrusted text being put into markup. Escaping it costs one line
   and removes the whole question. */
const nasty = buildCompareHtml({
  title: '<script>alert(1)</script>',
  pairs: [{ label: '"><script>x</script>', before: "A", after: "B" }],
});
check(
  "escapes the title rather than emitting markup from it",
  !nasty.includes("<script>alert(1)</script>"),
);
check(
  "escapes a label rather than emitting markup from it",
  !nasty.includes("<script>x</script>"),
);

check("emits a complete document", oneRow.startsWith("<!doctype html>"));
check("is responsive, so it reads on a phone", oneRow.includes("width=device-width"));

console.log(failed === 0 ? "\n  all pass" : `\n  ${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
