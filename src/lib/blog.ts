import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author?: string;
  bodyHtml?: string;
  /** Cover image. Required by site convention (founder 2026-05-26).
   *  When the frontmatter omits `image:`, a deterministic gradient
   *  placeholder is derived from the slug so every post always has
   *  a visible cover. */
  image: BlogImage;
};

export type BlogImage =
  | { kind: "url"; src: string; alt: string }
  | { kind: "gradient"; gradient: string; initial: string };

const GRADIENT_PALETTE = [
  "linear-gradient(135deg, #952509 0%, #C97347 100%)",  // vermillion → terracotta
  "linear-gradient(135deg, #1F3D32 0%, #5B8770 100%)",  // moss → sage
  "linear-gradient(135deg, #3A3A3A 0%, #6E6E6E 100%)",  // graphite → slate
  "linear-gradient(135deg, #4C2712 0%, #8B5E3C 100%)",  // cocoa → fawn
  "linear-gradient(135deg, #5C3A0A 0%, #B07A2C 100%)",  // amber → tan
  "linear-gradient(135deg, #0F2A4A 0%, #2F5A8B 100%)",  // navy → steel
];

function gradientFor(slug: string): BlogImage {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) & 0xfffffff;
  }
  const gradient = GRADIENT_PALETTE[h % GRADIENT_PALETTE.length];
  const initial = (slug.replace(/[^a-z]/gi, "")[0] || "A").toUpperCase();
  return { kind: "gradient", gradient, initial };
}

function imageFromFrontmatter(slug: string, data: Record<string, unknown>): BlogImage {
  const url = typeof data.image === "string" ? data.image.trim() : "";
  const alt = typeof data.image_alt === "string" ? data.image_alt.trim() : "";
  if (url && (url.startsWith("/") || url.startsWith("http"))) {
    return {
      kind: "url",
      src: url,
      alt: alt || ((data.title as string) || slug),
    };
  }
  return gradientFor(slug);
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data } = matter(raw);
    return {
      slug,
      title: (data.title as string) || slug,
      date: (data.date as string) || "2026-01-01",
      excerpt: (data.excerpt as string) || "",
      author: (data.author as string) || "Margin Atlas team",
      image: imageFromFrontmatter(slug, data),
    } as BlogPost;
  });
  // newest first
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);
  return {
    slug,
    title: (data.title as string) || slug,
    date: (data.date as string) || "2026-01-01",
    excerpt: (data.excerpt as string) || "",
    author: (data.author as string) || "Margin Atlas team",
    bodyHtml: processed.toString(),
    image: imageFromFrontmatter(slug, data),
  };
}
