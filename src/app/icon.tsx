/**
 * The site icon, at three sizes (plan 2026-10-10, the home reformed to ship, Task 7; the ship audit's 2.2). It was one 32 by 32
 * PNG: Google asks a favicon whose side is a multiple of 48, and the manifest (src/app/manifest.ts) needs 192 and 512 for a phone's
 * home screen. One drawing, the header's compass mark (src/components/brand/LogoMark.tsx), black on white, drawn at build time; Next
 * serves each size at /icon/<id> and links each from every page's head.
 *
 * White is written as a word: the cream gate counts #ffffff for the name its ramp step once carried (scripts/verify_no_cream.ts).
 */
import { ImageResponse } from "next/og";
import { LogoMark } from "@/components/brand/LogoMark";

/** The sizes, in pixels: 48 for a tab and a search result, 192 and 512 for the manifest. Each is its own id and address. */
const ICON_SIZES = [48, 192, 512] as const;

export function generateImageMetadata() {
  return ICON_SIZES.map((px) => ({ id: String(px), size: { width: px, height: px }, contentType: "image/png" }));
}

export default function Icon({ id }: { id: string }) {
  const px = ICON_SIZES.find((s) => String(s) === String(id)) ?? ICON_SIZES[0];
  return new ImageResponse(
    (
      <div style={{ width: px, height: px, display: "flex", alignItems: "center", justifyContent: "center", background: "white" }}>
        <LogoMark size={Math.round(px * 0.875)} color="#000000" />
      </div>
    ),
    { width: px, height: px },
  );
}
