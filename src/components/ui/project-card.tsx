"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "./icons";
import SkillBadge from "./skill-badge";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  description: string;
  slug: string;
  coverImage: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  index?: number;
  className?: string;
}

export default function ProjectCard({
  title,
  description,
  slug,
  coverImage,
  techStack,
  githubUrl,
  demoUrl,
  featured,
  index = 0,
  className,
}: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col rounded-2xl bg-background-secondary border border-glass-border overflow-hidden transition-all duration-500 hover:border-white/20",
        className
      )}
    >
      {/* Cover Image Container */}
      <div className="relative flex-1 min-h-[240px] overflow-hidden">
        <Link href={`/projects/${slug}`} className="absolute inset-0 w-full h-full">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={coverImage.includes("thum.io") || coverImage.includes("microlink.io")}
            priority={index <= 1}
          />
          {/* Subtle dark gradient overlay to make text more readable if overlaid */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-background via-background/80 to-transparent pointer-events-none" />
        </Link>

        {/* Action Links */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-background/90 backdrop-blur-md text-foreground hover:text-background hover:bg-foreground transition-all"
              aria-label="View source code"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-background/90 backdrop-blur-md text-foreground hover:text-background hover:bg-foreground transition-all"
              aria-label="View live demo"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6 md:p-8 flex flex-col justify-end bg-linear-to-t from-background-secondary via-background-secondary to-transparent -mt-16 z-10 pt-20">
        <Link href={`/projects/${slug}`}>
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 tracking-tight group-hover:text-accent-secondary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-sm md:text-base text-foreground-muted line-clamp-2 leading-relaxed mb-6 font-light">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {techStack.slice(0, 4).map((tech) => (
            <SkillBadge key={tech} name={tech} variant="outline" className="border-white/10" />
          ))}
          {techStack.length > 4 && (
            <span className="text-xs font-medium text-foreground-subtle self-center ml-1 uppercase tracking-wider">
              +{techStack.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
