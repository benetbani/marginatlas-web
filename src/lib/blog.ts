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

// Cover gradients anchored to the live token ramps (conformed 2026-06-12;
// the old navy pair was off-palette blue, replaced by the sanctioned teal).
/* NO GREEN AND NO AMBER, AND THE SLOTS STAY WHERE THEY ARE.
   Slot 2 was moss-700 → moss-400 and slot 5 was amber-700 → amber-400. The
   founder, 2026-08-09: "at the bottom of the home page I see a shade of orange
   that is not accepted as a brand color." amber-400 #eda12f IS that orange, on
   a blog cover, and the ratified palette bans amber and green by name.
   Replaced IN PLACE rather than reordered: gradientFor() hashes the slug to an
   index, so moving a slot silently reassigns covers on every existing post. */
const GRADIENT_PALETTE = [
  "linear-gradient(135deg, #991600 0%, #f24e2f 100%)",  // atlas-700 → atlas-400
  "linear-gradient(135deg, #211810 0%, #534231 100%)",  // ink-900 → cocoa-700
  "linear-gradient(135deg, #463726 0%, #7d6c58 100%)",  // ink-700 → ink-500
  "linear-gradient(135deg, #534231 0%, #c3b39c 100%)",  // cocoa-700 → cocoa-300
  "linear-gradient(135deg, #e62200 0%, #f24e2f 100%)",  // atlas-500 → atlas-400
  "linear-gradient(135deg, #345a47 0%, #4d7c64 100%)",  // teal-700 → teal-500
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
