"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BlogCard from "@/components/ui/blog-card";

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  thumbnail: string | null;
  tags: string[];
  publishedAt: Date | string;
  content: string;
}

export default function BlogCarousel({ posts }: { posts: Post[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [posts]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8; // Scroll 80% of container width
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full max-w-[100vw]">
      {/* Navigation Buttons (Desktop) */}
      <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-4 right-4 justify-between pointer-events-none z-20">
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-background border border-glass-border shadow-lg transition-all ${
            canScrollLeft ? "opacity-100 hover:scale-110 hover:bg-background-secondary" : "opacity-0 cursor-default"
          }`}
          aria-label="Previous posts"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`pointer-events-auto flex items-center justify-center w-12 h-12 rounded-full bg-background border border-glass-border shadow-lg transition-all ${
            canScrollRight ? "opacity-100 hover:scale-110 hover:bg-background-secondary" : "opacity-0 cursor-default"
          }`}
          aria-label="Next posts"
        >
          <ChevronRight className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-[calc(50vw-150px)] sm:px-[calc(50vw-190px)] md:px-12 pb-8 pt-4 hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}} />
        
        {posts.map((post) => (
          <div key={post.id} className="w-[300px] sm:w-[380px] shrink-0 snap-center">
            <BlogCard
              title={post.title}
              excerpt={post.excerpt || ""}
              slug={post.slug}
              thumbnail={post.thumbnail || ""}
              tags={post.tags}
              publishedAt={typeof post.publishedAt === "string" ? post.publishedAt : post.publishedAt.toISOString()}
              content={post.content}
              disableAnimation={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
