"use client";

import { motion } from "framer-motion";
import SectionWrapper from "@/components/layout/section-wrapper";

const webAndDatabase = [
  "Next.js", "React.js", "TypeScript", "Laravel Framework", "Vue.JS", "PHP", 
  "Prisma ORM", "Supabase", "REST API", "PostgreSQL", "MySQL", "Data Analysis"
];

const supportAndSystems = [
  "Troubleshooting HW/SW", "Jaringan (LAN/WAN)", "Windows/Linux OS", "Server Maintenance",
  "Penyusunan Flowmap", "Pemetaan Proses Bisnis", "QC Testing", "UAT", "Integrasi Sistem Vendor"
];

const digitalMarketing = [
  "Instagram SEO", "Content Planning", "Video Editing (CapCut/Premiere)", "Manajemen Marketplace"
];

export default function SkillsOverview() {
  return (
    <SectionWrapper className="relative border-t border-glass-border bg-background/50">
      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24">
          
          {/* Header Area */}
          <div className="w-full md:w-1/3 space-y-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-bold tracking-tighter"
            >
              Keahlian & <br /> Teknologi
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-foreground-muted leading-relaxed font-light"
            >
              Memadukan kemampuan pengembangan web, IT Support, hingga strategi digital marketing untuk memberikan solusi yang komprehensif.
            </motion.p>
          </div>

          {/* Skills Area */}
          <div className="w-full md:w-2/3 space-y-12">
            
            {/* Web & Database */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-sm uppercase tracking-widest text-foreground-subtle font-semibold mb-6">
                Web Development & Database
              </h3>
              <div className="flex flex-wrap gap-3">
                {webAndDatabase.map((skill, i) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.03 }}
                    whileHover={{ y: -2 }}
                    className="px-5 py-2.5 rounded-full border border-glass-border bg-background text-foreground font-medium text-sm hover:border-foreground transition-colors cursor-default"
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Support & Systems */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-sm uppercase tracking-widest text-foreground-subtle font-semibold mb-6">
                IT Support & Sistem Bisnis
              </h3>
              <div className="flex flex-wrap gap-3">
                {supportAndSystems.map((skill, i) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.03 }}
                    whileHover={{ y: -2 }}
                    className="px-5 py-2.5 rounded-full border border-glass-border bg-background-secondary text-foreground-muted text-sm hover:text-foreground transition-colors cursor-default"
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Digital Marketing */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-sm uppercase tracking-widest text-foreground-subtle font-semibold mb-6">
                Pemasaran Digital & Kreatif
              </h3>
              <div className="flex flex-wrap gap-3">
                {digitalMarketing.map((skill, i) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.03 }}
                    whileHover={{ y: -2 }}
                    className="px-5 py-2.5 rounded-full border border-glass-border bg-background-secondary text-foreground-muted text-sm hover:text-foreground transition-colors cursor-default"
                  >
                    {skill}
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
