/**
 * src/lib/home/notebook.ts
 *
 * THE NOTEBOOK ON THE HOME PAGE: which posts the home page shows (milestone 3, masterplan step 36; since the checkup of
 * 2026-10-06, the newest post of each category, four at most). It showed the research's two kept explainers, each on the UK's
 * one photograph, until his ruling on PARKED P36.1 and the ten rewrites on the free data pack (2026-10-06) gave the blog posts
 * with figures; now it shows the newest post of each category in the blog's own order (src/lib/blog.ts BLOG_CATEGORIES), so
 * four posts make four different reads, two by two. Text first: the category, the title, the date; no picture, since one
 * photograph repeated under every card said nothing about any of them (the blog index dropped its covers for the same reason).
 */
import { BLOG_CATEGORIES, getAllPosts } from "@/lib/blog";

export const NOTEBOOK_SIZE = 4;

export type NotebookCard = { slug: string; href: string; title: string; date: string; category: string };

export function buildNotebook(): NotebookCard[] {
  const posts = getAllPosts(); // newest first, posts of one day by slug
  const out: NotebookCard[] = [];
  for (const category of BLOG_CATEGORIES) {
    const p = posts.find((x) => x.category === category);
    if (!p) continue;
    out.push({ slug: p.slug, href: `/blog/${p.slug}`, title: p.title, date: p.date, category });
    if (out.length === NOTEBOOK_SIZE) break;
  }
  return out;
}
