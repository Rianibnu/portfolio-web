"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const experiences = [
  {
    role: "IT  Support & Full-stack Developer",
    company: "RS Unggul Karsa Medika (Maranatha)",
    period: "2022 — Sekarang",
    description: [
      "Pengembangan Web (Laravel & Vue.js): Membangun modul kustom dan aplikasi internal berbasis Laravel & Vue.js untuk mendigitalisasi kebutuhan departemen yang belum terakomodasi sistem utama.",
      "Manajemen & Optimasi Data: Merancang arsitektur database, menjamin keamanan data pasien, serta menyusun query efisien untuk laporan analitik manajemen.",
      "Infrastruktur & Jaringan: Mengelola jaringan LAN/WAN dan perangkat keras operasional.",
      "IT Support: Memberikan layanan helpdesk yang responsif bagi staf serta melakukan bug fixing berkala."
    ],
    current: true,
  },
  {
    role: "Business Development",
    company: "On Digital",
    period: "2021 — 2022",
    description: [
      "Strategi & Pengembangan Bisnis: Merumuskan strategi bisnis jangka pendek/panjang yang adaptif terhadap tren pasar serta melakukan strategic follow-up ke relasi potensial.",
      "Manajemen Hubungan Klien: Mengelola kebutuhan klien secara komprehensif (end-to-end) dari negosiasi hingga pasca-kerja sama.",
      "Sinergi Lintas Divisi: Memimpin koordinasi lintas divisi dan mengevaluasi jalannya kampanye secara berkala untuk memastikan target KPI tercapai."
    ],
    current: false,
  },
  {
    role: "Content Creator & Admin",
    company: "Dominance Indonesia",
    period: "2021",
    description: [
      "Riset & SEO Instagram: Menganalisis tren pasar dan menerapkan strategi SEO Instagram untuk memperluas jangkauan organik.",
      "Produksi Konten: Memproduksi konten foto dan video kreatif (Reels/TikTok) berkualitas tinggi untuk kebutuhan promosi harian.",
      "Operasional Marketplace: Mengelola toko digital, manajemen stok berkala, serta memberikan layanan pelanggan yang responsif."
    ],
    current: false,
  },
];

export default function ExperienceTimeline() {
  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Vertical Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-glass-border md:-translate-x-px" />

      {experiences.map((exp, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: index * 0.15 }}
          className={cn(
            "relative pl-12 md:pl-0 mb-12 last:mb-0 group",
            "md:flex md:items-start",
            index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          )}
        >
          {/* Timeline Dot */}
          <div
            className={cn(
              "absolute left-[11px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full border-[3px] border-background mt-2 transition-all duration-500 group-hover:scale-125",
              exp.current
                ? "bg-foreground shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                : "bg-glass-border group-hover:bg-foreground-subtle"
            )}
          >
            {exp.current && (
              <span className="absolute inset-0 rounded-full animate-ping bg-foreground opacity-20" />
            )}
          </div>

          {/* Content Card */}
          <div
            className={cn(
              "md:w-[calc(50%-3rem)] bg-background-secondary border border-glass-border rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-foreground/30 hover:shadow-2xl hover:shadow-foreground/5",
              index % 2 === 0 ? "md:mr-auto md:text-right" : "md:ml-auto md:text-left"
            )}
          >
            {/* Period Badge */}
            <div className={cn(
              "flex items-center gap-2 mb-4 uppercase tracking-wider text-[11px] font-semibold",
              index % 2 === 0 ? "md:justify-end" : "md:justify-start"
            )}>
              <span className="text-foreground-subtle">
                {exp.period}
              </span>
              {exp.current && (
                <span className="px-2 py-0.5 bg-foreground text-background rounded-sm animate-pulse">
                  Saat Ini
                </span>
              )}
            </div>

            {/* Role & Company */}
            <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent">
              {exp.role}
            </h3>
            <div className={cn(
              "flex items-center gap-1.5 mt-1 mb-4 text-foreground-muted",
              index % 2 === 0 ? "md:justify-end" : "md:justify-start"
            )}>
              <span className="text-sm font-medium">
                {exp.company}
              </span>
            </div>

            {/* Description */}
            <ul className="text-sm text-foreground-muted leading-relaxed font-light space-y-2.5 mt-4 text-left">
              {exp.description.map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="mt-[8px] w-1.5 h-1.5 rounded-full bg-foreground-subtle/50 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
