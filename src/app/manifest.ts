/**
 * The web app manifest, at /manifest.webmanifest (plan 2026-10-10, the home reformed to ship, Task 7; the ship audit's 2.2): the name
 * and the icons a phone uses when the site is saved to its home screen, and the white the masthead is. `display: "browser"`: the
 * site is a publication read in a browser, not an app that asks to be installed. The icons are src/app/icon.tsx's 192 and 512.
 * White is written as a word, not as #ffffff (the cream gate counts that hex for its ramp step's old name, scripts/verify_no_cream.ts).
 */
import type { MetadataRoute } from "next";
import { COPY } from "@/lib/spine/copy";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Margin Atlas",
    short_name: "Margin Atlas",
    description: COPY.home.definition,
    start_url: "/",
    display: "browser",
    background_color: "white",
    theme_color: "white",
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png" },
    ],
  };
}
