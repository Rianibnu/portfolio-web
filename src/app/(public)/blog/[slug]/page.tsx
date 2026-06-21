import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import SectionWrapper from "@/components/layout/section-wrapper";
import SkillBadge from "@/components/ui/skill-badge";
import { formatDate, readingTime } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import FadeIn from "@/components/ui/fade-in";
import ReadingProgress from "@/components/blog/reading-progress";
import FloatingBar from "@/components/blog/floating-bar";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt || post.content.slice(0, 160),
  };
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post) {
    return (
      <div className="pt-32 pb-20 text-center container-custom">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="text-foreground-muted mb-8">
          The blog post you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-accent-secondary hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <ReadingProgress />
      <FloatingBar />
      
      <div className="pt-24 md:pt-32">
        <SectionWrapper className="py-8 md:py-12">
          <article className="container-custom max-w-3xl">
            {/* Header Section (Centered) */}
            <div className="flex flex-col items-center text-center mb-12">
              <FadeIn delay={0}>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-accent-secondary transition-colors mb-8 bg-background-secondary px-4 py-2 rounded-full border border-glass-border"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-foreground-subtle mb-6">
                  <span className="flex items-center gap-1.5 bg-background-secondary px-3 py-1 rounded-md border border-white/5">
                    <Calendar className="w-4 h-4 text-accent" />
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1.5 bg-background-secondary px-3 py-1 rounded-md border border-white/5">
                    <Clock className="w-4 h-4 text-accent" />
                    {readingTime(post.content)}
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6 leading-[1.1]">
                  {post.title}
                </h1>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Tag className="w-4 h-4 text-foreground-subtle mr-1" />
                  {post.tags.map((tag) => (
                    <SkillBadge key={tag} name={tag} variant="outline" className="bg-background-secondary" />
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Thumbnail */}
            {post.thumbnail && (
              <FadeIn delay={0.4}>
                <div className="relative aspect-video md:aspect-[21/9] w-full rounded-3xl overflow-hidden mb-16 shadow-[0_0_40px_rgba(var(--accent-rgb),0.15)] border border-white/10 group">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                </div>
              </FadeIn>
            )}

            {/* Content */}
            <FadeIn delay={0.5}>
              <div className="prose dark:prose-invert prose-lg md:prose-xl max-w-none
                prose-p:text-justify prose-p:text-foreground-muted prose-p:leading-relaxed prose-p:mb-8
                first-letter:prose-p:text-6xl first-letter:prose-p:font-bold first-letter:prose-p:text-accent first-letter:prose-p:mr-2 first-letter:prose-p:float-left first-letter:prose-p:leading-none
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:gradient-text
                prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4 prose-h3:text-accent-secondary
                prose-strong:text-foreground prose-strong:font-bold
                prose-a:text-accent hover:prose-a:text-accent-secondary prose-a:transition-colors prose-a:underline-offset-4
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8 prose-li:text-foreground-muted prose-li:marker:text-accent prose-li:mb-2
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-8 prose-ol:marker:font-semibold prose-ol:marker:text-accent
                prose-hr:border-glass-border prose-hr:my-16
                prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-foreground-muted prose-blockquote:bg-background-secondary/50 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg
                prose-code:text-accent-secondary prose-code:bg-background-tertiary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-[#1a1a1a] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:shadow-xl prose-pre:my-8
              ">
                {post.content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content}
                  </ReactMarkdown>
                ) : (
                  <p>No content provided for this blog post yet.</p>
                )}
              </div>
            </FadeIn>
          </article>
        </SectionWrapper>
      </div>
    </>
  );
}
