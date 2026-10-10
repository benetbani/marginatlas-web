/**
 * Margin Atlas brand mark — compass rose in a circle.
 *
 * Inline SVG so it always renders crisp at any size and inherits
 * currentColor (defaults to black, picks up text-color in context).
 * Use this anywhere a square icon is needed: header, favicon,
 * tab pills, small standalone moments.
 *
 * Pair with LogoWordmark when there's room for the full name.
 *
 * ALSO THE SITE ICON. src/app/icon.tsx, icon1.tsx and icon2.tsx (through src/app/_site-icon.tsx) and src/app/apple-icon.tsx draw this
 * mark as the favicon, the manifest's two icons and the home-screen icon. Every page's head links each as /icon?<hash>, the hash of
 * THAT ICON FILE'S OWN TEXT, and the PNG is served immutable for a year, so an edit to the mark that leaves those four files as they
 * were keeps the old icon in every returning browser. When the mark changes, touch the four icon files in the same commit (each
 * header carries a "Mark revised" date to change) and MARK_REVISED in src/app/_site-icon.tsx to the same day, so the hash moves and
 * the manifest's two icon URLs (?v=<MARK_REVISED>) change. Not machine-checked: the hash is Next's, taken at build.
 */
import * as React from "react";

export type LogoMarkProps = {
  size?: number;
  className?: string;
  /** Override stroke + fill color. Defaults to currentColor. */
  color?: string;
  /** Decorative by default; set to true to add an accessible label. */
  labeled?: boolean;
};

export function LogoMark({
  size = 24,
  className,
  color = "currentColor",
  labeled = false,
}: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={labeled ? "img" : undefined}
      aria-label={labeled ? "Margin Atlas" : undefined}
      aria-hidden={labeled ? undefined : "true"}
    >
      {/* Outer ring */}
      <circle cx="32" cy="32" r="28" stroke={color} strokeWidth="3" />

      {/* 8-point compass rose. Each point is a thin asymmetric kite
          rendered as a triangle pair so the inner edges meet at the
          center dot. The cardinal points (N/E/S/W) are longer than
          the ordinal points (NE/SE/SW/NW). */}
      <g fill={color}>
        {/* North — long */}
        <path d="M32 6 L29 30 L32 32 L35 30 Z" />
        {/* South — long */}
        <path d="M32 58 L29 34 L32 32 L35 34 Z" />
        {/* East — long */}
        <path d="M58 32 L34 29 L32 32 L34 35 Z" />
        {/* West — long */}
        <path d="M6 32 L30 29 L32 32 L30 35 Z" />
        {/* NE — short */}
        <path d="M48 16 L34 26 L32 32 L38 30 Z" />
        {/* SE — short */}
        <path d="M48 48 L38 34 L32 32 L34 38 Z" />
        {/* SW — short */}
        <path d="M16 48 L30 38 L32 32 L26 34 Z" />
        {/* NW — short */}
        <path d="M16 16 L26 30 L32 32 L30 26 Z" />
      </g>

      {/* Center dot — small black ring with white core */}
      <circle cx="32" cy="32" r="3" fill={color} />
      <circle cx="32" cy="32" r="1.4" fill="#FFFFFF" />
    </svg>
  );
}

export default LogoMark;
