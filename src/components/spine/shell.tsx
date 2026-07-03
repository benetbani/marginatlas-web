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

const DEFAULT_BG = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=60";

export function SpineShell({ children, bg = DEFAULT_BG, bgPosition = "center 16%" }: { children: React.ReactNode; bg?: string; bgPosition?: string }) {
  return (
    <div className={`spine-scope ${geist.variable} ${grotesk.variable}`} style={{ fontFamily: "var(--font-geist), ui-sans-serif, system-ui, sans-serif" }}>
      {/* Layer 1: white base de-yellows the page (brand: warmed neutrals, no cream). */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, background: "#ffffff", pointerEvents: "none" }} />
      {/* Layer 2: atmosphere photo, OPACITY ONLY (0.32), warmed, no tint veil (opacity-only law). */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: `url('${bg}')`, backgroundSize: "cover", backgroundPosition: bgPosition, opacity: 0.32, filter: "saturate(0.85) contrast(1.02)" }} />
      {/* Layer 4: READABLE BAND , centered, feathers to the untouched photo in the gutters. */}
      <div aria-hidden className="spine-band" style={{ position: "fixed", insetBlock: 0, left: "50%", transform: "translateX(-50%)", width: "min(1480px, 100%)", zIndex: 0, pointerEvents: "none" }} />
      <style>{`:root{--c-card:#ffffff;--c-soft:#f6f4f2;--c-soft2:#efebe8;--c-border:#e7e2df;--c-line-strong:#d8d0cb;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;--terra:#fb8469;--terra-text:#c2410c;--terra-soft:#fff1ed;--terra-border:#ffc7ba;}
.fig{font-family:var(--font-grotesk),ui-sans-serif,sans-serif;font-variant-numeric:tabular-nums lining-nums;letter-spacing:0;font-weight:600}
/* Two-level passe-partout: EXACTLY two flat opacity plateaus with ONE hard step ~1cm outside the content edge. Content zone .82, no-content margins .16. Keyed to the 1480px band over the 1120px content column (content edge = 50% +/- 37.84%; the step, 1cm outside, = 9.61% / 90.39%). */
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
