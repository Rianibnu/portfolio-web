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
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ShareButtons from "@/components/ui/share-buttons";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post) {
    return { title: "Post Not Found" };
  }

  // Clean description for SEO: remove markdown characters and trim
  const rawDescription = post.excerpt || post.content.slice(0, 160);
  const cleanDescription = rawDescription.replace(/[#*`>]/g, "").trim() + "...";
  
  // Base URL (Make sure to set NEXT_PUBLIC_APP_URL in your .env, e.g., https://yourdomain.com)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rirstudio.com";
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description: cleanDescription,
    keywords: post.tags, // Next.js accepts an array of strings for keywords
    authors: [{ name: "Rian Ibnu", url: baseUrl }],
    openGraph: {
      title: post.title,
      description: cleanDescription,
      url: postUrl,
      type: "article",
      publishedTime: post.publishedAt.toISOString(),
      authors: ["Rian Ibnu"],
      images: post.thumbnail ? [
        {
          url: post.thumbnail.startsWith('http') ? post.thumbnail : `${baseUrl}${post.thumbnail}`,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: cleanDescription,
      images: post.thumbnail ? [post.thumbnail.startsWith('http') ? post.thumbnail : `${baseUrl}${post.thumbnail}`] : [],
    },
    alternates: {
      canonical: postUrl,
    }
  };
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (post) {
    // Increment view count asynchronously
    prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    }).catch(console.error); // Catch any errors so it doesn't crash the page
  }

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

  // Fetch recommended posts
  const recentPosts = await prisma.post.findMany({
    where: { published: true, id: { not: post.id } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  // Extract headings for Table of Contents
  const headings = post.content
    ? Array.from(post.content.matchAll(/^(##|###)\s+(.*)$/gm)).map((match) => {
        // github-slugger simple approximation
        const id = match[2].toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        return {
          level: match[1].length,
          text: match[2],
          id,
        };
      })
    : [];

  const postUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://rirstudio.com"}/blog/${post.slug}`;

  return (
    <div className="pt-24">
      <SectionWrapper className="py-12 md:py-16">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Content Area */}
          <article className="lg:col-span-8 w-full max-w-3xl">
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-[1.15]">
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
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-12 glass border-white/10 group">
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
              prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0
            ">
              {post.content ? (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSlug]}
                  components={{
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <div className="not-prose my-8 rounded-xl overflow-hidden border border-glass-border">
                          <SyntaxHighlighter
                            {...props}
                            style={vscDarkPlus as any}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.95rem', lineHeight: '1.7' }}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code {...props} className={className}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              ) : (
                <p>No content provided for this blog post yet.</p>
              )}
            </div>

            {/* Bottom Share Buttons */}
            <div className="mt-16 pt-8 border-t border-glass-border">
              <ShareButtons url={postUrl} title={post.title} />
            </div>
          </article>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 mt-16 lg:mt-0 pt-2 lg:pt-24 border-t lg:border-t-0 border-glass-border">
            <div className="sticky top-32 space-y-12">
              
              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="hidden lg:block bg-background-secondary border border-glass-border rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    Daftar Isi
                  </h3>
                  <nav className="flex flex-col gap-2">
                    {headings.map((heading, i) => (
                      <a
                        key={i}
                        href={`#${heading.id}`}
                        className={`text-sm text-foreground-muted hover:text-accent transition-colors line-clamp-1 ${
                          heading.level === 3 ? "ml-4" : ""
                        }`}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Recommended Reading */}
              {recentPosts.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    Rekomendasi Bacaan
                  </h3>
                  <div className="flex flex-col gap-6">
                    {recentPosts.map((relatedPost) => (
                      <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group flex gap-4 items-start">
                        {relatedPost.thumbnail && (
                          <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0 border border-glass-border">
                            <Image src={relatedPost.thumbnail} alt={relatedPost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-sm leading-tight mb-2 group-hover:text-accent transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-foreground-subtle">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(relatedPost.publishedAt)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Box */}
              <div className="p-6 rounded-2xl bg-background-secondary border border-glass-border">
                <h3 className="font-bold text-lg mb-3">Tentang Penulis</h3>
                <p className="text-sm text-foreground-muted leading-relaxed font-light mb-5">
                  Saya selalu tertarik mendiskusikan web development, UI/UX, dan inovasi teknologi terbaru. Jika Anda menemukan tulisan ini bermanfaat, mari berkolaborasi!
                </p>
                <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold bg-foreground text-background px-4 py-2 rounded-lg hover:scale-105 transition-all">
                  Mulai Diskusi &rarr;
                </Link>
              </div>

            </div>
          </aside>

        </div>
      </SectionWrapper>
    </div>
  );
}
