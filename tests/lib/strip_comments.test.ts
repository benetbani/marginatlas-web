import { newCommentState, stripComments } from "../../scripts/lib/strip_comments";

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
check(
  "the documented // in-string trade is UNCHANGED",
  ['const u = "https://example.com";'],
  ['const u = "https:'],
);
check("an escaped quote does not open a string", ['const s = "a\\"b"; /* c */ d'], ['const s = "a\\"b";  d']);
check(
  "a template literal shields a /* too",
  ["const t = `a/*b`;", 'const x = "bg-atlas-500";'],
  ["const t = `a/*b`;", 'const x = "bg-atlas-500";'],
);
check("a block opened in code still closes on a later line", ["x /* open", "hidden", "close */ y"], ["x ", "", " y"]);

console.log(failed === 0 ? "\n  all pass" : `\n  ${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
