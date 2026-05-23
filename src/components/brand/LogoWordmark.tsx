/**
 * Margin Atlas full wordmark — compass + "Margin" (black) + "Atlas"
 * (vermillion). For headers, footers, OG cards, marketing surfaces.
 *
 * The text uses the loaded display serif (Newsreader) via the
 * --font-display CSS variable. Falls through to Georgia when the
 * variable is unset (offline / first render).
 */
import * as React from "react";
import { LogoMark } from "./LogoMark";

export type LogoWordmarkProps = {
  /** Height in px of the compass mark; text scales proportionally. */
  size?: number;
  className?: string;
  /** If true, the whole thing is wrapped in an aria-label "Margin Atlas". */
  labeled?: boolean;
};

export function LogoWordmark({
  size = 28,
  className,
  labeled = true,
}: LogoWordmarkProps) {
  const textSize = Math.round(size * 0.95);
  return (
    <span
      role={labeled ? "img" : undefined}
      aria-label={labeled ? "Margin Atlas" : undefined}
      className={`inline-flex items-center gap-2.5 ${className ?? ""}`}
    >
      <LogoMark size={size} color="currentColor" />
      {/* Thin vertical divider — two stacked dots in graphite */}
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
        <span className="text-ink-900">Margin</span>{" "}
        <span className="text-atlas-500">Atlas</span>
      </span>
    </span>
  );
}

export default LogoWordmark;
