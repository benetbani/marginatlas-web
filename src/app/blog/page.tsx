import { getAllPosts } from "@/lib/blog";

export const revalidate = 86400;

export const metadata = {
  title: "Blog | Margin Atlas",
  description: "Notes and deep-dives on small-business benchmarking.",
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <div>
      <header className="py-10">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
          Blog
        </h1>
        <p className="mt-3 text-lg text-ink-800/80 max-w-2xl">
          Notes from building the world's most comprehensive small-business
          benchmarking database.
        </p>
      </header>
      <section className="py-6 grid md:grid-cols-2 gap-5">
        {posts.map((p) => (
          <a
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="card hover:border-atlas-500 transition"
          >
            <div className="text-xs text-ink-700/60">
              {new Date(p.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
            <h2 className="mt-2 text-xl font-semibold text-ink-900">{p.title}</h2>
            <p className="mt-2 text-sm text-ink-800/80">{p.excerpt}</p>
            <div className="mt-3 text-sm text-atlas-600">Read →</div>
          </a>
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-ink-700/70">No posts yet: drop Markdown files in <code>content/blog/</code>.</p>
        )}
      </section>
    </div>
  );
}
