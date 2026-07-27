/**
 * src/components/spine2/Reading.tsx
 *
 * The M1 door/fact atom, the reference grammar for .tiles (and later
 * .hoodcards). PORT-CONTRACT M1 verbatim:
 *
 *   - href present  -> a DOOR: an <a>, chevron at the trailing edge (drawn by
 *                      the stylesheet's `.tiles>a .t::after`), figure turns
 *                      terracotta on hover.
 *   - href absent   -> a FACT: a <span>, no affordance, no cursor, name in
 *                      --ink-2. The target page does not exist in this build.
 *
 *   - A reading is never omitted for want of a link, only for want of a
 *     figure: `figure` null renders nothing at all.
 *   - No copy ever explains the difference; the mark is the grammar.
 *
 * The data layer decides `href` (a target is linked iff its page is generated
 * in this build); this component never invents or withholds one.
 */
import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { GlyphIcon } from "./GlyphIcon";
import type { GlyphId } from "./glyphs";

export interface ReadingData {
  label: string;
  /** Always rendered when present; null omits the whole reading (M1). */
  figure: string | null;
  glyph?: GlyphId;
  /** ABSENT means the target page does not exist in this build. */
  href?: string;
}

export interface ReadingProps
  extends ReadingData,
    Omit<React.HTMLAttributes<HTMLElement>, "children"> {}

const Reading = React.forwardRef<HTMLElement, ReadingProps>(
  ({ label, figure, glyph, href, className, ...props }, ref) => {
    if (figure == null || figure === "") return null;

    const inner = (
      <>
        <span className="t">
          {glyph ? <GlyphIcon id={glyph} size={18} /> : null}
          {label}
        </span>
        <span className="g">{figure}</span>
      </>
    );

    if (href) {
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={cn(className)}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {inner}
        </Link>
      );
    }
    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} className={cn(className)} {...props}>
        {inner}
      </span>
    );
  },
);
Reading.displayName = "Reading";

export { Reading };
