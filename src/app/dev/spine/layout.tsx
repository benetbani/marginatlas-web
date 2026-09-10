/**
 * Spine dev surface , applies the CURRENT brand type system (founder methodology):
 * Geist Sans for all UI text + headings, Space Grotesk for figures (.fig).
 * Overrides the site's Newsreader/Inter almanac voice for this rebuild surface.
 */
import * as React from "react";
import { Geist, Space_Grotesk } from "next/font/google";

const geist = Geist({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-geist", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-grotesk", display: "swap" });

export default function SpineLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`spine-scope ${geist.variable} ${grotesk.variable}`}
      style={{ fontFamily: "var(--font-geist), ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* The country page uses THIS layout, not SpineShell, so the two-zone bg lives here too. */}
      {/* Layer 1: white base de-yellows the page (brand: warmed neutrals, no cream). */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, background: "#ffffff", pointerEvents: "none" }} />
      {/* Layer 2: atmosphere skyline, OPACITY ONLY (0.32), warmed, no tint veil (opacity-only law). */}
      <div
        aria-hidden
        style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: "url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=60')",
          backgroundSize: "cover", backgroundPosition: "center 16%", opacity: 0.32, filter: "saturate(0.85) contrast(1.02)",
        }}
      />
      {/* Layer 4: READABLE BAND , centered, feathers to the untouched photo in the gutters. */}
      <div aria-hidden className="spine-band" style={{ position: "fixed", insetBlock: 0, left: "50%", transform: "translateX(-50%)", width: "min(1480px, 100%)", zIndex: 0, pointerEvents: "none" }} />
      <style>{`:root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;--c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;--terra:#fb8469;--terra-text:#c2410c;--terra-soft:#fff1ed;--terra-border:#ffc7ba;}
/* .fig IS NOT REDECLARED HERE (2026-09-11). It lives once, in globals.css, reading --font-num. A copy in this dev layout would win by source order and quietly give this one route a different figure face from the site it is meant to preview. */
/* Two-level passe-partout: EXACTLY two flat opacity plateaus with ONE hard step ~1cm outside the content edge. Content zone .82, no-content margins .16 (step at 9.61% / 90.39%). Keep in sync with shell.tsx. */
.spine-band{background:linear-gradient(to right,rgba(255,255,255,.16) 0%,rgba(255,255,255,.16) 9.61%,rgba(255,255,255,.82) 9.61%,rgba(255,255,255,.82) 90.39%,rgba(255,255,255,.16) 90.39%,rgba(255,255,255,.16) 100%)}
@media (max-width:767px){.spine-band{background:rgba(255,255,255,.82)}}
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
