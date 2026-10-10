/**
 * The site icon at 48, served at /icon (plan 2026-10-10, the home reformed to ship, Task 7 and its fix round 7). The first of three
 * numbered files: icon1.tsx (192, at /icon1) and icon2.tsx (512, at /icon2) are the ones the manifest names. None exports
 * generateImageMetadata, which would serve /icon/<id> and leave /icon, the address production has served since 2026-10-06, to the
 * country wildcard. The drawing is src/app/_site-icon.tsx, the header's compass mark, black on white.
 */
import { siteIcon } from "./_site-icon";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return siteIcon(size.width);
}
