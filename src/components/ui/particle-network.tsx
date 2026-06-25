"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    const initParticles = () => {
      particles = [];
      // Adjust density based on screen size
      const density = window.innerWidth < 768 ? 15000 : 10000;
      const particleCount = Math.floor((canvas.width * canvas.height) / density);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6, // Slow, elegant speed
          vy: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 1.5 + 0.5, // Tiny dots
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Get computed color of the primary text to blend perfectly with light/dark mode
      const isDark = document.documentElement.classList.contains("dark");
      const dotColor = isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)";
      const lineColorBase = isDark ? "255, 255, 255" : "0, 0, 0"; 
      
      // Add a subtle accent color glow logic
      // Alternatively, we just use a neutral color for elegance

      // Update & Draw Particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges smoothly
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();

        // Draw connecting lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 130) { // Connect if close enough
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lineColorBase}, ${(1 - distance / 130) * 0.2})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    // Handle Resize
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        initParticles();
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    // Initial setup
    resizeCanvas();
    initParticles();
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="absolute inset-0 w-full h-full"
    >
      {/* Subtle glow underneath the particles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-primary),transparent_70%)] opacity-[0.05] blur-3xl" />
      <canvas ref={canvasRef} className="block w-full h-full" />
    </motion.div>
  );
}
