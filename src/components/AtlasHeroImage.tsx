/**
 * Plan v12 IM8 — cell page hero image with attribution.
 *
 * Renders a real photo when one exists in the image manifest, else
 * falls back to the existing SmartImage glyph chrome. Attribution chip
 * sits bottom-right per Wikimedia / Unsplash / Pexels license terms.
 */
import { SmartImage } from "./SmartImage";
import type { AtlasImage } from "@/lib/images";

type Props = {
  image: AtlasImage | null;
  alt: string;
  /** Fallback glyph + caption when image is null */
  glyph: string;
  caption?: string;
  aspectRatio?: number;
};

export function AtlasHeroImage({
  image,
  alt,
  glyph,
  caption,
  aspectRatio = 1.5,
}: Props) {
  if (!image) {
    return (
      <SmartImage
        alt={alt}
        glyph={glyph}
        caption={caption}
        aspectRatio={aspectRatio}
        intent="hero"
      />
    );
  }
  return (
    <figure className="relative rounded-2xl overflow-hidden border border-parchment">
      <div
        className="relative w-full bg-cream-100"
        style={{ aspectRatio: aspectRatio }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <figcaption className="absolute bottom-0 right-0 max-w-[80%] px-2 py-0.5 bg-ink-900/55 text-cream-50 text-[10px] truncate">
        {image.attribution}
      </figcaption>
    </figure>
  );
}
