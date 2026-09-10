/**
 * src/lib/fonts-spine.ts
 *
 * Wave 4 foundation. The v2 spine pages' two faces, self-hosted via next/font
 * (the mockups load them from Google Fonts links; the app must not).
 *
 *   Geist          -> --font-geist    (the --sans slot: labels, prose, chrome)
 *   Space Grotesk  -> --font-grotesk  (loaded for the .av2 tree; see below)
 *
 * The scoped stylesheet (src/styles/atlas-spine.css, generated) defines
 *   --sans: var(--font-geist,'Geist'), <mockup stack>
 *   --fig:  var(--font-num)
 * so the --sans variable must be attached ON the .av2 wrapper of any v2 page
 * tree. THE FIGURE SLOT NO LONGER READS --font-grotesk (2026-09-11): the site
 * has ONE definition of the figure face, `--font-num` in globals.css, and
 * `--fig` aliases it so a legacy .av2 surface cannot draw figures in a
 * different typeface from the page it is a draft of. The Space Grotesk
 * instance below stays because it is what actually LOADS the face for a
 * standalone .av2 route; it just no longer decides what a figure is drawn in.
 *
 *   <div className={`av2 ${spineFontVariables}`}> ... </div>
 *
 * The root layout is deliberately untouched: existing pages keep
 * Newsreader + Inter, and the v2 fonts load only where a v2 tree renders.
 */
import { Geist, Space_Grotesk } from "next/font/google";

export const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grotesk",
});

/** The two variable classes, ready to sit beside `av2` on the wrapper div. */
export const spineFontVariables = `${geist.variable} ${spaceGrotesk.variable}`;
