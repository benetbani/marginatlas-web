/**
 * The icon an iPhone or an iPad puts on its home screen and in its share sheet (plan 2026-10-10, the home reformed to ship, Task 7;
 * the ship audit's 2.2): without it iOS falls back to a screenshot of the page. 180 by 180, Apple's size; the header's compass mark
 * (src/components/brand/LogoMark.tsx), black on an opaque white square, which iOS rounds itself. Served at /apple-icon, a first part
 * of the address the middleware passes because src/lib/routing/top_level_segments.ts lists it.
 */
import { ImageResponse } from "next/og";
import { LogoMark } from "@/components/brand/LogoMark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: 180, height: 180, display: "flex", alignItems: "center", justifyContent: "center", background: "white" }}>
        <LogoMark size={140} color="#000000" />
      </div>
    ),
    size,
  );
}
