import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/blog";
import LongformArticle from "@/components/editorial/LongformArticle";
import { BlogCover } from "@/components/blog/BlogCover";

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
  // Built from the RESOLVED post, not the raw param, so the canonical is the
  // slug the library actually loaded. Without an `alternates` of its own this
  // route inherited the root layout's `canonical: "/"` and every post told a
  // crawler it was the home page.
  const canonical = `/blog/${post.slug}`;
  return {
    title: `${post.title} | Margin Atlas`,
    description: post.excerpt,
    alternates: { canonical },
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

  /* THE SHARED COVER, not a fourth copy of it. This file carried its own
     inline version, url branch and gradient branch, including the giant initial
     that NeighborhoodCover had already identified as reading like a broken
     placeholder. There were four copies of this logic in the repo: the blog
     index, this page, home2-view's own local BlogCover, and the homepage rail,
     which had none at all and rendered no cover. One component now. */
  const cover = <BlogCover image={post.image} />;

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
