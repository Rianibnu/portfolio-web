"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="relative py-32 overflow-hidden border-t border-glass-border">
      {/* Minimal background */}
      <div className="absolute inset-0 bg-background" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-glass-border bg-background-secondary mb-10">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-xs font-medium tracking-wide uppercase text-foreground-subtle">
              Terbuka untuk kolaborasi
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
            Mari ciptakan sesuatu <br className="hidden md:block" />
            <span className="text-foreground-muted font-light">yang luar biasa.</span>
          </h2>

          <p className="text-foreground-muted text-lg md:text-xl leading-relaxed mb-12 max-w-2xl font-light">
            Baik Anda memiliki proyek spesifik atau sekadar ingin menjajaki kemungkinan, 
            saya selalu terbuka untuk mendiskusikan ide-ide baru.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/contact"
              className="w-full sm:w-auto group inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-semibold hover:scale-105 transition-all duration-300"
            >
              Mulai Diskusi
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="mailto:rianibnurizall@gmail.com"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full border border-glass-border font-medium text-foreground hover:bg-background-secondary transition-colors duration-300"
            >
              <Mail className="w-4 h-4" />
              rianibnurizall@gmail.com
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
