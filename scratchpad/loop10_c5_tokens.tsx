/**
 * THROWAWAY, loop run 10, C5.
 *
 * THE QUESTION THIS ANSWERS BEFORE ANY CODE MOVES: does a spine-kit form render
 * correctly OUTSIDE SpineShell? The home page is not wrapped in that shell, and
 * the shell injects a `:root` block of colour tokens plus the `.fig` class in an
 * inline <style>. The TYPE ladder (--t-*) lives in globals.css and is therefore
 * global; the PALETTE (--c-*, --terra*) and `.fig` do not.
 *
 * Case A: StackBar with the shell's own <style> present (what a spine page gets).
 * Case B: StackBar with globals.css alone (what the home page would get).
 * Case C: the same, at the home card's real inner width.
 *
 * Run:
 *   npx tsx --tsconfig scripts/tsconfig.harness.json \
 *     --require ./scripts/spikes/stub_next_font.cjs scratchpad/loop10_c5_tokens.tsx
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { StackBar, TERRA } from "../src/components/spine/kit";

const css = readFileSync("scratchpad/pages/site.css", "utf8");

/* The shell's inline block, copied VERBATIM from src/components/spine/shell.tsx
   so case A is what a spine page actually gets and not an approximation. */
const SHELL_STYLE = `:root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;--c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;--terra:#fb8469;--terra-text:#c2410c;--terra-soft:#fff1ed;--terra-border:#ffc7ba;}
.fig{font-family:var(--font-grotesk),ui-sans-serif,sans-serif;font-variant-numeric:tabular-nums lining-nums;letter-spacing:0;font-weight:600}`;

const SEGS = [
  { label: "Costs to run", pct: 89, color: "#c8c8c6" },
  { label: "The owner keeps", pct: 11, color: TERRA, kept: true },
];

function Case({ title, width, shell }: { title: string; width: number; shell: boolean }) {
  return (
    <section style={{ marginBottom: 40 }}>
      {shell ? <style dangerouslySetInnerHTML={{ __html: SHELL_STYLE }} /> : null}
      <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8, color: "#777" }}>{title}</div>
      <div style={{ width, background: "#fff", padding: 24, border: "1px solid #eee", borderRadius: 12 }}>
        <StackBar segments={SEGS} ariaLabel="Costs to run 89 percent, the owner keeps 11 percent" legend />
      </div>
    </section>
  );
}

/* The shell block is injected ONCE at the top for the "with shell" half, because
   :root cannot be scoped: a second case on the same document would inherit it.
   So two documents, not two sections. */
const withShell = renderToStaticMarkup(
  <>
    <style dangerouslySetInnerHTML={{ __html: SHELL_STYLE }} />
    <Case title="A , inside the shell, 958px (home card inner width)" width={958} shell={false} />
    <Case title="B , inside the shell, 303px (phone card inner width)" width={303} shell={false} />
  </>,
);
const noShell = renderToStaticMarkup(
  <>
    <Case title="C , NO shell, 958px , what the home page would draw" width={958} shell={false} />
    <Case title="D , NO shell, 303px" width={303} shell={false} />
  </>,
);

const page = (body: string) =>
  `<!doctype html><meta charset="utf-8"><style>${css}</style><body style="background:#f6f4f2;padding:32px;font-family:system-ui">${body}</body>`;

mkdirSync("scratchpad/loop10", { recursive: true });
writeFileSync("scratchpad/loop10/c5-shell.html", page(withShell));
writeFileSync("scratchpad/loop10/c5-noshell.html", page(noShell));
console.log("wrote scratchpad/loop10/c5-shell.html and c5-noshell.html");
