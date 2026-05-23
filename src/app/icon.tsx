/**
 * Next.js dynamic favicon. Renders the LogoMark as a 32x32 PNG at
 * build time. Browsers show this in the tab.
 */
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" stroke="#000000" strokeWidth="4" />
          <path d="M32 6 L29 30 L32 32 L35 30 Z" fill="#000000" />
          <path d="M32 58 L29 34 L32 32 L35 34 Z" fill="#000000" />
          <path d="M58 32 L34 29 L32 32 L34 35 Z" fill="#000000" />
          <path d="M6 32 L30 29 L32 32 L30 35 Z" fill="#000000" />
          <path d="M48 16 L34 26 L32 32 L38 30 Z" fill="#000000" />
          <path d="M48 48 L38 34 L32 32 L34 38 Z" fill="#000000" />
          <path d="M16 48 L30 38 L32 32 L26 34 Z" fill="#000000" />
          <path d="M16 16 L26 30 L32 32 L30 26 Z" fill="#000000" />
          <circle cx="32" cy="32" r="3" fill="#000000" />
        </svg>
      </div>
    ),
    size
  );
}
