/**
 * src/components/spine2/GlyphIcon.tsx
 *
 * The v2 glyph renderer. Replaces the mockups' runtime hydration of
 * `<i data-ico="id" class="gi-16">` placeholders (glyphs.js) with a direct
 * server-rendered SVG carrying the same classes, so the scoped stylesheet's
 * .gi / .gi-13/16/18/24 sizing and the .a/.af accent coloring apply verbatim.
 *
 * Path data lives in ./glyphs.ts (generated from the mockup source). Unknown
 * or missing ids return null per the nullable-inputs rule.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { GLYPHS, type GlyphId } from "./glyphs";

const glyphVariants = cva("gi", {
  variants: {
    size: {
      13: "gi-13",
      16: "gi-16",
      18: "gi-18",
      24: "gi-24",
    },
  },
  defaultVariants: { size: 16 },
});

export interface GlyphIconProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "id" | "children" | "dangerouslySetInnerHTML">,
    VariantProps<typeof glyphVariants> {
  id: GlyphId | null | undefined;
}

const GlyphIcon = React.forwardRef<SVGSVGElement, GlyphIconProps>(
  ({ id, size, className, ...props }, ref) => {
    if (id == null) return null;
    const body: string | undefined = GLYPHS[id];
    if (!body) return null;
    return (
      <svg
        ref={ref}
        className={cn(glyphVariants({ size }), className)}
        viewBox="0 0 32 32"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: body }}
        {...props}
      />
    );
  },
);
GlyphIcon.displayName = "GlyphIcon";

export { GlyphIcon, glyphVariants };
export type { GlyphId };
