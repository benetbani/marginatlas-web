import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/blog";
import LongformArticle from "@/components/editorial/LongformArticle";
import { BlogCover } from "@/components/blog/BlogCover";
import { PostFoot } from "@/components/blog/PostFoot";

const SITE = "https://www.marginatlas.com";
const longDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

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
  const publishDate = longDate(post.date);
  /* Further reading: the post's own category first (P36.1, 2026-10-06), then the newest of the rest. */
  const others = getAllPosts().filter((p) => p.slug !== slug);
  const related = [...others.filter((p) => post.category && p.category === post.category), ...others.filter((p) => !post.category || p.category !== post.category)]
    .slice(0, 4)
    .map((p) => ({ slug: p.slug, title: p.title, subtitle: p.excerpt }));

  /* THE ARTICLE'S MARKUP (CREDIBILITY.md, item 9: Article dates in structured data), only what the page itself prints: the
     title, the line under it, the two dates and the byline. A byline of the site's own name is the organisation. */
  const byline = post.author || "Margin Atlas";
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: byline === "Margin Atlas" ? { "@type": "Organization", name: byline, url: `${SITE}/about` } : { "@type": "Person", name: byline },
    publisher: { "@type": "Organization", name: "Margin Atlas", url: SITE },
    mainEntityOfPage: `${SITE}/blog/${post.slug}`,
  };

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd).replace(/</g, "\\u003c") }} />
      <LongformArticle
        seriesLabel={post.category ?? "Margin Atlas"}
        title={post.title}
        deck={post.excerpt}
        publishDate={publishDate}
        updatedDate={post.updated ? longDate(post.updated) : undefined}
        author={byline}
        readMinutes={readMinutes}
        cover={cover}
        bodyHtml={post.bodyHtml || ""}
        foot={<PostFoot post={post} />}
        related={related}
      />
    </div>
  );
}
