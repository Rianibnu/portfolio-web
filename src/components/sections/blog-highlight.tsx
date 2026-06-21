import { prisma } from "@/lib/prisma";
import BlogCarousel from "@/components/blog/blog-carousel";

export default async function BlogHighlight() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 8,
  });

  if (posts.length === 0) {
    return null;
  }

  // Ensure dates are converted to strings before passing to Client Component
  const serializedPosts = posts.map(post => ({
    ...post,
    publishedAt: post.publishedAt.toISOString(),
  }));

  return (
    <section className="py-24 md:py-32 overflow-hidden bg-background-secondary relative border-t border-glass-border">
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      
      <div className="container-custom mb-12 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-glass-border bg-background shadow-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-xs font-medium tracking-wide uppercase text-foreground-subtle">
            Insight & Pemikiran
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
          Sorotan <span className="text-foreground-muted font-light">Artikel</span>
        </h2>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <BlogCarousel posts={serializedPosts} />
      </div>
    </section>
  );
}
