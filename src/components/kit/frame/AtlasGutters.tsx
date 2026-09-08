/**
 * AtlasGutters - the fixed, decorative gutter layer for the root layout
 * (R6 Phase B, ported from the Claude-design PageFrame).
 *
 * A single position:fixed layer behind the whole page: a warm cartographic
 * wash bleeds the full width while a cream veil (in globals.css) carves the
 * centre readable column strictly cream, so the wash only shows in the left
 * and right margins and NO data ever sits on it. Because it is fixed, it
 * stays STATIC while the content column scrolls over it. Below 1100px it
 * collapses to a flat warm ground (no side imagery, no horizontal scroll).
 *
 * NO PHOTOGRAPH, 2026-09-08. This layer carried a place photograph
 * (.atlas-placephoto) from 2026-08-09 until the founder's 2026-09-07 ruling
 * killed it everywhere; see the comment above `.atlas-frame-gutters` in
 * globals.css. The div that carried it is removed here too, not just its
 * background-image: an element with no styling left is the same leftover
 * as the rule that used to style it.
 *
 * Flag-gated: renders nothing unless NEXT_PUBLIC_WARM_FRAME is on, so the live
 * site is unchanged until the founder flips the frame on for the preview.
 *
 * Pure decoration: aria-hidden, pointer-events-none (set in CSS), out of the
 * a11y tree and the click path. The content surfaces carry `atlas-frame-content`
 * to paint above this layer; see the root layout.
 *
 * Tokens only (all paint lives in globals.css `.atlas-frame-gutters`); no raw
 * color, px, or ms in this component.
 */
import { isWarmFrameEnabled } from "@/lib/feature_flags";

export function AtlasGutters() {
  if (!isWarmFrameEnabled()) return null;
  return <div aria-hidden="true" className="atlas-frame-gutters" />;
}
