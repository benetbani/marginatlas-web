import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/blog";
import LongformArticle from "@/components/editorial/LongformArticle";

export const revalidate = 86400;
export const dynamicParams = true;

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} | Margin Atlas`,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // Reading time from the rendered body (about 200 words per minute).
  const words = (post.bodyHtml || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(words / 200));
  const publishDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const related = getAllPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, 4)
    .map((p) => ({ slug: p.slug, title: p.title, subtitle: p.excerpt }));

  // Cover: keep the site convention (real image when present, deterministic
  // gradient placeholder otherwise). Rendered inside the longform frame.
  const cover =
    post.image.kind === "url" ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={post.image.src} alt={post.image.alt} className="w-full object-cover" />
    ) : (
      <div
        className="w-full aspect-[16/9] flex items-center justify-center"
        style={{ background: post.image.gradient }}
        aria-hidden="true"
      >
        <span className="font-display text-6xl md:text-7xl font-semibold text-white/85">
          {post.image.initial}
        </span>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto">
      <nav className="text-sm text-ink-700/70 mb-2">
        <a href="/blog" className="hover:text-atlas-600">Back to all posts</a>
      </nav>
      <LongformArticle
        title={post.title}
        deck={post.excerpt}
        publishDate={publishDate}
        author={post.author || "Margin Atlas"}
        readMinutes={readMinutes}
        cover={cover}
        bodyHtml={post.bodyHtml || ""}
        related={related}
      />
    </div>
  );
}
