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
    const lineComment = line.indexOf("//", i);
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
