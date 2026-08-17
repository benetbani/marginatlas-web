/**
 * HeroWash - the short per-category top wash that sits behind a page's
 * masthead, cueing the category and fading cleanly to the page ground within
 * the first viewport (R6 Phase B, ported from the Claude-design frame).
 *
 *   business  terracotta-leaning
 *   city      clay / sand
 *   country   warmer moss
 *   learn     parchment (editorial)
 *
 * Flag-aware by design: when the warm frame is OFF (NEXT_PUBLIC_WARM_FRAME unset
 * / "0"), this is a transparent passthrough that renders its children with no
 * band, so a page can wrap its masthead in <HeroWash> unconditionally and the
 * live look is unchanged until the founder flips the frame on for the preview.
 *
 * The law: the wash is FRAME warmth behind the masthead; the masthead's own
 * numbers and cards stay opaque on top. Where masthead text sits on the
 * strongest part of the tint, pass `scrim` to lift it onto a relative layer.
 *
 * Tokens only (the gradients live in globals.css as .atlas-wash--*); no raw
 * color, px, or ms in this component.
 */
import * as React from "react";
import { isWarmFrameEnabled } from "@/lib/feature_flags";

export type HeroWashCategory = "business" | "city" | "country" | "learn";

export interface HeroWashProps {
  /** The page category, picking the tint. Defaults to business. */
  category?: HeroWashCategory;
  /** Masthead content rendered on top of the wash. */
  children: React.ReactNode;
  /** Carry the faint compass rosette (default true). */
  rosette?: boolean;
  /** Lift children onto a relative layer (use when text sits on strong tint). */
  scrim?: boolean;
  /** Extra classes on the band wrapper. */
  className?: string;
}

export function HeroWash({
  category = "business",
  children,
  rosette = true,
  scrim = false,
  className = "",
}: HeroWashProps) {
  // Frame off: pure passthrough, zero visual change.
  if (!isWarmFrameEnabled()) {
    return <>{children}</>;
  }

  const tint = `atlas-wash--${category}`;
  return (
    <div className={`atlas-wash ${tint} ${className}`.trim()}>
      {rosette && <div aria-hidden="true" className="atlas-wash__rosette" />}
      <div className={scrim ? "atlas-scrim" : undefined} style={{ position: "relative" }}>
        {children}
      </div>
    </div>
  );
}
