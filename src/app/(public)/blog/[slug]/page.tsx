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
    <div className="pt-24">
      <SectionWrapper className="py-12 md:py-16">
        <article className="container-custom max-w-3xl">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-accent-secondary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-subtle mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readingTime(post.content)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            {post.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Tag className="w-4 h-4 text-foreground-subtle" />
            {post.tags.map((tag) => (
              <SkillBadge key={tag} name={tag} variant="outline" />
            ))}
          </div>

          {/* Thumbnail */}
          {post.thumbnail && (
            <div className="relative aspect-2/1 md:aspect-21/9 w-full rounded-3xl overflow-hidden mb-12 glass border-white/10 group">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="prose dark:prose-invert prose-lg max-w-none mt-8
            prose-p:text-justify prose-p:text-foreground-muted prose-p:leading-relaxed prose-p:mb-6
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
            prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-6 prose-h2:gradient-text
            prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-accent
            prose-strong:text-foreground prose-strong:font-bold
            prose-a:text-accent-secondary hover:prose-a:text-accent prose-a:transition-colors
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-li:text-foreground-muted prose-li:marker:text-accent prose-li:mb-2 prose-li:text-justify
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6 prose-ol:marker:font-semibold
            prose-hr:border-glass-border prose-hr:my-12
            prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-foreground-muted
            prose-code:text-accent-secondary prose-code:bg-background-tertiary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-background-secondary prose-pre:border prose-pre:border-glass-border prose-pre:rounded-xl
          ">
            {post.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            ) : (
              <p>No content provided for this blog post yet.</p>
            )}
          </div>
        </article>
      </SectionWrapper>
    </div>
  );
}
