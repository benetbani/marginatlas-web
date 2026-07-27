/**
 * src/lib/fonts-spine.ts
 *
 * Wave 4 foundation. The v2 spine pages' two faces, self-hosted via next/font
 * (the mockups load them from Google Fonts links; the app must not).
 *
 *   Geist          -> --font-geist    (the --sans slot: labels, prose, chrome)
 *   Space Grotesk  -> --font-grotesk  (the --fig slot: every figure, tabular)
 *
 * The scoped stylesheet (src/styles/atlas-spine.css, generated) defines
 *   --sans: var(--font-geist,'Geist'), <mockup stack>
 *   --fig:  var(--font-grotesk,'Space Grotesk'), <mockup stack>
 * so these variables must be attached ON the .av2 wrapper of any v2 page tree:
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
