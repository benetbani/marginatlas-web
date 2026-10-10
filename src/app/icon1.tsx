/**
 * The site icon at 192, served at /icon1: the manifest's home-screen icon (src/app/manifest.ts). A numbered file of src/app/icon.tsx,
 * which says why there are three and not one with generateImageMetadata. The drawing is src/app/_site-icon.tsx.
 * Mark revised: 2026-10-10. Change this date when the mark or its drawing changes: this file's text is what the icon link's ?hash is taken from.
 */
import { siteIcon } from "./_site-icon";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return siteIcon(size.width);
}
