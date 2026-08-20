import { newCommentState, stripComments, stripCommentLines } from "../../scripts/lib/strip_comments";

let failed = 0;
function check(name: string, lines: string[], expect: string[]) {
  const st = newCommentState();
  const got = lines.map((l) => stripComments(l, st));
  const ok = JSON.stringify(got) === JSON.stringify(expect);
  if (!ok) {
    failed++;
    console.log(`  FAIL  ${name}`);
    console.log(`        got    ${JSON.stringify(got)}`);
    console.log(`        expect ${JSON.stringify(expect)}`);
  } else {
    console.log(`  ok    ${name}`);
  }
}

// THE DEFECT THIS CHANGE EXISTS FOR.
check(
  "a /* inside a double-quoted attribute is code, and opens nothing",
  ['<S caption="board/charts/* (visx)">', '<div className="bg-atlas-500" />'],
  ['<S caption="board/charts/* (visx)">', '<div className="bg-atlas-500" />'],
);

// THE FALSE ACCUSATION THE PREFIX SCAN AVOIDS: an apostrophe inside a
// double-quoted string must not make a real comment look quoted.
check(
  "an apostrophe inside a string does not shield a real comment",
  ['const s = "it\'s"; /* note */ const t = 1;'],
  ['const s = "it\'s";  const t = 1;'],
);

// Everything the stripper already did must keep working.
check("a real inline block comment is stripped", ["const a = 1; /* why */ const b = 2;"], ["const a = 1;  const b = 2;"]);
check(
  "a real multi-line block stays stripped across lines",
  ["/* opening", "  prose with bg-atlas-500 in it", "  more */ const real = 1;"],
  ["", "", " const real = 1;"],
);
check("a line comment is stripped", ["const a = 1; // trailing"], ["const a = 1; "]);
/* THIS CASE USED TO ASSERT THE OPPOSITE, and it was wrong in an instructive way.
   It was named "the documented // in-string trade is UNCHANGED" and it
   demonstrated that trade with `"https://example.com"`, which is the one kind of
   `//` the trade was never about. The trade is about a `//` a human typed inside
   a string; `://` is a URL scheme and is not a comment in any language this repo
   scans. Keeping a URL as the worked example meant the test passed for years
   while a live hex colour sat hidden behind one. */
check(
  "a URL scheme is NOT a comment",
  ['const u = "https://example.com";'],
  ['const u = "https://example.com";'],
);
check(
  "a scheme inside a CSS data URI keeps everything to its right",
  ["  background: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23241b11'%3E\");"],
  ["  background: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23241b11'%3E\");"],
);
check(
  "a real comment AFTER a URL is still stripped",
  ['const u = "https://example.com"; // why'],
  ['const u = "https://example.com"; '],
);
/* The trade itself, demonstrated with an actual example of it this time. */
check(
  "the documented // in-string trade is UNCHANGED",
  ['const s = "a // b";'],
  ['const s = "a '],
);
/* Stated as a test so the gap is visible rather than assumed closed. A
   protocol-relative URL has no scheme to key on, and `foo(// x` is legal
   JavaScript, so this is deliberately not fixed. */
check(
  "a protocol-relative URL is still eaten, deliberately",
  ["  src: url(//cdn.example.com/f.woff2);"],
  ["  src: url("],
);
check("an escaped quote does not open a string", ['const s = "a\\"b"; /* c */ d'], ['const s = "a\\"b";  d']);
check(
  "a template literal shields a /* too",
  ["const t = `a/*b`;", 'const x = "bg-atlas-500";'],
  ["const t = `a/*b`;", 'const x = "bg-atlas-500";'],
);
check("a block opened in code still closes on a later line", ["x /* open", "hidden", "close */ y"], ["x ", "", " y"]);

/* ---- stripCommentLines, the file-level wrapper --------------------------
   Three gates index its result by line number instead of iterating, so the two
   properties that matter are: one entry out per line in, and block state carried
   across the whole array. Both asserted rather than argued, because the commit
   that added the helper shipped with neither. */
function checkLines(name: string, lines: string[], expect: string[]) {
  const got = stripCommentLines(lines);
  const ok = JSON.stringify(got) === JSON.stringify(expect);
  if (!ok) {
    failed++;
    console.log(`  FAIL  ${name}`);
    console.log(`        got    ${JSON.stringify(got)}`);
    console.log(`        expect ${JSON.stringify(expect)}`);
  } else {
    console.log(`  ok    ${name}`);
  }
}

checkLines(
  "stripCommentLines returns one entry per input line",
  ["const a = 1;", "", "const b = 2; // x"],
  ["const a = 1;", "", "const b = 2; "],
);
checkLines(
  "stripCommentLines carries block state across the array",
  ["x /* open", "const hidden = 1;", "close */ const real = 2;"],
  ["x ", "", " const real = 2;"],
);
checkLines(
  "stripCommentLines keeps a URL, so an indexed lookup is not truncated",
  ['const u = "https://example.com/a";'],
  ['const u = "https://example.com/a";'],
);
/* The random-access case the three remaining gates need: a line in the middle of
   a block must be judgeable from the array alone, with no "current line". */
checkLines(
  "an indexed line inside a block reads as empty",
  ["/* a", "   b", "   c */", "const after = 1;"],
  ["", "", "", "const after = 1;"],
);

console.log(failed === 0 ? "\n  all pass" : `\n  ${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
