import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/blog";

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

  return (
    <article className="max-w-2xl mx-auto">
      <nav className="text-sm text-ink-700/70 mb-4">
        <a href="/blog" className="hover:text-atlas-600">← Back to all posts</a>
      </nav>
      <header className="py-6">
        <div className="text-xs text-ink-700/60">
          {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · {post.author}
        </div>
        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-ink-900">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-3 text-lg text-ink-800/80">{post.excerpt}</p>
        )}
      </header>
      <div
        className="prose prose-slate max-w-none py-6"
        dangerouslySetInnerHTML={{ __html: post.bodyHtml || "" }}
      />
    </article>
  );
}
