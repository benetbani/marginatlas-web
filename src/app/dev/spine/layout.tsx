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
      <style>{`.fig{font-family:var(--font-grotesk),ui-sans-serif,sans-serif;font-variant-numeric:tabular-nums lining-nums;letter-spacing:0;font-weight:600}`}</style>
      {children}
    </div>
  );
}
