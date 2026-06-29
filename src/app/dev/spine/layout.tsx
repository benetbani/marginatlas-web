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
      {/* Atmosphere: a faint, brand-tinted page-wide skyline , a near-opaque cream wash OVER the photo. Solid cards float above it. */}
      <div
        aria-hidden
        style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(251,250,247,0.82), rgba(251,250,247,0.91)), url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=60')",
          backgroundSize: "cover", backgroundPosition: "center 16%",
          filter: "grayscale(0.35) sepia(0.28) saturate(0.95)",
        }}
      />
      <style>{`.fig{font-family:var(--font-grotesk),ui-sans-serif,sans-serif;font-variant-numeric:tabular-nums lining-nums;letter-spacing:0;font-weight:600}
.atlas-card-hover{transition:transform .18s ease-out,border-color .18s ease-out,box-shadow .18s ease-out;position:relative}
.atlas-card-hover::before{content:"";position:absolute;inset-inline:0;top:0;height:2px;border-radius:12px 12px 0 0;background:#fb8469;opacity:0;transition:opacity .18s ease-out}
.atlas-card-hover:hover{transform:translateY(-2px);border-color:#ffb3a3;box-shadow:0 6px 20px -12px rgba(38,33,28,.25)}
.atlas-card-hover:hover::before{opacity:1}`}</style>
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
