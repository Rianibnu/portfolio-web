"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { formatDate, readingTime } from "@/lib/utils";
import SkillBadge from "./skill-badge";

interface BlogCardProps {
  title: string;
  excerpt: string;
  slug: string;
  thumbnail?: string;
  tags: string[];
  publishedAt: string;
  content?: string;
  index?: number;
}

export default function BlogCard({
  title,
  excerpt,
  slug,
  thumbnail,
  tags,
  publishedAt,
  content,
  index = 0,
}: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col rounded-2xl bg-background-secondary border border-glass-border overflow-hidden transition-all duration-500 hover:border-white/20 h-full"
    >
      {/* Thumbnail */}
      {thumbnail && (
        <Link href={`/blog/${slug}`} className="block relative overflow-hidden aspect-video">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}

      {/* Content */}
      <div className="relative aspect-video w-full overflow-hidden">
        {/* Meta */}
        <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider text-foreground-subtle mb-4">
          <span>{formatDate(publishedAt)}</span>
          {content && (
            <>
              <span className="w-1 h-1 rounded-full bg-glass-border shrink-0" />
              <span>{readingTime(content)}</span>
            </>
          )}
        </div>

        {/* Title */}
        <Link href={`/blog/${slug}`} className="block mb-3">
          <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors flex items-start justify-between">
            <span className="line-clamp-2">{title}</span>
            <ArrowUpRight className="w-5 h-5 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all shrink-0" />
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-foreground-muted line-clamp-2 font-light leading-relaxed mb-6 flex-1">
          {excerpt}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {tags.slice(0, 3).map((tag) => (
              <SkillBadge key={tag} name={tag} variant="outline" className="border-white/10" />
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
