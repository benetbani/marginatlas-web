/**
 * src/components/spine2/Method.tsx
 *
 * How these figures are built (cell 18): a two-panel card whose left half is the
 * arithmetic in full (the Sum component, the five-line working to the
 * published take-home) and whose right half is the per-line provenance,
 * which is literally the EXISTING Ledger in its bare/embedded variant, the
 * mockup itself renders `<div class="ledger" style="border:0">`.
 *
 * M7 (the page's proof of work must not itself need proof), enforced at
 * render, not trusted from data:
 *   start + sum(subs) === result   (subs carry their sign, negatives)
 * On violation: throw in dev, console.error in prod (the prod page still
 * renders, a wrong assertion is a build-loop bug to surface, not a reason
 * to blank a page in front of a reader). `checkMethodArithmetic` is
 * exported so the page-level number gate can run the same check, one
 * constant, one rule (M7).
 *
 * Self-omit (M9): the arithmetic column requires exactly one start, one
 * result and at least one sub, or it omits. If the arithmetic omits but the
 * ledger holds, the Ledger renders alone, framed, provenance without the
 * sum is still worth having. Ledger rows omit individually per the ledger's
 * own rule. Both empty renders nothing.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { GlyphIcon } from "./GlyphIcon";
import { Ledger, type LedgerRow } from "./Ledger";
import { fig } from "./fmt";

export type SumLineKind = "start" | "sub" | "result";

export interface SumLine {
  /** "less staff, 34%" */
  label: string;
  /** "52 orders x $38 x 313 days", muted, inline after the label. */
  detail?: string;
  /** Signed; subs are negative and render with the true minus. */
  value: number;
  kind: SumLineKind;
}

export interface MethodProps extends React.HTMLAttributes<HTMLDivElement> {
  arithmetic: SumLine[];
  /** The shape the ported Ledger takes; rendered bare/embedded. */
  ledger: LedgerRow[];
  /** "Every figure on this page is built from those five lines." */
  footnote?: string;
  arithmeticHeader?: string;
  ledgerHeader?: string;
}

export interface MethodArithmeticCheck {
  /** Structurally a sum: one start, one result, >=1 sub, all finite. */
  wellFormed: boolean;
  /** wellFormed AND start + sum(subs) === result (to the cent). */
  ok: boolean;
  /** start + sum(subs), null when not wellFormed. */
  computed: number | null;
  /** The stated result line's value, null when not wellFormed. */
  result: number | null;
  reason?: string;
}

/**
 * The M7 assertion, exported for the page gate: the same constant that
 * renders the column is the one the gate checks.
 */
export function checkMethodArithmetic(lines: SumLine[]): MethodArithmeticCheck {
  const starts = lines.filter((l) => l.kind === "start");
  const subs = lines.filter((l) => l.kind === "sub");
  const results = lines.filter((l) => l.kind === "result");
  if (
    starts.length !== 1 ||
    results.length !== 1 ||
    subs.length < 1 ||
    lines.some((l) => !Number.isFinite(l.value))
  ) {
    return {
      wellFormed: false,
      ok: false,
      computed: null,
      result: null,
      reason: `needs exactly one start, one result, >=1 sub with finite values; got ${starts.length}/${subs.length}/${results.length}`,
    };
  }
  const computed = subs.reduce((sum, l) => sum + l.value, starts[0].value);
  const result = results[0].value;
  const ok = Math.abs(computed - result) < 0.005;
  return {
    wellFormed: true,
    ok,
    computed,
    result,
    reason: ok ? undefined : `start + subs = ${computed}, stated result = ${result}`,
  };
}

/** "$618,488"; negatives with the true minus: "−$191,731". */
function money(n: number): string {
  return n < 0 ? `−$${fig(Math.abs(n))}` : `$${fig(n)}`;
}

/** The arithmetic column, the only genuinely new rendering in the card. */
const Sum = React.forwardRef<
  HTMLDivElement,
  { lines: SumLine[] } & React.HTMLAttributes<HTMLDivElement>
>(({ lines, className, ...props }, ref) => {
  const check = checkMethodArithmetic(lines);
  if (!check.wellFormed) return null;
  if (!check.ok) {
    const msg = `Sum: the arithmetic does not close (${check.reason}); the page's proof of work must not itself need proof (M7).`;
    if (process.env.NODE_ENV !== "production") throw new Error(msg);
    console.error(msg);
  }
  return (
    <div ref={ref} className={cn("sum", className)} {...props}>
      {lines.map((l, i) => (
        <div
          className={cn("l", l.kind === "sub" && "sub", l.kind === "result" && "res")}
          key={i}
        >
          <span className="t">
            {l.label}
            {l.detail ? <> <span style={{ color: "var(--muted)" }}>{l.detail}</span></> : null}
          </span>
          <span className="v">{money(l.value)}</span>
        </div>
      ))}
    </div>
  );
});
Sum.displayName = "Sum";

const Method = React.forwardRef<HTMLDivElement, MethodProps>(
  (
    {
      arithmetic,
      ledger,
      footnote,
      arithmeticHeader = "The arithmetic, in full",
      ledgerHeader = "Where each line comes from",
      className,
      ...props
    },
    ref,
  ) => {
    const sumWellFormed = checkMethodArithmetic(arithmetic).wellFormed;
    const hasLedger = ledger.some((r) => r.tier != null);

    if (!sumWellFormed && !hasLedger) return null;
    if (!sumWellFormed) {
      // M9: provenance without the sum still renders, framed, on its own.
      return <Ledger ref={ref} rows={ledger} className={className} {...props} />;
    }

    return (
      <div ref={ref} className={cn("method", className)} {...props}>
        <div className="m">
          <div className="h">
            <GlyphIcon id="worked-example" size={18} />
            {arithmeticHeader}
          </div>
          <Sum lines={arithmetic} />
          {footnote ? (
            <p className="note" style={{ marginTop: 14, fontSize: "12.5px" }}>
              {footnote}
            </p>
          ) : null}
        </div>
        {hasLedger ? (
          <div className="m">
            <div className="h">
              <GlyphIcon id="confidence" size={18} />
              {ledgerHeader}
            </div>
            <Ledger header={false} bare rows={ledger} />
          </div>
        ) : null}
      </div>
    );
  },
);
Method.displayName = "Method";

export { Method, Sum };
