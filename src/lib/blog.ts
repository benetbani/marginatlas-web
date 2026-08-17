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
  /* `initial` REMOVED 2026-08-17. It held the first letter of the slug and was
     rendered as a giant character across the cover. NeighborhoodCover's header
     had already diagnosed that exact treatment as reading like a broken
     placeholder, and on the rendered page it also collided:
     "us-small-business-overview" and "uk-overview" both produced U, side by
     side. With the last render gone the field was computed by two producers and
     read by none, which is the same defect as the covers this rail was building
     and discarding. */
  | { kind: "gradient"; gradient: string };

// Cover gradients anchored to the live token ramps (conformed 2026-06-12;
// the old navy pair was off-palette blue, replaced by the sanctioned teal).
/* NO GREEN AND NO AMBER, AND THE SLOTS STAY WHERE THEY ARE.
   Slot 2 was moss-700 → moss-400 and slot 5 was amber-700 → amber-400. The
   founder, 2026-08-09: "at the bottom of the home page I see a shade of orange
   that is not accepted as a brand color." amber-400 #eda12f IS that orange, on
   a blog cover, and the ratified palette bans amber and green by name.
   Replaced IN PLACE rather than reordered: gradientFor() hashes the slug to an
   index, so moving a slot silently reassigns covers on every existing post. */
/* EXPORTED 2026-08-17, because it had a hand-maintained twin. src/app/page.tsx
   carried a byte-identical copy for its fallback posts, under a comment reading
   "these two lists must stay identical", which is a rule a person has to
   remember on every edit. It is now one list, imported. The green slot found
   this session had in fact drifted between them once already. */
export const GRADIENT_PALETTE = [
  "linear-gradient(135deg, #991600 0%, #f24e2f 100%)",  // atlas-700 → atlas-400
  /* THREE BROWN COVERS REPLACED 2026-08-17, measured rather than judged. These
     three painted hue 28 to 35 with real saturation, which is brown, and the
     worst of them was also the LIGHTEST plate in the set (mean luminance .261),
     so it was the most visible brown on the page. An agent photographing the
     homepage reported the rail reading brown and khaki at full size; the hues
     confirm it.

     WHY BOTH GATES PASSED THEM. verify_palette_membership allows h 25-45 at
     s<=45 as the "ink/cocoa ladder" band, and its own header says that band
     exists for the TYPE ladder and that a hue check "cannot see the difference
     between type and fill". A 340x190 cover plate is a fill, which is the case
     the founder actually banned.

     SEPARATION IS BY DEPTH AND FAMILY, NOT BY HUE, which is the same answer
     NeighborhoodCover reached for the same problem: the ratified palette does
     not hold six hues, and pretending otherwise is exactly how a green and an
     amber got into this list in the first place. Two deeper terracottas, one
     oxblood from the clay ramp, and one true-neutral ramp for contrast. */
  "linear-gradient(135deg, #4a0a00 0%, #c11c00 100%)",  // atlas-900 -> atlas-600
  "linear-gradient(135deg, #5c1813 0%, #b3463a 100%)",  // clay-700 -> clay-400
  "linear-gradient(135deg, #211810 0%, #bababa 100%)",  // ink-900 -> paper-450, the one neutral
  "linear-gradient(135deg, #e62200 0%, #f24e2f 100%)",  // atlas-500 → atlas-400
  /* THE SAGE RAMP IS GONE, and it took a screenshot to catch, which is the
     point. It was labelled "teal-700 → teal-500" and the label is why it
     survived: #345a47 and #4d7c64 both measure hue 149 to 150, which is green,
     not teal. Teal sits near 180. A banned hue had a permitted name.

     Its own token says so too. design-tokens describes the sage ramp as "the
     single cool counterweight to the terracotta field. Use under 5% of
     surface." A cover plate is roughly 340 by 190 and one of six on the
     homepage rail, which is not five percent of anything. The token stays
     defined for the small data-accent job it was written for; it just cannot
     be a full-bleed field.

     None of this was visible while the homepage rail was discarding its
     covers. Rendering them turned a dormant palette entry into the most
     saturated object on the page, which is why the replacement lands in the
     same session as the covers.

     Replaced with ink-900 to atlas-700: a dark ramp that resolves into
     terracotta, distinct from all five above and inside the sanctioned
     palette. Both this list and its twin in src/app/page.tsx changed
     together, per the note there. */
  "linear-gradient(135deg, #211810 0%, #991600 100%)",  // ink-900 → atlas-700
];

function gradientFor(slug: string): BlogImage {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) & 0xfffffff;
  }
  const gradient = GRADIENT_PALETTE[h % GRADIENT_PALETTE.length];
  return { kind: "gradient", gradient };
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
