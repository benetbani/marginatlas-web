/**
 * SmartImage — a placeholder-friendly image wrapper.
 *
 * Renders a real image when `src` is provided; otherwise renders a tasteful
 * cream-gradient placeholder with an emoji glyph centered. The placeholder
 * uses the same warm-earth palette as the rest of the site so it doesn't
 * jar when sitting next to live content.
 *
 * Real images go in `public/images/` once the founder commissions them.
 * Until then, every placeholder is wired in the correct position with the
 * correct dimensions so swap-in is a one-line change per slot.
 *
 * No `next/image` dependency yet — that adds when we have real images.
 */

import { cn } from "@/lib/cn";

type Props = {
  src?: string | null;
  alt: string;
  glyph?: string;       // emoji glyph for the placeholder (sector or industry icon)
  caption?: string;     // optional small caption shown in the placeholder
  className?: string;
  aspectRatio?: number; // width / height; default 1.5 (3:2)
  rounded?: "lg" | "xl" | "2xl" | "3xl";
  intent?: "hero" | "tile" | "card" | "inline";
};

export function SmartImage({
  src,
  alt,
  glyph = "✦",
  caption,
  className,
  aspectRatio = 1.5,
  rounded = "2xl",
  intent = "card",
}: Props) {
  const ratioStyle = { aspectRatio: String(aspectRatio) };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-auto object-cover",
          rounded === "lg" && "rounded-lg",
          rounded === "xl" && "rounded-xl",
          rounded === "2xl" && "rounded-2xl",
          rounded === "3xl" && "rounded-3xl",
          className
        )}
        style={ratioStyle}
        loading={intent === "hero" ? "eager" : "lazy"}
      />
    );
  }

  // Placeholder: cream gradient + glyph
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "w-full flex items-center justify-center relative overflow-hidden select-none",
        "bg-gradient-to-br from-cream-100 via-cream-200 to-cream-300",
        rounded === "lg" && "rounded-lg",
        rounded === "xl" && "rounded-xl",
        rounded === "2xl" && "rounded-2xl",
        rounded === "3xl" && "rounded-3xl",
        className
      )}
      style={ratioStyle}
    >
      {/* Subtle radial highlight in top-left to give the surface a sense of light */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(253,233,204,0.7) 0%, transparent 60%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-2 text-cocoa-700">
        <span className="text-5xl md:text-6xl drop-shadow-sm" aria-hidden>{glyph}</span>
        {caption && (
          <span className="text-[10px] uppercase tracking-wider text-cocoa-700/60 font-medium">
            {caption}
          </span>
        )}
      </div>
      {/* Soft inner-border for definition */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{ boxShadow: "inset 0 0 0 1px rgba(120,53,15,0.10)" }}
      />
    </div>
  );
}
