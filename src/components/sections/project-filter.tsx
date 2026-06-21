"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ProjectFilterProps {
  categories: string[];
}

export default function ProjectFilter({ categories }: ProjectFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get("category") || "Semua";

  const handleFilter = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === "Semua") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-10">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleFilter(cat)}
          className={cn(
            "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
            currentCategory === cat
              ? "bg-foreground text-background shadow-md scale-105"
              : "bg-background-secondary border border-glass-border text-foreground-muted hover:border-foreground/30 hover:text-foreground"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
