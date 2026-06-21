import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import SectionWrapper from "@/components/layout/section-wrapper";
import SkillBadge from "@/components/ui/skill-badge";
import { prisma } from "@/lib/prisma";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });

  if (!project) {
    return (
      <div className="pt-32 pb-20 text-center container-custom">
        <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
        <p className="text-foreground-muted mb-8">
          The project you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-accent-secondary hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <SectionWrapper className="py-12 md:py-16">
        <div className="container-custom max-w-4xl">
          {/* Back Link */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-accent-secondary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          {/* Header */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            {project.title}
          </h1>
          <p className="text-foreground-muted text-lg mb-6">{project.description}</p>

          {/* Links */}
          <div className="flex gap-3 mb-8">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg glass text-sm font-medium text-foreground-muted hover:text-foreground transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                Source Code
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-secondary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-10">
            {project.techStack.map((tech) => (
              <SkillBadge key={tech} name={tech} variant="accent" />
            ))}
          </div>

          {/* Cover Image */}
          <div className="relative aspect-video rounded-xl overflow-hidden mb-16 glass">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
              unoptimized={project.coverImage.includes("thum.io") || project.coverImage.includes("microlink.io")}
            />
          </div>

          {/* Content */}
          <div className="prose dark:prose-invert prose-lg max-w-none mt-12
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
          ">
            {project.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.content}
              </ReactMarkdown>
            ) : (
              <p>No detailed content provided for this project yet.</p>
            )}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
