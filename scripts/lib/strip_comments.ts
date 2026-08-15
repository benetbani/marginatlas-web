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
 */
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
    const blockOpen = line.indexOf("/*", i);
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
