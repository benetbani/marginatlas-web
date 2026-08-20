/**
 * scripts/lib/strip_comments.ts , shared by the source-scanning gates.
 *
 * WHY THIS IS SHARED RATHER THAN COPIED. Every gate that greps source has to
 * decide what is code and what is a comment, and the obvious implementation is
 * wrong in the same way every time:
 *
 *   const isComment = (line) => line.trim().startsWith("//")
 *
 * That asks whether a line BEGINS a comment, so it understands the first line
 * of a block comment and none of the rest. This repo writes long multi-line
 * explanations almost exclusively, so the continuation lines, which are pure
 * prose, get scanned as if they were rendered code.
 *
 * It has now cost twice in one sitting. verify_no_internal_notes reported four
 * leaks that were all prose inside the comment documenting the real leak, and
 * verify_no_slot_counting, written minutes later, reproduced the identical bug
 * and flagged its own explanation of the banned expression.
 *
 * False positives are not cosmetic here. The cheapest way out of one is the
 * gate's own opt-out marker, and a gate people routinely silence has stopped
 * being a gate.
 */

/** Comment-parser state, carried across the lines of one file. */
export type CommentState = { inBlock: boolean };

export function newCommentState(): CommentState {
  return { inBlock: false };
}

/**
 * Return the CODE half of one line, carrying block state across lines.
 *
 * An inline `// note` and a `/* ... *\/` span both disappear while real code on
 * the same line survives. Call it on every line in order, including ones you
 * intend to skip, or the state machine loses track of an open block.
 *
 * Deliberately not a full lexer: a `//` inside a string literal is treated as a
 * comment. For gates that hunt for banned identifiers that trade is right, and
 * the failure direction is a missed hit rather than a false accusation.
 *
 * A `/*` INSIDE A STRING IS NOT THAT SAME TRADE, and treating it as one was a
 * defect rather than a compromise. The paragraph above reasons about losing ONE
 * line. A false block-comment OPEN loses every line from there to the next `*\/`
 * anywhere in the file, because the state machine carries `inBlock` forward and
 * every subsequent call returns the empty string.
 *
 * Measured on the file that exposed it. `src/app/_design/page.tsx:640` reads
 *
 *     <SubSection title="Charts" caption="board/charts/* (visx, ...)">
 *
 * and that `/` `*` inside the caption opened a block comment that stayed open
 * until an unrelated real `*\/` 195 lines later. Of the 451 non-blank lines
 * after it, 195 were invisible to EVERY source-scanning gate in the chain: 45
 * of its 104 `className` lines and 34 of its 65 `text-` lines simply did not
 * exist as far as the palette, cream, hex and internal-note gates were
 * concerned. A whole live design-catalog card sat in that window.
 *
 * That is the opposite failure direction from the one the paragraph above
 * accepts. It is not a missed hit on a line, it is a gate silently reporting
 * PASS about a file it stopped reading.
 *
 * So a `/*` is only honoured as a comment opener when it is NOT inside a string
 * literal on that line. `//` behaviour is deliberately left exactly as it was:
 * that trade is documented, reasoned and self-limiting, and relitigating it in
 * the same change would make neither result falsifiable.
 */

/**
 * Is `idx` inside a quoted span, judging only by this line?
 *
 * Walks the prefix tracking WHICH quote opened, so an apostrophe inside a
 * double-quoted string does not toggle anything. That distinction is the whole
 * reason this is a scan and not a parity count: `const s = "it's"; /* note *\/`
 * has an odd number of `'` characters before the comment, and a naive count
 * would call the real comment a string and stop stripping it, which is the
 * false accusation the header above is careful to avoid.
 *
 * Single and double quoted strings cannot span lines in JavaScript, so judging
 * per line is correct for them and no state is carried.
 */
function insideString(line: string, idx: number): boolean {
  let quote: string | null = null;
  for (let k = 0; k < idx; k++) {
    const ch = line[k];
    if (ch === "\\") {
      k++; // skip the escaped character, whatever it is
      continue;
    }
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
    }
  }
  return quote !== null;
}

export function stripComments(line: string, state: CommentState): string {
  let out = "";
  let i = 0;
  while (i < line.length) {
    if (state.inBlock) {
      const end = line.indexOf("*/", i);
      if (end === -1) return out;
      state.inBlock = false;
      i = end + 2;
      continue;
    }
    let lineComment = line.indexOf("//", i);
    /* A `//` immediately preceded by `:` is a URL SCHEME, never a comment.
       This is a narrower fact than "is it inside a string", and deliberately so:
       the header above leaves the `//`-in-a-string trade alone on purpose, and
       relitigating it here would make neither result falsifiable. `://` is not a
       comment in JavaScript, TypeScript, JSX or CSS, in a string or out of one.

       MEASURED, which is why this is a defect rather than the documented trade.
       Across `src/`, 64 lines in 34 files carry a scheme, and everything to the
       right of it was invisible to every gate importing this module: 4,179
       characters. The worst is `src/app/globals.css:707`, an inline SVG data URI
       opening `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'`,
       which hid 513 characters INCLUDING `fill='%23241b11'`. `%23` is an encoded
       `#`, so that is a hardcoded hex colour on a live stylesheet that
       `verify_hardcoded_hex` imports this module to find and could not see.

       NOT COVERED, stated so nobody assumes it is: a protocol-relative `//cdn...`
       has no scheme to key on, and `foo(// comment` is legal JavaScript, so
       guarding on the opening bracket would introduce the false-accusation
       direction this module is careful to avoid. Protocol-relative URLs measured
       zero times in `src/` at the time of writing. */
    while (lineComment > 0 && line[lineComment - 1] === ":") {
      lineComment = line.indexOf("//", lineComment + 2);
    }
    let blockOpen = line.indexOf("/*", i);
    // Step over any `/*` that is quoted rather than opening a comment.
    while (blockOpen !== -1 && insideString(line, blockOpen)) {
      blockOpen = line.indexOf("/*", blockOpen + 2);
    }
    if (blockOpen !== -1 && (lineComment === -1 || blockOpen < lineComment)) {
      out += line.slice(i, blockOpen);
      state.inBlock = true;
      i = blockOpen + 2;
      continue;
    }
    if (lineComment !== -1) return out + line.slice(i, lineComment);
    return out + line.slice(i);
  }
  return out;
}

/**
 * Strip a whole file at once: same order in, code-half out, one line per line.
 *
 * WHY THIS EXISTS RATHER THAN EVERY GATE CARRYING THE LOOP. `stripComments` is a
 * state machine and it must be fed EVERY line IN ORDER. That requirement is
 * invisible at the call site and it is easy to break in two different ways, both
 * of which were found in the chain on 2026-08-20:
 *
 *   1. A cheap `continue` guard placed BEFORE the strip. Every line the guard
 *      skips is a line the machine never sees, so a block comment stays "open"
 *      long after its close went past and the gate silently stops reading.
 *
 *   2. RANDOM ACCESS. Three gates (`bar_budget`, `no_eyebrow`,
 *      `subsection_icons`) do not iterate lines at all: they scan the raw source
 *      for a tag, compute which line the match landed on, and ask whether THAT
 *      line is a comment. A stateful stripper cannot answer that question,
 *      because there is no "current" line. Handing them this array is the only
 *      correct conversion, and it is why the seven remaining gates are not one
 *      recipe.
 *
 * Index the result by line number and both problems disappear: the ordering
 * happens once, here, where it can be seen.
 */
export function stripCommentLines(lines: string[]): string[] {
  const state = newCommentState();
  return lines.map((line) => stripComments(line, state));
}
