import type { Metadata } from "next";
import SectionWrapper from "@/components/layout/section-wrapper";
import BlogCard from "@/components/ui/blog-card";
import BlogFilter from "@/components/sections/blog-filter";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read my latest articles about web development, technology, and software engineering.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const whereCondition: any = { published: true };
  if (category) {
    whereCondition.category = category;
  }

  const posts = await prisma.post.findMany({
    where: whereCondition,
    orderBy: { publishedAt: "desc" },
  });

  // Ambil daftar kategori unik dari semua post yang sudah di-publish
  const allPublishedPosts = await prisma.post.findMany({
    where: { published: true },
    select: { category: true },
  });

  const categories = Array.from(
    new Set(allPublishedPosts.map((post) => post.category).filter(Boolean))
  ).sort();

  return (
    <SectionWrapper className="pt-32 md:pt-40">
      <div className="container-custom">
        <div className="max-w-2xl mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">
            Blog <span className="text-foreground-muted font-light">Saya.</span>
          </h1>
          <p className="text-lg text-foreground-muted font-light leading-relaxed">
            Pemikiran, tutorial, dan wawasan seputar pengembangan web, desain, dan pembuatan produk.
          </p>
        </div>

        {categories.length > 0 && <BlogFilter categories={categories} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {posts.length === 0 ? (
            <p className="text-foreground-muted col-span-3 py-12 text-center text-lg">
              Belum ada postingan blog yang dipublikasikan. Coba periksa kembali nanti!
            </p>
          ) : (
            posts.map((post, index) => (
              <BlogCard
                key={post.id}
                title={post.title}
                excerpt={post.excerpt || ""}
                slug={post.slug}
                thumbnail={post.thumbnail || ""}
                tags={post.tags}
                publishedAt={post.publishedAt.toISOString()}
                content={post.content}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
