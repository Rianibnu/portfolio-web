"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface BlogFilterProps {
  categories: string[];
}

export default function BlogFilter({ categories }: BlogFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentCategory = searchParams.get("category");

  const handleFilter = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    // Update the URL without reloading the page
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8 animate-fade-in-up">
      <button
        onClick={() => handleFilter(null)}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
          !currentCategory
            ? "bg-foreground text-background shadow-lg scale-105"
            : "bg-background-secondary text-foreground-muted hover:bg-background-tertiary border border-glass-border"
        )}
      >
        Semua
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleFilter(category)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
            currentCategory === category
              ? "bg-foreground text-background shadow-lg scale-105"
              : "bg-background-secondary text-foreground-muted hover:bg-background-tertiary border border-glass-border"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
