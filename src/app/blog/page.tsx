import { getAllPosts, type BlogImage } from "@/lib/blog";

export const revalidate = 86400;

export const metadata = {
  title: "Blog | Margin Atlas",
  description: "Notes and deep-dives on small-business benchmarking.",
};

function BlogCover({ image }: { image: BlogImage }) {
  if (image.kind === "url") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image.src}
        alt={image.alt}
        className="w-full aspect-[16/9] object-cover rounded-t-md"
        loading="lazy"
      />
    );
  }
  return (
    <div
      className="w-full aspect-[16/9] rounded-t-md flex items-center justify-center"
      style={{ background: image.gradient }}
      aria-hidden="true"
    >
      <span className="font-display text-5xl md:text-6xl font-semibold text-white/85">
        {image.initial}
      </span>
    </div>
  );
}

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
            className="atlas-card overflow-hidden transition flex flex-col"
          >
            <BlogCover image={p.image} />
            <div className="p-5">
              <div className="text-xs text-ink-700/60">
                {new Date(p.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </div>
              <h2 className="mt-2 text-xl font-semibold text-ink-900">{p.title}</h2>
              <p className="mt-2 text-sm text-ink-800/80">{p.excerpt}</p>
              <div className="mt-3 text-sm text-atlas-600">Read →</div>
            </div>
          </a>
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-ink-700/70">No posts yet: drop Markdown files in <code>content/blog/</code>.</p>
        )}
      </section>
    </div>
  );
}
