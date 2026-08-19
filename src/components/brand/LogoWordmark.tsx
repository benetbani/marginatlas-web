/**
 * Margin Atlas full wordmark — compass + "Margin" (black) + "Atlas"
 * (vermillion). For headers, footers, OG cards, marketing surfaces.
 *
 * The text uses the loaded display serif (Newsreader) via the
 * --font-display CSS variable, which resolves through the --font-serif slot
 * next/font sets in layout.tsx.
 *
 * IT DOES NOT "fall through to Georgia when the variable is unset", which this
 * comment claimed until 2026-08-18. Measured in a browser: an INVALID variable
 * makes the whole font-family declaration invalid at computed-value time, so
 * the element inherits rather than taking the next name in the list. An UNSET
 * variable does fall through; an invalid one does not, and the difference is
 * the entire defect this token used to have.
 */
import * as React from "react";
import { LogoMark } from "./LogoMark";

export type LogoWordmarkProps = {
  /** Height in px of the compass mark; text scales proportionally. */
  size?: number;
  className?: string;
  /** If true, the whole thing is wrapped in an aria-label "Margin Atlas". */
  labeled?: boolean;
  /**
   * Tone variant. "light" (default) is the header treatment:
   * black "Margin" + vermillion "Atlas" on a light surface. "dark" is
   * the footer treatment: white "Margin" + vermillion "Atlas" on the
   * graphite atlas-paper-dark surface.
   */
  tone?: "light" | "dark";
};

export function LogoWordmark({
  size = 28,
  className,
  labeled = true,
  tone = "light",
}: LogoWordmarkProps) {
  const textSize = Math.round(size * 0.95);
  const isDark = tone === "dark";
  return (
    <span
      role={labeled ? "img" : undefined}
      aria-label={labeled ? "Margin Atlas" : undefined}
      className={`inline-flex items-center gap-2.5 ${
        isDark ? "text-white" : "text-ink-900"
      } ${className ?? ""}`}
    >
      <LogoMark size={size} color="currentColor" />
      {/* Thin vertical divider — two stacked dots in current colour */}
      <span
        aria-hidden="true"
        className="flex flex-col gap-0.5"
        style={{ height: size * 0.6 }}
      >
        <span className="block w-px flex-1 bg-current opacity-40" />
        <span className="block w-px flex-1 bg-current opacity-40" />
      </span>
      <span
        aria-hidden={labeled ? "true" : undefined}
        className="font-display font-medium leading-none tracking-tight"
        style={{ fontSize: textSize }}
      >
        <span className={isDark ? "text-white" : "text-ink-900"}>Margin</span>{" "}
        <span className="text-atlas-500">Atlas</span>
      </span>
    </span>
  );
}

export default LogoWordmark;
