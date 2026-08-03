/**
 * src/components/spine2/Place.tsx
 *
 * THE GROUND EVERY PAGE SITS ON.
 *
 * Founder, 2026-08-03: "all pages should have, as a rule, something in the
 * background, like a picture in the background. This is part of the identity
 * of the page."
 *
 * NOTHING IS INVENTED HERE. The treatment is `.skyline`, already in the
 * founder's stylesheet, already decided: a photo band anchored to the top of
 * the document at 640px, grayscale .6, contrast .82, opacity .5, under a
 * gradient that ends at solid paper.
 *
 * WHY A BAND AND NOT A FIXED LAYER, in his own words in that file:
 *
 *   "A fixed full-page layer can never fade on scroll, because every section
 *   passes the top of the viewport where a fixed veil is lightest. So the photo
 *   is anchored to the top of the document and genuinely ends below the hero."
 *
 * THE FIRST VERSION OF THIS COMPONENT USED `.place`, WHICH IS THE DEAD ONE.
 * `.place` is the fixed-layer predecessor and the same stylesheet turns it off
 * four hundred lines later with `.place{display:none}`. It rendered, it loaded
 * its image, its computed opacity was correct, and it was 0 by 0 pixels on
 * screen. Everything looked right except the page. The lesson is the cheap one:
 * a rule that exists is not a rule that applies, and the cascade is where that
 * gets decided.
 *
 * THE IMAGE SET IS THE HONEST LIMIT. `.skyline` loads `_skyline.jpeg` first and
 * falls back to `london.jpeg`, and only the fallback exists in the repository,
 * so every page currently shows the same ground. A page type deserves its own
 * place, and the country page showing London is wrong in a way only new images
 * can fix.
 */
import * as React from "react";

export function Place() {
  /* The band positions against the nearest positioned ancestor, so it must sit
     inside a relative wrapper. `.av2` is static, which would anchor it to the
     viewport and reintroduce exactly the bug `.skyline` was written to end. */
  return <div className="skyline" aria-hidden="true" />;
}
