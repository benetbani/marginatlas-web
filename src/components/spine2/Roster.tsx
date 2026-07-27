/**
 * src/components/spine2/Roster.tsx
 *
 * The rota (cell 08): one bar per role where the BAR is one person's wage
 * and the row FIGURE is the whole line's true cost, totalled against a rule.
 * The two-numbers-per-row trick is the section's whole insight.
 *
 * DERIVED, never passed (M5/M7):
 *   line figure = wage x (count ?? 1) x (1 + contribPct/100)
 *   total       = sum of line figures
 *   bar width   = wage / max(wage)
 *   lead        = the highest-wage role (n1 fill)
 * If the total were passed in it would drift from the rows the first time a
 * wage moved.
 *
 * M7: the header micro-caption "bar is one person, figure is the whole line"
 * is the component's own fixed encoding statement, shipped INSIDE the
 * component so it can never describe a different encoding.
 *
 * M4 (text-on-fill): every in-bar figure is white; the stylesheet's v8 layer
 * pins role bars to n2 and the lead bar to n1, both on the white side of the
 * n2/n3 line, and this component only ever renders those two fills (.role /
 * .role.lead). The A5 non-italic fix for the <i> bar element is carried by
 * the stylesheet's font-style:normal rule.
 *
 * Self-omit (M9): a role without a wage does not render. The total row
 * renders ONLY when every listed role has a wage, a partial sum labelled
 * "All-in, a year" would be false. Section omits under 2 roles.
 */
import * as React from "react";

import { cn } from "@/lib/utils";
import { GlyphIcon } from "./GlyphIcon";
import type { GlyphId } from "./glyphs";
import { usd } from "./fmt";

export interface RosterRole {
  label: string;
  glyph?: GlyphId;
  /** ONE person's yearly wage, the in-bar figure. Null omits the row (M9). */
  wage: number | null;
  /** People on the line; default 1. "x2" renders from this. */
  count?: number;
  /** Label suffix only. */
  partTime?: boolean;
}

export interface RosterProps extends React.HTMLAttributes<HTMLDivElement> {
  roles: RosterRole[];
  /** Employer on-cost applied to every wage, e.g. 15. */
  contribPct: number;
  /** The header lead; the encoding micro-caption is fixed and always ships. */
  caption?: string;
  /** The total row's label. */
  totalLabel?: string;
}

/** The line's true cost, the derivation the whole component exists for. */
export function rosterLine(role: RosterRole, contribPct: number): number | null {
  if (role.wage == null || !Number.isFinite(role.wage) || role.wage <= 0) return null;
  return role.wage * (role.count ?? 1) * (1 + contribPct / 100);
}

const Roster = React.forwardRef<HTMLDivElement, RosterProps>(
  (
    {
      roles,
      contribPct,
      caption = "What each role is paid",
      totalLabel = "All-in, a year",
      className,
      ...props
    },
    ref,
  ) => {
    const rows = roles
      .map((r) => ({ role: r, line: rosterLine(r, contribPct) }))
      .filter((r): r is { role: RosterRole; line: number } => r.line != null);
    if (rows.length < 2) return null;

    const everyRoleHasWage = rows.length === roles.length;
    const maxWage = Math.max(...rows.map((r) => r.role.wage as number));
    const leadIdx = rows.findIndex((r) => r.role.wage === maxWage);
    const total = rows.reduce((sum, r) => sum + r.line, 0);

    return (
      <div ref={ref} className={cn(className)} {...props}>
        <div className="lab" style={{ marginBottom: 16 }}>
          {caption}{" "}
          <span
            style={{
              textTransform: "none",
              letterSpacing: 0,
              color: "var(--muted)",
              fontWeight: 400,
            }}
          >
            bar is one person, figure is the whole line
          </span>
        </div>
        <div className="roster">
          {rows.map(({ role, line }, i) => {
            const count = role.count ?? 1;
            return (
              <div className={cn("role", i === leadIdx && "lead")} key={i}>
                <span className="nm">
                  {role.glyph ? <GlyphIcon id={role.glyph} size={18} /> : null}
                  {role.label}
                  {role.partTime ? ", part time" : ""}
                  {count > 1 ? ` ×${count}` : ""}
                </span>
                <span className="track">
                  <i style={{ width: `${Math.round(((role.wage as number) / maxWage) * 100)}%` }}>
                    {usd(role.wage)}
                  </i>
                </span>
                <span className="v">{usd(line)}</span>
              </div>
            );
          })}
          {everyRoleHasWage ? (
            <div className="tot">
              <span className="nm">{totalLabel}</span>
              <span />
              <span className="v">{usd(total)}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  },
);
Roster.displayName = "Roster";

export { Roster };
