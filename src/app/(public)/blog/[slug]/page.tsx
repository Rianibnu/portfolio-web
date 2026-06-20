import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import SectionWrapper from "@/components/layout/section-wrapper";
import SkillBadge from "@/components/ui/skill-badge";
import { formatDate, readingTime } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

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
          <div className="prose prose-invert prose-lg max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:gradient-text
            prose-p:text-foreground-muted prose-p:leading-relaxed
            prose-strong:text-foreground prose-strong:font-semibold
            prose-a:text-accent-secondary prose-a:no-underline hover:prose-a:text-accent
            prose-code:text-accent-secondary prose-code:bg-background-tertiary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-background-secondary prose-pre:border prose-pre:border-glass-border prose-pre:rounded-xl
            prose-li:text-foreground-muted
            prose-ul:text-foreground-muted
          ">
            {/* Simple markdown-like rendering — will be replaced with MDX in Phase 2 */}
            {post.content.split("\n").map((line, i) => {
              if (line.startsWith("## ")) {
                return <h2 key={i}>{line.replace("## ", "")}</h2>;
              }
              if (line.startsWith("- **")) {
                const match = line.match(/- \*\*(.+?)\*\*(.+)/);
                if (match) {
                  return (
                    <li key={i}>
                      <strong>{match[1]}</strong>{match[2]}
                    </li>
                  );
                }
              }
              if (line.startsWith("```")) return null;
              if (line.trim() === "") return <br key={i} />;
              return <p key={i}>{line}</p>;
            })}
          </div>
        </article>
      </SectionWrapper>
    </div>
  );
}
