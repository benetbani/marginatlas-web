import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/blog";
import LongformArticle from "@/components/editorial/LongformArticle";
import { BlogCover } from "@/components/blog/BlogCover";
import { PostFoot } from "@/components/blog/PostFoot";
import { ldJson } from "@/components/StructuredData";

const SITE = "https://www.marginatlas.com";
const longDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export const revalidate = 86400;
/* A POST THAT DOES NOT EXIST IS A 404 AT THE ROUTER (fix round F2, item I1; the final review): the page's own notFound() below runs inside the root
   loading boundary after the status line is sent, so /blog/<no such post> answered 200 with the loading skeleton and drew its 404 in the browser, a
   soft 404 (probed on the built page). Every post is a file under content/blog and generateStaticParams lists every one, so no other slug is a page: with
   `dynamicParams` false the router answers any slug that list does not hold with 404 and renders nothing for it. A retired or moved slug is a
   next.config.js redirect, and redirects run before routing, so none of them reaches this. A post added later is a file and a deploy, as it always was. */
export const dynamicParams = false;

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  /* A MISSING POST STOPS THE METADATA (fix round F1, group G8; reworded in fix round F2, item I1): this call draws no title of its own for a post that does
     not exist, which is all it does. It does NOT set the status: the metadata streams inside the root loading boundary, as src/middleware.ts says beside its
     place rule ("Moving the call into generateMetadata does not help either"), and /zz's 404 is the middleware's. The status is the router's, through
     dynamicParams above. */
  if (!post) notFound();
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(articleLd) }} />
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
