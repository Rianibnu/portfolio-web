import { cn } from "@/lib/utils";

interface SkillBadgeProps {
  name: string;
  className?: string;
  variant?: "default" | "outline" | "accent";
}

export default function SkillBadge({
  name,
  className,
  variant = "default",
}: SkillBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200",
        variant === "default" &&
          "bg-background-tertiary text-foreground-muted hover:text-accent-secondary hover:bg-accent/10",
        variant === "outline" &&
          "border border-glass-border text-foreground-muted hover:border-accent/30 hover:text-accent-secondary",
        variant === "accent" &&
          "bg-accent/10 text-accent-secondary border border-accent/20",
        className
      )}
    >
      {name}
    </span>
  );
}
