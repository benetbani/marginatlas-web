/**
 * The site icon at 512, served at /icon2: the manifest's large icon (src/app/manifest.ts). A numbered file of src/app/icon.tsx,
 * which says why there are three and not one with generateImageMetadata. The drawing is src/app/_site-icon.tsx.
 */
import { siteIcon } from "./_site-icon";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return siteIcon(size.width);
}
