import { prisma } from "@/lib/prisma";
import BlogCard from "@/components/ui/blog-card";

export default async function BlogMarquee() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 8,
  });

  if (posts.length === 0) {
    return null; // Don't show the section if there are no posts
  }

  // We duplicate the posts array so the marquee loop is seamless
  // The marquee container will have two identical children moving left
  return (
    <section className="py-24 md:py-32 border-t border-glass-border overflow-hidden bg-background">
      <div className="container-custom mb-12 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-glass-border bg-background-secondary mb-6">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-medium tracking-wide uppercase text-foreground-subtle">
            Insight & Pemikiran
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
          Sorotan <span className="text-foreground-muted font-light">Artikel</span>
        </h2>
      </div>

      <div className="relative flex overflow-hidden group">
        {/* Left Gradient Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

        {/* First Marquee Track */}
        <div className="flex shrink-0 gap-6 px-3 animate-marquee hover:[animation-play-state:paused]">
          {posts.map((post) => (
            <div key={post.id} className="w-[300px] sm:w-[350px] shrink-0 h-full">
              <BlogCard
                title={post.title}
                excerpt={post.excerpt || ""}
                slug={post.slug}
                thumbnail={post.thumbnail || ""}
                tags={post.tags}
                publishedAt={post.publishedAt.toISOString()}
                content={post.content}
                disableAnimation={true}
              />
            </div>
          ))}
        </div>

        {/* Second Marquee Track (Duplicate for seamless loop) */}
        <div className="flex shrink-0 gap-6 px-3 animate-marquee hover:[animation-play-state:paused]">
          {posts.map((post) => (
            <div key={`${post.id}-dup`} className="w-[300px] sm:w-[350px] shrink-0 h-full">
              <BlogCard
                title={post.title}
                excerpt={post.excerpt || ""}
                slug={post.slug}
                thumbnail={post.thumbnail || ""}
                tags={post.tags}
                publishedAt={post.publishedAt.toISOString()}
                content={post.content}
                disableAnimation={true}
              />
            </div>
          ))}
        </div>

        {/* Right Gradient Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
