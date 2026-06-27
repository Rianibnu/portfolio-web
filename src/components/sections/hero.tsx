"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import ParticleNetwork from "@/components/ui/particle-network";

export default function Hero({ projectCount }: { projectCount?: number }) {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden pt-32 pb-20">
      {/* Minimal Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-30" />

        {/* Subtle, elegant light orb instead of generic blobs */}
        <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,var(--accent-primary),transparent_60%)] rounded-full blur-[160px] opacity-10 translate-x-1/3 -translate-y-1/4" />

        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/80 to-background z-10" />
      </div>

      <div className="container-custom relative z-10 w-full">
        {/* Particle Network Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <ParticleNetwork />
        </div>

        <div className="max-w-5xl relative z-10">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm mb-10"
          >
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="text-xs font-medium tracking-wide uppercase text-foreground-subtle mr-2">
              Full Stack Web Developer &amp; IT Support
            </span>
          </motion.div>

          {/* Main Heading — ORIGINAL size restored */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] font-extrabold tracking-tighter leading-[1.05]"
          >
            <span className="text-foreground">Rian Ibnu </span>
            <span className="text-foreground-muted font-medium">Rizal</span>
            <br />
            <span className="text-foreground-muted font-medium">Founder</span>
            <span className="text-foreground"> RIR Studio.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            data-nosnippet
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-lg md:text-xl text-foreground-muted max-w-2xl leading-relaxed font-light"
          >
            Lulusan S1 Teknik Informatika dengan spesialisasi pengembangan aplikasi sebagai Full-Stack Developer dan manajemen IT Support/Helpdesk. Berpengalaman merancang flowmap bisnis, integrasi sistem, dan operasional jaringan.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col sm:flex-row items-start gap-4"
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-semibold text-sm hover:scale-105 transition-all duration-300"
            >
              Lihat Karya Saya
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-glass-border font-medium text-sm text-foreground hover:bg-white/5 transition-colors duration-300"
            >
              Hubungi Saya
            </Link>
          </motion.div>

          {/* Minimal Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-20 flex items-center gap-8 md:gap-16 border-t border-glass-border pt-8 max-w-3xl"
          >
            {[
              { value: "4+", label: "Tahun Pengalaman" },
              { value: `${projectCount || 15}+`, label: "Proyek Diselesaikan" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
                <span className="text-sm text-foreground-subtle uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
