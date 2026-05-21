/**
 * Cell-page hero image.
 *
 * Plan v16 Block A7 — attribution figcaption removed. Founder reported
 * a Vancouver photo rendered for Italian coffee shops, then leaked
 * "Bank of Vancouver, British Columbia" via the caption. Per R-002
 * (no source leaks) and the v16 reformation pass, no attribution string
 * is ever surfaced on the page. License compliance lives in metadata
 * and the eventual `/credits` page.
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
    </figure>
  );
}
