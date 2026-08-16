/**
 * AtlasFrame , the site-wide atmosphere. The photograph behind everything, and
 * the passe-partout that keeps the middle readable.
 *
 * WHY IT EXISTS SEPARATELY FROM SpineShell. This is the founder's brief,
 * 2026-08-16, on the live site: "the background should be totally visible on
 * the edges of the whole site, and on the center it should have that sort of
 * opacity. And you only put it at the hero section."
 *
 * The treatment already existed, exactly, inside SpineShell. What it did not
 * have was reach. SpineShell is mounted per page type, so measuring production
 * found the frame on ONE live page out of six: the cell page had it, and the
 * home page, city, industry, country and every tertiary page had nothing. A
 * page that mounts no SpineShell can never inherit the background from any
 * feature flag, which is why turning flags on was never going to answer this.
 *
 * So the three fixed layers moved here, and this mounts in SiteChrome, which
 * every page on the site reaches: the (site) route group renders it from its
 * layout, and the pages outside that group render it themselves.
 *
 * THE LAYERS, unchanged from the ratified original:
 *
 *   1. a white base, so the page is warmed neutral rather than cream
 *   2. the photograph, OPACITY ONLY at .32, warmed, no tint veil
 *   3. the passe-partout: .16 white over the gutters so the photograph reads
 *      through, .82 across the content column so text stays legible, with one
 *      hard step 1cm outside the content edge. Below 768px there are no gutters
 *      to show, so it is a flat .82.
 *
 * THE STEP IS KEYED IN PIXELS, NOT PERCENT, and that is the one thing that
 * could not be ported unchanged. The original 9.61% was computed for a 1480px
 * band over a **1120px** content column, which is what the spine page types
 * use. SiteChrome wraps every page in `max-w-7xl`, which is **1280px**.
 *
 * Ported blind, the content would have overhung the readable zone by 58px a
 * side at 1440 and 42px at 1600 and 1920, so the outer edge of anything
 * full-width, the ledger's four columns, the card grids, the blog rail, would
 * have sat on photograph muted to only .16.
 *
 * Re-keying to 4.20% fixed the wide viewports and still failed at 1280 and
 * below, where the column fills the screen: a percentage cannot track a
 * fixed-width column across viewports. So the stops are calc() instead, at
 * 50% +/- 702px, which is half the 1280 column plus its 24px padding plus the
 * ratified 1cm. The readable zone now covers the content at EVERY width by
 * construction, the gutters appear only when there is room for them, and on a
 * narrow screen the .82 simply spans the whole band, which is what the mobile
 * rule below already did at 767px.
 *
 * WHAT THIS COSTS, worth knowing: a 1280 column leaves little room for
 * atmosphere. At 1920 the picture reads at full strength for 220px a side
 * outside the band plus a 38px muted strip; at 1440, an 18px strip; at 1280,
 * nothing. If the founder wants more photograph visible, the lever is the
 * content column, not this gradient: narrowing SiteChrome's main to the
 * spine's 1120 would hand back 80px a side. That is a site-wide layout change
 * and his call, not one to make inside a frame.
 *
 * All three are position:fixed, so the photograph stays put and the page scrolls
 * over it. pointer-events:none throughout: this is atmosphere, never a target.
 *
 * IT ALSO SUPPRESSES SpineShell's OWN COPY. SpineShell still carries the same
 * three layers for the /dev prototypes, which mount it without any site chrome
 * and would otherwise lose their look entirely. On a real page both would
 * render, and two stacked photographs at .32 come out at .54 while two bands
 * compound to near-opaque. Rather than thread a prop through every call site,
 * the rule below hides the shell's layers wherever this frame is present, and
 * is absent wherever it is not. Self-contained: no wrapper element, no global
 * stylesheet edit, nothing for a call site to remember.
 */

import { colors } from "@/lib/design-tokens";

/** The founder's photograph. One image, whole site. */
const BG = "/spine/_skyline.jpeg";

/**
 * The white base, from the token rather than the literal the original used.
 * cream[50] IS #ffffff in design-tokens, described there as the warm white card
 * surface, so this is the same paint with a name. The hex gate caught the
 * literal on this file's first run, correctly: a new component has no baseline
 * and should not acquire one.
 */
const BASE = colors.cream[50];

export function AtlasFrame({ bgPosition = "center 16%" }: { bgPosition?: string }) {
  return (
    <>
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: BASE,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: `url('${BG}')`,
          backgroundSize: "cover",
          backgroundPosition: bgPosition,
          opacity: 0.32,
          filter: "saturate(0.85) contrast(1.02)",
        }}
      />
      <div
        aria-hidden
        className="atlas-frame-band"
        style={{
          position: "fixed",
          insetBlock: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(1480px, 100%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <style>{`
.atlas-frame-band{background:linear-gradient(to right,rgba(255,255,255,.16) 0,rgba(255,255,255,.16) calc(50% - 702px),rgba(255,255,255,.82) calc(50% - 702px),rgba(255,255,255,.82) calc(50% + 702px),rgba(255,255,255,.16) calc(50% + 702px),rgba(255,255,255,.16) 100%)}
@media (max-width:767px){.atlas-frame-band{background:rgba(255,255,255,.82)}}
.spine-frame-layer{display:none !important}
`}</style>
    </>
  );
}
