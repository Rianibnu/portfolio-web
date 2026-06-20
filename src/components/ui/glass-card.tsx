"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowOnHover?: boolean;
  as?: "div" | "article" | "li";
}

export default function GlassCard({
  children,
  className,
  hoverEffect = true,
  glowOnHover = false,
  as: Component = "div",
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Component
        className={cn(
          "glass rounded-xl p-6 transition-all duration-300",
          hoverEffect && "cursor-pointer",
          glowOnHover && "hover:shadow-[0_0_30px_rgba(108,92,231,0.15)]",
          className
        )}
      >
        {children}
      </Component>
    </motion.div>
  );
}
