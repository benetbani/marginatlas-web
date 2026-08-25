/**
 * THE THREE FIXED LAYERS BELOW ARE NOW A FALLBACK, not the site's frame.
 *
 * They carry `spine-frame-layer`, and AtlasFrame, mounted once in SiteChrome,
 * ships a rule that hides anything with that class. So on a real page the
 * site-wide frame is the only one drawing, and on the /dev prototypes, which
 * mount this shell with no site chrome at all, these still render and the
 * prototypes keep their look.
 *
 * Why it is done with a class rather than a prop: both would otherwise draw on
 * every real page, and two photographs at .32 stack to .54 while two
 * passe-partouts compound to nearly opaque. A prop would mean remembering it at
 * nine call sites forever; the rule cannot be forgotten.
 *
 * What still belongs to this component is the part that is genuinely per page:
 * the typography scope, the fonts, the palette variables and the .fig/.hov/
 * .focal rules the spine kit is built on.
 */

/**
 * SpineShell , the shared frame for every spine page type. Geist Sans (text) +
 * Space Grotesk (.fig figures). Two-zone atmosphere: a warmed opacity-only photo
 * fills the gutters while a centered feathered white READABLE BAND (.spine-band)
 * keeps the content column legible. White cards float over it. Supplies the
 * warmed palette CSS vars + .fig/.hov/.cityhov/.spine-ic/.focal rules. `bg` lets
 * each page type pick its own motif (skyline for country/city, a street for hood).
 */
import * as React from "react";
import { Geist, Space_Grotesk } from "next/font/google";

const geist = Geist({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-geist", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-grotesk", display: "swap" });

/**
 * The founder's own photograph, not a stock URL.
 *
 * This was an Unsplash hotlink, the same one src/app/dev/spine/layout.tsx
 * carries, which is where these components were built. It came along with the
 * promotion the way the /dev hand-off links did.
 *
 * Two reasons it changed. The founder asked for this picture behind the home
 * page in as many words, and the home page takes this default (page.tsx renders
 * <SpineShell> with no bg). And the file has been sitting in public/spine since
 * 7 August, already used by the spine2 surface through
 * .atlas-frame-gutters .atlas-placephoto, so the site was serving his image on
 * one surface and a stock photo on the others.
 *
 * It also removes a third-party runtime dependency: this background is injected
 * as a raw CSS url(), so it never passes through next/image and every reader
 * fetched it from Unsplash directly, cache and all.
 *
 * Treatment is unchanged (opacity 0.32, saturate 0.85); only the source moved.
 */
const DEFAULT_BG = "/spine/_skyline.jpeg";

export function SpineShell({ children, bg = DEFAULT_BG, bgPosition = "center 16%" }: { children: React.ReactNode; bg?: string; bgPosition?: string }) {
  return (
    <div className={`spine-scope ${geist.variable} ${grotesk.variable}`} style={{ fontFamily: "var(--font-geist), ui-sans-serif, system-ui, sans-serif" }}>
      {/* Layer 1: white base de-yellows the page (brand: warmed neutrals, no cream). */}
      <div aria-hidden className="spine-frame-layer" style={{ position: "fixed", inset: 0, zIndex: 0, background: "#ffffff", pointerEvents: "none" }} />
      {/* Layer 2: atmosphere photo, OPACITY ONLY (0.32), warmed, no tint veil (opacity-only law). */}
      <div aria-hidden className="spine-frame-layer" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: `url('${bg}')`, backgroundSize: "cover", backgroundPosition: bgPosition, opacity: 0.32, filter: "saturate(0.85) contrast(1.02)" }} />
      {/* Layer 4: READABLE BAND , centered, feathers to the untouched photo in the gutters. */}
      <div aria-hidden className="spine-band spine-frame-layer" style={{ position: "fixed", insetBlock: 0, left: "50%", transform: "translateX(-50%)", width: "min(1480px, 100%)", zIndex: 0, pointerEvents: "none" }} />
      <style>{`:root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;--c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;--terra:#fb8469;--terra-text:#c2410c;--terra-soft:#fff1ed;--terra-border:#ffc7ba;}
.fig{font-family:var(--font-grotesk),ui-sans-serif,sans-serif;font-variant-numeric:tabular-nums lining-nums;letter-spacing:0;font-weight:600}
/* Two-level passe-partout: EXACTLY two flat opacity plateaus with ONE hard step ~1cm outside the content edge. Content zone .34, no-content margins .10. Keyed to the 1480px band over the 1120px content column (content edge = 50% +/- 37.84%; the step, 1cm outside, = 9.61% / 90.39%). Lightened from .82/.16 on 2026-08-25 (rulebook v2 §36): at .82 the band took the photo to near-white before any card drew, leaving the ratified frosted card with nothing to refract. The cards now carry the legibility this band gave up , see --glass-alpha-spine in globals.css. */
.spine-band{background:linear-gradient(to right,rgba(255,255,255,.10) 0%,rgba(255,255,255,.10) 9.61%,rgba(255,255,255,.34) 9.61%,rgba(255,255,255,.34) 90.39%,rgba(255,255,255,.10) 90.39%,rgba(255,255,255,.10) 100%)}
@media (max-width:767px){.spine-band{background:rgba(255,255,255,.34)}}
.focal{background:linear-gradient(180deg,#ffffff 0%,#fffaf8 100%);border-radius:10px}
.hov{transition:background-color .15s ease-out,transform .15s ease-out,border-color .15s ease-out}
.hov:hover{background:var(--c-soft)}
.cityhov{transition:transform .15s ease-out,border-color .15s ease-out}
.cityhov:hover{transform:translateY(-2px);border-color:var(--terra-border)}
/* AtlasIcon accent rides terracotta via .spine-scope .ma-glyph in globals.css; ink rides currentColor from the Ico tile. */
@media (prefers-reduced-motion: reduce){.hov,.cityhov,details summary span{transition:none !important}.cityhov:hover{transform:none}}`}</style>
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
