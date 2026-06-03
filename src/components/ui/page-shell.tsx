/**
 * PageShell + ContentColumn — the one layout primitive every page renders inside.
 *
 * Why this exists: pages were each setting their own margins, so content drifted
 * left and the right-rail floated in the middle of nowhere. PageShell owns the
 * page background; ContentColumn owns the centered, max-width reading column and
 * the optional right rail. Pages compose these and never set their own outer
 * width again. This is the anti-distortion layout contract.
 *
 * Tokens only. No arbitrary widths/margins outside the few measured constants
 * here (which are the design decision, made once).
 */
import * as React from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  /** Page background tone. "paper" = quiet neutral (default); "plain" = pure surface. */
  tone?: "paper" | "plain";
  className?: string;
};

/**
 * Outer page wrapper. Owns the background + min-height. One background for the
 * whole page so cards read as elevated against a single calm surface (fixes the
 * busy-pattern-vs-card clash).
 */
export function PageShell({ children, tone = "paper", className }: PageShellProps) {
  return (
    <div
      className={cn(
        "min-h-screen w-full",
        tone === "paper" ? "bg-cream-100" : "bg-cream-50",
        className,
      )}
    >
      {children}
    </div>
  );
}

type ContentColumnProps = {
  children: React.ReactNode;
  /** Optional right rail (e.g. an "on this page" nav). Sits beside the column on lg+. */
  rail?: React.ReactNode;
  /** Reading width. "prose" = narrow editorial; "wide" = default page; "full" = edge-padded only. */
  width?: "prose" | "wide" | "full";
  className?: string;
};

const WIDTHS = {
  prose: "max-w-2xl",
  wide: "max-w-5xl",
  full: "max-w-7xl",
} as const;

/**
 * The centered reading column. Horizontal padding scales with breakpoint; the
 * column is always centered (mx-auto), so content never leans left. When a
 * `rail` is given, the layout becomes [column | rail] on lg+ and stacks on
 * mobile, with the column centered in the remaining space.
 */
export function ContentColumn({ children, rail, width = "wide", className }: ContentColumnProps) {
  if (rail) {
    return (
      <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8", className)}>
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-10 xl:gap-14">
          <div className="min-w-0">{children}</div>
          <aside className="hidden lg:block">
            <div className="sticky top-24">{rail}</div>
          </aside>
        </div>
      </div>
    );
  }
  return (
    <div className={cn("mx-auto w-full px-5 sm:px-6 lg:px-8", WIDTHS[width], className)}>
      {children}
    </div>
  );
}
