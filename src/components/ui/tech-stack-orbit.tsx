"use client";

import { motion } from "framer-motion";

// Tech stack items with colors matching their brand
const TECH_ITEMS = [
  { name: "React", color: "#61DAFB", icon: "⚛" },
  { name: "Next.js", color: "#ffffff", icon: "▲" },
  { name: "Node.js", color: "#68A063", icon: "⬢" },
  { name: "TypeScript", color: "#3178C6", icon: "TS" },
  { name: "Prisma", color: "#2D3748", icon: "◆" },
  { name: "Tailwind", color: "#38BDF8", icon: "✦" },
  { name: "Git", color: "#F05032", icon: "⎇" },
  { name: "PostgreSQL", color: "#4169E1", icon: "🐘" },
];

// Split into 2 orbit rings
const INNER_ORBIT = TECH_ITEMS.slice(0, 4);
const OUTER_ORBIT = TECH_ITEMS.slice(4, 8);

export default function TechStackOrbit() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-[450px] h-[450px] xl:w-[550px] xl:h-[550px]"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--accent-primary),transparent_70%)] opacity-[0.06] blur-3xl scale-150" />

      {/* Outer orbit ring */}
      <div className="absolute inset-0 rounded-full border border-glass-border opacity-40" />

      {/* Inner orbit ring */}
      <div className="absolute inset-12 xl:inset-16 rounded-full border border-glass-border opacity-30" />

      {/* Dotted middle ring */}
      <div
        className="absolute inset-6 xl:inset-10 rounded-full opacity-20"
        style={{
          border: "1px dashed var(--glass-border)",
        }}
      />

      {/* Center — Initials */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, var(--accent-primary), transparent, var(--highlight), transparent)",
            opacity: 0.06,
          }}
        />
        <div className="relative w-20 h-20 xl:w-24 xl:h-24 rounded-full bg-background border border-glass-border flex items-center justify-center shadow-lg z-10">
          <span className="text-2xl xl:text-3xl font-extrabold tracking-tighter gradient-text">
            RIR
          </span>
        </div>
      </div>

      {/* Outer orbit items — rotating clockwise */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        {OUTER_ORBIT.map((tech, index) => {
          const angle = (index / OUTER_ORBIT.length) * 360;
          const rad = (angle * Math.PI) / 180;
          // Position on the outer ring edge
          const x = 50 + 48 * Math.cos(rad);
          const y = 50 + 48 * Math.sin(rad);

          return (
            <motion.div
              key={tech.name}
              animate={{ rotate: -360 }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute group"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative flex items-center justify-center w-11 h-11 xl:w-12 xl:h-12 rounded-xl bg-background border border-glass-border shadow-md hover:shadow-lg hover:scale-110 hover:border-white/20 transition-all duration-300 cursor-default">
                <span className="text-base xl:text-lg" style={{ color: tech.color }}>
                  {tech.icon}
                </span>

                {/* Tooltip */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-[10px] font-semibold text-foreground-muted bg-background-secondary border border-glass-border px-2 py-1 rounded-md whitespace-nowrap shadow-sm">
                    {tech.name}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Inner orbit items — rotating counter-clockwise */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute inset-12 xl:inset-16"
      >
        {INNER_ORBIT.map((tech, index) => {
          const angle = (index / INNER_ORBIT.length) * 360 + 45; // offset 45deg
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 48 * Math.cos(rad);
          const y = 50 + 48 * Math.sin(rad);

          return (
            <motion.div
              key={tech.name}
              animate={{ rotate: 360 }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute group"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative flex items-center justify-center w-10 h-10 xl:w-11 xl:h-11 rounded-xl bg-background border border-glass-border shadow-md hover:shadow-lg hover:scale-110 hover:border-white/20 transition-all duration-300 cursor-default">
                <span className="text-sm xl:text-base" style={{ color: tech.color }}>
                  {tech.icon}
                </span>

                {/* Tooltip */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-[10px] font-semibold text-foreground-muted bg-background-secondary border border-glass-border px-2 py-1 rounded-md whitespace-nowrap shadow-sm">
                    {tech.name}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Decorative particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 1.2,
          }}
          className="absolute w-1.5 h-1.5 rounded-full bg-accent"
          style={{
            left: `${20 + i * 30}%`,
            top: `${15 + i * 25}%`,
          }}
        />
      ))}
    </motion.div>
  );
}
