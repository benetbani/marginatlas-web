/**
 * src/lib/home/notebook.ts
 *
 * THE NOTEBOOK ON THE HOME PAGE (milestone 3, masterplan step 36): which posts the home page shows, and each one's picture. The
 * research's two "keep" posts (E:/atlas/design/loop/build/goal-2026-10-02/BLOG.md: keep 2, rewrite 10, retire 58, for his word):
 * the firm against the establishment, and the median against the average, until he rules on the rest (PARKED P36.1). A post's
 * picture is its own `image:` where its file names one, else the UK's photograph from the country images manifest; never the
 * Positano skyline the old rail drew under every card.
 */
import { getAllPosts } from "@/lib/blog";
import countryImagesJson from "../../../data/cities/country_images_manifest.json";

export const NOTEBOOK_SLUGS = ["difference-between-firm-and-establishment", "median-vs-average"] as const;

export type NotebookCard = { slug: string; href: string; title: string; date: string; image: { src: string; alt: string } };

export function buildNotebook(): NotebookCard[] {
  const uk = (countryImagesJson as { countries: Record<string, { file: string; alt?: string }> }).countries.gb;
  const posts = getAllPosts();
  const out: NotebookCard[] = [];
  for (const slug of NOTEBOOK_SLUGS) {
    const p = posts.find((x) => x.slug === slug);
    if (!p) continue;
    const image = p.image.kind === "url" ? { src: p.image.src, alt: p.image.alt } : uk ? { src: uk.file, alt: uk.alt ?? "" } : null;
    if (!image) continue;
    out.push({ slug, href: `/blog/${slug}`, title: p.title, date: p.date, image });
  }
  return out;
}
