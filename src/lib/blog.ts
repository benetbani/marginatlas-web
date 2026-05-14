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
};

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
  };
}
