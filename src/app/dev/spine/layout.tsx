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
      className={`${geist.variable} ${grotesk.variable}`}
      style={{ fontFamily: "var(--font-geist), ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* White base de-yellows the page (brand: black / white / terracotta only, no cream). */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, background: "#ffffff", pointerEvents: "none" }} />
      {/* Page-wide skyline , OPACITY ONLY, no color treatment, kept clearly visible. */}
      <div
        aria-hidden
        style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: "url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=60')",
          backgroundSize: "cover", backgroundPosition: "center 16%", opacity: 0.32,
        }}
      />
      <style>{`:root{--c-card:#ffffff;--c-soft:#f5f5f5;--c-soft2:#ececec;--c-border:#e3e3e3;--c-ink:#1b1b1a;--c-ink2:#565654;--c-muted:#6f6f6d;--terra:#fb8469;--terra-text:#c2410c;--terra-soft:#fff1ed;--terra-border:#ffc7ba;}
.fig{font-family:var(--font-grotesk),ui-sans-serif,sans-serif;font-variant-numeric:tabular-nums lining-nums;letter-spacing:0;font-weight:600}
.hov{transition:background-color .15s ease-out,transform .15s ease-out,border-color .15s ease-out}
.hov:hover{background:var(--c-soft)}
.cityhov{transition:transform .15s ease-out,border-color .15s ease-out}
.cityhov:hover{transform:translateY(-2px);border-color:var(--terra-border)}
/* AtlasIcon: neutralize the family's banned #e62200 accent , every glyph rides one currentColor */
.spine-ic .a{stroke:currentColor}.spine-ic .af{fill:currentColor;stroke:none}`}</style>
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
